---
type: template
tags: [design-of-man, template]
updated: 2026-08-18
---

# Deployment Checklist

The go-live checklist for a new client site on Vercel — "pipeline verify,"
written down and run in order every time. This is the last gate before a
client link goes out; two failure modes have burned this specifically
(a stale branch alias showing the old site, and a preview URL still behind
Vercel SSO protection), so this list checks for both explicitly rather than
trusting that a green deploy means the client will see the right thing.

Full Vercel setup and account/team detail lives in [[../INTEGRATIONS/02-Vercel]].
If this go-live is a domain cutover from an existing host (Wix,
Squarespace, GoDaddy builder) rather than a brand-new domain, run
[[07-Domain-Migration-Checklist]] alongside this one — that checklist owns
DNS cutover evidence and old-path verification specifically.

## 1. Preflight gate

```bash
python3 _dev/preflight.py
```

Must print `READY TO DEPLOY` and exit 0. A non-zero exit blocks deployment
regardless of how minor the flagged issue looks — unreplaced `REPLACE_*`
placeholders and unset form endpoints are the two that matter most, since
either ships a site whose contact path silently goes nowhere.

## 2. Repo → Vercel project

Confirm the Vercel project's Git connection actually points at the repo
just pushed to. Repos on this roster often have more than one Vercel
project attached (stale duplicates from earlier migrations) — resolve which
project is canonical by listing teams/projects and matching on Git
connection and root directory, never by trusting the top preview link in a
PR bot comment.

- [ ] Vercel project confirmed against the correct repo
- [ ] Stale/duplicate Vercel projects for this client retired or renamed

## 3. Deployment succeeded

- [ ] Latest deployment status is `READY`
- [ ] Deployed commit SHA matches the push
- [ ] Deployed branch matches the branch pushed
- [ ] On failure: read the build log before re-pushing — don't guess and
      retry

## 4. The URL about to be sent

- [ ] **Not a stale alias** — open the URL and visually confirm the change
      is actually present, not an earlier build the alias happens to still
      resolve to
- [ ] **Not SSO-protected** — deployment protection is off for anything a
      client will open; verify in a private/incognito window where your own
      session cookie can't mask a protection wall

## 5. Domain

- [ ] Custom domain attached to the correct Vercel project
- [ ] DNS resolving (check from more than one resolver — propagation isn't
      instant or uniform)
- [ ] SSL/TLS certificate active and valid
- [ ] Both `www` and apex domain land somewhere sensible (redirect to one
      canonical form, not two live versions of the site)
- [ ] Canonical tags point at the production domain (the preflight gate
      checks this, which is why it runs first)
- [ ] Old-path redirects in place if this is a migration — see
      [[07-Domain-Migration-Checklist]]

## 6. Analytics wired

- [ ] Vercel Web Analytics + Speed Insights firing on the production URL
- [ ] Google Search Console property verified and sitemap submitted — see
      [[05-SEO-Baseline]] and [[../INTEGRATIONS/01-Google-Workspace]]

## 7. Forms tested — real submissions, not markup review

- [ ] Contact form actually submitted end-to-end; confirm it lands in
      Supabase and/or the notification email arrives
- [ ] Booking/scheduler link opens the real scheduler, not a placeholder
- [ ] Any billing/invoice or payment portal link loads, where present

A form that returns a 200 into the void looks identical to a working one
until someone actually submits it.

## 8. Performance & accessibility

- [ ] Lighthouse mobile run against the **production** URL, not the
      preview
- [ ] Core Web Vitals within the [[05-SEO-Baseline]] targets
- [ ] Tested on a real mid-range Android device if the page carries heavy
      JS/animation

## 9. Client walkthrough

- [ ] Client has the live production link (not a preview URL that will
      expire/rotate)
- [ ] Client walked through how to request content changes
- [ ] Client artifact prepared (before/after numbers, what shipped) per the
      `client-site` pipeline's Phase 4

## 10. Then

- [ ] Commit, `git push -u origin <branch>`
- [ ] Open a **draft PR**, subscribe to its activity, drive CI to green
- [ ] Add the client to `CLIENTS/00-Active-Clients.md` as Live once all of
      the above is confirmed

## Related

- [[00-Next.js-Shell]]
- [[05-SEO-Baseline]]
- [[07-Domain-Migration-Checklist]]
- [[../INTEGRATIONS/02-Vercel]]
