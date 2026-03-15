# Project Manifest - 單字卡 PWA

## 核心功能清單 (Critical Features)
- [F01] **PWA 支援**：支援離線存取、Service Worker 快取與桌面/行動端安裝。
- [F02] **多格式匯入**：相容 .json (UDM), .csv, .txt 格式的單字集匯入。
- [F03] **學習進度追蹤**：自動紀錄每張卡片的學習狀態（正確/錯誤/未讀），並持久化於 LocalStorage。
- [F04] **全域標籤管理**：支援跨單字集的標籤系統，可用於分類與篩選列表。
- [F05] **資料備份與匯出**：提供全系統 .zip 備份及單一單字集多格式 (.csv, .txt, .json) 匯出。
- [F06] **個人化學習設定**：可調整字體大小、自動翻牌索引、卡片排列方向（水平/垂直）。
- [F07] **現代化 UI/UX**：使用 Tailwind CSS 構建，支援深色模式 (Dark Mode) 與響應式設計。

## 筆記 (Note)
- 專案版本號目前由 `index.html` 的標題與內部註解維護。
- 資料存儲完全依賴用戶瀏覽器的 LocalStorage，需定期導出備份以防資料遺失。
- 程式架構採用原生 JavaScript (Vanilla JS)，不依賴大型框架。

## 技術棧 (Stack)
- HTML5 / Tailwind CSS (CDN)
- Vanilla JavaScript
- JSZip (用於備份功能)
- Service Worker API
