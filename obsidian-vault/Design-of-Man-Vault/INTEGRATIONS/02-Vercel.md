---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Vercel — Hosting, Deployments, Analytics, Runtime Monitoring

Every client site the agency builds is a Next.js app deployed on Vercel. This is the
highest-severity integration in the stack: if Vercel is unavailable, every client site is
down at once.

**Layer**: Client-site infrastructure
**Status**: Live — deep usage, not just a deploy target
**Used by**: SEO Audit Agent, Site Maintenance Agent, Client Reporting Agent, both humans

---

## What We Actually Use It For

Vercel is often treated as "the place you push to." That undersells how much of the
operating picture comes out of it. Four distinct capabilities are in active use:

| Capability | What it gives us | Who consumes it |
|---|---|---|
| **Deployments** | Git-connected builds, preview deploys per branch, promote-to-production, instant rollback | Build work, SEO Audit Agent (safe auto-deploys) |
| **Web analytics** | Traffic, page views, top pages, referrers per client site | Client Reporting Agent, monthly client reports |
| **Runtime errors** | Server-side exceptions from live sites, with stack traces | Site Maintenance Agent → `#alerts` |
| **Runtime + build logs** | Why a build failed, what a route threw at 2am | Debugging, incident triage |

The analytics and runtime-error surfaces are what make Vercel a *monitoring* integration
rather than a hosting one. A client site that is up but throwing 500s on a contact route
looks perfectly healthy from the outside; runtime errors are how that gets caught.

---

## Deployment Model

```
git branch  →  preview deployment (unique URL, safe to share with client)
     ↓ approve
production promote  →  live domain
     ↓ if wrong
rollback to previous production deployment  (seconds, not a rebuild)
```

Preview deployments are the review artifact. A client sees a preview URL, not a screenshot,
and not a staging server we have to maintain.

**Rollback is the recovery path for our own mistakes.** A bad deploy does not require a fix
forward under pressure — promote the last known-good deployment, then debug calmly. This is
the single most useful operational property of the platform and it should be the first move
in any "the site broke after we pushed" situation.

Full procedure: [[../TEMPLATES-BUILDS/06-Deployment-Checklist]]

---

## Domains

A client domain reaching a Vercel site involves three parties and it is worth being precise
about which does what:

| Step | Where it happens | Note |
|---|---|---|
| Buying the domain | Registrar — usually [[09-GoDaddy]] | Registrar-only concern |
| Pointing DNS at Vercel | Wherever DNS is hosted | The risky step |
| Attaching the domain in Vercel + issuing TLS | Vercel project settings | Certificate issuance needs DNS to resolve first |
| Redirect map from the old host | The new site's config | Where SEO is won or lost |

That whole sequence — especially a cutover from Wix or Squarespace on a live domain — has
its own runbook: [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]]. Do not improvise it.
The verification pass afterwards (crawl every old path, confirm it resolves or redirects) is
what catches the 404s, and that pass is described in [[07-Firecrawl]] including what to do
when the crawler is unavailable.

---

## Environment Variables

Client sites read Supabase credentials from Vercel environment variables — see
[[11-Supabase]]. Two rules:

1. **Publishable/anon keys only** in anything exposed to the browser (`NEXT_PUBLIC_*`).
   Service-role keys are server-side environment variables, never client-side.
2. Environment variables live in Vercel, not in the repo and not in this vault. The vault
   records *that* a variable exists and what it is for, never its value.

---

## Agent Usage

| Agent | Reads | Writes |
|---|---|---|
| SEO Audit | Deployment status, live page content | Deploys pre-approved safe changes (meta tags, schema) |
| Site Maintenance | Runtime errors, runtime logs, deployment state | Nothing — reports to `#site-updates` / `#alerts` |
| Client Reporting | Web analytics per project | Nothing |

Agents do not promote to production on their own outside the SEO Agent's explicitly
pre-approved change classes. Anything touching layout, copy, or routing goes through a human
in `#site-updates`.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| All client sites down at once | Vercel platform incident | Check Vercel status. There is no fallback host. Notify affected clients proactively — being the one who tells them beats them telling us. |
| One site down after a push | Bad deploy | Roll back to previous production deployment first, debug second |
| Build fails | Dependency, env var, or type error | Pull build logs; the failure is almost always in the last commit's diff |
| Site up, contact form silently failing | Not Vercel — check [[11-Supabase]] | Runtime errors will usually show it |
| Domain resolves to the old host | DNS propagation or wrong record | [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] |
| TLS certificate not issuing | Domain not resolving to Vercel yet | Fix DNS; the certificate follows |

---

## Related

- [[../TEMPLATES-BUILDS/06-Deployment-Checklist]] — the ship procedure
- [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] — the cutover runbook
- [[11-Supabase]] — the database behind the sites
- [[09-GoDaddy]] — where the domains are bought
- [[../AGENTS/05-Site-Maintenance-Agent]]
- [[00-Integration-Overview]]
