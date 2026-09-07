---
type: dashboard
status: planning
tags: [design-of-man, dashboard]
updated: 2026-08-18
---

# Client Health

One row per live client, answering a single question: is anything wrong here that we don't already know about. Roster and status live in [[../CLIENTS/00-Active-Clients]]; this note defines the signals, where each comes from, and how they roll up.

---

## Signals

| Signal | Definition | Source | Tier | Notes |
|--------|------------|--------|------|-------|
| **Uptime** | Site responds 200 to an HTTP check | Direct HTTP check per domain | 1 | Cheapest, loudest signal. Two consecutive failures before alerting, to absorb blips |
| **Traffic trend** | Visitors, last 7d vs prior 7d | Vercel Web Analytics | 1 | See [[../INTEGRATIONS/02-Vercel]] |
| **Ranking trend** | Clicks, impressions, avg position — last 28d vs prior 28d | Google Search Console | 2 | **Data lags 2–3 days at the source.** Label with data date, not fetch time |
| **Last deploy** | Timestamp + state of the most recent production deploy | Vercel Deployments API | 0–1 | State matters as much as age — a failed prod deploy is a red flag regardless of recency |
| **Runtime errors** | Error count, last 24h | Vercel runtime logs | 1 | Spike vs the client's own 7-day baseline, not a fixed number |
| **Core Web Vitals** | LCP / INP / CLS, field data | Vercel Speed Insights | 1–2 | Ranking-relevant and client-visible |
| **Last content published** | Most recent social post or blog post | Post Bridge + client repo commits | 2–3 | The signal a managed client actually feels the absence of |
| **Open issues** | Count + oldest age | `open_issues` frontmatter in the client note, or issues on the client repo | 3 | Pick one home for this and stick to it — split ownership means neither gets updated |
| **Last agent run** | Which agent touched this client, when | `agent_runs` table | 0 | A client nothing has touched in two weeks is a silent failure, often a stuck lock |
| **Last report sent** | Most recent client report delivered | Client Reporting Agent runs | 0–3 | Client-facing commitment; missing it is a churn risk |
| **Billing status** | Days overdue on outstanding invoices | QuickBooks Online | 4 | An overdue invoice is a health signal, not just an accounting one |

Freshness tiers are defined in [[01-Live-Metrics]].

---

## Where each signal comes from, concretely

**Vercel** provides deploy state, analytics, runtime errors, and Web Vitals — keyed on the client's `vercel_project_id`, which must exist in the client note's frontmatter. If it's missing, the client's row shows *not connected* rather than green.

**Google Search Console** provides ranking data, keyed on `gsc_property`. Same rule: no property, no green.

**`CLIENTS/` notes** provide identity and commercial context via frontmatter — domain, project id, GSC property, repo, plan, MRR, owner, open issues, go-live date. These flow through the vault watcher ([[00-Dashboard-Architecture]] §3). The prose in a client note is for humans; the dashboard reads only frontmatter, which means the client template has to carry these keys from day one.

**Postgres** provides everything agent-generated: runs, locks, approvals, report deliveries.

**QuickBooks Online** provides invoice aging.

---

## Flags, not a score

The tempting design is a single 0–100 health score. Resist it.

A composite score with invented weights hides which thing broke — a client at 72 tells you nothing actionable, and within two weeks nobody looks at the number. Worse, a score smooths over the one signal that matters: a site can be down while its traffic, rankings, and content cadence all still look fine from last week's data.

Use a small set of explicit flags instead. Each is independently true or false, each names its own remedy, and the client row shows the worst active flag.

| Flag | Rule | Level |
|------|------|-------|
| Site down | 2+ consecutive failed HTTP checks | Red |
| Failed production deploy | Most recent prod deploy state = error | Red |
| Invoice 30+ days overdue | QBO aging | Red |
| Error spike | 24h errors > 3× the client's 7-day baseline | Amber |
| Traffic drop | 7d visitors down > 30% vs prior 7d | Amber |
| Ranking drop | 28d clicks down > 25%, or avg position worse by 3+ | Amber |
| Content gap | No published content in 14+ days on a managed plan | Amber |
| Stale site | No deploy in 45+ days | Amber |
| Untouched by agents | No agent run in 14+ days | Amber — often means a stuck lock, check `client_locks` |
| Open issue aging | Any open issue older than 14 days | Amber |
| Insufficient data | Client live < 28 days, or a required integration not connected | Grey |

Thresholds above are starting points, not findings. Tune them after the first month against real client data — every one of them should end up in config, not in code.

---

## "No data" is not "healthy"

The most common way a health dashboard lies: a client with no GSC property connected has no ranking drop, no error spike, and no failed deploy, so every check passes and the row renders green. The client is not healthy; the client is unmeasured.

Rules:

1. A required integration that isn't connected produces a **grey "not connected"** row, never green.
2. A client live for under 28 days shows **insufficient data** on trend signals — there is no prior period to compare against, and a 400% traffic increase from a base of three visitors is noise.
3. A signal whose last successful fetch is past its staleness threshold shows the value greyed with its real age, and does not count toward a green rollup.

---

## Drill-down

Clicking a client opens the full view described in [[00-Dashboard-Architecture]] §6: identity and commercials from the client note, live performance from cached API snapshots, and the complete agent activity history for that client from `agent_runs` with links into `AGENTS/Execution-Logs/`.

Two things worth putting on that page that aren't on the summary row:

- **A "what we did for them this month" list** — every deploy, post, SEO change, and report. This is the answer to the client's "what am I paying for" question, and it should be one click from the dashboard rather than reconstructed by hand.
- **Anything pending approval for this client**, pulled from [[02-Task-Queue]], so a client blocked on our own review is visible as a health issue rather than hiding in a different panel.

Related: [[00-Dashboard-Architecture]] · [[01-Live-Metrics]] · [[02-Task-Queue]] · [[04-Pipeline]] · [[../CLIENTS/00-Active-Clients]] · [[../AGENTS/05-Site-Maintenance-Agent]]
