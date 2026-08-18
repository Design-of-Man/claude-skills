---
type: clinic
tags: [design-of-man, clinic, first-rehab]
updated: 2026-08-18
---

# First Rehabilitation — Clinic Overview

First Rehabilitation (First Rehab NPB) is a physical therapy and wellness clinic located in North Palm Beach, Florida. It is Nick Kashuba's clinical practice — a real, operating business that sees real patients — and it lives in this vault for a second reason too: it's where several of [[../BUSINESS/00-Company-Overview|The Design of Man]]'s content and automation playbooks were built and proven before they were ever offered to a paying client. See [[../TEAM/00-Team-Overview]] for how Nick's time actually splits across the clinic and the agency.

## What First Rehab Is

- A physical therapy and wellness clinic, based in North Palm Beach, FL.
- Provides hands-on PT — post-surgical rehab, sports injury recovery, general orthopedic care — plus an ongoing maintenance offering for patients who've finished active treatment. See [[01-Wellness-Program]].
- Operated as a genuine clinical practice. Patient care and clinical operations are handled independently of any agency workflow; the agency only touches the clinic's marketing and content layer, never clinical care itself (see [[04-Patient-Materials]] for that boundary drawn explicitly).

## Relationship to The Design of Man

The clinic is **not** a line item on the agency's client roster in `CLIENTS/00-Active-Clients.md` — it isn't scoped, billed, or managed the way Abacoa Podiatry, RegenOrtho, or any other client account is. Nick simply owns both businesses. But functionally, First Rehab has operated as the agency's first test bed:

- The clinic's podcast — produced through [[../INTEGRATIONS/04-Descript|Descript]], see [[02-Podcast-Schedule]] — is where the agency's record-edit-publish content workflow was first worked out end to end.
- Website content patterns now templated for client service pages (see [[03-Website-Content]]) were piloted on the clinic's own site first.
- Automations that now run for paying clients — content scheduling, SEO patterns — trace their origin back to processes built for First Rehab before they were generalized.

Because of that history, `CLINIC/` is kept as its own section, separate from `CLIENTS/`: same production standard as client work, but a different business relationship (owner-operated, not a retainer, no client-approval gate on what ships).

## Two Separate Technical Properties

First Rehab has two independent codebases that are easy to conflate by name. Keep them separate — they have different audiences and neither is a stand-in for the other.

| Property | Repo | Audience | What It Does |
|----------|------|----------|--------------|
| Public marketing site | `firstrehabnpb` | Prospective and current patients (public internet) | The clinic's public-facing marketing site — service pages, FAQ, blog, podcast embed, appointment requests. See [[03-Website-Content]]. |
| Internal staff app | `firstrehabapp` | Clinic staff only (not public) | An HR/scheduling-adjacent internal tool for running the clinic's staff. Not a marketing surface, not part of the agency's client-site pipeline, and not something a patient or site visitor ever sees. |

`firstrehabapp` most recently had work done on an **unpaid days off option** — a staff time-off request feature. That's internal operational tooling for clinic staff, entirely distinct from `firstrehabnpb`. When either repo name comes up in a session, a Slack thread, or an automation log, don't assume they're the same thing — they run on different codebases, serve different audiences, and change on different schedules.

## Notes Index

- [[01-Wellness-Program]] — the clinic's wellness service line: what's included, who it's for, how it's marketed
- [[02-Podcast-Schedule]] — podcast production cadence, produced via Descript
- [[03-Website-Content]] — content inventory and plan for the public marketing site (`firstrehabnpb`)
- [[04-Patient-Materials]] — patient-facing operational materials (intake, FAQ handouts, post-visit care), distinct from marketing content
- [[Automation-Logs/README|Automation-Logs]] — index for clinic-specific automation run logs
