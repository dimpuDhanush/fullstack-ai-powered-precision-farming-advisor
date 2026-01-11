import React from "react";
import { View, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";

export default function Card({
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
          backgroundColor: colors.card,
          borderRadius: 18,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
