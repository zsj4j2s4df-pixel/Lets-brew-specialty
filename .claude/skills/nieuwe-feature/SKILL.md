---
name: nieuwe-feature
description: Een nieuwe functie voor Lets Brew bedenken en als mockup-artifact laten zien, en hem daarna pas echt inbouwen. Gebruik deze skill zodra de gebruiker een idee voor een nieuwe functie oppert, vraagt "kan de app ook…", om een opzet, voorstel, schets, mockup of proefversie van een functie vraagt, wil meedenken over wat de app nog mist — of zegt dat een eerder bedachte functie nu gebouwd mag worden.
---

# Een nieuwe functie voor Lets Brew

Twee delen, en je kiest er precies één per keer:

- **Er is een idee, nog geen besluit** → deel A. Je bedenkt en tekent.
- **De gebruiker zegt dat het gebouwd mag worden** → deel B. Je bouwt.

Twijfel je? Dan is het deel A. Bouwen doe je nooit uit jezelf.

## De regel waar het op staat of valt

**In deel A raak je `index.html` niet aan.** Geen edit, geen commit aan de app,
geen service-worker-bump, en al helemaal geen merge naar `main`. Een opzet is
een artifact plus een stuk tekst — meer niet. Dit is eerder misgegaan; de
gebruiker vertrouwt erop dat zijn draaiende app blijft staan zolang hij nog
nadenkt.

## Vaste gegevens

| | |
|---|---|
| de app | `index.html` in de repo-root (één bestand, vanilla JS) |
| mockup-bouwer | `.claude/skills/nieuwe-feature/scripts/bouw-mockup.py` |
| werkbranch | `claude/app-customization-x6qg4o` |
| naar `main` | alleen als de gebruiker letterlijk zegt dat het live mag |
| taal | Nederlands tegen de gebruiker, Engels in de app zelf |

---

# Deel A · bedenken en tekenen

Vijf stappen. Sla er geen over.

### 1. Zoek uit wat de app al weet

Voor je iets verzint: kijk wat er al staat. Bijna elk goed idee voor deze app
is "de app weet dit al, dus vraag het niet nog een keer".

```sh
grep -n "const FEATURES" -A 30 index.html    # wat er al aan/uit kan
grep -n "^function render\|^function open" index.html | head -40
```

Kijk ook in `SCHEMA.md`: daar staat welke gegevens de app van de gebruiker
heeft (bonen, brews, gear, methodes, dial-in). Noem in je voorstel **welke van
die gegevens je gebruikt**. Een functie die iets vraagt wat de app al weet, is
een slechte functie.

### 2. Bedenk het, en denk één stap verder dan gevraagd

De gebruiker geeft je een richting, niet een ontwerp. Van jou wordt verwacht
dat je er iets aan toevoegt. Zeg altijd deze drie dingen:

- **wat je overneemt** van zijn idee
- **wat je anders zou doen, en waarom** — één duidelijk beter voorstel is meer
  waard dan vijf opties
- **wat er niet kan** — eerlijk. Een artifact mag niet naar buiten praten, dus
  live zoeken, prijzen of voorraad kunnen er niet in. Zeg dat, verzin het niet.

Vraag jezelf bij elke stap: kan de app dit zelf al invullen? Zo ja, vul het in
en laat de gebruiker corrigeren. Invullen is beter dan vragen.

### 3. Teken het — als schets of als werkend prototype

Kies eerst welke van de twee je maakt. Ze gebruiken dezelfde bouwer, maar het
zijn verschillende dingen:

| | **schets** | **werkend prototype** |
|---|---|---|
| wat het is | losse telefoonschermen naast elkaar | één app die je echt kunt gebruiken |
| wanneer | het idee staat nog niet vast | het idee is duidelijk, de details niet |
| knoppen | doen niets | doen echt iets |
| lezen op | een groot scherm, alles in één blik | een telefoon, zoals de app zelf |

