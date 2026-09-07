---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Firecrawl — Website Scraping and Auditing

Firecrawl crawls prospect and client websites and turns them into the raw material for an
audit: page inventory, copy, meta tags, link graph, broken paths. It is what makes the
Monday outreach personal instead of generic — the pitch quotes their actual site.

**Layer**: Agent pipeline
**Status**: Live, **with a documented fallback path that is part of the integration, not a workaround**
**Source**: github.com/mendableai/firecrawl
**Used by**: Sales Outreach Agent, SEO Audit Agent, post-migration verification

---

## What It Does

- Crawls a site and returns its page structure
- Extracts content, meta tags, schema, and links
- Surfaces broken pages and dead links
- Supports the prospect scoring the Sales Outreach Agent runs

---

## Sales Outreach Workflow

1. Agent receives a prospect list (Palm Beach / Martin / PSL).
2. For each prospect:
   - Crawl the site.
   - Extract contact details, hours, page structure, design signals.
   - Cross-check the site against their Google Business Profile for inconsistencies —
     mismatched phone numbers and hours are the single most persuasive finding, because
     the client can verify it in ten seconds.
   - Score: aesthetics (0–10) and technical (0–10).
   - Pull the top issues: dead links, missing pages, no mobile handling, stale copy.
3. Agent drafts a pitch built on the specific findings.
4. Draft goes to `#client-outreach` for human approval before anything sends.

Rate limits are set deliberately — these are small local businesses, and hammering a
prospect's site before pitching them is a bad opening move.

---

## Known Issues / Fallback

**Firecrawl is sometimes unavailable.** This is not hypothetical and it is not rare enough
to ignore. It has already happened during real client work, and the response is written down
here because "wait and retry tomorrow" is the wrong answer.

### The case that set the policy

On **2026-08-18**, during site-transfer verification for **RegenOrtho**, Firecrawl was
unavailable. The audit did not stop. It fell back to a plain HTTP crawl — fetch each path,
follow redirects, record the final status code — and covered **63 paths, finding 8 real
404s**.

Eight broken paths on a just-migrated live site is not a minor finding. Those are pages that
had traffic and rankings before the cutover and were returning nothing after it. The
fallback caught all of them **while the primary tool was down**.

Log: [[../AGENTS/Execution-Logs/2026-08-18-firecrawl-fallback]]

### The fallback procedure

When Firecrawl is unavailable, run this. It is a first-class code path.

| Step | Action |
|---|---|
| 1 | Build the path list. Sources, in order of preference: the old site's sitemap.xml, the redirect map from the migration, Search Console's indexed pages, and internal links already collected. |
| 2 | Fetch each path over plain HTTP. |
| 3 | **Follow redirects** and record the *final* status code and the *final* URL — not the first hop. A 301 that eventually lands on a 404 is a broken path, and stopping at the 301 hides it. |
| 4 | Record the redirect chain length. A 4-hop chain is a finding even when it ends in a 200. |
| 5 | Tabulate: path → final status → final URL → hop count. |
| 6 | Every non-200 is a finding. Report the count and the list, exactly as a Firecrawl-based audit would. |
| 7 | Note in the audit output that the HTTP fallback was used, so a later reader knows which surfaces were and were not checked. |

### Why this counts as equal, not degraded

For the highest-value audit question — **"is anything broken?"** — the fallback answers it
just as well as the primary tool. Status codes are status codes. The RegenOrtho run proves
it: 8 real defects found, on the fallback, on a live client site.

Calling it "best effort" would be wrong in a way that causes harm, because it invites the
team to skip verification when Firecrawl is down and mark a migration complete unverified.
**A migration is never signed off unverified.** If Firecrawl is unavailable, the HTTP crawl
is how it gets verified.

### What the fallback genuinely cannot do

Being honest about the boundary is what keeps the fallback trustworthy:

| Firecrawl gives | HTTP fallback gives | Gap |
|---|---|---|
| Rendered content from JS-heavy pages | Raw HTML only | A JS-rendered site looks empty — status codes still valid, content extraction is not |
| Structured extraction (meta, schema, link graph) | Whatever is parsed manually | Extraction work has to be written or done by hand |
| Full-site discovery by crawling links | Only the paths supplied | Discovery is only as complete as the input list — this is the real limitation |
| Design/aesthetic signals | Nothing | Prospect *scoring* degrades; prospect *breakage checking* does not |

Practical consequence: for **verification** work (post-migration, broken-link checks) the
fallback is fully sufficient. For **prospect scoring**, the fallback covers technical score
but not aesthetics — in that case, score the technical half, flag the aesthetic half as
pending, and finish it when Firecrawl returns rather than sending a half-informed pitch.

---

## When to Use Which

| Task | Primary | If Firecrawl is down |
|---|---|---|
| Post-migration path verification | Firecrawl | HTTP crawl — fully sufficient, run it |
| Broken-link sweep on a live client site | Firecrawl | HTTP crawl — fully sufficient, run it |
| Prospect technical score | Firecrawl | HTTP crawl — sufficient |
| Prospect aesthetic score | Firecrawl | Defer; do not guess |
| Content/copy extraction for a rebuild | Firecrawl | Defer or do manually — raw HTML is workable but slow |

---

## Status

- [x] Evaluated
- [x] Integrated into the Sales Outreach Agent
- [x] Tested — including the fallback path, exercised on real client work
- [x] Live

Monitoring: watch for scraping limits and rate-limit changes, and watch availability. Log
every fallback use in `AGENTS/Execution-Logs/` so the outage frequency is a known number
rather than a feeling.

---

## Related

- [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] — the verification step this feeds
- [[../AGENTS/Execution-Logs/2026-08-18-firecrawl-fallback]] — the RegenOrtho run
- [[../AGENTS/02-Sales-Outreach-Agent]]
- [[../AGENTS/01-SEO-Audit-Agent]]
- [[00-Integration-Overview]] — resilience notes
- [[../SKILLS-RADAR/02-Integrated-Tools/00-Overview|Integrated Tools]]
