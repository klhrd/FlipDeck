// 抽卡佇列 / 標籤篩選 / 編輯器序列化測試 — 抽取真實函式原始碼
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

const fillUpcomingQueueSrc = extractFn('fillUpcomingQueue');
const matchesDeckFilterSrc = extractFn('matchesDeckFilter');
const serializeEditorRowsSrc = extractFn('serializeEditorRows');

const mkCard = (id, tags = []) => ({ card_id: id, fields: [id, '', ''], tags });

// ---- T1: fillUpcomingQueue anti-repeat ----
{
    let upcomingQueue = [], currentLearningDeck = [], history = [];
    const RECENT_SKIP = 8;
    const origRandom = Math.random;
    eval(fillUpcomingQueueSrc);
    const fill = fillUpcomingQueue;

    // 1a: 大牌組 — 剛答過的 8 張不會回鍋
    currentLearningDeck = Array.from({ length: 12 }, (_, i) => mkCard(`c${i}`));
    history = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']; // 最近 8 張
    upcomingQueue = [];
    Math.random = () => 0; // 總是選 window 第一張
    fill();
    assert.strictEqual(upcomingQueue.length, 5, 'fills to 5');
    assert.ok(new Set(upcomingQueue).size === upcomingQueue.length, 'no duplicates in queue');
    // 前 4 張必須全部來自非近期（c8..c11），第 5 張才允許退讓到近期卡
    upcomingQueue.slice(0, 4).forEach(id => {
        assert.ok(['c8', 'c9', 'c10', 'c11'].includes(id), `non-recent priority: ${id} in first 4`);
    });
    console.log('T1a anti-repeat (12-card deck): OK', JSON.stringify(upcomingQueue));

    // 1b: 小牌組（3 張、全在近期）仍可終止並填滿，且無重複
    currentLearningDeck = [mkCard('a'), mkCard('b'), mkCard('c')];
    history = ['a', 'b', 'c'];
    upcomingQueue = [];
    fill();
    assert.strictEqual(upcomingQueue.length, 3, 'small deck fills all 3');
    assert.ok(new Set(upcomingQueue).size === 3, 'no duplicates for small deck');
    console.log('T1b small-deck fallback terminates: OK', JSON.stringify(upcomingQueue));

    // 1c: 空學習牌組 → 不丟例外、佇列不變
    currentLearningDeck = [];
    history = [];
    upcomingQueue = [];
    fill();
    assert.deepStrictEqual(upcomingQueue, [], 'empty learning deck no-op');
    console.log('T1c empty-deck guard: OK');

    // 1d: 佇列已有 5 張 → 不再填
    currentLearningDeck = [mkCard('a')];
    upcomingQueue = ['q1', 'q2', 'q3', 'q4', 'q5'];
    fill();
    assert.deepStrictEqual(upcomingQueue, ['q1', 'q2', 'q3', 'q4', 'q5'], 'full queue untouched');
    console.log('T1d full-queue guard: OK');
    Math.random = origRandom;
}

// ---- T2: matchesDeckFilter ----
{
    let currentDeckSettings = { filterTags: [] };
    eval(matchesDeckFilterSrc);
    const t = mkCard('x', ['verb', 'level1']);
    const u = mkCard('y', []);
    assert.strictEqual(matchesDeckFilter(t), true, 'no filter -> everything matches');
    currentDeckSettings = { filterTags: ['verb'] };
    assert.strictEqual(matchesDeckFilter(t), true, 'tag match');
    assert.strictEqual(matchesDeckFilter(u), false, 'tag mismatch');
    currentDeckSettings = { filterTags: ['untagged'] };
    assert.strictEqual(matchesDeckFilter(u), true, 'untagged matches untagged filter');
    assert.strictEqual(matchesDeckFilter(t), false, 'tagged card excluded by untagged filter');
    currentDeckSettings = { filterTags: ['noun', 'verb'] };
    assert.strictEqual(matchesDeckFilter(t), true, 'multi-filter OR semantics');
    console.log('T2 matchesDeckFilter: OK (none/tag/untagged/multi)');
}

// ---- T3: serializeEditorRows ----
{
    eval(serializeEditorRowsSrc);
    const out = serializeEditorRows([
        { card_id: 'a', fields: ['  hello  ', '嗨 ', ' note '], tags: 'x, y ,, z', notes: 'keep' },
        { card_id: 'b', fields: ['', '背面不該出現', ''], tags: '', notes: '' },   // 正面空 -> 過濾
        { card_id: 'c', fields: ['word', undefined, undefined], tags: '  ,  ', notes: '' }
    ]);
    assert.strictEqual(out.length, 2, 'empty-front row filtered out');
    assert.deepStrictEqual(out[0], { card_id: 'a', fields: ['hello', '嗨', 'note'], tags: ['x', 'y', 'z'], notes: 'keep' }, 'trim + tag parse + notes preserved');
    assert.deepStrictEqual(out[1].fields, ['word', '', ''], 'missing fields default to empty string');
    assert.deepStrictEqual(out[1].tags, [], 'whitespace-only tags dropped');
    console.log('T3 serializeEditorRows: OK (filter/trim/tags/notes)');
}

console.log('\nALL v4.3.0 P5 LOGIC TESTS PASSED');
