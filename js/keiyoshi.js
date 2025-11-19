document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (単語ごとに1日1回) ★★★
    // ----------------------------------------------------
    const GAME_ID_ADJ_V2 = 'keiyoshi_quiz_v2'; // ゲームID
    
    const USER_STORAGE_KEY_ADJ_V2 = 'user_accounts'; 
    const SESSION_STORAGE_KEY_ADJ_V2 = 'current_user'; 
    const GUEST_NAME_ADJ_V2 = 'ゲスト'; 

    function getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ポイント加算・チェック関数 (単語IDまたは漢字をキーにする)
    function checkAndAwardPoints(wordKey) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY_ADJ_V2);
        if (!currentUser || currentUser === GUEST_NAME_ADJ_V2) return "guest"; 

        const usersJson = localStorage.getItem(USER_STORAGE_KEY_ADJ_V2);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = getTodayDateString();
        // キーを「ゲームID + 単語キー(漢字など)」にする
        const progressKey = `${GAME_ID_ADJ_V2}_word_${wordKey}`;

        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};

        // その単語で、今日すでにポイントをもらっているかチェック
        if (user.progress[progressKey][today] === true) return "already_scored"; 

        // ポイント加算
        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY_ADJ_V2, JSON.stringify(users));
        console.log(`[Game] ${currentUser} gained 1 point for word "${wordKey}". Total: ${user.points}`);
        return "scored"; 
    }
    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (ここまで) ★★★
    // ----------------------------------------------------

    // ----------------------------------------------------
    // 設定・変数
    // ----------------------------------------------------
    const DATA_PATH = 'data/keiyoshi.json';
    
    // ★画像パスの配列 (必要に応じて変更)
    const IMAGE_PATHS = [
        'assets/images/keiyoshi_quiz_1.png', 
        'assets/images/keiyoshi_quiz_2.jpg',
        'assets/images/keiyoshi_quiz_3.gif'  
    ];

    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

    let adjectives = [];        
    let quizQuestions = [];     
    let currentQuestionIndex = 0; 
    let score = 0;              
    const QUIZ_TOTAL_QUESTIONS = 5; 
    const CHOICES_COUNT = 3;    

    // ----------------------------------------------------
    // DOM要素の取得
    // ----------------------------------------------------
    const quizImageElement = document.getElementById('quiz-image');
    const questionNumberElement = document.getElementById('question-number');
    const questionMeaningElement = document.getElementById('question-meaning');
    const choicesContainer = document.getElementById('choices-container');
    const resultMessageElement = document.getElementById('result-message');
    const homeButton = document.getElementById('home-button');
    const restartButton = document.getElementById('restart-button');
    const finalScoreElement = document.getElementById('final-score');

    // ----------------------------------------------------
    // 汎用関数
    // ----------------------------------------------------
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    function getRandomImage() {
        if (IMAGE_PATHS.length === 0) return '';
        return IMAGE_PATHS[Math.floor(Math.random() * IMAGE_PATHS.length)];
    }

    // ----------------------------------------------------
    // 初期化処理
    // ----------------------------------------------------
    async function initializeQuiz() {
        try {
            // ★JSONデータ構造に合わせて読み込み方を変える必要があるかもしれません
            // ここでは { "adjectives": [...] } という構造を想定しています
            const response = await fetch(DATA_PATH);
            const data = await response.json();
            
            // データ形式の判定 (配列か、オブジェクト内配列か)
            if (Array.isArray(data)) {
                adjectives = data; 
            } else if (data.adjectives) {
                adjectives = data.adjectives;
            } else {
                throw new Error("データ形式が不明です");
            }
            
            if (adjectives.length < CHOICES_COUNT) {
                questionMeaningElement.textContent = "エラー: データが不足しています。";
                disableAllButtons();
                return;
            }
            
            homeButton.addEventListener('click', () => {
                window.location.href = 'index.html'; 
            });
            restartButton.addEventListener('click', startNewQuiz);

            startNewQuiz(); 
            
        } catch (error) {
            console.error("データの読み込み中にエラーが発生しました:", error);
            // エラー時は仮データで動くようにする (テスト用)
            adjectives = [
                { kanji: "大きい", hiragana: "おおきい", meaning: "Big", type: "i" },
                { kanji: "小さい", hiragana: "ちいさい", meaning: "Small", type: "i" },
                { kanji: "静か", hiragana: "しずか", meaning: "Quiet", type: "na" },
                { kanji: "賑やか", hiragana: "にぎやか", meaning: "Lively", type: "na" },
                { kanji: "熱い", hiragana: "あつい", meaning: "Hot", type: "i" }
            ];
            startNewQuiz();
        }
    }

    // ----------------------------------------------------
    // クイズロジック
    // ----------------------------------------------------
    function startNewQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizQuestions = generateQuizQuestions();

        resultMessageElement.style.display = 'none';
        finalScoreElement.style.display = 'none';
        restartButton.style.display = 'none';
        choicesContainer.style.display = 'grid'; 
        homeButton.style.display = 'inline-block'; 

        displayQuestion(); 
    }

    function generateQuizQuestions() {
        const questions = [];
        const usedAdjectives = new Set(); 
        
        while (questions.length < QUIZ_TOTAL_QUESTIONS && adjectives.length >= CHOICES_COUNT) {
            // 1. 正解を選ぶ
            let correctAdjective;
            let attempts = 0;
            do {
                correctAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
                attempts++;
            } while (usedAdjectives.has(correctAdjective.meaning) && attempts < 100);

            usedAdjectives.add(correctAdjective.meaning); 
            
            // 2. ダミーを選ぶ
            let wrongAdjectives = [];
            let dummyAttempts = 0;
            while (wrongAdjectives.length < CHOICES_COUNT - 1 && dummyAttempts < 100) {
                const randomIndex = Math.floor(Math.random() * adjectives.length);
                const dummyAdjective = adjectives[randomIndex];
                
                if (dummyAdjective.meaning !== correctAdjective.meaning && 
                    !wrongAdjectives.some(adj => adj.meaning === dummyAdjective.meaning)) {
                    wrongAdjectives.push(dummyAdjective);
                }
                dummyAttempts++;
            }
            
            // 3. 選択肢作成
            const choices = [correctAdjective, ...wrongAdjectives];
            
            // 4. シャッフル
            for (let i = choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [choices[i], choices[j]] = [choices[j], choices[i]];
            }

            // 5. 問題データ作成
            // ★画像がある場合はそれを、なければランダム画像を割り当て
            const imgPath = correctAdjective.image ? `assets/images/${correctAdjective.image}` : getRandomImage();

            questions.push({
                meaning: correctAdjective.meaning,
                correctKanji: correctAdjective.kanji,
                choices: choices,
                image: imgPath 
            });
        }
        return questions;
    }

    function displayQuestion() {
        if (currentQuestionIndex >= QUIZ_TOTAL_QUESTIONS) {
            endQuiz();
            return;
        }

        const question = quizQuestions[currentQuestionIndex];
        
        quizImageElement.src = question.image;
        quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;
        quizImageElement.style.objectFit = 'contain'; // 画像が切れないように

        // 画像ロードエラー時のハンドリング
        quizImageElement.onerror = function() {
             this.src = 'assets/images/placeholder.png'; // 代替画像があれば
             // または this.style.display = 'none';
        };

        questionNumberElement.textContent = `第 ${currentQuestionIndex + 1} 問 (全 ${QUIZ_TOTAL_QUESTIONS} 問)`;
        questionMeaningElement.textContent = question.meaning;
        
        choicesContainer.innerHTML = ''; 
        question.choices.forEach(adjective => {
            const button = document.createElement('button');
            
            const suffix = adjective.type === 'na' ? ' (な)' : '';
            button.textContent = `${adjective.kanji}（${adjective.hiragana}）${suffix}`;
            
            button.addEventListener('click', () => checkAnswer(button, adjective.kanji));
            
            choicesContainer.appendChild(button);
        });
        
        resultMessageElement.style.display = 'none';
        resultMessageElement.className = 'result-message'; 
    }

    function checkAnswer(clickedButton, selectedKanji) {
        const question = quizQuestions[currentQuestionIndex];
        const isCorrect = (selectedKanji === question.correctKanji);
        
        disableAllButtons(); // 連打防止のため先に無効化

        if (isCorrect) {
            playSound(SOUND_CORRECT_PATH);
            
            // ★★★ ポイント付与 (漢字をキーとして渡す) ★★★
            const result = checkAndAwardPoints(selectedKanji);
            
            let msg = "✅ 正解です！";
            if (result === "scored") {
                msg += " (+1 ポイント！)";
            }
            // ★★★★★★★★★★★★★★★★★★★★★★★

            score++;
            resultMessageElement.textContent = msg;
            resultMessageElement.classList.remove('incorrect');
            resultMessageElement.classList.add('correct');
            clickedButton.classList.add('correct-answer'); 

            resultMessageElement.style.display = 'block';
            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
            }, 1500); 
            
        } else {
            playSound(SOUND_INCORRECT_PATH);
            
            resultMessageElement.textContent = "❌ 不正解です。もう一度挑戦してください。";
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            clickedButton.style.backgroundColor = '#ff6b6b'; 
            clickedButton.style.borderColor = '#ff6b6b';
            
            // 不正解の場合は、そのボタンだけ無効のままにして、他は有効に戻す（再挑戦させる場合）
            // 今回の仕様では「不正解」→「もう一度」となっているので、ボタンを有効に戻す
            enableAllButtons();
            clickedButton.disabled = true; // 押したボタンだけ無効化

            resultMessageElement.style.display = 'block';
        }
    }

    function disableAllButtons() {
        Array.from(choicesContainer.children).forEach(button => {
            button.disabled = true;
        });
    }

    function enableAllButtons() {
        Array.from(choicesContainer.children).forEach(button => {
            button.disabled = false;
        });
    }

    function endQuiz() {
        questionNumberElement.textContent = "クイズ終了！";
        questionMeaningElement.textContent = "全問終了しました。お疲れ様でした！";
        choicesContainer.innerHTML = ''; 
        choicesContainer.style.display = 'none'; 

        quizImageElement.src = ''; 
        quizImageElement.alt = '';

        resultMessageElement.style.display = 'none'; 

        finalScoreElement.textContent = `${QUIZ_TOTAL_QUESTIONS} 問中 ${score} 問正解でした！`;
        finalScoreElement.style.display = 'block';

        homeButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';
    }

    // 初期化実行
    initializeQuiz();

});