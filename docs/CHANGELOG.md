# Changelog

All notable changes to this project will be documented in this file.

## [4.1.5] - 2026-04-11
### Fixed
- **編輯器存檔崩潰 (TypeError)**：圖形化/JSON 編輯器存檔後未同步 `currentCardStatus`，新增卡片即拋出例外、Modal 卡死。新增 `syncCardStatus()` 統一補新卡、清殘留；存檔後以 `resetSessionView()` 重置瀏覽佇列，避免 history 指向已刪除的卡片。
- **跨牌組汙染**：從首頁「設定 → JSON 原始碼」開啟編輯器時不再覆寫 session 狀態（`openDeckOptions` 不再改動 `currentDeckId`，`openEditDeckModal` 改為明確傳入目標牌組 id，僅在編輯「使用中」牌組時同步畫面）。
- **進度計算失效（TODO 項）**：分母改用牌組實際卡片數、分子僅統計現存卡片，`hs_6000` 換 id 與 JSON 刪卡留下的 stale state 不再汙染百分比；`updateUI` 改用記憶體資料，不再每次答題都重 parse；首頁排序改為每牌組僅計算一次（大牌組不再卡頓）。
- **鍵盤快捷鍵誤觸**：任一 Modal/選單開啟中或焦點在輸入框時，方向鍵/空白鍵不再偷翻卡、偷改熟練度。

### Changed
- **備份標示誠實化**：按鈕與文件由「(.zip)」改為實際輸出的「(.json)」，移除未使用的 JSZip CDN 依賴（index.html 與 SW 快取清單）。
- **圖形化編輯器**：input 屬性值加上 HTML 跳脫（欄位含雙引號不再破壞畫面），存檔保留 `notes` 欄位；卡片堆疊動畫 class `duration-400` 修正為合法的 `duration-300`。
- **空卡片堆疊防護**：篩選後無卡可顯示時顯示完成畫面而非空白。
- **死碼清理**：移除 `history-alert`、`quick-start-error-message` 等無用 DOM 與 13 個未使用的變數/函式宣告。

## [4.1.4] - 2026-04-11
### Fixed
- **Service Worker 快取策略（根本修復）**：`CACHE_NAME` 自 v3.0.3 從未更新且採純 cache-first，導致 v4.x 所有修正永遠無法送達已安裝的使用者。改為：核心資源 network-first（離線 fallback 快取）、CDN cache-first、`skipWaiting()` + `clients.claim()` 立即接管、逐一快取避免單一資源失敗阻斷安裝，並清理所有舊版快取。
- **完成牌組慶祝畫面**：「返回首頁」按鈕原先以 inline `onclick` 呼叫閉包內函式導致 ReferenceError，改為動態綁定。
- **標籤管理按鈕**：對應 Modal 早在 v4.0.0 即被移除，點擊必拋出 TypeError，移除該按鈕與相關死碼。

### Changed
- **快取範圍**：補上 `data/hs_6000.json`（原先離線時預設範例載入會失敗）、Material Symbols 與正確的 Noto Sans TC 字型 URL。
- **版本號統一**：index.html / script.js / README 同步至 v4.1.4。

## [4.1.3] - 2026-04-06
### Added
- **圖形化編輯器 (F14)**：實作視覺化編輯介面，支援動態增減卡片、即時編輯欄位與標籤，並與核心資料庫同步。
- **選單捲動支援**：修復 `.menu-panel` 在內容過長時無法垂直滾動的問題。

### Fixed
- **事件綁定優化**：完善所有 Modal 的開啟、關閉與取消邏輯，解決部分按鈕點擊無反應的情況。
- **版本一致性**：同步根目錄與 `docs/` 的管理文件內容。

### Changed
- **版本號升級**：v4.1.2 -> v4.1.3。

## [4.1.2] - 2026-04-06
### Added
- **文件與選單架構同步**：根據 `docs/MENU.md` 重新盤點並同步首頁與學習選單的功能映射。

## [4.1.1] - 2026-04-06
...
