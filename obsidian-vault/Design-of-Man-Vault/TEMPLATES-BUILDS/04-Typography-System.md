---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Typography System

Type carries a lot of the trust signal on a medical or wellness site
before anyone reads a word — clean, readable type says "this practice is
competent"; a cramped or overly decorative type choice undercuts it no
matter how good the copy is. This system covers the scale and the
pairing approach every client site draws from.

## Approach

Two-font pairing per site: one workhorse sans for body copy and UI, one
display face for headlines that carries the client's personality. The
workhorse never changes much between clients — clinical readability
depends on a proven, highly-legible sans at small sizes. The display face
is the lever that differentiates a podiatry clinic from an IV lounge,
the same way [[03-Color-Palettes]] differentiates by color.

| Role | Default choice | Notes |
|---|---|---|
| Body / UI | Inter (variable) | High x-height, excellent at small sizes, wide language support, loads fast via `next/font` |
| Display / headline | Varies by vertical — see below | Swapped per client; body font stays constant |

## Pairing by vertical

| Vertical | Display face direction | Why |
|---|---|---|
| Medical / clinical | A clean geometric or grotesque sans (e.g. Söhne, General Sans) at a heavier weight, or a restrained serif for an established/older-practice feel | Reinforces precision and competence; avoid anything with playful curves |
| Wellness / IV / peptides | A humanist sans with warmth, or a soft-contrast serif | Signals approachable and premium without losing legibility |
| Home services | A bold, confident sans, often at heavy/black weight | Needs to read decisively at a glance on a comparison-shopping mobile search |
| Nightlife / hospitality | More expressive — condensed display faces, higher personality | Different job again — brand energy over clinical trust |

## Type scale

Modular scale, ratio 1.25 (major third), 16px base. All values are tokens
in [[design-tokens.json]] — components consume the token, never a raw
`px`/`rem` value.

| Token | Size | Line height | Typical use |
|---|---|---|---|
| `text-xs` | 12px / 0.75rem | 1.4 | Fine print, legal, badge labels |
| `text-sm` | 14px / 0.875rem | 1.5 | Captions, form helper text |
| `text-base` | 16px / 1rem | 1.6 | Body copy — never smaller than this on medical content |
| `text-lg` | 18px / 1.125rem | 1.6 | Lead paragraphs, intro copy |
| `text-xl` | 20px / 1.25rem | 1.4 | `h4`, card titles |
| `text-2xl` | 25px / 1.563rem | 1.3 | `h3`, section subheads |
| `text-3xl` | 31px / 1.953rem | 1.25 | `h2` |
| `text-4xl` | 39px / 2.441rem | 1.15 | `h1` (page title) |
| `text-5xl` | 49px / 3.052rem | 1.1 | Hero headline (desktop only — scales down to `text-3xl`/`text-4xl` on mobile) |

## Loading strategy

- `next/font/google` (or self-hosted variable fonts for a locked-down
  brand face) — no render-blocking `<link>` tags, no FOUT/FOIT flash.
- Subset to Latin unless a client specifically needs broader language
  coverage.
- Variable font weights preferred over multiple static-weight files —
  fewer requests, smoother weight transitions for hover/focus states.
- Display font is preloaded on the homepage (it's above the fold in the
  `Hero`); body font loads with `font-display: swap`.

## Readability & trust rules

- **16px minimum** for any body copy, no exceptions — a 14px paragraph on
  a clinical FAQ page is a real accessibility failure for the older
  patient demographic much of this client base serves.
- **Line length 60-80 characters** for long-form content (blog posts,
  service descriptions) — see `ArticleLayout` in
  [[02-Component-Library]].
- **Contrast** — body text meets WCAG AA (4.5:1) minimum against its
  background at every breakpoint, checked against the client's actual
  palette from [[03-Color-Palettes]], not just the default neutral scale.
- **Never justify body text** — ragged-right only, to avoid uneven word
  spacing on narrow mobile columns.

## Related

- [[01-Design-System]]
- [[02-Component-Library]]
- [[03-Color-Palettes]]
- Assets: [[design-tokens.json]]
