---
type: team
tags: [design-of-man, team]
updated: 2026-08-18
---

# Decision Matrix

A lightweight RACI for the decisions that actually recur in a two-person agency. With only two people, Responsible and Accountable collapse onto the same person most of the time — the useful distinction here is less "who's accountable" and more "who decides alone vs. who needs the other person's input first."

**Legend:** **D** = Decides (final call) · **C** = Consulted (weighs in before the call is made) · **I** = Informed (told after, doesn't need to weigh in first)

| Decision | Nick | Cam | Notes |
|---|---|---|---|
| Pricing changes | C | C | Not assigned to either alone in the source material — see [[03-Roles-and-Responsibilities]]. Treated here as a joint call by default until they explicitly agree otherwise. |
| New client onboarding | D (technical fit — can we build/deploy it) | D (relationship fit — is this account worth taking) | Split by domain rather than by seniority: Nick's call on whether the build is feasible on the standard stack, Cam's call on whether the relationship is worth the capacity. Neither overrides the other's half. |
| Tool adoption (new integrations, agents, skills) | D | C | Falls out of Nick owning the `claude-skills` repo and agent/skill tooling (see [[01-Nick-Profile]]). Cam is consulted, particularly for anything that touches client-facing or sales tooling he uses directly. |
| Content tone / voice | C | C | No sole owner documented. Both review Wednesday content per [[../AUTOMATIONS/03-Wednesday-Content-Gen]], so tone is a joint call in practice. |
| Technical stack choices | D | I | Nick's domain — see [[../BUSINESS/05-Decisions-Log]] for the record of past stack decisions (e.g. why Next.js). Cam is informed, not consulted, unless a stack choice affects client-facing turnaround time. |

## Reading This Table Honestly

Most of this matrix is inferred from what each person is shown owning elsewhere in the vault, not from a decision-rights policy either of them has written down. Rows where the vault has direct evidence (new client onboarding, tool adoption, technical stack) carry more confidence than rows where nothing points either way (pricing, content tone) — those two are marked "C/C" because defaulting to joint-consultation is safer than guessing a sole owner that hasn't actually been agreed to.

## Related

- [[03-Roles-and-Responsibilities]] — the fuller ownership breakdown this matrix summarizes
- [[00-Team-Overview]]
- [[../BUSINESS/05-Decisions-Log]] — the record of specific past decisions (stack, tooling) referenced above
