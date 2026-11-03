// v5.6.0 貼上匯入解析測試——含真實亂序資料的救援接合
const assert = require('assert');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);
// 從生產源碼抽取 POS_RE（避免測試副本漂移）
const posReMatch = src.match(/const POS_RE = (\/.+\/i);/);
assert.ok(posReMatch, 'POS_RE found in source');
const POS_RE = eval(posReMatch[1]);

eval(extractFn('parseMarkdownTable'));
eval(extractFn('parsePastedContent'));

// ---- T1: 乾淨表格（表頭 + 分隔列 + 詞性欄保留獨立） ----
{
    const cards = parseMarkdownTable([
        '| 單字 | 詞性 | 中文 |',
        '| --- | --- | --- |',
        '| apple | n. | 蘋果 |',
        '| go by | phr. | 依據…判斷 |'
    ], 1000);
    assert.strictEqual(cards.length, 2, 'header skipped');
    assert.deepStrictEqual(cards[0].fields, ['apple', 'n.', '蘋果'], 'POS kept as own field');
    assert.deepStrictEqual(cards[0].tags, [], 'POS not written to real tags (v5.9.1: tag source via tagFields)');
    assert.deepStrictEqual(cards[1].fields, ['go by', 'phr.', '依據…判斷']);
    assert.deepStrictEqual(cards[1].tags, []);
    console.log('T1 clean table + POS kept as field: OK');
}

// ---- T2: 真實資料——合併行救援（pole/ladder；碎片「杆」接回竿；） ----
{
    const cards = parseMarkdownTable([
        '||---|--|',
        '| pole | n. | 竿；| ladder | n. | 梯子 |杆 |'
    ], 2000);
    assert.strictEqual(cards.length, 2);
    const pole = cards.find(c => c.fields[0] === 'pole');
    const ladder = cards.find(c => c.fields[0] === 'ladder');
    assert.ok(pole.fields[2].includes('竿；杆'), `pole def 竿；杆 實際：「${pole.fields[2]}」`);
    assert.ok(ladder.fields[2].includes('梯子'), 'ladder def');
    assert.deepStrictEqual(pole.tags, [], 'no real tag (v5.9.1)');
    console.log('T2 merged-row rescue (pole/ladder): OK');
}

// ---- T3: 真實資料——（）佔位優先（flame/tap/pea；tap 吃兩個碎片） ----
{
    const cards = parseMarkdownTable([
        '| flame | n. | 火焰；| tap | v. | （），，| pea | n. | 豌豆 |輕觸 |輕拍輕敲常指連續火舌 |'
    ], 3000);
    const tap = cards.find(c => c.fields[0] === 'tap');
    const pea = cards.find(c => c.fields[0] === 'pea');
    assert.ok(tap.fields[2].includes('輕觸'), 'tap gets 輕觸');
    assert.ok(tap.fields[2].includes('輕拍輕敲'), 'tap gets 輕拍輕敲…');
    assert.ok(pea.fields[2].includes('豌豆'), 'pea clean');
    console.log('T3 placeholder-priority rescue (flame/tap/pea): OK');
}

// ---- T4: 真實資料——反向接合（4 卡行；醫療的→medical、撲滅…→put sth out、一個接一個地→one by one） ----
{
    const cards = parseMarkdownTable([
        '| one by one | phr. | 逐一地；| put sth out | phr. | 熄滅…；| medical | adj. | 醫學的；| legally | adv. | 合法地 |醫療的 |撲滅… |一個接一個地 |'
    ], 4000);
    const one = cards.find(c => c.fields[0] === 'one by one');
    const put = cards.find(c => c.fields[0] === 'put sth out');
    const med = cards.find(c => c.fields[0] === 'medical');
    assert.ok(one.fields[2].includes('一個接一個地'), `one by one 實際：「${one.fields[2]}」`);
    assert.ok(put.fields[2].includes('撲滅…'), `put sth out 實際：「${put.fields[2]}」`);
    assert.ok(med.fields[2].includes('醫療的'), `medical 實際：「${med.fields[2]}」`);
    console.log('T4 reverse-stitch rescue (one-by-one line): OK');
}

// ---- T5: 雙佔位（wrap 用…包／／ → 圍、裹都接回） ----
{
    const cards = parseMarkdownTable([
        '| wrap | v. | 用…包／／| crispy | adj. | 酥脆的 |圍 |裹 |'
    ], 5000);
    const wrap = cards[0];
    assert.ok(wrap.fields[2].includes('圍') && wrap.fields[2].includes('裹'), `wrap 實際：「${wrap.fields[2]}」`);
    assert.ok(cards[1].fields[2].includes('酥脆的'));
    console.log('T5 multi-slot rescue (wrap): OK');
}

