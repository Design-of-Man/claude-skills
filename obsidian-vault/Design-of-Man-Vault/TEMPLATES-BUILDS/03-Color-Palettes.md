---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Color Palettes

Every client site runs the same [[01-Design-System]] and
[[02-Component-Library]] — the palette is the main lever that makes a
podiatry clinic and an IV therapy lounge not look like the same site with
different words swapped in. Palette selection follows the client's
vertical, not personal taste, because the palette is doing a trust-signaling
job before a single word of copy gets read.

## Approach by vertical

| Vertical | Palette direction | Why |
|---|---|---|
| Medical / clinical (podiatry, orthopedic, physical therapy, laser therapy, regenerative medicine) | Cool, trust-building blues and teals; low-saturation; white/light-gray surface | Blue reads as clinical, competent, calm — the same association hospital and insurance branding leans on deliberately. Low saturation keeps it from reading "startup." |
| Wellness / IV therapy / peptides / aesthetics | Warmer tones — sage, terracotta, warm neutrals, occasional gold accent | These clients are selling a feeling (energy, restoration, self-care) more than a clinical outcome. Warmth reads as approachable and premium rather than sterile. |
| Home services (HomeCrew and similar) | Bolder, higher-contrast — navy/orange, forest/amber pairings | Home services buyers are comparison-shopping fast on mobile; the palette needs to read as decisive and trustworthy for a same-day-decision, not subtle. |
| Nightlife / hospitality (Paddy Macs, Legends Radio) | Saturated, high-energy — deep reds, warm ambers, near-black surfaces | Different job entirely — these aren't converting a health decision, they're selling a night out. Palette follows brand energy, not the medical-trust rules above. |

These are starting directions, not hard rules — a client's existing brand
(logo, signage, established recognition) always overrides the vertical
default. The direction matters most for brand-new builds with no existing
identity to match.

## Palette construction rules

- **Primary** — the dominant brand color, used for the logo treatment,
  primary buttons, and the `Hero` accent. Must hit WCAG AA contrast
  (4.5:1) against white for body text use, or it stays decorative-only.
- **Secondary** — supporting color for section backgrounds, secondary
  buttons, and hover states. Usually a shade/tint of primary rather than
  an unrelated hue, to keep the palette cohesive.
- **Accent** — the "action" color reserved almost exclusively for the
  `BookingCta` and other conversion elements, so it stays visually
  distinct from decorative color use elsewhere on the page. Never reuse
  the accent color for anything that isn't clickable.
- **Neutral scale** — a 6-10 step gray/slate scale for text, borders, and
  surfaces. This is shared across most clients regardless of vertical;
  the neutral scale is what makes the palette feel calm rather than
  saturated everywhere.
- **Semantic colors** — success/warning/error/info, kept consistent
  across all client sites (not client-branded) so form validation and
  status messaging reads the same way everywhere.

All of the above are defined as tokens in [[design-tokens.json]] — a new
client palette is a token-value swap, not a rebuild of any component.

## Client palette table

Fill in as each client's palette is finalized. Hex values are placeholders
until a client's actual brand colors are confirmed — do not ship a color
that hasn't been checked against their existing brand assets (logo,
signage, GBP profile) if one exists.

| Client | Vertical | Primary | Secondary | Accent | Status |
|---|---|---|---|---|---|
| Abacoa Podiatry | Medical / clinical | `TBD` | `TBD` | `TBD` | Live — palette to backfill into tokens |
| RegenOrtho | Medical / clinical | `TBD` | `TBD` | `TBD` | Live |
| RevitalIV | Wellness / IV therapy | `TBD` | `TBD` | `TBD` | Prospect/build |
| Wellness | Wellness | `TBD` | `TBD` | `TBD` | Live |
| HomeCrew | Home services | `TBD` | `TBD` | `TBD` | Launch-ready |
| Sundial | Wellness | `TBD` | `TBD` | `TBD` | Prospect |
| Paradise Ventures | TBD | `TBD` | `TBD` | `TBD` | Prospect |
| Paddy Macs | Nightlife / hospitality | `TBD` | `TBD` | `TBD` | Build |
| Legends Radio | Nightlife / hospitality | `TBD` | `TBD` | `TBD` | Prospect |
| Elite Sports Med | Medical / clinical | `TBD` | `TBD` | `TBD` | Build |
| IV League Infusions | Wellness / IV therapy | `TBD` | `TBD` | `TBD` | Prospect |
| Jupiter Laser & Regenerative Medicine | Medical / clinical | `TBD` | `TBD` | `TBD` | Live |

Worked example of the format once a palette is locked:

| Client | Vertical | Primary | Secondary | Accent | Status |
|---|---|---|---|---|---|
| Example Clinic | Medical / clinical | `#0F4C5C` (deep teal) | `#E7F1F2` (pale teal surface) | `#DC6A2E` (warm orange CTA) | Live |

## Related

- [[01-Design-System]]
- [[02-Component-Library]]
- [[04-Typography-System]]
- Assets: [[design-tokens.json]]
