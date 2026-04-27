document.addEventListener('DOMContentLoaded', () => {
    
    // --- 設定 ---
    const GAME_ID = 'shiritori_game'; 
    const POINTS_PER_CORRECT_ANSWER = 1; // 正解ごとに1ポイント加算
    
    // --- DOM要素 ---
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_DISPLAY = document.getElementById('current-word-display');
    const IMAGE_AREA = document.getElementById('image-area'); 
    const CHOICE_AREA = document.getElementById('choice-buttons-area'); // 正しい変数名
    const FEEDBACK = document.getElementById('feedback');
    const END_CONTROLS = document.getElementById('endGameControls');
    const QUESTION_TEXT = document.getElementById('question-text');
    const START_BTN = document.getElementById('shiritoriStartButton');
    
    // 追加されたDOM要素
    const finalScoreMessage = document.getElementById('final-score-message');
    const pointRecordFeedback = document.getElementById('point-record-feedback');
    const currentScoreValue = document.getElementById('current-score-value');


    // --- 音声 ---
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // --- データ管理用変数 ---
    let gameData = []; 
    let currentWord = null; 
    let gameHistoryIds = new Set();
    let turnCount = 0; 
    let score = 0; 

    // ---------------------------------------------------------
    // 1. JSONデータの読み込み (fetchを使用)
    // ---------------------------------------------------------
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // フィルタリングとIDの文字列化
            gameData = data.filter(word => 
                word.reading && word.reading.trim() !== '' && word.id && word.image
            ).map(word => ({
                ...word,
                id: String(word.id) // IDを文字列に統一
            }));

            if (gameData.length === 0) {
                 console.error("有効な単語データが見つかりませんでした。JSONのreading, id, imageフィールドを確認してください。");
            }

            console.log(`単語データを ${gameData.length} 件読み込みました。`);
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            alert('データの読み込みに失敗しました。\nローカル環境の場合は「Live Server」などを使用してください。');
            gameData = [];
        }
    }

    // --- ゲーム開始 ---
    if(START_BTN) {
        START_BTN.addEventListener('click', async () => {
            if (gameData.length === 0) {
                await loadWords();
            }
            startNewGameLogic();
        });
    }

    // ページ読み込み時に裏でロードしておく
    loadWords();

    function startNewGameLogic() {
        if (gameData.length < 5) {
            alert('データが足りないか、読み込めていません。');
            return;
        }
        
        MENU_AREA.style.display = 'none'; 
        GAME_AREA.style.display = 'block'; 
        END_CONTROLS.style.display = 'none';
        CHOICE_AREA.style.pointerEvents = 'auto';

        gameHistoryIds.clear();
        turnCount = 0;
        score = 0; 
        updateScoreDisplay(); 
        FEEDBACK.textContent = '';
        
        // 「ん」で終わらない単語からスタート
        let availableWords = gameData.filter(word => getCleanLastChar(word.reading) !== 'ん');
        if (availableWords.length === 0) {
            alert('スタートできる単語がありません');
            return;
        }
        
        currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        gameHistoryIds.add(currentWord.id);
        
        updateTurnMessage();
        renderCurrentWord();
        showNextQuestion();
    }

    // --- 次の問題作成 ---
    function showNextQuestion() {
        const lastChar = getCleanLastChar(currentWord.reading);
        const NUM_CHOICES = 3;

        // 正解候補（しりとりが繋がる & まだ出てない）
        let correctOptions = gameData.filter(word => 
            word.reading.startsWith(lastChar) && 
            !gameHistoryIds.has(word.id)
        );
        
        if (correctOptions.length === 0) {
            endGame(true, score); 
            return;
        }

        // 1. 正解を1つ選ぶ
        let choices = [];
        const correct = correctOptions[Math.floor(Math.random() * correctOptions.length)];
        choices.push(correct);
        
        // 2. 不正解を2つ選ぶ（未使用を優先し、足りなければ既出を再利用）
        
        // 不正解候補リスト (正解と異なるもの)
        let allWrongCandidates = gameData.filter(w => w.id !== correct.id);
        
        // 未使用の不正解候補 (しりとりが繋がらないもの)
        let unusedWrongOptions = allWrongCandidates.filter(w => 
            !gameHistoryIds.has(w.id) && !w.reading.startsWith(lastChar)
        );
        
        // 既出だが不正解の候補 (しりとりが繋がらないもの)
        let usedWrongOptions = allWrongCandidates.filter(w => 
            gameHistoryIds.has(w.id) && !w.reading.startsWith(lastChar)
        );
        
        
        let neededChoices = NUM_CHOICES - choices.length;
        
        // 優先：未使用の不正解候補を追加
        unusedWrongOptions = shuffleArray(unusedWrongOptions);
        choices.push(...unusedWrongOptions.slice(0, neededChoices));
        neededChoices = NUM_CHOICES - choices.length;
        
        // 次点：既出の不正解候補を追加して埋める
        if (neededChoices > 0) {
            usedWrongOptions = shuffleArray(usedWrongOptions);
            choices.push(...usedWrongOptions.slice(0, neededChoices));
            neededChoices = NUM_CHOICES - choices.length;
        }

        // 最終手段：まだ足りない場合は allWrongCandidates から重複なく追加（重複チェック）
        if (neededChoices > 0) {
            const remainingPool = shuffleArray(allWrongCandidates.filter(w => !choices.find(c => c.id === w.id)));
            choices.push(...remainingPool.slice(0, neededChoices));
        }

        // 安全策：choices が NUM_CHOICES に満たない場合でも進める（稀なデータ不足時）
        if (choices.length === 0) {
            console.error("選択肢が作成できませんでした。データを確認してください。");
            endGame(true, score);
            return;
        }

        choices = shuffleArray(choices);
        renderChoices(choices, lastChar);
    }

    // --- 描画 ---
    function renderCurrentWord() {
        const reading = currentWord.reading;
        const lastChar = getCleanLastChar(reading);
        
        CURRENT_WORD_DISPLAY.innerHTML = `
            <span style="font-size:0.8em; color:#666;">よみ: ${reading}</span><br>
            <span class="highlight-char" style="font-size:1.5em;">「${lastChar}」</span>
        `;

        // 画像パス: assets/images/フォルダ内を想定
        IMAGE_AREA.innerHTML = `
            <img src="assets/images/${currentWord.image}" 
                 class="current-image"
                 alt="${currentWord.word || currentWord.reading}"
                 onerror="this.src='assets/images/placeholder.png';">
        `;
    }

    function renderChoices(choices, lastChar) {
    CHOICE_AREA.textContent = '';
    QUESTION_TEXT.textContent = `「${lastChar}」から はじまるのは？`;

    choices.forEach(word => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        card.dataset.id = word.id;
        card.onclick = handleAnswer;

        card.innerHTML = `
            <img src="assets/images/${word.image}" 
                 alt=""
                 class="choice-image"
                 onerror="this.src='assets/images/placeholder.png';">
        `;

        CHOICE_AREA.appendChild(card);
    });
}


    // --- 回答処理 ---
    async function handleAnswer(e) { 
        const card = e.currentTarget || e.target.closest('.choice-card');
        if (!card) return;
        const selectedId = String(card.dataset.id); 
        const selectedWord = gameData.find(w => String(w.id) === selectedId);

        // 安全ガード: selectedWord が見つからない場合
        if (!selectedWord) {
            console.warn('選択した単語が見つかりませんでした:', selectedId);
            return;
        }

        const lastChar = getCleanLastChar(currentWord.reading);

        const allCards = document.querySelectorAll('.choice-card');
        allCards.forEach(c => c.style.pointerEvents = 'none');

        // 正解判定：しりとりが繋がる AND まだ使っていないこと
        if (selectedWord.reading.startsWith(lastChar) && !gameHistoryIds.has(selectedId)) {
            // ★正解
            try { SOUND_CORRECT.currentTime = 0; SOUND_CORRECT.play(); } catch(e){/* ignore */ }
            
            card.style.borderColor = 'var(--correct-color)';
            card.style.backgroundColor = '#e8f5e9';

            score += POINTS_PER_CORRECT_ANSWER;
            updateScoreDisplay();
            
            // ★★★ Firebaseポイント加算 ★★★
            let ptMsg = '';
            if (window.Antigravity && window.Antigravity.addPoint) {
                const success = await window.Antigravity.addPoint('shiritori', score), 1500);
            } else {
                setTimeout(() => {
                    renderCurrentWord();
                    showNextQuestion();
                    FEEDBACK.textContent = '';
                }, 1000);
            }

        } else {
            // ★不正解 (ルール違反/既出/しりとりが繋がらない)
            try { SOUND_INCORRECT.currentTime = 0; SOUND_INCORRECT.play(); } catch(e){/* ignore */ }
            
            card.style.borderColor = 'var(--incorrect-color)';
            card.style.opacity = '0.5';
            
            let msg = `ちがうよ... 「${lastChar}」から はじまるのは？`;
            if (gameHistoryIds.has(selectedId)) {
                msg = 'それは もうつかった ことば だよ！';
            } else if (!selectedWord.reading.startsWith(lastChar)) {
                 msg = `「${lastChar}」から はじまっていないよ！`;
            }

            FEEDBACK.textContent = msg;
            FEEDBACK.style.color = 'var(--incorrect-color)';

            // 1.5秒後に終了画面へ (不正解は即ゲームオーバー)
            setTimeout(() => {
                 endGame(false, score);
            }, 1500);
        }
    }

    // --- 終了処理 ---
    async function endGame(isWin, finalScore) { 
        CHOICE_AREA.textContent = '';
        QUESTION_TEXT.textContent = '';
        
        END_CONTROLS.style.display = 'block';
        renderCurrentWord();

        let reasonMsg = '';
        if (isWin) {
            try { SOUND_CORRECT.play(); } catch(e){/* ignore */ }
            reasonMsg = 'すごい！ これいじょう つづかないよ！ ぜんぶクリア！？🎉';
            TURN_MESSAGE.textContent = `クリア！ (${turnCount}かい つづいた)`;
        } else {
            try { SOUND_INCORRECT.play(); } catch(e){/* ignore */ }
            reasonMsg = currentWord ? 'あ！「ん」がついたから おしまい！' : 'ルールいはん！ ゲームオーバーだよ。';
            FEEDBACK.style.color = '#ef5350';
            TURN_MESSAGE.textContent = `ゲームオーバー (${turnCount}かい つづいた)`;
        }
        FEEDBACK.textContent = reasonMsg;

        finalScoreMessage.textContent = `最終スコア: ${finalScore}ポイント`;

        // ★★★ Firebaseポイント加算 (最終スコアのフィードバックのみ) ★★★
        let pointMsg = 'ゲストモードのためポイントは記録されません。';
        
        if (finalScore > 0 && window.Antigravity && window.Antigravity.addPoint) {
            // ポイントは正解時に既に加算済み
            pointMsg = `スコア ${finalScore} ポイントをランキングに記録しました！`;
        }
        pointRecordFeedback.textContent = pointMsg;
        // ★★★ Firebaseポイント加算 終了 ★★★
    }

    // --- ユーティリティ ---
    function updateTurnMessage() {
        TURN_MESSAGE.textContent = `${turnCount}かい つづいてるよ`;
        currentScoreValue.textContent = score;
    }

    function updateScoreDisplay() {
        currentScoreValue.textContent = score;
    }


    function getCleanLastChar(reading) {
        if (!reading) return '';
        let last = reading.slice(-1);
        
        if (last === 'ー') {
            if (reading.length >= 2) last = reading.slice(-2, -1);
        }

        const smallMap = {'ゃ':'や', 'ゅ':'ゆ', 'ょ':'よ', 'っ':'つ', 'ぁ':'あ', 'ぃ':'い', 'ぅ':'う', 'ぇ':'え', 'ぉ':'お'};
        if (smallMap[last]) return smallMap[last];
        
        return last;
    }

    function shuffleArray(array) {
        let newArray = [...array]; 
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});
