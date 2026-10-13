// v5.4.0 分享編解碼測試 — 抽取真實 encodeDeckForUrl / decodeDeckFromUrl
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);
const encSrc = extractFn('encodeDeckForUrl');
const decSrc = extractFn('decodeDeckFromUrl');

(async () => {
    eval(encSrc);
    eval(decSrc);

    const deck = {
        id: 'd_1712800000000',
        title: '測試牌組 Test Deck',
        cards: [
            { card_id: 'c1', fields: ['hello', '你好', 'greeting'], tags: ['basic'], notes: '' },
            { card_id: 'c2', fields: ['world', '世界'], tags: [], notes: 'extra note' },
            { card_id: 'c3', fields: ['x'], tags: ['a', 'b'], notes: '' }
        ]
    };

    // ---- T1: round-trip 完整保留（id / 標題 / card_id / fields / tags / notes） ----
    const payload = await encodeDeckForUrl(deck);
    const out = await decodeDeckFromUrl(payload);
    assert.strictEqual(out.id, deck.id, 'deck id preserved');
    assert.strictEqual(out.title, deck.title, 'title preserved (incl. CJK)');
    assert.strictEqual(out.cards.length, 3, 'card count');
    assert.deepStrictEqual(out.cards[0], { card_id: 'c1', fields: ['hello', '你好', 'greeting'], tags: ['basic'], notes: '' }, 'card 1 round-trip');
    assert.deepStrictEqual(out.cards[1], { card_id: 'c2', fields: ['world', '世界'], tags: [], notes: 'extra note' }, 'card 2 (notes + empty tags)');
    console.log('T1 round-trip: OK');

    // ---- T2: payload 是 base64url；夠大的牌組確實壓縮（小輸入 base64 開銤本來就大於壓縮收益） ----
    assert.ok(/^[A-Za-z0-9\-_]+$/.test(payload), 'base64url alphabet only');
    const big = { id: 'd_big', title: 'Big', cards: Array.from({ length: 60 }, (_, i) => ({ card_id: 'card_' + i, fields: ['word_number_' + i, 'definition for word number ' + i + ' with some repeated filler text'], tags: ['level' + (i % 5)], notes: '' })) };
    const bigPayload = await encodeDeckForUrl(big);
    const bigRaw = JSON.stringify({ i: big.id, t: big.title, c: big.cards.map(c => [c.card_id, c.fields, c.tags, '']) });
    assert.ok(bigPayload.length < bigRaw.length, `compressed (${bigPayload.length}) < raw json (${bigRaw.length})`);
    const roundBig = await decodeDeckFromUrl(bigPayload);
    assert.strictEqual(roundBig.cards.length, 60, 'big deck round-trip count');
    console.log(`T2 base64url + compression: OK (60-card deck ${bigRaw.length} -> ${bigPayload.length} chars)`);

    // ---- T3: 損毀 payload 拒絕 ----
    let threw = false;
    try { await decodeDeckFromUrl('not-a-valid-payload!!'); } catch (e) { threw = true; }
    assert.ok(threw, 'corrupted payload throws');
    threw = false;
    try { await decodeDeckFromUrl(payload + 'AAAA'); } catch (e) { threw = true; } // 附加位元組破壞 deflate
    assert.ok(threw, 'truncated/extended payload throws');
    console.log('T3 corrupted payload rejected: OK');

    console.log('\nALL v5.4.0 SHARE CODEC TESTS PASSED');
})().catch(e => { console.error('TEST FAILED:', e.message); process.exit(1); });
