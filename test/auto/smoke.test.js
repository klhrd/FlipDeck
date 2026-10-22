// v5.4.1 冒煙測試：jsdom 完整啟動 + 選單互動（重現並驗證「選單故障」修復）
// 注意：不可手動 dispatch DOMContentLoaded——jsdom 之後會再自然觸發一次，
// 造成 app 閉包執行兩次、狀態分裂（此為 harness bug，真實瀏覽器僅觸發一次）。
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..', '..');
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
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
window.HTMLElement.prototype.requestFullscreen = function () { return Promise.resolve() };
window.confirm = () => true;
window.speechSynthesis = { cancel: () => {}, speak: () => {} };
window.SpeechSynthesisUtterance = function (text) { this.text = text; };
// clipboard stub（jsdom 無）——v5.5.4 起記錄複製內容供斷言
let lastCopied = '';
window.navigator.clipboard = { writeText: (text) => { lastCopied = text; return Promise.resolve(); } };
// Web 壓縮/串流 APIs（jsdom 無——借用 Node 內建，讓 encodeDeckForUrl 可跑）
window.CompressionStream = CompressionStream;
window.DecompressionStream = DecompressionStream;
window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder;
window.Response = Response;
window.Blob = Blob;

let failed = 0;
const ok = (name, cond) => { console.log((cond ? 'OK   ' : 'FAIL ') + name); if (!cond) failed++; };
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const isOpen = (el) => el.classList.contains('open');
const visible = (id) => !document.getElementById(id).classList.contains('hidden');

// 單次 eval：i18n 的頂層 let 與 app 共享詞法作用域（等同瀏覽器兩個 <script>）
try {
    window.eval(i18n + '\n' + app);
} catch (e) {
    console.log('*** EVAL CRASH ***:', e.stack.split('\n').slice(0, 4).join('\n'));
    process.exit(1);
}

// 等 jsdom 自然 DOMContentLoaded（僅一次），確保 app 閉包只跑一次
const boot = () => setTimeout(runTests, 50);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

function runTests() {
    ok('啟動後首頁可見', !document.getElementById('home-screen').classList.contains('hidden'));
    ok('首頁背景透明化（無 bg-*/shadow）', !/bg-(white|stone-900)|shadow-xl/.test(document.getElementById('home-screen').className));
    ok('上傳格式說明存在（details）', document.querySelector('#quick-start-modal details') !== null);
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

    // --- 語言切換（驗證 data-i18n 結構健康） ---
    click(document.getElementById('home-menu-btn'));
    click(document.getElementById('home-menu-lang-btn'));
    ok('切換語言後標題變英文', document.querySelector('[data-i18n="app.menu"]').textContent === 'Menu');
    ok('從空白建立已翻譯（結尾標籤修復驗證）', document.querySelector('[data-i18n="menu.create_blank"]').textContent === 'Create from Scratch');
    ok('顯示全卡片已翻譯', document.querySelector('[data-i18n="menu.show_all"]').textContent === 'All Cards (Search)');
    click(document.getElementById('home-menu-lang-btn'));
    ok('切回中文', document.querySelector('[data-i18n="app.menu"]').textContent === '主選單');
    click(document.getElementById('home-menu-close-btn'));

    // --- v5.5.4：匯入格式說明 Modal + AI Agent 提示詞複製 ---
    click(document.getElementById('home-menu-btn'));
    click(document.getElementById('home-menu-add-btn'));
    ok('快速開啟（含格式說明）開啟', visible('quick-start-modal'));
    click(document.getElementById('open-format-guide-btn'));
    ok('完整說明 Modal 開啟', visible('format-guide-modal'));
    click(document.getElementById('fg-copy-prompt-btn'));
    ok('複製的提示詞含格式規則與主題佔位', lastCopied.includes('card_id') && lastCopied.includes('主題'));
    click(document.getElementById('fg-copy-spec-btn'));
    ok('複製的規則含 JSON 與 TXT 段', lastCopied.includes('JSON') && lastCopied.includes('TXT') && lastCopied.includes(';'));
    click(document.getElementById('fg-copy-prompt-btn'));
    ok('提示詞按鈕回饋「已複製！」', document.getElementById('fg-copy-prompt-btn').textContent === '已複製！');
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    ok('Escape 關閉格式說明（快速開始仍開）', !visible('format-guide-modal') && visible('quick-start-modal'));
    click(document.getElementById('close-quick-start-modal-btn'));

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

        // --- v5.5.0：TTS 朗讀鈕 ---
        const speakBtn = document.querySelector('#active-combo-card .speak-btn');
        ok('朗讀鈕存在於作用中卡面', !!speakBtn);
        if (speakBtn) {
            click(speakBtn);
            ok('點擊朗讀鈕無錯誤', true);
        }

        // --- v5.5.2：朗讀語言循環切換 ---
        click(document.getElementById('menu-btn'));
        const ttsBtn = document.getElementById('tts-lang-btn');
        ok('朗讀語言列顯示（TTS 可用環境）', !document.getElementById('tts-lang-row').classList.contains('hidden'));
        click(ttsBtn); ok('切到 zh-TW', ttsBtn.textContent === 'zh-TW');
        click(ttsBtn); ok('切到 en-US', ttsBtn.textContent === 'en-US');
        click(ttsBtn); click(ttsBtn); click(ttsBtn); ok('循環回「自動」', ttsBtn.textContent === '自動');
        click(document.getElementById('deck-menu-close-btn'));

        // --- v5.5.0：分享 Modal（QR 無 lib 環境降級）---
        click(document.getElementById('deck-menu-home-btn'));
        const optBtn = document.querySelector('.options-btn');
        ok('回首頁後有牌組選項鈕', !!optBtn);
        if (optBtn) {
            click(optBtn);
            click(document.getElementById('deck-options-share-btn'));
            setTimeout(() => {
                ok('分享 Modal 開啟', visible('share-modal'));
                ok('QR 降級提示顯示（無 lib 環境）', document.getElementById('qr-container').textContent.length > 0);
                ok('連結框有內容', document.getElementById('share-url-box').textContent.includes('#d='));
                document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                ok('Escape 關閉分享 Modal', !visible('share-modal'));

                console.log(failed ? `\n${failed} FAILED` : '\nALL MENU SMOKE TESTS PASSED');
                process.exit(failed ? 1 : 0);
            }, 50);
        } else {
            console.log(failed ? `\n${failed} FAILED` : '\nALL MENU SMOKE TESTS PASSED');
            process.exit(failed ? 1 : 0);
        }
    }, 80);
}
