import * as React from "react";
import { FlatList, StyleSheet } from "react-native";

import { View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";
import chatRooms from "../data/ChatRooms";
import NewMessageButton from "../components/NewMessageButton";
import { useEffect, useState } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";

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
          
          setChatRooms(userData.data.getUser.chatRoomUser.items)
          
          // console.log('chatRooms', chatRooms)
        // console.log("userData", userData);

      } catch (e) {
        console.log("e", e);
      }
    };

    fetchChatRooms();
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
