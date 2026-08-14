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
| GSC property | `sc-domain:firstrehabnpb.com` *(confirm with `gsc.py sites`)* |
| Supabase project | "First Rehabilitation App" |
| Lead tables | `intake_leads`, `job_applications` |
| Socials | Instagram, Facebook, YouTube, TikTok, X, Google Business, LinkedIn business |

**Search baselines** (for period comparisons):

- Old Wix site, 90d to 2026-07-19: 276 clicks / 11,792 impr / pos 17.1 / CTR 2.34%
- 3 months to 2026-08-06: 308 clicks / 17,108 impr / pos 18.6 / CTR 1.80%

Those two windows **overlap by ~80%** of their days — not a clean before/after. Use
`gsc.py compare`, which builds non-overlapping windows, for any new comparison.

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
