---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Monday Sales Outreach

**Runs:** Every Monday, 9:00 AM (plus a daily reply check)
**Agent:** [[../AGENTS/02-Sales-Outreach-Agent]]
**Reports to:** Slack #client-outreach (see [[../COMMUNICATIONS/00-Slack-Channels]])
**Status:** Ready (per [[../AGENTS/00-Agent-Overview]])

## What It Does

Finds new prospects in the agency's service area, audits their current site, drafts a personalized outreach email based on what the audit found, and routes that email to Slack for a human to approve before it ever reaches a prospect's inbox.

## Workflow

1. **Find 5–10 new prospects** in the target area: Palm Beach, Martin, and St. Lucie (PSL) counties. Prospect status gets logged in [[../COMMUNICATIONS/03-Prospect-Tracker]] and cross-referenced against [[../CLIENTS/00-Active-Clients]] so the agent doesn't re-pitch someone already in the pipeline.
2. **Audit each prospect's site via Firecrawl** — see [[../INTEGRATIONS/07-Firecrawl]]. The audit extracts phone, email, hours, and site structure; compares Google Business Profile data to the website for consistency; and scores the site on aesthetics (0–10) and technical quality (0–10), highlighting the biggest issues (dead links, outdated design, missing pages).
3. **Known caveat — Firecrawl unavailable fallback:** Firecrawl has gone down mid-run before. When that happens, the agent falls back to a plain HTTP crawl and follows redirects manually to get a minimal picture of the site (reachability, redirect chains, basic structure) rather than the full aesthetics/technical scoring. A run that used the fallback should say so explicitly in its output — see [[../AGENTS/Execution-Logs/00-Index|Execution Logs]] for examples of this being logged. Don't treat a fallback-based audit as equivalent in depth to a full Firecrawl audit.
4. **Generate a personalized outreach email** using the audit findings as the hook — specific issues found on the prospect's actual site, not a generic pitch.
5. **Route to Slack #client-outreach for review** — the drafted email posts to the channel with the audit summary attached. Nothing sends automatically.
6. **Nick/Cam review and approve before sending.** See [[Gates-and-Approvals]].

## Daily: Prospect Reply Check

Separately from the Monday run, every day the agent checks for replies from prospects who were previously contacted and logs them to the vault (tracked in [[../COMMUNICATIONS/03-Prospect-Tracker]]). This keeps the pipeline status current without waiting for the next Monday cycle — a reply on a Tuesday gets logged Tuesday, not the following Monday.

## Target Area

Palm Beach County, Martin County, and St. Lucie (PSL) County, Florida — the agency's home service area.

## Approval Gate

No sales email leaves the building without Nick or Cam approving it in #client-outreach first. This is a hard gate, not a default-approve-after-N-hours pattern — see [[Gates-and-Approvals]] for the full detail.

## Related

- [[../AGENTS/02-Sales-Outreach-Agent]] — the agent spec (inputs, outputs, trigger detail)
- [[../INTEGRATIONS/07-Firecrawl]] — the audit tool, including the fallback path
- [[../COMMUNICATIONS/03-Prospect-Tracker]] — where prospect status and reply logs live
- [[../COMMUNICATIONS/00-Slack-Channels]] — #client-outreach channel definition
- [[00-Automation-Calendar]] — how Monday fits into the weekly rhythm
- [[Gates-and-Approvals]] — the full approval reference
