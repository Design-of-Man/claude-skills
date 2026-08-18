---
type: clinic
tags: [design-of-man, clinic, first-rehab]
updated: 2026-08-18
---

# Website Content — firstrehabnpb

This is the content inventory and plan for First Rehab's public marketing site, the `firstrehabnpb` repo (see [[00-Clinic-Overview]] for how it's distinguished from the internal `firstrehabapp` staff tool). The site is built and hosted the same way as agency client sites — same shell, same deployment pipeline — but it is the agency's own production example, not a billed client engagement.

## Service Pages

| Page | Status | Notes |
|------|--------|-------|
| Physical Therapy (general/orthopedic) | Live | Core service page — entry point for most organic and referral traffic |
| Sports Injury Rehab | Live | Athlete-focused positioning |
| Post-Surgical Rehab | Live | Covers common post-op referral pathways |
| Wellness Program | Live | Links to [[01-Wellness-Program]] as the maintenance offering |
| Balance / Fall-Prevention | Planned | Aimed at the aging-patient segment referenced in [[01-Wellness-Program]] |
| Podcast / Blog hub | Live | Embeds episodes from [[02-Podcast-Schedule]] |

## FAQ

Standing FAQ topics the site should always answer clearly, since these are the questions that come up most before a first visit:

- Do I need a physician referral to be seen?
- Does First Rehab accept my insurance, or is this self-pay?
- What should I expect at my first visit?
- How long is a typical session?
- What's the difference between standard PT and the Wellness Program? (links to [[01-Wellness-Program]])
- What conditions/injuries does the clinic treat?

## Blog Cadence

| Cadence | Source | Notes |
|---------|--------|-------|
| Aligned to podcast release | [[02-Podcast-Schedule]] | Podcast episodes are the primary source material — recap posts and topic expansions |
| As-needed | Patient FAQ patterns | Recurring questions from intake or the front desk get turned into standalone posts |

Cadence is tied to the podcast schedule rather than running independently — once the podcast's weekly/biweekly slot is locked (see [[02-Podcast-Schedule]]), the blog cadence follows it directly instead of being scheduled separately.

## Site Infrastructure Note

Built on the same design system and Next.js shell used for client sites (`TEMPLATES-BUILDS/00-Next.js-Shell.md`), deployed via `INTEGRATIONS/02-Vercel.md`. This is the `firstrehabnpb` repo specifically — the public marketing property, not the internal `firstrehabapp` staff app (see [[00-Clinic-Overview]] for that distinction).

## Ownership & Review Cadence

Content changes go through the same production quality bar as client work, but without a client-approval gate — Nick and Cam review and ship directly. Treat this site as the reference example when a new client asks what a finished service page or FAQ section should look like.
