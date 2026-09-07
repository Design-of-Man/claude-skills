---
type: skills-radar
tags: [design-of-man, skills-radar, integrated-tool]
updated: 2026-08-18
---

# Firecrawl

## Status

**INTEGRATED** — live in the Sales Outreach Agent. Full setup and workflow
detail lives in [[../../INTEGRATIONS/07-Firecrawl]].

- Date added: 2026-08-17
- Lane: Web scraping / auditing ([[../00-Trending-Tools]])

## What It Does

Crawls prospect websites and extracts structure, content, and links —
identifies broken pages and dead links, checks mobile responsiveness, and
pulls meta tags, schema, and performance metrics. In the Sales Outreach
Agent it scores each prospect site (aesthetics 0–10, technical 0–10) and
feeds those findings into the pitch. Full workflow:
[[../../INTEGRATIONS/07-Firecrawl]].

## Impact

Automated prospect auditing — the Sales Outreach Agent no longer needs a
human to manually review a prospect's site before pitching. This is the
core input to the Monday outreach run (see AUTOMATIONS/00-Automation-Calendar
in the vault root).

## What to Monitor

- **Scraping limits and rate updates** — Firecrawl usage needs to stay
  within whatever plan/rate limits apply, especially as prospect volume
  scales past the current 5–10/week outreach target.
- **Known availability gap.** Firecrawl is not always reachable — this has
  already happened in practice during a domain migration verification pass.
  The fallback pattern (plain HTTP crawl: fetch each path, follow
  redirects, record final status) is documented in the `domain-migration`
  skill and was used for real during a cutover — see
  [[../../AGENTS/Execution-Logs/2026-08-18-firecrawl-fallback]] for that
  run's specifics, and
  [[02-Integrated-Tools/Domain-Migration|Domain-Migration]] for how the
  fallback got formalized into a checklist step rather than handled
  ad hoc. Any agent or workflow that depends on Firecrawl (Sales Outreach,
  post-migration verification) should have this fallback available, not
  just assume Firecrawl is always up.

## Related

- [[../../INTEGRATIONS/07-Firecrawl]] — full setup, workflow, and
  known-issues/fallback documentation
- [[../../AGENTS/Execution-Logs/2026-08-18-firecrawl-fallback]] — the
  execution log where the fallback was actually needed and used
- [[02-Integrated-Tools/Domain-Migration|Domain-Migration]] — the skill
  that formalized the Firecrawl-unavailable fallback as a standard
  cutover-verification step
- [[../00-Trending-Tools]] — web scraping / auditing lane
