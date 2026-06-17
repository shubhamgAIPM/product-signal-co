import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "lucide-react";
import { DataSourcesScreen } from "@/components/psi/DataSourcesScreen";
import { SignalReviewScreen } from "@/components/psi/SignalReviewScreen";
import { PrioritizationScreen } from "@/components/psi/PrioritizationScreen";
import type { SourcesResponse } from "@/lib/psi-mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Product Signal Intelligence Copilot — Chalo Insights" },
      { name: "description", content: "AI-native PM workspace that synthesizes support, CRM, NPS and review signals into prioritized product themes for State Transport Undertakings." },
      { property: "og:title", content: "Product Signal Intelligence Copilot" },
      { property: "og:description", content: "From raw signals to a prioritized roadmap in three steps." },
    ],
  }),
  component: App,
});

type Screen = "sources" | "review" | "output";

const STEPS: Array<{ id: Screen; label: string }> = [
  { id: "sources", label: "Data Sources" },
  { id: "review", label: "Signal Review" },
  { id: "output", label: "Prioritization" },
];

function App() {
  const [screen, setScreen] = useState<Screen>("sources");
  const [sources, setSources] = useState<SourcesResponse | null>(null);

  const activeIdx = STEPS.findIndex((s) => s.id === screen);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ backgroundImage: "var(--gradient-hero)", backgroundRepeat: "no-repeat", backgroundSize: "100% 600px" }}
    >
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl no-print">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Activity className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight">Signal Copilot</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">/ Chalo Insights</span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-lg border border-border bg-card p-1 md:flex">
            {STEPS.map((s, i) => {
              const active = s.id === screen;
              const disabled = s.id !== "sources" && !sources;
              return (
                <button
                  key={s.id}
                  disabled={disabled}
                  onClick={() => setScreen(s.id)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    disabled && "opacity-40 cursor-not-allowed hover:text-muted-foreground",
                  )}
                >
                  <span className="mr-1.5 font-mono text-[10px] opacity-60">0{i + 1}</span>
                  {s.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="font-mono">Step {activeIdx + 1}/3</span>
          </div>
        </div>
      </header>

      <main>
        {screen === "sources" && (
          <DataSourcesScreen data={sources} setData={setSources} onNext={() => setScreen("review")} />
        )}
        {screen === "review" && sources && (
          <SignalReviewScreen data={sources} onBack={() => setScreen("sources")} onNext={() => setScreen("output")} />
        )}
        {screen === "output" && (
          <PrioritizationScreen onBack={() => setScreen("review")} />
        )}
      </main>
    </div>
  );
}
