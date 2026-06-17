import { useState } from "react";
import {
  Headset, Briefcase, AlertTriangle, MessageCircle, Lightbulb, Star, Loader2, ArrowRight,
} from "lucide-react";
import type { SourcesResponse } from "@/lib/psi-mock";
import { fetchSources } from "@/lib/psi-api";
import { Button } from "@/components/ui/button";
import { ErrorPanel } from "./StatusPanels";
import { toast } from "sonner";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  headset: Headset,
  briefcase: Briefcase,
  "alert-triangle": AlertTriangle,
  "message-circle": MessageCircle,
  lightbulb: Lightbulb,
  star: Star,
};

const SOURCE_SKELETON = [
  { id: "support_tickets", label: "Support Tickets", tool: "Zendesk / Freshdesk", icon: "headset" },
  { id: "crm_sales", label: "CRM Sales Requests", tool: "HubSpot / Salesforce", icon: "briefcase" },
  { id: "cs_escalations", label: "CS Escalations", tool: "Gainsight / Vitally", icon: "alert-triangle" },
  { id: "nps_feedback", label: "NPS Feedback", tool: "Delighted / Qualtrics", icon: "message-circle" },
  { id: "product_feedback", label: "Product Feedback", tool: "Canny / Productboard", icon: "lightbulb" },
  { id: "app_reviews", label: "App Reviews", tool: "Play Store / App Store", icon: "star" },
];

interface Props {
  data: SourcesResponse | null;
  setData: (d: SourcesResponse) => void;
  onNext: () => void;
}

export function DataSourcesScreen({ data, setData, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empty = !data;
  const sources = data?.sources ?? SOURCE_SKELETON.map(s => ({ ...s, total_records: 0, preview: [] }));

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSources();
      setData(result);
      toast.success("Sources synced", { description: `${result.total_signals} signals from ${result.sources.length} sources` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to reach the signals API.";
      setError(msg);
      toast.error("Failed to fetch sources", { description: msg });
    } finally {
      setLoading(false);
    }
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

      {error && !loading && (
        <div className="mb-8">
          <ErrorPanel
            title="Couldn't fetch sources"
            message={error}
            onRetry={handleFetch}
          />
        </div>
      )}

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
                    {(s as { last_synced?: string }).last_synced ? `Last synced ${(s as { last_synced?: string }).last_synced}` : "Synced"}
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
          ) : error ? (
            <>Retry Fetch <ArrowRight className="h-4 w-4" /></>
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
