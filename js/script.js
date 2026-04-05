// ===== PWA Service Worker 註冊 =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker 註冊成功: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker 註冊失敗: ', error);
            });
    });
}

// ===== 應用程式腳本 (v4.0.0 Mastery System - Refined) =====
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM 元素 ---
    const homeScreen = document.getElementById('home-screen');
    const mainScreen = document.getElementById('main-screen');
    // 快速開始 Modal
    const quickStartModal = document.getElementById('quick-start-modal');
    const closeQuickStartModalBtn = document.getElementById('close-quick-start-modal-btn');
    const fileUpload = document.getElementById('file-upload');
    const exampleSelector = document.getElementById('example-selector');
    const loadExampleBtn = document.getElementById('load-example-btn');
    const quickStartErrorMessage = document.getElementById('quick-start-error-message');
    // 首頁
    const homeMenuBtn = document.getElementById('home-menu-btn');
    const statsTotalDecks = document.getElementById('stats-total-decks');
    const statsTotalCards = document.getElementById('stats-total-cards');
    const sortBySelect = document.getElementById('sort-by');
    const deckListContainer = document.getElementById('deck-list-container');
    const noRecentDecks = document.getElementById('no-recent-decks');
    // 學習畫面 (Mastery System)
    const cardStackContainer = document.getElementById('card-stack-container');
    const hintForgot = document.getElementById('hint-forgot');
    const hintLearned = document.getElementById('hint-learned');
    const deckInfo = document.getElementById('deck-info');
    const historyAlert = document.getElementById('history-alert');
    // 選單 (通用)
    const menuOverlay = document.getElementById('menu-overlay');
    // 首頁選單
    const homeMenuPanel = document.getElementById('home-menu-panel');
    const homeMenuHomeBtn = document.getElementById('home-menu-home-btn');
    const homeMenuAddBtn = document.getElementById('home-menu-add-btn');
    const createNewDeckBtn = document.getElementById('create-new-deck-btn');
    const homeMenuFullscreenBtn = document.getElementById('home-menu-fullscreen-btn');
    const homeMenuCloseBtn = document.getElementById('home-menu-close-btn');
    const backupAllBtn = document.getElementById('backup-all-btn');
    const manageTagsBtn = document.getElementById('manage-tags-btn');
    const showHowToUseBtn = document.getElementById('show-how-to-use-btn');
    // 學習中選單
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
    // Modals
    const allCardsModal = document.getElementById('all-cards-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const allCardsTable = document.getElementById('all-cards-table');
    const cardSearchInput = document.getElementById('card-search-input');
    const downloadModal = document.getElementById('download-modal');
    const closeDownloadModalBtn = document.getElementById('close-download-modal-btn');
    const howToUseModal = document.getElementById('how-to-use-modal');
    const closeHowToUseModalBtn = document.getElementById('close-how-to-use-modal-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
    const newTagInput = document.getElementById('new-tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagListContainer = document.getElementById('tag-list-container');
    const tagListError = document.getElementById('tag-list-error');
    const editDeckModal = document.getElementById('edit-deck-modal');
    const closeEditDeckModalBtn = document.getElementById('close-edit-deck-modal-btn');
    const jsonEditorTextarea = document.getElementById('json-editor-textarea');
    const cancelEditDeckBtn = document.getElementById('cancel-edit-deck-btn');
    const saveEditDeckBtn = document.getElementById('save-edit-deck-btn');
    const jsonEditorError = document.getElementById('json-editor-error');
    const deckOptionsModal = document.getElementById('deck-options-modal');
    const closeDeckOptionsModalBtn = document.getElementById('close-deck-options-modal-btn');
    const deckOptionsTitle = document.getElementById('deck-options-title');
    const deckTitleInput = document.getElementById('deck-title-input');
    const deckTitleError = document.getElementById('deck-title-error');
    const deckTagsContainer = document.getElementById('deck-tags-container'); 
    const saveDeckOptionsBtn = document.getElementById('save-deck-options-btn'); 
    const deleteDeckBtn = document.getElementById('delete-deck-btn');
    // 圖形編輯器
    const deckEditorModal = document.getElementById('deck-editor-modal');
    const closeDeckEditorModalBtn = document.getElementById('close-deck-editor-modal-btn');
    const editorDeckTitle = document.getElementById('editor-deck-title');
    const editorFieldCount = document.getElementById('editor-field-count');
    const editorApplyFieldsBtn = document.getElementById('editor-apply-fields-btn');
    const editorRowsContainer = document.getElementById('editor-rows-container');
    const editorAddRowBtn = document.getElementById('editor-add-row-btn');
    const editorSaveBtn = document.getElementById('editor-save-btn');
    const editorCancelBtn = document.getElementById('editor-cancel-btn');
    const editorStatusMsg = document.getElementById('editor-status-msg');


    // --- LocalStorage Keys ---
    const STORAGE_KEYS = {
        PREFERENCES: 'flashcardPWA_prefs_v2',
        DECK_LIST: 'flashcardPWA_deckList_v2', 
        ALL_TAGS: 'flashcardPWA_allTags_v2',
        DECK_DATA_PREFIX: 'flashcardPWA_data_v2_',
        DECK_STATE_PREFIX: 'flashcardPWA_state_v2_'
    };
    
    // --- 常數 ---
    const FONT_SIZE_STEP = 0.2;
    const MIN_FONT_SIZE = 1.0;
    const MAX_FONT_SIZE = 5.0;
    const EXAMPLES = [
        { name: "高中 6000 單字", file: "hs_6000.json" },
        { name: "動詞三態", file: "verbs.json" },
        { name: "元素週期表", file: "elements.json" },
        { name: "國家與首都", file: "capitals.json" }
    ];

    // --- 應用程式狀態 ---
    let globalPreferences = {}; 
    let deckList = []; 
    let allTags = [];
    let currentFilter = { sortBy: 'lastOpened' };
    let currentDeckId = null;
    let currentFullDeck = [];
    let currentLearningDeck = [];
    let currentCardStatus = new Map();
    let currentDeckSettings = {};
    let history = []; 
    let historyIndex = -1;
    const MAX_HISTORY = 20;

    // --- 互動狀態 ---
    let swipeMoveHandler = null;
    let swipeUpHandler = null;

    // --- 偏好設定預設值 ---
    const DEFAULT_GLOBAL_PREFERENCES = {};
    const DEFAULT_DECK_SETTINGS = { 
        fontSize: 2.5,
        filterTags: [] 
    };

    // =================================================================
    // ===== 初始化
    // =================================================================

    function initializeApp() {
        loadGlobalPreferences();
        loadDeckList();
        loadAllTags();
        populateExampleSelector();
        renderHomeScreen();
        bindEventListeners();
    }

    function loadGlobalPreferences() {
        const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        globalPreferences = saved ? JSON.parse(saved) : { ...DEFAULT_GLOBAL_PREFERENCES };
    }

    function saveGlobalPreferences() {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(globalPreferences));
    }

    function loadDeckList() {
        const saved = localStorage.getItem(STORAGE_KEYS.DECK_LIST);
        deckList = saved ? JSON.parse(saved) : [];
    }

    function saveDeckList() {
        localStorage.setItem(STORAGE_KEYS.DECK_LIST, JSON.stringify(deckList));
    }

    function loadAllTags() {
        const saved = localStorage.getItem(STORAGE_KEYS.ALL_TAGS);
        allTags = saved ? JSON.parse(saved) : [];
    }

    function saveAllTags() {
        localStorage.setItem(STORAGE_KEYS.ALL_TAGS, JSON.stringify(allTags));
    }

    function getDeckData(deckId) {
        const saved = localStorage.getItem(STORAGE_KEYS.DECK_DATA_PREFIX + deckId);
        return saved ? JSON.parse(saved) : null;
    }

    function saveDeckData(deckId, data) {
        localStorage.setItem(STORAGE_KEYS.DECK_DATA_PREFIX + deckId, JSON.stringify(data));
    }

    function getDeckState(deckId) {
        const saved = localStorage.getItem(STORAGE_KEYS.DECK_STATE_PREFIX + deckId);
        if (!saved) return new Map();
        const parsed = JSON.parse(saved);
        return new Map(Object.entries(parsed));
    }

    function saveDeckState(deckId, stateMap) {
        const obj = Object.fromEntries(stateMap);
        localStorage.setItem(STORAGE_KEYS.DECK_STATE_PREFIX + deckId, JSON.stringify(obj));
    }

    function resetDeckState(deckId, deckData) {
        const initialState = new Map();
        deckData.forEach(card => {
            initialState.set(card.card_id, { mastery: 1, lastTime: Date.now() });
        });
        saveDeckState(deckId, initialState);
    }

    function populateExampleSelector() {
        EXAMPLES.forEach(ex => {
            const opt = document.createElement('option');
            opt.value = ex.file;
            opt.textContent = ex.name;
            exampleSelector.appendChild(opt);
        });
    }

    // =================================================================
    // ===== 學習畫面 (遊戲邏輯 - v4.0.0 Mastery System)
    // =================================================================

    function startGame(deckId) {
        hideAllMenus(); 
        
        const deckData = getDeckData(deckId);
        const deckMeta = deckList.find(d => d.id === deckId);

        if (!deckData || !deckMeta) {
            showError("載入單字集失敗。");
            renderHomeScreen();
            return;
        }
        
        currentDeckId = deckId;
        currentFullDeck = deckData;
        currentCardStatus = getDeckState(deckId);
        
        currentDeckSettings = { 
            ...DEFAULT_DECK_SETTINGS, 
            ...deckMeta.settings 
        };
        
        let stateChanged = false;
        currentFullDeck.forEach(card => {
            if (!currentCardStatus.has(card.card_id) || typeof currentCardStatus.get(card.card_id) !== 'object') {
                const old = currentCardStatus.get(card.card_id);
                currentCardStatus.set(card.card_id, {
                    mastery: (old === 'correct' ? 5 : 1),
                    lastTime: Date.now()
                });
                stateChanged = true;
            }
        });
        if (stateChanged) saveDeckState(currentDeckId, currentCardStatus);

        applyCurrentDeckSettings(); 
        updateLearningDeck(); 
        
        deckMeta.lastOpened = Date.now();
        saveDeckList();
        
        history = [];
        historyIndex = -1;
        showScreen('main');
        showNextCard('new_game');
    }

    function updateLearningDeck() {
        let filtered = currentFullDeck;
        
        if (currentDeckSettings.filterTags && currentDeckSettings.filterTags.length > 0) {
            filtered = currentFullDeck.filter(card => {
                const cardTags = card.tags || [];
                return currentDeckSettings.filterTags.some(tag => {
                    if (tag === 'untagged') return cardTags.length === 0;
                    return cardTags.includes(tag);
                });
            });
        }

        currentLearningDeck = filtered.filter(card => currentCardStatus.get(card.card_id).mastery < 5);

        // 排序：不熟的優先
        currentLearningDeck.sort((a, b) => {
            const mA = currentCardStatus.get(a.card_id).mastery;
            const mB = currentCardStatus.get(b.card_id).mastery;
            if (mA !== mB) return mA - mB;
            return Math.random() - 0.5;
        });
    }
    
    function restartGame() {
        resetDeckState(currentDeckId, currentFullDeck);
        currentCardStatus = getDeckState(currentDeckId);
        updateLearningDeck(); 
        history = [];
        historyIndex = -1;
        showNextCard('new_game');
    }

    function showNextCard(action) {
        if (historyIndex >= 0 && historyIndex < history.length) {
            const currentCardId = history[historyIndex];
            const state = currentCardStatus.get(currentCardId);
            
            if (action === 'correct') {
                state.mastery = Math.min(state.mastery + 1, 5);
                if (state.mastery === 5) {
                    currentLearningDeck = currentLearningDeck.filter(c => c.card_id !== currentCardId);
                }
            } else if (action === 'incorrect') {
                state.mastery = 1; 
            }
            state.lastTime = Date.now();
            currentCardStatus.set(currentCardId, state);
        }

        let nextCard;
        if (historyIndex < history.length - 1) {
            historyIndex++;
            nextCard = currentFullDeck.find(c => c.card_id === history[historyIndex]);
        } else {
            if (currentLearningDeck.length === 0) {
                displayEndOfDeck();
                saveDeckState(currentDeckId, currentCardStatus); 
                return;
            }
            // 從最不熟的前 5 張隨機抽一張
            const poolSize = Math.min(5, currentLearningDeck.length);
            nextCard = currentLearningDeck[Math.floor(Math.random() * poolSize)];
            
            history.push(nextCard.card_id);
            if (history.length > MAX_HISTORY) { history.shift(); }
            historyIndex = history.length - 1;
        }
        
        displayCardStack();
        updateUI();
        saveDeckState(currentDeckId, currentCardStatus); 
    }

    function showPrevCard() {
        if (historyIndex > 0) {
            historyIndex--;
            displayCardStack();
        } else {
            historyAlert.classList.remove('hidden');
            setTimeout(() => historyAlert.classList.add('hidden'), 1500);
        }
        updateUI();
    }

    function displayCardStack() {
        cardStackContainer.innerHTML = '';
        const visible = [];
        
        if (historyIndex >= 0) {
            visible.push(currentFullDeck.find(c => c.card_id === history[historyIndex]));
        }

        if (historyIndex === history.length - 1) {
            const pool = currentLearningDeck.filter(c => c.card_id !== history[historyIndex]);
            for (let i = 0; i < 2 && pool[i]; i++) visible.push(pool[i]);
        } else {
            for (let i = 1; i <= 2 && history[historyIndex + i]; i++) {
                visible.push(currentFullDeck.find(c => c.card_id === history[historyIndex + i]));
            }
        }

        for (let i = visible.length - 1; i >= 0; i--) {
            const cardData = visible[i];
            const isTop = (i === 0);

            const cardEl = document.createElement('div');
            cardEl.className = `combo-card absolute w-full h-full transition-all duration-400 ease-out ${isTop ? 'z-[30]' : 'pointer-events-none'}`;
            cardEl.style.transform = `translateY(${i * 16}px) scale(${1 - i * 0.05})`;
            cardEl.style.opacity = 1 - i * 0.2;
            cardEl.style.zIndex = 30 - i;

            if (isTop) {
                cardEl.id = 'active-combo-card';
                cardEl.innerHTML = `
                    <div id="stamp-forgot" class="stamp"><span class="material-symbols-outlined !text-5xl">close</span></div>
                    <div id="stamp-learned" class="stamp"><span class="material-symbols-outlined !text-5xl">check</span></div>
                    <div class="card-inner">
                        <div class="absolute inset-0 backface-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm flex flex-col items-center justify-center p-8">
                            <div class="card-content text-center text-neutral-900 dark:text-neutral-100 font-light" style="font-size: ${currentDeckSettings.fontSize}rem">
                                ${cardData.fields[0]}
                            </div>
                        </div>
                        <div class="absolute inset-0 backface-hidden rotate-y-180 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
                            <div class="card-content font-medium mb-4" style="font-size: ${currentDeckSettings.fontSize * 0.8}rem">
                                ${cardData.fields[1] || ''}
                            </div>
                            <div class="text-neutral-400 dark:text-neutral-500 text-sm leading-relaxed">${cardData.fields.slice(2).join('<br>')}</div>
                        </div>
                    </div>
                `;
                cardStackContainer.appendChild(cardEl);
                initComboLogic(cardEl);
            } else {
                cardEl.innerHTML = `
                    <div class="w-full h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl flex items-center justify-center p-8">
                        <div class="text-neutral-200 dark:text-neutral-800 font-light truncate w-full text-center" style="font-size: ${currentDeckSettings.fontSize}rem">
                            ${cardData.fields[0]}
                        </div>
                    </div>
                `;
                cardStackContainer.appendChild(cardEl);
            }
        }
    }

    function initComboLogic(card) {
        const inner = card.querySelector('.card-inner');
        const stampForgot = card.querySelector('#stamp-forgot');
        const stampLearned = card.querySelector('#stamp-learned');
        let isDragging = false, startX = 0, dragX = 0, lastX = 0, lastTime = 0, velocity = 0, startTime = 0;

        if (swipeMoveHandler) window.removeEventListener('pointermove', swipeMoveHandler);
        if (swipeUpHandler) window.removeEventListener('pointerup', swipeUpHandler);

        card.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            startX = lastX = e.clientX;
            lastTime = startTime = Date.now();
            dragX = 0;
            card.style.transition = 'none';
            card.setPointerCapture(e.pointerId);
        });

        swipeMoveHandler = (e) => {
            if (!isDragging) return;
            const now = Date.now(), dt = now - lastTime;
            if (dt > 0) velocity = (e.clientX - lastX) / dt;
            dragX = e.clientX - startX;
            lastX = e.clientX; lastTime = now;

            card.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`;
            const opacity = Math.min(Math.abs(dragX) / 100, 1);
            if (dragX > 0) {
                stampLearned.style.opacity = opacity;
                stampLearned.style.transform = `translateY(-50%) scale(${0.8 + opacity * 0.2})`;
                stampForgot.style.opacity = 0;
                hintLearned.style.opacity = opacity * 0.5;
                hintForgot.style.opacity = 0;
            } else {
                stampForgot.style.opacity = opacity;
                stampForgot.style.transform = `translateY(-50%) scale(${0.8 + opacity * 0.2})`;
                stampLearned.style.opacity = 0;
                hintForgot.style.opacity = opacity * 0.5;
                hintLearned.style.opacity = 0;
            }
        };

        swipeUpHandler = (e) => {
            if (!isDragging) return;
            isDragging = false;
            const duration = Date.now() - startTime;
            if (Math.abs(velocity) > 0.5 || Math.abs(dragX) > 100) {
                const direction = dragX > 0 ? 1 : -1;
                card.classList.add('transition-exit');
                card.style.transform = `translateX(${direction * 1000}px) rotate(${direction * 45}deg)`;
                card.style.opacity = '0';
                hintForgot.style.opacity = hintLearned.style.opacity = 0;
                setTimeout(() => showNextCard(direction > 0 ? 'correct' : 'incorrect'), 250);
            } else {
                card.classList.add('transition-snap-back');
                card.style.transform = `translateX(0px) rotate(0deg)`;
                stampForgot.style.opacity = stampLearned.style.opacity = hintForgot.style.opacity = hintLearned.style.opacity = 0;
                if (Math.abs(dragX) < 10 && duration < 300) inner.classList.toggle('rotate-y-180');
                setTimeout(() => card.classList.remove('transition-snap-back'), 400);
            }
        };

        card.addEventListener('pointermove', swipeMoveHandler);
        card.addEventListener('pointerup', swipeUpHandler);
        card.addEventListener('pointercancel', swipeUpHandler);
    }

    function displayEndOfDeck() {
        cardStackContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-lg animate-in zoom-in duration-300">
                <div class="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined !text-5xl">celebration</span>
                </div>
                <h2 class="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">複習完成！</h2>
                <button id="restart-btn" class="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-full shadow-md hover:bg-neutral-800 transition-colors">重新開始</button>
            </div>
        `;
        document.getElementById('restart-btn').addEventListener('click', restartGame);
        deckInfo.textContent = '完成!';
    }

    function updateUI() {
        const mastered = Array.from(currentCardStatus.values()).filter(v => v.mastery === 5).length;
        const total = currentFullDeck.length;
        const title = deckList.find(d => d.id === currentDeckId)?.title || "單字集";
        deckInfo.innerHTML = `<span class="font-bold">${title}</span> • ${mastered} / ${total}`;
    }

    function bindEventListeners() {
        // 首頁
        homeMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu('home'); }); 
        fileUpload.addEventListener('change', handleFileUpload);
        loadExampleBtn.addEventListener('click', handleExampleLoad);
        sortBySelect.addEventListener('change', (e) => { currentFilter.sortBy = e.target.value; renderHomeScreen(); });

        // 學習畫面
        menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu('deck'); }); 
        
        // 通用
        menuOverlay.addEventListener('click', hideAllMenus);
        [homeMenuFullscreenBtn, deckMenuFullscreenBtn].forEach(btn => btn && btn.addEventListener('click', toggleFullScreen));
        [homeMenuAddBtn, deckMenuAddBtn].forEach(btn => btn && btn.addEventListener('click', openQuickStartModal));
        [homeMenuHomeBtn, deckMenuHomeBtn].forEach(btn => btn && btn.addEventListener('click', () => { backToHomeScreen(); hideAllMenus(); }));
        
        // 選單按鈕
        homeMenuCloseBtn.addEventListener('click', () => toggleMenu('home')); 
        createNewDeckBtn.addEventListener('click', () => { openDeckEditor(); hideAllMenus(); });
        backupAllBtn.addEventListener('click', backupAllData);
        manageTagsBtn.addEventListener('click', openSettingsModal);
        showHowToUseBtn.addEventListener('click', openHowToUseModal);
        deckMenuCloseBtn.addEventListener('click', () => toggleMenu('deck')); 
        deckMenuDownloadBtn.addEventListener('click', () => { downloadModal.classList.remove('hidden'); hideAllMenus(); });
        showAllBtn.addEventListener('click', showAllCardsView);
        visualEditDeckBtn.addEventListener('click', () => { openDeckEditor(currentDeckId); hideAllMenus(); });
        editDeckBtn.addEventListener('click', openEditDeckModal);
        fontSizeIncrease.addEventListener('click', () => changeDeckFontSize(FONT_SIZE_STEP));
        fontSizeDecrease.addEventListener('click', () => changeDeckFontSize(-FONT_SIZE_STEP));
        
        // 鍵盤
        window.addEventListener('keydown', (e) => {
            if (mainScreen.classList.contains('hidden')) return;
            if (e.key === 'ArrowRight') showNextCard('correct');
            if (e.key === 'ArrowLeft') showNextCard('incorrect');
            if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const active = document.getElementById('active-combo-card');
                if (active) active.querySelector('.card-inner').classList.toggle('rotate-y-180');
            }
        });

        // Modals
        closeQuickStartModalBtn.addEventListener('click', () => quickStartModal.classList.add('hidden'));
        closeModalBtn.addEventListener('click', () => allCardsModal.classList.add('hidden'));
        cardSearchInput.addEventListener('input', renderAllCardsTable);
        closeDownloadModalBtn.addEventListener('click', () => downloadModal.classList.add('hidden'));
        document.querySelectorAll('.download-format-btn').forEach(btn => btn.addEventListener('click', (e) => downloadData(e.target.dataset.format)));
        closeHowToUseModalBtn.addEventListener('click', () => howToUseModal.classList.add('hidden'));
        closeSettingsModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
        addTagBtn.addEventListener('click', addNewTag);
        newTagInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNewTag(); });
        closeEditDeckModalBtn.addEventListener('click', () => editDeckModal.classList.add('hidden'));
        cancelEditDeckBtn.addEventListener('click', () => editDeckModal.classList.add('hidden'));
        saveEditDeckBtn.addEventListener('click', saveDeckEdit);
        closeDeckOptionsModalBtn.addEventListener('click', () => deckOptionsModal.classList.add('hidden'));
        saveDeckOptionsBtn.addEventListener('click', saveDeckOptions);
        deleteDeckBtn.addEventListener('click', deleteDeck);
        
        // 圖形編輯器
        closeDeckEditorModalBtn.addEventListener('click', () => deckEditorModal.classList.add('hidden'));
        editorCancelBtn.addEventListener('click', () => deckEditorModal.classList.add('hidden'));
        editorAddRowBtn.addEventListener('click', () => renderEditorRow());
        editorApplyFieldsBtn.addEventListener('click', () => { if (confirm("確定變更欄位？內容將清空")) renderEditorRows(); });
        editorSaveBtn.addEventListener('click', saveDeckFromEditor);
    }

    // --- 輔助功能 ---
    function showScreen(screen) {
        [homeScreen, mainScreen].forEach(s => s.classList.add('hidden'));
        if (screen === 'home') homeScreen.classList.remove('hidden');
        else if (screen === 'main') mainScreen.classList.remove('hidden');
    }

    function backToHomeScreen() { showScreen('home'); currentDeckId = null; renderHomeScreen(); }

    function toggleMenu(type) {
        const panel = type === 'home' ? homeMenuPanel : menuPanel;
        const isOpen = panel.classList.contains('open');
        hideAllMenus();
        if (!isOpen) { panel.classList.add('open'); menuOverlay.classList.remove('hidden'); }
    }

    function hideAllMenus() {
        [homeMenuPanel, menuPanel].forEach(p => p.classList.remove('open'));
        menuOverlay.classList.add('hidden');
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else if (document.exitFullscreen) document.exitFullscreen();
    }

    function showQuickStartError(msg) {
        quickStartErrorMessage.textContent = msg;
        setTimeout(() => quickStartErrorMessage.textContent = '', 3000);
    }

    function showError(msg) { alert(msg); }

    // --- 檔案處理 ---
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                let data;
                if (file.name.endsWith('.json')) data = parseJsonFile(event.target.result);
                else data = parseTextFile(event.target.result);
                processNewDeck(data, `deck_${Date.now()}`, file.name.split('.')[0], file.name);
                quickStartModal.classList.add('hidden');
            } catch (err) { showQuickStartError(err.message); }
        };
        reader.readAsText(file);
    }

    function handleExampleLoad() {
        const file = exampleSelector.value;
        if (!file) return;
        fetch(`data/${file}`).then(r => r.text()).then(content => {
            const data = parseJsonFile(content);
            processNewDeck(data, `example_${file.split('.')[0]}`, exampleSelector.selectedOptions[0].text, file);
            quickStartModal.classList.add('hidden');
        }).catch(() => showQuickStartError("範例載入失敗。"));
    }

    function parseTextFile(content) {
        return content.trim().split('\n').map((line, i) => {
            const fields = line.split(';').map(f => f.trim().replace(/\/\//g, '<br>'));
            return { card_id: `card_${i}_${crypto.randomUUID()}`, fields, tags: [], notes: "" };
        });
    }

    function parseJsonFile(content) {
        const parsed = JSON.parse(content);
        return parsed.map((c, i) => ({
            card_id: c.card_id || `card_${i}_${crypto.randomUUID()}`,
            fields: c.fields.map(f => String(f).replace(/\/\//g, '<br>')),
            tags: c.tags || [],
            notes: c.notes || ""
        }));
    }

    function processNewDeck(deckData, deckId, title, source) {
        saveDeckData(deckId, deckData);
        const meta = { id: deckId, title, sourceFileName: source, totalCards: deckData.length, fieldCount: deckData[0].fields.length, lastOpened: Date.now(), category: [], settings: { ...DEFAULT_DECK_SETTINGS } };
        const idx = deckList.findIndex(d => d.id === deckId);
        if (idx >= 0) deckList[idx] = meta; else deckList.unshift(meta);
        saveDeckList();
        resetDeckState(deckId, deckData);
        startGame(deckId);
    }

    // --- 首頁渲染 ---
    function renderHomeScreen() {
        deckListContainer.innerHTML = '';
        if (deckList.length === 0) { noRecentDecks.classList.remove('hidden'); statsTotalDecks.textContent = '0'; statsTotalCards.textContent = '0'; return; }
        noRecentDecks.classList.add('hidden');
        
        let sorted = [...deckList];
        if (currentFilter.sortBy === 'title') sorted.sort((a,b) => a.title.localeCompare(b.title));
        else if (currentFilter.sortBy === 'progress') sorted.sort((a,b) => calculateProgress(b.id) - calculateProgress(a.id));
        else sorted.sort((a,b) => b.lastOpened - a.lastOpened);

        let totalCards = 0;
        sorted.forEach(deck => {
            totalCards += deck.totalCards;
            const progress = calculateProgress(deck.id);
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden";
            card.innerHTML = `
                <div class="absolute top-0 left-0 w-1 h-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-black text-neutral-900 dark:text-neutral-100 truncate pr-8">${deck.title}</h3>
                    <button class="options-btn p-1 text-neutral-400 hover:text-teal-500"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
                <div class="flex items-center text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
                    <span class="mr-3">${deck.totalCards} Cards</span>
                    <span class="bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded-full">${progress}% Mastered</span>
                </div>
                <div class="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div class="h-full bg-neutral-900 dark:bg-white transition-all duration-1000" style="width: ${progress}%"></div>
                </div>
            `;
            card.addEventListener('click', () => startGame(deck.id));
            card.querySelector('.options-btn').addEventListener('click', (e) => { e.stopPropagation(); openDeckOptions(deck.id); });
            deckListContainer.appendChild(card);
        });
        statsTotalDecks.textContent = deckList.length;
        statsTotalCards.textContent = totalCards;
    }

    function calculateProgress(deckId) {
        const state = getDeckState(deckId);
        if (state.size === 0) return 0;
        const mastered = Array.from(state.values()).filter(v => v.mastery === 5).length;
        return Math.floor((mastered / state.size) * 100);
    }

    // --- 其他功能 ---
    function openQuickStartModal() { quickStartModal.classList.remove('hidden'); hideAllMenus(); }
    function openSettingsModal() { settingsModal.classList.remove('hidden'); hideAllMenus(); renderTagList(); }
    function openHowToUseModal() { howToUseModal.classList.remove('hidden'); hideAllMenus(); }
    
    function applyCurrentDeckSettings() {
        fontSizeValue.textContent = currentDeckSettings.fontSize.toFixed(1);
        populateCardTagFilters();
        if (currentDeckSettings.filterTags) {
            currentDeckSettings.filterTags.forEach(t => {
                const cb = document.getElementById(`tag-filter-check-${t}`);
                if (cb) cb.checked = true;
            });
        }
    }

    function populateCardTagFilters() {
        cardTagFilterContainer.innerHTML = '';
        const tags = [...new Set(currentFullDeck.flatMap(c => c.tags || []))].sort();
        const untagged = createTagFilterCheckbox("未分類", "untagged");
        cardTagFilterContainer.appendChild(untagged);
        tags.forEach(t => cardTagFilterContainer.appendChild(createTagFilterCheckbox(t, t)));
    }

    function createTagFilterCheckbox(label, val) {
        const l = document.createElement('label');
        l.className = "flex items-center space-x-3 cursor-pointer py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl px-2 transition-colors";
        l.innerHTML = `<input type="checkbox" value="${val}" id="tag-filter-check-${val}" class="w-5 h-5 rounded-lg border-neutral-300 dark:border-neutral-700 text-teal-500 focus:ring-teal-500 dark:bg-neutral-800"><span class="text-sm font-bold text-neutral-600 dark:text-neutral-400">${label}</span>`;
        l.querySelector('input').addEventListener('change', () => {
            const selected = [];
            cardTagFilterContainer.querySelectorAll('input:checked').forEach(cb => selected.push(cb.value));
            currentDeckSettings.filterTags = selected;
            const d = deckList.find(dk => dk.id === currentDeckId);
            if (d) { d.settings = { ...currentDeckSettings }; saveDeckList(); }
            updateLearningDeck(); updateUI();
        });
        return l;
    }

    function changeDeckFontSize(step) {
        currentDeckSettings.fontSize = Math.min(Math.max(currentDeckSettings.fontSize + step, MIN_FONT_SIZE), MAX_FONT_SIZE);
        const d = deckList.find(dk => dk.id === currentDeckId);
        if (d) { d.settings = { ...currentDeckSettings }; saveDeckList(); }
        applyCurrentDeckSettings(); displayCardStack();
    }

    function showAllCardsView() { cardSearchInput.value = ''; allCardsModal.classList.remove('hidden'); hideAllMenus(); renderAllCardsTable(); }
    function renderAllCardsTable() {
        const q = cardSearchInput.value.toLowerCase().trim();
        let html = '<thead><tr class="text-neutral-400 dark:text-neutral-500 text-[10px] uppercase tracking-widest"><th class="p-4">Mastery</th>';
        const fields = currentFullDeck[0]?.fields.length || 0;
        for (let i = 1; i <= fields; i++) html += `<th class="p-4">Field ${i}</th>`;
        html += '</tr></thead><tbody>';
        const filtered = currentFullDeck.filter(c => !q || c.fields.some(f => f.toLowerCase().includes(q)) || (c.tags && c.tags.some(t => t.toLowerCase().includes(q))));
        filtered.forEach(c => {
            const m = currentCardStatus.get(c.card_id).mastery;
            html += `<tr class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"><td class="p-4"><div class="flex space-x-0.5">${Array.from({length:5}, (_,idx)=>`<div class="w-1.5 h-1.5 rounded-full ${idx<m?'bg-green-500':'bg-neutral-200 dark:bg-neutral-700'}"></div>`).join('')}</div></td>`;
            c.fields.forEach(f => html += `<td class="p-4 text-neutral-600 dark:text-neutral-400 font-medium">${f.replace(/<br>/g, ' ')}</td>`);
            html += '</tr>';
        });
        allCardsTable.innerHTML = html + '</tbody>';
    }

    // --- 其餘功能 ---
    function openDeckOptions(deckId) {
        const deck = deckList.find(d => d.id === deckId);
        deckOptionsTitle.textContent = `單字集選項: ${deck.title}`;
        deckTitleInput.value = deck.title;
        editingDeckId = deckId;
        renderDeckTagsOptions(deck);
        deckOptionsModal.classList.remove('hidden');
    }

    function renderDeckTagsOptions(deck) {
        deckTagsContainer.innerHTML = '';
        allTags.forEach(tag => {
            const label = document.createElement('label');
            label.className = "flex items-center space-x-2 p-1";
            const checked = deck.category && deck.category.includes(tag) ? 'checked' : '';
            label.innerHTML = `<input type="checkbox" value="${tag}" ${checked} class="w-4 h-4 text-teal-600 rounded"> <span>${tag}</span>`;
            deckTagsContainer.appendChild(label);
        });
    }

    function saveDeckOptions() {
        const deck = deckList.find(d => d.id === editingDeckId);
        deck.title = deckTitleInput.value.trim();
        const selectedTags = [];
        deckTagsContainer.querySelectorAll('input:checked').forEach(cb => selectedTags.push(cb.value));
        deck.category = selectedTags;
        saveDeckList();
        deckOptionsModal.classList.add('hidden');
        renderHomeScreen();
    }

    function deleteDeck() {
        if (confirm("確定刪除此單字集？")) {
            deckList = deckList.filter(d => d.id !== editingDeckId);
            localStorage.removeItem(STORAGE_KEYS.DECK_DATA_PREFIX + editingDeckId);
            localStorage.removeItem(STORAGE_KEYS.DECK_STATE_PREFIX + editingDeckId);
            saveDeckList();
            deckOptionsModal.classList.add('hidden');
            renderHomeScreen();
        }
    }

    function openEditDeckModal() {
        const data = getDeckData(currentDeckId);
        jsonEditorTextarea.value = JSON.stringify(data, null, 2);
        editDeckModal.classList.remove('hidden');
        hideAllMenus();
    }

    function saveDeckEdit() {
        try {
            const data = JSON.parse(jsonEditorTextarea.value);
            saveDeckData(currentDeckId, data);
            const deck = deckList.find(d => d.id === currentDeckId);
            deck.totalCards = data.length;
            deck.fieldCount = data[0].fields.length;
            saveDeckList();
            startGame(currentDeckId);
            editDeckModal.classList.add('hidden');
        } catch (e) { jsonEditorError.textContent = "JSON 錯誤"; }
    }

    function renderTagList() {
        tagListContainer.innerHTML = '';
        allTags.forEach(tag => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg";
            div.innerHTML = `<span>${tag}</span><button class="text-red-500"><span class="material-symbols-outlined">delete</span></button>`;
            div.querySelector('button').addEventListener('click', () => {
                allTags = allTags.filter(t => t !== tag);
                saveAllTags(); renderTagList();
            });
            tagListContainer.appendChild(div);
        });
    }

    function addNewTag() {
        const tag = newTagInput.value.trim();
        if (tag && !allTags.includes(tag)) {
            allTags.push(tag);
            saveAllTags();
            newTagInput.value = '';
            renderTagList();
        }
    }

    function backupAllData() {
        const zip = new JSZip();
        zip.file("deckList.json", JSON.stringify(deckList));
        zip.file("allTags.json", JSON.stringify(allTags));
        deckList.forEach(d => {
            zip.file(`data_${d.id}.json`, JSON.stringify(getDeckData(d.id)));
            zip.file(`state_${d.id}.json`, JSON.stringify(Object.fromEntries(getDeckState(d.id))));
        });
        zip.generateAsync({type:"blob"}).then(content => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = `FlipDeck_Backup.zip`;
            a.click();
        });
    }

    function openDeckEditor(deckId = null) {
        editingDeckId = deckId; editorRowsContainer.innerHTML = '';
        if (deckId) {
            const meta = deckList.find(d => d.id === deckId);
            const data = getDeckData(deckId);
            editorDeckTitle.value = meta.title;
            editorFieldCount.value = meta.fieldCount;
            data.forEach(c => renderEditorRow(c.fields));
        } else {
            editorDeckTitle.value = ''; editorFieldCount.value = 2; renderEditorRow();
        }
        deckEditorModal.classList.remove('hidden'); hideAllMenus();
    }

    function renderEditorRows() { editorRowsContainer.innerHTML = ''; renderEditorRow(); }
    function renderEditorRow(vals = []) {
        const count = parseInt(editorFieldCount.value);
        const row = document.createElement('div');
        row.className = "flex items-center space-x-2 p-2 border-b dark:border-neutral-800";
        let html = '';
        for (let i=0; i<count; i++) html += `<input type="text" class="flex-grow p-2 border dark:bg-neutral-900 dark:border-neutral-800 rounded text-sm" value="${vals[i]||''}">`;
        row.innerHTML = html + `<button class="text-neutral-400"><span class="material-symbols-outlined">delete</span></button>`;
        row.querySelector('button').addEventListener('click', () => row.remove());
        editorRowsContainer.appendChild(row);
    }

    function saveDeckFromEditor() {
        const title = editorDeckTitle.value.trim();
        if (!title) return;
        const cards = [];
        editorRowsContainer.querySelectorAll('.flex').forEach(row => {
            const fields = [];
            row.querySelectorAll('input').forEach(input => fields.push(input.value.trim()));
            if (fields.some(f => f)) cards.push({ card_id: `card_${Date.now()}_${crypto.randomUUID()}`, fields, tags: [], notes: "" });
        });
        if (cards.length === 0) return;
        processNewDeck(cards, editingDeckId || `deck_${Date.now()}`, title, "editor");
        deckEditorModal.classList.add('hidden');
    }

    function downloadData(format) {
        const data = getDeckData(currentDeckId);
        let content, mime, ext;
        if (format === 'json') { content = JSON.stringify(data, null, 2); mime = "application/json"; ext = "json"; }
        else if (format === 'csv') { content = data.map(c => c.fields.join(';')).join('\n'); mime = "text/csv"; ext = "csv"; }
        else { content = data.map(c => c.fields.join(' ; ')).join('\n'); mime = "text/plain"; ext = "txt"; }
        const b = new Blob([content], {type:mime});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `Deck.${ext}`;
        a.click();
    }

    initializeApp();
});
