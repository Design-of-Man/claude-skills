---
type: skills-radar
tags: [design-of-man, skills-radar, integrated-tool]
updated: 2026-08-18
---

# Domain Migration (`domain-migration` skill)

## Status

**INTEGRATED** — built and added directly to the team's `claude-skills`
repo as `skills/domain-migration`.

- Date added: 2026-08-18
- Lane: not on the original Q4 2026 watchlist — this one came from a real
  gap found while reviewing recent sessions, not from scanning GitHub
  trending. See [[../Monthly-Scout-Results/2026-08-scout]] for how this
  landed outside the normal monthly cadence.

## What It Is

A checklist skill for cutting a client's live domain over from its old
host (Wix, Squarespace, GoDaddy builder, etc.) to Vercel without losing
SEO or leaving broken paths. This agency does this migration repeatedly —
it's the standard move whenever a redesign goes live on a domain that
already has real traffic and rankings on the old host — and it had been
handled ad hoc each time rather than as a repeatable checklist.

Covers:

- **Path inventory** — enumerate every live path on the old site (not just
  what's in the new sitemap), since old blog posts, old service pages, and
  host-specific query-string URLs are exactly what's indexed in Google and
  exactly what breaks first if skipped.
- **DNS switch and host cancellation as two separate steps** — changing
  DNS to point at Vercel and cancelling/downgrading the old host are
  treated as distinct actions with their own checklist items, because
  doing only the DNS half can leave the old Wix/Squarespace site half-alive
  on a subdomain or preview URL that keeps getting indexed.
- **Cutover-evidence capture** — a registrar confirmation email, the old
  host's cancellation email, or a timestamped DNS-change screenshot,
  captured at the moment of cutover rather than reconstructed later. A
  vague "around August 6th" can't anchor a before/after analytics
  comparison; a real migration stalled on exactly this until someone dug
  up a Wix cancellation email.
- **Firecrawl-unavailable fallback** — post-cutover verification normally
  crawls the old path list against the new live site via Firecrawl
  (see [[Firecrawl]]), but when Firecrawl isn't reachable the skill
  specifies a plain HTTP-crawl fallback (fetch each old path, follow
  redirects, record the final status) instead of skipping verification.
  This isn't theoretical — a real migration used exactly this fallback and
  caught 8 broken paths out of 63 that would otherwise have shipped
  silently. See
  [[../../AGENTS/Execution-Logs/2026-08-18-firecrawl-fallback]].

## Impact

Turns a migration pattern that was previously handled ad hoc, differently
each time, into a repeatable checklist with a built-in verification step —
including the failure case (Firecrawl down) that had already caused a
near-miss once. Directly reduces the risk of silent post-migration ranking
loss on client sites (RegenOrtho, First Rehab, and any future Wix/
Squarespace → Vercel cutover fall under this).

## What to Monitor

- Whether the skill actually gets invoked on the next real cutover, or
  whether the old ad hoc habit persists out of muscle memory.
- Firecrawl's uptime going forward — if outages become frequent enough,
  the HTTP-crawl fallback might be worth promoting from "fallback" to
  "default," or Firecrawl's reliability becomes its own open question on
  [[../00-Trending-Tools]].
- Whether this pattern generalizes past Wix/Squarespace → Vercel (e.g.
  GoDaddy builder, other page builders) as more prospects with existing
  sites convert to clients.

## Related

- `skills/domain-migration/SKILL.md` in `claude-skills` — the skill itself
- [[Firecrawl]] — the tool this skill falls back away from when unavailable
- [[../../AGENTS/Execution-Logs/2026-08-18-firecrawl-fallback]] — the
  execution log documenting the real fallback use that motivated this
- [[../Monthly-Scout-Results/2026-08-scout]] — notes this as an
  off-cadence addition to the August scout results
- [[../01-Repos-to-Evaluate]] — queue process this skill bypassed, since
  the gap was concrete and recurring rather than needing evaluation time
