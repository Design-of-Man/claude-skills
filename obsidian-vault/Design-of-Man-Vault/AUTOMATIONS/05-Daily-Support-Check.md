---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Daily Support Check

**Intended to run:** Daily
**Agents:** [[../AGENTS/06-Client-Support-Agent]] and [[../AGENTS/05-Site-Maintenance-Agent]]
**Status: Planning — not live.** Per [[../AGENTS/00-Agent-Overview]], both the Client Support Agent and the Site Maintenance Agent are still in Planning status. Nothing described below is currently running automatically. This note documents the intended design so it's ready to build, not a description of something already happening.

## Intended Behavior

Two daily checks, run by two separate agents, both feeding into the same goal: catch problems — client requests or site issues — same-day instead of waiting for the weekly cycle.

### Client Support Agent (Planning)

- **Input:** the shared client-facing email inbox.
- **Intended workflow:** check the inbox daily, identify inbound client requests (support tickets, content change requests, questions), classify/route each one, and log a ticket entry so nothing sits unseen.
- **Output (planned):** a ticket log, plus routing — simple requests flagged for direct handling, anything requiring judgment routed to Nick or Cam.
- **Reports to (planned):** Slack #alerts or a dedicated support channel, per [[../COMMUNICATIONS/00-Slack-Channels]] once that routing is finalized.

### Site Maintenance Agent (Planning)

- **Input:** all live client sites (see [[../CLIENTS/00-Active-Clients]]).
- **Intended workflow:** check each live site daily for errors — broken pages, failed deployments, uptime issues, obvious visual breaks.
- **Output (planned):** an issue list plus a performance snapshot per client.
- **Reports to (planned):** Slack #site-updates or #alerts, per [[../COMMUNICATIONS/00-Slack-Channels]].
- **Note on cadence:** [[../AGENTS/00-Agent-Overview]] lists this agent's full audit cadence as Weekly (Tuesday) for a deeper site-health pass. The daily check described here is meant to be a lighter, faster error/uptime check that runs every day and feeds into that weekly deeper audit once both pieces are built — not a duplicate of it.

## Why This Is Documented Now, Before It's Live

Both agents are designed and scoped even though neither is running. Writing the intended behavior down now means:

- The Friday SEO Audit and Wednesday Content Gen automations (both live) aren't mistaken for covering client support or site uptime — they don't.
- Whoever builds these agents next has a clear spec instead of starting from nothing.
- Anyone reading the automation calendar in [[00-Automation-Calendar]] can see at a glance which ongoing daily items are real today and which are planned.

## Approval Gate (Planned)

Neither planned agent is expected to take irreversible action without a human — the Client Support Agent is expected to route and log, not resolve tickets autonomously; the Site Maintenance Agent is expected to report issues, not deploy fixes. Once built, any auto-remediation behavior added to either agent should be added to [[Gates-and-Approvals]] as a new gate, the same way SEO changes are split into safe/risky today.

## Related

- [[../AGENTS/06-Client-Support-Agent]] — the agent spec
- [[../AGENTS/05-Site-Maintenance-Agent]] — the agent spec
- [[../AGENTS/00-Agent-Overview]] — status table showing both agents as Planning
- [[00-Automation-Calendar]] — how the daily checks fit into the weekly rhythm
- [[Gates-and-Approvals]] — the full approval reference
