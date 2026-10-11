import { useCallback, useEffect, useRef, useState } from "react";
import { AlertOctagon, AlertTriangle, HelpCircle, Loader2, Radar, RefreshCw, ShieldCheck, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getForestStatus, isAbortError, type ForestStatus, type ForestStatusValue } from "@/api/animalAiApi";
import { cn } from "@/lib/utils";

const POLL_MS = 5000;

const STATUS_UI: Record<ForestStatusValue, { label: string; desc: string; icon: typeof ShieldCheck; tone: string }> = {
  SAFE: { label: "Safe", desc: "Forest area is clear.", icon: ShieldCheck, tone: "border-primary/40 bg-primary/10 text-primary" },
  DETECTED: { label: "Detected", desc: "A detection has been reported.", icon: Radar, tone: "border-warning/50 bg-warning/15 text-warning-foreground" },
  NEAR: { label: "Near", desc: "A nearby detection has been reported.", icon: AlertTriangle, tone: "border-warning/60 bg-warning/25 text-warning-foreground" },
  ALERT: { label: "Alert", desc: "An alert has been reported.", icon: Siren, tone: "border-destructive/50 bg-destructive/10 text-destructive" },
  UNKNOWN: { label: "Unknown", desc: "The server reported a status this app does not recognise.", icon: HelpCircle, tone: "border-border bg-muted text-muted-foreground" },
};

export default function ForestDashboard({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<ForestStatus | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const inFlight = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    if (inFlight.current) return; // avoid overlapping requests
    const controller = new AbortController();
    inFlight.current = controller;
    setRefreshing(true);
    try {
      const res = await getForestStatus(controller.signal);
      if (!mounted.current) return;
      setData(res);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      if (!mounted.current || isAbortError(err)) return;
      setError(err instanceof Error ? err.message : "Could not load forest status.");
    } finally {
      inFlight.current = null;
      if (mounted.current) {
        setRefreshing(false);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [load]);

  const ui = data ? STATUS_UI[data.status] : null;

  return (
    <section aria-labelledby="forest-title" className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="forest-title" className="text-base font-semibold text-foreground">Forest Monitoring Status</h2>
          <p className="text-sm text-muted-foreground">Live status from the detection system · refreshes every 5 seconds</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full" onClick={load} disabled={refreshing}>
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} /> Refresh Status
        </Button>
      </div>

      <div className="mt-5" aria-live="polite">
        {loading && !data ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-5">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm text-foreground">Loading forest status...</p>
          </div>
        ) : data && ui ? (
          <div className={cn("flex items-start gap-4 rounded-xl border p-5", ui.tone)}>
            <ui.icon className={cn("shrink-0", compact ? "h-8 w-8" : "h-10 w-10")} aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Current status</p>
              <p className="text-2xl font-bold">
                {data.status === "UNKNOWN" ? `Unknown (${data.rawStatus})` : data.status}
              </p>
              <p className="mt-1 text-sm text-foreground">{data.message || ui.desc}</p>
            </div>
          </div>
        ) : null}

        {error && (
          <div role="alert" className="mt-3 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
            <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-foreground">{data ? "Latest refresh failed" : "Forest status unavailable"}</p>
              <p className="text-muted-foreground">
                {error}
                {data && " Showing the last status received."}
              </p>
              <Button size="sm" variant="outline" className="mt-2 rounded-full" onClick={load} disabled={refreshing}>
                <RefreshCw className="h-4 w-4" /> Retry
              </Button>
            </div>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Last successful update:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString() : "not yet received"}
        </p>
      </div>
    </section>
  );
}
