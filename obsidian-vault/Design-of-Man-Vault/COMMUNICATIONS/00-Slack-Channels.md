---
type: communications
tags: [design-of-man, communications]
updated: 2026-08-18
---

# Slack Channels

Slack is where the agents talk to Nick and Cam. Every recurring automation in [[../AUTOMATIONS/00-Automation-Calendar]] lands its output in one of five channels below — nothing agent-generated goes straight to a client or a prospect without passing through one of these first. For the rules on what actually triggers a notification versus what just gets posted quietly, see [[Notification-Rules]].

Slack is not where Nick and Cam talk to each other about half-finished work — that's [[01-Discord-Setup]]. Slack is agent output and anything client-facing-adjacent; Discord is the two of them thinking out loud.

## The Five Channels

| Channel | Purpose | Posts From | Cadence |
|---|---|---|---|
| `#seo-audits` | Weekly SEO findings and the deploy queue, per client | SEO Audit Agent ([[../AGENTS/01-SEO-Audit-Agent]]) | Friday 9:00 AM |
| `#client-outreach` | New prospects, drafted cold emails awaiting approval, prospect replies | Sales Outreach Agent ([[../AGENTS/02-Sales-Outreach-Agent]]) | Monday 9:00 AM + daily reply check |
| `#social-posts` | Draft captions and graphics for the coming week | Copy/Content Agent + Design/Graphics Agent ([[../AGENTS/03-Copy-Content-Agent]], [[../AGENTS/04-Design-Graphics-Agent]]) | Wednesday 2:00–2:30 PM |
| `#site-updates` | Live-site health checks, deploy confirmations, issues found on client sites | Site Maintenance Agent ([[../AGENTS/05-Site-Maintenance-Agent]]) + Vercel deploy notifications | Daily |
| `#alerts` | Anything that needs a human now, regardless of which agent or integration triggered it | Cross-cutting — any agent, plus integration failures | As triggered |

## Channel Detail

### #seo-audits
SEO Audit Agent posts here every Friday morning with what it found across all client sites (pulled from Search Console) and what it did about it. Safe changes — meta tags, schema markup — are already deployed by the time the post lands; this channel is the record of that, not a request for permission. Anything riskier gets flagged in the same post and waits for a thread reply from Nick or Cam before it ships. See [[../AUTOMATIONS/01-Friday-SEO-Audit]] for the full breakdown of what counts as "safe."

### #client-outreach
Two jobs live here: the Monday morning batch of newly-audited prospects with drafted pitch emails (nothing sends until Nick or Cam approves in-thread), and the daily check for prospect replies. Every send and every reply gets a row in [[03-Prospect-Tracker]] — this channel is the live feed, the tracker is the durable log. See [[../AUTOMATIONS/02-Monday-Sales-Outreach]].

### #social-posts
Copy/Content Agent drops three draft captions per client at 2:00 PM Wednesday; Design/Graphics Agent follows at 2:30 PM with matching graphics. Nick and Cam review Wednesday through Thursday. Once approved, the batch feeds the Sunday client preview email before Monday go-live. See [[../AUTOMATIONS/03-Wednesday-Content-Gen]] and [[../AUTOMATIONS/04-Sunday-Preview-Email]].

### #site-updates
Site Maintenance Agent's daily sweep of every live client site — uptime, broken links, obvious errors — posts here, along with Vercel deploy confirmations when a change actually ships. Most days this is informational only: an all-clear, or a routine deploy note. It only escalates to `#alerts` when something's actually broken. See [[../AGENTS/05-Site-Maintenance-Agent]].

### #alerts
The catch-all for anything that can't wait for its normal channel's cadence: integration failures (for example, Firecrawl going unavailable mid-run — see [[../INTEGRATIONS/07-Firecrawl]] for the documented fallback), a client site actually down, a credential expiring and blocking a scheduled run, or anything Client Support Agent ([[../AGENTS/06-Client-Support-Agent]]) flags as too urgent for the daily digest. This is the one channel where the everyday "post and review on cadence" rule doesn't apply — see [[Notification-Rules]] for exactly what lands here versus what stays logged elsewhere.

## What Doesn't Have a Channel Yet

Client Reporting Agent ([[../AGENTS/07-Client-Reporting-Agent]]) delivers its weekly PDF report directly per client rather than posting to Slack, and Skills Radar Agent ([[../AGENTS/Skills-Radar-Agent]]) writes its monthly scout results straight into the vault rather than to a channel. Both are lower-frequency, non-urgent outputs — forcing them into `#alerts` would just add noise to the channel that's supposed to mean "look now." If either becomes something that needs a live feed, that's a sixth channel to add, not a reason to overload an existing one.

## Related
- [[Notification-Rules]] — what triggers a ping vs. what's silent or logged-only
- [[../AUTOMATIONS/00-Automation-Calendar]] — the schedule that fills these channels
- [[../AGENTS/00-Agent-Overview]] — full agent specs
- [[../INTEGRATIONS/08-Slack]] — webhook and integration setup
