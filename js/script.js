// ===== PWA Service Worker 註冊 =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW 註冊成功'))
            .catch(err => console.log('SW 註冊失敗'));
    });
}

// ===== FlipDeck v4.3.0 =====
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
    const homeMenuHomeBtn = document.getElementById('home-menu-home-btn');
    const homeMenuAddBtn = document.getElementById('home-menu-add-btn');
    const createNewDeckBtn = document.getElementById('create-new-deck-btn');
    const homeMenuFullscreenBtn = document.getElementById('home-menu-fullscreen-btn');
    const homeMenuCloseBtn = document.getElementById('home-menu-close-btn');
    const backupAllBtn = document.getElementById('backup-all-btn');
    const showHowToUseBtn = document.getElementById('show-how-to-use-btn');
    
    const menuBtn = document.getElementById('menu-btn'); 
    const menuPanel = document.getElementById('menu-panel'); 
    const deckMenuHomeBtn = document.getElementById('deck-menu-home-btn');
    const deckMenuAddBtn = document.getElementById('deck-menu-add-btn');
    const deckMenuDownloadBtn = document.getElementById('deck-menu-download-btn');
    const deckMenuCloseBtn = document.getElementById('deck-menu-close-btn');
    const showAllBtn = document.getElementById('show-all-btn');
    const visualEditDeckBtn = document.getElementById('visual-edit-deck-btn');
    const editDeckBtn = document.getElementById('edit-deck-btn');
    const cardTagFilterContainer = document.getElementById('card-tag-filter-container');
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    const fontSizeValue = document.getElementById('font-size-value');
    
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
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingMsg = document.getElementById('loading-msg');

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
        { name: "高中 6000 單字", file: "hs_6000.json" },
        { name: "動詞三態", file: "verbs.json" },
        { name: "元素週期表", file: "elements.json" },
        { name: "國家與首都", file: "capitals.json" }
    ];

    let deckList = [], allTags = [], currentFilter = { sortBy: 'lastOpened' };
    let currentDeckId = null, currentFullDeck = [], currentLearningDeck = [], upcomingQueue = [];
    let currentCardStatus = new Map(), currentDeckSettings = {}, history = [], historyIndex = -1;
    let uxFlags = {}, lastAction = null, undoTimer = null, confirmResolveFn = null;
    let editorConfirmClose = null;

    const DEFAULT_DECK_SETTINGS = { fontSize: 2.5, filterTags: [] };
    const MAX_HISTORY = 50;
    const RECENT_SKIP = 8; // v4.3.0 P5：排隊時排除最近 N 張已作答卡片，避免立即回鍋

    // =================================================================
    // ===== 核心儲存邏輯 =====
    // =================================================================

    function initializeApp() {
        const savedDecks = localStorage.getItem(STORAGE_KEYS.DECK_LIST);
        deckList = savedDecks ? JSON.parse(savedDecks) : [];
        const savedTags = localStorage.getItem(STORAGE_KEYS.ALL_TAGS);
        allTags = savedTags ? JSON.parse(savedTags) : [];
        try { uxFlags = JSON.parse(localStorage.getItem(STORAGE_KEYS.UX_FLAGS)) || {}; } catch (e) { uxFlags = {}; }
        
        populateExampleSelector();
        renderHomeScreen();
        bindEventListeners();
    }

    function saveUXFlags() { localStorage.setItem(STORAGE_KEYS.UX_FLAGS, JSON.stringify(uxFlags)); }

    // v4.2.0 P4：通用 in-app 對話框，回傳 Promise (appAlert = 僅確定鈕版本)
    function appConfirm({ title = '確認動作', message = '', okText = '確定', cancelText = '取消', showCancel = true, danger = false } = {}) {
        return new Promise(resolve => {
            confirmModalTitle.textContent = title;
            confirmModalMessage.textContent = message;
            confirmModalOkBtn.textContent = okText;
            confirmModalCancelBtn.textContent = cancelText;
            confirmModalCancelBtn.classList.toggle('hidden', !showCancel);
            confirmModalOkBtn.className = "flex-1 py-3.5 font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all " +
                (danger ? "bg-red-500 text-white" : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900");
            confirmResolveFn = (v) => { confirmResolveFn = null; appConfirmModal.classList.add('hidden'); resolve(v); };
            appConfirmModal.classList.remove('hidden');
            confirmModalOkBtn.onclick = () => confirmResolveFn?.(true);
            confirmModalCancelBtn.onclick = () => confirmResolveFn?.(false);
        });
    }
    function appAlert(message, title = '提示') { return appConfirm({ title, message, showCancel: false, okText: '知道了' }); }

    // v4.2.0 P2：首次互動後收起提示列並記住
    function markFirstInteraction() {
        if (!uxFlags.hinted) { uxFlags.hinted = true; saveUXFlags(); swipeHintBar.classList.add('hidden'); }
    }

    // v4.3.0 P5：大牌組匯入/載入期間的 loading 狀態
    function showLoading(msg = '載入中…') { loadingMsg.textContent = msg; loadingOverlay.classList.remove('hidden'); }
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
            opt.value = ex.file; opt.textContent = ex.name;
            exampleSelector.appendChild(opt);
        });
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
        deckData.forEach(c => {
            const v = currentCardStatus.get(c.card_id);
            if (!v || typeof v !== 'object') {
                currentCardStatus.set(c.card_id, { mastery: 1, lastTime: Date.now() });
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
        const filtered = currentDeckSettings.filterTags?.length > 0 ? currentFullDeck.filter(matchesDeckFilter) : currentFullDeck;
        currentLearningDeck = filtered.filter(c => (currentCardStatus.get(c.card_id)?.mastery ?? 1) < 5);
        currentLearningDeck.sort((a, b) => {
            const mA = currentCardStatus.get(a.card_id)?.mastery ?? 1, mB = currentCardStatus.get(b.card_id)?.mastery ?? 1;
            return mA !== mB ? mA - mB : Math.random() - 0.5;
        });
    }

    // v4.3.0：目前篩選條件判斷（updateLearningDeck 與「再讀一輪」共用）
    function matchesDeckFilter(card) {
        const f = currentDeckSettings.filterTags;
        if (!f || f.length === 0) return true;
        const ts = card.tags || [];
        return f.some(t => t === 'untagged' ? ts.length === 0 : ts.includes(t));
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
        // v4.2.0 P3：記錄本次判定，供 undo 膠囊回復
        const isJudgment = action === 'correct' || action === 'incorrect' || action === 'skip';
        const prevId = (historyIndex >= 0 && historyIndex < history.length) ? history[historyIndex] : null;
        const prevState = prevId != null ? currentCardStatus.get(prevId) : null;
        const prevMastery = prevState ? prevState.mastery : null;

        if (isJudgment) markFirstInteraction();

        if (historyIndex >= 0 && historyIndex < history.length) {
            const id = history[historyIndex], state = currentCardStatus.get(id);
            if (state) {
                if (action === 'correct') {
                    state.mastery = Math.min(state.mastery + 1, 5);
                    if (state.mastery === 5) updateLearningDeck();
                } else if (action === 'incorrect') {
                    state.mastery = 1;
                }
                state.lastTime = Date.now();
                currentCardStatus.set(id, state);
            }
        }

        if (isJudgment && prevId != null) {
            lastAction = { cardId: prevId, prevMastery: action === 'skip' ? null : prevMastery, nextId: null };
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
        const { cardId, prevMastery, nextId } = lastAction;
        if (prevMastery !== null && prevMastery !== undefined) {
            const st = currentCardStatus.get(cardId);
            if (st) { st.mastery = prevMastery; st.lastTime = Date.now(); currentCardStatus.set(cardId, st); }
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
                cardEl.innerHTML = `
                    <div id="stamp-forgot" class="stamp"><span class="material-symbols-outlined !text-5xl">close</span></div>
                    <div id="stamp-learned" class="stamp"><span class="material-symbols-outlined !text-5xl">check</span></div>
                    <div class="card-inner">
                        <div class="absolute inset-0 backface-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm flex items-center justify-center p-8 overflow-hidden">
                            <div class="card-content text-center text-neutral-900 dark:text-neutral-100 font-bold break-words w-full" style="font-size: ${currentDeckSettings.fontSize}rem">${data.fields[0]}</div>
                            <span class="absolute bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-neutral-300 font-bold pointer-events-none select-none">Tap to flip</span>
                        </div>
                        <div class="absolute inset-0 backface-hidden rotate-y-180 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                            <div class="card-content font-bold mb-4 break-words w-full" style="font-size: ${currentDeckSettings.fontSize * 0.8}rem">${data.fields[1] || ''}</div>
                            <div class="text-neutral-400 dark:text-neutral-500 text-sm leading-relaxed overflow-y-auto max-h-full w-full">${data.fields.slice(2).join('<br>')}</div>
                        </div>
                    </div>
                `;
                cardStackContainer.appendChild(cardEl);
                initComboLogic(cardEl);
            } else {
                cardEl.innerHTML = `<div class="w-full h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl flex items-center justify-center p-8"><div class="text-neutral-200 dark:text-neutral-800 font-bold truncate w-full text-center" style="font-size: ${currentDeckSettings.fontSize}rem">${data.fields[0]}</div></div>`;
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
            // v4.2.0 P3：上滑跳過（位移 > 80px 或快速上甩）
            if (dragY < -80 || (velocityY < -0.7 && dragY < -20)) {
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = `translateY(-1000px) rotate(0deg)`;
                card.style.opacity = '0';
                bgForgot.style.opacity = bgLearned.style.opacity = 0;
                setTimeout(() => showNextCard('skip'), 250);
                return;
            }
            if (Math.abs(velocity) > 0.5 || Math.abs(dragX) > 100) {
                const dir = dragX > 0 ? 1 : -1;
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.transform = `translateX(${dir * 1000}px) rotate(${dir * 45}deg)`;
                card.style.opacity = '0';
                bgForgot.style.opacity = bgLearned.style.opacity = 0;
                setTimeout(() => showNextCard(dir > 0 ? 'correct' : 'incorrect'), 250);
            } else {
                card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = `translateX(0px) rotate(0deg)`;
                sForgot.style.opacity = sLearned.style.opacity = bgForgot.style.opacity = bgLearned.style.opacity = 0;
                if (Math.abs(dragX) < 10 && Math.abs(dragY) < 10 && (Date.now() - startTime) < 300) inner.classList.toggle('rotate-y-180');
            }
        };
        card.onpointerup = handleEnd;
        card.onpointercancel = handleEnd;
    }

    function updateUI() {
        const total = currentFullDeck.length;
        const mastered = currentFullDeck.filter(c => currentCardStatus.get(c.card_id)?.mastery === 5).length;
        const progress = calculateProgress(currentDeckId, currentFullDeck);
        const meta = deckList.find(d => d.id === currentDeckId);
        if (meta) { meta.progress = progress; saveDeckList(); }
        
        deckInfo.innerHTML = `<span class="font-black">${meta?.title || ''}</span> • ${mastered} / ${total}`;
    }

    // =================================================================
    // ===== 事件綁定 (嚴格修復選單失效) =====
    // =================================================================

    function bindEventListeners() {
        // --- 選單開啟按鈕 ---
        homeMenuBtn.onclick = (e) => { e.stopPropagation(); toggleMenu('home'); };
        menuBtn.onclick = (e) => { e.stopPropagation(); toggleMenu('deck'); applyCurrentDeckSettings(); };
        menuOverlay.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 首頁選單內按鈕 ---
        homeMenuHomeBtn.onclick = (e) => { e.stopPropagation(); backToHomeScreen(); hideAllMenus(); };
        homeMenuAddBtn.onclick = (e) => { e.stopPropagation(); openQuickStartModal(); };
        homeMenuFullscreenBtn.onclick = (e) => { e.stopPropagation(); toggleFullScreen(); };
        createNewDeckBtn.onclick = (e) => { e.stopPropagation(); openDeckEditor(); hideAllMenus(); };
        backupAllBtn.onclick = (e) => { e.stopPropagation(); backupAllData(); };
        showHowToUseBtn.onclick = (e) => { e.stopPropagation(); openHowToUseModal(); };
        homeMenuCloseBtn.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 學習選單內按鈕 ---
        deckMenuHomeBtn.onclick = (e) => { e.stopPropagation(); backToHomeScreen(); hideAllMenus(); };
        deckMenuAddBtn.onclick = (e) => { e.stopPropagation(); openQuickStartModal(); };
        deckMenuDownloadBtn.onclick = (e) => { e.stopPropagation(); downloadData('json'); hideAllMenus(); };
        showAllBtn.onclick = (e) => { e.stopPropagation(); showAllCardsView(); };
        visualEditDeckBtn.onclick = (e) => { e.stopPropagation(); openDeckEditor(currentDeckId); hideAllMenus(); };
        editDeckBtn.onclick = (e) => { e.stopPropagation(); openEditDeckModal(); };
        fontSizeIncrease.onclick = (e) => { e.stopPropagation(); changeDeckFontSize(0.2); };
        fontSizeDecrease.onclick = (e) => { e.stopPropagation(); changeDeckFontSize(-0.2); };
        deckMenuCloseBtn.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 融合 Modal 按鈕 ---
        const modalJsonBtn = document.getElementById('modal-json-btn');
        if (modalJsonBtn) modalJsonBtn.onclick = () => openEditDeckModal();

        // --- 其他全域事件 ---
        fileUpload.onchange = handleFileUpload;
        loadExampleBtn.onclick = handleExampleLoad;
        sortBySelect.onchange = (e) => { currentFilter.sortBy = e.target.value; renderHomeScreen(); };
        undoPill.onclick = () => undoLastAction();
        
        window.onkeydown = (e) => {
            // v4.2.0 P6：Escape 依層級關閉（對話框 > 最上層 Modal > 選單）
            if (e.key === 'Escape') { handleEscape(); return; }

            // 任一 Modal 或選單開啟中（或焦點在輸入框）時，不攔截按鍵
            const modalOpen = [quickStartModal, allCardsModal, editDeckModal, deckOptionsModal, howToUseModal, deckEditorModal, appConfirmModal]
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
                    if (ac) ac.querySelector('.card-inner').classList.toggle('rotate-y-180');
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
        const stack = [quickStartModal, howToUseModal, deckOptionsModal, allCardsModal, editDeckModal, deckEditorModal];
        for (let i = stack.length - 1; i >= 0; i--) {
            if (!stack[i].classList.contains('hidden')) {
                // v4.3.0：編輯器有未儲存變更時，先經確認再關閉
                if (stack[i] === deckEditorModal && editorConfirmClose) { editorConfirmClose(); return; }
                stack[i].classList.add('hidden'); return;
            }
        }
        hideAllMenus();
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    }

    function handleFileUpload(e) {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = async (ev) => {
            showLoading('解析檔案中…');
            try {
                await nextPaint();
                const data = f.name.endsWith('.json') ? JSON.parse(ev.target.result) : ev.target.result.trim().split('\n').map((l, i) => ({ card_id: `c_${Date.now()}_${i}`, fields: l.split(';').map(s => s.trim().replace(/\/\//g, '<br>')), tags: [] }));
                processNewDeck(data, `d_${Date.now()}`, f.name.split('.')[0]);
                quickStartModal.classList.add('hidden');
            } catch (err) { appAlert('檔案格式錯誤：JSON 無法解析；.txt/.csv 每行以「;」分隔欄位。', '無法匯入'); }
            finally { hideLoading(); }
        };
        r.readAsText(f);
    }

    // v4.2.0 P1：範例覆載保護 —— 既有進度時先警告，避免靜默重置
    function handleExampleLoad() {
        const f = exampleSelector.value; if (!f) return;
        const id = `ex_${f.split('.')[0]}`;
        const existing = deckList.find(d => d.id === id);
        if (existing && calculateProgress(id) > 0) {
            appConfirm({
                title: '重新載入範例？',
                message: `「${existing.title}」目前已有 ${calculateProgress(id)}% 學習進度，重新載入會將所有卡片的熟練度重置。`,
                okText: '重置並載入',
                danger: true
            }).then(ok => { if (ok) doLoadExample(f); });
            return;
        }
        doLoadExample(f);
    }

    async function doLoadExample(f) {
        showLoading('載入範例中…');
        try {
            const r = await fetch(`data/${f}`);
            const data = await r.json();
            await nextPaint();
            processNewDeck(data, `ex_${f.split('.')[0]}`, exampleSelector.selectedOptions[0].text);
            quickStartModal.classList.add('hidden');
        } catch (e) {
            appAlert('載入範例失敗，請確認網路連線後再試。', '載入失敗');
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
        
        // 每個牌組只計算一次進度（大牌組 JSON parse 開銷高，sort comparator 內重複計算會卡）
        const progressMap = new Map(deckList.map(d => [d.id, calculateProgress(d.id)]));
        
        let sorted = [...deckList];
        if (currentFilter.sortBy === 'title') sorted.sort((a,b) => a.title.localeCompare(b.title));
        else if (currentFilter.sortBy === 'progress') sorted.sort((a,b) => progressMap.get(b.id) - progressMap.get(a.id));
        else sorted.sort((a,b) => b.lastOpened - a.lastOpened);

        sorted.forEach(d => {
            const prog = progressMap.get(d.id);
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 cursor-pointer group relative overflow-hidden";
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-black text-neutral-900 dark:text-neutral-100 truncate pr-8">${d.title}</h3>
                    <button class="options-btn p-1 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" aria-label="單字集選項">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                <div class="flex items-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                    <span>${d.totalCards} Cards • ${prog}% Mastered</span>
                </div>
                <div class="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div class="h-full bg-neutral-900 dark:bg-white transition-all duration-1000" style="width: ${prog}%"></div>
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

    function openQuickStartModal() { quickStartModal.classList.remove('hidden'); hideAllMenus(); }
    function openHowToUseModal() { howToUseModal.classList.remove('hidden'); hideAllMenus(); }
    
    function applyCurrentDeckSettings() {
        fontSizeValue.textContent = currentDeckSettings.fontSize.toFixed(1);
        populateCardTagFilters();
    }

    function populateCardTagFilters() {
        cardTagFilterContainer.innerHTML = '';
        const tags = [...new Set(currentFullDeck.flatMap(c => c.tags || []))].sort();
        if (tags.length === 0) {
            cardTagFilterContainer.innerHTML = '<p class="text-xs text-neutral-400 pl-4 italic">無可用標籤</p>';
            return;
        }
        tags.forEach(t => {
            const l = document.createElement('label');
            l.className = "flex items-center space-x-3 cursor-pointer py-2 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl";
            const checked = currentDeckSettings.filterTags.includes(t) ? 'checked' : '';
            l.innerHTML = `<input type="checkbox" ${checked} value="${t}" class="w-5 h-5 rounded-lg border-neutral-300 text-neutral-900 focus:ring-neutral-900"> <span class="text-sm font-bold text-neutral-600 dark:text-neutral-400">${t}</span>`;
            l.querySelector('input').onchange = () => {
                const checked = Array.from(cardTagFilterContainer.querySelectorAll('input:checked')).map(i => i.value);
                currentDeckSettings.filterTags = checked;
                const meta = deckList.find(d => d.id === currentDeckId);
                if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
                updateLearningDeck(); updateUI();
            };
            cardTagFilterContainer.appendChild(l);
        });
    }

    function changeDeckFontSize(step) {
        currentDeckSettings.fontSize = Math.min(Math.max(currentDeckSettings.fontSize + step, 1.0), 5.0);
        const meta = deckList.find(d => d.id === currentDeckId);
        if (meta) { meta.settings = { ...currentDeckSettings }; saveDeckList(); }
        fontSizeValue.textContent = currentDeckSettings.fontSize.toFixed(1);
        displayCardStack();
    }

    function showAllCardsView() { cardSearchInput.value = ''; allCardsModal.classList.remove('hidden'); hideAllMenus(); renderAllCardsTable(); }
    function renderAllCardsTable() {
        const q = cardSearchInput.value.toLowerCase().trim();
        let html = '<thead><tr class="text-neutral-400 text-[10px] uppercase tracking-widest"><th class="p-4">ID / Mastery</th>';
        const fields = currentFullDeck[0]?.fields.length || 0;
        for (let i = 1; i <= fields; i++) html += `<th class="p-4">Field ${i}</th>`;
        html += '<th class="p-4">Tags</th></tr></thead><tbody>';
        
        currentFullDeck.filter(c => !q || c.fields.some(f => f.toLowerCase().includes(q)) || (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))).forEach(c => {
            const m = currentCardStatus.get(c.card_id)?.mastery ?? 1;
            html += `<tr class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td class="p-4">
                    <div class="text-[9px] font-mono text-neutral-400 mb-1">${c.card_id}</div>
                    <div class="flex space-x-0.5">${Array.from({length:5}, (_,idx)=>`<div class="w-1.5 h-1.5 rounded-full ${idx<m?'bg-neutral-900 dark:bg-white':'bg-neutral-200 dark:bg-neutral-700'}"></div>`).join('')}</div>
                </td>`;
            c.fields.forEach(f => html += `<td class="p-4 text-neutral-600 dark:text-neutral-400 font-medium">${f.replace(/<br>/g, ' ')}</td>`);
            html += `<td class="p-4"><div class="flex flex-wrap gap-1">${(c.tags || []).map(t => `<span class="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] font-bold">${t}</span>`).join('')}</div></td></tr>`;
        });
        allCardsTable.innerHTML = html + '</tbody>';
    }

    // --- 其餘 Modal 邏輯 (修復實作) ---
    function openDeckOptions(id) {
        const d = deckList.find(x => x.id === id); if (!d) return;
        deckOptionsModal.classList.remove('hidden');
        deckOptionsTitle.textContent = '單字集設定';
        deckTitleInput.value = d.title;
        saveDeckOptionsBtn.onclick = () => {
            d.title = deckTitleInput.value; saveDeckList();
            deckOptionsModal.classList.add('hidden'); renderHomeScreen();
        };
        const deckOptionsJsonBtn = document.getElementById('deck-options-json-btn');
        if (deckOptionsJsonBtn) deckOptionsJsonBtn.onclick = () => {
            deckOptionsModal.classList.add('hidden');
            openEditDeckModal(id);
        };
        deleteDeckBtn.onclick = async () => {
            const ok = await appConfirm({
                title: '刪除單字集',
                message: `確定要刪除「${d.title}」嗎？\n此操作無法復原，學習進度將一併刪除。`,
                okText: '刪除',
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
        saveEditDeckBtn.onclick = async () => {
            try {
                const updated = JSON.parse(jsonEditorTextarea.value);
                // 儲存前驗證形狀，避免壞資料寫入後弄壞學習畫面
                const valid = Array.isArray(updated) && updated.length > 0
                    && updated.every(c => c && typeof c.card_id === 'string' && Array.isArray(c.fields));
                if (!valid) { await appAlert('需為非空卡片陣列，每張卡片須含 card_id (字串) 與 fields (陣列)。', 'JSON 格式錯誤'); return; }
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
            } catch (e) { await appAlert('JSON 語法錯誤，請檢查括號與逗號是否成對。', 'JSON 語法錯誤'); }
        };
    }

    // [v4.1.3] 圖形化編輯器 (F14)；v4.1.5 修正存檔同步；v4.3.0 P5：分頁 + 搜尋 + 陣列工作副本
    function openDeckEditor(id = null) {
        const isNew = !id;
        const data = isNew ? [{ card_id: `c_${Date.now()}_0`, fields: ["", "", ""], tags: [] }] : getDeckData(id);
        if (!data) return;

        // 工作副本：陣列為唯一資料來源，分頁後只有當頁存在於 DOM，輸入即時寫回（6498 張也不再卡）
        const workingCards = data.map(c => ({
            card_id: c.card_id,
            fields: [c.fields[0] || '', c.fields[1] || '', c.fields.slice(2).join('; ')],
            tags: (c.tags || []).join(', '),
            notes: c.notes || ''
        }));
        const deletedIds = new Set();
        const PAGE_SIZE = 100;
        let editorPage = 0, editorDirty = false;

        deckEditorModal.classList.remove('hidden');
        editorDeckTitle.textContent = isNew ? "建立新單字集" : (deckList.find(d => d.id === id)?.title || "編輯單字集");
        editorSearchInput.value = '';
        renderEditorPage();

        editorSearchInput.oninput = () => { editorPage = 0; renderEditorPage(); };
        editorPrevPageBtn.onclick = () => { if (editorPage > 0) { editorPage--; renderEditorPage(); } };
        editorNextPageBtn.onclick = () => { editorPage++; renderEditorPage(); };

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
            if (newRows.length === 0) { await appAlert('請至少輸入一張卡片內容（正面欄位必填）。', '無法儲存'); return; }

            if (isNew) {
                processNewDeck(newRows, `d_${Date.now()}`, "未命名單字集");
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
                title: '放棄未儲存的變更？',
                message: '您在編輯器中的修改尚未儲存，離開將全部遺失。',
                okText: '放棄變更',
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
            const totalPages = Math.max(1, Math.ceil(view.length / PAGE_SIZE));
            editorPage = Math.min(Math.max(editorPage, 0), totalPages - 1);

            const slice = view.slice(editorPage * PAGE_SIZE, (editorPage + 1) * PAGE_SIZE);
            if (slice.length === 0) {
                editorRowsContainer.innerHTML = '<p class="text-center text-neutral-400 py-12 text-sm font-bold">沒有符合的卡片</p>';
            } else {
                slice.forEach(({ c, i }) => renderEditorRow(c, i));
            }
            if (keepScroll) editorRowsContainer.scrollTop = prevScroll;

            const liveCount = workingCards.length - deletedIds.size;
            editorStatusMsg.textContent = `共 ${liveCount} 張卡片${q ? ` · 符合 ${view.length} 張` : ''}`;
            editorPageIndicator.textContent = `${editorPage + 1} / ${totalPages}`;
            editorPrevPageBtn.disabled = editorPage === 0;
            editorNextPageBtn.disabled = editorPage >= totalPages - 1;
        }

        function renderEditorRow(card, globalIndex) {
            const row = document.createElement('div');
            row.dataset.id = card.card_id;
            row.className = "p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 flex flex-col gap-3 group animate-in slide-in-from-bottom-2 duration-300";
            row.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Card #${globalIndex + 1}</span>
                    <button class="delete-row-btn p-1 text-neutral-300 hover:text-red-500 transition-colors" aria-label="刪除此卡片">
                        <span class="material-symbols-outlined !text-sm">delete</span>
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="正面 (必填)" value="${escapeAttr(card.fields[0] || '')}" class="px-4 py-2 bg-white dark:bg-neutral-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900 font-bold">
                    <input type="text" placeholder="背面 (解釋/翻譯)" value="${escapeAttr(card.fields[1] || '')}" class="px-4 py-2 bg-white dark:bg-neutral-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-neutral-900">
                </div>
                <div class="flex flex-col gap-2">
                    <input type="text" placeholder="補充備註 (Notes)" value="${escapeAttr(card.fields[2] || '')}" class="px-4 py-2 bg-white dark:bg-neutral-900 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-neutral-900 opacity-60">
                    <input type="text" placeholder="標籤 (用逗號隔開)" value="${escapeAttr(card.tags)}" class="tag-input px-4 py-2 bg-white dark:bg-neutral-900 border-none rounded-xl text-[10px] font-mono outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-400">
                </div>
            `;
            const inputs = row.querySelectorAll('input[type="text"]');
            inputs[0].oninput = () => { card.fields[0] = inputs[0].value; editorDirty = true; };
            inputs[1].oninput = () => { card.fields[1] = inputs[1].value; editorDirty = true; };
            inputs[2].oninput = () => { card.fields[2] = inputs[2].value; editorDirty = true; };
            inputs[3].oninput = () => { card.tags = inputs[3].value; editorDirty = true; };
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
        cardStackContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div class="w-24 h-24 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center shadow-2xl">
                    <span class="material-symbols-outlined !text-5xl">celebration</span>
                </div>
                <div>
                    <h3 class="text-3xl font-black mb-2 text-neutral-900 dark:text-white">太棒了！</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest text-xs">您已完成目前篩選下的所有卡片</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button id="restart-round-btn" class="px-8 py-3.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all">再讀一輪</button>
                    <button id="back-to-home-btn" class="px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">返回首頁</button>
                </div>
            </div>
        `;
        const backHomeBtn = cardStackContainer.querySelector('#back-to-home-btn');
        if (backHomeBtn) backHomeBtn.onclick = () => backToHomeScreen();
        const restartBtn = cardStackContainer.querySelector('#restart-round-btn');
        if (restartBtn) restartBtn.onclick = restartDeckRound;
    }

    // v4.3.0 P7：完成後直接再讀一輪 —— 只重置「目前篩選下」的卡片熟練度
    function restartDeckRound() {
        const targets = currentFullDeck.filter(matchesDeckFilter);
        if (targets.length === 0) return;
        appConfirm({
            title: '再讀一輪',
            message: `將把目前篩選下的 ${targets.length} 張卡片熟練度重置為 1 並重新開始，其他卡片不受影響。`,
            okText: '重置並開始',
            danger: true
        }).then(ok => {
            if (!ok) return;
            targets.forEach(c => {
                const st = currentCardStatus.get(c.card_id);
                if (st) { st.mastery = 1; st.lastTime = Date.now(); }
            });
            saveDeckState(currentDeckId, currentCardStatus);
            startGame(currentDeckId);
        });
    }

    initializeApp();
});
