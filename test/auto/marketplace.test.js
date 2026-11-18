// v5.13.0 牌組市集——目錄/牌組驗證純函式（自生產源碼抽取）+ 產出資料一致性
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { readScript, extractFn: libExtract } = require('./lib');

const src = readScript();
const extractFn = (name) => libExtract(src, name);

eval(extractFn('validateCatalogEntry'));
eval(extractFn('validateMarketDeck'));

// MARKETPLACE_BASE 常數存在且指向 jsDelivr 的 marketplace 目錄
const baseMatch = src.match(/const MARKETPLACE_BASE = '([^']+)';/);
assert.ok(baseMatch && baseMatch[1] === 'https://cdn.jsdelivr.net/gh/klhrd/FlipDeck@main/marketplace/', 'MARKETPLACE_BASE found in source');

// ---- T1: validateCatalogEntry——形狀與路徑防護 ----
{
    const good = { id: 'ex_hs_6000', title: '高中 6000 單字', file: 'decks/hs6000.json', count: 6498 };
    assert.strictEqual(validateCatalogEntry(good), true, 'valid entry');
    assert.strictEqual(validateCatalogEntry({ ...good, count: 0 }), true, 'zero count allowed');
    assert.strictEqual(validateCatalogEntry(null), false, 'null');
    assert.strictEqual(validateCatalogEntry('x'), false, 'non-object');
    assert.strictEqual(validateCatalogEntry({ ...good, id: '' }), false, 'empty id');
    assert.strictEqual(validateCatalogEntry({ ...good, id: 3 }), false, 'numeric id');
    assert.strictEqual(validateCatalogEntry({ ...good, title: '' }), false, 'empty title');
    assert.strictEqual(validateCatalogEntry({ ...good, file: '' }), false, 'empty file');
    assert.strictEqual(validateCatalogEntry({ ...good, file: 'decks/../secret.json' }), false, 'path traversal blocked');
    assert.strictEqual(validateCatalogEntry({ ...good, file: '/abs/decks/x.json' }), false, 'absolute path blocked');
    assert.strictEqual(validateCatalogEntry({ ...good, file: 'decks\\x.json' }), false, 'backslash blocked');
    assert.strictEqual(validateCatalogEntry({ ...good, file: 'hs6000.json' }), false, 'must start with decks/');
    assert.strictEqual(validateCatalogEntry({ ...good, count: -1 }), false, 'negative count');
    assert.strictEqual(validateCatalogEntry({ ...good, count: 1.5 }), false, 'non-integer count');
    assert.strictEqual(validateCatalogEntry({ ...good, count: '10' }), false, 'string count');
    console.log('T1 validateCatalogEntry: OK');
}

// ---- T2: validateMarketDeck——與 decodeDeckFromUrl 回傳形狀一致 ----
{
    const mk = () => ({ id: 'ex_verbs', title: '動詞三態', cards: [{ card_id: 'c1', fields: ['拜訪', 'visit'], tags: [], notes: '' }] });
    assert.strictEqual(validateMarketDeck(mk()), true, 'valid deck');
    assert.strictEqual(validateMarketDeck(null), false, 'null');
    assert.strictEqual(validateMarketDeck({}), false, 'empty object');
    assert.strictEqual(validateMarketDeck({ ...mk(), id: '' }), false, 'empty id');
    assert.strictEqual(validateMarketDeck({ ...mk(), title: 9 }), false, 'non-string title');
    assert.strictEqual(validateMarketDeck({ ...mk(), cards: [] }), false, 'empty cards');
    assert.strictEqual(validateMarketDeck({ ...mk(), cards: 'x' }), false, 'cards not array');
    assert.strictEqual(validateMarketDeck({ ...mk(), cards: [{ fields: ['a'] }] }), false, 'missing card_id');
    assert.strictEqual(validateMarketDeck({ ...mk(), cards: [{ card_id: 'c1' }] }), false, 'missing fields');
    assert.strictEqual(validateMarketDeck({ ...mk(), cards: [{ card_id: 'c1', fields: 'ab' }] }), false, 'fields not array');
    assert.strictEqual(validateMarketDeck({ ...mk(), cards: [null] }), false, 'null card');
    console.log('T2 validateMarketDeck: OK');
}

// ---- T3: 產出資料一致性——index.json 條目全部合法、count 與 deck 檔實際卡片數一致 ----
{
    const ROOT = path.join(__dirname, '..', '..');
    const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'marketplace', 'index.json'), 'utf8'));
    assert.ok(Array.isArray(catalog) && catalog.length >= 4, 'catalog seeded with bundled examples');
    catalog.forEach(e => {
        assert.strictEqual(validateCatalogEntry(e), true, `entry ${e.id} valid`);
        const deck = JSON.parse(fs.readFileSync(path.join(ROOT, 'marketplace', e.file), 'utf8'));
        assert.strictEqual(validateMarketDeck(deck), true, `deck ${e.id} valid`);
        assert.strictEqual(e.count, deck.cards.length, `count matches cards for ${e.id}`);
        assert.strictEqual(deck.id, e.id, `deck id matches entry for ${e.id}`);
    });
    console.log(`T3 generated marketplace data (${catalog.length} entries): OK`);
}

console.log('\nALL MARKETPLACE TESTS PASSED');
