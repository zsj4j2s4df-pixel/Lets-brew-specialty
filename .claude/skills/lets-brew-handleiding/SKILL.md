---
name: lets-brew-handleiding
description: Werk de uitlegpagina (handleiding) van Lets Brew Specialty bij en publiceer hem opnieuw op dezelfde artifact-link. Gebruik deze skill zodra de gebruiker vraagt om de handleiding, de uitleg, de uitlegpagina, de handleiding bijwerken, "de uitleg klopt niet meer", "update the manual", een link om door te sturen over de app, of nadat er een zichtbare wijziging aan de app is gemaakt die uitleg nodig heeft — ook als de gebruiker het woord "handleiding" niet gebruikt.
---

# Handleiding van Lets Brew Specialty bijwerken

De handleiding is één HTML-pagina die als artifact gepubliceerd staat en die de
gebruiker doorstuurt naar nieuwe gebruikers. Deze skill werkt die pagina bij en
publiceert hem op **dezelfde URL**, zodat eerder verstuurde links blijven werken.

## Wanneer NIET

- Een nieuwe, andere uitlegpagina maken (deel-pagina, poster, presentatie) — dat
  is een nieuw artifact, niet deze.
- De app zelf aanpassen — gebruik daarvoor `lets-brew-house-style`.

## Vaste gegevens

| | |
|---|---|
| bron | `docs/handleiding.html` in deze repo |
| artifact-URL | `https://claude.ai/code/artifact/de05d674-670e-4ea2-8b72-0b946c5208a4` |
| favicon | `☕` (nooit veranderen — de gebruiker vindt zijn tab aan het icoon) |
| taal | Nederlands, ook de code-commentaren |

## Inputs

- Wat er aan de app veranderd is. Staat dat niet in het gesprek, kijk dan naar
  `git log --oneline -15` en lees de commits sinds de laatste handleiding-update.
- Twijfel je of een wijziging in de handleiding hoort? Alleen opnemen wat een
  **nieuwe gebruiker** moet weten om de app te kunnen gebruiken. Interne
  opschoning en bugfixes horen er niet in.

## Stappen

1. Lees de structuur van de bron zonder het hele bestand in te laden — het is
   ~230 KB, met base64 fonts en logo op enkele regels:

   ```sh
   awk '{ if (length($0)>300) printf "%d: [lang, %d tekens]\n", NR, length($0);
          else if (length($0)>0) printf "%d: %s\n", NR, $0 }' docs/handleiding.html
   ```

   Dit vervangt elke base64-regel door één telregel; wat overblijft is de hele
   pagina, met de echte regelnummers ervoor. Filter niet met `sed -n 'X,Yp'` —
   dat telt de regels van de uitvoer, niet die van het bestand.

2. Bepaal per wijziging waar hij hoort. De pagina heeft drie genummerde delen:

   - **deel 1 — De app zonder AI**: alles wat zonder API-sleutel werkt. Bevat de
     overzichtstabel (home / brews / beans / learn / profile) en `h3`-kopjes.
   - **deel 2 — Met de AI erbij**: één `ul` met wat de AI-knoppen doen.
   - **deel 3 — Een API-sleutel**: aanmaken, veilig bewaren, kosten. Raakt bijna
     nooit aan een appwijziging.

   Werkt iets zonder AI, dan hoort het in deel 1 — ook als de AI het óók gebruikt.

3. Pas de bron aan met een Python-script met `assert` op elk anker. Nooit het
   hele bestand herschrijven, en nooit een `replace` zonder telling: een stille
   mislukking is hier niet te zien.

   ```python
   s = open('docs/handleiding.html', encoding='utf-8').read()
   def rep(old, new, cnt=1):
       global s
       assert s.count(old) == cnt, (s.count(old), old[:70])
       s = s.replace(old, new)
   rep('<oude regel>', '<nieuwe regel>')
   open('docs/handleiding.html','w',encoding='utf-8').write(s)
   ```

4. Zet de datum onderaan op vandaag:
   `<div class="small" style="margin-top:8px">bijgewerkt <dag maand jaar></div>`
   (bijvoorbeeld `bijgewerkt 30 juli 2026`).

