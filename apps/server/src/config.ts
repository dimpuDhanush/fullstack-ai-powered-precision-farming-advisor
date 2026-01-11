import dotenv from "dotenv";
dotenv.config();

function mustGet(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? "8080"),
  dbPath: mustGet("DB_PATH", "./data/app.db"),
  uploadDir: mustGet("UPLOAD_DIR", "./uploads"),
  publicBaseUrl: mustGet("PUBLIC_BASE_URL", "http://localhost:8080"),

  // External AI endpoints (used when USE_MOCK_AI=false)
  mlServiceUrl: mustGet("ML_SERVICE_URL", "http://localhost:8001"),
  llmServiceUrl: mustGet("LLM_SERVICE_URL", "http://localhost:8002"),

  mlApiKey: process.env.ML_API_KEY || "",
  llmApiKey: process.env.LLM_API_KEY || "",

  mlPredictPath: process.env.ML_PREDICT_PATH || "/predict",
  llmAdvicePath: process.env.LLM_ADVICE_PATH || "/generate-advice",
  llmChatPath: process.env.LLM_CHAT_PATH || "/chat",

  // ✅ Dev-only: enable mock responses so fullstack works without ML/LLM ready
  useMockAi: (process.env.USE_MOCK_AI ?? "false").toLowerCase() === "true",
};
