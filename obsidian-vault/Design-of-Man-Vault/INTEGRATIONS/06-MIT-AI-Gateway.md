---
type: integration
status: evaluated
tags: [design-of-man, integration]
updated: 2026-08-18
---

# MIT AI Gateway — Token Optimization and Provider Routing

A routing layer that sits between every agent and the model providers. Two jobs: **do not
die when a provider does**, and **do not pay for tokens we do not need to send**.

**Layer**: Agent pipeline (infrastructure)
**Status**: Evaluated — **not yet integrated**
**Source**: github.com/mit-ai-gateway/gateway
**Would be used by**: every agent, once live

---

## What It Does

- Routes API calls across 339+ providers behind one interface
- Falls back automatically when the primary provider is unavailable
- Applies RTK+Caveman prompt compression, reported at 15–95% token savings
- Selects a model per task rather than using one model for everything

---

## Why a Fallback Order Matters

The tempting read is "this is a cost tool." It is not, primarily. The reason to put a
gateway in front of the agents is that **the agents run unattended on a schedule**.

Monday 9am the Sales Outreach Agent runs. Friday 9am the SEO Audit Agent runs. If the
primary model provider is having an incident at 9:04am on a Friday, there is no human
sitting there to notice and retry — the run fails, and the failure is discovered whenever
someone next looks at `#seo-audits`. A week of SEO work silently does not happen. That is
the actual cost of not having fallback, and it is much larger than the token bill.

**Configured fallback order: Claude → DeepSeek → GPT-4.**

The ordering is a quality ranking first and a cost ranking second:

1. **Claude** — primary, because it is what the agent prompts and skills are written and
   tested against. Output shape and tone are the baseline.
2. **DeepSeek** — first fallback. Cheap enough that an unattended retry storm is not a
   billing event, and capable enough for the structured, mechanical work (scoring a scraped
   page, classifying an inbox thread, extracting meta tags) that makes up most agent calls.
3. **GPT-4** — last resort. Highest cost of the three, but a genuinely independent vendor,
   which is the point: a fallback chain whose links share infrastructure is not a fallback
   chain.

### The part that gets missed

Fallback is not free correctness. A prompt tuned on Claude does not produce identical output
on DeepSeek or GPT-4 — the tone drifts, the structure sometimes drifts, and instruction
adherence varies. So:

- **Mechanical work can fall through the chain silently.** Site scoring, classification,
  extraction, summarizing crawl output. Nobody reads the prose; only the structured result
  matters.
- **Client-facing prose should not.** A caption, an outreach email, or client report copy
  produced by a fallback provider needs to be flagged as such at the review gate, because
  the human reviewing it in Slack should know they are reading fallback output and not the
  usual voice.

The gateway should record which provider served each call, and agent output should carry
that provider tag into Slack. Without that, a quiet quality drop is invisible.

---

## What Compression Actually Trades Off

RTK+Caveman compression strips a prompt down toward content words — the "caveman" framing is
literal: articles, connectives, and politeness scaffolding come out. Savings are reported at
15–95%, and that range is not marketing vagueness, it is the honest spread. Which end you
land on depends entirely on what you are compressing:

| Input type | Realistic savings | Why |
|---|---|---|
| Long repetitive context (crawled pages, boilerplate site copy, repeated instructions) | High end | Mostly redundancy |
| Structured data already dense with content words | Low end | Little to strip |
| Short, carefully worded prompts | Low, sometimes negative value | Nothing to remove without removing meaning |

**The trade is real and it is not free.** Compression costs three things:

1. **Fidelity.** Nuance lives in the words compression removes. Hedges, qualifiers, and
   conditional phrasing are exactly the low-content-word constructions that get stripped —
   and they are exactly what carries meaning in medical, legal, and contractual language.
2. **Latency.** Compressing and decompressing is work. On a small prompt the round trip can
   cost more wall-clock time than the tokens saved are worth.
3. **Debuggability.** When a compressed prompt produces a bad answer, there is now a second
   suspect. Reproducing the failure means reproducing the compression too.

So compression is **not** a global default, despite the setup instructions suggesting
"enable compression by default." Proposed policy for our stack:

| Compress | Do not compress |
|---|---|
| Scraped page content fed into an audit | Client-facing copy — captions, emails, reports |
| Bulk classification and scoring | Anything with a medical or clinical claim ([[../CLINIC/00-Clinic-Overview]]) |
| Summarizing long crawl output | Contract, scope, or pricing language |
| Internal repeated instruction blocks | Short prompts where the saving is a rounding error |

Expected savings, treated as hypotheses to test rather than facts: SEO audit ~40%, sales
outreach ~25%, content generation ~50% (with compression on the input, not the output).
None of these are measured yet.

---

## The Risk Nobody Puts in the README

Routing every agent call through one gateway means **the gateway becomes a single point of
failure for all agents at once** — a strictly worse failure mode than the single-provider
outage it exists to solve. A provider outage costs one run; a gateway outage costs every
run, on every schedule, until someone notices.

This is not a reason to skip it. It is a reason not to go live without:

- A **direct-to-provider bypass** in every agent, tested, so `gateway unreachable` degrades
  to `call Claude directly` rather than `fail`.
- A **health check** on the gateway before the Monday and Friday runs.
- Provider attribution in output, so a silent fallback is visible at the review gate.

Once those three exist, the gateway becomes the most resilient component in the stack —
which is its whole reason for being. Until they exist, it is a new dependency with no
upside over calling Claude directly.

---

## Integration Plan

| Phase | Step | Gate |
|---|---|---|
| 1 | Stand up the gateway, configure providers (Claude, DeepSeek, GPT-4) | Runs locally |
| 2 | Set fallback order and provider attribution in responses | Attribution visible in output |
| 3 | Build and test the direct-provider bypass path | Kill the gateway; agents still complete |
| 4 | Route **one** agent through it — SEO Audit, the lowest client-visibility run | One clean Friday |
| 5 | Measure token delta on that agent, uncompressed | Real numbers replace the estimates above |
| 6 | Enable compression on inputs only, per the policy table | Compare output quality against the uncompressed baseline |
| 7 | Roll out to remaining agents | No quality regression at the review gates |

---

## Status

- [x] Evaluated
- [ ] Integrated
- [ ] Tested
- [ ] Live

Tracked in [[../SKILLS-RADAR/02-Integrated-Tools]] and
[[../BUSINESS/05-Decisions-Log]].

---

## Related

- [[00-Integration-Overview]] — resilience notes
- [[../AGENTS/00-Agent-Overview]] — the callers
- [[../SKILLS-RADAR/01-Repos-to-Evaluate]]
- [[../BUSINESS/03-Expenses]] — where token cost shows up
