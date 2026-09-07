---
type: clinic
tags: [design-of-man, clinic, first-rehab]
updated: 2026-08-18
---

# Podcast Production Schedule

First Rehab produces an ongoing podcast covering PT and wellness topics, patient education, and clinic updates. Production runs entirely through [[../INTEGRATIONS/04-Descript|Descript]] — record, then text-based edit, then publish — which is also the workflow this clinic proved out before the agency considered offering podcast production to clients.

## Production Cadence

| Stage | Owner | Tool / Output |
|-------|-------|----------------|
| Record raw audio/video | Nick (host) | Local recording, imported into Descript |
| Import & rough assembly | Clinic/agency production | Descript project — see [[../INTEGRATIONS/04-Descript]] |
| Edit (filler removal, pacing, captions) | Descript, text-based edit | Descript project |
| Publish / export | Descript export → site + distribution | Published episode + timeline export as needed |
| Distribute | Site embed + clips | See Distribution Channels below |

The cadence itself (weekly vs. biweekly, a fixed recording day) is still being stabilized as the clinic's production rhythm settles — this page tracks the intended pipeline and gets tightened to an exact day/time once that cadence is locked in.

## Pipeline

1. **Record** — raw audio/video captured for the episode.
2. **Import into Descript** — media is pulled into the clinic's Descript project (see [[../INTEGRATIONS/04-Descript]] for project/drive setup).
3. **Edit in Descript** — text-based editing: cut filler words, tighten pacing, generate captions.
4. **Publish/export** — export the finished composition; publish returns a share URL and download link.
5. **Distribute** — embed on the site, clip highlights for social.

## Distribution Channels

- Embedded on the podcast/blog section of the public site — see [[03-Website-Content]].
- Short clips cut for social distribution; archived alongside other clinic content in `CONTENT-LIBRARY/01-Clinic-Content/`.
- Referenced back into clinic marketing — episodes often double as source material for blog posts and FAQ answers (see [[03-Website-Content]]).

## Status

Early-stage / stabilizing. This note documents the intended production pipeline and cadence rather than a settled publishing history — no episode count or guest schedule is tracked here yet. Update this table once a fixed weekly/biweekly slot is confirmed.

## Related Automation Logs

Once podcast publishing is automated end-to-end (auto-export from Descript, auto-embed on the site), each run will be logged in [[Automation-Logs/README|Automation-Logs]], parallel to how `AGENTS/Execution-Logs/` tracks agency automation runs.
