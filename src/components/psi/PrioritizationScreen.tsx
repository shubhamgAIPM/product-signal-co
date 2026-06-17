import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Printer, AlertOctagon, Zap, MinusCircle, Save, Loader2, CheckCircle2 } from "lucide-react";
import type { Priority, PrioritizationResponse, Theme } from "@/lib/psi-mock";
import { fetchPrioritization, saveAdjustment } from "@/lib/psi-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingPanel, ErrorPanel } from "./StatusPanels";
import { toast } from "sonner";

interface Props { onBack: () => void; }

const SCORE_DIMS: Array<{ key: keyof Theme["scores"]; label: string; max: number }> = [
  { key: "frequency", label: "Frequency", max: 25 },
  { key: "revenue", label: "Revenue", max: 30 },
  { key: "customer", label: "Customer", max: 20 },
  { key: "churn", label: "Churn", max: 20 },
  { key: "strategic", label: "Strategic", max: 5 },
];

const PRIORITY_META: Record<Priority, { label: string; ring: string; bg: string; text: string; dot: string }> = {
  P0: { label: "P0 · Critical", ring: "ring-[color:var(--p0)]/40", bg: "bg-[color:var(--p0)]/15", text: "text-[color:var(--p0)]", dot: "bg-[color:var(--p0)]" },
  P1: { label: "P1 · High",     ring: "ring-[color:var(--p1)]/40", bg: "bg-[color:var(--p1)]/15", text: "text-[color:var(--p1)]", dot: "bg-[color:var(--p1)]" },
  P2: { label: "P2 · Medium",   ring: "ring-[color:var(--p2)]/40", bg: "bg-[color:var(--p2)]/15", text: "text-[color:var(--p2)]", dot: "bg-[color:var(--p2)]" },
  P3: { label: "P3 · Low",      ring: "ring-[color:var(--p3)]/40", bg: "bg-[color:var(--p3)]/20", text: "text-[color:var(--p3)]", dot: "bg-[color:var(--p3)]" },
};

function computePriority(total: number): Priority {
  if (total >= 75) return "P0";
  if (total >= 55) return "P1";
  if (total >= 35) return "P2";
  return "P3";
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset", m.bg, m.text, m.ring)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

function ScoreSlider({
  label, value, max, onChange,
}: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums text-foreground">
          <span className="font-semibold">{value}</span><span className="text-muted-foreground"> / {max}</span>
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-glow"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground
            [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_var(--background),0_0_0_4px_var(--primary)]
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:active:scale-110
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground"
        />
      </div>
    </div>
  );
}

