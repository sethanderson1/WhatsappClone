import * as React from "react";
import { User } from "../../types";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import styles from "./styles";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createChatRoomUser } from "../../graphql/mutations";

export type ContactListItemProps = {
  user: User;
};

const ContactListItem = (props: ContactListItemProps) => {
  const { user } = props;

  const navigation = useNavigation();

  const onClick = async () => {
    try {
      // create a new chat room
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, {
          input: {
            lastMessageID: "zz4a7a58-16db-42aa-b00f-23d1f8245469"
          },
        })
      );

      // console.log("newChatRoomData", newChatRoomData);

      if (!newChatRoomData.data) {
        console.log("failed to create chat room");
        return;
      }

      const newChatRoom = newChatRoomData.data.createChatRoom;
      // console.log('newChatRoom', newChatRoom)

      // add user to the chat room
      await API.graphql(
        graphqlOperation(createChatRoomUser, {
          input: {
            userID: user.id,
            chatRoomID: newChatRoom.id,
          },
        })
      );

      // add authenticated user to the chat room
      const userInfo = await Auth.currentAuthenticatedUser();
      // console.log("userInfo", userInfo);

      await API.graphql(
        graphqlOperation(createChatRoomUser, {
          input: {
            userID: userInfo.attributes.sub,
            chatRoomID: newChatRoom.id,
          },
        })
      );

      navigation.navigate("ChatRoom", {
        id: newChatRoom.id,
        name: "Hardcoded name",
      });
    } catch (e) {
      console.log("e", e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar} />
          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text numberOfLines={2} style={styles.status}>
              {user.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactListItem;
