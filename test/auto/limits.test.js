// v5.1.0 限制與排程輔助測試 — enforceNewCardLimit / applyLapse / buildForecast
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);
const DAY_MS = 86400000;
const LEECH_THRESHOLD = 8;

// ---- T1: enforceNewCardLimit ----
{
    eval(extractFn('enforceNewCardLimit'));
    const mk = (id, reps, due) => ({ card_id: id });
    const status = new Map([
        ['new1', { reps: 0, due: 0 }],                 // 未引入新卡
        ['new2', { reps: 0, due: 0 }],
        ['new3', { reps: 0, due: 0 }],
        ['failed', { reps: 0, due: Date.now() }],     // 失敗過：reps=0 但已 due → 複習，不受限
        ['review', { reps: 2, due: Date.now() - 5 }],  // 到期複習，不受限
        ['future', { reps: 3, due: Date.now() + DAY_MS }]
    ]);
    const cards = ['new1', 'new2', 'new3', 'failed', 'review', 'future'].map(mk);

    // 額度 2：新卡只留 2 張，複習/失敗卡全保留
    const out = enforceNewCardLimit(cards, status, 2, 0);
    const ids = out.map(c => c.card_id);
    assert.ok(ids.includes('failed') && ids.includes('review'), 'failed/review kept');
    assert.strictEqual(ids.filter(i => i.startsWith('new')).length, 2, 'only 2 new cards kept');

    // 今日已引入 1 張 → 剩額度 1
    const out2 = enforceNewCardLimit(cards, status, 2, 1);
    assert.strictEqual(out2.map(c => c.card_id).filter(i => i.startsWith('new')).length, 1, 'introducedToday reduces allowance');

    // 額度 0 = 無上限
    const out3 = enforceNewCardLimit(cards, status, 0, 0);
    assert.strictEqual(out3.length, cards.length, 'limit 0 = unlimited');

    // 額度用滿 → 新卡全數排除
    const out4 = enforceNewCardLimit(cards, status, 5, 5);
    assert.strictEqual(out4.map(c => c.card_id).filter(i => i.startsWith('new')).length, 0, 'exhausted allowance excludes all new cards');
    console.log('T1 enforceNewCardLimit (allowance/failed-exempt/unlimited/exhausted): OK');
}

// ---- T2: applyLapse — 失敗計數與 leech 門檻 ----
{
    eval(extractFn('applyLapse'));
    const st = {};
    for (let i = 1; i <= LEECH_THRESHOLD; i++) {
        applyLapse(st, LEECH_THRESHOLD);
        assert.strictEqual(st.lapses, i, `lapses ${i}`);
        if (i < LEECH_THRESHOLD) assert.ok(!st.leech, `not leech below ${LEECH_THRESHOLD}`);
    }
    assert.ok(st.leech, 'leech flagged at threshold');
    applyLapse(st, LEECH_THRESHOLD);
    assert.ok(st.leech, 'leech stays flagged');
    // 自訂門檻
    const st2 = {};
    applyLapse(st2, 3); applyLapse(st2, 3); applyLapse(st2, 3);
    assert.ok(st2.leech, 'custom threshold respected');
    console.log('T2 applyLapse (count/threshold/persistent flag): OK');
}

// ---- T3: buildForecast — 日曆天分桶 + 30+ 溢位 + 暫停排除 ----
{
    eval(extractFn('buildForecast'));
    // 固定 now（2026-04-11 12:00 本地時間）保證分桶確定性：startOfToday = 04-11 00:00
    const now = new Date(2026, 3, 11, 12, 0, 0).getTime();
    const DAY = DAY_MS;
    const status = new Map([
        ['a', { due: now + 1 * DAY }],        // 明天中午 → 日曆第 1 天
        ['a2', { due: now + 1 * DAY }],       // 明天中午 → 同格
        ['b', { due: now + 1.5 * DAY }],      // 後天 00:00 → 第 2 天
        ['c', { due: now + 3 * DAY }],        // 第 3 天
        ['d', { due: now + 45 * DAY }],       // 30+ 天 → 第 31 格
        ['e', { due: now, suspended: true }],   // 暫停 → 排除
        ['f', { due: now - 1000 }],             // 已到期 → 不入圖
        ['g', { due: 0 }],                      // 新卡 due 0 → 不入圖
        ['h', { due: now + 100 * DAY, suspended: true }] // 暫停的遠期卡 → 排除
    ]);
    const cards = [...status.keys()].map(id => ({ card_id: id }));
    const fc = buildForecast(cards, status, now);
    assert.strictEqual(fc.length, 31, '31 buckets');
    assert.strictEqual(fc[1], 2, 'day 1 (明天) has 2');
    assert.strictEqual(fc[2], 1, 'day 2 has 1');
    assert.strictEqual(fc[3], 1, 'day 3 has 1');
    assert.strictEqual(fc[30], 1, 'beyond-30d lands in last bucket');
    assert.strictEqual(fc.reduce((a, b) => a + b, 0), 5, '5 future-due cards counted; suspended/overdue/new excluded');
    console.log('T3 buildForecast (calendar buckets/30+ cap/suspended excluded): OK');
}

console.log('\nALL v5.1.0 LIMITS TESTS PASSED');
