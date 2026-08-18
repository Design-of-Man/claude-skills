---
type: agent
status: ready
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Skills Radar Agent

## Purpose
Scans GitHub trending and a set of relevant topic areas (agent tooling, web scraping, LLM infrastructure, marketing automation) once a month, and evaluates what it finds against the agency's actual gaps — not star count. Most trending repos aren't worth the integration cost; this agent's job is to find the few that are.

## Trigger / Frequency
Monthly, first Friday.

## Inputs
- GitHub trending feed
- Targeted topic searches: agent tooling, scraping, LLM infra, marketing automation
- The agency's current gap list — pulled from this vault and from pain points Nick/Cam have flagged directly

## Outputs
- A running list of what's trending and why it might matter, in [[../SKILLS-RADAR/00-Trending-Tools]]
- A shortlist of repos worth a closer look, each scored against a real gap rather than popularity, triaged into [[../SKILLS-RADAR/01-Repos-to-Evaluate]]

## Approval Gate
This agent only researches and shortlists — it never installs or integrates anything on its own. A tool moves from "evaluate" to "integrated" only after Nick or Cam approve it.

## Integrations Used
No live-data integration — this is read-only GitHub and web research. Findings are posted through [[../INTEGRATIONS/08-Slack]] for visibility.

## Status
**Ready.** Runs monthly.

## Related Automation
No entry in the weekly [[../AUTOMATIONS/00-Automation-Calendar]] — the monthly cadence lives in `SKILLS-RADAR/Monthly-Scout-Results` instead.
