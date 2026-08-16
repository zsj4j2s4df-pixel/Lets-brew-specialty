# Opdracht: bouw een aanwijs-laag voor deze app

Ik wil door mijn eigen app kunnen lopen, met mijn vinger aanwijzen wat er anders
moet, en er een opdracht uit krijgen waar jij direct mee kunt werken. Bouw dat.

Dit heeft zich in een ander project bewezen; hieronder staat wat het moet doen
én de plekken waar het in de praktijk op vastliep. Sla die regels niet over —
het zijn er zes en ze kosten anders allemaal een ronde.

---

## Waarom ín de app en niet op een schermafbeelding

Een screenshot met een pijl erop levert jou coördinaten op. Een aanwijzing ín de
app levert **de pagina** en **het label van het element** op:

```
bij «＋ new brew»  [op de pagina brews]
```

Daar kun jij meteen op zoeken in de broncode. Dat is het hele punt.

---

## Wat je maakt

Drie bestanden in `.claude/skills/wijzigingen-aanwijzen/`:

| bestand | wat het is |
|---|---|
| `annotate.html` | de laag zelf: één `<style>` + één `<script>` in een IIFE, verder niets |
| `build-review.py` | plakt de app en de laag aan elkaar tot één bestand |
| `SKILL.md` | wanneer jij dit gereedschap gebruikt, en hoe je een teruggeplakte opdracht afwerkt |

Plus per project een `.claude/wijzigingen-aanwijzen.json`:

```json
{
  "app_file": "index.html",
  "artifact_url": null,
  "favicon": "✏️",
  "preview_builder": null,
  "title_note": " — nakijken"
}
```

`artifact_url` vul je in nadat je de eerste keer gepubliceerd hebt, zodat elke
volgende versie op dezelfde link komt en doorgestuurde links blijven werken.
`preview_builder` wijst naar een eigen scriptje dat van de app één zelfstandig
HTML-bestand bakt (fonts en plaatjes als `data:`-URI), en heb je alleen nodig
als de app dingen van buitenaf laadt — een artifact kan daar niet bij.

---

## De laag: wat de gebruiker ermee kan

Een knop rechtsonder zet **aanwijzen** aan en uit. Uit is de app gewoon
bruikbaar (`pointer-events:none` op het vel); aan vangt het vel elke tik af,
zodat aanwijzen geen knoppen indrukt.

Vier gereedschappen:

| gereedschap | doen | levert op |
|---|---|---|
| **aanwijzen** | tikken | `bij «label»` |
| **pijl** | slepen | `van «label» naar «label»` |
| **dubbele pijl** | slepen | `verbindt «label» ↔ «label»` |
| **omcirkel** | omheen slepen | `omcirkeld bij «label»` |

Een knop linksonder toont het aantal punten en opent een overzicht: één blok per
punt, met zijn plekken erboven en één tekstveld eronder. Onderin *maak de
opdracht*, die alles omzet in één tekstblok met een kopieerknop.

Twee dingen die het echt bruikbaar maken:

- **Eén punt kan meerdere plekken hebben.** Onder elk punt staat *+ nog een
  plek*; alles wat daarna getekend wordt krijgt hetzelfde nummer en dezelfde
  kleur, ook op een andere pagina. Daarmee vervalt "zie punt 6", dat één
  opdracht over losse regels uitsmeerde.
- **Lang indrukken op een markering en dan schuiven** verplaatst hem, voor als
  je net naast het goede element zat.

Elk punt krijgt een vaste kleur uit een palet van vijf; hetzelfde nummer heeft
overal dezelfde kleur.

Er is ook een **📷 foto**-knop: die legt de hele pagina vast waar je op staat,
ook het stuk onder de schermrand, mét de gekleurde nummers erop. Foto's komen
bovenin het overzicht; aantikken maakt ze groot, en daar bewaar je ze in je
fotorol om in de chat mee te sturen.

---

## Twee lijsten, geen één

```js
marks = [{grp, soort, pag, x, y, x2, y2, p, anker, anker2}]   // de tekeningen
opdr  = [{n, tekst}]                                          // de opdrachten
```

