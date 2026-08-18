---
type: skills-radar
tags: [design-of-man, skills-radar, integrated-tool]
updated: 2026-08-18
---

# Matt Pocock's Skills

## Status

**REVIEWED**

- Date added: 2026-08-17
- Lane: Agent code quality (adjacent to the four core watchlist lanes —
  see [[../00-Trending-Tools]])

## What It Is

A trending set of TypeScript/agent-code best-practice patterns and
skill-authoring conventions from Matt Pocock, reviewed for applicability
to how this agency writes and maintains agent code (SEO Audit, Sales
Outreach, Copy/Content, Design/Graphics agents, and the client-site build
pipeline).

Unlike MIT AI Gateway and Firecrawl, this isn't a service to integrate —
it's a set of practices to adopt going forward. There's no corresponding
INTEGRATIONS/ doc because there's no credential, API, or live connection
to track; it's a code-quality reference instead.

## Impact

Improved agent code quality — cleaner TypeScript patterns, better error
handling conventions, more consistent skill-authoring structure applied to
agent code going forward.

## Action

Apply best practices to all new agent code. Concretely:

- New agent scripts and skill code follow the reviewed patterns rather
  than ad hoc conventions per agent.
- Existing agent code is not being retroactively rewritten solely for this
  — the action item is forward-looking (new code), not a migration
  project.
- Worth a re-check next time a new agent is scaffolded (e.g. when Site
  Maintenance, Client Support, or Client Reporting agents move from
  "Planning" to "Ready" per AGENTS/00-Agent-Overview) to confirm the
  patterns are actually being followed, not just reviewed once and
  forgotten.

## Related

- [[../00-Trending-Tools]] — watchlist
- [[../../AGENTS/00-Agent-Overview]] — where these practices apply as new
  agents come online