// ---- T6: parsePastedContent 分流 ----
{
    // JSON 路徑 + card_id 自動補
    const a = parsePastedContent('[{"fields":["w","d"]},{"card_id":"x","fields":["w2","d2"]}]', 6000);
    assert.strictEqual(a.cards.length, 2);
    assert.ok(a.cards[0].card_id.startsWith('p_6000'), 'auto card_id');
    assert.strictEqual(a.cards[1].card_id, 'x', 'kept explicit card_id');
    // 備份物件偵測
    const b = parsePastedContent('{"deckList":[],"decks":[]}', 6001);
    assert.ok(b.backup, 'backup detected');
    // TXT 路徑
    const c = parsePastedContent('word;def;note\nword2;def2', 6002);
    assert.strictEqual(c.cards.length, 2);
    assert.deepStrictEqual(c.cards[0].fields, ['word', 'def', 'note']);
    // Markdown 偵測
    const d = parsePastedContent('| a | n. | 甲 |\n| b | n. | 乙 |', 6003);
    assert.strictEqual(d.kind, 'md', 'md kind flag');
    assert.strictEqual(d.cards.length, 2);
    // 錯誤分流（非 { 或 [ 開頭的內容走 TXT 路徑、不報 JSON 錯——屬合理行為）
    assert.strictEqual(parsePastedContent('').error, 'empty');
    assert.strictEqual(parsePastedContent('{"broken json').error, 'json');
    assert.strictEqual(parsePastedContent('{"a":1}').error, 'shape');
    assert.strictEqual(parsePastedContent('[{"x":1}]').error, 'fields');
    assert.strictEqual(parsePastedContent('   \n  ').error, 'empty');
    const txtGarbage = parsePastedContent('not json {');
    assert.strictEqual(txtGarbage.cards.length, 1, 'non-bracket text falls to TXT path');
    console.log('T6 dispatcher (json/backup/txt/md/errors): OK');
}

// ---- T7: 無詞性欄的表格（2 欄）→ 依序對應、不合併 ----
{
    const cards = parseMarkdownTable(['| word | 蘋果 |', '| banana | 香蕉 |'], 7000);
    assert.deepStrictEqual(cards[0].fields, ['word', '蘋果'], '2-col in-order');
    assert.deepStrictEqual(cards[0].tags, [], 'no tag');
    console.log('T7 2-col table in-order: OK');
}

// ---- T8: detectPosLayout——50% 門檻偵測 + 不一致卡列正規化（v5.8.1） ----
{
    eval(extractFn('detectPosLayout'));
    eval(extractFn('normalizePosOddCards'));
    // 全 POS → 偵測成功（v5.9.1：詞性欄自動設為標籤來源）
    const pos3 = [
        { fields: ['apple', 'n.', '蘋果'], tags: [] },
        { fields: ['go by', 'phr.', '依據…判斷'], tags: [] }
    ];
    assert.deepStrictEqual(detectPosLayout(pos3), { frontFields: [0], backFields: [2], frontSubField: 1, tagFields: [1] }, '3-col POS layout');
    // 2 欄牌組不觸發
    assert.deepStrictEqual(detectPosLayout([{ fields: ['w', 'd'] }]), {}, '2-col untouched');
    // 50% 門檻：2 張中 1 張詞性 → 偵測成功
    assert.deepStrictEqual(detectPosLayout([{ fields: ['w', 'n.', 'd'] }, { fields: ['w2', '不是詞性', 'd2'] }]), { frontFields: [0], backFields: [2], frontSubField: 1, tagFields: [1] }, '50% threshold detects');
    // 低於 50%：3 張中 1 張詞性 → 不偵測、不動資料
    const low = [{ fields: ['w', 'n.', 'd'] }, { fields: ['w2', 'x', 'd2'] }, { fields: ['w3', 'y', 'd3'] }];
    assert.deepStrictEqual(detectPosLayout(low), {}, 'below 50% rejected');
    assert.deepStrictEqual(low[0].fields, ['w', 'n.', 'd'], 'no mutation on rejection');
    assert.deepStrictEqual(detectPosLayout([]), {}, 'empty deck');
    // 正規化：[單字, 定義] 列（無第 3 欄）→ 定義遞補第 3 欄、詞性槽清空
    const mixed = [{ fields: ['a', 'n.', 'x'] }, { fields: ['b', '定義'] }];
    detectPosLayout(mixed);
    assert.deepStrictEqual(mixed[1].fields, ['b', '', '定義'], 'odd card normalized (def → slot 3)');
    // 正規化不動已含第 3 欄的列
    const keep = [{ fields: ['a', 'n.', 'x'] }, { fields: ['b', 'def', 'note'] }];
    detectPosLayout(keep);
    assert.deepStrictEqual(keep[1].fields, ['b', 'def', 'note'], 'card with non-empty slot 3 untouched');
    // 編輯器新增列（第 3 欄空字串）也會遞補
    const added = [{ fields: ['a', 'n.', 'x'] }, { fields: ['b', '定義', ''] }];
    detectPosLayout(added);
    assert.deepStrictEqual(added[1].fields, ['b', '', '定義'], 'editor-added row normalized');
    console.log('T8 detectPosLayout threshold + normalization: OK');
}

