import { Suspense, lazy, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapMarker } from "@/utils/types";

const ForestMap = lazy(() => import("@/components/map/ForestMap"));

export function MapPanel({
  markers,
  center,
  height = "24rem",
}: {
  markers: MapMarker[];
  center: [number, number];
  height?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fallback = <Skeleton className="w-full rounded-2xl" style={{ height }} />;
  if (!mounted) return fallback;

  return (
    <Suspense fallback={fallback}>
      <ForestMap markers={markers} center={center} height={height} />
    </Suspense>
  );
}
