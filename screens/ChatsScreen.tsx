import * as React from "react";
import { FlatList, StyleSheet } from "react-native";

import { View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";
import chatRooms from "../data/ChatRooms";
import NewMessageButton from "../components/NewMessageButton";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";
import { onCreateChatRoom } from "../graphql/subscriptions";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([])
  
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        
        const userData = await API.graphql(
          graphqlOperation(getUser, {
            id: userInfo.attributes.sub,
          })
          );

          const chatRoomUserItems = userData.data.getUser.chatRoomUser.items.filter(item=> item.chatRoom)
          const nonEmptyChatRooms = chatRoomUserItems.filter(item=>item.chatRoom.lastMessage)
          console.log('nonEmptyChatRooms', nonEmptyChatRooms)

          setChatRooms(nonEmptyChatRooms)
          
          // console.log('chatRooms', chatRooms)
        // console.log("userData", userData);

      } catch (e) {
        console.log("e", e);
      }
    };

    fetchChatRooms();
  }, []);


  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onCreateChatRoom)
  //     ).subscribe({
  //       next: (data) => {
  //         // console.log('data.value.data', data.value.data)
  //       const newChatRoom = data.value.data.onCreateChatRoom;

  //       // if (newChatRoom.chatRoomID !== route.params.id) {
  //       //   return;
  //       // }
  //       setMessages(prevMessages => [newChatRoom, ...prevMessages]);
  //       // console.log(data.value.data)
  //       // console.log('messages', messages)
  //     },
  //   });
    
  //   return () => subscription.unsubscribe();
  // }, []);



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
