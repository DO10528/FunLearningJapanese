document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素
    // ----------------------------------------------------
    const MENU_AREA = document.getElementById('shiritori2-menu');
    const GAME_AREA = document.getElementById('shiritori2-game-area');
    const CARD_SELECTION_AREA = document.getElementById('card-selection-area');
    const SHIRITORI_GRID = document.getElementById('shiritori-grid');
    const FEEDBACK_MESSAGE = document.getElementById('feedback-message');
    const GAME_STATUS_MESSAGE = document.getElementById('game-status-message');
    const RESET_BUTTON = document.getElementById('resetButton');
    const BACK_BUTTON = document.getElementById('backToMenuButton');

    // ----------------------------------------------------
    // 音声設定
    // ----------------------------------------------------
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3';
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3';

    // ----------------------------------------------------
    // 変数定義
    // ----------------------------------------------------
    let allWords = [];
    let gameWords = [];
    let currentCellIndex = 1;
    const MAX_WORDS = 15;

    // ----------------------------------------------------
    // 音声再生
    // ----------------------------------------------------
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(() => {});
    }

    // ----------------------------------------------------
    // 配列シャッフル
    // ----------------------------------------------------
    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    // ----------------------------------------------------
    // 最後の文字を取得
    // ----------------------------------------------------
    function getNextChar(reading) {
        if (!reading) return '';
        let lastChar = reading.slice(-1);
        if (lastChar === 'ー' && reading.length > 1) {
            lastChar = reading.slice(-2, -1);
        }
        const smallKana = {'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ'};
        return smallKana[lastChar] || lastChar;
    }

    // ----------------------------------------------------
    // 単語データ読み込み
    // ----------------------------------------------------
    async function loadWords() {
        try {
            const res = await fetch('data/words.json');
            const data = await res.json();
            allWords = data.filter(w => w.reading && getNextChar(w.reading) !== 'ん');
        } catch (e) {
            console.error('単語データ読み込み失敗:', e);
        }
    }

    // ----------------------------------------------------
    // ゲーム開始
    // ----------------------------------------------------
    window.startShiritori2Game = async function () {
        if (allWords.length === 0) await loadWords();
        setupGame();
    };

    // ----------------------------------------------------
    // ゲームセットアップ
    // ----------------------------------------------------
    function setupGame() {
        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';

        currentCellIndex = 1;
        SHIRITORI_GRID.innerHTML = `
            <div id="cell-0" class="grid-cell filled" data-word="しりとり" data-next-char="り">
                <span class="word-text">しりとり</span>
            </div>
        `;
        for (let i = 1; i <= MAX_WORDS; i++) {
            SHIRITORI_GRID.innerHTML += `<div id="cell-${i}" class="grid-cell drop-target" data-cell-index="${i}"></div>`;
        }

        selectAndRenderCards();
        setupDragAndDropListeners();
        updateUI(true);
    }

    // ----------------------------------------------------
    // カード生成
    // ----------------------------------------------------
    function selectAndRenderCards() {
        const chain = findShiritoriChain(MAX_WORDS);
        if (chain.length === 0) {
            GAME_STATUS_MESSAGE.textContent = '単語の連鎖を生成できませんでした。';
            return;
        }

        gameWords = chain;
        CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (${chain.length}枚)</h3>`;

        shuffleArray(chain).forEach(word => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.draggable = true;
            card.dataset.word = word.word;
            card.dataset.reading = word.reading;
            card.dataset.nextChar = getNextChar(word.reading);
            card.dataset.firstChar = word.reading.charAt(0);
            card.innerHTML = `
                <img src="assets/images/${word.image}" alt="${word.word}" class="card-image">
                <div class="card-label">${word.word}</div>
            `;
            CARD_SELECTION_AREA.appendChild(card);
        });
    }

    // ----------------------------------------------------
    // しりとり連鎖探索
    // ----------------------------------------------------
    function findShiritoriChain(length) {
        let allAvailable = [...allWords];
        if (allAvailable.length < length) return [];

        let attempts = 0;
        const maxAttempts = 500;
        const startChar = 'り';
        const chain = [];

        while (attempts < maxAttempts) {
            let used = new Set();
            let result = [];
            let current = startChar;

            for (let i = 0; i < length; i++) {
                const candidates = allAvailable.filter(w =>
                    w.reading.charAt(0) === current && !used.has(w.id)
                );
                if (candidates.length === 0) break;

                const next = candidates[Math.floor(Math.random() * candidates.length)];
                result.push(next);
                used.add(next.id);
                current = getNextChar(next.reading);
            }

            if (result.length === length) return result;
            attempts++;
        }
        return chain;
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
        });

        SHIRITORI_GRID.addEventListener('drop', handleDrop);

        RESET_BUTTON.addEventListener('click', () => location.reload());
        BACK_BUTTON.addEventListener('click', () => {
            GAME_AREA.style.display = 'none';
            MENU_AREA.style.display = 'block';
        });
    }

    // ----------------------------------------------------
// ドロップ処理（修正版）
// ----------------------------------------------------
function handleDrop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.drop-target');
    if (!dropTarget) return;

    const droppedWord = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`.word-card[data-word="${droppedWord}"]`);
    if (!card) return;

    // ドラッグ元の要素を保持（戻すときに使う）
    const originalParent = card.parentNode;

    const cellIndex = parseInt(dropTarget.dataset.cellIndex, 10);
    if (cellIndex !== currentCellIndex) {
        playSound(SOUND_INCORRECT_PATH);
        FEEDBACK_MESSAGE.textContent = `❌ ${currentCellIndex + 1}マス目に入れてね！`;
        FEEDBACK_MESSAGE.style.color = '#ff6f61';

        // 🔁 元のエリアに戻す（位置も維持）
        CARD_SELECTION_AREA.appendChild(card);
        card.style.opacity = '1';
        return;
    }

    // ---- 正誤判定を呼び出し ----
    checkAnswer(card, dropTarget, originalParent);
}


    function checkAnswer(card, dropTarget, originalParent) {
    const prev = document.getElementById(`cell-${currentCellIndex - 1}`);
    const required = prev.dataset.nextChar;
    const first = card.dataset.firstChar;

    if (required === first) {
        playSound(SOUND_CORRECT_PATH);
        dropTarget.innerHTML = card.innerHTML;
        dropTarget.classList.remove('drop-target');
        dropTarget.classList.add('filled');
        dropTarget.dataset.word = card.dataset.word;
        dropTarget.dataset.nextChar = card.dataset.nextChar;

        // 🟢 ドラッグカード削除
        card.remove();

        currentCellIndex++;
        if (currentCellIndex > MAX_WORDS) {
            FEEDBACK_MESSAGE.textContent = '🎉 全クリア！おめでとう！';
            FEEDBACK_MESSAGE.style.color = '#2e7d32';
            return;
        }
        updateUI(true);
    } else {
        // ❌ 間違えた場合 → 元に戻す
        playSound(SOUND_INCORRECT_PATH);
        FEEDBACK_MESSAGE.textContent = `❌「${required}」から始まる単語を選んでね！`;
        FEEDBACK_MESSAGE.style.color = '#ff6f61';

        // 🔁 元の位置（残り単語リスト）に戻す
        if (originalParent && !CARD_SELECTION_AREA.contains(card)) {
            CARD_SELECTION_AREA.appendChild(card);
        }
        card.style.opacity = '1';
    }
}


    // ----------------------------------------------------
    // UI更新
    // ----------------------------------------------------
    function updateUI() {
        const prev = document.getElementById(`cell-${currentCellIndex - 1}`);
        const nextChar = prev.dataset.nextChar;
        GAME_STATUS_MESSAGE.textContent = `マス目 ${currentCellIndex} / ${MAX_WORDS}`;
        FEEDBACK_MESSAGE.textContent = `「${nextChar}」から始まる言葉を探してね！`;
        FEEDBACK_MESSAGE.style.color = '#3f51b5';
    }

    loadWords();
});
