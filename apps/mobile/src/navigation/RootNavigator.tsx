import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ResultScreen from "../screens/ResultScreen";
import { theme } from "../theme";

export type RootStackParamList = {
  Tabs: undefined;
  Result: { analysis?: any; analysisId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bg },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: "Diagnosis" }}
      />
    </Stack.Navigator>
  );
}
