document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (ここから追加) ★★★
    // ----------------------------------------------------
    const GAME_ID = 'hiragana_word_game'; // ★ゲームID
    
    const USER_STORAGE_KEY = 'user_accounts'; 
    const SESSION_STORAGE_KEY = 'current_user'; 
    const GUEST_NAME = 'ゲスト'; 

    // 日付取得
    function getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ポイント加算・チェック関数 (単語IDごとに管理)
    function checkAndAwardPoints(wordId) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!currentUser || currentUser === GUEST_NAME) return "guest"; 

        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = getTodayDateString();
        // キーを「ゲームID + 単語ID」にする
        const progressKey = `${GAME_ID}_word_${wordId}`;

        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};

        // その単語で、今日すでにポイントをもらっているかチェック
        if (user.progress[progressKey][today] === true) return "already_scored"; 

        // ポイント加算
        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        console.log(`[Game] ${currentUser} gained 1 point for word "${wordId}". Total: ${user.points}`);
        return "scored"; 
    }
    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (ここまで) ★★★
    // ----------------------------------------------------


    // ----------------------------------------------------
    // DOM要素の取得
    // ----------------------------------------------------
    const MAIN_MENU = document.getElementById('main-menu'); 
    const GAME_AREA = document.getElementById('game-area');
    const SCORE_MESSAGE = document.getElementById('score-message'); 
    
    // 音声ファイルのパス設定
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

    let allWords = [];
    let currentWord = null;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let askedWordIds = new Set(); 

    // 補助関数: 音源を再生する関数
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    // 1. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 2. ゲーム開始処理
    function startNewGame() {
        if (allWords.length < 3) {
            alert('ゲームを開始するには最低3つ以上の単語データが必要です。');
            renderMenu();
            return;
        }
        
        if (MAIN_MENU) MAIN_MENU.style.display = 'none'; 
        if (GAME_AREA) GAME_AREA.style.display = 'block'; 

        score = 0; 
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear(); 

        showNextQuestion();
    }

    // 3. メニューに戻る
    function renderMenu() {
        if (MAIN_MENU) MAIN_MENU.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p id="current-score">前回のスコア: ${score}点 (正解: ${correctCount}問, 不正解: ${incorrectCount}問)</p>`;
        }
    }

    // 4. 問題をランダムに選び、選択肢を生成する
    function showNextQuestion() {
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 不正解: ${incorrectCount}問`);
            renderMenu();
            return;
        }
        let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id); 

        let wrongChoices = [];
        while (wrongChoices.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            const isDifferent = randomWord.reading !== currentWord.reading;
            const isDuplicate = wrongChoices.includes(randomWord.word);

            if (isDifferent && !isDuplicate) {
                wrongChoices.push(randomWord.word);
            }
        }
        
        let choices = [currentWord.word, ...wrongChoices];
        choices = shuffleArray(choices);
        renderQuestion(currentWord, choices);
    }

    // 5. 画面に問題と選択肢を表示する
    function renderQuestion(word, choices) {
        const imagePath = `assets/images/${word.image}`; 
        
        let buttonsHtml = choices.map(choice => 
            `<button class="choice-button" data-word="${choice}">${choice}</button>`
        ).join('');

        const scoreDisplay = `${correctCount}/${incorrectCount}`; 

        GAME_AREA.innerHTML = `
            <h3>この絵はどれかな？ (${scoreDisplay})</h3>
            <img src="${imagePath}" 
                 alt="${word.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: contain;"> 
            
            <div style="margin-top: 20px;">
                ${buttonsHtml}
            </div>
            <p id="feedback" style="font-weight: bold; margin-top: 15px;">答えを選んでね！</p>
            
            <button id="backToMenu" class="menu-card-button menu-card-reset" style="margin-top: 20px;">メニューに戻る</button>
        `;

        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
        
        document.getElementById('backToMenu').addEventListener('click', renderMenu);
    }

    // 6. ユーザーの回答を処理する 
    function handleAnswer(event) {
        const selectedWord = event.target.dataset.word;
        const feedbackElement = document.getElementById('feedback');
        
        document.querySelectorAll('.choice-button').forEach(btn => btn.disabled = true);

        if (selectedWord === currentWord.word) {
            playSound(SOUND_CORRECT_PATH);

            // ★★★ ポイント付与ロジック (単語IDごとに判定) ★★★
            const result = checkAndAwardPoints(currentWord.id);
            
            let message = 'せいかい！✨';
            if (result === "scored") {
                message += ' (+1 ポイント！)';
            } else if (result === "already_scored") {
                // メッセージが長くなるので省略してもOK
                // message += ' (獲得ずみ)';
            }
            feedbackElement.textContent = message;
            // ★★★★★★★★★★★★★★★★★★★★★★★

            feedbackElement.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; 
            
            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            playSound(SOUND_INCORRECT_PATH);

            feedbackElement.textContent = `ざんねん...。正解は「${currentWord.word}」だよ。`;
            feedbackElement.style.color = '#ff6f61';
            incorrectCount += 1; 
            
            setTimeout(() => {
                const nextButton = document.createElement('button');
                nextButton.id = 'nextButton';
                nextButton.textContent = 'つぎのもんだいへ';
                nextButton.className = 'menu-card-button menu-card-reset'; 
                nextButton.style.marginTop = '20px';
                
                const backButton = document.getElementById('backToMenu');
                backButton.parentNode.insertBefore(nextButton, backButton);

                document.getElementById('nextButton').addEventListener('click', showNextQuestion);
                
                renderScoreTitleUpdate();
            }, 1500); 
        }
    }

    // 7. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 8. スコア表示のみを更新する補助関数
    function renderScoreTitleUpdate() {
        const titleElement = GAME_AREA.querySelector('h3');
        if (titleElement) {
            const scoreDisplay = `${correctCount}/${incorrectCount}`; 
            titleElement.textContent = `この絵はどれかな？ (${scoreDisplay})`;
        }
    }

    // 9. 初期化
    loadWords();
    
    // 外部から呼ばれる startMainGame 関数を公開
    window.startMainGame = function() {
        if (allWords.length === 0) {
            loadWords().then(startNewGame);
        } else {
            startNewGame();
        }
    };
    
});