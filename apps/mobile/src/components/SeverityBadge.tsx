import React from "react";
import { Text, View } from "react-native";
import { colors } from "../theme";

export default function SeverityBadge({ value }: { value: string }) {
  const v = (value || "").toLowerCase();
  const bg = v.includes("high")
    ? colors.danger
    : v.includes("medium")
    ? colors.warn
    : v.includes("low")
    ? colors.ok
    : colors.border;

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: colors.bg, fontWeight: "900", fontSize: 12 }}>
        {value}
      </Text>
    </View>
  );
}
