// 備份匯入還原測試 — 合併語意 / 狀態補齊 / allTags 聯集 / meta 缺失預設
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

// Harness scope: restoreBackup references deckList, allTags, DEFAULT_DECK_SETTINGS,
// saveDeckData, saveDeckState, saveDeckList — provide stores + spies.
{
    const store = new Map();
    let deckList = [
        { id: 'existing', title: '舊標題', totalCards: 5, lastOpened: 111, progress: 10, settings: { fontSize: 3.0, filterTags: ['x'] } }
    ];
    let allTags = ['old'];
    const DEFAULT_DECK_SETTINGS = { fontSize: 2.5, filterTags: [] };
    const saveDeckData = (id, data) => store.set('data:' + id, data);
    const saveDeckState = (id, s) => store.set('state:' + id, s);
    const saveDeckList = () => store.set('deckList', deckList);
    eval(extractFn('restoreBackup'));

    const backup = {
        deckList: [
            { id: 'existing', title: '新標題', settings: { fontSize: 2.0, filterTags: [] } },
            { id: 'fresh', title: '全新牌組', lastOpened: 999 }
        ],
        allTags: ['old', 'new'],
        decks: [
            { id: 'existing', data: [{ card_id: 'e1', fields: ['a', 'b'], tags: [] }], state: { e1: { mastery: 4, lastTime: 1 } } },
            { id: 'fresh', data: [{ card_id: 'f1', fields: ['x', 'y'], tags: [] }, { card_id: 'f2', fields: ['z', 'w'], tags: [] }], state: { f1: { mastery: 2, lastTime: 1 } } },
            { id: null, data: 'garbage' }, // 無效條目應被跳過
        ]
    };
    const { restored, added } = restoreBackup(backup);

    // T1: 覆蓋與新增計數、清單順序（新的在最前）
    assert.deepStrictEqual({ restored, added }, { restored: 1, added: 1 }, 'one overwritten, one added');
    assert.strictEqual(deckList.length, 2, 'deckList merged');
    assert.strictEqual(deckList[0].id, 'fresh', 'new deck at front');
    assert.strictEqual(deckList[1].title, '新標題', 'existing title overwritten, position kept');

    // T2: 資料與狀態寫入、缺漏進度補齊
    assert.deepStrictEqual(store.get('data:fresh').length, 2, 'fresh data saved');
    const freshState = store.get('state:fresh');
    assert.strictEqual(freshState.get('f1').mastery, 2, 'existing state restored');
    assert.ok(freshState.get('f2') && freshState.get('f2').mastery === 1, 'missing card backfilled mastery 1');

    // T3: allTags 聯集去重
    assert.deepStrictEqual(allTags, ['old', 'new'], 'allTags union deduped');
    assert.strictEqual(store.get('deckList'), deckList, 'deckList persisted');

    // T4: meta 缺失時用預設值，不丟例外
    const r2 = restoreBackup({ deckList: [], decks: [{ id: 'minimal', data: [{ card_id: 'm1', fields: ['a'], tags: [] }] }] });
    assert.deepStrictEqual(r2, { restored: 0, added: 1 }, 'backup without deckList meta works');
    const minimal = deckList.find(d => d.id === 'minimal');
    assert.ok(minimal.title === 'minimal' && minimal.settings.fontSize === 2.5, 'defaults applied when meta missing');

    console.log('T1 merge counts/order: OK');
    console.log('T2 data+state save with backfill: OK');
    console.log('T3 allTags union: OK');
    console.log('T4 missing-meta defaults: OK');
    console.log('\nALL v4.4.0 BACKUP-RESTORE TESTS PASSED');
}
