---
name: session-hygiene
description: Keep the claude.ai session list organized — roll work into a fresh session when a topic or client changes, name both ends clearly, tag them into the right group, and archive what is finished. Use when work shifts to a different client or site ("let's work on Sundial now"), when a session has gotten long or has drifted from its title, when a milestone ships, or on "start a new chat", "new session for this", "clean up my sessions", "rename this chat", "archive this". Also use before handing work off, so the next session starts with context instead of nothing.
---

# Session hygiene

One session, one topic. When the topic changes, roll it — but carry the context across,
because **a new session starts knowing nothing**.

## Routing

- **First Rehab** — the clinic's own work. Tag `first-rehab`.
- **Design of Man** — every other client site. Tag `design-of-man` + `client:<slug>`.

Naming: `<Client> — <topic>`, e.g. `Sundial — rebuild`. On retirement, append the date:
`Sundial — rebuild (archived 2026-08-14)`.

> **Grouping is best effort.** It is not confirmed that `tags` drive the sidebar groups —
> most existing sessions have no tags yet still appear under named groups. Set the tags,
> then say plainly whether placement needs a manual drag. **Never claim a session was
> moved without confirming it.**

## Before anything else: check for unfinished work

```bash
git status --porcelain && git log --oneline @{u}.. 2>/dev/null
```

Uncommitted changes or unpushed commits mean **stop and say so**. Archiving a session
whose work exists nowhere else destroys it — the container is reclaimed and the working
tree goes with it. Commit and push first, or leave the session open.

## Procedure

1. **Write the handoff brief.** This is the part that matters. A new session clones the
   repo fresh and has zero conversation history, so without this the thread is silently
   lost. Include:
   - what shipped, and what is still open
   - branch names and PR numbers
   - blockers and who they are waiting on
   - the single next action
2. **`create_session`** — title, tags, and the handoff brief as `prompt`.
   **Pass the right `source_url`.** It defaults to the *parent's* repo, so rolling from a
   First Rehab session into Sundial work without it lands in the wrong repo entirely.
3. **`set_session_title`** on the old session — append `(archived <date>)`.
4. **`set_session_tags`** — remove the group tag from the old, add it to the new.
5. **`archive_session`** on the old, only after the new one reports healthy.

## When to roll

**Roll automatically** on a client switch, or when a milestone ships and the topic moves
on. These are clean boundaries — nothing is in flight.

**Ask first** when the current session still has open threads: a PR mid-review, a
question outstanding, a subscription being watched. Rolling mid-task costs more context
than it saves, and PR subscriptions do not follow the roll — a watched PR stays attached
to the session that subscribed.

**Do not roll** for a brief tangent. Two topics in one session beats two sessions for one
topic.

**Roll on size, too — around 40–50M cumulative tokens**, or as soon as a client build has
shipped its PR, whichever comes first. Check with `list_sessions` (`mine: true`) and sum
`external_metadata.usage`.

The reason is that a session gets more expensive the longer it runs. Roughly 99% of token
spend is context being re-read, not output being generated, so cost per turn scales with
transcript length — the same work costs steadily more the later in a session it happens. One
audited session reached 171M tokens; a fresh session plus a good handoff brief would have done
the back half of that work for a fraction of it.

This is a budget, not a deadline. The "ask first when threads are open" rule above still wins
— rolling mid-task genuinely does cost more than it saves.

## Notes

- Archiving is reversible (`unarchive_session`); creation is not undoable — prefer
  archiving over abandoning.
- `list_sessions` with `mine: true` narrows to this account.
- A session with a scheduled check-in or a PR subscription still has work pending. Do not
  archive it just because the conversation looks finished.
