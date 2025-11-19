// ----------------------------------------------------
// ★★★ ポイントシステム設定 (ここから追加) ★★★
// ----------------------------------------------------
const GAME_ID_2 = 'hiragana_sort_game'; // ゲームID

const USER_STORAGE_KEY_2 = 'user_accounts'; 
const SESSION_STORAGE_KEY_2 = 'current_user'; 
const GUEST_NAME_2 = 'ゲスト'; 

// 日付取得
function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ポイント加算・チェック関数
function checkAndAwardPoints(wordId) {
    const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY_2);
    if (!currentUser || currentUser === GUEST_NAME_2) return "guest"; 

    const usersJson = localStorage.getItem(USER_STORAGE_KEY_2);
    let users = usersJson ? JSON.parse(usersJson) : {};
    let user = users[currentUser];
    if (!user) return "error"; 

    const today = getTodayDateString();
    const progressKey = `${GAME_ID_2}_word_${wordId}`;

    user.progress = user.progress || {};
    user.progress[progressKey] = user.progress[progressKey] || {};

    if (user.progress[progressKey][today] === true) return "already_scored"; 

    user.points = (user.points || 0) + 1;
    user.progress[progressKey][today] = true;
    
    users[currentUser] = user;
    localStorage.setItem(USER_STORAGE_KEY_2, JSON.stringify(users));
    console.log(`[Game] ${currentUser} gained 1 point. Total: ${user.points}`);
    return "scored"; 
}
// ----------------------------------------------------
// ★★★ ポイントシステム設定 (ここまで) ★★★
// ----------------------------------------------------


// --- グローバル変数 ---
let MAIN_MENU_2 = null; 
let GAME_AREA_2 = null; 

const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 

let allWords = [];
let currentWord = null;
let score = 0;          
let correctCount = 0;   
let incorrectCount = 0; 
let askedWordIds = new Set();

// ★★★ ドラッグ＆ドロップ用の変数 ★★★
let ghostItem = null;      
let currentDragItem = null; 
let lastTouchTarget = null; 

function playSound(path) {
    const audio = new Audio(path);
    audio.play().catch(e => console.error("音声再生エラー:", e));
}

// ----------------------------------------------------
// 1. ゲーム開始関数
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

    // ★★★ 修正点: draggable="true" を追加 ★★★
    let blocksHtml = shuffledChars.map((char, index) => 
        `<div class="char-block" draggable="true" data-char="${char}" id="block-${index}" style="cursor: grab;">${char}</div>`
    ).join('');

    GAME_AREA_2.innerHTML = `
        <h3>このイラストの言葉を並び替えてください (${scoreDisplay})</h3>
        <div style="min-height: 170px;">
            <img src="${imagePath}" 
                 alt="${word.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: contain; margin-bottom: 20px;">
        </div> 
        
        <div id="word-container" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            ${blocksHtml}
        </div>
        
        <div id="check-area" style="margin-top: 30px;">
            <button id="checkButton" class="menu-card-button choice-button" style="width: 150px; height: 50px; margin: 0 auto; display: block;">答え合わせ</button>
        </div>

        <p id="feedback" style="font-weight: bold; margin-top: 15px; min-height: 25px;">ドラッグして並び替え！</p>
        
        <div id="game-controls-2" style="margin-top: 30px;">
            <button id="backToMenu2" class="menu-card-button menu-card-reset">メニューに戻る</button>
        </div>
    `;

    // ★★★ ドラッグ＆ドロップイベントの設定 ★★★
    addDragDropListeners();
    
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('backToMenu2').addEventListener('click', renderMenu);
}

// ----------------------------------------------------
// ★★★ 6. ドラッグ＆ドロップ (並び替え) ロジック ★★★
// ----------------------------------------------------

function updateGhostPosition(touch) {
    if (!ghostItem) return;
    ghostItem.style.left = (touch.clientX - ghostItem.offsetWidth / 2) + 'px';
    ghostItem.style.top = (touch.clientY - ghostItem.offsetHeight / 2) + 'px';
}

// DOM上で2つの要素の位置を入れ替える関数
function swapNodes(n1, n2) {
    if (n1 === n2) return;
    const p1 = n1.parentNode;
    const p2 = n2.parentNode;
    if (p1 !== p2) return; // 同じ親の中でのみ入れ替え

    // n1とn2の相対位置を確認して入れ替え
    const next1 = n1.nextSibling;
    const next2 = n2.nextSibling;

    if (next1 === n2) {
        p1.insertBefore(n2, n1);
    } else if (next2 === n1) {
        p1.insertBefore(n1, n2);
    } else {
        p1.insertBefore(n2, next1);
        p1.insertBefore(n1, next2);
    }
}

