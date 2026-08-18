---
type: business
tags: [design-of-man, business, expenses]
updated: 2026-08-18
---

# Expenses

Detail behind the monthly expense table in [[01-Financials]] — what
each subscription actually pays for, how often it renews, and what's
being watched for future spend as evaluated tools move to paid tiers.
These are real dollar figures (small, known, recurring), not
placeholders.

## Current Monthly Expenses

| Expense | Monthly Cost | Renewal Cadence | What It's For |
|---|---|---|---|
| Claude subscriptions | $40 | Monthly, 2 seats (Nick + Cam) | The agent/automation layer this entire vault and its automations run on — [[../AGENTS/00-Agent-Overview]], the automations in [[../AUTOMATIONS/00-Automation-Calendar]], and day-to-day Claude Code usage for client build work |
| Vercel | $50 | Monthly | Hosting and deployments for every client site built on the [[../TEMPLATES-BUILDS/00-Next.js-Shell\|Next.js shell]], plus preview deployments per PR — see [[../INTEGRATIONS/02-Vercel]] |
| Canva Teams | $15 | Monthly | The design surface [[../AGENTS/04-Design-Graphics-Agent]] outputs social graphics into for Nick/Cam review each Wednesday |
| Post Bridge | $0 | Free tier | Social media scheduling/publishing across client accounts — see [[../INTEGRATIONS/03-Post-Bridge]]. Free tier is sufficient at current client volume; revisit if the 10-client target in [[01-Financials]] pushes past free-tier post/account limits |
| Descript | Shared with clinic | Monthly, billed to First Rehabilitation | Podcast and video editing — used by both the clinic (per [[../CLINIC/00-Clinic-Overview]]) and occasionally for client video content. Cost lives on the clinic's books, not the agency's, per the relationship described in [[00-Company-Overview]] |
| Domain hosting | $50 | Aggregate monthly equivalent of per-domain annual renewals | Registrar costs for client domains and agency-owned domains — includes DNS management during cutovers, see [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] if present and [[../INTEGRATIONS/09-GoDaddy]] if present |
| **Total** | **~$155** | | Descript is intentionally excluded from this total since it's a clinic-billed cost, not an agency one — see the note in [[01-Financials]] |

## Why the Total Excludes Descript

The ~$155 total matches Claude ($40) + Vercel ($50) + Canva Teams ($15)
+ Post Bridge ($0) + domain hosting ($50). Descript's cost is real but
sits on First Rehabilitation's books rather than The Design of Man's,
consistent with how [[00-Company-Overview]] describes the two
businesses as connected but financially separate. If that cost-sharing
arrangement ever changes (e.g., Descript usage tips clearly agency-side
as client video work grows), this table and the total in
[[01-Financials]] both need updating together — don't update one
without the other.

## Future / Evaluated Tool Spend

Tools currently being evaluated or run on a free/dev tier that could
introduce new recurring costs if they move to paid usage. Tracked here
so a future tier change shows up as a deliberate expense-table update,
not a surprise on the QBO statement.

| Tool | Current Status | Would-Be Cost | Trigger to Watch For |
|---|---|---|---|
| MIT AI Gateway | Evaluated / integrated, not yet fully live — see [[../SKILLS-RADAR/02-Integrated-Tools/00-Overview|Integrated Tools]] | $X/month if a hosted or usage-metered tier is adopted | Token-optimization savings across agents no longer justified by a self-hosted/free setup |
| Firecrawl | Evaluated / integrated into [[../AGENTS/02-Sales-Outreach-Agent]] | $X/month if prospect-audit volume exceeds the free/dev API tier | Sales Outreach Agent volume scaling with the 10-client growth target in [[01-Financials]], or repeated fallback-to-HTTP-crawl events (see [[../INTEGRATIONS/07-Firecrawl]]) signaling the current tier is undersized |
| *(reserved for next evaluated tool)* | — | — | Add a row here the moment a [[../SKILLS-RADAR/00-Trending-Tools]] evaluation results in adoption with a real cost attached |

When either of these moves from evaluated to paid, add its line to the
**Current Monthly Expenses** table above, recompute the total, and log
the change as a dated entry in [[05-Decisions-Log]] — a cost change to
the core stack is exactly the kind of decision that log exists to
capture.

## Related Notes

- [[01-Financials]] — the summary table this note expands on
- [[02-Pricing-Model]] — what these costs are recovered against
- [[04-KPIs]] — profit margin, which depends directly on this expense total
- [[../SKILLS-RADAR/02-Integrated-Tools/00-Overview|Integrated Tools]] — status detail on MIT AI Gateway and Firecrawl
- [[../INTEGRATIONS/00-Integration-Overview]] — the full integration list these subscriptions correspond to
