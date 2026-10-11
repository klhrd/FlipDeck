# Changelog

All notable changes to this project will be documented in this file.

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
