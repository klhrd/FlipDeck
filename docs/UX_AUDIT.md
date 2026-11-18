# UX 稽查筆記（2026-11-03，v5.10.0 後大調查）

全碼掃描（js/script.js + index.html + js/i18n.js）找出的操作反直覺之處。狀態：⬜ 待修 / ✅ 已修 / ⏭ 不修（記載原因）。

## 高

| # | 問題 | 證據 | 狀態 |
|---|---|---|---|
| 1 | 該輪最後一張判定沒存檔——讀完畫面提前 return 跳過 saveDeckState，重載遺失 | script.js showNextCard 早退路徑 | ✅ v5.11.0 |
| 2 | 隱藏唯一的正面欄會被 resolver 空組防護強制復活（field 0），正面＋隱藏 chip 同時亮、畫面不變 | resolveFieldRoles 忽略 hiddenFields | ✅ v5.11.0 |

## 中

| # | 問題 | 證據 | 狀態 |
|---|---|---|---|
| 3 | 練習模式膠囊顯示「剩 N 張到期」且永不遞減（練習佇列全量、判定不清理） | updateUI 無練習分支 | ✅ v5.11.0 |
| 4 | 改標籤篩選不清理 upcomingQueue——接下來幾張仍是篩掉的卡 | filter onchange 只 updateLearningDeck | ✅ v5.11.0 |
| 5 | 取消最後一個標籤勾選＝未篩選，全部湧回（含未標籤），無提示 | 「全部勾選=未篩選」慣例 | ✅ v5.11.0 |
| 6 | 「對調」不動提示小字——詞性小字黏在（現為提示面的）定義下面 | cycleReviewDirection 只換正背 | ✅ v5.11.0 |
| 7 | 重置/再讀一輪繞過每日上限，確認對話框未告知 | dlg.reset_progress_msg / dlg.restart_msg | ✅ v5.11.0 |
| 8 | 圖形化編輯器存檔不刷新背後「顯示全部」表格（JSON 路徑有刷新） | editor save 缺 renderAllCardsTable | ✅ v5.11.0 |
| 9 | 篩選 0 張也放煙火慶祝 | displayEndOfDeck 無篩選分支 | ✅ v5.11.0 |
| 10 | 練習模式讀完顯示 SM-2 排程資訊（練習明明不排程） | displayEndOfDeck 無練習分支 | ✅ v5.11.0 |

## 低

| # | 問題 | 證據 | 狀態 |
|---|---|---|---|
| 11 | 欄位預覽只用第一張卡（該欄空 → 顯示序號誤導） | fieldPreviewLabel | ✅ v5.11.0 |
| 12 | 顯示全部詳細模式欄數以第一張卡決定 → 異質牌組表格錯位 | renderAllCardsTable | ✅ v5.11.0 |
| 13 | `untagged` 篩選死碼——UI 到不了、還會被淨化掉 | matchesDeckFilter / sanitizeFilterTags | ✅ v5.11.0 |
| 14 | 對正面/背面欄點「標籤」→ 篩選清單爆炸（每字一 chip） | toggleFieldRole 無防護 | ✅ v5.11.0 |
| 15 | Anki 匯出靜默丟掉正面為空的卡 | exportAnkiTSV filter | ✅ v5.11.0 |
| 16 | 匯入不一致：`.md` 檔案無法選；TXT 的 URL `//` 被誤換行；4 欄新牌組免警告折疊 | file accept / parsePastedContent / openDeckEditor | ✅ v5.11.0 |
| 17 | 切語言殘留：卡面「點擊翻面」、讀完畫面、「詳細 ✓」不跟隨 | toggleLang 未重渲染卡面/讀完畫面 | ✅ v5.11.0 |
| 18 | 讀到一半換字型/角色→翻面狀態彈回；雙面模式 q=4 規則未揭露 | displayCardStack 重渲染 / applyDisplayModeIcon | ✅ v5.11.0 |
| 19 | 跳至卡片繞過篩選與暫停 | jumpToCard | ⏭ 不修：明確的顯式覆寫操作（使用者主動指定），屬合理設計；已記載為已知行為 |

## 已確認正常（抽查覆蓋）

練習唯讀性（SM-2/額度零變動）、練習再讀免確認、Escape 層級、appConfirm focus 管理、篩選淨化三時機、暫停清理佇列、語言切換（選單動態內容）、TTS 語種後備、跨牌組 JSON 編輯隔離。

## 決議記載

- #5 決議：維持「全部勾選＝未篩選」慣例，未篩選時於篩選區顯示提示文字（不改 matchesDeckFilter 語意）。
- #6 決議：新增 `subSide` 設定（front/back），「對調」時自動翻轉小字所在面；正面小字語意升級為「提示面小字（可換邊）」。
- #13 決議：實作「未標籤」虛擬 chip（牌組含無標籤卡時顯示），`untagged` 分支轉正。
- #14 決議：擋下對正面/背面欄的「標籤」角色並以 in-app 對話框說明。
- #16(b) 決議：乾淨 Markdown 表格維持「先開編輯器預覽」（v5.6.0 設計），不直接匯入。
- #19 決議：不修，記載為刻意設計。
