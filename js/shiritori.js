document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const START_BUTTON = document.getElementById('shiritoriStartButton');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_TEXT = document.getElementById('current-word-text');
    const IMAGE_AREA = document.getElementById('image-area');
    const BACK_BUTTON = document.getElementById('shiritoriBackToMenu');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('feedback');
    const QUESTION_TEXT = document.getElementById('question-text');

    let allWords = [];
    let usedWords = new Set();
    let lastChar = ''; 
    let score = 0;             // プレイヤーの正解数 (1問1点)
    let incorrectCount = 0;    // プレイヤーの不正解数
    
    // 1. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            const data = await response.json();
            // 読み仮名が「ん」で終わらない単語のみを使用
            allWords = data.filter(word => !word.reading.endsWith('ん'));
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 2. スコア表示を更新する関数 (例: 14/2)
    function updateScoreDisplay(message) {
        const scoreDisplay = `${score}/${incorrectCount}`;
        // ★ 改善点2: スコア表記を追加 ★
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
        CURRENT_WORD_TEXT.textContent = '';
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
    function playerTurn() { 
        
        let availableWords = allWords.filter(word => 
            !usedWords.has(word.reading) && (lastChar === '' || word.reading.charAt(0) === lastChar)
        );

        if (availableWords.length === 0) {
            endGame('あなたの勝ちです！コンピューターは単語が見つかりませんでした。', true); 
            return;
        }
        
        const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        let choices = [correctWord]; 

        // 2. 不正解の選択肢を2つ選ぶ（lastChar を基準にする）
        let wrongWords = [];

        // 候補プールを作る: 未使用・正解でない・かつ lastChar と異なる先頭文字を持つ単語
        let wrongCandidates = allWords.filter(w =>
            !usedWords.has(w.reading) &&
            w.reading !== correctWord.reading &&
            (lastChar === '' ? true : w.reading.charAt(0) !== lastChar)
        );

        // 候補プールからランダムに最大2つ選ぶ（spliceで重複防止）
        while (wrongWords.length < 2 && wrongCandidates.length > 0) {
            const idx = Math.floor(Math.random() * wrongCandidates.length);
            wrongWords.push(wrongCandidates.splice(idx, 1)[0]);
        }

        // フォールバック: 候補が足りない場合は、未使用で正解でない別の単語で埋める
        if (wrongWords.length < 2) {
            const fallback = allWords.filter(w =>
                !usedWords.has(w.reading) &&
                w.reading !== correctWord.reading &&
                !wrongWords.some(x => x.reading === w.reading)
            );
            while (wrongWords.length < 2 && fallback.length > 0) {
                const idx = Math.floor(Math.random() * fallback.length);
                wrongWords.push(fallback.splice(idx, 1)[0]);
            }
        }

        let finalChoices = shuffleArray([...choices, ...wrongWords]);
        
        // 画面を更新
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
        
        // 1. 「ん」チェック (プレイヤー負け)
        if (selectedReading.slice(-1) === 'ん') {
            FEEDBACK.textContent = `「${selectedWordData.word}」は「ん」で終わります！あなたの負けです。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; 
            endGame('敗北: 「ん」で終了', false);
            return;
        }

        // 2. ルールチェック (しりとりが繋がっているか)
        if (lastChar && selectedReading.charAt(0) !== lastChar) {
            FEEDBACK.textContent = `ざんねん！「${lastChar}」から始まっていません。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; 
            endGame('敗北: ルール違反', false);
            return;
        }
        
        // 3. 使用済みチェック 
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
            endGame('あなたの勝ちです！コンピューターは単語が見つかりませんでした。', true); 
            return;
        }

        const chosenWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        // --- 成功処理 ---
        useWord(chosenWord, 'コンピューター');
        lastChar = chosenWord.reading.slice(-1);

        // コンピュータが「ん」で終わったらプレイヤーの勝ち
        if (lastChar === 'ん') {
            endGame(`コンピューターの負けです！「${chosenWord.word}」が「ん」で終わってしまいました。`, true); 
            return;
        }

        // プレイヤーのターンへ
        updateScoreDisplay(`次はあなたの番です。「${lastChar}」から始まる単語を選んでください。`);
        
        // クイズを再表示
        setTimeout(() => {
            playerTurn(chosenWord);
        }, 1500);
    }
    
    // 8. 単語の使用と画面表示の更新 (履歴のHTML表示を削除)
    function useWord(wordData, user) {
        const reading = wordData.reading;
        usedWords.add(reading);
        
        // 問題画像を更新
        const imagePath = `assets/images/${wordData.image}`;
        IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" 
                 alt="${wordData.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})'; console.error('画像読み込み失敗:', '${imagePath}');" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
        `;
        
        // 現在の単語表示を更新
        // ★ 改善点1: 履歴を削除し、直前の単語のみを表示 ★
        CURRENT_WORD_TEXT.innerHTML = `直前の単語: <span style="font-weight: bold; color: #ff6f61;">${wordData.word} (${reading})</span>`;
    }

    // 9. ゲーム終了処理
    function endGame(message, isWin) {
        const finalMessage = isWin ? 
            `🎉 勝利！${message}` : 
            `😭 敗北。${message}`;
            
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
                    <img src="${imagePath}" 
                         alt="${word.word}" 
                         onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません';" 
                         style="object-fit: cover; border-radius: 5px;">
                </div>
            `;
        }).join('');

        document.querySelectorAll('.choice-card').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    // 11. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 起動
    loadWords().then(renderMenu);
});