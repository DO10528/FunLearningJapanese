document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // ★★★ 設定 & ポイントシステム ★★★
    // ----------------------------------------------------
    const GAME_ID = 'hiragana_word_quiz'; 
    const USER_STORAGE_KEY = 'user_accounts'; 
    const SESSION_STORAGE_KEY = 'current_user'; 
    const GUEST_NAME = 'ゲスト'; 

    // DOM要素の取得
    const MENU_AREA = document.getElementById('quiz-menu-area');
    const GAME_AREA = document.getElementById('quiz-game-area');
    const SCORE_MESSAGE = document.getElementById('quiz-score-message');
    const TURN_MESSAGE = document.getElementById('quiz-turn-message');
    const IMAGE_AREA = document.getElementById('quiz-image-area');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('quiz-feedback');
    const SCORE_VAL = document.getElementById('score-val');
    // ★スタートボタンをここで取得して、直接命令を与えます
    const START_BUTTON = document.getElementById('quizStartButton'); 

    // 音声設定 (ファイルがあるか確認してください)
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // ----------------------------------------------------
    // ★★★ データ (JSONファイルを使わずここに直接書く) ★★★
    // ----------------------------------------------------
    // 画像ファイル名(image)は実際のファイル名に合わせて修正してください
    // フォルダ assets/images/stationery/ や assets/images/food/ などにある場合はパスも含めてください
    const allWords = [
        { id: 1, word: 'りんご', image: 'apple.png' },
        { id: 2, word: 'バナナ', image: 'banana.png' },
        { id: 3, word: 'くるま', image: 'car.png' },
        { id: 4, word: 'えんぴつ', image: 'stationery/enpitsu.png' },
        { id: 5, word: 'ほん', image: 'book.png' },
        { id: 6, word: 'とけい', image: 'clock.png' },
        { id: 7, word: 'ねこ', image: 'cat.png' },
        { id: 8, word: 'いぬ', image: 'dog.png' },
        { id: 9, word: 'さかな', image: 'fish.png' },
        { id: 10, word: 'はさみ', image: 'stationery/hasami.png' }
        // 必要に応じてここに追加してください
    ];

    // ゲーム状態
    let currentWord = null;
    let score = 0;
    let questionCount = 0;
    const MAX_QUESTIONS = 10; // 1ゲーム10問
    let askedWordIds = new Set(); 

    // ポイント付与ロジック
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

    // ----------------------------------------------------
    // 1. ゲーム開始 (HTMLのonclickではなくここで設定)
    // ----------------------------------------------------
    // スタートボタンがクリックされたら startNewGameLogic を実行する設定
    if (START_BUTTON) {
        START_BUTTON.addEventListener('click', startNewGameLogic);
    } else {
        console.error("エラー: スタートボタン(id='quizStartButton')が見つかりません。HTMLを確認してください。");
    }

    function startNewGameLogic() {
        // データチェック
        if (allWords.length < 4) {
            alert('データ不足のためゲームを開始できません(最低4単語必要)');
            return;
        }
        
        MENU_AREA.style.display = 'none'; 
        GAME_AREA.style.display = 'block'; 

        score = 0; 
        questionCount = 0;
        askedWordIds.clear(); 
        updateScoreBoard();
        showNextQuestion();
    }
    
    // 2. 次の問題へ
    function showNextQuestion() {
        if (questionCount >= MAX_QUESTIONS) {
            // ゲーム終了
            alert(`おつかれさま！\n${MAX_QUESTIONS}問中、${score / 10}問せいかい！`);
            location.reload(); // リロードしてメニューに戻る
            return;
        }
        
        questionCount++;
        updateScoreBoard();

        // まだ出題していない単語から選ぶ
        let availableWords = allWords.filter(w => !askedWordIds.has(w.id));
        if (availableWords.length === 0) {
            askedWordIds.clear(); // 一周したらリセット
            availableWords = allWords;
        }

        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id);

        // 不正解の選択肢を3つ選ぶ (合計4択)
        let wrongChoices = [];
        // 無限ループ防止のための安全装置
        let safeCounter = 0;
        while (wrongChoices.length < 3 && safeCounter < 100) {
            const rIndex = Math.floor(Math.random() * allWords.length);
            const w = allWords[rIndex];
            if (w.id !== currentWord.id && !wrongChoices.some(wc => wc.id === w.id)) {
                wrongChoices.push(w);
            }
            safeCounter++;
        }
        
        let choices = [currentWord, ...wrongChoices];
        choices = shuffleArray(choices); // シャッフル

        renderQuestionUI(currentWord, choices);
    }

    // 3. UI描画
    function renderQuestionUI(word, choices) {
        // 画像エリア
        // 画像が見つからない時にエラーで止まらないよう onerror を設定
        IMAGE_AREA.innerHTML = `
            <img src="assets/images/${word.image}" 
                 alt="${word.word}" 
                 onerror="this.style.display='none'; this.parentNode.innerHTML='<p>(${word.image}が見つかりません)</p>'">
        `;
        
        // 選択肢ボタン生成
        CHOICE_BUTTONS_AREA.innerHTML = '';
        FEEDBACK.textContent = '';
        FEEDBACK.style.color = '#333';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn'; // ★CSSでスタイルされたクラス
            btn.textContent = choice.word;
            btn.dataset.word = choice.word;
            btn.onclick = handleAnswer;
            CHOICE_BUTTONS_AREA.appendChild(btn);
        });
    }

    // 4. 回答処理
    function handleAnswer(e) {
        const btn = e.target;
        const selectedWord = btn.dataset.word;
        
        // 連打防止のため全ボタンを無効化
        const allBtns = document.querySelectorAll('.choice-btn');
        allBtns.forEach(b => b.classList.add('disabled'));

        if (selectedWord === currentWord.word) {
            // 正解
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play().catch(()=>{});
            
            btn.classList.add('correct'); // 緑色にする
            
            const result = checkAndAwardPoints(currentWord.id);
            let msg = 'せいかい！✨';
            if (result === "scored") msg += ' (+1 pt)';
            
            FEEDBACK.textContent = msg;
            FEEDBACK.style.color = 'var(--correct-color)';
            
            score += 10;
            updateScoreBoard();
            
            setTimeout(showNextQuestion, 1500);

        } else {
            // 不正解
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play().catch(()=>{});
            
            btn.classList.add('incorrect'); // 赤色にする
            
            // 正解のボタンを緑色にして教えてあげる
            allBtns.forEach(b => {
                if(b.dataset.word === currentWord.word) b.classList.add('correct');
            });

            FEEDBACK.textContent = `ざんねん... こたえは「${currentWord.word}」だよ`;
            FEEDBACK.style.color = 'var(--incorrect-color)';
            
            setTimeout(showNextQuestion, 2500); 
        }
    }

    function updateScoreBoard() {
        if (TURN_MESSAGE) TURN_MESSAGE.textContent = `もん ${questionCount} / ${MAX_QUESTIONS}`;
        if (SCORE_VAL) SCORE_VAL.textContent = score;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ※ loadWords() は削除しました (allWords変数に直接書いたため)
});