import { API_URL } from "../config";

export async function analyze(form: FormData) {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function history(limit = 30) {
  const res = await fetch(`${API_URL}/api/history?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export async function getAnalysisById(id: string) {
  const res = await fetch(`${API_URL}/api/analysis/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Analysis not found");
  return res.json();
}

export async function ask(payload: {
  analysisId: string;
  question: string;
  language?: string;
}) {
  const res = await fetch(`${API_URL}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
