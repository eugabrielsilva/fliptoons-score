const CACHE = "fliptoons-1.0.2";
const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/font.ttf",
    "./assets/icon.png",
    "./assets/logo.webp",
    "./assets/script.js",
    "./assets/sound.mp3",
    "./assets/sound2.mp3",
    "./assets/style.css",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const {request} = event;

    if(request.method !== "GET") return;
    if(request.cache === "only-if-cached" && request.mode !== "same-origin") return;

    const url = new URL(request.url);

    if(request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if(response && response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE).then(cache => {
                            cache.put("./index.html", responseClone);
                        });
                    }

                    return response;
                })
                .catch(async () => {
                    const cachedPage = await caches.match(request);
                    if(cachedPage) return cachedPage;

                    return caches.match("./index.html");
                })
        );

        return;
    }

    if(url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            const networkFetch = fetch(request)
                .then(response => {
                    if(response && response.ok && response.type === "basic") {
                        const responseClone = response.clone();
                        caches.open(CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }

                    return response;
                })
                .catch(() => cached);

            return cached || networkFetch;
        })
    );
});