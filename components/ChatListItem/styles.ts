import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius:50,
    marginRight: 10,
  },
  username: {
      fontWeight:'bold',
      fontSize: 16,
  },
  lastMessage: {
    fontSize: 16,
    color: 'grey',
},
time: {
    paddingTop:10,
    fontSize: 16,
    color: 'grey',
  },
  container: {
    flexDirection: "row",
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftContainer: {
    flexDirection: "row",
  },
  midContainer: {
      justifyContent: 'center',
  },
});

export default styles;
