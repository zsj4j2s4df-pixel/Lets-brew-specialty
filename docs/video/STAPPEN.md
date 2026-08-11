# De rondleidingsvideo, stap voor stap

Een video van ongeveer 1:13 in 9:16 waarin **de stille vakman** nieuwe gebruikers door
Lets Brew leidt: waar je boon vandaan komt, je bonenplank, het recept, dial in en pour
over — met aan het eind een knop om de app te openen.

Dertien shots. **Acht komen uit de app** (staan klaar in `opnames/`), **vijf maak je in
Luma** (prompts staan hieronder, startbeelden in `keyframes/`).

> Waarom die verdeling: Luma kan geen leesbare interface tekenen. Vraag je hem een
> telefoon met de app te animeren, dan wordt elke letter een krabbel die per frame
> verandert. Dus komen de schermen uit de app zelf — die animeert al in huisstijl — en
> doet Luma de barista, de handen, de stoom en de koffie.

---

## Stap 1 · Kijk wat er klaarstaat

| map | wat erin zit |
|---|---|
| `opnames/` | acht app-shots, 1080×1920, klaar om te knippen |
| `keyframes/` | vijf startbeelden voor Luma, 1080×1920 |

Meer hoef je niet te maken. Alles hieronder is genereren, inspreken en monteren.

---

## Stap 2 · Genereer de vijf Luma-shots

Instellingen, voor alle vijf hetzelfde:

| | |
|---|---|
| beeldverhouding | **9:16** |
| duur | 5 s |
| loop | uit |
| startbeeld | het bestand uit `keyframes/` dat bij het shot staat |
| pogingen | 2–3 per shot, dan de beste kiezen |

Elke prompt hieronder is één blok: kopiëren, plakken, startbeeld erbij, klaar. Het
stijlblok en de negatives zitten er al in — laat je ze bij één shot weg, dan valt dat
shot er meteen uit.

### Shot 1 — het begin · `keyframes/s01-begin.png`

```
hand-drawn pen sketch on warm cream paper, dark brown ink only, no fill and no
shading, every contour drawn twice with a slight offset, lines overshoot at the
corners, wobbling uneven contours, flat 2D illustration, calm and unhurried.

The barista is a calm craftsman: canvas apron over a plain shirt with rolled-up
sleeves, short dark hair, two small dashes for eyes and no other facial detail.

The coffee bean on the left finishes drawing itself, line by line, as if an unseen pen
is going over it. The barista looks over at it and gives a small nod.
Camera: locked off, straight on, no movement.
Only the drawing lines and his head move; the counter stays completely still.

Negative: photograph, 3D render, glossy highlights, gradients, colour, readable text,
letters, numbers, watermark, extra fingers, warped hands.
```

### Shot 5 — de zak · `keyframes/s05-zak.png`

```
hand-drawn pen sketch on warm cream paper, dark brown ink only, no fill and no
shading, every contour drawn twice with a slight offset, lines overshoot at the
corners, wobbling uneven contours, flat 2D illustration, calm and unhurried.

The barista is a calm craftsman: canvas apron over a plain shirt with rolled-up
sleeves, short dark hair, two small dashes for eyes and no other facial detail.

He picks up the bag of coffee from the counter, holds it up and turns it to read the
label. The bag has no readable text, only the drawn logo shape.
Camera: slow push in from waist height to chest height.
Keep the counter and his head steady; only the arms and the bag move.

Negative: photograph, 3D render, glossy highlights, gradients, colour, readable text,
letters, numbers, watermark, extra fingers, warped hands.
```

### Shot 9 — aan de machine · `keyframes/s09-machine.png`

Dit is het shot waar de video het meest naar een koffiebar ruikt. Geef hem twee
pogingen extra.

```
hand-drawn pen sketch on warm cream paper, dark brown ink only, no fill and no
shading, every contour drawn twice with a slight offset, lines overshoot at the
corners, wobbling uneven contours, flat 2D illustration, calm and unhurried.

The barista is a calm craftsman: canvas apron over a plain shirt with rolled-up
sleeves, short dark hair, two small dashes for eyes and no other facial detail.

He reaches over to the lever espresso machine beside him, takes hold of the lever and
pulls it down. Two loose curls of steam drift up from the machine.
Camera: slow push in, chest height, no shake.
Keep the machine outline steady; only his arm and the steam move.

Negative: photograph, 3D render, glossy highlights, gradients, colour, readable text,
letters, numbers, watermark, extra fingers, warped hands.
```

