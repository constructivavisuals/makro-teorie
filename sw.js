/* Makro II — service worker
   Navigace (HTML): network-first → online vždy nejnovější verze, offline padne na cache.
   Ikony + CDN fonty: cache-first.
   Verzovaná cache: při novém nasazení zvedni číslo (makro-v1 → makro-v2). */
const CACHE = "makro-v5";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png"
];

// Instalace — nacachuj vlastní soubory a aktivuj novou verzi hned
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivace — smaž všechny cache, které se neshodují s aktuální verzí
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigace (HTML dokument) — network-first, offline fallback na cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("/index.html"))
        )
    );
    return;
  }

  // Ikony, manifest a CDN fonty — cache-first, na síti doplň do cache
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});
