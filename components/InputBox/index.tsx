import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
} from "react-native";
import { Message } from "../../types";
import styles from "./styles";
import moment from "moment";
import {
  Entypo,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export type InputBoxProps = {
  message: Message;
};

const InputBox = () => {
  const [message, setMessage] = useState("");

  const onMicrophonePress = () => {
    console.warn('Microphone')
  }

  const onSendPress = () => {
    console.warn(`sending: ${message}`)

    // set the message to the backend
    
    setMessage('');
  }

  const onPress = () => {
    if (!message) {
      onMicrophonePress()
    } else {
      onSendPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FontAwesome5 name="laugh-beam" size={24} color="grey" />
        <TextInput
          multiline
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <Entypo name="attachment" size={24} color="grey" style={styles.icon} />
        {!message && (
          <Fontisto name="camera" size={24} color="grey" style={styles.icon} />
        )}
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
          {!message ? (
            <MaterialCommunityIcons name="microphone" size={28} color="white" />
          ) : (
            <MaterialCommunityIcons name="send" size={26} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InputBox;
