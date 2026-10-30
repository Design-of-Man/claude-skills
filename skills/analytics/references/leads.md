# Where every site's leads live, and for which dates

Leads are the number that matters, and no single system holds all of them. Each site
changed how its forms deliver at least once, and FormSubmit (used by most of them until
2026-10-28) **kept no copy anywhere we can query**. So a lead count is only right when you
take each site's sources for each period from the table below and say which ones you used.

Written 2026-10-30, after every form moved off FormSubmit. If a site's form changes again,
add a row here in the same commit.

## Sources at a glance

| Source | What it holds | How to read it |
|---|---|---|
| **Portal Supabase `public.leads`** (project `iiabylugbnmcdzqjenus`) | Every lead stored by a site's `/api/contact` or `/api/lead` through the `contact-lead` Edge Function. Keyed by `site` (the domain). | **Counts only.** It holds PHI and its grants are revoked. Use `public.form_lead_count(client_id, start, end)` or `select site, count(*) ... group by site`. Never select or report a row's contents. |
| **Portal Supabase `public.lead_events`** | Count-only lead signals: Vercel custom events ingested per site (`source = 'vercel-analytics'`), and Legacy's beacon from `api/tour.js`. No contact details. | `form_lead_count()` adds these to `public.leads`. One source per site (migration 0046), so a site is never counted twice. |
| **First Rehab Supabase `intake_leads`** (project `pclqpthqigsfteyluwqj`) | Every First Rehab chat and form lead since July 2026, whatever the email path was. Also `job_applications`, `ask_dave_questions`, `dad_jokes`. | Always `where coalesce(status,'new') <> 'test'`. |
| **Resend** (`mcp__Resend__*`, one account, all five domains) | Every email the sites send since they moved to Resend: the office notification, the patient confirmation, and RSVP confirmations. | `get-email-metrics` with `dimensions:["domain"]` for totals; `list-emails` (paginate with `before`) for the subjects. See "Counting from Resend" below. |
| **Vercel Web Analytics custom events** | `form_submit`, `call_click`, `call_tap`, `lead_submit` etc. per site. Counts with no contact details. | `get_web_analytics` / `count_events`, per project. Event names differ by site (see `tracking.md`). |
| **GA4** | Same events for consenting visitors only on the consent-gated sites (Regen, First Rehab, Legacy), all visitors on Abacoa and Elite. | Undercounts on consent-gated sites by design. Never use it as the lead total. |
| **The practice's own inbox** | The only copy of a FormSubmit lead. | Not readable from here. The hello@designofman.com Gmail connector only sees what hello@ was sent or CC'd. |

## Per site, per period

### Abacoa Podiatry (jupiterlaser.com), client `9ec28713-3aee-41d6-9dc4-7d73ab47d57b`

