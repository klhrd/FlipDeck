// v5.15.0 圖片卡測試 — URL 偵測 / 渲染 / 夾帶安全
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

eval(extractFn('isImageUrl'));
eval(extractFn('fieldHtml'));
eval(extractFn('fieldsToHtml'));
const IMAGE_URL_RE = eval('(' + src.match(/const IMAGE_URL_RE = (\/[^;]+\/i);/)[1] + ')'); // 模組層常數補齊

// ---- T1: isImageUrl 判定 ----
{
    assert.strictEqual(isImageUrl('https://x.com/a.png'), true);
    assert.strictEqual(isImageUrl('http://x.com/b.JPG'), true, 'case-insensitive');
    assert.strictEqual(isImageUrl('https://x.com/c.webp?w=100'), true, 'query string ok');
    assert.strictEqual(isImageUrl('https://x.com/d.avif'), true);
    assert.strictEqual(isImageUrl('https://x.com/page'), false, 'no extension');
    assert.strictEqual(isImageUrl('https://x.com/e.png/extra'), false, 'path after ext');
    assert.strictEqual(isImageUrl('ftp://x.com/f.png'), false, 'protocol');
    assert.strictEqual(isImageUrl('蘋果'), false);
    assert.strictEqual(isImageUrl(''), false);
    assert.strictEqual(isImageUrl('https://x.com/g.svg'), true);
    console.log('T1 isImageUrl: OK');
}

// ---- T2: fieldHtml 渲染 + 安全夾帶 ----
{
    const html = fieldHtml('https://x.com/a.png');
    assert.ok(html.includes('<img src="https://x.com/a.png"'), 'img tag with src');
    assert.ok(html.includes('loading="lazy"'), 'lazy');
    assert.ok(html.includes('referrerpolicy="no-referrer"'), 'no referrer');
    // 引號注入防護（可通過 URL regex 但含引號）
    const evil = fieldHtml('https://x.com/a".png');
    assert.ok(evil.includes('%22'), 'quote escaped');
    assert.ok(!evil.includes('src="https://x.com/a"'), 'no attribute break');
    // 非圖片 URL 原樣
    assert.strictEqual(fieldHtml('https://x.com/page'), 'https://x.com/page', 'non-image passthrough');
    assert.strictEqual(fieldHtml('**bold**'), '**bold**', 'text passthrough');
    console.log('T2 fieldHtml render + safety: OK');
}

// ---- T3: fieldsToHtml 多欄拼接（空欄過濾、混合欄位） ----
{
    const card = { fields: ['https://x.com/a.png', '', '文字說明', 'https://x.com/b.jpg'] };
    const html = fieldsToHtml([0, 1, 2, 3], card);
    assert.ok(html.includes('<img src="https://x.com/a.png"'), 'field 0 as img');
    assert.ok(html.includes('文字說明'), 'field 2 as text');
    assert.ok(html.includes('<img src="https://x.com/b.jpg"'), 'field 3 as img');
    assert.ok(!html.includes('<br><br>'), 'no empty gaps');
    // 純文字欄不經圖片路徑
    assert.strictEqual(fieldsToHtml([0], { fields: ['單字'] }), '單字');
    console.log('T3 fieldsToHtml mixed fields: OK');
}

console.log('\nALL v5.15.0 IMAGE-CARD TESTS PASSED');
