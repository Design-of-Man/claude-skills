---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Credentials — Read This Before Putting Anything Here

## This folder is a placeholder. It is not encryption.

`.credentials.json` in this folder contains one entry per integration, and every value is
the literal string:

```
[ENCRYPTED — set locally, never sync plaintext]
```

That string is a **label**, not a state. Nothing in this folder is encrypted by anything.
There is no key, no vault, no cipher — it is a plain JSON file in a plain folder inside a
Dropbox-synced Obsidian vault. Its only job is to document **which integrations exist and
therefore which secrets you need somewhere else**.

The vault structure document describes this folder as "(ENCRYPTED)". Treat that as an
intention, not a fact about the files on disk.

---

## Where real secrets actually belong

| Secret type | Correct home |
|---|---|
| API keys, tokens, passwords | A password manager (1Password, Bitwarden, or similar), shared between Nick and Cam |
| Anything a client site needs at runtime | Environment variables in [[../02-Vercel]] — never in the repo |
| Anything a local script needs | A local `.env` file that is **gitignored** and lives outside this vault |
| OAuth connections (Google, Microsoft, QuickBooks, Dropbox, Slack) | Nowhere — they are account authorisations, not stored strings. Re-authorise rather than copying tokens around. |

Most of the integrations in this vault are OAuth-based, which means there is usually **no
secret to store at all**. The ones that use API keys — Firecrawl, Supabase service-role,
Post Bridge, the media-generation tools, the MIT AI Gateway once it is live — are the ones
that need a password manager entry.

---

## Why plaintext in this vault is specifically bad

This vault is synced by [[../12-Dropbox]]. A secret written here is immediately:

- on Nick's machine,
- on Cam's machine,
- in Dropbox's cloud storage,
- in Dropbox's file version history, where deleting the file does **not** remove it,
- and potentially in any git repository this vault has been committed to, where deleting the
  file also does not remove it — the value stays in history.

That last point is the one that catches people. "I deleted it" is not remediation for a
secret that has been synced or committed. The only remediation is rotation.

---

## If you ever see a real key in here

Do this in order, and do not skip step 1 to investigate first:

1. **Rotate the credential immediately** at the provider. Assume it is compromised. It is
   faster to rotate a key that was probably fine than to establish that it definitely was.
2. Replace the value in `.credentials.json` with the placeholder string.
3. Move the real value into the password manager.
4. Check whether the file was committed to git. If it was, rotation was mandatory, not
   optional — and note it in [[../../BUSINESS/05-Decisions-Log]].
5. Check Dropbox version history for the same reason.

---

## What belongs in `.credentials.json`

Only this:

- The **list** of integrations that require credentials.
- The placeholder string as every value.
- Nothing else. No usernames, no account IDs, no partial keys, no "safe" publishable keys —
  a publishable key in here trains everyone that keys go in here.

Entries currently listed: google-workspace, vercel, post-bridge, descript, quickbooks-online,
mit-ai-gateway, firecrawl, slack, godaddy, microsoft-365, supabase, dropbox, higgsfield,
viewmax. Higgsfield and ViewMax are documented together in
[[../13-Higgsfield-ViewMax]] but hold separate credentials, so they get separate entries.

---

## Related

- [[../00-Integration-Overview]]
- [[../12-Dropbox]] — why sync makes this urgent
- [[../11-Supabase]] — service-role vs publishable key rules
- [[../../BUSINESS/05-Decisions-Log]]
