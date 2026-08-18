---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Post Bridge — Social Media Scheduling

Post Bridge is the **output target of the Wednesday content pipeline**. Captions and media
are produced by agents, reviewed by a human, then scheduled here across every connected
client account.

**Layer**: Agent pipeline
**Status**: Live
**Used by**: Copy/Content Agent, Design/Graphics Agent
**Cost**: Free tier — see [[../BUSINESS/03-Expenses]]

---

## Why It Exists in the Stack

Without it, publishing to a client's Instagram, TikTok, LinkedIn, Facebook, and Google
Business Profile means five logins per client per week. Post Bridge collapses that into one
scheduling surface with per-platform accounts, which is what makes a two-person agency able
to run social for ten clients.

It is a **scheduler**, not a content system. The content lives in the vault and in
[[../CONTENT-LIBRARY/04-Social-Content-Archive/README|Social Content Archive]]. Post Bridge holds the queue.

---

## The Wednesday Pipeline

```
Wed 2:00pm   Copy/Content Agent  →  3 captions per client
Wed 2:30pm   Design/Graphics Agent + [[13-Higgsfield-ViewMax]]  →  3 assets per client
             ↓
             Slack #social-posts  →  human review (Wed–Thu)
             ↓
             Post Bridge: upload media → create scheduled post
             ↓
Sun 5:00pm   Client preview email — 24 hours to object
             ↓
Mon–Fri      Posts publish on schedule
```

Two gates, deliberately. The internal gate (`#social-posts`, Nick or Cam) catches
brand and quality problems. The client gate (Sunday preview email) catches
"we are not saying that this week" problems — a clinic running a promotion, a client with
news they have not announced yet. See [[../AUTOMATIONS/04-Sunday-Preview-Email]].

Because the client preview goes out Sunday for a Monday-onward schedule, **posts must be
scheduled, never published immediately.** Anything published on creation skips both gates.

---

## Operating Notes

| Topic | Detail |
|---|---|
| Accounts | One connected social account per client per platform. Confirm the account list before scheduling — posting a clinic caption to the wrong client's Instagram is the failure mode that actually happens. |
| Media first | Upload media, then create the post referencing it. A post created without its asset is a post that publishes as bare text. |
| Scheduling | Always set a scheduled time. Omitting it publishes immediately. |
| Per-platform limits | Aspect ratio, duration, and caption length differ per platform. This is why media specs are decided during generation ([[13-Higgsfield-ViewMax]]) rather than fixed up afterwards. |
| Analytics | Post-level results and daily analytics sync back; feeds the social section of client reports and [[../DASHBOARD/03-Client-Health]] |
| Deletion | Deleting a scheduled post removes it from the queue. Deleting an already-published post is a platform action, not a Post Bridge one. |

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| Post did not publish | Platform token expired or account disconnected | Reconnect the account; re-queue the post. Check `list_post_results` before assuming Post Bridge failed. |
| Wrong client's account | Account ID mismatch at scheduling time | Delete the scheduled post before it fires. This is why the account list is confirmed per run. |
| Post Bridge unavailable | Vendor outage | Post manually from the platform apps — the captions and assets already exist and are already approved. Nothing is lost, only the convenience layer. |
| Media rejected by a platform | Format/length constraint | Regenerate at the platform's spec rather than re-encoding a wrong-shaped asset |

---

## Related

- [[../AUTOMATIONS/03-Wednesday-Content-Gen]] — the schedule this serves
- [[../AUTOMATIONS/04-Sunday-Preview-Email]] — the client-facing gate
- [[13-Higgsfield-ViewMax]] — where the media comes from
- [[08-Slack]] — `#social-posts` review channel
- [[../CONTENT-LIBRARY/04-Social-Content-Archive/README|Social Content Archive]]
- [[00-Integration-Overview]]
