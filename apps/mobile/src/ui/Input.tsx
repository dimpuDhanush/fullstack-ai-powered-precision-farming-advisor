import React from "react";
import { TextInput } from "react-native";
import { theme } from "../theme";

export function Input(props: any) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.muted}
      style={{
        marginTop: theme.spacing.xs,
        backgroundColor: theme.colors.card2,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        padding: 12,
        color: theme.colors.text,
      }}
      {...props}
    />
  );
}
