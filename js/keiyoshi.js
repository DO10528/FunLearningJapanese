// データのパス
const DATA_PATH = 'data/keiyoshi.json';
// グローバル変数
let adjectives = []; // 全形容詞リスト
let currentQuestionIndex = 0; // 現在の問題番号
let currentQuestion; // 現在の問題オブジェクト
const QUIZ_COUNT = 5; // 出題数

// DOM要素の取得
const questionNumberElement = document.getElementById('question-number');
const questionMeaningElement = document.getElementById('question-meaning');
const choicesContainer = document.getElementById('choices-container');
const resultMessageElement = document.getElementById('result-message');
const nextButton = document.getElementById('next-button');

/**
 * データを読み込み、クイズを開始する関数
 */
async function loadDataAndStartQuiz() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        adjectives = data.adjectives;
        
        if (adjectives.length < 4) {
            // 選択肢を生成するには最低4つのデータが必要
            questionMeaningElement.textContent = "データが不足しています。形容詞を4つ以上用意してください。";
            return;
        }
        
        // 最初の問題を設定
        setupQuestion();
        
    } catch (error) {
        console.error("データの読み込み中にエラーが発生しました:", error);
        questionMeaningElement.textContent = "データの読み込みに失敗しました。ファイルパスを確認してください。";
    }
}

/**
 * ランダムに問題と3つのダミー選択肢を選び、問題オブジェクトを生成する
 * @returns {object} 問題オブジェクト
 */
function createNewQuestion() {
    // 1. 正解の形容詞を選ぶ
    const correctAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    // 2. ダミーの選択肢を選ぶ (正解と重複しないように)
    let wrongAdjectives = [];
    while (wrongAdjectives.length < 3) {
        const randomIndex = Math.floor(Math.random() * adjectives.length);
        const dummyAdjective = adjectives[randomIndex];
        
        // 正解や既にあるダミーと重複しない & 意味が全く同じでないことを確認 (簡易チェック)
        if (dummyAdjective.meaning !== correctAdjective.meaning && 
            !wrongAdjectives.includes(dummyAdjective)) {
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

    return {
        meaning: correctAdjective.meaning,
        correctKanji: correctAdjective.kanji,
        choices: choices
    };
}

/**
 * 現在の問題を画面に設定する
 */
function setupQuestion() {
    // クイズ終了判定
    if (currentQuestionIndex >= QUIZ_COUNT) {
        questionNumberElement.textContent = "クイズ終了！";
        questionMeaningElement.textContent = "全問終了しました。お疲れ様でした！";
        choicesContainer.innerHTML = '';
        nextButton.style.display = 'none';
        return;
    }

    // 問題番号を更新
    currentQuestionIndex++;
    questionNumberElement.textContent = `第 ${currentQuestionIndex} 問 (全 ${QUIZ_COUNT} 問)`;
    
    // 新しい問題を作成し、グローバル変数に保持
    currentQuestion = createNewQuestion();
    
    // 質問の意味を表示
    questionMeaningElement.textContent = currentQuestion.meaning;
    
    // 選択肢ボタンを生成
    choicesContainer.innerHTML = ''; // 既存の選択肢をクリア
    currentQuestion.choices.forEach(adjective => {
        const button = document.createElement('button');
        
        // 漢字 + ひらがな + 形容詞タイプを表示
        // な形容詞の場合は "(な)" を追加
        const suffix = adjective.type === 'na' ? ' (な)' : '';
        button.textContent = `${adjective.kanji}（${adjective.hiragana}）${suffix}`;
        
        // 選択肢ボタンにイベントリスナーを設定
        button.addEventListener('click', () => checkAnswer(button, adjective.kanji));
        
        choicesContainer.appendChild(button);
    });
    
    // 結果メッセージをリセット
    resultMessageElement.style.display = 'none';
    resultMessageElement.className = 'result';
    
    // 次へボタンを無効化
    nextButton.disabled = true;
}

/**
 * ユーザーの回答をチェックし、結果を表示する関数
 * @param {HTMLElement} clickedButton - クリックされたボタン要素
 * @param {string} selectedKanji - ユーザーが選んだ形容詞の漢字
 */
function checkAnswer(clickedButton, selectedKanji) {
    // 全てのボタンを無効化
    Array.from(choicesContainer.children).forEach(button => {
        button.disabled = true;
    });

    const isCorrect = (selectedKanji === currentQuestion.correctKanji);
    
    if (isCorrect) {
        resultMessageElement.textContent = "✅ 正解です！";
        resultMessageElement.classList.add('correct');
        clickedButton.style.backgroundColor = '#d4edda';
    } else {
        resultMessageElement.textContent = `❌ 不正解です。正解は「${currentQuestion.correctKanji}」でした。`;
        resultMessageElement.classList.add('incorrect');
        clickedButton.style.backgroundColor = '#f8d7da';
        
        // 正解のボタンをハイライト
        Array.from(choicesContainer.children).forEach(button => {
            if (button.textContent.includes(currentQuestion.correctKanji)) {
                button.style.backgroundColor = '#c3e6cb';
            }
        });
    }

    resultMessageElement.style.display = 'block';
    nextButton.disabled = false;
}

// 次へボタンにイベントリスナーを設定
nextButton.addEventListener('click', setupQuestion);

// ページロード時にクイズを開始
loadDataAndStartQuiz();