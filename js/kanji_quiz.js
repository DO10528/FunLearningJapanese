// データのパス
const DATA_PATH = 'data/kanji.json';
const IMAGE_PATHS = [
    'assets/images/keiyoshi_quiz_1.png', 
    'assets/images/keiyoshi_quiz_2.jpg',
    'assets/images/keiyoshi_quiz_3.gif' 
];

// 音声ファイルのパス設定 (ご自身のファイル名に合わせて修正してください)
const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 

// グローバル変数
let kanjiList = [];         
let quizQuestions = [];     
let currentQuestionIndex = 0; 
let score = 0;              
let currentMode = 'kun'; // ★追加: 現在の出題モードを保持
const QUIZ_TOTAL_QUESTIONS = 5; 
const CHOICES_COUNT = 3;    

// DOM要素の取得
const quizImageElement = document.getElementById('quiz-image');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const questionPromptElement = document.getElementById('question-prompt'); // ★追加
const choicesContainer = document.getElementById('choices-container');
const resultMessageElement = document.getElementById('result-message');
const homeButton = document.getElementById('home-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');
const modeSelectionRadios = document.querySelectorAll('input[name="readingMode"]'); // ★追加

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

        // ★モード選択のイベントリスナーを設定
        modeSelectionRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                currentMode = event.target.value;
                // モードが変更されたら、クイズをリセットして開始
                startNewQuiz(); 
            });
        });

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
 * 漢字アイテムから出題モードに基づいた正解の読み方を取得する
 * @param {object} item - 漢字データオブジェクト
 * @param {string} mode - 'kun' または 'on'
 * @returns {string | null} 正解の読み方、または null
 */
function getCorrectReading(item, mode) {
    if (mode === 'kun' && item.kun) {
        // 訓読みが存在すれば最初の一つを返す
        return item.kun.split('・')[0].trim();
    }
    if (mode === 'on' && item.on) {
        // 音読みが存在すれば最初の一つを返す
        return item.on.split('・')[0].trim();
    }
    // どちらの読み方も存在しない、またはモードが不正な場合は null
    return null; 
}


/**
 * クイズの問題リストを生成する
 */
function generateQuizQuestions() {
    const questions = [];
    const usedKanji = new Set(); 
    
    // 選択されたモードに基づいて出題プロンプトを更新
    const promptText = currentMode === 'on' ? "この漢字の**音読み**を選びなさい：" : "この漢字の**訓読み**を選びなさい：";
    questionPromptElement.innerHTML = promptText;

    while (questions.length < QUIZ_TOTAL_QUESTIONS) {
        let correctItem;
        let correctReading = null;

        // 正解かつ、選択されたモードの読み方が存在する漢字を見つける
        do {
            const randomIndex = Math.floor(Math.random() * kanjiList.length);
            correctItem = kanjiList[randomIndex];
            correctReading = getCorrectReading(correctItem, currentMode);
        } while (usedKanji.has(correctItem.kanji) || correctReading === null);

        usedKanji.add(correctItem.kanji); 
        
        // ダミーの選択肢を選ぶ
        let wrongReadings = [];
        while (wrongReadings.length < CHOICES_COUNT - 1) {
            const randomIndex = Math.floor(Math.random() * kanjiList.length);
            const dummyItem = kanjiList[randomIndex];
            
            // ダミーの読み方を取得 (ここでは簡単のため、出題モードに関係なく最初の読み方をダミーに使う)
            const dummyReading = getCorrectReading(dummyItem, currentMode) || getCorrectReading(dummyItem, currentMode === 'kun' ? 'on' : 'kun');

            if (dummyReading !== null && dummyReading !== correctReading && 
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
        button.style.backgroundColor = ''; 
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
    questionTextElement.textContent = question.kanji; 
    
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
        
        resultMessageElement.textContent = `❌ 不正解です。もう一度挑戦してください。`;
        resultMessageElement.classList.remove('correct');
        resultMessageElement.classList.add('incorrect');
        
        // 不正解のボタンを無効化
        clickedButton.disabled = true; 
        clickedButton.style.backgroundColor = '#f8d7da'; 
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