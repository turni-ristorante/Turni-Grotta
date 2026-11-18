/* Turni Grotta Marcello — service worker.
   Prima la rete: chi apre l'app vede sempre l'ultima versione caricata.
   La copia salvata entra in gioco solo quando la linea manca. */
const CACHE = 'turni-v1';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req)
      .then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copia = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
        }
        return resp;
      })
      .catch(() => caches.match(req).then(m => m || caches.match('./index.html')))
  );
});
