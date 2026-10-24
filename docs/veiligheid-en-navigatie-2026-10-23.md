# Lets Brew Specialty: veiligheid, navigatie en vervolgstappen

> Dit is het oorspronkelijke onderzoek. De structuur, contextuele AI, eigen-key
> live spraak en module-/cacheverbeteringen zijn op 24 oktober uitgewerkt in de
> vervolgwijziging; zie [README](../README.md) voor de huidige werking en beperkingen.

Onderzocht op 23 oktober 2026. Basiscommit: `3036a8b57d4915792033f0016f255d9ec19274c7`.
De onderzochte live app is https://letsbrewspecialty.jesseboontje.workers.dev/.
Het opgehaalde HTML-bestand kwam overeen met de repository bij aanvang.

De app blijft zonder inlogscherm werken. De aanpassingen in deze wijziging zijn
voorbereid en lokaal getest; ze zijn niet naar de live app uitgerold. De gekoppelde
Cloudflare-account toont geen Lets Brew deployment. Een wijziging in GitHub staat
daarom niet automatisch gelijk aan een gepubliceerde wijziging op deze host.

## Beveiliging

| Prioriteit | Bevinding en bewijs | Aanpassing in deze wijziging |
| --- | --- | --- |
| Hoog | Het `postMessage`-venster accepteerde aanvragen van iedere origin en stuurde het koffie-logboek terug. De handler gaf in een synthetische browsertest ook antwoord aan een onbetrouwbare origin. Een top-level venster kan bovendien de bestaande opslag van de gebruiker zien; opslagpartitionering in iframes is geen afdoende bescherming. | Exact dezelfde origin vereist; antwoorden gericht naar die origin; alleen eigen API-methoden toegestaan. Externe integraties moeten expliciet delen/exporteren. |
| Hoog | Een geïmporteerd foto-veld kon extra HTML-attributen invoegen. Na het openen van de bonenkaart werd synthetische scriptcode uitgevoerd. Dit kon ook bij een bestand van een vriend gebeuren. Er zijn geen echte sleutels uitgelezen of verstuurd. | Alle vier JSON-importpaden krijgen controles vóór wijzigingen: bestandsgrootte, collecties, identifiers, afbeeldingen, verboden objecteigenschappen en limieten. Foto’s en methode-iconen worden gecontroleerd en veilig in HTML gezet. Links beperken zich tot HTTP(S). Namen in gear-knoppen worden als JavaScript-stringwaarden gecodeerd. |
| Hoog, als push-worker wordt gebruikt | De optionele push-worker accepteerde willekeurige endpoints en deed er server-side verzoeken naartoe met VAPID-autorisatie. De live inzet van deze worker kon niet worden vastgesteld. Dit bewijst geen uitlekken van de privésleutel. | Alleen bekende browser-pushdiensten via HTTPS; controle ook op oude opgeslagen endpoints; redirects niet volgen; verzoekgrootte, tijd, tijdzone en origin controleren. Minder abonnementsgegevens opslaan. |
| Middel/hoog in combinatie met XSS | AI-sleutels stonden blijvend leesbaar in localStorage. | Sleutels alleen in tabbladgeheugen. Een bestaande sleutel wordt voor de huidige sessie overgenomen en uit localStorage verwijderd. Na herladen opnieuw plakken. Geen wijziging aan AI-aanbieders of modellen; geen echte AI-aanroepen uitgevoerd. |
| Middel | De service worker onderschepte ook OpenAI-/pushverkeer. Bij netwerkfouten kon HTML terugkomen waar een API-antwoord werd verwacht. Ook alle andere caches op dezelfde origin werden bij activering verwijderd. POST-antwoorden werden niet succesvol gecachet: Cache API weigert dat. | Alleen geslaagde GET-verzoeken voor bekende eigen appbestanden cachen; API-/pushverkeer overslaan; geen HTML als fallback voor ontbrekend JavaScript; alleen oude eigen caches opruimen. |
| Middel | De live HTML-respons bevatte onder meer geen CSP, X-Frame-Options of X-Content-Type-Options. | Headers voorbereid in `_headers`, plus een CSP-subset in HTML voor statische hosting. Controle op de live headers blijft nodig na uitrollen. |

