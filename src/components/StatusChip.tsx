import { cn } from "@/lib/utils";
import type { AlertPriority, AlertStatus } from "@/utils/types";

type Tone = "new" | "ack" | "high" | "medium" | "low" | "neutral";

const toneClasses: Record<Tone, string> = {
  new: "bg-destructive/10 text-destructive ring-destructive/20",
  ack: "bg-success/10 text-success ring-success/20",
  high: "bg-destructive/10 text-destructive ring-destructive/20",
  medium: "bg-warning/15 text-warning ring-warning/25",
  low: "bg-muted text-muted-foreground ring-border",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function StatusChip({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

export const statusTone = (status: AlertStatus): Tone =>
  status === "New" ? "new" : "ack";

export const priorityTone = (priority: AlertPriority): Tone =>
  priority === "High" ? "high" : priority === "Medium" ? "medium" : "low";
