const CACHE_NAME = 'fiattib-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/tailwind.min.css',
  '/css/styles.css',
  '/js/alpine.min.js',
  '/lang.json',
  '/favicon.png',
  '/favicon.ico'
];

// Image assets to cache
const IMAGE_ASSETS = [
  '/images/optimized/patient.webp',
  '/images/optimized/doctor.webp',
  '/images/optimized/clinical.webp',
  '/images/optimized/logo.webp'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // For images, try cache first, then network
        if (event.request.url.includes('/images/')) {
          return caches.open(CACHE_NAME)
            .then(cache => {
              return fetch(event.request)
                .then(networkResponse => {
                  // Cache successful responses
                  if (networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  // Return placeholder or offline image if available
                  return new Response('Image not available offline', {
                    status: 404,
                    statusText: 'Not Found'
                  });
                });
            });
        }

        // For other requests, network first with cache fallback
        return fetch(event.request)
          .then(networkResponse => {
            // Cache successful responses for static assets
            if (networkResponse.status === 200 && 
                (event.request.url.includes('.css') || 
                 event.request.url.includes('.js') ||
                 event.request.url.includes('.json'))) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Return cached version if network fails
            return caches.match(event.request);
          });
      })
  );
});