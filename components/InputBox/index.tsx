import React from "react";
import { Text, View, TextInput } from "react-native";
import { Message } from "../../types";
import styles from "./styles";
import moment from "moment";
import { Entypo, FontAwesome5, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";

export type InputBoxProps = {
  message: Message;
};

const InputBox = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FontAwesome5 name="laugh-beam" size={24} color="grey" />
        <TextInput style={styles.textInput}/>
        <Entypo name="attachment" size={24} color="grey" />
        <Fontisto name="camera" size={24} color="grey" />
      </View>
      <View style={styles.buttonContainer}>
        <MaterialCommunityIcons name="microphone" size={28} color="white" />
      </View>
    </View>
  );
};

export default InputBox;
