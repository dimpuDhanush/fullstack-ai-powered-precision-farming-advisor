import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";
import { Card } from "../ui/Card";
import { SeverityPill } from "../ui/SeverityPill";
import { history } from "../api/client";
import { useNavigation } from "@react-navigation/native";

export default function HistoryScreen() {
  const nav = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    setLoading(true);
    try {
      const out = await history(30);
      setItems(out.items ?? []);
    } catch (e: any) {
      Alert.alert("Failed", e?.message ?? "Could not load history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <Text style={[theme.type.h1, { color: theme.colors.text }]}>History</Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
        Tap any report to open.
      </Text>

      <View style={{ height: theme.spacing.md }} />

      {loading ? (
        <View style={{ alignItems: "center", padding: theme.spacing.lg }}>
          <ActivityIndicator />
          <Text style={{ color: theme.colors.muted, marginTop: 10 }}>
            Loading…
          </Text>
        </View>
      ) : items.length === 0 ? (
        <Card>
          <Text style={{ color: theme.colors.muted }}>No history yet.</Text>
        </Card>
      ) : (
        items.map((it) => (
          <Pressable
            key={it.analysisId}
            onPress={() =>
              nav.navigate("Result", { analysisId: it.analysisId })
            }
            style={{ marginBottom: theme.spacing.sm }}
          >
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontWeight: "900",
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {it.mlLabel} • {Math.round((it.mlConfidence ?? 0) * 100)}%
                </Text>
                <SeverityPill value={it.severity ?? "—"} />
              </View>
              <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
                {new Date(it.createdAt).toLocaleString()}
              </Text>
              <Text style={{ color: theme.colors.muted, marginTop: 4 }}>
                Crop: {it.cropType ?? "Not provided"}
              </Text>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
