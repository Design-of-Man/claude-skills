---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Design System

One system, many skins. Every client site is built from the same tokens,
spacing scale, and component set — only the values change per client. This
is what keeps an 8-hour build target realistic with a two-person team: Cam
and Nick aren't redesigning a button or re-deriving a spacing scale for
every new podiatry or IV therapy client, they're substituting values into a
system that already works.

## Philosophy

- **Constrained scales beat freeform values.** Spacing, type size, and
  radius all come from a fixed scale, not arbitrary pixel values chosen
  per component. If a value isn't in the scale, the fix is to pick the
  nearest scale value, not to add a one-off.
- **Tokens are the only place client identity lives.** Components never
  hardcode a client's blue or a client's headline font. They reference
  semantic tokens (`--color-primary`, `--font-display`) that
  [[design-tokens.json]] defines per client.
- **Grayscale-first.** New components get built and reviewed in grayscale
  before color is applied, so hierarchy comes from size/weight/spacing
  first and color is a reinforcement, not a crutch.

## Token layers

Two layers, matching how [[design-tokens.json]] is structured:

1. **Primitive tokens** — raw values with no meaning attached (`blue-600`,
   `space-4`, `radius-md`). These rarely change once set.
2. **Semantic tokens** — named by role, pointing at a primitive
   (`--color-primary → teal-600`, `--color-surface → slate-50`). Components
   only ever consume semantic tokens. Re-skinning a client site means
   repointing semantic tokens at different primitives — components don't
   change.

## Spacing scale

4px base unit, used for padding, margin, and gap everywhere. Anything
between two scale steps is a sign the layout needs rethinking, not a new
token.

| Token | Value | Typical use |
|---|---|---|
| `space-1` | 4px | icon-to-label gaps |
| `space-2` | 8px | tight inline spacing |
| `space-3` | 12px | form field spacing |
| `space-4` | 16px | default component padding |
| `space-6` | 24px | card padding, small section gaps |
| `space-8` | 32px | component-to-component spacing |
| `space-12` | 48px | section padding (mobile) |
| `space-16` | 64px | section padding (desktop) |
| `space-24` | 96px | major section breaks |

## Layout & breakpoints

| Breakpoint | Min width | Notes |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets — nav collapses to hamburger below this |
| `lg` | 1024px | Small laptops — standard content max-width kicks in |
| `xl` | 1280px | Desktop — page max-width caps at this |

Content max-width is capped (typically `1200px`) with generous side
padding rather than letting text stretch full-bleed on wide monitors —
this matters more for clinical sites where long-form FAQ and service
copy needs to stay readable.

## Radius and shadow

Both are tokenized the same way as color — see [[design-tokens.json]] for
the exact scale (`radius-sm` through `radius-xl`, `shadow-sm` through
`shadow-lg`). Medical/clinical clients generally sit toward the smaller,
flatter end (trust reads as precise, not playful); wellness and home
services clients can run larger radii and softer shadows.

## Components

The token layer only matters because a fixed component set consumes it.
Full spec, variants, and schema behavior live in
[[02-Component-Library]].

## Color

How primary/secondary/accent get chosen per client vertical, plus the
live palette table, lives in [[03-Color-Palettes]].

## Typography

Type scale, font pairing approach, and loading strategy live in
[[04-Typography-System]].

## Related

- [[00-Next.js-Shell]]
- [[02-Component-Library]]
- [[03-Color-Palettes]]
- [[04-Typography-System]]
- Assets: [[design-tokens.json]]
