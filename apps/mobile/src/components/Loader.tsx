import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function Loader({ label }: { label?: string }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
      }}
    >
      <ActivityIndicator />
      {!!label && (
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
          {label}
        </Text>
      )}
    </View>
  );
}
