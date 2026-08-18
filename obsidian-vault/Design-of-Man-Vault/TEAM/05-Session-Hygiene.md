---
type: team
tags: [design-of-man, team]
updated: 2026-08-18
---

# Session Hygiene

With client work spread across multiple repos and Claude Code Remote sessions running per-client, the active session list drifts fast if nobody tends it. This is a housekeeping note, not a process spec — the actual procedure lives in the `session-hygiene` skill in the team's `claude-skills` repo (`skills/session-hygiene/SKILL.md`); this page just says what triggers it and points there.

## Why This Is Tracked Here

A real check of active Claude Code Remote sessions found **7 sessions needing action and 5 stale sessions ready to archive**, spread across multiple client repos. That's the normal state if the session list goes untended for a stretch — not a one-time cleanup, but a recurring chore that needs to happen on a cadence, the same way inbox zero or a clean prospect tracker does.

## When to Roll or Archive

Per the skill, a session gets rolled into a fresh one (or archived outright) on:

- **A new client or topic** — switching from one client's work to another's is a clean boundary; don't let one session accumulate three clients' worth of history.
- **A long or drifted session** — once a session's actual content has moved well past its title, or it's gotten long enough that context is being spent re-establishing things that should be a fresh start.
- **A milestone shipped** — a deploy goes out, a PR merges, a prospect audit is delivered — that's a natural close point rather than continuing to build on top of finished work.

## The Actual Process

Don't re-derive this here — follow the skill: `skills/session-hygiene/SKILL.md` in `claude-skills`. In short, it covers checking for unfinished work before archiving anything, writing a handoff brief so the next session doesn't start from zero, naming both the old and new session clearly, retagging, and archiving the old session only once the new one reports healthy.

## Related

- [[01-Nick-Profile]] — session hygiene sits mainly in Nick's day-to-day, given the volume of active client repos he runs sessions against
- [[00-Team-Overview]]
- [[../AGENTS/00-Agent-Overview]] — the agents whose runs generate a lot of this session volume in the first place
