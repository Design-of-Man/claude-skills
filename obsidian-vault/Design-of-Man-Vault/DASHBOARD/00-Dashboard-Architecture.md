---
type: dashboard
status: planning
tags: [design-of-man, dashboard]
updated: 2026-08-18
---

# Live Dashboard — Technical Spec

The internal control surface for the agency. One screen that answers: what is running right now, what is waiting on me, which client is in trouble, and what did we make this month. Two users, Nick and Cam. Never client-facing.

This note is the architecture and the reasoning behind it. The implementable version — schemas, routes, build order — lives in [[Dashboard-Build-Spec]].

> [!note] Likely implementation home: `Design-of-Man/Jarvis`
> The `Design-of-Man/Jarvis` repo already exists and has had "app metrics readiness for launch" work done in it, including domain-buying decisions. That is almost certainly this dashboard — the original vault doc treated the dashboard as a future build with no home for the actual app, which is why this note exists in a planning state while a repo may already be half-built. **The Jarvis repo is the most likely home for this build; confirm and update this note once that's certain.** If it turns out Jarvis is a different app (a clinic tool, a metrics prototype), say so here and pick a home explicitly rather than starting a second dashboard by accident.

---

## 1. What It Shows

Five panels. Each one has a different freshness profile, which is the thing that actually drives the architecture — see [[01-Live-Metrics]].

| Panel | Content | Primary source | Detail note |
|-------|---------|----------------|-------------|
| **Agent status** | Which agent is running, on which client, since when, current step | Agent runtime → datastore (event-driven) | This note, §4 |
| **Task queue** | Pending approvals: sales emails, graphics/captions, SEO changes | Approvals table, fed by [[../AUTOMATIONS/Gates-and-Approvals]] | [[02-Task-Queue]] |
| **Client health** | Traffic, rankings, last deploy, last content, open issues | Vercel + GSC + `CLIENTS/` notes | [[03-Client-Health]] |
| **Revenue / metrics** | Monthly revenue $X, pipeline value $X, conversion rate X% | QuickBooks Online + pipeline stages | [[04-Pipeline]], [[../BUSINESS/01-Financials]] |
| **Notification feed** | Recent agent alerts, mirrored from Slack | Agent runtime + Slack events | [[../INTEGRATIONS/08-Slack]] |

All dollar and percentage figures on this dashboard render from live sources. Nothing in this vault carries a hard-coded number — placeholders stay `$X` until the app reads the real value.

---

## 2. Technology

- **Framework:** Next.js. Chosen for consistency with the client-site stack, not because the dashboard needs it — the real benefit is that Nick and Cam are already fluent in this stack and deploy it a dozen times a week, so there is no second toolchain to maintain. App Router, server components for data reads, route handlers for the webhook and agent-ingest endpoints.
- **Hosting:** Vercel, same account and workflow as the client sites. See [[../INTEGRATIONS/02-Vercel]].
- **Datastore:** Postgres (Supabase) for operational state. Reasoning in §3 — this is the one place the architecture departs from "just read the vault."
- **Live external data:** Vercel API (deployments, Web Analytics, runtime errors), Google Search Console, Google Workspace (Calendar/Gmail for support-queue context), QuickBooks Online for revenue. See [[../INTEGRATIONS/00-Integration-Overview]].
- **Vault:** the Obsidian vault stays the human-authored source of truth for client records, agent specs, and logs. The dashboard reads it; it does not replace it.

---

## 3. How the dashboard reads the vault (the real decision)

The vault is markdown in a Dropbox-synced folder. There are two honest ways to get that into a web app, and they have very different costs.

### Option A — Static read at build time

A Next.js build step walks the vault, parses frontmatter with `gray-matter`, and renders static pages.

- **For:** no infrastructure at all. No database, no daemon, no sync service. Pure functions from markdown to HTML.
- **Against:** two problems, one fatal.
  1. **Staleness.** The data is frozen at deploy time. A dashboard whose headline panel is "which agent is running right now" cannot update on the deploy cadence. Rebuilding on a cron every five minutes is possible but wasteful and still leaves a five-minute floor.
  2. **The vault isn't reachable from a Vercel build.** The vault lives on Nick's machine and in Dropbox. Vercel's build container cannot see either. Making Option A work means mirroring the vault into a git repo and pushing on every change — at which point the "no infrastructure" advantage is gone, and every agent heartbeat becomes a git commit.

