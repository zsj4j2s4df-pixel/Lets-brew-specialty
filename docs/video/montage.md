# De montage

Dertien shots, ongeveer 1:13. Vijf komen uit Luma, acht uit `opnames/`.

Belangrijkste ding vooraf: **de app-opnames zijn langer dan wat je gebruikt.** Ze lopen
5 tot 15 seconden zodat je kunt kiezen waar je in- en uitstapt. Hieronder staat per
clip het stuk dat het werk doet. Neem dat, niet meer — een rondleiding die blijft
hangen op een scherm voelt trager dan hij is.

## De volgorde

| # | bron | bestand / prompt | in → uit | duur |
|---|---|---|---|---|
| 1 | Luma | shot 1 · de pen tekent de boon | 0:00 → 0:04 | 4 s |
| 2 | app | `02-home.webm` | 0:00 → 0:03 | 3 s |
| 3 | app | `03-kaart-wereld.webm` | 0:01 → 0:08 | 7 s |
| 4 | app | `04-kaart-streek.webm` | 0:00 → 0:08.5 | 8,5 s |
| 5 | Luma | shot 5 · de zak fotograferen | 0:00 → 0:04 | 4 s |
| 6 | app | `06-nieuwe-boon.webm` | 0:00.5 → 0:07.5 | 7 s |
| 7 | app | `07-recept.webm` | 0:01 → 0:08.5 | 7,5 s |
| 8 | Luma | shot 9 · aan de machine | 0:00 → 0:04 | 4 s |
| 9 | app | `10-dial-in.webm` | 0:02 → 0:08 | 6 s |
| 10 | app | `11-journey.webm` | 0:01.5 → 0:06.5 | 5 s |
| 11 | Luma | shot 12 · omschakelen naar filter | 0:00 → 0:04 | 4 s |
| 12 | app | `13-the-pour.webm` | 0:02 → 0:09 | 7 s |
| 13 | Luma | shot 14 · de afsluiter | 0:00 → 0:05 | 5 s |

**Snij op beweging.** Elke app-clip eindigt op een rustpunt (de streek staat open, de
timer loopt, de lijn is af). Ga daar weg, niet erna: dan lijkt de app sneller dan hij
is, in plaats van andersom.

## Twee dingen over de app-opnames

**Ze zijn opgenomen op 8 beelden per seconde.** Dat is een bewuste keuze: bij hogere
snelheden werd de opname zelf de rem en ging de video trager lopen dan de app. Voor
handgetekend materiaal dat grotendeels stilstaat valt het niet op. Twee clips zijn
schokkeriger dan de rest — `10-dial-in` (~4 fps) en `13-the-pour` (~2 fps), omdat daar
een klok én een tekening tegelijk lopen. Houd die kort en snijd ze op een moment dat er
níét net iets beweegt.

**Ze staan op 1080×1920, zonder telefoonlijstje eromheen.** Wil je het toestel in beeld,
leg er dan in de montage een getekend telefoonframe overheen — niet in de opname zelf,
want dan zit je aan die keuze vast.

## Wat er overheen komt

**Alleen aan het eind.** De rest van de video heeft geen tekst nodig: de app-schermen
zíjn de tekst.

Op shot 13, in de laatste seconde waarin het beeld stilstaat:

- de titel **Lets Brew** in Caveat 700, kleur `#3a302a`
- daaronder een getekende knop met de tekst **Open Lets Brew ›** — dezelfde vorm als de
  knoppen in de app: 2 px rand, hoekradius 16, gevuld met `#7d6650`, tekst in `#f2ead9`
- laat de knop zich in een halve seconde "tekenen" (van links naar rechts onthullen),
  niet infaden — dat past bij de rest

Fonts: Caveat 700 en Patrick Hand. Beide staan ingebed in
`.claude/skills/nieuwe-feature/scripts/fonts.css`.

## Geluid

Eén doorlopende voice-over onder de hele video (zie `script.md`). Muziek mag, maar houd
hem onder de stem en zonder beat — een ritme dat niet met de knippen meeloopt vecht met
het beeld. Geen geluidseffecten bij de app-schermen; de app maakt zelf ook geen geluid.

## Exporteren

Twee versies:

1. **de video zelf** — 1080×1920, H.264, 25 of 30 fps. Dit is je master.
2. **voor de landingspagina** — 720×1280, H.264, ongeveer 8 Mbit/s. Die moet **onder de
   10 MB** blijven, want hij wordt in de pagina ingebakken (zie `landing.html` en
   `bouw-landing.py`). Een artifact mag niets van buiten laden en niet groter zijn dan
   16 MB.

## Nog een keer opnemen?

De app-opnames komen uit `opnemen.js`. Verandert er iets aan de app, of wil je een shot
anders:

```sh
npm install playwright --no-save
python3 -m http.server 8765     # vanuit de repo-root
node docs/video/opnemen.js
```

De shots staan bovenin dat bestand als tijdlijnen — een lijstje van "op deze
milliseconde gebeurt dit". Wil je ergens langer stilstaan, verhoog dan `duur` en schuif
de stappen op. De demo-plank (bonen, wenslijst, brews, de vijf dial-in-pogingen) staat
er ook in, in `DEMO`.
