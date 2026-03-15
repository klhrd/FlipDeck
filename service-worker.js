// Service Worker for Flashcard PWA (v2)

const CACHE_NAME = 'flashcard-pwa-cache-v2';
// 核心資源 + 外部 JSON 範例檔
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'icons/icon-192.png',
    'icons/icon-512.png',
    // 範例檔案 (JSON)
    'samples/verbs.json',
    'samples/elements.json',
    'samples/capitals.json',
    // CDN 資源 (可選, 離線時會失敗, 但快取可提升速度)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// 1. 安裝 Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: 安裝中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: 開啟快取');
                
                // 使用 fetch 來請求 CDN 資源，並設定為 'no-cors' 模式
                // 這允許我們快取不透明的回應 (opaque response)
                const cdnRequests = urlsToCache
                    .filter(url => url.startsWith('http'))
                    .map(url => new Request(url, { mode: 'no-cors' }));

                // 本地資源
                const localRequests = urlsToCache
                    .filter(url => !url.startsWith('http'))
                    .map(url => new Request(url));
                
                // 將所有請求加入快取
                // 分開 addAll 確保本地資源失敗會中斷安裝
                return cache.addAll(localRequests)
                    .then(() => {
                        return Promise.all(cdnRequests.map(req => {
                            // 擷取並快取
                            return fetch(req).then(response => cache.put(req, response)).catch(err => console.warn(`無法快取 CDN 資源 ${req.url}: ${err}`));
                        }));
                    });
            })
            .then(() => {
                console.log('Service Worker: 所有核心資源已快取');
                return self.skipWaiting(); // 強制啟動
            })
            .catch(err => {
                console.error('Service Worker: 快取失敗', err);
            })
    );
});

// 2. 啟動 Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: 啟動中...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: 清除舊快取', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 立即控制頁面
    );
});

// 3. 攔截網路請求 (快取優先策略)
self.addEventListener('fetch', event => {
    // 僅處理 GET 請求
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果快取中有，直接從快取回傳
                if (response) {
                    return response;
                }
                
                // 如果快取中沒有，則嘗試從網路請求
                return fetch(event.request).then(
                    networkResponse => {
                        // (可選) 對於非核心資源，可以動態快取
                        // 為了安全起見，這裡只回傳網路回應，不自動快取所有東西
                        return networkResponse;
                    }
                ).catch(() => {
                    // 離線且快取中沒有時的備用方案
                    console.warn('Service Worker: 網路請求失敗且快取中無此資源', event.request.url);
                });
            })
    );
});

