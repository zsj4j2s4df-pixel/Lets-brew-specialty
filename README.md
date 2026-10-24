# Lets Brew Specialty

Een lokale koffie-werkplek zonder inlogscherm. Iedere gebruiker koopt eigen
API-tegoed en voert een eigen Anthropic- of OpenAI-sleutel in bij Instellingen →
Appinstellingen → AI. Sleutels blijven in het tabbladgeheugen en worden niet in
IndexedDB, back-ups, logs of een gedeelde backend bewaard. Een ChatGPT-abonnement
bevat geen API-tegoed.

## De structuur

- **Bonen:** actieve zakken, lege zakken en een verlanglijst. Een lege zak heeft
  geen invloed op de zichtbaarheid van het logboek.
- **Zetmethodes:** je apparatuur en de manier van zetten. Espresso, filter,
  mokka pot en padmachine blijven inhoudelijk verschillende methodes.
- **Recepten:** herbruikbare plannen. Basisrecepten en eigen recepten staan in
  één bibliotheek, met familie- en methodefilters. Espresso en filter gebruiken
  dezelfde editor, met passende eenheden en stappen. Mokka en Senseo hebben
  eigen basisrecepten en gebruiken geen espresso-pomp-dial-in.
- **Logboek:** iedere gemeten kop en dial-in-poging, met een eigen id. Oude
  pogingen worden niet meer samengevouwen of overschreven. Een record bewaart een
  momentopname van de gebruikte boon en het recept. Oudere beperkte dial-in-
  metingen worden als zodanig getoond; verloren informatie wordt niet verzonnen.
- **Koffiecoach:** geselecteerde bonen, recepten, eigen apparatuur en maximaal
  twaalf relevante eerdere brews leveren de context. Foto’s en sleutels gaan
  niet mee in die context. Notities zijn data, geen instructies. Voorstellen
  worden op ids, verhoudingen, temperatuur, tijdvolgorde en gewichten gecontroleerd.
  Alleen de gebruiker kan een voorstel bewaren of eerst bewerken.

Nieuwe metingen worden niet automatisch omgezet in een recept. ‘Maak hier een
recept van’ neemt expliciet meetwaarden over; zonder historisch stappenplan
moet de gebruiker dat stappenplan zelf aanvullen. Latere receptwijzigingen
veranderen een eerder opgeslagen kop niet.

De migratie naar `dataVersion: 2` behoudt aanwezige gegevens. Een onbekende of
onveilige opslagvorm wordt niet overschreven; opslaan blokkeert en export voor
herstel blijft beschikbaar. Data die een oudere appversie al verwijderde, kan
alleen vanuit een passende oude back-up worden teruggehaald.

## Live spraak met eigen OpenAI-sleutel

De koffiecoach heeft een WebRTC-gesprek met OpenAI Realtime. De gebruiker start
expliciet en bevestigt het gebruik van microfoon, gekozen context en eigen
API-tegoed. De eigen sleutel gaat uitsluitend via dezelfde app-host naar OpenAI
om een tijdelijke sessiesleutel van 60 seconden te krijgen; er is geen centrale
OpenAI-sleutel en er wordt geen gebruiker voor een ander afgerekend.

`site-worker.mjs` levert `POST /api/realtime/session`. De route accepteert alleen
same-origin JSON met de eigen bearer-key, controleert model en grootte, volgt
geen redirects en geeft geen ruwe upstream-fouten of sleutels terug. Het antwoord
is `no-store`. De limiter-binding in `wrangler.jsonc` begrenst sessiestarts per IP
per Cloudflare-locatie. Dit is misbruikbeperking, geen gebruikersauthenticatie.

De browser gebruikt alleen de tijdelijke sleutel voor de SDP-handshake en de
live audioverbinding. De microfoon stopt bij Stop, fouten, verlaten van de coach,
achtergrondgebruik en uiterlijk na tien minuten. De stem kan alleen de lokale
context lezen en een receptvoorstel tonen: er is geen database-schrijf-tool.

De standaard is `gpt-realtime`; toegang hangt af van de eigen OpenAI-account.
Spraak is getest met nagebootste netwerk- en microfooninterfaces. Er zijn geen
echte API-aanroepen betaald en geen echte audiokwaliteits- of iPhone-test gedaan.

## Supabase

Voor betere recepten is geen andere database nodig: de AI gebruikt een gerichte,
read-only projectie van de bestaande IndexedDB. Er zijn geen tabellen of projecten
in de gekoppelde, niet aan Lets Brew herkenbare Supabase-projecten gewijzigd.

Bij een latere keuze voor cloud-back-ups of synchronisatie zijn anonieme sessies
zonder zichtbaar inlogscherm mogelijk, maar eigendoms-RLS, private foto-opslag en
een herstel-/koppelroute zijn dan noodzakelijk. Een anonieme sessie alleen geeft
geen overdracht naar een ander apparaat. Persoonlijke API-sleutels horen ook dan
niet in de cloud-database. Er is nu geen centrale gegevensverzameling gemaakt.

## Bouwen, testen en uitrollen

```sh
npm ci --ignore-scripts
npx playwright install --with-deps chromium webkit
npm run build
npm test
```

Wrangler is vastgezet; de tijdelijke `undici`-override gebruikt de gepatchte
7.30.1 binnen dezelfde major als Miniflare. Controleer deze override opnieuw bij
een Wrangler-update. Deze afhankelijkheden worden niet naar de browser verzonden.

`dist/` bevat alleen publieke app-assets. Testcode, Worker-broncode, configuratie,
documentatie en credentials worden niet als site-assets gekopieerd. De voormalige
monolithische HTML is opgesplitst in CSS, core, datamodel en controllers. Het
bestaande logo wordt als cachebaar bestand hergebruikt. De geforceerde splash van
3,75 seconden vervalt. De service worker gebruikt een coherent, versiegebonden
app-pakket; nieuwe versies worden atomair geïnstalleerd en na activatie herladen.

De juiste Cloudflare-account moet toegang tot de bestaande
`letsbrewspecialty.jesseboontje.workers.dev`-deployment hebben. De account die in
het onderzoek beschikbaar was bevatte die deployment niet. Maak geen vervangende
host op een andere origin zonder een plan voor de bestaande browsergegevens.
Gebruik in de bestaande deployment deze `wrangler.jsonc` met `npm run build` als
buildstap, zodat ook de spraakroute draait; alleen statische bestanden uploaden
installeert die route niet. Er hoeft geen server-side API-sleutel te worden gezet.

Referenties: [OpenAI WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc),
[client secrets](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create),
[Cloudflare rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
