import { motion } from "framer-motion";
import { CalendarClock, Crosshair, MapPin, Percent } from "lucide-react";
import { StatusChip } from "@/components/StatusChip";
import { speciesEmoji } from "@/services/mockData";
import { formatDate } from "@/services/forestApi";
import type { DetectionResult } from "@/utils/types";

export function DetectionResultCard({ result }: { result: DetectionResult }) {
  const isHuman = result.species === "Human Footprint";
  const rows = [
    { icon: Percent, label: "Confidence", value: `${result.confidence}%` },
    { icon: MapPin, label: "Forest zone", value: result.location },
    {
      icon: Crosshair,
      label: "Coordinates",
      value: `${result.coordinates.lat}, ${result.coordinates.lng}`,
    },
    {
      icon: CalendarClock,
      label: "Detected at",
      value: `${formatDate(result.date)} · ${result.time}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted text-2xl">
          {speciesEmoji[result.species]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Detected species
          </p>
          <p className="truncate text-xl font-bold text-foreground">
            {result.species}
          </p>
        </div>
        <StatusChip
          label={isHuman ? "Human intrusion" : "Wildlife"}
          tone={isHuman ? "high" : "ack"}
        />
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${result.confidence}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-secondary"
        />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex min-w-0 items-start gap-2 rounded-xl bg-muted/50 px-3 py-2.5"
          >
            <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="truncate text-sm font-semibold text-foreground">
                {row.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
