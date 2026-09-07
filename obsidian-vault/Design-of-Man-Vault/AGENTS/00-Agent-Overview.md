---
type: overview
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Agent Overview

The Design of Man runs eight automated agents that do the recurring work of running a two-person agency: auditing sites, finding prospects, writing content, designing graphics, watching for problems, answering support requests, reporting results, and scouting new tools. Nick and Cam do not run these by hand — they review what the agents produce.

## How agents are specified

Every agent gets one spec file in this folder, and every spec file follows the same shape: **Purpose** (why it exists), **Trigger/Frequency** (when it fires — see the [[../AUTOMATIONS/00-Automation-Calendar]]), **Inputs**, **Outputs**, **Approval Gate** (what ships automatically vs. what needs Nick or Cam's sign-off), **Integrations Used**, **Status**, and **Related Automation**. That consistency is deliberate — a new agent gets added by filling in the same eight fields, and anyone (including a future automated agent) can read one file and know exactly what a given agent does and doesn't do on its own.

Every run of every agent gets logged to `Execution-Logs/` with a dated file — what was checked, what was found, what shipped automatically, and what's sitting in an approval queue. `Status: Ready` means the agent is wired up and running on its schedule. `Status: Planning` means the spec below is the agreed design but the agent isn't live yet.

## All agents

| Agent | Purpose | Frequency | Input | Output | Status |
|---|---|---|---|---|---|
| [[01-SEO-Audit-Agent\|SEO Audit]] | Weekly site optimization | Friday 9am | GSC data, site content | Audit report, deployment queue | Ready |
| [[02-Sales-Outreach-Agent\|Sales Outreach]] | Find & pitch prospects | Monday 9am | Location, industry | Audit + email | Ready |
| [[03-Copy-Content-Agent\|Copy/Caption]] | Write social content | Wednesday 2pm | Client info | 3 captions | Ready |
| [[04-Design-Graphics-Agent\|Design/Graphics]] | Create graphics | Wednesday 2pm | Captions | 3 graphics (Canva) | Ready |
| [[05-Site-Maintenance-Agent\|Site Maintenance]] | Check live sites | Weekly (Tue) | All client sites | Issue list, performance report | Planning |
| [[06-Client-Support-Agent\|Client Support]] | Handle inbound requests | Daily | Email inbox | Ticket log, routing | Planning |
| [[07-Client-Reporting-Agent\|Client Reporting]] | Generate performance reports | Weekly (Thu) | GSC, analytics | PDF report per client | Planning |
| [[Skills-Radar-Agent\|Skills Radar]] | Monitor GitHub trends | Monthly (Fri) | GitHub trending, topics | Evaluated repo list | Ready |

## Reading this table

- **Ready** agents run unattended on their schedule today. Their output still passes through an approval gate before anything client-facing goes live — see each agent's Approval Gate section, or the master list in [[../AUTOMATIONS/Gates-and-Approvals]].
- **Planning** agents have an agreed spec (see their file below) but aren't wired to live data yet — Site Maintenance, Client Support, and Client Reporting are next up.
- Wednesday's two content agents (Copy/Caption, Design/Graphics) run back to back and share one review window — see [[03-Copy-Content-Agent]] and [[04-Design-Graphics-Agent]].
- Skills Radar is the one agent with no weekly automation-calendar slot — it runs monthly and reports into `SKILLS-RADAR/`, not `#seo-audits` or `#social-posts`.
