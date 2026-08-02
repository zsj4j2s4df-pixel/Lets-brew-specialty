const CACHE = 'scc-v71';
const ASSETS = [
  './','./index.html','./manifest.json',
  './icon-192.png','./icon-512.png','./logo.png',
  './m-espresso.png','./m-espresso-2.png','./m-espresso-3.png',
  './m-aeropress.png','./m-v60.png','./m-mokkapot.png','./m-senseo.png','./splash-1.png','./splash-2.png','./splash-3.png','./splash-4.png','./m-chemex.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('api.anthropic.com')) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
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
