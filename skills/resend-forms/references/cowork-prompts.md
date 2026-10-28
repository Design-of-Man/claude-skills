# Cowork prompts

Paste-ready prompts for Claude Cowork (browser agent) to do the account and DNS work.
Replace `example.com`, the Vercel team/project slugs, and the GoDaddy owner. Run them in
order; each pauses for the human at logins, 2FA codes, and the key paste.

Cowork will not paste API keys into Vercel even when asked — the human does that one
paste. Plan the flow around it rather than fighting it.

## 1. Resend domain + DNS records

```
Set up Resend so the example.com website can send form emails. Work in my browser.
Pause and ask me whenever you need a login, password, 2FA code, or approval. Never type,
paste, or show an API key in chat.

PART 1 — Resend
1. Go to https://resend.com and sign up or log in (pause for me).
2. Domains → Add Domain → example.com. Region: US East (N. Virginia). Keep the default
   "send" subdomain if offered.
3. Copy every DNS record Resend shows EXACTLY (type, name, value, priority). Skip the
   optional DMARC record if the domain already has one, and skip any optional
   receiving/MX record — it could take over the company's inbound email.
4. Leave open and click tracking OFF.

PART 2 — DNS (add only, change nothing else)
5. Open the DNS host for example.com (GoDaddy: https://dcc.godaddy.com/control/portfolio;
   pause for me to log in). If example.com isn't in the signed-in account, STOP and tell me
   which account you're in and which domains it holds.
6. Do NOT edit or delete any existing record (MX, root TXT/SPF, _dmarc, A, CNAME, NS).
7. Before adding, check that no record with the same names exists; if one does, STOP.
8. Add each Resend record (GoDaddy Name field = only the part before .example.com).
   TTL default / 1 hour. Save. If GoDaddy asks for a verification code, pause for me.
9. Back in Resend, click Verify DNS Records; re-check every 5 minutes for up to 30.
   Report each record's status.
```

## 2. GoDaddy delegate access (when the domain is in the client's account)

```
The domain is in <Client Name>'s GoDaddy account, shared with me by delegate access.
1. Sign out of any other GoDaddy account. Pause so I can sign in to MY GoDaddy login
   (the one tied to my own Gmail, which received the delegate invite).
2. Go to https://account.godaddy.com/access → "Accounts I Can Access" → <Client Name>
   → Access Account. The banner should read "logged in as: <Client Name>".
3. Domains → example.com → DNS → DNS Records, then continue from PART 2 step 6 above.
4. If my delegate access doesn't allow DNS changes, stop and tell me — the owner must
   raise it to "Products & Domains" or higher.
```

## 3. API key into Vercel

```
1. Resend → API Keys → Create API Key. Name: example-forms. Permission: Sending access.
   Domain: example.com (only listed once verified). Click Add and pause: I'll copy the
   key myself. Never show it in chat.
2. Open https://vercel.com/<team>/<project>/settings/environment-variables and pause for
   me to paste: Key RESEND_API_KEY, Production AND Preview (not Development), Sensitive.
3. Confirm RESEND_API_KEY is listed for Production + Preview without revealing it.
   Do NOT click Redeploy — Claude Code handles the deploy.
4. Report: Resend domain status per record, key created (name + permission), env var
   present, anything that failed.
```
