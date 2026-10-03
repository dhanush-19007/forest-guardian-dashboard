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

/** Where a record originated from. */
export type DetectionSource = "Footprint Upload" | "CCTV Camera";

export type CameraStatus = "Online" | "Offline";

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
  source?: DetectionSource;
  cameraName?: string;
  officerName?: string;
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
  source?: DetectionSource;
  cameraName?: string;
}

export interface Sighting {
  id: string;
  species: Species;
  zone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  time: string;
  source?: DetectionSource;
  cameraName?: string;
  officerName?: string;
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

/** A forest CCTV camera. */
export interface Camera {
  id: string;
  name: string;
  place: string;
  zone: string;
  status: CameraStatus;
  streamUrl: string; // placeholder live feed image/video
  snapshotUrl: string;
  coordinates: { lat: number; lng: number };
  lastDetectionTime: string;
}

/** A detection event pushed by a camera (future: WebSocket payload). */
export interface CameraDetection {
  id: string;
  cameraId: string;
  cameraName: string;
  species: Species;
  confidence: number;
  zone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  time: string;
  priority: AlertPriority;
  status: AlertStatus;
  snapshotUrl: string;
}
