import React from "react";
import { Text, FlatList, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import chatRoomData from "../data/Chats";
import ChatMessage from "../components/ChatMessage";
import BG from "../assets/images/BG.png";
import InputBox from "../components/InputBox";

const ChatRoomScreen = () => {
  const route = useRoute();
  // console.log('route', route)
    // console.log("route.params", route.params);

  return (
    <ImageBackground style={{
        width: '100%',
        height: '100%',
    }} source={BG}>
      <FlatList
        data={chatRoomData.messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        //   keyExtractor={(item) => item.id}
        //   style={{ width: "100%" }}
          inverted
      />
      <InputBox chatRoomID={route.params.id}/>
    </ImageBackground>
  );
};

export default ChatRoomScreen;
