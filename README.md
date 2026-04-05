# FlipDeck v3.5.0 - 極簡單字卡 PWA

FlipDeck 是一款專為「心流學習」設計的極簡單字卡應用程式。採用 **綜合模式 (Combo Mode)**，結合物理手勢與 3D 視覺效果，讓您在行動端或桌面端都能享受流暢的學習體驗。

## 🌟 核心特色 (v3.5.0)

- **綜合模式 (Combo Mode)**:
  - **堆疊式設計**: 卡片以堆疊方式呈現，視覺重心更集中。
  - **3D 翻轉動畫**: 點擊卡片即可進行 3D 翻轉，查看背面資訊。
  - **直覺滑動判定**: 左右滑動即可判定「學會」或「忘記」，支援甩動 (Flick) 快速切換。
- **全視窗搜尋系統**: 在「所有卡片」視窗中新增即時搜尋列，快速定位特定單字或內容。
- **極簡 UI/UX**: 移除冗餘按鈕（上一個/下一個），全面轉向手勢驅動與物理反饋。
- **離線支援 (PWA)**: 支援安裝至手機或桌面，離線時也能持續學習。
- **靈活編輯器**: 提供圖形化介面與 JSON 原始碼雙模式編輯。

## 🛠️ 技術架構
- **Frontend**: Vanilla JavaScript (ES6+), Tailwind CSS
- **PWA**: Service Workers, Manifest.json
- **Persistence**: LocalStorage
- **Animations**: CSS 3D Transforms, Pointer Events

## 🚀 快速開始
1. 開啟 [FlipDeck](https://your-link.com)。
2. 點擊選單中的「快速開始」載入範例集，或上傳您的 `.json`, `.csv`, `.txt` 檔案。
3. 在學習畫面中：
   - **點擊**: 翻轉卡片。
   - **右滑**: 標記為「學會」。
   - **左滑**: 標記為「忘記」。
