document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ Firebase連携設定 ★★★
    // ----------------------------------------------------
    // HTML側のモジュールで定義された関数がない場合のフォールバック
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => { return false; };
    }
    const POINTS_PER_QUESTION = 1;

    // ----------------------------------------------------
    // 設定・変数
    // ----------------------------------------------------
    const DATA_PATH = 'data/keiyoshi.json';
    
    // 画像パスの配列 (JSONに画像指定がない場合のランダム表示用)
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
    let isAnswering = false; // 連打防止フラグ

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
            // 仮データも足りない場合は停止
            if (adjectives.length < CHOICES_COUNT) {
                questionMeaningElement.textContent = "データ読込エラー";
                return;
            }
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
        
        // データの安全装置 (無限ループ防止)
        let loopSafety = 0;

        while (questions.length < QUIZ_TOTAL_QUESTIONS && loopSafety < 1000) {
            loopSafety++;

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
                
                // 意味が違い、かつ既に選ばれていないもの
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
        if (currentQuestionIndex >= quizQuestions.length) {
            endQuiz();
            return;
        }

        const question = quizQuestions[currentQuestionIndex];
        isAnswering = false; // 回答可能状態にする
        
        quizImageElement.src = question.image;
        quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;
        quizImageElement.style.objectFit = 'contain'; 

        // 画像ロードエラー時のハンドリング
        quizImageElement.onerror = function() {
             // 代替画像を表示するか、非表示にする
             // this.style.display = 'none'; 
             this.src = 'assets/images/placeholder.png'; // プレースホルダーがあれば
        };

        questionNumberElement.textContent = `第 ${currentQuestionIndex + 1} 問 (全 ${QUIZ_TOTAL_QUESTIONS} 問)`;
        questionMeaningElement.textContent = question.meaning;
        
        choicesContainer.innerHTML = ''; 
        question.choices.forEach(adjective => {
            const button = document.createElement('button');
            
            const suffix = adjective.type === 'na' ? ' (な)' : '';
            button.textContent = `${adjective.kanji}（${adjective.hiragana}）${suffix}`;
            
            // 漢字IDを渡す
            button.addEventListener('click', () => checkAnswer(button, adjective.kanji));
            
            choicesContainer.appendChild(button);
        });
        
        resultMessageElement.style.display = 'none';
        resultMessageElement.className = 'result-message'; 
    }

    // ★ async に変更
    async function checkAnswer(clickedButton, selectedKanji) {
        if (isAnswering) return; // 連打防止
        isAnswering = true;

        const question = quizQuestions[currentQuestionIndex];
        const isCorrect = (selectedKanji === question.correctKanji);
        
        disableAllButtons(); 

        if (isCorrect) {
            playSound(SOUND_CORRECT_PATH);
            
            // ★★★ Firebase ポイント加算 ★★★
            const success = await window.addPointsToUser(POINTS_PER_QUESTION, selectedKanji);
            
            let msg = "✅ 正解です！";
            if (success) {
                msg += " (+1 ポイント)";
            }
            // ★★★★★★★★★★★★★★★★★

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
            
            resultMessageElement.textContent = "❌ 不正解です...";
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            
            // どのボタンを押したかわかるようにスタイル適用 (HTML側のCSSに依存)
            clickedButton.style.opacity = '0.7'; 
            
            // 今回は不正解でも次に進まない仕様（あるいは進む仕様）に合わせて調整
            // ここでは「不正解メッセージを出して、もう一度ボタンを押させる」のではなく
            // 「正解を教えて次に進む」または「もう一度選ばせる」のどちらかになりますが、
            // 元のコードの挙動（ボタン無効化してメッセージ表示）を維持しつつ、
            // シンプルに「再挑戦」させるためボタンを有効に戻します。
            
            enableAllButtons();
            clickedButton.disabled = true; // 間違えたボタンだけ無効化
            isAnswering = false; // 再回答可能に

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
        questionMeaningElement.textContent = "お疲れ様でした！";
        choicesContainer.innerHTML = ''; 
        // choicesContainer.style.display = 'none'; 

        quizImageElement.src = ''; 
        quizImageElement.alt = '';
        // quizImageElement.style.display = 'none';

        resultMessageElement.style.display = 'none'; 

        finalScoreElement.textContent = `${QUIZ_TOTAL_QUESTIONS} 問中 ${score} 問正解でした！`;
        finalScoreElement.style.display = 'block';

        homeButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';
    }

    // 初期化実行
    initializeQuiz();

});