---
type: business
tags: [design-of-man, business, kpi]
updated: 2026-08-18
---

# KPIs

The six KPIs from [[01-Financials]], tracked here as their own note
with a "how to measure" column for each — because a target without a
measurement method is just a wish. Every dollar and percentage figure
stays a placeholder until real numbers are pulled from the sources
listed.

## KPI Table

| KPI | Target | How To Measure |
|---|---|---|
| Conversion rate (prospects → clients) | 10% | Prospect-to-live ratio from [[../CLIENTS/00-Active-Clients]] — count of prospects that moved from the Hot Prospects / Evaluating tables into the Live Clients table over a given period, divided by total prospects contacted in that period (sourced from [[../COMMUNICATIONS/03-Prospect-Tracker]]) |
| Customer acquisition cost (CAC) | $X | Total sales/outreach cost over a period (Sales Outreach Agent tool/API spend from [[03-Expenses]], plus any Nick/Cam hours spent on approvals and closing per [[06-Capacity-Planning]]) divided by the number of new clients closed in that period |
| Revenue per client | $X | Monthly recurring revenue pulled from [[../INTEGRATIONS/05-QuickBooks-Online]], divided by active client count from [[../CLIENTS/00-Active-Clients]]. Note this is a *blended* figure across the tiers described in [[02-Pricing-Model]], not a single fixed price |
| Profit margin | 70% | (Total revenue − total expenses) ÷ total revenue, for a given period. Revenue from [[../INTEGRATIONS/05-QuickBooks-Online]]; expenses from [[03-Expenses]] (excluding the clinic-billed Descript line, per that note) |
| Time to build a site | 8 hours | Logged hours from build kickoff to first successful deploy on the [[../TEMPLATES-BUILDS/00-Next.js-Shell\|Next.js shell]], tracked per client in that client's file under [[../CLIENTS/00-Active-Clients]] or in the relevant [[../AGENTS/Execution-Logs/00-Index|Execution Logs]] entry |
| Time to launch | 10 hours | Logged hours from build kickoff to the site going live on its real domain — first deploy time (above) plus everything through DNS cutover per [[../TEMPLATES-BUILDS/06-Deployment-Checklist]] (and [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] for migration jobs) |

## Why These Six

Each KPI maps to a different failure mode the agency actually cares
about catching early:

- **Conversion rate** catches a pipeline problem — prospects found but
  not closing — before it shows up as a missed revenue target three
  months later.
- **CAC** catches an outreach-efficiency problem: if the Sales
  Outreach Agent (see [[../AGENTS/02-Sales-Outreach-Agent]]) is
  finding prospects but closing them is expensive relative to what
  they're worth, the funnel needs attention, not just more volume.
- **Revenue per client** catches pricing/tier drift — if the actual
  blended average drifts meaningfully from the tier structure in
  [[02-Pricing-Model]], either pricing needs revisiting or too many
  clients are landing on the lowest tier.
- **Profit margin** is the single number that ties revenue
  ([[01-Financials]]) and expenses ([[03-Expenses]]) together — it's
  the check that growth (more clients) is actually translating into a
  healthier business rather than just more top-line revenue at the
  same or worse margin.
- **Time to build** and **time to launch** are capacity KPIs as much
  as delivery KPIs — they're the numbers that make or break how many
  clients Nick and Cam can actually take on at once, per
  [[06-Capacity-Planning]]. A build that consistently runs over 8
  hours eats directly into how many clients the agency can serve
  toward the 10-client target.

## Review Cadence

These KPIs are meant to be checked against the quarterly targets in
[[01-Financials]] and tracked in each quarter's review note (see
[[Quarterly/Q3-2026-Review]] for the current one), not recalculated
ad hoc. When a KPI is measured and the result diverges meaningfully
from target, that's a candidate for a dated entry in
[[05-Decisions-Log]] — either the target needs revisiting, or the
underlying process (pricing, outreach, build workflow) does.

## Related Notes

- [[01-Financials]] — where this KPI list originates
- [[02-Pricing-Model]] — the pricing structure revenue-per-client and CAC are measured against
- [[03-Expenses]] — the expense side of the profit-margin calculation
- [[06-Capacity-Planning]] — why time-to-build and time-to-launch are capacity constraints, not just delivery metrics
- [[../CLIENTS/00-Active-Clients]] — the live source for conversion rate and revenue-per-client math
- [[../INTEGRATIONS/05-QuickBooks-Online]] — the financial source of truth these KPIs pull from
