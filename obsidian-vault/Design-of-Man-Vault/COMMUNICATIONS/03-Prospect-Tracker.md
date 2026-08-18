---
type: communications
tags: [design-of-man, communications]
updated: 2026-08-18
---

# Prospect Tracker

[[../CLIENTS/00-Active-Clients]] tracks where each prospect stands — Hot Prospect, Evaluating, assigned owner. This file tracks the actual touchpoints that got them there: every call, email, and reply, in order, so nobody has to reconstruct "did we already reach out to them" from memory or by scrolling back through `#client-outreach`.

## Log Format

| Date | Prospect | Channel | Outcome | Next Step | Owner |
|---|---|---|---|---|---|
| YYYY-MM-DD | Business name | Email / Call / Referral / Slack thread | What happened | The concrete next action, with a date if there is one | Nick or Cam |

Add a row every time a prospect is touched, outbound or inbound. Sales Outreach Agent sending a templated email ([[02-Email-Templates]]) is a row. A prospect replying is a row. A call happening is a row, even when the outcome is "no follow-up interest."

## Current Prospects

These match the Hot Prospects / Evaluating tables in [[../CLIENTS/00-Active-Clients]]. Rows below illustrate the format against real prospects in the pipeline — update in place as actual touchpoints happen, don't delete history when a prospect converts or drops off.

| Date | Prospect | Channel | Outcome | Next Step | Owner |
|---|---|---|---|---|---|
| 2026-08-18 | IV League | Email (Sales Outreach Agent) | Sent — awaiting reply | Follow up if no reply by 2026-08-25 | Cam |
| 2026-08-18 | Revital IV | Email (Sales Outreach Agent) | Sent — awaiting reply | Follow up if no reply by 2026-08-25 | Nick |
| 2026-08-15 | Paradise Ventures | Call | Pitched, interested, wants pricing detail | Send proposal | Nick |
| 2026-08-10 | Sundial | Email | Interested, awaiting internal budget approval on their end | Check back in ~2 weeks | Cam |
| — | New Life Peptides | Email (planned) | Not yet contacted | Send audit email | Cam |
| — | Legends Radio | — | Not yet contacted | Add to next Monday outreach batch | — |

## What Goes Here vs. What Doesn't

- **Here:** every individual touchpoint — the "who said what, when" record.
- **[[../CLIENTS/00-Active-Clients]]:** the current-state summary — status, confidence, assigned owner, and, once a prospect converts, their entry moves from the prospect tables into the Live Clients table.

When a prospect converts to a client, their row history here stays put — it's the record of how the relationship started and useful context during onboarding. Only their status in the other file changes.

## Related
- [[../CLIENTS/00-Active-Clients]] — current status and ownership
- [[02-Email-Templates]] — the sales template that generates most rows here
- [[00-Slack-Channels]] — `#client-outreach` is where these touchpoints originate before they're logged
- [[../AUTOMATIONS/02-Monday-Sales-Outreach]] — the automation that drives the weekly outreach batch
