---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Domain Migration Checklist

> See the `domain-migration` skill in the team's claude-skills repo for the
> full step-by-step — this note is the vault's quick-reference summary.

This is a recurring pattern, not a one-off: **RegenOrtho** and **First
Rehab NPB** have both needed a Wix/Squarespace → Vercel domain cutover, and
more clients on the roster will hit the same move as their rebuilds go
live. The failure mode is never the DNS change itself — that part is
mechanical. It's what happens around it: nobody can say exactly when the
cutover actually completed, so every before/after traffic comparison after
that point is unverifiable, and nobody checked the old site's paths against
the new one, so silently-broken URLs bleed rankings for weeks before anyone
notices.

Run this alongside [[06-Deployment-Checklist]] whenever a build is
replacing a domain that's already live somewhere else — it is not a
substitute for that checklist, it owns the parts specific to cutting an
existing domain over.

## Before the cutover

- **Inventory every live path on the old site** — not just the ones that
  made it into the new sitemap. Old blog posts, old service pages, and old
  query-string URLs (both Wix and Squarespace mint their own) are exactly
  what's indexed in Google, and exactly what breaks first if they're
  missed.
- **Map every old path to a new destination.** A path with no clean
  mapping gets an explicit 301, never a silent 404 — "the new site doesn't
  have that page" is not a plan, it's a ranking loss.
- **Confirm who owns the registrar login and who owns the DNS zone**
  before cutover day. A migration stalling on "who has the GoDaddy
  password" is the single most common self-inflicted delay on this team's
  cutovers.

## The cutover itself

- **Change DNS and cancel/downgrade the old host as two separate
  actions.** Point A/CNAME records at Vercel per Vercel's domain docs,
  and separately cancel or downgrade the old Wix/Squarespace plan so it
  stops serving traffic once DNS propagates. Doing only the DNS change can
  leave the old site half-alive on a subdomain or preview URL that keeps
  getting indexed alongside the new one.
- **Capture hard evidence of the exact cutover moment.** A registrar
  confirmation email, the old host's cancellation email, or a timestamped
  screenshot of the DNS record change — get it at cutover time, not
  reconstructed later. This is not a nice-to-have: a real migration got
  stuck exactly here, needing someone to dig up a Wix cancellation email
  or registrar confirmation before a before/after analytics comparison
  could be trusted at all. "Around August 6th" is not evidence and cannot
  anchor a traffic comparison.

## After the cutover: verify, don't assume

Crawl the full old-path list against the live new site and confirm every
path either returns 200 correctly or 301s to the right destination.

- **Firecrawl is the default tool for this** — but it isn't always
  reachable.
- **When Firecrawl is unavailable, fall back to a plain HTTP crawl**
  (fetch each old path, follow redirects, record the final status) rather
  than skipping verification. This exact fallback has already paid off
  once on this team: a real migration ran the HTTP-crawl fallback when
  Firecrawl was down and caught **8 broken paths out of 63** that would
  otherwise have shipped silently and gone unnoticed.

### Checklist

- [ ] Every old path returns 200 or a correct 301 (not a generic 404, and
      not a catch-all redirect to the homepage)
- [ ] DNS fully propagated — checked from more than one resolver/location
- [ ] Old host cancelled or downgraded, not just DNS-pointed-away
- [ ] SSL/TLS active on the new domain via Vercel
- [ ] Search Console: new sitemap submitted; if paths changed, a
      change-of-address or updated sitemap submitted rather than waiting
      for Google to notice on its own
- [ ] Cutover evidence (email/screenshot/registrar confirmation) saved
      somewhere durable — not just remembered

## Reporting the result

State the verified cutover date (from the evidence captured above, never
a guess), the count of old paths checked, and any 404s/redirect issues
found — whether fixed or still open. If Firecrawl was unavailable and the
HTTP-crawl fallback was used instead, say so explicitly; it's a coverage
caveat worth surfacing, not a footnote to bury in a status update.

## Related

- [[06-Deployment-Checklist]]
- [[05-SEO-Baseline]]
- [[00-Next.js-Shell]]
- `domain-migration` skill (team's claude-skills repo)
