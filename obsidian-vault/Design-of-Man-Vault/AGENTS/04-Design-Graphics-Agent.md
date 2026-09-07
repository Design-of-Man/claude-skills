---
type: agent
status: ready
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Design/Graphics Agent

## Purpose
Turns the week's draft captions into a matching graphic, so what ships is a caption and image built as a pair rather than stock art bolted onto separate copy.

## Trigger / Frequency
Wednesdays, 2:30 PM — runs immediately after [[03-Copy-Content-Agent]] and consumes its output directly. See [[../AUTOMATIONS/03-Wednesday-Content-Gen]].

## Inputs
- The 3 captions produced by the Copy/Content Agent this cycle
- Client brand assets — logo, color palette, approved templates

## Outputs
- 3 graphics per active client, built in Canva, posted to Slack `#social-posts` alongside the caption each one matches

## Approval Gate
Same review window as the captions they're paired with — Nick and Cam review Wednesday through Thursday in `#social-posts`. Graphics don't schedule to Post Bridge until the caption+graphic pair is approved, and the client's Sunday preview email covers both together (see [[../AUTOMATIONS/04-Sunday-Preview-Email]]). See [[../AUTOMATIONS/Gates-and-Approvals]].

## Integrations Used
- [[../INTEGRATIONS/03-Post-Bridge]] — scheduling once approved
- [[../INTEGRATIONS/08-Slack]] — `#social-posts` delivery and review thread

## Status
**Ready.** Runs live every Wednesday, immediately after the Copy/Content Agent.

## Related Automation
[[../AUTOMATIONS/03-Wednesday-Content-Gen]] · [[../AUTOMATIONS/04-Sunday-Preview-Email]] · [[../AUTOMATIONS/Gates-and-Approvals]]
