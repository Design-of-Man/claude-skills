---
type: dashboard
status: planning
tags: [design-of-man, dashboard]
updated: 2026-08-18
---

# Live Metrics — What "Live" Actually Means

The dashboard is described as showing real-time data. Some of it genuinely is. Most of it is not, and cannot be. This note draws the line, because a number displayed without its age is the most dangerous thing a dashboard can show — it gets trusted, and it gets acted on.

Architecture context: [[00-Dashboard-Architecture]].

---

## The constraint

The vault is markdown files in a Dropbox-synced folder. That is an excellent place to author and archive, and a poor place to source real-time data from:

- **Sync latency is unbounded.** Usually seconds. Sometimes minutes. Occasionally much longer if a machine is asleep, offline, or churning through a large sync.
- **There is no change feed.** Filesystem events tell you a file changed, not what changed or in what order relative to other changes.
- **Files can be observed mid-write.** A watcher that reads on the first event will sometimes parse half a file.
- **Concurrent writes fork rather than merge.** `note (Nick's conflicted copy).md` is Dropbox's answer to a race — which means the vault cannot arbitrate anything contended.

Conclusion: **true real-time is not achievable from flat files alone.** Anything that needs to be current within seconds must come from somewhere other than the vault — either directly from an API, or from state the agents write straight into the datastore, bypassing markdown entirely.

---

## Freshness tiers

Every tile on the dashboard belongs to one of these. The tier determines the refresh mechanism, the cadence, and what the tile is allowed to claim.

| Tier | Freshness | Mechanism | What lives here |
|------|-----------|-----------|-----------------|
| **0 — Live** | Seconds | Agents write directly to Postgres; webhooks push in | Agent status, client locks, approval state, deploy events |
| **1 — Near-live** | 1–5 min | Scheduled poll (Vercel Cron) into `metric_snapshots` | Vercel Web Analytics, runtime errors, uptime |
| **2 — Daily** | Once daily | Scheduled poll | Google Search Console, Post Bridge reach |
| **3 — Vault-derived** | Best effort, target < 2 min | Watcher parses changed markdown | Client roster, plan and pricing fields, notes, agent specs |
| **4 — Slow / periodic** | Hours to a monthly close | Scheduled poll, human-paced underneath | QuickBooks Online revenue, invoices, expenses |

### Tier 0 — genuinely live

This is real-time because it never touches a file. When an agent starts work it writes a run row and a lock row to Postgres over the network, in a transaction. The dashboard reads that row. Latency is a database round-trip.

- Agent status: which agent, which client, which step, started when.
- Lock state: who holds a client, when the lock expires.
- Approval transitions: pending → approved / rejected / expired.
- Vercel deployment events, if the deploy webhook is wired up (push, not poll).

The design lesson generalizes: **anything that must be current is state the agents emit, not state a human typed into a note.**

### Tier 1 — near-live external APIs

Polled on a schedule, cached into `metric_snapshots`, read from cache by the page. Never fetched during a page render — the render would be slow, and the API would be rate-limited within a day.

- **Vercel Web Analytics** — pageviews and visitors per client site. Suggested 5-minute poll. See [[../INTEGRATIONS/02-Vercel]].
- **Vercel runtime errors / logs** — error counts per project, feeding the health flags in [[03-Client-Health]]. 5-minute poll.
- **Uptime** — a plain HTTP check per client domain. 1–5 minutes. Cheap, and the single most useful "is something on fire" signal we have.

Note that Vercel Analytics itself has ingestion lag of its own; "5-minute poll" means our copy is at most five minutes behind *their* copy, not five minutes behind reality.

### Tier 2 — daily, and lagging at the source

- **Google Search Console** — clicks, impressions, average position, top queries and pages. Poll once daily.

  GSC data lags **two to three days at the source**. That is Google's pipeline, not our latency, and no polling frequency changes it. Every GSC tile must therefore be labeled with the *data date*, not the fetch time. A ranking tile that says "updated 4 minutes ago" while showing data through last Tuesday is actively misleading. Show: `GSC · data through 2026-08-15 · fetched 06:00`.

- **Post Bridge reach** — social impressions and engagement per client, daily.

### Tier 3 — vault-derived

