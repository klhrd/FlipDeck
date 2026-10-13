// Service Worker 快取策略測試 — mock瀏覽器 API，驗證 network-first、快取清理與離線 fallback
const assert = require('assert');
const { readServiceWorker } = require('./lib');

const src = readServiceWorker();

// --- Mocks ---
const listeners = {};
const calls = { skipWaiting: [], claim: [], cacheDelete: [], cachePut: [], cacheAdd: [], matchReqs: [] };

const cacheStore = new Map(); // url -> Response
const mockCache = {
    add: async (url) => {
        calls.cacheAdd.push(String(url));
        if (String(url).includes('fail-me')) throw new Error('network fail');
        cacheStore.set(String(url), { url: String(url), ok: true, synthetic: 'install' });
    },
    put: async (req, res) => { calls.cachePut.push(req.url || String(req)); cacheStore.set(req.url || String(req), res); },
    match: async (req) => { calls.matchReqs.push(req.url || String(req)); return cacheStore.get(req.url || String(req)) || undefined; }
};
const caches = {
    open: async (name) => (caches._current = name, mockCache),
    keys: async () => ['flashcard-pwa-cache-v2', 'flipdeck-cache-v5.4.0', 'flipdeck-cache-v5.4.1'],
    match: async (req) => {
        const key = req.url || String(req);
        const resolved = key.startsWith('./') ? scope + key.replace('./', '') : key;
        return cacheStore.get(resolved) || undefined;
    },
    delete: async (name) => { calls.cacheDelete.push(name); return true; }
};

let fetchImpl = async (req) => { throw new Error('offline'); };

const scope = 'https://flipdeck.example/';
const selfCtx = {
    location: { origin: 'https://flipdeck.example' },
    skipWaiting: () => calls.skipWaiting.push(1),
    clients: { claim: () => calls.claim.push(1) },
    addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); }
};

// Evaluate SW in this context
const fn = new Function('self', 'caches', 'clients', 'fetch', 'Request', 'Response', 'URL', 'Promise', src + '\n');
fn(selfCtx, caches, selfCtx.clients, (req) => fetchImpl(req), Request, Response, URL, Promise);

function fire(type, event) {
    (listeners[type] || []).forEach(h => h(event));
}

function makeEvent(request, respondWithResult) {
    let resolveP;
    const p = new Promise(r => resolveP = r);
    return {
        request,
        waitUntil: (x) => { event.waitUntilCalled = true; Promise.resolve(x).catch(() => {}); },
        respondWith: (x) => { Promise.resolve(x).then(resolveP, resolveP); }
    };
}

class FakeRequest {
    constructor(url, opts = {}) {
        this.url = url.startsWith('http') ? url : scope + url.replace('./', '');
        this.method = opts.method || 'GET';
        this.mode = opts.mode || 'no-cors';
    }
}

async function fetchResult(url, opts) {
    const req = new FakeRequest(url, opts);
    const ev = makeEvent(req);
    fire('fetch', ev);
    return await new Promise((res, rej) => {
        Promise.resolve().then(async () => {
            // respondWith was called with a promise; makeEvent resolves it
        });
        // re-fire to capture
    });
}

// Simpler: patch respondWith to store promise
async function runFetch(url, opts) {
    const req = new FakeRequest(url, opts);
    let respondPromise = null;
    const ev = {
        request: req,
        waitUntil: () => {},
        respondWith: (p) => { respondPromise = p; }
    };
    fire('fetch', ev);
    if (!respondPromise) return { skipped: true };
    try { return { res: await respondPromise }; } catch (e) { return { err: e }; }
}

