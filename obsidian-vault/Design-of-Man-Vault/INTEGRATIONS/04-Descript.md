---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Descript — Podcast Automation

Descript handles the clinic podcast end to end: recording assembly, text-based editing,
captions, publishing, and transcript export. The account is **shared with First
Rehabilitation** — the clinic and the agency work in the same drive.

**Layer**: Agent pipeline (content)
**Status**: Live
**Shared with**: First Rehab clinic — see [[../CLINIC/02-Podcast-Schedule]]
**Cost**: Shared with the clinic — see [[../BUSINESS/03-Expenses]]

---

## Why Descript and Not a Normal Editor

Because the output we actually want is not just an episode — it is an episode *plus* a
transcript *plus* five short clips *plus* a blog post. Descript's model (edit the video by
editing its text) makes all four fall out of the same pass instead of four separate
production jobs. For a two-person agency running a podcast on the side of client work, that
is the whole reason it is in the stack.

---

## The Episode Workflow

```
Record  →  import media into a Descript project
        →  project agent pass: remove filler words, tighten, add captions
        →  human review (this is a clinician on camera — accuracy matters)
        →  publish  →  share + download URLs
        →  export transcript (markdown / srt)
             ↓                        ↓
      blog + FAQ content        short-form clips
   [[../CONTENT-LIBRARY/01-Clinic-Content]]   →  [[03-Post-Bridge]]
```

| Step | Tool surface | Notes |
|---|---|---|
| Import | Project import from URL or upload | Create the project first, or import creates one |
| Edit | Project agent, natural language | Filler removal and trims are safe to automate; anything that changes clinical meaning is not |
| Captions | Automatic | Always review — clinical and anatomical terms are the most common transcription errors |
| Publish | Composition publish | Returns share and download URLs — record both on the episode note |
| Transcript | Transcript export | Markdown for content reuse, SRT for captions elsewhere |
| Timeline export | EDL / FCPXML / Premiere XML | Only when someone else is finishing the cut |

---

## The Editing Line

Automated filler-word removal, silence trimming, and caption generation are fine to run
unsupervised. **Anything that changes what a clinician said is not.** Cutting a hedge out of
a sentence about a treatment turns a careful statement into a claim. Any edit that shortens
or reorders clinical content gets human review before publish — that is a
patient-communication standard, not a style preference.

Captions get the same treatment for the same reason: a mis-transcribed drug or procedure
name published under a clinic's name is a real problem.

---

## Shared-Account Discipline

The drive is shared with the clinic, so the usual solo-account assumptions do not hold:

- **Never delete a project you did not create.** It may be mid-edit on the clinic side.
- **Name consistently**: `YYYY-MM-DD — Episode NN — Topic`. A shared drive without a naming
  convention becomes unusable in about a month.
- **Check `get_project` before republishing.** Existing publishes already carry share URLs;
  republishing to get a link you already have creates a duplicate and a new URL.
- **Folders per season/series**, not per person.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| Project missing | Someone on the clinic side moved or renamed it | List folders and search before assuming deletion |
| Publish job stuck | Long render queue | Poll the job; do not start a second publish of the same composition |
| Captions wrong on clinical terms | Automatic transcription limits | Human correction pass — expected, not a bug |
| Descript unavailable | Vendor outage | Raw recordings are safe wherever they were captured. Editing slips a day; the podcast schedule has enough slack for that. |

---

## Related

- [[../CLINIC/02-Podcast-Schedule]] — the publishing calendar
- [[../CONTENT-LIBRARY/01-Clinic-Content]] — where transcripts become written content
- [[03-Post-Bridge]] — where clips get scheduled
- [[13-Higgsfield-ViewMax]] — for generated media, as opposed to recorded
- [[00-Integration-Overview]]
