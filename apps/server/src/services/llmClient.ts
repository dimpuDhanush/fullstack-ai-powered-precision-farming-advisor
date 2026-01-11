import axios from "axios";
import { config } from "../config.js";
import type { AdviceResponse, ChatResponse } from "@pfa/shared/src/types.js";

function axiosErrorToMessage(err: any) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const msg = err?.message ?? "unknown_error";
  return `LLM_ERROR ${status ?? "no_status"}: ${
    typeof data === "string" ? data : JSON.stringify(data)
  } | ${msg}`;
}

export async function generateAdvice(payload: any): Promise<AdviceResponse> {
  const url = `${config.llmServiceUrl}${config.llmAdvicePath}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (config.llmApiKey) headers["Authorization"] = `Bearer ${config.llmApiKey}`;

  try {
    const res = await axios.post(url, payload, { headers, timeout: 25000 });
    return res.data as AdviceResponse;
  } catch (err: any) {
    throw new Error(axiosErrorToMessage(err));
  }
}

export async function chat(payload: any): Promise<ChatResponse> {
  const url = `${config.llmServiceUrl}${config.llmChatPath}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const res = await axios.post(url, payload, { headers, timeout: 25000 });
    return res.data as ChatResponse;
  } catch (err: any) {
    throw new Error(axiosErrorToMessage(err));
  }
}