(async () => {
    // --- Test 1: install ---
    const installEv = { waitUntil: (p) => { installEv._p = p; } };
    fire('install', installEv);
    await installEv._p;
    assert.ok(calls.skipWaiting.length === 1, 'skipWaiting called');
    assert.strictEqual(caches._current, 'flipdeck-cache-v5.4.1', 'opens new cache name');
    assert.ok(calls.cacheAdd.some(u => u.includes('hs_6000.json')), 'hs_6000.json now precached');
    assert.ok(calls.cacheAdd.some(u => u.includes('Material+Symbols')), 'Material Symbols precached');
    assert.ok(!calls.cacheAdd.some(u => u.includes('jszip')), 'jszip no longer precached (dependency removed)');
    console.log('T1 install: OK (skipWaiting, new cache name, hs_6000 + fonts precached, jszip dropped)');

    // --- Test 2: activate cleans old caches + claims clients ---
    const activateEv = { waitUntil: (p) => { activateEv._p = p; } };
    fire('activate', activateEv);
    await activateEv._p;
    assert.ok(calls.claim.length === 1, 'clients.claim called');
    assert.deepStrictEqual(calls.cacheDelete, ['flashcard-pwa-cache-v2', 'flipdeck-cache-v5.4.0'], 'old caches deleted');
    console.log('T2 activate: OK (claim + old flashcard-pwa-cache-v2 deleted)');

    // --- Test 3: core asset, network available → network-first, caches response ---
    const mkRes = (props) => ({ ...props, clone: () => mkRes(props) });
    fetchImpl = async (req) => mkRes({ url: req.url, ok: true, fresh: true });
    cacheStore.clear();
    cacheStore.set(scope + 'css/style.css', { url: scope + 'css/style.css', ok: true, stale: true });
    const r3 = await runFetch(scope + 'css/style.css');
    assert.ok(r3.res && r3.res.fresh === true, 'network-first: fresh network version wins over stale cache');
    assert.ok(calls.cachePut.some(u => u.includes('style.css')), 'network response written back to cache');
    console.log('T3 network-first: OK (fresh beats stale)');

    // --- Test 4: core asset, offline → falls back to cache ---
    fetchImpl = async () => { throw new Error('offline'); };
    cacheStore.set(scope + 'css/style.css', { url: scope + 'css/style.css', ok: true, stale: true });
    const r4 = await runFetch(scope + 'css/style.css');
    assert.ok(r4.res && r4.res.stale === true, 'offline: stale cache served');
    console.log('T4 offline fallback: OK');

    // --- Test 5: navigate offline, not in cache → index.html fallback ---
    cacheStore.set(scope + 'index.html', { url: scope + 'index.html', ok: true, appShell: true });
    const r5 = await runFetch(scope + 'some/route', { mode: 'navigate' });
    assert.ok(r5.res && r5.res.appShell === true, 'navigate fallback serves index.html');
    console.log('T5 navigate fallback: OK');

    // --- Test 6: CDN request already cached → cache-first, no network ---
    fetchImpl = async () => { throw new Error('should not be called'); };
    const cdnUrl = 'https://cdn.tailwindcss.com';
    cacheStore.set(cdnUrl, { url: cdnUrl, ok: true, cachedCdn: true });
    const r6 = await runFetch(cdnUrl);
    assert.ok(r6.res && r6.res.cachedCdn === true, 'CDN cache-first hit without network');
    console.log('T6 CDN cache-first: OK');

    // --- Test 7: CDN not cached, online → fetched and written back ---
    cacheStore.delete('https://fonts.gstatic.com/x.woff2');
    fetchImpl = async (req) => mkRes({ url: req.url, ok: true, corsFont: true });
    const r7 = await runFetch('https://fonts.gstatic.com/x.woff2');
    assert.ok(r7.res && r7.res.corsFont === true, 'CDN miss fetches network');
    assert.ok(calls.cachePut.some(u => u.includes('gstatic')), 'font written back (runtime caching of cors assets works)');
    console.log('T7 CDN runtime caching: OK');

    // --- Test 8: non-GET ignored ---
    const ev8 = { request: new FakeRequest(scope + 'x'), method: 'POST', waitUntil: () => {}, respondWith: () => { throw new Error('should not respond'); } };
    fire('fetch', { request: new FakeRequest(scope + 'x', { method: 'POST' }), waitUntil: () => {}, respondWith: () => { throw new Error('must not be called'); } });
    console.log('T8 non-GET ignored: OK');

    console.log('\nALL SERVICE WORKER TESTS PASSED');
})().catch(e => { console.error('TEST FAILED:', e.message); process.exit(1); });