De CSP staat voorlopig inline scripts toe omdat de bestaande app die overal
gebruikt. HTTPS-verbindingen blijven toegestaan voor de instelbare push-server.
Dit is bescherming in stappen, geen volledig strikte CSP of garantie dat alle
mogelijke invoerpaden zijn afgedekt. Het verder vervangen van inline handlers
vereist een aparte refactor.

De importlimiet is 32 MiB per bestand en 5 MiB per afbeelding. Afwijkende of onveilige
bestaande gegevens worden niet gewist: opslaan wordt geblokkeerd en de oorspronkelijke
opslag kan nog als back-up worden geëxporteerd. Dit voorkomt overschrijven met een
lege beginstaat. Een volledige formele schema-validatie voor alle historische velden
blijft een vervolgstap.

CORS/origin-controle is geen authenticatie: een niet-browserclient kan de header
namaken. De push-worker ondersteunt een optionele `RATE_LIMITER`-binding, maar die
is niet aangemaakt. Bij publieke inzet zijn quota/rate limiting en eventueel
Turnstile nog nodig. Zonder de bestaande Cloudflare-deployment te kunnen bekijken
zijn WAF, echte bindings en push-delivery niet geverifieerd.

## Navigatie en dubbele informatie

| Concrete route of overlap | Effect | Aanbevolen wijziging |
| --- | --- | --- |
| Brews → brew-detail → pijl terug | De knop voert `go('home')` uit; de gebruiker komt niet terug bij de lijst. De generieke swipe gebruikt weer een andere geschiedenis. | Eén navigatiemodel met terugkeercontext, lijstfilter en scrollpositie. |
| Learn → Cupping | De actieve tab wordt Beans, terwijl de ingang en de knop ‘klaar’ bij Learn horen. | Kies één vaste plek voor Cupping en laat ingang, actieve tab en terugknop overeenkomen. |
| Dial-in → pouring shapes | ‘Klaar’ op de galerij gaat altijd naar Learn, ook als de gebruiker aan een brew werkte. | Terug naar de aanroepende brew/dial-in, inclusief bewaarde invoer. |
| Tabwissels en terugnavigatie | Alle tabwissels komen op dezelfde kleine stack. Browsergeschiedenis wordt niet beheerd; scroll wordt steeds op nul gezet. | Scheid hoofdtabs van onderliggende schermen en integreer browser-terug. |
| Taste finder / vijf vragen / bean chooser / wereldkaart | Meerdere namen en ingangen voor overlappende keuzes; onduidelijk waar zoeken eindigt en een boon toevoegen begint. | Eén ingang ‘Vind koffie’, met ‘Op de kaart’ en ‘Via vragen’; één resultaatkaart → boon bewaren → brew starten. |
| Latte art bij Learn en ‘How you pour’ in de galerij | Dezelfde melk- en giettekeningen worden op beide plekken opgebouwd. Contextuele hulp is nuttig, maar volledige herhaling maakt de route langer. | Uitgebreide uitleg in Learn; in de galerij een korte checklist en een link terug naar de betreffende uitleg. |
| Uitgeklapte brew-kaart en volledig brew-detail | Dose/tijd staan al in de kop en opnieuw in het raster; een volgend detail herhaalt een groot deel nog eens. | Lijst compact houden, één volledig detail, aparte expliciete acties voor ‘opnieuw zetten’ en ‘bewerken’. |
| Profile | Gear, weekoverzicht, AI, meldingen, functies, delen, back-up en softwarekoppelingen staan bij elkaar. | Groepeer als ‘Mijn setup’, ‘Appinstellingen’ en ‘Gegevens & delen’. Houd ‘toevoegen van vriend’ en ‘alles vervangen’ duidelijk onderscheiden. |
| Nederlands en Engels door elkaar | Knoppen zoals ‘cancel’, ‘done’ en ‘klaar’ lijken verschillende acties te betekenen. | Kies één taal voor bediening en vaste woorden voor terug, annuleren, opslaan en afronden. |

