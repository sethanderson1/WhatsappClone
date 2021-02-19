import * as React from "react";
import { FlatList, StyleSheet } from "react-native";

import { View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";
import chatRooms from "../data/ChatRooms";
import NewMessageButton from "../components/NewMessageButton";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import {
  onCreateChatRoom,
  onCreateMessage,
  onUpdateChatRoom,
} from "../graphql/subscriptions";
import { updateMessage } from "../graphql/mutations";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        })
      );

      const chatRoomUserItems = userData.data.getUser.chatRoomUser.items.filter(
        (item) => item.chatRoom
      );
      const nonEmptyChatRooms = chatRoomUserItems.filter(
        (item) => item.chatRoom.lastMessage
      );
      // console.log("nonEmptyChatRooms", nonEmptyChatRooms[0].chatRoom.lastMessage.updatedAt);
      const sortedChatRooms = nonEmptyChatRooms.sort(
        (a, b) =>
          new Date(b.chatRoom.lastMessage.updatedAt) -
          new Date(a.chatRoom.lastMessage.updatedAt)
      );
      // console.log('sortedChatRooms', sortedChatRooms)

      setChatRooms(nonEmptyChatRooms);

      // console.log('chatRooms', chatRooms)
      // console.log("userData", userData);
    } catch (e) {
      console.log("e", e);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const subscribe = () => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom)
    ).subscribe({
      next: (data) => {
        const updatedMessage = data.value.data.onUpdateChatRoom;
        const lastMessageObj = updatedMessage.lastMessage;
        const mostRecentlyUsedChatRoomID = updatedMessage.id;
        const oldOrderedChatRooms = [...chatRooms];
        const matchingChatRoom = oldOrderedChatRooms.find(
          (item) => item.chatRoom.id === mostRecentlyUsedChatRoomID
        );

        // console.log("matchingChatRoom", matchingChatRoom);
        if (!matchingChatRoom) {
          fetchChatRooms();
          return;
        }

        matchingChatRoom.chatRoom.lastMessage = lastMessageObj;
        const chatRoomsMinusMatchingRoom = oldOrderedChatRooms.filter(
          (item) => item.chatRoom.id !== mostRecentlyUsedChatRoomID
        );

        const properOrderedChatRooms = [
          matchingChatRoom,
          ...chatRoomsMinusMatchingRoom,
        ];

        setChatRooms(properOrderedChatRooms);

        // TODO: if lastmessage is part of a chat wwhere that is the only message, refetch chatrooms
        // or ... if lastmessage is part of a chat that does not exxist in properOrderedChatRooms, refetch chatrooms

        console.log("route.params.id", route.params.id);

        // console.log(data.value.data)
      },
    });
    return subscribe;
  };

  useEffect(() => {
    const subscription = subscribe();

    

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
      />
      {/* <ChatListItem chatRoom={chatRooms[0]} /> */}
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
