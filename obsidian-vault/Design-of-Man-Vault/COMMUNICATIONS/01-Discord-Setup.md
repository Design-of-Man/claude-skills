---
type: communications
tags: [design-of-man, communications]
updated: 2026-08-18
---

# Discord Setup

Discord is Nick and Cam's own space — not agent output, not client-facing, not something a prospect or client should ever see referenced. If it comes from an agent or an automation, it belongs in Slack ([[00-Slack-Channels]]). If it's two people figuring something out before it's ready to be agent output, or ready to ship, it belongs here.

## Why a Separate Tool

Slack fills up fast once five automations are posting to it daily. Mixing "here's a draft caption the Copy Agent wrote" with "hey, can you look at this component before I push it" makes both harder to track. Splitting them keeps Slack a clean automation record and Discord an unstructured conversation that doesn't need to be searchable or auditable six months from now.

| | Slack | Discord |
|---|---|---|
| Audience | Agent output, approval gates, client-adjacent alerts | Nick and Cam only |
| Content | Structured: drafts, reports, alerts (see [[00-Slack-Channels]]) | Informal: dev chat, design feedback, quick check-ins |
| Posted by | Agents and automations | Humans |
| Retention expectation | Kept as a record — ties into [[03-Prospect-Tracker]] and agent execution logs | Ephemeral — not treated as a system of record |

## Server Structure

| Channel | Purpose |
|---|---|
| `#general` | Whatever doesn't need its own channel |
| `#dev` | Code review chatter, "why is this breaking," repo links, deploy questions that aren't yet an official `#site-updates` issue |
| `#design-review` | In-progress mockups, Figma links — "does this look right" before it becomes a reference for the Design/Graphics Agent |
| `#standup` | Quick async check-ins on what each of them is working on, no fixed schedule |
| `#wins` | A client goes live, a prospect signs, a good review comes in — morale, not process |

## Membership

Two members: Nick and Cam. No agents post here, and no bot integrations are required to run it — this is deliberately the one piece of the stack that stays fully manual. If a contractor or specialist joins the agency later, they get added here before they're anywhere near client-facing Slack channels.

## What This Is Not

- **Not a backup for approval gates.** A decision talked through in `#dev` still has to be reflected wherever [[../AUTOMATIONS/Gates-and-Approvals]] says it needs to live — a Slack thread, the vault, etc. Discord conversation isn't an audit trail.
- **Not where prospect or client communication happens.** That's [[02-Email-Templates]] for outbound and [[03-Prospect-Tracker]] for the log of it.
- **Not synced to the vault automatically.** If a decision made in Discord actually matters long-term — a tooling choice, a pricing change, a "why we did it this way" — it gets written down properly (for example in [[../BUSINESS/05-Decisions-Log]]), not left to scroll off the channel history.

## Related
- [[00-Slack-Channels]] — the agent-output counterpart to this
- [[../TEAM/00-Team-Overview]] — who Nick and Cam are
- [[../TEAM/03-Roles-and-Responsibilities]] — the role split this collaboration channel supports
