---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Sunday Preview Email

**Runs:** Every Sunday, 5:00 PM
**Reports to:** Client inbox, per client (see [[../COMMUNICATIONS/02-Email-Templates]])
**Status:** Ready (per [[../AGENTS/00-Agent-Overview]])

## What It Does

The last checkpoint before social content goes live. Every client gets a preview email showing the full week's worth of posts — captions and graphics — that were generated and internally approved earlier in the week. The client has 24 hours to object before anything actually publishes.

## Workflow

1. **Input: the approved content set from Wednesday.** By Sunday, the captions and graphics produced in [[03-Wednesday-Content-Gen]] should already have Nick/Cam sign-off from the Wednesday–Thursday internal review window.
2. **5:00 PM Sunday — send the preview email** to each client, showing the coming week's (Monday–Friday) social posts as they'll actually appear: caption text paired with its graphic, in posting order.
3. **24-hour feedback window opens.** The client can flag anything they want changed, pulled, or swapped before it goes live.
4. **If no objection by the window's close, the posts proceed to their scheduled publish times** via Post Bridge — see [[../INTEGRATIONS/03-Post-Bridge]]. If a client does flag something, that post gets pulled or edited before its scheduled slot.

## Why This Exists

The Wednesday–Thursday review by Nick/Cam catches internal quality issues (typos, off-brand tone, weak graphics). The Sunday preview catches everything only the client would know is wrong — an inaccurate claim, a promotion that's already ended, a photo of the wrong service, timing that conflicts with something happening in their business that week. It's a second, independent check by the person with the most context on their own business.

## Timing Detail

| Step | When |
|------|------|
| Content generated | Wednesday 2:00–2:30 PM |
| Internal review (Nick/Cam) | Wednesday–Thursday |
| Client preview sent | Sunday 5:00 PM |
| Client feedback window closes | Monday ~5:00 PM (24 hours after send) |
| Week's posts go live | Starting Monday, per each post's scheduled time |

Because the feedback window runs into Monday, the first post or two of the week may need to hold briefly if a client's feedback comes in right at the edge of the window — this automation doesn't auto-publish the instant the 24 hours elapses if a client reply is still being reviewed.

## Approval Gate

This is a client-facing gate, not an internal Nick/Cam gate — the client themselves is the approver here, by omission (silence = approved) or by explicit reply requesting changes. See [[Gates-and-Approvals]] for how this fits alongside the other approval gates in the system.

## Related

- [[03-Wednesday-Content-Gen]] — where the content being previewed comes from
- [[../INTEGRATIONS/03-Post-Bridge]] — where the approved posts are actually scheduled and published
- [[../COMMUNICATIONS/02-Email-Templates]] — the preview email template
- [[00-Automation-Calendar]] — how Sunday fits into the weekly rhythm
- [[Gates-and-Approvals]] — the full approval reference
