---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Higgsfield + ViewMax — AI Image and Video Generation

Two AI media-generation tools that produce the visual half of the content pipeline: images
and short-form video for client social accounts and for the agency's own marketing. Their
output feeds [[03-Post-Bridge]] for scheduling.

**Layer**: Agent pipeline (content production)
**Status**: Live
**Used by**: Design/Graphics Agent, Copy/Content Agent
**Cost model**: credit-based on both — see [[../BUSINESS/03-Expenses]]

---

## Why Two Tools

They overlap, but they are strongest at different ends of the job.

| | **Higgsfield** | **ViewMax** |
|---|---|---|
| Best at | Image generation and image editing; single-clip video generation; asset cleanup | Composed short-form video — script → scenes → voiceover → captions → finished clip |
| Typical output | A hero image, a still for a carousel, a short generated clip, an upscaled or reframed asset | A finished 15–45s vertical video ready to post |
| Editing tools | Upscale, outpaint/uncrop, reframe to a new aspect ratio, background removal, motion control | Captions, caption placement and styling, voiceover, voice change, clip cutting and placement |
| Strong extras | Character/reference consistency across a set; batch generation | Ad formats, script generation, video analysis, cost estimation before generating |

Practical rule: **stills and asset fixes go to Higgsfield; finished narrated video goes to
ViewMax.** When one is unavailable, the other can usually cover — that overlap is a feature,
not redundancy to eliminate.

---

## Place in the Wednesday Pipeline

```
Wed 2:00pm  Copy/Content Agent  →  3 captions per client
Wed 2:30pm  Design/Graphics Agent
                ├─ Higgsfield  →  images, reframes, cleanups
                └─ ViewMax     →  short-form video, captions, voiceover
                ↓
            Slack #social-posts  →  human review
                ↓
            [[03-Post-Bridge]]  →  upload media, schedule
                ↓
            Sun 5pm client preview  →  Mon–Fri publish
```

The captions and the media are produced in the same run so they are actually about the same
thing. Generating media first and writing captions to fit afterwards is how a feed ends up
looking generic.

See [[../AUTOMATIONS/03-Wednesday-Content-Gen]].

---

## Working Rules

### Generate at the destination's spec
Aspect ratio, duration, and caption-safe area differ per platform. Deciding those **before**
generating avoids reframing a 16:9 asset into 9:16 and losing the composition. Both tools
can reframe, but a reframe is a rescue, not a plan.

### Brand consistency is a deliberate act
Every generation is independent unless told otherwise. For a client running a recurring
visual style, use reference elements and consistent prompt scaffolding rather than hoping
successive generations match. A feed where every post looks like a different brand is worse
than a plainer feed that looks like one.

### Estimate before batching
Both tools charge credits and both support batch generation. Batching is efficient; batching
a wrong prompt is efficiently expensive. Estimate cost, generate one, check it, then batch.

### Media is archived, not left in the tool
Approved assets go to [[../CONTENT-LIBRARY/04-Social-Content-Archive/README|Social Content Archive]]. Assets that live only
inside a vendor account are assets we lose when a subscription lapses — and cannot reuse
when a client asks for "that one from March."

---

## What We Do Not Generate

The agency's client base is heavily healthcare-adjacent — a podiatry practice, IV therapy
clinics, regenerative medicine, a rehabilitation clinic. That constrains generated media in
ways a generic marketing shop can ignore:

- **No synthetic before/after or treatment-result imagery.** A generated "result" is a
  fabricated clinical claim, regardless of intent, and it is the kind of thing that draws
  regulatory attention to the client, not to us.
- **No AI-generated people presented as real patients, staff, or testimonials.** Generic
  lifestyle imagery is fine; a synthetic person implied to be a real patient is not.
- **No generated depiction of a facility, equipment, or credential the client does not have.**
- **Real photography wins for anything about the actual practice** — the room, the team, the
  equipment. Generated media is for concept, abstract, and lifestyle framing.

When in doubt, the test is simple: *would a patient feel misled if they learned this image
was generated?* If yes, do not use it. This is a client-protection rule before it is an
ethics rule — see [[../CLINIC/00-Clinic-Overview]] for the clinic-side content standards.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| One tool unavailable | Vendor outage | Use the other — the overlap covers most jobs. If both are down, reuse the content archive; a repeat post beats a missed week. |
| Generation quality inconsistent across a set | Independent generations, no reference | Use reference elements / consistent prompt scaffolding and regenerate the set |
| Credits exhausted mid-run | Batch without estimation | Check balance before the Wednesday run; estimate before batching |
| Asset rejected by a platform | Wrong aspect ratio or duration | Regenerate at spec rather than re-encoding |
| Media lost when needed later | Left in the vendor account only | Archive on approval — non-negotiable |

---

## Related

- [[03-Post-Bridge]] — where approved media gets scheduled
- [[../AUTOMATIONS/03-Wednesday-Content-Gen]] — the pipeline this feeds
- [[../AGENTS/04-Design-Graphics-Agent]]
- [[../CONTENT-LIBRARY/04-Social-Content-Archive/README|Social Content Archive]]
- [[04-Descript]] — recorded video, as opposed to generated
- [[00-Integration-Overview]]
