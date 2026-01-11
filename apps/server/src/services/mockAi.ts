import type {
  AdviceResponse,
  ChatResponse,
  MlPredictResponse,
  WeatherSummary,
} from "@pfa/shared/src/types.js";

/**
 * Very simple mock ML output.
 * You can change labels anytime — it's only for dev/demo.
 */
export function mockMl(): MlPredictResponse {
  return {
    label: "rust",
    confidence: 0.72,
    top3: [
      { label: "rust", confidence: 0.72 },
      { label: "leaf_blight", confidence: 0.18 },
      { label: "healthy", confidence: 0.1 },
    ],
  };
}

function deriveSeverity(
  weather: WeatherSummary,
  mlLabel: string
): "Low" | "Medium" | "High" {
  const humidity = weather?.humidity_pct ?? 0;
  const rain24 = weather?.rain_next_24h_mm ?? 0;

  if (mlLabel === "healthy") return "Low";
  if (humidity >= 75 || rain24 >= 5) return "High";
  return "Medium";
}

export function mockAdvice(input: {
  cropType: string | null;
  language: string;
  question: string | null;
  imageUrl: string;
  ml: MlPredictResponse;
  weather: WeatherSummary;
}): AdviceResponse {
  const humidity = input.weather?.humidity_pct ?? 0;
  const rain24 = input.weather?.rain_next_24h_mm ?? 0;

  const warnings: string[] = [];
  if (humidity >= 75)
    warnings.push("High humidity increases fungal risk. Monitor closely.");
  if (rain24 >= 5)
    warnings.push("Rain likely in next 24h. Avoid spraying today.");

  const label = input.ml.label;

  const stepsByLabel: Record<string, string[]> = {
    healthy: [
      "No major issue detected. Continue weekly monitoring.",
      "Water consistently (avoid over-watering).",
      "Remove weeds near the plant and keep good airflow.",
    ],
    rust: [
      "Remove heavily affected leaves if possible.",
      "Avoid overhead watering for 2 days.",
      "Use locally approved anti-fungal treatment as per label instructions.",
    ],
    leaf_blight: [
      "Remove affected leaves to reduce spread.",
      "Avoid wetting leaves while watering.",
      "Use locally approved treatment as per label instructions.",
    ],
    pest_damage: [
      "Check leaf underside for pests/eggs.",
      "Use neem-based spray or approved pesticide as per label instructions.",
      "Clean weeds and stagnant water around the crop.",
    ],
  };

  const steps = stepsByLabel[label] ?? [
    "Take a clearer photo in daylight (close-up of affected leaf).",
    "Capture both front and back of leaf.",
    "If symptoms spread fast, consult an agriculture officer.",
  ];

  return {
    detectedIssue: `${label} (mock)`,
    severity: deriveSeverity(input.weather, label),
    confidenceText: "Mock confidence (development mode)",
    steps,
    warnings,
    explanation:
      "Mock AI response used because USE_MOCK_AI=true. Replace with real ML/LLM endpoints when ready.",
    followUpQuestions: [
      "How many days since symptoms started?",
      "Is it spreading to nearby plants?",
    ],
  };
}

export function mockChat(input: {
  language: string;
  question: string;
  context: any;
}): ChatResponse {
  const q = input.question.toLowerCase();
  const rain24 = input.context?.weather?.rain_next_24h_mm ?? 0;

  if (q.includes("spray")) {
    return {
      answer:
        rain24 >= 5
          ? "Avoid spraying today because rain is likely within 24 hours."
          : "Spraying can be done when wind is low. Follow label instructions.",
      bullets: [
        "Spray early morning/evening when wind is low",
        "Avoid spraying before rain",
        "Use locally approved solutions only",
      ],
      followUp: "Do you see new spots appearing daily?",
    };
  }

  if (q.includes("water") || q.includes("irrig")) {
    return {
      answer:
        rain24 >= 5
          ? "Rain is expected soon, so reduce irrigation today if possible."
          : "If soil is dry and plant is stressed, light irrigation is okay.",
      bullets: [
        "Prefer soil-level watering",
        "Avoid wetting leaves if fungal risk",
      ],
      followUp: "Is the soil currently dry or moist?",
    };
  }

  return {
    answer:
      "This is a mock chat reply. Tell me the symptoms (spots / yellowing / holes / wilting) and I will guide you.",
    bullets: [
      "Take a close-up photo of the affected leaf",
      "Also take a full plant photo",
    ],
    followUp: "Which crop is this?",
  };
}
