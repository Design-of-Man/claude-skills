---
type: communications
tags: [design-of-man, communications]
updated: 2026-08-18
---

# Email Templates

Three templates cover the outbound email the agency sends: a cold pitch to a prospect, a status update to an active client, and a confirmation once something's been scheduled or booked. All three use `{{merge_field}}` placeholders — an agent or a human fills them in before send, and every send still passes through the approval gates in [[../AUTOMATIONS/Gates-and-Approvals]] before it leaves draft state.

## 1. Sales Outreach Template

**Used by:** Sales Outreach Agent ([[../AGENTS/02-Sales-Outreach-Agent]]), Monday morning run, drafted into `#client-outreach` for review before send — see [[../AUTOMATIONS/02-Monday-Sales-Outreach]].

**Trigger:** A new prospect is audited (via Firecrawl — [[../INTEGRATIONS/07-Firecrawl]]) and scores well enough to pitch.

**Subject:** `Quick note on {{prospect_business}}'s website`

```
Hi {{prospect_contact_name}},

I took a look at {{prospect_business}}'s site while researching {{prospect_industry}}
businesses in {{prospect_location}}, and noticed a few things that are probably
costing you leads: {{audit_top_finding}}.

I run {{agency_name}} with my partner — we build and manage sites for
{{prospect_industry}} businesses in the area. Happy to send over the full audit
I put together, no charge, no obligation. Worth a quick look?

{{sender_name}}
{{agency_name}}
{{sender_phone}}
```

**Merge fields:**

| Field | Source |
|---|---|
| `{{prospect_contact_name}}` | Prospect research / Google Business Profile listing |
| `{{prospect_business}}` | Prospect research |
| `{{prospect_industry}}` | Prospect research |
| `{{prospect_location}}` | Prospect research |
| `{{audit_top_finding}}` | Firecrawl audit output — the single sharpest issue found |
| `{{agency_name}}` | Fixed: The Design of Man |
| `{{sender_name}}` | Whichever of Nick/Cam owns this prospect — see [[../CLIENTS/00-Active-Clients]] |
| `{{sender_phone}}` | Sender's contact info |

**Logging:** Every send, and every reply, gets a row in [[03-Prospect-Tracker]].

## 2. Client Update Template

**Used by:** Client Reporting Agent ([[../AGENTS/07-Client-Reporting-Agent]]) alongside the weekly PDF report, or manually by Nick/Cam for anything the automated report doesn't cover.

**Trigger:** Weekly reporting cadence (Thursday, per [[../AUTOMATIONS/00-Automation-Calendar]]), or an ad hoc update after a site change ships.

**Subject:** `{{client_name}} — this week's update`

```
Hi {{client_contact_name}},

Quick update on {{client_name}}'s site:

- {{update_summary_line_1}}
- {{update_summary_line_2}}
- {{update_summary_line_3}}

Full report is attached. Let us know if you have any questions or want to jump
on a call.

{{sender_name}}
{{agency_name}}
```

**Merge fields:**

| Field | Source |
|---|---|
| `{{client_name}}` | [[../CLIENTS/00-Active-Clients]] |
| `{{client_contact_name}}` | Client record |
| `{{update_summary_line_1}}` – `{{update_summary_line_3}}` | Pulled from that week's SEO audit, site maintenance, or reporting output |
| `{{sender_name}}` | Account owner for this client |
| `{{agency_name}}` | Fixed: The Design of Man |

## 3. Confirmation / Booking Template

**Used by:** Nick or Cam, manually, once a prospect or client call gets scheduled — this one isn't automated end-to-end because it depends on an actual calendar slot being agreed on first.

**Trigger:** A call, onboarding session, or site walkthrough gets booked.

**Subject:** `Confirmed: {{meeting_type}} on {{meeting_date}}`

```
Hi {{recipient_name}},

Confirming our {{meeting_type}} on {{meeting_date}} at {{meeting_time}}
({{meeting_timezone}}).

{{meeting_link_or_location}}

Talk soon,
{{sender_name}}
{{agency_name}}
```

**Merge fields:**

| Field | Source |
|---|---|
| `{{recipient_name}}` | Prospect or client contact |
| `{{meeting_type}}` | e.g. "intro call," "onboarding kickoff," "site walkthrough" |
| `{{meeting_date}}` / `{{meeting_time}}` / `{{meeting_timezone}}` | Agreed on the call or email that led to booking |
| `{{meeting_link_or_location}}` | Video link or address |
| `{{sender_name}}` | Whoever booked it |

**Logging:** For a prospect, this confirmation is itself a next-step entry in [[03-Prospect-Tracker]] (outcome: "Booked call"). For a client, it doesn't need a tracker row — client status already lives in [[../CLIENTS/00-Active-Clients]].

## Notes on Use

- These are starting points, not scripts. Every real send should read like it was written by the person sending it, not a form letter — the sales template especially depends on `{{audit_top_finding}}` being specific to that prospect. A generic pitch is the fastest way to get ignored.
- None of these send automatically. Sales emails in particular always route through the approval step in [[../AUTOMATIONS/02-Monday-Sales-Outreach]] before they leave draft state.

## Related
- [[03-Prospect-Tracker]] — where sales-template sends and replies get logged
- [[../AGENTS/02-Sales-Outreach-Agent]] — the agent that drafts template 1
- [[../AGENTS/07-Client-Reporting-Agent]] — the agent that feeds template 2
- [[../AUTOMATIONS/Gates-and-Approvals]] — approval requirements before any of these send
