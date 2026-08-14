# Publishing

## Repo layout

```
claude-skills/
  skills/
    <skill-name>/
      SKILL.md
      references/*.md
      scripts/*
  install.sh
  .claude-plugin/marketplace.json     # optional, per-repo plugin route
  README.md
```

One directory per skill under `skills/`. The directory name must match the `name` in the
frontmatter.

## How it reaches every session

A **setup script** on the cloud environment runs before Claude starts, in every cloud
session — any repo, the mobile app, and scheduled routines:

```bash
git clone --depth 1 https://github.com/nicholasbkashuba-lab/claude-skills \
  /tmp/claude-skills 2>/dev/null \
  && mkdir -p ~/.claude/skills \
  && cp -r /tmp/claude-skills/skills/* ~/.claude/skills/ || true
```

Set at: claude.ai/code → the ☁ environment chip above the message box → hover → gear →
**Setup script**.

The trailing `|| true` is load-bearing: a repo hiccup or a network blip must never stop a
session from starting. A failed skill sync degrades to "skills missing", which is
recoverable; a failed session start is not.

Once this is in place, publishing is `git push` and nothing else.

## Publishing a skill

```bash
cd ~/claude-skills            # or wherever the clone lives
cp -r <skill-dir> skills/
git add skills/<name> && git commit -m "Add <name> skill" && git push
```

Then copy into `~/.claude/skills/<name>/` as well so it is usable in the current session
without waiting for a new one.

## Alternative — the per-repo plugin route

If the setup script is unavailable, a repo's `.claude/settings.json` can auto-install a
marketplace at session start:

```json
{
  "extraKnownMarketplaces": {
    "dom-skills": { "source": { "source": "github", "repo": "nicholasbkashuba-lab/claude-skills" } }
  },
  "enabledPlugins": { "dom-skills@dom-skills": true }
}
```

This needs `.claude-plugin/marketplace.json` in the skills repo and one entry per client
repo — more moving parts than the setup script, and it only covers repos you have
edited. Prefer the setup script; keep this as the fallback.

## Hosting

`create_repository` fails with **403 Resource not accessible by integration** — the
GitHub App only acts on repos it is already installed on, so a new repo has to be created
by hand (~30 seconds, public, no README needed) and then attached with `add_repo`.

Do not park agency-wide skills in a client repo as a permanent solution. Client repos are
public and may be handed over.

## Verifying

```bash
ls ~/.claude/skills/          # present in this session
```

The real check is a **fresh session in a different repo** — that is what proves
cross-session, cross-repo availability. A skill that only works where it was authored has
not been distributed.
