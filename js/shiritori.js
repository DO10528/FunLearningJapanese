document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の取得
    // ----------------------------------------------------
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    // ... (他の要素の取得は省略) ...
    const QUESTION_TEXT = document.getElementById('question-text');
    const FEEDBACK = document.getElementById('feedback');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const CURRENT_WORD_TEXT = document.getElementById('current-word-text');
    const IMAGE_AREA = document.getElementById('image-area');
    const TURN_MESSAGE = document.getElementById('turn-message');
    
    const GAME_CONTROLS = document.getElementById('game-controls');
    const END_GAME_CONTROLS = document.getElementById('endGameControls');

    // ★★★ 音声ファイルのパス設定 (ご自身のファイル名に合わせて修正してください) ★★★
    const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 
    // ★★★★★★★★★★★★★★★★★★★★★
    
    let allWords = [];
    let usedWords = new Set();
    let lastChar = ''; 
    let score = 0;             
    let incorrectCount = 0;    

    // ★★★ 補助関数: 音源を再生する関数 ★★★
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }
    // ★★★★★★★★★★★★★★★★★★★★★

    // ----------------------------------------------------
    // 1. ゲーム開始関数 (HTMLの onclick="startNewGame()" から呼ばれる)
    // ----------------------------------------------------
    window.startNewGame = function() {
        if (allWords.length === 0) {
            loadWords().then(startGameLogic);
        } else {
            startGameLogic();
        }
    };

    function startGameLogic() {
        if (allWords.length < 3) {
            alert('単語データが不足しています。');
            renderMenu();
            return;
        }
        
        // ★修正: 画面の表示を確実に切り替える★
        if (MENU_AREA) MENU_AREA.style.display = 'none';
        if (GAME_AREA) GAME_AREA.style.display = 'block';
        if (END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'none'; // ゲーム終了ボタンを非表示

        // 状態リセット
        usedWords.clear();
        lastChar = '';
        score = 0;
        incorrectCount = 0;
        if(FEEDBACK) FEEDBACK.textContent = '単語を選んでね！';
        
        // 最初の単語を選ぶロジック
        const firstWord = allWords[Math.floor(Math.random() * allWords.length)];
        useWord(firstWord); 
        lastChar = firstWord.reading.slice(-1);
        score = 1;

        playerTurn(); 
    }
    
    // 2. プレイヤーのターン (3択クイズとして表示)
    function playerTurn() {
        
        // ... (単語選択と選択肢生成のロジックは省略) ...
        let availableWords = allWords.filter(word => 
            !usedWords.has(word.reading) && word.reading.charAt(0) === lastChar
        );
        if (availableWords.length === 0) {
            endGame('おめでとう！辞書の単語を使い切りました。', true); 
            return;
        }
        const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        // ... (選択肢の生成ロジックは省略) ...
        let choices = [correctWord]; 
        let wrongWords = [];
        // ... (不正解の選択肢を選ぶロジックは省略) ...
        while (wrongWords.length < 2) { 
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            const isUsed = usedWords.has(randomWord.reading);
            const isDuplicate = wrongWords.some(w => w.id === randomWord.id);
            const isCorrect = correctWord.id === randomWord.id;
            
            // ルール適合の単語を含めないように、かつ重複しないようにする
            if (!isUsed && !isDuplicate && !isCorrect && randomWord.reading.charAt(0) !== lastChar) { 
                wrongWords.push(randomWord);
            }
        }
        let finalChoices = shuffleArray([...choices, ...wrongWords]);

        
        // 画面を更新
        updateScoreDisplay(`チャレンジ中！`);
        if(QUESTION_TEXT) QUESTION_TEXT.textContent = `直前の単語は「${lastChar}」で終わりました。この文字から始まるイラストを選んでください。`;
        renderChoices(finalChoices.slice(0, 3)); // 3択に限定
        
        // ★修正: プレイ中に常に表示される「ホームに戻る」ボタンを生成・表示する★
        renderGameControls();
    }

    // 3. ゲームプレイ中のコントロールボタンを表示する関数
    function renderGameControls() {
        if (!GAME_CONTROLS) return;

        // 常に「ホームに戻る」ボタンを表示
        GAME_CONTROLS.innerHTML = `
            <a href="index.html" class="menu-card-button menu-card-reset" style="width: 200px; height: 50px;">
                🏠 メニューに戻る
            </a>
        `;
        // ボタンを中央に配置
        GAME_CONTROLS.style.display = 'flex';
        GAME_CONTROLS.style.justifyContent = 'center';
    }

    // 4. メインメニューに戻る
    function renderMenu() {
        if (MENU_AREA) MENU_AREA.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';
        
        // 状態をクリーンアップ
        usedWords.clear();
        lastChar = '';
        score = 0;
        incorrectCount = 0;
        if(CHOICE_BUTTONS_AREA) CHOICE_BUTTONS_AREA.innerHTML = '';
        if(GAME_CONTROLS) GAME_CONTROLS.innerHTML = ''; 
        if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'none';
        
        // メッセージをリセット
        if(TURN_MESSAGE) TURN_MESSAGE.textContent = 'ゲーム開始';
        if(QUESTION_TEXT) QUESTION_TEXT.textContent = 'しりとりであそぼう！';
    }

    // 5. ゲーム終了処理
    function endGame(message, isWin) {
        
        // ★★★ ゲームオーバー時音源再生 ★★★
        playSound(SOUND_INCORRECT_PATH);
        // ★★★★★★★★★★★★★★★★★
        
        // ... (フィードバックメッセージ設定、スコア表示ロジックは省略) ...
        const finalMessage = isWin ? 
            `🎉 完走！${message}` : 
            `😭 ${message}。`;
        updateScoreDisplay('ゲーム終了');
        if(FEEDBACK) FEEDBACK.innerHTML = `<span style="font-size: 1.2em;">${finalMessage}</span><br>あなたの連鎖記録は**${score}連鎖**でした！`;
        if(CHOICE_BUTTONS_AREA) CHOICE_BUTTONS_AREA.innerHTML = '';
        
        // プレイ中のボタンを非表示
        if (GAME_CONTROLS) GAME_CONTROLS.innerHTML = '';
        
        // ゲーム終了時用のボタンを表示
        if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'flex';
        if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.justifyContent = 'center';

        if(END_GAME_CONTROLS) END_GAME_CONTROLS.innerHTML = `
            <button id="restartButton" class="menu-card-button choice-button" style="width: 200px; margin-right: 10px;">
                🔁 もう一度あそぶ！
            </button>
            <a href="index.html" class="menu-card-button menu-card-reset" style="width: 200px;">
                🏠 ホームに戻る
            </a>
        `;

        document.getElementById('restartButton').addEventListener('click', startGameLogic);
    }
    
    // ... (loadWords, useWord, renderChoices, updateScoreDisplay, shuffleArray, handleAnswer関数は省略) ...
    // ※これらの関数がファイル内に存在し、正しく定義されていることを確認してください。
    
    // 6. JSONデータを読み込む関数
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
    
    function updateScoreDisplay(message) {
        const scoreDisplay = `${score}連鎖 / 失敗${incorrectCount}回`;
        if(TURN_MESSAGE) TURN_MESSAGE.innerHTML = `${message} (${scoreDisplay})`;
    }
    
    function useWord(wordData) {
        const reading = wordData.reading;
        usedWords.add(reading);
        
        const imagePath = `assets/images/${wordData.image}`;
        if(IMAGE_AREA) IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" 
                 alt="${wordData.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
        `;
        
        if(CURRENT_WORD_TEXT) CURRENT_WORD_TEXT.innerHTML = `直前の単語: <span style="font-weight: bold; color: #ff6f61;">${wordData.word} (${reading})</span>`;
    }
    
    function renderChoices(choices) {
        if(!CHOICE_BUTTONS_AREA) return;
        
        CHOICE_BUTTONS_AREA.innerHTML = choices.map((word, index) => {
            const imagePath = `assets/images/${word.image}`;
            
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
    
    function handleAnswer(event) {
        const card = event.target.closest('.choice-card');
        if (!card) return;

        const selectedReading = card.dataset.wordReading;
        const selectedWordData = allWords.find(word => word.reading === selectedReading);

        const allChoiceCards = document.querySelectorAll('.choice-card');
        allChoiceCards.forEach(btn => btn.style.pointerEvents = 'none');
        
        // 1. ルールチェック (しりとりが繋がっているか)
        if (selectedReading.charAt(0) !== lastChar) {
            // ★★★ 不正解時の音源再生とゲームオーバー ★★★
            playSound(SOUND_INCORRECT_PATH);
            
            if(FEEDBACK) FEEDBACK.textContent = `ざんねん！「${lastChar}」から始まっていません。`;
            if(FEEDBACK) FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; 
            endGame(`ゲームオーバー: ルール違反`, false);
            return;
        }

        // 2. 「ん」チェック (ゲームオーバー)
        if (selectedReading.slice(-1) === 'ん') {
            // ★★★ 不正解時の音源再生とゲームオーバー ★★★
            playSound(SOUND_INCORRECT_PATH);
            
            if(FEEDBACK) FEEDBACK.textContent = `「${selectedWordData.word}」は「ん」で終わります！ゲームオーバーです。`;
            if(FEEDBACK) FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; 
            endGame(`ゲームオーバー: 「ん」で終了`, false);
            return;
        }
        
        // 3. 使用済みチェック 
        if (usedWords.has(selectedReading)) {
             // ★★★ 不正解時の音源再生とゲームオーバー ★★★
             playSound(SOUND_INCORRECT_PATH);
             
             if(FEEDBACK) FEEDBACK.textContent = `既に使用されています。`;
             if(FEEDBACK) FEEDBACK.style.color = '#ff6f61';
             incorrectCount++;
             endGame(`ゲームオーバー: 使用済み`, false);
             return;
        }

        // --- 成功処理（ルール適合）---
        // ★★★ 正解時の音源再生 ★★★
        playSound(SOUND_CORRECT_PATH);
        
        if(FEEDBACK) FEEDBACK.textContent = 'せいかい！✨ しりとりが繋がりました。';
        if(FEEDBACK) FEEDBACK.style.color = '#5c7aff';
        card.style.backgroundColor = '#d1e7dd';
        
        useWord(selectedWordData);
        lastChar = selectedReading.slice(-1);
        score++; 

        // 次のターンへ
        setTimeout(() => {
            if(FEEDBACK) FEEDBACK.textContent = '単語を選んでね！';
            allChoiceCards.forEach(btn => btn.style.pointerEvents = 'auto');
            playerTurn();
        }, 1500);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // ページロード時に単語データをプリロードしておく
    loadWords();
});