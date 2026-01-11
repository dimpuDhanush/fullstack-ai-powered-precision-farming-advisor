// apps/server/src/services/mlClient.ts
import axios from "axios";
import fs from "node:fs";
import FormData from "form-data";
import { config } from "../config.js";

export type MlResult = {
  label: string;
  confidence: number;
  top3?: Array<{ label: string; confidence: number }>;
};

export async function predictWithMl(filePath: string): Promise<MlResult> {
  const url = `${config.mlServiceUrl}${config.mlPredictPath}`;

  const form = new FormData();
  // IMPORTANT: FastAPI expects field name = "file"
  form.append("file", fs.createReadStream(filePath));

  const headers: Record<string, string> = {
    ...form.getHeaders(),
  };
  if (config.mlApiKey) headers["Authorization"] = `Bearer ${config.mlApiKey}`;

  const res = await axios.post(url, form, {
    headers,
    timeout: 30000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: () => true,
  });

  if (res.status >= 400) {
    throw new Error(
      `ML_ERROR ${res.status}: ${
        typeof res.data === "string" ? res.data : JSON.stringify(res.data)
      }`
    );
  }

  return res.data as MlResult;
}
