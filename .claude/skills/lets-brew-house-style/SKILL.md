---
name: lets-brew-house-style
description: Build and change the Lets Brew Specialty coffee app in its hand-drawn house style, and publish preview artifacts of it. Use this skill whenever the user works on this repo's index.html, mentions Lets Brew Specialty, letsbrewspecialty.jesseboontje.workers.dev, "de koffie-app", "de app aanpassen", tekenstijl / hand-drawn style, brews, beans, dial-in, shot clock, brew methods, or asks for a preview/artifact of the app — even if they don't name the style explicitly.
---

# Lets Brew Specialty — house style & build rules

A single-file PWA (`index.html`, vanilla JS, no build step) that tracks coffee brews.
Its whole identity is a hand-drawn pencil-on-paper look. Match it exactly; never
introduce a different visual language.

## Design tokens — use the variable, never a raw hex

```
--paper #efe9dd   --card #e7ded0    --card-2 #ded2c0   --desk #d4ccbe
--ink #3a302a     --ink-soft #7a6c5e --line #b8a98f
--accent #4a3b30      /* dark: text/strokes only, NOT button fills */
--accent-soft #7d6650 /* ALL filled buttons, toggles-on, toast */
--cream #f2ead9       /* text on filled buttons */
method tints: --espresso #e3d3bf --aeropress #dfdcc9 --v60 #e6d9cf
              --chemex #dcd9cc --perculator #e4d6cc
```

Night mode is the same app as a chalkboard: `html.night` redefines only these
variables. Style through tokens so night mode keeps working for free.

## The hand-drawn look

- **Fonts**: `'Caveat'` 700 for headings/buttons (class `.hand`), `'Patrick Hand'`
  for body. Nothing else.
- **Two SVG filters, already defined in the file**: `#wobble` on card/button
  borders, `#wobble-rough` on icons. Every bordered surface gets one — that
  wobble *is* the style.
- **Icons are always inline SVG**: `fill:none`, stroke via the `.acic` class,
  `stroke-width:1.6–2`, rounded caps, loose sketch shapes.
  **Never use emoji as an icon** — the user rejects it every time.
- Cards: `border-radius:26px`, 2px border. Buttons: 14–18px radius.

### Bigger drawings: overdraw them

The reference the user gave (a pencil Chemex) is **not a single clean line**: every
contour is gone over two or three times with a small offset, ellipses don't close
neatly, and lines overshoot slightly at the joints. Line weight is thin, there is
no fill and no shading — pure ink on cream.

**Do not duplicate with `<use>` and a transform.** That was tried and rejected: a
uniform offset gives two perfectly parallel contours, which reads as a photocopy,
not as a pen going over the line twice. The variation has to differ per stroke.

Write every contour **twice by hand**, each with its own deviation:

```html
<!-- first pass -->
<path d="M67.5 19.5 Q120 10.8 172 17.5 Q168.5 26 166 35 Q120 41.5 73 33.8 Q70 26 67.8 19"/>
<!-- second pass: other control points, slightly thinner and lighter -->
<path class="e61-b" d="M70 17.4 Q118.5 13.2 169.5 19.4 Q167 27 164.8 33.6 Q121.5 39.4 75 34.8 Q71.8 25 69.4 18"/>
```
```css
.e61-b{opacity:.62;stroke-width:1.35;}
.e61-box svg{fill:none;stroke:var(--ink);stroke-width:1.7;stroke-linecap:round;
             stroke-linejoin:round;filter:url(#wobble-rough);}
```

Four details that carry the whole effect. Err on the side of **too sloppy** — the
user has asked twice to loosen it up, never to tighten it:

- **One stroke per edge, not one path per shape.** A rectangle is four separate
  paths, not a closed contour. Never use `Z`.
- **Overshoot generously** — run each edge 5–10 units past the corner so the
  strokes visibly *cross* and leave tails. Small 1–2 unit overshoots read as neat.
- **Let the two passes diverge 2–4 units**, and differently along their length:
  wider apart at one end, nearly touching at the other.
- **Bow the straight lines** and **leave circles open** — draw a circle as a loop
  that runs past its own start, then a second smaller loop inside it.

