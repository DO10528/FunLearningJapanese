document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義
    // ----------------------------------------------------
    const MENU_AREA = document.getElementById('shiritori2-menu');
    const GAME_AREA = document.getElementById('shiritori2-game-area');
    const CARD_SELECTION_AREA = document.getElementById('card-selection-area');
    const SHIRITORI_GRID = document.getElementById('shiritori-grid');
    const FEEDBACK_MESSAGE = document.getElementById('feedback-message');
    const GAME_STATUS_MESSAGE = document.getElementById('game-status-message');
    const RESET_BUTTON = document.getElementById('resetButton');
    const BACK_BUTTON = document.getElementById('backToMenuButton');
    const RETURN_CARD_BUTTON = document.getElementById('returnCardButton'); 

    // ★★★ 音声ファイル設定 ★★★
    const SOUND_CORRECT_PATH = 'assets/audio/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/audio/bubu.mp3'; 

    let allWords = [];          
    let gameWords = [];         
    let currentCellIndex = 1;   
    const MAX_WORDS = 15;       

    // ----------------------------------------------------
    // 補助関数
    // ----------------------------------------------------
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function getNextChar(reading) {
        if (!reading) return '';
        let lastChar = reading.slice(-1);
        if (lastChar === 'ー' && reading.length > 1) {
            lastChar = reading.slice(-2, -1);
        }
        const smallKana = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ' };
        return smallKana[lastChar] || lastChar;
    }

    function restoreCardToSelectionArea(card) {
        CARD_SELECTION_AREA.querySelector('.card-list').appendChild(card);
        card.classList.remove('dragging');
        card.style.opacity = '1';
    }

    function returnCardFromCell() {
        if (currentCellIndex <= 1) {
            alert("「しりとり」のマスは戻せません。");
            return;
        }
        const targetCellIndex = currentCellIndex - 1;
        const targetCell = document.getElementById(`cell-${targetCellIndex}`);
        if (targetCell && targetCell.classList.contains('filled')) {
            const wordName = targetCell.dataset.word;
            const wordData = gameWords.find(w => w.word === wordName);
            if (wordData) {
                const card = createWordCard(wordData);
                CARD_SELECTION_AREA.querySelector('.card-list').appendChild(card);
            }
            targetCell.innerHTML = '';
            targetCell.classList.remove('filled');
            targetCell.classList.add('drop-target');
            delete targetCell.dataset.word;
            delete targetCell.dataset.nextChar;
            currentCellIndex--;
            updateUI(true);
        }
    }

    // ----------------------------------------------------
    // ゲーム初期化
    // ----------------------------------------------------
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            allWords = allWords.filter(word =>
                word.reading && getNextChar(word.reading) !== 'ん'
            );
        } catch (error) {
            console.error('単語データ読み込みエラー:', error);
        }
    }

    window.startShiritori2Game = function() {
        if (allWords.length === 0) {
            loadWords().then(setupGame);
        } else {
            setupGame();
        }
    };

    function setupGame() {
        if (allWords.length < MAX_WORDS) {
            alert(`単語数が不足しています（${MAX_WORDS}語必要）`);
            return;
        }

        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';
        currentCellIndex = 1;
        gameWords = [];
        SHIRITORI_GRID.innerHTML = '';

        // スタートマス
        SHIRITORI_GRID.innerHTML = `
            <div id="cell-0" class="grid-cell filled shiritori-start" data-word="しりとり" data-next-char="り">
                <span class="word-text">しりとり</span>
            </div>
        `;
        for (let i = 1; i <= MAX_WORDS; i++) {
            SHIRITORI_GRID.innerHTML += `<div id="cell-${i}" class="grid-cell drop-target" data-cell-index="${i}"></div>`;
        }

        RETURN_CARD_BUTTON.style.display = 'none';
        selectAndRenderCards();
        setupDragAndDropListeners();
        updateUI(true);
    }

    // ----------------------------------------------------
    // カード生成・描画
    // ----------------------------------------------------
    function createWordCard(wordData) {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.draggable = true;
        card.dataset.word = wordData.word;
        card.dataset.reading = wordData.reading;
        card.dataset.nextChar = getNextChar(wordData.reading);
        card.dataset.firstChar = wordData.reading.charAt(0);

        card.innerHTML = `
            <img src="assets/images/${wordData.image}" alt="${wordData.word}" class="card-image">
            <div class="card-label">${wordData.word}</div>
        `;
        return card;
    }

    function selectAndRenderCards() {
        const selectedChain = findShiritoriChain(MAX_WORDS);
        if (selectedChain.length < MAX_WORDS) {
            CARD_SELECTION_AREA.innerHTML = `<h3 style="color:red;">連鎖エラー：再読み込みしてください。</h3>`;
            return;
        }
        gameWords = selectedChain;
        CARD_SELECTION_AREA.innerHTML = `
            <h3>残りの単語 (${gameWords.length}枚)</h3>
            <div class="card-list"></div>
        `;
        const list = CARD_SELECTION_AREA.querySelector('.card-list');
        shuffleArray(selectedChain).forEach(wordData => {
            const card = createWordCard(wordData);
            list.appendChild(card);
        });
    }

    function findShiritoriChain(length) {
        let attempts = 0;
        const maxAttempts = 300;
        const startChar = 'り';
        const SHIRITORI_MAP = {
            'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
            'さ': ['ざ'], 'し': ['じ'], 'す': ['ず'], 'せ': ['ぜ'], 'そ': ['ぞ'],
            'た': ['だ'], 'ち': ['ぢ'], 'つ': ['づ'], 'て': ['で'], 'と': ['ど'],
            'は': ['ば', 'ぱ'], 'ひ': ['び', 'ぴ'], 'ふ': ['ぶ', 'ぷ'],
            'へ': ['べ', 'ぺ'], 'ほ': ['ぼ', 'ぽ']
        };
        const CLEAR_MAP = {};
        for (const [base, daku] of Object.entries(SHIRITORI_MAP)) {
            daku.forEach(d => { CLEAR_MAP[d] = base; });
        }

        const allAvailable = shuffleArray(allWords);
        while (attempts < maxAttempts) {
            const chain = [];
            const used = new Set();
            const first = allAvailable.find(w => w.reading.startsWith(startChar));
            if (!first) { attempts++; continue; }
            chain.push(first);
            used.add(first.id);
            let last = getNextChar(first.reading);

            for (let i = 1; i < length; i++) {
                const nextCandidates = allAvailable.filter(w =>
                    !used.has(w.id) && (
                        w.reading.startsWith(last) ||
                        (SHIRITORI_MAP[last] && SHIRITORI_MAP[last].some(c => w.reading.startsWith(c))) ||
                        (CLEAR_MAP[last] && w.reading.startsWith(CLEAR_MAP[last]))
                    )
                );
                if (nextCandidates.length === 0) break;
                const next = nextCandidates[Math.floor(Math.random() * nextCandidates.length)];
                chain.push(next);
                used.add(next.id);
                last = getNextChar(next.reading);
            }

            if (chain.length >= length) return chain;
            attempts++;
        }
        return [];
    }

    // ----------------------------------------------------
    // ドラッグ＆ドロップ
    // ----------------------------------------------------
    function setupDragAndDropListeners() {
        CARD_SELECTION_AREA.addEventListener('dragstart', e => {
            if (e.target.classList.contains('word-card')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.word);
                e.target.classList.add('dragging');
                e.target.style.opacity = '0.5';
            }
        });
        CARD_SELECTION_AREA.addEventListener('dragend', e => {
            if (e.target.classList.contains('word-card')) {
                e.target.classList.remove('dragging');
                e.target.style.opacity = '1';
            }
        });
        SHIRITORI_GRID.addEventListener('dragover', e => {
            e.preventDefault();
            const t = e.target.closest('.drop-target');
            if (t) t.classList.add('drag-over');
        });
        SHIRITORI_GRID.addEventListener('dragleave', e => {
            const t = e.target.closest('.drop-target');
            if (t) t.classList.remove('drag-over');
        });
        SHIRITORI_GRID.addEventListener('drop', handleDrop);
        RESET_BUTTON.addEventListener('click', resetGame);
        BACK_BUTTON.addEventListener('click', () => {
            GAME_AREA.style.display = 'none';
            MENU_AREA.style.display = 'block';
        });
        RETURN_CARD_BUTTON.addEventListener('click', returnCardFromCell);
    }

    function handleDrop(e) {
        e.preventDefault();
        const target = e.target.closest('.drop-target');
        if (!target || target.classList.contains('filled')) return;
        const word = e.dataTransfer.getData('text/plain');
        const card = document.querySelector(`.word-card[data-word="${word}"]`);
        if (!card) return;
        const cellIndex = parseInt(target.dataset.cellIndex, 10);
        if (cellIndex === currentCellIndex) {
            checkAnswer(card, target);
        } else {
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = `❌ ${currentCellIndex + 1}マス目に入れてね！`;
            restoreCardToSelectionArea(card);
        }
    }

    // ----------------------------------------------------
    // 正誤判定
    // ----------------------------------------------------
    function checkAnswer(card, dropTarget) {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        const requiredChar = prevCell.dataset.nextChar;
        const droppedChar = card.dataset.firstChar;
        const MAP = {
            'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
            'さ': ['ざ'], 'し': ['じ'], 'す': ['ず'], 'せ': ['ぜ'], 'そ': ['ぞ'],
            'た': ['だ'], 'ち': ['ぢ'], 'つ': ['づ'], 'て': ['で'], 'と': ['ど'],
            'は': ['ば', 'ぱ'], 'ひ': ['び', 'ぴ'], 'ふ': ['ぶ', 'ぷ'],
            'へ': ['べ', 'ぺ'], 'ほ': ['ぼ', 'ぽ']
        };
        const allow = MAP[requiredChar] || [];
        const ok = [requiredChar, ...allow].includes(droppedChar);

        if (ok) {
            playSound(SOUND_CORRECT_PATH);
            dropTarget.innerHTML = card.innerHTML;
            dropTarget.classList.remove('drop-target');
            dropTarget.classList.add('filled');
            dropTarget.dataset.word = card.dataset.word;
            dropTarget.dataset.nextChar = card.dataset.nextChar;
            card.remove();
            currentCellIndex++;
            if (currentCellIndex > MAX_WORDS) endGame(true);
            else updateUI(true);
        } else {
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = `❌「${requiredChar}」から始まる言葉じゃないよ。`;
            restoreCardToSelectionArea(card);
        }
    }

    // ----------------------------------------------------
    // UI更新と終了処理
    // ----------------------------------------------------
    function updateUI() {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        if (!prevCell) return;
        const nextChar = prevCell.dataset.nextChar;
        GAME_STATUS_MESSAGE.textContent = `マス目 ${currentCellIndex} / ${MAX_WORDS}`;
        FEEDBACK_MESSAGE.textContent = `次は「${nextChar}」から始まる言葉を探そう！`;
        RETURN_CARD_BUTTON.style.display = currentCellIndex > 1 ? 'inline-block' : 'none';
    }

    function resetGame() {
        if (confirm("最初からやり直しますか？")) {
            window.location.reload();
        }
    }

    function endGame(isWin) {
        if (isWin) {
            playSound(SOUND_CORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = "🎉 全問クリア！すごい！🎉";
        } else {
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = "😭 ゲームオーバー...";
        }
        RETURN_CARD_BUTTON.style.display = 'none';
    }

    loadWords();
});
