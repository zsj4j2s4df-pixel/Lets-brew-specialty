const CACHE = 'scc-v96';
const ASSETS = [
  './','./index.html','./security.js','./app-core.js','./styles.css','./pwa.js','./brew-model.js','./brew-workspace.js','./brew-voice.js','./voice-contract.mjs','./manifest.json',
  './icon-192.png','./icon-512.png','./logo.png',
  './m-espresso.png','./m-espresso-2.png','./m-espresso-3.png',
  './m-aeropress.png','./m-v60.png','./m-mokkapot.png','./m-senseo.png','./splash-1.png','./splash-2.png','./splash-3.png','./splash-4.png','./m-chemex.png'
];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>/^scc-v\d+$/.test(k)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url),base=new URL('./',self.location.href);
  // Never intercept AI, push subscriptions, cross-origin calls or writes.
  if(e.request.method!=='GET'||url.origin!==base.origin)return;
  const isAsset=ASSETS.some(path=>new URL(path,base).pathname===url.pathname);
  if(!isAsset)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(new URL(url.pathname,base.origin).href);
    if(cached)return cached;
    try{
      const response=await fetch(e.request);
      if(response.ok){const write=cache.put(new URL(url.pathname,base.origin).href,response.clone()).catch(()=>{});e.waitUntil(write);}
      return response;
    }catch{
      return await cache.match(new URL(url.pathname,base.origin).href)||Response.error();
    }
  })());
});

// melding aangetikt -> app openen/focussen en een nieuwe brew voorstellen
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { c.postMessage({ type: 'quick-brew' }); return c.focus(); }
    }
    if (self.clients.openWindow) return self.clients.openWindow('./index.html?quickbrew=1');
  })());
});

// server-push (optioneel, voor echte achtergrond-meldingen via een backend)
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  const title = d.title || 'time for coffee ☕';
  const body = d.body || 'a fresh brew suggestion is ready — tap to start';
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'daily-brew', data: { action: 'quickbrew' }
  }));
});