Scale check: on a 240-unit canvas, a machine outline of ~56 paths looks right;
~11 paths looks like clip-art.

Keep animated parts (a lever, a liquid fill) in their own group, outside the
doubled line work.

### Liquid

Coffee is `var(--accent-soft)` with a lighter crema band (`#c8a577`, night `#8a744f`).
A pouring stream is a thin stroked path with `stroke-dasharray:13 3` and an animated
`stroke-dashoffset` — mostly solid, so it reads as flowing, not as dots. A cup fills
via a `<rect>` clipped to the cup interior whose `y`/`height` you animate.

## Language rule (strict)

- **All fixed UI text is English** — labels, buttons, toasts, confirms, empty states.
- **Dutch stays** in exactly four places: content the user typed, AI output,
  `LESSONS` (the learn pages), and `BREW_GUIDES` (the brew recipes). Code comments
  are Dutch too.
- AI prompts are written in Dutch and ask for Dutch answers. Keep it that way.

## Architecture rules

1. **Method families drive everything.** `methodFamily(id)` returns `espresso` or
   `filter`. Espresso → the dial-in screen; filter → the brew form. Any new
   feature must respect this split.
2. **Every new feature gets a switch.** Add an entry to the `FEATURES` array
   (`{id, n, d, def, cat}`) and gate it with `featOn('id')`. The user wants to turn
   anything off in profile → features. `cat` is `app`, `people` or `smart`.
3. **`ESPRESSO_RULES`** must be injected into every AI prompt about espresso grind.
   Without it the model reverses the grind direction (it once told the user to
   grind finer when the shot was already too slow).
4. Storage is IndexedDB via `idbSet/idbGet` on one `state` object. The API key
   lives in `localStorage` (`scc_ai_key`) and is deliberately **not** in the backup.

## Workflow for every change

1. Edit `index.html` (it is ~350 KB; read ranges, never the whole file at once —
   one base64 line is 99 k chars).
2. **Verify with Playwright before claiming anything works:**
   ```sh
   npm install playwright --no-save
   NODE_PATH=$PWD/node_modules node -e "...chromium.launch({executablePath:'/opt/pw-browsers/chromium'})..."
   rm -rf node_modules package-lock.json    # always clean up
   ```
   The splash screen takes ~4.3 s — wait it out before touching the UI.
3. Commit to the working branch. **Never push to `main` without the user saying
   "zet online" / "ga live"** — `main` is what's live.
4. When going live: bump `CACHE` in `service-worker.js` (`scc-vNN` → `NN+1`),
   otherwise phones keep the old version.

## Mistakes that already happened — do not repeat

- **Never global-replace a colour literal.** Replacing `#f2ead9` → `var(--cream)`
  also hit the `:root` definition, creating `--cream:var(--cream)`. Every
  cream-on-brown text in the app silently turned dark-on-dark. Exclude the
  definition line, then verify with `getComputedStyle`.
- **Assert that a patch anchor exists.** A replace against `function go(p){`
  silently did nothing because the real signature is `go(p,isBack)`. Use
  `assert old in s` in every Python patch script.
- **`getComputedStyle` during a CSS transition returns the in-between value.**
  `.toggle` animates over .15 s — wait ~300 ms before measuring colours, or you
  will chase a bug that does not exist.
- Removing a block by cutting "from marker A to marker B" can swallow the opening
  tag of the next element. After any structural cut, check every page still opens.

## Publishing a preview artifact

The app loads Google Fonts and PNGs from disk; an artifact may load nothing
externally. Run the bundler, then publish the result:

```sh
python3 .claude/skills/lets-brew-house-style/scripts/build-preview.py
# writes /tmp/lets-brew-preview.html — publish that with the Artifact tool
```

Always tell the user two things about a preview: it has **its own storage**
(separate from the real app), and **AI features cannot work in it** (no outbound
network). Republish to the same file path to keep the same URL.

## Example

**Input:** "Voeg een knop toe op home om je bonenvoorraad te tellen."
**Output:** a `.btn-add sketch soft` button with an inline hand-drawn SVG icon (no
emoji), English label, gated behind a new `FEATURES` entry with a switch in
profile, verified in Playwright, committed to the branch — not pushed live.
