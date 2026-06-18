import type { PrioritizationResponse, SourceData, SourcesResponse, Theme } from "./psi-mock";

const BASE = "https://info15779.n8n-wsk.com/webhook";

export const ENDPOINTS = {
  sources: `${BASE}/fetch-signals`,
  prioritization: `${BASE}/generate-priorities`,
  saveAdjustment: `${BASE}/save-adjustment`,
};

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  // n8n sometimes wraps in an array
  return Array.isArray(data) ? (data[0] as T) : (data as T);
}

// The n8n endpoint returns a flat { records: [...] } stream mixing all signal
// types. We group them into the 6 source buckets the UI expects by detecting
// the discriminator field on each record.
type RawRecord = Record<string, string | number>;
interface RawSourcesResponse {
  total_signals?: number;
  records?: RawRecord[];
  sources?: SourceData[];
}

const SOURCE_DEFS: Array<{
  id: string;
  label: string;
  tool: string;
  icon: string;
  match: (r: RawRecord) => boolean;
}> = [
  { id: "support_tickets",  label: "Support Tickets",     tool: "Zendesk / Freshdesk",     icon: "headset",         match: (r) => "ticket_id" in r },
  { id: "crm_sales",        label: "CRM Sales Requests",  tool: "HubSpot / Salesforce",    icon: "briefcase",       match: (r) => "deal_id" in r },
  { id: "cs_escalations",   label: "CS Escalations",      tool: "Gainsight / Vitally",     icon: "alert-triangle",  match: (r) => "case_id" in r },
  { id: "nps_feedback",     label: "NPS Feedback",        tool: "Delighted / Qualtrics",   icon: "message-circle",  match: (r) => "response_id" in r || "nps_score" in r },
  { id: "product_feedback", label: "Product Feedback",    tool: "Canny / Productboard",    icon: "lightbulb",       match: (r) => "request_id" in r || "feature_request" in r },
  { id: "app_reviews",      label: "App Reviews",         tool: "Play Store / App Store",  icon: "star",            match: (r) => "review_id" in r || "rating" in r },
];

function normalizeSources(raw: RawSourcesResponse): SourcesResponse {
  if (raw.sources && Array.isArray(raw.sources)) {
    return { total_signals: raw.total_signals ?? raw.sources.reduce((n, s) => n + s.total_records, 0), sources: raw.sources };
  }
  const records = raw.records ?? [];
  const sources: SourceData[] = SOURCE_DEFS.map((def) => {
    const matched = records.filter(def.match);
    return {
      id: def.id,
      label: def.label,
      tool: def.tool,
      icon: def.icon,
      total_records: matched.length,
      last_synced: "just now",
      preview: matched.slice(0, 5),
    };
  });
  return { total_signals: raw.total_signals ?? records.length, sources };
}

export async function fetchSources(): Promise<SourcesResponse> {
  const raw = await jsonFetch<RawSourcesResponse>(ENDPOINTS.sources);
  return normalizeSources(raw);
}

export function fetchPrioritization(): Promise<PrioritizationResponse> {
  return jsonFetch<PrioritizationResponse>(ENDPOINTS.prioritization);
}

export interface SaveAdjustmentBody {
  theme_id: string;
  frequency_score: number;
  revenue_score: number;
  customer_score: number;
  churn_score: number;
  strategic_score: number;
}

export function saveAdjustment(
  scores: Theme["scores"],
  themeId: string,
): Promise<{ success: boolean }> {
  const body: SaveAdjustmentBody = {
    theme_id: themeId,
    frequency_score: scores.frequency,
    revenue_score: scores.revenue,
    customer_score: scores.customer,
    churn_score: scores.churn,
    strategic_score: scores.strategic,
  };
  return jsonFetch<{ success: boolean }>(ENDPOINTS.saveAdjustment, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
