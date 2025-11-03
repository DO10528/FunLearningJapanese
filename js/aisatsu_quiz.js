// データのパス
const DATA_PATH = 'data/aisatsu.json';

// 音声ファイルのパス設定 (ご自身のファイル名に合わせて修正してください)
const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 

// グローバル変数
let greetingsList = [];     
let quizQuestions = [];     
let currentQuestionIndex = 0; 
let score = 0;              

// ★追加: タイマーと間違い回数の設定
const MAX_WRONG_ANSWERS = 3;    
let wrongAnswerCount = 0;       
const TIME_LIMIT = 5;           // 制限時間（秒）
let timerId = null;             // タイマーIDを保持

const CHOICES_COUNT = 3;        

// DOM要素の取得
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text'); // 挨拶文
const questionPromptElement = document.getElementById('question-prompt'); // 状況説明
const timerBoxElement = document.getElementById('timer-box'); // ★追加
const choicesContainer = document.getElementById('choices-container');
const resultMessageElement = document.getElementById('result-message');
const homeButton = document.getElementById('home-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');


/**
 * 指定されたパスの音源を再生する関数
 */
function playSound(path) {
    const audio = new Audio(path);
    audio.play().catch(e => console.error("音声再生エラー:", e));
}

/**
 * データを読み込み、クイズの準備を開始する関数
 */
async function initializeQuiz() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        greetingsList = data.greetings;
        
        if (greetingsList.length < CHOICES_COUNT) {
            questionTextElement.textContent = "エラー: データが不足しています。挨拶を3つ以上用意してください。";
            disableAllButtons();
            return;
        }
        
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
        restartButton.addEventListener('click', startNewQuiz);

        // タイマーエリアを初期化
        timerBoxElement.textContent = `残り ${TIME_LIMIT} 秒`;

        startNewQuiz(); 
        
    } catch (error) {
        console.error("データの読み込み中にエラーが発生しました:", error);
        questionTextElement.textContent = "エラー: データの読み込みに失敗しました。ファイルパスを確認してください。";
        disableAllButtons();
    }
}

/**
 * 新しいクイズセッションを開始する
 */
function startNewQuiz() {
    // 既存のタイマーをクリア
    if (timerId) clearInterval(timerId); 

    currentQuestionIndex = 0;
    score = 0;
    wrongAnswerCount = 0; 

    // 全ての挨拶リストから問題を作成（シャッフル）
    quizQuestions = generateQuizQuestions(); 

    resultMessageElement.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    choicesContainer.style.display = 'grid'; 
    homeButton.style.display = 'inline-block'; 

    displayQuestion(); 
}

/**
 * クイズの問題リストを生成する (挨拶リスト全体をシャッフル)
 */
function generateQuizQuestions() {
    // 挨拶リストを複製してシャッフル
    const shuffledGreetings = [...greetingsList]; 
    for (let i = shuffledGreetings.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledGreetings[i], shuffledGreetings[j]] = [shuffledGreetings[j], shuffledGreetings[i]];
    }
    
    // 挨拶クイズはデータにwrongsが含まれているため、カスタムロジックは不要
    // データ構造から直接問題を作成する
    const questions = shuffledGreetings.map(item => {
        const choices = [item.correct, ...item.wrongs].slice(0, CHOICES_COUNT);
        
        // 選択肢をシャッフル
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        return {
            situation: item.situation,
            correctAnswer: item.correct,
            choices: choices
        };
    });
    
    return questions;
}

/**
 * タイマーを開始する
 */
function startTimer() {
    let timeLeft = TIME_LIMIT;
    timerBoxElement.textContent = `残り ${timeLeft} 秒`;
    timerBoxElement.style.backgroundColor = '#ff6347'; // 初期色 (赤系)

    timerId = setInterval(() => {
        timeLeft--;
        timerBoxElement.textContent = `残り ${timeLeft} 秒`;
        
        if (timeLeft <= 2) {
            timerBoxElement.style.backgroundColor = '#ff4500'; // 焦る色
        }

        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleTimeUp();
        }
    }, 1000);
}

/**
 * 時間切れ時の処理
 */
function handleTimeUp() {
    // 選択肢を無効化
    disableAllButtons();
    
    // 不正解として扱う
    const currentQuestion = quizQuestions[currentQuestionIndex];
    checkAnswer(null, 'TIME_UP', currentQuestion.correctAnswer);
}


/**
 * 現在の問題を画面に表示する
 */
