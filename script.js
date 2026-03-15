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

// ===== 應用程式腳本 (v3.1.0) =====
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
    const filterTagContainer = document.getElementById('filter-tag-container');
    const deckListContainer = document.getElementById('deck-list-container');
    const noRecentDecks = document.getElementById('no-recent-decks');
    // 學習畫面
    const cardContainer = document.getElementById('card-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const correctBtn = document.getElementById('correct-btn');
    const incorrectBtn = document.getElementById('incorrect-btn');
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
    const menuBtn = document.getElementById('menu-btn'); // 學習畫面的 ☰
    const menuPanel = document.getElementById('menu-panel'); // 學習中選單
    const deckMenuHomeBtn = document.getElementById('deck-menu-home-btn');
    const deckMenuAddBtn = document.getElementById('deck-menu-add-btn');
    const deckMenuFullscreenBtn = document.getElementById('deck-menu-fullscreen-btn');
    const deckMenuDownloadBtn = document.getElementById('deck-menu-download-btn');
    const deckMenuCloseBtn = document.getElementById('deck-menu-close-btn');
    const showAllBtn = document.getElementById('show-all-btn');
    const visualEditDeckBtn = document.getElementById('visual-edit-deck-btn');
    const editDeckBtn = document.getElementById('edit-deck-btn');
    const toggleLayoutBtn = document.getElementById('toggle-layout-btn');
    const autoRevealOptionsContainer = document.getElementById('auto-reveal-options-container'); 
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    const fontSizeValue = document.getElementById('font-size-value');
    // 圖形化編輯器
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
    // Modals
    const allCardsModal = document.getElementById('all-cards-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const allCardsTable = document.getElementById('all-cards-table');
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


    // --- LocalStorage Keys ---
    const STORAGE_KEYS = {
        PREFERENCES: 'flashcardPWA_prefs_v2',
        DECK_LIST: 'flashcardPWA_deckList_v2', 
        ALL_TAGS: 'flashcardPWA_allTags_v2',
        DECK_DATA_PREFIX: 'flashcardPWA_data_v2_',
        DECK_STATE_PREFIX: 'flashcardPWA_state_v2_'
    };
    
    // --- 範例檔案 ---
    const EXAMPLES = [
        { name: "動詞三態", file: "verbs.json" },
        { name: "元素週期表", file: "elements.json" },
        { name: "國家與首都", file: "capitals.json" }
    ];

    // --- 應用程式狀態 ---
    let globalPreferences = {}; 
    let deckList = []; 
    let allTags = [];
    let currentFilter = {
        sortBy: 'lastOpened',
        filterTag: null
    };
    let currentDeckId = null;
    let currentFullDeck = [];
    let currentLearningDeck = [];
    let currentCardStatus = new Map();
    let currentDeckSettings = {};
    let history = []; 
    let historyIndex = -1;
    const MAX_HISTORY = 20;

    // --- 偏好設定預設值 ---
    const DEFAULT_GLOBAL_PREFERENCES = {
        cardLayout: 'horizontal'
    };
    const DEFAULT_DECK_SETTINGS = { 
        fontSize: 2.5,
        autoRevealIndices: [] 
    };
    const FONT_SIZE_STEP = 0.2;
    const MIN_FONT_SIZE = 1.0;
    const MAX_FONT_SIZE = 5.0;

    
    // =================================================================
    // ===== 應用程式初始化
    // =================================================================
    
    function initializeApp() {
        loadGlobalPreferences();
        loadAllTags();
        loadDeckList(); 
        migrateDeckListSettings(); 
        populateExampleSelector();
        renderHomeScreen();
        bindEventListeners();
        showScreen('home');
    }

    function bindEventListeners() {
        // 首頁
        homeMenuBtn.addEventListener('click', () => toggleMenu('home')); 
        fileUpload.addEventListener('change', handleFileUpload);
        loadExampleBtn.addEventListener('click', handleExampleLoad);
        sortBySelect.addEventListener('change', (e) => {
            currentFilter.sortBy = e.target.value;
            renderDeckList();
        });

        // 學習畫面
        menuBtn.addEventListener('click', () => toggleMenu('deck')); 
        prevBtn.addEventListener('click', showPrevCard);
        nextBtn.addEventListener('click', () => showNextCard('unjudged'));
        correctBtn.addEventListener('click', () => showNextCard('correct'));
        incorrectBtn.addEventListener('click', () => showNextCard('incorrect'));
        mainScreen.addEventListener('click', (e) => { if (e.target === mainScreen) showNextCard('unjudged'); });
        
        // 通用
        menuOverlay.addEventListener('click', hideAllMenus);
        const allFullscreenBtns = [homeMenuFullscreenBtn, deckMenuFullscreenBtn];
        allFullscreenBtns.forEach(btn => btn.addEventListener('click', toggleFullScreen));
        const allAddBtns = [homeMenuAddBtn, deckMenuAddBtn];
        allAddBtns.forEach(btn => btn.addEventListener('click', openQuickStartModal));
        const allHomeBtns = [homeMenuHomeBtn, deckMenuHomeBtn];
        allHomeBtns.forEach(btn => btn.addEventListener('click', () => { backToHomeScreen(); hideAllMenus(); }));
        
        // 首頁選單
        homeMenuCloseBtn.addEventListener('click', () => toggleMenu('home')); 
        createNewDeckBtn.addEventListener('click', () => { openDeckEditor(); hideAllMenus(); });
        backupAllBtn.addEventListener('click', backupAllData);
        manageTagsBtn.addEventListener('click', openSettingsModal);
        showHowToUseBtn.addEventListener('click', openHowToUseModal);
        
        // 學習中選單
        deckMenuCloseBtn.addEventListener('click', () => toggleMenu('deck')); 
        deckMenuDownloadBtn.addEventListener('click', () => { downloadModal.classList.remove('hidden'); hideAllMenus(); });
        showAllBtn.addEventListener('click', showAllCardsView);
        visualEditDeckBtn.addEventListener('click', () => { openDeckEditor(currentDeckId); hideAllMenus(); });
        editDeckBtn.addEventListener('click', openEditDeckModal);
        toggleLayoutBtn.addEventListener('click', toggleCardLayout);
        autoRevealOptionsContainer.addEventListener('change', saveAutoRevealOptions); 
        fontSizeIncrease.addEventListener('click', () => changeDeckFontSize(FONT_SIZE_STEP));
        fontSizeDecrease.addEventListener('click', () => changeDeckFontSize(-FONT_SIZE_STEP));
        
        // 圖形編輯器
        closeDeckEditorModalBtn.addEventListener('click', () => deckEditorModal.classList.add('hidden'));
        editorCancelBtn.addEventListener('click', () => deckEditorModal.classList.add('hidden'));
        editorAddRowBtn.addEventListener('click', () => renderEditorRow());
        editorApplyFieldsBtn.addEventListener('click', () => {
            if (confirm("變更欄位數量會清空目前編輯中的內容，確定嗎？")) {
                renderEditorRows();
            }
        });
        editorSaveBtn.addEventListener('click', saveDeckFromEditor);

        // Modals
        closeQuickStartModalBtn.addEventListener('click', () => quickStartModal.classList.add('hidden'));
        closeModalBtn.addEventListener('click', () => allCardsModal.classList.add('hidden'));
        closeDownloadModalBtn.addEventListener('click', () => downloadModal.classList.add('hidden'));
        document.querySelectorAll('.download-format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => downloadData(e.target.dataset.format));
        });
        closeHowToUseModalBtn.addEventListener('click', () => howToUseModal.classList.add('hidden'));
        closeSettingsModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
        addTagBtn.addEventListener('click', addNewTag);
        newTagInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNewTag(); });
        closeEditDeckModalBtn.addEventListener('click', () => editDeckModal.classList.add('hidden'));
        cancelEditDeckBtn.addEventListener('click', () => editDeckModal.classList.add('hidden'));
        saveEditDeckBtn.addEventListener('click', saveDeckEdit);
        closeDeckOptionsModalBtn.addEventListener('click', () => deckOptionsModal.classList.add('hidden'));
    }

    initializeApp();

    
    // =================================================================
    // ===== 畫面與選單管理
    // =================================================================
    
    function showScreen(screenName) {
        hideAllMenus(); 
        homeScreen.classList.add('hidden');
        mainScreen.classList.add('hidden');
        mainScreen.classList.remove('flex'); 

        if (screenName === 'home') {
            homeScreen.classList.remove('hidden');
            homeMenuBtn.classList.remove('hidden'); 
            menuBtn.classList.add('hidden'); 
        } else if (screenName === 'main') {
            mainScreen.classList.remove('hidden');
            mainScreen.classList.add('flex');
            homeMenuBtn.classList.add('hidden'); 
            menuBtn.classList.remove('hidden'); 
        }
    }
    
    function toggleMenu(menuType) {
        const panel = (menuType === 'home') ? homeMenuPanel : menuPanel;
        const button = (menuType === 'home') ? homeMenuBtn : menuBtn;
        const isOpen = panel.classList.contains('open');
        
        hideAllMenus(); // 先關閉所有
        
        if (!isOpen) {
            panel.classList.add('open');
            menuOverlay.classList.remove('hidden');
            button.classList.add('hidden'); 
        }
    }
    
    function hideAllMenus() {
        homeMenuPanel.classList.remove('open');
        menuPanel.classList.remove('open');
        menuOverlay.classList.add('hidden');
        
        if (homeScreen.classList.contains('hidden')) {
            menuBtn.classList.remove('hidden');
            homeMenuBtn.classList.add('hidden');
        } else {
            homeMenuBtn.classList.remove('hidden');
            menuBtn.classList.add('hidden');
        }
    }

    function backToHomeScreen() {
        resetLearningState();
        showScreen('home');
        renderHomeScreen(); 
    }
    
    function openQuickStartModal() {
        quickStartErrorMessage.textContent = '';
        quickStartModal.classList.remove('hidden');
        hideAllMenus();
    }
    
    function openHowToUseModal() {
        howToUseModal.classList.remove('hidden');
        hideAllMenus();
    }

    // =================================================================
    // ===== 首頁：渲染與資料處理
    // =================================================================

    function renderHomeScreen() {
        let totalCards = 0;
        deckList.forEach(deck => totalCards += deck.totalCards);
        statsTotalDecks.textContent = deckList.length;
        statsTotalCards.textContent = totalCards;
        renderFilterTags();
        renderDeckList();
    }

    function renderFilterTags() {
        filterTagContainer.innerHTML = '';
        if (allTags.length === 0) return;
        
        const allTagBtn = createTagBadge("全部", null);
        filterTagContainer.appendChild(allTagBtn);
        
        allTags.forEach(tag => {
            const tagBtn = createTagBadge(tag, tag);
            filterTagContainer.appendChild(tagBtn);
        });
    }
    
    function createTagBadge(tagName, filterValue) {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag-badge';
        tagEl.textContent = tagName;
        tagEl.dataset.tag = filterValue || 'null';
        
        if (currentFilter.filterTag === filterValue) {
            tagEl.classList.add('active-filter');
        }
        
        tagEl.addEventListener('click', () => {
            currentFilter.filterTag = filterValue;
            renderDeckList(); 
            document.querySelectorAll('#filter-tag-container .tag-badge').forEach(btn => {
                btn.classList.toggle('active-filter', btn.dataset.tag === (filterValue || 'null'));
            });
        });
        return tagEl;
    }

    function renderDeckList() {
        deckListContainer.innerHTML = ''; 
        
        const decksWithProgress = deckList.map(deck => {
            const state = getDeckState(deck.id);
            const correctCount = Array.from(state.values()).filter(s => s === 'correct').length;
            const progress = (deck.totalCards > 0) ? (correctCount / deck.totalCards) : 0;
            return { ...deck, correctCount, progress };
        });
        
        let filteredDecks = decksWithProgress;
        if (currentFilter.filterTag) {
            filteredDecks = filteredDecks.filter(deck => 
                deck.category && deck.category.includes(currentFilter.filterTag)
            );
        }
        
        filteredDecks.sort((a, b) => {
            switch (currentFilter.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title, 'zh-Hant');
                case 'progress':
                    return b.progress - a.progress;
                case 'lastOpened':
                default:
                    return b.lastOpened - a.lastOpened;
            }
        });

        if (filteredDecks.length === 0) {
            noRecentDecks.classList.remove('hidden');
            if (currentFilter.filterTag) {
                noRecentDecks.textContent = `沒有符合「${currentFilter.filterTag}」標籤的單字集。`;
            } else {
                noRecentDecks.innerHTML = `尚未開啟任何單字集。<br>點擊左上角選單中的 ＋ 按鈕來新增。`;
            }
            return;
        }
        
        noRecentDecks.classList.add('hidden');
        
        filteredDecks.forEach(deck => {
            const deckEl = document.createElement('div');
            deckEl.className = "block p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border dark:border-gray-600";
            
            const timeAgo = formatTimeAgo(deck.lastOpened);
            const progressPercent = (deck.progress * 100).toFixed(0);
            const fieldCount = deck.fieldCount || 'N/A';

            let tagsHTML = '';
            if (deck.category && deck.category.length > 0) {
                tagsHTML = deck.category.map(tag => `<span class="tag-badge !cursor-default">${tag}</span>`).join(' ');
            }

            deckEl.innerHTML = `
                <div class="flex justify-between items-start">
                    <a href="#" class="deck-start-btn flex-grow group pr-2" data-deck-id="${deck.id}">
                        <h3 class="font-bold text-lg text-teal-600 dark:text-teal-400 group-hover:underline break-all">${deck.title}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">來源: ${deck.sourceFileName}</p>
                    </a>
                    <button class="deck-options-btn p-2 -mr-2 -mt-2 flex-shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" data-deck-id="${deck.id}">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                <div class="my-3">
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div class="bg-teal-500 h-2.5 rounded-full" style="width: ${progressPercent}%"></div>
                    </div>
                    <p class="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">進度: ${deck.correctCount} / ${deck.totalCards} (${progressPercent}%)</p>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end">
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                        <p>欄位數: ${fieldCount}</p>
                        <p>上次閱讀: ${timeAgo}</p>
                    </div>
                    <div class="text-left sm:text-right">
                        ${tagsHTML}
                    </div>
                </div>
            `;
            
            deckEl.querySelector('.deck-start-btn').addEventListener('click', (e) => {
                e.preventDefault();
                startGame(deck.id);
            });
            
            deckEl.querySelector('.deck-options-btn').addEventListener('click', (e) => {
                e.preventDefault();
                openDeckOptionsModal(deck.id);
            });
            
            deckListContainer.appendChild(deckEl);
        });
    }

    function populateExampleSelector() {
        exampleSelector.innerHTML = '<option value="" disabled selected>--- 選擇一個內建範例 ---</option>';
        EXAMPLES.forEach(example => {
            const option = document.createElement('option');
            option.value = example.file;
            option.textContent = example.name;
            exampleSelector.appendChild(option);
        });
    }


    // =================================================================
    // ===== 檔案載入與解析 (核心)
    // =================================================================

    async function handleExampleLoad() {
        const selectedFile = exampleSelector.value;
        if (!selectedFile) {
            showQuickStartError("請選擇一個範例。");
            return;
        }
        const selectedExample = EXAMPLES.find(ex => ex.file === selectedFile);
        const filePath = `samples/${selectedFile}`;
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`無法載入範例檔案: ${response.statusText}`);
            const content = await response.text();
            
            const deckData = parseJsonFile(content); 
            const deckTitle = selectedExample.name;
            const deckId = `sample_${selectedFile.split('.')[0]}`;
            
            processNewDeck(deckData, deckId, deckTitle, `${selectedFile} (範例)`);
            quickStartModal.classList.add('hidden'); 

        } catch (error) {
            showQuickStartError(`載入 ${selectedExample.name} 失敗: ${error.message}`);
        }
    }
    
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) { showQuickStartError("未選擇檔案。"); return; }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileName = file.name;
            let deckData;
            try {
                if (fileName.endsWith('.json')) {
                    deckData = parseJsonFile(content);
                } else if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
                    deckData = parseTxtFile(content);
                } else {
                    throw new Error("不支援的檔案格式，請上傳 .txt, .csv 或 .json。");
                }
                
                const deckId = `deck_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                processNewDeck(deckData, deckId, fileName, fileName);
                quickStartModal.classList.add('hidden'); 

            } catch (error) {
                showQuickStartError(error.message);
            }
        };
        reader.onerror = () => { showQuickStartError("讀取檔案時發生錯誤。"); };
        reader.readAsText(file);
        event.target.value = null;
    }

    function parseTxtFile(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length === 0) throw new Error("檔案為空或格式不正確。");
        
        const firstLineFields = lines[0].split(';').length;
        if (firstLineFields < 1) throw new Error("檔案格式錯誤，每行至少需有一個欄位。");

        return lines.map((line, index) => {
            const fields = line.split(';');
            if (fields.length !== firstLineFields) {
                console.warn(`格式警告：第 ${index + 1} 行欄位數 (${fields.length}) 與第一行 (${firstLineFields}) 不符。`);
            }
            return {
                card_id: `card_${index}_${crypto.randomUUID()}`,
                fields: fields.map(field => field.trim().replace(/\/\//g, '<br>')),
                tags: [],
                notes: ""
            };
        });
    }

    function parseJsonFile(content) {
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            throw new Error(`JSON 格式錯誤: ${e.message}`);
        }

        if (!Array.isArray(parsed)) throw new Error("JSON 檔案根部必須是一個陣列 (Array)。");

        return parsed.map((card, index) => {
            if (typeof card !== 'object' || card === null || !Array.isArray(card.fields)) {
                throw new Error(`JSON 項目 ${index} 格式錯誤：缺少 "fields" 陣列。`);
            }
            const newTags = Array.isArray(card.tags) ? card.tags : [];
            newTags.forEach(addNewTag); 
            
            return {
                card_id: card.card_id || `card_${index}_${crypto.randomUUID()}`,
                fields: card.fields.map(f => String(f).replace(/\/\//g, '<br>')),
                tags: newTags,
                notes: card.notes || ""
            };
        });
    }

    function processNewDeck(deckData, deckId, deckTitle, sourceFileName) {
        if (deckData.length === 0) {
            showQuickStartError("此單字集為空。");
            return;
        }
        
        saveDeckData(deckId, deckData);

        const deckTags = [...new Set(deckData.flatMap(card => card.tags))];
        const fieldCount = deckData.length > 0 ? deckData[0].fields.length : 0;
        
        const existingDeck = deckList.find(d => d.id === deckId);
        
        const metaData = {
            id: deckId,
            title: deckTitle,
            sourceFileName: sourceFileName,
            totalCards: deckData.length,
            fieldCount: fieldCount,
            lastOpened: Date.now(),
            category: deckTags,
            settings: existingDeck ? existingDeck.settings : { ...DEFAULT_DECK_SETTINGS } 
        };
        
        if (existingDeck) {
            const deckIndex = deckList.findIndex(d => d.id === deckId);
            deckList[deckIndex] = metaData; 
        } else {
            deckList.unshift(metaData); 
        }
        saveDeckList();

        resetDeckState(deckId, deckData);

        startGame(deckId);
    }


    // =================================================================
    // ===== 學習畫面 (遊戲邏輯)
    // =================================================================

    function startGame(deckId) {
        hideAllMenus(); 
        
        const deckData = getDeckData(deckId);
        const deckMeta = deckList.find(d => d.id === deckId);

        if (!deckData || !deckMeta) {
            showError("載入單字集失敗，找不到資料。");
            deckList = deckList.filter(d => d.id !== deckId);
            saveDeckList();
            renderHomeScreen();
            return;
        }
        
        currentDeckId = deckId;
        currentFullDeck = deckData;
        currentCardStatus = getDeckState(deckId);
        currentDeckSettings = { ...DEFAULT_DECK_SETTINGS, ...deckMeta.settings };
        
        if (!Array.isArray(currentDeckSettings.autoRevealIndices)) {
                currentDeckSettings.autoRevealIndices = [];
        }

        let stateChanged = false;
        currentFullDeck.forEach(card => {
            if (!currentCardStatus.has(card.card_id)) {
                currentCardStatus.set(card.card_id, 'unseen');
                stateChanged = true;
            }
        });
        if (stateChanged) saveDeckState(currentDeckId, currentCardStatus);

        currentLearningDeck = currentFullDeck.filter(card => {
            const status = currentCardStatus.get(card.card_id);
            return status !== 'correct';
        });
        shuffleDeck(currentLearningDeck);
        
        deckMeta.lastOpened = Date.now();
        saveDeckList();
        
        history = [];
        historyIndex = -1;
        applyCurrentDeckSettings(); 
        showScreen('main');
        showNextCard('new_game');
    }
    
    function restartGame() {
        resetDeckState(currentDeckId, currentFullDeck);
        currentCardStatus = getDeckState(currentDeckId);
        
        currentLearningDeck = [...currentFullDeck];
        shuffleDeck(currentLearningDeck);
        
        history = [];
        historyIndex = -1;
        
        [prevBtn, nextBtn, correctBtn, incorrectBtn].forEach(btn => btn.disabled = false);
        showNextCard('new_game');
    }

    function showNextCard(action) {
        if (historyIndex >= 0 && historyIndex < history.length) {
            const currentCardId = history[historyIndex];
            if (action === 'correct') {
                currentCardStatus.set(currentCardId, 'correct');
                currentLearningDeck = currentLearningDeck.filter(card => card.card_id !== currentCardId);
            } else if (action === 'incorrect') {
                currentCardStatus.set(currentCardId, 'incorrect');
            }
        }

        let nextCard;
        if (historyIndex < history.length - 1) {
            historyIndex++;
            const nextCardId = history[historyIndex];
            nextCard = currentFullDeck.find(card => card.card_id === nextCardId);
        } else {
            if (currentLearningDeck.length === 0) {
                displayEndOfDeck();
                saveDeckState(currentDeckId, currentCardStatus); 
                return;
            }
            const randomIndex = Math.floor(Math.random() * currentLearningDeck.length);
            nextCard = currentLearningDeck[randomIndex];
            
            history.push(nextCard.card_id);
            if (history.length > MAX_HISTORY) { history.shift(); }
            historyIndex = history.length - 1;
        }
        
        if (currentCardStatus.get(nextCard.card_id) === 'unseen') {
            currentCardStatus.set(nextCard.card_id, 'unjudged');
        }

        displayCardGroup(nextCard);
        updateUI();
        saveDeckState(currentDeckId, currentCardStatus); 
    }

    function showPrevCard() {
        if (historyIndex > 0) {
            historyIndex--;
            const prevCardId = history[historyIndex];
            const prevCard = currentFullDeck.find(card => card.card_id === prevCardId);
            displayCardGroup(prevCard);
        } else {
            historyAlert.classList.remove('hidden');
            setTimeout(() => historyAlert.classList.add('hidden'), 1500);
        }
        updateUI();
    }

    function displayCardGroup(cardData) {
        cardContainer.innerHTML = '';
        const cardFields = cardData.fields;
        const fieldsPerCard = cardFields.length;

        const layouts = {
            horizontal: { 1: 'grid-cols-1 grid-rows-1', 2: 'grid-cols-2 grid-rows-1', 3: 'grid-cols-3 grid-rows-1', 4: 'grid-cols-4 grid-rows-1', 5: 'grid-cols-5 grid-rows-1', 6: 'grid-cols-3 grid-rows-2' },
            vertical: { 1: 'grid-cols-1 grid-rows-1', 2: 'grid-cols-1 grid-rows-2', 3: 'grid-cols-1 grid-rows-3', 4: 'grid-cols-1 grid-rows-4', 5: 'grid-cols-2 grid-rows-3', 6: 'grid-cols-2 grid-rows-3' }
        };
        cardContainer.className = `grid gap-2 w-full h-full ${layouts[globalPreferences.cardLayout][fieldsPerCard] || 'grid-cols-2 grid-rows-2'}`;

        cardFields.forEach((content, index) => {
            const card = document.createElement('div');
            card.className = 'card bg-white dark:bg-gray-700 rounded-xl shadow-md flex items-center justify-center p-4 text-center cursor-pointer transition-transform transform hover:scale-105';
            card.innerHTML = `<span class="placeholder text-5xl text-gray-400 dark:text-gray-500">?</span><div class="content">${content}</div>`;
            card.addEventListener('click', (e) => { e.stopPropagation(); card.classList.toggle('revealed'); });
            
            if (currentDeckSettings.autoRevealIndices.includes(index)) {
                card.classList.add('revealed');
            }
            
            cardContainer.appendChild(card);
        });

        updateCardFontSize();
    }

    function displayEndOfDeck() {
        cardContainer.innerHTML = `<div class="col-span-full row-span-full flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-700 rounded-xl"><h2 class="text-3xl font-bold mb-4">🎉 恭喜！</h2><p class="text-xl">您已學會所有卡片！</p><button id="restart-btn" class="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">重新開始</button></div>`;
        document.getElementById('restart-btn').addEventListener('click', restartGame);
        [prevBtn, nextBtn, correctBtn, incorrectBtn].forEach(btn => btn.disabled = true);
        deckInfo.textContent = '完成!';
    }

    function updateUI() {
        prevBtn.disabled = historyIndex <= 0;
        nextBtn.disabled = currentLearningDeck.length === 0 && historyIndex === history.length - 1;
        
        const correctCount = currentFullDeck.length - currentLearningDeck.length;
        const totalCount = currentFullDeck.length;
        const deckTitle = deckList.find(d => d.id === currentDeckId)?.title || "單字集";
        
        deckInfo.innerHTML = `<span class="font-bold">${deckTitle}</span><br>${correctCount} / ${totalCount} (待學: ${currentLearningDeck.length})`;
    }
    
    function resetLearningState() {
        currentDeckId = null;
        currentFullDeck = [];
        currentLearningDeck = [];
        currentCardStatus.clear();
        currentDeckSettings = {};
        history = [];
        historyIndex = -1;
    }

    
    // =================================================================
    // ===== 選單 & Modal 功能
    // =================================================================

    function showAllCardsView() {
        allCardsModal.classList.remove('hidden');
        hideAllMenus();
        const statusIcons = { correct: 'check_circle', incorrect: 'cancel', unjudged: 'radio_button_unchecked', unseen: 'radio_button_unchecked' };
        let tableHTML = '<thead><tr class="border-b border-gray-200 dark:border-gray-600"><th class="p-2">狀態</th>';
        
        const fieldsPerCard = currentFullDeck.length > 0 ? currentFullDeck[0].fields.length : 0;
        for (let i = 1; i <= fieldsPerCard; i++) { tableHTML += `<th class="p-2">卡片 ${i}</th>`; }
        tableHTML += '</tr></thead><tbody>';
        
        currentFullDeck.forEach(cardData => {
            const status = currentCardStatus.get(cardData.card_id) || 'unseen';
            tableHTML += `<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"><td class="p-2 text-center text-teal-500"><span class="material-symbols-outlined">${statusIcons[status]}</span></td>`;
            cardData.fields.forEach(field => { tableHTML += `<td class="p-2">${field.replace(/<br>/g, ' ')}</td>`; });
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody>';
        allCardsTable.innerHTML = tableHTML;
    }

    // --- 圖形化編輯器 (Visual Editor) ---
    let editingDeckId = null;

    function openDeckEditor(deckId = null) {
        editingDeckId = deckId;
        editorStatusMsg.textContent = '';
        editorRowsContainer.innerHTML = '';
        
        if (deckId) {
            const deckMeta = deckList.find(d => d.id === deckId);
            const deckData = getDeckData(deckId);
            editorDeckTitle.value = deckMeta.title;
            editorFieldCount.value = deckMeta.fieldCount;
            deckData.forEach(card => renderEditorRow(card.fields));
            document.getElementById('editor-modal-title').textContent = `圖形化編輯: ${deckMeta.title}`;
        } else {
            editorDeckTitle.value = '';
            editorFieldCount.value = 2;
            renderEditorRow(); // 預設一行
            document.getElementById('editor-modal-title').textContent = "建立新單字集";
        }
        
        deckEditorModal.classList.remove('hidden');
        hideAllMenus();
    }

    function renderEditorRows() {
        const rows = editorRowsContainer.querySelectorAll('.editor-row');
        editorRowsContainer.innerHTML = '';
        renderEditorRow();
    }

    function renderEditorRow(fieldValues = []) {
        const fieldCount = parseInt(editorFieldCount.value, 10);
        const row = document.createElement('div');
        row.className = "editor-row flex items-center space-x-2 p-2 border-b border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-left-2 duration-200";
        
        let inputsHTML = '';
        for (let i = 0; i < fieldCount; i++) {
            const val = fieldValues[i] || '';
            inputsHTML += `<input type="text" class="card-field-input flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-1 focus:ring-teal-500" placeholder="欄位 ${i+1}" value="${val.replace(/<br>/g, '\n')}">`;
        }
        
        row.innerHTML = `
            <div class="flex-grow grid gap-2" style="grid-template-columns: repeat(${fieldCount}, 1fr)">
                ${inputsHTML}
            </div>
            <button class="remove-row-btn p-2 text-gray-400 hover:text-red-500 transition-colors">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;
        
        row.querySelector('.remove-row-btn').addEventListener('click', () => {
            row.remove();
            if (editorRowsContainer.children.length === 0) renderEditorRow();
        });
        
        editorRowsContainer.appendChild(row);
        editorRowsContainer.scrollTop = editorRowsContainer.scrollHeight;
    }

    function saveDeckFromEditor() {
        const title = editorDeckTitle.value.trim();
        if (!title) { editorStatusMsg.textContent = "請輸入單字集名稱"; return; }
        
        const rows = editorRowsContainer.querySelectorAll('.editor-row');
        const deckData = [];
        
        rows.forEach((row, index) => {
            const inputs = row.querySelectorAll('.card-field-input');
            const fields = Array.from(inputs).map(input => input.value.trim().replace(/\n/g, '<br>'));
            
            if (fields.some(f => f.length > 0)) {
                deckData.push({
                    card_id: `card_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 5)}`,
                    fields: fields,
                    tags: [],
                    notes: ""
                });
            }
        });
        
        if (deckData.length === 0) { editorStatusMsg.textContent = "請至少填寫一張卡片內容"; return; }
        
        const deckId = editingDeckId || `deck_${Date.now()}`;
        const sourceName = editingDeckId ? deckList.find(d => d.id === editingDeckId).sourceFileName : "手動建立";
        
        processNewDeck(deckData, deckId, title, sourceName);
        deckEditorModal.classList.add('hidden');
    }
    
    // --- 下載功能 ---
    function getCleanData(format) {
        const statusIcons = { correct: '✅', incorrect: '❌', unjudged: '⬜', unseen: '⬜' };
        
        if (format === 'json') {
            return currentFullDeck.map(card => {
                return {
                    ...card,
                    status: currentCardStatus.get(card.card_id) || 'unseen',
                    fields: card.fields.map(field => field.replace(/<br>/g, '\n'))
                };
            });
        } else {
            const fieldsPerCard = currentFullDeck.length > 0 ? currentFullDeck[0].fields.length : 0;
            const headers = ['狀態', ...Array.from({ length: fieldsPerCard }, (_, i) => `卡片 ${i + 1}`)];
            const rows = currentFullDeck.map(cardData => {
                const status = currentCardStatus.get(cardData.card_id) || 'unseen';
                return [statusIcons[status], ...cardData.fields.map(field => field.replace(/<br>/g, ' ').replace(/\s+/g, ' ').trim())];
            });
            return { headers, rows };
        }
    }

    function downloadData(format) {
        const deckTitle = deckList.find(d => d.id === currentDeckId)?.title || "deck";
        const cleanFilename = deckTitle.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '_');
        const filename = `${cleanFilename}_${new Date().toISOString().slice(0,10)}`;
        
        if (format === 'json') {
            const jsonData = getCleanData('json');
            const jsonContent = JSON.stringify(jsonData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8,' });
            triggerDownload(URL.createObjectURL(blob), `${filename}.json`);
        } 
        else if (format === 'csv') {
            const { headers, rows } = getCleanData('csv');
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
            csvContent += headers.join(',') + '\r\n';
            rows.forEach(row => {
                const rowData = row.map(field => `"${String(field).replace(/"/g, '""')}"`);
                csvContent += rowData.join(',') + '\r\n';
            });
            triggerDownload(encodeURI(csvContent), `${filename}.csv`);
        } 
        else if (format === 'txt') {
            const { headers, rows } = getCleanData('txt');
            let txtContent = headers.join('\t') + '\r\n';
            rows.forEach(row => { txtContent += row.join('\t') + '\r\n'; });
            const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8,' });
            triggerDownload(URL.createObjectURL(blob), `${filename}.txt`);
        }
        downloadModal.classList.add('hidden');
    }

    function triggerDownload(uri, filename) {
        const link = document.createElement("a");
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // --- 備份功能 ---
    async function backupAllData() {
        hideAllMenus();
        try {
            const zip = new JSZip();
            zip.file("deckList.json", localStorage.getItem(STORAGE_KEYS.DECK_LIST) || "[]");
            zip.file("allTags.json", localStorage.getItem(STORAGE_KEYS.ALL_TAGS) || "[]");
            zip.file("preferences.json", localStorage.getItem(STORAGE_KEYS.PREFERENCES) || "{}");
            const dataFolder = zip.folder("data");
            const stateFolder = zip.folder("state");
            deckList.forEach(deck => {
                const deckId = deck.id;
                const data = localStorage.getItem(`${STORAGE_KEYS.DECK_DATA_PREFIX}${deckId}`);
                const state = localStorage.getItem(`${STORAGE_KEYS.DECK_STATE_PREFIX}${deckId}`);
                if (data) dataFolder.file(`${deckId}.json`, data);
                if (state) stateFolder.file(`${deckId}.json`, state);
            });
            const content = await zip.generateAsync({ type: "blob" });
            const filename = `flashcard_backup_${new Date().toISOString().slice(0,10)}.zip`;
            triggerDownload(URL.createObjectURL(content), filename);
        } catch (err) {
            alert("備份失敗: " + err.message);
        }
    }
    
    // --- 偏好設定 ---
    function saveGlobalPreferences() {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(globalPreferences));
    }

    function loadGlobalPreferences() {
        const savedPrefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        globalPreferences = savedPrefs ? { ...DEFAULT_GLOBAL_PREFERENCES, ...JSON.parse(savedPrefs) } : { ...DEFAULT_GLOBAL_PREFERENCES };
        delete globalPreferences.fontSize;
        delete globalPreferences.autoRevealFirstCard;
        delete globalPreferences.autoRevealIndices;
    }
    
    function saveCurrentDeckSettings() {
        const deck = deckList.find(d => d.id === currentDeckId);
        if (deck) {
            deck.settings = { ...currentDeckSettings };
            saveDeckList();
        }
    }
    
    function applyCurrentDeckSettings() {
        updateCardFontSize(); 
        populateAutoRevealOptions(); 
        if (!Array.isArray(currentDeckSettings.autoRevealIndices)) {
            currentDeckSettings.autoRevealIndices = [];
        }
        currentDeckSettings.autoRevealIndices.forEach(index => {
            const checkbox = document.getElementById(`reveal-check-${index}`);
            if (checkbox) checkbox.checked = true;
        });
    }

    function toggleCardLayout() {
        globalPreferences.cardLayout = (globalPreferences.cardLayout === 'horizontal') ? 'vertical' : 'horizontal';
        saveGlobalPreferences();
        if (history.length > 0) {
            const currentCard = currentFullDeck.find(c => c.card_id === history[historyIndex]);
            displayCardGroup(currentCard);
        }
        hideAllMenus();
    }
    
    function populateAutoRevealOptions() {
        autoRevealOptionsContainer.innerHTML = '';
        const fieldCount = currentFullDeck.length > 0 ? currentFullDeck[0].fields.length : 0;
        if (fieldCount === 0) return;
        for (let i = 0; i < fieldCount; i++) {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" id="reveal-check-${i}" value="${i}"><span>卡片 ${i + 1}</span>`;
            autoRevealOptionsContainer.appendChild(label);
        }
    }
    
    function saveAutoRevealOptions() {
        const selectedIndices = [];
        const checkboxes = autoRevealOptionsContainer.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(cb => { selectedIndices.push(parseInt(cb.value, 10)); });
        currentDeckSettings.autoRevealIndices = selectedIndices;
        saveCurrentDeckSettings();
    }
    
    function changeDeckFontSize(step) {
        let newSize = parseFloat(currentDeckSettings.fontSize) + step;
        if (newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE) {
            currentDeckSettings.fontSize = newSize;
            saveCurrentDeckSettings();
            updateCardFontSize();
        }
    }

    function updateCardFontSize() {
        const cards = document.querySelectorAll('#card-container .card');
        const newSize = `${currentDeckSettings.fontSize.toFixed(1)}rem`;
        cards.forEach(card => card.style.fontSize = newSize);
        fontSizeValue.textContent = newSize;
    }

    // --- 標籤管理 ---
    function loadAllTags() {
        const savedTags = localStorage.getItem(STORAGE_KEYS.ALL_TAGS);
        allTags = savedTags ? JSON.parse(savedTags) : [];
        allTags.sort();
    }

    function saveAllTags() {
        allTags.sort();
        localStorage.setItem(STORAGE_KEYS.ALL_TAGS, JSON.stringify(allTags));
    }

    function openSettingsModal() {
        renderTagList();
        settingsModal.classList.remove('hidden');
        hideAllMenus();
    }

    function renderTagList() {
        tagListContainer.innerHTML = '';
        if (allTags.length === 0) {
            tagListContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm">尚未建立任何標籤。</p>';
            return;
        }
        allTags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = "flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg";
            tagEl.innerHTML = `<span class="text-gray-800 dark:text-gray-200 break-all">${tag}</span><button class="delete-tag-btn p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-800 ml-2 flex-shrink-0"><span class="material-symbols-outlined">delete</span></button>`;
            tagEl.querySelector('.delete-tag-btn').addEventListener('click', () => deleteTag(tag));
            tagListContainer.appendChild(tagEl);
        });
    }
    
    function addNewTag(tagName) {
        let newTagName = (typeof tagName === 'string') ? tagName : newTagInput.value.trim();
        if (!newTagName || allTags.includes(newTagName)) return;
        allTags.push(newTagName);
        saveAllTags();
        renderTagList(); 
        renderFilterTags(); 
        if (typeof tagName !== 'string') newTagInput.value = '';
    }
    
    function deleteTag(tagName) {
        allTags = allTags.filter(t => t !== tagName);
        saveAllTags();
        deckList.forEach(deck => {
            if (deck.category && deck.category.includes(tagName)) {
                deck.category = deck.category.filter(t => t !== tagName);
            }
        });
        saveDeckList();
        renderTagList(); 
        renderHomeScreen(); 
    }

    // --- JSON 編輯器 ---
    function openEditDeckModal() {
        try {
            const content = JSON.stringify(currentFullDeck, null, 2);
            jsonEditorTextarea.value = content;
            editDeckModal.classList.remove('hidden');
            hideAllMenus();
        } catch (e) { alert("失敗: " + e.message); }
    }
    
    function saveDeckEdit() {
        try {
            const validatedData = parseJsonFile(jsonEditorTextarea.value); 
            const deckMeta = deckList.find(d => d.id === currentDeckId);
            processNewDeck(validatedData, currentDeckId, deckMeta.title, deckMeta.sourceFileName);
            editDeckModal.classList.add('hidden');
        } catch (e) { jsonEditorError.textContent = e.message; }
    }

    // --- 單字集選項 Modal ---
    function openDeckOptionsModal(deckId) {
        const deck = deckList.find(d => d.id === deckId);
        if (!deck) return;
        deckOptionsTitle.textContent = `編輯 "${deck.title}"`;
        deckTitleInput.value = deck.title;
        deckTagsContainer.innerHTML = '';
        allTags.forEach(tag => {
            const isChecked = deck.category && deck.category.includes(tag);
            const label = document.createElement('label');
            label.className = "flex items-center space-x-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800";
            label.innerHTML = `<input type="checkbox" value="${tag}" ${isChecked ? 'checked' : ''} class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"><span class="text-sm">${tag}</span>`;
            deckTagsContainer.appendChild(label);
        });
        const oldSaveBtn = document.getElementById('save-deck-options-btn');
        const newSaveBtn = oldSaveBtn.cloneNode(true);
        oldSaveBtn.parentNode.replaceChild(newSaveBtn, oldSaveBtn);
        newSaveBtn.addEventListener('click', () => saveDeckOptions(deckId));
        const oldDeleteBtn = document.getElementById('delete-deck-btn');
        const newDeleteBtn = oldDeleteBtn.cloneNode(true);
        oldDeleteBtn.parentNode.replaceChild(newDeleteBtn, oldDeleteBtn);
        newDeleteBtn.addEventListener('click', () => handleDeleteDeck(deckId));
        deckOptionsModal.classList.remove('hidden');
    }

    function saveDeckOptions(deckId) {
        const deck = deckList.find(d => d.id === deckId);
        if (!deck) return;
        deck.title = deckTitleInput.value.trim();
        const selectedTags = [];
        deckTagsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => { selectedTags.push(cb.value); });
        deck.category = selectedTags;
        saveDeckList(); renderDeckList();
        deckOptionsModal.classList.add('hidden');
    }

    function handleDeleteDeck(deckId) {
        if (confirm("確定刪除？")) {
            deckList = deckList.filter(d => d.id !== deckId);
            saveDeckList();
            localStorage.removeItem(`${STORAGE_KEYS.DECK_DATA_PREFIX}${deckId}`);
            localStorage.removeItem(`${STORAGE_KEYS.DECK_STATE_PREFIX}${deckId}`);
            renderHomeScreen(); deckOptionsModal.classList.add('hidden');
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
        hideAllMenus();
    }

    function migrateDeckListSettings() {
        deckList.forEach(deck => {
            if (!deck.settings) deck.settings = { ...DEFAULT_DECK_SETTINGS };
            if (!Array.isArray(deck.settings.autoRevealIndices)) deck.settings.autoRevealIndices = [];
        });
        saveDeckList();
    }
    
    function loadDeckList() { deckList = JSON.parse(localStorage.getItem(STORAGE_KEYS.DECK_LIST) || "[]"); }
    function saveDeckList() { localStorage.setItem(STORAGE_KEYS.DECK_LIST, JSON.stringify(deckList)); }
    function getDeckData(deckId) { return JSON.parse(localStorage.getItem(`${STORAGE_KEYS.DECK_DATA_PREFIX}${deckId}`)); }
    function saveDeckData(deckId, deckData) { localStorage.setItem(`${STORAGE_KEYS.DECK_DATA_PREFIX}${deckId}`, JSON.stringify(deckData)); }
    function getDeckState(deckId) { return new Map(JSON.parse(localStorage.getItem(`${STORAGE_KEYS.DECK_STATE_PREFIX}${deckId}`) || "[]")); }
    function saveDeckState(deckId, stateMap) { localStorage.setItem(`${STORAGE_KEYS.DECK_STATE_PREFIX}${deckId}`, JSON.stringify(Array.from(stateMap.entries()))); }
    function resetDeckState(deckId, deckData) { const newMap = new Map(); deckData.forEach(card => newMap.set(card.card_id, 'unseen')); saveDeckState(deckId, newMap); }
    function shuffleDeck(d) { for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } }
    function formatTimeAgo(t) {
        const s = Math.floor((Date.now() - t) / 1000);
        if (s < 60) return "剛剛";
        if (s < 3600) return Math.floor(s/60) + " 分鐘前";
        if (s < 86400) return Math.floor(s/3600) + " 小時前";
        return Math.floor(s/86400) + " 天前";
    }
});
