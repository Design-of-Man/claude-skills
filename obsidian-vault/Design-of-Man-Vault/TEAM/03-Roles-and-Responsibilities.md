---
type: team
tags: [design-of-man, team]
updated: 2026-08-18
---

# Roles and Responsibilities

A two-person agency doesn't need an org chart, but it does need a shared answer to "whose call is this." This page lays out the split as best it can be inferred from how the pipeline, prospect assignments, and approval gates actually work today — see the confidence note on each row before treating any of it as a settled policy neither of them has actually agreed to.

## The Split

| Area | Primary Owner | Basis | Confidence |
|---|---|---|---|
| Agent approvals (sales emails, social posts, SEO changes) | **Shared — Nick & Cam** | [[../AUTOMATIONS/Gates-and-Approvals]] and [[../AUTOMATIONS/00-Automation-Calendar]] name "Nick/Cam" jointly for every approval gate — no automation is documented as needing only one signature. | High — explicit in the source material |
| Client comms | **Split by account, not by function** — Nick for Revital IV and clinic crossover; Cam for IV League and New Life Peptides | [[../CLIENTS/00-Active-Clients]] prospect assignment table | High for the named accounts; unassigned for accounts not yet in the roster |
| Technical build pipeline (site builds, deployments, agent/skill tooling) | **Nick** | Owns the `claude-skills` repo, the deployment/domain-migration work, and the SEO Audit Agent's technical classification logic — see [[01-Nick-Profile]] | Inferred — no explicit "Nick owns the build pipeline" statement exists, but it follows from what he's shown owning elsewhere |
| Business / financial side (pricing, expenses, capacity planning, QuickBooks) | **Not explicitly assigned** | [[../BUSINESS/06-Capacity-Planning]] tracks both of their hours jointly, and nothing in the source material names an owner for financials or QBO | Unconfirmed — this is a gap worth closing explicitly rather than a policy this page can state with confidence |

## Where Responsibility Is Genuinely Shared

Every agent-driven output that reaches a client or the public has both names on the approval gate, not one:

- **Sales emails** — Nick/Cam review and approve before send (see [[../AUTOMATIONS/02-Monday-Sales-Outreach]])
- **Social posts** — Nick/Cam review Wednesday–Thursday, on top of the client's own Sunday preview window (see [[../AUTOMATIONS/03-Wednesday-Content-Gen]] and [[../AUTOMATIONS/04-Sunday-Preview-Email]])
- **SEO changes** — safe changes auto-deploy; anything risky waits for Nick/Cam sign-off in a Slack thread (see [[../AUTOMATIONS/01-Friday-SEO-Audit]])

Neither of them holds sole sign-off authority over anything that goes out the door. That's a deliberate reading of the approval gates, not an assumption — every one of them names both.

## Where the Split Is Inferred, Not Confirmed

Two things on this page are read from indirect evidence rather than a stated assignment, and are flagged as such above:

1. **The technical build pipeline defaulting to Nick** — this follows from the `claude-skills` repo, deployment work, and internal tooling (Jarvis) all being his, but nothing in the source material says "Nick owns the build pipeline" outright.
2. **The business/financial side having no named owner** — [[../BUSINESS/06-Capacity-Planning]] tracks both of their hours, but pricing decisions, expense tracking, and the QuickBooks connection aren't assigned to either person anywhere in the current documentation. This is worth a real conversation between the two of them rather than a guess recorded here as fact.

## Related

- [[00-Team-Overview]]
- [[01-Nick-Profile]]
- [[02-Cam-Profile]]
- [[Decision-Matrix]] — decision rights for the recurring calls (pricing, onboarding, tools, tone, stack)
- [[../AUTOMATIONS/Gates-and-Approvals]] — the full approval-gate reference this page draws from
