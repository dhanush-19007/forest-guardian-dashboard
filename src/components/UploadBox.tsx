import { useCallback, useRef, useState } from "react";
import { Camera, ImageUp, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadBox({
  onSelect,
  disabled,
}: {
  onSelect: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file?: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;
      onSelect(file, URL.createObjectURL(file));
    },
    [onSelect],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "rounded-2xl border-2 border-dashed border-border bg-muted/40 px-4 py-10 text-center transition-colors sm:px-8 sm:py-14",
        dragging && "border-secondary bg-secondary/10",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <UploadCloud className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">
        Drag &amp; drop a footprint image
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        JPG or PNG, captured close to the print with a scale reference.
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Button
          type="button"
          className="w-full rounded-full sm:w-auto"
          onClick={() => inputRef.current?.click()}
        >
          <ImageUp className="h-4 w-4" /> Browse image
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full sm:w-auto"
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className="h-4 w-4" /> Capture with camera
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
