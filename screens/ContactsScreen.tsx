import * as React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { View } from "../components/Themed";
import ContactListItem from "../components/ContactListItem";
import chatRooms from "../data/ChatRooms";
import NewMessageButton from "../components/NewMessageButton";
// import users from "../data/Users";
import { graphqlOperation, API } from "aws-amplify";
import { listUsers } from "../graphql/queries";

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await API.graphql(graphqlOperation(listUsers));
        const res = usersData.data.listUsers.items;
        setUsers(res);
      } catch (e) {
        console.log("e", e);
      }
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <ContactListItem user={item} />}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
      />
      {/* <NewMessageButton /> */}
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
