---
agent: SEO Audit Agent
date: 2026-08-18
status: complete
tags: [design-of-man, execution-log]
clients: [RegenOrtho]
---

# 2026-08-18 — Firecrawl Fallback: RegenOrtho Path Check

## What happened
Firecrawl was unavailable for this run — the API returned repeated auth/connection failures across retries. Rather than skip the crawl, the agent fell back to its plain-HTTP-crawl pattern: standard HTTP requests walking every internal link found, following redirect chains, and recording the final status code for each path. This is the same fallback documented in [[../02-Sales-Outreach-Agent]] and in [[../../INTEGRATIONS/07-Firecrawl]] — both agents share the Firecrawl integration and both hit the same fallback when the API is down.

The fallback trades fidelity for coverage: no rendered-DOM check, no aesthetics scoring, no design-quality signal — just "does this path resolve, and if it redirects, where does it actually end up." That's still enough to catch what matters most for site health: broken paths.

## Scope
RegenOrtho (regenorthopb.com) — full internal path check. 63 paths discovered via the site's own internal links and sitemap.

## Result
- 63 paths checked
- 55 resolved cleanly (200, or a single expected redirect hop — e.g. non-www to www)
- 8 broken

## Broken paths found

| Path | Result | Likely cause |
|---|---|---|
| /shop | 404 | Leftover from the pre-migration Wix store, never removed |
| /blog/category/press | 404 | Old Wix category archive, no equivalent on the new site |
| /services/regenerative-medicine/ | Redirect loop | Trailing-slash version loops back to itself instead of resolving to the canonical non-slash path |
| /appointments | 404 | Old Wix booking page, replaced by /contact but never redirected |
| /about-us | 404 | Renamed to /about during the rebuild, old path never mapped |
| /blog/tag/stem-cell | 404 | Wix tag archive, no equivalent taxonomy on the new site |
| /locations/west-palm-beach | Redirect loop | Duplicate of /locations, circular redirect between the two |
| /patient-forms.pdf | 404 | Linked from an old blog post, file was never migrated |

## Next steps
All 8 are queued in the `#seo-audits` Slack thread for Nick/Cam approval — fixing redirects and removing dead paths touches navigation, so it doesn't ship automatically. See [[../../AUTOMATIONS/Gates-and-Approvals]]. Once approved, the fix is either a redirect rule (for the 404s that have an obvious new home) or a canonical-redirect fix (for the two loops).

## Why log this separately
This fallback produces a lower-fidelity audit than a normal Firecrawl run — no aesthetics score, no rendered-DOM check. Logging every run where the fallback triggers (rather than folding it silently into the normal weekly audit log) keeps that distinction visible over time: if this starts happening every week, that's a signal Firecrawl reliability itself needs attention, not just this one site's broken links. See [[../02-Sales-Outreach-Agent]] for the Known Issue writeup and [[../../INTEGRATIONS/07-Firecrawl]] for the integration-level detail.
