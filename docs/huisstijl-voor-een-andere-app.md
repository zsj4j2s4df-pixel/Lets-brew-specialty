# Opdracht: tover deze app om naar een hand-getekende huisstijl

Ik wil dat mijn app eruitziet als **potlood op papier**: warm, rommelig, met de
hand getrokken. Hieronder staat de hele stijl, in de volgorde waarin je hem het
beste aanbrengt, plus de plekken waar het bij mij is misgegaan.

Werk van onder naar boven: eerst de variabelen, dan de letters, dan de vlakken,
dan de icoontjes, dan pas de tekeningen. Andersom zit je alles twee keer te doen.

---

## 1. De variabelen

Zet dit bovenin je stylesheet. Vanaf nu komt **elke** kleur hiervandaan; een
kale hex in een component is een fout, geen smaakkwestie.

```css
:root{
  --paper:#efe9dd; --card:#e7ded0; --card-2:#ded2c0; --desk:#d4ccbe;
  --ink:#3a302a; --ink-soft:#7a6c5e; --line:#b8a98f;
  --accent:#4a3b30;        /* donker: tekst en lijnen, NOOIT een knopvulling */
  --accent-soft:#7d6650;   /* álle gevulde knoppen, schuifjes-aan, toast */
  --cream:#f2ead9;         /* tekst óp een gevulde knop */
  --radius:26px;
}
```

Wat wat is, want dit onderscheid wordt het vaakst verkeerd gedaan:

| | |
|---|---|
| `--paper` | het vel waar de inhoud op staat |
| `--card` | een kader óp dat vel |
| `--card-2` | een kader op een kader |
| `--desk` | de tafel buiten het vel — de rand van het scherm |
| `--accent` | donkere **lijn en tekst**, geen vlak |
| `--accent-soft` | het enige dat je écht vult |

Een donkere stand is dan gratis: je herdefinieert alleen deze variabelen, en
geen enkel component hoeft mee te veranderen.

```css
html.night{
  --paper:#262b28; --card:#2e3431; --card-2:#353c38; --desk:#181d1a;
  --ink:#e9e4d4; --ink-soft:#9aa094; --line:#5a615c;
  --accent:#d9c9a8; --accent-soft:#c2b191; --cream:#1c211e;
}
```

> **De fout die mij een halve dag kostte:** met zoeken-en-vervangen alle
> `#f2ead9` omzetten naar `var(--cream)`. Dat raakte óók de regel waar
> `--cream` gedefinieerd wordt, en die werd `--cream:var(--cream)`. Alle
> lichte tekst op donkere knoppen werd stil donker-op-donker. Sluit de
> definitieregels uit, en controleer achteraf met `getComputedStyle`.

---

## 2. De letters

Twee lettertypes, en niets anders:

- **Caveat**, gewicht 700 — koppen, knoppen, getallen die opvallen. Geef hem een
  klasse (`.hand`) en `letter-spacing:.4px`.
- **Patrick Hand** — alle lopende tekst, labels, bijschriften.

```css
body{font-family:'Patrick Hand','Segoe Print',cursive;font-size:18px;line-height:1.45;}
.hand{font-family:'Caveat',cursive;font-weight:700;letter-spacing:.4px;}
```

Kan de pagina niet naar buiten praten, sluit ze dan in als `data:`-URI in een
`@font-face`. Een stille terugval op Arial haalt de stijl er in één klap uit, en
je ziet het pas op iemand anders zijn toestel.

---

## 3. De vlakken

Alles wat een rand heeft, krijgt de golving. **Dat is de stijl** — een kaart
zonder filter valt er meteen uit.

```html
<svg style="position:absolute;width:0;height:0" aria-hidden="true">
  <filter id="wobble"><feTurbulence type="fractalNoise" baseFrequency="0.018"
    numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic"
    in2="n" scale="4"/></filter>
  <filter id="wobble-rough"><feTurbulence type="fractalNoise" baseFrequency="0.05"
    numOctaves="3" seed="11" result="n"/><feDisplacementMap in="SourceGraphic"
    in2="n" scale="2.2"/></filter>
</svg>
```

```css
.sketch{background:var(--card);border:2px solid var(--ink);
        border-radius:var(--radius);filter:url(#wobble);}
.sketch.soft{border-color:var(--line);}      /* rustiger kader */
```

Maten die kloppen bij elkaar:

- **kaarten**: `border-radius:26px`, rand `2px`
- **knoppen**: radius `14–18px`, rand `2px`
- **chips en labeltjes**: radius `15px`, rand `2px` in `--line`

Een gevulde knop is `--accent-soft` met `--cream` erop; een lege knop is
doorzichtig met `--line` als rand en `--ink` als tekst.

> **Elke knop die je zelf maakt krijgt `color` en `font` mee.** Zonder die twee
> pakt een `<button>` de systeemkleur van de browser: op een iPhone wordt je
> tekst blauw. `color:var(--ink);font:inherit`, altijd.

---

## 4. De icoontjes

Dit is de stap die het meeste oplevert en die het vaakst half wordt gedaan.

