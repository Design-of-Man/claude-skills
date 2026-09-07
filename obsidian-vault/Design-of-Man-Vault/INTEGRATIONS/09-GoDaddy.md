---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# GoDaddy — Domain Registrar

GoDaddy is used for **checking domain availability and buying domains**. That is the whole
scope. It is a registrar integration, not a DNS or hosting one.

**Layer**: Client-site infrastructure
**Status**: Live — registrar only
**Used for**: new client builds, brand-name exploration, agency-owned domains

---

## Scope — Read This Before Assuming More

| In scope | Out of scope |
|---|---|
| Check whether a domain is available | Pointing an existing live domain at Vercel |
| Get domain suggestions for a name or keyword | Configuring A/CNAME records for a cutover |
| Buy a domain | Managing redirects from an old host |
| Track which domains are registered where | TLS certificates |

The separation is deliberate, because these are two genuinely different risk profiles:

- **Buying a domain** is safe. Worst case, a domain goes unused. Reversible cost, no
  downtime, no client impact.
- **Moving a live domain's DNS** can take a working business site offline in front of its
  customers, and can destroy accumulated SEO if the redirect map is wrong.

Those do not belong in the same document, and the second one has its own runbook:
**[[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]]**. Every Wix → Vercel and
Squarespace → Vercel cutover follows that checklist, including the verification crawl
afterwards ([[07-Firecrawl]]).

---

## Typical Use

**New client with no domain yet:**
1. Check availability for the obvious candidates (business name, name + city, name + service).
2. Pull suggestions if the primary is taken.
3. Prefer `.com`. For a local service business, an unusual TLD costs trust for no benefit.
4. Buy it — **in the client's name where possible** (see ownership below).
5. Record the registrar, the account it sits in, and the renewal date on the client note.

**Existing client with a domain elsewhere:** nothing to do here. The domain stays where it
is; only DNS changes, per the migration checklist. Do not move a registrar and cut over DNS
in the same week — if something breaks you will not know which change caused it.

---

## Ownership — Decide It Deliberately

Who holds the domain is a business decision, not an admin detail. A client's domain is their
most valuable digital asset and the thing they are most afraid of losing.

| Option | Upside | Downside |
|---|---|---|
| **Client owns, we get access** | Clean, trust-building, no hostage dynamic. Preferred. | Depends on the client not losing their own credentials |
| **We own, transfer on request** | Faster setup, one less thing for the client to manage | Looks like leverage if a relationship ends badly; must have a written, no-friction transfer path |

Whichever applies, **record it on the client note**. "Who owns this domain" should never
require an investigation.

---

## Renewals — The Actual Risk

An outage caused by GoDaddy being down is inconvenient. An outage caused by a **domain
expiring** takes a client's business off the internet, breaks their email, and is
embarrassing in a way no incident report fixes.

- Auto-renew stays **on** for every domain in an agency account.
- Payment method expiry is the usual root cause of an expired domain, not forgetfulness —
  check the card on file, not just the renewal toggle.
- Renewal dates are recorded on client notes and reviewed quarterly.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| Cannot check or buy a domain | GoDaddy outage | Wait. Domain purchases are never urgent enough to justify a rushed registrar choice. |
| Client site down, domain resolves nowhere | Domain expired | Renew immediately; this is the highest-severity registrar failure |
| Domain bought but site not live | Expected — DNS has not been pointed yet | That is the migration checklist's job, not this integration's |
| Site still resolving to old host after cutover | DNS record or propagation | [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] |

---

## Related

- [[../TEMPLATES-BUILDS/07-Domain-Migration-Checklist]] — the DNS cutover process (separate from this)
- [[02-Vercel]] — where domains get attached and TLS is issued
- [[07-Firecrawl]] — post-cutover verification, and its fallback
- [[../CLIENTS/00-Active-Clients]] — per-client domain and renewal records
- [[00-Integration-Overview]]
