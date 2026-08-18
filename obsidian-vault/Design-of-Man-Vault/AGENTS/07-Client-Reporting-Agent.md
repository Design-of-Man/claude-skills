---
type: agent
status: planning
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Client Reporting Agent

## Purpose
Builds a weekly performance report per client — traffic, rankings, social reach, and billing status — so clients see the value of the engagement without Nick or Cam assembling a deck by hand every week.

## Trigger / Frequency
Weekly, Thursdays (planned). No automation-calendar entry exists yet — see [[../AUTOMATIONS/00-Automation-Calendar]].

## Inputs
- Google Search Console and Analytics data per client
- Post Bridge social analytics per client
- QuickBooks Online data, for billing-status context only (invoice/payment state — not full financials)

## Outputs (planned)
- One PDF report per client, emailed and archived to Drive

## Approval Gate
Reports are informational, not transactional, so there's no per-run approval gate once a client is established. For any brand-new client, Nick or Cam spot-check the first report before it goes fully automatic — same instinct as any other new integration going live.

## Integrations Used
- [[../INTEGRATIONS/01-Google-Workspace]] — Search Console, Analytics, Drive archive
- [[../INTEGRATIONS/05-QuickBooks-Online]] — billing-status context

## Status
**Planning.** Spec is agreed; the PDF pipeline isn't built yet.

## Related Automation
No dedicated entry in [[../AUTOMATIONS/00-Automation-Calendar]] yet. Once scheduled, it belongs there as a Thursday run.
