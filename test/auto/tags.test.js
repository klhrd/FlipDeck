// 批次標籤運算 / 跳轉卡片測試 — 抽取真實函式原始碼
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

// ---- T1: applyTagsToCards (pure) ----
{
    eval(extractFn('applyTagsToCards'));
    const mk = (tags) => ({ tags });
    // add: union + dedupe + trims
    const cards = [mk('a, b'), mk(''), mk('a')];
    let touched = applyTagsToCards(cards, [0, 1, 2], 'b, c , b,', 'add');
    assert.strictEqual(touched, 3, 'touched count');
    assert.strictEqual(cards[0].tags, 'a, b, c', 'union dedupe');
    assert.strictEqual(cards[1].tags, 'b, c', 'empty card gains tags');
    assert.strictEqual(cards[2].tags, 'a, b, c', 'merge into existing');
    // remove: difference
    applyTagsToCards(cards, [0], 'b', 'remove');
    assert.strictEqual(cards[0].tags, 'a, c', 'difference removes only listed tag');
    // empty input -> no-op
    assert.strictEqual(applyTagsToCards(cards, [0], '  ,  ', 'add'), 0, 'empty tags string no-op');
    // out-of-range index skipped
    const t2 = applyTagsToCards(cards, [99], 'x', 'add');
    assert.strictEqual(t2, 0, 'invalid index ignored');
    console.log('T1 applyTagsToCards (union/dedupe/remove/no-op/OOB): OK');
}

// ---- T2: jumpToCard ----
{
    let currentFullDeck = [{ card_id: 'a' }, { card_id: 'b' }, { card_id: 'mastered' }];
    let upcomingQueue = ['a', 'b'];
    let history = ['a', 'b'], historyIndex = 1;
    const calls = [];
    const hideUndoPill = () => calls.push('hideUndoPill');
    const showNextCard = (a) => calls.push('showNext:' + a);
    eval(extractFn('jumpToCard'));

    // valid jump: target to queue front, duplicates removed, session reset
    jumpToCard('b');
    assert.deepStrictEqual(upcomingQueue, ['b', 'a'], 'jumped card deduped and moved to front');
    assert.deepStrictEqual(history, [], 'history reset');
    assert.strictEqual(historyIndex, -1, 'index reset');
    assert.ok(calls.includes('showNext:new_game'), 'session restarted');

    // jump to card already at front: no self-duplication
    jumpToCard('b');
    assert.deepStrictEqual(upcomingQueue, ['b', 'a'], 'no duplicate after re-jump');

    // invalid id: complete no-op
    const before = JSON.stringify({ u: upcomingQueue, h: history });
    jumpToCard('ghost');
    assert.strictEqual(JSON.stringify({ u: upcomingQueue, h: history }), before, 'unknown card id no-op');
    console.log('T2 jumpToCard (queue front/dedupe/reset/no-op): OK');
}

console.log('\nALL v4.5.0 LOGIC TESTS PASSED');
