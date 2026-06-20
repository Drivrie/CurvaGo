/* CurvaGo service worker v1.1.0
   - Installable PWA + light offline (app shell + visited/downloaded map tiles).
   - NEVER touches user data: planned routes, ridden routes, settings and the
     backup live in localStorage, which the SW cannot and does not clear.
     Updating the app only swaps cached files, so saved data always survives.
   - HTML is network-first (so updates appear); static assets cache-first;
     routing (BRouter) is always live. */

const VERSION = '1.3.0';
const SHELL = 'curvago-shell-' + VERSION;
const TILES = 'curvago-tiles';            // tiles cache is shared across versions
const TILE_LIMIT = 4000;

const SHELL_ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/favicon.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_ASSETS)).catch(()=>{}));
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      // delete only OLD shell caches; keep the tiles cache and all user data intact
      keys.filter(k => k.startsWith('curvago-shell-') && k !== SHELL).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

const isTile = u => /tile|cyclosm|opentopomap/.test(u) || /\/\d+\/\d+\/\d+\.png/.test(u);
const isHTML = (req,u) => req.mode === 'navigate' || u.endsWith('index.html') || u.endsWith('/');

async function trimTiles(){
  const c = await caches.open(TILES); const keys = await c.keys();
  if (keys.length > TILE_LIMIT) for (let i = 0; i < keys.length - TILE_LIMIT; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = req.url;
  if (u.includes('brouter')) return;                       // routing: always live

  if (isTile(u)) {                                         // tiles: cache-first
    e.respondWith(caches.open(TILES).then(async c => {
      const hit = await c.match(req, {ignoreVary:true});
      if (hit) return hit;
      try { const res = await fetch(req); if (res && (res.ok||res.type==='opaque')) { c.put(req, res.clone()); trimTiles(); } return res; }
      catch (err) { return hit || Response.error(); }
    }));
    return;
  }

  if (isHTML(req,u)) {                                     // HTML: network-first
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(SHELL).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res && res.ok && (u.includes('fonts.g') || u.includes('cdnjs'))) {
      const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy));
    }
    return res;
  }).catch(()=>hit)));
});
