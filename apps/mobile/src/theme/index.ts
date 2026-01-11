export * from "./colors";
export * from "./spacing";
export * from "./typography";

export const theme = {
  colors: {
    bg: "#0B0F14",
    card: "#111824",
    card2: "#0F1622",
    border: "#1F2A3A",
    text: "#EAF0FF",
    muted: "#A9B4C7",
    primary: "#34D399",
    primary2: "#6EE7B7",
    danger: "#F87171",
    warn: "#FBBF24",
    ok: "#60A5FA",
  },
  radius: {
    md: 16,
    lg: 18,
    xl: 22,
    pill: 999,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },
  type: {
    h1: { fontSize: 22, fontWeight: "900" as const },
    h2: { fontSize: 18, fontWeight: "900" as const },
    body: { fontSize: 15, fontWeight: "600" as const },
    small: { fontSize: 13, fontWeight: "600" as const },
  },
};