Dit zijn bevindingen en voorstellen. De navigatie en schermindeling zijn in deze
beveiligingswijziging niet opnieuw ingericht.

## Efficiëntie

- Het oorspronkelijke `index.html` is ongeveer 771 kB ongecomprimeerd en ruim
  10.000 regels, met inline code en ingebedde afbeeldingen. Dit bemoeilijkt caching,
  onderhoud en gerichte regressietests. Dit is geen gemeten Core Web Vitals-score.
- De splash wordt iedere start geforceerd circa 3,75 seconden getoond, los van of
  de app al bruikbaar is. Alleen de eerste start animeren of direct doorgaan zou
  een concrete wachttijd wegnemen.
- Gegevens worden op meerdere plaatsen opnieuw gefilterd en kaartinhoud opnieuw
  opgebouwd. Splitsen in modules, afgeleide overzichten hergebruiken en behoud van
  scroll-/formulierstatus hebben meer prioriteit dan een extra backend.
- `save()` toont nu ‘saved’ vóór de IndexedDB-transactie klaar is. Laat die melding
  volgen op de bevestigde write en maak opslagfouten blijvend zichtbaar. Dit is een
  resterend punt; de patch blokkeert wel het overschrijven van afgekeurde data.

## Supabase en andere hulpmiddelen

Voor de huidige lokale app is Supabase niet nodig om deze fouten op te lossen.
Mijn advies: eerst de beveiligingspatch en navigatie vereenvoudigen.

Supabase wordt nuttig bij optionele cloud-back-ups, gezamenlijke verzamelingen of
synchronisatie. Het kan zonder zichtbaar inlogscherm via Anonymous Sign-Ins, met
RLS die iedere gebruiker uitsluitend toegang geeft tot zijn eigen records en met
private foto-opslag. Een publieke publishable key op zichzelf identificeert geen
gebruiker. Anonieme sessies geven geen duurzaam herstel of toegang vanaf een ander
apparaat na verlies van de sessie; daarvoor is een expliciete herstel-/koppelroute
nodig. Misbruikbeperking en eventuele Turnstile horen ook bij die keuze.

Bron: https://supabase.com/docs/guides/auth/auth-anonymous . Er is geen project,
database, account of betaalde voorziening aangemaakt.

De voorgestelde GitHub Actions-workflow test de kwetsbare grenzen en de mobiele
app. Cloudflare Turnstile/rate limiting is alleen zinvol vóór publieke push- of
betaalde AI-endpoints. Een foutmeldingsdienst kan later helpen bij echte
navigatieproblemen, maar mag daarbij geen API-sleutels of koffie-notities loggen.
Een extra plugin vervangt geen toegangsregels of invoercontrole.

## Controle

De kwetsbaarheden zijn eerst met uitsluitend synthetische gegevens op de lokale
kopie bevestigd. Daarna zijn Node-tests en mobiele browsercontroles op Chromium
en WebKit toegevoegd: geldige back-ups, schadelijke imports, herladen, databrug,
opslagbehoud, tijdelijke AI-sleutels, gear-namen met quotes, push-bestemmingen,
quota-hook, dagelijkse verzendmarkering en service-workergrenzen. Er is geen
fysieke iPhone gebruikt en er zijn geen echte AI-aanroepen of pushberichten gedaan.
De functionele browsertests vervangen externe fontdownloads door lege CSS om niet
afhankelijk te zijn van de bereikbaarheid van Google Fonts; ze meten geen live
netwerkprestaties of volledige visuele gelijkheid.
