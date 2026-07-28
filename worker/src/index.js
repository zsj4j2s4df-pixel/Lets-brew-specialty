/**
 * Lets Brew Specialty — push-worker (Cloudflare)
 *
 * Stuurt dagelijks, op de door de gebruiker gekozen tijd, een payload-loze
 * Web Push naar geabonneerde toestellen. De service worker in de app toont
 * dan de melding; bij aantikken opent de app en stelt hij een brew voor.
 *
 * Geen eigen server nodig: dit draait volledig serverless op Cloudflare.
 *
 * Bindings (zie wrangler.jsonc):
 *  - SUBS               KV-namespace met de abonnementen
 *  - VAPID_PUBLIC_KEY   var  (base64url, ook de applicationServerKey in de app)
 *  - VAPID_SUBJECT      var  (mailto: of https: contact)
 *  - VAPID_PRIVATE_JWK  secret (JSON van de privé-JWK; via `wrangler secret put`)
 *
 * Cron: elke 5 minuten (zie triggers.crons). Per abonnement wordt de lokale
 * tijd in de tijdzone van het toestel vergeleken met de gekozen tijd.
 */

const CRON_INTERVAL_MIN = 5;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // de app haalt hier de publieke VAPID-sleutel op (applicationServerKey)
    if (url.pathname === '/vapidPublicKey' && request.method === 'GET') {
      return json({ key: env.VAPID_PUBLIC_KEY || '' }, 200, cors);
    }

    // abonneren / tijd bijwerken
    if (url.pathname === '/subscribe' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400, cors); }
      const sub = body.subscription;
      if (!sub || !sub.endpoint) return json({ error: 'no subscription' }, 400, cors);
      const rec = {
        subscription: sub,
        time: /^\d{1,2}:\d{2}$/.test(body.time || '') ? body.time : '08:00',
        tz: body.tz || 'UTC',
        lastSent: '',
      };
      await env.SUBS.put('sub:' + (await hashKey(sub.endpoint)), JSON.stringify(rec));
      return json({ ok: true }, 200, cors);
    }

    // afmelden
    if (url.pathname === '/unsubscribe' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400, cors); }
      const ep = body.endpoint || (body.subscription && body.subscription.endpoint);
      if (ep) await env.SUBS.delete('sub:' + (await hashKey(ep)));
      return json({ ok: true }, 200, cors);
    }

    return new Response('lets brew specialty — push worker', { status: 200, headers: cors });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendDue(env));
  },
};

/* ---------------- dagelijkse verzending ---------------- */
async function sendDue(env) {
  let cursor;
  do {
    const list = await env.SUBS.list({ prefix: 'sub:', cursor });
    cursor = list.list_complete ? null : list.cursor;
    for (const k of list.keys) {
      const raw = await env.SUBS.get(k.name);
      if (!raw) continue;
      let rec;
      try { rec = JSON.parse(raw); } catch { continue; }
      const today = dateInTz(rec.tz);
      if (rec.lastSent === today) continue;            // vandaag al gestuurd
      if (!isDue(rec.time, rec.tz)) continue;          // nog niet aan de beurt
      try {
        const res = await sendPush(rec.subscription, env);
        if (res.status === 404 || res.status === 410) {
          await env.SUBS.delete(k.name);               // abonnement verlopen -> opruimen
          continue;
        }
        rec.lastSent = today;
        await env.SUBS.put(k.name, JSON.stringify(rec));
      } catch (_) { /* volgende cron probeert opnieuw */ }
    }
  } while (cursor);
}

// Zit de huidige lokale tijd binnen [tijd, tijd + cron-interval)?
// Modulo een etmaal, anders vallen wektijden vlak voor middernacht buiten de
// boot: bij 23:58 draait de eerstvolgende cron om 00:00, en 0 >= 1438 is nooit
// waar. Zo geteld is het verschil dan 2 minuten en gaat de melding wel uit.
function isDue(targetHHMM, tz) {
  const now = timeInTz(tz);
  const [th, tm] = targetHHMM.split(':').map(Number);
  const sinds = (now - (th * 60 + tm) + 1440) % 1440;
  return sinds < CRON_INTERVAL_MIN;
}
function timeInTz(tz) {
  const hm = new Intl.DateTimeFormat('en-GB', { timeZone: safeTz(tz), hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}
function dateInTz(tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: safeTz(tz), year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function safeTz(tz) { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return tz; } catch { return 'UTC'; } }

/* ---------------- Web Push (payload-loos) + VAPID ---------------- */
async function sendPush(subscription, env) {
  const endpoint = subscription.endpoint;
  const aud = new URL(endpoint).origin;
  const jwt = await makeVapidJWT(aud, env.VAPID_SUBJECT || 'mailto:admin@example.com', env.VAPID_PRIVATE_JWK);
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      TTL: '3600',
      Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`,
      'Content-Length': '0',
    },
  });
}

async function makeVapidJWT(aud, sub, privJwkStr) {
  const now = Math.floor(Date.now() / 1000);
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = { aud, exp: now + 12 * 3600, sub };
  const enc = new TextEncoder();
  const unsigned = b64url(enc.encode(JSON.stringify(header))) + '.' + b64url(enc.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey('jwk', JSON.parse(privJwkStr), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(unsigned)));
  return unsigned + '.' + b64url(sig);
}

/* ---------------- helpers ---------------- */
function b64url(buf) {
  let s = '';
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function hashKey(str) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return b64url(new Uint8Array(h));
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json', ...(headers || {}) } });
}
