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
let currentMode = 'kun'; 

// ★変更点★ 制限とカウンターの追加
const MAX_WRONG_ANSWERS = 3;    // 間違いの許容回数
let wrongAnswerCount = 0;       // 現在の間違い回数
const CHOICES_COUNT = 3;        // 選択肢の数 (変更なし)

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

        modeSelectionRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                currentMode = event.target.value;
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
    wrongAnswerCount = 0; // ★リセット
    // 漢字リストの数が総出題数として扱われます
    quizQuestions = generateQuizQuestions(kanjiList.length); 

    resultMessageElement.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    choicesContainer.style.display = 'grid'; 
    homeButton.style.display = 'inline-block'; 

    displayQuestion(); 
}

/**
 * 漢字アイテムから出題モードに基づいた正解の読み方を取得する
 */
function getCorrectReading(item, mode) {
    if (mode === 'kun' && item.kun) {
        return item.kun.split('・')[0].trim();
    }
    if (mode === 'on' && item.on) {
        return item.on.split('・')[0].trim();
    }
    return null; 
}


/**
 * クイズの問題リストを生成する (全漢字リストからシャッフル)
 */
function generateQuizQuestions(totalQuestions) {
    const shuffledKanji = [...kanjiList]; // リストを複製
    
    // 選択されたモードの読み方が存在する漢字のみをフィルタリング
    const availableKanji = shuffledKanji.filter(item => getCorrectReading(item, currentMode) !== null);

    // シャッフル
    for (let i = availableKanji.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableKanji[i], availableKanji[j]] = [availableKanji[j], availableKanji[i]];
    }
    
    const questions = [];

    // 選択されたモードに基づいて出題プロンプトを更新
    const promptText = currentMode === 'on' ? "この漢字の**音読み**を選びなさい：" : "この漢字の**訓読み**を選びなさい：";
    questionPromptElement.innerHTML = promptText;

    for (let i = 0; i < availableKanji.length; i++) {
        const correctItem = availableKanji[i];
        const correctReading = getCorrectReading(correctItem, currentMode);
        
        // ダミーの選択肢を選ぶ
        let wrongReadings = [];
        const allReadings = kanjiList.map(item => getCorrectReading(item, currentMode)).filter(r => r !== null && r !== correctReading);

        // 重複のないダミー選択肢をランダムに2つ選ぶ
        while (wrongReadings.length < CHOICES_COUNT - 1 && allReadings.length > 0) {
            const randomIndex = Math.floor(Math.random() * allReadings.length);
            const dummyReading = allReadings.splice(randomIndex, 1)[0]; // 選んだものをリストから削除
            
            wrongReadings.push(dummyReading);
        }
        
        const choices = [correctReading, ...wrongReadings];
        
        // 選択肢をシャッフル
        for (let j = choices.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [choices[j], choices[k]] = [choices[k], choices[j]];
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
    
    // ゲームオーバー判定
    if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
        endQuiz(true); // ★ゲームオーバー
        return;
    }

    // 全てのボタンを有効化（再挑戦のため）
    Array.from(choicesContainer.children).forEach(button => {
        button.disabled = false;
        button.classList.remove('correct-answer');
        button.style.backgroundColor = ''; 
        button.style.borderColor = '';
    });
    
    // 全問終了判定
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz(false); // ★全問正解でクリア
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    quizImageElement.src = question.image;
    quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;

    // 問題番号と間違い回数を表示
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

/**
 * ユーザーの回答をチェックし、結果を表示する関数
 */
function checkAnswer(clickedButton, selectedChoice, correctAnswer) {
    const isCorrect = (selectedChoice === correctAnswer);
    
    if (isCorrect) {
        // ★★★ 正解時の処理 ★★★
        playSound(SOUND_CORRECT_PATH);
        
        score++;
        resultMessageElement.textContent = "✅ 正解です！次の問題へ進みます。";
        resultMessageElement.classList.remove('incorrect');
        resultMessageElement.classList.add('correct');
        clickedButton.classList.add('correct-answer'); 

        // 次の問題へ進むため、全てのボタンを無効化
        disableAllButtons();
        resultMessageElement.style.display = 'block';
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); 
        
    } else {
        // ★★★ 不正解時の処理 ★★★
        playSound(SOUND_INCORRECT_PATH);
        
        wrongAnswerCount++; // ★間違い回数をカウント
        
        // 3回間違えてゲームオーバーの場合
        if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
            // エラーメッセージを表示して、ゲームオーバー処理へ移行
            resultMessageElement.textContent = `🚨 残念！${MAX_WRONG_ANSWERS}回間違えました。ゲームオーバーです。`;
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            resultMessageElement.style.display = 'block';
            disableAllButtons(); // ボタンを無効化
            
            setTimeout(() => {
                endQuiz(true);
            }, 2500);
            return;
        }

        // まだチャンスがある場合
        resultMessageElement.textContent = `❌ 不正解です。残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回。`;
        resultMessageElement.classList.remove('correct');
        resultMessageElement.classList.add('incorrect');
        
        // 不正解のボタンを無効化（再挑戦不可）
        clickedButton.disabled = true; 
        clickedButton.style.backgroundColor = '#f8d7da'; 
        clickedButton.style.color = '#721c24';
        
        resultMessageElement.style.display = 'block';
        
        // 問題番号を更新して残り間違い回数を表示
        questionNumberElement.textContent = 
            `第 ${currentQuestionIndex + 1} 問 (残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回)`; 
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
 * @param {boolean} isGameOver - trueなら間違いすぎによるゲームオーバー
 */
function endQuiz(isGameOver) {
    choicesContainer.innerHTML = ''; 
    choicesContainer.style.display = 'none'; 

    quizImageElement.src = ''; 
    quizImageElement.alt = '';

    resultMessageElement.style.display = 'none'; 

    if (isGameOver) {
        questionNumberElement.textContent = "ゲームオーバー！";
        questionTextElement.textContent = "残念！最初からやり直しましょう。";
        finalScoreElement.style.color = '#dc3545'; // 赤系の色
    } else {
        questionNumberElement.textContent = "クイズクリア！";
        questionTextElement.textContent = "全問正解しました！おめでとうございます！";
        finalScoreElement.style.color = '#28a745'; // 緑系の色
    }

    finalScoreElement.textContent = `正解数: ${score} 問`;
    finalScoreElement.style.display = 'block';

    homeButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
}


document.addEventListener('DOMContentLoaded', initializeQuiz);