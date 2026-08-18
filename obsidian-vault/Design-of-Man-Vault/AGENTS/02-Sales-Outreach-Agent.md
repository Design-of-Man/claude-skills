---
type: agent
status: ready
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Sales Outreach Agent

## Purpose
Finds new prospects in the agency's service area, audits their current web presence, and drafts a pitch built from real findings on their own site — so outreach opens with something specific ("your booking page 404s on mobile") instead of a generic cold pitch.

## Trigger / Frequency
Mondays, 9:00 AM. See [[../AUTOMATIONS/02-Monday-Sales-Outreach]]. Prospect replies are checked daily and logged to the vault regardless of the Monday run.

## Inputs
- A weekly target list of 5-10 prospects (business name + location), pulled by industry and geography — Palm Beach, Martin, and St. Lucie counties
- Each prospect's live website URL
- Each prospect's Google Business Profile listing

## Workflow
1. Agent pulls this week's prospect list (5-10 businesses in the target counties).
2. For each prospect, [[../INTEGRATIONS/07-Firecrawl|Firecrawl]] scrapes their site and extracts phone, email, hours, page structure, and design-quality signals.
3. The scraped contact info and hours are cross-checked against the prospect's Google Business Profile — mismatches (wrong phone, stale hours, wrong address) become pitch material, since they're evidence the prospect isn't maintaining their own listing.
4. The site gets two 0-10 scores: **aesthetics** (visual design quality) and **technical** (speed, mobile behavior, structure, broken links).
5. The agent highlights the top 2-3 issues found — dead links, outdated design, missing pages, no mobile optimization.
6. A personalized pitch email is drafted, referencing the specific findings from steps 2-5.

## Outputs
- Per-prospect audit summary (aesthetics score, technical score, GBP consistency flags, top issues) posted to Slack `#client-outreach`
- A draft pitch email per prospect, saved to Gmail as a draft — never sent automatically

## Known issue: Firecrawl availability
Firecrawl is sometimes unavailable (auth or connectivity failures on the API). When that happens the agent does **not** skip the audit — it falls back to a plain HTTP crawl: standard HTTP requests walking the prospect's internal links, following redirect chains, and recording status codes. This fallback loses the rendered-DOM design signal (no aesthetics score) but still catches what actually matters for a pitch or a health check — dead pages and broken paths. A real run against RegenOrtho — now a live client, but the same Firecrawl-backed audit tooling gets reused there for post-migration path checks — used this fallback and found 8 broken paths out of 63 checked; see [[Execution-Logs/2026-08-18-firecrawl-fallback]] for the full worked example. Log every run where the fallback triggers — the pattern needs to stay visible over time, not just show up once. Full detail in [[../INTEGRATIONS/07-Firecrawl]].

## Approval Gate
No email leaves the building without review. Every generated pitch lands in Slack `#client-outreach` and as a Gmail draft — nothing sends on its own. Nick or Cam approve and send manually, per the automation calendar's standing rule: *"Sales emails: You/Cam (before sending)."* See [[../AUTOMATIONS/Gates-and-Approvals]].

## Integrations Used
- [[../INTEGRATIONS/07-Firecrawl]] — primary scraping and audit engine, with HTTP-crawl fallback
- [[../INTEGRATIONS/01-Google-Workspace]] — Gmail drafts, Google Business Profile cross-check, Drive for the prospect tracker
- [[../INTEGRATIONS/08-Slack]] — `#client-outreach` delivery

## Status
**Ready.** Runs live every Monday.

## Related Automation
[[../AUTOMATIONS/02-Monday-Sales-Outreach]] · [[../AUTOMATIONS/Gates-and-Approvals]]
