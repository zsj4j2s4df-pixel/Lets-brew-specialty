# Lets Brew Specialty — push-worker

Kleine Cloudflare Worker die elke dag, op de door de gebruiker gekozen tijd,
een melding stuurt die een brew voorstelt — óók als de app helemaal dicht is.
Serverless: je hebt geen eigen server nodig, alleen een (gratis) Cloudflare-account.

Hoe het werkt: de Worker stuurt een *payload-loze* Web Push. De service worker
in de app (`service-worker.js`, `push`-handler) toont de melding; bij aantikken
opent de app en stelt hij meteen een brew voor. De aanbeveling wordt in de app
berekend, dus er staat geen persoonlijke data in de push zelf.

## Eenmalig instellen

Je hebt [Node](https://nodejs.org) en de Cloudflare CLI (`wrangler`) nodig.
Alle commando's uitvoeren in deze `worker/`-map.

1. **VAPID-sleutels genereren**
   ```sh
   node generate-vapid.mjs
   ```
   Dit print twee dingen: `VAPID_PUBLIC_KEY` en `VAPID_PRIVATE_JWK`.

2. **Inloggen bij Cloudflare**
   ```sh
   npx wrangler login
   ```

3. **KV-namespace aanmaken** (bewaart de abonnementen)
   ```sh
   npx wrangler kv namespace create SUBS
   ```
   Plak de teruggegeven `id` in `wrangler.jsonc` bij `kv_namespaces`.

4. **`wrangler.jsonc` invullen**
   - `VAPID_PUBLIC_KEY` = de publieke sleutel uit stap 1
   - `VAPID_SUBJECT` = je eigen `mailto:` adres

5. **Privésleutel als secret zetten** (niet committen)
   ```sh
   npx wrangler secret put VAPID_PRIVATE_JWK
   ```
   Plak de hele `VAPID_PRIVATE_JWK`-regel uit stap 1.

6. **Deployen**
   ```sh
   npx wrangler deploy
   ```
   Je krijgt een URL terug, bijv. `https://lets-brew-push.<jouw-subdomein>.workers.dev`.

7. **De app naar de Worker laten wijzen**
   Geef mij die URL, dan zet ik `PUSH_ENDPOINT` in `index.html` en publiceer ik
   het. (Of vul zelf in `index.html` de const `PUSH_ENDPOINT` in met die URL.)

Klaar. Zet in de app onder **profiel → dagelijkse brew-suggestie** de melding
aan en kies je tijd — de app abonneert zich dan bij de Worker.

## Endpoints

- `GET  /vapidPublicKey` — de app haalt hier de publieke sleutel op
- `POST /subscribe`      — `{ subscription, time, tz }` opslaan/bijwerken
- `POST /unsubscribe`    — `{ endpoint }` verwijderen

## Kosten

Ruim binnen de gratis Cloudflare-tier voor persoonlijk gebruik (Workers +
Cron + KV). De cron draait elke 5 minuten en doet vrijwel niets tenzij er
iemand aan de beurt is.
