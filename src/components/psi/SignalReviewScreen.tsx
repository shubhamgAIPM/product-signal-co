import { useState } from "react";
import { ChevronDown, ArrowLeft, Sparkles } from "lucide-react";
import type { SourceData, SourcesResponse } from "@/lib/psi-mock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  data: SourcesResponse;
  onBack: () => void;
  onNext: () => void;
}

function sentimentClass(v: string) {
  if (v === "negative") return "bg-destructive/15 text-destructive ring-destructive/30";
  if (v === "positive") return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
  return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
}
function priorityClass(v: string) {
  const x = String(v).toLowerCase();
  if (x === "high" || x === "p0") return "bg-destructive/15 text-destructive ring-destructive/30";
  if (x === "medium" || x === "p1" || x === "p2") return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
  return "bg-muted text-muted-foreground ring-border";
}

function Pill({ children, kind }: { children: React.ReactNode; kind: "sentiment" | "priority" }) {
  const v = String(children);
  const cls = kind === "sentiment" ? sentimentClass(v) : priorityClass(v);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset", cls)}>
      {v}
    </span>
  );
}

function PreviewTable({ source }: { source: SourceData }) {
  const rows = source.preview.slice(0, 5);
  if (rows.length === 0) return null;
  const cols = Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-background/40">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2.5 font-semibold">{c.replace(/_/g, " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border/60 text-foreground/90">
              {cols.map((c) => {
                const v = row[c];
                if (c === "sentiment") return <td key={c} className="px-3 py-2.5"><Pill kind="sentiment">{String(v)}</Pill></td>;
                if (c === "priority") return <td key={c} className="px-3 py-2.5"><Pill kind="priority">{String(v)}</Pill></td>;
                if (c === "arr" || c === "arr_impacted")
                  return <td key={c} className="px-3 py-2.5 font-mono tabular-nums">₹{Number(v).toLocaleString()}</td>;
                if (typeof v === "string" && v.length > 60)
                  return <td key={c} className="px-3 py-2.5 max-w-[28ch] truncate" title={v}>{v}</td>;
                return <td key={c} className="px-3 py-2.5">{String(v)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SignalReviewScreen({ data, onBack, onNext }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(data.sources.map((s, i) => [s.id, i === 0]))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Step 2 of 3
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Signal Review</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Inspect the raw signals before prioritization. Expand each source to preview the structured records the copilot will reason over.
        </p>
      </header>

      <div className="space-y-3">
        {data.sources.map((s) => {
          const isOpen = open[s.id];
          return (
            <section key={s.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-accent/30"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.tool} · <span className="font-mono">{s.total_records}</span> records</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preview 5 of {s.total_records}</span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-border bg-background/30 p-4">
                  <PreviewTable source={s} />
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} size="lg" className="h-12 gap-2 px-6 text-sm font-semibold shadow-[var(--shadow-glow)]">
          <Sparkles className="h-4 w-4" /> Generate Prioritization
        </Button>
      </div>
    </div>
  );
}
