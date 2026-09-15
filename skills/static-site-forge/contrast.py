#!/usr/bin/env python3
"""Measure real contrast for text sitting over photography, video or artwork.

axe can only judge text against a solid computed background. Over an image it
either skips the check or guesses. This answers the question empirically: hide
the text, photograph the box it occupied, take the **lightest** pixel as the
worst case for light text (darkest for dark text), and compute the WCAG ratio.

  python3 contrast.py --url http://127.0.0.1:8777/index.html \\
                      --behind ".hero h1,.hero-sub" --fg "#FFFFFF,#C9BDB0"
  python3 contrast.py --url ... --behind ".hero h1" --dark-text

Exits non-zero if any pair falls under the threshold (4.5 default, --large 3.0).
"""
import argparse, asyncio, glob, sys

FREEZE = ("*,*::before,*::after{animation-play-state:paused!important}"
          ".reveal,[data-reveal]{opacity:1!important;transform:none!important;transition:none!important}")


def _lin(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = (_lin(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def parse_hex(h):
    h = h.strip().lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


async def run(args):
    try:
        from playwright.async_api import async_playwright
        from PIL import Image
    except ImportError as e:
        print("needs playwright and pillow (%s)" % e); return 1

    sels = [s.strip() for s in args.behind.split(",") if s.strip()]
    fgs = [parse_hex(c) for c in args.fg.split(",")] if args.fg else None
    exes = sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome"))
    worst_ratio, failures = None, 0

    async with async_playwright() as p:
        launch = {"args": ["--no-sandbox"]}
        if exes:
            launch["executable_path"] = exes[-1]
        b = await p.chromium.launch(**launch)
        ctx = await b.new_context(viewport={"width": args.width, "height": args.height})
        pg = await ctx.new_page()
        await pg.goto(args.url, wait_until="networkidle")
        await pg.wait_for_timeout(args.settle)
        await pg.add_style_tag(content=FREEZE)

        for i, sel in enumerate(sels):
            box = await pg.evaluate("""(s)=>{const e=document.querySelector(s);
                if(!e) return null; const r=e.getBoundingClientRect();
                return {x:r.x,y:r.y,width:r.width,height:r.height};}""", sel)
            if not box or box["width"] < 1 or box["height"] < 1:
                print("  %-28s not found / zero-size" % sel); continue
            # sampling the colour the text is actually drawn in beats guessing
            fg = fgs[i] if fgs and i < len(fgs) else parse_hex(
                await pg.evaluate("""(s)=>{const c=getComputedStyle(document.querySelector(s)).color;
                    const m=c.match(/\\d+/g); return '#'+m.slice(0,3)
                      .map(v=>(+v).toString(16).padStart(2,'0')).join('');}""", sel))

            await pg.add_style_tag(content="%s{visibility:hidden!important}" % sel)
            await pg.wait_for_timeout(120)
            shot = await pg.screenshot(clip=box)
            await pg.add_style_tag(content="%s{visibility:visible!important}" % sel)

            import io as _io
            im = Image.open(_io.BytesIO(shot)).convert("RGB")
            raw = im.tobytes()                     # getdata() is deprecated in Pillow 11+
            px = [tuple(raw[i:i + 3]) for i in range(0, len(raw), 3)]
            worst = min(px, key=luminance) if args.dark_text else max(px, key=luminance)
            r = ratio(worst, fg)
            thr = 3.0 if args.large else args.threshold
            ok = r >= thr
            if not ok:
                failures += 1
            worst_ratio = r if worst_ratio is None else min(worst_ratio, r)
            print("  %-28s fg #%02X%02X%02X  worst bg rgb%s  %6.2f:1  %s"
                  % (sel, fg[0], fg[1], fg[2], worst, r, "ok" if ok else "FAIL < %.1f" % thr))
        await b.close()

    if worst_ratio is not None:
        print("\nworst pair: %.2f:1 | %d failing" % (worst_ratio, failures))
    return 1 if failures else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", required=True)
    ap.add_argument("--behind", required=True, help="comma-separated selectors of the text")
    ap.add_argument("--fg", help="comma-separated hex colours (default: computed colour)")
    ap.add_argument("--dark-text", action="store_true", help="dark text on light imagery")
    ap.add_argument("--threshold", type=float, default=4.5)
    ap.add_argument("--large", action="store_true", help="large text, threshold 3.0")
    ap.add_argument("--width", type=int, default=1440)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--settle", type=int, default=2000)
    sys.exit(asyncio.run(run(ap.parse_args())))


if __name__ == "__main__":
    main()
