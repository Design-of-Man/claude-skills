---
name: resend-forms
description: Build or fix a client website's contact, booking, lead or RSVP form so submissions reliably reach the office AND the visitor gets an automatic confirmation email, using a zero-dependency Vercel function plus Resend instead of FormSubmit. Covers the code templates, Resend domain setup, DNS records (GoDaddy, including delegate access), the RESEND_API_KEY in Vercel, and testing. Use when someone says "replace FormSubmit", "form isn't sending", "leads aren't coming through", "add a confirmation email", "autoresponse", "auto reply to the patient", "send them a confirmation", "RSVP confirmation", "set up Resend", "add the domain to Resend", "new client contact form", "do the Resend thing for this client", or when a form needs to email both the office and the person who filled it in. Not for newsletters, bulk marketing email or SMS/texting.
---

# Resend forms

One reliable lead path per client site: the site's own `/api/lead/` endpoint emails the
office through Resend and sends the visitor a branded confirmation, from the client's
domain. Built after FormSubmit failed in production on jupiterlaser.com. It silently
dropped leads until someone clicked an activation link, took 30+ seconds per submission,
and never delivered a visitor confirmation (`references/formsubmit-traps.md`).

## Pick the mode first

| Situation | Mode | Files |
|---|---|---|
| New client, or office has no attachment to current emails | **Full**: Resend sends the office copy and the confirmation | `templates/api/lead.js` + `templates/lead-form.js` |
| Office staff are used to FormSubmit's emails, or the client chose FormSubmit | **Hybrid**: FormSubmit keeps the office copy, Resend adds only the confirmation | `templates/api/confirm.js`, called by the page after FormSubmit answers `success:"true"` |

Ask which mode only if it's unclear. Don't silently replace a FormSubmit setup the client
asked for. On jupiterlaser.com that decision is recorded in the repo's CLAUDE.md as the
client's call.

## Procedure

1. **Check the account side** (`references/setup-runbook.md`): where the domain's DNS lives,
   whether the domain is already verified in Resend (`references/clients.md`), and whether
   `RESEND_API_KEY` exists in the Vercel project (`mcp__Vercel__filter_project_envs` lists
   names only). If any piece is missing, give the human the Cowork prompts in
   `references/cowork-prompts.md` and build the code in parallel.
2. **Copy the template** into the site's `api/` and edit only its `CONFIG` block: recipients,
   sender on the verified domain, reply-to, copy, brand color, optional `.ics`. Wire the
   form with `templates/lead-form.js`, or with the site's existing handler if it already has
   one, matching that file's conventions.
3. **Test locally:** `node <skill>/scripts/test-templates.js <site>/api` runs the
   handlers against a mocked Resend with no network and no email. Then run a browser test of
   the form with the endpoint stubbed: success and confirmed, success but unconfirmed, and failure.
4. **Ship to a preview.** After the key is added, **redeploy**, because env vars only reach new
   deployments. Probe with an empty POST: `503` means no key, `400` means ready.
5. **Real test, cheapest first:** POST a confirmation straight to the endpoint for Nick's
   own Gmail, which proves delivery without emailing the office. After merge, do one live
   submission with "TEST" in the name. Check the mail with the Gmail and Outlook tools
   rather than asking.
6. **Update `references/clients.md`** in this skill and push it.

## Traps

- **Believe only `success:"true"` (a string) in the body.** FormSubmit answered HTTP 200
  `{"success":"false"}` for months while dropping every lead. Never trust the status code alone.
- **Never confirm before the office has it.** The visitor email is sent only after the office
  copy succeeded (`lead.js` orders it so; in hybrid mode the browser waits for FormSubmit). A
  failed confirmation must never turn a delivered lead into an error. Fall back to "our team
  will call you".
- **Fixed confirmation text.** Only the escaped first name and the recipient address come
  from the visitor, so the open endpoint can't relay anyone's content. `lead.js` also skips
  the confirmation when the lead is flagged as likely spam.
- **Label spam, don't block it.** The office email carries a flags line and a "[check:
  possible spam]" subject. A dropped real patient costs more than a read spam email. The
  honeypot is the one silent drop.
- **Trailing slash.** Static sites here use `trailingSlash: true`, so call `/api/lead/`.
  Without the slash the POST takes a 308 detour.
- **Zero dependencies, CommonJS.** These sites deploy with no build or install step. A
  `package.json` would add one and break the deploy model.
- **Don't add Resend's optional receiving (MX) record** on a domain whose mail runs on
  Microsoft 365 or Google. Every Resend record goes on a new name, so MX, SPF and DMARC stay
  untouched. Verify that before and after.
- **Keys:** one per client, restricted to that domain, pasted by the human. Never put a
  key in chat or in the repo. Resend shows it once.
- **Medical clients:** forms collect scheduling details only (name, phone, general topic),
  with "please don't include medical details", because neither FormSubmit nor Resend is
  covered by a BAA here.
- **Gmail files styled confirmations under Promotions.** That's normal delivery, not spam.
  Microsoft 365 (the strictest filter) delivered Abacoa's to Focused.

## When something's missing

- No Resend key yet: ship anyway. The endpoint answers 503, and the page should fall back
  to the unconfirmed message.
- No DNS access: the domain can't verify, so stop at the Cowork prompt that finds the
  account (GoDaddy delegate access). Don't guess at another provider.
- Can't run a browser: test with `scripts/test-templates.js` and an empty-POST probe, and
  say the end-to-end check is still owed.
