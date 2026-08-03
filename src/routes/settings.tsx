import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Manage officer profile, department details, notification preferences and project information.",
      },
      { property: "og:title", content: "Settings | Smart Forest Guardian" },
      {
        property: "og:description",
        content: "Officer profile and preferences for the forest portal.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { officer, updateOfficer, notifications, setNotifications } = useApp();

  return (
    <AppShell title="Settings" subtitle="Profile and application preferences">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-bold text-foreground">Officer profile</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Officer name</Label>
              <Input
                id="name"
                className="h-11 rounded-xl"
                value={officer?.name ?? ""}
                onChange={(e) => updateOfficer({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dept">Department</Label>
              <Input
                id="dept"
                className="h-11 rounded-xl"
                value={officer?.department ?? ""}
                onChange={(e) => updateOfficer({ department: e.target.value })}
              />
            </div>
            <Button
              className="rounded-full"
              onClick={() => toast.success("Profile updated")}
            >
              Save changes
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-bold text-foreground">Preferences</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Alert notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Push alerts for new human movement detections.
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">
                  Forest Department standard (light).
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Forest Green
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="text-base font-bold text-foreground">About project</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Smart Forest Guardian is a final year engineering project that uses
            AI-powered footprint recognition to identify wildlife species and
            suspicious human movement inside protected forest zones. Detections
            raise alerts, update the last-spotted map and build a searchable
            surveillance record for Forest Department officials.
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Version", v: "1.0.0 (Frontend)" },
              { k: "Backend", v: "Spring Boot REST (planned)" },
              { k: "ML Model", v: "Footprint CNN (planned)" },
            ].map((item) => (
              <div key={item.k} className="rounded-xl bg-muted/50 px-4 py-3">
                <dt className="text-xs text-muted-foreground">{item.k}</dt>
                <dd className="text-sm font-semibold text-foreground">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </AppShell>
  );
}
