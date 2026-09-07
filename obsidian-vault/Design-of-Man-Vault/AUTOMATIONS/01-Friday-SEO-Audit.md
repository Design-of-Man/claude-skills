---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Friday SEO Audit

**Runs:** Every Friday, 9:00 AM
**Agent:** [[../AGENTS/01-SEO-Audit-Agent]]
**Reports to:** Slack #seo-audits (see [[../COMMUNICATIONS/00-Slack-Channels]])
**Status:** Ready (per [[../AGENTS/00-Agent-Overview]])

## What It Does

Every live client site gets checked once a week, in one pass, on the same morning. The goal is to catch optimization opportunities early and either fix the safe ones immediately or flag the risky ones for a human before anything changes on a client's site.

## Workflow

1. **Pull Google Search Console data for all clients** — clicks, impressions, average position, top queries, top pages, and week-over-week movement. Pulled through [[../INTEGRATIONS/01-Google-Workspace]] (Search Console is part of the Google Workspace connection this agency uses).
2. **Identify optimization opportunities** — pages losing position, queries with high impressions but low click-through, missing or thin meta descriptions, missing schema markup, broken internal links, duplicate titles.
3. **Classify each finding as safe or risky**, using the rule below.
4. **Deploy safe changes automatically** — no human sign-off required.
5. **Queue risky changes for approval** — posted to #seo-audits as a Slack thread; nothing risky ships until Nick or Cam approves it in-thread.
6. **Report to Slack #seo-audits** — one summary message per client per week: what was found, what was auto-deployed, what's waiting on approval.

## Safe vs. Risky — the Classification Rule

This is the line that decides whether a change ships automatically or waits for a human. It's the core of this automation's approval gate — full detail on who approves what is in [[Gates-and-Approvals]].

| Safe (auto-deploys) | Risky (queued for approval) |
|---|---|
| Meta title / meta description edits | Page structure or navigation changes |
| Schema markup (LocalBusiness, FAQ, Article, etc.) | URL changes or redirects |
| Alt text additions on existing images | Content rewrites beyond metadata |
| Internal link fixes (broken → correct target) | Anything touching a page's primary heading or main copy |
| Sitemap / robots.txt corrections | Anything affecting site structure or a page template |

The underlying principle: metadata and markup that search engines read but visitors don't see is safe to automate. Anything a client or a site visitor would actually notice waits for a human.

## Approval Gate

Risky changes are posted as a Slack thread in #seo-audits with the finding, the proposed fix, and the affected client/page. Nick or Cam approves in-thread; the change deploys once approved. No risky SEO change reaches a live client site without an explicit approval in that thread. See [[Gates-and-Approvals]] for the full approval matrix across all automations.

## Related

- [[../AGENTS/01-SEO-Audit-Agent]] — the agent spec (inputs, outputs, trigger detail)
- [[../INTEGRATIONS/01-Google-Workspace]] — where the Search Console data comes from
- [[../COMMUNICATIONS/00-Slack-Channels]] — #seo-audits channel definition
- [[00-Automation-Calendar]] — how Friday fits into the weekly rhythm
- [[Gates-and-Approvals]] — the full approval reference
