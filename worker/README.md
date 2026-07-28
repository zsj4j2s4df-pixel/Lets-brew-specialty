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
  `wrangler.jsonc`
- de app: onder **profiel → dagelijkse brew-suggestie** staat een veld
  *push server* waar straks de Worker-URL in gaat

## Wat jij nog doet

Je hebt [Node](https://nodejs.org) nodig. Alle commando's in deze `worker/`-map.

**1. VAPID-sleutelpaar**

Heb je het paar uit onze eerdere sessie nog liggen? Gebruik dat. Zo niet:

```sh
node generate-vapid.mjs
```

Dit print `VAPID_PUBLIC_KEY` en `VAPID_PRIVATE_JWK`. Zet de publieke sleutel in
`wrangler.jsonc`. **De privésleutel gaat nergens in een bestand dat je commit** —
die zet je in stap 3 als secret.

**2. Je e-mailadres invullen**

In `wrangler.jsonc` staat `VAPID_SUBJECT`. Zet daar je eigen `mailto:`-adres in;
push-diensten willen een contactadres voor als er iets misgaat.

**3. Inloggen, secret zetten, uitrollen**

```sh
npx wrangler login
npx wrangler secret put VAPID_PRIVATE_JWK    # plak de hele JSON-regel
npx wrangler deploy
```

Je krijgt een URL terug, ongeveer `https://lets-brew-push.<jouw-subdomein>.workers.dev`.

**4. De app erop wijzen**

Open de app → **profiel → dagelijkse brew-suggestie** → plak die URL in het veld
*push server*. Zet de melding aan en kies je tijd. De app abonneert zich dan
vanzelf bij de Worker.

## Controleren of het werkt

```sh
curl https://lets-brew-push.<jouw-subdomein>.workers.dev/vapidPublicKey
```

Dat hoort je publieke sleutel terug te geven. Komt die eruit, dan staat de
Worker. Met `npx wrangler tail` zie je live wat de cron doet; of de melding
echt aankomt merk je de volgende ochtend op je gekozen tijd.

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
