---
name: wijzigingen-aanwijzen
description: Bouw en publiceer de nakijkversie van Lets Brew — de hele app als artifact, met een laag eroverheen om aan te wijzen, te omcirkelen en per punt uit te leggen wat er anders moet. Gebruik deze skill zodra de gebruiker vraagt om de nakijkversie, de aanwijs-versie, "een versie waarin ik kan aanwijzen", door de app heen wil lopen om wijzigingen door te geven, visueel wil doorgeven wat er moet veranderen, of terugkomt met een geplakte "Opdracht voor Lets Brew" — ook als hij het woord skill of artifact niet gebruikt.
---

# De nakijkversie van Lets Brew

De hele app als artifact, met een aanwijs-laag eroverheen. De gebruiker loopt
erdoorheen op zijn telefoon, tikt aan wat er anders moet, omcirkelt en typt er
uitleg bij, en plakt daarna één opdracht terug in de chat.

Waarom in de app en niet op schermafbeeldingen: doordat de laag ín de app zit
weet elk punt op **welke pagina** het staat en op **welk element** je wees. Dat
levert een opdracht op waar direct mee te werken valt.

## Wanneer NIET

- De app zelf aanpassen — dat is `lets-brew-house-style`.
- De uitlegpagina bijwerken — dat is `lets-brew-handleiding`.

## Vaste gegevens

| | |
|---|---|
| bouwer | `.claude/skills/wijzigingen-aanwijzen/build-review.py` |
| de laag | `.claude/skills/wijzigingen-aanwijzen/annotate.html` |
| artifact-URL | `https://claude.ai/code/artifact/dae0ee9a-ee5d-4514-90b3-c945a5612446` |
| favicon | `✏️` (nooit veranderen — de gebruiker vindt zijn tab aan het icoon) |
| taal | Nederlands, ook de code-commentaren |

## Vragen om de nakijkversie

1. Draai vanuit de repo-root:

   ```sh
   python3 .claude/skills/wijzigingen-aanwijzen/build-review.py
   ```

   Die bouwt eerst de zelfstandige preview (fonts en tekeningen ingebed) met
   het script uit `lets-brew-house-style`, zet de titel op *Lets Brew —
   nakijken*, kort de splash in tot 0,3 s, en plakt de aanwijs-laag erachter.
   Resultaat: `/tmp/lets-brew-review.html`.

2. Publiceer dat bestand met de `Artifact`-tool op de **bestaande** URL
   hierboven, met `favicon` = `✏️`.

3. Bouw hem altijd opnieuw vóór publiceren, ook als de URL al bestaat — anders
   kijkt de gebruiker naar een oude versie van de app.

4. Zeg er twee dingen bij, elke keer:
   - de nakijkversie heeft **eigen opslag**, los van de echte app: wat hij hier
     invoert of weggooit raakt zijn echte bonen en brews niet
   - **AI-knoppen werken hier niet** (een artifact mag niet naar buiten praten)

## Wat de gebruiker terugstuurt

Eén tekstblok, gegroepeerd per pagina:

```
Opdracht voor Lets Brew — 3 punten

── home ──
1. bij «a surprise brew with a bean from your shelf»
   deze knop mag weg

── brews ──
2. bij «＋ new brew»
   sorteerbalk standaard verbergen

── profile ──
3. bij «my gear»
   minder ruimte hier
(1 omcirkeld op deze pagina)
```

Lees dit als een werklijst. De paginanaam is de `currentPage` van de app zelf,
dus `brews` betekent letterlijk `page-brews`. De tekst tussen « » is het label
van het element waarop hij wees — zoek daarop in `index.html` en je zit meteen
goed. Een omcirkeling zonder tekst is alleen een aanwijzing waar te kijken;
vraag ernaar als de bedoeling niet duidelijk is.

Loop de punten in volgorde af en behandel ze als losse opdrachten. Zit er iets
tussen dat je niet zeker weet, vraag dát ene punt na in plaats van alles.

## Hoe de laag werkt

- De knop rechtsonder zet **aanwijzen** aan en uit. Uit is de app gewoon
  bruikbaar (`pointer-events:none` op het vel); aan vangt het vel elke tik af,
  zodat aanwijzen geen knoppen indrukt.
- Korte tik = genummerd punt. Slepen = omcirkeling.
- De knop linksonder toont het aantal punten en opent het overzicht, per
  pagina gegroepeerd, met een tekstveld per punt. Op een nummer tikken springt
  naar die pagina.
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
5. **de punten blijven aan de inhoud hangen**: zet een punt, scroll de
   `.screen` 260 px, en het punt moet exact 260 px meeschuiven. Zet daarna een
   punt op een al gescrolde pagina — dat moet onder de vinger landen, niet
   verschoven
6. *maak de opdracht* levert **echte regeleinden**, geen letterlijke `\n`
   (die bug is er al eens in geslopen door dubbel escapen in een patch-script)

## Voorbeeld

**Input:** "Geef me de versie waarin ik kan aanwijzen."

**Output:** `build-review.py` gedraaid, `/tmp/lets-brew-review.html` opnieuw
gepubliceerd op de bestaande URL, met de link en de twee waarschuwingen (eigen
opslag, geen AI). Daarna wachten op het geplakte opdrachtblok.
