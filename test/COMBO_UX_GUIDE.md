# 組合模式：極簡互動體驗指南 (Combo Mode UX Guide)

「組合模式」不僅僅是功能的堆疊，它是一種追求「心流」的學習體驗。透過物理模擬與直覺手勢，讓學習者在無需思考 UI 的情況下完成「查看 -> 判定 -> 切換」的循環。

---

## 1. 視覺身份與配色 (Visual Identity)

組合模式採用 **Neutral (中性色)** 作為基調，確保內容（單字）是視覺重心，並利用微弱的色彩偏移提供操作反饋。

### A. 基礎配色 (Base)
*   **畫布背景**：`#FAFAFA` (`neutral-50`) - 營造高級的紙張感。
*   **卡片主體**：`#FFFFFF` (`white`) + 邊框 `#E5E5E5` (`neutral-200`)。
*   **陰影**：`0 1px 2px 0 rgba(0, 0, 0, 0.05)` - 極其輕微，僅用於區分層次。

### B. 動態反饋配色 (Interaction Colors)
當使用者開始滑動時，背景指示器與卡片印章的透明度會線性增加：

| 意圖 | 語義色彩 | Tailwind 類別 | 十六進位 |
| :--- | :--- | :--- | :--- |
| **判定：忘記** | 警告紅 | `red-50` / `red-400` | `#FEF2F2` / `#F87171` |
| **判定：學會** | 成功綠 | `green-50` / `green-400` | `#F0FDF4` / `#4ADE80` |
| **操作：翻轉** | 沉浸黑 | `neutral-900` | `#171717` (卡片背面) |

---

## 2. 詳細使用體驗 (UX Breakdown)

組合模式的核心在於 **「阻力」與「慣性」** 的平衡。

### A. 堆疊深度 (The Stack)
畫面中始終保持 3 張卡片的視覺呈現：
1.  **頂層 (Active)**：100% 比例，全顯。
2.  **中層 (Next)**：`scale(0.95)`，`translateY(16px)`，`opacity(0.8)`。
3.  **底層 (Queue)**：`scale(0.9)`，`translateY(32px)`，`opacity(0.6)`。
*   **體驗點**：這種堆疊感讓使用者知道「學習尚未結束」，並在頂層卡片飛走時，底層卡片「浮上來」的動畫能提供極強的連續性。

### B. 判定邏輯 (Smart Judging)
不只是位置判定，我們引入了 **「速度 (Velocity)」** 概念：
*   **慢速拖曳**：需超過 100px 才會觸發判定。
*   **快速甩出 (Flick)**：只要速度向量足夠（> 0.5px/ms），即便位移短也會判定成功。
*   **體驗點**：這模仿了現實中「丟擲」卡片的感覺，熟練的使用者可以飛快地完成複習。

### C. 微互動 (Micro-interactions)
*   **翻轉手勢**：點擊必須輕微（位移 < 15px），且持續時間短（< 300ms）。
*   **阻尼旋轉**：卡片隨拖曳角度偏轉（`dragX * 0.05`），增加物件感。
*   **印章回饋**：滑動時，卡片角落出現 `Check` 或 `X` 的印章，這種「蓋章認證」的視覺隱喻增強了成就感。

---

## 3. 如何完整復刻 (Step-by-Step)

### 第一步：環境準備
確保引入 Tailwind CSS 與 Lucide Icons。容器需設定 `perspective: 1000px` 與 `touch-action: none`。

### 第二步：卡片 HTML 結構
```html
<div class="card-inner preserve-3d">
    <!-- 正面：極簡排版 -->
    <div class="backface-hidden bg-white rounded-3xl p-8">
        <span class="text-neutral-300 uppercase tracking-widest text-[10px]">Tap to flip</span>
        <h2 class="text-4xl font-light">Ephemeral</h2>
    </div>
    <!-- 背面：深色沉浸 -->
    <div class="backface-hidden rotate-y-180 bg-neutral-900 text-white rounded-3xl p-8">
        <h3 class="text-2xl">短暫的</h3>
    </div>
</div>
```

### 第三步：動畫曲線 (The Magic Secret)
復刻時 **務必** 使用以下貝茲曲線，這是流暢感的來源：
*   **飛走 (Exit)**：`cubic-bezier(0.25, 1, 0.5, 1)` - 先快後慢，平滑消失。
*   **彈回 (Snap-back)**：`cubic-bezier(0.175, 0.885, 0.32, 1.275)` - 具有超調效果的震盪彈回。

