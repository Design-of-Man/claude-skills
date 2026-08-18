---
type: skills-radar
tags: [design-of-man, skills-radar, evaluation-queue]
updated: 2026-08-18
---

# Repos to Evaluate

Running queue of specific repos/tools slated for hands-on evaluation, in
priority order. This is the working queue that sits between the broad
watchlist ([[00-Trending-Tools]]) and a decision (either
[[02-Integrated-Tools]] or [[03-Rejected-Tools]]).

Each entry needs a **specific** "why this might matter" tied to a real
agency need — not a star count or a hype signal. If a tool can't clear
that bar, it stays on [[00-Trending-Tools]] instead of landing here.

## Queue

| # | Tool | Why This Might Matter | Owner | Status |
|---|------|------------------------|-------|--------|
| 1 | TencentDB Agent Memory | Obsidian vault is currently the entire memory layer for every agent — SEO Audit, Sales Outreach, Copy/Content all read and write against it. Worth knowing whether a purpose-built agent-memory backend beats "markdown files synced via Dropbox" before the vault outgrows that model, especially once client count passes ~10 and cross-client queries get slower to do by hand. | Unassigned | Not started |
| 2 | DeepSeek-Harness | MIT AI Gateway already supports provider fallback (Claude → DeepSeek → GPT-4). DeepSeek-Harness could be the concrete implementation that slots into that fallback tier — cheaper inference for lower-stakes agent tasks (e.g. draft captions before human review) while keeping Claude as primary. | Unassigned | Not started |
| 3 | Workflow automation (Zapier alternative — candidates TBD) | There is no Zapier-equivalent anywhere in the current stack. Every cross-tool handoff (Slack alert → approval → deploy, GSC data → report PDF) is either a custom agent script or a manual step. A self-hosted or low-cost automation layer could remove some of the manual glue in AUTOMATIONS without adding a recurring SaaS bill. | Unassigned | Not started |
| 4 | Local LLM runners (candidates TBD — e.g. Ollama-class tooling) | Client financial data (QuickBooks Online — invoices, payroll, AR/AP) and other sensitive client data currently only ever goes through hosted third-party APIs. If a client ever asks "does our financial data leave your systems," the honest answer right now is yes. A local runner would let sensitive-data tasks (e.g. QBO summarization, payroll question-answering) run without that data leaving the machine — worth evaluating before it's a client-trust problem instead of a proactive answer. | Unassigned | Not started |

## Notes

- This queue was seeded 2026-08-18 from the Q4 2026 evaluation list
  identified during the trending-repos review that also produced
  [[02-Integrated-Tools/MIT-AI-Gateway]], [[02-Integrated-Tools/Firecrawl]],
  and [[02-Integrated-Tools/Matt-Pocock-Skills]].
- "Owner" and "Status" columns are here so this stays a working queue, not
  a static list — update them as evaluation actually starts.
- When an item resolves, move it to [[02-Integrated-Tools]] (adopted) or
  [[03-Rejected-Tools]] (passed on, with a reason) and remove the row
  here, or strike it through with a link to the outcome.
- Anything added directly to `claude-skills` without going through this
  queue first (see [[02-Integrated-Tools/Domain-Migration]], added
  2026-08-18 straight from a real gap found in session review) should
  still get a retroactive entry in [[02-Integrated-Tools]] so the radar
  reflects reality — the queue is a planning tool, not a gate.
