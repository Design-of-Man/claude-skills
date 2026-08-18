---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Integration Overview — How the Stack Actually Fits Together

This note is the map. Every other file in `INTEGRATIONS/` documents one tool; this one
explains **which layer it belongs to, what depends on it, and what happens when it is gone**.

The agency runs on four distinct integration layers. They fail independently, they are
owned differently, and confusing them is how outages get misdiagnosed. A client site going
down is a Vercel/Supabase/registrar problem. A Wednesday content batch not appearing is a
Post Bridge / media-generation problem. Neither is fixed by looking at the other.

---

## The Four Layers

| Layer | What it is for | Integrations | If this layer is down |
|---|---|---|---|
| **Agent pipeline** | The tools the weekly agents read from and write to | Google Workspace, Microsoft 365, Firecrawl, MIT AI Gateway *(not yet live)*, Slack, Post Bridge, Descript, Higgsfield + ViewMax | Automation stalls. Client sites keep serving traffic. Nothing customer-visible breaks. |
| **Client-site infrastructure** | What keeps client websites alive and capturing leads | Vercel, Supabase, GoDaddy | Customer-visible outage. This is the only layer where a failure costs a client money the same day. |
| **Business** | Money in, money out, who owes what | QuickBooks Online | Billing and reporting are delayed. Nothing else is affected. |
| **Vault / file layer** | Where this vault and shared files live | Dropbox (plus Google Drive / SharePoint for client-facing files) | Sync stops; local copies keep working. The real risk is conflicted copies, not data loss. |

---

## Layer 1 — Agent Pipeline

These are the inputs and outputs of the scheduled agents in [[../AUTOMATIONS/00-Automation-Calendar]].

| Integration | Role in the pipeline | Which agents touch it |
|---|---|---|
| [[01-Google-Workspace]] | Calendar (shared with Cam), Gmail (client replies, outreach sending), Drive (shared docs and assets) | Client Support, Sales Outreach, Client Reporting |
| [[10-Microsoft-365]] | Outlook mail/calendar and SharePoint for the accounts that are **not** on Google Workspace | Client Support (per-client), Client Reporting |
| [[07-Firecrawl]] | Crawls prospect and client sites for audit data | Sales Outreach, SEO Audit |
| [[06-MIT-AI-Gateway]] | Model routing and token compression in front of every agent LLM call. **Evaluated, not yet live.** | All (once live) |
| [[08-Slack]] | Where agents report and where humans approve. Nothing ships without a Slack thread. | All |
| [[03-Post-Bridge]] | Publish target for scheduled social content | Copy/Content, Design/Graphics |
| [[13-Higgsfield-ViewMax]] | Generates the images and short-form video that Post Bridge then schedules | Design/Graphics, Copy/Content |
| [[04-Descript]] | Podcast recording, editing, transcript export (shared with the clinic) | Content pipeline, clinic ops |

### The pipeline in motion

**Monday — Sales Outreach.** Agent takes a prospect list, hands each domain to Firecrawl
(or the documented HTTP fallback when Firecrawl is unavailable), scores the site, drafts an
email, and posts it to `#client-outreach`. A human approves in-thread. The mail goes out
through Gmail — or Outlook, if that prospect's account lives on Microsoft 365. The prospect
record is written back into the vault, which Dropbox syncs to both machines.

**Wednesday — Content.** Copy agent writes captions. Higgsfield and ViewMax produce the
image and video assets. Both land in `#social-posts` for review, then get uploaded to Post
Bridge and scheduled. Sunday 5pm, clients get a preview email with 24 hours to object.

**Friday — SEO Audit.** Search Console data plus site content, crawled with Firecrawl.
Safe changes (meta tags, schema) get deployed through Vercel; risky ones get queued in
`#seo-audits` for approval.

**Daily — Client Support.** The agent checks inboxes. Which inbox depends on the client:
Google Workspace for most, Microsoft 365 for at least one. That per-client mapping lives in
each client note and is documented in [[10-Microsoft-365]] — guessing wrong means an agent
reports an empty inbox while real client mail sits unread somewhere else.

**Ongoing — Site Maintenance.** Vercel runtime errors and analytics, plus Supabase
form-submission health.

---

## Layer 2 — Client-Site Infrastructure

This is the layer with real blast radius. A failure here is visible to a client's customers.

| Integration | Role | Notes |
|---|---|---|
| [[02-Vercel]] | Hosting, deployments, web analytics, runtime error monitoring for every client site | Deep usage — not just a deploy target. See [[../TEMPLATES-BUILDS/06-Deployment-Checklist]]. |
| [[11-Supabase]] | Database behind the marketing sites: contact forms, lead capture, structured content | A Supabase outage means forms fail silently unless the site is built to catch it. |
| [[09-GoDaddy]] | **Registrar only** — checking availability and buying domains | The DNS cutover is a separate process: [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] |

The three are chained: a domain bought at GoDaddy points DNS at Vercel, which serves a
Next.js site that writes form submissions into Supabase. Break any link and the chain is
visibly broken — but in three different ways. Domain expiry takes the whole site off the
internet. A Vercel incident takes the site down but leaves DNS intact. A Supabase incident
leaves the site up and *silently loses leads*, which is the worst of the three because
nobody notices for days.

---

## Layer 3 — Business