function addDragDropListeners() {
    const dragItems = document.querySelectorAll('.char-block');
    const container = document.getElementById('word-container');

    // 透明な画像（ドラッグ中の残像を消すため）
    const transparentImage = new Image();
    transparentImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; 

    dragItems.forEach(item => {
        // --- PC / マウス操作 ---
        item.addEventListener('dragstart', (e) => {
            currentDragItem = item;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.innerText); // Firefox対応
            if (e.dataTransfer.setDragImage) {
                e.dataTransfer.setDragImage(transparentImage, 0, 0);
            }
            setTimeout(() => item.style.opacity = '0.4', 0);
        });

        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
            currentDragItem = null;
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault(); // ドロップ許可
            e.dataTransfer.dropEffect = 'move';
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (currentDragItem && currentDragItem !== item) {
                swapNodes(currentDragItem, item);
            }
        });


        // --- スマホ / タッチ操作 ---
        item.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault(); // スクロール防止
            currentDragItem = item;
            
            // ゴースト作成
            ghostItem = item.cloneNode(true);
            ghostItem.style.position = 'absolute';
            ghostItem.style.opacity = '0.8';
            ghostItem.style.pointerEvents = 'none';
            ghostItem.style.zIndex = '1000';
            ghostItem.style.transform = 'scale(1.1)';
            document.body.appendChild(ghostItem);
            
            item.style.opacity = '0.4';
            updateGhostPosition(e.touches[0]);
        }, { passive: false });

        item.addEventListener('touchmove', (e) => {
            if (!currentDragItem || !ghostItem) return;
            if (e.cancelable) e.preventDefault();

            const touch = e.touches[0];
            updateGhostPosition(touch);

            // 指の下にある要素を取得
            ghostItem.style.display = 'none';
            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            ghostItem.style.display = '';

            if (elementUnder && elementUnder.classList.contains('char-block')) {
                if (lastTouchTarget && lastTouchTarget !== elementUnder) {
                    lastTouchTarget.style.transform = '';
                }
                lastTouchTarget = elementUnder;
                // 指の下のブロックを少し大きくして反応を示す
                elementUnder.style.transform = 'scale(1.1)';
            } else {
                if (lastTouchTarget) lastTouchTarget.style.transform = '';
                lastTouchTarget = null;
            }
        }, { passive: false });

        item.addEventListener('touchend', (e) => {
            if (currentDragItem) {
                currentDragItem.style.opacity = '1';
                
                // ドロップ先にブロックがあれば入れ替える
                if (lastTouchTarget && lastTouchTarget !== currentDragItem && lastTouchTarget.classList.contains('char-block')) {
                    swapNodes(currentDragItem, lastTouchTarget);
                    lastTouchTarget.style.transform = '';
                }
            }
            
            if (ghostItem) {
                document.body.removeChild(ghostItem);
                ghostItem = null;
            }
            currentDragItem = null;
            lastTouchTarget = null;
        });
    });
}
// ----------------------------------------------------


// 7. 答え合わせの処理
function checkAnswer() {
    const blocks = Array.from(document.querySelectorAll('.char-block'));
    const attemptedReading = blocks.map(block => block.dataset.char).join('');
    const feedbackElement = document.getElementById('feedback');

    if (attemptedReading === currentWord.reading) {
        playSound(SOUND_CORRECT_PATH);
        
        const result = checkAndAwardPoints(currentWord.id);
        
        let message = 'せいかい！✨';
        if (result === "scored") {
            message += ' (+1 ポイント！)';
        } else if (result === "already_scored") {
             // message += ' (獲得ずみ)';
        }
        feedbackElement.textContent = message;
        feedbackElement.style.color = '#5c7aff';
        score += 10;
        correctCount += 1; 
        
        document.getElementById('checkButton').disabled = true;

        setTimeout(() => {
            document.getElementById('checkButton').disabled = false;
            showNextQuestion();
        }, 1500);

    } else {
        playSound(SOUND_INCORRECT_PATH);
        
        feedbackElement.textContent = 'ざんねん...。もう一度並び替えてください。';
        feedbackElement.style.color = '#ff6f61';
        incorrectCount += 1; 
        
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