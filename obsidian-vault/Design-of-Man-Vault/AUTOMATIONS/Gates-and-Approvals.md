---
type: automation
tags: [design-of-man, automation]
updated: 2026-08-18
---

# Gates and Approvals

The single place to check: **does this need a human before it goes out?** Every automation in this vault that touches something client-facing or public-facing has a checkpoint below. If an automation isn't listed here, it either doesn't need one (internal logging, read-only checks) or it's still in Planning status and hasn't earned a real gate yet.

## The Approval Matrix

| What | Automation | Who Approves | Where | Timing |
|------|-----------|---------------|-------|--------|
| Sales outreach emails | [[02-Monday-Sales-Outreach]] | Nick or Cam (either) | Slack #client-outreach | Before send — every Monday's batch, no default-send |
| Social post captions | [[03-Wednesday-Content-Gen]] | Nick or Cam (either) | Slack #social-posts | Wednesday–Thursday, after 2:00 PM generation |
| Social post graphics | [[03-Wednesday-Content-Gen]] | Nick or Cam (either) | Slack #social-posts | Wednesday–Thursday, after 2:30 PM generation |
| Social post content (client-facing check) | [[04-Sunday-Preview-Email]] | The client | Preview email | Sunday 5:00 PM send, 24-hour window before Monday go-live |
| SEO changes — safe (meta tags, schema, alt text, broken links, sitemap) | [[01-Friday-SEO-Audit]] | No human gate — auto-deploys | N/A | Immediate, every Friday |
| SEO changes — risky (structure, URLs, copy, templates) | [[01-Friday-SEO-Audit]] | Nick or Cam (either) | Slack #seo-audits thread | Queued Friday, deployed once approved in-thread |

## Detail by Category

### Sales Emails

Every prospect email the Sales Outreach Agent drafts is routed to #client-outreach before it sends — there is no auto-send path. Nick or Cam reviews the audit findings behind the pitch and the drafted copy, then approves or edits before it goes out. This applies to the Monday 9:00 AM batch of 5–10 new prospects; it does not apply to the daily prospect-reply check, which only logs incoming replies and doesn't send anything. Full workflow: [[02-Monday-Sales-Outreach]].

### Social Posts

This one has two layers, not one:

1. **Internal review (Nick/Cam):** captions and graphics generated Wednesday get reviewed Wednesday–Thursday in #social-posts. This is a quality gate — tone, accuracy, brand fit.
2. **Client review (the client):** the approved set gets previewed to the client Sunday at 5:00 PM, with a 24-hour window to flag anything before the week's posts start going live Monday. Silence during the window counts as approval; a reply requesting changes pulls or edits the flagged post before its scheduled slot.

Nothing reaches a client's audience without clearing both layers. Full workflow: [[03-Wednesday-Content-Gen]] and [[04-Sunday-Preview-Email]].

### SEO Changes

The Friday SEO Audit Agent splits every finding into safe or risky before doing anything:

- **Safe changes deploy automatically** — no human in the loop. This covers metadata and markup that search engines read but visitors never see: meta titles/descriptions, schema markup, alt text, broken internal link fixes, sitemap/robots.txt corrections.
- **Risky changes queue for approval** — anything a visitor would actually notice (structure, URLs, copy beyond metadata, templates) posts to a Slack thread in #seo-audits with the finding and proposed fix. Nick or Cam approves in-thread before it deploys.

Full workflow and the complete safe/risky classification table: [[01-Friday-SEO-Audit]].

## What's Explicitly Not Gated

- **The daily prospect-reply check** — read-and-log only, no outbound action.
- **GSC data pulls, site audits, and report generation** — read-only, nothing changes on a live site until it clears the matrix above.
- **Planned agents (Client Support, Site Maintenance daily checks)** — see [[05-Daily-Support-Check]]. Neither is live yet, so neither has an active gate. Once built, they're expected to report and log rather than take irreversible action; any auto-remediation added later should get a new row in this matrix.

## Who Approves What — Nick vs. Cam

Every gate above is documented as "Nick or Cam (either)" — the source schedule this vault is built from doesn't split approval authority by category, and nothing in the automations themselves restricts a gate to one person specifically. Either can approve any of the three categories. If the team later wants to split responsibility (e.g., Cam owns social approvals, Nick owns SEO), that split belongs in [[../TEAM/03-Roles-and-Responsibilities]] and should be reflected back into this matrix once decided — as of this writing, it's not yet split.

## Related

- [[00-Automation-Calendar]] — the full weekly schedule these gates sit inside
- [[01-Friday-SEO-Audit]] · [[02-Monday-Sales-Outreach]] · [[03-Wednesday-Content-Gen]] · [[04-Sunday-Preview-Email]] · [[05-Daily-Support-Check]] — each automation's full detail
- [[../COMMUNICATIONS/00-Slack-Channels]] — channel definitions for #client-outreach, #social-posts, #seo-audits