// ---- T9: resolveFieldRoles——夾限、正背去重、空組防護、sub 衝突（v5.9.0 多欄角色） ----
{
    eval(extractFn('resolveFieldRoles'));
    eval(extractFn('deckMaxFieldLen')); // v5.9.3：resolveFieldRoles 改用快取 helper，測試環境一併抽取
    const cacheDecl = src.match(/let deckFieldScanCache = \{[^;]+\};/);
    assert.ok(cacheDecl, 'deckFieldScanCache found in source');
    eval(cacheDecl[0].replace('let ', 'var ')); // let 在 direct eval 內不外洩，轉 var 注入外層
    const deck3 = [{ fields: ['a', 'b', 'c'] }];
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [0], backFields: [1], frontSubField: null, tagFields: [], hiddenFields: [] }, deck3), { ff: [0], bf: [1], sf: null, tf: [], hf: [], maxF: 2 }, 'defaults');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [1], backFields: [0], frontSubField: null }, deck3), { ff: [1], bf: [0], sf: null, tf: [], hf: [], maxF: 2 }, 'reverse mapping kept');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [9, 2], backFields: [2] }, deck3), { ff: [2], bf: [], sf: null, tf: [], hf: [], maxF: 2 }, 'out-of-range clamped + back overlap removed');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [], backFields: [] }, deck3), { ff: [0], bf: [1], sf: null, tf: [], hf: [], maxF: 2 }, 'both empty → fallback');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [], backFields: [0] }, deck3), { ff: [1], bf: [0], sf: null, tf: [], hf: [], maxF: 2 }, 'front empty → non-back fallback');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [0], backFields: [2], frontSubField: 1 }, deck3), { ff: [0], bf: [2], sf: 1, tf: [], hf: [], maxF: 2 }, 'POS sub layout');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [0], backFields: [2], frontSubField: 2 }, deck3), { ff: [0], bf: [2], sf: null, tf: [], hf: [], maxF: 2 }, 'sub conflicts with back → null');
    assert.deepStrictEqual(resolveFieldRoles({ frontFields: [0], backFields: [1], frontSubField: 7, tagFields: [1, 5], hiddenFields: [3] }, deck3), { ff: [0], bf: [1], sf: null, tf: [1], hf: [], maxF: 2 }, 'tag/hide clamped, sub out-of-range null');
    assert.deepStrictEqual(resolveFieldRoles({}, [{ fields: ['only'] }]), { ff: [0], bf: [], sf: null, tf: [], hf: [], maxF: 0 }, 'single-field deck');
    console.log('T9 resolveFieldRoles: OK');
}

// ---- T10: effectiveTags——欄位合成虛擬標籤（v5.8.2 標籤欄位） ----
{
    eval(extractFn('effectiveTags'));
    const card = { fields: ['connected', 'adj.', '有來往的；有關係的'], tags: ['unit3'] };
    assert.deepStrictEqual(effectiveTags(card, []), ['unit3'], 'no tagFields → real tags only');
    assert.deepStrictEqual(effectiveTags(card, undefined), ['unit3'], 'undefined tagFields → real tags only');
    assert.deepStrictEqual(effectiveTags(card, [1]), ['unit3', 'adj.'], 'POS field merged as tag');
    assert.deepStrictEqual(effectiveTags(card, [1, 2]), ['unit3', 'adj.', '有來往的；有關係的'], 'multiple tag fields');
    assert.deepStrictEqual(effectiveTags({ fields: ['w'], tags: ['t'] }, [1, 5]), ['t'], 'missing fields skipped');
    assert.deepStrictEqual(effectiveTags({ fields: ['w', '', 'x'], tags: [] }, [1]), [], 'empty field skipped');
    console.log('T10 effectiveTags: OK');
}

console.log('\nALL PASTE IMPORT TESTS PASSED');
