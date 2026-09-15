#!/usr/bin/env python3
"""Look at every page of a static site, every build.

Serves the directory over HTTP (never file:// — see SKILL.md), drives the
preinstalled Chromium, and reports per page per viewport:

  * axe-core violations (WCAG 2.0/2.1/2.2 A + AA)
  * uncaught JS errors
  * horizontal overflow

Optionally replays third-party feeds from captured payloads so live-data paths
are exercised with no network access, and keeps screenshots worth reading.

  python3 verify.py --root .
  python3 verify.py --root . --shots out/ --mock mocks.json

Exit code is the number of page/viewport combinations with problems, capped at
100, so it slots straight into a build script.
"""
import argparse, asyncio, glob, http.server, json, os
import socket, socketserver, sys, threading

AXE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"
VIEWS = {"desktop": (1440, 900), "phone": (390, 844), "tablet": (820, 1180)}

# Animations mid-flight make axe hallucinate contrast failures and make
# screenshots non-deterministic. Freeze everything before measuring.
FREEZE = """
  *,*::before,*::after{animation-play-state:paused!important}
  .reveal,[data-reveal]{opacity:1!important;transform:none!important;transition:none!important}
  [class*="marquee"],[class*="drift"],[class*="-row"]{animation:none!important}
"""


def serve(root):
    """Background HTTP server on a free port. Returns the base URL."""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=root, **kw)
        # a request log per asset per page buries the findings
        def log_message(self, *a, **kw): pass

    class Quiet(socketserver.ThreadingTCPServer):
        allow_reuse_address = True
        daemon_threads = True
        def handle_error(self, *a): pass

    with socket.socket() as s:
        s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]
    httpd = Quiet(("127.0.0.1", port), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return "http://127.0.0.1:%d/" % port, httpd


def load_axe(local):
    """Prefer a vendored copy; fall back to the CDN; otherwise skip the a11y pass."""
    for p in filter(None, [local, "axe.min.js", os.path.join(os.path.dirname(__file__), "axe.min.js")]):
        if os.path.exists(p):
            return open(p, encoding="utf-8").read(), p
    try:
        import urllib.request
        return urllib.request.urlopen(AXE_CDN, timeout=20).read().decode(), AXE_CDN
    except Exception as e:
        return None, "unavailable (%s)" % e


def load_mocks(path):
    """mocks.json:

    {"routes": [{"match": "**api.example.com/**", "file": "cap/feed.xml",
                 "content_type": "text/xml"}],
     "image_pool": ["cap/a.jpg", "cap/b.jpg"]}

    `image_pool` answers any request a route matched but no `file` covers —
    useful when a feed hands back dozens of artwork URLs. Each distinct URL gets
    a stable image so screenshots stay comparable between runs.
    """
    if not path:
        return {"routes": [], "image_pool": []}
    base = os.path.dirname(os.path.abspath(path))
    cfg = json.load(open(path, encoding="utf-8"))
    missing = []

    def read(rel):
        try:
            return open(os.path.join(base, rel), "rb").read()
        except OSError:
            missing.append(rel); return None

    cfg["routes"] = [r for r in cfg.get("routes", [])
                     if (r.__setitem__("_body", read(r["file"])) or r["_body"]) is not None]
    cfg["_pool"] = [b for b in (read(x) for x in cfg.get("image_pool", [])) if b]
    if missing:
        # a stale capture must not abort the whole run — name it and carry on
        print("  mocks: %d file(s) missing, ignored: %s" % (len(missing), ", ".join(missing[:5])))
    return cfg


async def run(args):
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("playwright is not installed. `pip install playwright` — the browser "
              "is already under /opt/pw-browsers, do not run `playwright install`.")
        return 1

    exes = sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome"))
    root = os.path.abspath(args.root)
    pages = args.pages.split(",") if args.pages else \
        sorted(os.path.basename(p) for p in glob.glob(os.path.join(root, "*.html")))
    if not pages:
        print("no .html files in %s" % root); return 1

    axe, axe_src = load_axe(args.axe)
    mocks = load_mocks(args.mock)
    base, httpd = serve(root)
    if args.shots:
        os.makedirs(args.shots, exist_ok=True)

    cors = {"access-control-allow-origin": "*"}
    assigned, cursor = {}, [0]          # stable image per URL across the run
    bad = 0

    print("%d pages x %s | axe: %s%s" %
          (len(pages), ",".join(args.views.split(",")), axe_src,
           " | mocks: %s" % args.mock if args.mock else ""))

    async with async_playwright() as p:
        launch = {"args": ["--no-sandbox"]}
        if exes:
            launch["executable_path"] = exes[-1]
        browser = await p.chromium.launch(**launch)

        for view in args.views.split(","):
            if view not in VIEWS:
                print("  unknown viewport %r, skipping" % view); continue
            w, h = VIEWS[view]
            ctx = await browser.new_context(viewport={"width": w, "height": h},
                                            device_scale_factor=args.scale)

            async def handle(route, req):
                url = req.url
                for r in mocks["routes"]:
                    # `url_contains` disambiguates several endpoints on one host,
                    # e.g. the now-playing feed vs the play-history feed.
                    if _match(r["match"], url) and r.get("url_contains", "") in url:
                        await route.fulfill(status=200, body=r["_body"], headers=cors,
                                            content_type=r.get("content_type", "application/octet-stream"))
                        return
                if mocks["_pool"]:
                    if url not in assigned:
                        assigned[url] = mocks["_pool"][cursor[0] % len(mocks["_pool"])]; cursor[0] += 1
                    await route.fulfill(status=200, body=assigned[url],
                                        headers=cors, content_type="image/jpeg")
                    return
                await route.abort()

            for r in mocks["routes"]:
                await ctx.route(r["match"], handle)

            for name in pages:
                pg = await ctx.new_page()
                errs = []
                pg.on("pageerror", lambda e, E=errs: E.append(str(e)))
                try:
                    await pg.goto(base + name, wait_until="domcontentloaded", timeout=30000)
                except Exception as e:
                    print("  %-8s %-34s NAV FAIL %s" % (view, name, e))
                    bad += 1; await pg.close(); continue
                await pg.wait_for_timeout(args.settle)
                await pg.add_style_tag(content=FREEZE)
                await pg.wait_for_timeout(250)

                overflow = await pg.evaluate(
                    "()=>document.documentElement.scrollWidth-document.documentElement.clientWidth")
                violations = []
                if axe:
                    await pg.add_script_tag(content=axe)
                    violations = await pg.evaluate("""async()=>{
                        const r = await axe.run(document, {runOnly:
                          ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']});
                        return r.violations.map(v => v.id + '(' + v.nodes.length + ')');}""")

                if args.shots:
                    await pg.screenshot(path=os.path.join(args.shots, "%s-%s.png" % (view, name[:-5])),
                                        full_page=args.full)
                probs = []
                if errs:      probs.append("js=%s" % errs[:2])
                if overflow > 0: probs.append("overflow=%dpx" % overflow)
                if violations:   probs.append("axe=%s" % ",".join(violations))
                if probs:
                    bad += 1
                    print("  %-8s %-34s %s" % (view, name, " | ".join(probs)))
                await pg.close()
            await ctx.close()
        await browser.close()
    httpd.shutdown()

    n = len(pages) * len(args.views.split(","))
    print("\n%d page/viewport checks - %d with problems%s"
          % (n, bad, "" if axe else "  (a11y pass SKIPPED - axe unavailable)"))
    return min(bad, 100)


def _match(pattern, url):
    """Playwright-style ** glob, good enough for host matching."""
    import fnmatch
    return fnmatch.fnmatch(url, pattern.replace("**", "*"))


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=".", help="directory of built .html files")
    ap.add_argument("--pages", help="comma-separated subset (default: every *.html)")
    ap.add_argument("--views", default="desktop,phone", help="desktop,phone,tablet")
    ap.add_argument("--shots", help="directory to write screenshots into")
    ap.add_argument("--full", action="store_true", help="full-page screenshots")
    ap.add_argument("--scale", type=int, default=1, help="device scale factor")
    ap.add_argument("--mock", help="mocks.json of captured third-party payloads")
    ap.add_argument("--axe", help="path to axe.min.js (else CDN, else skipped)")
    ap.add_argument("--settle", type=int, default=1500, help="ms to wait for live paint")
    sys.exit(asyncio.run(run(ap.parse_args())))


if __name__ == "__main__":
    main()
