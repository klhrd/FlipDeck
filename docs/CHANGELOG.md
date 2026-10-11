# Changelog

All notable changes to this project will be documented in this file.

## [4.3.0] - 2026-04-11
### Added（UX Roadmap P5 大牌組體驗 + P7 完成畫面，清單見 docs/TODO.md）
- **編輯器分頁 + 搜尋 (P5)**：改寫為「陣列工作副本」架構，每次只渲染 100 張（hs_6000 的 6498 張從接近不可用 → 順暢），新增卡片搜尋框、頁碼導覽；輸入即時寫回副本，分頁/搜尋不影響未顯示的卡片。
- **編輯器未儲存防護**：有修改時，取消/關閉/Escape 離開編輯器會先以對話框確認，避免輸入心血直接遺失。
- **載入狀態 (P5)**：範例載入與檔案匯入（fetch + parse 大檔期間）顯示全屏 loading 覆蓋層，UI 不再無回應地凍結。
- **防回鍋排程 (P5)**：`fillUpcomingQueue` 排除最近 8 張已作答卡片，同一張卡不再答完立刻又跳回來；牌組太小時自動退讓。
- **再讀一輪 (P7)**：完成畫面新增「再讀一輪」——只重置「目前篩選下」的卡片熟練度並重新開始（經確認對話框），其他卡片不受影響。

### Changed
- **版本號升級**：v4.2.0 -> v4.3.0；SW `CACHE_NAME` 同步 bump。

## [4.2.0] - 2026-04-11
### Added（UX Roadmap P1–P4 + P6 快速項，完整清單見 docs/TODO.md）
- **範例覆載保護 (P1)**：重新載入已有進度的範例（如高中 6000 單字）前，以 in-app 對話框明示熟練度將重置，不再靜默清空。
- **引導性 (P2)**：首次啟動自動開啟操作教學（關閉後不再打擾）；卡片正面加入「Tap to flip」提示（對齊 UI spec）；首次答題前顯示手勢提示列，首次操作後自動收起並記住。
- **復原 (P3)**：判定後 3.5 秒內可點「復原」膠囊，回復該次熟練度變更並跳回上一張（含結束畫面前的最後一張）。
- **上滑跳過 (P3)**：向上滑動（>80px 或快甩）不評分直接換下一張，卡片稍後自動再出現；鍵盤 ↑ 同效。
- **通用對話框 (P4)**：新增 `appConfirm`/`appAlert`，全面取代原生 `alert()`/`confirm()`（上傳錯誤、JSON 錯誤、空牌組、刪除牌組）。
- **無障礙快速項 (P6)**：開放雙指縮放（移除 `user-scalable=no`）、Escape 依層級關閉對話框/Modal/選單、icon 按鈕補 aria-label、支援 `prefers-reduced-motion`。

### Changed
- **教學內容**：操作教學新增「上滑跳過」與「復原」兩步。
- **版本號升級**：v4.1.5 -> v4.2.0；SW `CACHE_NAME` 同步 bump 至 `flipdeck-cache-v4.2.0`。

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
