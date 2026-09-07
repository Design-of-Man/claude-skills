---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# API Integrations & Credentials

Top-level quick reference for every tool The Design of Man is connected to. One paragraph and
one status line each, with a link to the full note in `INTEGRATIONS/`.

> **Credentials.** Nothing on this page contains a key, and neither does anything in the
> vault. `INTEGRATIONS/Credentials/.credentials.json` holds **encrypted placeholders only** —
> a list of which integrations need secrets, with every value set to
> `[ENCRYPTED — set locally, never sync plaintext]`. Real secrets belong in a password
> manager, in Vercel environment variables, or in a local gitignored `.env`. Read
> [[INTEGRATIONS/Credentials/README-DO-NOT-SYNC-PLAINTEXT]] before adding anything to that
> folder.

For how these tools fit together as a system — which layer each belongs to, what depends on
what, and what breaks when something is down — see
[[INTEGRATIONS/00-Integration-Overview]].

---

## Quick Status Table

| # | Integration | Layer | Status |
|---|---|---|---|
| 01 | Google Workspace | Agent pipeline | Live |
| 02 | Vercel | Client-site infra | Live |
| 03 | Post Bridge | Agent pipeline | Live |
| 04 | Descript | Agent pipeline | Live |
| 05 | QuickBooks Online | Business | Live |
| 06 | MIT AI Gateway | Agent pipeline | Evaluated |
| 07 | Firecrawl | Agent pipeline | Live (documented fallback) |
| 08 | Slack | Agent pipeline | Live |
| 09 | GoDaddy | Client-site infra | Live |
| 10 | Microsoft 365 | Agent pipeline | Live |
| 11 | Supabase | Client-site infra | Live |
| 12 | Dropbox | Vault / files | Live |
| 13 | Higgsfield + ViewMax | Agent pipeline | Live |

---

## 01 — Google Workspace

Calendar, Gmail, and Drive: the default productivity layer for the agency. The calendar is
shared between Nick and Cam and is the authoritative source for
[[TEAM/04-Shared-Calendar]]; Gmail is monitored daily for client and prospect replies, with
agents drafting and humans approving anything that sends; Drive holds shared docs and client
assets. The important caveat is that Google is not universal here — at least one
client-adjacent account runs on Microsoft 365, so mail and file work always starts by
checking which platform that client is on.

**Status: Live** · Detail: [[INTEGRATIONS/01-Google-Workspace]]

---

## 02 — Vercel

Hosting and deployment for every client site, and considerably more than that in practice.
Beyond git-connected builds, preview deployments, and instant rollback, we lean on Vercel's
web analytics for client traffic reporting and its runtime error monitoring to catch live
sites that are up but throwing errors on a form route. It is the highest-severity dependency
in the stack: a Vercel incident takes every client site down at once, and there is no fallback
host. For our own bad deploys, rolling back to the previous production deployment is the first
move, not a fix-forward.

**Status: Live** · Detail: [[INTEGRATIONS/02-Vercel]]

---

## 03 — Post Bridge

Social media scheduling across every connected client account — Instagram, TikTok, LinkedIn,
Facebook, Google Business Profile and the rest — and the output target of the Wednesday
content pipeline. Captions from the Copy agent and media from the Design agent get reviewed in
`#social-posts`, uploaded, and **scheduled** (never published immediately, because the Sunday
client preview email is a second gate that only works if posts are still pending). Post-level
analytics sync back into client reporting.

**Status: Live** · Detail: [[INTEGRATIONS/03-Post-Bridge]]

---

## 04 — Descript

Podcast automation for the First Rehabilitation clinic, on an account shared with the clinic.
Recording assembly, text-based editing, filler removal, captions, publishing, and transcript
export all happen in one pass, which is what makes one recording yield an episode, a
transcript, a blog post, and a handful of short clips. Automated tidying is fine to run
unsupervised; any edit that changes what a clinician actually said gets human review before
publish.

**Status: Live** · Detail: [[INTEGRATIONS/04-Descript]] · Schedule:
[[CLINIC/02-Podcast-Schedule]]

---

## 05 — QuickBooks Online

The system of record for money: invoicing and recurring invoices for monthly site management,
payroll, AR/AP aging, and the P&L and sales-by-customer reports that feed
[[BUSINESS/01-Financials]] and the dashboard revenue tiles. Agents may read reports freely;
anything that **sends** an invoice, reminder, or payment link, and anything that writes
payroll, is a human action. Access is restricted to Nick and Cam.

**Status: Live** · Detail: [[INTEGRATIONS/05-QuickBooks-Online]]

---

## 06 — MIT AI Gateway

A routing layer in front of every agent LLM call: 339+ providers behind one interface, an
explicit fallback order (Claude → DeepSeek → GPT-4), and RTK+Caveman prompt compression
reported at 15–95% token savings. The reason to want it is not cost — it is that the agents
run unattended on a schedule, so a provider outage at 9:04 on a Friday silently kills a week
of SEO work unless something else picks the call up. The honest trade-offs are documented
rather than glossed: compression costs fidelity, latency, and debuggability, so it belongs on
scraped-page input and bulk classification, not on client-facing copy or clinical claims; and
routing everything through one gateway makes the gateway itself a single point of failure, so
it should not go live without a tested direct-to-provider bypass.

