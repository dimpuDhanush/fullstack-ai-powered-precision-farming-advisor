import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "../theme";

export default function AppButton({
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
  const content = (
    <View
      style={{
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: variant === "ghost" ? 1 : 0,
        borderColor: colors.border,
        backgroundColor: variant === "ghost" ? "transparent" : "transparent",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}>
        {title}
      </Text>
    </View>
  );

  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ width: "100%" }}>
      {variant === "primary" ? (
        <LinearGradient
          colors={[colors.primary2, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16 }}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={{ marginTop: spacing.sm }}>{content}</View>
      )}
    </Pressable>
  );
}
