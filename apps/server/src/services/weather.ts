import axios from "axios";
import type { WeatherSummary } from "@pfa/shared/src/types.js";

export async function fetchWeather(
  lat: number,
  lng: number
): Promise<WeatherSummary> {
  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
      latitude: lat,
      longitude: lng,
      hourly: "temperature_2m,relativehumidity_2m,precipitation,windspeed_10m",
      forecast_days: 2,
    };

    const res = await axios.get(url, { params, timeout: 8000 });
    const h = res.data?.hourly ?? {};
    const temps: number[] = h.temperature_2m ?? [];
    const hums: number[] = h.relativehumidity_2m ?? [];
    const rains: number[] = h.precipitation ?? [];
    const winds: number[] = h.windspeed_10m ?? [];

    const sum = (arr: number[], n: number) =>
      arr.slice(0, n).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

    const avg = (arr: number[], n: number) => (n > 0 ? sum(arr, n) / n : null);

    return {
      temp_c: avg(temps, Math.min(24, temps.length)),
      humidity_pct: avg(hums, Math.min(24, hums.length)),
      wind_kph: avg(winds, Math.min(24, winds.length)),
      rain_next_24h_mm: sum(rains, Math.min(24, rains.length)),
      rain_next_48h_mm: sum(rains, Math.min(48, rains.length)),
      raw: res.data,
    };
  } catch {
    return {
      temp_c: null,
      humidity_pct: null,
      wind_kph: null,
      rain_next_24h_mm: null,
      rain_next_48h_mm: null,
    };
  }
}
