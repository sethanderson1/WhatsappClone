import React, { useEffect, useState } from "react";
import { Text, FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import ChatMessage from "../components/ChatMessage";
import BG from "../assets/images/BG.png";
import InputBox from "../components/InputBox";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { messagesByChatRoom } from "../graphql/queries";

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
