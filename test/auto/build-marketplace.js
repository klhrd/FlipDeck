// v5.13.0：牌組市集目錄產生器——把 data/*.json 範例轉為 marketplace/decks/*.json + index.json
// 執行：node test/auto/build-marketplace.js（張數不符即中斷，保證 count 欄位與實際卡片一致）
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'data');
const OUT = path.join(ROOT, 'marketplace');
const DECKS = path.join(OUT, 'decks');

const SOURCES = [
    { file: 'hs_6000.json', id: 'ex_hs_6000', title: '高中 6000 單字', description: 'High School 6000 English words (grouped by level)', author: 'FlipDeck', tags: ['英文'], updated: '2026-11-03' },
    { file: 'verbs.json', id: 'ex_verbs', title: '動詞三態', description: 'Irregular verb past / past-participle forms', author: 'FlipDeck', tags: ['英文'], updated: '2026-11-03' },
    { file: 'elements.json', id: 'ex_elements', title: '元素週期表', description: 'Periodic table elements (Chinese)', author: 'FlipDeck', tags: ['自然'], updated: '2026-11-03' },
    { file: 'capitals.json', id: 'ex_capitals', title: '國家與首都', description: 'Countries and their capitals', author: 'FlipDeck', tags: ['地理'], updated: '2026-11-03' }
];

if (!fs.existsSync(DECKS)) fs.mkdirSync(DECKS, { recursive: true });

const catalog = SOURCES.map(s => {
    const cards = JSON.parse(fs.readFileSync(path.join(DATA, s.file), 'utf8'));
    assert.ok(Array.isArray(cards) && cards.length > 0, `${s.file} must be a non-empty card array`);
    cards.forEach((c, i) => {
        assert.ok(typeof c.card_id === 'string' && c.card_id, `${s.file} card #${i} missing card_id`);
        assert.ok(Array.isArray(c.fields), `${s.file} card #${i} missing fields array`);
    });
    fs.writeFileSync(path.join(DECKS, `${s.id}.json`), JSON.stringify({ id: s.id, title: s.title, cards }, null, 2));
    return { id: s.id, title: s.title, description: s.description, author: s.author, tags: s.tags, count: cards.length, file: `decks/${s.id}.json`, updated: s.updated };
});

// 斷言：count 與實際產出的 deck 檔卡片數一致（規格驗收條件）
catalog.forEach(e => {
    const deck = JSON.parse(fs.readFileSync(path.join(OUT, e.file), 'utf8'));
    assert.strictEqual(e.count, deck.cards.length, `${e.id}: catalog count mismatch`);
    assert.strictEqual(deck.id, e.id, `${e.id}: deck id mismatch`);
});

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(catalog, null, 2));
console.log(`marketplace: ${catalog.length} decks, ${catalog.reduce((a, e) => a + e.count, 0)} cards generated OK`);
