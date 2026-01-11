export type MlTop = { label: string; confidence: number };

export type MlPredictResponse = {
  label: string;
  confidence: number;
  top3?: MlTop[];
};

export type WeatherSummary = {
  temp_c: number | null;
  humidity_pct: number | null;
  wind_kph: number | null;
  rain_next_24h_mm: number | null;
  rain_next_48h_mm: number | null;
  raw?: any;
};

export type AdviceResponse = {
  detectedIssue: string;
  severity: "Low" | "Medium" | "High";
  confidenceText: string;
  steps: string[];
  warnings: string[];
  explanation: string;
  followUpQuestions?: string[];
};

export type ChatResponse = {
  answer: string;
  bullets?: string[];
  followUp?: string;
};

export type AnalyzeResponse = {
  analysisId: string;
  imageUrl: string;
  cropType: string | null;
  language: string;
  location: { lat: number | null; lng: number | null };
  ml: MlPredictResponse;
  weather: WeatherSummary;
  advice: AdviceResponse;
};
