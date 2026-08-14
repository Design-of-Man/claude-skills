# Setup — done once, ever

Steps 1–3 create the service account. **They happen one time across the whole agency.**
Every client after that is step 4 alone.

If a service account already exists, skip to [Adding a client](#adding-a-client).

---

## Step 1 — Create a Google Cloud project

<https://console.cloud.google.com/projectcreate> — name it something like `seo-reporting`.

No billing account is required; the Search Console API is free. If Cloud Console pushes a
$300 free-trial banner, **dismiss it** — starting a trial is an unnecessary card on file.

## Step 2 — Enable the Search Console API

<https://console.cloud.google.com/apis/library/searchconsole.googleapis.com>

Confirm the new project is selected in the top bar before clicking **Enable**. Landing on
the wrong project here is the most common slip, and it surfaces much later as a confusing
`invalid_client` error at query time.

## Step 3 — Create the service account and download its key

1. <https://console.cloud.google.com/iam-admin/serviceaccounts> → **Create service account**
   - If the page says "To view this page, select a project", step 1 has not been done.
2. Name it `claude-gsc-reader`. The ID and email fill in automatically.
3. **Skip "Grant this service account access to project" — leave the role blank.** It
   needs zero project IAM roles; its access comes from Search Console, not Cloud IAM.
   Skip the "Grant users access" step too.
4. Open the account → **Keys** → **Add key** → **Create new key** → **JSON** → Create.
5. A `.json` file downloads. **This is a secret** — keep it out of every repo.
6. Copy the `client_email` from inside it. It looks like
   `claude-gsc-reader@<project>.iam.gserviceaccount.com`.

The `client_email` is safe to share. The `private_key` block in the same file is the
actual credential and must never be pasted into a chat.

## Step 4 — Grant access on the client's property

**This is the step people skip.** Without it the key authenticates perfectly, sees zero
properties, and every query returns 403.

<https://search.google.com/search-console> → select the property → **Settings** →
**Users and permissions** → **Add user** → paste the `client_email` → permission **Full**
(or **Restricted**; read-only is all the tool uses) → **Add**.

This delegates read access. The property stays owner-locked, and access is revoked by
removing the user.

> The Google account used for Cloud in steps 1–3 does **not** have to be the one that owns
> the Search Console property — access is granted by email address. But step 4 itself must
> be performed by someone with admin on that property, which for a client usually means
> the client, or an agency account already added as an owner.

## Step 5 — Make the key available

```bash
export GSC_SERVICE_ACCOUNT_JSON=/path/to/key.json
```

Or place it at `~/.config/gsc/service-account.json`, or pass `--key <path>`. The variable
may also hold the raw JSON itself, which is what a CI or routine secret wants.

To put the JSON in a single-line variable, minify it first — multi-line values need
quoting in `.env` format:

```bash
python3 -c "import json;print(json.dumps(json.load(open('key.json'))))"
```

Then set `GSC_SERVICE_ACCOUNT_JSON='<that one line>'` in single quotes.

### Claude Code cloud environments

Path: claude.ai/code → the **cloud icon showing the environment name**, in the row above
the message box → hover the environment → **settings icon**. There is no settings page or
direct URL for this selector.

Two things that bite:

- Environment variables are copied **once at session start**, so a change only affects
  sessions started afterwards. The session you are in will not see it.
- Cloud environments have **no secrets store**, and the dialog warns against credentials —
  anyone who can use the environment can read them. For a personal environment that is
  just the owner, and this key is read-only and revocable, so it is a defensible tradeoff
  for unattended reporting. It is a tradeoff, not a best practice. The private alternative
  is keeping the key on a local machine and giving up scheduled runs.

## Step 6 — Confirm

```bash
python3 gsc.py sites
```

Every readable property lists with its permission level. Whatever string it prints is the
exact `--property` value; a nickname substring also works.

---

## Adding a client

Step 4 only, with the existing `client_email`. Then:

```bash
python3 gsc.py sites          # the new property should now appear
python3 gsc.py summary --property <nickname> --days 90
```

If the new property does not appear, step 4 did not take — usually the wrong property was
selected, or the change was made on a URL-prefix property while the data lives on the
domain property.

## Revoking

Search Console → Settings → Users and permissions → remove the service account. Or delete
the key in Cloud Console → Service accounts → Keys. Either is immediate. Removing the user
revokes one client; deleting the key revokes all of them.