function ThemeCard({ theme }: { theme: Theme }) {
  const [scores, setScores] = useState(theme.scores);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const total = useMemo(() => {
    return Math.min(scores.frequency + scores.revenue + scores.customer + scores.churn + scores.strategic, 100);
  }, [scores]);
  const priority = computePriority(total);

  const handleChange = (key: keyof Theme["scores"], v: number) => {
    setScores((s) => ({ ...s, [key]: v }));
    setDirty(true);
    setSavedAt(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await saveAdjustment(scores, theme.theme_id);
      if (!res?.success) throw new Error("API did not confirm success");
      setSavedAt(Date.now());
      setDirty(false);
      toast.success(`Saved · ${theme.theme_name}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setSaveError(msg);
      toast.error(`Couldn't save ${theme.theme_name}`, { description: msg });
    } finally {
      setSaving(false);
    }
  };

  const justSaved = savedAt !== null && !dirty;

  return (
    <article className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-6 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">{theme.theme_name}</h3>
            {dirty && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary/30">Adjusted</span>}
            {justSaved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> Saved
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{theme.problem_statement}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-4xl font-semibold tabular-nums text-foreground">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-border bg-background/30 p-5 md:grid-cols-2 xl:grid-cols-5">
        {SCORE_DIMS.map((d) => (
          <ScoreSlider key={d.key} label={d.label} max={d.max} value={scores[d.key]} onChange={(v) => handleChange(d.key, v)} />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <PriorityBadge priority={priority} />
          {saveError && (
            <span className="text-[11px] text-destructive">Save failed — retry</span>
          )}
        </div>
        <Button
          size="sm"
          variant={dirty || saveError ? "default" : "secondary"}
          disabled={!dirty || saving}
          onClick={handleSave}
          className="gap-1.5"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {saving ? "Saving…" : justSaved ? "Saved" : saveError ? "Retry Save" : "Save Adjustment"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden border-t border-border bg-border/60 md:grid-cols-4">
        {[
          { label: "Signal Count", value: theme.signal_count.toLocaleString() },
          { label: "ARR Impacted", value: `₹${theme.arr_impacted.toLocaleString()}` },
          { label: "Priority", value: priority },
          { label: "Impact Score", value: total },
        ].map((s) => (
          <div key={s.label} className="bg-card px-5 py-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
        {[
          { label: "Recommendation", body: theme.recommendation },
          { label: "Why Now", body: theme.why_now },
          { label: "Expected Impact", body: theme.expected_impact },
        ].map((p) => (
          <div key={p.label} className="rounded-lg border border-border bg-background/40 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.label}</div>
            <p className="mt-1.5 text-sm text-foreground/90">{p.body}</p>
          </div>
        ))}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Trade-offs</div>
          <p className="mt-1.5 text-sm text-foreground/90">{theme.tradeoffs}</p>
        </div>
      </div>
    </article>
  );
}

export function PrioritizationScreen({ onBack }: Props) {
  const [data, setData] = useState<PrioritizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPrioritization();
      setData(res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to reach the prioritization API.";
      setError(msg);
      toast.error("Failed to generate prioritization", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data && !loading && !error) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const priorities: Priority[] = ["P0", "P1", "P2", "P3"];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Step 3 of 3
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Prioritization Output</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Theme-level recommendations with adjustable scores. Tune any input to instantly recompute priority.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button variant="secondary" onClick={() => window.print()} disabled={!data} className="gap-2">
            <Printer className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {loading && <LoadingPanel label="Generating prioritization from latest signals…" />}
      {!loading && error && (
        <ErrorPanel
          title="Couldn't generate prioritization"
          message={error}
          onRetry={load}
        />
      )}

      {data && !loading && !error && (
        <>
          {/* Executive summary */}
          <section
            className="overflow-hidden rounded-2xl border border-border p-6 shadow-[var(--shadow-card)]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">Executive Summary</div>
            <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: "Total Themes", value: data.executive_summary.total_themes },
                { label: "Signals Analyzed", value: data.executive_summary.total_signals },
                { label: "ARR Impacted", value: `₹${data.executive_summary.total_arr_impacted.toLocaleString()}` },
                { label: "Critical Issues", value: data.executive_summary.critical_themes.length },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-primary-foreground/70">{s.label}</div>
                  <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-primary-foreground">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { icon: AlertOctagon, label: "Critical Themes", items: data.executive_summary.critical_themes, tone: "text-red-300" },
                { icon: Zap, label: "Quick Wins", items: data.executive_summary.quick_wins, tone: "text-emerald-300" },
                { icon: MinusCircle, label: "Low Priority — Ignore", items: data.executive_summary.low_priority_to_ignore, tone: "text-muted-foreground" },
              ].map((panel) => (
                <div key={panel.label} className="rounded-xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                  <div className={cn("flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider", panel.tone)}>
                    <panel.icon className="h-3.5 w-3.5" />
                    {panel.label}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-primary-foreground">
                    {panel.items.map((t) => <li key={t} className="truncate">· {t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Themes grouped by priority */}
          <div className="mt-10 space-y-10">
            {priorities.map((p) => {
              const themes = data.prioritization[p] ?? [];
              if (themes.length === 0) return null;
              return (
                <section key={p}>
                  <div className="mb-4 flex items-center gap-3">
                    <PriorityBadge priority={p} />
                    <span className="text-xs text-muted-foreground">
                      {themes.length} {themes.length === 1 ? "theme" : "themes"}
                    </span>
                    <div className={cn("h-px flex-1", "bg-border")} />
                  </div>
                  <div className="space-y-5">
                    {themes.map((t) => <ThemeCard key={t.theme_id} theme={t} />)}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
