# De datalaag van Lets Brew Specialty

Beans, brews en methods met hun koppelingen, in één vaste vorm. Bedoeld om
andere software op te kunnen aansluiten zonder dat die de binnenkant van de app
hoeft te kennen.

De app bewaart alles in IndexedDB op je eigen toestel. Deze laag verandert daar
niets aan: er gaat niets naar een server, en er is **niets van buitenaf te
schrijven**. Wat je hier ophaalt is een kopie — muteren doet niets met je
logboek. Nieuwe gegevens komen alleen binnen via de schermen zelf of via
*profile → add from a friend*.

## Versie

`schema: 1`. Bij een verandering die bestaande lezers breekt gaat dat nummer
omhoog; velden erbij mag binnen dezelfde versie. Controleer `schema` voordat je
de rest leest.

## Waar je erbij kan

### 1. `window.LetsBrew` — op dezelfde pagina

```js
LetsBrew.schema            // 1
LetsBrew.appVersion        // "2026.08"

LetsBrew.methods()         // alle zetmethodes
LetsBrew.beans()           // alle bonen
LetsBrew.recipes()         // ingebouwde recepten + die van jou
LetsBrew.gear()            // je molens, machines, brewers

LetsBrew.method(id)
LetsBrew.bean(id)
LetsBrew.brew(id)

LetsBrew.brews(filter)     // filter: {beanId, methodId, since, dialInOnly, limit}
LetsBrew.beanGraph(id)     // één boon met al zijn brews, methodes en dial-log
LetsBrew.graph()           // alles in één keer
```

`since` mag een ISO-string of een timestamp in ms zijn. Brews komen altijd
nieuwste eerst.

### 2. `postMessage` — vanuit een ander venster of een iframe

```js
frame.contentWindow.postMessage(
  { lb:'query', id:'1', method:'brews', arg:{ beanId:'abc', limit:10 } }, '*');

window.addEventListener('message', e => {
  if (e.data && e.data.lb === 'result' && e.data.id === '1') {
    console.log(e.data.schema, e.data.data, e.data.error);
  }
});
```

`method` is een naam uit de lijst hierboven, `arg` het enige argument. Het
antwoord is `{lb:'result', id, schema, data, error}`; bij een onbekende methode
staat `data` op `null` en zegt `error` welke naam niet klopt.

> Let op: browsers scheiden opslag per site. Zet je de app in een iframe op een
> **ander** domein, dan krijgt hij zijn eigen lege IndexedDB en krijg je lege
> lijsten terug. Zet de pagina die meeleest dus op hetzelfde domein als de app.

### 3. `?api=graph` — als losse JSON-pagina

`https://<app-url>/?api=graph` toont hetzelfde model als kale JSON. Handig voor
een iOS Shortcut of een script dat de pagina in een browser opent. Ook hier
geldt de opslagscheiding: dit werkt alleen in een browser waar de app zijn
gegevens al heeft staan.

### 4. Bestand

*profile → connect other software* heeft knoppen om dezelfde JSON te kopiëren of
te downloaden (`lets-brew-data.json`). Dat is de weg als de andere software niet
in dezelfde browser draait.

Dit is iets anders dan *export everything*: die maakt een back-up in de interne
vorm van de app, bedoeld om terug te zetten. Voor een koppeling wil je de vorm
van dit document.

## Het model

Alle koppelingen lopen via `id`. Tijden staan er dubbel in: `time` zoals jij het
noteerde (`"0:28"`) en `timeSec` in seconden, zodat je niet hoeft te parsen.
Datums zijn ISO-8601 in UTC. Ontbreekt iets, dan is het `null` — nooit een lege
string of een 0 die iets anders betekent.

### method

| veld | | |
|---|---|---|
| `id` | string | sleutel |
| `name` | string | zoals jij hem noemde |
| `family` | `"espresso"` \| `"filter"` | bepaalt welk scherm de app gebruikt |
| `enabled` | bool | staat aan in de app |
| `gearIds` | string[] | verwijst naar `gear[].id` |

### bean

