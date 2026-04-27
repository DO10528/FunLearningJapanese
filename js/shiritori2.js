document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // ★★★ Firebase連携設定 ★★★
    // ----------------------------------------------------
    const POINTS_ON_CLEAR = 1; // 全マス埋めクリアで獲得するポイント
    
    // ★★★ 古いローカルストレージベースのポイント関数は削除しました ★★★


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
    const REMAINING_COUNT_MESSAGE = document.getElementById('remaining-count-message'); // 残り単語数表示
    
    // Firebaseフィードバック用の隠しDOM要素を参照
    const FINAL_SCORE_TEXT = document.getElementById('final-score-text');
    const POINT_RECORD_FEEDBACK = document.getElementById('point-record-feedback');


    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

    let allWords = [];          
    let gameWords = [];         
    let currentCellIndex = 1;   
    const MAX_WORDS = 15;       
    let isGameComplete = false; // 二重ポイント付与防止用フラグ
    
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
        
        // 長音
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
            // データがJSON形式で読み込まれることを期待
            const data = await response.json(); 
            // 読み仮名があり、「ん」で終わらない単語のみを選別し、IDを文字列に変換
            allWords = data.filter(word => 
                word.reading && getNextChar(word.reading) !== 'ん'
            ).map(word => ({
                ...word,
                id: String(word.id)
            }));
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            // エラー時はアラートを表示し、ゲーム続行不可
            alert('単語データを読み込めませんでした。ファイルパスとサーバー接続を確認してください。');
        }
    }

    window.startShiritori2Game = function() {
        if (allWords.length === 0) {
            // データがまだロードされていなければ、ロード後にセットアップ
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

        currentCellIndex = 1;
        isGameComplete = false; 
        gameWords = [];
        
        // グリッドの初期化 (cell-0のしりとりはHTMLに固定)
        SHIRITORI_GRID.textContent = document.getElementById('cell-0').outerHTML;
        
        // 残りのマス目を生成
        for (let i = 1; i <= MAX_WORDS; i++) {
            SHIRITORI_GRID.innerHTML += `<div id="cell-${i}" class="grid-cell drop-target" data-cell-index="${i}" data-word-id=""></div>`;
        }
        
        RETURN_CARD_BUTTON.style.display = 'none';

        selectAndRenderCards();
        setupDragAndDropListeners();
        updateUI(true);
    }
    
    // ----------------------------------------------------
    // 2. カードの選択と表示
    // ----------------------------------------------------
    
    // ※ findShiritoriChain 関数は前回のコードから変更せずに統合します。

    function selectAndRenderCards() {
        const chainLength = MAX_WORDS; 
        let selectedChain = findShiritoriChain(chainLength);

        if (selectedChain.length < chainLength) {
            GAME_STATUS_MESSAGE.textContent = 'エラー：連鎖が構築できませんでした。リセットして再試行してください。';
            CARD_SELECTION_AREA.innerHTML = `<h3>残りの単語 (0枚)</h3><p style="color:red;">連鎖できる単語が見つかりませんでした。</p>`;
            return;
        }

        gameWords = selectedChain;
        REMAINING_COUNT_MESSAGE.textContent = `残りの単語 (${gameWords.length}枚)`; 
        CARD_SELECTION_AREA.textContent = REMAINING_COUNT_MESSAGE.outerHTML; // 見出しを再挿入
        
        shuffleArray(selectedChain).forEach(word => {
            const nextChar = getNextChar(word.reading); 
            const card = document.createElement('div');
            
            card.className = 'word-card';
            card.draggable = true;
            card.dataset.word = word.word;
            card.dataset.reading = word.reading;
            card.dataset.nextChar = nextChar; 
            card.dataset.firstChar = word.reading.charAt(0); 
            card.dataset.id = word.id; // IDを追加
            
            // ★ご要望：カードラベルはwordData.wordをそのまま使用
            card.innerHTML = `
                <img src="assets/images/${word.image}" alt="${word.word}" class="card-image" onerror="this.style.display='none'; this.parentNode.querySelector('.card-label').style.display='block';">
                <div class="card-label">${word.word}</div>
            `;
            CARD_SELECTION_AREA.appendChild(card);
        });
    }

    function findShiritoriChain(length) {
        // (省略解除: 必須のためそのまま統合。ただし、getNextCharの依存性を確保)
        
        let allAvailable = allWords.filter(word => getNextChar(word.reading) !== 'ん');
        if (allAvailable.length < length) return []; 
        
        const startChar = 'り'; 
        let attempts = 0;
        const maxAttempts = 500; 

        const SHIRITORI_MAP = {
            'か': ['が'], 'き': ['ぎ'], 'く': ['ぐ'], 'け': ['げ'], 'こ': ['ご'],
            'さ': ['ざ'], 'し': ['し', 'じ'], 'す': ['す', 'ず'], 'せ': ['せ', 'ぜ'], 'そ': ['そ', 'ぞ'],
            'た': ['だ'], 'ち': ['ち', 'ぢ'], 'つ': ['つ', 'づ'], 'て': ['で'], 'と': ['と', 'ど'],
            'は': ['ば', 'ぱ'], 'ひ': ['び', 'ぴ'], 'ふ': ['ぶ', 'ぷ'], 'へ': ['へ', 'べ', 'ぺ'], 'ほ': ['ほ', 'ぼ', 'ぽ']
        };
        
        while (attempts < maxAttempts) {
            let usedIds = new Set();
            let availableWords = shuffleArray(allAvailable); 

            let firstStepCandidates = availableWords.filter(word => word.reading.charAt(0) === startChar);
            if (firstStepCandidates.length === 0) { attempts++; continue; }

            const startWord = firstStepCandidates[Math.floor(Math.random() * firstStepCandidates.length)];
            
            let tempChain = [startWord];
            usedIds.add(startWord.id);
            let currentLastChar = getNextChar(startWord.reading);

            for (let i = 1; i < length; i++) {
                let requiredChars = [currentLastChar];
                if (SHIRITORI_MAP[currentLastChar]) {
                    requiredChars.push(...SHIRITORI_MAP[currentLastChar]);
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
        // ドラッグ開始/終了
        CARD_SELECTION_AREA.addEventListener('dragstart', (e) => {
            if (isGameComplete) { e.preventDefault(); return; }
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
        
        // ドロップエリア設定
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

        // ボタンのイベント
        RESET_BUTTON.addEventListener('click', resetGame);
        BACK_BUTTON.addEventListener('click', () => {
            GAME_AREA.style.display = 'none';
            MENU_AREA.style.display = 'block';
        });
        RETURN_CARD_BUTTON.addEventListener('click', returnCardFromCell);
    }


    function handleDrop(e) {
        if (isGameComplete) return;
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

        // 現在のマス目しか受け付けない
        if (cellIndex === currentCellIndex) {
            checkAnswer(draggedCard, dropTarget);
        } else {
            playSound(SOUND_INCORRECT_PATH);
            FEEDBACK_MESSAGE.textContent = `❌ ${currentCellIndex}マス目に入れてね！`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
            // カードは自動で元の位置に戻るため、処理不要
        }
    }
    
    // ----------------------------------------------------
    // 4. 正誤判定
    // ----------------------------------------------------

    async function checkAnswer(card, dropTarget) { // ★ async関数に変更
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        const requiredChar = prevCell.dataset.nextChar; 
        const droppedFirstChar = card.dataset.firstChar; 
        
        let isCorrect = false;

        // 濁音/半濁音の許容マップ
        const SHIRITORI_ALLOW_MAP = {
            'か': ['か', 'が'], 'き': ['き', 'ぎ'], 'く': ['く', 'ぐ'], 'け': ['け', 'げ'], 'こ': ['こ', 'ご'],
            'さ': ['さ', 'ざ'], 'し': ['し', 'じ'], 'す': ['す', 'ず'], 'せ': ['せ', 'ぜ'], 'そ': ['そ', 'ぞ'],
            'た': ['た', 'だ'], 'ち': ['ち', 'ぢ'], 'つ': ['つ', 'づ'], 'て': ['て', 'で'], 'と': ['と', 'ど'],
            'は': ['は', 'ば', 'ぱ'], 'ひ': ['ひ', 'び', 'ぴ'], 'ふ': ['ふ', 'ぶ', 'ぷ'], 'へ': ['へ', 'べ', 'ぺ'], 'ほ': ['ほ', 'ぼ', 'ぽ'],
            'や': ['や'], 'ゆ': ['ゆ'], 'よ': ['よ'], 'わ': ['わ'], 'ん': ['ん'], // 他の文字も必須で追加
            // 長音、小文字はgetNextCharで処理されるため、ここで処理するのは濁音/半濁音のみ
        };
        
        const allowChars = SHIRITORI_ALLOW_MAP[requiredChar] || [requiredChar];
        
        if (allowChars.includes(droppedFirstChar)) {
            isCorrect = true;
        }

        if (isCorrect) {
            playSound(SOUND_CORRECT_PATH);
            
            // マスにカードの内容を埋め込む (カードのHTML構造をコピー)
            dropTarget.textContent = card.textContent;
            dropTarget.querySelector('.card-image').style.display = 'none'; // マス内では画像は表示しない
            dropTarget.querySelector('.card-label').classList.replace('card-label', 'word-text'); // ラベルをword-textに変更
            
            // マス目データ更新
            dropTarget.classList.remove('drop-target');
            dropTarget.classList.add('filled');
            dropTarget.dataset.word = card.dataset.word;
            dropTarget.dataset.nextChar = card.dataset.nextChar;
            dropTarget.dataset.wordId = card.dataset.id; // IDをマスに追加

            // 元のカードをリストから除去
            card.remove();

            currentCellIndex++;

            // 最後のマスまで埋まったらクリア (MAX_WORDS = 15なので、currentCellIndexが16になったらクリア)
            if (currentCellIndex > MAX_WORDS) {
                await endGame(true); // ★ ポイント付与のためawait
            } else if (card.dataset.nextChar === 'ん') {
                await endGame(false); // 「ん」で終わった場合は負け
            } else {
                updateUI(true); 
            }

        } else {
            playSound(SOUND_INCORRECT_PATH);
            
            // ヒント表示ロジック
            const requiredDisplay = SHIRITORI_ALLOW_MAP[requiredChar] ? 
                                    `${requiredChar}（または${SHIRITORI_ALLOW_MAP[requiredChar].join('/')}）` : 
                                    requiredChar;
            
            FEEDBACK_MESSAGE.textContent = `❌「${requiredDisplay}」から始まる言葉じゃないよ...。`;
            FEEDBACK_MESSAGE.style.color = '#ff6f61';
            // カードは自動で元の場所に戻るため、処理不要
        }
    }
    
    // ----------------------------------------------------
    // 5. UIの更新とリセット
    // ----------------------------------------------------
    
    // カードをマスから選別エリアに戻す処理 (ボタンクリック用)
    function returnCardFromCell() {
        if (isGameComplete) return;

        const targetCellIndex = currentCellIndex - 1;
        
        if (targetCellIndex <= 0) {
            alert("「しりとり」のマスは戻せません。");
            return;
        }

        const targetCell = document.getElementById(`cell-${targetCellIndex}`);
        
        if (targetCell && targetCell.classList.contains('filled')) {
            const wordName = targetCell.dataset.word;
            const wordData = gameWords.find(w => w.word === wordName); // gameWordsからデータを検索
            
            if (wordData) {
                // カードを再作成
                const card = document.createElement('div');
                card.className = 'word-card';
                card.draggable = true;
                
                card.dataset.word = wordData.word;
                card.dataset.reading = wordData.reading;
                card.dataset.nextChar = getNextChar(wordData.reading); 
                card.dataset.firstChar = wordData.reading.charAt(0);
                card.dataset.id = wordData.id;

                card.innerHTML = `
                    <img src="assets/images/${wordData.image}" alt="${wordData.word}" class="card-image" onerror="this.style.display='none'; this.parentNode.querySelector('.card-label').style.display='block';">
                    <div class="card-label">${wordData.word}</div>
                `;

                CARD_SELECTION_AREA.appendChild(card);
            }

            // セルを空に戻す
            targetCell.textContent = '';
            targetCell.classList.remove('filled');
            targetCell.classList.add('drop-target');
            // datasetのデータもクリア
            targetCell.removeAttribute('data-word');
            targetCell.removeAttribute('data-next-char');
            targetCell.removeAttribute('data-word-id');


            currentCellIndex--;

            updateUI(true); 
        } else {
            alert("戻せるカードがありません。");
        }
    }

    function updateUI(isCorrectMove) {
        const prevCell = document.getElementById(`cell-${currentCellIndex - 1}`);
        if (!prevCell) return; 

        const prevChar = prevCell.dataset.nextChar;
        const nextCellNumber = currentCellIndex; // 1マス目から数える
        
        GAME_STATUS_MESSAGE.textContent = `マス目 ${nextCellNumber} / ${MAX_WORDS}`;
        REMAINING_COUNT_MESSAGE.textContent = `残りの単語 (${MAX_WORDS - (currentCellIndex - 1)}枚)`;
        
        const HINT_CHARS = ['か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'は', 'ひ', 'ふ', 'へ', 'ほ'];
        
        let hint = '';
        if (HINT_CHARS.includes(prevChar)) {
             hint = `（または濁音/半濁音）`;
        } 

        FEEDBACK_MESSAGE.textContent = `せいかい！次は${nextCellNumber}マス目。「${prevChar}」${hint}から始まるカードをドロップしてね！`;
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

    async function endGame(isWin) { // ★ async関数に変更
        isGameComplete = true; // 終了フラグを立てる
        let finalMessage;
        let pointMsg = 'ゲストモードのためポイントは記録されません。';
        
        if (isWin) {
            playSound(SOUND_CORRECT_PATH);
            
            // ★★★ Firebaseポイント付与 ★★★
            if (window.Antigravity && window.Antigravity.addPoint) {
                const success = await window.Antigravity.addPoint('shiritori2', handleDrop);
        RETURN_CARD_BUTTON.style.display = 'none'; 
        RESET_BUTTON.style.backgroundColor = '#4CAF50';
    }

    loadWords();
});