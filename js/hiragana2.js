// ----------------------------------------------------
// ★★★ ポイントシステム設定 ★★★
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

// ポイント加算関数
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

// ドラッグ操作用の変数
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
    
// 2. メニュー画面
function renderMenu() {
    if (MAIN_MENU_2) MAIN_MENU_2.style.display = 'block';
    if (GAME_AREA_2) GAME_AREA_2.style.display = 'none';

    const scoreMessageElement = document.getElementById('start-message-2');
    if (scoreMessageElement) {
        scoreMessageElement.innerHTML = `<p>前回のスコア: ${score}点 (正解: ${correctCount}問, 失敗: ${incorrectCount}回)</p>`;
    }
}

// 3. データ読み込み
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

// 4. 問題出題
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

// 5. 画面描画 (マス目と文字カードを作成)
function renderQuestion(word, shuffledChars) {
    const imagePath = `assets/images/${word.image}`; 
    const scoreDisplay = `${correctCount}/${incorrectCount}`; 

    // ① 答えを入れるための「空のマス」を作成
    let slotsHtml = '';
    for (let i = 0; i < word.reading.length; i++) {
        slotsHtml += `
            <div class="drop-slot" data-index="${i}" 
                 style="width: 60px; height: 60px; border: 2px dashed #bbb; background-color: #f9f9f9; margin: 5px; display: flex; justify-content: center; align-items: center; border-radius: 10px; transition: background-color 0.2s;">
            </div>`;
    }

    // ② バラバラになった「文字カード」を作成 (プール用)
    let blocksHtml = shuffledChars.map((char, index) => 
        `<div class="char-block" draggable="true" id="block-${index}" data-char="${char}" 
              style="width: 50px; height: 50px; background: #fff; border: 2px solid #5c7aff; border-radius: 8px; font-size: 24px; font-weight: bold; display: flex; justify-content: center; align-items: center; cursor: grab; box-shadow: 0 2px 5px rgba(0,0,0,0.1); user-select: none;">
              ${char}
         </div>`
    ).join('');

    GAME_AREA_2.innerHTML = `
        <h3>このイラストの言葉を完成させてね (${scoreDisplay})</h3>
        <div style="min-height: 170px;">
            <img src="${imagePath}" 
                 alt="${word.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: contain; margin-bottom: 10px;">
        </div> 
        
        <div style="margin-bottom: 5px; color: #555; font-weight:bold;">【こたえのばしょ】</div>
        <div id="answer-container" style="display: flex; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; min-height: 70px;">
            ${slotsHtml}
        </div>

        <div style="margin-bottom: 5px; color: #555; font-weight:bold;">【つかうもじ】</div>
        <div id="pool-container" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; min-height: 70px; padding: 10px; background-color: #eef6ff; border-radius: 15px;">
            ${blocksHtml}
        </div>
        
        <div id="check-area" style="margin-top: 20px;">
            <button id="checkButton" class="menu-card-button choice-button" style="width: 150px; height: 50px; margin: 0 auto; display: block;">答え合わせ</button>
        </div>

        <p id="feedback" style="font-weight: bold; margin-top: 15px; min-height: 25px; color: #005bb5;">文字をマスにドラッグ(またはクリック)してね！</p>
        
        <div id="game-controls-2" style="margin-top: 30px;">
            <button id="backToMenu2" class="menu-card-button menu-card-reset">メニューに戻る</button>
        </div>
    `;

    // イベント設定
    addDragDropListeners();
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('backToMenu2').addEventListener('click', renderMenu);
}

// ----------------------------------------------------
// ★★★ ドラッグ＆ドロップ & クリック操作ロジック ★★★
// ----------------------------------------------------

