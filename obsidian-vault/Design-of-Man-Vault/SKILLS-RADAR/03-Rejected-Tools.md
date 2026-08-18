---
type: skills-radar
tags: [design-of-man, skills-radar, rejected-tools]
updated: 2026-08-18
---

# Rejected Tools

Running log of tools that were evaluated and **not** adopted. Nothing has
been formally rejected yet as of 2026-08-18 — every tool that's been
through evaluation so far has either been integrated
([[02-Integrated-Tools]]) or is still sitting in the open queue
([[01-Repos-to-Evaluate]]). This file exists as the destination for the
first real rejection, not as a placeholder for one that hasn't happened.

## Why this log exists

Rejections are as valuable to record as adoptions — a tool passed on for a
clear reason shouldn't get re-evaluated from scratch six months later when
someone re-encounters it on GitHub trending. The "why" is the whole point
of this file; an entry without one is not useful and shouldn't be added.

## Required fields per entry

Every rejection logged here needs all of the following — don't log a tool
here without a real reason it was passed on:

| Field | What goes here |
|-------|-----------------|
| Tool | Name, with a link to the repo/source if available |
| Date evaluated | When the evaluation happened |
| Evaluated by | Who did the evaluation (Nick, Cam, or which agent/skill run) |
| Why rejected | The actual reason — cost, redundant with something already integrated, doesn't fit the stack, reliability concerns, scope mismatch, etc. Be specific enough that re-reading this in six months answers "why didn't we use this." |
| Revisit condition | (Optional but preferred) What would have to change for this to be worth re-evaluating — e.g. "revisit if pricing drops below $X/mo" or "revisit once we have 15+ clients and the current approach stops scaling" |

## Log

_No entries yet._ The first tool evaluated and passed on — from
[[01-Repos-to-Evaluate]] or discovered via [[00-Trending-Tools]] — gets
logged here with the fields above filled in, not a placeholder row.

## Template for the next entry

```
### [Tool Name]
- Date evaluated: YYYY-MM-DD
- Evaluated by:
- Why rejected:
- Revisit condition:
- Related: [[00-Trending-Tools]] / [[01-Repos-to-Evaluate]]
```
