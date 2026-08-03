import { motion } from "framer-motion";
import { Clock, MapPin, Video } from "lucide-react";
import { StatusChip } from "@/components/StatusChip";
import type { Camera } from "@/utils/types";

export function CameraCard({
  camera,
  index = 0,
}: {
  camera: Camera;
  index?: number;
}) {
  const online = camera.status === "Online";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.05 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={camera.streamUrl}
          alt={`Live feed placeholder from ${camera.name} at ${camera.place}`}
          loading="lazy"
          className={
            online
              ? "h-full w-full object-cover"
              : "h-full w-full object-cover opacity-40 grayscale"
          }
        />
        <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
          <span
            className={
              online
                ? "h-2 w-2 animate-pulse rounded-full bg-destructive"
                : "h-2 w-2 rounded-full bg-muted-foreground"
            }
          />
          {online ? "LIVE" : "OFFLINE"}
        </span>
        <span className="absolute top-2 right-2 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          {camera.id}
        </span>
        {!online ? (
          <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-muted-foreground">
            No signal
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            <Video className="mr-1.5 inline h-4 w-4 text-primary" />
            {camera.name}
          </h3>
          <StatusChip label={camera.status} tone={online ? "ack" : "low"} />
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {camera.place}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{camera.zone}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Last detection: {camera.lastDetectionTime}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
