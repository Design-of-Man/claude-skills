# The generator contract

One Python file emits every page plus sitemap, robots and manifest. No
framework, no build step beyond `python3 build.py`.

```
build.py
  ├── STATION / CLIENT   one dict of the facts: name, phone, address, sales contact
  ├── content lists      PROGRAMS, HOSTS, PATRONS, VENUES, EVENTS — one per concept
  ├── helpers            asset_v(), clamp_desc(), esc()
  ├── components         card(), hero(), section() — small, composable, return strings
  ├── page functions     home_page(), about_page(), … one per output file
  └── document()         the wrapper every page passes through
```

## One list per concept

The rule that matters. If the weekly schedule and the show cards read from two
different lists, they *will* diverge — not maybe, and usually somewhere nobody
looks. On the last build a host's card carried a different show's blurb, and a
programme linked to a station that had been off the air for a year. Both lists
were "right" when written.

Derive everything. A `PROGRAM_BY_SLUG` index, a `show_art_map()` for the client
side, the JSON-LD — all computed from the one list, never maintained beside it.

Where two things genuinely must agree (a schedule with no gaps and no overlaps,
a nav whose labels match the page titles), **write the check into the build** and
let it fail loudly. A schedule overlap is how an on-air engine ends up picking
arbitrarily between two shows that both claim 07:30.

## Cross-cutting rules go in `document()`

Meta description clamping, canonical URLs, the JSON-LD envelope, the asset
version query strings. Applied once in the wrapper, they cannot be forgotten at
the twenty-fifth call site.

## Cache busting by content hash

```python
def asset_v(relpath):
    try:
        with open(os.path.join(ROOT, relpath), "rb") as f:
            return hashlib.md5(f.read()).hexdigest()[:10]
    except FileNotFoundError:
        return "0"
```

Referenced as `legends.css?v=` + `asset_v(...)`. A date stamp busts caches on
builds that changed nothing; a hand-bumped version gets forgotten exactly when
it matters. The hash is the only version that is always correct.

## Tokens, and why a palette flip is cheap

Define the palette once as custom properties on `:root`. Every rule consumes
tokens, never literals.

```css
:root{
  --night:#0B0807; --ink:#141010; --cream:#F7F2E6;
  --gold:#E7C572; --line:rgba(247,242,230,.14);
}
```

Flipping the whole site from lacquer-dark to warm-light was redefining about
twenty declarations. The same change against literal colours is ~400 edits and
a guaranteed miss. **The economics are the argument**: the token system pays for
itself the first time the client changes their mind about the palette, and they
will.

### Dark islands on a light site

Re-declare the tokens in a scope rather than overriding individual properties:

```css
.lacquer,.hero,.player,.site-footer{
  --ink:#0B0807; --cream:#F7F2E6; --gold:#E7C572;
  color:var(--cream);
}
```

Everything inside inherits the dark palette with no per-component rules.

**The trap this creates:** anything styled `color:inherit` — an active nav link,
say — inherits the *body's* new ink and disappears against the island. Give any
element that spans both worlds its own palette in both states.

## Patching the generator safely

When editing `build.py` with a script rather than by hand, guard every
substitution:

```python
def sub(old, new, label):
    n = s.count(old)
    assert n == 1, "%s: found %d occurrences" % (label, n)
    s = s.replace(old, new)
```

Two silent `str.replace` no-matches once shipped a build where two functions were
defined, called nowhere, and looked completely correct in review. The page was
only caught by a browser check showing the element unstyled.

**Python's `%` operator and literal `%` in CSS:** `object-position:50% 30%` inside
a string you then `%`-format raises `unsupported format character`. Format first,
concatenate the CSS after.

## HTML entities in data

Escaped entities belong in rendered copy, not in strings that get reused as
plain text. An `&rsquo;` in an `h1` reappeared verbatim in a breadcrumb reading
"Palm Beach County&rsquo;s gateway". Use the literal character in the data and
escape at the render boundary.
