import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

export type AnalysisRow = {
  id: string;
  created_at: string;
  crop_type: string | null;
  language: string | null;
  lat: number | null;
  lng: number | null;
  image_url: string;
  ml_label: string;
  ml_confidence: number;
  ml_top3_json: string | null;
  weather_json: string;
  advice_json: string;
};

fs.mkdirSync(path.dirname(path.resolve(config.dbPath)), { recursive: true });

export const db = new Database(config.dbPath);

export function initDb() {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      crop_type TEXT,
      language TEXT,
      lat REAL,
      lng REAL,
      image_url TEXT NOT NULL,
      ml_label TEXT NOT NULL,
      ml_confidence REAL NOT NULL,
      ml_top3_json TEXT,
      weather_json TEXT NOT NULL,
      advice_json TEXT NOT NULL
    );
  `);
}

export function insertAnalysis(row: AnalysisRow) {
  db.prepare(
    `
    INSERT INTO analyses (
      id, created_at, crop_type, language, lat, lng, image_url,
      ml_label, ml_confidence, ml_top3_json, weather_json, advice_json
    ) VALUES (
      @id, @created_at, @crop_type, @language, @lat, @lng, @image_url,
      @ml_label, @ml_confidence, @ml_top3_json, @weather_json, @advice_json
    )
  `
  ).run(row);
}

export function getAnalysis(id: string): AnalysisRow | undefined {
  return db.prepare(`SELECT * FROM analyses WHERE id = ?`).get(id) as any;
}

export function listAnalyses(limit = 20): AnalysisRow[] {
  return db
    .prepare(`SELECT * FROM analyses ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as any;
}
