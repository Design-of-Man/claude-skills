---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Automation Calendar

The weekly rhythm the agency runs on. Every automation below is an agent (see [[../AGENTS/00-Agent-Overview]]) firing on a schedule, producing output that either deploys automatically (safe, low-risk changes) or lands in a Slack channel for Nick or Cam to approve first. When in doubt about whether something needs a human before it goes out, check [[Gates-and-Approvals]] — that's the single source of truth for approval gates across all of these.

## Weekly Schedule

| Day | Time | Automation | Output Goes To | Approval Needed? | Detail |
|-----|------|-------------|-----------------|-------------------|--------|
| Monday | 9:00 AM | Sales Outreach Agent runs | Slack #client-outreach | Yes — Nick/Cam review and approve before send | [[02-Monday-Sales-Outreach]] |
| Monday–Friday | Ongoing | Prospect reply check (daily) | Logged to vault / [[../COMMUNICATIONS/03-Prospect-Tracker]] | No | [[02-Monday-Sales-Outreach]] |
| Wednesday | 2:00 PM | Copy Agent generates 3 captions per client | Slack #social-posts | Yes — Nick/Cam review Wed–Thu | [[03-Wednesday-Content-Gen]] |
| Wednesday | 2:30 PM | Design Agent generates 3 graphics per client (Canva) | Slack #social-posts | Yes — Nick/Cam review Wed–Thu | [[03-Wednesday-Content-Gen]] |
| Thursday | — | Client Reporting Agent generates PDF report per client | Delivered per client | No (informational, status: Planning) | [[../AGENTS/07-Client-Reporting-Agent]] |
| Friday | 9:00 AM | SEO Audit Agent runs | Slack #seo-audits | Partial — safe changes auto-deploy, risky changes need approval | [[01-Friday-SEO-Audit]] |
| Sunday | 5:00 PM | Content Preview Email sent to clients | Client inbox | Client has a 24-hour feedback window before anything goes live | [[04-Sunday-Preview-Email]] |

## Ongoing / Daily

These run every day, independent of the weekly cycle above.

| Automation | Frequency | Status | Detail |
|------------|-----------|--------|--------|
| Client Support Agent checks email inbox | Daily | Planning | [[05-Daily-Support-Check]] |
| Site Maintenance Agent checks live sites for errors | Daily | Planning | [[05-Daily-Support-Check]] |
| Client Reporting Agent generates PDFs | Weekly (Thursday) | Planning | [[../AGENTS/07-Client-Reporting-Agent]] |

Two of these three ongoing items are still in **Planning** status per [[../AGENTS/00-Agent-Overview]] — they are documented here as intended behavior, not as live automations. See [[05-Daily-Support-Check]] for the honest state of what's actually running today versus what's designed.

## How the Week Connects

The Wednesday → Sunday → Monday chain is the one worth holding in your head:

1. **Wednesday 2:00–2:30 PM** — Copy and Design agents generate the coming week's social content.
2. **Wednesday–Thursday** — Nick/Cam review captions and graphics in #social-posts, approve or request changes.
3. **Sunday 5:00 PM** — approved content goes out to each client as a preview email, starting a 24-hour client feedback window.
4. **Monday** — the week's posts go live (via Post Bridge) once the client window has closed without objection, and the Sales Outreach Agent kicks off the same morning to find that week's new prospects.

Friday's SEO Audit and the daily Client Support / Site Maintenance checks run independently of this content chain — they touch existing client sites rather than the social content pipeline.

## Approvals Required

Every automation that produces something client-facing or public-facing has a human checkpoint. The three categories, transcribed from the original schedule design:

- **Sales emails** — Nick/Cam must approve before anything sends (see [[02-Monday-Sales-Outreach]])
- **Social posts** — Nick/Cam review Wednesday–Thursday, and clients get a Sunday preview window before Monday go-live (see [[03-Wednesday-Content-Gen]] and [[04-Sunday-Preview-Email]])
- **SEO changes** — safe changes deploy automatically, risky changes wait for Nick/Cam sign-off via a Slack thread (see [[01-Friday-SEO-Audit]])

Full detail, including exactly who approves what and through which channel, lives in [[Gates-and-Approvals]].
