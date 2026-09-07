---
type: client
status: live
industry: Regenerative Orthopedics
tags: [design-of-man, client]
updated: 2026-08-18
---

# RegenOrtho

## Overview
Regenerative orthopedic / sports medicine practice in the Palm Beach market. RegenOrtho is the agency's cleanest domain-migration case study so far: the client came to us already on Wix, and we cut their live domain over to our Next.js build on Vercel without losing existing SEO equity or breaking inbound links.

## Site / Domain
- **Domain:** regenorthopb.com
- **Host:** Vercel — see [[../INTEGRATIONS/02-Vercel]]
- **Previous host:** Wix (decommissioned after cutover)
- **Migration:** Completed Aug 2026 — ran the full Wix → Vercel cutover using [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] (DNS repoint, redirect map, post-cutover 404/broken-link sweep, rollback plan kept on standby through the DNS propagation window)

## Status & Timeline
- **Go live (on new stack):** Aug 2026
- **Current phase:** Ongoing monthly management, post-migration monitoring
- Post-cutover checks — redirect verification, broken-link sweep, Search Console re-indexing — are complete. Keep an eye on GSC for any residual 404s from old Wix URL patterns through the first full quarter post-migration.

## Services Provided
- Full site rebuild (Next.js, design system) off the client's existing Wix content
- Wix → Vercel domain migration (DNS, redirects, SEO-preserving cutover)
- Hosting & deployment via Vercel
- Monthly site management — SEO + social content, see [[../BUSINESS/02-Pricing-Model]]
- Weekly SEO Audit Agent + Wednesday content/graphics cadence

## Content / SEO Notes
- Migration priority was protecting existing rankings — legacy Wix URLs were mapped to 301 redirects rather than left to 404, and the sitemap was resubmitted to Search Console immediately post-cutover.
- Now on the standard weekly cycle (Friday SEO Audit, Wednesday content/graphics, Sunday preview email) — see [[../AUTOMATIONS/00-Automation-Calendar]].
- This is the client most likely to show migration-related SEO noise in the first month or two — flag any post-migration ranking dips here if GSC shows them.

## Contact
- Primary contact: not logged in this note — confirm from the migration project thread / shared Google Contacts.
- Preferred channel: email (assumed — confirm and update).

## Related
- [[00-Active-Clients]]
- [[../AGENTS/00-Agent-Overview]]
- [[../AUTOMATIONS/00-Automation-Calendar]]
- [[../INTEGRATIONS/02-Vercel]]
- [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]]
- [[../DASHBOARD/03-Client-Health]]
