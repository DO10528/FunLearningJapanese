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

    /**
     * 単語の読みを正規化し、しりとりで使う次の文字を返す
     */
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
        // カードエリアの最後に再度追加
        CARD_SELECTION_AREA.appendChild(card);
        // ドラッグ中の状態と透明度をリセット
        card.classList.remove('dragging');
        card.style.opacity = '1';
    }


    // ----------------------------------------------------
    // 1. ゲームの初期化と開始
    // ----------------------------------------------------

    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            // 「ん」で終わる単語と、読みがない単語をあらかじめ除外
            allWords = allWords.filter(word => 
                word.reading && getNextChar(word.reading) !== 'ん'
            );
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
            <div id="cell-0" class="grid-cell filled" data-word="しりとり" data-next-char="り">
                <span class="word-text">しりとり</span>
            </div>
        `;
        // 2マス目から16マス目まで（ドロップ可能マス）
        for (let i = 1; i <= MAX_WORDS; i++) {
            SHIRITORI_GRID.innerHTML += `<div id="cell-${i}" class="grid-cell drop-target" data-cell-index="${i}"></div>`;
        }

        selectAndRenderCards();
        setupDragAndDropListeners();
        updateUI(true);
    }
    
    // ----------------------------------------------------
    // 2. カードの選択と表示 (★カードレンダリングの確実化)
    // ----------------------------------------------------

    function selectAndRenderCards() {
        const chainLength = MAX_WORDS; 
        let selectedChain = findShiritoriChain(chainLength);

        if (selectedChain.length < chainLength) {
            GAME_STATUS_MESSAGE.textContent = 'エラー：連鎖が構築できませんでした。データを見直すか、リセットしてください。';
            console.error("しりとりチェーンが見つかりませんでした。データを確認してください。", selectedChain);
            return;
        }

        gameWords = selectedChain;
        // カードエリアの表示をクリア
        CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (${gameWords.length}枚)</h3>`; 
        
        // ユーザーが自分で正しい順序を探せるよう、シャッフルしたカードを表示
        shuffleArray(selectedChain).forEach(word => {
            const nextChar = getNextChar(word.reading); 
            const card = document.createElement('div');
            
            card.className = 'word-card';
            card.draggable = true;
            // ★修正点: データセットに単語情報と次の文字情報を正しく格納
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
     * 指定された長さのしりとりチェーンを探索する (安定版)
     */
    function findShiritoriChain(length) {
        let allAvailable = allWords.filter(word => getNextChar(word.reading) !== 'ん');
        if (allAvailable.length < length) return []; 
        
        const startChar = 'り'; 
        const maxAttempts = 500; 

        // 濁音・半濁音の対応マップ（清音をキーとする）
        const SHIRITORI_MAP = {
            'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
            'さ': ['ざ'], 'し': ['じ'], 'す': ['ず'], 'せ': ['ぜ'], 'そ': ['ぞ'],
            'た': ['だ'], 'ち': ['ぢ'], 'つ': ['づ'], 'て': ['で'], 'と': ['ど'],
            'は': ['ば', 'ぱ'], 'ひ': ['ひ', 'び', 'ぴ'], 'ふ': ['ぶ', 'ぷ'], 'へ': ['へ', 'べ', 'ぺ'], 'ほ': ['ほ', 'ぼ', 'ぽ']
        };

        // 濁音・半濁音から清音に戻すマップ
        const CLEAR_MAP = {};
        for (const [clear, dakuList] of Object.entries(SHIRITORI_MAP)) {
            dakuList.forEach(daku => {
                CLEAR_MAP[daku] = clear;
            });
        }

        while (attempts < maxAttempts) {
            let chain = [];
            let usedIds = new Set();
            let currentLastChar = startChar;
            
            // 1. 最初の「り」から始まる単語を決定
            let candidates = allAvailable.filter(word => word.reading.charAt(0) === startChar && !usedIds.has(word.id));
            if (candidates.length === 0) { attempts++; continue; }
            
            const firstWord = candidates[Math.floor(Math.random() * candidates.length)];
            chain.push(firstWord);
            usedIds.add(firstWord.id);
            currentLastChar = getNextChar(firstWord.reading);

            // 2. 2番目以降の単語を探索
            for (let i = 1; i < length; i++) {
                
                let requiredChars = [currentLastChar];
                
                // ★★★ 修正点1: 連鎖構築ロジックの安定化 ★★★
                
                // 前の単語の終わりが清音の場合 (例:「ま」) -> 次は清音/濁音/半濁音を許容 (ま, ば, ぱ)
                if (SHIRITORI_MAP[currentLastChar]) {
                    requiredChars.push(...SHIRITORI_MAP[currentLastChar]);
                } 
                // 前の単語の終わりが濁音/半濁音の場合 (例:「ご」)
                // -> 次は濁音/半濁音（ご）だけでなく、対応する清音（こ）も許容する
                else if (CLEAR_MAP[currentLastChar]) {
                    requiredChars.push(CLEAR_MAP[currentLastChar]);
                }
                
                let candidates = allAvailable.filter(word => 
                    requiredChars.includes(word.reading.charAt(0)) && 
                    !usedIds.has(word.id)
                );
                
                if (candidates.length === 0) {
                    break;
                }
                
                const nextWord = candidates[Math.floor(Math.random() * candidates.length)];
                
                chain.push(nextWord);
                usedIds.add(nextWord.id);
                currentLastChar = getNextChar(nextWord.reading); 
            }

            if (chain.length === length) {
                return chain; 
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
        // ドラッグ開始
        CARD_SELECTION_AREA.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('word-card')) {
                // data-wordを保存 (ドロップ時にカードを見つけるためのキー)
                e.dataTransfer.setData('text/plain', e.target.dataset.word); 
                e.target.classList.add('dragging');
                // ドロップされるまでカードを透明にする
                e.target.style.opacity = '0.5'; 
            }
        });

        // ドラッグ終了 (カードがドロップされずに指が離された時など)
        CARD_SELECTION_AREA.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('word-card')) {
                e.target.classList.remove('dragging');
                // ドロップ成功しなかった場合、透明度を元に戻す
                if (e.target.parentNode === CARD_SELECTION_AREA) {
                    e.target.style.opacity = '1';
                }
            }
        });

        // ... (dragover, dragleave は変更なし) ...

        SHIRITORI_GRID.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.drop-target');
            if (dropTarget && !dropTarget.classList.contains('filled')) {
                dropTarget.classList.add('drag-over');
            } else if (e.target.closest('.drop-target') && !e.target.closest('.drop-target').classList.contains('filled')) {
                 e.target.closest('.drop-target').classList.add('drag-over');
            }
        });

        SHIRITORI_GRID.addEventListener('dragleave', (e) => {
            const target = e.target.closest('.drop-target');
            if (target) {
                target.classList.remove('drag-over');
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
        
        let dropTarget = e.target.closest('.drop-target');
        
        if (!dropTarget || dropTarget.classList.contains('filled')) return;

        dropTarget.classList.remove('drag-over');

        const droppedWord = e.dataTransfer.getData('text/plain');
        // ドロップされたカード要素を取得
        const draggedCard = document.querySelector(`.word-card[data-word="${droppedWord}"]`);
        
        if (!draggedCard) {
             // カードが見つからない場合はここで復元せず、次の処理に進む（または終了）
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
            
            // ★修正点2: 不正解なマスでも、ドロップされたカードを元の場所に戻す
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

        // 許容される最初の文字リストを取得
        const allowChars = SHIRITORI_ALLOW_MAP[requiredChar] || [requiredChar];
        
        if (allowChars.includes(droppedFirstChar)) {
            isCorrect = true;
        }

        if (isCorrect) {
            // ★ 正解 ★
            playSound(SOUND_CORRECT_PATH);
            
            // マスにカードの内容をコピーして固定
            dropTarget.innerHTML = card.innerHTML;
            dropTarget.classList.remove('drop-target');
            dropTarget.classList.add('filled');
            dropTarget.dataset.word = card.dataset.word;
            dropTarget.dataset.nextChar = card.dataset.nextChar; 

            // 元のカードを**削除**
            card.remove();

            // 次のマスに進む
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
            
            // 正解に必要な文字を明確に表示 (UIヒントと同じロジックを使う)
            const HINT_CHARS = Object.keys(SHIRITORI_ALLOW_MAP);
            let requiredDisplay;

            if (HINT_CHARS.includes(requiredChar)) {
                 // 清音で終わる場合: 清音と濁音/半濁音の両方を表示
                 const dakuOns = SHIRITORI_ALLOW_MAP[requiredChar].filter(c => c !== requiredChar).join('/');
                 requiredDisplay = `${requiredChar}（または${dakuOns}）`;
            } else {
                // その他の文字（濁音/半濁音を含む）で終わる場合: その文字のみ
                requiredDisplay = requiredChar;
            }
            
            FEEDBACK_MESSAGE.textContent = `❌「${requiredDisplay}」から始まる言葉じゃないよ...。`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
            
            // ★修正点2: カードを元の場所に戻す
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
        
        // UIのメッセージで、濁音/半濁音のルールをヒントとして出す
        const HINT_CHARS = ['か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'は', 'ひ', 'ふ', 'へ', 'ほ'];
        
        let hint = '';
        if (HINT_CHARS.includes(prevChar)) {
             // 清音で終わる場合は、清音と濁音/半濁音を許容
             hint = `（または濁音/半濁音）`;
        } else {
            // 濁音/半濁音で終わる場合は、その文字で始まる単語のみ
            // ユーザーに混乱を与えないよう、ヒントを省略
        }


        FEEDBACK_MESSAGE.textContent = `次は${nextCellNumber}マス目。「${prevChar}」${hint}から始まるカードをドロップしてね！`;
        FEEDBACK_MESSAGE.style.color = '#3f51b5';
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
        
        // リスナーを削除
        SHIRITORI_GRID.removeEventListener('drop', handleDrop);
        // リセットボタンを強調
        RESET_BUTTON.style.backgroundColor = '#4CAF50';
    }

    loadWords();
});