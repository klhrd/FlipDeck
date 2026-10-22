// ===== FlipDeck i18n (v5.2.0) =====
// zh 為預設語言；t(key, params) 支援 {name} 佔位符；static HTML 用 data-i18n 系列屬性掃描。
const I18N = {
    zh: {
        // 通用
        'app.menu': '主選單', 'app.settings': '設定',
        'common.cancel': '取消', 'common.close': '關閉',
        // 首頁
        'home.total_cards': '卡片總數：',
        'home.sort_last': '最後閱讀', 'home.sort_title': '名稱 (A-Z)', 'home.sort_progress': '學習進度',
        'home.empty': '尚未開啟任何單字集', 'home.empty_cta': '新增單字集',
        'home.cards': '{n} 張卡片', 'home.mastered': '{n}% 進度', 'home.due': '{n} 張到期',
        // 選單
        'menu.import': '匯入 / 範例', 'menu.create_blank': '從空白建立',
        'menu.backup': '全域備份 (.json)', 'menu.help': '操作教學',
        'menu.show_all': '顯示全卡片 (搜尋)', 'menu.stats': '學習統計', 'menu.visual_edit': '圖形化編輯器',
        'menu.tag_filter': '標籤篩選', 'menu.no_tags': '無可用標籤',
        'menu.font_size': '字型大小', 'menu.daily_new': '每日新卡', 'menu.unlimited': '無上限',
        'menu.display_mode': '顯示模式', 'menu.mode_combo': '翻面', 'menu.mode_dual': '雙面',
        'menu.tts_lang': '朗讀語言', 'tts.auto': '自動',
        // 快速開始
        'qs.title': '新增單字集', 'qs.upload': '上傳 .txt, .csv, .json',
        'ex.hs6000': '高中 6000 單字', 'ex.verbs': '動詞三態', 'ex.elements': '元素週期表', 'ex.capitals': '國家與首都',
        'qs.format_title': '檔案格式說明',
        'qs.format_json': 'JSON：卡片陣列，每張須含 card_id（字串）與 fields（正面／背面／補充），tags 可選',
        'qs.format_txt': 'TXT / CSV：每行一張卡，欄位以「;」分隔；欄位內容以「//」表示換行',
        'qs.format_backup': '支援直接上傳全域備份檔（flipdeck_backup_*.json）進行還原',
        // 匯入格式說明 Modal（v5.5.4）
        'fg.title': '匯入格式說明', 'fg.open_full': '查看完整說明',
        'fg.json_title': 'JSON（推薦）',
        'fg.json_desc': '最外層為卡片物件陣列。fields[0]＝正面（必填）、fields[1]＝背面、之後為補充（顯示時自動換行）。tags 為字串陣列，供標籤篩選。',
        'fg.txt_title': 'TXT / CSV',
        'fg.txt_desc': '每行一張卡；欄位以「;」分隔；欄位內「//」代表換行。第一欄為正面（必填）。',
        'fg.backup_title': '備份檔還原',
        'fg.backup_desc': '直接上傳「全域備份」產生的 flipdeck_backup_*.json，依牌組 id 合併：已存在者覆蓋內容（保留你的進度）、新牌組加入。',
        'fg.tip': '小技巧：把「複製 AI Agent 提示詞」的內容貼給你的 AI 助理並填上主題，它會產生可直接匯入的 JSON。',
        'fg.copy_prompt': '複製 AI Agent 提示詞', 'fg.copy_spec': '複製格式規則', 'fg.copied': '已複製！',
        // 顯示全部
        'ac.title': '單字集管理', 'ac.visual_edit': '圖形化編輯', 'ac.json': 'JSON 原始碼',
        'ac.search_ph': '搜尋關鍵字或標籤...', 'ac.col_mastery': 'ID / 熟練度', 'ac.col_field': '欄位', 'ac.col_tags': '標籤',
        // JSON 編輯器
        'json.title': 'JSON 原始碼編輯', 'json.save': '儲存變更',
        // 牌組選項
        'do.title': '單字集設定', 'do.name': '單字集名稱', 'do.save': '儲存設定', 'do.json': 'JSON 原始碼', 'do.delete': '刪除單字集', 'do.share': '複製分享連結',
        // 操作教學
        'htu.title': '操作教學',
        'htu.s1': '點擊卡片即可翻面', 'htu.s2': '向右滑動表示「已學會」', 'htu.s3': '向左滑動表示「不熟悉」',
        'htu.s4': '向上滑動可先「跳過」此卡片', 'htu.s5': '判定後 3 秒內可點「復原」',
        'htu.start': '開始學習',
        // 編輯器
        'ed.edit_title': '編輯單字集', 'ed.new_title': '建立新單字集', 'ed.untitled': '未命名單字集',
        'ed.add_card': '新增卡片', 'ed.search_ph': '搜尋卡片…',
        'ed.select_page': '全選本頁', 'ed.selected': '已選 {n} 張',
        'ed.tags_ph': '標籤（用逗號隔開）', 'ed.add': '加入', 'ed.remove': '移除',
        'ed.save_all': '儲存全部變更',
        'ed.front_ph': '正面 (必填)', 'ed.back_ph': '背面 (解釋/翻譯)', 'ed.notes_ph': '補充備註 (Notes)',
        'ed.card_n': '卡片 #{n}', 'ed.no_match': '沒有符合的卡片',
        'ed.count': '共 {n} 張卡片', 'ed.count_match': '共 {n} 張卡片 · 符合 {m} 張',
        // 統計
        'st.title': '學習統計',
        'st.mastered': '已熟練 {m} / {t} 張', 'st.due_today': '今日到期', 'st.due_7': '7 天內到期',
        'st.lv1': '第 1 級（新卡）', 'st.lv2': '第 2 級', 'st.lv3': '第 3 級', 'st.lv4': '第 4 級', 'st.lv5': '第 5 級（已熟練）', 'st.lv': '第 {n} 級',
        'st.n_cards': '{n} 張', 'st.forecast': '未來 30 天到期分布', 'st.today': '今天', 'st.after30': '30 天後',
        'st.day_n': '第 {n} 天', 'st.over30': '30 天以上',
        'st.leech_suspended': '難卡（多次忘記）{l} 張 · 已暫停 {s} 張',
        'st.rule': '答對依記憶曲線排程複習（SM-2）；答錯立即重新到期',
        // 學習畫面
        'learn.hint_forgot': '左滑 忘記', 'learn.hint_flip': '點擊 翻面', 'learn.hint_learned': '右滑 學會', 'learn.hint_skip': '上滑 跳過',
        'learn.due_left': '剩 {n} 張到期',
        'learn.undo': '復原', 'learn.tap_flip': '點擊翻面',
        'learn.congrats': '太棒了！', 'learn.done_all': '本輪到期卡片全數完成',
        'learn.next_due': '下次到期：{t}（{n} 張已排程）', 'learn.none_scheduled': '目前沒有已排程的卡片',
        'learn.daily_used': '今日新卡額度已用完，還有 {n} 張明日繼續',
        'learn.restart': '再讀一輪', 'learn.back_home': '返回首頁',
        'fmt.now': '現在', 'fmt.min': '{n} 分鐘後', 'fmt.hour': '{n} 小時後', 'fmt.day': '{n} 天後',
        // 載入
        'load.default': '載入中…', 'load.parsing': '解析檔案中…', 'load.example': '載入範例中…',
        // 對話框
        'dlg.confirm': '確認動作', 'dlg.notice': '提示', 'dlg.ok': '確定', 'dlg.got_it': '知道了',
        'dlg.delete_title': '刪除單字集', 'dlg.delete_msg': '確定要刪除「{t}」嗎？\n此操作無法復原，學習進度將一併刪除。', 'dlg.delete': '刪除',
        'dlg.json_error_t': 'JSON 語法錯誤', 'dlg.json_error': 'JSON 語法錯誤，請檢查括號與逗號是否成對。',
        'dlg.json_shape_t': 'JSON 格式錯誤', 'dlg.json_shape': '需為非空卡片陣列，每張卡片須含 card_id (字串) 與 fields (陣列)。',
        'dlg.empty_deck_t': '無法儲存', 'dlg.empty_deck': '請至少輸入一張卡片內容（正面欄位必填）。',
        'dlg.file_error_t': '無法匯入', 'dlg.file_error': '檔案格式錯誤：JSON 無法解析；.txt/.csv 每行以「;」分隔欄位。',
        'dlg.example_fail_t': '載入失敗', 'dlg.example_fail': '載入範例失敗，請確認網路連線後再試。',
        'dlg.reload_title': '重新載入範例？', 'dlg.reload_msg': '「{t}」目前已有 {p}% 學習進度，重新載入會將所有卡片的熟練度重置。', 'dlg.reload_ok': '重置並載入',
        'dlg.restore_title': '還原備份？', 'dlg.restore_msg': '備份內含 {n} 個單字集，其中 {m} 個將覆蓋現有資料與學習進度，其餘單字集不受影響。', 'dlg.restore_ok': '還原',
        'dlg.restore_none_t': '無法還原', 'dlg.restore_none': '備份檔中沒有可用的單字集。',
        'dlg.restore_done_t': '備份還原', 'dlg.restore_done': '還原完成：覆蓋 {r} 個、新增 {a} 個單字集。',
        'dlg.restart_title': '再讀一輪', 'dlg.restart_msg': '將把目前篩選下的 {n} 張卡片熟練度重置為 1 並重新開始，其他卡片不受影響。', 'dlg.restart_ok': '重置並開始',
        'dlg.discard_title': '放棄未儲存的變更？', 'dlg.discard_msg': '您在編輯器中的修改尚未儲存，離開將全部遺失。', 'dlg.discard_ok': '放棄變更',
        // 分享（URL 內嵌）
        'dlg.share_title': '匯入分享牌組？', 'dlg.share_msg_new': '「{t}」（{n} 張卡片）',
        'dlg.share_msg_overwrite': '將覆蓋現有「{t}」的內容（{n} 張卡片）——你的學習進度保留',
        'dlg.share_ok': '匯入', 'dlg.share_imported': '已匯入「{t}」。',
        'dlg.share_done': '分享連結已複製到剪貼簿。', 'dlg.share_fail': '複製失敗，請手動選取複製：\n{u}',
        'dlg.share_too_big': '此牌組壓縮後仍過大，不適合連結分享，請改用「全域備份」。',
        'dlg.share_invalid': '分享連結無效或已損毀。',
        // 分享 Modal（v5.5.0）
        'share.title': '分享牌組', 'share.copy': '複製連結', 'share.copied': '已複製！',
        'share.qr_unavailable': '此環境不支援 QR 產生，請直接複製連結',
        'share.qr_too_big': '牌組較大，QR 容量不足——請直接複製連結',
        'aria.speak': '朗讀正面',
        // aria
        'aria.open_menu': '開啟主選單', 'aria.open_settings': '開啟設定選單', 'aria.close': '關閉', 'aria.close_menu': '關閉選單',
        'aria.back_home': '回到首頁', 'aria.fullscreen': '切換全螢幕', 'aria.theme': '切換深淺色模式',
        'aria.theme_light': '切換至淺色模式', 'aria.theme_dark': '切換至深色模式',
        'aria.lang': '切換語言 (English)', 'aria.download': '下載此單字集', 'aria.load_example': '載入範例',
        'aria.undo': '復原上一次判定', 'aria.jump': '跳至此卡片', 'aria.suspend': '暫停此卡片', 'aria.unsuspend': '取消暫停此卡片',
        'aria.select_card': '選取此卡片', 'aria.delete_card': '刪除此卡片',
        'aria.prev_page': '上一頁', 'aria.next_page': '下一頁',
        'aria.decrease_font': '縮小字型', 'aria.increase_font': '放大字型',
        'aria.decrease_new': '減少每日新卡上限', 'aria.increase_new': '增加每日新卡上限',
        'aria.bulk_tags': '批次標籤', 'aria.clear_selection': '清除選取',
        'aria.search_cards': '搜尋卡片', 'aria.visual_edit': '開啟圖形化編輯器', 'aria.start_learning': '開始學習',
        'aria.deck_options': '單字集選項', 'aria.leech': '難卡（多次忘記）', 'aria.share_deck': '複製分享連結', 'aria.display_mode': '切換顯示模式', 'aria.tts_lang': '切換朗讀語言'
    },
    en: {
        'app.menu': 'Menu', 'app.settings': 'Settings',
        'common.cancel': 'Cancel', 'common.close': 'Close',
        'home.total_cards': 'Total Cards: ',
        'home.sort_last': 'Last Opened', 'home.sort_title': 'Title (A-Z)', 'home.sort_progress': 'Progress',
        'home.empty': 'No decks yet', 'home.empty_cta': 'Add Deck',
        'home.cards': '{n} cards', 'home.mastered': '{n}% progress', 'home.due': '{n} due',
        'menu.import': 'Import / Examples', 'menu.create_blank': 'Create from Scratch',
        'menu.backup': 'Backup All (.json)', 'menu.help': 'How to Use',
        'menu.show_all': 'All Cards (Search)', 'menu.stats': 'Statistics', 'menu.visual_edit': 'Visual Editor',
        'menu.tag_filter': 'Filter by Tags', 'menu.no_tags': 'No tags available',
        'menu.font_size': 'Font Size', 'menu.daily_new': 'Daily New Cards', 'menu.unlimited': 'Unlimited',
        'menu.display_mode': 'Card View', 'menu.mode_combo': 'Flip', 'menu.mode_dual': 'Both Sides',
        'menu.tts_lang': 'Speech Language', 'tts.auto': 'Auto',
        'qs.title': 'Add Deck', 'qs.upload': 'Upload .txt, .csv, .json',
        'ex.hs6000': 'High School 6000 Words', 'ex.verbs': 'Verb Tenses', 'ex.elements': 'Periodic Table', 'ex.capitals': 'Countries & Capitals',
        'qs.format_title': 'File Format Guide',
        'qs.format_json': 'JSON: an array of cards, each with card_id (string) and fields (front/back/notes); tags optional',
        'qs.format_txt': 'TXT / CSV: one card per line, fields separated by ";"; use "//" inside a field for a line break',
        'qs.format_backup': 'You can also upload a global backup file (flipdeck_backup_*.json) to restore',
        'fg.title': 'Import Format Guide', 'fg.open_full': 'View full guide',
        'fg.json_title': 'JSON (recommended)',
        'fg.json_desc': 'A flat array of card objects. fields[0] = front (required), fields[1] = back, further items are notes (line breaks on display). tags is a string array for filtering.',
        'fg.txt_title': 'TXT / CSV',
        'fg.txt_desc': 'One card per line; fields separated by ";"; use "//" for a line break inside a field. First field is the front (required).',
        'fg.backup_title': 'Backup restore',
        'fg.backup_desc': 'Upload a flipdeck_backup_*.json produced by "Backup All": decks with the same id are overwritten (your progress is kept); new decks are added.',
        'fg.tip': 'Tip: paste the "AI Agent prompt" into your AI assistant with your topic, and it will generate JSON you can import directly.',
        'fg.copy_prompt': 'Copy AI Agent Prompt', 'fg.copy_spec': 'Copy Format Rules', 'fg.copied': 'Copied!',
        'ac.title': 'Deck Manager', 'ac.visual_edit': 'Visual Edit', 'ac.json': 'JSON Source',
        'ac.search_ph': 'Search keyword or tags...', 'ac.col_mastery': 'ID / Mastery', 'ac.col_field': 'Field', 'ac.col_tags': 'Tags',
        'json.title': 'JSON Source Editor', 'json.save': 'Save Changes',
        'do.title': 'Deck Settings', 'do.name': 'Deck Name', 'do.save': 'Save Settings', 'do.json': 'JSON Source', 'do.delete': 'Delete Deck', 'do.share': 'Copy Share Link',
        'htu.title': 'How to Use',
        'htu.s1': 'Tap the card to flip it', 'htu.s2': 'Swipe right for "Got it"', 'htu.s3': 'Swipe left for "Forgot"',
        'htu.s4': 'Swipe up to "Skip" for now', 'htu.s5': 'Tap "Undo" within 3s to revert a judgment',
        'htu.start': 'Start Learning',
        'ed.edit_title': 'Edit Deck', 'ed.new_title': 'New Deck', 'ed.untitled': 'Untitled Deck',
        'ed.add_card': 'Add Card', 'ed.search_ph': 'Search cards...',
        'ed.select_page': 'Select page', 'ed.selected': '{n} selected',
        'ed.tags_ph': 'Tags (comma separated)', 'ed.add': 'Add', 'ed.remove': 'Remove',
        'ed.save_all': 'Save All Changes',
        'ed.front_ph': 'Front (required)', 'ed.back_ph': 'Back (definition/translation)', 'ed.notes_ph': 'Notes',
        'ed.card_n': 'Card #{n}', 'ed.no_match': 'No matching cards',
        'ed.count': '{n} cards', 'ed.count_match': '{n} cards · {m} matched',
        'st.title': 'Statistics',
        'st.mastered': 'Mastered {m} / {t}', 'st.due_today': 'Due Today', 'st.due_7': 'Due in 7 Days',
        'st.lv1': 'Level 1 (new)', 'st.lv2': 'Level 2', 'st.lv3': 'Level 3', 'st.lv4': 'Level 4', 'st.lv5': 'Level 5 (mastered)', 'st.lv': 'Level {n}',
        'st.n_cards': '{n} cards', 'st.forecast': '30-Day Due Forecast', 'st.today': 'Today', 'st.after30': '30+ days',
        'st.day_n': 'Day {n}', 'st.over30': '30+ days',
        'st.leech_suspended': 'Leech {l} · Suspended {s}',
        'st.rule': 'Correct answers are scheduled by SM-2; wrong answers come back immediately',
        'learn.hint_forgot': 'Left: Forgot', 'learn.hint_flip': 'Tap: Flip', 'learn.hint_learned': 'Right: Got it', 'learn.hint_skip': 'Up: Skip',
        'learn.due_left': '{n} due left',
        'learn.undo': 'Undo', 'learn.tap_flip': 'Tap to flip',
        'learn.congrats': 'Great job!', 'learn.done_all': 'All due cards completed this round',
        'learn.next_due': 'Next due: {t} ({n} scheduled)', 'learn.none_scheduled': 'No scheduled cards',
        'learn.daily_used': 'Daily new-card limit reached — {n} more tomorrow',
        'learn.restart': 'Another Round', 'learn.back_home': 'Back to Home',
        'fmt.now': 'now', 'fmt.min': 'in {n} min', 'fmt.hour': 'in {n} h', 'fmt.day': 'in {n} d',
        'load.default': 'Loading...', 'load.parsing': 'Parsing file...', 'load.example': 'Loading example...',
        'dlg.confirm': 'Confirm', 'dlg.notice': 'Notice', 'dlg.ok': 'OK', 'dlg.got_it': 'Got it',
        'dlg.delete_title': 'Delete Deck', 'dlg.delete_msg': 'Delete "{t}"?\nThis cannot be undone; learning progress will be deleted too.', 'dlg.delete': 'Delete',
        'dlg.json_error_t': 'JSON Syntax Error', 'dlg.json_error': 'Invalid JSON syntax — check that brackets and commas are paired.',
        'dlg.json_shape_t': 'JSON Format Error', 'dlg.json_shape': 'Must be a non-empty array of cards, each with card_id (string) and fields (array).',
        'dlg.empty_deck_t': 'Cannot Save', 'dlg.empty_deck': 'Enter at least one card (front field is required).',
        'dlg.file_error_t': 'Cannot Import', 'dlg.file_error': 'Invalid file: unreadable JSON; .txt/.csv rows use ";" between fields.',
        'dlg.example_fail_t': 'Load Failed', 'dlg.example_fail': 'Failed to load the example. Check your connection and try again.',
        'dlg.reload_title': 'Reload example?', 'dlg.reload_msg': '"{t}" has {p}% progress — reloading resets all mastery to level 1.', 'dlg.reload_ok': 'Reset & Load',
        'dlg.restore_title': 'Restore backup?', 'dlg.restore_msg': 'The backup contains {n} decks; {m} will overwrite existing data and progress. Other decks are unaffected.', 'dlg.restore_ok': 'Restore',
        'dlg.restore_none_t': 'Cannot Restore', 'dlg.restore_none': 'No valid decks found in the backup.',
        'dlg.restore_done_t': 'Backup Restored', 'dlg.restore_done': 'Restored: {r} overwritten, {a} added.',
        'dlg.restart_title': 'Another Round', 'dlg.restart_msg': 'Reset {n} filtered cards to level 1 and start over? Other cards are unaffected.', 'dlg.restart_ok': 'Reset & Start',
        'dlg.discard_title': 'Discard unsaved changes?', 'dlg.discard_msg': 'Your edits in the editor are not saved and will be lost.', 'dlg.discard_ok': 'Discard',
        'dlg.share_title': 'Import shared deck?', 'dlg.share_msg_new': '"{t}" ({n} cards)',
        'dlg.share_msg_overwrite': 'This overwrites existing "{t}" ({n} cards) — your progress is kept',
        'dlg.share_ok': 'Import', 'dlg.share_imported': 'Imported "{t}".',
        'dlg.share_done': 'Share link copied to clipboard.', 'dlg.share_fail': 'Copy failed — select and copy manually:\n{u}',
        'dlg.share_too_big': 'This deck is too large even after compression. Use "Backup All" instead.',
        'dlg.share_invalid': 'The share link is invalid or corrupted.',
        'share.title': 'Share Deck', 'share.copy': 'Copy Link', 'share.copied': 'Copied!',
        'share.qr_unavailable': 'QR generation unavailable here — copy the link instead',
        'share.qr_too_big': 'Deck too large for a QR code — copy the link instead',
        'aria.speak': 'Speak front side',
        'aria.open_menu': 'Open menu', 'aria.open_settings': 'Open settings menu', 'aria.close': 'Close', 'aria.close_menu': 'Close menu',
        'aria.back_home': 'Back to home', 'aria.fullscreen': 'Toggle fullscreen', 'aria.theme': 'Toggle dark/light mode',
        'aria.theme_light': 'Switch to light mode', 'aria.theme_dark': 'Switch to dark mode',
        'aria.lang': '切換語言 (中文)', 'aria.download': 'Download this deck', 'aria.load_example': 'Load example',
        'aria.undo': 'Undo last judgment', 'aria.jump': 'Jump to this card', 'aria.suspend': 'Suspend this card', 'aria.unsuspend': 'Unsuspend this card',
        'aria.select_card': 'Select this card', 'aria.delete_card': 'Delete this card',
        'aria.prev_page': 'Previous page', 'aria.next_page': 'Next page',
        'aria.decrease_font': 'Decrease font size', 'aria.increase_font': 'Increase font size',
        'aria.decrease_new': 'Decrease daily new-card limit', 'aria.increase_new': 'Increase daily new-card limit',
        'aria.bulk_tags': 'Batch tags', 'aria.clear_selection': 'Clear selection',
        'aria.search_cards': 'Search cards', 'aria.visual_edit': 'Open visual editor', 'aria.start_learning': 'Start Learning',
        'aria.deck_options': 'Deck options', 'aria.leech': 'Leech (repeatedly forgotten)', 'aria.share_deck': 'Copy share link', 'aria.display_mode': 'Toggle card view', 'aria.tts_lang': 'Toggle speech language'
    }
};

let I18N_LANG = 'zh';

// 取得翻譯字串；支援 {name} 佔位符；缺鍵時 fallback zh → key 本身
function t(key, params) {
    let s = (I18N[I18N_LANG] && I18N[I18N_LANG][key]) ?? I18N.zh[key] ?? key;
    if (params) for (const [k, v] of Object.entries(params)) s = s.split('{' + k + '}').join(String(v));
    return s;
}

// 套用靜態 HTML 的 data-i18n / data-i18n-aria / data-i18n-placeholder / data-i18n-title
function applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
    root.querySelectorAll('[data-i18n-title]').forEach(el => { el.setAttribute('title', t(el.dataset.i18nTitle)); });
}

function setLang(lang) {
    I18N_LANG = I18N[lang] ? lang : 'zh';
    localStorage.setItem('flipdeck_lang', I18N_LANG);
    document.documentElement.lang = I18N_LANG === 'en' ? 'en' : 'zh-Hant';
    applyI18n();
}

(function bootI18n() {
    I18N_LANG = localStorage.getItem('flipdeck_lang') === 'en' ? 'en' : 'zh';
    document.documentElement.lang = I18N_LANG === 'en' ? 'en' : 'zh-Hant';
})();
