// sw.js - Service Worker PWA Andu Xara
const CACHE_NAME = 'andu-xara-v2.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/reductions.html',
  '/style-pro.css',
  '/js/app.js',
  '/js/pwa-install.js',
  '/js/secure/firebase-unified-manager.js',
  '/js/secure/credits-badge-no-icons.js',
  '/js/secure/panier-integration-stable.js',
  '/images/logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker Andu Xara - Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Ouverture du cache');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('⚠️ Certains fichiers non cachés:', error);
        });
      })
      .then(() => {
        console.log('✅ Tous les fichiers de base en cache');
        return self.skipWaiting();
      })
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker Andu Xara - Activation');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activé et prêt');
      return self.clients.claim();
    })
  );
});

// Fetch - Stratégie intelligente
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Ignorer Firebase et APIs externes
  if (request.url.includes('firebase') || 
      request.url.includes('googleapis') ||
      request.url.includes('gtag')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        // Retourner le cache si disponible
        if (response) {
          return response;
        }

        // Sinon faire la requête réseau
        return fetch(request)
          .then(response => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('❌ Fetch échoué:', error);
            // Fallback pour les pages
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