| Period | Form delivery | Where to count |
|---|---|---|
| before 2026-08-15 | FormSubmit, **never activated**: every submission was dropped | Nothing exists. Say so. |
| 2026-08-15 to 08-18 | `/api/contact/` → `public.leads` | `public.leads` (2 rows) |
| 2026-08-18 to 2026-10-28 | FormSubmit (the client's choice), to angela.d@ plus CC janice.j@, patricia.g@, the two doctors and nicholasbkashuba@gmail.com | **Counts**: `lead_events` site `jupiterlaser.com`, source `vercel-analytics` (from 2026-08-21, Vercel `form_submit`). **Contents**: only in those inboxes, and in Nick's Gmail, which the hello@ connector cannot read. |
| 2026-10-28 23:00 UTC to 10-30 ~15:00 UTC | FormSubmit down (Cloudflare 521) | Lost. Nothing reached anyone. |
| from 2026-10-30 | `/api/contact/` → `public.leads`, then Resend from `jupiterlaser.com` | `public.leads` site `jupiterlaser.com`; Resend for delivery. Sources: `contact-form`, `rsvp`, `assistant`. |

### Elite Sports Medicine (elitesportsmed.org), client `bcce54ca-0782-4766-a3e4-4d25e89828be`

| Period | Form delivery | Where to count |
|---|---|---|
| to 2026-10-28 | FormSubmit from `/schedule-appointment/` | Vercel `form_submit` (fires on `/thank-you/`, from 2026-09-29), GA4 `G-1HSFDBS6Q8` from 2026-10-23. Contents only in the inbox FormSubmit delivered to. |
| 2026-10-28 to 10-30 | Outage | Lost. |
| from 2026-10-30 | `/api/lead/` → `public.leads`, then Resend from `elitesportsmed.org` | `public.leads` site `elitesportsmed.org` (`contact-form`, `assistant`). |

### RegenOrtho Palm Beach (regenorthopb.com), client `42bbbf33-d822-454f-a1ba-adbb14d37414`

| Period | Form delivery | Where to count |
|---|---|---|
| to 2026-10-28 | FormSubmit (contact form and assistant), to emily@ and others | `lead_events` site `regenorthopb.com`, source `vercel-analytics` (from 2026-09-18). GA4 is consent-gated since 2026-10-26, so it undercounts. |
| 2026-10-28 to 10-30 | Outage | Lost. |
| from 2026-10-30 | `/api/lead` → `public.leads`, then Resend from `regenorthopb.com` | `public.leads` site `regenorthopb.com`. |

### First Rehabilitation (firstrehabnpb.com), client `2be2ed22-8ae3-4fe1-88c8-279a51bcd911`

| Period | Form delivery | Where to count |
|---|---|---|
| from July 2026 | The browser writes `intake_leads` directly, then emails | **`intake_leads` is complete for every period**, including the FormSubmit outage. FormSubmit (to 10-28) and Resend (from 10-30) only carried the email. Three outage leads were re-sent marked "RECOVERED" on 10-30: do not count those emails again. |

### Legacy Medical (legacymedicalpalmbeach.com), client `0a02bca4-0451-4557-b4a8-259175ca99ea`

| Period | Form delivery | Where to count |
|---|---|---|
| before 2026-10-19 | Old site (Unkind Designs) | Nothing we hold. |
| from 2026-10-19 | `/api/tour` emails through Resend (`TOUR_TO_EMAIL`). **No database copy.** | **Resend is the only record of what was sent.** Count office notifications in `list-emails` (subjects start "Website request:"). From 2026-10-30 the beacon also writes a count-only row to `lead_events` site `legacymedicalpalmbeach.com`. |

Legacy has no stored copy of a lead. If Resend's log stops going back far enough, the only
copy left is the practice's info@ inbox. On 2026-10-30, `list-emails` still returned mail
from 2026-10-19. Before relying on anything older, check how far back it actually goes.

### designofman.com (the agency's own site)

Its contact form still posts to **FormSubmit**, which is down. Nothing from that form
arrives until it moves to an endpoint we control. Its repo is not in the usual session set.

## Counting from Resend

`list-emails` returns every email sent, not just leads. To count leads:

- **Count only office notifications.** Those go to practice addresses, or to hello@ on Legacy.
- **Leave out confirmations.** Skip subjects starting "We received your request" and
  "You're registered" (patient confirmations, one per lead that left an email).
- **Leave out tests.** Skip subjects or names containing `TEST`, and anything sent to
  `nicholasbkashuba+…@gmail.com`.
- **Don't double-count re-sends.** Skip subjects starting `RECOVERED`.
- **Spam.** Names like `seo blog_xxxx` or random strings are spam, and so is a
  confirmation that **bounced**, because the visitor gave a fake address. Report those
  separately rather than as leads.
- **Delivery health.** A bounced or failed *office* notification is an incident: the
  practice did not get that lead. Report it at the top.

Resend proves an email was *sent*. `public.leads` and `intake_leads` prove a lead was
*stored*. Where both exist, use storage for the count and Resend for delivery health.

## Looking back in time

State which sources a historical number came from and what is missing. "Abacoa had N form
leads in September" is only true if you say it came from Vercel `form_submit` counts. No
copy of a FormSubmit lead exists outside the practice's inbox. Never fill a gap with an
estimate, and never report the outage window, or Abacoa before 2026-08-15, as zero
demand: nothing was recorded.
