const CACHE_NAME = "todo-list-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Mise en cache...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
