// 學習流程邏輯測試 — 判定 / undo 快照 / appConfirm 對話框（抽取真實函式原始碼）
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

const showNextCardSrc = extractFn('showNextCard');
const undoLastActionSrc = extractFn('undoLastAction');
const appConfirmSrc = extractFn('appConfirm');
const sm2UpdateSrc = extractFn('sm2Update');
const applyLapseSrc = extractFn('applyLapse');
const DAY_MS = 86400000;
const LEECH_THRESHOLD = 8;
// v5.2.0: appConfirm 預設文案走 t() —— 測試環境以鍵名代替（不影響行為斷言）
const t = (k, params) => {
    let s = k;
    if (params) for (const [pk, pv] of Object.entries(params)) s = s.split('{' + pk + '}').join(String(pv));
    return s;
};

// Session harness: the extracted functions share THIS lexical scope.
function makeSession() {
    const mkState = (mastery, extra = {}) => ({
        mastery, lastTime: 1, ef: 2.5, reps: mastery - 1 > 0 ? mastery - 1 : 0,
        interval: 0, due: 0, lapses: 0, leech: false, suspended: false, ...extra
    });
    let currentCardStatus = new Map([
        ['a', mkState(2, { reps: 1, interval: 1 })],
        ['b', mkState(1)],
        ['c', mkState(1)]
    ]);
    let currentLearningDeck = ['a', 'b', 'c'];
    let upcomingQueue = ['b', 'c'];
    let history = [], historyIndex = -1;
    let lastAction = null;
    let currentDeckId = 'deck1';
    const MAX_HISTORY = 50;
    const calls = [];
    const document = { getElementById: () => null }; // 無進行中卡面 → 翻面偵測為 false → q=5

    const markFirstInteraction = () => calls.push('markFirst');
    const updateLearningDeck = () => calls.push('updateLearning');
    const displayCardStack = () => calls.push('render');
    const updateUI = () => calls.push('ui');
    const saveDeckState = () => calls.push('save');
    const displayEndOfDeck = () => calls.push('endOfDeck');
    const fillUpcomingQueue = () => { while (upcomingQueue.length < 2 && currentLearningDeck.length > 0) upcomingQueue.push(currentLearningDeck[currentLearningDeck.length - 1]); };
    const showUndoPill = () => { if (lastAction) calls.push('undoPillShown'); };
    const hideUndoPill = () => { lastAction = null; };
    const adjustDailyNew = (delta) => calls.push('adjustDailyNew:' + delta);

    eval(sm2UpdateSrc);
    eval(applyLapseSrc);
    eval(showNextCardSrc);
    eval(undoLastActionSrc);

    return {
        calls,
        showNextCard, undoLastAction, sm2Update,
        status: currentCardStatus,
        expireUndo: hideUndoPill,
        get history() { return history; },
        get historyIndex() { return historyIndex; },
        get lastAction() { return lastAction; },
        get queue() { return upcomingQueue; },
        set queue(q) { upcomingQueue = q; }
    };
}

