---
name: usage-audit
description: Find out where Claude usage is actually going and what is burning it. Use on "why is my usage so high", "usage spike", "check my usage", "what's burning tokens", "am I running out", "why did I hit my limit", "audit my routines", "what's auto-firing", or whenever usage jumps without an obvious cause. Also use before assuming a scheduled routine is to blame — it usually is not.
---

# Usage audit

Two numbers decide the whole diagnosis. Get them first, in this order:

1. **Output tokens as a share of total.** If it is ~0.3%, the spend is *context being
   re-read*, not Claude thinking. Effort level is then a red herring — say so.
2. **Enabled triggers, and whether any fire into a persistent session.** This is where
   runaway burn hides.

## Trap: the burn is invisible in the session list

`list_sessions` returns **interactive sessions only**. Trigger-fired runs are excluded.

An account can have hundreds of scheduled firings per week that appear nowhere in the session
list and contribute nothing to its usage totals. A spike went unnoticed for weeks on exactly
this. **Never conclude "usage looks normal" from `list_sessions` alone** — always cross-check
`list_triggers`.

## Trap: both list calls blow the tool-result limit

`list_triggers` and `list_sessions` return 80–190KB per page. The result is spilled to a file
whose lines are too long for `Read`'s offset/limit chunking.

Parse with Python, never `Read`:

```bash
python3 -c "
import json,glob,collections
seen={}
for f in glob.glob('<tool-results-dir>/*list_triggers*'):
    for x in json.load(open(f))['data']: seen[x['id']]=x
en=[x for x in seen.values() if x.get('enabled')]
print('enabled:',len(en),'of',len(seen))
for x in en: print(' ',x['id'],x.get('cron_expression') or 'once/none','|',x['name'][:50])
"
```

Glob every saved page and key by `id` — pages overlap, and a re-poll returns updated state for
a trigger you already have.

## Trap: `has_more` stays true well past 500 records

Paginate to exhaustion using `next_cursor`. Stopping early makes the enabled-set unreliable,
which is the one thing the audit must get right.

## Procedure

1. **Triggers.** Paginate `list_triggers` fully. Group by `enabled` and `cron_expression`.
   Count entries per `persistent_session_id` — a session with dozens is a check-in chain.
   Histogram `last_fired_at` by day to find the spike date.
2. **Sessions.** `list_sessions` with `mine: true`. Sum `external_metadata.usage`
   (`cache_read_tokens`, `cache_write_tokens`, `input_tokens`, `output_tokens`). Aggregate by
   repo, by effort level, and by day.
3. **Report** the two decisive numbers, then the concentration: which repos, which sessions,
   which chains.

## Reading the result

**Output share ~0.3% → the cost is context.** Two patterns, distinguishable by session count:

- *Cold starts* — many sessions on one repo, each re-exploring the same codebase from zero.
  Fix with a committed `CLAUDE.md` per repo.
- *Context sprawl* — one session at 90M+, long enough that its own transcript is the expense.
  Fix by rolling sessions earlier; see `session-hygiene`.

**Do not recommend lowering effort levels when output share is negligible.** Reasoning lands
in output tokens. Cutting effort slows the work and saves nothing.

## Killing a check-in chain

`send_later` chains are self-perpetuating: each link is created only when the previous one
fires. Disable every *pending* one and the chain dies permanently.

- **Prefer `enabled: false` over `delete_trigger`.** Disabled Routines stay stored with their
  run history and prompts, so they can be restored with one call.
- **A trigger that already fired has already re-armed.** Re-poll `list_triggers` immediately
  after disabling and kill the replacement — one re-armed itself ten seconds after firing.
- **Confirm with a missed slot, not with the API response.** After a disabled trigger's fire
  time passes, check that it has no `last_fired_at`. That is proof; the 200 is not.

## A cron routine is usually not the culprit

Check `create_new_session_on_fire` / absence of `persistent_session_id` before blaming a
routine.

| | Fires into a fresh session | Fires into a persistent session |
|---|---|---|
| Context per fire | near zero, starts clean | the entire accumulated transcript |
| Verdict | cheap, leave it alone | this is the leak |

A daily cron spawning a fresh session costs about one sweep. An hourly check-in resuming a
week-old session reloads days of context to make two API calls. Say which kind you found
before recommending anything be switched off.
