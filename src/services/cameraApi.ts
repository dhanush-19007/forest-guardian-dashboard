/**
 * Mock surveillance service layer.
 *
 * Future integration:
 *  - Replace each function body with an Axios call to Spring Boot
 *    (e.g. axios.get("/api/cameras"), axios.get("/api/camera-detections")).
 *  - Real-time camera events will arrive over a WebSocket/STOMP channel;
 *    `subscribeToCameraDetections` is the seam for that (no-op for now).
 */
import { mockCameraDetections, mockCameras } from "@/services/cameraMockData";
import type {
  AlertItem,
  Camera,
  CameraDetection,
  MapMarker,
} from "@/utils/types";

const delay = <T,>(data: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const cameraService = {
  getCameras: (): Promise<Camera[]> => delay(mockCameras),
  getCameraDetections: (): Promise<CameraDetection[]> =>
    delay(mockCameraDetections),
};

/** Placeholder for the future WebSocket subscription. */
export const cameraStream = {
  subscribeToCameraDetections: (
    _onDetection: (detection: CameraDetection) => void,
  ): (() => void) => {
    // TODO: connect to Spring Boot WebSocket topic /topic/camera-detections
    return () => {};
  },
};

export const cameraDetectionToAlert = (d: CameraDetection): AlertItem => ({
  id: `ALT-${d.id}`,
  title:
    d.species === "Human Footprint"
      ? `Human movement detected on ${d.cameraName}`
      : `${d.species} detected on ${d.cameraName}`,
  kind: d.species === "Human Footprint" ? "Human" : "Animal",
  species: d.species,
  priority: d.priority,
  status: d.status,
  location: d.location,
  date: d.date,
  time: d.time,
  source: "CCTV Camera",
  cameraName: d.cameraName,
});

export const cameraDetectionToMarker = (d: CameraDetection): MapMarker => ({
  id: `MRK-${d.id}`,
  species: d.species,
  zone: d.zone,
  location: d.location,
  coordinates: d.coordinates,
  date: d.date,
  time: d.time,
  source: "CCTV Camera",
  cameraName: d.cameraName,
});
