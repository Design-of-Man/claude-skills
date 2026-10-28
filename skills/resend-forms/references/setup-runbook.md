# Setup runbook: Resend on a client domain

About 15 minutes of the human's time, plus DNS propagation (minutes, occasionally an
hour). Steps 1–4 happen in a browser; Cowork can do them (prompts in
`cowork-prompts.md`), but it will pause for logins and will never paste the API key.

## 0. Find where the domain's DNS lives — before asking anyone to log in

```bash
d=example.com
curl -s "https://dns.google/resolve?name=$d&type=NS" | python3 -c "import sys,json;[print(a['data']) for a in json.load(sys.stdin).get('Answer',[])]"
curl -s "https://rdap.verisign.com/com/v1/domain/$d" | python3 -c "import sys,json;d=json.load(sys.stdin);[print([x[3] for x in e['vcardArray'][1] if x[0]=='fn']) for e in d.get('entities',[]) if 'registrar' in e.get('roles',[])]"
```

- `ns*.domaincontrol.com` = GoDaddy DNS. Anything else (Cloudflare, Vercel, Squarespace…):
  the records go there instead; same three records.
- Also note the existing MX / SPF / DMARC (`type=MX`, `type=TXT`, `_dmarc.$d`). They must be
  **unchanged** at the end. Resend's records sit on new names and touch none of them.

**Whose GoDaddy account?** Usually the client's, shared with Nick by **delegate access**.
Search Nick's Gmail for `from:godaddy.com "has given you access"` — the email names the
account owner. Path: sign in to GoDaddy **as Nick's own login** (the one tied to the
invited address) → https://account.godaddy.com/access → the client → *Access Account*. The
banner then reads "Nicholas logged in as: <client>". On Abacoa the first attempt failed
because Cowork was signed into a *different* GoDaddy account (Legacy Medical) that didn't
hold the domain — check the portfolio before concluding the domain is missing.

GoDaddy may demand a **2FA code sent to the account owner's phone** before it saves DNS
changes under delegate access. Warn the client it may text them.

## 1. Add the domain in Resend

resend.com → Domains → Add Domain → the bare domain, region **us-east-1**. One Resend
account holds every client domain (check the plan's domain limit as the list grows).

Resend now issues **"Forge"** records for new domains — not the older MX + SPF pair:

| Type | Name | Value |
|---|---|---|
| TXT | `resend._domainkey` | DKIM key (copy exactly) |
| CNAME | `rsend` | `rsend.forge.rmta.net` |
| CNAME | `send` | `send.forge.rmta.net` |

Copy whatever Resend actually shows; don't assume. Skip the optional **DMARC** record if the
domain already has `_dmarc`, and skip the optional **receiving (MX)** record — on a domain
whose mail runs on Microsoft 365 or Google it would hijack inbound mail.

Tracking (open/click) stays off; it needs a tracking subdomain and it hurts
deliverability for transactional mail.

## 2. Add the records at the DNS host

Add only. Before adding, confirm the three names are not already in use:

```bash
for n in send rsend resend._domainkey; do for t in CNAME TXT MX A; do
  curl -s "https://dns.google/resolve?name=$n.$d&type=$t" | grep -q '"Answer"' && echo "EXISTS: $n $t"
done; done
```

In GoDaddy's Name field enter only the part before the domain (`send`, not
`send.example.com`).

## 3. Verify

Resend → the domain → Verify DNS Records. Pending for a few minutes is normal; Resend
checks one record at a time. Confirm from outside too:

```bash
for q in "send CNAME" "rsend CNAME" "resend._domainkey TXT"; do set -- $q
  curl -s "https://dns.google/resolve?name=$1.$d&type=$2&cd=1" | python3 -c "import sys,json;print('$1', [a['data'][:60] for a in json.load(sys.stdin).get('Answer',[])])"; done
```

## 4. API key into Vercel

Resend → API Keys → Create: name `<site>-forms`, **Sending access**, restricted to the
domain (the domain appears in that dropdown only after it verifies; "All domains" works
as a stopgap). Resend shows the key **once** — if the dialog was closed without copying,
delete the key and make a new one.

The human pastes it into Vercel → project → Settings → Environment Variables as
`RESEND_API_KEY`, **Production + Preview** (not Development), Sensitive. Never through chat.

The key can't be read back from Vercel (`filter_project_envs` shows names, and a locked
Secret never decrypts) — confirm its presence by probing the endpoint (step 6).

## 5. Redeploy — env vars only reach NEW deployments

Adding the variable changes nothing for the running deployment. Redeploy the preview:
`mcp__Vercel__list_deployments` (branch filter) → `mcp__Vercel__create_deployment` with
`requestBody.deploymentId` of the latest one. Production picks the key up on the merge
build. Don't click Vercel's own "Redeploy" popup mid-flow if Claude Code is coordinating.

## 6. Probe without sending email

```bash
curl -s -X POST -H 'Content-Type: application/json' -d '{}' "$URL/api/lead/"
```

`503` = key missing (or not redeployed). `400` = key present, empty input rejected. `308`
= you forgot the trailing slash (`trailingSlash: true` in vercel.json). `404` = function
not deployed yet.

## 7. Test, cheapest first

1. **Confirmation only, to Nick's own Gmail** — POST a real name/email straight to the
   endpoint. Proves Resend delivery without emailing the office. Check with
   `mcp__Gmail__search_threads` `from:<sender address> newer_than:1h`.
2. **One real submission through the live form** after merge, with "TEST" in the name, to
   both a Gmail and a Microsoft 365 address if the office uses 365 (the strictest filter;
   Abacoa's confirmation landed in the 365 Focused inbox). Gmail files styled
   confirmations under **Promotions** — that's normal, not spam.

Tell the office before switching their notifications off FormSubmit: the sender changes
from submissions@formsubmit.co to the client's domain and the layout changes. If they're
attached to the old emails, use the hybrid (`templates/api/confirm.js`).
