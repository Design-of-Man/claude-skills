---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Next.js Shell

The reusable starter every new client build forks from. It exists so that
build time stays close to the 8-hour target in `BUSINESS/01-Financials.md` —
nobody should be re-deciding routing, SEO plumbing, or form wiring per
client. The shell decides that once; each client build spends its time on
copy, imagery, and palette.

Not every repo on the roster runs this shell today — a few early builds
(Abacoa Podiatry among them) shipped as static HTML with no build step at
all, which is still a legitimate choice for a true single-page brochure
site. The Next.js shell is the default starting point for everything else:
multi-page sites, anything with a blog/content section, anything that needs
a real form-to-database path, and anything getting a redesign from here on.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js, App Router, TypeScript | Server Components by default; `"use client"` only where interaction requires it |
| Styling | Tailwind CSS, CSS-variable theme layer | Tokens sourced from [[design-tokens.json]], not hardcoded hex — see [[01-Design-System]] |
| Fonts | `next/font` (Google Fonts or self-hosted variable fonts) | Per [[04-Typography-System]] pairing rules |
| Package manager | pnpm | Faster installs, one lockfile format across all client repos |
| Hosting / CI | Vercel, Design-of-Man GitHub org | Auto-preview per PR, production on merge to `main` |
| Forms / data | Supabase (Postgres + RLS) | Lead capture, booking requests, newsletter opt-ins land in a `leads` table |
| Analytics | Vercel Web Analytics + Speed Insights | Zero-config, privacy-friendly, no cookie banner needed |
| Search visibility | Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD helpers | See [[05-SEO-Baseline]] |

## Repo structure convention

```
client-repo/
├── app/
│   ├── layout.tsx            # root layout: fonts, analytics, JSON-LD org schema
│   ├── page.tsx               # homepage
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── (marketing)/
│   │   ├── services/[slug]/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   └── blog/
│       ├── page.tsx           # blog index
│       └── [slug]/page.tsx    # article layout, see [[02-Component-Library]]
├── components/
│   ├── ui/                    # Hero, ServiceCard, TestimonialBlock, FaqBlock, BookingCta...
│   └── layout/                # Nav, Footer, TrustBar
├── lib/
│   ├── supabase.ts            # server + client Supabase clients
│   ├── schema.ts               # JSON-LD builder helpers (LocalBusiness, FAQPage, BlogPosting)
│   └── content/                # typed content — services, FAQs, testimonials
├── public/
│   └── assets/
├── _dev/
│   └── preflight.py            # hard-fail gate, see [[06-Deployment-Checklist]]
├── tailwind.config.ts          # reads design-tokens.json at build time
├── vercel.json                 # security headers, cache policy
├── .vercelignore                # keeps _dev/ and markdown out of the deployment
└── .env.local.example
```

## What's pre-wired out of the box

- **SEO baseline** — metadata API per route, auto-generated `sitemap.xml` and
  `robots.txt`, JSON-LD helpers for `LocalBusiness`/`Physician`/`MedicalClinic`
  where relevant, `FAQPage`, and `BlogPosting`. Full detail in
  [[05-SEO-Baseline]].
- **Analytics** — Vercel Web Analytics and Speed Insights components dropped
  into the root layout, on from the first deploy. No client-side setup, no
  extra script tag to forget.
- **Forms → Supabase** — the contact/booking form posts through a server
  action into a `leads` table (RLS scoped to the client's project), with an
  optional email relay so a submission also lands in the practice's inbox via
  Google Workspace. Wellness, First Rehabilitation App, and HomeCrew already
  run on Supabase for this; new builds default to the same pattern rather
  than inventing a new backend per client.
- **Design tokens wired end to end** — `tailwind.config.ts` reads
  [[design-tokens.json]] directly, so a palette or type-scale change is one
  file edit, not a find-and-replace across components. See
  [[01-Design-System]].
- **A hard-fail preflight gate** — `_dev/preflight.py`, ported per client from
  the Design of Man repo's original. Blocks the build on unreplaced
  `REPLACE_*` placeholders, unset form endpoints, broken internal links,
  missing assets, duplicate/missing meta, invalid JSON-LD, images without
  `alt`, and a missing `<h1>`. It must exit non-zero on failure — a gate that
  only warns is a suggestion, not a gate.
- **`vercel.json` security headers** — `nosniff`, `SAMEORIGIN`,
  `strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`,
  immutable long cache on versioned bundles, a week on `/assets/*`.

## Starting a new client build from the shell

1. Create the new repo under the `Design-of-Man` GitHub org (not
   `nicholasbkashuba-lab` — that org is migration history, not the target for
   new work) and wire it to a new Vercel project.
2. Fork/clone the shell, rename the package and repo references, and set
   the `DOMAIN` constant in `_dev/preflight.py`.
3. Swap [[design-tokens.json]] for the client's palette and type choices —
   see [[03-Color-Palettes]] and [[04-Typography-System]] for how those get
   picked per vertical.
4. Provision a Supabase project if the client needs form storage beyond a
   simple email relay; wire `SUPABASE_URL` / `SUPABASE_ANON_KEY`.
5. Replace every `REPLACE_*` placeholder (phone, address, hours, NAP data,
   booking link) with real client data — the preflight gate will refuse to
   pass otherwise.
6. Run `_dev/preflight.py` locally until it prints `READY TO DEPLOY`.
7. Push, open a draft PR, confirm the Vercel preview, then follow
   [[06-Deployment-Checklist]] for go-live.

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for metadata/sitemap | Yes |
| `SUPABASE_URL` | Supabase project URL | If using forms→Supabase |
| `SUPABASE_ANON_KEY` | Public client key (RLS enforced) | If using forms→Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, used in server actions | If using forms→Supabase |
| `CONTACT_NOTIFY_EMAIL` | Where a submission also gets emailed | Optional |
| `GOOGLE_SITE_VERIFICATION` | Search Console ownership meta tag | Yes, before go-live |

## Related

- [[01-Design-System]]
- [[02-Component-Library]]
- [[05-SEO-Baseline]]
- [[06-Deployment-Checklist]]
- [[07-Domain-Migration-Checklist]]
- Assets: [[design-tokens.json]] · [[README|Assets/README]]
