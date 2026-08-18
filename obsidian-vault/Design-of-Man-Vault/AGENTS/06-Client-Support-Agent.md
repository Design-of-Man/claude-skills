---
type: agent
status: planning
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Client Support Agent

## Purpose
Watches inbound client email and Slack for support requests, logs every one as a ticket, and routes it to the right owner — Nick, Cam, or an existing agent — instead of letting it sit in an inbox until someone happens to check.

## Trigger / Frequency
Daily (planned). See [[../AUTOMATIONS/05-Daily-Support-Check]].

## Inputs
- The shared support inbox — clients email in through whichever domain they were onboarded on, so this spans both [[../INTEGRATIONS/01-Google-Workspace|Google Workspace]] and [[../INTEGRATIONS/10-Microsoft-365|Microsoft 365]] mailboxes
- Slack DMs sent directly to the agency

## Outputs (planned)
- A ticket log: client, request type, urgency
- A routing decision per ticket
- A Slack `#alerts` notification for anything flagged urgent

## Approval Gate
Logging and routing run unattended — no client sees that step. Any reply that commits to scope, pricing, or a timeline is drafted for Nick or Cam, never sent by the agent on its own. See [[../AUTOMATIONS/Gates-and-Approvals]].

## Integrations Used
- [[../INTEGRATIONS/01-Google-Workspace]]
- [[../INTEGRATIONS/10-Microsoft-365]]
- [[../INTEGRATIONS/08-Slack]] — `#alerts`

## Status
**Planning.** Spec is agreed; inbox monitoring isn't live yet.

## Related Automation
[[../AUTOMATIONS/05-Daily-Support-Check]]
