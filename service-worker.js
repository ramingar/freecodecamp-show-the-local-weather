importScripts('/cache-polyfill.js');

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/index.html?homescreen=1',
    '/?homescreen=1',
    '/index.css',
    '/build/css/bootstrap.min.css',
    '/build/css/font-awesome.min.css',
    '/build/css/font-awesome.min.css?v=4.7.0',
    '/build/css/weather-icons.min.css',
    '/build/font/weathericons-regular-webfont.svg',
    '/build/font/weathericons-regular-webfont.ttf',
    '/build/font/weathericons-regular-webfont.woff',
    '/build/font/weathericons-regular-webfont.woff2',
    '/build/fonts/fontawesome-webfont.ttf?v=4.7.0',
    '/build/fonts/fontawesome-webfont.woff?v=4.7.0',
    '/build/fonts/fontawesome-webfont.woff2?v=4.7.0',
    '/build/js/jquery.min.js',
    '/build/js/index.js'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('weather').then(function (cache) {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