Ze hangen samen via `m.grp === o.n`. Eén opdracht kan dus meerdere markeringen
hebben, ook op verschillende pagina's. *+ nog een plek* zet een `bijGroep`;
zolang die staat pakt het toevoegen dat nummer in plaats van een nieuw nummer.

Let op bij slepen: geef het bezige element alvast een groep om in de goede kleur
te tekenen, maar **gooi die weg bij het loslaten** zodat de toevoeg-functie
beslist. Vergeet je dat, dan telt elke halve sleep als nieuw punt.

---

## De zes regels waar het echt op vastloopt

**1. Punten horen bij een pagina.** Teken ze alleen als die pagina in beeld is.
Houdt de app zelf bij welke pagina actief is (een variabele als `currentPage`),
gebruik dat; anders kijk je welk element met `id^="page-"` zichtbaar is. Een
`setInterval` van ~220 ms die kijkt of dat veranderd is, is genoeg.

**2. Bewaar in de inhoud van het scrollende vlak, niet in het scherm.** Dit is
de grootste valkuil. Reken je een punt tegen de buitenste container, dan plakt
het aan het scherm en schuift de app eronder weg. Een punt is:

```js
y = clientY − schermTop + scherm.scrollTop
```

en je zet de SVG-groep bij elke scroll terug op zijn plek met een `translate`.
**Scroll-events bubbelen niet**, dus luister in de capture-fase:
`container.addEventListener('scroll', zetShift, {capture:true})`.

**3. Het anker is het waardevolste stukje.** Loop met `elementsFromPoint` van
het binnenste element naar buiten en pak het eerste korte label. Gebruik
`innerText`, **niet** `textContent` — die laatste plakt losse spans aan elkaar
tot `"surprise mea surprise brew with..."`. Neem alleen de eerste regel, maximaal
45 tekens. Kijk eerst naar `aria-label`, `placeholder` en `title`.

**4. De laag hoort in het app-kader, of anders in `body`.**
`document.querySelector('.phone') || document.body`. Zit de app in een
telefoonkader, dan moet de laag daarin meeschuiven. De **tekenlaag** blijft
`position:absolute` (die moet met de inhoud meescrollen), maar de **balk, het
overzicht en de fotoviewer** zetten op `position:fixed` — anders zakken die weg
onderaan een lange pagina.

**5. De foto is een `<foreignObject>` op een canvas, en dat gaat op precies twee
manieren mis.** Serialiseren moet met `XMLSerializer` — `outerHTML` levert HTML
op, dat is geen geldige XML, en het plaatje laadt dan zónder foutmelding gewoon
niet. En de afbeelding moet via een **`data:`-URL** binnenkomen: een `blob:`-URL
besmet het canvas, waarna `toDataURL()` een `SecurityError` gooit. Verder: een
gekloond invoerveld draagt zijn waarde in een *property*, niet in een attribuut
— zonder die waarden expliciet over te zetten staat alles wat er ingetypt was
niet op de foto.

**6. Lang indrukken botst met slepen.** Zoek bij `pointerdown` een markering
onder de vinger en zet een timer van 380 ms; beweegt de vinger vóór die tijd
meer dan 8 px, dan gaat de timer eruit en is het gewoon een sleep. Zonder die
drempel kun je niets meer tekenen bovenop wat er al staat. Meet bij pijlen de
afstand tot het **lijnstuk**, niet tot de uiteinden.

---

## Wat er uit moet komen

Dit is het formaat. Houd je er precies aan, want jij leest het straks zelf terug:

```
Opdracht voor <naam van de app> — 2 punten

── brews ──
1. bij «＋ new brew»
   sorteerbalk standaard verbergen

── form ──
2. verbindt «Hoffmann V60 · 18 g → 301 g» ↔ «gear»
   + bij «brewer»
   laat deze informatie samenwerken
📷 foto 1 — punt 2 staat erop
```

- gegroepeerd per pagina, met `── paginanaam ──` erboven
- extra plekken van hetzelfde punt eronder met `+` ervoor, en `[op <pagina>]`
  erachter als die plek op een andere pagina staat
- de naam van de app haal je uit `document.title` (het stuk vóór een streepje),
  niet hardgecodeerd
