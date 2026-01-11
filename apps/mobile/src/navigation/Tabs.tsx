import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Camera, History, MessageCircle } from "lucide-react-native";
import { theme } from "../theme";

import DiagnoseScreen from "../screens/DiagnoseScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ChatScreen from "../screens/ChatScreen";

type TabParamList = {
  Diagnose: undefined;
  History: undefined;
  Chat: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card2,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
      }}
    >
      <Tab.Screen
        name="Diagnose"
        component={DiagnoseScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
