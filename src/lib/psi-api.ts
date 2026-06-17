import type { PrioritizationResponse, SourcesResponse, Theme } from "./psi-mock";

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

export function fetchSources(): Promise<SourcesResponse> {
  return jsonFetch<SourcesResponse>(ENDPOINTS.sources);
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
