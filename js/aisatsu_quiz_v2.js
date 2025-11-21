document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (あいさつ言葉ごとに1日1回) ★★★
    // ----------------------------------------------------
    const GAME_ID_AISATSU = 'aisatsu_game'; // ゲームID
    
    const USER_STORAGE_KEY_AISATSU = 'user_accounts'; 
    const SESSION_STORAGE_KEY_AISATSU = 'current_user'; 
    const GUEST_NAME_AISATSU = 'ゲスト'; 

    // 日付取得
    function getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ポイント加算・チェック関数 (正解の言葉をキーにする)
    function checkAndAwardPoints(wordKey) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY_AISATSU);
        if (!currentUser || currentUser === GUEST_NAME_AISATSU) return "guest"; 

        const usersJson = localStorage.getItem(USER_STORAGE_KEY_AISATSU);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = getTodayDateString();
        // キーを「ゲームID + 言葉」にする
        const progressKey = `${GAME_ID_AISATSU}_word_${wordKey}`;

        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};

        // その言葉で、今日すでにポイントをもらっているかチェック
        if (user.progress[progressKey][today] === true) return "already_scored"; 

        // ポイント加算
        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY_AISATSU, JSON.stringify(users));
        console.log(`[Game] ${currentUser} gained 1 point for word "${wordKey}". Total: ${user.points}`);
        return "scored"; 
    }
    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (ここまで) ★★★
    // ----------------------------------------------------


    // ----------------------------------------------------
    // データ定義
    // ----------------------------------------------------
    const SOUND_PATH_AISATSU = 'assets/sounds/aisatsu/';

    const greetingsData = [
        { "id": 1, "situation": "あさ、おきたとき、または あったひとに いう あいさつは？ (朝)", "correct": "おはよう", "wrongs": ["こんにちは", "こんばんは", "おやすみなさい"] },
        { "id": 2, "situation": "ひるま、ひとに あったときの あいさつは？ (昼)", "correct": "こんにちは", "wrongs": ["おはよう", "こんばんは", "さようなら"] },
        { "id": 3, "situation": "ゆうがたから よるに かけて、ひとに あったときの あいさつは？ (夜)", "correct": "こんばんは", "wrongs": ["おはよう", "こんにちは", "ただいま"] },
        { "id": 4, "situation": "ねるまえに ひとに いう あいさつは？", "correct": "おやすみなさい", "wrongs": ["さようなら", "いただきます", "いってきます"] },
        { "id": 5, "situation": "これから いえを でかけるときの あいさつは？ (自分が)", "correct": "いってきます", "wrongs": ["ただいま", "いってらっしゃい", "おかえりなさい"] },
        { "id": 6, "situation": "かぞくが でかけるときに、かえす ことばは？", "correct": "いってらっしゃい", "wrongs": ["いってきます", "ただいま", "おかえりなさい"] },
        { "id": 7, "situation": "そとから いえに かえってきたときの あいさつは？", "correct": "ただいま", "wrongs": ["おかえりなさい", "いってきます", "ごちそうさま"] },
        { "id": 8, "situation": "「ただいま」と いわれたときの かえす ことばは？", "correct": "おかえりなさい", "wrongs": ["いってきます", "さようなら", "ごめんなさい"] },
        { "id": 9, "situation": "なにかを してもらったときの、かんしゃの ことばは？", "correct": "ありがとう", "wrongs": ["ごめんなさい", "いただきます", "おやすみなさい"] },
        { "id": 10, "situation": "わるいことを してしまったときの あいさつは？", "correct": "ごめんなさい", "wrongs": ["ありがとう", "こんにちは", "いただきます"] },
        { "id": 11, "situation": "ごはんを たべるまえの あいさつは？", "correct": "いただきます", "wrongs": ["ごちそうさま", "ありがとう", "おかえりなさい"] },
        { "id": 12, "situation": "ごはんを たべおわった あとの あいさつは？", "correct": "ごちそうさま", "wrongs": ["いただきます", "こんにちは", "おやすみなさい"] },
        { "id": 13, "situation": "はじめて あうひとに いう、さいしょの あいさつは？", "correct": "はじめまして", "wrongs": ["こんにちは", "さようなら", "いってきます"] },
        { "id": 14, "situation": "かぞくや ともだちと わかれるときの あいさつは？", "correct": "さようなら", "wrongs": ["こんにちは", "おかえりなさい", "おやすみなさい"] }
    ];

    // --- 音声キャッシュ ---
    const audioCache = {};
    function loadAudio(path) {
        if (!audioCache[path]) {
            audioCache[path] = new Audio(path);
        }
        return audioCache[path];
    }
    
    // --- DOM取得 ---
    const questionNumberEl = document.getElementById('question-number');
    const timerBoxEl = document.getElementById('timer-box');
    const questionTextEl = document.getElementById('question-text');
    const playSoundButton = document.getElementById('play-situation-sound'); 
    const choicesContainerEl = document.getElementById('choices-container');
    const resultMessageEl = document.getElementById('result-message');
    const finalScoreEl = document.getElementById('final-score');
    const homeButton = document.getElementById('home-button');
    const restartButton = document.getElementById('restart-button');

    // --- ゲーム状態変数 ---
    let allQuestions = []; 
    let currentQuestions = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 10;
    let currentSituationSound = null; 

    // ----------------------------------------------------
    // メイン関数
    // ----------------------------------------------------

    function startGame() {
        // 問題をシャッフルして10問選ぶ
        allQuestions = shuffleArray([...greetingsData]);
        currentQuestions = allQuestions.slice(0, 10);
        currentQuestionIndex = 0;
        score = 0;
        
        // UIリセット
        finalScoreEl.style.display = 'none';
        resultMessageEl.style.display = 'none';
        choicesContainerEl.style.display = 'grid';
        restartButton.style.display = 'none';
        playSoundButton.disabled = false; 

        loadQuestion();
    }

    function loadQuestion() {
        clearInterval(timer);
        
        resultMessageEl.style.display = 'none';
        
        if (currentQuestionIndex >= currentQuestions.length) {
            endGame();
            return;
        }

        const problem = currentQuestions[currentQuestionIndex];
        
        questionNumberEl.textContent = `だい ${currentQuestionIndex + 1} もん`;
        questionTextEl.textContent = problem.situation;

        const soundFile = `situation${problem.id}.mp3`;
        currentSituationSound = loadAudio(SOUND_PATH_AISATSU + soundFile);
        playSoundButton.onclick = () => playSound(currentSituationSound);
        // 最初に一度だけ自動再生
        playSound(currentSituationSound);

        choicesContainerEl.innerHTML = '';
        const options = shuffleArray([problem.correct, ...problem.wrongs]);
        
        options.forEach(optionText => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.onclick = (e) => checkAnswer(e, problem.correct);
            choicesContainerEl.appendChild(button);
        });
        
        // タイマースタート
        timeLeft = 10;
        timerBoxEl.textContent = `のこり ${timeLeft} びょう`;
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeLeft--;
        timerBoxEl.textContent = `のこり ${timeLeft} びょう`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // 時間切れ
            showResult(false, currentQuestions[currentQuestionIndex].correct);
        }
    }

    function checkAnswer(event, correctAnswer) {
        clearInterval(timer); 
        
        const chosenButton = event.target;
        const chosenAnswer = chosenButton.textContent;
        
        // 選択した答えの音声を再生
        const answerSound = loadAudio(SOUND_PATH_AISATSU + chosenAnswer + '.mp3');
        playSound(answerSound);

        disableChoices();

        if (chosenAnswer === correctAnswer) {
            score++;
            chosenButton.classList.add('correct-answer'); 
            
            // ★★★ ポイント付与 (正解の言葉をIDとして渡す) ★★★
            const result = checkAndAwardPoints(correctAnswer);
            // ★★★★★★★★★★★★★★★★★★★★★★★★★

            // 結果表示にポイント情報を渡す
            showResult(true, correctAnswer, result);

        } else {
            // 不正解
            chosenButton.style.backgroundColor = '#d9534f'; 
            chosenButton.style.borderColor = '#d9534f';
            showResult(false, correctAnswer);
        }
    }

    function showResult(isCorrect, correctAnswer, pointResult = null) {
        playSoundButton.disabled = true;

        if (isCorrect) {
            // ★ ポイントメッセージ作成
            let msg = 'せいかい！';
            if (pointResult === "scored") {
                msg += ' (+1 ポイント！)';
            }
            
            resultMessageEl.textContent = msg;
            resultMessageEl.className = 'result-message correct';
            
            const correctSound = loadAudio('assets/sounds/seikai.mp3');
            playSound(correctSound);
        } else {
            resultMessageEl.textContent = `ざんねん... せいかいは「${correctAnswer}」`;
            resultMessageEl.className = 'result-message incorrect';
            
            const incorrectSound = loadAudio('assets/sounds/bubu.mp3');
            playSound(incorrectSound);
            
            Array.from(choicesContainerEl.children).forEach(button => {
                if (button.textContent === correctAnswer) {
                    button.classList.add('correct-answer');
                }
            });
        }
        resultMessageEl.style.display = 'block';

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 2000);
    }

    function disableChoices() {
        Array.from(choicesContainerEl.children).forEach(button => {
            button.disabled = true;
        });
    }

    function endGame() {
        finalScoreEl.innerHTML = `おわり！<br>10もんちゅう ${score} もん せいかい！`;
        finalScoreEl.style.display = 'block';
        
        questionNumberEl.textContent = 'おつかれさま';
        questionTextEl.textContent = 'クイズしゅうりょう';
        timerBoxEl.textContent = 'おわり';
        choicesContainerEl.style.display = 'none';
        resultMessageEl.style.display = 'none';
        restartButton.style.display = 'block';
        playSoundButton.disabled = true; 
    }

    // ----------------------------------------------------
    // ユーティリティ関数
    // ----------------------------------------------------
    function playSound(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(e => console.error("音声再生エラー:", e));
        }
    }

    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // ----------------------------------------------------
    // イベントリスナー
    // ----------------------------------------------------
    homeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    restartButton.addEventListener('click', startGame);

    // ----------------------------------------------------
    // ゲーム開始
    // ----------------------------------------------------
    startGame();
});