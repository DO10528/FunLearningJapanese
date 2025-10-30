// --- グローバル変数 ---
// HTML要素はDOMContentLoaded内で定義します
let MENU_AREA = null;
let GAME_AREA = null;
let TURN_MESSAGE = null;
let CURRENT_WORD_TEXT = null;
let IMAGE_AREA = null;
let CHOICE_BUTTONS_AREA = null;
let FEEDBACK = null;
let QUESTION_TEXT = null;
let GAME_CONTROLS = null; // プレイ中のメニューボタンを挿入するエリア
let END_GAME_CONTROLS = null; // ★追加: ゲーム終了時ボタンを挿入するエリア

let allWords = [];
let usedWords = new Set();
let lastChar = ''; 
let score = 0;             // 連鎖数
let incorrectCount = 0;    // 失敗数

// ----------------------------------------------------
// 1. JSONデータを読み込む関数
// ----------------------------------------------------
async function loadWords() {
    try {
        const response = await fetch('data/words.json');
        const data = await response.json();
        allWords = data.filter(word => !word.reading.endsWith('ん'));
        return allWords;
    } catch (error) {
        console.error('単語データの読み込みに失敗しました:', error);
        return [];
    }
}

// ----------------------------------------------------
// 2. ゲーム開始処理 (HTMLの onclick="startNewGame()" から呼ばれる)
// ----------------------------------------------------
window.startNewGame = function() {
    if (!MENU_AREA) {
        document.addEventListener('DOMContentLoaded', () => {
            initializeDomElements();
            startGameLogic();
        });
        return;
    }
    
    if (allWords.length === 0) {
        loadWords().then(() => {
            startGameLogic();
        });
        return;
    }
    startGameLogic();
};

