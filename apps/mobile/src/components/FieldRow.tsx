import React from "react";
import { Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function FieldRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.xs,
      }}
    >
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}
