# Signal Hub

Build a B2B SaaS product called "Product Signal Intelligence Copilot" — an AI-native PM workspace for Chalo Insights, an enterprise reporting platform for Indian State Transport Undertakings.

DESIGN DIRECTION:

Dark theme, deep navy background (#0a0f1e), command-center aesthetic

Accent color: blue (#3b82f6) for primary actions and data viz

Priority colors: P0 = red/critical, P1 = orange, P2 = amber, P3 = muted gray

Clean, data-dense layout similar to Linear or Vercel dashboard — not playful, professional B2B tool

Font: Inter or similar clean sans-serif

THREE SCREENS (single page app, no routing needed, use state to switch views):

SCREEN 1 — Data Sources Hub:

Page title "Data Sources" with subtitle

A grid of 6 source cards (3 columns), each showing: icon, source label, integration tool name (e.g. "Zendesk / Freshdesk"), a large record count number, and a "Last synced" timestamp with a green status dot

Sources: Support Tickets, CRM Sales Requests, CS Escalations, NPS Feedback, Product Feedback, App Reviews

A primary CTA button "Fetch All Sources" centered below the grid

Before fetching, cards show empty state placeholder

Clicking the CTA shows a loading spinner, then populates the cards with real data from an API call

SCREEN 2 — Signal Review:

Page title "Signal Review" with subtitle

For each of the 6 sources, show an expandable section with a preview table (5 rows) of that source's signal data — columns vary per source (e.g. support tickets show ticket_id, customer_name, segment, ARR, issue text, sentiment badge, priority badge)

Sentiment and priority values should render as small colored pill badges (red for negative/critical, green for positive, amber for medium/neutral)

Bottom navigation: "Back" button and primary "Generate Prioritization" button

SCREEN 3 — Prioritization Output:

Page title "Prioritization Output"

Top: Executive Summary card with gradient background showing 4 stat blocks (Total Themes, Total Signals Analyzed, Total ARR Impacted, Critical Issues count) plus 3 insight panels below (Critical Themes, Quick Wins, Low Priority to Ignore — each listing theme names)

Below: themes grouped into 4 sections by priority (P0, P1, P2, P3), each section has a colored priority badge header and shows count of themes in that tier

Each theme is a card showing:

Theme name and one-line problem statement at top

Total score (large number, out of 100) on the right

5 horizontal score bars for: Frequency (max 25), Revenue (max 30), Customer (max 20), Churn (max 20), Strategic (max 5) — each bar shows current value

IMPORTANT: each of these 5 score bars must be INTERACTIVE SLIDERS the user can drag to adjust the value within its max range

When any slider moves, the Total Score number and the Priority badge (P0/P1/P2/P3) update LIVE using this exact formula: total = min(frequency + revenue + customer + churn + strategic, 100) priority = total >= 75 ? 'P0' : total >= 55 ? 'P1' : total >= 35 ? 'P2' : 'P3'

A "Save Adjustment" button appears/activates only after the user has moved at least one slider on that card, and is disabled otherwise

Below the sliders: 4 stat blocks showing Signal Count, ARR Impacted, Priority, Impact Score

Below that: 4 text panels — Recommendation, Why Now, Expected Impact, Trade-offs (trade-offs panel has a slightly different muted amber background to distinguish it)

Top right: "Export PDF" button that triggers browser print

DATA INTEGRATION: I will provide 3 API endpoints (n8n webhooks) after this. Build the UI with realistic mock data matching this exact JSON structure for now, and I will wire up the real fetch calls next:

Source fetch response shape: { "total_signals": 130, "sources": [ { "id": "support_tickets", "label": "Support Tickets", "tool": "Zendesk / Freshdesk", "icon": "headset", "total_records": 30, "preview": [ { "ticket_id": "TKT-001", "customer_name": "BMTC", "customer_segment": "Enterprise", "customer_arr": 7200, "issue_text": "...", "sentiment": "negative", "priority": "high" } ] } ] }

Prioritization response shape: { "executive_summary": { "total_themes": 8, "total_signals": 130, "total_arr_impacted": 81600, "critical_themes": ["Reporting and Exporting"], "quick_wins": ["Mobile Experience"], "low_priority_to_ignore": ["System Reliability"] }, "prioritization": { "P0": [ { "theme_id": "uuid", "theme_name": "Reporting and Exporting", "problem_statement": "...", "signal_count": 38, "arr_impacted": 81600, "priority": "P0", "total_score": 77, "is_adjusted": false, "scores": { "frequency": 25, "revenue": 30, "customer": 6, "churn": 11, "strategic": 5 }, "recommendation": "...", "why_now": "...", "expected_impact": "...", "tradeoffs": "..." } ], "P1": [], "P2": [], "P3": [] } }

Build this now with mock data matching the structure above. Make it visually polished and production-ready.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://product-signal-co.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e7dc8fd4-59b5-448a-8871-fbc9322fb12c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
