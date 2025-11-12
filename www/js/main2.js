// --- グローバル変数 ---
// hiragana2.htmlのIDに合わせて変数を定義
let MAIN_MENU_2 = null; // hiragana2.htmlのメニューエリア
let GAME_AREA_2 = null; // hiragana2.htmlのゲームエリア

// ★★★ 修正点 1: 音声ファイルのパスを修正 ★★★
const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 
// ★★★★★★★★★★★★★★★★★★★★★

let allWords = [];
let currentWord = null;
let score = 0;          
let correctCount = 0;   
let incorrectCount = 0; 
let askedWordIds = new Set();
let selectedBlocks = []; 

// ★★★ 補助関数: 音源を再生する関数 ★★★
function playSound(path) {
    const audio = new Audio(path);
    audio.play().catch(e => console.error("音声再生エラー:", e));
}
// ★★★★★★★★★★★★★★★★★★★★★

// ----------------------------------------------------
// 1. ゲーム開始関数 (HTMLの onclick="startNewGame2()" から呼ばれる)
// ----------------------------------------------------
window.startNewGame2 = function() {
    if (!MAIN_MENU_2) {
        document.addEventListener('DOMContentLoaded', () => {
            initializeDomElements();
            startNewGameLogic();
        });
        return;
    }

    if (allWords.length === 0) {
        loadWords().then(startNewGameLogic);
    } else {
        startNewGameLogic();
    }
};

function startNewGameLogic() {
    if (allWords.length < 1) {
        alert('単語データがありません。');
        renderMenu();
        return;
    }
    
    if (MAIN_MENU_2) MAIN_MENU_2.style.display = 'none'; 
    if (GAME_AREA_2) GAME_AREA_2.style.display = 'block'; 

    score = 0; 
    correctCount = 0;
    incorrectCount = 0;
    askedWordIds.clear(); 
    selectedBlocks = [];

    showNextQuestion();
}
    
// 2. メインメニュー画面を表示する関数
function renderMenu() {
    if (MAIN_MENU_2) MAIN_MENU_2.style.display = 'block';
    if (GAME_AREA_2) GAME_AREA_2.style.display = 'none';

    const scoreMessageElement = document.getElementById('start-message-2');
    if (scoreMessageElement) {
        scoreMessageElement.innerHTML = `<p>前回のスコア: ${score}点 (正解: ${correctCount}問, 失敗: ${incorrectCount}回)</p>`;
    }
}

// 3. JSONデータを読み込む関数
async function loadWords() {
    try {
        const response = await fetch('data/words.json');
        allWords = await response.json();
        return allWords;
    } catch (error) {
        console.error('単語データの読み込みに失敗しました:', error);
        return [];
    }
}

