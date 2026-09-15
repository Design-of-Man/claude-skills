---
name: static-site-forge
description: Build a static client site from one Python generator file as the single source of truth, and verify every page in a real browser on every build — screenshots, axe, JS errors, overflow. Use when starting or rebuilding a static site, when pages have drifted out of sync with each other, when a palette or site-wide token change is needed, or when live third-party data has to be exercised without network access. Triggers on "build the site", "new client site", "site generator", "single source of truth", "the pages don't match", "that's wrong on one page but right on another", "flip the palette", "make it light", "dark mode", "design tokens", "verify every page", "axe every page", "screenshot every page", "check it in a browser", "test the feed offline", "mock the API", "is the contrast ok". For the client delivery pipeline — scope preflight, ship check, client artifact — see client-site; this is the engineering layer beneath it. For auditing a site someone else built, see web-accessibility.
---

# Static site forge

Two practices carry a static site. Everything else is taste.

**One generator file is the only source of truth.** Every drift bug — the wrong
blurb on a host, a show linking to a station that no longer exists, a breadcrumb
reading the headline instead of the section — was two lists disagreeing. The fix
is never to reconcile them. It is to delete one.

**Look at every page in a browser, every build.** Not tests in the CI sense —
*looking*. Reasoning about CSS does not tell you the nav overflows at every
desktop width. A `scrollWidth > clientWidth` check tells you in a second.

## The loop

```bash
python3 verify.py --root .                        # all pages, desktop + phone
python3 verify.py --root . --shots out/           # keep screenshots to actually read
python3 verify.py --root . --mock mocks.json      # with live feeds replayed offline
python3 contrast.py --url http://localhost:8777/index.html \
                    --behind ".hero h1,.hero-sub"  # text over imagery
```

`verify.py` serves the directory itself and drives the preinstalled Chromium
under `/opt/pw-browsers`. It resolves the binary itself — **never run
`playwright install`**. Exit code is non-zero when anything fails, so it drops
straight into a build script.

It reports three things per page per viewport: **axe violations**, **uncaught JS
errors**, **horizontal overflow**. That combination caught every real bug on the
last build.

## Non-obvious, and expensive to rediscover

**Serve over HTTP. Never test on `file://`.** Fonts fail CORS, `fetch()` to any
origin is blocked, and the on-air engine silently renders its static default —
so the page looks fine and every dynamic path is untested. A `file://` pass is
worse than no pass, because it reads as green.

**Freeze animation before you measure.** axe blends a half-faded foreground
mid-transition and reports contrast violations that do not exist. Inject
`.reveal{opacity:1!important;transform:none!important;transition:none!important}`
plus a stop on any marquee or drift keyframe, then measure. Both scripts do this;
do the same in any ad-hoc check.

**Replay real captured payloads, not invented ones.** Interception with a
hand-written fixture tests your idea of the feed. Capture the vendor's actual
response with `curl` first — that is how you find out `<cover>` is empty on a
third of tracks, which no invented fixture would ever have said.

**Fulfilled responses need CORS headers.** Route interception that omits
`access-control-allow-origin` fails the fetch, and the page falls back to its
empty state looking entirely healthy.

**Measure contrast; do not eyeball it.** When copy sits over photography or
album art, hide the text, screenshot the box it occupied, and take the lightest
pixel as the worst case. `contrast.py` does exactly this.

See `references/traps.md` for the full catalogue — each entry says what actually
went wrong, so it reads as a reason rather than a rule.

## The generator

Content dicts at the top, template functions below, one list per concept. A
schedule change edits one dict and moves the show pages, the index, the on-air
engine and the JSON-LD together.

- **Cache-bust by content hash**, not by date or a hand-bumped version.
- **Apply cross-cutting rules centrally** — meta description clamping belongs in
  the `document()` wrapper, not at 25 call sites.
- **Assert your replacements.** When patching the generator with a script, guard
  every substitution with `assert s.count(old) == 1`. A silent no-match ships a
  function that is defined, called nowhere, and looks correct in review.

Full contract, including the token system that makes a whole-site palette flip
about twenty declarations instead of four hundred, in `references/generator.md`.

## When something is missing

Missing `playwright` pip package: `pip install playwright` is enough — the
browser is already on disk. Missing axe: `verify.py` still reports JS errors and
overflow and says the a11y pass was skipped. **Degrade to a partial result that
names the gap. Never fail the whole run.**
