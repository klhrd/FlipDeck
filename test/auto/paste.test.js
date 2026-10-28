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
    assert.deepStrictEqual(cards[0].tags, ['n'], 'POS added as tag');
    assert.deepStrictEqual(cards[1].fields, ['go by', 'phr.', '依據…判斷']);
    assert.deepStrictEqual(cards[1].tags, ['phr']);
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
    assert.deepStrictEqual(pole.tags, ['n'], 'POS tag');
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

// ---- T8: detectPosLayout——三欄詞性版面偵測（v5.8.0 欄位角色） ----
{
    eval(extractFn('detectPosLayout'));
    const pos3 = [
        { fields: ['apple', 'n.', '蘋果'], tags: ['n'] },
        { fields: ['go by', 'phr.', '依據…判斷'], tags: ['phr'] }
    ];
    assert.deepStrictEqual(detectPosLayout(pos3), { frontField: 0, backField: 2, frontSubField: 1 }, '3-col POS layout');
    assert.deepStrictEqual(detectPosLayout([{ fields: ['w', 'd'] }]), {}, '2-col untouched');
    assert.deepStrictEqual(detectPosLayout([{ fields: ['w', 'n.', 'd'] }, { fields: ['w2', '不是詞性', 'd2'] }]), {}, 'mixed POS column rejected');
    assert.deepStrictEqual(detectPosLayout([]), {}, 'empty deck');
    assert.deepStrictEqual(detectPosLayout([{ fields: ['', 'n.', 'd'] }]), {}, 'empty front rejected');
    console.log('T8 detectPosLayout: OK');
}

// ---- T9: resolveFieldIndices——夾限、front≠back、sub 衝突防護 ----
{
    eval(extractFn('resolveFieldIndices'));
    const deck3 = [{ fields: ['a', 'b', 'c'] }];
    assert.deepStrictEqual(resolveFieldIndices({ frontField: 0, backField: 1, frontSubField: null }, deck3), { ff: 0, bf: 1, sf: null }, 'default');
    assert.deepStrictEqual(resolveFieldIndices({ frontField: 1, backField: 0, frontSubField: null }, deck3), { ff: 1, bf: 0, sf: null }, 'reverse mapping kept');
    assert.deepStrictEqual(resolveFieldIndices({ frontField: 9, backField: 2, frontSubField: null }, deck3), { ff: 2, bf: 0, sf: null }, 'out-of-range clamped');
    assert.deepStrictEqual(resolveFieldIndices({ frontField: 2, backField: 2, frontSubField: null }, deck3), { ff: 2, bf: 0, sf: null }, 'ff===bf resolved');
    assert.deepStrictEqual(resolveFieldIndices({ frontField: 0, backField: 2, frontSubField: 1 }, deck3), { ff: 0, bf: 2, sf: 1 }, 'POS sub layout');
    assert.deepStrictEqual(resolveFieldIndices({ frontField: 0, backField: 2, frontSubField: 2 }, deck3), { ff: 0, bf: 2, sf: null }, 'sub conflicts with back → null');
    assert.deepStrictEqual(resolveFieldIndices({}, [{ fields: ['only'] }]), { ff: 0, bf: 0, sf: null }, 'single-field deck');
    console.log('T9 resolveFieldIndices: OK');
}

console.log('\nALL PASTE IMPORT TESTS PASSED');
