---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# Supabase — Backend Database for Client Sites

Supabase is the database behind the client marketing sites. Contact forms, lead capture,
applications, and any structured content that should not be hard-coded into the Next.js
build all land here.

**Layer**: Client-site infrastructure
**Status**: Live
**Paired with**: [[02-Vercel]] (hosting + environment variables)

---

## What It Holds

| Data | Why it is in a database and not in the repo |
|---|---|
| **Form submissions / leads** | Written at runtime by real visitors — the entire point of the site |
| **Applications / intake** | Same, with more fields and more sensitivity |
| **Structured content** (services, locations, staff, FAQs) | Changes without a rebuild; lets a client-facing update happen without a deploy |

Lead counts from here are one of the four inputs to a client performance report, alongside
Vercel traffic, Search Console rankings, and Post Bridge reach. It is also the only one of
the four that measures **business outcome** rather than activity — traffic is interesting,
leads are the thing the client is paying for.

---

## Architecture per Client Site

```
visitor submits form
   ↓
Next.js route on Vercel
   ↓  (publishable/anon key, RLS enforced)
Supabase table (leads / applications)
   ↓
notification  →  client + #site-updates
   ↓
periodic read  →  client report / [[../DASHBOARD/03-Client-Health]]
```

One project per client where the data is meaningfully separate — which for lead data it
always is. Sharing a Supabase project across clients means one misconfigured policy exposes
several clients at once.

---

## Security Rules

These are not optional, because this table holds real people's names, phone numbers, and in
the healthcare-adjacent client work, information about why they are contacting a clinic.

1. **Row Level Security on, always.** A table without RLS and a public anon key is a public
   table. Insert-only policies for form endpoints: the site can write a lead, it cannot read
   anyone else's.
2. **Publishable/anon key in the browser. Service-role key never.** The service-role key
   bypasses RLS entirely; in a `NEXT_PUBLIC_*` variable it is a full data breach.
3. **Keys live in Vercel environment variables**, not the repo, not this vault. The vault
   records that a variable exists and what it is for.
4. **Run the advisors check** (security and performance) after any schema change. Missing RLS
   is the finding it exists to catch.
5. **Migrations, not console edits.** A schema change made by hand in the dashboard is a
   change nobody can reproduce or review.
6. **Minimum fields.** Do not collect what the client does not need. Every extra field on a
   healthcare-adjacent intake form is extra liability for the client.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| **Site up, form silently failing** | Supabase outage, RLS policy change, or expired/rotated key | The dangerous one — see below |
| Leads stop appearing in reports | Same as above, discovered late | Check submission timestamps for a gap; a clean cutoff date points at a config change, a ragged one at intermittent failure |
| Form works but no notification | Notification path broken, not the database | Check the row exists first — if it does, the lead is safe and only the alert failed |
| Exposed data | Missing RLS or a leaked service-role key | Rotate the key immediately, enable RLS, review what was reachable, tell the client |

### The silent-failure problem

This is the worst failure in the whole stack, and it is worth being explicit about why: the
site is **up**, the page **looks fine**, the form **appears to submit**, and leads quietly go
nowhere. Nobody notices until a client asks why the phone stopped ringing — by which point
the leads are gone, not delayed.

Two mitigations, both required per site:

- **Forms fail loudly.** If the write fails, the visitor sees a real error and a fallback
  (phone number or mailto), never a success message. A form that lies about succeeding
  loses the lead twice: once from the database, once from the visitor who thinks they have
  been contacted.
- **Monitor for silence.** A client site that normally gets leads and has had zero for a week
  is an alert, not a slow week. The Site Maintenance Agent watches for that gap.

---

## Related

- [[02-Vercel]] — hosting and environment variables
- [[../AGENTS/05-Site-Maintenance-Agent]] — monitors submission health
- [[../AGENTS/07-Client-Reporting-Agent]] — reads lead counts
- [[../DASHBOARD/03-Client-Health]]
- [[00-Integration-Overview]]
