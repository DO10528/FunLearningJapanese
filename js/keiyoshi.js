// データのパス
const DATA_PATH = 'data/keiyoshi.json';
const IMAGE_PATHS = [
    'assets/images/keiyoshi_quiz_1.png', // 準備した画像ファイルのパスに変更してください
    'assets/images/keiyoshi_quiz_2.jpg',
    'assets/images/keiyoshi_quiz_3.gif'  // 必要に応じて追加・変更
];

// ★★★ 音声ファイルのパス設定 (ご自身のファイル名に合わせて修正してください) ★★★
const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 
// ★★★★★★★★★★★★★★★★★★★★★

// グローバル変数
let adjectives = [];        // 全形容詞リスト
let quizQuestions = [];     // 今回のクイズで出題される問題のリスト
let currentQuestionIndex = 0; // 現在の問題番号 (0-indexed)
let score = 0;              // 正解数
const QUIZ_TOTAL_QUESTIONS = 5; // 総出題数
const CHOICES_COUNT = 3;    // 選択肢の数

// DOM要素の取得
const quizImageElement = document.getElementById('quiz-image');
const questionNumberElement = document.getElementById('question-number');
const questionMeaningElement = document.getElementById('question-meaning');
const choicesContainer = document.getElementById('choices-container');
const resultMessageElement = document.getElementById('result-message');
const homeButton = document.getElementById('home-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');


/**
 * 指定されたパスの音源を再生する関数
 * @param {string} path - 音源ファイルへのパス
 */
function playSound(path) {
    // Audioオブジェクトを作成し、再生する
    const audio = new Audio(path);
    audio.play().catch(e => console.error("音声再生エラー:", e));
}


/**
 * ページロード時にデータを読み込み、クイズの準備を開始する
 */
async function initializeQuiz() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        adjectives = data.adjectives;
        
        if (adjectives.length < CHOICES_COUNT) {
            questionMeaningElement.textContent = "エラー: データが不足しています。形容詞を3つ以上用意してください。";
            disableAllButtons();
            return;
        }
        
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // ホームページのパスに適宜変更
        });
        restartButton.addEventListener('click', startNewQuiz);

        startNewQuiz(); // 初回クイズ開始
        
    } catch (error) {
        console.error("データの読み込み中にエラーが発生しました:", error);
        questionMeaningElement.textContent = "エラー: データの読み込みに失敗しました。ファイルパスを確認してください。";
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

    // 画面要素のリセット
    resultMessageElement.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    choicesContainer.style.display = 'grid'; // 選択肢を再表示
    homeButton.style.display = 'inline-block'; // ホームボタンを表示

    displayQuestion(); // 最初の問題を表示
}

/**
 * クイズの問題リストを生成する
 * @returns {Array<object>} 生成された問題の配列
 */
function generateQuizQuestions() {
    const questions = [];
    const usedAdjectives = new Set(); // 重複出題を避けるためのSet
    
    // 総出題数分の問題を作成
    while (questions.length < QUIZ_TOTAL_QUESTIONS && adjectives.length >= CHOICES_COUNT) {
        // 1. 正解の形容詞を選ぶ (重複しないように)
        let correctAdjective;
        do {
            correctAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        } while (usedAdjectives.has(correctAdjective.meaning)); // 意味で重複判定

        usedAdjectives.add(correctAdjective.meaning); // 使用済みとして追加
        
        // 2. ダミーの選択肢を選ぶ (正解や既にあるダミーと重複しないように)
        let wrongAdjectives = [];
        while (wrongAdjectives.length < CHOICES_COUNT - 1) {
            const randomIndex = Math.floor(Math.random() * adjectives.length);
            const dummyAdjective = adjectives[randomIndex];
            
            // 正解や既にあるダミーと重複しないか確認
            if (dummyAdjective.meaning !== correctAdjective.meaning && 
                !wrongAdjectives.some(adj => adj.meaning === dummyAdjective.meaning)) {
                wrongAdjectives.push(dummyAdjective);
            }
        }
        
        // 3. 選択肢リストを作成
        const choices = [correctAdjective, ...wrongAdjectives];
        
        // 4. 選択肢をシャッフル
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        // 5. 問題オブジェクトとして追加
        questions.push({
            meaning: correctAdjective.meaning,
            correctKanji: correctAdjective.kanji,
            choices: choices,
            image: getRandomImage() // ランダムな画像パスを割り当てる
        });
    }
    return questions;
}

