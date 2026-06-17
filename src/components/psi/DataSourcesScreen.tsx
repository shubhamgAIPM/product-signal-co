import { useState } from "react";
import {
  Headset, Briefcase, AlertTriangle, MessageCircle, Lightbulb, Star, Loader2, ArrowRight,
} from "lucide-react";
import { MOCK_SOURCES, type SourcesResponse } from "@/lib/psi-mock";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  headset: Headset,
  briefcase: Briefcase,
  "alert-triangle": AlertTriangle,
  "message-circle": MessageCircle,
  lightbulb: Lightbulb,
  star: Star,
};

interface Props {
  data: SourcesResponse | null;
  setData: (d: SourcesResponse) => void;
  onNext: () => void;
}

export function DataSourcesScreen({ data, setData, onNext }: Props) {
  const [loading, setLoading] = useState(false);

  const empty = !data;
  const sources = data?.sources ?? MOCK_SOURCES.sources.map(s => ({ ...s, total_records: 0, last_synced: undefined }));

  const handleFetch = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setData(MOCK_SOURCES);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Step 1 of 3
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Data Sources</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pull the latest signals from every customer touchpoint. The copilot ingests support, sales, success, and voice-of-customer streams in one pass.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => {
          const Icon = ICONS[s.icon] ?? Headset;
          const populated = !empty && s.total_records > 0;
          return (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                {populated && (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Last synced {s.last_synced}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.tool}</div>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                {populated ? (
                  <>
                    <span className="font-mono text-4xl font-semibold tabular-nums text-foreground">
                      {s.total_records.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">records</span>
                  </>
                ) : loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching…
                  </div>
                ) : (
                  <div className="h-10 w-24 rounded-md bg-muted/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={data ? onNext : handleFetch}
          disabled={loading}
          className="h-12 gap-2 px-6 text-sm font-semibold shadow-[var(--shadow-glow)]"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Fetching sources…</>
          ) : data ? (
            <>Continue to Signal Review <ArrowRight className="h-4 w-4" /></>
          ) : (
            <>Fetch All Sources <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
        {data && (
          <div className="text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">{data.total_signals}</span> signals across {data.sources.length} sources
          </div>
        )}
      </div>
    </div>
  );
}
