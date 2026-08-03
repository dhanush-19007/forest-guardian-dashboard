export type Species =
  | "Tiger"
  | "Elephant"
  | "Leopard"
  | "Bear"
  | "Deer"
  | "Human Footprint";

export type AlertPriority = "High" | "Medium" | "Low";
export type AlertStatus = "New" | "Acknowledged";
export type AlertKind = "Animal" | "Human";

export interface Detection {
  id: string;
  species: Species;
  confidence: number;
  zone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // hh:mm AM/PM
  imageUrl: string;
}

export interface AlertItem {
  id: string;
  title: string;
  kind: AlertKind;
  species: Species;
  priority: AlertPriority;
  status: AlertStatus;
  location: string;
  date: string;
  time: string;
}

export interface MapMarker {
  id: string;
  species: Species;
  zone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  time: string;
}

export interface DetectionResult {
  species: Species;
  confidence: number;
  zone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  time: string;
}
