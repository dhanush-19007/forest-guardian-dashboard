import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Search, Footprints } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { DetectionTable } from "@/components/DetectionTable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { SPECIES_LIST } from "@/services/mockData";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Detection History | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Searchable record of every footprint detection with species, confidence, location, date and time.",
      },
      {
        property: "og:title",
        content: "Detection History | Smart Forest Guardian",
      },
      {
        property: "og:description",
        content: "Complete footprint detection archive for forest officials.",
      },
    ],
  }),
  component: HistoryPage,
});

const PAGE_SIZE = 5;

function HistoryPage() {
  const { detections } = useApp();
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState("all");
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = detections.filter((d) => {
      const matchesQuery =
        !q ||
        d.species.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q);
      const matchesSpecies = species === "all" || d.species === species;
      return matchesQuery && matchesSpecies;
    });
    return [...rows].sort((a, b) => {
      const av = `${a.date} ${a.time}`;
      const bv = `${b.date} ${b.time}`;
      return desc ? bv.localeCompare(av) : av.localeCompare(bv);
    });
  }, [detections, query, species, desc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <AppShell
      title="Detection History"
      subtitle={`${filtered.length} record${filtered.length === 1 ? "" : "s"} found`}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative min-w-0">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search species, zone or record ID"
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <Select
          value={species}
          onValueChange={(v) => {
            setSpecies(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-11 min-w-40 rounded-xl">
            <SelectValue placeholder="Species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All species</SelectItem>
            {SPECIES_LIST.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="h-11 rounded-xl"
          onClick={() => setDesc((d) => !d)}
        >
          <ArrowUpDown className="h-4 w-4" />
          {desc ? "Newest first" : "Oldest first"}
        </Button>
      </div>

      <div className="mt-5">
        {rows.length ? (
          <DetectionTable detections={rows} />
        ) : (
          <EmptyState
            icon={Footprints}
            title="No matching detections"
            description="Adjust your search or species filter to see more records."
          />
        )}
      </div>

      {filtered.length > PAGE_SIZE ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {current} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
