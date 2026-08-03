import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Cctv,
  Video,
  Footprints,
  PawPrint,
  UserRoundSearch,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/layouts/AppShell";
import { SummaryCard } from "@/components/SummaryCard";
import { AlertCard } from "@/components/AlertCard";
import { DetectionTable } from "@/components/DetectionTable";
import { MapPanel } from "@/components/map/MapPanel";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { FOREST_CENTER, weeklyTrend } from "@/services/mockData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Live overview of animal detections, human movement alerts and last spotted locations across forest zones.",
      },
      { property: "og:title", content: "Dashboard | Smart Forest Guardian" },
      {
        property: "og:description",
        content:
          "Forest Department dashboard for wildlife detections and poaching alerts.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { stats, alerts, detections, markers, acknowledgeAlert } = useApp();

  return (
    <AppShell
      title="Dashboard"
      subtitle="Forest surveillance overview — updated live"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          index={0}
          label="Total Animal Detections"
          value={stats.totalAnimals}
          icon={PawPrint}
          hint="All recorded wildlife prints"
        />
        <SummaryCard
          index={1}
          label="Human Movement Alerts"
          value={stats.humanAlerts}
          icon={UserRoundSearch}
          tone="danger"
          hint="Possible poaching activity"
        />
        <SummaryCard
          index={2}
          label="Active Alerts"
          value={stats.activeAlerts}
          icon={Bell}
          tone="warning"
          hint="Awaiting acknowledgement"
        />
        <SummaryCard
          index={3}
          label="Today's Detections"
          value={stats.today}
          icon={Activity}
          tone="secondary"
          hint="Recorded in current shift"
        />
        <SummaryCard
          index={4}
          label="Camera Detections Today"
          value={stats.cameraDetectionsToday}
          icon={Cctv}
          tone="secondary"
          hint="Captured by forest CCTV"
        />
        <SummaryCard
          index={5}
          label="Cameras Online"
          value={`${stats.camerasOnline}/${stats.camerasTotal}`}
          icon={Video}
          hint="Live surveillance coverage"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft xl:col-span-2">
          <h2 className="text-base font-bold text-foreground">
            Weekly detection trend
          </h2>
          <p className="text-xs text-muted-foreground">
            Animal vs human footprint activity
          </p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="animals"
                  name="Animal"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="human"
                  name="Human"
                  fill="var(--chart-4)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-foreground">Recent alerts</h2>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/alerts">View all</Link>
            </Button>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            {alerts.slice(0, 4).map((alert, i) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={i}
                onAcknowledge={acknowledgeAlert}
              />
            ))}
            {alerts.length === 0 ? (
              <EmptyState icon={Bell} title="No alerts yet" />
            ) : null}
          </div>
        </section>
      </div>

      <section className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-foreground">
            Last spotted locations
          </h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/tracking">Open tracking</Link>
          </Button>
        </div>
        <div className="mt-3">
          <MapPanel markers={markers} center={FOREST_CENTER} height="22rem" />
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-foreground">
            Recent detection history
          </h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/history">Full history</Link>
          </Button>
        </div>
        <div className="mt-3">
          {detections.length ? (
            <DetectionTable detections={detections.slice(0, 5)} />
          ) : (
            <EmptyState
              icon={Footprints}
              title="No detections recorded"
              description="Upload a footprint image to create the first record."
            />
          )}
        </div>
      </section>
    </AppShell>
  );
}
