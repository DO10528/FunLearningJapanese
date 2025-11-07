// データのパス
const DATA_PATH = 'data/kanji.json';
const IMAGE_PATHS = [
    'assets/images/keiyoshi_quiz_1.png', 
    'assets/images/keiyoshi_quiz_2.jpg',
    'assets.images/keiyoshi_quiz_3.gif' 
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

// 制限とカウンター
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
 * 配列をシャッフルする関数
 */
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}


/**
 * データを読み込み、クイズの準備を開始する関数
 * ★★★ 修正 ★★★
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
        
        // ★修正 1★
        // リスタートボタンは startNewQuiz を呼ぶ
        restartButton.addEventListener('click', startNewQuiz);

        // ★修正 2★
        // モード切り替えラジオボタンは handleModeSwitch を呼ぶ
        modeSelectionRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                handleModeSwitch(event.target.value); 
            });
        });

        // ★修正 3★
        // 最初に呼ぶのは startNewQuiz
        startNewQuiz(); 
        
    } catch (error) {
        console.error("データの読み込み中にエラーが発生しました:", error);
        questionTextElement.textContent = "エラー: データの読み込みに失敗しました。ファイルパスを確認してください。";
        disableAllButtons();
    }
}

/**
 * ★修正 4★
 * 新しいクイズセッションを開始する（リスタートボタン・初回読み込み用）
 */
function startNewQuiz() {
    // 状態を完全にリセット
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswerCount = 0; 
    
    // 現在のモードをUIから取得
    currentMode = document.querySelector('input[name="readingMode"]:checked').value || 'kun';
    
    // 問題リストを生成
    quizQuestions = generateQuizQuestions();
    
    // UIをリセット
    resultMessageElement.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    choicesContainer.style.display = 'grid'; 
    homeButton.style.display = 'inline-block'; 

    // 1問目を表示
    displayQuestion();
}

/**
 * ★修正 5★
 * 読みモードを切り替える（クイズの進行状況は維持）
 * @param {string} newMode - 新しい読みモード ('on' or 'kun')
 */
function handleModeSwitch(newMode) {
    
    // 0. ゲームオーバー中やクリア後は何もしない
    if (currentQuestionIndex >= quizQuestions.length || wrongAnswerCount >= MAX_WRONG_ANSWERS) {
        // モードが視覚的に切り替わらないように、UIを元に戻す
        const oldModeRadio = document.getElementById(currentMode === 'kun' ? 'mode_kun' : 'mode_on');
        if(oldModeRadio) oldModeRadio.checked = true;
        return;
    }

    // 1. 現在表示中の漢字を記憶
    const currentKanji = quizQuestions[currentQuestionIndex].kanji;
    
    // 2. モードを更新
    currentMode = newMode;
    
    // 3. 新しいモードで全問題セットを再生成
    quizQuestions = generateQuizQuestions();

    // 4. 記憶した漢字が新しいセットのどこにあるか探す
    const targetIndex = quizQuestions.findIndex(q => q.kanji === currentKanji);
    
    if (targetIndex !== -1) {
        // 5a. 見つかった場合：その問題番号にジャンプ（点数や間違い回数は維持）
        currentQuestionIndex = targetIndex;
    } else {
        // 5b. 見つからなかった場合（例：訓読み専用漢字→音読みモード）：
        //     現在の問題番号（例：5問目）をそのまま使う。
        //     もしリストの長さを超えたら、0に戻す。
        if (currentQuestionIndex >= quizQuestions.length) {
            currentQuestionIndex = 0; 
        }
    }
    
    // 6. 画面を再表示（点数や間違い回数は引き継がれる）
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
 * 単一の問題オブジェクトを生成するヘルパー関数
 */
function generateSingleQuestion(kanjiItem, mode, allReadings) {
    const correctReading = getCorrectReading(kanjiItem, mode);
    if (!correctReading) return null;

    // 正解と重複しない読みのリスト
    let wrongReadingPool = allReadings.filter(r => r !== correctReading);
    wrongReadingPool = Array.from(new Set(wrongReadingPool));
    wrongReadingPool = shuffleArray(wrongReadingPool);

    let wrongReadings = [];
    
    for (let j = 0; j < CHOICES_COUNT - 1; j++) {
        if (wrongReadingPool.length > 0) {
            wrongReadings.push(wrongReadingPool.pop());
        } else {
            break;
        }
    }

    const choices = [correctReading, ...wrongReadings];
    const shuffledChoices = shuffleArray(choices);

    return {
        kanji: kanjiItem.kanji,
        correctAnswer: correctReading,
        choices: shuffledChoices,
        image: getRandomImage()
    };
}


/**
 * クイズの問題リストを生成する
 */
function generateQuizQuestions() {
    const questions = [];
    
    // 1. 選択されたモードの読み方が存在する漢字のみをフィルタリング
    let availableKanji = kanjiList.filter(item => getCorrectReading(item, currentMode) !== null);

    // 2. availableKanjiをシャッフル
    availableKanji = shuffleArray(availableKanji); 
    
    // 3. すべての漢字の「正解の読み方」を収集 (不正解選択肢のプール用)
    const allReadings = availableKanji.map(item => getCorrectReading(item, currentMode)).filter(r => r !== null);


    // 選択されたモードに基づいて出題プロンプトを更新
    const promptText = currentMode === 'on' ? "この漢字の**音読み**を選びなさい：" : "この漢字の**訓読み**を選びなさい：";
    questionPromptElement.innerHTML = promptText;

    // 4. 問題オブジェクトの生成
    for (const correctItem of availableKanji) {
        const question = generateSingleQuestion(correctItem, currentMode, allReadings);
        if (question) {
             questions.push(question);
        }
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
        endQuiz(true); 
        return;
    }

    // 全問終了判定
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz(false); 
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    quizImageElement.src = question.image;
    quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;

    // 問題番号と間違い回数を表示
    questionNumberElement.textContent = 
        `第 ${currentQuestionIndex + 1} 問 (残り間違い ${MAX_WRONG_ANSWERS - wrongAnswerCount} 回)`; 
    questionTextElement.textContent = question.kanji; // ★漢字はここで表示される

    // 選択肢ボタンの生成
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

        disableAllButtons();
        resultMessageElement.style.display = 'block';
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); 
        
    } else {
        // ★★★ 不正解時の処理 ★★★
        playSound(SOUND_INCORRECT_PATH);
        
        wrongAnswerCount++; 
        
        if (wrongAnswerCount >= MAX_WRONG_ANSWERS) {
            resultMessageElement.textContent = `🚨 残念！${MAX_WRONG_ANSWERS}回間違えました。ゲームオーバーです。`;
            resultMessageElement.classList.remove('correct');
            resultMessageElement.classList.add('incorrect');
            resultMessageElement.style.display = 'block';
            disableAllButtons(); 
            
            setTimeout(() => {
                endQuiz(true);
            }, 2500);
            return;
        }

        // まだチャンスがある場合
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
        // ★修正★ 全問正解とは限らないため、メッセージを変更
        questionTextElement.textContent = "クイズ終了です！お疲れさまでした！";
        finalScoreElement.style.color = '#28a745';
    }

    finalScoreElement.textContent = `正解数: ${score} 問`;
    finalScoreElement.style.display = 'block';

    homeButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
}


document.addEventListener('DOMContentLoaded', initializeQuiz);