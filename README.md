# claude-skills

Custom Claude skills for The Design of Man.

| skill | what it does |
|---|---|
| `analytics` | "run analytics" — Vercel traffic + Search Console + Post Bridge + Supabase leads in one report |
| `search-console` | Connect and query any client's Google Search Console |
| `skill-forge` | Author, publish and install skills end to end |
| `session-hygiene` | Roll, name, tag and archive claude.ai sessions |

## Install

Paste into the Claude Code cloud environment **Setup script**
(claude.ai/code → ☁ environment chip → gear → Setup script):

```bash
git clone --depth 1 https://github.com/Design-of-Man/claude-skills \
  /tmp/claude-skills 2>/dev/null \
  && mkdir -p ~/.claude/skills \
  && cp -r /tmp/claude-skills/skills/* ~/.claude/skills/ || true
```

That runs before Claude starts in **every** cloud session — any repo, mobile, and
scheduled routines. After this one-time paste, publishing a skill is `git push`.

The trailing `|| true` is deliberate: a sync failure must never block a session start.

## Adding a skill

Drop it under `skills/<name>/` with a `SKILL.md` whose frontmatter `name` matches the
directory, then push. See the `skill-forge` skill.
