# Onderhoud van de aanwijs-laag

Lees dit alleen als je `annotate.html` of `build-review.py` aanpast.
Voor het geven van de nakijkversie of het afwerken van een opdracht heb
je het niet nodig.

## Hoe de laag werkt

- De knop rechtsonder zet **aanwijzen** aan en uit. Uit is de app gewoon
  bruikbaar (`pointer-events:none` op het vel); aan vangt het vel elke tik af,
  zodat aanwijzen geen knoppen indrukt, en verschijnt de gereedschapsbalk.
- Vier gereedschappen (`gereed`): `pin` (tikken), `pijl` en `dubbel` (slepen),
  `lijn` (omcirkelen, bewaart alle punten in `m.p`).
- De knop linksonder toont het aantal punten en opent het overzicht: één blok
  per opdracht, met al zijn plekken erboven en één tekstveld eronder.
- *maak de opdracht* zet alles om in het tekstblok, met een kopieerknop.

## Twee lijsten, geen één

`marks` zijn de tekeningen, `opdr` zijn de opdrachten. Ze hangen samen via
`m.grp === o.n`:

```js
marks = [{grp,soort,pag,x,y,x2,y2,p,anker,anker2}]
opdr  = [{n,tekst}]
```

Eén opdracht kan dus **meerdere** markeringen hebben, ook op verschillende
pagina's. Dat is de hele reden dat de gebruiker geen "zie punt 6" meer hoeft te
schrijven. `+ nog een plek` zet `bijGroep`; zolang die staat pakt `voegToe()`
dat nummer in plaats van `nieuwNummer()`. `kleur(n)` geeft elk nummer een vaste
kleur uit `PALET` (5 kleuren, daarna herhalen), zodat één opdracht overal
dezelfde kleur heeft.

Let op bij het slepen: `bezig` krijgt alvast een `grp` om in de goede kleur te
tekenen, maar die wordt bij het loslaten weggegooid (`delete b.grp`) zodat
`voegToe()` beslist. Vergeet je dat, dan telt elke halve sleep als nieuw punt.

## Regels die er echt toe doen

- **Punten horen bij een pagina.** Ze worden alleen getekend als die pagina in
  beeld is; een `setInterval` van 220 ms kijkt of `currentPage` veranderd is.
- **Bewaren in de inhoud van het scrollende vlak, niet in het scherm.**
  `.phone` staat op `overflow:hidden` en scrollt nóóit; wat scrolt is de
  `.screen` ván de pagina die in beeld is, en elke pagina heeft een eigen.
  Reken je tegen `.phone`, dan plakken de punten aan het scherm en schuift de
  app eronder weg — precies wat er misging in de eerste versie. Een punt is dus
  `y = clientY − screenTop + screen.scrollTop`, en `zetShift()` zet de `<g>`
  terug op zijn plek. Scroll-events bubbelen niet, dus luisteren in de
  **capture-fase**: `phone.addEventListener('scroll', zetShift, {capture:true})`.
- **Het anker is het waardevolste stukje.** `ankerOp()` loopt van het binnenste
  element naar buiten en pakt het eerste korte label. Gebruik `innerText`, niet
  `textContent` — die laatste plakt losse spans aan elkaar tot
  `"surprise mea surprise brew with..."`. Alleen de eerste regel, max 45 tekens.
- **De laag hoort in `.phone`**, niet in `body`: hij moet meeschuiven met het
  telefoonkader en boven de navigatiebalk blijven.
- **De foto is een `<foreignObject>` op een canvas**, en dat gaat op precies
  twee manieren mis. Serialiseren moet met `XMLSerializer` — `outerHTML` levert
  HTML op, dat is geen geldige XML, en het plaatje laadt dan zonder foutmelding
  gewoon niet. En de afbeelding moet via een **`data:`-URL** binnenkomen: een
  `blob:`-URL besmet het canvas, waarna `toDataURL()` een `SecurityError`
  gooit. Verder: een gekloond invoerveld draagt zijn waarde in een *property*,
  niet in een attribuut, dus zonder `zetWaarden()` staat alles wat hij intikte
  niet op de foto.
- **Lang indrukken botst met slepen.** `pointerdown` zoekt met `raakt()` een
  markering onder de vinger en zet een timer van 380 ms; beweegt de vinger
  vóór die tijd meer dan 8 px, dan gaat de timer eruit en is het gewoon een
  sleep. Zonder die drempel kun je niets meer tekenen bovenop wat er al staat.
  `raakt()` meet bij pijlen de afstand tot het **lijnstuk**, niet tot de
  uiteinden.

## Testen vóór publiceren

De artifact-host levert zelf `<html>`/`<head>`/`<body>`; bouw dus eerst een
preview met die wikkel eromheen, anders test je iets anders dan de gebruiker
krijgt. Draai in Chromium op 390×844 en loop na:

1. app laadt, `currentPage` is `home`, geen `pageerror`
2. met de laag **uit** werkt navigeren gewoon (`go('brews')`)
3. met de laag **aan**: twee punten op home, dan naar `beans` — daar staan
   **nul** punten; terug naar home en het zijn er weer twee
4. elk gereedschap één keer: pijl, dubbele pijl en omcirkeling verschijnen, met
   een genummerd bolletje in de kleur van hun opdracht
5. **groeperen**: zet een punt, druk op *+ nog een plek*, teken een pijl —
   `opdr` blijft 1 lang en beide markeringen hebben `grp === 1`. Na *klaar*
   krijgt de volgende markering nummer 2
6. **lang indrukken**: snel slepen over een bestaand punt verplaatst niets;
   380 ms vasthouden en dán slepen verplaatst hem wél, en `marks.length`
   verandert niet
7. **de punten blijven aan de inhoud hangen**: zet een punt, scroll de `.screen`
   260 px, en het punt moet exact 260 px meeschuiven. Zet daarna een punt op een
   al gescrolde pagina — dat moet onder de vinger landen, niet verschoven
8. **foto**: zet een punt, druk op 📷 — `window.__ann.fotos()[0].png` begint met
   `data:image/png`, `nrs` bevat dat punt, en de hoogte is de hele pagina, niet
   die van het scherm. Sla hem op en kijk ernaar: de nummers moeten op dezelfde
   plek staan als in de app
9. *maak de opdracht* levert **echte regeleinden**, geen letterlijke `\n` (die
   bug is er al eens in geslopen door dubbel escapen in een patch-script), en de
   plekregels kloppen: `verbindt «X» ↔ «Y»`, `van «X» naar «Y»`, extra plekken
   met `+` ervoor, foto's als `📷 foto 1 — punten 1 en 2 staan erop`

Punten 5, 6 en 8 lees je niet uit de DOM — de code zit in een IIFE. Gebruik het
haakje `window.__ann`: `marks()`, `opdr()`, `fotos()`, `foto()` en `kies('pijl')`
om van gereedschap te wisselen zonder op de balk te klikken. Twee valkuilen in
de testronde zelf: Playwright's `click()` scrollt, dus een `boundingBox()` van
vóór de klik klopt daarna niet meer, en de foto móet je over `http://` testen —
op `file://` is de herkomst leeg en besmet zelfs een `data:`-URL het canvas.
