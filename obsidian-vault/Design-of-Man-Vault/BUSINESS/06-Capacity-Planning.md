---
type: business
tags: [design-of-man, business, capacity]
updated: 2026-08-18
---

# Capacity Planning

The Design of Man is two people. Every growth target in
[[01-Financials]] and every fee tier in [[02-Pricing-Model]] ultimately
runs into the same hard limit: how many hours Nick and Cam actually
have available in a week. This note is where that limit gets made
explicit, rather than left as an assumption underneath the revenue
targets.

## Available Hours

| Person | Weekly Hours Available for The Design of Man | Notes |
|---|---|---|
| Nick | X hrs/week | After [[../CLINIC/00-Clinic-Overview\|First Rehabilitation]] obligations, clinic hours come first — see [[../TEAM/03-Roles-and-Responsibilities]] for the actual split |
| Cam | X hrs/week | See [[../TEAM/02-Cam-Profile]] and [[../TEAM/03-Roles-and-Responsibilities]] for what else competes for this time |
| **Combined weekly capacity** | **X hrs/week** | The real constraint every other number in this note is measured against |

These are placeholders deliberately — actual available hours are
personal, variable week to week, and belong to Nick and Cam to state
plainly rather than have estimated for them. What matters for planning
purposes is the *shape* of the constraint below, which holds regardless
of the exact number.

## How Hours Cap Client Capacity

Two different kinds of hours draw against the same pool, and both need
to fit inside combined weekly capacity:

1. **Build hours** — the 8-hour time-to-build and 10-hour
   time-to-launch targets from [[04-KPIs]], consumed whenever a new
   client is actively mid-build.
2. **Approval hours** — the recurring, smaller chunks of time spent at
   the gates defined in [[../AUTOMATIONS/00-Automation-Calendar]] and
   detailed in [[../AUTOMATIONS/Gates-and-Approvals]]: reviewing sales
   emails before they send, approving social content each
   Wednesday–Thursday, and signing off on riskier SEO changes each
   Friday, across every *live* client on the roster.

Approval hours scale with the number of live clients (more clients
means more weekly review cycles), while build hours are a one-time
draw per new client that clears once that client goes live. That means
the number of clients the agency can have **actively in build** at once
is capped by combined weekly capacity minus whatever's already
committed to ongoing approval work for existing live clients — the two
compete for the same hours, not separate budgets.

This is also why 10 clients by year-end (per [[01-Financials]]) is a
capacity-aware target rather than an arbitrary round number: it
reflects what combined weekly capacity can sustain in ongoing approval
overhead once builds are done, not just what sales could theoretically
close. See [[../CLIENTS/00-Active-Clients]] for how many clients are
live, in build, or in pipeline against this cap at any given time.

## Why the Automation Calendar Is Built the Way It Is

The single biggest lever against this constraint is the design
decision logged in [[05-Decisions-Log]]: automation handles execution,
Nick and Cam handle approval. Every automation in
[[../AUTOMATIONS/00-Automation-Calendar]] is structured so that the
*agent* does the hours-consuming work — drafting outreach emails,
generating captions and graphics, pulling SEO audits, compiling
reports — and the *human* time is bounded to reviewing and approving
(or rejecting) that output, per
[[../AUTOMATIONS/Gates-and-Approvals]].

That distinction is what makes capacity scale past what 2 people's raw
hours would otherwise support:

- **Without automation**, each additional client adds real hours of
  manual execution every week — writing captions, running SEO checks,
  drafting outreach — and capacity caps out at whatever 2 people can
  physically produce.
- **With approval-gated automation**, each additional client adds
  review time instead of production time. Reviewing three drafted
  captions and approving an SEO change queue takes a fraction of the
  time it takes to have written and researched them from scratch. The
  agent absorbs the hours that scale with output volume; Nick and Cam
  absorb only the hours that scale with judgment calls.

This is deliberate, not incidental — it's the mechanism the 10-client
target in [[01-Financials]] depends on being achievable without adding
a third or fourth person. If approval-review time itself ever starts
consuming a meaningful share of combined weekly capacity (a genuine
risk once client count climbs), that's a signal worth its own dated
entry in [[05-Decisions-Log]], not something to absorb silently.

## What This Doesn't Solve

Capacity planning against approval-gated automation assumes the
automations themselves stay reliable. A tool going down mid-run (the
Firecrawl fallback documented in
[[../INTEGRATIONS/07-Firecrawl]] is the clearest existing example)
shifts work back toward manual effort exactly when it's least
convenient. Capacity math in this note should be read as the
steady-state case, not a guarantee that every week runs at that
efficiency.

## Related Notes

- [[../TEAM/00-Team-Overview]] — who Nick and Cam are and how the team is structured
- [[../TEAM/03-Roles-and-Responsibilities]] — the actual weekly split of what each person owns
- [[../AUTOMATIONS/00-Automation-Calendar]] — the automations this capacity model depends on
- [[../AUTOMATIONS/Gates-and-Approvals]] — exactly where human approval time gets spent
- [[01-Financials]] — the 10-client target this capacity model is checked against
- [[04-KPIs]] — time-to-build and time-to-launch, the build-hour side of this constraint
- [[05-Decisions-Log]] — the founding decision to automate execution rather than hire
