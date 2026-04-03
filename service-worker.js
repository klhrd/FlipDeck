// Service Worker for Flashcard PWA (v2)

const CACHE_NAME = 'flashcard-pwa-cache-v2';
// 核心資源 + 外部 JSON 範例檔
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './css/style.css',
    './js/script.js',
    // 範例檔案 (JSON)
    './data/verbs.json',
    './data/elements.json',
    './data/capitals.json',
    // CDN 資源 (可選, 離線時會失敗, 但快取可提升速度)
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// 1. 安裝 Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: 安裝中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: 開啟快取');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. 啟動並清理舊快取
self.addEventListener('activate', event => {
    console.log('Service Worker: 啟動中...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: 清理舊快取', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. 攔截請求並提供快取內容 (Cache First 策略)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果在快取中找到回應，則返回快取的回應
                if (response) {
                    return response;
                }
                // 否則，執行網絡請求
                return fetch(event.request).then(
                    networkResponse => {
                        // 檢查是否為有效回應
                        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // 克隆回應，以便同時將其放入快取並返回給瀏覽器
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
    );
});