Everything authored in Obsidian: the client roster, contract and plan fields, prospect stages, agent specifications, notes. The watcher (see [[00-Dashboard-Architecture]] §3) picks up changes and upserts rows.

Realistic cadence: **under two minutes when everything is running, no guarantee.** Dropbox latency plus watcher debounce plus parse. This is fine, because nothing in this tier is time-critical — if Nick edits a client's plan tier and the dashboard reflects it 90 seconds later, nothing breaks.

Two behaviors the watcher owes us:

- **Debounce on quiet** (200–500ms after the last write) so partially-written files are never parsed.
- **Fail soft.** On a YAML parse error, keep the last good row, mark the record `stale: parse error`, and surface it in a small diagnostics strip. A broken frontmatter key should not blank a panel.

### Tier 4 — revenue, which is not live and should not pretend to be

Monthly revenue $X, outstanding invoices $X, expenses $X — from QuickBooks Online. Poll a few times a day at most.

The real limit is not the API, it is the business process underneath it. Invoices are created when someone creates them and paid when a client pays. "Revenue this month" is a figure that moves on human timelines and is not final until the month closes. The tile should read `Revenue MTD: $X · as of 2026-08-18 09:00 · not closed` and never imply otherwise. Targets and definitions live in [[../BUSINESS/01-Financials]] and [[../BUSINESS/04-KPIs]].

---

## Metric-by-metric

| Metric | Source | Tier | Cadence | Displayed as-of |
|--------|--------|------|---------|-----------------|
| Agent running / idle | Agent runtime → Postgres | 0 | Event | Live |
| Client lock held / expiring | `client_locks` | 0 | Event | Live |
| Pending approvals count | `approvals` | 0 | Event | Live |
| Last deploy + status | Vercel API / webhook | 0–1 | Event or 5 min | Fetch time |
| Site uptime | HTTP check | 1 | 1–5 min | Check time |
| Runtime errors (24h) | Vercel API | 1 | 5 min | Fetch time |
| Traffic (7d vs prior 7d) | Vercel Web Analytics | 1 | 5 min | Fetch time |
| Core Web Vitals | Vercel Speed Insights | 1–2 | Hourly | Fetch time |
| Clicks / impressions / position | Google Search Console | 2 | Daily | **Data date** (2–3 day lag) |
| Social reach | Post Bridge | 2 | Daily | Data date |
| Client roster, plan, stage | Vault via watcher | 3 | < 2 min target | Sync time |
| Open issues per client | Vault / client repo issues | 3 | < 2 min | Sync time |
| Monthly revenue $X | QuickBooks Online | 4 | 2–4× daily | Fetch time + "not closed" |
| Pipeline value $X | Vault stages × plan value | 3–4 | < 2 min | Sync time |
| Conversion rate X% | Derived, see [[04-Pipeline]] | 4 | Daily | Window stated |

---

## Display rules

These are not cosmetic. They are what keeps the dashboard honest.

1. **Every tile shows its source and its as-of time.** No exceptions, including the live ones — "live" is itself a claim worth stamping.
2. **Stale beats blank.** If a fetch fails, show the last good value greyed out with its real age. A missing tile reads as "zero"; an aged tile reads as "check the pipe."
3. **A red freshness badge past the threshold.** Each tier gets a staleness threshold (Tier 1: 15 min, Tier 2: 36 h, Tier 3: 30 min, Tier 4: 24 h). Past it, the tile is visibly degraded rather than quietly wrong.
4. **"No data" is not "healthy."** A new client with no GSC history shows *insufficient data*, never a green check. See [[03-Client-Health]].
5. **Lagging sources show the data date, not the fetch date.** Applies to GSC above all.
6. **No number without a definition.** Anything derived (conversion rate, pipeline value) links to the note that defines its numerator and denominator.

---

## Auto-refresh

- Tier 0 panels: server-sent events or a 10-second poll. The payload is tiny — a handful of rows.
- Tier 1–4 panels: refresh on page load and every 60 seconds from cache. There is no benefit to polling the page faster than the underlying fetcher runs.
- No websockets. Two users, small payloads, not worth the connection management.

Related: [[00-Dashboard-Architecture]] · [[02-Task-Queue]] · [[03-Client-Health]] · [[04-Pipeline]] · [[Dashboard-Build-Spec]]
