---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Slack — Notifications and Approvals

Slack is where agents report and where humans approve. Nothing client-visible ships without
passing through a Slack thread first, which makes this the control surface of the whole
automation stack rather than a notification nicety.

**Layer**: Agent pipeline
**Status**: Live
**Used by**: every agent

Channel definitions, notification rules, and posting formats live in
[[../COMMUNICATIONS/00-Slack-Channels]]. This note covers the **integration** — how agents
connect to it and what happens when it is not there. It does not duplicate the channel
documentation.

---

## Channels

Reference only — the authoritative descriptions are in [[../COMMUNICATIONS/00-Slack-Channels]].

| Channel | Posted to by | Purpose |
|---|---|---|
| `#seo-audits` | SEO Audit Agent | Friday audit results, queued risky changes awaiting approval |
| `#client-outreach` | Sales Outreach Agent | Monday prospect audits and draft emails awaiting approval |
| `#social-posts` | Copy/Content and Design/Graphics Agents | Wednesday captions and assets awaiting review |
| `#site-updates` | Site Maintenance Agent | Deploys, site changes, non-urgent site news |
| `#alerts` | Any agent | Failures, runtime errors, anything needing attention now |

Notification routing rules: [[../COMMUNICATIONS/00-Slack-Channels]] and its
`Notification-Rules.md`.

---

## Slack as an Approval Mechanism

The pattern across every automation is the same:

```
agent produces artifact  →  posts to the relevant channel
                         →  human replies in-thread to approve or reject
                         →  approved artifact ships; thread is the audit trail
```

This is why the channel split matters operationally and not just cosmetically: each channel
maps to one approval type with one reviewer expectation and one response window.

| Channel | Approval needed | Window |
|---|---|---|
| `#client-outreach` | Yes — before any cold email sends | Same day |
| `#social-posts` | Yes — before scheduling, then a client gate on Sunday | Wed–Thu |
| `#seo-audits` | Only for risky changes; safe changes auto-deploy | Before the next Friday run |
| `#site-updates` | No — informational | — |
| `#alerts` | Not approval — action | Immediate |

Full gate definitions: [[../AUTOMATIONS/Gates-and-Approvals]].

**The thread is the record.** An approval that happens verbally or over text does not exist
as far as the audit trail is concerned. If something shipped, there should be a thread
showing who approved it.

---

## Integration Notes

- Agents post via webhook/API into a fixed channel per agent — the channel is configuration,
  not a runtime decision, so a misrouted post is a config bug and gets fixed once.
- Every post links back to the vault note or execution log it came from. A Slack message that
  cannot be traced to a log entry is not enough on its own.
- `#alerts` is the only channel that should trigger a push notification. If everything
  notifies, nothing does — that is the rule the notification config exists to enforce.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| Slack unavailable | Vendor outage | **Agents still run and still write to the vault** — only the approval path is blocked. Approvals move to direct message or text, and get back-filled into the thread afterwards so the audit trail stays intact. |
| Agent output missing from a channel | Webhook misconfigured or wrong channel | Check the execution log — if the log exists, the run succeeded and only delivery failed |
| Approvals piling up unactioned | Too many notifications, so real ones get ignored | Tighten notification rules; this is a signal-to-noise problem, not a Slack problem |
| Something shipped with no thread | Gate bypassed | Treat as an incident — the gate exists for a reason |

---

## Related

- [[../COMMUNICATIONS/00-Slack-Channels]] — authoritative channel documentation
- [[../AUTOMATIONS/Gates-and-Approvals]] — what needs approval and from whom
- [[../AUTOMATIONS/00-Automation-Calendar]] — when the posts arrive
- [[00-Integration-Overview]]