function addDragDropListeners() {
    const dragItems = document.querySelectorAll('.char-block');
    const slots = document.querySelectorAll('.drop-slot');
    const pool = document.getElementById('pool-container');
    
    const transparentImage = new Image();
    transparentImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; 

    // ★クリックでの移動機能（簡単操作）
    dragItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // すでにドラッグ中なら無視
            if (currentDragItem) return;

            const parent = item.parentElement;
            if (parent.classList.contains('drop-slot')) {
                // マスにある場合はプールに戻す
                pool.appendChild(item);
            } else {
                // プールにある場合は、空いている最初のマスに入れる
                for (let slot of slots) {
                    if (!slot.hasChildNodes()) {
                        slot.appendChild(item);
                        playSound('assets/sounds/pop.mp3'); // 音があれば鳴らす（無くてもOK）
                        break;
                    }
                }
            }
            // フィードバックリセット
            document.getElementById('feedback').textContent = '文字をマスにドラッグ(またはクリック)してね！';
            document.getElementById('feedback').style.color = '#005bb5';
        });

        // --- PC: ドラッグ開始 ---
        item.addEventListener('dragstart', (e) => {
            currentDragItem = item;
            e.dataTransfer.setData('text/plain', item.id);
            if (e.dataTransfer.setDragImage) {
                e.dataTransfer.setDragImage(transparentImage, 0, 0);
            }
            setTimeout(() => item.style.opacity = '0.5', 0);
        });
        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
            currentDragItem = null;
        });
    });

    // --- PC: ドロップ受け入れ (マス & プール) ---
    const dropZones = [...slots, pool];
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.backgroundColor = zone.classList.contains('drop-slot') ? '#e0e0e0' : '#eef6ff';
        });
        zone.addEventListener('dragleave', (e) => {
            zone.style.backgroundColor = zone.classList.contains('drop-slot') ? '#f9f9f9' : '#eef6ff';
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.backgroundColor = zone.classList.contains('drop-slot') ? '#f9f9f9' : '#eef6ff';
            
            if (currentDragItem) {
                // マスにすでに文字がある場合は、入れ替える（プールに戻す）
                if (zone.classList.contains('drop-slot') && zone.hasChildNodes()) {
                    pool.appendChild(zone.firstChild);
                }
                zone.appendChild(currentDragItem);
            }
        });
    });

    // --- スマホ: タッチ操作 ---
    dragItems.forEach(item => {
        item.addEventListener('touchstart', (e) => {
            // クリック動作と被らないように少し制御
            if (e.cancelable) e.preventDefault(); 
            currentDragItem = item;
            
            // ゴースト作成
            ghostItem = item.cloneNode(true);
            ghostItem.style.position = 'absolute';
            ghostItem.style.opacity = '0.8';
            ghostItem.style.pointerEvents = 'none';
            ghostItem.style.zIndex = '1000';
            ghostItem.style.transform = 'scale(1.2)';
            document.body.appendChild(ghostItem);
            
            item.style.opacity = '0.4';
            updateGhostPosition(e.touches[0]);
        }, { passive: false });

        item.addEventListener('touchmove', (e) => {
            if (!currentDragItem || !ghostItem) return;
            if (e.cancelable) e.preventDefault();

            const touch = e.touches[0];
            updateGhostPosition(touch);

            // 指の下の要素を確認
            ghostItem.style.display = 'none';
            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            ghostItem.style.display = '';

            // マスの上に来たら色を変えるなどの演出
            if (elementUnder && (elementUnder.classList.contains('drop-slot') || elementUnder.id === 'pool-container')) {
                 // 必要ならハイライト処理
            }
        }, { passive: false });

        item.addEventListener('touchend', (e) => {
            if (!currentDragItem || !ghostItem) return;

            const touch = e.changedTouches[0];
            ghostItem.style.display = 'none';
            let elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // ドロップ先の判定
            let targetZone = null;
            if (elementUnder) {
                if (elementUnder.classList.contains('drop-slot')) targetZone = elementUnder;
                else if (elementUnder.id === 'pool-container') targetZone = elementUnder;
                else if (elementUnder.closest('.drop-slot')) targetZone = elementUnder.closest('.drop-slot');
                else if (elementUnder.closest('#pool-container')) targetZone = document.getElementById('pool-container');
            }

            if (targetZone) {
                // マスにドロップした場合、既に文字があればプールに戻す
                if (targetZone.classList.contains('drop-slot') && targetZone.hasChildNodes()) {
                    pool.appendChild(targetZone.firstChild);
                }
                targetZone.appendChild(currentDragItem);
            }

            // 後始末
            if (ghostItem) document.body.removeChild(ghostItem);
            currentDragItem.style.opacity = '1';
            ghostItem = null;
            currentDragItem = null;
        });
    });
}

function updateGhostPosition(touch) {
    if (!ghostItem) return;
    ghostItem.style.left = (touch.clientX - ghostItem.offsetWidth / 2) + 'px';
    ghostItem.style.top = (touch.clientY - ghostItem.offsetHeight / 2) + 'px';
}


// 7. 答え合わせ
function checkAnswer() {
    const slots = document.querySelectorAll('.drop-slot');
    let attemptedReading = '';
    let isFull = true;

    slots.forEach(slot => {
        if (slot.firstChild) {
            attemptedReading += slot.firstChild.dataset.char;
        } else {
            isFull = false;
        }
    });

    const feedbackElement = document.getElementById('feedback');

    if (!isFull) {
        feedbackElement.textContent = 'すべてのマスに文字を入れてね！';
        feedbackElement.style.color = '#ff9f43';
        return;
    }

    if (attemptedReading === currentWord.reading) {
        playSound(SOUND_CORRECT_PATH);
        const result = checkAndAwardPoints(currentWord.id);
        
        let message = 'せいかい！✨';
        if (result === "scored") message += ' (+1 ポイント！)';
        
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
        feedbackElement.textContent = 'ざんねん...。もういちどやってみてね。';
        feedbackElement.style.color = '#ff6f61';
        incorrectCount += 1; 
        renderScoreTitleUpdate();
    }
}

// 7.5 スコア表示更新
function renderScoreTitleUpdate() {
    const titleElement = GAME_AREA_2.querySelector('h3');
    if (titleElement) {
        const scoreDisplay = `${correctCount}/${incorrectCount}`; 
        titleElement.textContent = `このイラストの言葉を完成させてね (${scoreDisplay})`;
    }
}

// 8. シャッフル関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 9. 初期化
function initializeDomElements() {
    MAIN_MENU_2 = document.getElementById('main-menu-2');
    GAME_AREA_2 = document.getElementById('game-area-2');
}

// 10. 実行
document.addEventListener('DOMContentLoaded', () => {
    initializeDomElements();
    loadWords();
});