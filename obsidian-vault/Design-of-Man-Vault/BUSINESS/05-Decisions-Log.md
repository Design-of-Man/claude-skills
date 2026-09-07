---
type: business
tags: [design-of-man, business, decisions]
updated: 2026-08-18
---

# Decisions Log

A running log of the decisions that shaped how The Design of Man
operates — not a changelog of every small tweak, but the calls that
would be genuinely confusing to a future Nick, Cam, or agent working in
this vault without the reasoning behind them. Newest entries at the
top.

## Log

### 2026-08-18 — This vault incorporated session-derived patterns via metadata only, not transcripts

**Decision:** While building out this Obsidian vault, patterns from
recent Claude Code Remote sessions were incorporated (e.g., active
clients not yet in the original roster, a recurring Wix→Vercel
migration pattern worth a reusable checklist, a Firecrawl fallback
behavior worth documenting, integrations actually in use beyond the
original list).

**How it was actually done:** Those patterns came from **session list
metadata only** — titles, linked repos, and task/status summaries
pulled via the available session-listing tool. **No tool in this
environment exposes full cross-session conversation transcripts**, so
none were read or mined. The "signal" behind every session-derived
addition in this vault is a session title, a repo name, or a
one-line status summary — not a review of what was actually discussed
or decided inside those sessions.

**Why this matters:** Treat any session-derived insight anywhere in
this vault (client roster additions, the migration-checklist
recommendation, the Firecrawl fallback note, the expanded integrations
list) as **directionally useful, not as a complete audit**. Metadata
can point at a real pattern without capturing its full context — a
session titled around a domain cutover confirms *that a cutover
happened*, not every detail of how it went. Anything load-bearing that
came from session metadata should get verified against the actual
client file, repo, or Nick/Cam directly before being treated as
settled fact.

**Made by:** Assembled during the vault build, per Nick's request to
scan recent session history for gaps in the original vault structure.

---

### 2026-08-17 — Next.js + Vercel as the standard build stack

**Decision:** Every new client build (and every rebuild) defaults to
Next.js on Vercel, per [[../TEMPLATES-BUILDS/00-Next.js-Shell]], rather
than choosing a framework/host per client.

**Why:**
- **Consistency.** One stack means one shell, one design-token system,
  one deployment checklist, one preflight gate. A client-specific stack
  choice would mean re-deriving all of that per client, which directly
  fights the 8-hour build-time target in [[01-Financials]] and
  [[04-KPIs]].
- **Fast deploys.** Vercel's preview-per-PR and production-on-merge
  workflow means a client can see a real, working preview within
  minutes of a change, not after a manual deploy step — which matters
  both for the agency's own build speed and for how clients experience
  the review/approval process during a build.
- **The team already knows it.** Next.js/Vercel is a stack the team
  already had deep working knowledge of before the agency existed —
  choosing it wasn't an evaluation among options so much as
  recognizing that re-learning a different framework per client (or
  agency-wide) had no upside and a real velocity cost. Familiarity
  compounds: every hour not spent re-learning tooling is an hour spent
  building, which is the actual constraint described in
  [[06-Capacity-Planning]].

**Status:** Standing decision — not revisited per client. A framework
change would be its own dated entry here, not a quiet drift.

---

### 2026-08-17 — Build fee + monthly management fee over a pure retainer or rev-share model

**Decision:** Revenue is structured as a one-time build fee plus a
recurring monthly management fee (see [[02-Pricing-Model]]), rather
than a pure hourly retainer or a revenue-share arrangement tied to
client outcomes.

**Why:** A flat build fee plus a predictable recurring fee gives the
agency cash-flow predictability that a retainer (billed against
variable hours) or a rev-share (billed against a client's own
performance, which the agency doesn't fully control) doesn't offer at
two-person scale. It also matches how local wellness/medical service
businesses are used to buying — a project price plus a maintenance
plan is a familiar structure in that market, unlike a marketing
rev-share.

**Status:** Standing decision, reflected throughout
[[01-Financials]] and [[02-Pricing-Model]].

---

### 2026-08-17 — Wellness/medical local service businesses as the target niche

**Decision:** The agency targets local wellness and medical service
businesses specifically, rather than local service businesses
generally.

**Why:** This wasn't a market-sizing exercise — it's downstream of
Nick already running First Rehabilitation. The SEO patterns, the
compliance-aware content instincts, and the buyer psychology of a
wellness/medical practice owner were already understood before the
agency's first outside client, per the relationship described in
[[00-Company-Overview]]. Staying in-niche means every new client build
reuses playbooks instead of starting from a blank slate on messaging
and positioning.

**Status:** Standing decision. A move outside the niche (a
non-wellness client) would be worth a dated entry noting why the
exception was made.

---

### 2026-08-17 — Automation with human approval gates instead of hiring

**Decision:** Rather than hiring additional staff to handle SEO
audits, sales outreach, content generation, and reporting at scale,
the agency built agent automations (see
[[../AGENTS/00-Agent-Overview]]) scheduled through
[[../AUTOMATIONS/00-Automation-Calendar]], with Nick and Cam sitting at
approval gates rather than executing the work by hand.

**Why:** At two-person scale, hiring introduces management overhead,
fixed cost, and ramp-up time the agency doesn't have room for yet. An
agent that drafts an SEO change, a sales email, or a social post — and
waits for a human "yes" — converts what would be hours of manual
execution into minutes of review. This is the mechanism
[[06-Capacity-Planning]] depends on to make a 10-client target
achievable without a 10-client-sized headcount.

**Status:** Standing decision. Revisit if approval-gate volume itself
becomes the bottleneck — that would be a capacity problem worth its
own entry here, not a silent process change.

## Related Notes

- [[00-Company-Overview]] — the founding context these decisions sit on top of
- [[01-Financials]] and [[02-Pricing-Model]] — where the revenue-model decisions play out in practice
- [[06-Capacity-Planning]] — the constraint the automation-over-hiring decision is designed against
- [[../TEMPLATES-BUILDS/00-Next.js-Shell]] — the technical result of the stack decision
- [[../SKILLS-RADAR/00-Trending-Tools]] — where future stack/tooling decisions get evaluated before they land here
