# Lets Brew Specialty — push-worker

Kleine Cloudflare Worker die elke dag, op de door jou gekozen tijd, een melding
stuurt die een brew voorstelt — óók als de app helemaal dicht is. Serverless: je
hebt geen eigen server nodig, alleen je (gratis) Cloudflare-account.

De Worker stuurt een **payload-loze** Web Push. De service worker in de app
(`service-worker.js`, `push`-handler) toont de melding; bij aantikken opent de
app en stelt hij meteen een brew voor. De aanbeveling wordt in de app zelf
berekend, dus er staan geen persoonlijke gegevens in de push.

## Wat al klaarstaat

- de Worker zelf (`src/index.js`), lokaal getest: de VAPID-ondertekening
  verifieert tegen de publieke sleutel, elke wektijd van 00:00 tot 23:59 wordt
  precies één keer per dag geraakt, en de drie endpoints doen wat ze moeten
- de KV-namespace `lets-brew-push-SUBS`, aangemaakt en al ingevuld in
  `wrangler.jsonc` (id `610b6d1efd644301b7eb93b466a82620`)
- `vapid.html`, waarmee je in je eigen browser een sleutelpaar maakt
- de app: onder **profiel → dagelijkse brew-suggestie** staat een veld
  *push server* waar straks de Worker-URL in gaat

## Uitrollen via het dashboard

Geen terminal, geen Node — alles in de browser. Reken op een kwartier.

**1. Sleutelpaar maken**

Open `vapid.html` (dubbelklik het bestand) en druk op *maak een sleutelpaar*. De
sleutels worden met de WebCrypto van je eigen browser gemaakt en gaan nergens
heen. Laat het tabblad open staan tot je bij stap 4 bent — ververs je de pagina,
dan krijg je een ander paar.

> **De privésleutel gaat alleen naar Cloudflare, als type *Secret*.** Niet in
> `wrangler.jsonc`, niet in een bestand dat je commit, niet door een chat.

**2. De Worker aanmaken**

Dashboard → **Workers & Pages** → **Create application** → **Create Worker**.
Noem hem `lets-brew-push` en druk op **Deploy**; je krijgt dan de standaard
hallo-wereld-worker. Klik daarna op **Edit code**.

**3. De code erin**

Open `src/index.js` uit deze map, neem de hele inhoud over en plak die in de
editor over de hallo-wereld heen. Het is één bestand zonder imports, dus er valt
niets te bundelen. **Deploy**.

**4. Variabelen en secret**

**Settings** → **Variables and Secrets** → **Add**, drie keer:

| type | naam | waarde |
|---|---|---|
| Text | `VAPID_PUBLIC_KEY` | het bovenste vak uit `vapid.html` |
| Text | `VAPID_SUBJECT` | `mailto:` plus je eigen e-mailadres |
| Secret | `VAPID_PRIVATE_JWK` | het onderste vak uit `vapid.html` |

Het contactadres is geen formaliteit: push-diensten gebruiken het als er iets
misgaat met jouw meldingen. Druk op **Deploy**.

**5. De KV-namespace koppelen**

**Settings** → **Bindings** → **Add** → **KV namespace**. Variabelenaam `SUBS`,
namespace `lets-brew-push-SUBS`. Die bestaat al, je hoeft hem alleen te kiezen.
**Deploy**.

**6. De cron aanzetten**

**Settings** → **Triggers** → **Cron Triggers** → **Add**. Zet er `*/5 * * * *`
in: elke vijf minuten kijken wie er aan de beurt is. Cloudflare heeft tot een
minuut of vijftien nodig om dat rond te zetten.

**7. De app erop wijzen**

Je Worker draait nu op `https://lets-brew-push.<jouw-subdomein>.workers.dev`.
Open de app → **profiel → dagelijkse brew-suggestie** → plak die URL in het veld
*push server*, zet de melding aan en kies je tijd. De app abonneert zich dan
vanzelf.

## Controleren of het staat

Open `https://lets-brew-push.<jouw-subdomein>.workers.dev/vapidPublicKey` in je
browser. Daar hoort je publieke sleutel uit te komen — komt er een lege `key`
terug, dan is stap 4 niet doorgekomen.

Onder **Settings → Trigger Events → View events** zie je of de cron loopt. Of de
melding echt aankomt merk je de volgende ochtend op je gekozen tijd.

## In plaats daarvan met de CLI

Kan ook, als je Node hebt. Sleutelpaar met `node generate-vapid.mjs`, publieke
sleutel en `VAPID_SUBJECT` in `wrangler.jsonc`, dan:

```sh
npx wrangler login
npx wrangler secret put VAPID_PRIVATE_JWK
npx wrangler deploy
```

De KV-binding en de cron staan al in `wrangler.jsonc`, dus die regelt `deploy`
zelf. Doe het één van beide: deploy je later alsnog met Wrangler over een
dashboard-worker heen, dan wint wat er in `wrangler.jsonc` staat.

## Endpoints

| | |
|---|---|
| `GET /vapidPublicKey` | de app haalt hier de publieke sleutel op |
| `POST /subscribe` | `{ subscription, time, tz }` opslaan of bijwerken |
| `POST /unsubscribe` | `{ endpoint }` verwijderen |

De cron draait elke vijf minuten en vergelijkt per abonnement de lokale tijd in
de tijdzone van dát toestel met de gekozen wektijd. Een abonnement dat de
push-dienst afwijst (404 of 410 — app verwijderd) wordt meteen opgeruimd.

## Kosten

Ruim binnen de gratis tier voor persoonlijk gebruik. De cron doet vrijwel niets
tenzij er iemand aan de beurt is.
