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
