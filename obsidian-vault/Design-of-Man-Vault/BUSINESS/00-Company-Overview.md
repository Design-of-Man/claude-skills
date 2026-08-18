---
type: business
tags: [design-of-man, business, overview]
updated: 2026-08-18
---

# Company Overview

## What This Is

**The Design of Man** is a two-person web and marketing agency run by
**Nick Kashuba** and **Cam**. It builds and manages websites for local
wellness and medical service businesses — chiropractors, IV therapy
clinics, regenerative medicine practices, podiatrists, and adjacent
service providers — mostly concentrated in Palm Beach, Martin, and St.
Lucie (PSL) counties in Florida, the same service area the agency
prospects into via the Monday Sales Outreach automation.

The agency is small by design, not by accident. Two people cannot
out-staff a larger firm, so the whole operating model — the
[[../TEMPLATES-BUILDS/00-Next.js-Shell|Next.js shell]] every build forks
from, the agent automations, the approval-gate discipline — exists to
make two people's judgment scale further than two people's hours would
otherwise allow. See [[06-Capacity-Planning]] for how that constraint
actually gets managed week to week, and
[[../TEAM/00-Team-Overview]] for who does what.

## What The Design of Man Does

The core offer is simple and repeats client to client:

1. **Build** — a new site (or a rebuild of an existing one) on the
   agency's standard Next.js/Vercel stack, priced as a one-time build
   fee.
2. **Manage** — ongoing hosting, SEO, social content, and reporting for
   a recurring monthly fee once the site is live.

Full pricing structure lives in [[02-Pricing-Model]]; the revenue
targets built on top of it live in [[01-Financials]]. The build side
draws on a standardized template system
([[../TEMPLATES-BUILDS/00-Next.js-Shell]] and its related design-system
notes) so that build time stays close to target rather than being
re-invented per client. The management side runs largely through the
agent automations documented in [[../AGENTS/00-Agent-Overview]] and
scheduled in [[../AUTOMATIONS/00-Automation-Calendar]], with Nick and
Cam sitting at approval gates rather than doing the manual work
themselves — see [[06-Capacity-Planning]].

## Who Runs It

| Person | Role | Detail |
|---|---|---|
| Nick Kashuba | Co-founder | Also runs [[../CLINIC/00-Clinic-Overview\|First Rehabilitation]], the wellness clinic this agency's niche and playbooks originated from |
| Cam | Co-founder | See [[../TEAM/00-Team-Overview]] and [[../TEAM/02-Cam-Profile]] for full detail |

Full role breakdown, decision ownership, and how work splits between the
two of them lives in [[../TEAM/03-Roles-and-Responsibilities]].

## Relationship to First Rehabilitation

The Design of Man and **First Rehabilitation** (Nick's clinic) are
**separate businesses that stay closely connected**, not the same
entity wearing two names. That relationship runs in two directions:

- **The clinic is an internal client.** First Rehabilitation's own
  website, content pipeline, and (per [[../CLINIC/00-Clinic-Overview]])
  its podcast and patient-facing materials are built and maintained
  using the same stack, the same agents, and largely the same
  automation calendar as any paying client site. Where a shared vendor
  cost exists — Descript being the clearest example — it's billed to
  the clinic side rather than split, and that allocation is called out
  explicitly in [[03-Expenses]] rather than folded silently into the
  agency's own numbers.
- **The clinic is the origin of some of the agency's playbooks.**
  Before The Design of Man had outside clients, First Rehabilitation's
  own site and content needs were the first real build — the
  SEO baseline, the local-service-business messaging patterns, and the
  wellness/medical vertical focus all trace back to solving that
  problem first. The agency's target niche (wellness and medical
  service businesses) isn't a market-research pick; it's the vertical
  Nick already understood cold from running the clinic.

Because the two businesses share a founder, a stack, and some vendor
costs but not a P&L, every financial note in this folder
([[01-Financials]], [[03-Expenses]], [[04-KPIs]]) tracks The Design of
Man's numbers only, with clinic-shared costs flagged explicitly rather
than assumed. For the clinic side of the relationship — the podcast,
wellness program, patient materials, and the staff-facing internal app
— see [[../CLINIC/00-Clinic-Overview]].

## Related Notes

- [[../TEAM/00-Team-Overview]] — the people, their roles, how they work together
- [[../CLINIC/00-Clinic-Overview]] — First Rehabilitation, the connected clinic
- [[01-Financials]] — revenue model, targets, and expenses
- [[02-Pricing-Model]] — how build and management fees are actually structured
- [[../TEMPLATES-BUILDS/00-Next.js-Shell]] — the technical foundation every build starts from
- [[../CLIENTS/00-Active-Clients]] — who's actually live, in pipeline, or being evaluated today
