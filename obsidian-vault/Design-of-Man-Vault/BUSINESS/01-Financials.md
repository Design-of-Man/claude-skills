---
type: business
tags: [design-of-man, business, financials]
updated: 2026-08-18
---

# Financials

The financial model The Design of Man runs on: how revenue gets made,
what it costs to run the agency month to month, the KPIs that tell
Nick and Cam whether the model is working, and the quarterly targets
that turn "the model" into something checkable. Every dollar figure
below is a placeholder (`$X` / `$XXX`) until it's replaced with a real
number pulled from [[../INTEGRATIONS/05-QuickBooks-Online]] — this note
is the target structure, not a forecast dressed up as a fact.

## Revenue Model

Two revenue lines, both described in full in [[02-Pricing-Model]]:

| Line | Structure | What's Included |
|---|---|---|
| Per-site build | One-time fee, charged at project kickoff | The site itself, built on [[../TEMPLATES-BUILDS/00-Next.js-Shell]] |
| Monthly site management | Recurring fee, billed monthly once live | Hosting/maintenance, SEO optimization, social media management, reporting |

SEO optimization and social media management are **not** separate line
items — they're bundled into the monthly management fee. This keeps
the pitch to prospects simple (one build price, one monthly price) and
keeps the agency from having to itemize agent-driven work
([[../AGENTS/01-SEO-Audit-Agent]], [[../AGENTS/03-Copy-Content-Agent]],
[[../AGENTS/04-Design-Graphics-Agent]]) that's largely automated on the
delivery side anyway.

## Monthly Targets

| Metric | Target |
|---|---|
| Clients (by end of year) | 10 |
| Revenue per client | $X / month |
| Total monthly revenue | $X |
| **Annual revenue goal** | **$XXX** |

Ten clients is the year-end target, not a today number — see
[[../CLIENTS/00-Active-Clients]] for the current live/prospect/evaluating
roster this target is being built against, and [[06-Capacity-Planning]]
for why 10 concurrent clients is a deliberately capacity-aware number
rather than an arbitrary round figure.

## Monthly Expenses

These are real figures, not placeholders — they're small, known,
recurring subscription costs.

| Expense | Monthly Cost |
|---|---|
| Claude subscriptions (Nick + Cam) | $40 |
| Vercel deployments | $50 |
| Canva Teams | $15 |
| Post Bridge | $0 (free tier) |
| Descript | Shared with clinic — not counted in this total |
| Domain hosting | $50 |
| **Total** | **~$155** |

Full detail on what each line actually pays for, renewal cadence, and
what's watched for future paid-tier spend (MIT AI Gateway, Firecrawl)
lives in [[03-Expenses]].

## KPIs to Track

| KPI | Target |
|---|---|
| Conversion rate (prospects → clients) | 10% |
| Customer acquisition cost (CAC) | $X |
| Revenue per client | $X |
| Profit margin | 70% |
| Time to build a site | 8 hours |
| Time to launch | 10 hours |

Each of these gets its own "how do we actually measure this" treatment
in [[04-KPIs]] — this table is the target list, not the measurement
method.

## Quarterly Profit Targets

| Quarter | Target |
|---|---|
| Q3 2026 (Aug–Oct) | Establish baseline |
| Q4 2026 | 5–8 clients, $X revenue |
| Q1 2027 | 10+ clients, $XXX revenue |

Q3 2026 is deliberately a baseline-setting quarter rather than a
revenue target — see [[Quarterly/Q3-2026-Review]] for the live tracking
note against this target, including the mid-quarter checkpoint as of
this vault's build date.

## Related Notes

- [[02-Pricing-Model]] — the actual fee structure and tiers behind "revenue per client: $X"
- [[03-Expenses]] — expense detail, renewal cadence, future tool spend
- [[04-KPIs]] — how each KPI above actually gets measured
- [[05-Decisions-Log]] — why the revenue model is shaped this way
- [[06-Capacity-Planning]] — why 10 clients is a capacity-bounded target, not an arbitrary one
- [[Quarterly/Q3-2026-Review]] — current quarter's tracking against these targets
- [[../INTEGRATIONS/05-QuickBooks-Online]] — where the real numbers behind every `$X` above will actually live
