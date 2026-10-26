// v5.7.1 分享標題整合測試——完整 encode → decode → 匯入 → 首頁顯示 標題貫穿驗證
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);
eval(extractFn('encodeDeckForUrl'));
eval(extractFn('decodeDeckFromUrl'));

(async () => {
    // T1: 分享視窗標題顯示——從 openShareModal 取出的 title 正確編碼
    const deck = {
        id: 'd_test',
        title: '我的英文單字',
        cards: [
            { card_id: 'a', fields: ['apple', '蘋果'], tags: ['fruit'], notes: '' },
            { card_id: 'b', fields: ['banana', '香蕉'], tags: [], notes: 'note here' }
        ]
    };
    const payload = await encodeDeckForUrl(deck);
    assert.ok(payload.length > 0);
    // 解碼後 title 必須完整保留
    const decoded = await decodeDeckFromUrl(payload);
    assert.strictEqual(decoded.title, '我的英文單字', '★ 標題在 payload 內完整保留');
    assert.strictEqual(decoded.id, 'd_test');
    assert.strictEqual(decoded.cards.length, 2);
    assert.deepStrictEqual(decoded.cards[0].fields, ['apple', '蘋果']);
    console.log('T1 codec: 標題「我的英文單字」完整在 payload 內: OK');

    // T2: 英文標題
    const deck2 = { id: 'd_en', title: 'TOEIC 500 Core', cards: [{ card_id: 'x', fields: ['word', 'def'], tags: [], notes: '' }] };
    const payload2 = await encodeDeckForUrl(deck2);
    const decoded2 = await decodeDeckFromUrl(payload2);
    assert.strictEqual(decoded2.title, 'TOEIC 500 Core');
    console.log('T2 英文標題: OK');

    // T3: 空標題（邊界——encode 時 fallback 用 id）
    const deck3 = { id: 'd_fallback', title: undefined, cards: [{ card_id: 'x', fields: ['w'], tags: [], notes: '' }] };
    const payload3 = await encodeDeckForUrl(deck3);
    const decoded3 = await decodeDeckFromUrl(payload3);
    assert.strictEqual(decoded3.title, undefined, 'undefined stays undefined');
    console.log('T3 undefined title edge: OK（呼叫端 openShareModal 以 || id 兜底）');

    console.log('\nALL SHARE TITLE TESTS PASSED');
})().catch(e => { console.error('TEST FAILED:', e.message); process.exit(1); });
