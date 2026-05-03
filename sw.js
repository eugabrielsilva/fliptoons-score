const CACHE = "fliptoons-v3";

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                "./",
                "./index.html",
                "./logo.webp",
                "./icon.png",
                "./manifest.json"
            ]);
        })
    );
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE).map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        fetch(e.request)
            .then(response => {
                const responseClone = response.clone();
                caches.open(CACHE).then(cache => {
                    cache.put(e.request, responseClone);
                });

                return response;
            })
            .catch(() => {
                return caches.match(e.request);
            })
    );
});