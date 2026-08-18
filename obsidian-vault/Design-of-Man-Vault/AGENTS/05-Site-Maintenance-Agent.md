---
type: agent
status: planning
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Site Maintenance Agent

## Purpose
A weekly health check across every live client site — uptime, broken links, Core Web Vitals, and deployment status — so a build failure or a regression gets caught by the agent before a client emails about it.

## Trigger / Frequency
Weekly, Tuesdays (planned). No automation-calendar entry exists yet for this run — the calendar currently only schedules Friday/Monday/Wednesday/Sunday/Daily agents.

## Inputs
- The full list of live client sites and their Vercel projects
- Last week's maintenance report, for diffing

## Outputs (planned)
- Per-client issue list: broken links, failed builds, Core Web Vitals regressions
- A rolled-up performance report across all live clients
- Auto-filed follow-up items for anything that's client-facing (not just internal noise)

## Approval Gate
Monitoring itself runs unattended — it's read-only. Any fix this agent proposes that touches live code or content routes through the same gate as SEO changes: Nick or Cam sign off in Slack before anything deploys. See [[../AUTOMATIONS/Gates-and-Approvals]].

## Integrations Used
- [[../INTEGRATIONS/02-Vercel]] — deployment status, build logs, web analytics, runtime errors

## Status
**Planning.** Spec is agreed; not yet wired to live sites or a schedule.

## Related Automation
No dedicated entry in [[../AUTOMATIONS/00-Automation-Calendar]] yet. Once scheduled, it belongs there as a Tuesday run.
