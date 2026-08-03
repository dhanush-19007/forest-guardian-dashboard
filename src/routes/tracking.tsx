import { createFileRoute } from "@tanstack/react-router";
import { MapPinned } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { MapPanel } from "@/components/map/MapPanel";
import { EmptyState } from "@/components/EmptyState";
import { StatusChip } from "@/components/StatusChip";
import { useApp } from "@/context/AppContext";
import { FOREST_CENTER, speciesEmoji } from "@/services/mockData";
import { formatDate } from "@/services/forestApi";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Tracking | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Interactive map of last spotted locations for tigers, elephants, leopards, bears and human footprints.",
      },
      { property: "og:title", content: "Tracking | Smart Forest Guardian" },
      {
        property: "og:description",
        content: "Last spotted wildlife and intrusion locations across zones.",
      },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const { markers } = useApp();

  return (
    <AppShell
      title="Tracking"
      subtitle="Last spotted locations across forest zones"
    >
      <MapPanel markers={markers} center={FOREST_CENTER} height="30rem" />

      <section className="mt-6">
        <h2 className="text-base font-bold text-foreground">Recent sightings</h2>
        {markers.length === 0 ? (
          <div className="mt-3">
            <EmptyState icon={MapPinned} title="No sightings recorded yet" />
          </div>
        ) : (
          <ol className="mt-4 space-y-4 border-l-2 border-border pl-5">
            {markers.slice(0, 10).map((m) => (
              <li key={m.id} className="relative">
                <span className="absolute top-3 -left-[1.7rem] grid h-6 w-6 place-items-center rounded-full bg-card text-xs ring-2 ring-border">
                  {speciesEmoji[m.species]}
                </span>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                      {m.species}
                    </p>
                    <StatusChip
                      label={m.zone}
                      tone={
                        m.species === "Human Footprint" ? "high" : "neutral"
                      }
                    />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {m.location}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {m.coordinates.lat}, {m.coordinates.lng} ·{" "}
                    {formatDate(m.date)} · {m.time}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </AppShell>
  );
}
