# Traps

Each entry says what actually went wrong. They are reasons, not rules.

## Testing

**`file://` gives a false green.** Fonts fail CORS, `fetch()` is blocked to every
origin, and any client-side engine renders its static default — so the page looks
correct and every dynamic path is untested. `verify.py` serves over HTTP for this
reason. A `file://` pass is worse than no pass.

**axe reports phantom contrast failures during transitions.** It blends a
half-faded foreground against the background. Freeze reveal animations before
measuring or you will chase violations that do not exist.

**axe cannot judge text over an image.** It skips or guesses. Measure it —
`contrast.py` hides the text, photographs the box, and takes the lightest pixel
as the worst case.

**Intercepted responses need CORS headers.** A fulfilled route without
`access-control-allow-origin` fails the fetch, and the page falls back to its
empty state looking perfectly healthy. You will conclude the feed works.

**Invent nothing.** Capture the vendor's real response with `curl` before writing
a fixture. A hand-written fixture only tests your assumption of the shape. The
real capture is what revealed `<cover>` empty on 9 of 30 tracks — a third of the
time the artwork simply is not there, which changes the design, not the code.

**A headless browser in a sandbox usually has no egress even when `curl` does.**
Capture with `curl`, replay through interception. Do not conclude the feed is
down.

## Layout

**Overflow is invisible to reasoning.** The nav needed ~1333px; the body grid
capped at 1220. It overflowed at every desktop width and nobody saw it, because
the page looks fine until you check `scrollWidth > clientWidth`.

**`flex-basis` becomes a *height* in a column-direction flex container.** A
`flex:1 1 22ch` on a paragraph reserved ~350px of vertical space once the
container stacked on mobile. Set `flex:none` in the narrow query.

**A global list reset that covers `ul` but not `ol`** leaves numbering on
exactly the ordered lists you built to be semantic. Reset both.

**`role="presentation"` on an `<li>`** used as a month separator makes the whole
list read as containing non-list children. Drop the role; use a real list item.

## Colour and contrast

**Gold on white is about 1.7:1.** Brand gold works as a focus ring on lacquer and
vanishes on a light shell. Focus rings need their own colour per surface.

**4.4:1 is a failure.** AA is 4.5. Measure rather than trusting a palette that
"looks fine".

**Colour alone cannot signal a link** (WCAG 1.4.1). Inline links in body copy
need underlines.

**`color:inherit` breaks across a scoped palette island.** See
`generator.md` → dark islands.

## JavaScript

**`var` is function-scoped, and one big IIFE is one scope.** Two `var rail`
declarations — a scroll-progress bar and a live rail — collided, so the scroll
handler wrote its percentage width onto the wrong element, shrinking it as the
page scrolled. Name things for what they are, and prefer `const`/`let`.

**State must reflect reality, not intent.** An episode row marked itself
"playing" the moment the button was pressed, before audio loaded — so a slow
network showed a playing state with silence. Drive UI state from the media
element's own events, and give loading and error their own states.

**Hoisting saves you, until it doesn't.** A function declaration is available
before its line; a `var` initialised later is `undefined` when an earlier call
reads it. That is fine when `undefined` is a legitimate input and a bug when it
is not. Know which you are relying on.

## Content

**Two lists will diverge.** See `generator.md`. Every content bug on the last
build was this.

**A schedule with gaps or overlaps makes an on-air engine pick arbitrarily.**
Two shows both claiming 07:30–10:00 produced a different answer depending on
list order. Assert full coverage and no overlap at build time.

**Breadcrumbs should name the section, not the headline.** Deriving them from
the `h1` produced "Home / Miss a show? Not anymore." Derive from the nav label.

**Meta descriptions overrun snippet length** unless clamped centrally.

## Assets

**Square crops of tall portraits land on the chest.** Every portrait needs an
explicit `object-position` focal point; a centre crop is wrong for most of them.

**Self-host client photography.** Hot-linking a third party leaves the page
depending on someone else's uptime and URL scheme.

**Say how old the photography is.** A "rolling social feed" built from an archive
where every frame is one day in 2018 is not rolling and not social. Name the gap
plainly rather than letting the label imply currency.
