import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import FootprintPredictor from "@/components/FootprintPredictor";

export const Route = createFileRoute("/detection")({
  head: () => ({
    meta: [
      { title: "Footprint Recognition | AnimalFootprintAI" },
      {
        name: "description",
        content: "Upload a footprint image and let the AI model identify the animal.",
      },
      { property: "og:title", content: "Footprint Recognition | AnimalFootprintAI" },
      { property: "og:description", content: "AI animal footprint recognition for forest rangers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DetectionPage,
});

function DetectionPage() {
  return (
    <AppShell title="Footprint Detection" subtitle="Upload a footprint image to identify the animal">
      <FootprintPredictor />
      <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-soft">
        <p className="font-semibold text-foreground">Capture guidelines</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Shoot straight down over the print in good daylight.</li>
          <li>Include a scale marker (pen, coin or ruler).</li>
          <li>Avoid shadows and remove leaves covering the outline.</li>
        </ul>
      </div>
    </AppShell>
  );
}
