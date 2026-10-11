import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertTriangle, ImageUp, Loader2, PawPrint, RefreshCw, ScanSearch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { predictFootprint, isAbortError } from "@/api/animalAiApi";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

export default function FootprintPredictor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const choose = (f?: File | null) => {
    setResult(null);
    setError("");
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("Unsupported file type. Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("This image is larger than 10 MB. Please choose a smaller file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const remove = () => {
    abortRef.current?.abort();
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    if (!file) {
      setError("Choose a footprint image first.");
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await predictFootprint(file, controller.signal);
      setResult(data.animal);
    } catch (err) {
      if (!isAbortError(err)) setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  };

  return (
    <section aria-labelledby="fp-title" className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <PawPrint className="h-5 w-5" />
        </span>
        <div>
          <h2 id="fp-title" className="text-base font-semibold text-foreground">Animal Footprint Recognition</h2>
          <p className="text-sm text-muted-foreground">Upload a footprint photo and let the AI identify the animal.</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="min-w-0">
          <input
            ref={inputRef}
            id="footprint"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => choose(e.target.files?.[0])}
            disabled={loading}
          />
          {preview ? (
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <img src={preview} alt="Selected footprint preview" className="max-h-72 w-full rounded-lg object-contain" />
              <p className="mt-2 truncate text-xs text-muted-foreground">{file?.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => inputRef.current?.click()} disabled={loading}>
                  <ImageUp className="h-4 w-4" /> Change image
                </Button>
                <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={remove}>
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="footprint"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]); }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                dragging && "border-secondary bg-secondary/10",
              )}
            >
              <ImageUp className="h-8 w-8 text-primary" />
              <span className="mt-3 text-sm font-semibold text-foreground">Choose a footprint image</span>
              <span className="mt-1 text-xs text-muted-foreground">Click or drag & drop · JPG, PNG, WebP · up to 10 MB</span>
            </label>
          )}

          <Button type="submit" className="mt-4 w-full rounded-full" disabled={loading || !file} aria-busy={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Identify Animal"}
          </Button>
        </div>

        <div className="min-w-0" aria-live="polite">
          {loading ? (
            <div className="grid h-full min-h-48 place-items-center rounded-xl border border-border bg-muted/30 p-6 text-center">
              <div>
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
                <p className="mt-3 text-sm font-medium text-foreground">Analyzing...</p>
                <p className="text-xs text-muted-foreground">Waiting for the AI model's answer.</p>
              </div>
            </div>
          ) : error ? (
            <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Prediction failed</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                  {file && (
                    <Button type="button" size="sm" variant="outline" className="mt-3 rounded-full" onClick={() => submit()}>
                      <RefreshCw className="h-4 w-4" /> Try again
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Identified animal</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result}</p>
              <p className="mt-2 text-xs text-muted-foreground">Result returned by the AI recognition service.</p>
            </div>
          ) : (
            <div className="grid h-full min-h-48 place-items-center rounded-xl border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">The prediction will appear here after you press Identify Animal.</p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