// 4. 問題をランダムに選び、ブロックを生成する
function showNextQuestion() {
    
    if (askedWordIds.size >= allWords.length) {
        alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 失敗: ${incorrectCount}回`);
        renderMenu(); 
        return;
    }

    let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
    
    const correctIndex = Math.floor(Math.random() * availableWords.length);
    currentWord = availableWords[correctIndex];
    
    let readingChars = Array.from(currentWord.reading);
    let shuffledChars = shuffleArray([...readingChars]);
    
    askedWordIds.add(currentWord.id);
    
    renderQuestion(currentWord, shuffledChars);
}

// 5. 画面に問題とブロックを表示する
function renderQuestion(word, shuffledChars) {
    const imagePath = `assets/images/${word.image}`; 
    
    const scoreDisplay = `${correctCount}/${incorrectCount}`; 

    let blocksHtml = shuffledChars.map((char, index) => 
        `<div class="char-block" data-char="${char}" data-original-index="${index}">${char}</div>`
    ).join('');

    GAME_AREA_2.innerHTML = `
        <h3>このイラストの言葉を並び替えてください (${scoreDisplay})</h3>
        <div style="min-height: 170px;">
            <img src="${imagePath}" 
                 alt="${word.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: contain; margin-bottom: 20px;">
        </div> 
        
        <div id="word-container" style="display: flex; justify-content: center; margin-bottom: 20px;">
            ${blocksHtml}
        </div>
        
        <div id="check-area" style="margin-top: 30px;">
            <button id="checkButton" class="menu-card-button choice-button" style="width: 150px; height: 50px; margin: 0 auto; display: block;">答え合わせ</button>
        </div>

        <p id="feedback" style="font-weight: bold; margin-top: 15px; min-height: 25px;">クリックで文字を入れ替え！</p>
        
        <div id="game-controls-2" style="margin-top: 30px;">
            <button id="backToMenu2" class="menu-card-button menu-card-reset">メニューに戻る</button>
        </div>
    `;

    document.querySelectorAll('.char-block').forEach(block => {
        block.addEventListener('click', handleBlockClick);
    });
    
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('backToMenu2').addEventListener('click', renderMenu);
}

// 6. ブロックをクリックしたときの処理（並び替えロジック）
function handleBlockClick(event) {
    const clickedBlock = event.target;
    
    if (selectedBlocks.includes(clickedBlock)) {
        selectedBlocks = selectedBlocks.filter(block => block !== clickedBlock);
        clickedBlock.classList.remove('selected');
    } else {
        selectedBlocks.push(clickedBlock);
        clickedBlock.classList.add('selected');
    }

    if (selectedBlocks.length === 2) {
        const block1 = selectedBlocks[0];
        const block2 = selectedBlocks[1];

        const container = document.getElementById('word-container');
        const nodes = Array.from(container.children);
        const index1 = nodes.indexOf(block1);
        const index2 = nodes.indexOf(block2);

        if (index1 !== -1 && index2 !== -1) {
            container.innerHTML = '';
            [nodes[index1], nodes[index2]] = [nodes[index2], nodes[index1]];
            nodes.forEach(node => container.appendChild(node));
        }
        
        block1.classList.remove('selected');
        block2.classList.remove('selected');
        selectedBlocks = [];
    }
    
    document.getElementById('feedback').textContent = 'クリックで文字を入れ替え！';
    document.getElementById('feedback').style.color = '#333';
}

// 7. 答え合わせの処理 (不正解なら同じ問題)
function checkAnswer() {
    const blocks = Array.from(document.querySelectorAll('.char-block'));
    const attemptedReading = blocks.map(block => block.dataset.char).join('');
    const feedbackElement = document.getElementById('feedback');

    if (attemptedReading === currentWord.reading) {
        // ★★★ 正解時の音源再生 ★★★
        playSound(SOUND_CORRECT_PATH);
        
        feedbackElement.textContent = 'せいかい！✨';
        feedbackElement.style.color = '#5c7aff';
        score += 10;
        correctCount += 1; 
        
        document.getElementById('checkButton').disabled = true;

        setTimeout(() => {
            document.getElementById('checkButton').disabled = false;
            showNextQuestion();
        }, 1500);

    } else {
        // ★★★ 不正解時の音源再生 ★★★
        playSound(SOUND_INCORRECT_PATH);
        
        feedbackElement.textContent = 'ざんねん...。もう一度並び替えてください。';
        feedbackElement.style.color = '#ff6f61';
        incorrectCount += 1; 

        document.querySelectorAll('.char-block').forEach(block => {
            block.classList.remove('selected'); 
        });
        selectedBlocks = [];
        
        renderScoreTitleUpdate();
    }
}

// 7.5 スコア表示のみを更新する補助関数
function renderScoreTitleUpdate() {
    const titleElement = GAME_AREA_2.querySelector('h3');
    if (titleElement) {
        const scoreDisplay = `${correctCount}/${incorrectCount}`; 
        titleElement.textContent = `このイラストの言葉を並び替えてください (${scoreDisplay})`;
    }
}

// 8. 配列をランダムにシャッフルするユーティリティ関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 9. DOM要素の初期化関数
function initializeDomElements() {
    MAIN_MENU_2 = document.getElementById('main-menu-2');
    GAME_AREA_2 = document.getElementById('game-area-2');
}

// 10. DOMContentLoaded (要素の取得とデータロード)
document.addEventListener('DOMContentLoaded', () => {
    initializeDomElements();
    loadWords();
});