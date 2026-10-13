// v5.4.1 冒煙測試：jsdom 完整啟動 + 選單互動（重現並驗證「選單故障」修復）
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..', '..');
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// 移除 CDN / manifest（測試環境離線、Tailwind class 僅字串不影響行為）
html = html.replace(/<script src="https:[^"]+"><\/script>/g, '');
html = html.replace(/<script>tailwind\.config[\s\S]*?<\/script>/, '');
html = html.replace(/<link rel="manifest"[^>]*>/, '');

const i18n = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'js/script.js'), 'utf8');

const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/index.html', pretendToBeVisual: true });
const { window } = dom;
const { document } = window;

window.navigator.serviceWorker = { register: () => Promise.resolve() };
window.HTMLElement.prototype.setPointerCapture = function () {};
window.HTMLElement.prototype.scrollTo = function () {};
window.HTMLElement.prototype.requestFullscreen = function () { return Promise.resolve(); };
window.confirm = () => true;

let failed = 0;
const ok = (name, cond) => { console.log((cond ? 'OK   ' : 'FAIL ') + name); if (!cond) failed++; };
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const isOpen = (el) => el.classList.contains('open');
const visible = (id) => !document.getElementById(id).classList.contains('hidden');

try {
    // 單次 eval：i18n 的頂層 let（I18N_LANG）與 app 共享同一詞法作用域（等同瀏覽器兩個 <script> 的全域詞法環境）
    window.eval(i18n + '\n' + app);
    document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
} catch (e) {
    console.log('*** INIT CRASH ***:', e.stack.split('\n').slice(0, 4).join('\n'));
    process.exit(1);
}
ok('啟動後首頁可見', !document.getElementById('home-screen').classList.contains('hidden'));
ok('data-i18n 全部正常落在開始標籤（無結尾標籤誤插）', [...html.matchAll(/<\/(span|button|div|h2)\s+[^>]*>/g)].length === 0);

// --- 首頁選單開關 ---
const homePanel = document.getElementById('home-menu-panel');
const overlay = document.getElementById('menu-overlay');
click(document.getElementById('home-menu-btn'));
ok('漢堡 → 首頁選單開啟', isOpen(homePanel));
ok('遮罩顯示', !overlay.classList.contains('hidden'));
click(document.getElementById('home-menu-close-btn'));
ok('關閉鈕 → 選單收起', !isOpen(homePanel));

// --- 首頁選單項目 ---
click(document.getElementById('home-menu-btn'));
click(document.getElementById('show-how-to-use-btn'));
ok('操作教學開啟 + 選單自動關閉', visible('how-to-use-modal') && !isOpen(homePanel));
click(document.getElementById('close-how-to-use-modal-btn'));

click(document.getElementById('home-menu-btn'));
click(document.getElementById('create-new-deck-btn'));
ok('從空白建立 → 編輯器開啟', visible('deck-editor-modal'));
click(document.getElementById('close-deck-editor-modal-btn'));
ok('無修改 → 編輯器直接關閉', !visible('deck-editor-modal'));

// --- 語言切換（會觸發 applyI18n 全域掃描，驗證 data-i18n 結構健康） ---
click(document.getElementById('home-menu-btn'));
click(document.getElementById('home-menu-lang-btn'));
ok('切換語言後無錯誤且標題變英文', document.querySelector('[data-i18n="app.menu"]').textContent === 'Menu');
ok('從空白建立已翻譯（結尾標籤修復驗證）', document.querySelector('[data-i18n="menu.create_blank"]').textContent === 'Create from Scratch');
ok('顯示全卡片已翻譯', document.querySelector('[data-i18n="menu.show_all"]').textContent === 'All Cards (Search)');
click(document.getElementById('home-menu-lang-btn'));
ok('切回中文', document.querySelector('[data-i18n="app.menu"]').textContent === '主選單');
click(document.getElementById('home-menu-close-btn'));

// --- 匯入範例 → 學習選單（防護修復的主場景） ---
window.fetch = () => Promise.resolve({ json: () => Promise.resolve([
    { card_id: 'a', fields: ['front1', 'back1'], tags: [] },
    { card_id: 'b', fields: ['front2', 'back2'], tags: [] },
    { card_id: 'c', fields: ['front3', 'back3'], tags: [] }
]) });
click(document.getElementById('home-menu-btn'));
click(document.getElementById('home-menu-add-btn'));
click(document.getElementById('load-example-btn'));

setTimeout(() => {
    ok('範例載入 → 學習畫面', visible('main-screen'));
    const deckPanel = document.getElementById('menu-panel');

    // ★ 核心修復場景：在 session 啟動前誤觸學習選單 → applyCurrentDeckSettings 不再炸
    click(document.getElementById('menu-btn'));
    ok('學習選單開啟', isOpen(deckPanel));
    ok('字型大小顯示預設 2.5（防護生效）', document.getElementById('font-size-value').textContent === '2.5');
    ok('每日新卡顯示預設 20', document.getElementById('new-limit-value').textContent === '20');
    ok('顯示模式顯示「翻面」', document.getElementById('display-mode-btn').textContent === '翻面');

    click(document.getElementById('display-mode-btn'));
    ok('切換雙面模式', document.getElementById('display-mode-btn').textContent === '雙面');
    ok('「點擊 翻面」提示膠囊隱藏', document.getElementById('hint-flip-pill').classList.contains('hidden'));
    click(document.getElementById('display-mode-btn'));

    click(document.getElementById('menu-btn'));
    click(document.getElementById('show-stats-btn'));
    ok('學習統計開啟', visible('stats-modal'));
    click(document.getElementById('close-stats-modal-btn'));

    click(document.getElementById('menu-btn'));
    click(document.getElementById('deck-menu-close-btn'));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    ok('Escape 可關閉（選單已關，Escape 無害）', !isOpen(deckPanel));

    console.log(failed ? `\n${failed} FAILED` : '\nALL MENU SMOKE TESTS PASSED');
    process.exit(failed ? 1 : 0);
}, 80);
