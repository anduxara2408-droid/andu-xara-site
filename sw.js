// sw.js - Service Worker fonctionnel
const CACHE_NAME = 'andu-xara-v1.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style-pro.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