### Shot 12 — omschakelen naar filter · `keyframes/s12-v60.png`

```
hand-drawn pen sketch on warm cream paper, dark brown ink only, no fill and no
shading, every contour drawn twice with a slight offset, lines overshoot at the
corners, wobbling uneven contours, flat 2D illustration, calm and unhurried.

The barista is a calm craftsman: canvas apron over a plain shirt with rolled-up
sleeves, short dark hair, two small dashes for eyes and no other facial detail.

He lifts a gooseneck kettle into frame from the right and pours a thin stream of water
into the V60 dripper beside him. One thin curl of steam rises from the spout.
Camera: slow pan right to left, following the kettle.
Keep the dripper and the counter steady; only the kettle, the water and the steam move.

Negative: photograph, 3D render, glossy highlights, gradients, colour, readable text,
letters, numbers, watermark, extra fingers, warped hands.
```

### Shot 14 — de afsluiter · `keyframes/s14-slot.png`

De laatste seconde moet **stilstaan** — daar tekent de knop zich overheen (stap 5).
Vraag Luma daar expliciet om, anders blijft hij bewegen en danst je knop mee.

```
hand-drawn pen sketch on warm cream paper, dark brown ink only, no fill and no
shading, every contour drawn twice with a slight offset, lines overshoot at the
corners, wobbling uneven contours, flat 2D illustration, calm and unhurried.

The barista is a calm craftsman: canvas apron over a plain shirt with rolled-up
sleeves, short dark hair, two small dashes for eyes and no other facial detail.

He picks up the finished cup from the counter, lifts it toward the camera and holds it
there. The final second is completely still — nothing moves at all.
Camera: locked off, chest height, settling to a stop.

Negative: photograph, 3D render, glossy highlights, gradients, colour, readable text,
letters, numbers, watermark, extra fingers, warped hands.
```

---

## Stap 3 · Keur af wat niet goed is

Loop na elke generatie deze vier langs, in deze volgorde. De eerste die faalt maakt de
rest onbelangrijk:

1. **Kleur** — alleen creme en bruin? Luma sluipt er graag een blauwe of groene zweem in.
2. **Handen** — vijf vingers, geen zesde, geen versmolten duim. Hier sneuvelen de meeste
   generaties.
3. **De lijn** — zie je de dubbele contour en de doorschietende hoeken nog, of is het glad
   geworden? Glad = opnieuw.
4. **Het gezicht** — leg het naast het startbeeld. Andere neus, ander haar, andere
   leeftijd = opnieuw.

Lukt een shot na drie pogingen niet: verander de **handeling**, niet het stijlblok. Een
barista die *iets vasthoudt* lukt bijna altijd; een barista die *iets ingewikkelds doet
met twee handen* vaak niet.

---

## Stap 4 · Spreek de voice-over in

Bij ElevenLabs, **in één keer** — niet zin voor zin. De pauzes tussen de zinnen zijn wat
de video zijn tempo geeft.

```
This is Lets Brew — a coffee notebook that remembers what worked.

Start where the coffee starts. Tap a continent, zoom into a country, and go down to a
region: what grows there, how high, and what to look for on the bag.

Found one? Photograph the label and the app fills itself in — right down to its place
on the map.

Pick that bean for a brew and the recipe comes with it. Dose, ratio, temperature, and
the grind you landed on last time.

Espresso? Pull the lever. The shot timer runs with you, the numbers stay yours to
change, and every attempt walks its way into the target band.

Pour over? Same shelf, other brewer. The recipe runs on the clock — bloom, then pour
in stages, and tap a step when you actually do it.

Lets Brew. Dial in your first cup.
```

| | |
|---|---|
| stem | warm, laag, onhaastig — geen reclamestem |
| snelheid | iets onder normaal |
| stabiliteit | rond de helft, anders wordt het vlak |
| export | WAV |

---

## Stap 5 · Monteer

Leg de voice-over eerst neer; de beelden zijn op die zinnen getimed, niet andersom.

