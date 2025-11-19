document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (ここから追加) ★★★
    // ----------------------------------------------------
    const GAME_ID_ADJ_SIMPLE = 'adjective_picture_quiz'; // ★ゲームID
    
    const USER_STORAGE_KEY_ADJ = 'user_accounts'; 
    const SESSION_STORAGE_KEY_ADJ = 'current_user'; 
    const GUEST_NAME_ADJ = 'ゲスト'; 

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
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY_ADJ);
        if (!currentUser || currentUser === GUEST_NAME_ADJ) return "guest"; 

        const usersJson = localStorage.getItem(USER_STORAGE_KEY_ADJ);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = getTodayDateString();
        // キーを「ゲームID + 正解の言葉」にする
        const progressKey = `${GAME_ID_ADJ_SIMPLE}_word_${wordKey}`;

        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};

        // その言葉で、今日すでにポイントをもらっているかチェック
        if (user.progress[progressKey][today] === true) return "already_scored"; 

        // ポイント加算
        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY_ADJ, JSON.stringify(users));
        console.log(`[Game] ${currentUser} gained 1 point for word "${wordKey}". Total: ${user.points}`);
        return "scored"; 
    }
    // ----------------------------------------------------
    // ★★★ ポイントシステム設定 (ここまで) ★★★
    // ----------------------------------------------------


    // ----------------------------------------------------
    // クイズデータ
    // ----------------------------------------------------
    const IMAGE_BASE_PATH = "assets/images/"; 
    
    // ★音源ファイルのパス設定 (追加)
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

    const quizData = [
        {
            image: IMAGE_BASE_PATH + "ame.png",
            options: ["あまい", "にぎやか", "かんたん"],
            correct: "あまい",
            english: "Sweet"
        },
        {
            image: IMAGE_BASE_PATH + "kuruma.png",
            options: ["あかい", "おもい", "すずしい"],
            correct: "あかい",
            english: "Red"
        },
        {
            image: IMAGE_BASE_PATH + "zou.png",
            options: ["ちいさい", "おおきい", "かるい"],
            correct: "おおきい",
            english: "Big"
        },
        {
            image: IMAGE_BASE_PATH + "taiyo.png",
            options: ["くらい", "さむい", "あかるい"],
            correct: "あかるい",
            english: "Bright"
        },
        {
            image: IMAGE_BASE_PATH + "koori.png",
            options: ["あたたかい", "つめたい", "やさしい"],
            correct: "つめたい",
            english: "Cold"
        }
        // ここに問題を追加できます
    ];

    // ----------------------------------------------------
    // DOM要素の取得
    // ----------------------------------------------------
    const imageElement = document.getElementById('quiz-image');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackElement = document.getElementById('quiz-feedback');

    let currentQuestionIndex = 0;
    let isClickable = true; 

    // ★ 音源再生関数 (追加)
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    // ----------------------------------------------------
    // クイズの読み込み処理
    // ----------------------------------------------------
    function loadQuestion() {
        // すべての問題が終わったら
        if (currentQuestionIndex >= quizData.length) {
            imageElement.style.display = 'none'; // 画像を隠す
            optionsContainer.innerHTML = '';
            feedbackElement.textContent = "🎉 すべての問題がおわりました！";
            feedbackElement.classList.remove('hidden');
            feedbackElement.classList.add('feedback-correct');
            return;
        }

        isClickable = true; // クリック可能に戻す
        const currentQuiz = quizData[currentQuestionIndex];

        // 1. 画像をセット
        imageElement.src = currentQuiz.image;
        imageElement.alt = currentQuiz.correct; 
        // 画像が見切れないように調整 (念のため)
        imageElement.style.objectFit = 'contain'; 

        // 2. 選択肢ボタンを作成
        optionsContainer.innerHTML = ''; // 前の問題のボタンを消去
        feedbackElement.classList.add('hidden'); // フィードバックを隠す
        feedbackElement.classList.remove('feedback-correct', 'feedback-incorrect');

        currentQuiz.options.forEach(optionText => {
            const button = document.createElement('button');
            button.textContent = optionText;
            
            button.classList.add('option-button'); 
            
            // 3. ボタンにクリックイベントを設定
            button.addEventListener('click', checkAnswer);
            optionsContainer.appendChild(button);
        });
    }

    // ----------------------------------------------------
    // 答え合わせの処理
    // ----------------------------------------------------
    function checkAnswer(event) {
        if (!isClickable) return; // 処理中はクリックを無視

        const selectedButton = event.target;
        const selectedAnswer = selectedButton.textContent;
        const correctAnswer = quizData[currentQuestionIndex].correct;

        // 4. 間違えた場合
        if (selectedAnswer !== correctAnswer) {
            playSound(SOUND_INCORRECT_PATH); // ★音を鳴らす

            feedbackElement.textContent = "🤔 ちがうよ、もういちど！";
            feedbackElement.classList.remove('hidden');
            feedbackElement.classList.add('feedback-incorrect');
            
            // 間違えたボタンだけを無効化
            selectedButton.disabled = true; 
            selectedButton.classList.add('wrong-selection'); 
            isClickable = true; 
        } 
        // 5. 正解した場合
        else {
            isClickable = false; // 次の問題が読み込まれるまでクリック不可
            playSound(SOUND_CORRECT_PATH); // ★音を鳴らす

            const englishTranslation = quizData[currentQuestionIndex].english;

            // ★★★ ポイント付与 (正解の言葉をIDとして渡す) ★★★
            const result = checkAndAwardPoints(correctAnswer);
            
            let pointMsg = "";
            if (result === "scored") {
                pointMsg = " (+1 ポイント！)";
            }
            // ★★★★★★★★★★★★★★★★★★★★★★★★★

            feedbackElement.textContent = `🎉 せいかい！ ( ${englishTranslation} )${pointMsg}`;
            feedbackElement.classList.remove('hidden');
            feedbackElement.classList.add('feedback-correct');

            // すべてのボタンを無効化
            optionsContainer.querySelectorAll('.option-button').forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct-selection'); 
                }
            });

            // 1.5秒後に次の問題へ進む
            currentQuestionIndex++;
            setTimeout(loadQuestion, 1500);
        }
    }

    // 最初の問題を読み込む
    loadQuestion();
});