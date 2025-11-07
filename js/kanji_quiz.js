// データのパス
const DATA_PATH = 'data/kanji.json';
const IMAGE_PATHS = [
    'assets/images/keiyoshi_quiz_1.png', 
    'assets/images/keiyoshi_quiz_2.jpg',
    'assets/images/keiyoshi_quiz_3.gif' 
];

// 音声ファイルのパス設定
const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 

// グローバル変数
let kanjiList = [];         
let quizQuestions = [];     
let currentQuestionIndex = 0; 
let score = 0;              
let currentMode = 'kun'; 

// 制限とカウンター
const MAX_WRONG_ANSWERS = 3;    
let wrongAnswerCount = 0;       
const CHOICES_COUNT = 3;        

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
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        kanjiList = data.kanji_list;
        
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
        
    } catch (error) {
        console.error("データの読み込み中にエラー:", error);
        questionTextElement.textContent = "エラー: データの読み込みに失敗しました。";
        disableAllButtons();
    }
}

// ======== クイズ開始 ========

function startNewQuiz() {
    const selectedMode = document.querySelector('input[name="readingMode"]:checked').value || 'kun';
    handleModeSwitch(selectedMode, false); 
}

// ======== 修正版：モード切替 ========

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
        const kanjiItem = kanjiList.find(k => k.kanji === targetKanji);
        if (kanjiItem) {
            const correctReading = getCorrectReading(kanjiItem, currentMode);
            if (correctReading) {
                const allReadings = kanjiList
                    .map(k => getCorrectReading(k, currentMode))
                    .filter(r => r && r !== correctReading);
                const wrongReadings = shuffleArray(allReadings).slice(0, CHOICES_COUNT - 1);
                const question = {
                    kanji: kanjiItem.kanji,
                    correctAnswer: correctReading,
                    choices: shuffleArray([correctReading, ...wrongReadings]),
                    image: getRandomImage()
                };
                quizQuestions[currentQuestionIndex] = question;
            }
        }
    } 
    // リスタートのときは全問題生成済みなのでそのまま表示

    resultMessageElement.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    choicesContainer.style.display = 'grid';
    homeButton.style.display = 'inline-block';

    displayQuestion();
}

// ======== 出題生成 ========

function getCorrectReading(item, mode) {
    if (mode === 'kun' && item.kun) {
        return item.kun.split('・')[0].trim();
    }
    if (mode === 'on' && item.on) {
        return item.on.split('・')[0].trim();
    }
    return null; 
}

function generateSingleQuestion(kanjiItem, mode, allReadings) {
    const correctReading = getCorrectReading(kanjiItem, mode);
    if (!correctReading) return null;

    let wrongReadingPool = allReadings.filter(r => r !== correctReading);
    wrongReadingPool = Array.from(new Set(wrongReadingPool));
    wrongReadingPool = shuffleArray(wrongReadingPool);

    const wrongReadings = wrongReadingPool.slice(0, CHOICES_COUNT - 1);
    const choices = shuffleArray([correctReading, ...wrongReadings]);

    return {
        kanji: kanjiItem.kanji,
        correctAnswer: correctReading,
        choices: choices,
        image: getRandomImage()
    };
}

function generateQuizQuestions() {
    const questions = [];
    let availableKanji = kanjiList.filter(item => getCorrectReading(item, currentMode) !== null);
    availableKanji = shuffleArray(availableKanji); 
    const allReadings = availableKanji.map(item => getCorrectReading(item, currentMode)).filter(r => r !== null);

    const promptText = currentMode === 'on'
        ? "この漢字の**音読み**を選びなさい："
        : "この漢字の**訓読み**を選びなさい：";
    questionPromptElement.innerHTML = promptText;

    for (const correctItem of availableKanji) {
        const question = generateSingleQuestion(correctItem, currentMode, allReadings);
        if (question) questions.push(question);
    }
    return questions;
}

// ======== 表示処理 ========

function getRandomImage() {
    if (IMAGE_PATHS.length === 0) return '';
    return IMAGE_PATHS[Math.floor(Math.random() * IMAGE_PATHS.length)];
}

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
    quizImageElement.src = question.image;
    quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;

    questionNumberElement.textContent = 
        `第 ${currentQuestionIndex + 1} 問 (残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回)`; 
    questionTextElement.textContent = question.kanji;

    question.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.addEventListener('click', () => checkAnswer(button, choice, question.correctAnswer));
        choicesContainer.appendChild(button);
    });
}

// ======== 回答チェック ========

function checkAnswer(clickedButton, selectedChoice, correctAnswer) {
    const isCorrect = (selectedChoice === correctAnswer);
    
    if (isCorrect) {
        playSound(SOUND_CORRECT_PATH);
        score++;
        resultMessageElement.textContent = "✅ 正解です！次の問題へ進みます。";
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
        clickedButton.style.backgroundColor = '#f8d7da'; 
        clickedButton.style.color = '#721c24';
        
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
