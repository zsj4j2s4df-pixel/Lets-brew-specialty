---
name: wijzigingen-aanwijzen
description: De nakijkversie van Lets Brew bouwen en publiceren — de hele app als artifact met een laag om aan te wijzen, te omcirkelen en per punt uit te leggen wat er anders moet — én een teruggeplakte opdracht punt voor punt afwerken. Gebruik deze skill zodra de gebruiker vraagt om de nakijkversie, de aanwijs-versie, "een versie waarin ik kan aanwijzen", door de app heen wil lopen om wijzigingen door te geven, visueel wil doorgeven wat er moet veranderen, of een tekst plakt die begint met "Opdracht voor Lets Brew" — ook als hij het woord skill of artifact niet gebruikt.
---

# Nakijkversie van Lets Brew

Twee taken, en je kiest er precies één per keer:

- **Vraagt de gebruiker om de versie waarin hij kan aanwijzen** → doe deel A.
- **Plakt de gebruiker een tekst die begint met `Opdracht voor Lets Brew`** →
  doe deel B.

## Wanneer NIET

- De app aanpassen zonder geplakte opdracht — dat is `lets-brew-house-style`.
- De uitlegpagina bijwerken — dat is `lets-brew-handleiding`.

## Vaste gegevens

| | |
|---|---|
| bouwer | `.claude/skills/wijzigingen-aanwijzen/build-review.py` |
| de laag | `.claude/skills/wijzigingen-aanwijzen/annotate.html` |
| artifact-URL | `https://claude.ai/code/artifact/dae0ee9a-ee5d-4514-90b3-c945a5612446` |
| favicon | `✏️` (nooit veranderen — de gebruiker vindt zijn tab aan het icoon) |
| werkbranch | `claude/app-customization-x6qg4o` |
| taal | Nederlands, ook de code-commentaren |

---

# Deel A · de nakijkversie geven

1. Draai vanuit de repo-root:

   ```sh
   python3 .claude/skills/wijzigingen-aanwijzen/build-review.py
   ```

   Dat bouwt de zelfstandige app (fonts en tekeningen ingebed), zet de titel op
   *Lets Brew — nakijken*, kort de splash in tot 0,3 s en plakt de aanwijs-laag
   erachter. Resultaat: `/tmp/lets-brew-review.html`.

2. Publiceer dat bestand met de `Artifact`-tool op de **bestaande** URL
   hierboven, met `favicon` = `✏️`.

3. Bouw altijd opnieuw vóór publiceren, ook als de URL al bestaat. Anders kijkt
   de gebruiker naar een oude versie van de app.

4. Zeg er elke keer deze twee dingen bij:
   - de nakijkversie heeft **eigen opslag**, los van de echte app: wat hij hier
     invoert of weggooit raakt zijn echte bonen en brews niet
   - **AI-knoppen werken hier niet** (een artifact mag niet naar buiten praten)

---

# Deel B · een geplakte opdracht afwerken

De opdracht ziet er zo uit:

```
Opdracht voor Lets Brew — 3 punten

── brews ──
1. bij «＋ new brew»
   sorteerbalk standaard verbergen
```

De paginanaam is de `currentPage` van de app, dus `brews` betekent letterlijk
`page-brews`. De tekst tussen « » is het label van het element waarop de
gebruiker wees — zoek daarop in `index.html` en je zit meteen goed.

Werk hem zo af, in deze volgorde:

1. **Zet elk punt als aparte taak** met `TaskCreate`, in dezelfde volgorde, met
   de paginanaam erin. Bijvoorbeeld: `brews · sorteerbalk standaard verbergen`.
   Verwijst een punt naar een ander ("zie punt 6"), maak er dan **één** taak van
   met beide nummers erin, en noteer dat in de taaknaam.

2. **Werk ze één voor één af.** Zet de taak op `in_progress` voor je begint en
   op `completed` als hij klaar is. Nooit twee tegelijk op `in_progress`.

3. **Sla een punt over dat je niet zeker weet** — gok niet. Laat die taak open,
   maak alle andere punten volledig af, en vraag aan het eind alleen over díe
   punten iets. Vraag nooit over de hele opdracht als er maar één punt onduidelijk
   is.

4. **Eén release voor de hele opdracht, niet één per punt.** Als alle punten
   klaar zijn: één keer de service worker bumpen (`scc-vNN` → `NN+1`), één keer
   testen in Chromium, één commit met alle punten in de tekst, en pas naar `main`
   als de gebruiker zegt dat het live mag.

5. **Meld per punt kort wat je deed**, met het nummer erbij, zodat de gebruiker
   zijn eigen lijst kan aflopen. Noem apart wat je hebt overgeslagen en waarom.

Een omcirkeling zonder tekst is alleen een aanwijzing waar te kijken. Vraag
ernaar; ga er niet zelf iets bij verzinnen.

---

## De tool zelf verbouwen

Alleen nodig als je `annotate.html` of `build-review.py` aanpast — niet voor
deel A of deel B. Lees dan eerst
`references/onderhoud.md`: daarin staat hoe de laag werkt, de vier regels waar
het echt op vastloopt, en de testronde die je vóór publiceren draait.

## Voorbeelden

**Input:** "Geef me de versie waarin ik kan aanwijzen."
**Output:** `build-review.py` gedraaid, `/tmp/lets-brew-review.html` opnieuw
gepubliceerd op de bestaande URL, met de link en de twee waarschuwingen (eigen
opslag, geen AI).

**Input:** een geplakte tekst die begint met `Opdracht voor Lets Brew — 7 punten`
**Output:** zeven taken aangemaakt (of minder als punten naar elkaar verwijzen),
één voor één afgewerkt, één service-worker-bump, één commit, en een antwoord dat
per nummer zegt wat er gebeurd is — plus een vraag over alleen de punten die
onduidelijk waren.
