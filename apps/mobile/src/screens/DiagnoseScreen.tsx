import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SectionTitle } from "../ui/SectionTitle";
import { analyze } from "../api/client";
import { analysisStore } from "../state/analysisStore";

export default function DiagnoseScreen() {
  const nav = useNavigation<any>();
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [cropType, setCropType] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const canAnalyze = useMemo(() => !!image && !loading, [image, loading]);

  async function pick(fromCamera: boolean) {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted)
      return Alert.alert(
        "Permission needed",
        "Please allow access to continue."
      );

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 1 });

    if (result.canceled) return;

    const asset = result.assets[0];

    // compress -> faster upload, smoother demo
    const manipulated = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 1280 } }],
      { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
    );

    setImage({
      uri: manipulated.uri,
      name: `plant-${Date.now()}.jpg`,
      type: "image/jpeg",
    });
  }

  async function onAnalyze() {
    if (!image) return;
    setLoading(true);

    try {
      const form = new FormData();
      // @ts-ignore
      form.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
      form.append("language", "en");
      if (cropType.trim()) form.append("cropType", cropType.trim());
      if (question.trim()) form.append("question", question.trim());

      const out = await analyze(form);

      analysisStore.setLatest(out);
      nav.navigate("Result", { analysis: out });

      setQuestion("");
    } catch (e: any) {
      Alert.alert(
        "Couldn’t analyze",
        e?.message?.slice(0, 200) || "Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
    >
      <Text style={[theme.type.h1, { color: theme.colors.text }]}>
        AgriCare AI
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
        Take a clear leaf photo. We’ll suggest steps you can do today.
      </Text>

      <View style={{ height: theme.spacing.md }} />

      <Card>
        <SectionTitle
          title="Step 1: Plant photo"
          subtitle="Use daylight and keep the leaf in focus."
        />
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={{
              width: "100%",
              height: 230,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          />
        ) : (
          <View
            style={{
              height: 230,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.colors.muted }}>No photo selected</Text>
          </View>
        )}

        <Button title="Open Camera" onPress={() => pick(true)} />
        <Button
          title="Pick from Gallery"
          onPress={() => pick(false)}
          variant="ghost"
        />
      </Card>

      <View style={{ height: theme.spacing.md }} />

      <Card>
        <SectionTitle title="Step 2: Details" />
        <Text style={{ color: theme.colors.muted }}>Crop type</Text>
        <Input
          value={cropType}
          onChangeText={setCropType}
          placeholder="e.g., tomato, chilli"
        />

        <Text
          style={{ color: theme.colors.muted, marginTop: theme.spacing.sm }}
        >
          Question
        </Text>
        <Input
          value={question}
          onChangeText={setQuestion}
          placeholder="e.g., what should I do now?"
          multiline
          style={{ minHeight: 90, textAlignVertical: "top" }}
        />
      </Card>

      <View style={{ height: theme.spacing.md }} />

      <Card>
        {loading ? (
          <View style={{ alignItems: "center", padding: theme.spacing.md }}>
            <ActivityIndicator />
            <Text style={{ color: theme.colors.muted, marginTop: 10 }}>
              Analyzing…
            </Text>
            <Text
              style={{ color: theme.colors.muted, marginTop: 6, fontSize: 12 }}
            >
              Uploading • Weather • Advice
            </Text>
          </View>
        ) : (
          <Button
            title="Analyze Photo"
            onPress={onAnalyze}
            disabled={!canAnalyze}
          />
        )}
      </Card>
    </ScrollView>
  );
}
