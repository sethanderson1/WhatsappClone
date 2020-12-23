import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
    // borderWidth: 0.5,
    // borderStyle: "solid",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    paddingTop: 3,
    fontSize: 16,
    color: "grey",
    // width: 200,
  },
  leftContainer: {
    flexDirection: "row",
    flexShrink: 1,
  },
  midContainer: {
    justifyContent: "center",
  },
  time: {
    paddingTop: 8,
    fontSize: 16,
    color: "grey",
  },
});

export default styles;
