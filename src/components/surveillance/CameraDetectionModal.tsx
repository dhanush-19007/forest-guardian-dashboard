import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusChip, priorityTone, statusTone } from "@/components/StatusChip";
import { formatDate } from "@/services/forestApi";
import type { CameraDetection } from "@/utils/types";

export function CameraDetectionModal({
  detection,
  open,
  onOpenChange,
  onAcknowledge,
}: {
  detection: CameraDetection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcknowledge: (id: string) => void;
}) {
  if (!detection) return null;

  const rows: [string, string][] = [
    ["Detected species", detection.species],
    ["Confidence", `${detection.confidence}%`],
    ["Camera", `${detection.cameraName} (${detection.cameraId})`],
    ["Forest zone", detection.zone],
    ["Date", formatDate(detection.date)],
    ["Time", detection.time],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Camera detection details</DialogTitle>
          <DialogDescription>
            Snapshot captured by {detection.cameraName} in {detection.zone}.
          </DialogDescription>
        </DialogHeader>

        <img
          src={detection.snapshotUrl}
          alt={`Camera snapshot of ${detection.species} from ${detection.cameraName}`}
          className="aspect-video w-full rounded-xl object-cover"
        />

        <dl className="mt-2 grid gap-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="min-w-0 truncate font-medium text-foreground">
                {value}
              </dd>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="flex gap-2">
              <StatusChip
                label={`${detection.priority} priority`}
                tone={priorityTone(detection.priority)}
              />
              <StatusChip
                label={detection.status}
                tone={statusTone(detection.status)}
              />
            </dd>
          </div>
        </dl>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="default"
            className="rounded-full"
            disabled={detection.status === "Acknowledged"}
            onClick={() => onAcknowledge(detection.id)}
          >
            <Check className="h-4 w-4" />
            {detection.status === "Acknowledged" ? "Acknowledged" : "Acknowledge"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