### 第四步：事件循環
1.  `pointerdown`：停止所有動畫，紀錄時間與位置。
2.  `pointermove`：即時更新 `transform` 與 `opacity`。
3.  `pointerup`：根據速度與位置決定 `飛走` 或 `彈回`。

# 綜合模式實作指南 (Combo Mode Specification)

「綜合模式」是 `FlipDeck` 最核心的互動體驗，它完美融合了 **堆疊 (Stacking)**、**3D 翻轉 (3D Flipping)** 與 **滑動判定 (Swipe Judging)**。本文件詳述其視覺與邏輯復刻方式。

## 1. 視覺層次與配色 (Visual Layers & Colors)

### A. 堆疊背景 (Stack Layering)
為了營造「厚度感」，我們同時渲染當前與後兩張卡片：
*   **底層卡片**：位移 `translateY(32px)`，縮放 `scale(0.9)`，透明度 `opacity(0.6)`。
*   **中層卡片**：位移 `translateY(16px)`，縮放 `scale(0.95)`，透明度 `opacity(0.8)`。
*   **頂層卡片**：位移 `0`，縮放 `1`，全顯。

### B. 反饋配色 (Feedback Palette)
在滑動過程中，畫面上會出現半透明的提示指示器：

| 狀態 | 背景色 (Hint) | 邊框/圖示色 (Stamp) | 意義 |
| :--- | :--- | :--- | :--- |
| **左滑 (忘記)** | `bg-red-50` (`#FEF2F2`) | `text-red-400` (`#F87171`) | 標記為需要加強 |
| **右滑 (學會)** | `bg-green-50` (`#F0FDF4`) | `text-green-400` (`#4ADE80`) | 標記為已掌握 |

## 2. HTML 結構架構

```html
<!-- 容器 -->
<div class="relative w-full h-[400px]">
    <!-- 背景指示器 (提示滑動方向) -->
    <div class="absolute inset-0 flex justify-between px-4 opacity-0" id="hints">...</div>
    
    <!-- 後方堆疊卡片 (唯讀) -->
    <div class="absolute ...">...</div>
    
    <!-- 頂層互動卡片 -->
    <div id="combo-card" class="perspective-1000 touch-none cursor-grab">
        <div class="card-inner preserve-3d">
            <!-- 正面 (單字) -->
            <div class="backface-hidden bg-white border-neutral-200">...</div>
            <!-- 反面 (解答) -->
            <div class="backface-hidden rotate-y-180 bg-neutral-900 text-white">...</div>
        </div>
        <!-- 狀態印章 (卡片上的 Check/X) -->
        <div id="stamp-forgot" class="opacity-0">...</div>
        <div id="stamp-learned" class="opacity-0">...</div>
    </div>
</div>
```

## 3. 關鍵邏輯實作 (Core Logic)

### A. 指標事件處理 (Pointer Events)
使用 `PointerEvent` 以同時支援滑鼠與觸控：
1.  **Down**: 紀錄 `startX`, `startTime`。取消 CSS `transition` 以實現跟手感。
2.  **Move**: 
    *   計算 `dragX = currentX - startX`。
    *   計算旋轉：`rotation = dragX * 0.05`。
    *   實時更新卡片位移：`transform: translateX(dragX) rotate(rotation)`。
    *   根據 `dragX` 正負號與大小，線性調整印章與背景提示的 `opacity`。
3.  **Up**:
    *   計算 **瞬時速度 (Velocity)**：`v = (lastX - prevX) / dt`。
    *   判斷是否「甩出」：若 `Math.abs(v) > 0.5` 或 `Math.abs(dragX) > 100`。
    *   **點擊判定**：若 `Math.abs(dragX) < 15` 且持壓時間短，則觸發 `rotateY(180deg)`。

### B. 物理運動感 (Physics Feel)
*   **成功滑出**：設定 `transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1)`。讓卡片飛向屏幕外 1000px。
*   **取消滑動 (彈回)**：設定 `transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`。此貝茲曲線會產生輕微的震盪彈回效果。

## 4. 復刻清單 (Checklist)
1. [ ] 容器必須具備 `perspective-1000` 以支援 3D 效果。
2. [ ] 互動卡片必須設定 `touch-action: none` 防止行動端預設捲動。
3. [ ] 狀態印章需設定 `pointer-events-none` 避免干擾拖曳操作。
4. [ ] 使用 Lucide Icons 的 `check` 與 `x` 圖示，並將 `stroke-width` 加粗 (例如 `stroke-[3]`)。
