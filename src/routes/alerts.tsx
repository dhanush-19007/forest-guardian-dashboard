import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellOff } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { AlertCard } from "@/components/AlertCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Review human movement and wildlife alerts by priority, acknowledge them and coordinate patrol response.",
      },
      { property: "og:title", content: "Alerts | Smart Forest Guardian" },
      {
        property: "og:description",
        content: "Poaching and wildlife alerts for Forest Department patrols.",
      },
    ],
  }),
  component: AlertsPage,
});

const filters = ["All", "Animals", "Human", "High Priority"] as const;
type Filter = (typeof filters)[number];

function AlertsPage() {
  const { alerts, acknowledgeAlert } = useApp();
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(() => {
    if (filter === "Animals") return alerts.filter((a) => a.kind === "Animal");
    if (filter === "Human") return alerts.filter((a) => a.kind === "Human");
    if (filter === "High Priority")
      return alerts.filter((a) => a.priority === "High");
    return alerts;
  }, [alerts, filter]);

  return (
    <AppShell title="Alerts" subtitle="Field alerts generated from detections">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            className={cn("rounded-full")}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {visible.map((alert, i) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            index={i}
            onAcknowledge={acknowledgeAlert}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={BellOff}
            title="No alerts in this filter"
            description="Try a different filter or record a new footprint detection."
          />
        </div>
      ) : null}
    </AppShell>
  );
}
