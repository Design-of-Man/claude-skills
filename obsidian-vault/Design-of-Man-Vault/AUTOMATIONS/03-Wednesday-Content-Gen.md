---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Wednesday Content Generation

**Runs:** Every Wednesday, 2:00 PM (Copy) and 2:30 PM (Design)
**Agents:** [[../AGENTS/03-Copy-Content-Agent]] and [[../AGENTS/04-Design-Graphics-Agent]]
**Reports to:** Slack #social-posts (see [[../COMMUNICATIONS/00-Slack-Channels]])
**Status:** Ready (per [[../AGENTS/00-Agent-Overview]])

## What It Does

Two agents run back-to-back, thirty minutes apart, to produce a full week of social content for every active client: captions first, then graphics built to match them.

## Workflow

1. **2:00 PM — Copy Agent generates 3 captions per client.** Input is client info (brand voice, recent site/service updates, any specific promos). Output is 3 draft captions per client, posted to Slack #social-posts.
2. **2:30 PM — Design Agent generates 3 graphics per client**, built in Canva to match the captions the Copy Agent just produced. Output is 3 graphics per client, posted to the same #social-posts thread as the captions they pair with.
3. **Both outputs land in #social-posts** as a single reviewable set per client — captions and graphics together, not split across channels.
4. **Nick/Cam review Wednesday–Thursday** — approve as-is, request edits, or swap out individual captions/graphics before the set moves forward.

## Why Design Runs After Copy

The Design Agent depends on the Copy Agent's output — graphics are built to match approved (or at least drafted) captions, not the other way around. The 30-minute gap between 2:00 and 2:30 is deliberate: it gives the Copy Agent time to finish and post before Design picks up its output as input.

## What Happens After Review

Once Nick/Cam sign off in #social-posts (by Thursday), the approved set feeds into [[04-Sunday-Preview-Email]] — clients see the finished captions and graphics Sunday at 5:00 PM before anything is scheduled to go live the following week. Posts are scheduled and published through Post Bridge — see [[../INTEGRATIONS/03-Post-Bridge]].

## Approval Gate

Both captions and graphics need Nick/Cam sign-off before they're eligible to go out to a client for preview. This is a content-quality gate, not just an approval formality — see [[Gates-and-Approvals]] for the full detail on timing and who can approve.

## Related

- [[../AGENTS/03-Copy-Content-Agent]] — the Copy Agent spec
- [[../AGENTS/04-Design-Graphics-Agent]] — the Design Agent spec
- [[../INTEGRATIONS/03-Post-Bridge]] — where approved content eventually gets scheduled
- [[../COMMUNICATIONS/00-Slack-Channels]] — #social-posts channel definition
- [[04-Sunday-Preview-Email]] — the next step after internal approval
- [[00-Automation-Calendar]] — how Wednesday fits into the weekly rhythm
- [[Gates-and-Approvals]] — the full approval reference
