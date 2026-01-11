import React from "react";
import { Pressable, Text, View } from "react-native";
import { theme } from "../theme";

export function Button({
  title,
  onPress,
  disabled,
  variant = "primary",
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        width: "100%",
        marginTop: theme.spacing.sm,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View
        style={{
          paddingVertical: 14,
          borderRadius: theme.radius.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            variant === "primary" ? theme.colors.primary : "transparent",
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: theme.colors.border,
        }}
      >
        <Text
          style={{
            color: variant === "primary" ? theme.colors.bg : theme.colors.text,
            fontWeight: "900",
            fontSize: 15,
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