**Elke emoji eruit. Elk icoon-lettertype eruit.** Vervang ze door inline SVG,
met de hand getekend:

```css
svg.ic{fill:none;stroke:var(--ink);stroke-width:1.7;stroke-linecap:round;
       stroke-linejoin:round;filter:url(#wobble-rough);}
```

Op een canvas van 24×24 gelden vier regels:

1. **Eén pad per rand**, niet één pad per vorm. Gebruik nooit `Z`.
2. **Laat lijnen doorschieten**, 0,5 tot 1 eenheid voorbij de hoek, zodat ze
   elkaar kruisen.
3. **Geen `<circle>`, `<rect>` of `<ellipse>`.** Een rondje is een lus die
   voorbij zijn eigen begin loopt:
   ```html
   <path d="M14.4 8.1 Q17 11.6 14.2 14.6 Q11.1 16.9 7.6 14.9 Q4.8 12.3 6.5 8.5
            Q9 5.3 12.6 6.3 Q14.2 7 15 8.7"/>
   ```
4. **Geen tweede haal op dit formaat.** Twee lijnen twee eenheden uit elkaar
   lopen op 20 pixels in elkaar tot een vlek.

Doe de hele set in **één keer**, met een scriptje dat op de exacte oude
padtekst zoekt. Dezelfde icoontjes komen vaak vijf of zes keer voor; één
vervanging per icoon houdt ze allemaal identiek. Zet een `assert` op elk anker,
anders vervangt je script stilletjes niets.

**Emoji kruipen terug.** Zoek na elke ronde op tekens boven U+2190 en loop de
treffers na. In een toast of in deelbare tekst mogen ze blijven; alles wat op een
knop staat wordt een SVG.

---

## 5. De grotere tekeningen

Voor illustraties — een apparaat, een voorwerp, een scène — gelden dezelfde
regels, maar met het doorschieten meegeschaald naar **5 tot 10 eenheden op een
canvas van 240**, en met **twee halen per contour**:

```html
<path d="M67.5 19.5 Q120 10.8 172 17.5 Q168.5 26 166 35 Q120 41.5 73 33.8"/>
<path class="b" d="M70 17.4 Q118.5 13.2 169.5 19.4 Q167 27 164.8 33.6 Q121.5 39.4 75 34.8"/>
```
```css
.b{opacity:.62;stroke-width:1.35;}
```

De tweede haal schrijf je **echt opnieuw**, met eigen controlepunten, en laat je
2–4 eenheden afwijken — verschillend over de lengte. Dupliceren met `<use>` en
een `transform` geeft twee perfect parallelle lijnen; dat leest als een
fotokopie en is bij mij afgekeurd.

Maatgevoel: een apparaat van zo'n **56 paden** ziet er goed uit, elf paden is
clip-art. Err naar te slordig — te netjes is de fout die iedereen maakt.

Moet er ergens een donker vlak zijn, **arceer** het met tien tot twintig snelle
strepen die aan de randen ongelijk uitlopen. Vullen doe je alleen bij knoppen.

**Heb je al foto's of eigen tekeningen die je niet wilt overdoen?** Zet
`filter:url(#wobble-rough)` op de `<img>`. Datzelfde filter verruwt een
bitmaprand net zo goed als een lijn, en dan staan ze in hetzelfde register. Bij
een reeks beelden geef je elk een iets andere `rotate()` van 0,3 à 0,6 graad,
zodat het lijkt alsof een hand ze heeft neergelegd.

---

## 6. De taal erbij

De stijl is niet alleen visueel. Schrijf de teksten alsof iemand ze in de
kantlijn zette: korte zinnen, geen uitroeptekens, geen jargon, en noem dingen
zoals een gebruiker ze noemt. Een knop zegt wat er gebeurt, en de melding erna
zegt dat het gebeurd is.

---

## De controleronde

Loop dit na voor je zegt dat het af is:

1. **Zoek op `#` in je stylesheet** buiten het variabeleblok. Elke treffer is
   een kleur die de donkere stand straks breekt.
2. **Zoek op tekens boven U+2190.** Elke emoji op een knop is werk dat blijft
   liggen.
3. **Zet de donkere stand aan** en loop elk scherm langs. Donker-op-donker
   verraadt een vergeten variabele.
4. **Meet een paar kleuren met `getComputedStyle`** — maar wacht ~300 ms na een
   klik. Een schuifje dat in 0,15 s overloopt geeft je halverwege de
   tussenwaarde, en dan zit je een bug te zoeken die er niet is.
5. **Kijk op een echte telefoon**, niet alleen in de simulator: daar zie je de
   blauwe knoptekst en de niet-ingeladen letters meteen.
6. **Zet twee schermen naast elkaar**, een oud en een nieuw. Als het nieuwe niet
   duidelijk rustiger oogt, zit er te veel rand en te weinig ruimte in.

Eén laatste, over hoe je knipt: een blok verwijderen "van markering A tot
markering B" slikt makkelijk de openingstag van het volgende element mee. Loop
na elke structurele ingreep alle schermen nog één keer open.
