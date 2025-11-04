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

    /**
     * 単語の読みを正規化し、しりとりで使う最後の文字（長音、小書き仮名処理済み）を返す
     * ★濁音・半濁音を区別するために、そのまま返すように修正
     * @param {string} reading - 単語の読み（ひらがな）
     * @returns {string} しりとりで使う次の文字
     */
    function getNextChar(reading) {
        if (!reading) return '';
        let lastChar = reading.slice(-1);
        
        // 長音（ー）の場合、その前の文字を使う
        if (lastChar === 'ー' && reading.length > 1) {
            lastChar = reading.slice(-2, -1);
        }
        
        // 小書き仮名（ゃゅょ）を大きな仮名に戻す
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
        // ... (省略: UIの初期化は変更なし) ...
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
        // 「しりとり」の次の文字は「り」
        SHIRITORI_GRID.innerHTML = `
            <div id="cell-0" class="grid-cell filled" data-word="しりとり" data-last-char="り" data-next-char="り">
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
    // 2. カードの選択と表示 (修正版)
    // ----------------------------------------------------

    function selectAndRenderCards() {
        const chainLength = MAX_WORDS; // 15
        
        // 1. 15個の連続するしりとりチェーンを探索する (修正されたfindShiritoriChainを使用)
        let selectedChain = findShiritoriChain(chainLength);

        if (selectedChain.length < chainLength) {
            GAME_STATUS_MESSAGE.textContent = 'エラー：連鎖が構築できませんでした。リセットしてください。';
            // データが不足している場合や、うまく連鎖が見つからない場合に備え、エラーを詳細に表示
            console.error("しりとりチェーンが見つかりませんでした。データを確認してください。", selectedChain);
            return;
        }

        gameWords = selectedChain;
        CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (${gameWords.length}枚)</h3>`;
        
        shuffleArray(gameWords).forEach(word => {
            const nextChar = getNextChar(word.reading); // 次の単語の開始文字
            const card = document.createElement('div');
            
            card.className = 'word-card';
            card.draggable = true;
            card.dataset.word = word.word;
            card.dataset.reading = word.reading;
            card.dataset.nextChar = nextChar; // この単語の終わりの文字
            card.dataset.firstChar = word.reading.charAt(0); // この単語の最初の文字
            
            card.innerHTML = `
                <img src="assets/images/${word.image}" alt="${word.word}" class="card-image">
                <div class="card-label">${word.word}</div>
            `;
            CARD_SELECTION_AREA.appendChild(card);
        });
    }

    /**
     * 指定された長さのしりとりチェーンを探索する (バックトラック方式)
     * ★ここが核心の修正箇所です
     * @param {number} length - 必要なチェーンの長さ
     * @returns {Array<object>} 見つかった単語の配列
     */
    function findShiritoriChain(length) {
        // 「ん」で終わるものを除外したリスト
        let allAvailable = allWords.filter(word => getNextChar(word.reading) !== 'ん');
        if (allAvailable.length < length) return []; 
        
        const startChar = 'り'; // 最初の単語「しりとり」の終わり
        let chain = [];
        let usedIds = new Set();
        let attempts = 0;
        const maxAttempts = 200; // 試行回数を少し増やす

        // 濁音・半濁音変換マップ（最初の文字をこれでチェックする）
        const SHIRITORI_MAP = {
            'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
            'さ': ['ざ'], 'し': ['じ'], 'す': ['ず'], 'せ': ['ぜ'], 'そ': ['ぞ'],
            'た': ['だ'], 'ち': ['ぢ'], 'つ': ['づ'], 'て': ['で'], 'と': ['ど'],
            'は': ['ば', 'ぱ'], 'ひ': ['び', 'ぴ'], 'ふ': ['ぶ', 'ぷ'], 'へ': ['べ', 'ぺ'], 'ほ': ['ぼ', 'ぽ']
        };

        // 成功するまで何度も試行する
        while (attempts < maxAttempts) {
            chain = [];
            usedIds.clear();
            let currentLastChar = startChar;
            
            for (let i = 0; i < length; i++) {
                const requiredChars = [currentLastChar];
                
                // 濁音・半濁音の前の文字（清音）の場合、その濁音・半濁音も許容する
                // 例: 「り」-> 「り」で始まる単語を探す
                // 例: 「か」-> 「か」または「が」で始まる単語を探す
                for (const [key, values] of Object.entries(SHIRITORI_MAP)) {
                    if (values.includes(currentLastChar)) {
                        requiredChars.push(key);
                        break; // 既に見つかったらループを抜ける
                    } else if (key === currentLastChar) {
                        requiredChars.push(...values);
                        break;
                    }
                }
                
                // 候補となる単語を抽出
                let candidates = allAvailable.filter(word => 
                    requiredChars.includes(word.reading.charAt(0)) && 
                    !usedIds.has(word.id)
                );
                
                if (candidates.length === 0) {
                    break;
                }
                
                // ランダムに次の単語を選択
                const nextWord = candidates[Math.floor(Math.random() * candidates.length)];
                
                chain.push(nextWord);
                usedIds.add(nextWord.id);
                // 次の単語の最後の文字を設定
                currentLastChar = getNextChar(nextWord.reading); 
            }

            if (chain.length === length) {
                return chain; // 成功！
            }
            attempts++;
            // 試行回数が増えたら、次の単語の選択に使うリストをリフレッシュする
            allAvailable = shuffleArray(allAvailable); 
        }

        return []; // 最大試行回数に達しても見つからなかった場合
    }

    // ----------------------------------------------------
    // 3. ドラッグ＆ドロップ処理
    // ----------------------------------------------------

    function setupDragAndDropListeners() {
        // ... (変更なし) ...
        // 省略
        SHIRITORI_GRID.addEventListener('drop', handleDrop);

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
    // 4. 正誤判定 (修正: 濁音・半濁音を考慮)
    // ----------------------------------------------------

    function checkAnswer(card, dropTarget) {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        const requiredChar = prevCell.dataset.nextChar; // 前の単語の次の文字（濁音・半濁音を含む）
        const droppedFirstChar = card.dataset.firstChar; // ドロップされた単語の最初の文字
        
        let isCorrect = false;

        // 濁音・半濁音の許容範囲マップ
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
            
            // マスにカードを移動して固定
            dropTarget.innerHTML = card.innerHTML;
            dropTarget.classList.remove('drop-target');
            dropTarget.classList.add('filled');
            dropTarget.dataset.word = card.dataset.word;
            dropTarget.dataset.nextChar = card.dataset.nextChar; // 次の単語の開始文字を保存

            // 元のカードを削除
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
            FEEDBACK_MESSAGE.textContent = `❌「${requiredChar}」から始まる言葉じゃないよ...。`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
        }
    }
    
    // ----------------------------------------------------
    // 5. UIの更新とリセット
    // ----------------------------------------------------

    function updateUI(isCorrectMove) {
        const prevChar = document.getElementById(`cell-${currentCellIndex - 1}`).dataset.nextChar;
        const nextCellNumber = currentCellIndex + 1;
        
        GAME_STATUS_MESSAGE.textContent = `マス目 ${currentCellIndex} / ${MAX_WORDS}`;
        
        // UIのメッセージで、濁音/半濁音のルールをヒントとして出す
        let hint = '';
        if (prevChar in {'か':1, 'き':1, 'く':1, 'け':1, 'こ':1, 'さ':1, 'し':1, 'す':1, 'せ':1, 'そ':1, 'た':1, 'ち':1, 'つ':1, 'て':1, 'と':1, 'は':1, 'ひ':1, 'ふ':1, 'へ':1, 'ほ':1}) {
             hint = `（${prevChar}でも濁音/半濁音でもOK）`;
        }


        FEEDBACK_MESSAGE.textContent = `次は${nextCellNumber}マス目。「${prevChar}」${hint}から始まるカードをドロップしてね！`;
        FEEDBACK_MESSAGE.style.color = '#3f51b5';
    }

    function resetGame() {
        if (confirm("ゲームを最初からリセットしますか？")) {
            setupGame();
        }
    }

    function endGame(isWin) {
        let finalMessage;
        // ... (変更なし) ...
        // 省略
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
        RESET_BUTTON.style.backgroundColor = '#4CAF50';
    }

    loadWords();
});