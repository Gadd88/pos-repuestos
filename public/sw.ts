// const CACHE_NAME = "stock-app-v1";

// const urlsToCache = [
//   "/",
//   "/admin",
//   "/offline",
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     fetch(event.request).catch(() => caches.match(event.request))
//   );
// });