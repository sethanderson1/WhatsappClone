import * as React from "react";
import { FlatList, StyleSheet } from "react-native";

import { View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";
import chatRooms from "../data/ChatRooms";
import NewMessageButton from "../components/NewMessageButton";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { onCreateChatRoom, onCreateMessage, onUpdateChatRoom } from "../graphql/subscriptions";
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
      const sortedChatRooms = nonEmptyChatRooms.sort((a,b) =>new Date(b.chatRoom.lastMessage.updatedAt) - new Date(a.chatRoom.lastMessage.updatedAt) )
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

  useEffect(() => {
    console.log("useEffect");
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom)
    ).subscribe({
      next: (data) => {
        // console.log("data.value.data", data.value.data);
        // console.log("reached data section of subscription of onUpdateChatRoom");
        const updatedMessage = data.value.data.onUpdateChatRoom;
        // console.log("updatedMessage", updatedMessage);
const lastMessageObj = updatedMessage.lastMessage
console.log('lastMessageObj', lastMessageObj)
        const lastMessage = updatedMessage.lastMessage.content
        console.log('lastMessage', lastMessage)

        const lastMessageAuthor = updatedMessage.lastMessage.user.name
        console.log('lastMessageAuthor', lastMessageAuthor)
        
        const mostRecentlyUsedChatRoomID = updatedMessage.id
        console.log('mostRecentlyUsedChatRoomID', mostRecentlyUsedChatRoomID)

        

        const oldOrderedChatRooms = [...chatRooms]
        // console.log('oldOrderedChatRooms', oldOrderedChatRooms)
        const matchingChatRoom = oldOrderedChatRooms.find(item=>item.chatRoom.id === mostRecentlyUsedChatRoomID)
        
        matchingChatRoom.chatRoom.lastMessage = lastMessageObj
        
        console.log('matchingChatRoom.chatRoom.lastMessage', matchingChatRoom.chatRoom.lastMessage)
        
        console.log('matchingChatRoom', matchingChatRoom)
        const chatRoomsMinusMatchingRoom = oldOrderedChatRooms.filter(item=>item.chatRoom.id !== mostRecentlyUsedChatRoomID)

        const properOrderedChatRooms = [matchingChatRoom, ...chatRoomsMinusMatchingRoom]
        
        

        
        setChatRooms(properOrderedChatRooms);





        // if (newMessage.chatRoomID !== route.params.id) {
        //   return;
        // }
        // setChatRooms((prevChatRooms) => [newChatRoom, ...prevChatRooms]);
        // console.log(data.value.data)
      },
    });

  // useEffect(() => {
  //   console.log("useEffect");
  //   const subscription = API.graphql(
  //     graphqlOperation(onCreateMessage)
  //   ).subscribe({
  //     next: (data) => {
  //       // console.log("data.value.data", data.value.data);
  //       console.log("reached data section of subscription of onCreateMessage");
  //       const newMessage = data.value.data.onCreateMessage;
  //       // console.log("newMessage", newMessage);

  //       const mostRecentlyUsedChatRoomID = newMessage.chatRoom.id
  //       console.log('mostRecentlyUsedChatRoomID', mostRecentlyUsedChatRoomID)

  //       const oldOrderedChatRooms = [...chatRooms]
  //       // console.log('oldOrderedChatRooms', oldOrderedChatRooms)
  //       const matchingChatRoom = oldOrderedChatRooms.find(item=>item.chatRoom.id === mostRecentlyUsedChatRoomID)
  //       console.log('matchingChatRoom', matchingChatRoom)

  //       const chatRoomsMinusMatchingRoom = oldOrderedChatRooms.filter(item=>item.chatRoom.id !== mostRecentlyUsedChatRoomID)

  //       const properOrderedChatRooms = [matchingChatRoom, ...chatRoomsMinusMatchingRoom]
        
  //       setChatRooms(properOrderedChatRooms);
  //       // if (newMessage.chatRoomID !== route.params.id) {
  //       //   return;
  //       // }
  //       // setChatRooms((prevChatRooms) => [newChatRoom, ...prevChatRooms]);
  //       // console.log(data.value.data)
  //     },
  //   });

    // useEffect(() => {
    //   console.log('useEffect')
    //   const subscription = API.graphql(
    //     graphqlOperation(onCreateChatRoom)
    //   ).subscribe({
    //     next: (data) => {
    //       console.log('data.value.data', data.value.data)
    //       console.log('reached data section of subscription of onCreateChatRoom')
    //       const newChatRoom = data.value.data.onCreateChatRoom;
    //       console.log("newChatRoom", newChatRoom);

    //       // if (newChatRoom.chatRoomID !== route.params.id) {
    //       //   return;
    //       // }
    //       setChatRooms((prevChatRooms) => [newChatRoom, ...prevChatRooms]);
    //       // console.log(data.value.data)
    //     },
    //   });

    return () => subscription.unsubscribe();
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
