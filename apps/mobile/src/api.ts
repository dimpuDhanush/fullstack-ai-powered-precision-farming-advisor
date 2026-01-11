// apps/mobile/src/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.100:8080"; // <-- keep your IP/port here

// Helper to handle errors nicely
async function handleJson(res: Response) {
  const text = await res.text();
  if (!res.ok) {
    // try to parse JSON error
    try {
      const json = JSON.parse(text);
      throw new Error(
        json.error
          ? `${json.error}: ${json.details ?? ""}`
          : text || `HTTP ${res.status}`
      );
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }
  return text ? JSON.parse(text) : {};
}

// ---------- ANALYZE ----------

export async function analyze(
  uri: string,
  cropType: string | null,
  question: string | null,
  location?: { lat: number; lng: number } | null
) {
  const form = new FormData();

  form.append("image", {
    // @ts-ignore – React Native File type
    uri,
    name: "photo.jpg",
    type: "image/jpeg",
  });

  if (cropType) form.append("cropType", cropType);
  if (question) form.append("question", question);
  if (location?.lat != null && location?.lng != null) {
    form.append("lat", String(location.lat));
    form.append("lng", String(location.lng));
  }
  form.append("language", "en");

  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: form,
  });

  return handleJson(res);
}

// ---------- HISTORY ----------

export async function history(limit: number = 20) {
  const res = await fetch(`${API_URL}/api/history?limit=${limit}`, {
    method: "GET",
  });
  return handleJson(res);
}

// ---------- CHAT / ASK ----------

export async function ask(
  analysisId: string,
  question: string,
  language: string = "en"
) {
  const res = await fetch(`${API_URL}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ analysisId, question, language }),
  });

  return handleJson(res);
}
