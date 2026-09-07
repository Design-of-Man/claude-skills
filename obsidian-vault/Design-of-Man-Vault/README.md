---
type: readme
tags: [design-of-man]
updated: 2026-08-18
---

# The Design of Man — Vault

This is the operating vault for The Design of Man (Nick Kashuba + Cam) — client roster, agent specs, automation schedule, integrations, business tracking, and the internal First Rehabilitation clinic. It's built to be opened in [Obsidian](https://obsidian.md) and synced through Dropbox, not GitHub.

## Quick start

1. **Install Obsidian** (free, obsidian.md) if you don't have it.
2. **Extract this ZIP into your Dropbox folder.** You should end up with a `Dropbox/.../Design-of-Man-Vault/` folder containing everything you see in this README's sibling folders.
3. **In Obsidian**, choose "Open folder as vault" and point it at that `Design-of-Man-Vault/` folder.
4. **Let Dropbox finish syncing** before you start editing — Obsidian's own sync isn't in play here, Dropbox is doing all the work, and it needs a moment to pull everything down on a fresh machine.
5. Enable **Obsidian's core "Backlinks" and "Outgoing links" panes** (Settings → Core plugins) — this vault is built on `[[wikilinks]]` between clients, agents, automations, and integrations, and those panes are how you actually navigate it day to day.

## How it's organized

| Folder | What's in it |
|---|---|
| [[CLIENTS/00-Active-Clients\|CLIENTS/]] | Every live client and prospect, one file each, plus the roster overview |
| [[TEMPLATES-BUILDS/00-Next.js-Shell\|TEMPLATES-BUILDS/]] | The reusable site shell, design system, and build checklists new client sites start from |
| [[AGENTS/00-Agent-Overview\|AGENTS/]] | Specs for every automated agent, plus dated execution logs |
| [[AUTOMATIONS/00-Automation-Calendar\|AUTOMATIONS/]] | The weekly schedule — when each agent runs and who has to approve what |
| [[DASHBOARD/00-Dashboard-Architecture\|DASHBOARD/]] | Architecture for the (not-yet-built) internal ops dashboard |
| INTEGRATIONS.md + [[INTEGRATIONS/00-Integration-Overview\|INTEGRATIONS/]] | Every external tool in use, its status, and its credentials placeholder |
| [[BUSINESS/00-Company-Overview\|BUSINESS/]] | Revenue model, pricing, expenses, KPIs, decisions log |
| [[SKILLS-RADAR/00-Trending-Tools\|SKILLS-RADAR/]] | What's being watched, evaluated, integrated, or rejected |
| [[COMMUNICATIONS/00-Slack-Channels\|COMMUNICATIONS/]] | Slack/Discord setup, email templates, prospect touchpoint log |
| [[TEAM/00-Team-Overview\|TEAM/]] | Nick + Cam, roles, decision rights, session hygiene |
| [[CONTENT-LIBRARY/03-Blog-Ideas\|CONTENT-LIBRARY/]] | Case studies, clinic content, agency content, blog backlog, social archive |
| [[CLINIC/00-Clinic-Overview\|CLINIC/]] | First Rehabilitation's own operations — separate from paying clients |

## Before you touch anything

- **Credentials are placeholders.** `INTEGRATIONS/Credentials/.credentials.json` holds no real secrets — read [[INTEGRATIONS/Credentials/README-DO-NOT-SYNC-PLAINTEXT|the warning in that folder]] before putting a real key anywhere near this vault.
- **Dollar figures are placeholders** (`$X`, `$XXX`) throughout BUSINESS/ and CLIENTS/ — fill in real numbers as you go, but don't treat what's there as real data.
- **One editor at a time per file.** Dropbox resolves simultaneous edits by forking a "conflicted copy" — if you and Cam are both in the vault, avoid editing the same note at the same second, and if you ever see a `(Nick's conflicted copy ...)` file, resolve it manually rather than letting it sit.

## How this vault was built

Scaffolded from the original vault-structure spec, then expanded with real detail from recent work — including patterns pulled from session history (see [[BUSINESS/05-Decisions-Log]] for exactly what that scan could and couldn't see). One gap found during the build — a recurring Wix/Squarespace→Vercel domain-cutover pattern with no documented process — became a new `domain-migration` skill in the team's `claude-skills` repo; see [[SKILLS-RADAR/02-Integrated-Tools/00-Overview]] and [[TEMPLATES-BUILDS/07-Domain-Migration-Checklist]].
