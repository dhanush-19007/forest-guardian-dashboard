import { motion } from "framer-motion";
import { Cctv, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip, priorityTone, statusTone } from "@/components/StatusChip";
import { speciesEmoji } from "@/services/mockData";
import { formatDate } from "@/services/forestApi";
import type { AlertItem } from "@/utils/types";

export function AlertCard({
  alert,
  onAcknowledge,
  index = 0,
}: {
  alert: AlertItem;
  onAcknowledge?: (id: string) => void;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-soft"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-xl">
          {speciesEmoji[alert.species]}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
              {alert.title}
            </h3>
            <StatusChip label={alert.status} tone={statusTone(alert.status)} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{alert.location}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {formatDate(alert.date)} · {alert.time}
            </span>
            {alert.cameraName ? (
              <span className="inline-flex items-center gap-1">
                <Cctv className="h-3.5 w-3.5 shrink-0" />
                {alert.cameraName}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusChip
              label={`${alert.priority} priority`}
              tone={priorityTone(alert.priority)}
            />
            <StatusChip label={alert.kind} tone="neutral" />
            <StatusChip
              label={`Source: ${alert.source ?? "Footprint Upload"}`}
              tone="neutral"
            />
            {onAcknowledge && alert.status === "New" ? (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto h-8 rounded-full text-xs"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
