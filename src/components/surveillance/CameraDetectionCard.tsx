import { motion } from "framer-motion";
import { Camera as CameraIcon, Clock } from "lucide-react";
import { StatusChip, priorityTone, statusTone } from "@/components/StatusChip";
import { speciesEmoji } from "@/services/mockData";
import type { CameraDetection } from "@/utils/types";

export function CameraDetectionCard({
  detection,
  onOpen,
  index = 0,
}: {
  detection: CameraDetection;
  onOpen?: (detection: CameraDetection) => void;
  index?: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      onClick={() => onOpen?.(detection)}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-colors hover:border-primary/40 hover:bg-muted/40"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-xl">
          {speciesEmoji[detection.species]}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
              {detection.species}
            </h3>
            <StatusChip
              label={`${detection.confidence}%`}
              tone={detection.confidence >= 90 ? "ack" : "medium"}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1">
              <CameraIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {detection.cameraName} · {detection.zone}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {detection.time}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusChip
              label={`${detection.priority} priority`}
              tone={priorityTone(detection.priority)}
            />
            <StatusChip
              label={detection.status}
              tone={statusTone(detection.status)}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
