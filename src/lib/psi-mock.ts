export type Priority = "P0" | "P1" | "P2" | "P3";

export interface SourcePreviewRow {
  [key: string]: string | number;
}

export interface SourceData {
  id: string;
  label: string;
  tool: string;
  icon: string;
  total_records: number;
  last_synced?: string;
  preview: SourcePreviewRow[];
}

export interface SourcesResponse {
  total_signals: number;
  sources: SourceData[];
}

export interface Theme {
  theme_id: string;
  theme_name: string;
  problem_statement: string;
  signal_count: number;
  arr_impacted: number;
  priority: Priority;
  total_score: number;
  is_adjusted: boolean;
  scores: {
    frequency: number;
    revenue: number;
    customer: number;
    churn: number;
    strategic: number;
  };
  recommendation: string;
  why_now: string;
  expected_impact: string;
  tradeoffs: string;
}

export interface PrioritizationResponse {
  executive_summary: {
    total_themes: number;
    total_signals: number;
    total_arr_impacted: number;
    critical_themes: string[];
    quick_wins: string[];
    low_priority_to_ignore: string[];
  };
  prioritization: Record<Priority, Theme[]>;
}

export const MOCK_SOURCES: SourcesResponse = {
  total_signals: 130,
  sources: [
    {
      id: "support_tickets",
      label: "Support Tickets",
      tool: "Zendesk / Freshdesk",
      icon: "headset",
      total_records: 30,
      last_synced: "2 min ago",
      preview: [
        { ticket_id: "TKT-001", customer_name: "BMTC", segment: "Enterprise", arr: 7200, issue: "Daily ridership export fails for routes >500", sentiment: "negative", priority: "high" },
        { ticket_id: "TKT-002", customer_name: "MSRTC", segment: "Enterprise", arr: 12400, issue: "PDF reports missing depot-level breakdown", sentiment: "negative", priority: "high" },
        { ticket_id: "TKT-003", customer_name: "APSRTC", segment: "Enterprise", arr: 9800, issue: "Schedule adherence widget shows stale data", sentiment: "negative", priority: "medium" },
        { ticket_id: "TKT-004", customer_name: "KSRTC", segment: "Mid-Market", arr: 4200, issue: "Cannot filter by conductor ID", sentiment: "neutral", priority: "medium" },
        { ticket_id: "TKT-005", customer_name: "TSRTC", segment: "Enterprise", arr: 8600, issue: "Mobile app crashes on weekly summary", sentiment: "negative", priority: "high" },
      ],
    },
    {
      id: "crm_sales",
      label: "CRM Sales Requests",
      tool: "HubSpot / Salesforce",
      icon: "briefcase",
      total_records: 22,
      last_synced: "5 min ago",
      preview: [
        { deal_id: "DL-201", account: "GSRTC", segment: "Enterprise", arr: 11000, request: "SSO with state IT directory required for procurement", priority: "high", stage: "Negotiation" },
        { deal_id: "DL-202", account: "UPSRTC", segment: "Enterprise", arr: 15200, request: "Custom RTI compliance report module", priority: "high", stage: "Discovery" },
        { deal_id: "DL-203", account: "RSRTC", segment: "Mid-Market", arr: 5400, request: "Hindi language support for depot supervisors", priority: "medium", stage: "Proposal" },
        { deal_id: "DL-204", account: "OSRTC", segment: "Mid-Market", arr: 4800, request: "Bulk CSV export of monthly KPIs", priority: "medium", stage: "Negotiation" },
        { deal_id: "DL-205", account: "HRTC", segment: "Mid-Market", arr: 3900, request: "Mobile-first depot incharge dashboard", priority: "high", stage: "Discovery" },
      ],
    },
    {
      id: "cs_escalations",
      label: "CS Escalations",
      tool: "Gainsight / Vitally",
      icon: "alert-triangle",
      total_records: 14,
      last_synced: "1 min ago",
      preview: [
        { escalation_id: "ESC-301", account: "MSRTC", csm: "Priya N.", arr: 12400, summary: "Threatening churn over export reliability", sentiment: "negative", priority: "high" },
        { escalation_id: "ESC-302", account: "BMTC", csm: "Arjun K.", arr: 7200, summary: "Board review needs depot-wise PDF by Friday", sentiment: "negative", priority: "high" },
        { escalation_id: "ESC-303", account: "APSRTC", csm: "Sneha R.", arr: 9800, summary: "Schedule sync delays causing morning standup gaps", sentiment: "negative", priority: "medium" },
        { escalation_id: "ESC-304", account: "TSRTC", csm: "Vikram S.", arr: 8600, summary: "Mobile app stability blocking field rollout", sentiment: "negative", priority: "high" },
        { escalation_id: "ESC-305", account: "KSRTC", csm: "Priya N.", arr: 4200, summary: "Slow query times on ridership trends", sentiment: "neutral", priority: "medium" },
      ],
    },
    {
      id: "nps_feedback",
      label: "NPS Feedback",
      tool: "Delighted / Qualtrics",
      icon: "message-circle",
      total_records: 28,
      last_synced: "8 min ago",
      preview: [
        { response_id: "NPS-401", account: "MSRTC", role: "GM Operations", score: 3, verbatim: "Reports are powerful but exporting is painful", sentiment: "negative" },
        { response_id: "NPS-402", account: "BMTC", role: "Depot Manager", score: 4, verbatim: "Need depot-level drill-down in PDF", sentiment: "negative" },
        { response_id: "NPS-403", account: "GSRTC", role: "CMD Office", score: 6, verbatim: "Useful for board reviews, mobile is weak", sentiment: "neutral" },
        { response_id: "NPS-404", account: "APSRTC", role: "Analyst", score: 8, verbatim: "Great dashboards, sync is occasionally stale", sentiment: "positive" },
        { response_id: "NPS-405", account: "TSRTC", role: "Field Officer", score: 2, verbatim: "Mobile keeps crashing on 4G", sentiment: "negative" },
      ],
    },
    {
      id: "product_feedback",
      label: "Product Feedback",
      tool: "Canny / Productboard",
      icon: "lightbulb",
      total_records: 19,
      last_synced: "12 min ago",
      preview: [
        { feedback_id: "FB-501", account: "BMTC", upvotes: 24, title: "Scheduled PDF email digest for depot heads", category: "Reporting", priority: "high" },
        { feedback_id: "FB-502", account: "MSRTC", upvotes: 19, title: "Excel export with raw rows, not just summary", category: "Reporting", priority: "high" },
        { feedback_id: "FB-503", account: "APSRTC", upvotes: 11, title: "Dark mode for control room screens", category: "UX", priority: "low" },
        { feedback_id: "FB-504", account: "TSRTC", upvotes: 17, title: "Offline mode for depot mobile app", category: "Mobile", priority: "medium" },
        { feedback_id: "FB-505", account: "HRTC", upvotes: 9, title: "Hindi locale across all dashboards", category: "Localization", priority: "medium" },
      ],
    },
    {
      id: "app_reviews",
      label: "App Reviews",
      tool: "Play Store / App Store",
      icon: "star",
      total_records: 17,
      last_synced: "15 min ago",
      preview: [
        { review_id: "RV-601", store: "Play Store", rating: 2, verbatim: "Crashes when I open weekly report", sentiment: "negative" },
        { review_id: "RV-602", store: "Play Store", rating: 3, verbatim: "Slow on Jio network in remote depots", sentiment: "negative" },
        { review_id: "RV-603", store: "App Store", rating: 4, verbatim: "Charts are clear, export is missing", sentiment: "neutral" },
        { review_id: "RV-604", store: "Play Store", rating: 1, verbatim: "Cannot login after last update", sentiment: "negative" },
        { review_id: "RV-605", store: "Play Store", rating: 5, verbatim: "Best tool for our depot reviews", sentiment: "positive" },
      ],
    },
  ],
};

