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

// ★変更点★ タイマーと間違い回数の設定
const MAX_WRONG_ANSWERS = 3;    
let wrongAnswerCount = 0;       
const TIME_LIMIT = 10;           // ★10秒に変更
let timerId = null;             
const CHOICES_COUNT = 3;        

// DOM要素の取得
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text'); 
const questionPromptElement = document.getElementById('question-prompt'); 
const timerBoxElement = document.getElementById('timer-box'); 
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
    audio.play().catch(e => console.error("おとを ならせませんでした:", e));
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
            questionTextElement.textContent = "エラー: データがたりません。あいさつを3ついじょうよういしてください。";
            disableAllButtons();
            return;
        }
        
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
        restartButton.addEventListener('click', startNewQuiz);

        // タイマーエリアを初期化
        timerBoxElement.textContent = `のこり ${TIME_LIMIT} びょう`;

        startNewQuiz(); 
        
    } catch (error) {
        console.error("データのよみこみに しっぱいしました:", error);
        questionTextElement.textContent = "エラー: データのよみこみにしっぱいしました。ファイルパスをかくにんしてください。";
        disableAllButtons();
    }
}

/**
 * 新しいクイズセッションを開始する
 */
function startNewQuiz() {
    if (timerId) clearInterval(timerId); 

    currentQuestionIndex = 0;
    score = 0;
    wrongAnswerCount = 0; 

    quizQuestions = generateQuizQuestions(); 

    resultMessageElement.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    choicesContainer.style.display = 'grid'; 
    homeButton.style.display = 'inline-block'; 

    displayQuestion(); 
}

/**
 * クイズの問題リストを生成する
 */
function generateQuizQuestions() {
    const shuffledGreetings = [...greetingsList]; 
    for (let i = shuffledGreetings.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledGreetings[i], shuffledGreetings[j]] = [shuffledGreetings[j], shuffledGreetings[i]];
    }
    
    const questions = shuffledGreetings.map(item => {
        const choices = [item.correct, ...item.wrongs].slice(0, CHOICES_COUNT);
        
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
    timerBoxElement.textContent = `のこり ${timeLeft} びょう`;
    timerBoxElement.style.backgroundColor = '#ff6347'; 

    timerId = setInterval(() => {
        timeLeft--;
        timerBoxElement.textContent = `のこり ${timeLeft} びょう`;
        
        if (timeLeft <= 3) { // 3秒以下で色を強調
            timerBoxElement.style.backgroundColor = '#ff4500'; 
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
    disableAllButtons();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    checkAnswer(null, 'TIME_UP', currentQuestion.correctAnswer);
}


/**
 * 現在の問題を画面に表示する
 */
function displayQuestion() {
    if (timerId) clearInterval(timerId); 
    
    choicesContainer.innerHTML = '';
    resultMessageElement.style.display = 'none';
    resultMessageElement.className = 'result-message';
    timerBoxElement.textContent = `のこり ${TIME_LIMIT} びょう`;
    timerBoxElement.style.backgroundColor = '#ff6347'; 
    
    if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
        endQuiz(true); 
        return;
    }

    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz(false); 
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    questionNumberElement.textContent = 
        `だい ${currentQuestionIndex + 1} もん (のこり まちがい ${MAX_WRONG_ANSWERS - wrongAnswerCount} かい)`; 
    
    questionPromptElement.textContent = "ただしい あいさつを えらんでね："; 

    // 状況説明をh2タグ（質問文エリア）に表示
    questionTextElement.textContent = question.situation; 
    
    question.choices.forEach(choice => {
        const button = document.createElement('button');
        
        button.textContent = choice;
        
        button.addEventListener('click', (event) => {
            if (timerId) clearInterval(timerId); 
            checkAnswer(event.target, choice, question.correctAnswer);
        });
        
        choicesContainer.appendChild(button);
    });

    startTimer();
}

/**
 * ユーザーの回答をチェックし、結果を表示する関数
 */
function checkAnswer(clickedButton, selectedChoice, correctAnswer) {
    
    if (resultMessageElement.style.display === 'block') return;

    if (selectedChoice === 'TIME_UP') {
        resultMessageElement.textContent = `🚨 じかんぎれです！`;
    }
    
    const isCorrect = (selectedChoice === correctAnswer);
    
    disableAllButtons();
    
    if (isCorrect) {
        playSound(SOUND_CORRECT_PATH);
        
        score++;
        resultMessageElement.textContent = "✅ せいかい！つぎの もんだいへ すすみます。";
        resultMessageElement.classList.remove('incorrect');
        resultMessageElement.classList.add('correct');
        if (clickedButton) clickedButton.classList.add('correct-answer'); 

        resultMessageElement.style.display = 'block';
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); 
        
    } else {
        playSound(SOUND_INCORRECT_PATH);
        
        wrongAnswerCount++; 
        
        if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
            resultMessageElement.textContent = `🚨 ざんねん！${MAX_WRONG_ANSWERS}かい まちがえました。ゲームオーバーです。`;
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            resultMessageElement.style.display = 'block';
            
            setTimeout(() => {
                endQuiz(true);
            }, 2500);
            return;
        }

        const msg = selectedChoice === 'TIME_UP' ? `❌ じかんぎれです。` : `❌ ふせいかいです。`;
        resultMessageElement.textContent = `${msg} のこり まちがい ${MAX_WRONG_ANSWERS - wrongAnswerCount} かい。`;
        resultMessageElement.classList.remove('correct');
        resultMessageElement.classList.add('incorrect');
        
        if (clickedButton) {
            clickedButton.style.backgroundColor = '#f8d7da'; 
            clickedButton.style.color = '#721c24';
        }

        Array.from(choicesContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                 button.style.backgroundColor = '#c3e6cb'; 
            }
        });
        
        resultMessageElement.style.display = 'block';
        
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
    if (timerId) clearInterval(timerId); 

    choicesContainer.innerHTML = ''; 
    choicesContainer.style.display = 'none'; 

    if (isGameOver) {
        questionNumberElement.textContent = "ゲームオーバー！";
        questionTextElement.textContent = "ざんねん！はじめから やりなおしましょう。";
        finalScoreElement.style.color = '#dc3545'; 
    } else {
        questionNumberElement.textContent = "クイズ クリア！";
        questionTextElement.textContent = "ぜんもん せいかいしました！おめでとう！";
        finalScoreElement.style.color = '#28a745'; 
    }

    finalScoreElement.textContent = `せいかいした もんだい: ${score} もん`;
    finalScoreElement.style.display = 'block';

    homeButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
}


document.addEventListener('DOMContentLoaded', initializeQuiz);