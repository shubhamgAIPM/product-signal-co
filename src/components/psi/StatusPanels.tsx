import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingPanel({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card/60 px-6 py-16">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function ErrorPanel({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive ring-1 ring-destructive/30">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 max-w-md text-xs text-muted-foreground">{message}</div>
      </div>
      <Button size="sm" variant="secondary" onClick={onRetry} className="mt-2 gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );
}