5. Controleer in Chromium vóór publiceren:

   ```sh
   npm install playwright --no-save
   NODE_PATH=$PWD/node_modules node -e "…chromium.launch({executablePath:'/opt/pw-browsers/chromium'})…"
   rm -rf node_modules package-lock.json
   ```

   Kijk of de nieuwe kopjes in `document.querySelectorAll('h3')` staan, of er geen
   `pageerror` komt, en maak een screenshot van het gewijzigde stuk.

6. Publiceer met de `Artifact`-tool: `file_path` = `docs/handleiding.html`,
   `url` = de artifact-URL hierboven, `favicon` = `☕`, en een `description` van
   één zin. Geef `label` mee met een paar woorden over wat er veranderde, zodat
   de versiekiezer leesbaar blijft.

7. Commit `docs/handleiding.html` mee op de werkbranch.

## Als publiceren een conflict geeft

De tool weigert met *"This session hasn't viewed the latest version"* zodra de
sessie het artifact niet zelf gepubliceerd heeft. `WebFetch` op een
artifact-URL geeft in deze omgeving **403**, dus lezen lukt niet.

Doe dan dit, in deze volgorde:

1. Controleer of `docs/handleiding.html` echt de laatst gepubliceerde versie is:
   `git log --oneline -- docs/handleiding.html`. Is er sinds de laatste publicatie
   niets aan gewijzigd buiten de repo om, dan is de bron leidend.
2. Publiceer opnieuw met `force: true`.
3. **Zeg in het antwoord dat je hebt overschreven zonder de gepubliceerde versie
   te kunnen lezen**, en waarop je baseert dat dat veilig was. Nooit stilzwijgend
   forceren.

## Huisstijl van de pagina

Dezelfde hand-getekende stijl als de app; de tokens staan bovenin het bestand.
Gebruik de bestaande klassen, verzin er geen nieuwe:

| klasse | waarvoor |
|---|---|
| `.card.solid` | een kadertje met een `h4` erin, voor iets dat je niet mag missen |
| `.warn` | gestippeld kader met uitroeptekens, alleen voor echte waarschuwingen |
| `.small` | grijze bijzin onder een alinea |
| `kbd` | een knop zoals hij in de app heet: `<kbd>＋ new brew</kbd>` |
| `.path` | een route door de app: `<span class="path">profile → features</span>` |
| `.steps` | genummerde stappen (`ol`) |

Schrijf zoals de rest van de pagina: korte zinnen, je-vorm, geen uitroeptekens,
geen emoji. Leg uit *waarom* iets zo werkt als dat de gebruiker helpt — de pagina
legt bijvoorbeeld uit waarom een maalstand in woorden staat en niet in klikken.

## Regels

- **Alleen de bron in de repo bewerken.** Een kopie in een sessiemap verdwijnt
  met de sessie; dat is precies waarom de bron nu in `docs/` staat.
- **Favicon en titel gelijk houden.** Een ander icoon leest als een andere pagina.
- **Nooit een nieuwe URL maken** voor een update. Zonder `url` mint de tool een
  nieuwe link en werken doorgestuurde links niet meer.
- Als een wijziging de handleiding op meerdere plekken raakt (bv. een nieuw veld
  dat zowel in de tabel als in een `h3` hoort), werk ze allebei bij — een half
  bijgewerkte handleiding is verwarrender dan een verouderde.

## Voorbeeld

**Input:** "Ik heb roast level aan de bonen toegevoegd en de app rekent daarmee
een startpunt voor de maalstand uit. Werk de handleiding bij."

**Output:** in deel 1 de `beans`-regel van de overzichtstabel aangevuld met
`roast level`, plus een nieuw `h3`-blok *Waar je maalstand begint* met een `ul`
van drie bronnen (deze boon → zelfde branding/proces → vanaf je vorige zak) en
een `.small` die uitlegt waarom het verschil in woorden staat. Datum onderaan
bijgewerkt, in Chromium gecontroleerd, gepubliceerd op dezelfde URL, en
`docs/handleiding.html` gecommit.
