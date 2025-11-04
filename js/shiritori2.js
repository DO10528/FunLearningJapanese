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

    // ★★★ 音声ファイルのパス設定 ★★★
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
        let newArray = [...array];
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
        
        const smallKana = {'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ'};
        return smallKana[lastChar] || lastChar;
    }

    /**
     * 不正解の場合にカードを元の場所に戻す
     * @param {HTMLElement} card - 戻すカード要素
     */
    function restoreCardToSelectionArea(card) {
        CARD_SELECTION_AREA.appendChild(card);
        card.classList.remove('dragging');
        card.style.opacity = '1';
    }

    /**
     * マスに置かれた最後のカードを戻す (再生成して戻す)
     */
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

                CARD_SELECTION_AREA.appendChild(card);
            }

            // マスをリセット
            targetCell.innerHTML = '';
            targetCell.classList.remove('filled');
            targetCell.classList.add('drop-target');
            delete targetCell.dataset.word;
            delete targetCell.dataset.nextChar;

            // 現在のセルインデックスを一つ戻す
            currentCellIndex--;

            // UIを更新
            updateUI(true); 
        } else {
            alert("戻せるカードがありません。");
        }
    }
    // ----------------------------------------------------
    // 1. ゲームの初期化と開始
    // ----------------------------------------------------

    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            allWords = allWords.filter(word => 
                word.reading && getNextChar(word.reading) !== 'ん'
            );
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            alert('単語データを読み込めませんでした。ファイルパスを確認してください。');
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
            alert(`エラー: ゲームに必要な単語数が不足しています。（${MAX_WORDS}語必要です）`);
            return;
        }

        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';

        // 状態リセット
        currentCellIndex = 1;
        gameWords = [];
        SHIRITORI_GRID.innerHTML = '';
        
        // 1マス目（固定）
        SHIRITORI_GRID.innerHTML = `
            <div id="cell-0" class="grid-cell filled shiritori-start" data-word="しりとり" data-next-char="り">
                <span class="word-text">しりとり</span>
            </div>
        `;
        // 2マス目から16マス目まで（ドロップ可能マス）
        for (let i = 1; i <= MAX_WORDS; i++) {
            SHIRITORI_GRID.innerHTML += `<div id="cell-${i}" class="grid-cell drop-target" data-cell-index="${i}"></div>`;
        }
        
        RETURN_CARD_BUTTON.style.display = 'none';

        selectAndRenderCards();
        setupDragAndDropListeners();
        updateUI(true);
    }
    
    // ----------------------------------------------------
    // 2. カードの選択と表示
    // ----------------------------------------------------

    function selectAndRenderCards() {
        const chainLength = MAX_WORDS; 
        let selectedChain = findShiritoriChain(chainLength);

        if (selectedChain.length < chainLength) {
            GAME_STATUS_MESSAGE.textContent = 'エラー：連鎖が構築できませんでした。リセットして再試行してください。';
            CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (0枚)</h3><p style="color:red;">連鎖できる単語が見つかりませんでした。</p>`;
            return;
        }

        gameWords = selectedChain;
        CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (${gameWords.length}枚)</h3>`; 
        
        shuffleArray(selectedChain).forEach(word => {
            const nextChar = getNextChar(word.reading); 
            const card = document.createElement('div');
            
            card.className = 'word-card';
            card.draggable = true;
            card.dataset.word = word.word;
            card.dataset.reading = word.reading;
            card.dataset.nextChar = nextChar; 
            card.dataset.firstChar = word.reading.charAt(0); 
            
            card.innerHTML = `
                <img src="assets/images/${word.image}" alt="${word.word}" class="card-image">
                <div class="card-label">${word.word}</div>
            `;
            CARD_SELECTION_AREA.appendChild(card);
        });
    }

    /**
     * 指定された長さのしりとり連鎖をランダムに探す (安定版)
     */
    function findShiritoriChain(length) {
        let allAvailable = allWords.filter(word => getNextChar(word.reading) !== 'ん');
        if (allAvailable.length < length) return []; 
        
        const startChar = 'り'; 
        let attempts = 0;
        const maxAttempts = 500; 

        // 濁音・半濁音の対応マップ（清音をキーとする）
        const SHIRITORI_MAP = {
            'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
            'さ': ['ざ'], 'し': ['し', 'じ'], 'す': ['す', 'ず'], 'せ': ['せ', 'ぜ'], 'そ': ['そ', 'ぞ'],
            'た': ['だ'], 'ち': ['ち', 'ぢ'], 'つ': ['つ', 'づ'], 'て': ['て', 'で'], 'と': ['と', 'ど'],
            'は': ['ば', 'ぱ'], 'ひ': ['ひ', 'び', 'ぴ'], 'ふ': ['ふ', 'ぶ', 'ぷ'], 'へ': ['へ', 'べ', 'ぺ'], 'ほ': ['ほ', 'ぼ', 'ぽ']
        };

        // 濁音・半濁音から清音に戻すマップ
        const CLEAR_MAP = {};
        for (const [clear, dakuList] of Object.entries(SHIRITORI_MAP)) {
            dakuList.forEach(daku => { CLEAR_MAP[daku] = clear; });
        }
        
        while (attempts < maxAttempts) {
            let usedIds = new Set();
            let availableWords = shuffleArray(allAvailable); 

            // 1. 最初の「り」から始まる単語を決定
            let firstStepCandidates = availableWords.filter(word => word.reading.charAt(0) === startChar);
            if (firstStepCandidates.length === 0) { attempts++; continue; }

            const startWord = firstStepCandidates[Math.floor(Math.random() * firstStepCandidates.length)];
            
            let tempChain = [startWord];
            usedIds.add(startWord.id);
            let currentLastChar = getNextChar(startWord.reading);

            for (let i = 1; i < length; i++) {
                
                let requiredChars = [currentLastChar];
                
                // ★★★ 修正箇所: 濁音/半濁音の許容範囲を広げるロジックをより安定させる ★★★

                // 1. 前の単語の終わりが清音の場合 -> 次は清音/濁音/半濁音を許容
                if (SHIRITORI_MAP[currentLastChar]) {
                    requiredChars.push(...SHIRITORI_MAP[currentLastChar]);
                } 
                // 2. 前の単語の終わりが濁音/半濁音の場合 -> 次は濁音/半濁音（自身）か、対応する清音を許容
                else if (CLEAR_MAP[currentLastChar]) {
                    // 例: 終わりが「ご」の場合、次の開始は「ご」または「こ」
                    requiredChars.push(CLEAR_MAP[currentLastChar]);
                }
                
                let candidates = availableWords.filter(word => 
                    requiredChars.includes(word.reading.charAt(0)) && 
                    !usedIds.has(word.id)
                );
                
                if (candidates.length === 0) {
                    break;
                }
                
                const nextWord = candidates[Math.floor(Math.random() * candidates.length)];
                
                tempChain.push(nextWord);
                usedIds.add(nextWord.id);
                currentLastChar = getNextChar(nextWord.reading); 
            }

            if (tempChain.length === length) {
                return tempChain; 
            }
            attempts++;
            allAvailable = shuffleArray(allAvailable); 
        }
        
        return []; 
    }

    // ----------------------------------------------------
    // 3. ドラッグ＆ドロップ処理
    // ----------------------------------------------------

    function setupDragAndDropListeners() {
        CARD_SELECTION_AREA.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('word-card')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.word); 
                e.target.classList.add('dragging');
                e.target.style.opacity = '0.5'; 
            }
        });

        CARD_SELECTION_AREA.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('word-card')) {
                e.target.classList.remove('dragging');
                if (e.target.parentNode === CARD_SELECTION_AREA) {
                    e.target.style.opacity = '1';
                }
            }
        });
        
        SHIRITORI_GRID.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.drop-target');
            if (dropTarget && !dropTarget.classList.contains('filled')) {
                dropTarget.classList.add('drag-over');
            }
        });

        SHIRITORI_GRID.addEventListener('dragleave', (e) => {
            const target = e.target.closest('.drop-target');
            if (target) {
                target.classList.remove('drag-over');
            }
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
        
        let dropTarget = e.target.closest('.drop-target');
        
        if (!dropTarget || dropTarget.classList.contains('filled')) return;

        dropTarget.classList.remove('drag-over');

        const droppedWord = e.dataTransfer.getData('text/plain');
        const draggedCard = document.querySelector(`.word-card[data-word="${droppedWord}"]`);
        
        if (!draggedCard) {
             return;
        }

        const cellIndex = parseInt(dropTarget.dataset.cellIndex, 10);

        if (cellIndex === currentCellIndex) {
            checkAnswer(draggedCard, dropTarget);
        } else {
            // 不正解マスへのドロップ
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = `❌ ${currentCellIndex + 1}マス目に入れてね！`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
            
            // カードを元の場所に戻す
            restoreCardToSelectionArea(draggedCard); 
        }
    }
    
    // ----------------------------------------------------
    // 4. 正誤判定
    // ----------------------------------------------------

    function checkAnswer(card, dropTarget) {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        const requiredChar = prevCell.dataset.nextChar; 
        const droppedFirstChar = card.dataset.firstChar; 
        
        let isCorrect = false;

        const SHIRITORI_ALLOW_MAP = {
            'か': ['か', 'が'], 'き': ['き', 'ぎ'], 'く': ['く', 'ぐ'], 'け': ['け', 'げ'], 'こ': ['こ', 'ご'],
            'さ': ['さ', 'ざ'], 'し': ['し', 'じ'], 'す': ['す', 'ず'], 'せ': ['せ', 'ぜ'], 'そ': ['そ', 'ぞ'],
            'た': ['た', 'だ'], 'ち': ['ち', 'ぢ'], 'つ': ['つ', 'づ'], 'て': ['て', 'で'], 'と': ['と', 'ど'],
            'は': ['は', 'ば', 'ぱ'], 'ひ': ['ひ', 'び', 'ぴ'], 'ふ': ['ふ', 'ぶ', 'ぷ'], 'へ': ['へ', 'べ', 'ぺ'], 'ほ': ['ほ', 'ぼ', 'ぽ']
        };

        const allowChars = SHIRITORI_ALLOW_MAP[requiredChar] || [requiredChar];
        
        if (allowChars.includes(droppedFirstChar)) {
            isCorrect = true;
        }

        if (isCorrect) {
            // ★ 正解 ★
            playSound(SOUND_CORRECT_PATH);
            
            dropTarget.innerHTML = card.innerHTML;
            dropTarget.classList.remove('drop-target');
            dropTarget.classList.add('filled');
            dropTarget.dataset.word = card.dataset.word;
            dropTarget.dataset.nextChar = card.dataset.nextChar; 

            card.remove();

            currentCellIndex++;

            if (currentCellIndex > MAX_WORDS) {
                endGame(true);
            } else if (card.dataset.nextChar === 'ん') {
                endGame(false);
            } else {
                updateUI(true);
            }

        } else {
            // ★ 不正解 ★
            playSound(SOUND_INCORRECT_PATH);
            
            const HINT_CHARS = Object.keys(SHIRITORI_ALLOW_MAP);
            let requiredDisplay;

            if (HINT_CHARS.includes(requiredChar)) {
                 const dakuOns = SHIRITORI_ALLOW_MAP[requiredChar].filter(c => c !== requiredChar).join('/');
                 requiredDisplay = `${requiredChar}（または${dakuOns}）`;
            } else {
                requiredDisplay = requiredChar;
            }
            
            FEEDBACK_MESSAGE.textContent = `❌「${requiredDisplay}」から始まる言葉じゃないよ...。`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
            
            restoreCardToSelectionArea(card);
        }
    }
    
    // ----------------------------------------------------
    // 5. UIの更新とリセット
    // ----------------------------------------------------

    function updateUI(isCorrectMove) {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        if (!prevCell) return; 

        const prevChar = prevCell.dataset.nextChar;
        const nextCellNumber = currentCellIndex + 1;
        
        GAME_STATUS_MESSAGE.textContent = `マス目 ${currentCellIndex} / ${MAX_WORDS}`;
        
        const HINT_CHARS = ['か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'は', 'ひ', 'ふ', 'へ', 'ほ'];
        
        let hint = '';
        if (HINT_CHARS.includes(prevChar)) {
             hint = `（または濁音/半濁音）`;
        } 

        FEEDBACK_MESSAGE.textContent = `次は${nextCellNumber}マス目。「${prevChar}」${hint}から始まるカードをドロップしてね！`;
        FEEDBACK_MESSAGE.style.color = '#3f51b5';
        
        // 戻るボタンの表示制御
        if (currentCellIndex > 1 && currentCellIndex <= MAX_WORDS + 1) {
            RETURN_CARD_BUTTON.style.display = 'inline-block';
        } else {
            RETURN_CARD_BUTTON.style.display = 'none';
        }
    }

    function resetGame() {
        if (confirm("ゲームを最初からリセットしますか？")) {
            window.location.reload(); 
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
        
        SHIRITORI_GRID.removeEventListener('drop', handleDrop);
        RETURN_CARD_BUTTON.style.display = 'none'; // 終了時は非表示
        RESET_BUTTON.style.backgroundColor = '#4CAF50';
    }

    loadWords();
});