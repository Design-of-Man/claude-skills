# On-page tracking: what each site counts, and under which name

Re-audited and fixed 2026-10-30. Merged PRs: abacoapodiatry#101, elite#66, regenortho#69,
firstrehabnpb#146, legacymed#39. Re-check this file against the code after any change
to a site's main.js / assistant / consent script.

## What loads where

| Site | Vercel Web Analytics | GA4 | Pages with no analytics |
|---|---|---|---|
| Abacoa (jupiterlaser.com) | yes, since 2026-08-20 | G-0JJYDN1063, loads for everyone | redirect stubs only |
| Elite (elitesportsmed.org) | yes, since 2026-09-12 | G-1HSFDBS6Q8, loads for everyone | the 3 PHI forms |
| RegenOrtho (regenorthopb.com) | yes, since 2026-08-25 | G-2Z542HBXHS, **after consent only** | the `/forms/` hub and its 3 forms |
| First Rehab (firstrehabnpb.com) | yes, since 2026-07-21 | G-GZKFNKSP6D, **after consent only** | `/staff/leads.html` |
| Legacy (legacymedicalpalmbeach.com) | **yes from 2026-10-30 only** (env `VERCEL_ANALYTICS=1` + enabled in the dashboard). Nothing before that date: missing data, not zero | G-TLDMHCHTY2, **after consent only** | `/contact`, `/meet-and-greet` (`track=False`) |

GA4 undercounts on the three consent-gated sites, and Google Ads conversions imported
from it undercount with it. **Vercel is the full count** on every site.

## Event names

Same name on every site for everything added on 2026-10-30. The older names were kept
where GA4 key events, Google Ads conversions or the portal depend on them.

| What happened | Abacoa | Elite | Regen | First Rehab | Legacy |
|---|---|---|---|---|---|
| Phone tap (any tel:, incl. sticky bar and chat) | `call_click` | `call_click` | `call_click` (Vercel `click_to_call` **before** 2026-10-30) | `call_tap` | `call_click` |
| Email click | `email_click` | `email_click` | `email_click` | `email_click` | `email_click` |
| Directions / map link | `directions_click` | `directions_click` | `directions_click` | `directions_click` | `directions_click` |
| Visitor opens the chat (once per page view, never an auto-invite) | `chat_open` | `chat_open` | `chat_open` | `chat_open` | `chat_open` |
| Booking / request link | `appointment_cta` | `appointment_cta` | `appointment_cta` | `book_click` | `appointment_cta` |
| Confirmed form lead | `form_submit` {form: contact / rsvp} | `form_submit` (on /thank-you/) | `form_submit` {form: contact / event} | Vercel `lead_submit`, GA4 `generate_lead` | none (form pages carry no analytics; count from Resend) |
| Confirmed chat lead | `form_submit` {form: assistant} | `form_submit` {form: assistant} | `form_submit` {form: assistant} | `lead_submit` / `generate_lead` | Vercel `form_submit` {form: assistant}, GA4 `generate_lead` |
| "Where on the page" key | `placement` | `location` | `location` | `source` (GA4 `link_source`) | `link_location` |
| Page key | `path` (new events only) | `path` | `path` | `page` (GA4 `page_path`) | `path` |

**Never add calls and leads together.** A phone tap shows intent; it isn't a lead. Report
calls, directions clicks and chat opens on their own lines next to the lead count.

## Still not tracked

- social profile clicks
- outbound links in general
- scroll depth
- form started / abandoned
- First Rehab careers and podcast forms
- Regen's grand-opening RSVP (a Google Form)

GA4 Enhanced Measurement may cover scroll and outbound clicks for GA4 visitors; that is a
GA4 Admin setting, not code.

## Fixed 2026-10-30

These matter only when you read data from before that date:

- **Elite counted one lead per tab.** `/thank-you/` used to count only the first lead in
  a browser tab. It now counts any fresh navigation.
- **Abacoa's hero call button was filed as `body`.** It now reports `hero`, and
  event-page buttons now report their own slugs.
- **Legacy's call and email clicks went to GA4 only,** for consenting visitors.
- **Legacy had no `appointment_cta`.**
