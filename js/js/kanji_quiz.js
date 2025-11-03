// データのパス
const DATA_PATH = 'data/kanji.json';
const IMAGE_PATHS = [
    'assets/images/keiyoshi_quiz_1.png', // 画像は流用します。必要に応じて漢字用の画像を用意してください。
    'assets/images/keiyoshi_quiz_2.jpg',
    'assets/images/keiyoshi_quiz_3.gif' 
];

// ★★★ 音声ファイルのパス設定 (正しく鳴るファイル名に修正してください) ★★★
const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 
// ★★★★★★★★★★★★★★★★★★★★★

// グローバル変数
let kanjiList = [];         // 全漢字リスト
let quizQuestions = [];     // 今回のクイズで出題される問題のリスト
let currentQuestionIndex = 0; // 現在の問題番号 (0-indexed)
let score = 0;              // 正解数
const QUIZ_TOTAL_QUESTIONS = 5; // 総出題数
const CHOICES_COUNT = 3;    // 選択肢の数

// DOM要素の取得
const quizImageElement = document.getElementById('quiz-image');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
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
        kanjiList = data.kanji_list;
        
        if (kanjiList.length < CHOICES_COUNT) {
            questionTextElement.textContent = "エラー: データが不足しています。漢字を3つ以上用意してください。";
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
        questionTextElement.textContent = "エラー: データの読み込みに失敗しました。ファイルパスを確認してください。";
        disableAllButtons();
    }
}

/**
 * 新しいクイズセッションを開始する
 */
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

/**
 * クイズの問題リストを生成する (問題は訓読みを問う)
 */
function generateQuizQuestions() {
    const questions = [];
    const usedKanji = new Set(); 
    
    while (questions.length < QUIZ_TOTAL_QUESTIONS && kanjiList.length >= CHOICES_COUNT) {
        let correctItem;
        do {
            correctItem = kanjiList[Math.floor(Math.random() * kanjiList.length)];
        } while (usedKanji.has(correctItem.kanji)); 

        usedKanji.add(correctItem.kanji); 
        
        // 訓読みか音読みのどちらかを出題する (今回は訓読みをメインに)
        // 読み方が複数ある場合は最初の一つを正解とする
        const correctReading = correctItem.kun ? correctItem.kun.split('・')[0] : correctItem.on.split('・')[0];
        
        // ダミーの選択肢を選ぶ (読み方が重複しないように)
        let wrongReadings = [];
        while (wrongReadings.length < CHOICES_COUNT - 1) {
            const randomIndex = Math.floor(Math.random() * kanjiList.length);
            const dummyItem = kanjiList[randomIndex];
            
            // ダミーの読み方を取得 (訓読み優先)
            const dummyReading = dummyItem.kun ? dummyItem.kun.split('・')[0] : dummyItem.on.split('・')[0];
            
            if (dummyReading !== correctReading && 
                !wrongReadings.includes(dummyReading)) {
                wrongReadings.push(dummyReading);
            }
        }
        
        const choices = [correctReading, ...wrongReadings];
        
        // 選択肢をシャッフル
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        // 問題オブジェクトとして追加
        questions.push({
            kanji: correctItem.kanji,
            correctAnswer: correctReading,
            choices: choices,
            image: getRandomImage()
        });
    }
    return questions;
}

/**
 * ランダムな画像パスを取得する
 */
function getRandomImage() {
    if (IMAGE_PATHS.length === 0) return '';
    return IMAGE_PATHS[Math.floor(Math.random() * IMAGE_PATHS.length)];
}


/**
 * 現在の問題を画面に表示する
 */
function displayQuestion() {
    // 画面をリセット
    choicesContainer.innerHTML = '';
    resultMessageElement.style.display = 'none';
    resultMessageElement.className = 'result-message';
    
    // 全てのボタンを有効化（再挑戦のため）
    Array.from(choicesContainer.children).forEach(button => {
        button.disabled = false;
        button.classList.remove('correct-answer');
        button.style.backgroundColor = ''; // CSSで設定されたデフォルト色に戻す
        button.style.borderColor = '';
    });
    
    if (currentQuestionIndex >= QUIZ_TOTAL_QUESTIONS) {
        endQuiz();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    quizImageElement.src = question.image;
    quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;

    questionNumberElement.textContent = `第 ${currentQuestionIndex + 1} 問 (全 ${QUIZ_TOTAL_QUESTIONS} 問)`;
    questionTextElement.textContent = question.kanji; // 漢字を出題
    
    question.choices.forEach(choice => {
        const button = document.createElement('button');
        
        button.textContent = choice;
        
        button.addEventListener('click', () => checkAnswer(button, choice, question.correctAnswer));
        
        choicesContainer.appendChild(button);
    });
}

/**
 * ユーザーの回答をチェックし、結果を表示する関数
 */
function checkAnswer(clickedButton, selectedChoice, correctAnswer) {
    const isCorrect = (selectedChoice === correctAnswer);
    
    if (isCorrect) {
        // ★★★ 正解時の音源再生 ★★★
        playSound(SOUND_CORRECT_PATH);
        
        score++;
        resultMessageElement.textContent = "✅ 正解です！次の問題へ進みます。";
        resultMessageElement.classList.remove('incorrect');
        resultMessageElement.classList.add('correct');
        clickedButton.classList.add('correct-answer'); 

        // 全てのボタンを無効化（次の問題へ進むため）
        disableAllButtons();
        resultMessageElement.style.display = 'block';
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); 
        
    } else {
        // ★★★ 不正解時の音源再生 ★★★
        playSound(SOUND_INCORRECT_PATH);
        
        // ★修正: 不正解時は選択肢を無効化するが、他のボタンは生かしておく★
        resultMessageElement.textContent = `❌ 不正解です。もう一度挑戦してください。`;
        resultMessageElement.classList.remove('correct');
        resultMessageElement.classList.add('incorrect');
        
        // 不正解のボタンを無効化
        clickedButton.disabled = true; 
        clickedButton.style.backgroundColor = '#f8d7da'; // 不正解の色に
        clickedButton.style.color = '#721c24';
        
        resultMessageElement.style.display = 'block';
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
function endQuiz() {
    questionNumberElement.textContent = "クイズ終了！";
    questionTextElement.textContent = "全問終了しました。お疲れ様でした！";
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


document.addEventListener('DOMContentLoaded', initializeQuiz);