**Twijfel je? Maak een schets.** Die is sneller, en je ziet in één blik of de
volgorde klopt. Een prototype maak je als de gebruiker erdoorheen moet kunnen
lopen, of als het gedrag (zoomen, slepen, rekenen) juist het punt is.

Bouw allebei met dezelfde bouwer:

```sh
python3 .claude/skills/nieuwe-feature/scripts/bouw-mockup.py <jouw-body.html> /tmp/mockup.html
```

Die zet de huisstijl, de lettertypes en de potloodfilters eromheen. Voor een
**schets** krijg je het telefoonkader er gratis bij. Voor een **prototype**
overschrijf je in je eigen `<style>` bovenaan de body drie dingen, zodat de
telefoon het hele scherm vult:

```css
body{padding:0;height:100dvh;overflow:hidden;}
.mk-wrap{max-width:430px;width:100%;margin:0;}
.phone{width:100%;max-width:430px;height:100dvh;border:none;border-radius:0;filter:none;}
```

Publiceer `/tmp/mockup.html` met de `Artifact`-tool. Elke nieuwe functie krijgt
een **eigen** artifact-URL — overschrijf de nakijkversie of de handleiding
nooit. Groeit een schets later uit tot een prototype, dan blijft dat dezelfde
URL: het is nog steeds dezelfde functie.

Eén valkuil die in beide standen bijt: een `<button>` zonder eigen `color` en
`font` pakt de systeemkleur van de browser. Op een iPhone wordt je tekst dan
blauw en valt hij buiten de huisstijl. Zet dus altijd
`color:var(--ink);font:inherit` op elke knop die je zelf maakt.

### 4. Bewaar de opzet in de repo

Zet je mockup-body neer als `docs/opzet-<naam>.html` en commit hem op de
werkbranch. Anders is hij weg zodra deze sessie stopt, en dan kan de gebruiker
er morgen niet meer op terugkomen.

### 5. Vertel het in gewone taal

In je antwoord: wat het is, hoe de stappen lopen, wat je anders deed en waarom,
en wat er niet in kan. Sluit af met de link. Vraag níét "zal ik het bouwen?" —
zeg dat het klaarstaat en dat hij het zegt wanneer het gebouwd mag worden.

---

# Deel B · inbouwen

Alleen wanneer de gebruiker het zegt. Lees dan `references/inbouwen.md` — daar
staat de volgorde, de featurevlag, en waar het misgaat. De korte versie:

1. Elke nieuwe functie krijgt een **eigen regel in `FEATURES`** en overal een
   `featOn('<id>')` eromheen. Standaard uit als hij nieuw of eigenwijs is.
2. Bouwen volgens `lets-brew-house-style` — die skill heeft de tokens, de
   tekenregels en de bouwvolgorde. Niet overtypen, gewoon volgen.
3. Nieuwe gegevens? Werk `SCHEMA.md` bij.
4. Eén release: service worker `scc-vNN` één keer bumpen, één keer testen in
   Chromium op 390×844, één commit op de werkbranch.
5. **Naar `main` alleen als hij zegt dat het live mag.**

---

## Voorbeelden

**Input:** "Kan de app me niet helpen kiezen welke zak ik koop?"
**Output:** deel A — gekeken wat de app al weet (methodes, smaaktags, scores),
een stappenplan bedacht waarin de app het meeste zelf invult, één duidelijke
verbetering op zijn idee uitgelegd, een mockup-artifact gepubliceerd op een
nieuwe URL, de body als `docs/opzet-bonenkeuzehulp.html` gecommit — en
`index.html` niet aangeraakt.

**Input:** "Mooi, bouw die keuzehulp maar."
**Output:** deel B — `FEATURES` uitgebreid met de vlag, gebouwd in huisstijl,
`SCHEMA.md` bijgewerkt, service worker gebumpt, getest, één commit op de
werkbranch. Niet naar `main`, want dat vroeg hij niet.