/**
 * ランダムな画像パスを取得する
 * @returns {string} 画像ファイルのパス
 */
function getRandomImage() {
    if (IMAGE_PATHS.length === 0) return '';
    return IMAGE_PATHS[Math.floor(Math.random() * IMAGE_PATHS.length)];
}


/**
 * 現在の問題を画面に表示する
 */
function displayQuestion() {
    if (currentQuestionIndex >= QUIZ_TOTAL_QUESTIONS) {
        endQuiz();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    
    // 画像表示
    quizImageElement.src = question.image;
    quizImageElement.alt = `クイズ画像 ${currentQuestionIndex + 1}`;

    // 問題番号と意味を表示
    questionNumberElement.textContent = `第 ${currentQuestionIndex + 1} 問 (全 ${QUIZ_TOTAL_QUESTIONS} 問)`;
    questionMeaningElement.textContent = question.meaning;
    
    // 選択肢ボタンを生成
    choicesContainer.innerHTML = ''; // 既存の選択肢をクリア
    question.choices.forEach(adjective => {
        const button = document.createElement('button');
        
        // 漢字 + ひらがな + 形容詞タイプを表示
        const suffix = adjective.type === 'na' ? ' (な)' : '';
        button.textContent = `${adjective.kanji}（${adjective.hiragana}）${suffix}`;
        
        // 選択肢ボタンにイベントリスナーを設定
        button.addEventListener('click', () => checkAnswer(button, adjective.kanji));
        
        choicesContainer.appendChild(button);
    });
    
    // 結果メッセージをリセット
    resultMessageElement.style.display = 'none';
    resultMessageElement.className = 'result-message'; // クラス名をリセット
}

/**
 * ユーザーの回答をチェックし、結果を表示する関数
 * @param {HTMLElement} clickedButton - クリックされたボタン要素
 * @param {string} selectedKanji - ユーザーが選んだ形容詞の漢字
 */
function checkAnswer(clickedButton, selectedKanji) {
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = (selectedKanji === question.correctKanji);
    
    if (isCorrect) {
        // ★★★ 正解時の音源再生 ★★★
        playSound(SOUND_CORRECT_PATH);
        // ★★★★★★★★★★★★★★★★★
        
        score++;
        resultMessageElement.textContent = "✅ 正解です！次の問題へ進みます。";
        resultMessageElement.classList.remove('incorrect');
        resultMessageElement.classList.add('correct');
        clickedButton.classList.add('correct-answer'); // 正解ボタンにスタイル適用

        // 正解なので、全てのボタンを無効化し、少し待ってから次の問題へ
        disableAllButtons();
        resultMessageElement.style.display = 'block';
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); // 1.5秒後に次の問題へ
        
    } else {
        // ★★★ 不正解時の音源再生 ★★★
        playSound(SOUND_INCORRECT_PATH);
        // ★★★★★★★★★★★★★★★★★
        
        resultMessageElement.textContent = "❌ 不正解です。もう一度挑戦してください。";
        resultMessageElement.classList.remove('correct');
        resultMessageElement.classList.add('incorrect');
        clickedButton.disabled = true; // 不正解のボタンは無効化する
        clickedButton.style.backgroundColor = '#ff6b6b'; // 不正解の色に
        clickedButton.style.borderColor = '#ff6b6b';
        
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
    questionMeaningElement.textContent = "全問終了しました。お疲れ様でした！";
    choicesContainer.innerHTML = ''; // 選択肢をクリア
    choicesContainer.style.display = 'none'; // 選択肢コンテナを非表示

    quizImageElement.src = ''; // 画像をクリア
    quizImageElement.alt = '';

    resultMessageElement.style.display = 'none'; // 結果メッセージを非表示

    finalScoreElement.textContent = `${QUIZ_TOTAL_QUESTIONS} 問中 ${score} 問正解でした！`;
    finalScoreElement.style.display = 'block';

    homeButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
}


// ページロード時にクイズを初期化
document.addEventListener('DOMContentLoaded', initializeQuiz);