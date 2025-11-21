document.addEventListener('DOMContentLoaded', () => {
    
    // --- 設定 ---
    const GAME_ID = 'shiritori_game'; 
    const USER_STORAGE_KEY = 'user_accounts'; 
    const SESSION_STORAGE_KEY = 'current_user'; 
    const GUEST_NAME = 'ゲスト'; 

    // --- DOM要素 ---
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_DISPLAY = document.getElementById('current-word-display');
    const IMAGE_AREA = document.getElementById('image-area'); 
    const CHOICE_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('feedback');
    const END_CONTROLS = document.getElementById('endGameControls');
    const QUESTION_TEXT = document.getElementById('question-text');
    const START_BTN = document.getElementById('shiritoriStartButton');

    // --- 音声 ---
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // --- データ管理用変数 ---
    let gameData = []; // JSONから読み込んだデータを入れる
    let currentWord = null; 
    let gameHistoryIds = new Set();
    let turnCount = 0; 

    // ---------------------------------------------------------
    // 1. JSONデータの読み込み (fetchを使用)
    // ---------------------------------------------------------
    async function loadWords() {
        try {
            // キャッシュ対策で時間をクエリに付与することも可能ですが、通常はこのまま
            const response = await fetch('data/words.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // 読み仮名がないデータを除外するなどのフィルタリング
            gameData = data.filter(word => word.reading && word.reading.trim() !== '');
            console.log(`単語データを ${gameData.length} 件読み込みました。`);
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            alert('データの読み込みに失敗しました。\nローカル環境の場合は「Live Server」などを使用してください。');
            gameData = [];
        }
    }

    // --- ポイント付与 ---
    function getTodayDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }
    function checkAndAwardPoints(wordId) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!currentUser || currentUser === GUEST_NAME) return "guest"; 
        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 
        const today = getTodayDateString();
        const progressKey = `${GAME_ID}_word_${wordId}`;
        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};
        if (user.progress[progressKey][today] === true) return "already_scored"; 
        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        return "scored"; 
    }

    // --- ゲーム開始 ---
    if(START_BTN) {
        // スタートボタンを押したときに、データがまだなければロードを試みる
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

        // 正解候補（しりとりが繋がる & まだ出てない）
        let correctOptions = gameData.filter(word => 
            word.reading.startsWith(lastChar) && 
            !gameHistoryIds.has(word.id)
        );

        // 不正解候補（繋がらない & まだ出てない）
        let wrongOptions = gameData.filter(word => 
            !word.reading.startsWith(lastChar) && 
            !gameHistoryIds.has(word.id)
        );

        if (correctOptions.length === 0) {
            endGame(true); 
            return;
        }

        // 3択を作る
        let choices = [];
        
        // 1. 正解を1つ
        const correct = correctOptions[Math.floor(Math.random() * correctOptions.length)];
        choices.push(correct);
        
        // 2. 不正解を2つ
        wrongOptions = shuffleArray(wrongOptions);
        if (wrongOptions.length >= 2) {
            choices.push(wrongOptions[0]);
            choices.push(wrongOptions[1]);
        } else {
            // データ不足時の埋め合わせ
            let others = gameData.filter(w => w.id !== correct.id);
            others = shuffleArray(others);
            choices.push(others[0]);
            if(others[1]) choices.push(others[1]);
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
                 alt="${currentWord.word}"
                 onerror="this.src='assets/images/placeholder.png';">
        `;
    }

    function renderChoices(choices, lastChar) {
        CHOICE_AREA.innerHTML = '';
        QUESTION_TEXT.textContent = `「${lastChar}」から はじまるのは？`;
        
        choices.forEach(word => {
            const div = document.createElement('div');
            div.className = 'choice-card';
            div.dataset.id = word.id;
            div.onclick = handleAnswer;
            
            div.innerHTML = `
                <img src="assets/images/${word.image}" alt="${word.word}" 
                     onerror="this.style.display='none'; this.parentNode.innerText='${word.word}';">
            `;
            CHOICE_AREA.appendChild(div);
        });
    }

    // --- 回答処理 ---
    function handleAnswer(e) {
        const card = e.currentTarget;
        const selectedId = parseInt(card.dataset.id, 10);
        const selectedWord = gameData.find(w => w.id === selectedId);
        const lastChar = getCleanLastChar(currentWord.reading);

        const allCards = document.querySelectorAll('.choice-card');
        allCards.forEach(c => c.style.pointerEvents = 'none');

        if (selectedWord.reading.startsWith(lastChar)) {
            // ★正解
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play();
            
            card.style.borderColor = 'var(--correct-color)';
            card.style.backgroundColor = '#e8f5e9';

            const result = checkAndAwardPoints(selectedId);
            let msg = 'せいかい！✨';
            if(result === 'scored') msg += ' (+1 pt)';
            FEEDBACK.textContent = msg;
            FEEDBACK.style.color = 'var(--correct-color)';

            turnCount++;
            currentWord = selectedWord;
            gameHistoryIds.add(currentWord.id);
            updateTurnMessage();

            const newLastChar = getCleanLastChar(currentWord.reading);
            if (newLastChar === 'ん') {
                setTimeout(() => endGame(false), 1500);
            } else {
                setTimeout(() => {
                    renderCurrentWord();
                    showNextQuestion();
                    FEEDBACK.textContent = '';
                }, 1500);
            }

        } else {
            // ★不正解
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play();
            
            card.style.borderColor = 'var(--incorrect-color)';
            card.style.opacity = '0.5';
            
            FEEDBACK.textContent = `ちがうよ... 「${lastChar}」から はじまるのは？`;
            FEEDBACK.style.color = 'var(--incorrect-color)';

            allCards.forEach(c => {
                if(c !== card) c.style.pointerEvents = 'auto';
            });
        }
    }

    // --- 終了処理 ---
    function endGame(isWin) {
        CHOICE_AREA.innerHTML = '';
        QUESTION_TEXT.textContent = '';
        END_CONTROLS.style.display = 'block';
        renderCurrentWord();

        if (isWin) {
            SOUND_CORRECT.play();
            FEEDBACK.textContent = 'すごい！ これいじょう つづかないよ！ ぜんぶクリア！？🎉';
            TURN_MESSAGE.textContent = `クリア！ (${turnCount}かい つづいた)`;
        } else {
            SOUND_INCORRECT.play();
            FEEDBACK.textContent = 'あ！「ん」がついたから おしまい！';
            FEEDBACK.style.color = '#ef5350';
            TURN_MESSAGE.textContent = `ゲームオーバー (${turnCount}かい つづいた)`;
        }
    }

    // --- ユーティリティ ---
    function updateTurnMessage() {
        TURN_MESSAGE.textContent = `${turnCount}かい つづいてるよ`;
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