**Status: Evaluated — not yet integrated** · Detail: [[INTEGRATIONS/06-MIT-AI-Gateway]]

---

## 07 — Firecrawl

Website scraping and auditing — page inventory, copy, meta tags, link graph, broken paths —
used by the Sales Outreach Agent to make Monday's pitches specific to the prospect's actual
site, and by the SEO Audit Agent and post-migration verification. It has a real reliability
gap, and the response is documented as a first-class path rather than a footnote: when
Firecrawl is unavailable, fall back to a plain HTTP crawl that fetches each path and follows
redirects, recording final status codes. That fallback is not best-effort — during RegenOrtho
site-transfer verification on 2026-08-18 it audited 63 paths and found 8 real 404s while the
primary tool was down. A migration is never signed off unverified because the crawler was
unavailable.

**Status: Live, with documented fallback** · Detail: [[INTEGRATIONS/07-Firecrawl]]

---

## 08 — Slack

Notifications, alerts, and — more importantly — the approval surface for the entire automation
stack. Agents post to `#seo-audits`, `#client-outreach`, `#social-posts`, `#site-updates`, and
`#alerts`; humans approve in-thread, and the thread is the audit trail. If it shipped, there
should be a thread showing who approved it. Channel definitions and notification rules live in
[[COMMUNICATIONS/00-Slack-Channels]]; the integration note covers connection and failure
behaviour without duplicating them.

**Status: Live** · Detail: [[INTEGRATIONS/08-Slack]]

---

## 09 — GoDaddy

Domain registrar: checking availability, pulling suggestions, and buying domains for new
client builds. That is the entire scope — it is deliberately **not** the DNS cutover process,
which is a different risk profile (buying a domain wastes money at worst; moving a live
domain's DNS can take a working business offline) and has its own runbook in
[[TEMPLATES-BUILDS/07-Domain-Migration-Checklist]]. The real registrar risk is not outages but
expiry: keep auto-renew on and the payment method current, because an expired domain takes a
client's site and email off the internet at once.

**Status: Live (registrar only)** · Detail: [[INTEGRATIONS/09-GoDaddy]]

---

## 10 — Microsoft 365

Outlook mail and calendar plus SharePoint, running alongside Google Workspace for the
accounts that are on Microsoft rather than Google. The platform is a property of the
**account**, not the task, so every client note carries a mail-platform field and the Client
Support Agent reads it before searching. This matters because the failure is silent: checking
Gmail for a client whose mail lives in Outlook returns nothing, and "nothing" looks exactly
like "no replies today" while a real client email sits unread.

**Status: Live** · Detail: [[INTEGRATIONS/10-Microsoft-365]]

---

## 11 — Supabase

The backend database behind the client marketing sites: contact-form submissions, lead and
application capture, and the structured content (services, locations, staff, FAQs) that should
change without a rebuild. Lead counts from here are the only client metric that measures
business outcome rather than activity. Row Level Security stays on, publishable keys only in
the browser, service-role keys server-side and never in a `NEXT_PUBLIC_*` variable. The
failure mode to watch is the quiet one — site up, page fine, form silently failing — so every
site must fail loudly with a visible fallback, and a normally-productive site with zero leads
for a week is an alert, not a slow week.

**Status: Live** · Detail: [[INTEGRATIONS/11-Supabase]]

---

## 12 — Dropbox

The sync layer for this vault, plus general agency file storage and client file sharing.
Obsidian reads plain markdown from a local folder and Dropbox keeps that folder identical on
Nick's and Cam's machines — which means the vault survives Dropbox disappearing, but also
means a deletion propagates. Two practical rules carry most of the value: do not edit the same
note on two machines at once (that is how conflicted copies appear, and a conflicted copy in a
vault is a duplicate note with orphaned wikilinks that nobody notices for a week), and let
sync finish before assuming a change is live everywhere.

**Status: Live** · Detail: [[INTEGRATIONS/12-Dropbox]]

---

## 13 — Higgsfield + ViewMax

Two AI media-generation tools producing the visual half of the Wednesday content pipeline,
feeding [[INTEGRATIONS/03-Post-Bridge]] for scheduling. Higgsfield handles image generation
and asset work — upscaling, reframing, background removal, reference consistency across a set;
ViewMax handles composed short-form video with script, voiceover, and captions. Their overlap
means a single-vendor outage rarely stops a content week. Because most of the client base is
healthcare-adjacent, generated media has hard limits: no synthetic before/after or
treatment-result imagery, no AI people presented as real patients or staff, and real
photography for anything depicting the actual practice.

**Status: Live** · Detail: [[INTEGRATIONS/13-Higgsfield-ViewMax]]

---

## Related

- [[INTEGRATIONS/00-Integration-Overview]] — architecture, layers, and resilience
- [[INTEGRATIONS/Credentials/README-DO-NOT-SYNC-PLAINTEXT]] — where secrets actually belong
- [[AUTOMATIONS/00-Automation-Calendar]] — when the pipeline runs
- [[AGENTS/00-Agent-Overview]] — who consumes what
- [[BUSINESS/03-Expenses]] — what these cost
