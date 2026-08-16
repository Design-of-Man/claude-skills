# claude-skills

Custom Claude skills for The Design of Man, installed into every Claude Code cloud
session automatically.

## Install

Paste into the Claude Code cloud environment **Setup script**
(claude.ai/code → ☁ environment chip → gear → Setup script):

```bash
git clone --depth 1 https://github.com/Design-of-Man/claude-skills \
  /tmp/claude-skills 2>/dev/null \
  && mkdir -p ~/.claude/skills \
  && cp -r /tmp/claude-skills/skills/* ~/.claude/skills/ || true
```

That runs before Claude starts in **every** cloud session — any repo, the mobile app, and
scheduled routines. Environments are per-account, so each team member pastes it once into
their own. After that, publishing a skill is a `git push`.

The trailing `|| true` is deliberate: a sync failure must never block a session start.
Missing skills are recoverable; a session that won't start is not.

## Skills

**Operations**

| skill | triggers on |
|---|---|
| `analytics` | "run analytics", "how is the site doing", "monthly report" — Vercel traffic + Search Console + Post Bridge + Supabase leads in one report |
| `search-console` | "pull GSC", "what are we ranking for" — connect and query any client property |
| `skill-forge` | "make that a skill" — author, publish and install skills end to end |
| `session-hygiene` | "let's work on Sundial now", "clean up my sessions" |
| `site-ingest` | "pull their site", "what do they already have" |
| `skill-scout` | "what should we be using" — find capabilities worth adding |

**Web access** — vendored from [`firecrawl/cli`](https://github.com/firecrawl/cli), see Notes

| skill | triggers on |
|---|---|
| `firecrawl` | umbrella — "search the web", "fetch this page", any external URL; routes to the rest |
| `firecrawl-search` | "search for", "find articles about" — results with full page content |
| `firecrawl-scrape` | "scrape", "grab this URL" — clean markdown, handles JS-rendered pages |
| `firecrawl-map` | "what pages are on", "find the URL for" — discover a site's URLs |
| `firecrawl-crawl` | "get all the pages", "extract everything under /docs" |
| `firecrawl-download` | "download the site", "offline copy" — save a site as local files |
| `firecrawl-agent` | "extract as JSON", "pull the pricing tiers" — schema-driven extraction |
| `firecrawl-interact` | "log in to", "fill out the form", "next page" — live browser session |
| `firecrawl-monitor` | "alert me when X changes" — scheduled checks with an AI diff judge |
| `firecrawl-parse` | "parse this PDF" — local PDF/DOCX/XLSX to markdown |

These give a cloud session real outbound web access, which it otherwise lacks — they are
what `site-ingest` and `skill-scout` want underneath them. Needs the CLI on PATH
(`npx -y firecrawl-cli@latest init -y --browser`); search, scrape and interact also work
on a rate-limited keyless tier.

**Craft**

| skill | triggers on |
|---|---|
| `top-design` | Awwwards-quality immersive web experiences |
| `refactoring-ui` | "my UI looks off" — visual hierarchy, spacing, color |
| `web-typography` | font pairing, type scale, readability |
| `ux-heuristics` | usability audits, "users are confused" |
| `web-accessibility` | WCAG 2.2 audits, screen readers, keyboard nav |
| `core-web-vitals` | LCP, INP, CLS, layout shift |
| `owasp-security` | security review, auth, input handling |

**Marketing**

| skill | triggers on |
|---|---|
| `marketing-ai-seo` | AEO/GEO — getting cited by AI search |
| `marketing-copy-editing` | editing and refreshing existing copy |
| `storybrand-messaging` | brand message, one-liner, homepage copy |
| `avoid-ai-writing` | "make this sound less like AI" |

**Thinking & media**

| skill | triggers on |
|---|---|
| `factory-floor` | startup coaching — focus, constraints, growth |
| `s4h-decision-premortem-analysis` | "what could go wrong", pre-mortem |
| `watch` | analyze a video from a link or file |
| `video-brief` | turn `/watch` output into a structured brief |

## Adding a skill

Drop it under `skills/<name>/` with a `SKILL.md` whose frontmatter `name` matches the
directory name, then push. See the `skill-forge` skill for the full conventions.

`install.sh` also works by hand from a clone, and honours `$SKILLS_REPO`.

## Notes

Some skills here are derived from public skill collections rather than written by us, and
are included for team use. Attribution belongs with their original authors.

The ten `firecrawl*` skills are vendored verbatim from
[`firecrawl/cli`](https://github.com/firecrawl/cli) (ISC, `skills/` at commit `23a0df4`,
CLI v1.20.0), with two deliberate deviations:

- `firecrawl-cli/` is renamed to `firecrawl/` so the directory matches its frontmatter
  `name`, per the convention above. Sibling cross-links were repointed to match.
- Upstream's umbrella skill claims the `firecrawl-build` and `firecrawl-workflows` skills
  are installed alongside it. They are not vendored here, so those two passages now say so
  and give the install command instead.

To re-sync, diff `skills/firecrawl*` against upstream `skills/` and re-apply those two.

Deliberately **not** in this repo: `jarvis` (a personal operating profile) and
`client-site` (client roster). Those stay in the claude.ai account, which is per-account
and not public.
