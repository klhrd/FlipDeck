# 單字卡 UI 視覺與互動規範 (UI Specification)

本文件說明 `test/UI.html` 中使用的極簡設計風格規範，包含配色、排版、元件結構及互動邏輯，以便於在正式開發中完整復刻。

## 1. 核心設計語言 (Design Language)
*   **風格**：極簡 (Minimalist)、清爽 (Clean)、空間感 (Airy)。
*   **形狀**：大圓角 (`rounded-3xl`, 24px+) 與細邊框 (`border-neutral-200`)。
*   **字體**：偏好細體 (`font-light`) 與寬字距 (`tracking-wide`) 以營造高級感。

## 2. 配色方案 (Color Palette)

### 基礎色調 (Base Colors)
| 用途 | Tailwind 類別 | 十六進位 (近似) | 說明 |
| :--- | :--- | :--- | :--- |
| 全域背景 | `bg-neutral-50` | #FAFAFA | 極淡灰色，避免純白刺眼 |
| 卡片背景 | `bg-white` | #FFFFFF | 純白，與背景形成微弱層次 |
| 邊框 | `border-neutral-200` | #E5E5E5 | 極細微邊界感 |
| 主文字 (黑) | `text-neutral-900` | #171717 | 標題與重點單字 |
| 次文字 (灰) | `text-neutral-500` | #737373 | 說明文字 |
| 標籤文字 (淡) | `text-neutral-300` | #D4D4D4 | 提示資訊與裝飾 |

### 狀態色調 (State Colors)
*   **正確/學會 (Green)**：
    *   背景：`bg-green-50` / `bg-green-100`
    *   文字/邊框：`text-green-600` / `border-green-500`
*   **錯誤/忘記 (Red)**：
    *   背景：`bg-red-50` / `bg-red-100`
    *   文字/邊框：`text-red-500` / `border-red-500`
*   **互動/高亮 (Blue)**：
    *   背景：`bg-blue-50/50` / `bg-blue-600`
    *   文字：`text-blue-900`

## 3. 元件結構 (Components)

### 卡片主體 (The Card)
*   **外殼**：`w-full max-w-md h-[400px]` (固定比例，適合移動端)。
*   **樣式**：`bg-white border border-neutral-200 rounded-3xl shadow-sm`。
*   **陰影**：平常使用 `shadow-sm`，懸停或作用時使用 `shadow-md`。

### 按鈕 (Buttons)
*   **主按鈕**：`bg-neutral-900 text-white rounded-full px-6 py-2`。
*   **模式切換鈕**：`rounded-full px-5 py-2.5 bg-white border border-neutral-200` (未選中) / `bg-neutral-900 text-white` (選中)。

## 4. 互動復刻指南 (Interactions)

### A. 3D 翻轉 (Flip)
1.  **容器**：需設定 `perspective: 1000px`。
2.  **內層**：設定 `transform-style: preserve-3d` 與 `transition: all 0.5s`。
3.  **正反面**：使用 `backface-visibility: hidden` 隱藏背面，反面預設旋轉 `rotateY(180deg)`。

### B. 堆疊效果 (Stack)
1.  **層次**：使用 `z-index` 區分布局，底層卡片縮放 `scale(0.95)` 並向下位移 `translateY(16px)`。
2.  **動畫**：抽卡時使用 `translateY(-100px)` 並配合 `opacity: 0`。

### C. 滑動判定 (Swipe)
1.  **邏輯**：使用 `pointerdown` 紀錄起點，`pointermove` 計算偏移量 (`dragX`)。
2.  **視覺回饋**：
    *   旋轉：`rotate(dragX * 0.05deg)`。
    *   提示：當 `dragX > 20px` 時顯示「學會」印章或背景色塊。

## 5. 如何復刻完整視覺
1.  **引入環境**：
    ```html
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    ```
2.  **設定容器**：
    ```html
    <body class="bg-neutral-50 text-neutral-800 font-sans">
    ```
3.  **套用單字樣式**：
    單字標題使用 `<h2 class="text-4xl font-light tracking-wide text-neutral-900">`。
