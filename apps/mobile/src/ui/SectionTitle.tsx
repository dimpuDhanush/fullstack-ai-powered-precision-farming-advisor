import React from "react";
import { Text, View } from "react-native";
import { theme } from "../theme";

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: theme.spacing.sm }}>
      <Text style={[theme.type.h2, { color: theme.colors.text }]}>{title}</Text>
      {!!subtitle && (
        <Text style={{ color: theme.colors.muted, marginTop: 4 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
