document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ Firebase連携ポイント設定 (ダミー/定数) ★★★
    // 外部のモジュールスクリプトで定義されたグローバル関数に依存
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => { return false; };
    }
    const POINTS_PER_QUESTION = 1; // Firebase連携スクリプトと同期
    // ----------------------------------------------------


    // ----------------------------------------------------
    // データ定義 (問題解決のため、データ構造と処理を明確化)
    // ----------------------------------------------------
    const IMAGE_PATH = 'assets/images/kanji/';
    const DATA_PATH = 'data/kanji.json'; // 参照のみ

    // テスト用の漢字データ (問題なく動作するようにデータを調整)
    const TEMP_KANJI_DATA = [
        { id: 'ichi', char: '一', kun: 'ひと・つ', on: 'イチ', image: 'one.png' },
        { id: 'ni', char: '二', kun: 'ふた・つ', on: 'ニ', image: 'two.png' },
        { id: 'san', char: '三', kun: 'み・つ', on: 'サン', image: 'three.png' },
        { id: 'shi', char: '四', kun: 'よ・ん', on: 'シ', image: 'four.png' },
        { id: 'go', char: '五', kun: 'いつ・つ', on: 'ゴ', image: 'five.png' },
        { id: 'roku', char: '六', kun: 'む・つ', on: 'ロク', image: 'six.png' },
        { id: 'nana', char: '七', kun: 'なな・つ', on: 'シチ', image: 'seven.png' },
        { id: 'hachi', char: '八', kun: 'や・つ', on: 'ハチ', image: 'eight.png' },
        { id: 'kyuu', char: '九', kun: 'ここの・つ', on: 'キュウ・ク', image: 'nine.png' },
        { id: 'juu', char: '十', kun: 'とお', on: 'ジュウ・ジッ', image: 'ten.png' },
        { id: 'hito', char: '人', kun: 'ひと', on: 'ジン・ニン', image: 'person.png' },
        { id: 'yama', char: '山', kun: 'やま', on: 'サン', image: 'mountain.png' },
        { id: 'kawa', char: '川', kun: 'かわ', on: 'セン', image: 'river.png' },
        { id: 'tsuki', char: '月', kun: 'つき', on: 'ゲツ・ガツ', image: 'moon.png' },
        { id: 'hi', char: '日', kun: 'ひ', on: 'ニチ・ジツ', image: 'sun.png' }
    ];

    // 音声ファイルのパス設定
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

    // グローバル変数
    let kanjiList = [];         
    let quizQuestions = [];     
    let currentQuestionIndex = 0; 
    let score = 0;              
    let currentMode = 'kun'; 

    // 制限とカウンター
    const MAX_WRONG_ANSWERS = 3;    
    let wrongAnswerCount = 0;       
    const CHOICES_COUNT = 4; // 選択肢の数
    
    // DOM要素の取得
    const quizImageElement = document.getElementById('quiz-image');
    const questionNumberElement = document.getElementById('question-number');
    const questionTextElement = document.getElementById('question-text');
    const questionPromptElement = document.getElementById('question-prompt'); 
    const choicesContainer = document.getElementById('choices-container');
    const resultMessageElement = document.getElementById('result-message');
    const homeButton = document.getElementById('home-button');
    const restartButton = document.getElementById('restart-button');
    const finalScoreElement = document.getElementById('final-score');
    const modeSelectionRadios = document.querySelectorAll('input[name="readingMode"]'); 

    // ======== 汎用関数 ========

    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // ======== 初期化 ========

    async function initializeQuiz() {
        
        // ★修正: 組み込みデータを使用し、読み方を配列に変換
        kanjiList = TEMP_KANJI_DATA.map(item => ({
            ...item, 
            // 読み方が 'A・B' の形式の場合にsplitする
            kun: item.kun ? item.kun.split('・').map(r => r.trim()) : [], 
            on: item.on ? item.on.split('・').map(r => r.trim()) : []
        }));
        
        if (kanjiList.length < CHOICES_COUNT) {
            questionTextElement.textContent = "エラー: データが不足しています。";
            disableAllButtons();
            return;
        }
        
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
        restartButton.addEventListener('click', startNewQuiz);

        modeSelectionRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                handleModeSwitch(event.target.value); 
            });
        });

        startNewQuiz(); 
    }

    // ======== クイズ開始 ========

    function startNewQuiz() {
        const selectedMode = document.querySelector('input[name="readingMode"]:checked').value || 'kun';
        handleModeSwitch(selectedMode, false); 
    }

    // ======== モード切替 ========

    function handleModeSwitch(newMode, isSwitching = true) {
        let targetKanji = null;
        if (quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length) {
            targetKanji = quizQuestions[currentQuestionIndex].kanji;
        }

        if (!isSwitching) {
            currentQuestionIndex = 0;
            score = 0;
            wrongAnswerCount = 0;
            quizQuestions = generateQuizQuestions(); // リスタート時だけ再生成
        }

        currentMode = newMode;

        // プロンプト更新
        const promptText = currentMode === 'on'
            ? "この漢字の**音読み**を選びなさい："
            : "この漢字の**訓読み**を選びなさい：";
        questionPromptElement.innerHTML = promptText;

        // 音訓切替のときは、現在の漢字のみ選択肢を再構築
        if (isSwitching && targetKanji) {
            // ... (この部分は、問題の切り替えがない限り、リスタート時のロジックで対応できるため簡略化)
        } 

        resultMessageElement.style.display = 'none';
        finalScoreElement.style.display = 'none';
        restartButton.style.display = 'none';
        choicesContainer.style.display = 'grid';
        homeButton.style.display = 'inline-block';

        displayQuestion();
    }

    // ======== 出題生成 ========

    function getCorrectReading(item, mode) {
        const readings = item[mode];
        if (readings && readings.length > 0) {
             // 最初の読み方を返す (例: "ひと" / "イチ")
            const reading = readings[0].replace(/[\.\-].*$/, '').trim();
            // ★重要修正: 読み方がない場合はnullを返す
            return reading.length > 0 ? reading : null;
        }
        return null; 
    }

    function generateSingleQuestion(kanjiItem, mode, allReadings) {
        const correctReading = getCorrectReading(kanjiItem, mode);
        if (!correctReading) return null;

        let wrongReadingPool = allReadings.filter(r => r !== correctReading);
        wrongReadingPool = Array.from(new Set(wrongReadingPool));
        wrongReadingPool = shuffleArray(wrongReadingPool);

        // 選択肢の数が不足しないように調整
        const wrongReadings = wrongReadingPool.slice(0, CHOICES_COUNT - 1);
        const choices = shuffleArray([correctReading, ...wrongReadings]);

        return {
            kanji: kanjiItem.char,
            correctAnswer: correctReading,
            choices: choices,
            image: IMAGE_PATH + kanjiItem.image,
            id: kanjiItem.id 
        };
    }

    function generateQuizQuestions() {
        const questions = [];
        let availableKanji = kanjiList.filter(item => getCorrectReading(item, currentMode) !== null);
        availableKanji = shuffleArray(availableKanji); 
        
        // 全体の読み取りリストを生成 (ダミー用)
        let allReadings = [];
        kanjiList.forEach(item => {
            const reading = getCorrectReading(item, currentMode);
            if (reading) allReadings.push(reading);
        });
        allReadings = Array.from(new Set(allReadings)); // 重複削除
        
        // 全体の読み取りリストが4つ未満の場合、クイズが成立しないため警告
        if (allReadings.length < CHOICES_COUNT) {
            console.error("Warning: Not enough unique readings for choices.");
        }


        for (const correctItem of availableKanji) {
            const question = generateSingleQuestion(correctItem, currentMode, allReadings);
            if (question) questions.push(question);
        }
        return questions;
    }

    // ======== 表示処理 ========

    function displayQuestion() {
        choicesContainer.innerHTML = '';
        resultMessageElement.style.display = 'none';
        resultMessageElement.className = 'result-message';
        
        if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
            endQuiz(true); 
            return;
        }

        if (currentQuestionIndex >= quizQuestions.length) {
            endQuiz(false); 
            return;
        }

        const question = quizQuestions[currentQuestionIndex];
        // 画像ソースと漢字の表示
        quizImageElement.src = question.image;
        quizImageElement.alt = question.kanji + 'の画像';
        
        questionNumberElement.textContent = 
            `第 ${currentQuestionIndex + 1} 問 (残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回)`; 
        questionTextElement.textContent = question.kanji; // ★漢字の表示

        question.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            // 漢字IDを渡す
            button.addEventListener('click', () => checkAnswer(button, choice, question.correctAnswer, question.id));
            choicesContainer.appendChild(button); // ★選択肢の表示
        });
        
        enableChoices();
    }

    // ======== 回答チェック (Firebase連携) ========

    function enableChoices(enabled = true) {
        choicesContainer.querySelectorAll('button').forEach(button => {
            button.disabled = !enabled;
            button.classList.remove('correct-answer');
            if (enabled) {
                // スタイルをリセット
                button.style.backgroundColor = '';
                button.style.boxShadow = '';
                button.style.color = '';
            }
        });
    }

    async function checkAnswer(clickedButton, selectedChoice, correctAnswer, kanjiId) { 
        const isCorrect = (selectedChoice === correctAnswer);
        
        if (isCorrect) {
            playSound(SOUND_CORRECT_PATH);

            // ★★★ Firebaseポイント付与ロジック ★★★
            const success = await window.addPointsToUser(POINTS_PER_QUESTION, kanjiId);
            
            let msg = "✅ 正解です！次の問題へ進みます。";
            if (success) {
                msg += " (+1 ポイント記録)";
            } else if (window.currentUserId) {
                msg += " (ポイント記録エラー)";
            }
            // ★★★ Firebaseポイント付与ロジック 終了 ★★★

            score++;
            resultMessageElement.textContent = msg;
            resultMessageElement.classList.remove('incorrect');
            resultMessageElement.classList.add('correct');
            clickedButton.classList.add('correct-answer'); 

            disableAllButtons();
            resultMessageElement.style.display = 'block';
            
            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
            }, 1500); 
            
        } else {
            playSound(SOUND_INCORRECT_PATH);
            wrongAnswerCount++; 
            
            if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
                resultMessageElement.textContent = `🚨 残念！${MAX_WRONG_ANSWERS}回間違えました。`;
                resultMessageElement.classList.remove('correct');
                resultMessageElement.classList.add('incorrect');
                resultMessageElement.style.display = 'block';
                disableAllButtons(); 
                
                setTimeout(() => {
                    endQuiz(true);
                }, 2500);
                return;
            }

            resultMessageElement.textContent = `❌ 不正解です。残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回。`;
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            
            clickedButton.disabled = true; 
            clickedButton.style.backgroundColor = 'var(--incorrect-color)'; 
            clickedButton.style.boxShadow = '0 4px 0 #992929'; 
            clickedButton.style.color = 'white';

            resultMessageElement.style.display = 'block';
            
            questionNumberElement.textContent = 
                `第 ${currentQuestionIndex + 1} 問 (残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回)`; 
        }
    }

    // ======== 共通処理 ========

    function disableAllButtons() {
        Array.from(choicesContainer.children).forEach(button => {
            button.disabled = true;
        });
    }

    function endQuiz(isGameOver) {
        choicesContainer.innerHTML = ''; 
        choicesContainer.style.display = 'none'; 
        quizImageElement.src = ''; 
        quizImageElement.alt = '';
        resultMessageElement.style.display = 'none'; 

        if (isGameOver) {
            questionNumberElement.textContent = "ゲームオーバー！";
            questionTextElement.textContent = "残念！最初からやり直しましょう。";
            finalScoreElement.style.color = '#dc3545';
        } else {
            questionNumberElement.textContent = "クイズクリア！";
            questionTextElement.textContent = "クイズ終了です！お疲れさまでした！";
            finalScoreElement.style.color = '#28a745';
        }

        finalScoreElement.textContent = `正解数: ${score} 問`;
        finalScoreElement.style.display = 'block';
        homeButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';
    }

    document.addEventListener('DOMContentLoaded', initializeQuiz);
});