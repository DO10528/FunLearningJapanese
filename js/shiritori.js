document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の取得 (shiritori.html に合わせる)
    // ----------------------------------------------------
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_DISPLAY_TEXT = document.getElementById('current-word-display'); // 単語表示スパン
    const IMAGE_AREA = document.getElementById('image-area'); // 現在の単語の画像エリア
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('feedback');
    const GAME_CONTROLS = document.getElementById('game-controls'); // プレイ中のボタンエリア
    const END_GAME_CONTROLS = document.getElementById('endGameControls'); // ゲーム終了時ボタンエリア

    // ★★★ 修正点 1: 音声ファイルのパスを修正 ★★★
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 
    // ★★★★★★★★★★★★★★★★★★★★★

    let allWords = []; // data/words.json から読み込む全単語
    let currentWord = null; // 直前の単語
    let gameHistoryIds = new Set(); // 既に使用した単語のID
    let turnCount = 0; // しりとりが続いた回数

    // ★★★ 補助関数: 音源を再生する関数 ★★★
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }
    // ★★★★★★★★★★★★★★★★★★★★★

    // 1. ゲーム開始関数 (HTMLの onclick="startNewGame()" から呼ばれる)
    // ★★★これが shiritori.html のボタンから呼ばれる関数です★★★
    window.startNewGame = function() {
        if (allWords.length === 0) {
            loadWords().then(startNewGameLogic);
        } else {
            startNewGameLogic();
        }
    };

    function startNewGameLogic() {
        if (allWords.length < 4) { // しりとりには最低4単語は必要
            alert('ゲームを開始するには最低4つ以上の単語データが必要です。');
            return;
        }
        
        MENU_AREA.style.display = 'none'; 
        GAME_AREA.style.display = 'block'; 
        END_GAME_CONTROLS.style.display = 'none';
        GAME_CONTROLS.style.display = 'block'; // プレイ中ボタンを表示

        // 状態をリセット
        gameHistoryIds.clear();
        turnCount = 0;
        FEEDBACK.textContent = '単語を選んでね！';
        
        // 最初の単語をランダムに選ぶ (「ん」で終わらないもの)
        let availableWords = allWords.filter(word => getCleanLastChar(word.reading) !== 'ん');
        currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        gameHistoryIds.add(currentWord.id);
        
        updateTurnMessage();
        showNextQuestion();
    }
    
    // 2. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            // 読み（reading）がないデータを除外
            allWords = allWords.filter(word => word.reading && word.reading.trim() !== '');
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 3. 問題（次の3択）を表示する
    function showNextQuestion() {
        const lastChar = getCleanLastChar(currentWord.reading);

        let correctOptions = allWords.filter(word => 
            word.reading.startsWith(lastChar) && 
            !gameHistoryIds.has(word.id)
        );
        let wrongOptions = allWords.filter(word => 
            !word.reading.startsWith(lastChar) && 
            !gameHistoryIds.has(word.id)
        );

        if (correctOptions.length === 0) {
            endGame(true); // true = 勝利
            return;
        }

        let choices = [];
        choices.push(correctOptions[Math.floor(Math.random() * correctOptions.length)]);
        
        wrongOptions = shuffleArray(wrongOptions);
        choices.push(wrongOptions[0]);
        if (wrongOptions.length > 1) {
            choices.push(wrongOptions[1]);
        } else {
            choices.push(allWords[Math.floor(Math.random() * allWords.length)]);
        }

        choices = shuffleArray(choices);
        renderQuestion(choices);
    }

    // 4. 画面に問題と選択肢を表示する
    function renderQuestion(choices) {
        // 4a. 直前の単語（現在のお題）を表示
        CURRENT_WORD_DISPLAY_TEXT.textContent = currentWord.word;
        const imagePath = `assets/images/${currentWord.image}`; 
        IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" alt="${currentWord.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='画像なし';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover;">
        `;
        
        // ★★★ 修正点 2: 3択の選択肢を「イラストのみ」に変更 ★★★
        CHOICE_BUTTONS_AREA.innerHTML = choices.map(word => 
            `<div class="menu-card-button menu-card-reset choice-card" data-id="${word.id}">
                
                <img src="assets/images/${word.image}" alt="${word.word}" style="width: 130px; height: 130px; object-fit: cover; border-radius: 5px;" onerror="this.src='assets/images/placeholder.png';">
                
                </div>`
        ).join('');
        // ★★★★★★★★★★★★★★★★★★★★★

        // 4c. イベントリスナーを設定
        document.querySelectorAll('.choice-card').forEach(card => {
            card.addEventListener('click', handleAnswer);
            card.style.pointerEvents = 'auto'; 
            card.style.opacity = '1';
        });
        
        // 4d. 「メニューに戻る」ボタン
        GAME_CONTROLS.innerHTML = `
            <button id="backToMenuControl" class="menu-card-button menu-card-reset" style="width: 200px; height: 50px; margin: 0 auto;">
                メニューに戻る
            </button>
        `;
        document.getElementById('backToMenuControl').addEventListener('click', () => {
            GAME_AREA.style.display = 'none';
            MENU_AREA.style.display = 'block';
        });
    }

    // 5. ユーザーの回答を処理する
    function handleAnswer(event) {
        const cardElement = event.target.closest('.choice-card');
        if (!cardElement) return;
        
        document.querySelectorAll('.choice-card').forEach(btn => btn.style.pointerEvents = 'none'); 

        const selectedWordId = parseInt(cardElement.dataset.id, 10);
        const selectedWord = allWords.find(w => w.id === selectedWordId);
        
        const lastChar = getCleanLastChar(currentWord.reading);
        
        if (selectedWord.reading.startsWith(lastChar)) {
            // ★★★ 正解 ★★★
            playSound(SOUND_CORRECT_PATH);
            
            FEEDBACK.textContent = 'せいかい！✨ つぎは...';
            FEEDBACK.style.color = '#5c7aff';
            turnCount += 1;
            
            currentWord = selectedWord; // お題を更新
            gameHistoryIds.add(currentWord.id); // 履歴に追加
            updateTurnMessage();
            
            const newLastChar = getCleanLastChar(currentWord.reading);
            if (newLastChar === 'ん' || newLastChar === 'っ') {
                setTimeout(() => {
                    endGame(false); // false = 負け
                }, 1500);
            } else {
                setTimeout(showNextQuestion, 1500);
            }

        } else {
            // ★★★ 不正解 ★★★
            playSound(SOUND_INCORRECT_PATH);
            
            FEEDBACK.textContent = `ざんねん...。「${lastChar}」から はじまるのはどれかな？`;
            FEEDBACK.style.color = '#ff6f61';
            
            cardElement.style.opacity = '0.5'; 
            cardElement.style.pointerEvents = 'none'; 
            
            document.querySelectorAll('.choice-card').forEach(btn => {
                if (btn !== cardElement) {
                    btn.style.pointerEvents = 'auto';
                }
            });
        }
    }

    // 6. ゲーム終了処理
    function endGame(isWin) {
        GAME_CONTROLS.style.display = 'none'; 
        END_GAME_CONTROLS.style.display = 'block';
        CHOICE_BUTTONS_AREA.innerHTML = ''; 
        
        CURRENT_WORD_DISPLAY_TEXT.textContent = currentWord.word;
        const imagePath = `assets/images/${currentWord.image}`; 
        IMAGE_AREA.innerHTML = `<img src="${imagePath}" alt="${currentWord.word}" style="width: 150px; height: 150px; border-radius: 10px; object-fit: cover;">`;
        
        if (isWin) {
            playSound(SOUND_CORRECT_PATH);
            FEEDBACK.textContent = 'すごい！ぜんぶクリア！🎉';
            TURN_MESSAGE.textContent = `クリア！ ${turnCount}回 つづいたよ！`;
        } else {
            playSound(SOUND_INCORRECT_PATH); 
            const lastChar = getCleanLastChar(currentWord.reading);
            FEEDBACK.textContent = `あ！「${lastChar}」がついた！ゲームオーバー！`;
            FEEDBACK.style.color = '#ff6f61';
            TURN_MESSAGE.textContent = `ざんねん... ${turnCount}回 つづいたよ`;
        }
        
        END_GAME_CONTROLS.innerHTML = `
            <button class="menu-card-button menu-card-reset" onclick="startNewGame()">
                🎮<br>もう一回あそぶ
            </button>
            <a href="index.html" class="menu-card-button menu-card-reset">
                🏠<br>ホームに戻る
            </a>
        `;
    }
    
    // 7. 補助関数: スコア表示を更新
    function updateTurnMessage() {
        TURN_MESSAGE.textContent = `${turnCount + 1}回目: 「${getCleanLastChar(currentWord.reading)}」からはじまるのは？`;
    }
    
    // 8. 補助関数: しりとり用の「最後の文字」を取得
    function getCleanLastChar(reading) {
        if (!reading) return '';
        
        let lastChar = reading.slice(-1);

        if (lastChar === 'ー') {
            if (reading.length < 2) return '';
            lastChar = reading.slice(-2, -1);
        }

        const smallKana = {'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ'};
        if (smallKana[lastChar]) {
            return smallKana[lastChar];
        }
        
        return lastChar;
    }

    // 9. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        let newArray = [...array]; 
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    loadWords();
});