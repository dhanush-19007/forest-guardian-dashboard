import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockAlerts, mockDetections, mockMarkers } from "@/services/mockData";
import {
  mockCameraDetections,
  mockCameras,
} from "@/services/cameraMockData";
import {
  cameraDetectionToAlert,
  cameraDetectionToMarker,
} from "@/services/cameraApi";
import type {
  AlertItem,
  Camera,
  CameraDetection,
  Detection,
  DetectionResult,
  MapMarker,
} from "@/utils/types";

interface Officer {
  name: string;
  department: string;
  username: string;
}

interface AppState {
  officer: Officer | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateOfficer: (patch: Partial<Officer>) => void;
  detections: Detection[];
  alerts: AlertItem[];
  markers: MapMarker[];
  cameras: Camera[];
  cameraDetections: CameraDetection[];
  saveDetection: (result: DetectionResult, imageUrl: string) => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeCameraDetection: (id: string) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  stats: {
    totalAnimals: number;
    humanAlerts: number;
    activeAlerts: number;
    today: number;
    cameraDetectionsToday: number;
    camerasOnline: number;
    camerasTotal: number;
  };
}

const AppContext = createContext<AppState | null>(null);
const STORAGE_KEY = "sfg-officer";

export function AppProvider({ children }: { children: ReactNode }) {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [detections, setDetections] = useState<Detection[]>(mockDetections);
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [markers, setMarkers] = useState<MapMarker[]>(mockMarkers);
  const [cameras] = useState<Camera[]>(mockCameras);
  const [cameraDetections, setCameraDetections] =
    useState<CameraDetection[]>(mockCameraDetections);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setOfficer(JSON.parse(raw) as Officer);
      } catch {
        /* ignore corrupted session */
      }
    }
  }, []);

  const login = useCallback((username: string) => {
    const next: Officer = {
      name: "Ranger " + username.replace(/^\w/, (c) => c.toUpperCase()),
      department: "Karnataka Forest Department",
      username,
    };
    setOfficer(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setOfficer(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateOfficer = useCallback((patch: Partial<Officer>) => {
    setOfficer((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveDetection = useCallback(
    (result: DetectionResult, imageUrl: string) => {
      const id = `DET-${Math.floor(2000 + Math.random() * 8000)}`;
      const isHuman = result.species === "Human Footprint";

      setDetections((prev) => [
        {
          id,
          species: result.species,
          confidence: result.confidence,
          zone: result.zone,
          location: result.location,
          coordinates: result.coordinates,
          date: result.date,
          time: result.time,
          imageUrl,
          source: "Footprint Upload",
          officerName: officer?.name ?? "Unassigned",
        },
        ...prev,
      ]);

      setAlerts((prev) => [
        {
          id: `ALT-${Math.floor(400 + Math.random() * 500)}`,
          title: isHuman
            ? "Human movement detected"
            : `${result.species} footprint detected`,
          kind: isHuman ? "Human" : "Animal",
          species: result.species,
          priority: isHuman || result.confidence > 90 ? "High" : "Medium",
          status: "New",
          location: result.location,
          date: result.date,
          time: result.time,
          source: "Footprint Upload",
        },
        ...prev,
      ]);

      setMarkers((prev) => [
        {
          id: `MRK-${id}`,
          species: result.species,
          zone: result.zone,
          location: result.location,
          coordinates: result.coordinates,
          date: result.date,
          time: result.time,
          source: "Footprint Upload",
          officerName: officer?.name ?? "Unassigned",
        },
        ...prev,
      ]);
    },
    [officer],
  );

  const acknowledgeCameraDetection = useCallback((id: string) => {
    setCameraDetections((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Acknowledged" } : d)),
    );
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Acknowledged" } : a)),
    );
    setCameraDetections((prev) =>
      prev.map((d) =>
        `ALT-${d.id}` === id ? { ...d, status: "Acknowledged" } : d,
      ),
    );
  }, []);

  /** Footprint alerts + camera-generated alerts, newest first. */
  const allAlerts = useMemo(() => {
    const cctv = cameraDetections.map(cameraDetectionToAlert);
    return [...alerts, ...cctv].sort((a, b) =>
      `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`),
    );
  }, [alerts, cameraDetections]);

  const allMarkers = useMemo(
    () => [...markers, ...cameraDetections.map(cameraDetectionToMarker)],
    [markers, cameraDetections],
  );

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      totalAnimals: detections.filter((d) => d.species !== "Human Footprint")
        .length,
      humanAlerts: allAlerts.filter((a) => a.kind === "Human").length,
      activeAlerts: allAlerts.filter((a) => a.status === "New").length,
      today: detections.filter((d) => d.date === today).length,
      cameraDetectionsToday: cameraDetections.filter((d) => d.date === today)
        .length,
      camerasOnline: cameras.filter((c) => c.status === "Online").length,
      camerasTotal: cameras.length,
    };
  }, [detections, allAlerts, cameraDetections, cameras]);

  const value: AppState = {
    officer,
    isAuthenticated: Boolean(officer),
    login,
    logout,
    updateOfficer,
    detections,
    alerts: allAlerts,
    markers: allMarkers,
    cameras,
    cameraDetections,
    saveDetection,
    acknowledgeAlert,
    acknowledgeCameraDetection,
    notifications,
    setNotifications,
    stats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
