---
type: skills-radar
tags: [design-of-man, skills-radar, watchlist]
updated: 2026-08-18
---

# Trending Tools Watchlist

Running watchlist for tooling worth tracking — GitHub trending repos, AI
tooling releases, and technique write-ups relevant to how this agency runs
its agents. This is the *radar*, not the queue: things land here first,
get triaged, and only move to [[01-Repos-to-Evaluate]] once there's a
specific reason to spend evaluation time on them.

Reviewed monthly by the Skills Radar Agent (see
[[../AGENTS/Skills-Radar-Agent]] and the `skill-scout` skill) — see
[[Monthly-Scout-Results/2026-08-scout]] for the latest run. Anything that
gets adopted moves to [[02-Integrated-Tools/00-Overview|Integrated Tools]]; anything evaluated and
passed on moves to [[03-Rejected-Tools]] with a reason.

## What belongs here

Track things in four lanes, since those map to where this agency actually
loses time or money today:

| Lane | Why it matters here |
|------|----------------------|
| Token optimization | Every agent (SEO, Sales Outreach, Copy, Design) runs on metered API calls — cheaper/faster inference is direct margin |
| Web scraping / auditing | Sales Outreach Agent and site migrations both depend on reliably crawling live sites |
| Agent memory | Obsidian vault is the memory layer today; anything that could replace or augment it needs real evaluation, not a swap on hype |
| Workflow automation | Currently no Zapier-equivalent in the stack — agents run on cron via AUTOMATIONS, evaluate anything that could reduce manual glue |

## Already Triaged

These have been evaluated and moved off the watchlist — see
[[02-Integrated-Tools/00-Overview|Integrated Tools]] for the full record on each.

| Tool | Lane | Verdict | Date | Detail |
|------|------|---------|------|--------|
| MIT AI Gateway | Token optimization | Integrated (not yet live) | 2026-08-17 | [[02-Integrated-Tools/MIT-AI-Gateway]] |
| Firecrawl | Web scraping / auditing | Integrated (Sales Outreach Agent) | 2026-08-17 | [[02-Integrated-Tools/Firecrawl]] |
| Matt Pocock's Skills | Agent code quality (adjacent lane) | Reviewed | 2026-08-17 | [[02-Integrated-Tools/Matt-Pocock-Skills]] |

## Open — Q4 2026 Evaluation List

Carried over from the trending-repo review that surfaced MIT AI Gateway,
Firecrawl, and Matt Pocock's Skills. These four are next up — see
[[01-Repos-to-Evaluate]] for the actual queue entries with owner and
status.

| Tool / Category | Lane | Why it's on the radar |
|---|---|---|
| TencentDB Agent Memory | Agent memory | Trending memory backend for agent systems — worth checking against the current Obsidian-vault-as-memory approach, not assumed to replace it |
| DeepSeek-Harness | Token optimization / model cost | Trending as a lower-cost model harness — potential fallback tier behind Claude in the MIT AI Gateway routing order |
| Workflow automation (Zapier alternatives) | Workflow automation | No Zapier-equivalent exists in the stack today; agents currently glue together via cron + Slack approvals only |
| Local LLM runners | Privacy / data handling | QBO and client financial data currently never touch a local model — worth knowing what's viable before a client asks for on-prem handling |

## How to use this list

1. New tool surfaces (GitHub trending, a session finding a real gap, a
   scout run) → add it here under the right lane.
2. When there's a concrete reason to spend time on it, promote it to
   [[01-Repos-to-Evaluate]] with a specific "why this might matter" tied
   to an actual agency need — not just "looks popular."
3. After evaluation: adopted → [[02-Integrated-Tools/00-Overview|Integrated Tools]]. Passed on →
   [[03-Rejected-Tools]] with a reason. Still unresolved → stays here,
   or rolls into next month's [[Monthly-Scout-Results/2026-08-scout|Monthly Scout Results]] entry.
