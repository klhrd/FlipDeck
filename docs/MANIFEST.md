# Project Manifest

## 核心功能清單 (Critical Features)
- [F01] 離線 PWA 支援與 Service Worker 整合
- [F02] 多格式單字集匯入 (.txt, .csv, .json) 與範例載入
- [F03] 視覺化與 JSON 雙模式單字集編輯器 (v4.1.3 已實作初版)
- [F04] 智慧熟練度追蹤與線性 Mastery 點數計算 (v4.1.1 已修正)
- [F05] 標籤系統：支援單字集分類與單字個別標籤篩選
- [F06] 綜合模式 (Combo Mode)：融合堆疊、3D 翻轉與物理手勢判定
- [F07] 全視窗管理系統：融合搜尋、ID 檢視與 JSON 原始碼切換
- [F08] 全域備份與復原 (JSON 格式)
- [F09] 智慧抽卡排程：優先複習熟練度較低之卡片
- [F10] 介面精簡化與 Neutral 配色方案
- [F11] 選單事件穩定化系統 (Strict Event Handling & Bubbling Fix)
- [F12] 資料安全檢索機制 (Robust Data Fetching)
- [F13] 響應式滾動與層級優化 (v4.1.3 修復選單捲動)
- [F14] 圖形化單筆編輯介面 (v4.1.3 已實作)
- [F15] 通用 in-app 對話框系統 appConfirm/appAlert (v4.2.0)
- [F16] 範例覆載進度保護 (v4.2.0)
- [F17] 首次啟動引導：自動教學、Tap to flip 提示、手勢提示列 (v4.2.0)
- [F18] 判定復原 (Undo) 與上滑跳過 (Skip) (v4.2.0)
- [F19] 無障礙基礎：縮放、Escape、aria-label、reduced-motion (v4.2.0)
- [F20] 編輯器分頁 + 搜尋 + 未儲存離開防護 (v4.3.0)
- [F21] 大檔匯入/範例載入 loading 覆蓋層 (v4.3.0)
- [F22] 防回鍋排程：排除最近作答卡片 (v4.3.0)
- [F23] 完成畫面「再讀一輪」：篩選範圍內重置並續讀 (v4.3.0)
- [F24] 備份匯入還原：依 id 合併 + 覆蓋預覽確認 (v4.4.0，補完 F08)
- [F25] 學習統計：熟練度 5 級分布圖 (v4.4.0)
- [F26] 深色模式手動切換（class 策略 + 防閃白初始化）(v4.4.0)
- [F27] 打磨包：雙選單對稱、空狀態 CTA、microcopy 統一、spec 對齊、Haptic、融合入口、卡面適配 (v4.4.0)

## 筆記 (Note)
- 開發者注重極簡設計 (Minimalist) 與流暢的手勢操作。
- v4.1.3 成功修復了選單在長列表下的捲動問題，並提供了完整的圖形化編輯器框架。

## 技術棧 (Stack)
- HTML5 / CSS3 (Tailwind CSS, 3D Transforms)
- JavaScript (ES6+, Pointer Events)
- PWA (Service Worker, Manifest.json)
