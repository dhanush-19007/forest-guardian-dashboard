import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { speciesEmoji } from "@/services/mockData";
import { formatDate } from "@/services/forestApi";
import type { MapMarker } from "@/utils/types";

const markerIcon = (species: MapMarker["species"]) =>
  L.divIcon({
    className: "",
    html: `<div style="display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#ffffff;box-shadow:0 4px 12px rgba(23,58,26,.35);border:2px solid ${
      species === "Human Footprint" ? "#D32F2F" : "#1B5E20"
    };font-size:18px;">${speciesEmoji[species]}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

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
            icon={markerIcon(m.species)}
          >
            <Popup>
              <div style={{ minWidth: 180, lineHeight: 1.5 }}>
                <strong>{m.species}</strong>
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
