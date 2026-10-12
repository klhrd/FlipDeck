// v5.2.0 i18n 一致性測試 — 載入真實字典，驗證 zh/en 對稱與佔位符一致
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 以最小 stub 執行 i18n.js（函式宣告外漏至本作用域；const I18N 透過 eval 回傳值取得）
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'i18n.js'), 'utf8');
let localStorage = { getItem: () => null, setItem: () => {} };
let document = { documentElement: {}, querySelectorAll: () => [] };
const DICT = eval(src + ';I18N;');

assert.ok(DICT && DICT.zh && DICT.en && typeof t === 'function', 'i18n engine evaluated');

// ---- T1: zh 與 en 鍵集合完全對稱（漏翻譯直接抓出） ----
{
    const zhKeys = new Set(Object.keys(DICT.zh));
    const enKeys = new Set(Object.keys(DICT.en));
    const missingInEn = [...zhKeys].filter(k => !enKeys.has(k));
    const missingInZh = [...enKeys].filter(k => !zhKeys.has(k));
    assert.deepStrictEqual(missingInEn, [], 'every zh key exists in en');
    assert.deepStrictEqual(missingInZh, [], 'every en key exists in zh');
    console.log(`T1 key parity (${zhKeys.size} keys): OK`);
}

// ---- T2: 佔位符組合逐鍵一致（{n} 等參數不可單邊存在） ----
{
    const ph = s => [...String(s).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
    const problems = [];
    for (const k of Object.keys(DICT.zh)) {
        const a = ph(DICT.zh[k]), b = ph(DICT.en[k]);
        if (a !== b) problems.push(`${k}: zh(${a}) vs en(${b})`);
    }
    assert.deepStrictEqual(problems, [], 'placeholder sets identical per key');
    console.log('T2 placeholder parity: OK');
}

// ---- T3: t() 行為 — 佔位符替換、fallback、缺鍵 ----
{
    assert.strictEqual(t('menu.help'), '操作教學', 'zh default lookup');
    assert.strictEqual(t('st.mastered', { m: 3, t: 9 }), '已熟練 3 / 9 張', 'param substitution');
    assert.strictEqual(t('dlg.restore_msg', { n: 5, m: 2 }).includes('5'), true, 'multiple params');
    assert.strictEqual(t('__missing_key__'), '__missing_key__', 'missing key returns key itself');
    // 切換 en 後 lookup + fallback
    setLang('en');
    assert.strictEqual(t('menu.help'), 'How to Use', 'en lookup after setLang');
    assert.strictEqual(t('st.mastered', { m: 3, t: 9 }), 'Mastered 3 / 9', 'en param substitution');
    setLang('zh');
    assert.strictEqual(t('menu.help'), '操作教學', 'switch back to zh');
    console.log('T3 t() behavior (params/fallback/switch): OK');
}

// ---- T4: applyI18n 屬性掃描（stub DOM） ----
{
    const attrs = [];
    const el = (name) => ({
        dataset: {}, textContent: '',
        setAttribute: (a, v) => attrs.push(`${name}.${a}=${v}`)
    });
    const els = [];
    const e1 = el('i18n'); e1.dataset.i18n = 'menu.help';
    const e2 = el('aria'); e2.dataset.i18nAria = 'aria.close';
    const e3 = el('ph'); e3.dataset.i18nPlaceholder = 'ac.search_ph';
    els.push(e1, e2, e3);
    const document = { querySelectorAll: (sel) => {
        if (sel === '[data-i18n]') return [e1];
        if (sel === '[data-i18n-aria]') return [e2];
        if (sel === '[data-i18n-placeholder]') return [e3];
        return [];
    } };
    applyI18n(document);
    assert.strictEqual(e1.textContent, '操作教學', 'data-i18n applied to textContent');
    assert.ok(attrs.some(a => a === 'aria.aria-label=關閉'), 'data-i18n-aria applied');
    assert.ok(attrs.some(a => a === 'ph.placeholder=搜尋關鍵字或標籤...'), 'data-i18n-placeholder applied');
    console.log('T4 applyI18n attribute scanning: OK');
}

console.log('\nALL i18n CONSISTENCY TESTS PASSED');