### Option B — Sync service into a datastore (recommended)

A small watcher process runs on the machine where the vault is already synced. It watches for file changes (`chokidar`), parses changed markdown, and upserts structured rows into Postgres. The dashboard reads Postgres.

- **For:** near-real-time, and — more importantly — it gives the system a place to hold state that markdown is genuinely bad at holding.
- **Against:** it is a process that has to stay alive, on a machine that has to stay awake. That is real operational cost for a two-person shop, and it should be acknowledged rather than hand-waved.

### Recommendation: Option B, with a clean split of ownership

Do not think of this as "the dashboard reads the vault." Think of it as two data domains with two different writers:

| Domain | Examples | Written by | Source of truth |
|--------|----------|------------|-----------------|
| **Authored content** | Client records, agent specs, pricing, notes, decisions | Humans, in Obsidian | The vault. Synced one-way into Postgres as a read cache. |
| **Operational state** | Locks, agent runs, approvals, metric snapshots | Agents and the app | Postgres. Optionally rendered back into the vault as archive (Phase 4). |

The split follows write frequency and writer identity, and there is a hard technical reason it has to exist:

> **Dropbox cannot hold a lock.** Dropbox sync is eventually consistent, with latency from seconds to minutes, no ordering guarantee, no atomic compare-and-swap, and — the killer — conflict semantics that *silently fork the file* into `filename (Nick's conflicted copy).md` when two writers touch it. Mutual exclusion built on a filesystem that resolves concurrent writes by keeping both copies is not mutual exclusion. The moment two agents race, both read "unlocked," both write "locked," Dropbox keeps both, and both proceed.

So: authored markdown flows vault → Postgres. Operational state is born in Postgres. Anything time-critical or contended never travels through Dropbox.

**Practical notes for the watcher:**

- Debounce on quiet (200–500ms after the last write event) — editors and sync clients produce partial files mid-write, and a parse of a half-written note will produce garbage.
- On parse failure, keep the last good row and raise a warning. Never blank a panel because someone left a note with broken YAML.
- Store the file path and content hash on every row so a full re-scan is cheap and idempotent.
- If the watcher machine is asleep, the dashboard's authored data is stale but its operational data is not — which is the correct failure mode, since operational data is the part that matters minute to minute.
- If keeping a daemon alive proves annoying in practice, the fallback is a scheduled full re-import (every 15 min) rather than a watcher. Slower, dumber, nothing to crash. Start with the watcher; do not be precious about it.

---

## 4. Concurrency: the client lock

The requirement: *if Agent A is working on Client X, Agent B sees "in progress" and skips.*

### Granularity

Lock **per client**, not per agent. The collision that actually hurts is two different agents touching the same client's repo or site at once — the SEO Audit Agent deploying meta-tag changes while the Site Maintenance Agent triggers a redeploy, and one of them clobbers the other's commit. Two agents working on two different clients is fine and should never block.

Only **write-class** tasks take the lock. Read-class tasks (pulling GSC numbers, generating a report, drafting a caption that goes to a human first) do not mutate anything and should never be able to block a deploy. Classify each task explicitly in the agent spec — see [[../AGENTS/00-Agent-Overview]] — rather than defaulting everything to exclusive.

### Mechanism

One row per client in a `client_locks` table, acquired with a single conditional statement so there is no read-then-write race:

```sql
insert into client_locks (client_id, holder_agent, run_id, acquired_at, expires_at, heartbeat_at)
values ($client, $agent, $run, now(), now() + $ttl, now())
on conflict (client_id) do update
   set holder_agent = excluded.holder_agent,
       run_id       = excluded.run_id,
       acquired_at  = now(),
       expires_at   = now() + $ttl,
       heartbeat_at = now()
 where client_locks.expires_at < now()
returning *;
```

Row returned means the lock was acquired. No row returned means someone else holds a live lock — the agent logs "skipped, client busy" and moves to the next client. That skip is a normal outcome, not an error, and should show on the dashboard as a badge rather than an alert.

### Why the TTL matters

This is the part that is easy to get wrong and expensive to discover late.

