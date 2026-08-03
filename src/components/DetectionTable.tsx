import { StatusChip } from "@/components/StatusChip";
import { formatDate } from "@/services/forestApi";
import type { Detection } from "@/utils/types";

export function DetectionTable({
  detections,
  showDate = true,
}: {
  detections: Detection[];
  showDate?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Desktop / tablet table */}
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Species</th>
              <th className="px-4 py-3 font-semibold">Confidence</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              {showDate ? <th className="px-4 py-3 font-semibold">Date</th> : null}
              <th className="px-4 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {detections.map((d) => (
              <tr key={d.id} className="border-t border-border/70">
                <td className="px-4 py-3">
                  <img
                    src={d.imageUrl}
                    alt={`${d.species} footprint`}
                    loading="lazy"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">
                  {d.species}
                </td>
                <td className="px-4 py-3">
                  <StatusChip
                    label={`${d.confidence}%`}
                    tone={d.confidence >= 90 ? "ack" : "medium"}
                  />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.location}</td>
                {showDate ? (
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(d.date)}
                  </td>
                ) : null}
                <td className="px-4 py-3 text-muted-foreground">{d.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {detections.map((d) => (
          <li key={d.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-4">
            <img
              src={d.imageUrl}
              alt={`${d.species} footprint`}
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-semibold text-foreground">
                  {d.species}
                </p>
                <StatusChip
                  label={`${d.confidence}%`}
                  tone={d.confidence >= 90 ? "ack" : "medium"}
                />
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {d.location}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(d.date)} · {d.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
