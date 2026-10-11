// Session / 進度計算邏輯測試 — 抽取 js/script.js 的真實函式原始碼（非重新實作）
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

const syncCardStatusSrc = extractFn('syncCardStatus');
const resetSessionViewSrc = extractFn('resetSessionView');
const calculateProgressSrc = extractFn('calculateProgress');
const escapeAttrSrc = extractFn('escapeAttr');

// ---- Test 1: escapeAttr round-trip (the earlier entity-decoding regression guard) ----
{
    const escapeAttr = eval(`(${escapeAttrSrc})`);
    const Q = '&' + 'quot;', L = '&' + 'lt;', G = '&' + 'gt;', A = '&' + 'amp;';
    const out = escapeAttr('he said "hi" <b>& 100%');
    const expected = 'he said ' + Q + 'hi' + Q + ' ' + L + 'b' + G + A + ' 100%';
    assert.strictEqual(out, expected, 'all four entities produced');
    // browser-style attribute unescape restores the original
    const round = out.split(Q).join('"').split(L).join('<').split(G).join('>').split(A).join('&');
    assert.strictEqual(round, 'he said "hi" <b>& 100%', 'unescape restores original');
    assert.strictEqual(escapeAttr(undefined), '', 'undefined -> empty');
    console.log('T1 escapeAttr: OK (entities intact, round-trip, null-safe)');
}

// ---- Test 2: syncCardStatus — prunes stale ids, adds missing, keeps existing mastery ----
{
    const DAY_MS = 86400000;
    let currentCardStatus = new Map([
        ['old_gone', { mastery: 5, lastTime: 1 }],
        ['keep', { mastery: 3, lastTime: 2 }],
        ['legacy_num', 4]  // v3-era legacy numeric state
    ]);
    eval(syncCardStatusSrc);
    syncCardStatus([{ card_id: 'keep' }, { card_id: 'new_card' }, { card_id: 'legacy_num' }]);

    assert.ok(!currentCardStatus.has('old_gone'), 'stale id pruned (fixes progress denominator)');
    assert.strictEqual(currentCardStatus.get('keep').mastery, 3, 'existing mastery preserved');
    assert.strictEqual(currentCardStatus.get('new_card').mastery, 1, 'new card defaults to mastery 1 (editor-save crash fixed)');
    assert.strictEqual(typeof currentCardStatus.get('legacy_num'), 'object', 'legacy numeric state converted to object');
    assert.strictEqual(currentCardStatus.size, 3, 'map size matches deck');
    console.log('T2 syncCardStatus: OK (prune + add + preserve + legacy convert)');
}

// ---- Test 3: calculateProgress — data-driven denominator, stale-proof ----
{
    const store = new Map();
    const getDeckData = (id) => { const s = store.get('data:' + id); return s ? JSON.parse(s) : null; };
    const getDeckState = (id) => { const s = store.get('state:' + id); return s ? new Map(Object.entries(JSON.parse(s))) : new Map(); };
    eval(calculateProgressSrc);

    // 3a: normal math — 2 cards, mastery 3 & 5 → (2+4)/(2*4) = 75%
    store.set('data:d1', JSON.stringify([{ card_id: 'a' }, { card_id: 'b' }]));
    store.set('state:d1', JSON.stringify({ a: { mastery: 3, lastTime: 1 }, b: { mastery: 5, lastTime: 2 } }));
    assert.strictEqual(calculateProgress('d1'), 75, '75% for mastery 3+5 of 2 cards');

    // 3b: THE hs_6000 regression — deck re-issued all-new card_ids while old state entries linger at mastery 5
    store.set('data:ex_hs_6000', JSON.stringify([{ card_id: 'new_1' }, { card_id: 'new_2' }]));
    store.set('state:ex_hs_6000', JSON.stringify({
        old_1: { mastery: 5, lastTime: 1 }, old_2: { mastery: 5, lastTime: 1 },  // orphans
        new_1: { mastery: 1, lastTime: 3 }, new_2: { mastery: 1, lastTime: 4 }
    }));
    assert.strictEqual(calculateProgress('ex_hs_6000'), 0, 'orphaned mastery-5 entries ignored; new cards at 1 → 0%');

    // 3c: deleted-card stale entries must not dilute — 1 real card mastered (mastery 5) → 100%
    store.set('data:d2', JSON.stringify([{ card_id: 'x' }]));
    store.set('state:d2', JSON.stringify({ x: { mastery: 5, lastTime: 1 }, deleted_y: { mastery: 5, lastTime: 1 } }));
    assert.strictEqual(calculateProgress('d2'), 100, 'stale deleted entry does not dilute 100%');

    // 3d: missing state entry counts as mastery 1 (no crash)
    store.set('data:d3', JSON.stringify([{ card_id: 'x' }]));
    store.set('state:d3', JSON.stringify({}));
    assert.strictEqual(calculateProgress('d3'), 0, 'empty state → 0%, no exception');

    // 3e: missing deck data → 0%
    assert.strictEqual(calculateProgress('nope'), 0, 'no data → 0%');

    // 3f: deckData param skips the parse (used by updateUI hot path)
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) calculateProgress('d1', [{ card_id: 'a' }, { card_id: 'b' }]);
    const dt = performance.now() - t0;
    assert.ok(dt < 200, `1000 in-memory calls fast (${dt.toFixed(1)}ms)`);
    console.log('T3 calculateProgress: OK (hs_6000 orphan regression, stale-prune, empty/missing safe, memo param)');
}

// ---- Test 4: resetSessionView — resets queue/history and calls chain in order ----
{
    let currentCardStatus = new Map([['a', { mastery: 1, lastTime: 1 }]]);
    let currentFullDeck = [{ card_id: 'a' }];
    let currentLearningDeck = [], upcomingQueue = ['stale1', 'stale2'];
    let history = ['h1', 'h2'], historyIndex = 1;
    const order = [];
    const syncCardStatus = (d) => order.push('sync');
    const updateLearningDeck = () => order.push('update');
    const fillUpcomingQueue = () => order.push('fill');
    const showNextCard = (a) => order.push('next:' + a);
    eval(resetSessionViewSrc);
    resetSessionView();

    assert.deepStrictEqual(history, [], 'history cleared');
    assert.strictEqual(historyIndex, -1, 'historyIndex reset');
    assert.deepStrictEqual(upcomingQueue, [], 'queue cleared');
    assert.deepStrictEqual(order, ['sync', 'update', 'fill', 'next:new_game'], 'call order: sync → update → fill → next card');
    console.log('T4 resetSessionView: OK (state reset + ordered refresh chain)');
}

console.log('\nALL SESSION/PROGRESS LOGIC TESTS PASSED');
