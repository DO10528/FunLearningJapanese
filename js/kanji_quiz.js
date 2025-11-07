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
                handleModeSwitch(event.target.value); 
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
 * 新しいクイズセッションを開始する（再スタートボタン用）
 */
function startNewQuiz() {
    // 現在チェックされているモードを取得
    const selectedMode = document.querySelector('input[name="readingMode"]:checked').value || 'kun';
    
    // ★ isSwitching = false で呼び出すことで、全リセットが実行される
    handleModeSwitch(selectedMode, false); 
}

/**
 * 読みモードを切り替え、現在の漢字を維持したままクイズを再開する
 * @param {string} newMode - 新しい読みモード ('on' or 'kun')
 * @param {boolean} isSwitching - モード切り替えイベントかどうか (デフォルト: true)
 */
/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */
/* ★ 修正 ★ この関数を丸ごと変更しました ★ */
/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */
function handleModeSwitch(newMode, isSwitching = true) {
    let targetKanji = null;
    
    // モード切り替え時(isSwitching=true)のみ、現在の漢字を記憶
    if (isSwitching && quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length) {
        targetKanji = quizQuestions[currentQuestionIndex].kanji;
    }

    // 1. 状態のリセットとモード更新
    
    // ★修正★
    // リスタート(isSwitching=false)の時だけ、すべての進行状況をリセットする
    if (!isSwitching) {
        currentQuestionIndex = 0;
        score = 0;
        wrongAnswerCount = 0; 
    }
    // モード切り替え(isSwitching=true)の時は、↑ 3行をスキップするので、
    // score, wrongAnswerCount, currentQuestionIndex が維持されます。

    currentMode = newMode;
    
    // 2. 新しいモードで全問題セットを生成
    const newQuizQuestions = generateQuizQuestions();
    quizQuestions = newQuizQuestions;

    // 3. ターゲット漢字が見つかり、新しい質問セットに含まれている場合、
    //    currentQuestionIndex をその漢字のインデックスに更新
    if (targetKanji) {
        const targetIndex = quizQuestions.findIndex(q => q.kanji === targetKanji);
        
        if (targetIndex !== -1) {
            // ★修正★
            // 0 にリセットするのではなく、見つかったインデックスに設定
            currentQuestionIndex = targetIndex; 
        }
        // もし見つからなかった場合 (例: 音読みに切り替えたらその漢字がリストにない)
        // currentQuestionIndex は変更されない (前の問題番号が維持される)
        // ただし、リストの長さを超える可能性があるのでチェック
        if (currentQuestionIndex >= quizQuestions.length) {
            currentQuestionIndex = 0; // 安全策
        }
    }
    
    // 4. UIの表示設定
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