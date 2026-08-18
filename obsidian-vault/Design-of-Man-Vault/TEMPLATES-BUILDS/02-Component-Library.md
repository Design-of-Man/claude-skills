---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Component Library

The fixed component set every client build assembles from. New client work
should almost never require a new component — it requires new content and
new token values fed into these. If a build genuinely needs a new
component, it gets added here so the next client benefits too, rather than
living as a one-off in a single repo.

All components consume semantic tokens only — see [[01-Design-System]] —
and are built mobile-first, since the overwhelming majority of traffic on
local wellness/medical sites is a phone search from someone in pain or
symptomatic, often standing in a parking lot.

## Core components

| Component | Purpose | Key variants |
|---|---|---|
| `Hero` | Above-the-fold intro + primary CTA | Image-right, video-bg, centered-text (single-service landing pages) |
| `ServiceCard` | Grid tile for a service/treatment | Icon+title, image+title, with/without price range |
| `TestimonialBlock` | Social proof carousel/grid | Single-quote spotlight, 3-up grid, video testimonial slot |
| `FaqBlock` | Expandable Q&A, auto-emits schema | Standalone FAQ page, embedded mid-page on a service page |
| `BookingCta` | Persistent conversion element | Sticky mobile bar, inline section CTA, header CTA button |
| `ArticleLayout` | Blog/content post template | Standard article, clinician-authored (adds author/credential block) |
| `TrustBar` | Certifications, reviews aggregate, "as seen in" | Logo row, star-rating strip |
| `Nav` | Site header | Standard, with mega-menu for multi-service clients |
| `Footer` | NAP, hours, sitemap links, social | Standard, multi-location (repeats NAP block per location) |
| `LocationBlock` | Address + embedded map + hours | Single-location, multi-location tabs |
| `BeforeAfterGallery` | Treatment result comparisons | Slider, side-by-side (aesthetic/laser/peptide clients only — never used without documented client consent) |

## Hero

Always carries the primary conversion action (book/call/request
consultation) above the fold on mobile without scrolling. Copy comes from
`lib/content/`, never hardcoded in the component — this is what lets the
same `Hero` serve a podiatry clinic and a peptide clinic with entirely
different tone.

## ServiceCard

Renders from a typed array in `lib/content/services.ts`. Each entry can
optionally emit a `Service` schema fragment consumed by the page's JSON-LD
— see [[05-SEO-Baseline]].

## TestimonialBlock

Plain-text or structured `Review`/`AggregateRating` schema, gated by
whether the client has verifiable reviews to point at. Never fabricated —
placeholder/lorem testimonials shipped as real content is a known trap
(see the audit checklist in the `client-site` skill); this component
either has real content or doesn't render.

## FaqBlock — the schema-rich pattern

This is the component that does double duty: it's a content block for the
visitor and a `FAQPage` JSON-LD emitter for search engines and AI answer
engines in one pass. Content is authored once as a typed array —

```ts
type FaqEntry = { question: string; answer: string };
```

— and the component both renders the accordion UI and passes the same
array through `lib/schema.ts` to build the matching `FAQPage` structured
data, so copy and schema can never drift out of sync (a common failure mode
when schema is hand-maintained separately from visible content). Used both
as a standalone FAQ page and embedded on individual service pages where it
answers the 3-5 questions most specific to that service.

## BookingCta

The one component every client build treats as non-negotiable to test
before go-live — see the "real submissions" step in
[[06-Deployment-Checklist]]. A `BookingCta` that 404s or points at a
scheduler that was never actually configured is a dead conversion path,
and it's the single most damaging bug a client site can ship silently.

## ArticleLayout — the blog/content pattern

The template every client blog post (Jupiter Laser & Regenerative
Medicine's Dr. Cedeno content, First Rehab-style clinical articles, and
any client running ongoing content) is built from. It emits:

- `BlogPosting` (or `MedicalWebPage` for clinically-reviewed content)
  JSON-LD with `headline`, `datePublished`, `dateModified`, `author`, and
  `publisher`
- `BreadcrumbList` schema tying the post back to its category and the site
  root
- An author/credential block when the piece is clinician-authored — this
  matters for E-E-A-T signal on medical content, not just as a courtesy
  byline
- Automatic `FaqBlock` inclusion when the post's frontmatter carries FAQ
  entries, so a single article can pick up `FAQPage` schema without a
  separate component

This is the pattern referenced from [[05-SEO-Baseline]] for how
`BlogPosting` markup actually gets produced, rather than hand-written per
post.

## Related

- [[01-Design-System]]
- [[03-Color-Palettes]]
- [[04-Typography-System]]
- [[05-SEO-Baseline]]
- [[00-Next.js-Shell]]
