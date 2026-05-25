/* TOEFL 100 Trainer — Service Worker
   Strategy:
   - App shell (HTML/manifest/icons): cache-first with background update
   - Tailwind CDN & Google Fonts: cache-first (stale-while-revalidate)
   - YouTube IFrame API / video frames / Tailwind script tag: network-only
   - Everything else: network-first with cache fallback
*/

const APP_VERSION = 'v1.1.1';
const APP_CACHE = `toefl96-shell-${APP_VERSION}`;
const RUNTIME_CACHE = `toefl96-runtime-${APP_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

// --- Install: pre-cache app shell ----------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// --- Activate: drop old caches -------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== APP_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// --- Fetch routing -------------------------------------------------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-only: YouTube, video/streaming
  if (
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('ytimg.com') ||
    url.hostname.includes('googlevideo.com')
  ) {
    return; // let the network handle it
  }

  // Same-origin shell: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchAndUpdate = fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type !== 'opaque') {
              const copy = res.clone();
              caches.open(APP_CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchAndUpdate;
      })
    );
    return;
  }

  // Tailwind CDN, Google Fonts — stale-while-revalidate
  if (
    url.hostname === 'cdn.tailwindcss.com' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const fetchPromise = fetch(req)
            .then((res) => {
              if (res && res.status === 200) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Default: network-first, fallback to cache
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && url.protocol === 'https:') {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

// --- Manual update trigger from page -------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
