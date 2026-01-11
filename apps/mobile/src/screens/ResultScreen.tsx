import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { theme } from "../theme";
import { Card } from "../ui/Card";
import { SeverityPill } from "../ui/SeverityPill";
import { getAnalysisById } from "../api/client";

export default function ResultScreen() {
  const route = useRoute<any>();
  const [analysis, setAnalysis] = useState<any>(
    route?.params?.analysis ?? null
  );
  const [loading, setLoading] = useState(
    !analysis && !!route?.params?.analysisId
  );

  useEffect(() => {
    (async () => {
      if (!analysis && route?.params?.analysisId) {
        setLoading(true);
        const out = await getAnalysisById(route.params.analysisId);
        setAnalysis(out);
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !analysis) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
        <Text style={{ color: theme.colors.muted, marginTop: 10 }}>
          Loading report…
        </Text>
      </View>
    );
  }

  const issue = analysis?.advice?.detectedIssue ?? "Unknown issue";
  const severity = analysis?.advice?.severity ?? "—";
  const steps: string[] = analysis?.advice?.steps ?? [];
  const warnings: string[] = analysis?.advice?.warnings ?? [];
  const conf = Math.round((analysis?.ml?.confidence ?? 0) * 100);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <Text style={[theme.type.h1, { color: theme.colors.text }]}>
        Diagnosis
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
        crop report
      </Text>

      <View style={{ height: theme.spacing.md }} />

      <Card>
        <Image
          source={{ uri: analysis.imageUrl }}
          style={{
            width: "100%",
            height: 240,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        />
        <View style={{ height: theme.spacing.sm }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text
            style={[theme.type.h2, { color: theme.colors.text, flex: 1 }]}
            numberOfLines={2}
          >
            {issue}
          </Text>
          <SeverityPill value={severity} />
        </View>

        <Text style={{ color: theme.colors.muted, marginTop: 10 }}>
          Confidence:{" "}
          <Text style={{ color: theme.colors.text, fontWeight: "900" }}>
            {conf}%
          </Text>
        </Text>

        {!!analysis?.advice?.explanation && (
          <Text style={{ color: theme.colors.muted, marginTop: 10 }}>
            {analysis.advice.explanation}
          </Text>
        )}
      </Card>

      <View style={{ height: theme.spacing.md }} />

      <Card>
        <Text style={[theme.type.h2, { color: theme.colors.text }]}>
          Do this now
        </Text>
        <View style={{ height: theme.spacing.sm }} />
        {steps.slice(0, 5).map((s, idx) => (
          <View key={idx} style={{ flexDirection: "row", marginBottom: 10 }}>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "900",
                width: 22,
              }}
            >
              {idx + 1}.
            </Text>
            <Text style={{ color: theme.colors.text, flex: 1 }}>{s}</Text>
          </View>
        ))}
      </Card>

      {!!warnings.length && (
        <>
          <View style={{ height: theme.spacing.md }} />
          <Card style={{ borderColor: theme.colors.warn }}>
            <Text style={[theme.type.h2, { color: theme.colors.text }]}>
              Warnings
            </Text>
            <View style={{ height: theme.spacing.sm }} />
            {warnings.map((w, idx) => (
              <Text
                key={idx}
                style={{ color: theme.colors.text, marginBottom: 8 }}
              >
                • {w}
              </Text>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}