| # | bron | bestand | in → uit | VO die eronder loopt |
|---|---|---|---|---|
| 1 | Luma | shot 1 | 0:00 → 0:04 | "This is Lets Brew…" |
| 2 | app | `opnames/02-home.webm` | 0:00 → 0:03 | "…remembers what worked." |
| 3 | app | `opnames/03-kaart-wereld.webm` | 0:01 → 0:08 | "Start where the coffee starts…" |
| 4 | app | `opnames/04-kaart-streek.webm` | 0:00 → 0:08.5 | "…what to look for on the bag." |
| 5 | Luma | shot 5 | 0:00 → 0:04 | "Found one? Photograph the label…" |
| 6 | app | `opnames/06-nieuwe-boon.webm` | 0:00.5 → 0:07.5 | "…the app fills itself in." |
| 7 | app | `opnames/07-recept.webm` | 0:01 → 0:08.5 | "Pick that bean and the recipe comes with it…" |
| 8 | Luma | shot 9 | 0:00 → 0:04 | "Espresso? Pull the lever." |
| 9 | app | `opnames/10-dial-in.webm` | 0:02 → 0:08 | "The shot timer runs with you…" |
| 10 | app | `opnames/11-journey.webm` | 0:01.5 → 0:06.5 | "…into the target band." |
| 11 | Luma | shot 12 | 0:00 → 0:04 | "Pour over? Same shelf, other brewer." |
| 12 | app | `opnames/13-the-pour.webm` | 0:02 → 0:09 | "The recipe runs on the clock…" |
| 13 | Luma | shot 14 | 0:00 → 0:05 | "Lets Brew. Dial in your first cup." |

**Snij op beweging.** Elke app-clip eindigt op een rustpunt (de streek staat open, de
timer loopt, de lijn is af). Ga daar weg, niet erna — dan lijkt de app sneller dan hij
is in plaats van andersom.

**Alleen aan het eind komt er tekst overheen**, op shot 13 in de stilstaande laatste
seconde:

- de titel **Lets Brew**, Caveat 700, kleur `#3a302a`
- eronder een knop met de tekst **Open Lets Brew ›** — zelfde vorm als in de app: 2 px
  rand, hoekradius 16, gevuld met `#7d6650`, tekst in `#f2ead9`
- laat de knop zich in een halve seconde onthullen van links naar rechts, niet infaden

De fonts staan ingebed in `.claude/skills/nieuwe-feature/scripts/fonts.css`.

**Twee clips zijn schokkeriger dan de rest** — `10-dial-in` en `13-the-pour`, omdat daar
een klok én een tekening tegelijk lopen. Houd ze kort en snijd op een moment dat er níet
net iets beweegt.

Muziek mag, maar onder de stem en zonder beat. Geen geluidseffecten bij de
app-schermen; de app maakt zelf ook geen geluid.

---

## Stap 6 · Exporteer twee versies

1. **de master** — 1080×1920, H.264, 25 of 30 fps
2. **voor de landingspagina** — 720×1280, H.264, ongeveer 8 Mbit/s, **onder de 10 MB**

Die tweede moet klein blijven omdat hij in de pagina wordt ingebakken: een artifact mag
niets van buiten laden en niet groter zijn dan 16 MB.

---

## Stap 7 · Zet de landingspagina in elkaar

```sh
python3 docs/video/bouw-landing.py pad/naar/klein.mp4
```

Dat schrijft `docs/video/landing.html` met de video erin en de knop naar
`letsbrewspecialty.jesseboontje.workers.dev`. Publiceer dat bestand als artifact op de
bestaande link, dan blijft hij hetzelfde:

**https://claude.ai/code/artifact/9bd698cf-0b1a-418a-abe0-a6c65eaff2d9**

---

## Als je iets opnieuw wilt maken

**De app-shots** (bijvoorbeeld omdat er iets in de app veranderde):

```sh
npm install playwright --no-save
python3 -m http.server 8765     # vanuit de repo-root
node docs/video/opnemen.js
```

De shots staan bovenin `opnemen.js` als tijdlijnen — "op deze milliseconde gebeurt dit".
Wil je ergens langer stilstaan: verhoog `duur` en schuif de stappen op. De demo-plank
(bonen, wenslijst, brews, de vijf dial-in-pogingen) staat er ook in.

**De startbeelden**:

```sh
python3 docs/video/bouw-keyframes.py
```

De vakman staat in `barista.py`, de scènes in `bouw-keyframes.py`. De machine en de V60
worden niet nagetekend maar uit `index.html` gehaald — de app heeft ze al als
handgetekende SVG, dus de stijl klopt per definitie.
