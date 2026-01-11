import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import type { HistoryItem } from "../api/pfa";

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPickerModal({
  visible,
  items,
  selectedId,
  onClose,
  onSelect,
}: {
  visible: boolean;
  items: HistoryItem[];
  selectedId?: string | null;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a diagnosis</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>

          <FlatList
            data={items}
            keyExtractor={(i) => i.analysisId}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
              const active = item.analysisId === selectedId;
              return (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={[styles.row, active && styles.rowActive]}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>
                      {item.mlLabel} {item.severity ? `• ${item.severity}` : ""}
                    </Text>
                    <Text style={styles.rowSub}>
                      {fmtTime(item.createdAt)} •{" "}
                      {(item.mlConfidence * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <Text style={styles.pickTxt}>
                    {active ? "Selected" : "Pick"}
                  </Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={{ padding: 16 }}>
                <Text style={{ color: "#b7c2d0" }}>
                  No history yet. Diagnose a plant first.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0e1623",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    minHeight: "55%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: "white", fontSize: 16, fontWeight: "700" },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  closeTxt: { color: "#d7e1ee", fontWeight: "600" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  rowActive: { borderColor: "rgba(60,220,160,0.6)" },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#111" },
  rowTitle: { color: "white", fontWeight: "700" },
  rowSub: { color: "#b7c2d0", marginTop: 2, fontSize: 12 },
  pickTxt: { color: "#3cdca0", fontWeight: "700" },
});
