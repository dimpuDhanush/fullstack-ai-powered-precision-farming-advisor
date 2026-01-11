import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { AnalysisProvider } from "./src/state/analysisContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AnalysisProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AnalysisProvider>
    </SafeAreaProvider>
  );
}