function displayQuestion() {
    // 既存のタイマーをクリアしてから再スタート
    if (timerId) clearInterval(timerId); 
    
    // 画面をリセット
    choicesContainer.innerHTML = '';
    resultMessageElement.style.display = 'none';
    resultMessageElement.className = 'result-message';
    timerBoxElement.textContent = `残り ${TIME_LIMIT} 秒`;
    timerBoxElement.style.backgroundColor = '#ff6347'; 
    
    // ゲームオーバー判定
    if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
        endQuiz(true); 
        return;
    }

    // 全問終了判定
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz(false); 
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    questionNumberElement.textContent = 
        `第 ${currentQuestionIndex + 1} 問 (残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回)`; 
    questionPromptElement.textContent = "この挨拶を選んでください："; // プロンプトを標準に戻す

    // 状況説明をh2タグ（質問文エリア）に表示
    questionTextElement.textContent = question.situation; 
    
    question.choices.forEach(choice => {
        const button = document.createElement('button');
        
        button.textContent = choice;
        
        button.addEventListener('click', (event) => {
            // クリックしたらタイマーを停止
            if (timerId) clearInterval(timerId); 
            checkAnswer(event.target, choice, question.correctAnswer);
        });
        
        choicesContainer.appendChild(button);
    });

    // タイマー開始
    startTimer();
}

/**
 * ユーザーの回答をチェックし、結果を表示する関数
 * @param {HTMLElement} clickedButton - クリックされたボタン、またはnull (時間切れ時)
 * @param {string} selectedChoice - ユーザーの選択、または'TIME_UP'
 * @param {string} correctAnswer - 正解の挨拶
 */
function checkAnswer(clickedButton, selectedChoice, correctAnswer) {
    
    // 既に結果が表示されている場合は二重処理を避ける
    if (resultMessageElement.style.display === 'block') return;

    // 時間切れの場合はボタンを無効化
    if (selectedChoice === 'TIME_UP') {
        resultMessageElement.textContent = `🚨 時間切れです！`;
    }
    
    const isCorrect = (selectedChoice === correctAnswer);
    
    // 全てのボタンを無効化
    disableAllButtons();
    
    if (isCorrect) {
        // ★★★ 正解時の処理 ★★★
        playSound(SOUND_CORRECT_PATH);
        
        score++;
        resultMessageElement.textContent = "✅ 正解です！次の問題へ進みます。";
        resultMessageElement.classList.remove('incorrect');
        resultMessageElement.classList.add('correct');
        if (clickedButton) clickedButton.classList.add('correct-answer'); 

        resultMessageElement.style.display = 'block';
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); 
        
    } else {
        // ★★★ 不正解時の処理 ★★★
        playSound(SOUND_INCORRECT_PATH);
        
        wrongAnswerCount++; // 間違い回数をカウント
        
        // 3回間違えてゲームオーバーの場合
        if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
            resultMessageElement.textContent = `🚨 残念！${MAX_WRONG_ANSWERS}回間違えました。ゲームオーバーです。`;
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            resultMessageElement.style.display = 'block';
            
            setTimeout(() => {
                endQuiz(true);
            }, 2500);
            return;
        }

        // まだチャンスがある場合
        const msg = selectedChoice === 'TIME_UP' ? `❌ 時間切れです。` : `❌ 不正解です。`;
        resultMessageElement.textContent = `${msg} 残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回。`;
        resultMessageElement.classList.remove('correct');
        resultMessageElement.classList.add('incorrect');
        
        // 不正解の選択肢は赤く表示
        if (clickedButton) {
            clickedButton.style.backgroundColor = '#f8d7da'; 
            clickedButton.style.color = '#721c24';
        }

        // 正解を表示
        Array.from(choicesContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                 button.style.backgroundColor = '#c3e6cb'; // 正解のハイライト
            }
        });
        
        resultMessageElement.style.display = 'block';
        
        // 間違い後は少し待ってから次の問題へ（再挑戦はなし、時間制限があるため）
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 2500);
    }
}

/**
 * 全ての選択肢ボタンを無効化する
 */
function disableAllButtons() {
    Array.from(choicesContainer.children).forEach(button => {
        button.disabled = true;
    });
}

/**
 * クイズを終了し、結果を表示する
 */
function endQuiz(isGameOver) {
    if (timerId) clearInterval(timerId); // タイマーを確実に止める

    choicesContainer.innerHTML = ''; 
    choicesContainer.style.display = 'none'; 

    if (isGameOver) {
        questionNumberElement.textContent = "ゲームオーバー！";
        questionTextElement.textContent = "残念！最初からやり直しましょう。";
        finalScoreElement.style.color = '#dc3545'; 
    } else {
        questionNumberElement.textContent = "クイズクリア！";
        questionTextElement.textContent = "全問正解しました！おめでとうございます！";
        finalScoreElement.style.color = '#28a745'; 
    }

    finalScoreElement.textContent = `正解数: ${score} 問`;
    finalScoreElement.style.display = 'block';

    homeButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
}


document.addEventListener('DOMContentLoaded', initializeQuiz);