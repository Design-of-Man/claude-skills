---
type: communications
tags: [design-of-man, communications]
updated: 2026-08-18
---

# Notification Rules

Five Slack channels ([[00-Slack-Channels]]) generate a lot of traffic if every agent run posts something. This file is the filter: what actually interrupts Nick or Cam, what just sits in a channel for the normal review cadence, and what never leaves the vault log at all.

## Urgency Levels

| Level | Meaning | Delivery | Response Window |
|---|---|---|---|
| Critical | Something client-facing is broken, or a scheduled run failed outright | `#alerts` + direct @mention | Same day, as soon as seen |
| Review-Needed | Agent produced something a human must approve before it goes anywhere | Named channel (see [[00-Slack-Channels]]), no @mention unless overdue | Within that item's normal cadence window |
| Informational | Agent ran successfully and produced something worth knowing but not acting on | Named channel, posted without @mention | Read when convenient |
| Silent / Logged-Only | Routine run, nothing changed, nothing to review | No Slack post — written to the relevant vault log only | N/A |

## What Triggers Each Level

### Critical — immediate ping, both Nick and Cam
- A scheduled automation fails to run at all (see [[../AUTOMATIONS/00-Automation-Calendar]])
- A client's live site is down or returning errors (Site Maintenance Agent, [[../AGENTS/05-Site-Maintenance-Agent]])
- An integration credential fails or an API goes down mid-run (for example, Firecrawl unavailable — see [[../INTEGRATIONS/07-Firecrawl]] for the fallback path)
- A client replies with a complaint, or anything Client Support Agent ([[../AGENTS/06-Client-Support-Agent]]) flags as urgent
- A deploy to a live client site fails or needs a rollback

### Review-Needed — posted to channel, a human has to act before it goes further
- Sales Outreach Agent's drafted emails, before send (`#client-outreach`, [[../AGENTS/02-Sales-Outreach-Agent]])
- SEO Audit Agent's flagged changes that don't qualify for auto-deploy (`#seo-audits`)
- Copy/Design Agents' weekly captions and graphics, before the Sunday client preview (`#social-posts`)
- A new prospect reply that needs a response (`#client-outreach`) — logged either way in [[03-Prospect-Tracker]]

### Informational — posted, no action required unless something looks off
- SEO Audit Agent's summary of safe changes it already auto-deployed (`#seo-audits`)
- Site Maintenance Agent's daily all-clear report (`#site-updates`)
- Weekly client PDF reports going out (Client Reporting Agent, [[../AGENTS/07-Client-Reporting-Agent]])

### Silent / Logged-Only — vault only, no Slack post
- Daily prospect-reply check when there are no new replies
- Daily site check when every client site is green
- Skills Radar Agent's monthly scan when nothing meets the bar to evaluate ([[../AGENTS/Skills-Radar-Agent]])
- Any agent run that completes clean with nothing to review, recorded in that agent's execution log

## Who Gets Pinged

The agency is two people, so routing is by ownership, not by seniority. Full detail lives in [[../TEAM/03-Roles-and-Responsibilities]]; the short version:

| Situation | Notify |
|---|---|
| Prospect or client has a named lead in [[../CLIENTS/00-Active-Clients]] | That lead first (Nick or Cam) |
| No named lead yet, or it affects the whole pipeline | Both |
| Anything Critical | Both, regardless of ownership |
| Design/dev back-and-forth on work still in progress | Not Slack at all — see [[01-Discord-Setup]] |
| Financial, business, or clinic-adjacent items | Nick |
| Design and content review (captions, graphics, site visuals) | Cam first, Nick weighs in as needed |

## Escalation

If a Review-Needed item sits untouched past its normal cadence window — sales emails not reviewed by Tuesday, social content not reviewed by Friday, an SEO thread left unanswered into the following week — it upgrades to Critical and gets the same @mention treatment. Nothing sits in a queue indefinitely waiting for a human who forgot to look.

## Related
- [[00-Slack-Channels]] — where each level actually posts
- [[../AUTOMATIONS/Gates-and-Approvals]] — the approval-gate source of truth these rules implement
- [[../TEAM/03-Roles-and-Responsibilities]] — full Nick/Cam role split
