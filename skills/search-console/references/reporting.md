# Reading the numbers

Four metrics, and only two of them mean what people assume.

| Metric | Reading |
|---|---|
| **Clicks** | Visits from search. The only one that is unambiguously good when it rises. |
| **Impressions** | Times a page appeared in results. Rises when *more* pages rank, even badly. |
| **CTR** | clicks ÷ impressions. Falls mechanically when impressions grow faster than clicks. |
| **Average position** | Mean rank across impressions. **Lower is better.** Rising = decline. |

## The traps

### Totals from a truncated table

GSC anonymises and truncates the query and page tables — rare queries are dropped
entirely for privacy. Summing them undercounts, sometimes by more than half.

A real export: `Queries.csv` showed 123 clicks / 10,413 impressions. The true totals were
308 / 17,108. Reporting the first set would have understated a client's performance by
60%.

`summary` asks for a **zero-dimension row** — one row, no breakdown. Nothing to truncate,
so it is correct by construction. In a CSV export the equivalent is `Devices.csv`, never
`Queries.csv` or `Pages.csv`.

### Overlapping windows

Two exports each covering "the last 3 months", pulled a few weeks apart, share ~80% of
their days. Comparing them is comparing a period against itself and calling the remainder
a trend.

`compare` builds the previous window as the N days ending the day before the current
window starts, so they cannot overlap.

### The 3-day lag

GSC finalises data on a ~2–3 day lag. A window ending today includes partial days that
fill in later, which always reads as a dip. Default windows end 3 days back. Override
with `--end` only when deliberately matching someone else's window.

### Averaged position hides the story

Average position mixes a brand term at position 1 with fifty long-tail terms at position
40. Site-wide average position moving is usually a *mix* change — new pages entering the
index — not existing pages moving. Segment before concluding: check position for the
specific pages or queries that matter.

## The pattern that looks like failure and is not

Impressions up sharply, clicks up slightly, **CTR down, average position worse**.

This is the expected shape when a batch of new pages starts ranking at once. They enter
around page 2–3, each contributing impressions and few clicks, which dilutes CTR and
drags average position down. The old pages have not moved.

Real example — 90 days after a rebuild added location and condition pages:

```
clicks       276  ->    308   +12%
impressions 11,792 -> 17,108  +45%
CTR          2.34% ->  1.80%  -0.54pp
position      17.1 ->   18.6  worse
```

Read as: the new pages are indexed and ranking, but on page 2–3 where nobody clicks. The
work now is moving those specific pages up, not "fixing CTR". Reporting this as a decline
would be wrong; so would reporting it as a win.

To confirm, segment: are *existing* pages holding position while *new* pages sit at 20+?
`pages --sort impressions` shows which are accumulating impressions without clicks.

## Branded vs non-branded

Branded queries (the business name) convert at high CTR and mostly reflect existing
demand. Non-branded queries are the growth signal.

Split them before drawing conclusions — a site can look healthy purely on branded traffic
while ranking nowhere for the terms that would win new customers. Non-branded impressions
converting at a very low rate means page 2–3 rankings for the money terms, which is a
concrete, actionable target rather than a vague "improve SEO".

## Writing the report

- Lead with clicks. It is the only number a business owner feels.
- State direction in words. Never make someone infer that position 18.6 is worse than 17.1.
- Give both windows explicitly, with dates. "Last 90 days" is not a window.
- Attribute movement only to things that actually shipped, with dates to match. Otherwise
  say the cause is unclear — invented causation is worse than none.
- Distinguish "not indexed" from "indexed and ranking badly". Completely different fixes.
- One recommendation with a named target beats five generic ones.
