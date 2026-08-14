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
