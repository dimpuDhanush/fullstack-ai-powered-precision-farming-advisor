import React from "react";
import { Text, View } from "react-native";
import { theme } from "../theme";

export function SeverityPill({ value }: { value: string }) {
  const v = (value || "").toLowerCase();
  const bg = v.includes("high")
    ? theme.colors.danger
    : v.includes("medium")
    ? theme.colors.warn
    : v.includes("low")
    ? theme.colors.ok
    : theme.colors.border;

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: theme.radius.pill,
      }}
    >
      <Text style={{ color: theme.colors.bg, fontWeight: "900", fontSize: 12 }}>
        {value}
      </Text>
    </View>
  );
}
