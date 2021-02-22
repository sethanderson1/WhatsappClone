import React from "react";
import { Text, View } from "react-native";
import { Message } from "../../types";
import styles from "./styles";
import moment from "moment";

export type ChatMessageProps = {
  message: Message;
  myID: String;
};

const ChatMessage = (props: ChatMessageProps) => {
  const { message, myID } = props;
  
  const isMyMessage = () => {

    return message.user.id === myID;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage() ? "#dcf8c5" : "white",
            marginLeft: isMyMessage() ? 50 : 0,
            marginRight: isMyMessage() ? 0 : 50,
          },
        ]}
      >
          {!isMyMessage() && <Text style={styles.name}>{message.user.name}</Text>}
        <Text style={styles.message}>{message.content}</Text>

        <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text>
      </View>
    </View>
  );
};

export default ChatMessage;
