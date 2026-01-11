import { API_URL } from "../config";

export type HistoryItem = {
  analysisId: string;
  createdAt: string;
  cropType?: string | null;
  imageUrl: string;
  mlLabel: string;
  mlConfidence: number;
  severity?: string | null;
};

// If API_URL already ends with /api, keep it. Otherwise add /api.
const BASE = API_URL.replace(/\/+$/, "");
const API_BASE = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || `HTTP ${res.status}`);
  }
}

export async function fetchHistory(limit = 50): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`);
  if (!res.ok) throw new Error(await res.text());
  const data = await safeJson(res);
  return data.items ?? [];
}

export async function askExpert(params: {
  analysisId: string;
  question: string;
  language?: string;
}): Promise<{ analysisId: string; reply: any }> {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      analysisId: params.analysisId,
      question: params.question,
      language: params.language ?? "en",
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  return safeJson(res);
}
