// Service Worker for FlipDeck PWA (v5.2.0)

// v4.1.4: 快取版本隨每次發版 bump，否則 cache-first 會讓修復永遠到不了使用者
const CACHE_NAME = 'flipdeck-cache-v5.2.0';
// 核心資源 + 外部 JSON 範例檔
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './css/style.css',
    './js/i18n.js',
    './js/script.js',
    // 範例檔案 (JSON) — 含最大宗 hs_6000，離線時也要能載入
    './data/hs_6000.json',
    './data/verbs.json',
    './data/elements.json',
    './data/capitals.json',
    // CDN 資源 (離線 fallback)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
];

// 1. 安裝 Service Worker：逐一快取，單一資源失敗不阻斷整體安裝
self.addEventListener('install', event => {
    console.log('Service Worker: 安裝中...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.allSettled(
                    urlsToCache.map(url => cache.add(url))
                );
            })
    );
});

// 2. 啟動並清理舊快取：立即接管所有分頁，刪除所有非本次版本的快取
self.addEventListener('activate', event => {
    console.log('Service Worker: 啟動中...');
    event.waitUntil(
        Promise.all([
            clients.claim(),
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(cache => cache !== CACHE_NAME)
                        .map(cache => {
                            console.log('Service Worker: 清理舊快取', cache);
                            return caches.delete(cache);
                        })
                );
            })
        ])
    );
});

// 3. 攔截請求：
//    - 同源核心資源 (html/css/js/data)：network-first，確保更新即時生效，離線時 fallback 到快取
//    - CDN / 字型：cache-first，命中即回，未命中才走網路並回填快取
self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const isCore = new URL(request.url).origin === self.location.origin;

    if (isCore) {
        event.respondWith(
            fetch(request).then(networkResponse => {
                if (networkResponse && networkResponse.ok) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
                }
                return networkResponse;
            }).catch(() => {
                return caches.match(request).then(cached => {
                    if (cached) return cached;
                    // 導航請求離線時 fallback 到 index.html
                    if (request.mode === 'navigate') return caches.match('./index.html');
                    return Response.error();
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(networkResponse => {
                    if (networkResponse && networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
                    }
                    return networkResponse;
                });
            }).catch(() => Response.error())
        );
    }
});
