/**
 * Mock service layer.
 * Every function mimics an async REST call and can be swapped for a real
 * Spring Boot endpoint (e.g. axios.get("/api/detections")) without touching UI.
 */
import {
  mockAlerts,
  mockDetections,
  mockMarkers,
  weeklyTrend,
} from "@/services/mockData";
import type {
  AlertItem,
  Detection,
  DetectionResult,
  MapMarker,
  Species,
} from "@/utils/types";

const delay = <T,>(data: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const dashboardService = {
  getTrend: () => delay(weeklyTrend),
};

export const detectionService = {
  getHistory: (): Promise<Detection[]> => delay(mockDetections),
};

export const alertService = {
  getAlerts: (): Promise<AlertItem[]> => delay(mockAlerts),
};

export const mapService = {
  getMarkers: (): Promise<MapMarker[]> => delay(mockMarkers),
};

const CANDIDATES: { species: Species; zone: string; location: string }[] = [
  { species: "Tiger", zone: "Zone C", location: "Bandipur Range, Zone C" },
  { species: "Elephant", zone: "Zone B", location: "Hosur Corridor, Zone B" },
  { species: "Leopard", zone: "Zone D", location: "Rocky Ridge, Zone D" },
  { species: "Bear", zone: "Zone E", location: "Honey Rock, Zone E" },
  {
    species: "Human Footprint",
    zone: "Zone A",
    location: "Kaveri Belt, Zone A",
  },
];

/** Placeholder for the ML footprint-recognition endpoint. */
export const footprintAiService = {
  analyze: async (_file: File): Promise<DetectionResult> => {
    const pick = CANDIDATES[Math.floor(Math.random() * CANDIDATES.length)];
    const now = new Date();
    const result: DetectionResult = {
      species: pick.species,
      confidence: Math.round(78 + Math.random() * 20),
      zone: pick.zone,
      location: pick.location,
      coordinates: {
        lat: Number((12.89 + Math.random() * 0.07).toFixed(4)),
        lng: Number((77.49 + Math.random() * 0.09).toFixed(4)),
      },
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return delay(result, 1800);
  },
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
