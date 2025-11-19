document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (単語ごとに1日1回) ★★★
    // ----------------------------------------------------
    const GAME_ID = 'hiragana_word_quiz'; // ゲームID
    
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
    const MENU_AREA = document.getElementById('quiz-menu-area');
    const GAME_AREA = document.getElementById('quiz-game-area');
    const SCORE_MESSAGE = document.getElementById('quiz-score-message');
    const TURN_MESSAGE = document.getElementById('quiz-turn-message');
    const IMAGE_AREA = document.getElementById('quiz-image-area');
    const QUESTION_TEXT = document.getElementById('quiz-question-text');
    const FEEDBACK = document.getElementById('quiz-feedback');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const GAME_CONTROLS = document.getElementById('quiz-game-controls');

    // 音声ファイルのパス設定
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

    let allWords = [];
    let currentWord = null;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let askedWordIds = new Set(); 

    // 音源を再生する関数
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    // 1. ゲーム開始関数
    window.startQuizGame = function() {
        if (allWords.length === 0) {
            loadWords().then(startNewGameLogic);
        } else {
            startNewGameLogic();
        }
    };

    function startNewGameLogic() {
        if (allWords.length < 3) {
            alert('ゲームを開始するには最低3つ以上の単語データが必要です。');
            renderMenu();
            return;
        }
        
        if (MENU_AREA) MENU_AREA.style.display = 'none'; 
        if (GAME_AREA) GAME_AREA.style.display = 'block'; 

        score = 0; 
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear(); 
        
        if (TURN_MESSAGE) TURN_MESSAGE.textContent = 'チャレンジ中！ (正解 0/失敗 0)';
        
        showNextQuestion();
    }
    
    // 2. JSONデータを読み込む関数
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

    // 3. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MENU_AREA) MENU_AREA.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p>前回のスコア: ${score}点 (正解: ${correctCount}問, 不正解: ${incorrectCount}問)</p>`;
        }
        if (GAME_CONTROLS) GAME_CONTROLS.innerHTML = '';
    }

    // 4. 問題をランダムに選び、選択肢を生成する
    function showNextQuestion() {
        
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 不正解: ${incorrectCount}問`);
            renderMenu();
            return;
        }
        
        if (!currentWord || askedWordIds.has(currentWord.id)) {
            let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
            const correctIndex = Math.floor(Math.random() * availableWords.length);
            currentWord = availableWords[correctIndex];
        }

        let wrongChoices = [];
        
        while (wrongChoices.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            const isDuplicate = randomWord.id === currentWord.id || wrongChoices.some(w => w.id === randomWord.id);

            if (!isDuplicate) {
                wrongChoices.push(randomWord);
            }
        }
        
        let choices = [currentWord, ...wrongChoices];
        choices = shuffleArray(choices);

        renderQuestion(currentWord, choices);
        
        renderGameControls(false); 
    }

    // 5. 画面に問題と選択肢を表示する
    function renderQuestion(word, choices) {
        const imagePath = `assets/images/${word.image}`; 
        
        // お題のイラスト
        if (IMAGE_AREA) {
            IMAGE_AREA.innerHTML = `
                <img src="${imagePath}" 
                     alt="${word.word}" 
                     onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                     style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: contain;">
            `; 
        }
        
        // 選択肢を「文字」で表示
        if (CHOICE_BUTTONS_AREA) {
            CHOICE_BUTTONS_AREA.innerHTML = choices.map(choiceObj => 
                `<div class="menu-card-button menu-card-reset choice-card" data-word="${choiceObj.word}">
                    <div style="font-size: 1.8rem; font-weight: bold; padding: 20px 10px; line-height: 1.3;">
                        ${choiceObj.word}
                    </div>
                </div>`
            ).join('');
        }

        if (QUESTION_TEXT) QUESTION_TEXT.textContent = `このイラストはどれかな？`;
        if (FEEDBACK) FEEDBACK.textContent = '答えを選んでね！';
        
        document.querySelectorAll('.choice-card').forEach(card => {
            card.addEventListener('click', handleAnswer);
            card.style.pointerEvents = 'auto'; 
            card.style.opacity = '1';
            card.classList.remove('incorrect-choice');
        });
    }

    // 6. ユーザーの回答を処理する
    function handleAnswer(event) {
        const cardElement = event.target.closest('.choice-card');
        if (!cardElement) return;
        
        document.querySelectorAll('.choice-card').forEach(btn => btn.style.pointerEvents = 'none');

        const selectedWord = cardElement.dataset.word;
        const feedbackElement = FEEDBACK;
        
        if (selectedWord === currentWord.word) {
            playSound(SOUND_CORRECT_PATH);
            
            // ★★★ ポイント付与ロジックの呼び出し (単語IDを渡す) ★★★
            // currentWord.id (例: 1, 2...) を使って判定します
            const result = checkAndAwardPoints(currentWord.id);

            let message = 'せいかい！✨';
            if (result === "scored") {
                message += ' (+1 ポイント！)';
            } else if (result === "already_scored") {
                // メッセージが長くなりすぎるなら、ここは空にしてもOKです
                // message += ' (きょうは獲得ずみ)';
            }
            
            feedbackElement.textContent = message;
            // ★★★★★★★★★★★★★★★★★★★★★

            feedbackElement.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; 
            askedWordIds.add(currentWord.id); 

            updateTurnMessage();
            
            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            playSound(SOUND_INCORRECT_PATH);
            
            feedbackElement.textContent = `ざんねん...。もう一度、よーく考えて選んでね。`;
            feedbackElement.style.color = '#ff6f61';
            
            cardElement.classList.add('incorrect-choice'); 
            cardElement.style.pointerEvents = 'none'; 
            
            document.querySelectorAll('.choice-card').forEach(btn => {
                if (btn !== cardElement) {
                    btn.style.pointerEvents = 'auto';
                }
            });
        }
    }
    
    // 7. 補助関数: スコア表示を更新
    function updateTurnMessage() {
        if (TURN_MESSAGE) {
            TURN_MESSAGE.textContent = `チャレンジ中！ (正解 ${correctCount}/失敗 ${incorrectCount})`;
        }
    }
    
    // 8. 補助関数: プレイ中のメニューボタンを表示
    function renderGameControls(showNextButton) {
        if (!GAME_CONTROLS) return;
        
        GAME_CONTROLS.style.display = 'flex'; 
        GAME_CONTROLS.style.justifyContent = 'center';
        GAME_CONTROLS.innerHTML = '';
        
        let menuButtonHtml = `
            <button id="backToMenuControl" class="menu-card-button menu-card-reset" style="width: 200px; height: 50px; margin: 0 auto;">
                メニューに戻る
            </button>
        `;

        GAME_CONTROLS.innerHTML = menuButtonHtml;
        
        document.getElementById('backToMenuControl').addEventListener('click', renderMenu);
    }

    // 9. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    loadWords();
});