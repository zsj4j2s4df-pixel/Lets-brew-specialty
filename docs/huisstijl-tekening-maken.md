# Opdracht: teken dit in de hand-getekende huisstijl

Ik wil een tekening in een vaste stijl: **potlood-op-papier, warm en rommelig**.
Hieronder staat precies hoe die stijl werkt. Volg het letterlijk — het is
uitgeprobeerd, en de plekken waar het misgaat staan erbij.

---

## Regel nul: dit is géén plaatjesgenerator

De stijl is **met de hand geschreven SVG**. Geen AI-plaatje, geen bitmap, geen
tekenprogramma. Dat is geen kunstzinnige voorkeur maar een praktische:

- een SVG schaalt van een 24-pixel-icoontje tot een poster zonder te vervagen;
- de kleuren zijn variabelen, dus dezelfde tekening werkt in een lichte én een
  donkere stand;
- het "handgetekende" komt uit een filter dat over de lijnen loopt — dat werkt
  alleen op echte vectorlijnen.

Dus: jij schrijft `<path d="…">`, met de hand, pad voor pad.

---

## De bouwstenen

### Kleuren

```
--paper     #efe9dd   het vel waar alles op staat
--card      #e7ded0   een kader op dat vel
--card-2    #ded2c0   een kader op een kader
--desk      #d4ccbe   de tafel eromheen
--ink       #3a302a   de lijn zelf: warm donkerbruin, nooit zwart
--ink-soft  #7a6c5e   bijschriften, lichte lijnen
--line      #b8a98f   randen van rustige kaders
--accent-soft #7d6650 het enige dat je vult: knoppen, koffie
--cream     #f2ead9   tekst óp een gevulde knop
```

Nooit een kale hex in de tekening zelf. Zet ze als variabelen bovenin en
verwijs ernaar, dan kun je later één donkere stand toevoegen zonder de tekening
aan te raken.

### Lettertypes

Twee, en niet meer:

- **Caveat**, gewicht 700 — koppen, knoppen, alles wat een handschrift moet zijn
- **Patrick Hand** — lopende tekst, bijschriften

Allebei van Google Fonts. Zit je op een plek die niet naar buiten mag praten
(een artifact, een offline app), sluit ze dan in als `data:`-URI in een
`@font-face`, anders val je stilletjes terug op Arial en is de hele stijl weg.

### De twee filters

Plak deze onzichtbare SVG bovenin je pagina. Ze doen het echte werk: ze duwen
elke lijn een beetje uit het lood, alsof je hand trilde.

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

- `#wobble` gaat op **kaders en knoppen** — grote, rustige golving.
- `#wobble-rough` gaat op **tekeningen en icoontjes** — korter, korreliger.

Een lijn zonder filter valt meteen op als "door de computer getrokken".

---

## Hoe je tekent

De hele stijl zit in vier gewoontes. **Overdrijf ze** — te netjes is de fout die
iedereen maakt, te slordig heeft nog nooit iemand gestoord.

**1. Eén lijn per rand, niet één pad per vorm.** Een vierkant is vier losse
paden. Gebruik **nooit** `Z` om een vorm te sluiten: een gesloten contour is
precies wat een pen niet doet.

**2. Schiet door.** Laat elke lijn 5 tot 10 eenheden voorbij de hoek doorlopen,
zodat de lijnen elkaar zichtbaar **kruisen** en staartjes achterlaten. Op een
canvas van 240 eenheden is 5–10 goed; 1–2 leest als netjes bedoeld en mislukt.

**3. Ga er twee keer overheen — maar met de hand.** Elke belangrijke contour
schrijf je twee keer, met **eigen controlepunten**:

```html
<!-- eerste haal -->
<path d="M67.5 19.5 Q120 10.8 172 17.5 Q168.5 26 166 35 Q120 41.5 73 33.8"/>
<!-- tweede haal: andere punten, dunner en lichter -->
<path class="b" d="M70 17.4 Q118.5 13.2 169.5 19.4 Q167 27 164.8 33.6 Q121.5 39.4 75 34.8"/>
```
```css
.b{opacity:.62;stroke-width:1.35;}
```

Laat de twee halen 2 tot 4 eenheden uit elkaar lopen, en **verschillend over hun
lengte**: aan de ene kant verder uit elkaar dan aan de andere.

> **De valkuil die iedereen intrapt:** dupliceren met `<use>` en een `transform`.
> Dat geeft twee perfect parallelle contouren en leest als een fotokopie, niet
> als een pen die er twee keer overheen ging. Het is geprobeerd en afgekeurd.
> Schrijf de tweede haal echt opnieuw.

**4. Buig je rechte lijnen, en laat cirkels open.** Een cirkel is een lus die
voorbij zijn eigen begin doorloopt, met een tweede, kleinere lus erbinnen:

