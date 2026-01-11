import React from "react";
import { View, ViewStyle } from "react-native";
import { theme } from "../theme";

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