Agents crash. A Claude Code run gets killed, the laptop sleeps mid-run, the network drops, an API call hangs past its timeout, someone closes the terminal. When that happens the release step never executes. Without an expiry, the lock row for Client X says "in progress" forever, and every subsequent run — Monday outreach, Friday SEO, everything — dutifully sees "in progress" and skips.

The failure is **silent**. Nothing errors. No alert fires. The system keeps reporting healthy while one client simply stops receiving work, possibly for weeks. That is worse than a crash, because a crash gets noticed.

A TTL bounds the blast radius of any crash to a single TTL window. Rules:

- **Default TTL: 30 minutes**, set per task class rather than globally. A full SEO audit across a site legitimately takes 20+ minutes; a caption generation takes seconds. One global TTL is either too short (steals live locks) or too long (leaves clients stuck).
- **Heartbeat every 60 seconds**, extending `expires_at`. A long but healthy run keeps its lock; a dead run stops heartbeating and expires on schedule. This decouples TTL length from the slowest possible task.
- **Log every reclamation loudly** — to Slack `#alerts` and to the run record. A reclaimed stale lock always means a previous run died without cleanup. The lock system handled it, but the underlying crash is a real bug and should not be swallowed by the mechanism that papers over it.
- **Release in a `finally`**, always, and make release idempotent and ownership-checked (`where run_id = $run`) so a resumed zombie process cannot release a lock a newer run now holds.

### Advisory, not enforced

Postgres will not stop an agent that skips the lock check. The lock only works if every agent takes it before acting. That means acquire/heartbeat/release belongs in **shared agent scaffolding** that every agent calls — not copy-pasted into each agent, where the eighth agent will inevitably be the one that forgets.

---

## 5. Approval workflows

Approvals are the dashboard's most important write path, because a lost approval means either a client email that never sent or, worse, one that sent twice. The queue view is documented in [[02-Task-Queue]]; the policy of what needs approval lives in [[../AUTOMATIONS/Gates-and-Approvals]].

### Happy path

1. Agent finishes an artifact (a sales email, three captions, an SEO change set).
2. Agent **writes the approval row first** — status `pending`, with the artifact body, the client, the run id, and an expiry.
3. Agent posts to the relevant Slack channel with Approve / Reject buttons. The button payload carries the `approval_id`, never the message text.
4. Nick or Cam clicks. Slack sends an interaction payload to `POST /api/slack/interactions`.
5. The endpoint verifies the Slack signature (v0 HMAC over the raw body, timestamp within five minutes, reject replays), acknowledges within 3 seconds, and does the work async.
6. The status flips (`update ... where id = $id and status = 'pending'` — the guard makes double-clicks harmless), recording who approved and when.
7. The endpoint calls `chat.update` to rewrite the Slack message in place: buttons gone, replaced with "Approved by Nick, 9:14am." This is what stops a second person clicking a stale button an hour later.
8. The agent's resume step sees `approved` and sends/deploys, then writes the outcome back to the run record.

### Order matters: database first, Slack second

The row exists before the notification is attempted. This is deliberate. If Slack is created first and the database derives its state from Slack, then Slack *is* the database — and Slack is a bad database. Messages get edited, deleted, lost to retention, stranded in archived channels. An approval must survive Slack disappearing entirely.

### If Slack is down

Two independent failure directions, both handled:

**Outbound post fails** (Slack 5xx, rate limit, token expired). The approval already exists as `pending` and is already visible in the dashboard queue. A retry worker re-attempts with exponential backoff, and the queue item shows a "not delivered to Slack" badge so nobody assumes it was seen. Nothing is lost, because nothing depended on the post succeeding.

**Inbound interaction lost** (our endpoint is down when someone clicks). Slack retries, but not forever, and a click during a deploy window can vanish. Mitigations, in order of importance:

1. **The dashboard has its own Approve / Reject buttons.** Slack is a convenience surface; the dashboard is the system of record. If Slack is unavailable, approvals still happen — just in the app. This alone makes Slack outages a nuisance rather than an outage of the business.
2. **Reconciliation job**, every 10 minutes: for any approval still `pending` past its Slack post time, re-read the channel (`conversations.history` / thread replies) and match on the `approval_id` stored in message metadata. Recovers clicks whose webhook delivery was lost.
3. **Idempotent transitions.** Applying the same approval twice is a no-op thanks to the `where status = 'pending'` guard, so reconciliation can be safely aggressive.
4. **Never auto-send on timeout.** An approval that nobody acted on expires to `expired`, not to `approved`. Expiry is a prompt for a human, never a substitute for one.

