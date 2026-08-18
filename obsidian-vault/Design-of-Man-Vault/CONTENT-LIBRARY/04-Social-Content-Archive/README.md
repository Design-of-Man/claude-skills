---
type: content-library
tags: [design-of-man, content]
updated: 2026-08-18
---

# Social Content Archive

Archive of social captions and graphics **after they've gone live** — the finished output of the Wednesday content pipeline, once approved and posted. This is a record of what was actually published, not a staging area for drafts.

## Where this content comes from

Every Wednesday, two agents run in sequence to produce the week's social content:

1. [[../../AGENTS/03-Copy-Content-Agent]] generates captions per client (2:00 PM run).
2. [[../../AGENTS/04-Design-Graphics-Agent]] generates matching graphics (2:30 PM run).

Both outputs go to Slack `#social-posts` for Nick/Cam review (Wednesday–Thursday window, per [[../../AUTOMATIONS/00-Automation-Calendar]]). Nothing lands in this archive until it clears that review and is actually posted.

## Where content goes live

Approved captions and graphics are scheduled and published through [[../../INTEGRATIONS/03-Post-Bridge]]. Once Post Bridge confirms a post is live, the caption + graphic pair gets archived here — this folder is the historical record of what shipped, organized by client so it's easy to see a client's posting history at a glance or pull an old post for reference.

## Archive convention

Organize by client, then by date:

```
04-Social-Content-Archive/
├── README.md (this file)
├── Abacoa-Podiatry/
│   └── 2026-08-19-caption-graphic.md
├── RegenOrtho/
├── Jupiter-Laser/
├── HomeCrew/
└── ...
```

Each archived entry should capture: final caption text, graphic (or a link/reference to it), platform(s) it posted to, publish date, and the Post Bridge post ID if useful for pulling performance data later via the `analytics` skill.

## Status

No posts archived yet — this folder is standing up ahead of the first Wednesday content cycle clearing full review and going live through Post Bridge. Once the pipeline has run and posts are confirmed live, start filing entries here rather than leaving finished content sitting only in Slack history.

## Related

- [[../../AGENTS/03-Copy-Content-Agent]] — generates the captions archived here
- [[../../AGENTS/04-Design-Graphics-Agent]] — generates the graphics archived here
- [[../../INTEGRATIONS/03-Post-Bridge]] — the platform that actually publishes and confirms these posts
- [[../../AUTOMATIONS/00-Automation-Calendar]] — the Wednesday schedule and Sunday preview-email step this content passes through before archiving
