---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# SEO Baseline

What every client site ships with by default, before any client-specific
SEO work begins. This is the floor, not the ceiling — [[../AGENTS/01-SEO-Audit-Agent]]
runs weekly against the live site to find what's left on the table beyond
this baseline. Nothing here is optional per client; it's part of what
[[00-Next.js-Shell]] and the `_dev/preflight.py` gate enforce before a
build is allowed to ship.

## Schema.org markup

Every page emits JSON-LD appropriate to its content type. Built once as
helpers in `lib/schema.ts` (see [[00-Next.js-Shell]] repo structure) and
composed per page — never hand-written per client.

| Schema type | Where it's used | Notes |
|---|---|---|
| `LocalBusiness` | Every page (footer/root layout) | Base entity — NAP, hours, geo coordinates |
| `Physician` / `MedicalClinic` | Medical/clinical verticals (podiatry, orthopedic, laser therapy, regenerative medicine) | Layered on top of `LocalBusiness` where the client is a licensed medical practice, not just a wellness business |
| `Service` | Service pages, embedded via `ServiceCard` content | See [[02-Component-Library]] |
| `FAQPage` | Any page using the `FaqBlock` component | Auto-generated from the same content array that renders the visible accordion — see [[02-Component-Library]] |
| `BlogPosting` / `MedicalWebPage` | Client blog/article content | `MedicalWebPage` for clinically-reviewed content specifically; standard `BlogPosting` otherwise — see `ArticleLayout` in [[02-Component-Library]] |
| `BreadcrumbList` | Any page below the root (services, blog posts) | Ties into site nav hierarchy |
| `Review` / `AggregateRating` | `TestimonialBlock`, where reviews are real and verifiable | Never emitted against fabricated/placeholder testimonials |

## Meta & OG tags

- Next.js Metadata API per route — no duplicated `<title>`/`<meta
  description>` across pages (the preflight gate catches this).
- Unique, descriptive `title` and `description` per page, written for the
  page's actual search intent, not a templated boilerplate string.
- `og:title`, `og:description`, `og:image` (1200×630, client-branded),
  `og:type` set correctly (`website` vs `article` for blog posts).
- Canonical tag on every page, always pointing at the production domain —
  this is what catches a brand-split issue (canonical/schema pointing at
  the wrong domain) before it ships.

## Sitemap & robots

- `sitemap.ts` auto-generates from the route tree plus dynamic blog/service
  slugs — no manually maintained sitemap file to go stale.
- `robots.ts` allows all crawlers by default, references the sitemap, and
  blocks only staging/preview paths.
- Sitemap gets resubmitted (not just left to Google to notice) any time a
  site's URL structure changes — this matters even more during a domain
  cutover, see [[07-Domain-Migration-Checklist]].

## Search Console setup

Every client site gets verified in Google Search Console before go-live,
using the domain property method (covers all subdomains/protocols in one
verification) where the client's Google Workspace access allows it. Setup
and access details live in [[../INTEGRATIONS/01-Google-Workspace]].

- [ ] Property verified (domain property preferred over URL-prefix)
- [ ] Sitemap submitted
- [ ] `GOOGLE_SITE_VERIFICATION` env var set (see [[00-Next.js-Shell]])
- [ ] Client or shared team account has Owner/Full access, not just Nick's
      personal login

## Core Web Vitals baseline

Every build targets these thresholds before go-live, checked against the
production URL (not the preview) as part of [[06-Deployment-Checklist]]:

| Metric | Target | Notes |
|---|---|---|
| LCP | < 2.5s | Hero image/text is almost always the LCP element — see the `core-web-vitals` skill for the fix playbook |
| INP | < 200ms | Watch third-party embeds (chat widgets, booking iframes) — these are the usual culprit |
| CLS | < 0.1 | Reserve space for images/embeds; never let a loaded font or ad shift layout |

## Ongoing SEO work

The baseline above ships once per build. Ongoing optimization — ranking
tracking, content gap analysis, deploying safe schema/meta fixes,
flagging risky changes for approval — is [[../AGENTS/01-SEO-Audit-Agent]]'s
job, running weekly per the automation calendar.

## Related

- [[00-Next.js-Shell]]
- [[02-Component-Library]]
- [[06-Deployment-Checklist]]
- [[../INTEGRATIONS/01-Google-Workspace]]
- [[../AGENTS/01-SEO-Audit-Agent]]
