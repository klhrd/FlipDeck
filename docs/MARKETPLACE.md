# 牌組市集（Deck Marketplace）

無後端的牌組收錄機制：本 repo 內的靜態 JSON 目錄 + 牌組檔，App 經 jsDelivr CDN 載入（CORS 開啟、**快取約 12 小時**——更新後不會立刻反映，屬正常）。

## 檔案結構

- `marketplace/index.json`——目錄陣列，每個條目：
  ```json
  { "id": "ex_hs_6000", "title": "高中 6000 單字", "description": "High School 6000 English words",
    "author": "FlipDeck", "tags": ["英文"], "count": 6498, "file": "decks/ex_hs_6000.json", "updated": "2026-11-03" }
  ```
- `marketplace/decks/*.json`——牌組檔，形狀與分享連結解碼結果一致：
  ```json
  { "id": "ex_hs_6000", "title": "高中 6000 單字",
    "cards": [ { "card_id": "c1", "fields": ["正面", "背面", "補充(可選)"], "tags": [], "notes": "" } ] }
  ```

## 收錄流程（PR）

1. 準備牌組 JSON（形狀如上；`fields[0]`＝正面必填）。
2. 在 `marketplace/decks/` 新增 `<id>.json`，並在 `index.json` 加**一**行目錄條目。
3. 提交 PR——維護者審核內容後合併。

## 命名與 id 慣例

- id：`ex_` 前綴保留給內建範例（重裝即覆蓋）；社群牌組請用 `m_<主題>` 或自訂唯一 id（同 id 安裝會覆蓋既有牌組）。
- 檔名＝`<id>.json`；`count` 必須與 cards 實際張數一致（App 端會驗證）。

## 產生與驗證

- 內建範例重生：`node test/auto/build-marketplace.js`（張數不符即中斷）。
- 驗證測試：`npm test`（`marketplace.test.js` 驗證條目與牌組形狀、count 一致性）。
- App 端規則：目錄條目須通過 `validateCatalogEntry`（file 限 `decks/` 開頭相對路徑、防 `..` 跳脫）；牌組須通過 `validateMarketDeck`。

## CDN 注意事項

- 目錄與牌組檔經 `https://cdn.jsdelivr.net/gh/klhrd/FlipDeck@main/marketplace/` 存取，**快取約 12 小時**；PR 合併後請等待快取過期再驗收。
- 市集為 network-only（Service Worker 不預快取），離線時顯示「無法載入市集」。
