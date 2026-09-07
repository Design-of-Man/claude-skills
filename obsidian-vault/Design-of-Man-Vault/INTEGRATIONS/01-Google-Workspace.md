---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Google Workspace — Calendar, Gmail, Drive

The default productivity layer for the agency. Most accounts, most clients, most of the
time. The exception is the accounts on Microsoft 365 — see [[10-Microsoft-365]] before
assuming an inbox is Gmail.

**Layer**: Agent pipeline
**Status**: Live
**Used by**: Client Support Agent, Sales Outreach Agent, Client Reporting Agent

---

## Calendar

Shared calendar between Nick and Cam. This is the scheduling source of truth; the vault note
[[../TEAM/04-Shared-Calendar]] is a synced view of it, not a second calendar.

| Use | Detail |
|---|---|
| Shared availability | Nick and Cam see each other's blocks; used for capacity planning in [[../BUSINESS/06-Capacity-Planning]] |
| Agent run windows | The automation calendar's fixed slots (Mon 9am outreach, Wed 2pm content, Fri 9am SEO, Sun 5pm previews) are mirrored as calendar blocks so a client call never lands on top of a review window |
| Client calls | Discovery calls, handoffs, launch calls — logged against the client note |
| Meeting scheduling | Availability lookup before proposing times to a prospect |

**Rule**: the calendar is authoritative, the vault note is derived. If they disagree,
Google Calendar wins and the vault note gets corrected.

---

## Gmail

Inbox monitoring for client replies is the daily job.

| Use | Detail |
|---|---|
| Client reply monitoring | Daily Client Support Agent check — searches threads, classifies, logs a ticket into the vault |
| Outreach replies | Monday's outreach lands here; replies get routed to [[../COMMUNICATIONS/03-Prospect-Tracker]] |
| Sending | Outreach and client mail. Agents draft; a human approves in Slack and sends. |
| Labels | Used as the state machine — a thread that has been logged into the vault gets labelled so the next daily run does not re-open it |

### The draft-then-approve rule

Agents create drafts. Agents do not send cold outreach on their own. The approval gate is a
Slack thread in `#client-outreach` (see [[../AUTOMATIONS/Gates-and-Approvals]]). This is not
a technical limitation — it is deliberate, because a bad automated email to a prospect is
unrecoverable in a market this small.

Replies to *existing* client threads are lower-risk but still follow the same gate for
anything involving scope, price, or a commitment.

---

## Drive

Shared docs and assets.

| Use | Detail |
|---|---|
| Client assets | Logos, photography, brand files handed over during onboarding |
| Shared docs | Proposals, scopes, meeting notes that need to be editable by both Nick and Cam |
| Report delivery | Client-facing PDFs from the Client Reporting Agent |
| Handoff | Where a client drops files that are too large or too messy for email |

Drive is for **client-facing and collaborative** files. The vault itself does not live here —
that is Dropbox ([[12-Dropbox]]). Keeping those separate avoids two sync engines fighting
over the same directory.

For clients on Microsoft 365, the equivalent is SharePoint. Same purpose, different platform,
per-client choice.

---

## Access and Scope

| Surface | Agent access | Human-only |
|---|---|---|
| Calendar | Read; create/update for agency-internal blocks | Anything on a client's own calendar |
| Gmail | Read, search, label, create drafts | Sending cold outreach; anything committing to scope or price |
| Drive | Read, search, create, share | Deleting or permanently removing client-supplied originals |

Credentials are OAuth-based and stored per the rules in
`Credentials/README-DO-NOT-SYNC-PLAINTEXT.md`. No token in this vault, ever.

---

## Failure Modes

| Symptom | Likely cause | What to do |
|---|---|---|
| Agent reports an empty inbox for a client who is definitely emailing | That client is on Microsoft 365, not Google | Check the client note's mail platform field, then re-run against Outlook ([[10-Microsoft-365]]) |
| Duplicate tickets for the same thread | Labels not applied on the previous run | Re-label the thread; the label is the idempotency key |
| Calendar and vault disagree | Vault note is stale | Google Calendar is authoritative — refresh [[../TEAM/04-Shared-Calendar]] |
| Workspace outage | Google incident | Inbox monitoring and sending stall. Nothing customer-visible. Wait it out; do not re-route mail through another platform mid-incident. |

---

## Related

- [[../TEAM/04-Shared-Calendar]] — the synced calendar view
- [[10-Microsoft-365]] — the other mail/calendar/file platform, and how to know which applies
- [[08-Slack]] — where approvals happen before anything is sent
- [[../AGENTS/06-Client-Support-Agent]] — the daily consumer of Gmail
- [[00-Integration-Overview]]
