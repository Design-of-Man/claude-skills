# FormSubmit: what actually goes wrong

Every item below happened on a live client site (Abacoa Podiatry, jupiterlaser.com,
Aug–Oct 2026). They are why new client forms use the resend-forms template.

## The silent drop (activation)

FormSubmit accepts every submission and answers **HTTP 200 `{"success":"false"}`** until
someone clicks a one-time "Activate Form" link emailed to the primary recipient. Nobody
clicked it on jupiterlaser.com, and the site took zero leads for months while looking
like it worked. A browser that trusts the status code thanks the patient, fires a
conversion, and drops the lead — all at once. Always read the body and require the
STRING `"true"`.

Activation is bound to:

- **the address in the action URL** — changing the primary recipient re-arms it (CC
  addresses never need activation, which is why extra recipients belong on `_cc`);
- **the website** — the email is titled "Activate FormSubmit on https://<site>/". A form
  activated on a Vercel preview is NOT activated on the production domain;
- **the endpoint type, in practice** — the AJAX endpoint (`/ajax/<email>`) being active for
  a site did not stop the standard endpoint (`/<email>`) from demanding activation.

The activation link itself returned a server error once and worked on retry. FormSubmit
does not send a second activation email while one is pending — re-use the first.

## `_autoresponse` (visitor confirmation) doesn't work for AJAX forms

Their docs: autoresponse "won't work with forms that are disabled reCAPTCHA and forms that
are submitting through AJAX." Confirmed live: the AJAX RSVP reached the office, the guest
got nothing. Switching to the standard endpoint with the captcha on, activated, still
delivered **no** confirmation in testing (Gmail or Microsoft 365). Treat FormSubmit as
unable to confirm to visitors.

## Slow

Submissions routinely took **30+ seconds** to answer, AJAX and standard alike. Visitors at
an event table scanning a QR code won't wait that long.

## Captcha on the standard endpoint

Every visitor gets an "I'm not a robot" interstitial on formsubmit.co, and headless
browsers can't pass it — so a standard-endpoint flow can't be tested end to end by an
agent at all. `_next` redirects back to the site afterwards.

## Bots bypass the page

Bots POST straight to `formsubmit.co/...` without loading the site, so client-side spam
checks never run. The workable defence on FormSubmit is labelling: the page overwrites
`_subject` to "… (from website)" and sets `verified=yes`, so a bot's submission keeps the
bare subject and the office can sort by it. (A self-hosted endpoint can't be bypassed
this way — only the site calls it.)

## When FormSubmit is still the right answer

When the client explicitly wants it (Abacoa did, informed, on 2026-08-18) or the office is
attached to its emails. Then keep it for the office copy and add
`templates/api/confirm.js` for the visitor — the hybrid.
