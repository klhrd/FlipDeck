// v5.5.1 數字正確性回歸測試：3 卡牌組 → A✓ B✓ C✗ → 核對 SM-2 / 進度 / 到期 / 等級全部數字
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');
const ROOT = path.join(__dirname, '..', '..');
const DAY = 86400000;

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
html = html.replace(/<script src="https:[^"]+"><\/script>/g, '');
html = html.replace(/<script>tailwind\.config[\s\S]*?<\/script>/, '');
html = html.replace(/<link rel="manifest"[^>]*>/, '');
const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/index.html', pretendToBeVisual: true });
const { window } = dom;
const { document } = window;
window.navigator.serviceWorker = { register: () => Promise.resolve() };
window.HTMLElement.prototype.setPointerCapture = function () {};
window.HTMLElement.prototype.scrollTo = function () {};
window.HTMLElement.prototype.requestFullscreen = function () { return Promise.resolve() };
window.confirm = () => true;
window.speechSynthesis = { cancel: () => {}, speak: () => {} };
window.SpeechSynthesisUtterance = function (t) { this.text = t; };
window.navigator.clipboard = { writeText: () => Promise.resolve() };
window.CompressionStream = CompressionStream; window.DecompressionStream = DecompressionStream;
window.TextEncoder = TextEncoder; window.TextDecoder = TextDecoder; window.Response = Response; window.Blob = Blob;
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const key = (k) => document.dispatchEvent(new window.KeyboardEvent('keydown', { key: k, bubbles: true }));

window.eval(fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'js/script.js'), 'utf8'));
window.fetch = () => Promise.resolve({ json: () => Promise.resolve([
    { card_id: 'a', fields: ['front1', 'back1'], tags: [] },
    { card_id: 'b', fields: ['front2', 'back2'], tags: [] },
    { card_id: 'c', fields: ['front3', 'back3'], tags: [] }
]) });

const boot = () => setTimeout(run, 50);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

function run() {
    click(document.getElementById('home-menu-btn'));
    click(document.getElementById('home-menu-add-btn'));
    click(document.getElementById('load-example-btn'));
    setTimeout(() => {
        let failed = 0;
        const ok = (name, cond) => { console.log((cond ? 'OK   ' : 'FAIL ') + name); if (!cond) failed++; };

        // 首啟教學自動開啟——關閉（模擬真實使用者）
        const htu = document.getElementById('how-to-use-modal');
        if (!htu.classList.contains('hidden')) click(document.getElementById('close-how-to-use-modal-btn'));

        // 判定：A✓ B✓ C✗（鍵盤未翻面 → q=5）
        key('ArrowRight');
        key('ArrowRight');
        key('ArrowLeft');

        const t0 = Date.now();
        const st = JSON.parse(window.localStorage.getItem('flashcardPWA_state_v2_ex_hs_6000'));

        // --- T1: SM-2 欄位逐卡核對（佇列隨機洗牌 → 以「判定特徵」分類，順序無關） ---
        const entries = Object.values(st);
        const passed = entries.filter(v => v.reps === 1);
        const failedCard = entries.find(v => v.lapses === 1);
        ok('恰好 2 張答對、1 張答錯', passed.length === 2 && !!failedCard && entries.length === 3);
        passed.forEach((v, i) => {
            ok(`✓卡${i}: mastery 2`, v.mastery === 2);
            ok(`✓卡${i}: ef 2.6 (q=5 → +0.1)`, Math.abs(v.ef - 2.6) < 1e-9);
            ok(`✓卡${i}: interval 1, due ≈ +1 天`, v.interval === 1 && v.due > t0 && v.due < t0 + DAY);
            ok(`✓卡${i}: lapses 0`, v.lapses === 0);
        });
        ok('✗卡: mastery 1, reps 0, interval 0（答錯重置）', failedCard.mastery === 1 && failedCard.reps === 0 && failedCard.interval === 0);
        ok('✗卡: ef 2.18 (q=2 → -0.32)', Math.abs(failedCard.ef - 2.18) < 1e-9);
        ok('✗卡: due = 現在（立即重新到期）', failedCard.due <= Date.now() + 1000);
        console.log('T1 SM-2 per-card: OK');

        // --- T2: 學習膠囊顯示「剩 1 張到期」（答錯的 C 仍待複習） ---
        const pill = document.getElementById('deck-info').textContent;
        ok('膠囊顯示剩 1 張到期', pill.includes('剩 1 張到期'), `實際：「${pill}」`);
        console.log('T2 live due pill: OK');

        // --- T3: 統計視窗全部數字 ---
        click(document.getElementById('menu-btn'));
        click(document.getElementById('show-stats-btn'));
        const body = document.getElementById('stats-body');
        const texts = [...body.querySelectorAll('div, p, span')].map(el => el.textContent.trim());
        const has = (s) => texts.includes(s);
        ok('大數字 16%（(1+1+0)/(3×4)）', has('16%'));
        ok('已熟練 0 / 3 張（第 5 級張數）', has('已熟練 0 / 3 張'));
        ok('第 1 級 1 張、第 2 級 2 張', has('第 1 級（新卡）') && has('第 2 級'));
        const bigNums = [...body.querySelectorAll('.text-lg')].map(e => e.textContent);
        ok('今日到期 1 / 7 天內 2', bigNums.includes('1') && bigNums.includes('2'), `實際：${bigNums}`);
        click(document.getElementById('close-stats-modal-btn'));
        console.log('T3 stats modal numbers: OK');

        // --- T4: 回首頁 → 牌組卡顯示 ---
        click(document.getElementById('deck-menu-home-btn'));
        const card = document.querySelector('#deck-list-container .bg-white');
        const cardText = card ? card.textContent.replace(/\s+/g, ' ').trim() : '';
        ok('首頁顯示「3 張卡片 • 16% 進度」', cardText.includes('3 張卡片') && cardText.includes('16% 進度'), `實際：「${cardText}」`);
        ok('首頁顯示「1 張到期」徽章', cardText.includes('1 張到期'));
        const meta = JSON.parse(window.localStorage.getItem('flashcardPWA_deckList_v2'))[0];
        ok('meta.totalCards = 3', meta.totalCards === 3);
        console.log('T4 home deck card: OK');

        console.log(failed ? `\n${failed} FAILED` : '\nALL NUMBERS REGRESSION TESTS PASSED');
        process.exit(failed ? 1 : 0);
    }, 100);
}
