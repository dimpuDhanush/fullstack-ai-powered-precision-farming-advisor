# 🌿 Precision Farming Advisor (Fullstack)

A mobile-first **AI Precision Farming Advisor** built for demos & project showcases.

✅ Farmers capture a plant photo  
✅ Backend stores the image + fetches weather (based on location)  
✅ ML endpoint predicts disease label + confidence  
✅ LLM endpoint generates simple, actionable guidance (no unsafe dosage instructions)  
✅ App shows **Diagnosis + Follow-up Chat + History**

> This repo contains the **Fullstack** (Mobile App + Backend).  
> ML + LLM services are integrated via **external endpoints** (can be local or deployed).

---

## ✨ Features

### 📱 Mobile App (Expo React Native)
- Capture or upload plant image
- Diagnose flow (photo → analysis)
- Professional Diagnosis UI (image preview, label, confidence, steps)
- History screen (previous diagnoses list)
- Chat screen (Ask follow-up questions based on selected diagnosis)
- Change diagnosis context from History inside Chat (no IDs shown)

### 🧠 Backend (Node.js + Express)
- `POST /api/analyze` — accepts image + optional location/crop type
- Calls:
  - ML service (`/predict`)
  - Weather service
  - LLM service (`/generate-advice`)
- Persists results in SQLite (simple local demo-friendly DB)
- `POST /api/ask` — contextual chat using stored analysis
- `GET /api/history` — recent analyses for app history
- Serves uploaded images at `/uploads/*`

### 🔌 ML + LLM Integration (External)
- ML and LLM are treated as separate services.
- You can run them locally or deploy later.
- Fullstack works with:
  - real endpoints (recommended)
  - or mock mode (for UI testing)

---

## 🧱 Tech Stack

**Mobile:** Expo (React Native), TypeScript, React Navigation  
**Backend:** Node.js, Express, TypeScript, Multer, SQLite  
**Integration:** ML service (FastAPI), LLM service (FastAPI/Gemini), Weather API  
**Monorepo:** pnpm workspaces

---

## 📂 Monorepo Structure

apps/
mobile/ # Expo React Native app
server/ # Express backend (TypeScript)
packages/
shared/ # Shared TypeScript types