function startGameLogic() {
    if (allWords.length < 3) {
        alert('単語データが不足しています。');
        renderMenu();
        return;
    }
    
    // 画面切り替え
    if (MENU_AREA) MENU_AREA.style.display = 'none';
    if (GAME_AREA) GAME_AREA.style.display = 'block';
    
    // ゲーム終了時ボタンエリアを非表示にする
    if (END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'none';

    // 状態リセット
    usedWords.clear();
    lastChar = '';
    score = 0;
    incorrectCount = 0;
    if(FEEDBACK) FEEDBACK.textContent = '単語を選んでね！';
    
    const firstWord = allWords[Math.floor(Math.random() * allWords.length)];
    useWord(firstWord); 
    lastChar = firstWord.reading.slice(-1);
    score = 1;

    playerTurn(); 
}

// ----------------------------------------------------
// 3. プレイヤーのターン (3択クイズとして表示)
// ----------------------------------------------------
function playerTurn() {
    
    let availableWords = allWords.filter(word => 
        !usedWords.has(word.reading) && word.reading.charAt(0) === lastChar
    );

    if (availableWords.length === 0) {
        endGame('おめでとう！辞書の単語を使い切りました。', true); 
        return;
    }
    
    const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    let choices = [correctWord]; 

    // 不正解の選択肢を2つ選ぶ
    let wrongWords = [];
    while (wrongWords.length < 2) { 
        const randomIndex = Math.floor(Math.random() * allWords.length);
        const randomWord = allWords[randomIndex];
        
        const isUsed = usedWords.has(randomWord.reading);
        const isDuplicate = wrongWords.some(w => w.id === randomWord.id);
        const isCorrect = correctWord.id === randomWord.id;

        if (!isUsed && !isDuplicate && !isCorrect && randomWord.reading.charAt(0) !== correctWord.reading.charAt(0)) {
            wrongWords.push(randomWord);
        }
    }
    
    let finalChoices = shuffleArray([...choices, ...wrongWords]);
    
    // 画面を更新
    updateScoreDisplay(`チャレンジ中！`);
    if(QUESTION_TEXT) QUESTION_TEXT.textContent = `直前の単語は「${lastChar}」で終わりました。この文字から始まるイラストを選んでください。`;
    renderChoices(finalChoices.slice(0, 3)); // 3択に限定
    
    // プレイ中に常に表示される「メニューに戻る」ボタンを動的に制御する
    let returnButton = document.getElementById('returnToMenuDuringGame');
    if (!returnButton && GAME_CONTROLS) {
        returnButton = document.createElement('button');
        returnButton.id = 'returnToMenuDuringGame';
        returnButton.className = 'menu-card-button menu-card-reset';
        returnButton.style.width = '200px'; 
        returnButton.style.height = '50px';
        returnButton.textContent = '🏠 メニューに戻る';
        returnButton.addEventListener('click', renderMenu);
        GAME_CONTROLS.appendChild(returnButton); // 新しいエリアに挿入
    }
    if (returnButton) returnButton.style.display = 'block';
}

// ----------------------------------------------------
// 4. ユーザーの回答を処理
// ----------------------------------------------------
function handleAnswer(event) {
    const card = event.target.closest('.choice-card');
    if (!card) return;

    const selectedReading = card.dataset.wordReading;
    const selectedWordData = allWords.find(word => word.reading === selectedReading);

    const allChoiceCards = document.querySelectorAll('.choice-card');
    allChoiceCards.forEach(btn => btn.style.pointerEvents = 'none');
    
    // 1. ルールチェック (しりとりが繋がっているか)
    if (selectedReading.charAt(0) !== lastChar) {
        if(FEEDBACK) FEEDBACK.textContent = `ざんねん！「${lastChar}」から始まっていません。`;
        if(FEEDBACK) FEEDBACK.style.color = '#ff6f61';
        card.style.backgroundColor = '#ff6f61';
        incorrectCount++; 
        endGame(`ゲームオーバー: ルール違反`, false);
        return;
    }

    // 2. 「ん」チェック (ゲームオーバー)
    if (selectedReading.slice(-1) === 'ん') {
        if(FEEDBACK) FEEDBACK.textContent = `「${selectedWordData.word}」は「ん」で終わります！ゲームオーバーです。`;
        if(FEEDBACK) FEEDBACK.style.color = '#ff6f61';
        card.style.backgroundColor = '#ff6f61';
        incorrectCount++; 
        endGame(`ゲームオーバー: 「ん」で終了`, false);
        return;
    }
    
    // 3. 使用済みチェック 
    if (usedWords.has(selectedReading)) {
         if(FEEDBACK) FEEDBACK.textContent = `既に使用されています。`;
         if(FEEDBACK) FEEDBACK.style.color = '#ff6f61';
         incorrectCount++;
         endGame(`ゲームオーバー: 使用済み`, false);
         return;
    }

    // --- 成功処理（ルール適合）---
    if(FEEDBACK) FEEDBACK.textContent = 'せいかい！✨ しりとりが繋がりました。';
    if(FEEDBACK) FEEDBACK.style.color = '#5c7aff';
    card.style.backgroundColor = '#d1e7dd';
    
    useWord(selectedWordData);
    lastChar = selectedReading.slice(-1);
    score++; 

    // 次のターンへ
    setTimeout(() => {
        if(FEEDBACK) FEEDBACK.textContent = '単語を選んでね！';
        allChoiceCards.forEach(btn => btn.style.pointerEvents = 'auto');
        playerTurn();
    }, 1500);
}

// ----------------------------------------------------
// 5. その他の補助関数
// ----------------------------------------------------

function updateScoreDisplay(message) {
    const scoreDisplay = `${score}連鎖 / 失敗${incorrectCount}回`;
    if(TURN_MESSAGE) TURN_MESSAGE.innerHTML = `${message} (${scoreDisplay})`;
}

function renderMenu() {
    if (MENU_AREA) MENU_AREA.style.display = 'block';
    if (GAME_AREA) GAME_AREA.style.display = 'none';
    
    usedWords.clear();
    lastChar = '';
    score = 0;
    incorrectCount = 0;
    if(CURRENT_WORD_TEXT) CURRENT_WORD_TEXT.textContent = '';
    if(FEEDBACK) FEEDBACK.textContent = '単語を選んでね！';
    if(CHOICE_BUTTONS_AREA) CHOICE_BUTTONS_AREA.innerHTML = '';
    if(IMAGE_AREA) IMAGE_AREA.innerHTML = ''; 
    
    // ゲーム終了時ボタンエリアを非表示
    if (END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'none';
    
    // プレイ中のボタンも隠す
    const returnButton = document.getElementById('returnToMenuDuringGame');
    if (returnButton) returnButton.style.display = 'none';


    if(TURN_MESSAGE) TURN_MESSAGE.textContent = 'ゲーム開始';
    if(QUESTION_TEXT) QUESTION_TEXT.textContent = 'しりとりであそぼう！';
}

function useWord(wordData) {
    const reading = wordData.reading;
    usedWords.add(reading);
    
    const imagePath = `assets/images/${wordData.image}`;
    if(IMAGE_AREA) IMAGE_AREA.innerHTML = `
        <img src="${imagePath}" 
             alt="${wordData.word}" 
             onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})';" 
             style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
    `;
    
    if(CURRENT_WORD_TEXT) CURRENT_WORD_TEXT.innerHTML = `直前の単語: <span style="font-weight: bold; color: #ff6f61;">${wordData.word} (${reading})</span>`;
}

// ゲーム終了処理
function endGame(message, isWin) {
    const finalMessage = isWin ? 
        `🎉 完走！${message}` : 
        `😭 ${message}。`;
        
    updateScoreDisplay('ゲーム終了');
    if(FEEDBACK) FEEDBACK.innerHTML = `<span style="font-size: 1.2em;">${finalMessage}</span><br>あなたの連鎖記録は**${score}連鎖**でした！`;
    if(CHOICE_BUTTONS_AREA) CHOICE_BUTTONS_AREA.innerHTML = '';
    
    // プレイ中のボタンを非表示にする
    const returnButton = document.getElementById('returnToMenuDuringGame');
    if (returnButton) returnButton.style.display = 'none';

    // ★修正: ゲーム終了時用のボタンを生成し、表示する★
    if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'flex'; // ボタンを横並びにする
    if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.justifyContent = 'center';

    if(END_GAME_CONTROLS) END_GAME_CONTROLS.innerHTML = `
        <button id="restartButton" class="menu-card-button choice-button" style="width: 200px; margin-right: 10px;">
            🔁 もう一度あそぶ！
        </button>
        <button id="backToMenuEndGame" class="menu-card-button menu-card-reset" style="width: 200px;">
            🏠 メニューに戻る
        </button>
    `;

    document.getElementById('restartButton').addEventListener('click', startGameLogic);
    document.getElementById('backToMenuEndGame').addEventListener('click', renderMenu);
}

function renderChoices(choices) {
    if(!CHOICE_BUTTONS_AREA) return;
    
    CHOICE_BUTTONS_AREA.innerHTML = choices.map((word, index) => {
        const imagePath = `assets/images/${word.image}`;
        
        return `
            <div class="menu-card-button menu-card-reset choice-card" data-word-reading="${word.reading}" data-index="${index}">
                <img src="${imagePath}" 
                     alt="${word.word}" 
                     onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません';" 
                     style="object-fit: cover; border-radius: 5px;">
            </div>
        `;
    }).join('');

    document.querySelectorAll('.choice-card').forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------------------------------------------
// 6. DOMContentLoaded (要素の取得と初期データのロード)
// ----------------------------------------------------
function initializeDomElements() {
    MENU_AREA = document.getElementById('shiritori-menu');
    GAME_AREA = document.getElementById('shiritori-game-area');
    TURN_MESSAGE = document.getElementById('turn-message');
    CURRENT_WORD_TEXT = document.getElementById('current-word-text');
    IMAGE_AREA = document.getElementById('image-area');
    CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    FEEDBACK = document.getElementById('feedback');
    QUESTION_TEXT = document.getElementById('question-text');
    GAME_CONTROLS = document.getElementById('game-controls');
    END_GAME_CONTROLS = document.getElementById('endGameControls'); // ★追加: 終了時コントロールエリアの取得
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDomElements();
    loadWords();
});