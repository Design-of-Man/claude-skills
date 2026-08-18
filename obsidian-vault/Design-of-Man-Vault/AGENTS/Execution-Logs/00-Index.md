---
type: execution-log
tags: [design-of-man, execution-log]
updated: 2026-08-18
---

# Execution Logs — Index

One file per agent run, named `YYYY-MM-DD-<agent-or-topic>.md`. This is the raw record of what an automation actually did on a given day — what it touched, what it found, what's waiting on approval. [[../00-Agent-Overview|Agent specs]] describe what *should* happen; this folder is what *did* happen.

> **Known collision risk**: same-day runs for the same agent, or per-client runs on the same day, will collide on this filename pattern. If that happens, add a short slug (`2026-08-22-seo-audit-abacoa.md`) rather than overwriting the existing log.

## Logs on file

| Date | Log |
|---|---|
| 2026-08-17 | [[2026-08-17-seo-audit]] |
| 2026-08-17 | [[2026-08-17-sales-outreach]] |
| 2026-08-17 | [[2026-08-17-content-gen]] |
| 2026-08-18 | [[2026-08-18-firecrawl-fallback]] |

Whenever an automation falls back to a degraded path (e.g. the [[../../INTEGRATIONS/07-Firecrawl|Firecrawl]] HTTP-crawl fallback), log it here even if the run otherwise succeeded — the fallback is the part worth tracking over time.