| veld | | |
|---|---|---|
| `id` `name` | string | |
| `roaster` `origin` `process` `variety` | string \| null | van de zak |
| `regions` | object[] | de plekken op de kaart die je zelf aanwees, in volgorde: `{land, i}` — `land` is een land-id uit de keuzehulp, `i` de index van de streek binnen dat land, of `null` als alleen het land bekend is. Een single origin heeft er één, een blend meer. Leeg als je niets aanwees; de app leest dan het land uit `origin`. |
| `region` | object \| null | de eerste uit `regions`, of `null`. Alleen voor lezers van vóór deze versie — nieuwe code leest `regions`. |
| `altitudeM` | number \| null | teeltHoogte in meters, uit een bereik het midden |
| `roastLevel` | `light` \| `medium-light` \| `medium` \| `medium-dark` \| `dark` \| null | |
| `roastDate` | `YYYY-MM-DD` \| null | |
| `daysSinceRoast` | number \| null | uitgerekend |
| `roasterNotes` `notes` | string \| null | smaaknoten van de brander, en die van jou |
| `inStock` | bool | |
| `decaf` | bool | afgeleid uit naam en noten |
| `bagLabel` | `espresso` \| `filter` \| `both` \| null | wat de zak zelf zegt |
| `methodIds` | string[] | |
| `brewIds` | string[] | |
| `dials` | object | per `methodId` de dial die je aftekende, zie hieronder |

`dials[methodId]` = `{grind, dose, yield, time, timeSec, drink, at}`. Dit is wat
je met *dial-in nailed* hebt vastgelegd: de waarden die het deden, niet een
suggestie. Leeg zolang je op die methode niets hebt afgetekend.

### brew

| veld | | |
|---|---|---|
| `id` `at` | string | `at` is ISO |
| `methodId` `beanId` | string \| null | `beanId` is null bij een brew zonder gekoppelde zak |
| `beanName` | string \| null | zoals ingetypt, ook als er geen `beanId` is |
| `title` `drink` | string \| null | `drink` is bv. `flat white` |
| `dose` `yield` `ratio` | number \| null | gram in, gram uit |
| `time` `timeSec` | string \| number \| null | |
| `grind` | string \| null | vrije tekst: molens tellen niet hetzelfde |
| `grinder` | string \| null | de naam van de molen waarop `grind` gedraaid is |
| `brewer` | string \| null | waar je in brouwde, zoals ingetypt |
| `temp` `score` | number \| null | score van 0 tot 10 |
| `tags` | string[] | wat je proefde |
| `notes` | string \| null | |
| `isDialIn` | bool | hoort bij de dial-in-lus, niet bij je gewone logboek |
| `target` | object \| null | het doel waar je naartoe werkte |

### recipe

`{id, name, family, methodId, dose, ratio, temp, grind, targetGrind, own}` —
`own` is `true` voor recepten die je zelf schreef.

### dialLog

Elke poging apart, in de volgorde waarin je ze deed. Per boon + methode, laatste
twaalf.

```json
{ "beanId":"…", "methodId":"espresso",
  "attempts":[{"at":"…","grind":"4.2","time":"0:28","timeSec":28,"yield":36,"dose":18}] }
```

### wishlist

Bonen die je via de keuzehulp koos maar nog niet gekocht hebt. Ze staan boven
je bonenplank, en "gekocht" opent het bonenformulier met alles al ingevuld.

Een wens komt uit de keuzehulp, of je vult hem zelf in (*beans → op mijn
lijstje → zelf een zak toevoegen*). `regions` werkt hetzelfde als bij een boon,
dus een blend verschijnt op de kaart bij elk van zijn herkomsten.

```json
{ "id":"…", "naam":"Kirinyaga AA", "brander":"Friedhats",
  "url":"https://…", "regions":[{"land":"kenia","i":0}],
  "proces":"washed", "variety":"SL28, SL34, Ruiru 11", "brand":"light",
  "smaak":["tomaat-zoet","rode appel"], "notitie":"", "zoek":"…",
  "at":1234567890 }
```

Wensen van vóór deze versie bewaarden hun herkomst als losse namen (`land`,
`streek`). Die worden bij het laden één keer omgezet naar `regions`.

### gear

`{id, name, category, kind, grindMin, grindMax}` — `category` is de methodefamilie
waar het bij hoort (`espresso` / `filter` / `algemeen`). `kind` zegt wat het
ding zelf is: `"grinder"`, `"brewer"`, of `null` voor een los accessoire (tamper,
WDT-tool, puckscreen). Alleen bij `kind:"grinder"` zijn `grindMin`/`grindMax`
ooit ingevuld — het volledige bereik van die molen, in wat voor eenheid hij
ook gebruikt (klikken, een schaal 1–100, noem het). Zonder opgegeven bereik
zijn beide `null`.

## Waar de maalstand vandaan komt

`grind` en `dials[].grind` zijn vrije tekst, met opzet. De ene molen heeft
dertig standen over hetzelfde bereik waar de andere er honderd heeft, dus een
getal betekent alleen iets samen met de molen erachter (`gear`). Reken er niet
mee alsof het een eenheid is.