```html
<!-- in plaats van <circle cx="10.5" cy="10.5" r="6"/> -->
<path d="M14.4 8.1 Q17 11.6 14.2 14.6 Q11.1 16.9 7.6 14.9 Q4.8 12.3 6.5 8.5
         Q9 5.3 12.6 6.3 Q14.2 7 15 8.7"/>
```

Vervang zo élke `<circle>`, `<rect>` en `<ellipse>`. Die drie zijn de directe
verraders van "gemaakt door een machine".

### Maatgevoel

Op een canvas van 240 eenheden ziet een apparaat met **ongeveer 56 paden** er
goed uit. Kom je uit op elf, dan heb je clip-art getekend. Tel je paden.

### Kleine icoontjes: dezelfde grammatica, één uitzondering

Op 24×24 gelden dezelfde regels — één lijn per rand, geen `Z`, open cirkels —
met het doorschieten meegeschaald: **0,5 tot 1 eenheid**, dezelfde verhouding
als 5–10 op 240.

**Maar: geen tweede haal op dit formaat.** Twee lijnen 2 eenheden uit elkaar op
een canvas van 24 lopen op 20 pixels in elkaar en worden een vlek.

Stijl voor icoontjes:

```css
svg.ic{fill:none;stroke:var(--ink);stroke-width:1.7;stroke-linecap:round;
       stroke-linejoin:round;filter:url(#wobble-rough);}
```

**Nooit een emoji als icoon.** Niet als tussenoplossing, niet "voorlopig". Een
emoji naast handgetekende lijnen ziet eruit als een sticker op een schets.

### Vlakken vullen doe je met de pen

Er is bijna geen `fill` in deze stijl. Moet er tóch een donker vlak zijn — de
koffie in een kopje, een schaduw — dan **arceer** je dat: tien tot twintig
snelle, bijna-parallelle strepen die aan de randen ongelijk uitlopen, niet één
gevulde vorm. Alleen knoppen krijgen een echte vulling, en dan `--accent-soft`
met `--cream` erop.

---

## Als het een logo moet worden

Een logo in deze stijl is **een merk plus een handschrift**, meer niet.

- **Het merkteken**: één herkenbaar voorwerp uit het onderwerp, in zijaanzicht,
  in tien tot twintig lijnen. Geen scène, geen achtergrond, geen cirkel eromheen.
  Eén vlak mag gearceerd zijn — dat is het enige gewicht in de tekening.
- **Het woordmerk**: de naam in Caveat 700, links uitgelijnd, over twee of drie
  regels als de naam uit meerdere woorden bestaat. Niet gecentreerd, niet
  gesperd.
- **Verhouding**: het teken links, de tekst rechts, en het teken ongeveer even
  hoog als het hele tekstblok.
- **Kleur**: alleen `--ink`. Een logo dat in één kleur werkt, werkt overal.
- **Achtergrond**: doorzichtig laten. Nooit `--paper` er als vlak achter zetten,
  anders krijg je een lichte rechthoek op elke andere ondergrond.

Lever het aan als:

1. `logo.svg` — het origineel, met de filters erin ingesloten;
2. `logo.png` op 1024 px breed, doorzichtig — voor waar SVG niet mag;
3. een **vierkant** icoon van 512 × 512 waarin álleen het merkteken staat, ruim
   in het midden. Een woordmerk op een app-icoon is op een telefoon onleesbaar.

### Testen voor je hem oplevert

- Zet hem op **24 pixels** breed. Zie je nog wat het is? Zo nee: minder lijnen.
- Zet hem op **een donkere ondergrond** met `--ink` vervangen door `--paper`.
  Valt hij niet uit elkaar? Dan is hij goed.
- Zet hem **naast een systeemletter** (Arial). Als het handschrift het niet
  overduidelijk wint, staat je Caveat niet ingeladen.
- Kijk of `stroke-width` niet meeschaalt waar dat niet hoort: zet
  `vector-effect:non-scaling-stroke` op lijnen die op elk formaat even dik
  moeten blijven.

---

## Twee dingen die stilletjes misgaan

**Tekst binnen een SVG die meeschaalt.** Lettergroottes tellen daar in
canvas-eenheden, niet in schermpixels. Zoom je in of verander je de `viewBox`,
dan groeit je tekst mee tot één woord het hele beeld vult. Reken de maat na elke
zoomstap terug uit de verhouding tussen kijkvenster en kader, of houd tekst
gewoon buiten de SVG.

**Een `<button>` zonder eigen `color` en `font`.** Die pakt de systeemkleur van
de browser; op een iPhone wordt je tekst dan blauw en valt buiten de stijl. Elke
knop krijgt `color:var(--ink);font:inherit`.

---

## Wat ik terug wil

De SVG als bestand, plus één regel per keuze die je maakte: wat het merkteken
voorstelt en waarom dat, en hoeveel paden erin zitten. Laat me hem zien op drie
formaten — 24 px, 120 px en groot — in één beeld naast elkaar, zodat ik in één
blik zie of hij klein nog werkt.
