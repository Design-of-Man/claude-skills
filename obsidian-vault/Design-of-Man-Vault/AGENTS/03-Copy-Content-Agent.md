---
type: agent
status: ready
tags: [design-of-man, agent]
updated: 2026-08-18
---

# Copy/Content Agent

## Purpose
Writes three social captions per active client every week, so Nick and Cam start from a reviewable draft instead of a blank page every Wednesday.

## Trigger / Frequency
Wednesdays, 2:00 PM — thirty minutes ahead of [[04-Design-Graphics-Agent]], which builds the matching graphics from this agent's captions. See [[../AUTOMATIONS/03-Wednesday-Content-Gen]].

## Inputs
- Client brand voice/profile
- Recent site content, offers, and any seasonal or promotional context
- Prior week's post performance, when available (via Post Bridge analytics)

## Outputs
- 3 draft captions per active client, tagged by intended platform, posted to Slack `#social-posts`

## Approval Gate
Captions are drafts only. Nick and Cam review Wednesday through Thursday in the `#social-posts` thread. Approved captions don't schedule to Post Bridge immediately — the client gets a Sunday preview email with a 24-hour window to flag anything before it goes live (see [[../AUTOMATIONS/04-Sunday-Preview-Email]]). Nothing posts without that review having closed. See [[../AUTOMATIONS/Gates-and-Approvals]] for the full rule.

## Integrations Used
- [[../INTEGRATIONS/03-Post-Bridge]] — scheduling once a caption/graphic pair is approved
- [[../INTEGRATIONS/08-Slack]] — `#social-posts` delivery and review thread

## Status
**Ready.** Runs live every Wednesday for all active clients.

## Related Automation
[[../AUTOMATIONS/03-Wednesday-Content-Gen]] · [[../AUTOMATIONS/04-Sunday-Preview-Email]] · [[../AUTOMATIONS/Gates-and-Approvals]]
