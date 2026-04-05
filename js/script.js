// ===== PWA Service Worker 註冊 =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW 註冊成功'))
            .catch(err => console.log('SW 註冊失敗'));
    });
}

// ===== FlipDeck v4.1.0 (Strict Fix Mode) =====
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM 元素讀取 ---
    const homeScreen = document.getElementById('home-screen');
    const mainScreen = document.getElementById('main-screen');
    const quickStartModal = document.getElementById('quick-start-modal');
    const closeQuickStartModalBtn = document.getElementById('close-quick-start-modal-btn');
    const fileUpload = document.getElementById('file-upload');
    const exampleSelector = document.getElementById('example-selector');
    const loadExampleBtn = document.getElementById('load-example-btn');
    const quickStartErrorMessage = document.getElementById('quick-start-error-message');
    
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
    const historyAlert = document.getElementById('history-alert');
    
    const menuOverlay = document.getElementById('menu-overlay');
    const homeMenuPanel = document.getElementById('home-menu-panel');
    const homeMenuHomeBtn = document.getElementById('home-menu-home-btn');
    const homeMenuAddBtn = document.getElementById('home-menu-add-btn');
    const createNewDeckBtn = document.getElementById('create-new-deck-btn');
    const homeMenuFullscreenBtn = document.getElementById('home-menu-fullscreen-btn');
    const homeMenuCloseBtn = document.getElementById('home-menu-close-btn');
    const backupAllBtn = document.getElementById('backup-all-btn');
    const manageTagsBtn = document.getElementById('manage-tags-btn');
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
    const downloadModal = document.getElementById('download-modal');
    const closeDownloadModalBtn = document.getElementById('close-download-modal-btn');
    const howToUseModal = document.getElementById('how-to-use-modal');
    const closeHowToUseModalBtn = document.getElementById('close-how-to-use-modal-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
    const newTagInput = document.getElementById('new-tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagListContainer = document.getElementById('tag-list-container');
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
    const deckTagsContainer = document.getElementById('deck-tags-container'); 
    const saveDeckOptionsBtn = document.getElementById('save-deck-options-btn'); 
    const deleteDeckBtn = document.getElementById('delete-deck-btn');
    
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

    // --- 狀態定義 ---
    const STORAGE_KEYS = {
        PREFERENCES: 'flashcardPWA_prefs_v2',
        DECK_LIST: 'flashcardPWA_deckList_v2', 
        ALL_TAGS: 'flashcardPWA_allTags_v2',
        DECK_DATA_PREFIX: 'flashcardPWA_data_v2_',
        DECK_STATE_PREFIX: 'flashcardPWA_state_v2_'
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
    let swipeMoveHandler = null, swipeUpHandler = null;

    const DEFAULT_DECK_SETTINGS = { fontSize: 2.5, filterTags: [] };

    // =================================================================
    // ===== 核心儲存邏輯 =====
    // =================================================================

    function initializeApp() {
        const savedDecks = localStorage.getItem(STORAGE_KEYS.DECK_LIST);
        deckList = savedDecks ? JSON.parse(savedDecks) : [];
        const savedTags = localStorage.getItem(STORAGE_KEYS.ALL_TAGS);
        allTags = savedTags ? JSON.parse(savedTags) : [];
        
        populateExampleSelector();
        renderHomeScreen();
        bindEventListeners();
    }

    function saveDeckList() { localStorage.setItem(STORAGE_KEYS.DECK_LIST, JSON.stringify(deckList)); }
    function saveAllTags() { localStorage.setItem(STORAGE_KEYS.ALL_TAGS, JSON.stringify(allTags)); }
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
        
        currentFullDeck.forEach(c => {
            if (!currentCardStatus.has(c.card_id) || typeof currentCardStatus.get(c.card_id) !== 'object') {
                currentCardStatus.set(c.card_id, { mastery: 1, lastTime: Date.now() });
            }
        });
        
        updateLearningDeck(); 
        history = []; historyIndex = -1; upcomingQueue = [];
        fillUpcomingQueue();
        
        meta.lastOpened = Date.now(); saveDeckList();
        showScreen('main'); showNextCard('new_game');
    }

    function updateLearningDeck() {
        let filtered = currentFullDeck;
        if (currentDeckSettings.filterTags?.length > 0) {
            filtered = currentFullDeck.filter(c => {
                const ts = c.tags || [];
                return currentDeckSettings.filterTags.some(t => t === 'untagged' ? ts.length === 0 : ts.includes(t));
            });
        }
        currentLearningDeck = filtered.filter(c => currentCardStatus.get(c.card_id).mastery < 5);
        currentLearningDeck.sort((a, b) => {
            const mA = currentCardStatus.get(a.card_id).mastery, mB = currentCardStatus.get(b.card_id).mastery;
            return mA !== mB ? mA - mB : Math.random() - 0.5;
        });
    }

    function fillUpcomingQueue() {
        while (upcomingQueue.length < 5 && currentLearningDeck.length > 0) {
            const pool = currentLearningDeck.slice(0, 10);
            const card = pool[Math.floor(Math.random() * pool.length)];
            if (!upcomingQueue.includes(card.card_id)) upcomingQueue.push(card.card_id);
            else if (currentLearningDeck.length <= upcomingQueue.length) break;
        }
    }

    function showNextCard(action) {
        if (historyIndex >= 0 && historyIndex < history.length) {
            const id = history[historyIndex], state = currentCardStatus.get(id);
            if (action === 'correct') {
                state.mastery = Math.min(state.mastery + 1, 5);
                if (state.mastery === 5) updateLearningDeck();
            } else if (action === 'incorrect') {
                state.mastery = 1;
            }
            state.lastTime = Date.now();
            currentCardStatus.set(id, state);
        }

        if (historyIndex < history.length - 1) {
            historyIndex++;
        } else {
            if (upcomingQueue.length === 0) {
                if (currentLearningDeck.length === 0) { displayEndOfDeck(); return; }
                fillUpcomingQueue();
            }
            const nextId = upcomingQueue.shift();
            history.push(nextId);
            if (history.length > MAX_HISTORY) history.shift();
            historyIndex = history.length - 1;
            fillUpcomingQueue();
        }
        displayCardStack(); updateUI(); saveDeckState(currentDeckId, currentCardStatus);
    }

    function displayCardStack() {
        cardStackContainer.innerHTML = '';
        const visible = [];
        if (historyIndex >= 0) visible.push(currentFullDeck.find(c => c.card_id === history[historyIndex]));
        
        if (historyIndex === history.length - 1) {
            for (let i = 0; i < 2 && upcomingQueue[i]; i++) visible.push(currentFullDeck.find(c => c.card_id === upcomingQueue[i]));
        } else {
            for (let i = 1; i <= 2 && history[historyIndex + i]; i++) visible.push(currentFullDeck.find(c => c.card_id === history[historyIndex + i]));
        }

        for (let i = visible.length - 1; i >= 0; i--) {
            const data = visible[i], isTop = (i === 0);
            const cardEl = document.createElement('div');
            cardEl.className = `combo-card absolute w-full h-full transition-all duration-400 ease-out ${isTop ? 'z-[30]' : 'pointer-events-none'}`;
            cardEl.style.transform = `translateY(${i * 16}px) scale(${1 - i * 0.05})`;
            cardEl.style.opacity = 1 - i * 0.2;
            
            if (isTop) {
                cardEl.id = 'active-combo-card';
                cardEl.innerHTML = `
                    <div id="stamp-forgot" class="stamp"><span class="material-symbols-outlined !text-5xl">close</span></div>
                    <div id="stamp-learned" class="stamp"><span class="material-symbols-outlined !text-5xl">check</span></div>
                    <div class="card-inner">
                        <div class="absolute inset-0 backface-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm flex items-center justify-center p-8">
                            <div class="card-content text-center text-neutral-900 dark:text-neutral-100 font-bold" style="font-size: ${currentDeckSettings.fontSize}rem">${data.fields[0]}</div>
                        </div>
                        <div class="absolute inset-0 backface-hidden rotate-y-180 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
                            <div class="card-content font-bold mb-4" style="font-size: ${currentDeckSettings.fontSize * 0.8}rem">${data.fields[1] || ''}</div>
                            <div class="text-neutral-400 dark:text-neutral-500 text-sm leading-relaxed">${data.fields.slice(2).join('<br>')}</div>
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
        let isDragging = false, startX = 0, dragX = 0, lastX = 0, lastTime = 0, velocity = 0, startTime = 0;

        if (swipeMoveHandler) window.removeEventListener('pointermove', swipeMoveHandler);
        if (swipeUpHandler) window.removeEventListener('pointerup', swipeUpHandler);

        card.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            isDragging = true; startX = lastX = e.clientX; lastTime = startTime = Date.now();
            card.style.transition = 'none'; card.setPointerCapture(e.pointerId);
        });

        swipeMoveHandler = (e) => {
            if (!isDragging) return;
            const now = Date.now(), dt = now - lastTime;
            if (dt > 0) velocity = (e.clientX - lastX) / dt;
            dragX = e.clientX - startX; lastX = e.clientX; lastTime = now;
            card.style.transform = `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`;
            const op = Math.min(Math.abs(dragX) / 120, 1);
            if (dragX > 0) {
                sLearned.style.opacity = op; sForgot.style.opacity = 0;
                bgLearned.style.opacity = op; bgForgot.style.opacity = 0;
            } else {
                sForgot.style.opacity = op; sLearned.style.opacity = 0;
                bgForgot.style.opacity = op; bgLearned.style.opacity = 0;
            }
        };

        swipeUpHandler = (e) => {
            if (!isDragging) return;
            isDragging = false;
            if (Math.abs(velocity) > 0.5 || Math.abs(dragX) > 100) {
                const dir = dragX > 0 ? 1 : -1;
                card.classList.add('transition-exit');
                card.style.transform = `translateX(${dir * 1000}px) rotate(${dir * 45}deg)`;
                card.style.opacity = '0';
                bgForgot.style.opacity = bgLearned.style.opacity = 0;
                setTimeout(() => showNextCard(dir > 0 ? 'correct' : 'incorrect'), 250);
            } else {
                card.classList.add('transition-snap-back');
                card.style.transform = `translateX(0px) rotate(0deg)`;
                sForgot.style.opacity = sLearned.style.opacity = bgForgot.style.opacity = bgLearned.style.opacity = 0;
                if (Math.abs(dragX) < 10 && (Date.now() - startTime) < 300) inner.classList.toggle('rotate-y-180');
                setTimeout(() => card.classList.remove('transition-snap-back'), 400);
            }
        };

        card.addEventListener('pointermove', swipeMoveHandler);
        card.addEventListener('pointerup', swipeUpHandler);
        card.addEventListener('pointercancel', swipeUpHandler);
    }

    function updateUI() {
        const states = Array.from(currentCardStatus.values());
        const total = currentFullDeck.length;
        const totalMasteryPoints = states.reduce((acc, s) => acc + (s.mastery - 1), 0);
        const progress = total > 0 ? Math.floor((totalMasteryPoints / (total * 4)) * 100) : 0;
        
        const mastered = states.filter(v => v.mastery === 5).length;
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
        menuBtn.onclick = (e) => { e.stopPropagation(); toggleMenu('deck'); };
        menuOverlay.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 首頁選單內按鈕 ---
        homeMenuHomeBtn.onclick = (e) => { e.stopPropagation(); backToHomeScreen(); hideAllMenus(); };
        homeMenuAddBtn.onclick = (e) => { e.stopPropagation(); openQuickStartModal(); };
        homeMenuFullscreenBtn.onclick = (e) => { e.stopPropagation(); toggleFullScreen(); };
        createNewDeckBtn.onclick = (e) => { e.stopPropagation(); openDeckEditor(); hideAllMenus(); };
        backupAllBtn.onclick = (e) => { e.stopPropagation(); backupAllData(); };
        manageTagsBtn.onclick = (e) => { e.stopPropagation(); openSettingsModal(); };
        showHowToUseBtn.onclick = (e) => { e.stopPropagation(); openHowToUseModal(); };
        homeMenuCloseBtn.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 學習選單內按鈕 ---
        deckMenuHomeBtn.onclick = (e) => { e.stopPropagation(); backToHomeScreen(); hideAllMenus(); };
        deckMenuAddBtn.onclick = (e) => { e.stopPropagation(); openQuickStartModal(); };
        deckMenuDownloadBtn.onclick = (e) => { e.stopPropagation(); downloadModal.classList.remove('hidden'); hideAllMenus(); };
        showAllBtn.onclick = (e) => { e.stopPropagation(); showAllCardsView(); };
        visualEditDeckBtn.onclick = (e) => { e.stopPropagation(); openDeckEditor(currentDeckId); hideAllMenus(); };
        editDeckBtn.onclick = (e) => { e.stopPropagation(); openEditDeckModal(); };
        fontSizeIncrease.onclick = (e) => { e.stopPropagation(); changeDeckFontSize(0.2); };
        fontSizeDecrease.onclick = (e) => { e.stopPropagation(); changeDeckFontSize(-0.2); };
        deckMenuCloseBtn.onclick = (e) => { e.stopPropagation(); hideAllMenus(); };

        // --- 其他全域事件 ---
        fileUpload.onchange = handleFileUpload;
        loadExampleBtn.onclick = handleExampleLoad;
        sortBySelect.onchange = (e) => { currentFilter.sortBy = e.target.value; renderHomeScreen(); };
        
        window.onkeydown = (e) => {
            if (!mainScreen.classList.contains('hidden')) {
                if (e.key === 'ArrowRight') showNextCard('correct');
                else if (e.key === 'ArrowLeft') showNextCard('incorrect');
                else if (e.key === ' ') { 
                    const ac = document.getElementById('active-combo-card');
                    if (ac) ac.querySelector('.card-inner').classList.toggle('rotate-y-180');
                }
            }
        };

        // --- Modal 關閉按鈕 ---
        closeQuickStartModalBtn.onclick = () => quickStartModal.classList.add('hidden');
        closeModalBtn.onclick = () => allCardsModal.classList.add('hidden');
        closeDownloadModalBtn.onclick = () => downloadModal.classList.add('hidden');
        closeHowToUseModalBtn.onclick = () => howToUseModal.classList.add('hidden');
        closeSettingsModalBtn.onclick = () => settingsModal.classList.add('hidden');
        closeEditDeckModalBtn.onclick = () => editDeckModal.classList.add('hidden');
        closeDeckOptionsModalBtn.onclick = () => deckOptionsModal.classList.add('hidden');
        cardSearchInput.oninput = renderAllCardsTable;
    }

    // =================================================================
    // ===== 輔助渲染與功能 (簡化) =====
    // =================================================================

    function showScreen(s) { 
        [homeScreen, mainScreen].forEach(el => el.classList.add('hidden'));
        document.getElementById(s + '-screen').classList.remove('hidden');
    }

    function backToHomeScreen() { currentDeckId = null; showScreen('home'); renderHomeScreen(); }

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

    function toggleFullScreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    }

    function handleFileUpload(e) {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
            const data = f.name.endsWith('.json') ? JSON.parse(ev.target.result) : ev.target.result.trim().split('\n').map((l, i) => ({ card_id: `c_${Date.now()}_${i}`, fields: l.split(';').map(s => s.trim().replace(/\/\//g, '<br>')), tags: [] }));
            processNewDeck(data, `d_${Date.now()}`, f.name.split('.')[0]);
            quickStartModal.classList.add('hidden');
        };
        r.readAsText(f);
    }

    function handleExampleLoad() {
        const f = exampleSelector.value; if (!f) return;
        fetch(`data/${f}`).then(r => r.json()).then(data => {
            processNewDeck(data, `ex_${f.split('.')[0]}`, exampleSelector.selectedOptions[0].text);
            quickStartModal.classList.add('hidden');
        });
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
        
        let sorted = [...deckList];
        if (currentFilter.sortBy === 'title') sorted.sort((a,b) => a.title.localeCompare(b.title));
        else if (currentFilter.sortBy === 'progress') sorted.sort((a,b) => b.progress - a.progress);
        else sorted.sort((a,b) => b.lastOpened - a.lastOpened);

        sorted.forEach(d => {
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 cursor-pointer group relative overflow-hidden";
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-black text-neutral-900 dark:text-neutral-100 truncate pr-8">${d.title}</h3>
                    <button class="options-btn p-1 text-neutral-400 hover:text-neutral-900"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
                <div class="flex items-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                    <span>${d.totalCards} Cards • ${d.progress || 0}% Mastered</span>
                </div>
                <div class="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div class="h-full bg-neutral-900 dark:bg-white transition-all duration-1000" style="width: ${d.progress || 0}%"></div>
                </div>
            `;
            card.onclick = () => startGame(d.id);
            card.querySelector('.options-btn').onclick = (e) => { e.stopPropagation(); openDeckOptions(d.id); };
            deckListContainer.appendChild(card);
        });
        statsTotalDecks.textContent = deckList.length;
        statsTotalCards.textContent = deckList.reduce((acc, d) => acc + d.totalCards, 0);
    }

    function calculateProgress(id) {
        const s = getDeckState(id); if (s.size === 0) return 0;
        const points = Array.from(s.values()).reduce((acc, v) => acc + (v.mastery - 1), 0);
        return Math.floor((points / (s.size * 4)) * 100);
    }

    function openQuickStartModal() { quickStartModal.classList.remove('hidden'); hideAllMenus(); }
    function openSettingsModal() { settingsModal.classList.remove('hidden'); hideAllMenus(); }
    function openHowToUseModal() { howToUseModal.classList.remove('hidden'); hideAllMenus(); }
    
    function applyCurrentDeckSettings() {
        fontSizeValue.textContent = currentDeckSettings.fontSize.toFixed(1);
        populateCardTagFilters();
    }

    function populateCardTagFilters() {
        cardTagFilterContainer.innerHTML = '';
        const tags = [...new Set(currentFullDeck.flatMap(c => c.tags || []))].sort();
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
        let html = '<thead><tr class="text-neutral-400 text-[10px] uppercase tracking-widest"><th class="p-4">Mastery</th>';
        const fields = currentFullDeck[0]?.fields.length || 0;
        for (let i = 1; i <= fields; i++) html += `<th class="p-4">Field ${i}</th>`;
        html += '</tr></thead><tbody>';
        currentFullDeck.filter(c => !q || c.fields.some(f => f.toLowerCase().includes(q))).forEach(c => {
            const m = currentCardStatus.get(c.card_id).mastery;
            html += `<tr class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"><td class="p-4"><div class="flex space-x-0.5">${Array.from({length:5}, (_,idx)=>`<div class="w-1.5 h-1.5 rounded-full ${idx<m?'bg-neutral-900 dark:bg-white':'bg-neutral-200 dark:bg-neutral-700'}"></div>`).join('')}</div></td>`;
            c.fields.forEach(f => html += `<td class="p-4 text-neutral-600 dark:text-neutral-400 font-medium">${f.replace(/<br>/g, ' ')}</td>`);
            html += '</tr>';
        });
        allCardsTable.innerHTML = html + '</tbody>';
    }

    // --- 其餘 Modal 邏輯 (簡化) ---
    function openDeckOptions(id) { /* ... */ }
    function saveDeckOptions() { /* ... */ }
    function deleteDeck() { /* ... */ }
    function openEditDeckModal() { /* ... */ }
    function saveDeckEdit() { /* ... */ }
    function openDeckEditor(id = null) { /* ... */ }
    function renderEditorRow(vals = []) { /* ... */ }
    function saveDeckFromEditor() { /* ... */ }
    function backupAllData() { /* ... */ }
    function downloadData(fmt) { /* ... */ }

    initializeApp();
});
