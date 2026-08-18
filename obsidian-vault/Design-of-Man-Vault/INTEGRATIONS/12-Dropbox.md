---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Dropbox — Vault Sync and File Storage

Dropbox is how **this vault** exists on more than one machine. Obsidian reads plain markdown
files from a local folder; Dropbox is what keeps that folder the same on Nick's machine and
Cam's. It also carries general agency file storage and client file sharing.

**Layer**: Vault / file
**Status**: Live
**Syncs**: `Design-of-Man-Vault/` — this entire vault

---

## How the Vault Actually Works

```
Obsidian  →  reads/writes local markdown files
              ↓
        Dropbox folder on disk
              ↓  sync
        Dropbox cloud
              ↓  sync
        the other machine's local folder
              ↓
        Obsidian on that machine
```

There is no Obsidian sync service and no database. Every note is a file. That is a
deliberate property: if Dropbox disappeared tomorrow, the vault would still be a folder of
readable markdown, and Obsidian would keep working offline against the local copy.

**Dropbox is sync, not backup.** A deletion propagates to the other machine. Dropbox's own
file history is the recovery path for an accidental delete, and it is worth knowing where
that lives *before* needing it.

---

## The Practical Rules

These exist because they have real failure modes attached, not because they are tidy habits.

### 1. Do not edit the same file in two places at once

The classic Dropbox failure is a **conflicted copy**: two machines write the same file
before sync resolves, and Dropbox — unable to merge — keeps both, naming the second
`Note (Nick's conflicted copy 2026-08-18).md`.

For a vault this is genuinely bad, because:
- Obsidian shows both files, so the same note appears twice in search and in graph view.
- Wikilinks point at the original, so the conflicted copy is orphaned but still present.
- Nobody notices for a week, and by then it is unclear which version has the newer edits.

So: one editor per note at a time. If both people are working in the vault, work in
different files, and say which ones.

### 2. Let sync settle before assuming a change is live everywhere

A note saved on one machine is **not** immediately present on the other. Sync takes seconds
to minutes depending on file count and connection. Before saying "it's in the vault," confirm
the Dropbox client shows sync complete — a green check, not a spinning arrow.

This matters most right after a big write: creating or restructuring many notes at once takes
noticeably longer to propagate than a one-line edit.

### 3. Close Obsidian, or at least stop editing, before a large sync

Editing while a large sync is in flight is exactly the condition that produces conflicts.

### 4. Never put secrets in the synced vault

Everything in this folder is on two machines and in Dropbox's cloud. That is the wrong place
for an API key. See `Credentials/README-DO-NOT-SYNC-PLAINTEXT.md` — the credentials file in
this vault is a **placeholder structure only**.

### 5. Selective sync is a foot-gun for a vault

Selectively un-syncing a subfolder means Obsidian sees broken wikilinks to notes that exist
but are not on this machine. Sync the whole vault or none of it.

---

## General File Storage and Sharing

Beyond the vault, Dropbox holds agency files: source assets, exports, deliverables, and large
files that do not belong in email.

| Feature | Use |
|---|---|
| Shared links | Sending a deliverable to a client without an attachment |
| File requests | Getting large assets *from* a client (logos, photography) without asking them to sign up for anything |
| Folder structure | Mirrors the client roster so files are findable by the same names as the vault notes |

**Client-facing** documents that a client will edit still belong in Google Drive or SharePoint
depending on the client's platform ([[01-Google-Workspace]], [[10-Microsoft-365]]). Dropbox is
for our files and for one-directional handoff.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| Duplicate note titles ending in "conflicted copy" | Simultaneous edits | Compare both, merge by hand, delete the loser. Then work out who was editing what. |
| Note edited on one machine missing on the other | Sync not finished, or paused | Check the Dropbox client status before troubleshooting anything else |
| Broken wikilinks to notes that should exist | Selective sync, or sync incomplete | Re-enable full sync; wait for it to finish |
| Dropbox unavailable | Vendor outage | The vault keeps working locally — Obsidian does not need Dropbox to read files. Do not edit the same note on both machines until sync resumes. |
| A note deleted everywhere | Deletion propagated | Dropbox file history / deleted files recovery |

---

## Related

- [[../README]] — vault quick start, including sync setup
- `Credentials/README-DO-NOT-SYNC-PLAINTEXT.md` — why no secrets live here
- [[01-Google-Workspace]] and [[10-Microsoft-365]] — client-facing file sharing
- [[00-Integration-Overview]]
