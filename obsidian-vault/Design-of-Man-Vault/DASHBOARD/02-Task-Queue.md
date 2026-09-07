---
type: dashboard
status: planning
tags: [design-of-man, dashboard]
updated: 2026-08-18
---

# Task Queue — Pending Approvals

The list of things an agent has produced that cannot proceed without a human. This is the panel Nick and Cam will actually look at every day, and the one place where the automation's throughput is capped by human attention. Everything else on the dashboard is information; this is work.

Policy — what requires approval and who can give it — is defined in [[../AUTOMATIONS/Gates-and-Approvals]]. This note covers how the queue behaves as a system.

---

## What's in it

| Class | Produced by | Approver | Suggested window | Risk if wrong |
|-------|-------------|----------|------------------|---------------|
| **Sales email** | Sales Outreach Agent, Mondays 9am | Nick or Cam | 48 hours | Bad first impression with a prospect; unrecoverable |
| **Social caption** | Copy/Content Agent, Wednesdays 2pm | Nick or Cam | Until 2h before the scheduled slot | Public, client-branded, screenshot-able |
| **Social graphic** | Design/Graphics Agent, Wednesdays 2:30pm | Nick or Cam | Until 2h before the scheduled slot | Same as above |
| **SEO change (risky)** | SEO Audit Agent, Fridays 9am | Nick or Cam | 7 days | Ranking damage, hard to attribute later |
| **Client support reply** | Client Support Agent (planning) | Nick or Cam | 24 hours | Client-facing tone and commitments |

Safe SEO changes — meta descriptions, schema, alt text within existing rules — deploy without approval per the Friday audit design and appear in the queue only as an after-the-fact entry marked `auto-deployed`, so there is still a record and a way to catch a bad one. The boundary between "safe" and "risky" is defined in [[../AUTOMATIONS/01-Friday-SEO-Audit]] and is worth revisiting after the first month of real runs.

---

## How items enter

Items are created by automation runs — see [[../AUTOMATIONS/00-Automation-Calendar]] for the schedule.

1. An automation fires. The agent takes a client lock if the task is write-class ([[00-Dashboard-Architecture]] §4).
2. The agent generates its artifact and writes an **approval row first**, status `pending`, carrying: the artifact body, the client, the originating `run_id`, the class, the expiry, and a content hash.
3. Only then does it post to Slack with Approve / Reject buttons carrying the `approval_id`.
4. The item appears in the dashboard queue immediately, whether or not the Slack post succeeded. A failed post shows a `not delivered to Slack` badge rather than vanishing.

**Dedupe on re-runs.** If an automation is re-run — a retry after a crash, or a manual kick — it will regenerate artifacts that already exist as pending items. Key on `(client_id, class, content_hash)`: an identical artifact is a no-op, and a changed artifact for the same target *supersedes* the earlier pending item (marks it `superseded`, posts the new one). Without this, a single retry doubles the queue and someone eventually approves both versions of the same email.

---

## How items leave

| Exit | Trigger | What happens |
|------|---------|--------------|
| **Approved** | Slack button or dashboard button | Status flips, actor and timestamp recorded, Slack message rewritten in place, the agent's resume step sends or deploys |
| **Approved with edits** | Dashboard editor, or a Slack modal | Edited body is stored as the final artifact, original kept for diffing, then treated as approved |
| **Rejected** | Slack button or dashboard button | Status flips; **a reason is required** |
| **Expired** | Window elapses with no action | Status flips to `expired`, returns to the queue flagged *needs attention* |
| **Superseded** | A newer run replaced the artifact | Closed silently, linked to the replacement |

Three things about exits that matter more than they look:

**Approve-with-edits is not optional.** Nick will want to change a sentence in a sales email far more often than he will want to reject it outright. If the only options are approve and reject, the real workflow becomes "reject, then write it by hand in Gmail," and the automation stops earning its keep. Slack buttons can't carry an edited body cleanly, so this path is dashboard-first (with a Slack modal as a later nicety).

**Rejection reasons are training data.** They are the only structured signal about why the agent's output is wrong. Required field, free text, stored on the approval row and surfaced in the agent's own note so prompt changes can be driven by actual failures rather than recollection.

**Nothing auto-sends on expiry.** An expired approval is a prompt for a human, never a substitute for one. See [[00-Dashboard-Architecture]] §5.

---

## Where the queue reads from

| Data | Source |
|------|--------|
| Live queue state, status transitions, approvers | `approvals` table (Postgres) — the system of record |
| Which classes require approval, who may approve, SLA | [[../AUTOMATIONS/Gates-and-Approvals]] |
| What produced an item, and everything else that run did | `AGENTS/Execution-Logs/` and the `agent_runs` table |
| Client context on each item (domain, plan, health) | `CLIENTS/` notes via the vault sync; see [[03-Client-Health]] |
| Delivery state of the Slack notification | `approvals.slack_message_ts` + retry worker |

The queue is *not* read from markdown. Approval state changes many times a day, is contended between two people and several agents, and must survive Dropbox being slow — all the reasons operational state lives in Postgres rather than the vault. Execution logs remain the durable human-readable archive of what happened; the queue is the live working set.

---

## Queue behavior

- **Oldest-first within class**, classes ordered by how quickly they go stale: social content (hard deadline) → sales emails → support replies → SEO changes.
- **Grouped by approver** when an item is assigned, so "blocked on you" is answerable at a glance. Unassigned items go to a shared pool either person can clear.
- **Aging badges** at 50% and 90% of each item's window, with a Slack nudge at 50%.
- **Batch approve** for low-risk classes only — a week of captions for one client is a reasonable batch; sales emails to five different prospects are not, and should stay individually reviewed.
- **A visible count of what expired last week.** A queue that quietly expires items is a queue nobody is really working. If that number is not near zero, either the volume is too high for two people or the approval gates are drawn too tightly — both are worth knowing.

Related: [[00-Dashboard-Architecture]] · [[03-Client-Health]] · [[../AUTOMATIONS/Gates-and-Approvals]] · [[../AUTOMATIONS/00-Automation-Calendar]] · [[../AGENTS/00-Agent-Overview]]
