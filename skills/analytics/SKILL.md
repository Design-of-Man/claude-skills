---
name: analytics
description: Pull a complete performance picture for a site — website traffic (Vercel), Google rankings (Search Console), social reach (Post Bridge), leads (portal Supabase, First Rehab Supabase, Resend) and on-page clicks (calls, emails, booking clicks) — into one report. Use whenever someone asks to "run analytics", "run my analytics", "pull the numbers", "how is the site doing", "how are we doing in search", "how did the posts do", "how many leads this month", "did the forms work", "how many calls", "pull all analytics", "monthly report", "traffic report", "did the redesign work", or names a client alongside any of traffic, rankings, reach, or leads. Also use for a single-source ask, so the traps and client IDs stay in one place.
---

# Analytics

One command, several sources. Never report from one system and imply it is the whole picture.

| Source | What it answers | Tooling |
|---|---|---|
| **Vercel Web Analytics** | Visitors, pageviews, top pages, referrers | `mcp__Vercel__get_web_analytics` |
| **Google Search Console** | Impressions, clicks, position, queries | the `search-console` skill |
| **Post Bridge** | Views, likes, comments, shares per post | `list_analytics` |
| **Leads** | The money metric. Spread across portal Supabase (`public.leads`, `lead_events`), First Rehab's `intake_leads`, and **Resend**, and different for each site and date range | `execute_sql`, `mcp__Resend__*`, see `references/leads.md` |
| **Resend** | Every form email sent since 2026-10-30 (Legacy since 10-19), whether it was delivered, and Legacy's only record of its leads | `get-email-metrics` (by domain), `list-emails` |
| **On-page clicks** | Phone taps, email clicks, booking clicks, chat leads, as Vercel custom events (mirrored to GA4) | `get_web_analytics` / `count_events`; event names per site in `references/tracking.md` |

Leads are the only source that measures the business rather than the marketing. Lead them.

## Step 1 — Resolve the client

Look the client up in `references/clients.md`. **If the request is ambiguous, ask.**
Reporting one client's numbers under another's name is the worst failure this skill has,
and it is silent — the numbers look fine.

If the client has no row, ask for the missing IDs and add the row rather than guessing.

## Step 2 — Pull the sources

Independent — issue them in parallel, in one message.

**Traffic.** `get_web_analytics` with the client's `projectId` + `teamId`.
`mode=count` for totals; `mode=aggregate` with `by=[requestPath]`, `[referrerHostname]`,
`[day]`, `[deviceType]`, or `[country]` for breakdowns.

**Search.** `gsc.py summary --property <client> --days N`, and `compare` for a period on
period read. Read `search-console` before interpreting anything.

**Social.** `list_social_accounts` **first, every time** — the IDs change on reconnect and
a cached one silently reports the wrong account. Then `list_analytics`, and
`get_analytics_daily` for per-day detail on a specific post.

**Leads.** Read `references/leads.md` first, every time. Each site's leads live in a different
place for different date ranges, and FormSubmit (most sites until 2026-10-28) kept no copy
anywhere we can query. Take each site's sources for the requested window from that file,
and **always** include Resend:

- `mcp__Resend__get-email-metrics` with `dimensions:["domain"]` for the window. Sent,
  delivered, bounced per site. A bounced *office* notification is an incident; report it
  first.
- `mcp__Resend__list-emails` to count office notifications, excluding confirmations, tests,
  RECOVERED re-sends and spam (rules in `leads.md`). For Legacy this is the lead count.
- Portal `public.leads`: **counts only**, never row contents. First Rehab's `intake_leads`:

```sql
select count(*) from intake_leads
where coalesce(status,'new') <> 'test'
  and created_at >= now() - interval '30 days';
```

Same for `job_applications`. See `references/traps.md` before writing any query.

**Clicks.** Pull each site's call, email, booking and chat events from Vercel using the
names in `references/tracking.md`. They differ by site. Calls and form leads are separate
lines; never add them together and call it "leads" without saying so.

## Step 3 — Report

Structure, in this order:

1. **Headline** — leads first, then traffic, then search, then social. One line each.
2. **Per source** — the detail, with the window stated in actual dates.
3. **What changed and why** — tie movement to something that shipped, with a date. If
   nothing correlates, say the cause is unclear.
4. **One recommendation**, with a named target.

For anything monthly or client-facing, offer an artifact dashboard. Load `dataviz`
**before** writing any chart code.

## Degrade, never fail

A missing connector or an unconfigured client produces a **partial report that names the
gap** — never a failed run and never a silent omission.

> Traffic, social and leads below. Search Console is unavailable this session
> (`GSC_SERVICE_ACCOUNT_JSON` not set), so rankings are not included.

If Post Bridge tools are missing entirely, that is the **per-chat connector toggle**, not
an outage. Say so immediately instead of retrying — this exact confusion cost hours on
2026-08-05/06. Connector changes only take effect in a NEW conversation.

## Non-negotiables

- **Never mix a partial current month into a month-over-month comparison.** Compare full
  periods, or say explicitly that the current one is partial and N days in.
- **Exclude `status='test'` from every lead and application count**, and TEST / `nicholasbkashuba+` / RECOVERED emails from every Resend count.
- **For any window before 2026-10-30, say which lead sources exist for it** (`references/leads.md`). A FormSubmit-era gap is missing data, not zero leads.
- **Vercel data starts on the day analytics was enabled per client** — an earlier window
  is *missing data*, not zero traffic. Never report it as a decline.
- **Rising average search position is worse.** Say direction in words.
- Impressions up with CTR down is the normal shape when new pages start ranking. Explain
  it rather than reporting it as a CTR problem.
- Do not invent causes for movement.
- State every window as real dates. "Last 30 days" is not a window.

Full detail and the incidents behind each rule: `references/traps.md`.
