// ===== PWA Service Worker 註冊 =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW 註冊成功'))
            .catch(err => console.log('SW 註冊失敗'));
    });
}

// ===== FlipDeck v5.7.3 =====
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM 元素讀取 ---
    const homeScreen = document.getElementById('home-screen');
    const mainScreen = document.getElementById('main-screen');
    const quickStartModal = document.getElementById('quick-start-modal');
    const closeQuickStartModalBtn = document.getElementById('close-quick-start-modal-btn');
    const fileUpload = document.getElementById('file-upload');
    const exampleSelector = document.getElementById('example-selector');
    const loadExampleBtn = document.getElementById('load-example-btn');
    
    const homeMenuBtn = document.getElementById('home-menu-btn');
    const homeMenuSettingsBtn = document.getElementById('home-menu-settings-btn');
    const statsTotalDecks = document.getElementById('stats-total-decks');
    const statsTotalCards = document.getElementById('stats-total-cards');
    const sortBySelect = document.getElementById('sort-by');
    const deckListContainer = document.getElementById('deck-list-container');
    const noRecentDecks = document.getElementById('no-recent-decks');
    
    const cardStackContainer = document.getElementById('card-stack-container');
    const bgForgot = document.getElementById('bg-forgot');
    const bgLearned = document.getElementById('bg-learned');
    const deckInfo = document.getElementById('deck-info');
    
    const menuOverlay = document.getElementById('menu-overlay');
    const homeMenuPanel = document.getElementById('home-menu-panel');
    const homeMenuAddBtn = document.getElementById('home-menu-add-btn');
    const homeMenuCloseBtn = document.getElementById('home-menu-close-btn');
    const backupAllBtn = document.getElementById('backup-all-btn');
    const showHowToUseBtn = document.getElementById('show-how-to-use-btn');
    
    const menuBtn = document.getElementById('menu-btn');
    const menuPanel = document.getElementById('menu-panel');
    const deckMenuHomeBtn = document.getElementById('deck-menu-home-btn');
    const deckMenuDownloadBtn = document.getElementById('deck-menu-download-btn');
    const deckMenuSettingsBtn = document.getElementById('deck-menu-settings-btn');
    const deckMenuCloseBtn = document.getElementById('deck-menu-close-btn');
    const showAllBtn = document.getElementById('show-all-btn');
    const showStatsBtn = document.getElementById('show-stats-btn');
    const deckShowHowToUseBtn = document.getElementById('deck-show-how-to-use-btn');
    const cardTagFilterContainer = document.getElementById('card-tag-filter-container');
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    const fontSizeValue = document.getElementById('font-size-value');
    const newLimitDecrease = document.getElementById('new-limit-decrease');
    const newLimitIncrease = document.getElementById('new-limit-increase');
    const newLimitValue = document.getElementById('new-limit-value');
    const displayModeBtn = document.getElementById('display-mode-btn');
    const hintFlipPill = document.getElementById('hint-flip-pill');
    const ttsLangBtn = document.getElementById('tts-lang-btn');
    const ttsLangRow = document.getElementById('tts-lang-row');
    
    const allCardsModal = document.getElementById('all-cards-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const allCardsTable = document.getElementById('all-cards-table');
    const cardSearchInput = document.getElementById('card-search-input');
    const howToUseModal = document.getElementById('how-to-use-modal');
    const editDeckModal = document.getElementById('edit-deck-modal');
    const jsonEditorTextarea = document.getElementById('json-editor-textarea');
    const saveEditDeckBtn = document.getElementById('save-edit-deck-btn');
    const deckOptionsModal = document.getElementById('deck-options-modal');
    const deckOptionsTitle = document.getElementById('deck-options-title');
    const deckTitleInput = document.getElementById('deck-title-input');
    const saveDeckOptionsBtn = document.getElementById('save-deck-options-btn'); 
    const deleteDeckBtn = document.getElementById('delete-deck-btn');
    
    const deckEditorModal = document.getElementById('deck-editor-modal');
    const closeDeckEditorModalBtn = document.getElementById('close-deck-editor-modal-btn');
    const editorDeckTitle = document.getElementById('editor-deck-title');
    const editorRowsContainer = document.getElementById('editor-rows-container');
    const editorAddRowBtn = document.getElementById('editor-add-row-btn');
    const editorSaveBtn = document.getElementById('editor-save-btn');
    const editorCancelBtn = document.getElementById('editor-cancel-btn');
    const editorStatusMsg = document.getElementById('editor-status-msg');

    const appConfirmModal = document.getElementById('app-confirm-modal');
    const confirmModalTitle = document.getElementById('confirm-modal-title');
    const confirmModalMessage = document.getElementById('confirm-modal-message');
    const confirmModalOkBtn = document.getElementById('confirm-modal-ok-btn');
    const confirmModalCancelBtn = document.getElementById('confirm-modal-cancel-btn');
    const swipeHintBar = document.getElementById('swipe-hint-bar');
    const undoPill = document.getElementById('undo-pill');

    const editorSearchInput = document.getElementById('editor-search-input');
    const editorPrevPageBtn = document.getElementById('editor-prev-page-btn');
    const editorNextPageBtn = document.getElementById('editor-next-page-btn');
    const editorPageIndicator = document.getElementById('editor-page-indicator');
    const shareModal = document.getElementById('share-modal');
    const shareDeckInfo = document.getElementById('share-deck-info');
    const qrContainer = document.getElementById('qr-container');
    const shareUrlBox = document.getElementById('share-url-box');
    const shareCopyBtn = document.getElementById('share-copy-btn');
    const closeShareModalBtn = document.getElementById('close-share-modal-btn');
    const formatGuideModal = document.getElementById('format-guide-modal');
    const closeFormatGuideBtn = document.getElementById('close-format-guide-btn');
    const openFormatGuideBtn = document.getElementById('open-format-guide-btn');
    const fgCopyPromptBtn = document.getElementById('fg-copy-prompt-btn');
    const fgCopySpecBtn = document.getElementById('fg-copy-spec-btn');
    const pasteImportArea = document.getElementById('paste-import-area');
    const pasteImportBtn = document.getElementById('paste-import-btn');
    const pasteImportSection = document.getElementById('paste-import-section');
    const addScratchBtn = document.getElementById('add-scratch-btn');
    const addUploadBtn = document.getElementById('add-upload-btn');
    const addPasteBtn = document.getElementById('add-paste-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
    const settingsFullscreenBtn = document.getElementById('settings-fullscreen-btn');
    const settingsThemeBtn = document.getElementById('settings-theme-btn');
    const settingsLangBtn = document.getElementById('settings-lang-btn');
    const deckSettingsItems = document.getElementById('deck-settings-items');
    const deckSettingsHint = document.getElementById('deck-settings-hint');
    const editorBulkBar = document.getElementById('editor-bulk-bar');
    const editorSelectAllPage = document.getElementById('editor-select-all-page');
    const editorSelectedCount = document.getElementById('editor-selected-count');
    const editorBulkTagInput = document.getElementById('editor-bulk-tag-input');
    const editorBulkAddBtn = document.getElementById('editor-bulk-add-btn');
    const editorBulkRemoveBtn = document.getElementById('editor-bulk-remove-btn');
    const editorBulkClearBtn = document.getElementById('editor-bulk-clear-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingMsg = document.getElementById('loading-msg');

    const statsModal = document.getElementById('stats-modal');
    const statsBody = document.getElementById('stats-body');
    const closeStatsModalBtn = document.getElementById('close-stats-modal-btn');
    const modalEditorBtn = document.getElementById('modal-editor-btn');
    const emptyStateCta = document.getElementById('empty-state-cta');

    // --- 狀態定義 ---
    const STORAGE_KEYS = {
        PREFERENCES: 'flashcardPWA_prefs_v2',
        DECK_LIST: 'flashcardPWA_deckList_v2', 
        ALL_TAGS: 'flashcardPWA_allTags_v2',
        DECK_DATA_PREFIX: 'flashcardPWA_data_v2_',
        DECK_STATE_PREFIX: 'flashcardPWA_state_v2_',
        UX_FLAGS: 'flipdeck_uxFlags_v1'
    };
    
    const EXAMPLES = [
        { nameKey: "ex.hs6000", file: "hs_6000.json" },
        { nameKey: "ex.verbs", file: "verbs.json" },
        { nameKey: "ex.elements", file: "elements.json" },
        { nameKey: "ex.capitals", file: "capitals.json" }
    ];

    let deckList = [], allTags = [], currentFilter = { sortBy: 'lastOpened' };
    let currentDeckId = null, currentFullDeck = [], currentLearningDeck = [], upcomingQueue = [];
    let currentCardStatus = new Map(), currentDeckSettings = {}, history = [], historyIndex = -1;
    let uxFlags = {}, lastAction = null, undoTimer = null, confirmResolveFn = null;
    let editorConfirmClose = null;

    const DEFAULT_DECK_SETTINGS = { fontSize: 2.5, filterTags: [], newPerDay: 20, displayMode: 'combo', ttsLang: 'auto' };
    const MAX_HISTORY = 50;
    const RECENT_SKIP = 8; // v4.3.0 P5：排隊時排除最近 N 張已作答卡片，避免立即回鍋
    const DAY_MS = 86400000;
    const LEECH_THRESHOLD = 8; // v5.1.0：失敗達 N 次標記為難卡 (leech)

    // =================================================================
    // ===== 核心儲存邏輯 =====
    // =================================================================

    function initializeApp() {
        const savedDecks = localStorage.getItem(STORAGE_KEYS.DECK_LIST);
        deckList = savedDecks ? JSON.parse(savedDecks) : [];
        const savedTags = localStorage.getItem(STORAGE_KEYS.ALL_TAGS);
        allTags = savedTags ? JSON.parse(savedTags) : [];
        try { uxFlags = JSON.parse(localStorage.getItem(STORAGE_KEYS.UX_FLAGS)) || {}; } catch (e) { uxFlags = {}; }

        applyThemeIcons();
        applyI18n();
        populateExampleSelector();
        renderHomeScreen();
        bindEventListeners();
        handleSharedDeckUrl(); // v5.4.0：分享連結匯入（非同步，不阻塞啟動）
    }

    function saveUXFlags() { localStorage.setItem(STORAGE_KEYS.UX_FLAGS, JSON.stringify(uxFlags)); }

    // v4.2.0 P4：通用 in-app 對話框，回傳 Promise (appAlert = 僅確定鈕版本)
    function appConfirm({ title = t('dlg.confirm'), message = '', okText = t('dlg.ok'), cancelText = t('common.cancel'), showCancel = true, danger = false } = {}) {
        return new Promise(resolve => {
            confirmModalTitle.textContent = title;
            confirmModalMessage.textContent = message;
            confirmModalOkBtn.textContent = okText;
            confirmModalCancelBtn.textContent = cancelText;
            confirmModalCancelBtn.classList.toggle('hidden', !showCancel);
            confirmModalOkBtn.className = "flex-1 py-3.5 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all " +
                (danger ? "bg-red-500 text-white" : "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400");
            // v4.5.0 P6：焦點管理——危險操作聚焦「取消」，一般操作聚焦「確定」，關閉後還原焦點
            const returnTo = document.activeElement;
            confirmResolveFn = (v) => {
                confirmResolveFn = null;
                appConfirmModal.classList.add('hidden');
                if (returnTo && document.contains(returnTo)) returnTo.focus?.();
                resolve(v);
            };
            appConfirmModal.classList.remove('hidden');
            confirmModalOkBtn.onclick = () => confirmResolveFn?.(true);
            confirmModalCancelBtn.onclick = () => confirmResolveFn?.(false);
            (danger ? confirmModalCancelBtn : confirmModalOkBtn).focus();
        });
    }
    function appAlert(message, title = t('dlg.notice')) { return appConfirm({ title, message, showCancel: false, okText: t('dlg.got_it') }); }

    // v4.2.0 P2：首次互動後收起提示列並記住
    function markFirstInteraction() {
        if (!uxFlags.hinted) { uxFlags.hinted = true; saveUXFlags(); swipeHintBar.classList.add('hidden'); }
    }

    // v4.3.0 P5：大牌組匯入/載入期間的 loading 狀態
    function showLoading(msg = t('load.default')) { loadingMsg.textContent = msg; loadingOverlay.classList.remove('hidden'); }
    function hideLoading() { loadingOverlay.classList.add('hidden'); }
    const nextPaint = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 20)));

    function saveDeckList() { localStorage.setItem(STORAGE_KEYS.DECK_LIST, JSON.stringify(deckList)); }
    function getDeckData(id) { const s = localStorage.getItem(STORAGE_KEYS.DECK_DATA_PREFIX + id); return s ? JSON.parse(s) : null; }
    function saveDeckData(id, data) { localStorage.setItem(STORAGE_KEYS.DECK_DATA_PREFIX + id, JSON.stringify(data)); }
    
    function getDeckState(id) {
        const s = localStorage.getItem(STORAGE_KEYS.DECK_STATE_PREFIX + id);
        if (!s) return new Map();
        return new Map(Object.entries(JSON.parse(s)));
    }

    function saveDeckState(id, stateMap) {
        const obj = Object.fromEntries(stateMap);
        localStorage.setItem(STORAGE_KEYS.DECK_STATE_PREFIX + id, JSON.stringify(obj));
    }

    function populateExampleSelector() {
        EXAMPLES.forEach(ex => {
            const opt = document.createElement('option');
            opt.value = ex.file; opt.textContent = t(ex.nameKey); // v5.5.5：範例名跟隨介面語言
            exampleSelector.appendChild(opt);
        });
    }

    // v5.5.5：語言切換後重填範例下拉（名稱為翻譯鍵）
    function refreshExampleSelector() {
        exampleSelector.innerHTML = '';
        populateExampleSelector();
    }

    // =================================================================
    // ===== 學習邏輯 (v4.1.0 穩定版) =====
    // =================================================================

    function startGame(id) {
        hideAllMenus(); 
        const data = getDeckData(id), meta = deckList.find(d => d.id === id);
        if (!data || !meta) return;
        
        currentDeckId = id; currentFullDeck = data;
        currentCardStatus = getDeckState(id);
        currentDeckSettings = { ...DEFAULT_DECK_SETTINGS, ...meta.settings };
        syncCardStatus(currentFullDeck);
        
        updateLearningDeck(); 
        history = []; historyIndex = -1; upcomingQueue = [];
        fillUpcomingQueue();
        
        meta.lastOpened = Date.now(); saveDeckList();
        hideUndoPill();
        showScreen('main'); showNextCard('new_game');
        // v4.2.0 P2：首次答題前的手勢提示列 + 首次啟動自動教學
        if (!uxFlags.hinted) swipeHintBar.classList.remove('hidden');
        if (!uxFlags.onboarded) { uxFlags.onboarded = true; saveUXFlags(); openHowToUseModal(); }
    }

    // 讓 state 與牌組資料一致：清除已不存在卡片的殘留 state（避免進度分母膨脹），補上缺漏的新卡
    function syncCardStatus(deckData) {
        const valid = new Set(deckData.map(c => c.card_id));
        Array.from(currentCardStatus.keys()).forEach(key => {
            if (!valid.has(key)) currentCardStatus.delete(key);
        });
        const now = Date.now();
        deckData.forEach(c => {
            let v = currentCardStatus.get(c.card_id);
            if (!v || typeof v !== 'object') {
                currentCardStatus.set(c.card_id, { mastery: 1, lastTime: now, ef: 2.5, reps: 0, interval: 0, due: 0, lapses: 0, suspended: false });
            } else {
                if (v.ef === undefined) {
                    // v5 遷移：舊資料以既有 mastery 推估 SM-2 欄位，尊重已完成的學習（mastery 5 ≈ 38 天後到期）
                    const reps = Math.max((v.mastery ?? 1) - 1, 0);
                    const interval = reps <= 0 ? 0 : reps === 1 ? 1 : reps === 2 ? 6 : Math.round(6 * Math.pow(2.5, reps - 2));
                    v.ef = 2.5; v.reps = reps; v.interval = interval;
                    v.due = interval === 0 ? 0 : now + interval * DAY_MS;
                    v.lastTime = v.lastTime ?? now;
                }
                // v5.1 遷移：補齊 lapses / suspended
                if (v.lapses === undefined) v.lapses = 0;
                if (v.suspended === undefined) v.suspended = false;
            }
        });
    }

    // 牌組內容變更後重置本輪瀏覽佇列（mastery 保留），避免 history 指向已刪除的卡片
    function resetSessionView() {
        syncCardStatus(currentFullDeck);
        updateLearningDeck();
        history = []; historyIndex = -1; upcomingQueue = [];
        fillUpcomingQueue();
        showNextCard('new_game');
    }

    function updateLearningDeck() {
        // v5.0.0：SM-2 到期制排程 —— 只挑到期（含逾期與新卡 due=0）的卡片；
        // 逾期複習優先（最逾期在前），新卡（due=0 sentinel）排在其後
        // v5.1.0：排除暫停卡；套用每日新卡上限
        const now = Date.now();
        const filtered = currentDeckSettings.filterTags?.length > 0 ? currentFullDeck.filter(matchesDeckFilter) : currentFullDeck;
        currentLearningDeck = filtered.filter(c => {
            const st = currentCardStatus.get(c.card_id);
            return st && !st.suspended && (st.due ?? 0) <= now;
        });
        const limit = currentDeckSettings.newPerDay ?? 0;
        if (limit > 0) {
            const today = new Date().toDateString();
            const dn = currentDeckSettings.dailyNew;
            const introduced = dn && dn.date === today ? dn.count : 0;
            currentLearningDeck = enforceNewCardLimit(currentLearningDeck, currentCardStatus, limit, introduced);
        }
        const dueKey = c => {
            const d = currentCardStatus.get(c.card_id)?.due ?? 0;
            return d === 0 ? Infinity : d;
        };
        currentLearningDeck.sort((a, b) => {
            const da = dueKey(a), db = dueKey(b);
            return da !== db ? da - db : Math.random() - 0.5;
        });
    }

    // v5.1.0：每日新卡上限（0 = 無上限）——只限制「未引入」的新卡（reps=0 且 due=0），
    // 失敗過的卡（reps=0 但 due=now）屬複習、不受限；保留排序（複習在前、新卡其後）
    function enforceNewCardLimit(cards, status, limit, introducedToday) {
        if (!limit || limit <= 0) return cards;
        const allow = Math.max(limit - introducedToday, 0);
        let kept = 0;
        return cards.filter(c => {
            const st = status.get(c.card_id);
            const isNew = st && (st.reps ?? 0) === 0 && (st.due ?? 0) === 0;
            if (!isNew) return true;
            if (kept >= allow) return false;
            kept++;
            return true;
        });
    }

    // v5.1.0：失敗計數與難卡 (leech) 標記
    function applyLapse(state, threshold = LEECH_THRESHOLD) {
        state.lapses = (state.lapses ?? 0) + 1;
        if (state.lapses >= threshold) state.leech = true;
        return state;
    }

    // v5.1.0：每日新卡引入計數（存於 deck settings.dailyNew，跨日自動歸零）
    function adjustDailyNew(delta) {
        const today = new Date().toDateString();
        let d = currentDeckSettings.dailyNew;
        if (!d || d.date !== today) d = currentDeckSettings.dailyNew = { date: today, count: 0 };
        d.count = Math.max(d.count + delta, 0);
        const meta = deckList.find(m => m.id === currentDeckId);
        if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
    }

    // v5.1.0：未來 30 天到期分布（以日曆天分桶：第 0 格=今天、1=明天…第 30 格=30 天以上；排除暫停卡）
    function buildForecast(cards, status, now) {
        const buckets = new Array(31).fill(0);
        const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
        cards.forEach(c => {
            const st = status.get(c.card_id);
            if (!st || st.suspended) return;
            const d = st.due ?? 0;
            if (d <= now) return;
            buckets[Math.min(Math.floor((d - startOfToday) / DAY_MS), 30)]++;
        });
        return buckets;
    }

    // v5.0.0：牌組健康度（首頁用）—— 進度 % 與到期張數一次遍歷求得
    function getDeckStats(id) {
        const data = getDeckData(id);
        if (!data || data.length === 0) return { progress: 0, due: 0 };
        const s = getDeckState(id);
        const now = Date.now();
        let points = 0, due = 0;
        data.forEach(c => {
            const v = s.get(c.card_id);
            const m = (v && typeof v === 'object') ? v.mastery : 1;
            points += (m ?? 1) - 1;
            if ((v?.due ?? 0) <= now) due++;
        });
        return { progress: Math.floor((points / (data.length * 4)) * 100), due };
    }

    // v4.3.0：目前篩選條件判斷（updateLearningDeck 與「再讀一輪」共用）
    function matchesDeckFilter(card) {
        const f = currentDeckSettings.filterTags;
        if (!f || f.length === 0) return true;
        const ts = card.tags || [];
        return f.some(t => t === 'untagged' ? ts.length === 0 : ts.includes(t));
    }

    // v5.0.0：SM-2 間隔重複演算法（純函式）
    // q: 2=忘記（重置並立即重新到期）、4=翻面後才想起、5=未翻面即答對
    // 間隔：第 1 次 +1 天、第 2 次 +6 天、之後 I(n) = I(n-1) × EF；EF 下限 1.3
    function sm2Update(state, q, now = Date.now()) {
        let { ef = 2.5, reps = 0, interval = 0 } = state ?? {};
        ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
        if (q < 3) {
            return { ef, reps: 0, interval: 0, due: now };
        }
        reps += 1;
        interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.max(1, Math.round(interval * ef));
        return { ef, reps, interval, due: now + interval * DAY_MS };
    }

    function fillUpcomingQueue() {
        // v4.3.0 P5：排除最近答過的卡片，避免同一張卡立刻回鍋；牌組太小時退而求其次
        const recent = new Set(history.slice(-RECENT_SKIP));
        while (upcomingQueue.length < 5 && currentLearningDeck.length > 0) {
            let pool = currentLearningDeck.filter(c => !upcomingQueue.includes(c.card_id) && !recent.has(c.card_id));
            if (pool.length === 0) pool = currentLearningDeck.filter(c => !upcomingQueue.includes(c.card_id));
            if (pool.length === 0) break;
            const window = pool.slice(0, 10);
            upcomingQueue.push(window[Math.floor(Math.random() * window.length)].card_id);
        }
    }

    function showNextCard(action) {
        // v4.2.0 P3：記錄本次判定，供 undo 膠囊回復；v5：快照含 SM-2 欄位；v5.1：lapses/suspended + 新卡計數
        const isJudgment = action === 'correct' || action === 'incorrect' || action === 'skip';
        const prevId = (historyIndex >= 0 && historyIndex < history.length) ? history[historyIndex] : null;
        const prevState = prevId != null ? currentCardStatus.get(prevId) : null;
        const prevSnapshot = prevState ? {
            mastery: prevState.mastery, ef: prevState.ef, reps: prevState.reps,
            interval: prevState.interval, due: prevState.due,
            lapses: prevState.lapses, leech: prevState.leech, suspended: prevState.suspended
        } : null;

        if (isJudgment) markFirstInteraction();

        let wasIntro = false;
        if (isJudgment && action !== 'skip') {
            const id = history[historyIndex], state = currentCardStatus.get(id);
            if (state) {
                // v5：即答（未翻面）q=5，翻面後才答對 q=4，忘記 q=2
                // v5.4.0：雙面模式答案可見，答對一律記 q=4（視為「看過答案後想起」）
                const flipped = document.getElementById('active-combo-card')?.querySelector('.card-inner')?.classList.contains('rotate-y-180') ?? false;
                const q = action === 'incorrect' ? 2 : (currentDeckSettings.displayMode === 'dual' ? 4 : (flipped ? 4 : 5));
                wasIntro = (state.reps ?? 0) === 0 && (state.due ?? 0) === 0; // v5.1：首次引入新卡
                Object.assign(state, sm2Update(state, q));
                if (action === 'incorrect') applyLapse(state); // v5.1：失敗計數 + leech
                state.mastery = action === 'incorrect' ? 1 : Math.min((state.mastery ?? 1) + 1, 5);
                state.lastTime = Date.now();
                currentCardStatus.set(id, state);
                if (wasIntro) adjustDailyNew(1); // v5.1：每日新卡額度遞減
            }
            // 依到期日重建學習集合，並把已排到未來/暫停的卡片移出佇列（同一輪不再重複出現）
            updateLearningDeck();
            const now = Date.now();
            upcomingQueue = upcomingQueue.filter(qid => {
                const st = currentCardStatus.get(qid);
                return st && !st.suspended && (st.due ?? 0) <= now;
            });
        }

        if (isJudgment && prevId != null) {
            lastAction = { cardId: prevId, prev: action === 'skip' ? null : prevSnapshot, nextId: null, wasIntro };
            showUndoPill();
        } else {
            lastAction = null;
        }

        if (historyIndex < history.length - 1) {
            historyIndex++;
        } else {
            if (upcomingQueue.length === 0) {
                if (currentLearningDeck.length === 0) { displayEndOfDeck(); return; }
                fillUpcomingQueue();
            }
            const nextId = upcomingQueue.shift();
            if (lastAction) lastAction.nextId = nextId;
            history.push(nextId);
            if (history.length > MAX_HISTORY) history.shift();
            historyIndex = history.length - 1;
            fillUpcomingQueue();
        }
        displayCardStack(); updateUI(); saveDeckState(currentDeckId, currentCardStatus);
    }

    // v4.2.0 P3：復原膠囊 —— 3.5 秒內可回復上一次判定（含熟練度與瀏覽位置）
    function showUndoPill() {
        if (!lastAction) return;
        undoPill.classList.remove('hidden');
        clearTimeout(undoTimer);
        undoTimer = setTimeout(hideUndoPill, 3500);
    }

    function hideUndoPill() {
        clearTimeout(undoTimer);
        undoPill.classList.add('hidden');
        lastAction = null;
    }

    function undoLastAction() {
        if (!lastAction) { hideUndoPill(); return; }
        const { cardId, prev, nextId, wasIntro } = lastAction;
        if (prev) {
            const st = currentCardStatus.get(cardId);
            if (st) Object.assign(st, prev);
            if (wasIntro) adjustDailyNew(-1); // v5.1：退還今日新卡額度
            updateLearningDeck();
        }
        if (nextId) {
            upcomingQueue.unshift(nextId);
            const idx = history.lastIndexOf(nextId);
            if (idx >= 0) history.splice(idx, 1);
        }
        historyIndex = Math.min(historyIndex, history.length - 1);
        lastAction = null;
        hideUndoPill();
        displayCardStack(); updateUI(); saveDeckState(currentDeckId, currentCardStatus);
    }

    // v5.5.0：Web Speech API 朗讀——v5.5.2：優先使用牌組設定語言
    // v5.7.0：預設（auto）改為英式英文 en-GB
    function speakText(text) {
        if (!('speechSynthesis' in window) || !text) return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const pref = currentDeckSettings.ttsLang;
        u.lang = (pref && pref !== 'auto') ? pref : (/[\u4e00-\u9fff]/.test(text) ? 'zh-TW' : 'en-GB');
        speechSynthesis.speak(u);
    }
    const canSpeak = 'speechSynthesis' in window;
    const TTS_LANGS = ['auto', 'zh-TW', 'en-GB', 'en-US'];

    function displayCardStack() {
        cardStackContainer.innerHTML = '';
        const visible = [];
        if (historyIndex >= 0) {
            const top = currentFullDeck.find(c => c.card_id === history[historyIndex]);
            if (top) visible.push(top);
        }
        
        if (historyIndex === history.length - 1) {
            for (let i = 0; i < 2 && upcomingQueue[i]; i++) {
                const q = currentFullDeck.find(c => c.card_id === upcomingQueue[i]);
                if (q) visible.push(q);
            }
        } else {
            for (let i = 1; i <= 2 && history[historyIndex + i]; i++) {
                const h = currentFullDeck.find(c => c.card_id === history[historyIndex + i]);
                if (h) visible.push(h);
            }
        }

        if (visible.length === 0 && currentLearningDeck.length > 0) {
            fillUpcomingQueue(); showNextCard('new_game'); return;
        }
        if (visible.length === 0) { displayEndOfDeck(); return; }

        for (let i = visible.length - 1; i >= 0; i--) {
            const data = visible[i], isTop = (i === 0);
            const cardEl = document.createElement('div');
            cardEl.className = `combo-card absolute w-full h-full transition-all duration-300 ease-out ${isTop ? 'z-[30]' : 'pointer-events-none'}`;
            cardEl.style.transform = `translateY(${i * 16}px) scale(${1 - i * 0.05})`;
            cardEl.style.opacity = 1 - i * 0.2;
            
            if (isTop) {
                cardEl.id = 'active-combo-card';
                const fs = currentDeckSettings.fontSize;
                if (currentDeckSettings.displayMode === 'dual') {
                    // v5.4.0：雙面模式 —— 正面與背面同時可見，無翻面
                    cardEl.innerHTML = `
                    <div id="stamp-forgot" class="stamp"><span class="material-symbols-outlined !text-5xl">close</span></div>
                    <div id="stamp-learned" class="stamp"><span class="material-symbols-outlined !text-5xl">check</span></div>
                    ${canSpeak ? `<button class="speak-btn absolute top-3 right-3 z-[5] p-2 text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-full transition-colors" aria-label="${t('aria.speak')}" title="${t('aria.speak')}"><span class="material-symbols-outlined !text-lg">volume_up</span></button>` : ''}
                    <div class="card-inner">
                        <div class="absolute inset-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm flex flex-col items-center justify-center p-6 sm:p-8 overflow-hidden">
                            <div class="card-content text-center text-stone-900 dark:text-stone-100 font-bold break-words w-full" style="font-size: ${fs}rem">${data.fields[0]}</div>
                            <div class="w-12 h-px bg-stone-200 dark:bg-stone-700 my-3 sm:my-4 flex-shrink-0"></div>
                            <div class="card-content text-center text-stone-600 dark:text-stone-300 font-bold break-words w-full" style="font-size: ${fs * 0.8}rem">${data.fields[1] || ''}</div>
                            <div class="text-stone-400 dark:text-stone-500 text-sm leading-relaxed overflow-y-auto max-h-full w-full text-center mt-2">${data.fields.slice(2).join('<br>')}</div>
                        </div>
                    </div>
                `;
                } else {
                cardEl.innerHTML = `
                    <div id="stamp-forgot" class="stamp"><span class="material-symbols-outlined !text-5xl">close</span></div>
                    <div id="stamp-learned" class="stamp"><span class="material-symbols-outlined !text-5xl">check</span></div>
                    ${canSpeak ? `<button class="speak-btn absolute top-3 right-3 z-[5] p-2 text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-full transition-colors" aria-label="${t('aria.speak')}" title="${t('aria.speak')}"><span class="material-symbols-outlined !text-lg">volume_up</span></button>` : ''}
                    <div class="card-inner">
                        <div class="absolute inset-0 backface-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm flex items-center justify-center p-8 overflow-hidden">
                            <div class="card-content text-center text-stone-900 dark:text-stone-100 font-bold break-words w-full" style="font-size: ${currentDeckSettings.fontSize}rem">${data.fields[0]}</div>
                            <span class="absolute bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-stone-400 font-bold pointer-events-none select-none">${t('learn.tap_flip')}</span>
                        </div>
                        <div class="absolute inset-0 backface-hidden rotate-y-180 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                            <div class="card-content font-bold mb-4 break-words w-full" style="font-size: ${currentDeckSettings.fontSize * 0.8}rem">${data.fields[1] || ''}</div>
                            <div class="text-stone-400 dark:text-stone-500 text-sm leading-relaxed overflow-y-auto max-h-full w-full">${data.fields.slice(2).join('<br>')}</div>
                        </div>
                    </div>
                `;
                }
                cardStackContainer.appendChild(cardEl);
                initComboLogic(cardEl);
                const speakBtn = cardEl.querySelector('.speak-btn');
                if (speakBtn) {
                    speakBtn.onpointerdown = (e) => e.stopPropagation();
                    speakBtn.onclick = (e) => { e.stopPropagation(); speakText(data.fields[0]); };
                }
            } else {
                cardEl.innerHTML = `<div class="w-full h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl flex items-center justify-center p-8"><div class="text-stone-200 dark:text-stone-800 font-bold truncate w-full text-center" style="font-size: ${currentDeckSettings.fontSize}rem">${data.fields[0]}</div></div>`;
                cardStackContainer.appendChild(cardEl);
            }
        }
    }

    function initComboLogic(card) {
        const inner = card.querySelector('.card-inner');
        const sForgot = card.querySelector('#stamp-forgot'), sLearned = card.querySelector('#stamp-learned');
        let isDragging = false, startX = 0, startY = 0, dragX = 0, dragY = 0, lastX = 0, lastY = 0, lastTime = 0, velocity = 0, velocityY = 0, startTime = 0;

        card.onpointerdown = (e) => {
            if (e.button !== 0) return;
            isDragging = true; startX = lastX = e.clientX; startY = lastY = e.clientY; lastTime = startTime = Date.now();
            card.style.transition = 'none'; card.setPointerCapture(e.pointerId);
        };

        card.onpointermove = (e) => {
            if (!isDragging) return;
            const now = Date.now(), dt = now - lastTime;
            if (dt > 0) { velocity = (e.clientX - lastX) / dt; velocityY = (e.clientY - lastY) / dt; }
            dragX = e.clientX - startX; dragY = e.clientY - startY; lastX = e.clientX; lastY = e.clientY; lastTime = now;
            if (Math.abs(dragY) > Math.abs(dragX)) {
                // 垂直拖曳：上滑跳過預覽，不顯示印章
                sForgot.style.opacity = sLearned.style.opacity = bgForgot.style.opacity = bgLearned.style.opacity = 0;
                card.style.transform = `translateY(${dragY}px) rotate(0deg)`;
            } else {
                card.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`;
                const op = Math.min(Math.abs(dragX) / 120, 1);
                if (dragX > 0) {
                    sLearned.style.opacity = op; sForgot.style.opacity = 0;
                    bgLearned.style.opacity = op; bgForgot.style.opacity = 0;
                } else {
                    sForgot.style.opacity = op; sLearned.style.opacity = 0;
                    bgForgot.style.opacity = op; bgLearned.style.opacity = 0;
                }
            }
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            // v4.4.0 P7：上滑跳過（位移 > 80px 或快速上甩）
            if (dragY < -80 || (velocityY < -0.7 && dragY < -20)) {
                card.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                card.style.transform = `translateY(-1000px) rotate(0deg)`;
                card.style.opacity = '0';
                bgForgot.style.opacity = bgLearned.style.opacity = 0;
                navigator.vibrate?.(10);
                setTimeout(() => showNextCard('skip'), 250);
                return;
            }
            if (Math.abs(velocity) > 0.5 || Math.abs(dragX) > 100) {
                const dir = dragX > 0 ? 1 : -1;
                card.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                card.style.transform = `translateX(${dir * 1000}px) rotate(${dir * 45}deg)`;
                card.style.opacity = '0';
                bgForgot.style.opacity = bgLearned.style.opacity = 0;
                navigator.vibrate?.(10);
                setTimeout(() => showNextCard(dir > 0 ? 'correct' : 'incorrect'), 250);
            } else {
                card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = `translateX(0px) rotate(0deg)`;
                sForgot.style.opacity = sLearned.style.opacity = bgForgot.style.opacity = bgLearned.style.opacity = 0;
                if (currentDeckSettings.displayMode !== 'dual' && Math.abs(dragX) < 15 && Math.abs(dragY) < 15 && (Date.now() - startTime) < 300) inner.classList.toggle('rotate-y-180');
            }
        };
        card.onpointerup = handleEnd;
        card.onpointercancel = handleEnd;
    }

    function updateUI() {
        const meta = deckList.find(d => d.id === currentDeckId);
        // v5.5.1：膠囊改顯示「剩 N 張到期」——答題即時遞減的回饋
        //（原顯示第 5 級張數，整個 session 都不會動，觀感像計算故障）
        deckInfo.innerHTML = `<span class="font-black">${meta?.title || ''}</span> • ${t('learn.due_left', { n: currentLearningDeck.length })}`;
    }

    // =================================================================
    // ===== 事件綁定 (嚴格修復選單失效) =====
    // =================================================================

    function bindEventListeners() {
        // --- 選單開啟按鈕 ---
        homeMenuBtn.onclick = (e) => { e.stopPropagation(); toggleMenu('home'); };
        menuBtn.onclick = (e) => { e.stopPropagation(); toggleMenu('deck'); };
        menuOverlay.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 首頁選單內按鈕 ---
        homeMenuAddBtn.onclick = (e) => { e.stopPropagation(); openQuickStartModal(); };
        homeMenuSettingsBtn.onclick = (e) => { e.stopPropagation(); openSettingsModal(); };
        backupAllBtn.onclick = (e) => { e.stopPropagation(); backupAllData(); };
        showHowToUseBtn.onclick = (e) => { e.stopPropagation(); openHowToUseModal(); };
        homeMenuCloseBtn.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 學習選單內按鈕 ---
        deckMenuHomeBtn.onclick = (e) => { e.stopPropagation(); backToHomeScreen(); hideAllMenus(); };
        deckMenuDownloadBtn.onclick = (e) => { e.stopPropagation(); downloadData('json'); hideAllMenus(); };
        deckMenuSettingsBtn.onclick = (e) => { e.stopPropagation(); openSettingsModal(); };
        showAllBtn.onclick = (e) => { e.stopPropagation(); showAllCardsView(); };
        showStatsBtn.onclick = (e) => { e.stopPropagation(); showStatsView(); };
        deckShowHowToUseBtn.onclick = (e) => { e.stopPropagation(); openHowToUseModal(); };
        fontSizeIncrease.onclick = (e) => { e.stopPropagation(); changeDeckFontSize(0.2); };
        fontSizeDecrease.onclick = (e) => { e.stopPropagation(); changeDeckFontSize(-0.2); };
        newLimitIncrease.onclick = (e) => { e.stopPropagation(); changeNewPerDay(5); };
        newLimitDecrease.onclick = (e) => { e.stopPropagation(); changeNewPerDay(-5); };
        displayModeBtn.onclick = (e) => { e.stopPropagation(); changeDisplayMode(); };
        ttsLangBtn.onclick = (e) => { e.stopPropagation(); cycleTtsLang(); };
        deckMenuCloseBtn.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 新增選項（v5.7.0） ---
        addScratchBtn.onclick = () => { quickStartModal.classList.add('hidden'); openDeckEditor(); };
        addUploadBtn.onclick = () => fileUpload.click();
        addPasteBtn.onclick = () => {
            const show = pasteImportSection.classList.toggle('hidden') === false;
            if (show) pasteImportArea.focus();
        };

        // --- 設定 Modal（v5.7.0） ---
        closeSettingsModalBtn.onclick = () => settingsModal.classList.add('hidden');
        settingsFullscreenBtn.onclick = (e) => { e.stopPropagation(); toggleFullScreen(); };
        settingsThemeBtn.onclick = (e) => { e.stopPropagation(); toggleTheme(); };
        settingsLangBtn.onclick = (e) => { e.stopPropagation(); toggleLang(); };
        ttsLangRow.classList.toggle('hidden', !canSpeak);

        // --- 融合 Modal 按鈕 ---
        const modalJsonBtn = document.getElementById('modal-json-btn');
        if (modalJsonBtn) modalJsonBtn.onclick = () => openEditDeckModal();
        if (modalEditorBtn) modalEditorBtn.onclick = () => openDeckEditor(currentDeckId);

        // --- 統計與空狀態 ---
        closeStatsModalBtn.onclick = () => statsModal.classList.add('hidden');
        if (emptyStateCta) emptyStateCta.onclick = () => openQuickStartModal();

        // --- 顯示全部：跳至卡片 / 暫停切換 / 詳細模式切換（事件委派，表格重建後仍有效） ---
        allCardsTable.onclick = (e) => {
            const jump = e.target.closest('.jump-to-card-btn');
            if (jump) {
                allCardsModal.classList.add('hidden');
                jumpToCard(jump.dataset.id);
                return;
            }
            const sus = e.target.closest('.suspend-btn');
            if (sus) {
                const st = currentCardStatus.get(sus.dataset.id);
                if (st) {
                    st.suspended = !st.suspended;
                    st.lastTime = Date.now();
                    upcomingQueue = upcomingQueue.filter(qid => qid !== sus.dataset.id);
                    saveDeckState(currentDeckId, currentCardStatus);
                    renderAllCardsTable();
                }
            }
        };
        const acDetailToggle = document.getElementById('ac-detail-toggle-btn');
        if (acDetailToggle) acDetailToggle.onclick = () => {
            allCardsDetail = !allCardsDetail;
            acDetailToggle.querySelector('[data-i18n]').textContent = allCardsDetail ? t('ac.detail_on') : t('ac.detail');
            acDetailToggle.querySelector('.material-symbols-outlined').textContent = allCardsDetail ? 'visibility' : 'info';
            renderAllCardsTable();
        };

        // --- 分享 Modal（v5.5.0） ---
        closeShareModalBtn.onclick = () => shareModal.classList.add('hidden');
        shareCopyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(currentShareUrl);
                const original = shareCopyBtn.textContent;
                shareCopyBtn.textContent = t('share.copied');
                setTimeout(() => { shareCopyBtn.textContent = t('share.copy'); }, 1500);
            } catch (e) {
                shareUrlBox.focus();
                const range = document.createRange();
                range.selectNodeContents(shareUrlBox);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        };

        // --- 匯入格式說明 Modal（v5.5.4） ---
        if (openFormatGuideBtn) openFormatGuideBtn.onclick = () => { formatGuideModal.classList.remove('hidden'); };
        closeFormatGuideBtn.onclick = () => formatGuideModal.classList.add('hidden');
        fgCopyPromptBtn.onclick = () => copyWithFeedback(fgCopyPromptBtn, buildAgentPrompt());
        fgCopySpecBtn.onclick = () => copyWithFeedback(fgCopySpecBtn, buildFormatSpec());

        // v5.7.2：貼上區快速複製 AI Agent 提示詞（不用開格式說明 Modal）
        const pasteCopyAgentBtn = document.getElementById('paste-copy-agent-btn');
        if (pasteCopyAgentBtn) pasteCopyAgentBtn.onclick = () => copyWithFeedback(pasteCopyAgentBtn, buildAgentPrompt());

        // --- v5.6.0：直接貼上匯入 ---
        pasteImportBtn.onclick = async () => {
            const raw = pasteImportArea.value;
            const r = parsePastedContent(raw);
            if (!r) return;
            if (r.error) { await appAlert(t('dlg.paste_' + r.error), t('qs.paste_title')); return; }
            pasteImportArea.value = '';
            if (r.backup) {
                // 備份物件 → 走還原流程（與檔案上傳共用）
                quickStartModal.classList.add('hidden');
                await importBackupParsed(r.backup);
                return;
            }
            if (r.kind === 'md') {
                // Markdown（可能含救援接合）→ 開編輯器預覽，使用者檢查後再存
                quickStartModal.classList.add('hidden');
                openDeckEditor(null, r.cards);
                return;
            }
            quickStartModal.classList.add('hidden');
            processNewDeck(r.cards, `d_${Date.now()}`, t('qs.paste_deckname'));
        };

        // --- 其他全域事件 ---
        fileUpload.onchange = handleFileUpload;
        loadExampleBtn.onclick = handleExampleLoad;
        sortBySelect.onchange = (e) => { currentFilter.sortBy = e.target.value; renderHomeScreen(); };
        undoPill.onclick = () => undoLastAction();
        
        window.onkeydown = (e) => {
            // v4.2.0 P6：Escape 依層級關閉（對話框 > 最上層 Modal > 選單）
            if (e.key === 'Escape') { handleEscape(); return; }

            // v4.5.0 P6：Modal 開啟時 Tab 焦點鎖定在 Modal 內（focus trap）
            if (e.key === 'Tab') {
                const top = [appConfirmModal, deckEditorModal, editDeckModal, shareModal, formatGuideModal, settingsModal, allCardsModal, deckOptionsModal, statsModal, howToUseModal, quickStartModal]
                    .find(m => !m.classList.contains('hidden'));
                if (top) trapTab(top, e);
                return;
            }

            // 任一 Modal 或選單開啟中（或焦點在輸入框）時，不攔截按鍵
            const modalOpen = [quickStartModal, allCardsModal, editDeckModal, deckOptionsModal, howToUseModal, deckEditorModal, appConfirmModal, statsModal, shareModal, formatGuideModal, settingsModal]
                .some(m => !m.classList.contains('hidden'))
                || !menuOverlay.classList.contains('hidden')
                || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');
            if (modalOpen) return;

            if (!mainScreen.classList.contains('hidden')) {
                if (e.key === 'ArrowRight') { e.preventDefault(); showNextCard('correct'); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); showNextCard('incorrect'); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); showNextCard('skip'); }
                else if (e.key === ' ') {
                    e.preventDefault();
                    const ac = document.getElementById('active-combo-card');
                    if (ac && currentDeckSettings.displayMode !== 'dual') ac.querySelector('.card-inner').classList.toggle('rotate-y-180');
                }
            }
        };

        // --- Modal 關閉按鈕 ---
        closeQuickStartModalBtn.onclick = () => quickStartModal.classList.add('hidden');
        closeModalBtn.onclick = () => allCardsModal.classList.add('hidden');
        const closeEditBtn = document.getElementById('close-edit-deck-modal-btn');
        if (closeEditBtn) closeEditBtn.onclick = () => editDeckModal.classList.add('hidden');
        const cancelEditBtn = document.getElementById('cancel-edit-deck-btn');
        if (cancelEditBtn) cancelEditBtn.onclick = () => editDeckModal.classList.add('hidden');
        const closeOptionsBtn = document.getElementById('close-deck-options-modal-btn');
        if (closeOptionsBtn) closeOptionsBtn.onclick = () => deckOptionsModal.classList.add('hidden');
        const closeHowToBtn = document.getElementById('close-how-to-use-modal-btn');
        if (closeHowToBtn) closeHowToBtn.onclick = () => howToUseModal.classList.add('hidden');

        cardSearchInput.oninput = renderAllCardsTable;
    }

    // =================================================================
    // ===== 輔助渲染與功能 (簡化) =====
    // =================================================================

    function showScreen(s) { 
        [homeScreen, mainScreen].forEach(el => el.classList.add('hidden'));
        document.getElementById(s + '-screen').classList.remove('hidden');
    }

    function backToHomeScreen() { currentDeckId = null; hideUndoPill(); swipeHintBar.classList.add('hidden'); showScreen('home'); renderHomeScreen(); }

    function toggleMenu(t) {
        const p = t === 'home' ? homeMenuPanel : menuPanel;
        const isOpen = p.classList.contains('open');
        hideAllMenus();
        if (!isOpen) { p.classList.add('open'); menuOverlay.classList.remove('hidden'); }
    }

    function hideAllMenus() {
        [homeMenuPanel, menuPanel].forEach(p => p.classList.remove('open'));
        menuOverlay.classList.add('hidden');
    }

    // v4.2.0 P6：Escape 依 z-index 由高到低關閉最上層視窗
    function handleEscape() {
        if (confirmResolveFn) { confirmResolveFn(false); return; }
        const stack = [quickStartModal, howToUseModal, deckOptionsModal, allCardsModal, statsModal, shareModal, formatGuideModal, settingsModal, editDeckModal, deckEditorModal];
        for (let i = stack.length - 1; i >= 0; i--) {
            if (!stack[i].classList.contains('hidden')) {
                // v4.3.0：編輯器有未儲存變更時，先經確認再關閉
                if (stack[i] === deckEditorModal && editorConfirmClose) { editorConfirmClose(); return; }
                stack[i].classList.add('hidden'); return;
            }
        }
        hideAllMenus();
    }

    // v4.5.0 P6：將 Tab 焦點循環鎖在開啟的 Modal 內
    function trapTab(modal, e) {
        const items = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'))
            .filter(el => el.getClientRects().length > 0);
        if (items.length === 0) return;
        const first = items[0], last = items[items.length - 1];
        const active = document.activeElement;
        if (!modal.contains(active)) { e.preventDefault(); first.focus(); return; }
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    }

    // v4.4.0 P7：深色模式手動切換（預設跟隨系統，切換後記住）
    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('flipdeck_theme', isDark ? 'dark' : 'light');
        applyThemeIcons();
    }

    function applyThemeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        [settingsThemeBtn].forEach(b => {
            if (!b) return;
            b.querySelector('span').textContent = isDark ? 'light_mode' : 'dark_mode';
            b.setAttribute('aria-label', isDark ? t('aria.theme_light') : t('aria.theme_dark'));
        });
    }

    // v5.7.0：設定 Modal——所有設定集中於此；牌組設定僅在學習中顯示
    function openSettingsModal() {
        hideAllMenus();
        const inDeck = !mainScreen.classList.contains('hidden') && currentDeckId;
        deckSettingsItems.classList.toggle('hidden', !inDeck);
        deckSettingsHint.classList.toggle('hidden', !!inDeck);
        if (inDeck) applyCurrentDeckSettings();
        settingsModal.classList.remove('hidden');
    }

    // v5.2.0：語言切換（zh ↔ en），靜態 HTML 由 applyI18n 套用、動態內容重渲染
    function toggleLang() {
        setLang(I18N_LANG === 'zh' ? 'en' : 'zh');
        refreshExampleSelector(); // v5.5.5：範例名跟隨語言
        if (!mainScreen.classList.contains('hidden')) updateUI();
        else renderHomeScreen();
    }

    function handleFileUpload(e) {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = async (ev) => {
            showLoading(t('load.parsing'));
            try {
                await nextPaint();
                let parsed;
                if (f.name.endsWith('.json')) {
                    parsed = JSON.parse(ev.target.result);
                } else {
                    parsed = ev.target.result.trim().split('\n').map((l, i) => ({ card_id: `c_${Date.now()}_${i}`, fields: l.split(';').map(s => s.trim().replace(/\/\//g, '<br>')), tags: [] }));
                }

                // v4.4.0 P7：備份檔偵測 → 走還原流程（v5.6.0 與貼上匯入共用）
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Array.isArray(parsed.decks) && Array.isArray(parsed.deckList)) {
                    await importBackupParsed(parsed);
                    return;
                }

                if (!Array.isArray(parsed)) throw new Error('not a deck');
                processNewDeck(parsed, `d_${Date.now()}`, f.name.split('.')[0]);
                quickStartModal.classList.add('hidden');
            } catch (err) { appAlert(t('dlg.file_error'), t('dlg.file_error_t')); }
            finally { hideLoading(); }
        };
        r.readAsText(f);
    }

    // v5.6.0：備份物件還原流程（檔案上傳與貼上共用）——回傳是否完成
    async function importBackupParsed(parsed) {
        const ids = parsed.decks.filter(d => d && typeof d.id === 'string').map(d => d.id);
        if (ids.length === 0) { await appAlert(t('dlg.restore_none'), t('dlg.restore_none_t')); return false; }
        const overlap = ids.filter(id => deckList.some(x => x.id === id)).length;
        const ok = await appConfirm({
            title: t('dlg.restore_title'),
            message: t('dlg.restore_msg', { n: ids.length, m: overlap }),
            okText: t('dlg.restore_ok'),
            danger: overlap > 0
        });
        if (!ok) return false;
        const { restored, added } = restoreBackup(parsed);
        quickStartModal.classList.add('hidden');
        backToHomeScreen();
        await appAlert(t('dlg.restore_done', { r: restored, a: added }), t('dlg.restore_done_t'));
        return true;
    }

    // v4.4.0 P7：還原全域備份 —— 依 id 合併：已存在者覆蓋（保留清單位置），新 id 新增至最前
    function restoreBackup(backup) {
        let restored = 0, added = 0;
        backup.decks.forEach(d => {
            if (!d || typeof d.id !== 'string' || !Array.isArray(d.data)) return;
            const meta = (backup.deckList || []).find(m => m && m.id === d.id) || {};
            const existing = deckList.find(x => x.id === d.id);
            if (existing) {
                if (meta.title) existing.title = meta.title;
                existing.totalCards = d.data.length;
                if (meta.settings) existing.settings = { ...DEFAULT_DECK_SETTINGS, ...meta.settings };
                restored++;
            } else {
                deckList.unshift({
                    id: d.id,
                    title: meta.title || d.id,
                    totalCards: d.data.length,
                    lastOpened: meta.lastOpened || Date.now(),
                    progress: 0,
                    settings: { ...DEFAULT_DECK_SETTINGS, ...(meta.settings || {}) }
                });
                added++;
            }
            saveDeckData(d.id, d.data);
            const stateMap = new Map(Object.entries(d.state || {}));
            d.data.forEach(c => {
                if (!stateMap.has(c.card_id)) stateMap.set(c.card_id, { mastery: 1, lastTime: Date.now() });
            });
            saveDeckState(d.id, stateMap);
        });
        if (Array.isArray(backup.allTags)) allTags = [...new Set([...allTags, ...backup.allTags])];
        saveDeckList();
        return { restored, added };
    }

    // v4.2.0 P1：範例覆載保護 —— 既有進度時先警告，避免靜默重置
    function handleExampleLoad() {
        const f = exampleSelector.value; if (!f) return;
        const id = `ex_${f.split('.')[0]}`;
        const existing = deckList.find(d => d.id === id);
        if (existing && calculateProgress(id) > 0) {
            appConfirm({
                title: t('dlg.reload_title'),
                message: t('dlg.reload_msg', { t: existing.title, p: calculateProgress(id) }),
                okText: t('dlg.reload_ok'),
                danger: true
            }).then(ok => { if (ok) doLoadExample(f); });
            return;
        }
        doLoadExample(f);
    }

    async function doLoadExample(f) {
        showLoading(t('load.example'));
        try {
            const r = await fetch(`data/${f}`);
            const data = await r.json();
            await nextPaint();
            processNewDeck(data, `ex_${f.split('.')[0]}`, exampleSelector.selectedOptions[0].text);
            quickStartModal.classList.add('hidden');
        } catch (e) {
            appAlert(t('dlg.example_fail'), t('dlg.example_fail_t'));
        } finally {
            hideLoading();
        }
    }

    function processNewDeck(data, id, title) {
        saveDeckData(id, data);
        const m = { id, title, totalCards: data.length, lastOpened: Date.now(), progress: 0, settings: { ...DEFAULT_DECK_SETTINGS } };
        deckList.unshift(m); saveDeckList();
        const state = new Map(); data.forEach(c => state.set(c.card_id, { mastery: 1, lastTime: Date.now() }));
        saveDeckState(id, state); startGame(id);
    }

    function renderHomeScreen() {
        deckListContainer.innerHTML = '';
        if (deckList.length === 0) { noRecentDecks.classList.remove('hidden'); return; }
        noRecentDecks.classList.add('hidden');
        
        // 每個牌組只計算一次（大牌組 JSON parse 開銷高，sort comparator 內重複計算會卡）
        const statsMap = new Map(deckList.map(d => [d.id, getDeckStats(d.id)]));

        let sorted = [...deckList];
        if (currentFilter.sortBy === 'title') sorted.sort((a,b) => a.title.localeCompare(b.title));
        else if (currentFilter.sortBy === 'progress') sorted.sort((a,b) => statsMap.get(b.id).progress - statsMap.get(a.id).progress);
        else sorted.sort((a,b) => b.lastOpened - a.lastOpened);

        sorted.forEach(d => {
            const st = statsMap.get(d.id);
            const prog = st.progress;
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 cursor-pointer group relative overflow-hidden";
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-black text-stone-900 dark:text-stone-100 truncate pr-8">${d.title}</h3>
                    <button class="options-btn p-1 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors" aria-label="${t('aria.deck_options')}">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                <div class="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                    <span>${t('home.cards', { n: d.totalCards })} • ${t('home.mastered', { n: prog })}${st.due > 0 ? ` • <span class="text-teal-700 dark:text-teal-300 font-black">${t('home.due', { n: st.due })}</span>` : ''}</span>
                </div>
                <div class="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-1000" style="width: ${prog}%"></div>
                </div>
            `;
            card.onclick = (e) => { if(!e.target.closest('.options-btn')) startGame(d.id); };
            card.querySelector('.options-btn').onclick = (e) => { e.stopPropagation(); openDeckOptions(d.id); };
            deckListContainer.appendChild(card);
        });
        statsTotalDecks.textContent = deckList.length;
        statsTotalCards.textContent = deckList.reduce((acc, d) => acc + d.totalCards, 0);
    }

    // v4.1.5: 分母改用「牌組實際卡片數」，分子只統計牌組內現存卡片的點數
    // —— 殘留的 stale state（如 hs_6000 換 card_id、JSON 編輯刪卡）不再汙染進度
    function calculateProgress(id, deckData = null) {
        const data = deckData || getDeckData(id);
        if (!data || data.length === 0) return 0;
        const s = getDeckState(id);
        let points = 0;
        data.forEach(c => {
            const v = s.get(c.card_id);
            const m = (v && typeof v === 'object') ? v.mastery : 1;
            points += (m - 1);
        });
        return Math.floor((points / (data.length * 4)) * 100);
    }

    function openQuickStartModal() { quickStartModal.classList.remove('hidden'); hideAllMenus(); exampleSelector.focus(); }
    function openHowToUseModal() { howToUseModal.classList.remove('hidden'); hideAllMenus(); document.getElementById('close-how-to-use-modal-btn')?.focus(); }
    
    function applyCurrentDeckSettings() {
        // 防護：session 尚未啟動或設定不完整時（如匯入中斷後誤觸選單），回補預設值
        if (!currentDeckSettings || currentDeckSettings.fontSize === undefined) {
            currentDeckSettings = { ...DEFAULT_DECK_SETTINGS };
        }
        fontSizeValue.textContent = currentDeckSettings.fontSize.toFixed(1);
        newLimitValue.textContent = (currentDeckSettings.newPerDay ?? 0) > 0 ? currentDeckSettings.newPerDay : t('menu.unlimited');
        hintFlipPill.classList.toggle('hidden', currentDeckSettings.displayMode === 'dual');
        applyDisplayModeIcon();
        ttsLangBtn.textContent = (currentDeckSettings.ttsLang && currentDeckSettings.ttsLang !== 'auto') ? currentDeckSettings.ttsLang : t('tts.auto');
        populateCardTagFilters();
    }

    function populateCardTagFilters() {
        cardTagFilterContainer.innerHTML = '';
        const tags = [...new Set(currentFullDeck.flatMap(c => c.tags || []))].sort();
        if (tags.length === 0) {
            cardTagFilterContainer.innerHTML = `<p class="text-xs text-stone-400 pl-4 italic">${t('menu.no_tags')}</p>`;
            return;
        }
        tags.forEach(t => {
            const l = document.createElement('label');
            l.className = "flex items-center space-x-3 cursor-pointer py-2 px-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl";
            // v5.7.2：預設全部打勾（filterTags 空陣列 = 未篩選 = 全部顯示）
            const checked = currentDeckSettings.filterTags.length === 0 || currentDeckSettings.filterTags.includes(t) ? 'checked' : '';
            l.innerHTML = `<input type="checkbox" ${checked} value="${t}" class="w-5 h-5 rounded-lg border-stone-300 text-stone-900 focus:ring-teal-600"> <span class="text-sm font-bold text-stone-600 dark:text-stone-400">${t}</span>`;
            l.querySelector('input').onchange = () => {
                const checkedValues = Array.from(cardTagFilterContainer.querySelectorAll('input:checked')).map(i => i.value);
                // 全部勾選 = 回到未篩選（空陣列），避免無標籤卡被排除
                const allTags = tags;
                currentDeckSettings.filterTags = allTags.every(t => checkedValues.includes(t)) ? [] : checkedValues;
                const meta = deckList.find(d => d.id === currentDeckId);
                if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
                updateLearningDeck(); updateUI();
            };
            cardTagFilterContainer.appendChild(l);
        });
    }

    // v5.5.2：循環切換朗讀語言（自動 → zh-TW → en-US → ja-JP → ko-KR），並用當前卡示範發音
    function cycleTtsLang() {
        const cur = TTS_LANGS.indexOf(currentDeckSettings.ttsLang ?? 'auto');
        currentDeckSettings.ttsLang = TTS_LANGS[(cur + 1) % TTS_LANGS.length];
        const meta = deckList.find(d => d.id === currentDeckId);
        if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
        ttsLangBtn.textContent = currentDeckSettings.ttsLang !== 'auto' ? currentDeckSettings.ttsLang : t('tts.auto');
        const demo = (historyIndex >= 0 && historyIndex < history.length) ? currentFullDeck.find(c => c.card_id === history[historyIndex]) : null;
        if (demo) speakText(demo.fields[0]); // 切換即示範朗讀當前卡
    }

    // v5.4.0：切換顯示模式（翻面 <-> 雙面），立即重繪卡面
    // v5.7.1：顯示模式移至學習選單快速列（icon 按鈕），settings 內不再顯示
    function changeDisplayMode() {
        currentDeckSettings.displayMode = currentDeckSettings.displayMode === 'dual' ? 'combo' : 'dual';
        const meta = deckList.find(d => d.id === currentDeckId);
        if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
        applyDisplayModeIcon();
        hintFlipPill.classList.toggle('hidden', currentDeckSettings.displayMode === 'dual');
        displayCardStack();
    }

    function applyDisplayModeIcon() {
        const dual = currentDeckSettings.displayMode === 'dual';
        const icon = document.getElementById('display-mode-icon');
        if (icon) icon.textContent = dual ? 'visibility' : 'flip';
        displayModeBtn.setAttribute('aria-label', dual ? t('menu.mode_dual') : t('menu.mode_combo'));
        displayModeBtn.title = dual ? t('menu.mode_dual') : t('menu.mode_combo');
    }

    function changeDeckFontSize(step) {
        currentDeckSettings.fontSize = Math.min(Math.max(currentDeckSettings.fontSize + step, 1.0), 5.0);
        const meta = deckList.find(d => d.id === currentDeckId);
        if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
        fontSizeValue.textContent = currentDeckSettings.fontSize.toFixed(1);
        displayCardStack();
    }

    // v5.1.0：每日新卡上限調整（0 = 無上限，步進 5，上限 100），立即套用到學習佇列
    function changeNewPerDay(step) {
        currentDeckSettings.newPerDay = Math.min(Math.max((currentDeckSettings.newPerDay ?? 0) + step, 0), 100);
        const meta = deckList.find(d => d.id === currentDeckId);
        if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
        newLimitValue.textContent = currentDeckSettings.newPerDay > 0 ? currentDeckSettings.newPerDay : t('menu.unlimited');
        updateLearningDeck();
    }

    // v5.4.0：URL 分享編碼 —— 靜態資料（id/標題/卡片）→ 精簡 JSON → deflate-raw → base64url
    async function encodeDeckForUrl(deck) {
        const compact = { i: deck.id, t: deck.title, c: deck.cards.map(c => [c.card_id, c.fields, c.tags || [], c.notes || '']) };
        const buf = new TextEncoder().encode(JSON.stringify(compact));
        const stream = new Blob([buf]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
        const CHUNK = 0x8000;
        let bin = '';
        for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    // v5.4.0：URL 分享解碼 —— base64url → inflate → { id, title, cards }
    async function decodeDeckFromUrl(payload) {
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
        const bin = atob(padded);
        const bytes = Uint8Array.from(bin, ch => ch.charCodeAt(0));
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        const json = new TextDecoder().decode(await new Response(stream).arrayBuffer());
        const compact = JSON.parse(json);
        if (!compact || !Array.isArray(compact.c) || compact.c.length === 0) throw new Error('bad payload');
        return { id: compact.i, title: compact.t, cards: compact.c.map(([card_id, fields, tags, notes]) => ({ card_id, fields, tags, notes })) };
    }

    // v5.4.0：牌組設定 → 分享（v5.5.0 改為開啟 QR Modal）
    let currentShareUrl = '';
    async function openShareModal(id) {
        const cards = getDeckData(id);
        if (!cards) return;
        try {
            const payload = await encodeDeckForUrl({ id, title: deckList.find(d => d.id === id)?.title || id, cards });
            if (payload.length > 32768) { await appAlert(t('dlg.share_too_big'), t('share.title')); return; }
            currentShareUrl = location.href.split('#')[0] + '#d=' + payload;
            shareUrlBox.textContent = currentShareUrl;
            const shareTitle = deckList.find(d => d.id === id)?.title || id;
            shareDeckInfo.textContent = t('share.deck_info', { t: shareTitle, n: cards.length });

            // QR：qrcode-generator（QR 容量約 2300 bytes，過大或無 lib 時降級顯示提示）
            qrContainer.innerHTML = '';
            if (typeof qrcode === 'undefined') {
                qrContainer.innerHTML = `<span class="text-xs font-bold text-stone-400 px-4">${t('share.qr_unavailable')}</span>`;
            } else if (payload.length > 2300) {
                qrContainer.innerHTML = `<span class="text-xs font-bold text-stone-400 px-4">${t('share.qr_too_big')}</span>`;
            } else {
                const qr = qrcode(0, 'M');
                qr.addData(currentShareUrl);
                qr.make();
                const n = qr.getModuleCount();
                const quiet = 4;
                let rects = '';
                for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
                    if (qr.isDark(r, c)) rects += `<rect x="${c + quiet}" y="${r + quiet}" width="1" height="1"/>`;
                }
                qrContainer.innerHTML = `<svg viewBox="0 0 ${n + quiet * 2} ${n + quiet * 2}" width="180" height="180" shape-rendering="crispEdges" role="img" aria-label="${t('share.title')} QR"><rect width="${n + quiet * 2}" height="${n + quiet * 2}" fill="#ffffff"/><g fill="#171717">${rects}</g></svg>`;
            }
            shareModal.classList.remove('hidden');
            hideAllMenus();
            shareCopyBtn.focus();
        } catch (e) {
            await appAlert(t('dlg.share_invalid'), t('share.title'));
        }
    }

    // v5.4.0：載入時偵測 #d= 分享連結 → 確認後匯入（同 id 覆蓋、進度保留），完成即清除 hash
    async function handleSharedDeckUrl() {
        const m = location.hash.match(/[#&]d=([A-Za-z0-9\-_]+)/);
        if (!m) return;
        let deck = null;
        try { deck = await decodeDeckFromUrl(m[1]); } catch (e) { deck = null; }
        // 注意：須用 window.history——本閉包內的 `history` 是答題歷史陣列（遮蔽修正）
        window.history.replaceState(null, '', location.pathname + location.search);
        if (!deck || !deck.id || deck.cards.some(c => !c || typeof c.card_id !== 'string' || !Array.isArray(c.fields))) {
            appAlert(t('dlg.share_invalid'), t('do.share'));
            return;
        }
        const existing = deckList.find(x => x.id === deck.id);
        const ok = await appConfirm({
            title: t('dlg.share_title'),
            message: existing ? t('dlg.share_msg_overwrite', { t: deck.title, n: deck.cards.length }) : t('dlg.share_msg_new', { t: deck.title, n: deck.cards.length }),
            okText: t('dlg.share_ok'),
            danger: !!existing
        });
        if (!ok) return;
        if (existing) {
            saveDeckData(deck.id, deck.cards);
            existing.title = deck.title;
            existing.totalCards = deck.cards.length;
            saveDeckList();
            renderHomeScreen();
            await appAlert(t('dlg.share_imported', { t: deck.title }), t('do.share'));
        } else {
            processNewDeck(deck.cards, deck.id, deck.title);
        }
    }

    // v5.5.4：匯入格式規則（純文字版，供使用者複製）
    function buildFormatSpec() {
        if (I18N_LANG === 'en') {
            return `FlipDeck import format rules
===========================
[JSON (recommended)]
Top level is a flat array of card objects:
[{"card_id":"c1","fields":["front","back","notes (optional)"],"tags":["tag (optional)"]}]
- card_id: unique string within the deck
- fields[0]: front side (required, non-empty)
- fields[1]: back / translation
- fields[2+]: extra notes (rendered with line breaks)
- tags: string array, used for tag filtering
[TXT / CSV]
One card per line, fields separated by ";"; "//" inside a field means a line break.
front;back;notes
[Backup]
flipdeck_backup_*.json (from "Backup All") can be uploaded directly: same-id decks are overwritten (your progress is kept), new decks are added.`;
        }
        return `FlipDeck 匯入格式規則
===========================
【JSON（推薦）】
最外層為卡片物件陣列：
[{"card_id":"c1","fields":["正面","背面","補充(可選)"],"tags":["標籤(可選)"]}]
- card_id：牌組內唯一字串
- fields[0]：正面（必填、非空字串）
- fields[1]：背面／翻譯
- fields[2+]：補充說明（顯示時自動換行）
- tags：字串陣列，用於標籤篩選
【Markdown 表格】
| 單字 | 詞性 | 中文 |
| --- | --- | --- |
| apple | n. | 蘋果 |
- 第一欄＝正面；第二欄若全是詞性（n./v./phr.…），背面自動合併為「詞性 定義」並將詞性加入標籤
- 表頭列與「---」分隔列自動略過
【TXT / CSV】
每行一張卡，欄位以「;」分隔，欄位內以「//」表示換行：
正面;背面;補充
【備份檔】
flipdeck_backup_*.json（「全域備份」產生）可直接上傳還原；同 id 牌組覆蓋內容、保留你的學習進度。`;
    }

    // v5.5.4：給使用者 AI Agent 的現成提示詞——貼給 ChatGPT/Claude 等即可產生可匯入的 JSON
    function buildAgentPrompt() {
        if (I18N_LANG === 'en') {
            return `Please generate a FlipDeck deck and output ONLY a plain JSON array (no markdown code fences, no comments).
Format rules:
- Each card: {"card_id": "<unique id>", "fields": ["<front>", "<back>", "<extra note (optional)>"], "tags": ["<tag (optional)>"]}
- fields[0] is the front side (required, non-empty string); fields[1] is the back; fields[2+] are extra notes
- card_id must be unique within the whole file
- UTF-8 only
Topic: (describe what you want, e.g. "TOEIC 500 core words with phonetics and example sentences")`;
        }
        return `請幫我產生 FlipDeck 單字卡牌組，只輸出「純 JSON 陣列」（不要 markdown 程式碼區塊、不要註解）。
格式規則：
- 每張卡片：{"card_id": "<唯一ID>", "fields": ["<正面>", "<背面>", "<補充說明(可選)>"], "tags": ["<標籤(可選)>"]}
- fields[0] 為正面（必填、非空字串）；fields[1] 為背面；fields[2] 以後為補充說明
- card_id 在整份檔案內不可重複
- 全部使用 UTF-8
主題：（請填寫你要的主題，例如「多益 500 核心單字，含音標與中文例句」）`;
    }

    async function copyWithFeedback(btn, text) {
        const original = btn.textContent;
        btn.textContent = t('fg.copied'); // 立即回饋，複製非同步進行
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
            // fallback：建立暫態 textarea 選取複製
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        setTimeout(() => { btn.textContent = original; }, 1500);
    }

    // v5.6.0：直接貼上匯入——JSON / Markdown 表格 / TXT 自動分流
    const POS_RE = /^(?:n|v|vi|vt|adj|adv|phr|prep|conj|pron|abbr|num|art|aux|interj|det|modal)\.?$/i;

    function parsePastedContent(text, ts = Date.now()) {
        const s = (text || '').trim();
        if (!s) return { error: 'empty' };
        // JSON 路徑
        if (s.startsWith('[') || s.startsWith('{')) {
            let parsed;
            try { parsed = JSON.parse(s); } catch (e) { return { error: 'json' }; }
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Array.isArray(parsed.decks) && Array.isArray(parsed.deckList)) return { backup: parsed };
            if (!Array.isArray(parsed) || parsed.length === 0) return { error: 'shape' };
            const cards = [];
            for (let i = 0; i < parsed.length; i++) {
                const c = parsed[i];
                if (!c || typeof c !== 'object' || !Array.isArray(c.fields)) return { error: 'fields' };
                cards.push({
                    card_id: (typeof c.card_id === 'string' && c.card_id) ? c.card_id : `p_${ts}_${i}`,
                    fields: c.fields,
                    tags: Array.isArray(c.tags) ? c.tags : []
                });
            }
            return { cards };
        }
        const lines = s.split(/\r?\n/);
        // Markdown 表格路徑：任一行以 | 開頭
        if (lines.some(l => /^\s*\|/.test(l))) {
            const cards = parseMarkdownTable(lines, ts);
            return cards.length ? { cards, kind: 'md' } : { error: 'shape' };
        }
        // TXT / CSV 路徑
        const cards = lines.map((l, i) => ({
            card_id: `p_${ts}_${i}`,
            fields: l.split(';').map(x => x.trim().replace(/\/\//g, '<br>')),
            tags: []
        })).filter(c => c.fields[0]);
        return cards.length ? { cards } : { error: 'shape' };
    }

    // v5.6.0：Markdown 表格解析——乾淨表格直接對應；「救援模式」接合因換行遺失產生的碎片
    // 規則：每行細胞 3 個一組切卡；行內剩餘細胞（碎片）依序——
    //   1) 含「（）／，，」佔位的卡（正面序）優先各吃一個
    //   2) 尾端未完（；，、（）／）的卡（正面序）反向各吃一個
    //   3) 仍有剩餘 → 接到該行最後一張卡
    // 詞性欄合併：若所有列第 2 欄皆為詞性（n./v./phr.…），背面 =「詞性 定義」、詞性入標籤
    function parseMarkdownTable(lines, ts = Date.now()) {
        const isSepRow = cells => cells.length > 0 && cells.every(c => /^:?-{2,}:?$/.test(c) || c === '');
        const rows = [];
        let pending = null;
        lines.forEach(line => {
            if (!/^\s*\|/.test(line)) return;
            let cells = line.split('|').map(c => c.trim());
            if (cells.length && cells[0] === '') cells.shift();
            if (cells.length && cells[cells.length - 1] === '') cells.pop();
            if (cells.length === 0) return;
            if (isSepRow(cells)) { pending = null; return; } // 分隔列 → 前一行是表頭，丟棄
            if (pending) rows.push(pending);
            pending = { cells };
        });
        if (pending) rows.push(pending);

        const rowCards = []; // { cells: [w, c2, c3...], extras: [] }
        rows.forEach(({ cells }) => {
            // v5.6.0：詞性錨定掃描——cells[i+1] 是詞性（n./v./phr.…）才算真卡片，其餘細胞歸碎片。
            // 這能穿透「多行合併 + 尾部碎片」的亂序貼上；無任何詞性錨點的行（乾淨表格列）整行一張卡。
            const made = [];
            const frags = [];
            let i = 0;
            while (i < cells.length) {
                if (cells[i] && i + 1 < cells.length && POS_RE.test(cells[i + 1])) {
                    made.push({ cells: [cells[i], cells[i + 1], cells[i + 2] || ''], extras: [] });
                    i += 3;
                } else {
                    if (cells[i]) frags.push(cells[i]);
                    i++;
                }
            }
            if (made.length === 0) { made.push({ cells, extras: [] }); frags.length = 0; } // 無詞性錨點 → 乾淨表格列（細胞全在列內，碎片清空防倍增）
            if (frags.length && made.length) {
                const slotCount = c => ((c.cells[2] || '').match(/（/g) || []).length + ((c.cells[2] || '').match(/／/g) || []).length + ((c.cells[2] || '').match(/，，/g) || []).length;
                // 1) 佔位卡依序各吃一個，佔位多者續吃
                const slotCards = made.filter(c => slotCount(c) > 0);
                slotCards.forEach(c => { const f = frags.shift(); if (f !== undefined) c.extras.push(f); });
                slotCards.forEach(c => { for (let k = 1; k < slotCount(c) && frags.length; k++) c.extras.push(frags.shift()); });
                // 2) 尾端未完的卡反向接合（碎片順序對應卡片逆序）
                const unfinished = made.filter(c => /[；;，,、／/)）]$/.test((c.cells[2] || '') + c.extras.join('')));
                for (let k = 0; k < unfinished.length && frags.length; k++) unfinished[k].extras.push(frags.pop());
                // 3) 剩餘 → 該行最後一張卡
                if (frags.length) made[made.length - 1].extras.push(...frags.splice(0));
            }
            rowCards.push(...made);
        });

        const posCol = rowCards.length > 0 && rowCards.every(r => r.cells.length === 3 && POS_RE.test(r.cells[1]));
        const cards = rowCards.map((r, i) => {
            if (r.cells[0] === '') return null;
            if (posCol) {
                const pos = r.cells[1].replace(/\.$/, '');
                const def = (r.cells[2] + r.extras.join('')).trim();
                return { card_id: `p_${ts}_${i}`, fields: [r.cells[0], `${r.cells[1]} ${def}`.trim()], tags: [pos] };
            }
            return { card_id: `p_${ts}_${i}`, fields: [...r.cells, ...r.extras], tags: [] };
        }).filter(Boolean);
        return cards;
    }

    function showAllCardsView() { cardSearchInput.value = ''; allCardsModal.classList.remove('hidden'); hideAllMenus(); renderAllCardsTable(); cardSearchInput.focus(); }

    // v4.5.0 P7：從「顯示全部」跳至特定卡片（含已熟練卡，直接排到佇列最前）
    function jumpToCard(cardId) {
        if (!currentFullDeck.some(c => c.card_id === cardId)) return;
        upcomingQueue = upcomingQueue.filter(id => id !== cardId);
        upcomingQueue.unshift(cardId);
        hideUndoPill();
        history = []; historyIndex = -1;
        showNextCard('new_game');
    }

    // v4.4.0 P7：熟練度分布統計（學習中選單入口）
    function showStatsView() {
        statsModal.classList.remove('hidden'); hideAllMenus();
        closeStatsModalBtn.focus();
        const buckets = [1, 2, 3, 4, 5].map(lv => ({
            lv, count: currentFullDeck.filter(c => (currentCardStatus.get(c.card_id)?.mastery ?? 1) === lv).length
        }));
        const total = currentFullDeck.length;
        const mastered = buckets[4].count;
        const prog = calculateProgress(currentDeckId, currentFullDeck);
        const maxCount = Math.max(...buckets.map(b => b.count), 1);
        const now = Date.now();
        const dueNow = currentFullDeck.filter(c => {
            const st = currentCardStatus.get(c.card_id);
            return st && !st.suspended && (st.due ?? 0) <= now;
        }).length;
        const due7 = currentFullDeck.filter(c => {
            const st = currentCardStatus.get(c.card_id);
            return st && !st.suspended && (st.due ?? 0) > now && (st.due ?? 0) <= now + 7 * DAY_MS;
        }).length;
        const leechCount = currentFullDeck.filter(c => currentCardStatus.get(c.card_id)?.leech).length;
        const suspendedCount = currentFullDeck.filter(c => currentCardStatus.get(c.card_id)?.suspended).length;
        const forecast = buildForecast(currentFullDeck, currentCardStatus, now);
        const fcMax = Math.max(...forecast, 1);
        const bar = (count, label, color) => `
            <div>
                <div class="flex justify-between items-center mb-1.5">
                    <span class="text-xs font-bold text-stone-500 dark:text-stone-400">${label}</span>
                    <span class="text-xs font-black text-stone-400">${t('st.n_cards', { n: count })}</span>
                </div>
                <div class="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full ${color} transition-all duration-1000" style="width: ${(count / maxCount) * 100}%"></div>
                </div>
            </div>`;
        statsBody.innerHTML = `
            <div class="flex items-baseline justify-between">
                <span class="text-4xl font-black text-stone-900 dark:text-white">${prog}%</span>
                <span class="text-xs font-bold text-stone-400">${t('st.mastered', { m: mastered, t: total })}</span>
            </div>
            <div class="flex gap-2">
                <div class="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-2xl text-center">
                    <div class="text-lg font-black text-teal-700 dark:text-teal-300">${dueNow}</div>
                    <div class="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">${t('st.due_today')}</div>
                </div>
                <div class="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-2xl text-center">
                    <div class="text-lg font-black text-teal-700 dark:text-teal-300">${due7}</div>
                    <div class="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">${t('st.due_7')}</div>
                </div>
            </div>
            <div class="pt-2 space-y-3">
                ${bar(buckets[0].count, t('st.lv1'), 'bg-stone-300 dark:bg-stone-600')}
                ${bar(buckets[1].count, t('st.lv2'), 'bg-stone-400 dark:bg-stone-500')}
                ${bar(buckets[2].count, t('st.lv3'), 'bg-stone-500 dark:bg-stone-400')}
                ${bar(buckets[3].count, t('st.lv4'), 'bg-stone-700 dark:bg-stone-300')}
                ${bar(buckets[4].count, t('st.lv5'), 'bg-teal-600 dark:bg-teal-400')}
            </div>
            <div class="pt-2">
                <div class="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">${t('st.forecast')}</div>
                <div class="flex items-end gap-[2px] h-14">
                    ${forecast.map((n, i) => `<div class="flex-1 ${n > 0 ? 'bg-stone-400 dark:bg-stone-500' : 'bg-stone-200 dark:bg-stone-800'} rounded-t-[2px]" style="height: ${n > 0 ? Math.max(n / fcMax * 100, 8) : 4}%" title="${i === 0 ? t('st.today') : i === 30 ? t('st.over30') : t('st.day_n', { n: i })}：${n}"></div>`).join('')}
                </div>
                <div class="flex justify-between text-[9px] text-stone-400 font-bold mt-1"><span>${t('st.today')}</span><span>${t('st.after30')}</span></div>
            </div>
            ${leechCount || suspendedCount ? `<p class="text-[10px] text-stone-500 dark:text-stone-400 font-bold text-center">${t('st.leech_suspended', { l: leechCount, s: suspendedCount })}</p>` : ''}
            <p class="text-[10px] text-stone-400 font-bold text-center pt-1">${t('st.rule')}</p>
        `;
    }
    // v5.7.3：詳細模式（預設清爽——只顯示正面/背面/操作；開啟後追加 ID/熟練度/補充/標籤）
    let allCardsDetail = false;

    function renderAllCardsTable() {
        const q = cardSearchInput.value.toLowerCase().trim();
        const detail = allCardsDetail;

        // 表頭
        let html = '<thead><tr class="text-stone-400 text-[10px] uppercase tracking-widest">';
        html += `<th class="p-4">${t('ac.actions')}</th>`;
        html += `<th class="p-4">${t('ac.col_front')}</th>`;
        html += `<th class="p-4">${t('ac.col_back')}</th>`;
        if (detail) {
            const extras = Math.max((currentFullDeck[0]?.fields.length || 2) - 2, 0);
            for (let i = 0; i < extras; i++) html += `<th class="p-4">${t('ac.col_field')} ${i + 3}</th>`;
            html += `<th class="p-4">${t('ac.col_mastery')}</th>`;
            html += `<th class="p-4">${t('ac.col_tags')}</th>`;
        }
        html += '</tr></thead><tbody>';

        currentFullDeck.filter(c => !q || c.fields.some(f => f.toLowerCase().includes(q)) || (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))).forEach(c => {
            const st = currentCardStatus.get(c.card_id);
            const m = st?.mastery ?? 1;
            const isSuspended = !!st?.suspended;
            const isLeech = !!st?.leech;
            html += `<tr class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${isSuspended ? 'opacity-40' : ''}">`;
            // 操作欄
            html += `<td class="p-4"><div class="flex items-center gap-1">
                <button class="jump-to-card-btn p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-full transition-colors" data-id="${c.card_id}" aria-label="${t('aria.jump')}" title="${t('aria.jump')}"><span class="material-symbols-outlined !text-sm">my_location</span></button>
                <button class="suspend-btn p-1 ${isSuspended ? 'text-stone-900 dark:text-white' : 'text-stone-400'} hover:text-stone-900 dark:hover:text-white rounded-full transition-colors" data-id="${c.card_id}" aria-label="${isSuspended ? t('aria.unsuspend') : t('aria.suspend')}" title="${isSuspended ? t('aria.unsuspend') : t('aria.suspend')}"><span class="material-symbols-outlined !text-sm">${isSuspended ? 'play_arrow' : 'pause'}</span></button>
                ${isLeech && detail ? `<span class="material-symbols-outlined !text-sm text-red-400" title="${t('aria.leech')}" aria-label="${t('aria.leech')}">bug</span>` : ''}
            </div></td>`;
            // 正面 / 背面（永遠顯示）
            html += `<td class="p-4 text-stone-900 dark:text-white font-bold">${c.fields[0] || ''}</td>`;
            html += `<td class="p-4 text-stone-600 dark:text-stone-400 font-medium">${c.fields[1] || ''}</td>`;
            if (detail) {
                // 補充欄位
                c.fields.slice(2).forEach(f => html += `<td class="p-4 text-stone-400 font-medium">${f.replace(/<br>/g, ' ')}</td>`);
                // 熟練度 + ID
                html += `<td class="p-4"><div class="flex space-x-0.5 mb-1">${Array.from({length:5}, (_,idx)=>`<div class="w-1.5 h-1.5 rounded-full ${idx<m?'bg-teal-600 dark:bg-teal-400':'bg-stone-200 dark:bg-stone-700'}"></div>`).join('')}</div><div class="text-[9px] font-mono text-stone-400">${c.card_id}</div></td>`;
                // 標籤
                html += `<td class="p-4"><div class="flex flex-wrap gap-1">${(c.tags || []).map(t => `<span class="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[10px] font-bold">${t}</span>`).join('')}</div></td>`;
            }
            html += '</tr>';
        });
        allCardsTable.innerHTML = html + '</tbody>';
    }

    // --- 其餘 Modal 邏輯 (修復實作) ---
    function openDeckOptions(id) {
        const d = deckList.find(x => x.id === id); if (!d) return;
        deckOptionsModal.classList.remove('hidden');
        deckOptionsTitle.textContent = t('do.title');
        deckTitleInput.value = d.title;
        // v5.7.0：不自動 focus（避免行動端直接跳出鍵盤）
        saveDeckOptionsBtn.onclick = () => {
            d.title = deckTitleInput.value; saveDeckList();
            deckOptionsModal.classList.add('hidden'); renderHomeScreen();
        };
        const deckOptionsShareBtn = document.getElementById('deck-options-share-btn');
        if (deckOptionsShareBtn) deckOptionsShareBtn.onclick = () => {
            deckOptionsModal.classList.add('hidden');
            openShareModal(id);
        };
        const deckOptionsJsonBtn = document.getElementById('deck-options-json-btn');
        if (deckOptionsJsonBtn) deckOptionsJsonBtn.onclick = () => {
            deckOptionsModal.classList.add('hidden');
            openEditDeckModal(id);
        };
        deleteDeckBtn.onclick = async () => {
            const ok = await appConfirm({
                title: t('dlg.delete_title'),
                message: t('dlg.delete_msg', { t: d.title }),
                okText: t('dlg.delete'),
                danger: true
            });
            if (!ok) return;
            deckList = deckList.filter(x => x.id !== id);
            localStorage.removeItem(STORAGE_KEYS.DECK_DATA_PREFIX + id);
            localStorage.removeItem(STORAGE_KEYS.DECK_STATE_PREFIX + id);
            saveDeckList(); deckOptionsModal.classList.add('hidden'); renderHomeScreen();
        };
    }

    // v4.1.5: 明確傳入 deckId，只在使用中牌組 (= currentDeckId) 時同步 session，
    // 否則只寫入 localStorage —— 修正從首頁選項開 JSON 編輯器造成的跨牌組混存與 TypeError
    function openEditDeckModal(deckId = currentDeckId) {
        const data = getDeckData(deckId);
        if (!data) return;
        editDeckModal.classList.remove('hidden');
        jsonEditorTextarea.value = JSON.stringify(data, null, 2);
        jsonEditorTextarea.focus();
        saveEditDeckBtn.onclick = async () => {
            try {
                const updated = JSON.parse(jsonEditorTextarea.value);
                // 儲存前驗證形狀，避免壞資料寫入後弄壞學習畫面
                const valid = Array.isArray(updated) && updated.length > 0
                    && updated.every(c => c && typeof c.card_id === 'string' && Array.isArray(c.fields));
                if (!valid) { await appAlert(t('dlg.json_shape'), t('dlg.json_shape_t')); return; }
                saveDeckData(deckId, updated);
                const meta = deckList.find(x => x.id === deckId);
                if (meta) { meta.totalCards = updated.length; saveDeckList(); }
                editDeckModal.classList.add('hidden');
                renderHomeScreen();
                if (deckId === currentDeckId && currentFullDeck.length > 0) {
                    currentFullDeck = updated;
                    hideUndoPill();
                    resetSessionView();
                }
                if (!allCardsModal.classList.contains('hidden')) renderAllCardsTable();
            } catch (e) { await appAlert(t('dlg.json_error'), t('dlg.json_error_t')); }
        };
    }

    // [v4.1.3] 圖形化編輯器 (F14)；v4.1.5 修正存檔同步；v4.3.0 P5：分頁 + 搜尋 + 陣列工作副本
    // v5.6.0：prefill 參數——貼上解析結果可直接進編輯器預覽（救援碎片在此修正）
    function openDeckEditor(id = null, prefill = null) {
        const isNew = !id;
        const data = isNew ? (prefill && prefill.length ? prefill : [{ card_id: `c_${Date.now()}_0`, fields: ["", "", ""], tags: [] }]) : getDeckData(id);
        if (!data) return;

        // 工作副本：陣列為唯一資料來源，分頁後只有當頁存在於 DOM，輸入即時寫回（6498 張也不再卡）
        const workingCards = data.map(c => ({
            card_id: c.card_id,
            fields: [c.fields[0] || '', c.fields[1] || '', c.fields.slice(2).join('; ')],
            tags: (c.tags || []).join(', '),
            notes: c.notes || ''
        }));
        const deletedIds = new Set();
        const selectedIdx = new Set();
        const PAGE_SIZE = 100;
        let editorPage = 0, editorDirty = false, lastView = [];

        deckEditorModal.classList.remove('hidden');
        editorDeckTitle.textContent = isNew ? t('ed.new_title') : (deckList.find(d => d.id === id)?.title || t('ed.edit_title'));
        editorSearchInput.value = '';
        editorBulkTagInput.value = '';
        renderEditorPage();

        editorSearchInput.oninput = () => { editorPage = 0; renderEditorPage(); };
        editorPrevPageBtn.onclick = () => { if (editorPage > 0) { editorPage--; renderEditorPage(); } };
        editorNextPageBtn.onclick = () => { editorPage++; renderEditorPage(); };

        // v4.5.0 P7：批次標籤操作
        editorSelectAllPage.onchange = () => {
            const pageIdxs = lastView.slice(editorPage * PAGE_SIZE, (editorPage + 1) * PAGE_SIZE).map(v => v.i);
            pageIdxs.forEach(i => editorSelectAllPage.checked ? selectedIdx.add(i) : selectedIdx.delete(i));
            renderEditorPage(true);
        };
        editorBulkAddBtn.onclick = () => applyEditorBatch('add');
        editorBulkRemoveBtn.onclick = () => applyEditorBatch('remove');
        editorBulkClearBtn.onclick = () => { selectedIdx.clear(); renderEditorPage(true); };

        function applyEditorBatch(action) {
            const idxs = [...selectedIdx].filter(i => workingCards[i] && !deletedIds.has(workingCards[i].card_id));
            const touched = applyTagsToCards(workingCards, idxs, editorBulkTagInput.value, action);
            if (touched === 0) { editorBulkTagInput.focus(); return; }
            editorDirty = true;
            editorBulkTagInput.value = '';
            renderEditorPage(true);
        };

        editorAddRowBtn.onclick = () => {
            workingCards.push({ card_id: `c_${Date.now()}_${workingCards.length}`, fields: ['', '', ''], tags: '', notes: '' });
            editorDirty = true;
            editorSearchInput.value = '';
            editorPage = Math.floor((workingCards.length - 1) / PAGE_SIZE);
            renderEditorPage();
            editorRowsContainer.scrollTo({ top: editorRowsContainer.scrollHeight, behavior: 'smooth' });
        };

        editorSaveBtn.onclick = async () => {
            const newRows = serializeEditorRows(workingCards.filter(c => !deletedIds.has(c.card_id)));
            if (newRows.length === 0) { await appAlert(t('dlg.empty_deck'), t('dlg.empty_deck_t')); return; }

            if (isNew) {
                processNewDeck(newRows, `d_${Date.now()}`, t('ed.untitled'));
            } else {
                saveDeckData(id, newRows);
                const meta = deckList.find(d => d.id === id);
                if (meta) { meta.totalCards = newRows.length; saveDeckList(); }
                // 只有編輯「使用中」的牌組才同步 session，並重置瀏覽佇列避免指向已刪除的卡片
                if (id === currentDeckId && currentFullDeck.length > 0) {
                    currentFullDeck = newRows;
                    hideUndoPill();
                    resetSessionView();
                }
            }
            editorDirty = false;
            editorConfirmClose = null;
            deckEditorModal.classList.add('hidden');
            renderHomeScreen();
        };

        // v4.3.0：有未儲存變更時，離開前先確認（含 Escape 路徑）
        const tryCloseEditor = () => {
            if (!editorDirty) { editorConfirmClose = null; deckEditorModal.classList.add('hidden'); return; }
            appConfirm({
                title: t('dlg.discard_title'),
                message: t('dlg.discard_msg'),
                okText: t('dlg.discard_ok'),
                danger: true
            }).then(ok => { if (ok) { editorDirty = false; editorConfirmClose = null; deckEditorModal.classList.add('hidden'); } });
        };
        editorCancelBtn.onclick = tryCloseEditor;
        closeDeckEditorModalBtn.onclick = tryCloseEditor;
        editorConfirmClose = tryCloseEditor;

        // --- 分頁渲染（閉包持有工作副本） ---
        function renderEditorPage(keepScroll = false) {
            const prevScroll = editorRowsContainer.scrollTop;
            editorRowsContainer.innerHTML = '';
            const q = editorSearchInput.value.toLowerCase().trim();
            const view = workingCards
                .map((c, i) => ({ c, i }))
                .filter(({ c }) => !deletedIds.has(c.card_id) &&
                    (!q || (c.fields[0] || '').toLowerCase().includes(q) || (c.fields[1] || '').toLowerCase().includes(q)));
            lastView = view;
            const totalPages = Math.max(1, Math.ceil(view.length / PAGE_SIZE));
            editorPage = Math.min(Math.max(editorPage, 0), totalPages - 1);

            const slice = view.slice(editorPage * PAGE_SIZE, (editorPage + 1) * PAGE_SIZE);
            if (slice.length === 0) {
                editorRowsContainer.innerHTML = `<p class="text-center text-stone-400 py-12 text-sm font-bold">${t('ed.no_match')}</p>`;
            } else {
                slice.forEach(({ c, i }) => renderEditorRow(c, i));
            }
            if (keepScroll) editorRowsContainer.scrollTop = prevScroll;

            const liveCount = workingCards.length - deletedIds.size;
            editorStatusMsg.textContent = q ? t('ed.count_match', { n: liveCount, m: view.length }) : t('ed.count', { n: liveCount });
            editorPageIndicator.textContent = `${editorPage + 1} / ${totalPages}`;
            editorPrevPageBtn.disabled = editorPage === 0;
            editorNextPageBtn.disabled = editorPage >= totalPages - 1;

            // 批次列狀態同步
            const pageIdxs = slice.map(v => v.i);
            editorSelectAllPage.checked = pageIdxs.length > 0 && pageIdxs.every(i => selectedIdx.has(i));
            const n = selectedIdx.size;
            editorBulkBar.classList.toggle('hidden', n === 0);
            editorSelectedCount.textContent = n > 0 ? t('ed.selected', { n }) : '';
        }

        function renderEditorRow(card, globalIndex) {
            const row = document.createElement('div');
            row.dataset.id = card.card_id;
            row.className = "p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 flex flex-col gap-3 group animate-in slide-in-from-bottom-2 duration-300";
            row.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" class="row-select-box w-4 h-4 accent-stone-900" aria-label="${t('aria.select_card')}" ${selectedIdx.has(globalIndex) ? 'checked' : ''}>
                        <span class="text-[10px] font-black text-stone-300 uppercase tracking-widest">${t('ed.card_n', { n: globalIndex + 1 })}</span>
                    </div>
                    <button class="delete-row-btn p-1 text-stone-300 hover:text-red-500 transition-colors" aria-label="${t('aria.delete_card')}">
                        <span class="material-symbols-outlined !text-sm">delete</span>
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="${t('ed.front_ph')}" value="${escapeAttr(card.fields[0] || '')}" class="px-4 py-2 bg-white dark:bg-stone-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-600 font-bold">
                    <input type="text" placeholder="${t('ed.back_ph')}" value="${escapeAttr(card.fields[1] || '')}" class="px-4 py-2 bg-white dark:bg-stone-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-600">
                </div>
                <div class="flex flex-col gap-2">
                    <input type="text" placeholder="${t('ed.notes_ph')}" value="${escapeAttr(card.fields[2] || '')}" class="px-4 py-2 bg-white dark:bg-stone-900 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-600 opacity-60">
                    <input type="text" placeholder="${t('ed.tags_ph')}" value="${escapeAttr(card.tags)}" class="tag-input px-4 py-2 bg-white dark:bg-stone-900 border-none rounded-xl text-[10px] font-mono outline-none focus:ring-2 focus:ring-teal-600 text-stone-400">
                </div>
            `;
            const inputs = row.querySelectorAll('input[type="text"]');
            inputs[0].oninput = () => { card.fields[0] = inputs[0].value; editorDirty = true; };
            inputs[1].oninput = () => { card.fields[1] = inputs[1].value; editorDirty = true; };
            inputs[2].oninput = () => { card.fields[2] = inputs[2].value; editorDirty = true; };
            inputs[3].oninput = () => { card.tags = inputs[3].value; editorDirty = true; };
            row.querySelector('.row-select-box').onchange = (e) => {
                if (e.target.checked) selectedIdx.add(globalIndex);
                else selectedIdx.delete(globalIndex);
                const n = selectedIdx.size;
                editorBulkBar.classList.toggle('hidden', n === 0);
                editorSelectedCount.textContent = n > 0 ? t('ed.selected', { n }) : '';
            };
            row.querySelector('.delete-row-btn').onclick = () => {
                deletedIds.add(card.card_id);
                editorDirty = true;
                row.classList.add('scale-95', 'opacity-0');
                setTimeout(() => renderEditorPage(true), 200);
            };
            editorRowsContainer.appendChild(row);
        }
    }

    // v4.3.0：序列化編輯器工作副本 → 存檔格式（正面必填過濾、修剪、標籤解析）
    function serializeEditorRows(rows) {
        return rows.filter(c => (c.fields[0] || '').trim()).map(c => ({
            card_id: c.card_id,
            fields: [c.fields[0].trim(), (c.fields[1] || '').trim(), (c.fields[2] || '').trim()],
            tags: (c.tags || '').split(',').map(t => t.trim()).filter(t => t),
            notes: c.notes || ''
        }));
    }

    // v4.5.0 P7：批次標籤運算（純函式：加入=聯集去重、移除=差集）
    function applyTagsToCards(cards, indices, tagsStr, action) {
        const tags = (tagsStr || '').split(',').map(t => t.trim()).filter(Boolean);
        if (tags.length === 0) return 0;
        let touched = 0;
        indices.forEach(i => {
            const c = cards[i];
            if (!c) return;
            const cur = (c.tags || '').split(',').map(t => t.trim()).filter(Boolean);
            c.tags = (action === 'add'
                ? [...new Set([...cur, ...tags])]
                : cur.filter(t => !tags.includes(t))).join(', ');
            touched++;
        });
        return touched;
    }

    // HTML 屬性跳脫：欄位含雙引號/角括號時不再破壞 input 標記
    function escapeAttr(s) {
        return String(s ?? '')
            .replace(/&/g, '&' + 'amp;')
            .replace(/"/g, '&' + 'quot;')
            .replace(/</g, '&' + 'lt;')
            .replace(/>/g, '&' + 'gt;');
    }

    function backupAllData() {
        const data = {
            deckList, allTags,
            decks: deckList.map(d => ({ id: d.id, data: getDeckData(d.id), state: Object.fromEntries(getDeckState(d.id)) }))
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `flipdeck_backup_${Date.now()}.json`;
        a.click(); URL.revokeObjectURL(url);
    }

    function downloadData(fmt) {
        const data = getDeckData(currentDeckId);
        if (!data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `deck_${currentDeckId}.json`;
        a.click(); URL.revokeObjectURL(url);
    }

    function displayEndOfDeck() {
        // v5：顯示下次到期資訊；v5.1：新卡額度用完時改提示明日繼續
        const now = Date.now();
        const futureDues = currentFullDeck.filter(matchesDeckFilter)
            .map(c => currentCardStatus.get(c.card_id)?.due ?? 0)
            .filter(d => d > now);
        const remainingNew = currentFullDeck.filter(c => {
            if (!matchesDeckFilter(c)) return false;
            const st = currentCardStatus.get(c.card_id);
            return st && !st.suspended && (st.reps ?? 0) === 0 && (st.due ?? 0) === 0;
        }).length;
        const note = remainingNew > 0
            ? t('learn.daily_used', { n: remainingNew })
            : (futureDues.length
                ? t('learn.next_due', { t: fmtDue(Math.min(...futureDues)), n: futureDues.length })
                : t('learn.none_scheduled'));
        cardStackContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div class="w-24 h-24 bg-teal-600 dark:bg-teal-400 text-white dark:text-stone-950 rounded-full flex items-center justify-center shadow-2xl">
                    <span class="material-symbols-outlined !text-5xl">celebration</span>
                </div>
                <div>
                    <h3 class="text-3xl font-black mb-2 text-stone-900 dark:text-white">${t('learn.congrats')}</h3>
                    <p class="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-xs">${t('learn.done_all')}</p>
                    <p class="text-stone-400 dark:text-stone-500 font-bold text-[10px] uppercase tracking-widest mt-2">${note}</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button id="restart-round-btn" class="px-8 py-3.5 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all">${t('learn.restart')}</button>
                    <button id="back-to-home-btn" class="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-stone-950 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">${t('learn.back_home')}</button>
                </div>
            </div>
        `;
        const backHomeBtn = cardStackContainer.querySelector('#back-to-home-btn');
        if (backHomeBtn) backHomeBtn.onclick = () => backToHomeScreen();
        const restartBtn = cardStackContainer.querySelector('#restart-round-btn');
        if (restartBtn) restartBtn.onclick = restartDeckRound;
    }

    // v5.0.0：相對時間格式（完成畫面顯示下次到期）
    function fmtDue(ts) {
        const diff = ts - Date.now();
        if (diff <= 0) return t('fmt.now');
        const mins = Math.ceil(diff / 60000);
        if (mins < 60) return t('fmt.min', { n: mins });
        const hours = Math.round(mins / 60);
        if (hours < 24) return t('fmt.hour', { n: hours });
        return t('fmt.day', { n: Math.round(hours / 24) });
    }

    // v4.3.0 P7：完成後直接再讀一輪 —— 只重置「目前篩選下」的卡片熟練度
    function restartDeckRound() {
        const targets = currentFullDeck.filter(matchesDeckFilter);
        if (targets.length === 0) return;
        appConfirm({
            title: t('dlg.restart_title'),
            message: t('dlg.restart_msg', { n: targets.length }),
            okText: t('dlg.restart_ok'),
            danger: true
        }).then(ok => {
            if (!ok) return;
            targets.forEach(c => {
                const st = currentCardStatus.get(c.card_id);
                if (st) Object.assign(st, { mastery: 1, lastTime: Date.now(), ef: 2.5, reps: 0, interval: 0, due: 0, lapses: 0, leech: false });
            });
            saveDeckState(currentDeckId, currentCardStatus);
            startGame(currentDeckId);
        });
    }

    initializeApp();
});
