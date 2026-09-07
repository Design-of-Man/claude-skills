---
type: business
tags: [design-of-man, business, pricing]
updated: 2026-08-18
---

# Pricing Model

The revenue model in [[01-Financials]] states the shape of pricing at a
high level: a one-time build fee plus a recurring monthly management
fee, with SEO and social bundled into the monthly line. This note
works out what that actually looks like as a sellable structure —
tiers, what's included at each, and how a migration job gets priced
differently from a from-scratch build. Every figure stays a `$X`
placeholder; the point of this note is the *structure*, not the
numbers.

## Two-Part Structure

| Part | Billing | Purpose |
|---|---|---|
| Build fee | One-time, due at kickoff (or split kickoff/launch) | Pays for the site itself — design, build, content migration or authoring, go-live |
| Management fee | Recurring, monthly, starts at go-live | Pays for everything that keeps the site working and improving after launch |

The build fee is a project cost. The management fee is the actual
annuity the business runs on — it's what makes "revenue per client:
$X/month" in [[01-Financials]] a recurring number rather than a
one-time one. Build fees fund capacity (see [[06-Capacity-Planning]]);
management fees fund the business.

## Build Fee: From-Scratch vs. Migration

Not every build starts from a blank repo. A meaningful share of the
pipeline is an existing site on Wix, Squarespace, GoDaddy's builder, or
similar, moving onto the agency's stack. Those two situations cost the
agency a different amount of time, so they're priced differently.

| Build Type | Relative Price | Why |
|---|---|---|
| From-scratch build | $X (baseline) | Full design pass, full copywriting/content pass, full [[../TEMPLATES-BUILDS/00-Next.js-Shell\|Next.js shell]] build-out |
| Existing-site migration (Wix/Squarespace/GoDaddy → Vercel) | $X (priced below from-scratch) | Content, imagery, and structure already exist — the work shifts from *creating* to *auditing, porting, and cutting over* |

The migration price sits below the from-scratch price because the
riskiest and most time-consuming part of a build — deciding what the
site should say and look like — is already solved by the client's
existing site. What the agency is actually selling in a migration job
is:

- A content and image audit of the existing site (what's worth
  keeping, what's dead weight)
- A rebuild of that content on the standard shell, so the client picks
  up the SEO baseline, performance, and design-system benefits of the
  new stack rather than a lift-and-shift of old code
- A DNS/domain cutover with redirect mapping, so existing search
  rankings and inbound links survive the move rather than resetting to
  zero

That last piece is enough of a distinct, repeatable skill that it's
its own reference material rather than something re-figured-out per
client — see the domain migration checklist in
[[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] if present, and
[[../AGENTS/05-Site-Maintenance-Agent]] for the ongoing monitoring that
follows a cutover.

A migration job can still price closer to a from-scratch build if the
existing site's content is thin, outdated, or off-brand enough that it
gets effectively rewritten rather than ported — the discount is for
reused work, not for the word "migration" on the invoice.

## Management Fee Tiers

The flat "revenue per client: $X/month" figure in [[01-Financials]] is
a blended average across tiers, not a single fixed price every client
pays. In practice the monthly management fee comes in tiers so the
offer can match a client's size and appetite without a full custom
quote every time.

| Tier | Site Build | SEO Baseline | Social Content | Reporting |
|---|---|---|---|---|
| **Essential** | Hosting, uptime monitoring, security/plugin-equivalent maintenance | Baseline technical SEO (metadata, sitemap, schema) maintained via [[../AGENTS/01-SEO-Audit-Agent]] | Not included | Monthly summary |
| **Growth** | Everything in Essential | Everything in Essential + ongoing on-page optimization from weekly audits | 3 posts/week via [[../AGENTS/03-Copy-Content-Agent]] and [[../AGENTS/04-Design-Graphics-Agent]], scheduled through [[../INTEGRATIONS/03-Post-Bridge]] | Weekly PDF via [[../AGENTS/07-Client-Reporting-Agent]] |
| **Pro** | Everything in Growth | Everything in Growth + priority queue on SEO opportunities found | Everything in Growth + increased posting cadence and priority content review | Everything in Growth + a quarterly strategy call |

All three tiers run through the same automation calendar
([[../AUTOMATIONS/00-Automation-Calendar]]) and the same approval gates
— the tier changes what gets produced and how often, not who reviews
it or how it ships. This is the point of the tier structure: it scales
revenue per client without scaling Nick and Cam's hands-on hours per
client, which is the constraint [[06-Capacity-Planning]] is built
around.

## What's Never Itemized Separately

Per the revenue model, SEO and social are always bundled into whichever
management tier a client is on — they are never sold or invoiced as
standalone line items. This keeps sales conversations to two numbers
(build fee, monthly fee) instead of a menu, and keeps every client's
invoice legible at a glance in
[[../INTEGRATIONS/05-QuickBooks-Online]].

## Related Notes

- [[01-Financials]] — the revenue targets this pricing structure is meant to hit
- [[03-Expenses]] — what it actually costs the agency to deliver against these tiers
- [[04-KPIs]] — conversion rate and revenue-per-client tracking against this model
- [[../TEMPLATES-BUILDS/00-Next.js-Shell]] — the technical foundation behind the build fee
- [[../CLIENTS/00-Active-Clients]] — which clients are on which tier today
