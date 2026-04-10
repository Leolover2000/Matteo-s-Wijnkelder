const CACHE_NAME = 'wijnkelder-v1';
const ASSETS = [
  '/Matteo-s-Wijnkelder/',
  '/Matteo-s-Wijnkelder/index.html',
  '/Matteo-s-Wijnkelder/manifest.json',
  '/Matteo-s-Wijnkelder/icon-192.png',
  '/Matteo-s-Wijnkelder/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip non-GET and Firebase requests
  if (event.request.method !== 'GET' || event.request.url.includes('firebasestorage') || event.request.url.includes('firestore') || event.request.url.includes('identitytoolkit')) {
    return;
  }
  event.respondWith(
    fetch(event.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match(event.request))
  );
});
