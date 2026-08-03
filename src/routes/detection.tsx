import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ScanSearch, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { UploadBox } from "@/components/UploadBox";
import { DetectionResultCard } from "@/components/DetectionResultCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { footprintAiService } from "@/services/forestApi";
import { useApp } from "@/context/AppContext";
import type { DetectionResult } from "@/utils/types";

export const Route = createFileRoute("/detection")({
  head: () => ({
    meta: [
      { title: "Footprint Detection | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Upload or capture a footprint image and run AI recognition to identify species or human intrusion in the forest.",
      },
      {
        property: "og:title",
        content: "Footprint Detection | Smart Forest Guardian",
      },
      {
        property: "og:description",
        content: "AI footprint recognition workflow for forest rangers.",
      },
    ],
  }),
  component: DetectionPage,
});

function DetectionPage() {
  const { saveDetection } = useApp();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const detect = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const res = await footprintAiService.analyze(file);
    setResult(res);
    setLoading(false);
  };

  const confirmSave = () => {
    if (!result || !preview) return;
    saveDetection(result, preview);
    setConfirmOpen(false);
    toast.success("Detection saved", {
      description: "Alert generated, map marker added and history updated.",
    });
    clear();
    navigate({ to: "/dashboard" });
  };

  return (
    <AppShell
      title="Footprint Detection"
      subtitle="Upload a footprint image to run AI recognition"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="min-w-0">
          {preview ? (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <img
                src={preview}
                alt="Footprint preview"
                className="max-h-80 w-full rounded-xl object-contain"
              />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  className="rounded-full sm:flex-1"
                  onClick={detect}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ScanSearch className="h-4 w-4" />
                  )}
                  {loading ? "Analysing..." : "Detect footprint"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full sm:w-auto"
                  onClick={clear}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
          ) : (
            <UploadBox
              onSelect={(f, url) => {
                setFile(f);
                setPreview(url);
                setResult(null);
              }}
            />
          )}

          <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Capture guidelines</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Shoot straight down over the print in good daylight.</li>
              <li>Include a scale marker (pen, coin or ruler).</li>
              <li>Avoid shadows and remove leaves covering the outline.</li>
            </ul>
          </div>
        </section>

        <section className="min-w-0">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  Running AI footprint recognition...
                </p>
              </div>
              <div className="mt-5 space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
              </div>
            </motion.div>
          ) : result ? (
            <div className="space-y-4">
              <DetectionResultCard result={result} />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="rounded-full sm:flex-1"
                  onClick={() => setConfirmOpen(true)}
                >
                  <CheckCircle2 className="h-4 w-4" /> Save detection
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full sm:w-auto"
                  onClick={clear}
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-56 place-items-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                  <ScanSearch className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  Detection result appears here
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload an image and press Detect to get species, confidence,
                  zone and GPS coordinates.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Save this detection?</AlertDialogTitle>
            <AlertDialogDescription>
              Saving records {result?.species} at {result?.location}, raises a
              new alert and drops a marker on the tracking map.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-full" onClick={confirmSave}>
              Confirm &amp; save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