(async () => {
    // ---- T1: 'correct' judgment — SM-2 排程 + undo 完整還原 ----
    {
        const S = makeSession();
        S.showNextCard('new_game');
        assert.strictEqual(S.historyIndex, 0, 'historyIndex advanced to first card');
        assert.strictEqual(S.history[0], 'b', 'first card from queue');
        assert.strictEqual(S.lastAction, null, 'new_game records no undo action');
        assert.ok(!S.calls.includes('undoPillShown'), 'no undo pill on initial deal');

        const before = { mastery: 1, ef: 2.5, reps: 0, interval: 0, due: 0, lapses: 0, leech: false, suspended: false };
        S.showNextCard('correct'); // document stub → 未翻面 → q=5；b 是新卡 → wasIntro
        const after = S.status.get('b');
        assert.strictEqual(after.mastery, 2, 'mastery incremented');
        assert.strictEqual(after.ef, 2.6, 'SM-2: q=5 raises EF 2.5 -> 2.6');
        assert.strictEqual(after.reps, 1, 'SM-2: reps 1');
        assert.strictEqual(after.interval, 1, 'SM-2: first success +1 day');
        assert.ok(after.due > Date.now(), 'SM-2: scheduled to future');
        assert.deepStrictEqual(S.lastAction, { cardId: 'b', prev: before, nextId: 'c', wasIntro: true }, 'undo payload = full snapshot + wasIntro');
        assert.ok(S.calls.includes('adjustDailyNew:1'), 'v5.1: introducing a new card consumes daily allowance');
        assert.ok(S.calls.includes('undoPillShown'), 'undo pill shown on judgment');
        assert.strictEqual(S.historyIndex, 1, 'advanced to next card');

        S.undoLastAction();
        const restored = S.status.get('b');
        assert.strictEqual(restored.mastery, 1, 'undo restores mastery');
        assert.strictEqual(restored.ef, 2.5, 'undo restores EF');
        assert.strictEqual(restored.due, 0, 'undo restores due');
        assert.strictEqual(restored.lapses, 0, 'undo restores lapses');
        assert.ok(S.calls.includes('adjustDailyNew:-1'), 'v5.1: undo refunds the daily allowance');
        assert.strictEqual(S.historyIndex, 0, 'undo rewinds historyIndex');
        assert.deepStrictEqual(S.history, ['b'], 'undo removes advanced card from history');
        assert.strictEqual(S.queue[0], 'c', 'undo puts next card back at queue front');
        assert.strictEqual(S.lastAction, null, 'undo consumed the action');
        console.log('T1 correct+undo round-trip (SM-2 snapshot + daily allowance): OK');
    }

    // ---- T2: 'skip' leaves mastery AND SM-2 untouched; undo restores only position ----
    {
        const S = makeSession();
        S.showNextCard('new_game');
        const m = S.status.get('b');
        const snapshot = { mastery: m.mastery, ef: m.ef, reps: m.reps, interval: m.interval, due: m.due };
        S.showNextCard('skip');
        assert.strictEqual(S.status.get('b').mastery, snapshot.mastery, 'skip does not change mastery');
        assert.strictEqual(S.status.get('b').ef, snapshot.ef, 'skip does not change EF');
        assert.strictEqual(S.lastAction.prev, null, 'skip marks prev as null (position-only undo)');
        assert.strictEqual(S.lastAction.wasIntro, false, 'skip never consumes daily allowance');
        assert.ok(!S.calls.includes('adjustDailyNew:1'), 'no allowance consumed on skip');
        assert.strictEqual(S.history[1], 'c', 'skip still advances');
        S.undoLastAction();
        assert.strictEqual(S.status.get('b').ef, snapshot.ef, 'undo of skip keeps EF');
        assert.strictEqual(S.historyIndex, 0, 'position rewound');
        console.log('T2 skip+undo: OK (no mastery/SM-2 side-effect)');
    }

    // ---- T3: 'incorrect' — SM-2 重置 + lapses 計數 + undo 還原全部欄位 ----
    {
        const S = makeSession();
        S.queue = ['a', 'c'];
        S.showNextCard('new_game');
        assert.strictEqual(S.history[0], 'a');
        const before = { ...S.status.get('a') };
        S.showNextCard('incorrect');
        const after = S.status.get('a');
        assert.strictEqual(after.mastery, 1, 'incorrect resets mastery to 1');
        assert.strictEqual(after.reps, 0, 'SM-2: reps reset');
        assert.ok(after.due <= Date.now(), 'SM-2: immediately re-due');
        assert.ok(after.ef < before.ef, 'SM-2: EF penalized');
        assert.strictEqual(after.lapses, 1, 'v5.1: lapse counted');
        assert.strictEqual(S.lastAction.wasIntro, false, 'failed card (reps>0) is not a new-card intro');
        S.undoLastAction();
        const restored = S.status.get('a');
        assert.strictEqual(restored.mastery, 2, 'undo restores mastery 2');
        assert.strictEqual(restored.ef, before.ef, 'undo restores EF');
        assert.strictEqual(restored.reps, before.reps, 'undo restores reps');
        assert.strictEqual(restored.due, before.due, 'undo restores due');
        assert.strictEqual(restored.lapses, 0, 'undo restores lapses');
        console.log('T3 incorrect+undo: OK (full SM-2 state + lapses)');
    }

    // ---- T4: 'new_game' never records action; undo without action is a no-op ----
    {
        const S = makeSession();
        S.showNextCard('new_game');
        assert.ok(!S.calls.includes('undoPillShown'));
        S.undoLastAction();
        assert.strictEqual(S.historyIndex, 0, 'undo with no action is a no-op');
        console.log('T4 new_game/no-action guard: OK');
    }

    // ---- T5: hideUndoPill invalidates the pending undo (3.5s window) ----
    {
        const S = makeSession();
        S.showNextCard('new_game');
        S.showNextCard('correct');
        assert.ok(S.lastAction);
        S.expireUndo();
        assert.strictEqual(S.lastAction, null, 'window expiry clears lastAction');
        console.log('T5 undo window invalidation: OK');
    }

    // ---- T6: appConfirm resolves via OK / Cancel (promise semantics + v4.5.0 focus mgmt) ----
    {
        const mkEl = () => ({ textContent: '', onclick: null, className: '', focused: 0, focus() { this.focused++; }, classList: { add: () => {}, remove: () => {}, toggle: () => {} } });
        let confirmModalTitle = mkEl(), confirmModalMessage = mkEl();
        let confirmModalOkBtn = mkEl(), confirmModalCancelBtn = mkEl();
        let appConfirmModal = mkEl();
        let confirmResolveFn = null;
        const document = { activeElement: null, contains: () => false }; // v4.5.0 焦點管理所需的 stub
        eval(appConfirmSrc);

        const p1 = appConfirm({ title: 'T', message: 'M' });
        assert.ok(confirmResolveFn instanceof Function, 'resolver armed on open');
        assert.strictEqual(confirmModalOkBtn.focused, 1, 'v4.5.0: normal dialog focuses OK');
        assert.strictEqual(confirmModalCancelBtn.focused, 0, 'cancel not focused for non-danger');
        confirmModalOkBtn.onclick();
        assert.strictEqual(await p1, true, 'OK resolves true');

        const p2 = appConfirm({ danger: true });
        assert.ok(/bg-red-500/.test(confirmModalOkBtn.className), 'danger styles the OK button red');
        assert.strictEqual(confirmModalCancelBtn.focused, 1, 'v4.5.0: danger dialog focuses Cancel (safety)');
        confirmModalCancelBtn.onclick();
        assert.strictEqual(await p2, false, 'Cancel resolves false');
        assert.strictEqual(confirmResolveFn, null, 'resolver cleared after close');
        console.log('T6 appConfirm promise + danger styling + focus mgmt: OK');
    }

    console.log('\nALL v4.2.0 UX LOGIC TESTS PASSED');
})().catch(e => { console.error('TEST FAILED:', e.message); process.exit(1); });
