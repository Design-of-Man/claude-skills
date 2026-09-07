---
type: skills-radar
tags: [design-of-man, skills-radar, integrated-tool]
updated: 2026-08-18
---

# MIT AI Gateway

## Status

**INTEGRATED** — evaluated but not yet live. Setup and provider routing are
configured per [[../../INTEGRATIONS/06-MIT-AI-Gateway]]; the "Live" step in
that doc's status checklist is still unchecked, so this is not yet routing
production agent traffic.

- Date added: 2026-08-17
- Lane: Token optimization ([[../00-Trending-Tools]])

## What It Does

Routes API calls through 339+ providers with fallback ordering
(Claude → DeepSeek → GPT-4) and compression (RTK+Caveman) that cuts token
usage 15–95% depending on task. Full setup and integration points live in
[[../../INTEGRATIONS/06-MIT-AI-Gateway]] — this note tracks it from the
skills-radar side (why it was picked up, what it's expected to do for the
agency, what to keep an eye on).

## Impact

Token reduction across all agents once live. Per the integration doc's own
estimate:

| Agent | Expected reduction |
|-------|--------------------|
| SEO Audit | ~40% |
| Sales Outreach | ~25% (less repetition) |
| Content Gen | ~50% (with compression) |
| **Total monthly** | Potentially cuts overall usage in half |

This is the single highest-leverage item on the radar for margin, since
every agent (SEO Audit, Sales Outreach, Copy/Content, Design/Graphics) runs
on metered API calls.

## What to Monitor

- **New model additions** — the gateway's value is largely in provider
  breadth and fallback ordering; new models added to the 339+ provider list
  change what the fallback chain should look like (e.g. a cheaper model
  worth inserting ahead of GPT-4 in the Claude → DeepSeek → GPT-4 order).
- Whether compression (RTK+Caveman) holds output quality across agent
  types once actually turned on — the 15–95% range is wide enough that it
  needs verifying per-agent, not assumed uniform.
- Progress against the remaining checklist in
  [[../../INTEGRATIONS/06-MIT-AI-Gateway]] (Integrated → Tested → Live).

## Related

- [[../../INTEGRATIONS/06-MIT-AI-Gateway]] — full setup and integration doc
- [[../00-Trending-Tools]] — token optimization lane
- [[../01-Repos-to-Evaluate]] — DeepSeek-Harness is queued as a candidate
  for the fallback tier this gateway routes into