export const MOCK_PRIORITIZATION: PrioritizationResponse = {
  executive_summary: {
    total_themes: 8,
    total_signals: 130,
    total_arr_impacted: 81600,
    critical_themes: ["Reporting & Exporting", "Mobile App Stability"],
    quick_wins: ["Hindi Localization", "Scheduled Email Digests"],
    low_priority_to_ignore: ["Dark Mode for Control Rooms"],
  },
  prioritization: {
    P0: [
      {
        theme_id: "t-1",
        theme_name: "Reporting & Exporting",
        problem_statement: "Enterprise STUs cannot reliably export depot-level ridership and KPI reports for board reviews.",
        signal_count: 38,
        arr_impacted: 39800,
        priority: "P0",
        total_score: 77,
        is_adjusted: false,
        scores: { frequency: 25, revenue: 30, customer: 6, churn: 11, strategic: 5 },
        recommendation: "Rebuild the export pipeline with depot-level granularity, retry-safe PDF generation, and scheduled email delivery within the next sprint.",
        why_now: "MSRTC and BMTC have explicitly tied renewal to export reliability ahead of Q1 board reviews.",
        expected_impact: "Protects ₹39.8L ARR at immediate churn risk and unlocks 2 expansion deals waiting on RTI-compliant exports.",
        tradeoffs: "Will deprioritize the analytics warehouse migration by one sprint; mitigated by parallel infra spike.",
      },
      {
        theme_id: "t-2",
        theme_name: "Mobile App Stability",
        problem_statement: "Field officers across TSRTC, BMTC and Play Store reviewers report repeated crashes on weekly summary and 4G networks.",
        signal_count: 26,
        arr_impacted: 15800,
        priority: "P0",
        total_score: 75,
        is_adjusted: false,
        scores: { frequency: 22, revenue: 22, customer: 16, churn: 12, strategic: 3 },
        recommendation: "Ship a stability hardening release: crash-free target 99.5%, low-bandwidth mode, and offline fallbacks for depot mobile.",
        why_now: "Mobile rollout is blocking TSRTC's field expansion that gates a ₹8.6L upsell.",
        expected_impact: "Reduces support volume by ~30% and unblocks one enterprise expansion.",
        tradeoffs: "Pushes the redesign of the mobile home screen by 3 weeks.",
      },
    ],
    P1: [
      {
        theme_id: "t-3",
        theme_name: "SSO & Procurement Compliance",
        problem_statement: "State IT directories require SAML SSO and RTI-compliant audit logs to clear procurement.",
        signal_count: 14,
        arr_impacted: 26200,
        priority: "P1",
        total_score: 64,
        is_adjusted: false,
        scores: { frequency: 14, revenue: 26, customer: 10, churn: 9, strategic: 5 },
        recommendation: "Stand up SAML SSO with audit-log export within 6 weeks; partner with InfoSec on a compliance whitepaper.",
        why_now: "Two enterprise deals (₹26.2L combined) are stalled at security review.",
        expected_impact: "Unlocks ₹26.2L in net-new ARR and removes a recurring sales blocker.",
        tradeoffs: "Requires SRE bandwidth currently allocated to log retention work.",
      },
    ],
    P2: [
      {
        theme_id: "t-4",
        theme_name: "Hindi Localization",
        problem_statement: "Depot supervisors in HRTC, RSRTC, UPSRTC request full Hindi locale to drive adoption.",
        signal_count: 18,
        arr_impacted: 9300,
        priority: "P2",
        total_score: 48,
        is_adjusted: false,
        scores: { frequency: 16, revenue: 12, customer: 14, churn: 4, strategic: 2 },
        recommendation: "Adopt i18n framework, translate top 40 screens, and partner with one customer for QA in production.",
        why_now: "Three mid-market accounts cite localization as the #1 adoption blocker.",
        expected_impact: "Lifts depot-supervisor DAU by an estimated 25% in Hindi-belt accounts.",
        tradeoffs: "Adds ~5% to release cycle time until automation lands.",
      },
      {
        theme_id: "t-5",
        theme_name: "Scheduled Email Digests",
        problem_statement: "Depot heads want weekly KPI digests pushed to email instead of logging in.",
        signal_count: 12,
        arr_impacted: 4200,
        priority: "P2",
        total_score: 42,
        is_adjusted: false,
        scores: { frequency: 14, revenue: 10, customer: 12, churn: 4, strategic: 2 },
        recommendation: "Ship a templated weekly digest powered by the existing reporting engine.",
        why_now: "Highest upvoted feature request on Canny and a quick win once exports are stabilized.",
        expected_impact: "Increases stickiness with non-technical executives, reduces login friction.",
        tradeoffs: "Minor email infra cost; needs unsubscribe + bounce handling.",
      },
    ],
    P3: [
      {
        theme_id: "t-6",
        theme_name: "Dark Mode for Control Rooms",
        problem_statement: "A handful of control-room operators request a dark theme for wall-mounted screens.",
        signal_count: 6,
        arr_impacted: 2100,
        priority: "P3",
        total_score: 22,
        is_adjusted: false,
        scores: { frequency: 6, revenue: 4, customer: 6, churn: 4, strategic: 2 },
        recommendation: "Defer. Revisit once design system tokens are unified in Q3.",
        why_now: "Low signal volume, low revenue impact, no churn linkage.",
        expected_impact: "Aesthetic improvement only.",
        tradeoffs: "Opportunity cost vs. higher-leverage work.",
      },
    ],
  },
};