### Expiry

Approvals should not sit forever — a sales email goes stale, an SEO change gets superseded by the next audit. Each class carries its own window (suggested: sales email 48h, social content up to two hours before its scheduled slot, SEO change 7 days), with a nudge at the halfway mark. Expired items return to the queue flagged `needs attention`. **Expired is not rejected and is never sent.**

---

## 6. Client drill-down and historical logs

### Drill-down

Clicking a client opens a page assembled from three sources:

- **Identity and commercials** from the client's note in `CLIENTS/` — domain, Vercel project id, GSC property, repo, plan, MRR. These come from the note's frontmatter, not from parsing prose, so the fields have to exist as frontmatter keys in the client template. Roster context: [[../CLIENTS/00-Active-Clients]].
- **Live performance** from the Vercel and GSC APIs, served from cached snapshots rather than fetched on page load (§7).
- **Activity** from `agent_runs` filtered by client — every agent that touched this client, when, what it changed, what it queued.

Signal definitions and thresholds are in [[03-Client-Health]].

### Historical logs

Every agent run produces two artifacts:

1. A **row** in `agent_runs` (fast, filterable, joinable, powers the dashboard).
2. A **markdown file** in `AGENTS/Execution-Logs/` (durable, human-readable, greppable in Obsidian without the app running).

The dashboard's log view reads rows and deep-links to the vault file. The row is the index; the file is the record.

> [!warning] Log filename collision
> The current convention — `YYYY-MM-DD-<agent>.md` — collides the moment an agent runs twice in a day or runs per-client across eight clients. Recommend `YYYY-MM-DD-<agent>-<client>-<run-id-8>.md`, with the full `run_id` in the file's frontmatter so DB rows and vault files join cleanly in both directions. Worth fixing before there are hundreds of logs to rename.

---

## 7. Cross-cutting concerns

**Caching external APIs.** Nothing calls QuickBooks, GSC, or Vercel Analytics during a page render. GSC in particular is slow and rate-limited, and a dashboard that hits it on every load will get throttled by lunchtime. Scheduled fetchers (Vercel Cron) write `metric_snapshots`; pages read snapshots and display the `as of` timestamp. See [[01-Live-Metrics]].

**Auth.** Internal only, two users. Google OAuth restricted to an explicit allowlist of Nick's and Cam's Workspace accounts, plus Vercel deployment protection in front of the whole app. No public routes except the Slack webhook (signature-verified) and the agent ingest endpoint (service token). Do not build custom auth for a two-person tool.

**Secrets.** Vercel environment variables and the local agent runner's environment. Never in the vault — the vault syncs through Dropbox. See the credentials warning in `INTEGRATIONS/Credentials/`.

**What this is not.** Not a client-facing portal (clients get PDF reports from the Client Reporting Agent). Not a place for clinic or patient data — First Rehabilitation operations stay separate. Not a task manager for human work.

---

## 8. Open questions

- Is `Design-of-Man/Jarvis` this app, or a different one? Blocking question for everything below Phase 0.
- Where does the vault watcher run — Nick's Mac, or a small always-on box? A Mac that sleeps is the most likely source of "the dashboard is stale" complaints.
- Does the agent runtime already have a shared scaffolding layer to hang lock acquire/release on, or does that need building first?
- Do approvals need mobile-friendly rendering, or is Slack mobile the answer for approvals-on-the-go? (Probably the latter — one fewer surface to build.)

---

## Status

- [ ] Architecture designed
- [ ] Claude Code to build
- [ ] Testing with real data
- [ ] Deploy to Vercel

Related: [[Dashboard-Build-Spec]] · [[01-Live-Metrics]] · [[02-Task-Queue]] · [[03-Client-Health]] · [[04-Pipeline]] · [[../AUTOMATIONS/Gates-and-Approvals]] · [[../AGENTS/00-Agent-Overview]]
