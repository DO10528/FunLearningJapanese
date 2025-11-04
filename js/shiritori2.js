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

    // ★★★ 音声ファイルのパス設定 ★★★
    const SOUND_CORRECT_PATH = 'assets/audio/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/audio/bubu.mp3'; 
    // ★★★★★★★★★★★★★★★★★★★★★

    let allWords = [];          // words.json から読み込む全単語
    let gameWords = [];         // 今回のゲームで使用する15単語
    let currentCellIndex = 1;   // 次にドロップすべきマス (1は「しりとり」の次のマス)
    const MAX_WORDS = 15;       // 使用するカードの枚数

    // ----------------------------------------------------
    // 補助関数
    // ----------------------------------------------------

    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function getCleanLastChar(reading) {
        if (!reading) return '';
        let lastChar = reading.slice(-1);
        if (lastChar === 'ー' && reading.length > 1) {
            lastChar = reading.slice(-2, -1);
        }
        const smallKana = {'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ'};
        return smallKana[lastChar] || lastChar;
    }

    // ----------------------------------------------------
    // 1. ゲームの初期化と開始
    // ----------------------------------------------------

    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            allWords = allWords.filter(word => word.reading && word.reading.trim() !== '' && getCleanLastChar(word.reading) !== 'ん');
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
        }
    }

    // HTMLのonclickから呼ばれる
    window.startShiritori2Game = function() {
        if (allWords.length === 0) {
            loadWords().then(setupGame);
        } else {
            setupGame();
        }
    };

    function setupGame() {
        if (allWords.length < MAX_WORDS) {
            alert(`エラー: ゲームに必要な単語数が不足しています。（${MAX_WORDS}語必要です）`);
            return;
        }

        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';

        // 状態リセット
        currentCellIndex = 1;
        gameWords = [];
        SHIRITORI_GRID.innerHTML = '';
        
        // 16マスを再生成 (1マス目は固定)
        SHIRITORI_GRID.innerHTML = `
            <div id="cell-0" class="grid-cell filled" data-word="しりとり" data-last-char="り" data-next-char="り">
                <span class="word-text">しりとり</span>
            </div>
        `;
        // 2マス目から16マス目まで（ドロップエリア）
        for (let i = 1; i <= MAX_WORDS; i++) {
            SHIRITORI_GRID.innerHTML += `<div id="cell-${i}" class="grid-cell drop-target" data-cell-index="${i}"></div>`;
        }


        // 今回使う15単語を選び、カードエリアに表示する
        selectAndRenderCards();
        
        // イベントリスナーを設定
        setupDragAndDropListeners();
        
        // UIを初期状態に
        updateUI(true);
    }
    
   // ----------------------------------------------------
    // 2. カードの選択と表示 (修正版)
    // ----------------------------------------------------

    function selectAndRenderCards() {
        const chainLength = MAX_WORDS; // 15
        
        // 1. 15個の連続するしりとりチェーンを探索する
        let selectedChain = findShiritoriChain(chainLength);

        if (selectedChain.length < chainLength) {
            // 見つからなかった場合（データの偏りなどで非常に稀に発生）
            GAME_STATUS_MESSAGE.textContent = 'エラー：連鎖が構築できませんでした。リセットしてください。';
            return;
        }

        // 今回のゲームで使用する15単語を設定
        gameWords = selectedChain;
        
        // 2. カードエリアにシャッフルして表示
        CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (${gameWords.length}枚)</h3>`;
        
        // ユーザーが自分で正しい順序を探せるよう、シャッフルしたカードを表示
        shuffleArray(gameWords).forEach(word => {
            const lastChar = getCleanLastChar(word.reading);
            const card = document.createElement('div');
            
            card.className = 'word-card';
            card.draggable = true;
            card.dataset.word = word.word;
            card.dataset.reading = word.reading;
            card.dataset.lastChar = lastChar;
            card.dataset.firstChar = word.reading.charAt(0);
            
            card.innerHTML = `
                <img src="assets/images/${word.image}" alt="${word.word}" class="card-image">
                <div class="card-label">${word.word}</div>
            `;
            CARD_SELECTION_AREA.appendChild(card);
        });
    }

    /**
     * 指定された長さのしりとりチェーンを探索する (バックトラック方式)
     * @param {number} length - 必要なチェーンの長さ
     * @returns {Array<object>} 見つかった単語の配列
     */
    function findShiritoriChain(length) {
        let allAvailable = allWords.filter(word => getCleanLastChar(word.reading) !== 'ん');
        if (allAvailable.length < length) return []; // そもそも足りない
        
        const startChar = 'り'; // 最初の単語「しりとり」の終わり
        let chain = [];
        let usedIds = new Set();
        let attempts = 0;
        const maxAttempts = 100;

        // 成功するまで何度も試行する
        while (attempts < maxAttempts) {
            chain = [];
            usedIds.clear();
            let currentLastChar = startChar;
            
            for (let i = 0; i < length; i++) {
                // 現在の文字から始まる利用可能な単語を抽出
                let candidates = allAvailable.filter(word => 
                    word.reading.charAt(0) === currentLastChar && 
                    !usedIds.has(word.id)
                );
                
                if (candidates.length === 0) {
                    // チェーンが途切れた
                    break;
                }
                
                // ランダムに次の単語を選択
                const nextWord = candidates[Math.floor(Math.random() * candidates.length)];
                
                chain.push(nextWord);
                usedIds.add(nextWord.id);
                currentLastChar = getCleanLastChar(nextWord.reading);
            }

            if (chain.length === length) {
                // 成功！
                return chain;
            }
            attempts++;
            // 試行回数が増えたら、次の単語の選択に使うリストをリフレッシュする（効率化のため）
            allAvailable = shuffleArray(allAvailable); 
        }

        return []; // 最大試行回数に達しても見つからなかった場合
    }

    // ----------------------------------------------------
    // 3. ドラッグ＆ドロップ処理
    // ----------------------------------------------------

    function setupDragAndDropListeners() {
        // ドラッグ開始
        CARD_SELECTION_AREA.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('word-card')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.word);
                e.target.classList.add('dragging');
            }
        });

        // ドラッグ終了
        CARD_SELECTION_AREA.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('word-card')) {
                e.target.classList.remove('dragging');
            }
        });

        // ドロップターゲット（マス）のイベント
        SHIRITORI_GRID.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('drop-target') && !e.target.classList.contains('filled')) {
                e.target.classList.add('drag-over');
            }
        });

        SHIRITORI_GRID.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('drop-target')) {
                e.target.classList.remove('drag-over');
            }
        });

        SHIRITORI_GRID.addEventListener('drop', handleDrop);

        // リセットボタンとメニューボタン
        RESET_BUTTON.addEventListener('click', resetGame);
        BACK_BUTTON.addEventListener('click', () => {
            GAME_AREA.style.display = 'none';
            MENU_AREA.style.display = 'block';
        });
    }

    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');

        const dropTarget = e.target.closest('.drop-target');
        if (!dropTarget) return;

        const droppedWord = e.dataTransfer.getData('text/plain');
        const draggedCard = document.querySelector(`.word-card[data-word="${droppedWord}"]`);
        
        if (!draggedCard) return;

        const cellIndex = parseInt(dropTarget.dataset.cellIndex, 10);

        if (cellIndex === currentCellIndex) {
            checkAnswer(draggedCard, dropTarget);
        } else {
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = `❌ ${currentCellIndex + 1}マス目に入れてね！`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
        }
    }
    
    // ----------------------------------------------------
    // 4. 正誤判定
    // ----------------------------------------------------

    function checkAnswer(card, dropTarget) {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        const requiredChar = prevCell.dataset.lastChar;
        const droppedFirstChar = card.dataset.firstChar;
        
        if (droppedFirstChar === requiredChar) {
            // ★ 正解 ★
            playSound(SOUND_CORRECT_PATH);
            
            // マスにカードを移動して固定
            dropTarget.innerHTML = card.innerHTML;
            dropTarget.classList.remove('drop-target');
            dropTarget.classList.add('filled');
            dropTarget.dataset.word = card.dataset.word;
            dropTarget.dataset.lastChar = card.dataset.lastChar;

            // 元のカードを削除
            card.remove();

            // 次のマスに進む
            currentCellIndex++;

            if (currentCellIndex > MAX_WORDS) {
                // 終了
                endGame(true);
            } else if (card.dataset.lastChar === 'ん') {
                 // 負け
                endGame(false);
            } else {
                updateUI(true);
            }

        } else {
            // ★ 不正解 ★
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = `❌「${requiredChar}」から始まる言葉じゃないよ...。`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
        }
    }
    
    // ----------------------------------------------------
    // 5. UIの更新とリセット
    // ----------------------------------------------------

    function updateUI(isCorrectMove) {
        const prevChar = document.getElementById(`cell-${currentCellIndex - 1}`).dataset.lastChar;
        const nextCellNumber = currentCellIndex + 1;
        
        GAME_STATUS_MESSAGE.textContent = `マス目 ${currentCellIndex} / ${MAX_WORDS}`;
        
        FEEDBACK_MESSAGE.textContent = `次は${nextCellNumber}マス目。「${prevChar}」から始まるカードをドロップしてね！`;
        FEEDBACK_MESSAGE.style.color = '#3f51b5';
    }

    function resetGame() {
        if (confirm("ゲームを最初からリセットしますか？")) {
            setupGame();
        }
    }

    function endGame(isWin) {
        let finalMessage;
        
        if (isWin) {
            playSound(SOUND_CORRECT_PATH);
            finalMessage = "🎉 全15問クリア！すごい！おめでとう！ 🎉";
            FEEDBACK_MESSAGE.style.color = 'green';
        } else {
            playSound(SOUND_INCORRECT_PATH);
            const lastWord = document.getElementById(`cell-${currentCellIndex - 1}`).dataset.word;
            finalMessage = `😭 ゲームオーバー！「${lastWord}」は「ん」で終わるから負けだよ。`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
        }

        FEEDBACK_MESSAGE.textContent = finalMessage;
        GAME_STATUS_MESSAGE.textContent = 'ゲーム終了';
        
        // ドロップイベントを無効化
        SHIRITORI_GRID.removeEventListener('drop', handleDrop);

        // リセットボタンを強調
        RESET_BUTTON.style.backgroundColor = '#4CAF50';
    }

    loadWords();
});