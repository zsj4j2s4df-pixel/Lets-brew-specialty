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
    const allowed=(env.ALLOWED_ORIGINS||'https://letsbrewspecialty.jesseboontje.workers.dev').split(',').map(x=>x.trim());
    const origin=request.headers.get('Origin');
    const cors={'Vary':'Origin','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
    if(origin&&!allowed.includes(origin))return json({error:'origin not allowed'},403,cors);
    if(origin)Object.assign(cors,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
    if(request.method==='POST'){
      if(!origin)return json({error:'origin required'},403,cors);
      if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({error:'JSON required'},415,cors);
      if(env.RATE_LIMITER){const hit=await env.RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!hit.success)return json({error:'too many requests'},429,cors);}
    }

    // de app haalt hier de publieke VAPID-sleutel op (applicationServerKey)
    if (url.pathname === '/vapidPublicKey' && request.method === 'GET') {
      return json({ key: env.VAPID_PUBLIC_KEY || '' }, 200, cors);
    }

    // abonneren / tijd bijwerken
    if (url.pathname === '/subscribe' && request.method === 'POST') {
      let body;
      try{body=await readBody(request);}catch(e){return json({error:e.message},e.status||400,cors);}
      const sub = body.subscription;
      if(!sub||!safePushEndpoint(sub.endpoint))return json({error:'invalid push endpoint'},400,cors);
      if(body.time!==undefined&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(body.time))return json({error:'invalid time'},400,cors);
      if(body.tz!==undefined&&(typeof body.tz!=='string'||body.tz.length>100||safeTz(body.tz)!==body.tz))return json({error:'invalid time zone'},400,cors);
      if(!env.SUBS)return json({error:'push storage is not configured'},503,cors);
      const recordKey='sub:'+(await hashKey(sub.endpoint));let previous=null;try{previous=JSON.parse(await env.SUBS.get(recordKey));}catch{}
      const rec = {
        subscription: {endpoint:sub.endpoint},
        time:body.time||'08:00',
        tz: body.tz || 'UTC',
        lastSent:previous?.lastSent||'',
      };
      await env.SUBS.put(recordKey,JSON.stringify(rec));
      return json({ ok: true }, 200, cors);
    }

    // afmelden
    if (url.pathname === '/unsubscribe' && request.method === 'POST') {
      let body;
      try{body=await readBody(request);}catch(e){return json({error:e.message},e.status||400,cors);}
      const ep = body.endpoint || (body.subscription && body.subscription.endpoint);
      if(!safePushEndpoint(ep))return json({error:'invalid push endpoint'},400,cors);
      if(!env.SUBS)return json({error:'push storage is not configured'},503,cors);
      if (ep) await env.SUBS.delete('sub:' + (await hashKey(ep)));
      return json({ ok: true }, 200, cors);
    }

    return new Response('Not found',{status:404,headers:cors});
  },

  async scheduled(event, env, ctx) {
    if(!env.SUBS||!env.VAPID_PUBLIC_KEY||!env.VAPID_PRIVATE_JWK||!env.VAPID_SUBJECT)return;
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
      if(!safePushEndpoint(rec?.subscription?.endpoint))continue;
      const today = dateInTz(rec.tz);
      if (rec.lastSent === today) continue;            // vandaag al gestuurd
      if (!isDue(rec.time, rec.tz)) continue;          // nog niet aan de beurt
      try {
        const res = await sendPush(rec.subscription, env);
        if (res.status === 404 || res.status === 410) {
          await env.SUBS.delete(k.name);               // abonnement verlopen -> opruimen
          continue;
        }
        if(!res.ok)continue;
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
  const endpoint=subscription.endpoint;
  if(!safePushEndpoint(endpoint))throw new Error('invalid push endpoint');
  const aud = new URL(endpoint).origin;
  const jwt = await makeVapidJWT(aud, env.VAPID_SUBJECT || 'mailto:admin@example.com', env.VAPID_PRIVATE_JWK);
  return fetch(endpoint, {
    method: 'POST',
    redirect: 'manual',
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

// Only browser push providers may receive the signed VAPID authorization.
export function safePushEndpoint(value){
  try{if(typeof value!=='string'||value.length>4096)return false;const u=new URL(value);
    if(u.protocol!=='https:'||u.username||u.password||u.port||u.hash||u.pathname==='/')return false;
    return u.hostname==='fcm.googleapis.com'||u.hostname==='updates.push.services.mozilla.com'||u.hostname==='web.push.apple.com'||/^[a-z0-9-]+\.notify\.windows\.com$/.test(u.hostname);
  }catch{return false;}
}
async function readBody(request){
  const reader=request.body?.getReader();if(!reader)throw new Error('bad json');let bytes=0,chunks=[];
  while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>16384){await reader.cancel();throw Object.assign(new Error('body too large'),{status:413});}chunks.push(value);}
  const all=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}
  const data=JSON.parse(new TextDecoder().decode(all));if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('bad json');return data;
}
