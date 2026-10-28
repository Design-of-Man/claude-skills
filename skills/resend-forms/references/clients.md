# Client registry

Which client domains are set up on Resend, and how each site's forms are wired. Update
this file when a client is added or changes mode.

| Client | Domain | Resend | Mode | Sender | Endpoint | Repo | Notes |
|---|---|---|---|---|---|---|---|
| Abacoa Podiatry & Leg Vein Center | jupiterlaser.com | Verified 2026-10-28 (us-east-1) | **Hybrid** — FormSubmit office copy + Resend visitor confirmation | events@jupiterlaser.com, reply-to angela.d@ | `/api/rsvp-confirm/` (RSVP form only) | Design-of-Man/abacoapodiatry | DNS in Dr. Cedeno's GoDaddy (Nick has delegate access; GoDaddy may text a 2FA code to the owner's phone before saving DNS). Mail on Microsoft 365. Contact form still FormSubmit-only by client request (see repo CLAUDE.md). |
| First Rehab North Palm Beach | firstrehabnpb.com | Present in the Resend account | — | — | — | — | Not wired via this skill yet. |
| Legacy Medical | legacymedicalpalmbeach.com | Present in the Resend account | — | — | — | — | Not wired via this skill yet. |

The Resend account is Nick's (signed in with his own Gmail). One `RESEND_API_KEY`
per client site, each restricted to that client's domain — never share one key across
clients.
