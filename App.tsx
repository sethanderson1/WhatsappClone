import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { getUser } from "./graphql/queries";
import { createUser } from "./graphql/mutations";

import { withAuthenticator } from "aws-amplify-react-native";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const randomImages = [
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/2.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/4.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/6.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/7.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/8.png",
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/9.png",
];

const getRandomImage = () => {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
};

// export default function App() {
function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchUser = async () => {
      // get authenticated user from Auth
      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      // console.log("userInfo", userInfo);

      if (userInfo) {
        // get the user from Backend with the user sub from Auth
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        // console.log("userData", userData);
        if (userData.data.getUser) {
          // console.log("user is already registered in database");
          return;
        }

        // if there is no user with that id then create one

        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImage(),
          status: "Hey, I am using WhatsApp",
        };

        await API.graphql(graphqlOperation(createUser, { input: newUser }));
      }
    };
    fetchUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
// export default App
