document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 設定・データ
    // ----------------------------------------------------
    const SOUND_PATH_AISATSU = 'assets/sounds/aisatsu/';
    const IMAGE_PATH_AISATSU = 'assets/images/aisatsu/'; 
    const POINTS_PER_QUESTION = 1;
    
    // ★追加: Web Speech API (音声合成) の準備
    const synth = window.speechSynthesis;

    const greetingsData = [
        { "id": 1, "situation": "あさ、おきたとき、または あったひとに いう あいさつは？ (朝)", "correct": "おはよう", "image": "ohayou.png", "wrongs": ["こんにちは", "こんばんは", "おやすみなさい"] },
        { "id": 2, "situation": "ひるま、ひとに あったときの あいさつは？ (昼)", "correct": "こんにちは", "image": "konnichiwa.png", "wrongs": ["おはよう", "こんばんは", "さようなら"] },
        { "id": 3, "situation": "ゆうがたから よるに かけて、ひとに あったときの あいさつは？ (夜)", "correct": "こんばんは", "image": "konbanwa.png", "wrongs": ["おはよう", "こんにちは", "ただいま"] },
        { "id": 4, "situation": "ねるまえに ひとに いう あいさつは？", "correct": "おやすみなさい", "image": "oyasumi.png", "wrongs": ["さようなら", "いただきます", "いってきます"] },
        { "id": 5, "situation": "これから いえを でかけるときの あいさつは？ (自分が)", "correct": "いってきます", "image": "ittekimasu.png", "wrongs": ["ただいま", "いってらっしゃい", "おかえりなさい"] },
        { "id": 6, "situation": "かぞくが でかけるときに、かえす ことばは？", "correct": "いってらっしゃい", "image": "itterasshai.png", "wrongs": ["いってきます", "ただいま", "おかえりなさい"] },
        { "id": 7, "situation": "そとから いえに かえってきたときの あいさつは？", "correct": "ただいま", "image": "tadaima.png", "wrongs": ["おかえりなさい", "いってきます", "ごちそうさま"] },
        { "id": 8, "situation": "「ただいま」と いわれたときの かえす ことばは？", "correct": "おかえりなさい", "image": "okaeri.png", "wrongs": ["いってきます", "さようなら", "ごめんなさい"] },
        { "id": 9, "situation": "なにかを してもらったときの、かんしゃの ことばは？", "correct": "ありがとう", "image": "arigatou.png", "wrongs": ["ごめんなさい", "いただきます", "おやすみなさい"] },
        { "id": 10, "situation": "わるいことを してしまったときの あいさつは？", "correct": "ごめんなさい", "image": "gomen.png", "wrongs": ["ありがとう", "こんにちは", "いただきます"] },
        { "id": 11, "situation": "ごはんを たべるまえの あいさつは？", "correct": "いただきます", "image": "itadakimasu.png", "wrongs": ["ごちそうさま", "ありがとう", "おかえりなさい"] },
        { "id": 12, "situation": "ごはんを たべおわった あとの あいさつは？", "correct": "ごちそうさま", "image": "gochisousama.png", "wrongs": ["いただきます", "こんにちは", "おやすみなさい"] },
        { "id": 13, "situation": "はじめて あうひとに いう、さいしょの あいさつは？", "correct": "はじめまして", "image": "hajimemashite.png", "wrongs": ["こんにちは", "さようなら", "いってきます"] },
        { "id": 14, "situation": "かぞくや ともだちと わかれるときの あいさつは？", "correct": "さようなら", "image": "sayounara.png", "wrongs": ["こんにちは", "おかえりなさい", "おやすみなさい"] }
    ];

    // --- 音声キャッシュ (ファイル再生用) ---
    const audioCache = {};
    function loadAudio(path) {
        if (!audioCache[path]) {
            audioCache[path] = new Audio(path);
        }
        return audioCache[path];
    }
    
    // --- DOM取得 ---
    const screens = document.querySelectorAll('.aq-screen');
    const studyScreen = document.getElementById('aq-screen-study');
    const quizScreen = document.getElementById('aq-screen-quiz');
    
    const studyGridEl = document.getElementById('aq-study-grid');
    const startQuizButton = document.getElementById('aq-start-quiz-button');
    
    const questionNumberEl = document.getElementById('aq-question-number');
    const timerBoxEl = document.getElementById('aq-timer-box');
    const questionTextEl = document.getElementById('aq-question-text');
    const playSoundButton = document.getElementById('aq-play-sound-button');
    const choicesContainerEl = document.getElementById('aq-choices-container');
    const resultMessageEl = document.getElementById('aq-result-message');
    const finalScoreEl = document.getElementById('aq-final-score');
    const restartButton = document.getElementById('aq-restart-button');
    const homeButton = document.getElementById('aq-home-button');

    // --- ゲーム変数 ---
    let currentQuestions = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 10;
    let currentSituationSound = null;

    // ----------------------------------------------------
    // ★追加: Web Speech API 読み上げ関数 (練習モード用)
    // ----------------------------------------------------
    function speak(text) {
        // 読み上げ中ならキャンセル
        if (synth.speaking) synth.cancel();

        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 0.9; // 少しゆっくり

        // Chrome等で声が出ない対策（声のリスト取得）
        const voices = synth.getVoices();
        const jpVoice = voices.find(v => v.lang === 'ja-JP');
        if(jpVoice) utterThis.voice = jpVoice;

        synth.speak(utterThis);
    }

    // ----------------------------------------------------
    // 画面切り替え & ユーティリティ
    // ----------------------------------------------------
    function showScreen(screenElement) {
        screens.forEach(s => s.classList.remove('active'));
        screenElement.classList.add('active');
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function playFileSound(path) {
        const audio = loadAudio(path);
        audio.currentTime = 0;
        audio.play().catch(e => console.log("再生エラー(ファイル):", e));
    }

    // ----------------------------------------------------
    // 1. 練習モード初期化 (★ここを変更しました)
    // ----------------------------------------------------
    function initStudyScreen() {
        studyGridEl.textContent = '';
        greetingsData.forEach(word => {
            const item = document.createElement('div');
            item.className = 'aq-study-item';
            
            // ★クリック時に speak() を呼ぶように変更
            item.onclick = () => {
                speak(word.correct);
            };
            
            const img = document.createElement('img');
            img.src = IMAGE_PATH_AISATSU + word.image;
            img.alt = word.correct;
            
            const p = document.createElement('p');
            p.textContent = word.correct;
            
            item.appendChild(img);
            item.appendChild(p);
            studyGridEl.appendChild(item);
        });
    }

    // ----------------------------------------------------
    // 2. クイズモード (ロジックは以前のままファイル再生)
    // ----------------------------------------------------
    function startGame() {
        currentQuestions = shuffleArray([...greetingsData]).slice(0, 10);
        currentQuestionIndex = 0;
        score = 0;
        
        finalScoreEl.style.display = 'none';
        resultMessageEl.style.display = 'none';
        choicesContainerEl.style.display = 'grid';
        restartButton.style.display = 'none';
        homeButton.style.display = 'none';
        
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
        timerBoxEl.style.display = 'none'; 

        // 選択肢作成
        const wrongOptions = shuffleArray(problem.wrongs).slice(0, 2); 
        const options = shuffleArray([problem.correct, ...wrongOptions]);
        
        choicesContainerEl.textContent = '';
        options.forEach(optionText => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.onclick = (e) => checkAnswer(e, problem.correct);
            choicesContainerEl.appendChild(button);
        });
        
        // ★ クイズの問題文はファイル再生 (situation1.mp3)
        const soundFile = `situation${problem.id}.mp3`;
        const soundPath = SOUND_PATH_AISATSU + soundFile;
        
        // ボタン設定
        playSoundButton.onclick = () => playFileSound(soundPath);
        
        // 自動再生
        playFileSound(soundPath);

        // ボタン有効化・タイマー開始
        disableChoices(false);
        startTimer();
    }

    function startTimer() {
        timeLeft = 10;
        timerBoxEl.textContent = `のこり ${timeLeft} びょう`;
        timerBoxEl.style.display = 'inline-block';
        
        clearInterval(timer); 
        timer = setInterval(() => {
            timeLeft--;
            timerBoxEl.textContent = `のこり ${timeLeft} びょう`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                showResult(false, currentQuestions[currentQuestionIndex].correct);
            }
        }, 1000);
    }

    // ★ async に変更 (Firebaseポイント処理のため)
    async function checkAnswer(event, correctAnswer) {
        clearInterval(timer); 
        const chosenButton = event.target;
        const chosenAnswer = chosenButton.textContent;
        
        disableChoices(true); 

        if (chosenAnswer === correctAnswer) {
            score++;
            chosenButton.classList.add('correct-answer');
            
            // Firebaseポイント加算
            if (typeof window.addPointsToUser === 'function') {
                await window.addPointsToUser(POINTS_PER_QUESTION, correctAnswer);
            }
            showResult(true, correctAnswer, "scored");
        } else {
            // スタイル適用（CSSクラスがない場合の直接スタイル）
            chosenButton.style.backgroundColor = '#fbe9e7';
            chosenButton.style.color = '#c62828';
            chosenButton.style.borderColor = '#ef5350';
            showResult(false, correctAnswer);
        }
    }

    function showResult(isCorrect, correctAnswer, pointResult) {
        if (isCorrect) {
            resultMessageEl.textContent = 'せいかい！ (+1pt)';
            resultMessageEl.className = 'result-message correct';
            playFileSound('assets/sounds/seikai.mp3');
        } else {
            resultMessageEl.textContent = `ざんねん... せいかいは「${correctAnswer}」`;
            resultMessageEl.className = 'result-message incorrect';
            playFileSound('assets/sounds/bubu.mp3');
            
            // 正解を表示
            Array.from(choicesContainerEl.children).forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct-answer');
                }
            });
        }
        resultMessageEl.style.display = 'block';

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 2000);
    }

    function disableChoices(disabled) {
        Array.from(choicesContainerEl.children).forEach(btn => btn.disabled = disabled);
    }

    function endGame() {
        finalScoreEl.textContent = `おわり！<br>10もんちゅう ${score} もん せいかい！`;
        finalScoreEl.style.display = 'block';
        
        questionNumberEl.textContent = 'おつかれさま';
        questionTextEl.textContent = 'クイズしゅうりょう';
        timerBoxEl.style.display = 'none';
        choicesContainerEl.style.display = 'none';
        resultMessageEl.style.display = 'none';
        
        restartButton.style.display = 'block';
        homeButton.style.display = 'block';
        playSoundButton.disabled = true; 
    }

    // --- イベント設定 ---
    startQuizButton.onclick = () => {
        startGame();
        showScreen(quizScreen);
    };
    restartButton.onclick = startGame;

    // --- 初期化 ---
    initStudyScreen();
    showScreen(studyScreen);
    
    // ページ読み込み時にvoicesを一度取得しておく（Chrome対策）
    synth.getVoices();
});