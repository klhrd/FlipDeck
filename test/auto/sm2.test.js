// SM-2 間隔重複演算法測試 — 間隔數列 / EF 公式 / 失敗重置 / 遷移 / 到期制排程
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

const DAY = 86400000;

// ---- T1: sm2Update — intervals 1 → 6 → ×EF ----
{
    const DAY_MS = DAY;
    eval(extractFn('sm2Update'));
    const t0 = 1700000000000;

    // 第一次答對（q=5 即答）：+1 天、EF +0.1
    let s = { ef: 2.5, reps: 0, interval: 0 };
    s = { ...s, ...sm2Update(s, 5, t0) };
    assert.strictEqual(s.interval, 1, 'I(1) = 1 day');
    assert.strictEqual(s.reps, 1, 'reps 1');
    assert.strictEqual(s.ef, 2.6, 'q=5 raises EF by 0.1');
    assert.strictEqual(s.due, t0 + 1 * DAY, 'due = now + 1 day');

    // 第二次（q=4 翻面後答對）：+6 天、EF 不變
    s = { ...s, ...sm2Update(s, 4, t0) };
    assert.strictEqual(s.interval, 6, 'I(2) = 6 days');
    assert.strictEqual(s.ef.toFixed(10), (2.6).toFixed(10), 'q=4 keeps EF');
    assert.strictEqual(s.due, t0 + 6 * DAY, 'due = now + 6 days');

    // 第三次（q=5）：I = 6 × 2.6 = 15.6 → 16 天、EF +0.1
    s = { ...s, ...sm2Update(s, 5, t0) };
    assert.strictEqual(s.interval, 16, 'I(3) = round(6 × EF)');
    assert.strictEqual(s.ef, 2.7, 'EF grows again');

    // 連續答對後的長間隔：第 4 次先升 EF 至 2.8，I(4) = round(16 × 2.8) = 45
    s = { ...s, ...sm2Update(s, 5, t0) };
    assert.strictEqual(s.interval, 45, 'I(4) = round(16 × EF-updated 2.8)');
    console.log('T1 intervals 1/6/×EF + EF formula: OK');
}

// ---- T2: 失敗（q=2）—— EF 重懲罰、立即重新到期 ----
{
    const DAY_MS = DAY;
    eval(extractFn('sm2Update'));
    const t0 = 1700000000000;
    let s = { ef: 2.5, reps: 3, interval: 16, due: t0 + 16 * DAY };
    s = { ...s, ...sm2Update(s, 2, t0) };
    assert.strictEqual(s.reps, 0, 'reps reset');
    assert.strictEqual(s.interval, 0, 'interval reset');
    assert.strictEqual(s.due, t0, 'due = now (immediately re-eligible)');
    assert.ok(Math.abs(s.ef - (2.5 - 0.32)) < 1e-9, 'q=2 lowers EF by 0.32');
    console.log('T2 fail path (reset + immediate due + EF penalty): OK');
}

// ---- T3: EF 下限 1.3 ----
{
    const DAY_MS = DAY;
    eval(extractFn('sm2Update'));
    let s = { ef: 1.35, reps: 5, interval: 100 };
    s = { ...s, ...sm2Update(s, 2, 0) };
    assert.strictEqual(s.ef, 1.3, 'EF clamped at 1.3');
    console.log('T3 EF floor clamp: OK');
}

