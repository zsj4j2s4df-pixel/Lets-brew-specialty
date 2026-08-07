# Een goedgekeurde functie inbouwen

Lees dit alleen in deel B, dus nadat de gebruiker heeft gezegd dat het gebouwd
mag worden. Voor de tekenstijl en de bouwregels van de app zelf volg je de skill
`lets-brew-house-style`; hier staat alleen wat er bij een *nieuwe* functie extra
bij komt kijken.

## De volgorde

1. **Featurevlag eerst.** Zet een regel bij in `FEATURES`:

   ```js
   {id:'beanpick', n:'bean chooser', d:'step by step to the bag you should buy next', def:false, cat:'app'},
   ```

   `def:false` als de functie nieuw of eigenwijs is — de gebruiker zet hem zelf
   aan onder profile. `cat` is `app`, `smart` of `people`.

2. **Zet `featOn('<id>')` om álles heen** wat de functie toevoegt: de knop die
   hem opent, de pagina, en elk stukje dat hij ergens anders bijtekent. Staat de
   vlag uit, dan mag er niets van te zien zijn.

3. **Een eigen pagina?** Dan hoort hij in de `pages`-lijst, krijgt hij
   `<div id="page-<naam>">`, een regel in `navMap` zodat de navigatiebalk het
   juiste tabblad blijft markeren, en een `if(p==='<naam>')render…()` in `go()`.

4. **Nieuwe gegevens?** Alles hangt onder één `state`-object dat via
   `idbSet/idbGet` bewaard wordt. Zet je iets nieuws in `state`, werk dan
   `SCHEMA.md` bij — anders klopt de uitleg voor de volgende keer niet meer.

5. **AI-knoppen** lopen via de bestaande aanroep en via `myCoffeeContext()`.
   Voeg je iets toe waar de coach iets aan heeft, zet het dan in die context.
   Een AI-knop hoort altijd achter `applyAIVisibility()`.

## Voor je afsluit

- syntaxcontrole op beide inline `<script>`-blokken met `node --check`
- draaien in Chromium op 390 × 844, en de functie één keer helemaal doorlopen —
  ook met de vlag **uit**, want dan mag er niets kapot zijn
- `rm -rf node_modules package-lock.json` als je playwright hebt geïnstalleerd
- service worker één keer bumpen: `const CACHE = 'scc-vNN'` → `NN+1`
- één commit op de werkbranch, met in de tekst wat de functie doet en waarom

**Naar `main` alleen als de gebruiker letterlijk zegt dat het live mag.** Niet
"ik denk dat hij dat wel bedoelt". Zegt hij het niet, dan blijft het op de
werkbranch en meld je dat het klaarstaat.

## Waar het misgaat

- **Een functie die de app drukker maakt.** Deze gebruiker heeft al eerder een
  hele plank laten verwijderen omdat het "te druk voor een nieuwkomer" was.
  Nieuw werk hoort standaard uit te staan of ingeklapt te beginnen.
- **Vragen wat de app al weet.** Kijk in `state` voor je een invoerveld maakt.
- **Twee dezelfde `id`'s in de DOM.** Alle pagina's staan tegelijk in het
  document; een `id` die je op twee plekken gebruikt, laat de verkeerde
  meebewegen. Gebruik binnen een component classes en zoek met
  `el.closest('.…')`.
- **Een tekstveld erbij terwijl er al een kaart voor is.** Kijk eerst of het
  ergens hoort waar het al staat.
