import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName, View, Text } from "react-native";
import Colors from "../constants/Colors";
import {
  Octicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import NotFoundScreen from "../screens/NotFoundScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";
import { RootStackParamList } from "../types";
import MainTabNavigator from "./MainTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import styled from "styled-components/native";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        headerStyle: {
          backgroundColor: Colors.light.tint,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTintColor: Colors.light.background,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Root"
        component={MainTabNavigator}
        options={{
          title: "WhatsApp",
          headerRight: () => (
            <HeaderRightIcons>
              <Octicons name="search" size={22} color="white" />
              <MaterialCommunityIcons
                name="dots-vertical"
                size={22}
                color="white"
              />
            </HeaderRightIcons>
          ),
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerRight: () => (
            <HeaderRightIcons style={{ width: 100 }}>
              <MaterialIcons name="call" size={22} color={"white"} />
              <FontAwesome5 name="video" size={22} color={"white"} />
              <MaterialCommunityIcons
                name="dots-vertical"
                size={22}
                color={"white"}
              />
            </HeaderRightIcons>
          ),
        })}
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

const HeaderRightIcons = styled.View`
  flex-direction: row;
  width: 60px;
  justify-content: space-between;
  margin-right: 10px;
  background-color: ${Colors.light.tint};
`;
