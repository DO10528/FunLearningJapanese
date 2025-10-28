document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const START_BUTTON = document.getElementById('shiritoriStartButton');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_TEXT = document.getElementById('current-word-text');
    const CURRENT_WORD_DISPLAY = document.getElementById('current-word-display');
    const IMAGE_AREA = document.getElementById('image-area');
    const WORD_HISTORY_DISPLAY = document.getElementById('wordHistory'); // 履歴表示要素（今回は空にする）
    const BACK_BUTTON = document.getElementById('shiritoriBackToMenu');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('feedback');
    const QUESTION_TEXT = document.getElementById('question-text');

    let allWords = [];
    let usedWords = new Set();
    let lastChar = ''; 
    let score = 0;             // プレイヤーの正解数
    let incorrectCount = 0;    // プレイヤーの不正解数
    
    // 履歴表示を削除する（HTML要素は残すが、中身は空にする）
    if (WORD_HISTORY_DISPLAY) {
        WORD_HISTORY_DISPLAY.style.display = 'none';
    }


    // 1. JSONデータを読み込む関数 (変更なし)
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            const data = await response.json();
            allWords = data.filter(word => !word.reading.endsWith('ん'));
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 2. スコア表示を更新する関数
    function updateScoreDisplay(message) {
        const scoreDisplay = `${score}/${incorrectCount}`;
        TURN_MESSAGE.innerHTML = `${message} (${scoreDisplay})`;
    }

    // 3. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MENU_AREA) MENU_AREA.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';
        
        // リセット
        usedWords.clear();
        lastChar = '';
        score = 0;
        incorrectCount = 0;
        CURRENT_WORD_DISPLAY.textContent = '';
        FEEDBACK.textContent = '単語を選んでね！';
        CHOICE_BUTTONS_AREA.innerHTML = '';
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'none';

        // 初期メッセージ
        TURN_MESSAGE.textContent = 'ゲーム開始';
        QUESTION_TEXT.textContent = 'しりとりであそぼう！';


        if (START_BUTTON) {
            START_BUTTON.removeEventListener('click', startNewGame);
            START_BUTTON.addEventListener('click', startNewGame);
        }
    }

    // 4. ゲーム開始
    function startNewGame() {
        if (allWords.length < 3) {
            alert('単語データが不足しています。');
            renderMenu();
            return;
        }
        
        if (MENU_AREA) MENU_AREA.style.display = 'none';
        if (GAME_AREA) GAME_AREA.style.display = 'block';
        
        // 状態リセット
        usedWords.clear();
        lastChar = '';
        score = 0;
        incorrectCount = 0;
        FEEDBACK.textContent = '単語を選んでね！';
        
        // 最初の単語をコンピュータが出題
        computerTurn(true); 
    }
    
    // 5. プレイヤーのターン (3択クイズとして表示)
    function playerTurn(wordData) {
        
        let availableWords = allWords.filter(word => 
            !usedWords.has(word.reading) && (lastChar === '' || word.reading.charAt(0) === lastChar)
        );

        if (availableWords.length === 0) {
            endGame('あなたの勝ちです！コンピューターは単語が見つかりませんでした。', true); // 勝ち
            return;
        }
        
        // 正解の単語を選ぶ (ランダム)
        const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        let choices = [correctWord]; // 正解をリストに格納

        // 2. 不正解の選択肢を2つ選ぶ
        let wrongWords = [];
        while (wrongWords.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            // 選択済みの単語、重複、正解と一致する単語は避ける
            const isUsed = usedWords.has(randomWord.reading);
            const isDuplicate = wrongWords.some(w => w.id === randomWord.id);
            const isCorrect = correctWord.id === randomWord.id;

            if (!isUsed && !isDuplicate && !isCorrect) {
                // 不正解の単語は、**しりとりルールを満たさない**単語から選ぶ（ゲーム性を維持）
                // ただし、最後の文字が「ん」の単語は避ける
                if (randomWord.reading.charAt(0) !== correctWord.reading.charAt(0)) {
                    wrongWords.push(randomWord);
                }
            }
        }
        
        // 3. 選択肢をシャッフルして表示
        let finalChoices = shuffleArray([...choices, ...wrongWords]);
        
        // 4. 画面を更新
        updateScoreDisplay(`次はあなたの番です。「${lastChar}」から始まる単語を選んでください。`);
        QUESTION_TEXT.textContent = 'さあ、次はどのイラストを選ぶ？';
        renderChoices(finalChoices);
    }

    // 6. ユーザーの回答を処理
    function handleAnswer(event) {
        const card = event.target.closest('.choice-card');
        if (!card) return;

        const selectedReading = card.dataset.wordReading;
        const selectedWordData = allWords.find(word => word.reading === selectedReading);

        document.querySelectorAll('.choice-card').forEach(btn => btn.style.pointerEvents = 'none');
        
        let isCorrect = true; // クイズの正解・不正解ではなく、しりとりルールを満たすかのフラグ

        // 1. 「ん」チェック (プレイヤー負け)
        if (selectedReading.slice(-1) === 'ん') {
            FEEDBACK.textContent = `「${selectedWordData.word}」は「ん」で終わります！あなたの負けです。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; // 不正解カウント
            endGame('敗北: 「ん」で終了', false);
            return;
        }

        // 2. ルールチェック (しりとりが繋がっているか)
        if (lastChar && selectedReading.charAt(0) !== lastChar) {
            FEEDBACK.textContent = `ざんねん！「${lastChar}」から始まっていません。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; // 不正解カウント
            endGame('敗北: ルール違反', false);
            return;
        }
        
        // 3. 使用済みチェック (ロジック上は発生しないが念のため)
        if (usedWords.has(selectedReading)) {
             FEEDBACK.textContent = `既に使用されています。`;
             FEEDBACK.style.color = '#ff6f61';
             incorrectCount++;
             endGame('敗北: 使用済み', false);
             return;
        }

        // --- 成功処理（ルール適合）---
        FEEDBACK.textContent = 'せいかい！✨ 次はコンピューターの番。';
        FEEDBACK.style.color = '#5c7aff';
        card.style.backgroundColor = '#d1e7dd';
        
        useWord(selectedWordData, 'あなた');
        lastChar = selectedReading.slice(-1);
        score++; // 正解数をカウントアップ

        // コンピュータのターンへ
        updateScoreDisplay('思考中...');
        setTimeout(() => {
            computerTurn(false);
        }, 2000);
    }

    // 7. コンピュータのターン
    function computerTurn(isFirstTurn = false) {
        
        let availableWords = allWords.filter(word => 
            !usedWords.has(word.reading) && (isFirstTurn || word.reading.charAt(0) === lastChar)
        );

        if (availableWords.length === 0) {
            endGame('あなたの勝ちです！コンピューターは単語が見つかりませんでした。', true); // 勝ち
            return;
        }

        const chosenWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        // --- 成功処理 ---
        useWord(chosenWord, 'コンピューター');
        lastChar = chosenWord.reading.slice(-1);

        // コンピュータが「ん」で終わったらプレイヤーの勝ち
        if (lastChar === 'ん') {
            endGame(`コンピューターの負けです！「${chosenWord.word}」が「ん」で終わってしまいました。`, true); // 勝ち
            return;
        }

        // プレイヤーのターンへ
        updateScoreDisplay(`次はあなたの番です。「${lastChar}」から始まる単語を選んでください。`);
        
        // クイズを再表示
        setTimeout(() => {
            playerTurn(chosenWord);
        }, 1500);
    }
    
    // 8. 単語の使用と画面表示の更新 (履歴のHTML表示はしない)
    function useWord(wordData, user) {
        const reading = wordData.reading;
        usedWords.add(reading);
        
        // 問題画像を更新
        const imagePath = `assets/images/${wordData.image}`;
        IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" 
                 alt="${wordData.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
        `;
        
        // 現在の単語表示を更新
        CURRENT_WORD_TEXT.innerHTML = `直前の単語: <span id="current-word-display" style="font-weight: bold; color: #ff6f61;">${wordData.word} (${reading})</span>`;
    }

    // 9. ゲーム終了処理
    function endGame(message, isWin) {
        const finalMessage = isWin ? 
            `🎉 勝利！${message} スコア: ${score}/${incorrectCount}` : 
            `😭 敗北。${message} スコア: ${score}/${incorrectCount}`;
            
        updateScoreDisplay('ゲーム終了');
        FEEDBACK.innerHTML = `<span style="font-size: 1.2em;">${finalMessage}</span>`;
        CHOICE_BUTTONS_AREA.innerHTML = '';
        
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'block';
        BACK_BUTTON.addEventListener('click', renderMenu);
    }
    
    // 10. 選択肢を画面に描画 (イラストのみ)
    function renderChoices(choices) {
        CHOICE_BUTTONS_AREA.innerHTML = choices.map((word, index) => {
            const imagePath = `assets/images/${word.image}`;
            
            // カード型のボタンでイラストのみ表示
            return `
                <div class="menu-card-button menu-card-reset choice-card" data-word-reading="${word.reading}" data-index="${index}">