---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Microsoft 365 — Outlook Mail, Calendar, SharePoint

Microsoft 365 runs alongside [[01-Google-Workspace]], not instead of it. At least one
client-adjacent account lives on Microsoft 365, and that is enough to make "which platform
is this inbox on?" a question every mail-touching agent has to answer before it runs.

**Layer**: Agent pipeline
**Status**: Live
**Used by**: Client Support Agent, Client Reporting Agent

---

## Surfaces in Use

| Surface | Use |
|---|---|
| **Outlook mail** | Inbox monitoring, thread search, drafts, sending — the Microsoft-side equivalent of Gmail |
| **Outlook calendar** | Availability, meeting scheduling for accounts on this platform |
| **SharePoint** | Shared document and asset storage — the Microsoft-side equivalent of Google Drive |
| **Teams** | Chat/message search, where a client conversation happens there instead of email |

---

## When to Use Which Platform

This is the part that matters operationally. **The platform is a property of the account, not
of the task.** There is no "we use Google for X and Microsoft for Y" rule — there is a
per-client fact that has to be looked up.

| Situation | Platform |
|---|---|
| Agency internal — Nick and Cam, shared calendar, agency mail | Google Workspace |
| A client whose organisation runs on Microsoft 365 | Microsoft 365 — their Outlook, their SharePoint |
| A client on Google Workspace | Google Workspace |
| Shared files with an M365 client | SharePoint, because that is where they will actually look |
| Shared files with a Google client | Google Drive, for the same reason |

### Why the Client Support Agent needs this explicitly

The Client Support Agent's daily job is "check the inbox for client replies." If it checks
Gmail for a client whose mail lives in Outlook, it will find **nothing** — and "nothing"
looks exactly like "no replies today." The failure is silent, and it is silent in the
direction of a client being ignored.

So:

1. **Every client note carries a mail platform field** — `Google Workspace` or
   `Microsoft 365`.
2. The agent reads that field **before** searching, and searches the matching platform.
3. If the field is missing, the agent flags it in `#alerts` rather than defaulting to Google.
   A default is what turns a missing field into a missed client email.
4. When in doubt, check both. Checking twice costs a few seconds; missing a client reply for
   three days costs more.

The same logic applies to calendar lookups and to file delivery — sending a client a Google
Drive link when their whole organisation is on SharePoint gets a "we cannot open this"
reply, which is a small thing that reads as carelessness.

---

## Operating Notes

- Mail conventions mirror the Gmail side: agents draft, humans approve and send anything
  that commits to scope, price, or a timeline ([[../AUTOMATIONS/Gates-and-Approvals]]).
- Labels/categories serve the same idempotency purpose as Gmail labels — a processed thread
  is marked so the next daily run does not re-log it.
- SharePoint file operations (upload, move, rename) are fine for agency-created deliverables;
  do not reorganise a client's own SharePoint structure. It is their filing system.
- Access is OAuth. Nothing is stored in this vault — see
  `Credentials/README-DO-NOT-SYNC-PLAINTEXT.md`.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| Agent reports "no client replies" but the client is emailing | Wrong platform checked | Verify the mail platform field on the client note; check both platforms |
| Client cannot open a shared file | Google link sent to an M365 client, or vice versa | Re-share from the platform they actually use |
| Duplicate support tickets | Category/label not applied on the previous run | Same fix as Gmail — the marker is the idempotency key |
| Microsoft 365 outage | Vendor incident | Google-side accounts are unaffected. Do not re-route a client's mail mid-incident. |
| Calendar conflicts between platforms | Two calendars, one human | Google Calendar remains the agency's own source of truth ([[../TEAM/04-Shared-Calendar]]); Outlook calendars are read for client-side availability |

---

## Related

- [[01-Google-Workspace]] — the other half of this decision
- [[../AGENTS/06-Client-Support-Agent]] — the agent that must get this right
- [[../CLIENTS/00-Active-Clients]] — where the per-client mail platform is recorded
- [[12-Dropbox]] — internal file sync, distinct from client-facing file sharing
- [[00-Integration-Overview]]
