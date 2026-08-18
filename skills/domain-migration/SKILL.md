---
name: domain-migration
description: Cut a client's live domain over from its old host (Wix, Squarespace, GoDaddy builder, etc.) to Vercel without losing SEO or leaving broken paths. Use when the user says "cut over the domain", "point the domain at Vercel", "migrate off Wix", "domain transfer", "DNS switch", "go live on the new site", or asks whether a redesign is "actually live" yet. Also use after any cutover to verify it — "did the migration work", "check for broken links", "any 404s after the switch". Not for buying/registering a new domain (that's a registrar task, see GoDaddy tooling) — this is for moving an existing live domain's traffic to a new host.
---

# Domain migration

The failure mode isn't the DNS change — that part is mechanical. It's what
happens around it: nobody can say exactly when the cutover completed, so every
before/after comparison after that point is unverifiable, and nobody checked
the old site's paths against the new one, so silently-broken URLs bleed
rankings for weeks before anyone notices.

## Before the cutover

- Inventory every live path on the old site, not just the ones in the new
  sitemap. Old blog posts, old service pages, and old query-string URLs
  (Wix and Squarespace both mint their own) are exactly what's indexed in
  Google and exactly what breaks first.
- Map each old path to its new destination. A path with no clean mapping
  gets an explicit 301, not a silent 404 — "the new site doesn't have that
  page" is not a plan, it's a ranking loss.
- Confirm who owns the registrar login and who owns the DNS zone before
  cutover day. A migration that stalls on "who has the GoDaddy password"
  is the single most common self-inflicted delay.

## The cutover itself

- Change DNS (A/CNAME to Vercel, per Vercel's domain docs) and, separately,
  cancel/downgrade the old host so it stops serving traffic once DNS
  propagates. These are two different actions — doing only the first can
  leave the old Wix/Squarespace site half-alive on a subdomain or preview
  URL that keeps getting indexed.
- **Capture hard evidence of the exact cutover moment**: a registrar
  confirmation email, the old host's cancellation email, or a timestamped
  screenshot of the DNS record change. "Around August 6th" is not evidence
  and cannot anchor an analytics comparison — a real migration stalled
  exactly here, needing the user to dig up a Wix cancellation email or
  registrar confirmation before a before/after traffic comparison could be
  trusted. Get the artifact at cutover time; don't reconstruct it later.

## After the cutover: verify, don't assume

Crawl the *old* path list against the *new* live site and confirm every
path either 200s correctly or 301s to the right destination. Firecrawl is
the default tool for this — but it isn't always reachable. When it's down,
fall back to a plain HTTP crawl (fetch each old path, follow redirects,
record final status) rather than skipping verification; one real migration
did exactly this and caught 8 broken paths out of 63 that Firecrawl being
unavailable would otherwise have hidden.

Checklist:
- [ ] Every old path returns 200 or a correct 301 (not a generic 404 or a
      redirect to the homepage as a catch-all)
- [ ] DNS fully propagated (check from more than one resolver/location)
- [ ] Old host cancelled or downgraded, not just DNS-pointed-away
- [ ] SSL/TLS active on the new domain via Vercel
- [ ] Search Console: submit the new sitemap, and if paths changed, submit
      a change-of-address or updated sitemap rather than waiting for
      Google to notice
- [ ] Cutover evidence (email/screenshot/registrar confirmation) saved
      somewhere durable — not just remembered

## Reporting the result

State the verified cutover date (from the evidence above, not a guess), the
count of paths checked, and any 404s/redirect issues found — fixed or still
open. If Firecrawl was unavailable and a fallback crawl was used instead,
say so; it's a coverage caveat, not a footnote to bury.
