---
name: skill-forge
description: Author, publish, and install a Claude skill end to end. Use whenever a repeatable workflow should be captured — "make that a skill", "save this as a skill", "turn this into a skill", "we do this for every client", "remember how to do this", "create a skill for", "update the X skill", "add that to the skill" — or when the same multi-step process has now been explained twice. Publishing and installing are part of the job, not a follow-up: never hand over a zip and stop.
---

# Skill forge

A skill is finished when it is **installed and usable**, not when the file is written.
Handing over a zip and stopping is the failure mode this skill exists to prevent.

## Where skills live

| Location | Reaches | Who can write it |
|---|---|---|
| `~/.claude/skills/<name>/` | current session only (ephemeral) | **me, instantly** |
| `nicholasbkashuba-lab/claude-skills` repo | every future session, every repo | **me, via git push** |
| claude.ai account Skills | every surface incl. mobile & chat | **only Nick, by hand** |

The repo is the automation path. A cloud environment **setup script** clones it into
`~/.claude/skills/` before Claude starts, so a `git push` today means every session
tomorrow has the skill — no upload, no zip. See `references/publishing.md`.

**There is no API to install a skill into the claude.ai account.** `ListSkills` and
`SearchSkills` are read-only; `SuggestSkills` renders cards for catalog skills only. Never
imply otherwise. Only produce a zip if account-level install is specifically wanted.

## Procedure

1. **Write it** — `SKILL.md` plus `references/` for anything long. See the rules below.
2. **Install locally** — copy to `~/.claude/skills/<name>/` so it works in *this* session
   immediately, without waiting for a new one.
3. **Publish** — commit and push to the `claude-skills` repo.
4. **Confirm** — state that it is live and what makes it trigger. If the setup script is
   not yet configured, say that the skill is local-only until it is.

Updating an existing skill is the same loop: edit, re-copy, push.

## Writing rules

**Frontmatter is the whole trigger mechanism.** Only `name` and `description` are read
when deciding whether to load a skill — the body is invisible until then. A perfect body
behind a vague description never runs.

```yaml
---
name: kebab-case-only          # [a-z0-9-], must match the directory name
description: What it does, then WHEN to use it — with the literal phrases the user says.
---
```

- Write the description for **matching**, not for elegance. Include the actual words:
  "run analytics", "pull GSC", "how is the site doing". Third person, no "I" or "you".
- Name the *exclusions* too when a neighbouring skill could collide.
- Keep `SKILL.md` scannable. Long reference material, tables, and troubleshooting go in
  `references/`; scripts in `scripts/`. The body is loaded in full every time it fires.
- **Client-agnostic by default.** IDs, property strings, and account numbers belong in a
  registry file, never inline — a skill with one client's IDs baked in is a skill that
  quietly reports the wrong client's numbers.
- Encode **judgment**, not just steps. The valuable part is which mistakes to avoid and
  which defaults are wrong. Prefer a documented trap over a restated instruction.
- Every trap should say what actually went wrong, so it reads as a reason rather than a
  rule to be second-guessed.
- Say what to do when a dependency is missing. Degrade to a partial result that names the
  gap; never fail the whole run.

## Anti-patterns

- A description listing capabilities but no trigger phrases.
- Restating what a competent person would do anyway. Skills earn their place through the
  non-obvious.
- Hardcoded per-client values in the body.
- Writing the file and stopping — unpublished and uninstalled means it does not exist.
- Promising a claude.ai account install that cannot be automated.

`references/publishing.md` covers the repo layout, the setup script, and hosting.
