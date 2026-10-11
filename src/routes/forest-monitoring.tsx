import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import ForestDashboard from "@/components/ForestDashboard";

export const Route = createFileRoute("/forest-monitoring")({
  head: () => ({
    meta: [
      { title: "Forest Monitoring | AnimalFootprintAI" },
      { name: "description", content: "Live forest status from the YOLO-World border detection system." },
      { property: "og:title", content: "Forest Monitoring | AnimalFootprintAI" },
      { property: "og:description", content: "Live SAFE / DETECTED / NEAR / ALERT forest status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppShell title="Forest Monitoring" subtitle="Live status from the border detection system">
      <ForestDashboard />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["SAFE", "Forest area is clear."],
          ["DETECTED", "A detection has been reported."],
          ["NEAR", "A nearby detection has been reported."],
          ["ALERT", "An alert has been reported."],
        ].map(([s, d]) => (
          <div key={s} className="rounded-xl border border-border bg-card p-4 text-sm shadow-soft">
            <p className="font-semibold text-foreground">{s}</p>
            <p className="text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </AppShell>
  ),
});
