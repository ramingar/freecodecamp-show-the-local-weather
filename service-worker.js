importScripts('./cache-polyfill.js');

const APP_CACHE_NAME = 'weather-v1';
const YAHOO_WEATHER = 'https://query.yahooapis.com/v1/public/yql';

const PRECACHE_URLS = [
    './',
    './index.html',
    './index.html?homescreen=1',
    './?homescreen=1',
    './manifest.json',
    './index.css',
    './build/css/bootstrap.min.css',
    './build/css/font-awesome.min.css',
    './build/css/font-awesome.min.css?v=4.7.0',
    './build/css/weather-icons.min.css',
    './build/font/weathericons-regular-webfont.svg',
    './build/font/weathericons-regular-webfont.ttf',
    './build/font/weathericons-regular-webfont.woff',
    './build/font/weathericons-regular-webfont.woff2',
    './build/fonts/fontawesome-webfont.ttf?v=4.7.0',
    './build/fonts/fontawesome-webfont.woff?v=4.7.0',
    './build/fonts/fontawesome-webfont.woff2?v=4.7.0',
    './build/js/jquery.min.js',
    './build/js/index.js',
    './icons/android-chrome-36x36.png',
    './icons/android-chrome-48x48.png',
    './icons/android-chrome-72x72.png',
    './icons/android-chrome-96x96.png',
    './icons/android-chrome-144x144.png',
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-256x256.png'
];


// Add static assets to cache
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(APP_CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

// Remove unused caches (old caches) after the activation event
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    return /^weather/.test(cacheName) && APP_CACHE_NAME !== cacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// For each request, return cached response or make the request normally if response is not cached
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(APP_CACHE_NAME).then(function(cache) {
            return caches.match(event.request).then(function (response) {
                const regex = new RegExp(YAHOO_WEATHER);
                if (regex.test(event.request.url)) {
                    return fetch(event.request).then(function(response) {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                }

                return response || fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
            });
        })
    );
});