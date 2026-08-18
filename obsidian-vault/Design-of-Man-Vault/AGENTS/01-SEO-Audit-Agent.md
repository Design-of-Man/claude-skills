---
type: agent
status: ready
tags: [design-of-man, agent]
updated: 2026-08-18
---

# SEO Audit Agent

## Purpose
Runs a weekly technical and on-page SEO pass across every live client site. Finds ranking opportunities and regressions, ships the safe fixes itself, and queues anything riskier for a human decision — so SEO upkeep doesn't depend on Nick or Cam remembering to check Search Console.

## Trigger / Frequency
Fridays, 9:00 AM. See [[../AUTOMATIONS/01-Friday-SEO-Audit]] and the full week in [[../AUTOMATIONS/00-Automation-Calendar]].

## Inputs
- Google Search Console data for every live client (clicks, impressions, position, indexed pages)
- Current site content, meta tags, and schema markup for each client
- Last week's audit output, for diffing (what changed, what's trending up or down)

## Outputs
- One audit report per live client, posted to Slack `#seo-audits`
- A **deployed** queue: safe, reversible changes already shipped (meta descriptions, title tags, schema markup, image alt text)
- A **pending** queue: anything touching URL structure, redirects, navigation, or page content — held for approval

## Approval Gate
Safe, reversible metadata changes ship automatically — they don't change what a visitor sees or how a page is addressed. Anything that touches URL structure, redirects, navigation, or body content is queued in the Slack `#seo-audits` thread and waits for Nick or Cam to approve before it deploys. This is the standing rule from the automation calendar: *"SEO changes: You/Cam (via Slack thread)."* See [[../AUTOMATIONS/Gates-and-Approvals]] for the full approval matrix.

## Integrations Used
- [[../INTEGRATIONS/01-Google-Workspace]] — Search Console data pull, Drive for report archive
- [[../INTEGRATIONS/07-Firecrawl]] — full-site crawl when GSC data alone doesn't explain a regression (structure, internal links, rendered content); falls back to a plain HTTP crawl when Firecrawl itself is unavailable — see that file's Known Issues section and [[Execution-Logs/2026-08-18-firecrawl-fallback]] for a worked example
- [[../INTEGRATIONS/06-MIT-AI-Gateway]] — routes the report-generation calls for token savings

## Status
**Ready.** Runs live every Friday against all active client sites.

## Related Automation
[[../AUTOMATIONS/01-Friday-SEO-Audit]] · [[../AUTOMATIONS/Gates-and-Approvals]]
