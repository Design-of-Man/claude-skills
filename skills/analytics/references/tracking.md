# On-page tracking: what each site counts, and under which name

Audited 2026-10-30 against the code and the live pages. Event names and the field that
says *where* on the page a click happened differ by site, so a cross-site rollup needs
this mapping. Re-audit after any change to a site's main.js / assistant / consent script.

## What loads where

| Site | Vercel Web Analytics | GA4 | Pages with no analytics |
|---|---|---|---|
| Abacoa (jupiterlaser.com) | yes | G-0JJYDN1063, loads for everyone | redirect stubs only |
| Elite (elitesportsmed.org) | yes | G-1HSFDBS6Q8, loads for everyone | the 3 PHI forms |
| RegenOrtho (regenorthopb.com) | yes | G-2Z542HBXHS, **after consent only** | all of `/forms/*` |
| First Rehab (firstrehabnpb.com) | yes | G-GZKFNKSP6D, **after consent only** | `/staff/leads.html` |
| Legacy (legacymedicalpalmbeach.com) | **NO**: `VERCEL_ANALYTICS` env not set on Vercel, so build.py never emits the tag | G-TLDMHCHTY2, **after consent only** | `/contact`, `/meet-and-greet` (`track=False`) |

Consequences:

- **GA4 undercounts on the three consent-gated sites.** Google Ads conversions imported
  from GA4 undercount with it.
- **Vercel is the full count**, except on Legacy, which has no full count of anything.
  Legacy leads come from Resend and its portal beacon (`leads.md`).

## Event names per site

| What happened | Abacoa | Elite | Regen | First Rehab | Legacy |
|---|---|---|---|---|---|
| Phone tap (any tel: link, incl. sticky bar and chat) | `call_click` | `call_click` | Vercel `click_to_call`, GA4 `call_click` | `call_tap` | `call_click` (GA4 only, consented) |
| Email click | not tracked | `email_click` | not tracked | not tracked | `email_click` (GA4 only) |
| Book / request appointment click | `appointment_cta` | `appointment_cta` | `appointment_cta` | `book_click` | not tracked |
| Confirmed form lead | `form_submit` {form: contact / rsvp} | `form_submit` (fires on /thank-you/) | `form_submit` | Vercel `lead_submit`, GA4 `generate_lead` | **never fires** (form pages carry no analytics) |
| Confirmed chat lead (incl. retried) | `form_submit` {form: assistant} | `form_submit` {form: assistant} | `form_submit` | `lead_submit` / `generate_lead` | `generate_lead` (GA4 only) |
| "Where on the page" field | `placement` | `location` | `location` | `source` / `link_source` | `link_location` |

## Not tracked on any site

- chat opened, so there's no chat funnel
- map / directions clicks (hundreds of links)
- social profile clicks
- outbound links
- scroll depth
- form started / abandoned
- First Rehab careers and podcast forms
- Regen's grand-opening RSVP (a Google Form)

GA4 Enhanced Measurement may add scroll and outbound clicks for GA4 visitors; that is a
GA4 Admin setting, not visible in code.

## Known quirks

- **Elite counts at most one lead per tab.** `/thank-you/` sets sessionStorage
  `esm-thankyou-counted` and never clears it, so a second real lead in the same tab is
  not counted.
- **Abacoa files its hero call button as `body`.** Its placement logic ignores
  `data-call-location="hero"`.
- **Calls and leads are separate lines in every report.** A phone tap is intent, not a
  lead. Never add the two together and call the total "leads".
