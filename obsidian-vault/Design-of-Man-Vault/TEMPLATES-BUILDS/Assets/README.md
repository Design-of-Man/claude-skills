---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Assets

This folder holds the binary/working build assets that back
[[../00-Next.js-Shell]] and [[../01-Design-System]] — not documentation
about them. It syncs via Dropbox alongside the rest of the vault, the same
as every other folder here.

## What's in here

| File | What it is |
|---|---|
| `design-tokens.json` | The live token source — colors (primitive + semantic), spacing scale, font tokens, radius, and shadow values. `tailwind.config.ts` in the Next.js shell reads this directly. Real, currently in use — not a spec document. |
| `site-shell.zip` | A packaged snapshot of the [[../00-Next.js-Shell]] starter repo, kept here so a new client build can be spun up from a local zip without a fresh `git clone` of the shell repo. |

## Keep these updated, not just documented

These are real working assets, not reference material — if the shell
repo's structure changes, or a token gets added/renamed in the Tailwind
config, `design-tokens.json` here needs to reflect that change or the next
client build starts from a stale file. Treat an edit to the shell's design
tokens the same as any other shipped change: update the source, then
update this copy in the same pass, not "later."

Practical rule: whoever touches `tailwind.config.ts` or the token layer in
the shell repo is responsible for re-exporting/copying the updated
`design-tokens.json` here before calling that work done.

## Dropbox sync note

This folder is inside the Dropbox-synced vault path. Binary files (the zip
especially) are more prone to sync conflicts than markdown if two people
edit near-simultaneously — if a "conflicted copy" of either file shows up,
resolve it immediately (diff and merge, don't just pick one blindly) rather
than letting a stale duplicate sit next to the real file.

## Related

- [[../00-Next.js-Shell]]
- [[../01-Design-System]]
- [[design-tokens.json]]
