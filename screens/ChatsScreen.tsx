import * as React from "react";
import { FlatList, StyleSheet } from "react-native";
import { View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { onUpdateChatRoom } from "../graphql/subscriptions";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {
    try {
      console.log("fetchChatRooms", new Date());
      const userInfo = await Auth.currentAuthenticatedUser();
      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        })
      );
      const extantChatRooms = userData.data.getUser.chatRoomUser.items.filter(
        (item) => item.chatRoom
      );
      const nonEmptyChatRooms = extantChatRooms.filter(
        (item) => item.chatRoom.lastMessage
      );
      const sortedChatRooms = nonEmptyChatRooms.sort(
        (a, b) =>
          new Date(b.chatRoom.lastMessage.updatedAt) -
          new Date(a.chatRoom.lastMessage.updatedAt)
      );
      if (sortedChatRooms.length) setChatRooms([...sortedChatRooms]);
    } catch (e) {
      console.log("e", e);
    }
  };

  const subscriptionNext = (data) => {
    const updatedMessage = data.value.data.onUpdateChatRoom;
    const lastMessageObj = updatedMessage.lastMessage;
    const mostRecentlyUsedChatRoomID = updatedMessage.id;
    const oldOrderedChatRooms = chatRooms;
    const matchingChatRoom = oldOrderedChatRooms.find(
      (item) => item.chatRoom.id === mostRecentlyUsedChatRoomID
    );

    if (!matchingChatRoom) {
      console.log('matchingChatRoom', matchingChatRoom)
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
    setChatRooms([...properOrderedChatRooms]);
  };

  const subscribe = () => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom)
    ).subscribe({
      next: (data) => {
        subscriptionNext(data);
      },
    });
    return subscription;
  };

  useEffect(() => {
    if (!chatRooms.length) fetchChatRooms();
    console.log("chatRooms length", chatRooms.length);
  }, [chatRooms]);

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
