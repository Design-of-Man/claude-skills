# Traps

Each of these has produced a wrong number in a real report. They share a failure mode:
the output looks completely reasonable.

## Supabase — test rows

Test submissions are tagged `status='test'` and are indistinguishable from real leads in
a raw count. Exclude them from **every** report:

```sql
where coalesce(status,'new') <> 'test'
```

`coalesce` matters — real rows may have a null status, and `status <> 'test'` silently
drops nulls in SQL. That would undercount real leads while looking correct.

Leads are the metric the business actually cares about. Getting this wrong is worse than
getting traffic wrong.

## Vercel — the start date is not zero

Web Analytics only has data from the day it was enabled per client (First Rehab:
**2026-07-21**). Query a window starting earlier and the empty stretch reads as a traffic
collapse.

Never report a pre-enablement period as a decline. Say the data does not exist yet.

Speed Insights is deliberately off for First Rehab — do not report Core Web Vitals from
Vercel; there are none.

## Post Bridge — unstable account IDs

Account IDs change on **every reconnect**. YouTube went 81323 → 81358; Google Business
81363 → 81642. A cached ID either errors or, worse, resolves to a different account.

Always `list_social_accounts` first, in the same session you report from.

Also: `create_post` returning "processing" is not proof of publication — that is a
posting concern, but the same applies when reconciling what actually went out. Confirm
with `list_post_results`.

## Post Bridge — "the tools are missing" is a toggle

If Post Bridge tools do not exist, the connector is **switched off for this chat**. It is
connected to the account and disabled per-conversation. `ListConnectors` reports both
`connected` and `enabledInChat`.

This looked like an intermittent outage across 2026-08-05/06 and cost hours. Say it
immediately and move on. Connector changes only take effect in a **new** conversation,
not mid-chat.

## Search Console — truncated totals

GSC anonymises and truncates the query and page tables. A real export showed 123 clicks
in `Queries.csv` against 308 actual — a 60% understatement.

Totals come from a zero-dimension row only (`gsc.py summary`). In a CSV export, read
totals off `Devices.csv`, never `Queries.csv` or `Pages.csv`.

## Search Console — overlapping windows

Two "last 3 months" pulls taken weeks apart share ~80% of their days. Comparing them
compares a period against itself.

`gsc.py compare` builds the previous window as the N days ending the day before the
current one starts. Use it rather than hand-picking dates.

## Search Console — the 3-day lag

GSC finalises data on a ~2–3 day lag. A window ending today mixes in partial days that
fill in later, which always reads as a dip. Default windows end 3 days back.

## Partial periods

Never compare a partial current month against a complete previous one. Nine days into
August against all of July is a 70% drop that did not happen.

Either compare equal-length windows, or state plainly that the current period is partial
and N days in.

## Direction words

Two metrics move counterintuitively:

- **Average search position** — lower is better. 17.1 → 18.6 is a *decline*.
- **CTR** — falls mechanically when impressions grow faster than clicks, which is what
  *should* happen when new pages start ranking.

Never make the reader infer direction from a number. Say "worse" or "better".

## Attribution

Movement gets attributed to whatever shipped near it, which is usually wrong. Tie a
change to a specific dated event, or say the cause is unclear. An honest "unclear" is
more useful than a confident fabrication, because it does not trigger the wrong next move.
