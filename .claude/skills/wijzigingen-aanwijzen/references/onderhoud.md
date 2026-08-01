# Onderhoud van de aanwijs-laag

Lees dit alleen als je `annotate.html` of `build-review.py` aanpast.
Voor het geven van de nakijkversie of het afwerken van een opdracht heb
je het niet nodig.

## Hoe de laag werkt

- De knop rechtsonder zet **aanwijzen** aan en uit. Uit is de app gewoon
  bruikbaar (`pointer-events:none` op het vel); aan vangt het vel elke tik af,
  zodat aanwijzen geen knoppen indrukt.
- Korte tik = genummerd punt. Slepen = omcirkeling.
- De knop linksonder toont het aantal punten en opent het overzicht, per pagina
  gegroepeerd, met een tekstveld per punt. Op een nummer tikken springt naar die
  pagina.
- *maak de opdracht* zet alles om in het tekstblok hierboven, met een
  kopieerknop.

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

## Testen vóór publiceren

De artifact-host levert zelf `<html>`/`<head>`/`<body>`; bouw dus eerst een
preview met die wikkel eromheen, anders test je iets anders dan de gebruiker
krijgt. Draai in Chromium op 390×844 en loop na:

1. app laadt, `currentPage` is `home`, geen `pageerror`
2. met de laag **uit** werkt navigeren gewoon (`go('brews')`)
3. met de laag **aan**: twee punten op home, dan naar `beans` — daar staan
   **nul** punten; terug naar home en het zijn er weer twee
4. slepen geeft een omcirkeling
5. **de punten blijven aan de inhoud hangen**: zet een punt, scroll de `.screen`
   260 px, en het punt moet exact 260 px meeschuiven. Zet daarna een punt op een
   al gescrolde pagina — dat moet onder de vinger landen, niet verschoven
6. *maak de opdracht* levert **echte regeleinden**, geen letterlijke `\n` (die
   bug is er al eens in geslopen door dubbel escapen in een patch-script)
