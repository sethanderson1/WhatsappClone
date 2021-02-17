import React, { useEffect, useState } from "react";
import { Text, FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import BG from "../assets/images/BG.png";
import InputBox from "../components/InputBox";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { messagesByChatRoom } from "../graphql/queries";
import { onCreateMessage } from "../graphql/subscriptions";

const ChatRoomScreen = () => {
  const [messages, setMessages] = useState([]);
  const [myID, setMyID] = useState(null);
  const route = useRoute();
  // console.log('route', route)
  // console.log("route.params", route.params);
  
  useEffect(() => {
    const fetchMessages = async () => {
      const messagesData = await API.graphql(
        graphqlOperation(messagesByChatRoom, {
          chatRoomID: route.params.id,
          sortDirection: "DESC",
        })
        );
        
        setMessages(messagesData.data.messagesByChatRoom.items);
      };
    fetchMessages();
  }, []);
  
  useEffect(() => {
    const getMyID = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyID(userInfo.attributes.sub);
    };
    getMyID();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
      ).subscribe({
        next: (data) => {
          // console.log('data.value.data', data.value.data)
        const newMessage = data.value.data.onCreateMessage;
        // console.log('newMessage', newMessage)
        // console.log('newMessage.chatRoomID', newMessage.chatRoomID)
        // console.log('route.params.id', route.params.id)
        if (newMessage.chatRoomID !== route.params.id) {
          return;
        }
        setMessages(prevMessages => [newMessage, ...prevMessages]);
        // console.log(data.value.data)
        // console.log('messages', messages)
      },
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <ImageBackground
      style={{
        width: "100%",
        height: "100%",
      }}
      source={BG}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage myID={myID} message={item} />}
        //   keyExtractor={(item) => item.id}
        //   style={{ width: "100%" }}
        inverted
      />
      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
