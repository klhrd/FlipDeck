// v5.14.0 FSRS 排程演算法測試 — 判定映射 / 初始值 / 成長 / SM-2 惰性遷移 / 夾限
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

const DAY = 86400000;
const DAY_MS = DAY; // fsrsUpdate 參照生產源碼的 DAY_MS
const FSRS_W = eval('(' + src.match(/const FSRS_W = (\[[^\]]+\]);/)[1] + ')');
// 模組層常數（生產源碼）——測試環境補齊
const FSRS_DECAY = -0.5, FSRS_FACTOR = 19 / 81, FSRS_RETENTION = 0.9;
const fsrsClamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

eval(extractFn('fsrsUpdate'));

// ---- T1: 新卡初始值（判定映射：忘記→Again / 翻面→Good / 即答→Easy） ----
{
    const t0 = 1700000000000;
    // 即答 → Easy(G=4)：D0 = w4 - w5 = 6.6604、S0 = w3 = 15.69105 → interval ≈ 16 天
    const easy = fsrsUpdate({ mastery: 1 }, 5, t0);
    assert.ok(Math.abs(easy.d - (FSRS_W[4] - FSRS_W[5])) < 1e-9, 'Easy D0');
    assert.ok(Math.abs(easy.s - FSRS_W[3]) < 1e-9, 'Easy S0 = w3');
    assert.strictEqual(easy.interval, Math.max(1, Math.round(FSRS_W[3])), 'Easy interval ≈ S');
    assert.strictEqual(easy.due, t0 + easy.interval * DAY, 'due = now + interval');
    assert.strictEqual(easy.reps, 1, 'reps 1');
    // 翻面 → Good(G=3)：D0 = w4、S0 = w2 = 3.173 → ~3 天
    const good = fsrsUpdate({ mastery: 1 }, 4, t0);
    assert.ok(Math.abs(good.d - FSRS_W[4]) < 1e-9, 'Good D0 = w4');
    assert.ok(Math.abs(good.s - FSRS_W[2]) < 1e-9, 'Good S0 = w2');
    assert.strictEqual(good.interval, 3, 'Good interval ≈ 3');
    // 忘記 → Again(G=1)：due=now 立即重到期、interval 0
    const again = fsrsUpdate({ mastery: 1 }, 2, t0);
    assert.strictEqual(again.due, t0, 'Again due = now');
    assert.strictEqual(again.interval, 0, 'Again interval 0');
    assert.ok(Math.abs(again.d - fsrsClamp(FSRS_W[4] + FSRS_W[5] * 2, 1, 10)) < 1e-9, 'Again D0');
    assert.ok(Math.abs(again.s - FSRS_W[0]) < 1e-9, 'Again S0 = w0');
    console.log('T1 new-card initial D/S per rating: OK');
}

// ---- T2: 成長曲線——準時答對 → S 成長、interval ≈ S（R=0.9 時精確相等性質） ----
{
    const t0 = 1700000000000;
    const st = fsrsUpdate({ mastery: 1 }, 4, t0); // Good: d≈7.19, s≈3.17
    st.lastTime = t0; // 生產端在判定流程設定（演算法本身不寫入）
    const st2 = fsrsUpdate(st, 4, t0 + 3 * DAY); // 準時複習
    assert.ok(st2.s > st.s, 'success grows stability');
    assert.ok(st2.interval >= 1 && st2.due === t0 + 3 * DAY + st2.interval * DAY, 'scheduled forward');
    // 忘記後 R 下降，stability 墜落
    st2.lastTime = t0 + 3 * DAY;
    const st3 = fsrsUpdate(st2, 2, t0 + 3 * DAY + st2.interval * DAY);
    assert.ok(st3.s < st2.s, 'lapse collapses stability');
    assert.strictEqual(st3.due, t0 + 3 * DAY + st2.interval * DAY, 'lapse due = now');
    console.log('T2 stability growth/collapse: OK');
}

// ---- T3: SM-2 惰性遷移（無 d/s 欄位的舊卡） ----
{
    const t0 = 1700000000000;
    const legacy = { mastery: 3, ef: 2.5, reps: 2, interval: 6, due: t0, lastTime: t0 - 6 * DAY };
    const out = fsrsUpdate(legacy, 4, t0);
    assert.ok(Math.abs(out.d - 5) < 0.05, 'ef 2.5 → D≈5（含均值回歸微移）');
    assert.strictEqual(out.reps, 3, 'reps continued');
    assert.ok(out.s > 6, 'success grows beyond seeded S (seed = interval 6)');
    console.log('T3 SM-2 lazy migration (D from ef, S from interval): OK');
}

// ---- T4: 夾限——D ∈ [1,10]、S ≥ 0.1、極端連錯 ----
{
    let st = { mastery: 1 };
    const t0 = 1700000000000;
    for (let i = 0; i < 12; i++) {
        st = fsrsUpdate(st, 2, t0 + i * DAY); // 連續忘記 12 次
        st.lastTime = t0 + i * DAY;
        assert.ok(st.d >= 1 && st.d <= 10, 'D clamped');
        assert.ok(st.s >= 0.1 && st.s <= 36500, 'S clamped');
    }
    assert.ok(st.d > 7, 'repeated lapses push D high');
    console.log('T4 clamping under extreme lapse streaks: OK');
}

console.log('\nALL v5.14.0 FSRS TESTS PASSED');
