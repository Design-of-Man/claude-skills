---
type: clinic
tags: [design-of-man, clinic, first-rehab]
updated: 2026-08-18
---

# Automation Logs — Clinic

This folder holds timestamped logs of clinic-specific automation runs — podcast publishing, content scheduling, and similar recurring jobs that touch First Rehab rather than an agency client. It's the clinic-scoped counterpart to `AGENTS/Execution-Logs/`, which tracks automation runs for client-facing agency work. Same purpose, same log format, different scope: this folder is exclusively about [[../00-Clinic-Overview|First Rehab]], never about a client account.

## Status

**Placeholder.** No clinic automations are live yet, so there are no dated log files here to index. This README exists so the folder has a clear purpose documented ahead of the first real run, rather than sitting empty and unexplained.

## What Will Land Here

Once clinic automations come online, expect entries following the same dated-filename convention as `AGENTS/Execution-Logs/` (e.g. `2026-MM-DD-podcast-publish.md`), covering things like:

| Automation | Source | Notes |
|------------|--------|-------|
| Podcast publish run | [[../02-Podcast-Schedule]] via [[../../INTEGRATIONS/04-Descript]] | Record → edit → export → publish, once that pipeline is automated end to end |
| Content scheduling run | [[../03-Website-Content]] | Blog/FAQ content pushed on a schedule tied to the podcast cadence |

## Related

- [[../00-Clinic-Overview]] — how the clinic relates to the agency, and the two First Rehab codebases
- [[../02-Podcast-Schedule]] — the production pipeline these logs will eventually track