- **echte regeleinden**, geen letterlijke `\n` — die fout sluipt er zo in als je
  het bestand later met een patch-script aanpast

---

## Hoe jij zo'n teruggeplakte opdracht afwerkt

Zet dit in `SKILL.md`, want dit is de helft van de waarde:

1. **Zet elk punt als aparte taak**, in dezelfde volgorde, met de paginanaam
   erin. Eén nummer is altijd één taak, ook als er drie plekregels onder staan.
2. **Werk ze één voor één af.** Nooit twee tegelijk in behandeling.
3. **Sla een punt over dat je niet zeker weet** — gok niet. Laat die taak open,
   maak alle andere punten volledig af, en vraag aan het eind alleen over díe
   punten iets. Vraag nooit over de hele opdracht als er één punt onduidelijk is.
4. **Eén release voor de hele opdracht, niet één per punt.** Eén keer een
   cacheversie ophogen als het project die heeft, één keer testen, één commit
   met alle punten in de tekst.
5. **Meld per punt kort wat je deed**, met het nummer erbij, zodat de lijst af
   te vinken is. Noem apart wat je hebt overgeslagen en waarom.

Staat er `(nog geen uitleg)` onder een punt, dan is er wel iets aangewezen maar
niets ingetypt. Dat is alleen een aanwijzing wáár je moet kijken — vraag ernaar,
verzin er niets bij.

---

## De testronde vóór je publiceert

De artifact-host levert zelf `<html>`/`<head>`/`<body>`; bouw dus eerst een
preview mét die wikkel eromheen, anders test je iets anders dan ik krijg. Draai
in Chromium op 390×844 en loop na:

1. app laadt, geen `pageerror`
2. met de laag **uit** werkt navigeren gewoon
3. met de laag **aan**: twee punten op pagina A, dan naar pagina B — daar staan
   **nul** punten; terug naar A en het zijn er weer twee
4. elk gereedschap één keer: pijl, dubbele pijl en omcirkeling verschijnen, met
   een genummerd bolletje in de kleur van hun punt
5. **groeperen**: zet een punt, druk op *+ nog een plek*, teken een pijl — er is
   nog steeds één opdracht en beide markeringen delen zijn nummer
6. **lang indrukken**: snel slepen over een bestaand punt verplaatst niets;
   380 ms vasthouden en dán slepen verplaatst hem wél, en het aantal punten
   verandert niet
7. **punten blijven aan de inhoud hangen**: zet een punt, scroll 260 px, en het
   punt schuift exact 260 px mee. Zet daarna een punt op een al gescrolde pagina
   — dat moet onder de vinger landen, niet verschoven
8. **foto**: de PNG begint met `data:image/png`, bevat het punt, en is zo hoog
   als de hele pagina — niet als het scherm
9. *maak de opdracht* levert echte regeleinden en kloppende plekregels

Punten 5, 6 en 8 lees je niet uit de DOM, want de code zit in een IIFE. Hang er
een klein haakje aan (`window.__ann` met `marks()`, `opdr()`, `fotos()` en
`kies('pijl')`) zodat je kunt testen zonder op de balk te klikken.

Twee valkuilen in de testronde zelf: Playwright's `click()` scrollt, dus een
`boundingBox()` van vóór de klik klopt daarna niet meer. En de foto **moet** je
over `http://` testen — op `file://` is de herkomst leeg en besmet zelfs een
`data:`-URL het canvas.

---

## Hoe ik het ga gebruiken

Ik zeg "geef me de versie waarin ik kan aanwijzen". Dan bouw je opnieuw (altijd
opnieuw, ook als de link al bestaat, anders kijk ik naar een oude versie) en
publiceer je hem als artifact op dezelfde URL.

Zeg er elke keer bij dat de nakijkversie **eigen opslag** heeft, los van de
echte app, en dat **AI-knoppen er niet werken** als de app die heeft — een
artifact mag niet naar buiten praten.

Daarna loop ik erdoorheen, tik ik aan wat er anders moet, kopieer ik de opdracht
en plak ik hem hier terug. Dan begint jouw deel.
