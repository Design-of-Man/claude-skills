---
name: search-console
description: Connect a client's Google Search Console and pull real ranking data — clicks, impressions, position, top queries and pages, and honest period-over-period comparisons. Use when setting up SEO reporting for a new client, or whenever someone asks how a site is doing in Google, what it ranks for, whether traffic is up, which pages are getting impressions, or asks to "run the SEO numbers", "check Search Console", "pull GSC", "how are we doing in search", "what are we ranking for", "did the redesign work". Also use when a GSC CSV/ZIP export is handed over, since the same truncation traps apply.
---

# Search Console

Search Console has **no Claude connector** — it is not in the MCP registry, so there is
nothing to toggle on. Do not go looking for one. The supported path is the Search Console
API with a service account, which `scripts/gsc.py` speaks.

Google's API hosts are reachable from Claude Code cloud sandboxes (unlike Dropbox,
Supabase, and `*.vercel.app`), so no pg_net or Actions relay is needed.

## The one thing to understand first

**One service account serves every client.** The Cloud project, the service account, and
the key are created once, ever. Onboarding a client is a single step: paste that same
`client_email` into their Search Console users list.

So the cost is ~10 minutes for the first client and ~30 seconds for every client after.
Never walk someone through creating a second service account.

```
gsc.py sites     # every client property the key can read, at once
```

## Setup

If `gsc.py sites` errors on credentials, the key does not exist yet → walk the owner
through `references/setup.md`. It is browser work only they can do; you cannot do it for
them.

If `gsc.py sites` returns an empty list, the key is fine and **step 4 was skipped** for
that client. That is the failure mode by a wide margin — the key authenticates perfectly
and reads nothing. Say so directly rather than debugging the key.

Adding a client later:

> Search Console → select property → Settings → Users and permissions → Add user →
> paste the service account's `client_email` → Full or Restricted → Add.

## Reporting

```bash
gsc.py sites                                     # discover properties
gsc.py summary  --property <client> --days 90    # totals + device/country/query/page
gsc.py queries  --property <client> --days 90 --limit 50
gsc.py pages    --property <client> --days 90 --sort impressions
gsc.py compare  --property <client> --days 90    # vs previous, non-overlapping
gsc.py raw --dimensions query,page --days 28 --json
```

`--property` accepts a nickname (`--property abacoa`) and resolves it against the
readable properties, so nobody has to remember whether a client is a domain property
(`sc-domain:x.com`) or a URL-prefix one (`https://www.x.com/`). Those are **different
properties with different data** — if numbers look impossibly small, check which one is
being read.

Read `references/reporting.md` before interpreting any numbers. It covers the traps that
have actually produced wrong client-facing conclusions.

## Non-negotiables when reporting

- **Never read totals off a query or page table**, in the API or a CSV. GSC truncates and
  anonymises those. `summary` uses a zero-dimension row, which is the true total by
  construction. A real export showed 123 clicks in `Queries.csv` against 308 actual.
- **Never compare overlapping windows.** `compare` builds the previous window as the N
  days ending the day before the current one starts. Two "last 3 months" exports pulled
  weeks apart overlap ~80% and are not a before/after.
- **Data lags ~3 days.** Default windows end 3 days back. A window ending today mixes in
  a partial day and drags every number down.
- **Rising average position is worse, not better.** Position 8 → 18 is a decline. The
  tool marks direction, but say it in words too.
- **Impressions up + CTR down is the normal shape** when many new pages start ranking at
  page 2–3 at once. Call that out rather than reporting it as a CTR problem.
- Do not invent explanations for movement. Correlate with what actually shipped, or say
  the cause is unclear.

## Credentials

The key is a **secret**. It is read-only and revocable, but treat it like a password.

- Read from `$GSC_SERVICE_ACCOUNT_JSON` (raw JSON or a path), `--key`, or
  `~/.config/gsc/service-account.json`.
- **Never commit it.** Client repos are frequently public. Add `*service-account*.json`
  and `gsc-key*.json` to `.gitignore` in any repo where the key might land.
- Never paste the `private_key` block into a chat transcript. The `client_email` is not
  sensitive and can be shared freely.
- Claude Code cloud environments have **no secrets store** — variables there are readable
  by anyone using the environment. Putting the key in one is a deliberate tradeoff for
  unattended runs, not a best practice. Say that plainly rather than presenting it as the
  clean option.

## Dependencies

`gsc.py` signs its auth request by shelling out to `openssl` and otherwise uses only the
standard library. There is no pip step, which is what makes it safe from a scheduled
routine that starts from a fresh clone.

Do **not** "improve" it by switching to the `cryptography` package. The system copy
imports at the top level but dies with a pyo3 panic when its Rust backend loads, and that
panic subclasses `BaseException`, so it slips past ordinary error handling instead of
failing cleanly.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `no service-account credentials found` | No key configured. Setup not done. |
| Empty property list | Step 4 skipped — key is not a user on the property. |
| `account not found` | The `client_email` no longer exists; stale or deleted key. |
| `invalid_client` / `unauthorized_client` | Search Console API not enabled on the Cloud project. |
| `403` on a query | Not a user on that property, or wrong property. |
| `404` on a query | Property string does not match. Run `gsc.py sites`. |
| Numbers implausibly small | Reading the URL-prefix property when the data is on the domain property, or vice versa. |
