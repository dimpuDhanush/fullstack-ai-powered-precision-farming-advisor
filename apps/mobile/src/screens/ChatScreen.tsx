import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { askExpert, fetchHistory, type HistoryItem } from "../api/pfa";
import HistoryPickerModal from "../components/HistoryPickerModal";

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchHistory(50);
        setHistory(items);
        if (items.length > 0) setSelected(items[0]); // newest first from backend
      } catch (e: any) {
        setErr(e?.message ?? String(e));
      }
    })();
  }, []);

  const header = useMemo(() => {
    if (!selected) return null;
    return (
      <View style={styles.contextCard}>
        <Image source={{ uri: selected.imageUrl }} style={styles.preview} />
        <View style={{ flex: 1 }}>
          <Text style={styles.contextTitle}>
            {selected.mlLabel}{" "}
            {selected.severity ? `• ${selected.severity}` : ""}
          </Text>
          <Text style={styles.contextSub}>
            {fmtTime(selected.createdAt)} •{" "}
            {(selected.mlConfidence * 100).toFixed(0)}%
          </Text>
        </View>

        <Pressable style={styles.changeBtn} onPress={() => setPickerOpen(true)}>
          <Text style={styles.changeTxt}>Change</Text>
        </Pressable>
      </View>
    );
  }, [selected]);

  async function onAsk() {
    setErr(null);
    setReply(null);

    if (!selected) {
      setErr("Please diagnose a plant first (no history found).");
      return;
    }
    if (!question.trim()) {
      setErr("Type your question.");
      return;
    }

    setLoading(true);
    try {
      const res = await askExpert({
        analysisId: selected.analysisId,
        question: question.trim(),
        language: "en",
      });
      setReply(res.reply);
      setQuestion("");
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Ask an Expert</Text>
        <Text style={styles.h2}>
          Follow-up questions based on your diagnosis.
        </Text>

        {header}

        {!selected && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTxt}>No diagnosis selected.</Text>
            <Pressable
              style={styles.changeBtnWide}
              onPress={() => setPickerOpen(true)}
            >
              <Text style={styles.changeTxt}>Select from history</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>Your question</Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="e.g., Can I spray today?"
            placeholderTextColor="#7f8ea3"
            style={styles.input}
            multiline
          />

          {!!err && <Text style={styles.err}>{err}</Text>}

          <Pressable
            style={[styles.askBtn, loading && { opacity: 0.7 }]}
            onPress={onAsk}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.askTxt}>Ask</Text>
            )}
          </Pressable>
        </View>

        {!!reply && (
          <View style={styles.replyCard}>
            <Text style={styles.replyTitle}>Answer</Text>
            <Text style={styles.replyText}>{reply.answer ?? reply}</Text>

            {Array.isArray(reply.actionBullets) &&
              reply.actionBullets.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.replyTitle}>Do this</Text>
                  {reply.actionBullets.map((x: string, idx: number) => (
                    <Text key={idx} style={styles.bullet}>
                      • {x}
                    </Text>
                  ))}
                </View>
              )}

            {Array.isArray(reply.suggestedQuestions) &&
              reply.suggestedQuestions.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.replyTitle}>Suggested questions</Text>
                  {reply.suggestedQuestions.map((x: string, idx: number) => (
                    <Text key={idx} style={styles.suggest}>
                      • {x}
                    </Text>
                  ))}
                </View>
              )}
          </View>
        )}
      </ScrollView>

      <HistoryPickerModal
        visible={pickerOpen}
        items={history}
        selectedId={selected?.analysisId ?? null}
        onClose={() => setPickerOpen(false)}
        onSelect={(item) => {
          setSelected(item);
          setPickerOpen(false);
          setReply(null); // optional: clear previous answer when context changes
          setErr(null);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0b1220" },
  container: { padding: 16, paddingBottom: 40 },

  h1: { color: "white", fontSize: 26, fontWeight: "800" },
  h2: { color: "#9fb0c6", marginTop: 6, marginBottom: 16 },

  contextCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  preview: { width: 64, height: 64, borderRadius: 14, backgroundColor: "#111" },
  contextTitle: { color: "white", fontWeight: "800", fontSize: 16 },
  contextSub: { color: "#b7c2d0", marginTop: 2, fontSize: 12 },

  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(60,220,160,0.16)",
  },
  changeTxt: { color: "#3cdca0", fontWeight: "800" },

  emptyBox: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  emptyTxt: { color: "#d7e1ee", marginBottom: 10 },
  changeBtnWide: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(60,220,160,0.16)",
    alignItems: "center",
  },

  card: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  label: { color: "#d7e1ee", fontWeight: "700", marginBottom: 8 },
  input: {
    minHeight: 90,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  err: { color: "#ff6b6b", marginTop: 10 },

  askBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#3cdca0",
    alignItems: "center",
  },
  askTxt: { color: "#061018", fontWeight: "900", fontSize: 16 },

  replyCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  replyTitle: { color: "white", fontWeight: "800", marginBottom: 6 },
  replyText: { color: "#d7e1ee", lineHeight: 20 },
  bullet: { color: "#d7e1ee", marginTop: 6 },
  suggest: { color: "#b7c2d0", marginTop: 6 },
});