[[05-QuickBooks-Online]] carries invoicing, payroll, and AR/AP aging. It feeds
[[../BUSINESS/01-Financials]] and the revenue tiles on the dashboard. Read access is the
default for agents; anything that creates or sends an invoice is a human action.

---

## Layer 4 — Vault and Files

[[12-Dropbox]] is how this vault exists on more than one machine. It is not a backup, it is
a sync layer — a deletion propagates. It also carries general file storage and client file
sharing.

Client-facing documents live in Google Drive or SharePoint depending on which platform that
client is on; the vault itself lives only in Dropbox.

**Credentials never live in any of these in plaintext.** See
`INTEGRATIONS/Credentials/README-DO-NOT-SYNC-PLAINTEXT.md`.

---

## Resilience — What Breaks If X Is Down

### Firecrawl — known reliability gap, documented fallback

Firecrawl is the one integration with a **proven** availability problem, and the response is
already written down. On 2026-08-18, during site-transfer verification for RegenOrtho,
Firecrawl was unavailable. The audit did not stop and did not wait: it fell back to a plain
HTTP crawl that fetched each path and followed redirects, recording final status codes. That
run covered 63 paths and found 8 real 404s.

Treat the fallback as a first-class code path, not a degraded mode. "Firecrawl is down, we
will retry tomorrow" is the wrong answer — the fallback already caught real breakage.
Full procedure in [[07-Firecrawl]].

### MIT AI Gateway — should be the *most* resilient piece once live

The gateway's entire reason for existing is provider fallback: if Claude is unavailable, the
call routes to DeepSeek, then GPT-4, instead of the agent run dying. Once it is live, an
outage at any single model provider stops being an incident.

The honest caveat: putting every LLM call behind one hop means the gateway itself becomes a
single point of failure for all agents. That is a worse failure mode than a single provider
outage, so the integration is only safe with a direct-to-provider bypass configured and
tested *before* it goes live. See [[06-MIT-AI-Gateway]].

### Everything else

| Integration | If it is down | Fallback |
|---|---|---|
| **Vercel** | Every client site is down. Highest-severity failure in the stack. | None for a platform-wide incident — check status, notify clients proactively. For *our own* bad deploy, roll back to the previous production deployment immediately. |
| **Supabase** | Sites stay up, forms fail. Leads are lost quietly. | Site forms should fail loudly (visible error + fallback mailto), never pretend to succeed. Verify this per site. |
| **GoDaddy** | Cannot check or buy new domains. Existing sites unaffected *unless* DNS is hosted there. | Wait it out; domain purchases are never urgent. Domain **expiry** is the real risk — keep auto-renew on. |
| **Slack** | Agents run but nobody can approve anything, so nothing ships. | Approvals move to direct message or text. Agent output still lands in the vault. |
| **Google Workspace / Microsoft 365** | Inbox monitoring and calendar sync stop; outreach cannot send. | Wait it out. Do not switch platforms mid-outage — the per-client inbox mapping is what keeps this coherent. |
| **Post Bridge** | Scheduled posts do not publish. | Post manually from the platform apps; the captions and media already exist. |
| **Higgsfield / ViewMax** | No new generated media. | The other one usually still works — they overlap enough to cover a single-vendor outage. Otherwise reuse the content archive. |
| **Descript** | Podcast editing and transcript export stop. | Raw recordings are safe; editing shifts a day. Shared with the clinic, so coordinate before assuming it is a Descript problem and not a shared-account problem. |
| **QuickBooks Online** | No invoicing, no AR/AP reporting. | Low urgency. Delay a day. |
| **Dropbox** | Vault stops syncing between machines. | Local vault keeps working — Obsidian reads local files. Do **not** edit the same note on two machines while sync is down; that is exactly how conflicted copies happen. |

### The ordering that matters

If multiple things are broken at once, work them in this order:

1. **Client sites down** (Vercel, DNS/registrar) — customer-visible, revenue-affecting.
2. **Lead capture broken** (Supabase) — silent, so it stays broken longest if not checked.
3. **Approval path broken** (Slack) — blocks everything downstream of the agents.
4. **Agent inputs broken** (Firecrawl, Workspace/M365) — use the documented fallbacks.
5. **Everything else** — it can wait a day.

---

## Status at a Glance

| # | Integration | Layer | Status |
|---|---|---|---|
| 01 | [[01-Google-Workspace]] | Agent pipeline | Live |
| 02 | [[02-Vercel]] | Client-site infra | Live |
| 03 | [[03-Post-Bridge]] | Agent pipeline | Live |
| 04 | [[04-Descript]] | Agent pipeline | Live |
| 05 | [[05-QuickBooks-Online]] | Business | Live |
| 06 | [[06-MIT-AI-Gateway]] | Agent pipeline | Evaluated — not integrated |
| 07 | [[07-Firecrawl]] | Agent pipeline | Live, with documented fallback |
| 08 | [[08-Slack]] | Agent pipeline | Live |
| 09 | [[09-GoDaddy]] | Client-site infra | Live (registrar only) |
| 10 | [[10-Microsoft-365]] | Agent pipeline | Live |
| 11 | [[11-Supabase]] | Client-site infra | Live |
| 12 | [[12-Dropbox]] | Vault / files | Live |
| 13 | [[13-Higgsfield-ViewMax]] | Agent pipeline | Live |

Top-level quick reference: [[../INTEGRATIONS]]
Credentials: `INTEGRATIONS/Credentials/` — encrypted placeholders only, never plaintext.