// ---- T4: syncCardStatus 遷移（v4 mastery → v5 SM-2 → v5.1 lapses/suspended） ----
{
    let currentCardStatus = new Map([
        ['legacy_m5', { mastery: 5, lastTime: 1 }],          // 完熟 → reps 4, ~38 天後到期
        ['legacy_m2', { mastery: 2, lastTime: 1 }],          // → reps 1, 1 天後到期
        ['legacy_m1', { mastery: 1, lastTime: 1 }],          // 新卡 → due 0 立即到期
        ['already_v5', { mastery: 3, lastTime: 1, ef: 2.2, reps: 2, interval: 6, due: 123 }], // v5.0 資料：SM-2 不覆蓋、補 lapses/suspended
        ['v51_full', { mastery: 3, lastTime: 1, ef: 2.5, reps: 2, interval: 6, due: 123, lapses: 4, suspended: true }], // v5.1 完整資料：完全不動
        ['old_gone', { mastery: 4, lastTime: 1 }]
    ]);
    const DAY_MS = DAY;
    eval(extractFn('syncCardStatus'));
    const before = Date.now();
    syncCardStatus([{ card_id: 'legacy_m5' }, { card_id: 'legacy_m2' }, { card_id: 'legacy_m1' }, { card_id: 'already_v5' }, { card_id: 'v51_full' }, { card_id: 'brand_new' }]);
    const after = Date.now();

    assert.ok(!currentCardStatus.has('old_gone'), 'stale pruned');
    const m5 = currentCardStatus.get('legacy_m5');
    assert.strictEqual(m5.reps, 4, 'mastery 5 -> reps 4');
    assert.strictEqual(m5.interval, 38, 'mastery 5 -> interval 38d (6 × 2.5^2)');
    assert.ok(m5.due > before + 37 * DAY && m5.due < after + 39 * DAY, 'm5 due ≈ 38 days out');
    assert.strictEqual(m5.lapses, 0, 'v5.1: legacy gets lapses 0');
    assert.strictEqual(m5.suspended, false, 'v5.1: legacy gets suspended false');
    const m2 = currentCardStatus.get('legacy_m2');
    assert.strictEqual(m2.reps, 1, 'mastery 2 -> reps 1');
    assert.ok(m2.due > before && m2.due < after + 2 * DAY, 'm2 due ≈ 1 day out');
    assert.strictEqual(currentCardStatus.get('legacy_m1').due, 0, 'mastery 1 -> due 0');
    const kept = currentCardStatus.get('already_v5');
    assert.deepStrictEqual([kept.ef, kept.reps, kept.due, kept.lapses, kept.suspended], [2.2, 2, 123, 0, false], 'v5.0 fields kept + v5.1 backfilled');
    const full = currentCardStatus.get('v51_full');
    assert.deepStrictEqual([full.ef, full.reps, full.due, full.lapses, full.suspended], [2.5, 2, 123, 4, true], 'v5.1 fields untouched');
    const fresh = currentCardStatus.get('brand_new');
    assert.deepStrictEqual([fresh.mastery, fresh.ef, fresh.reps, fresh.interval, fresh.due, fresh.lapses, fresh.suspended], [1, 2.5, 0, 0, 0, 0, false], 'new card defaults');
    console.log('T4 syncCardStatus migration (mastery->SM-2->v5.1, keep existing, defaults): OK');
}

// ---- T5: updateLearningDeck —— 到期制過濾與排序 ----
{
    let currentFullDeck = [
        { card_id: 'future', tags: [] },   // due 未來
        { card_id: 'overdue', tags: [] },  // due 過去（最逾期）
        { card_id: 'new', tags: [] },      // due 0
        { card_id: 'due_soon', tags: [] }  // due 剛過（較近）
    ];
    const now = Date.now();
    let currentCardStatus = new Map([
        ['future', { mastery: 3, ef: 2.5, reps: 2, interval: 6, due: now + 6 * DAY }],
        ['overdue', { mastery: 2, ef: 2.5, reps: 1, interval: 1, due: now - 3 * DAY }],
        ['new', { mastery: 1, ef: 2.5, reps: 0, interval: 0, due: 0 }],
        ['due_soon', { mastery: 4, ef: 2.5, reps: 3, interval: 16, due: now - 1000 }]
    ]);
    let currentDeckSettings = { filterTags: [] };
    const matchesDeckFilter = () => true;
    let currentLearningDeck = [];
    eval(extractFn('updateLearningDeck'));
    updateLearningDeck();

    assert.ok(!currentLearningDeck.some(c => c.card_id === 'future'), 'future-due card excluded');
    assert.deepStrictEqual(currentLearningDeck.map(c => c.card_id), ['overdue', 'due_soon', 'new'], 'overdue reviews first (asc), then new cards');
    console.log('T5 updateLearningDeck due-based filter/sort: OK');
}

// ---- T6: getDeckStats —— 進度 + 到期一次求得 ----
{
    const now = Date.now();
    const store = {
        'data:d1': [{ card_id: 'a' }, { card_id: 'b' }, { card_id: 'c' }],
        'state:d1': {
            a: { mastery: 5, ef: 2.5, reps: 4, interval: 38, due: now + 20 * DAY },  // 未到期
            b: { mastery: 3, ef: 2.5, reps: 2, interval: 6, due: now - 1000 },       // 到期
            c: { mastery: 1, lastTime: 1 }                                            // 舊格式 → due 0 → 到期
        }
    };
    const getDeckData = (id) => store['data:' + id] || null;
    const getDeckState = (id) => new Map(Object.entries(store['state:' + id] || {}));
    eval(extractFn('getDeckStats'));
    const st = getDeckStats('d1');
    assert.strictEqual(st.progress, Math.floor(((4 + 2 + 0) / 12) * 100), 'progress from mastery points');
    assert.strictEqual(st.due, 2, 'due counts expired + legacy (due 0), excludes future');
    assert.deepStrictEqual(getDeckStats('missing'), { progress: 0, due: 0 }, 'missing deck safe');
    console.log('T6 getDeckStats (progress + due in one pass): OK');
}

console.log('\nALL v5.0.0 SM-2 LOGIC TESTS PASSED');
