import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { nanoid } from "nanoid";

import { config } from "./config.js";
import { fetchWeather } from "./services/weather.js";
import { predictWithMl } from "./services/mlClient.js";
import { chat, generateAdvice } from "./services/llmClient.js";
import { getAnalysis, insertAnalysis, listAnalyses } from "./db.js";
import { mockAdvice, mockChat, mockMl } from "./services/mockAi.js";

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg") || ".jpg";
    cb(null, `${Date.now()}-${nanoid(10)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    mockAi: config.useMockAi,
  });
});

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "image is required" });

    const cropType = (req.body.cropType ?? null) as string | null;
    const language = (req.body.language ?? "en") as string;
    const lat = req.body.lat ? Number(req.body.lat) : null;
    const lng = req.body.lng ? Number(req.body.lng) : null;
    const question = (req.body.question ?? null) as string | null;

    const imageUrl = `${config.publicBaseUrl}/uploads/${encodeURIComponent(
      file.filename
    )}`;

    // 1) Weather (fallback to Chennai if not sent)
    const weather =
      lat != null && lng != null
        ? await fetchWeather(lat, lng)
        : await fetchWeather(13.0827, 80.2707);

    // 2) ML + LLM
    // If USE_MOCK_AI=true -> use mock responses (no external endpoints required)
    // Else -> call real endpoints
    const ml = config.useMockAi ? mockMl() : await predictWithMl(file.path);

    const advice = config.useMockAi
      ? mockAdvice({ language, cropType, question, imageUrl, ml, weather })
      : await generateAdvice({
          language,
          cropType,
          question,
          imageUrl,
          ml,
          weather,
        });

    // 3) Store
    const analysisId = nanoid(12);
    const createdAt = new Date().toISOString();

    insertAnalysis({
      id: analysisId,
      created_at: createdAt,
      crop_type: cropType,
      language,
      lat,
      lng,
      image_url: imageUrl,
      ml_label: ml.label,
      ml_confidence: ml.confidence,
      ml_top3_json: ml.top3 ? JSON.stringify(ml.top3) : null,
      weather_json: JSON.stringify(weather),
      advice_json: JSON.stringify(advice),
    });
    console.log("UPLOAD:", {
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      path: req.file?.path,
    });

    return res.json({
      analysisId,
      imageUrl,
      cropType,
      language,
      location: { lat, lng },
      ml,
      weather,
      advice,
      mockAi: config.useMockAi,
    });
  } catch (e: any) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "analysis_failed", details: e?.message ?? String(e) });
  }
});

router.post("/ask", express.json(), async (req, res) => {
  try {
    const { analysisId, question, language } = req.body ?? {};
    if (!analysisId || !question)
      return res
        .status(400)
        .json({ error: "analysisId and question are required" });

    const row = getAnalysis(String(analysisId));
    if (!row) return res.status(404).json({ error: "analysis_not_found" });

    const context = {
      analysisId: row.id,
      cropType: row.crop_type,
      imageUrl: row.image_url,
      ml: { label: row.ml_label, confidence: row.ml_confidence },
      weather: JSON.parse(row.weather_json),
      advice: JSON.parse(row.advice_json),
    };

    const reply = config.useMockAi
      ? mockChat({
          language: language ?? row.language ?? "en",
          question: String(question),
          context,
        })
      : await chat({
          language: language ?? row.language ?? "en",
          question: String(question),
          analysisContext: context,
        });

    return res.json({ analysisId: row.id, reply, mockAi: config.useMockAi });
  } catch (e: any) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "chat_failed", details: e?.message ?? String(e) });
  }
});

router.get("/history", (req, res) => {
  const limit = req.query.limit
    ? Math.min(100, Math.max(1, Number(req.query.limit)))
    : 20;
  const rows = listAnalyses(limit);

  const items = rows.map((r) => ({
    analysisId: r.id,
    createdAt: r.created_at,
    cropType: r.crop_type,
    imageUrl: r.image_url,
    mlLabel: r.ml_label,
    mlConfidence: r.ml_confidence,
    severity: (JSON.parse(r.advice_json).severity ?? null) as string | null,
  }));

  res.json({ items });
});

router.get("/analysis/:id", (req, res) => {
  const id = String(req.params.id || "");
  const row = getAnalysis(id);
  if (!row) return res.status(404).json({ error: "analysis_not_found" });

  const weather = JSON.parse(row.weather_json);
  const advice = JSON.parse(row.advice_json);

  return res.json({
    analysisId: row.id,
    imageUrl: row.image_url,
    cropType: row.crop_type,
    language: row.language,
    location: { lat: row.lat, lng: row.lng },
    ml: {
      label: row.ml_label,
      confidence: row.ml_confidence,
      top3: row.ml_top3_json ? JSON.parse(row.ml_top3_json) : undefined,
    },
    weather,
    advice,
    createdAt: row.created_at,
  });
});
