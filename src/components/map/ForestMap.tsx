import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { speciesEmoji } from "@/services/mockData";
import { formatDate } from "@/services/forestApi";
import type { MapMarker } from "@/utils/types";

const markerIcon = (marker: MapMarker) => {
  const cctv = marker.source === "CCTV Camera";
  const color = marker.species === "Human Footprint" ? "#D32F2F" : "#1B5E20";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;display:grid;place-items:center;width:36px;height:36px;border-radius:${
      cctv ? "10px" : "50%"
    };background:#ffffff;box-shadow:0 4px 12px rgba(23,58,26,.35);border:2px solid ${color};font-size:18px;">${
      speciesEmoji[marker.species]
    }${
      cctv
        ? `<span style="position:absolute;bottom:-6px;right:-6px;background:${color};color:#fff;font-size:8px;font-weight:700;border-radius:6px;padding:1px 3px;">CCTV</span>`
        : ""
    }</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export default function ForestMap({
  markers,
  center,
  height = "24rem",
}: {
  markers: MapMarker[];
  center: [number, number];
  height?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.coordinates.lat, m.coordinates.lng]}
            icon={markerIcon(m)}
          >
            <Popup>
              <div style={{ minWidth: 180, lineHeight: 1.5 }}>
                <strong>{m.species}</strong>
                <div>Source: {m.source ?? "Footprint Upload"}</div>
                {m.cameraName ? <div>Camera: {m.cameraName}</div> : null}
                {m.officerName ? <div>Officer: {m.officerName}</div> : null}
                <div>{m.location}</div>
                <div>
                  {m.coordinates.lat}, {m.coordinates.lng}
                </div>
                <div>Last seen: {formatDate(m.date)}</div>
                <div>Time: {m.time}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
