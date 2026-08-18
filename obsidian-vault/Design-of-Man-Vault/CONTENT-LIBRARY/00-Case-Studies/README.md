---
type: content-library
tags: [design-of-man, content]
updated: 2026-08-18
---

# Case Studies

One file per **finished** client engagement — before/after metrics, what was actually done, and the results. This is proof-of-work for the pitch deck and the website, not a project log. Nothing gets a case study until the engagement is done *and* there's enough post-launch data to show real impact.

## Status: Empty (by design)

There are no case study files in this folder yet. That's not an oversight — Design of Man hasn't had a client engagement clear both bars at once:

1. The work is actually finished (site live, migration cut over, campaign run its course).
2. There's enough time-since-launch data to show a believable before/after (traffic, rankings, leads, conversion — not just "it shipped").

Publishing a case study before both are true produces a weak one, and a weak case study is worse than no case study for a two-person shop that's selling credibility.

## Next candidate to watch

**RegenOrtho — Wix → Vercel migration.** This is the strongest candidate in the current pipeline. Once the domain cutover has enough runway behind it to show a real before/after — Search Console position and impressions pre- vs. post-migration, Core Web Vitals delta, lead volume — this becomes the first case study written. See the migration runbook at [[../../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] and the client's own file under `CLIENTS/` for cutover dates. Pull the actual numbers with the `analytics` and `search-console` skills rather than eyeballing it — a case study only earns its keep if the metrics are real and reproducible.

Rule of thumb: don't write it until there's at least 30-60 days of stable post-cutover data. Anything sooner risks a "traffic dipped during reindexing, then guess what" chart that undercuts the pitch instead of making it.

## Other engagements to watch as they mature

| Engagement | What it would show | Ready to write? |
|---|---|---|
| RegenOrtho Wix → Vercel migration | SEO continuity through a host cutover, Core Web Vitals improvement | Not yet — waiting on post-cutover data window |
| Abacoa Podiatry site rebuild | Full rebuild on the Next.js shell, local SEO lift for a single-location practice | Not yet — needs a full reporting cycle post-launch |
| Jupiter Laser & Regenerative Medicine content program | Ongoing blog/content cadence driving organic growth for a laser-therapy practice | Not yet — needs a longer content runway before the SEO curve is worth showing |
| HomeCrew launch | Site build for a home-services vertical (different buyer behavior than medical/wellness clients) | Not yet — not launched |

## When a case study is ready to write

Use one file per engagement, named for the client (e.g. `RegenOrtho-Wix-to-Vercel-Migration.md`), and cover:

- **The problem** — what was broken, slow, or missing before Design of Man touched it
- **What was done** — scope, timeline, tools used (cross-reference the relevant client build under `TEMPLATES-BUILDS/` and any migration/audit skill used)
- **Before/after metrics** — traffic, rankings, Core Web Vitals, leads — pulled from `analytics`/`search-console`, not estimated
- **Client quote** — if available
- **What it's used for** — pitch deck slide, website proof section, or both (cross-reference [[../02-Agency-Content/README]])

## Related

- [[../../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] — the runbook this vertical's cutovers follow
- [[../02-Agency-Content/README]] — where a finished case study eventually gets repurposed into pitch-deck slides
- [[../../CLIENTS/00-Active-Clients]] — current engagement status for every client named above
