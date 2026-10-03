import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cctv, VideoOff } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { CameraCard } from "@/components/surveillance/CameraCard";
import { CameraDetectionCard } from "@/components/surveillance/CameraDetectionCard";
import { CameraDetectionModal } from "@/components/surveillance/CameraDetectionModal";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/context/AppContext";
import type { CameraDetection } from "@/utils/types";

export const Route = createFileRoute("/surveillance")({
  head: () => ({
    meta: [
      { title: "Live Surveillance | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Monitor forest CCTV cameras, live feeds, camera status and real-time wildlife or human detections by zone.",
      },
      {
        property: "og:title",
        content: "Live Surveillance | Smart Forest Guardian",
      },
      {
        property: "og:description",
        content: "Forest CCTV camera grid and live detection feed.",
      },
    ],
  }),
  component: SurveillancePage,
});

function SurveillancePage() {
  const { cameras, cameraDetections, acknowledgeCameraDetection } =
    useApp();
  const [selected, setSelected] = useState<CameraDetection | null>(null);

  const visible = cameras;

  const active = selected
    ? (cameraDetections.find((d) => d.id === selected.id) ?? selected)
    : null;

  return (
    <AppShell
      title="Live Surveillance"
      subtitle="Monitor forest CCTV cameras and recent wildlife activity."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="min-w-0 xl:col-span-2">
          <h2 className="text-base font-bold text-foreground">Camera grid</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {visible.map((camera, i) => (
              <CameraCard key={camera.id} camera={camera} index={i} />
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={VideoOff}
                title="No cameras installed yet"
              />
            </div>
          ) : null}
        </section>

        <section className="min-w-0">
          <h2 className="text-base font-bold text-foreground">
            Recent camera detections
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {cameraDetections.map((d, i) => (
              <CameraDetectionCard
                key={d.id}
                detection={d}
                index={i}
                onOpen={setSelected}
              />
            ))}
            {cameraDetections.length === 0 ? (
              <EmptyState icon={Cctv} title="No camera detections yet" />
            ) : null}
          </div>
        </section>
      </div>

      <CameraDetectionModal
        detection={active}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
        onAcknowledge={acknowledgeCameraDetection}
      />
    </AppShell>
  );
}
