# Client registry

IDs per client. **Never hardcode these into the skill body** — add a row here.

If a client is missing, ask for the IDs and add the row. Do not guess, and do not report
another client's numbers because theirs were unavailable.

---

## First Rehabilitation of North Palm Beach

| field | value |
|---|---|
| site | https://www.firstrehabnpb.com/ |
| repo | `nicholasbkashuba-lab/firstrehabnpb` |
| Vercel projectId | `prj_thAY1ZFoahuVCLksBfXAyjyzo1b1` |
| Vercel teamId | `team_VWA1Ar7nCeuyUifvSyeFTT1T` |
| Vercel project slug | `firstrehabnpb-zywd` |
| Analytics enabled | **2026-07-21** — no data before this date |
| GSC property | `https://www.firstrehabnpb.com/` — a **URL-prefix** property, verified 2026-08-14 |
| Supabase project | "First Rehabilitation App" |
| Lead tables | `intake_leads`, `job_applications` |
| Socials | Instagram, Facebook, YouTube, TikTok, X, Google Business, LinkedIn business |

**Search baselines** (for period comparisons):

- Old Wix site, 90d to 2026-07-19: 276 clicks / 11,792 impr / pos 17.1 / CTR 2.34%
- 3 months to 2026-08-06: 308 clicks / 17,108 impr / pos 18.6 / CTR 1.80%

Those two windows **overlap by ~80%** of their days — not a clean before/after. Use
`gsc.py compare`, which builds non-overlapping windows, for any new comparison.

First clean comparison, from the API (90d to 2026-08-11 vs the prior 90d):

| metric | previous | current | change |
|---|---|---|---|
| clicks | 249 | 314 | +26% |
| impressions | 9,186 | 18,841 | +105% |
| CTR | 2.71% | 1.67% | −1.04pp |
| avg position | 14.8 | 19.1 | worse by 4.3 |

Textbook new-pages-indexing shape. 8,878 of those impressions landed in the final 22 days.

Location pages split in two, which is where the opportunity is:

- Volume but stuck on page 3 — west-palm-beach (1,018 impr, pos 27.5),
  palm-beach-gardens (615, 25.3), palm-beach (513, 25.2)
- Nearly page 1 — juno-beach (169, pos 11.8), tequesta (83, pos 9.7)

Old Wix URLs still carry ~4,150 impressions / 74 clicks (`/about` alone outranks the new
`/about.html`). The 301s are catching it. **Do not remove those redirects.**

Notes:
- Speed Insights is deliberately OFF (usage-billed). Only Web Analytics is available.
- Post Bridge account IDs change on reconnect — `list_social_accounts` every time.
- LinkedIn personal is never posted to and is not a reporting target.

---

## Other clients

Rows to fill in on first run. Do **not** assume a client has Vercel analytics enabled,
a GSC property, or social accounts until confirmed — absent is not zero.

| client | Vercel project | Vercel team | GSC property | Supabase | socials |
|---|---|---|---|---|---|
| Abacoa Podiatry | | | | | |
| RegenOrtho | | | | | |
| RevitalIV | | | | | |
| Sundial | | | | | |
| Paradise Ventures | | | | | |
| HomeCrew | | | | | |
| Elite Sports Med | | | | | |
| IV League | | | | | |
| Jupiter Laser | | | | | |
| Legends Radio | | | | | |
| Paddy Macs | | | | | |

### Finding IDs

- **Vercel** — `mcp__Vercel__list_projects`, or read `.vercel/project.json` in the repo
  (`projectId` and `orgId`).
- **GSC** — `gsc.py sites` lists every readable property. If a client is missing, the
  service account has not been added to their property.
- **Supabase** — `mcp__Supabase__list_projects`.
- **Socials** — `list_social_accounts`. Capture the platform and handle, not just the ID,
  since IDs are unstable.

---

## All five client sites at a glance

Portal Supabase project `iiabylugbnmcdzqjenus`, table `clients`, is the live source for
these IDs. Re-read it if anything here looks stale. Vercel team for all of them:
`team_VWA1Ar7nCeuyUifvSyeFTT1T` (thedesignofman). Lead sources by date: `leads.md`.
Click events: `tracking.md`.

| Client | Site | Portal client id | Vercel project | Analytics since | GSC property | GA4 property | Resend domain |
|---|---|---|---|---|---|---|---|
| Abacoa Podiatry | jupiterlaser.com | `9ec28713-3aee-41d6-9dc4-7d73ab47d57b` | `prj_Pwe5VY8MRKXbUQSodLSJRmPSVxpe` (abacoapodiatry) | 2026-08-20 | `sc-domain:jupiterlaser.com` | 391066165 | jupiterlaser.com |
| Elite Sports Medicine | elitesportsmed.org | `bcce54ca-0782-4766-a3e4-4d25e89828be` | `prj_XaeblphUVt7QAKQAQEX1nDxbOyR7` (elite) | 2026-09-12 | `https://elitesportsmed.org/` | measurement id G-1HSFDBS6Q8 (property id not in `clients`) | elitesportsmed.org |
| RegenOrtho Palm Beach | regenorthopb.com | `42bbbf33-d822-454f-a1ba-adbb14d37414` | `prj_bRwdjB3yeI2WrZpm7qwLIAsOIV2q` (regenortho) | 2026-08-25 | `sc-domain:regenorthopb.com` | 553166520 | regenorthopb.com |
| First Rehabilitation | firstrehabnpb.com | `2be2ed22-8ae3-4fe1-88c8-279a51bcd911` | `prj_thAY1ZFoahuVCLksBfXAyjyzo1b1` (firstrehabnpb-zywd) | 2026-07-21 | `https://www.firstrehabnpb.com/` | 496300605 | firstrehabnpb.com |
| Legacy Medical | legacymedicalpalmbeach.com | `0a02bca4-0451-4557-b4a8-259175ca99ea` | `prj_dHD9ppqb39qLJJQ4ymy4ZzQL6wRL` (legacymedical) | not recorded; site live from the 2026-10-19 cutover | `sc-domain:legacymedicalpalmbeach.com` | none recorded | legacymedicalpalmbeach.com |

Search Console data for all five is snapshotted weekly into portal `gsc_snapshots` /
`gsc_query_rows` / `gsc_page_rows` / `gsc_query_page_rows` (Monday pull). Read those before
re-querying Google.

**AI-assistant searches show up in Search Console.** Queries that start `site.cdc.gov …`,
`site.heart.org …`, `site.niddk.nih.gov …`, or are long persona prompts ("i am a 55-64
year old… my main motivations…") are AI assistants and AI-visibility trackers fetching
sources. They count as impressions and almost never click. Report them separately (they
show which pages AI answers draw on, which we want). Never read their low click-through
as a title problem.
