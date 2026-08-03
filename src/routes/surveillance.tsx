import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cctv, VideoOff } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { CameraCard } from "@/components/surveillance/CameraCard";
import { CameraDetectionCard } from "@/components/surveillance/CameraDetectionCard";
import { CameraDetectionModal } from "@/components/surveillance/CameraDetectionModal";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
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

const filters = ["All", "Online", "Offline"] as const;
type Filter = (typeof filters)[number];

function SurveillancePage() {
  const { cameras, cameraDetections, acknowledgeCameraDetection, stats } =
    useApp();
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<CameraDetection | null>(null);

  const visible = useMemo(
    () =>
      filter === "All" ? cameras : cameras.filter((c) => c.status === filter),
    [cameras, filter],
  );

  const active = selected
    ? (cameraDetections.find((d) => d.id === selected.id) ?? selected)
    : null;

  return (
    <AppShell
      title="Live Surveillance"
      subtitle={`${stats.camerasOnline} of ${stats.camerasTotal} cameras online · ${stats.cameraDetectionsToday} detections today`}
    >
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-3">
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
                title="No cameras in this filter"
                description="Switch the filter to see all installed forest cameras."
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
