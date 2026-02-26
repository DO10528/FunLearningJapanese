// --- グローバル関数の定義 (Androidでの読み込み順序対策) ---
window.showScreen = (id) => {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
};

// --- 音声初期化 (Android対策: エラー回避) ---
let synth = window.speechSynthesis;
let voices = [];
let SOUND_SEIKAI = null;
let SOUND_BUBU = null;

try {
    SOUND_SEIKAI = new Audio('assets/sounds/seikai.mp3');
    SOUND_BUBU = new Audio('assets/sounds/bubu.mp3');
} catch(e) { console.log("Audio init defer"); }

// --- ゲームデータ ---
const hiraganaData = [
    { id: 1, label: "あ", color: "#ff5252", chars: ['あ','い','う','え','お'] },
    { id: 2, label: "か", color: "#ff9800", chars: ['か','き','く','け','こ'] },
    { id: 3, label: "さ", color: "#fbc02d", chars: ['さ','し','す','せ','そ'] },
    { id: 4, label: "た", color: "#4caf50", chars: ['た','ち','つ','て','と'] },
    { id: 5, label: "な", color: "#2196f3", chars: ['な','に','ぬ','ね','の'] },
    { id: 6, label: "は", color: "#9c27b0", chars: ['は','ひ','ふ','へ','ほ'] },
    { id: 7, label: "ま", color: "#e91e63", chars: ['ま','み','む','め','も'] },
    { id: 8, label: "や", color: "#00bcd4", chars: ['や','ゆ','よ'] }, 
    { id: 9, label: "ら", color: "#795548", chars: ['ら','り','る','れ','ろ'] },
    { id: 10, label: "わ", color: "#607d8b", chars: ['わ','を','ん'] }
];

let currentLevel = null;
let placedCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    // ボイス読み込み
    if(synth) {
        synth.onvoiceschanged = () => { voices = synth.getVoices(); };
        setTimeout(() => { voices = synth.getVoices(); }, 500);
    }

    // --- 1. レベル画面生成 ---
    // ここで要素が確実に作られるようにする
    const levelGrid = document.getElementById('level-grid');
    if (levelGrid) {
        levelGrid.textContent = ''; // クリア
        hiraganaData.forEach(level => {
            const btn = document.createElement('div'); 
            btn.className = 'level-btn';
            btn.style.borderColor = level.color; 
            
            // 安全策: onclick属性ではなくJSでイベント設定
            btn.addEventListener('click', () => initPractice(level));
            
            btn.textContent = `
                <div class="level-char-icon" style="color:${level.color}">${level.label}</div>
                <div class="level-title">${level.label}行</div>
                <div class="level-tag" style="background:${level.color}">Level ${level.id}</div>
            `;
            levelGrid.appendChild(btn);
        });
    } else {
        console.error("Level grid not found");
    }

});

// --- 音声再生関数 ---
window.speak = (text) => {
    if (!synth) return;
    if (synth.speaking) synth.cancel();
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'ja-JP';
    utterThis.rate = 0.8; 
    
    // Android ChromeではgetVoicesが空の場合があるためフォールバック
    if(voices.length > 0) {
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        if (jpVoices.length > 0) utterThis.voice = jpVoices[0];
    }

    synth.speak(utterThis);
};

// --- 2. 練習モード ---
window.initPractice = (level) => {
    currentLevel = level;
    const container = document.getElementById('practice-container');
    container.textContent = '';
    level.chars.forEach(char => {
        const block = document.createElement('div');
        block.className = 'practice-block';
        block.textContent = char;
        block.onclick = () => window.speak(char);
        container.appendChild(block);
    });
    window.showScreen('practice-screen');
};

// --- 3. ゲーム開始 ---
window.startGame = () => {
    setupGameBoard(currentLevel);
    window.showScreen('game-screen');
};

function setupGameBoard(level) {
    const board = document.getElementById('game-board');
    board.textContent = '';
    document.getElementById('level-indicator').textContent = `Level ${level.id}`;
    document.getElementById('judge-msg').textContent = '';
    placedCount = 0;

    const leftChars = [...level.chars].sort(() => Math.random() - 0.5);
    const rightPairs = level.chars.map(char => ({ char: char })).sort(() => Math.random() - 0.5);

    const colLeft = document.createElement('div'); colLeft.className = 'col';
    const colCenter = document.createElement('div'); colCenter.className = 'col';
    const colRight = document.createElement('div'); colRight.className = 'col';

    leftChars.forEach(char => {
        const block = document.createElement('div');
        block.className = 'block char-source';
        block.textContent = char;
        block.dataset.char = char;
        setupDrag(block);
        colLeft.appendChild(block);
    });

    rightPairs.forEach(pair => {
        const slot = document.createElement('div');
        slot.className = 'block target-slot';
        slot.dataset.answer = pair.char;
        colCenter.appendChild(slot);

        const audioBtn = document.createElement('button');
        audioBtn.className = 'block audio-btn';
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        audioBtn.onclick = () => window.speak(pair.char);
        colRight.appendChild(audioBtn);
    });

    board.appendChild(colLeft);
    board.appendChild(colCenter);
    board.appendChild(colRight);
}

// --- ドラッグ&ドロップ ロジック (スマホ・PC両対応) ---
let dragItem = null;
let ghost = null;

function setupDrag(el) {
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, {passive: false});
}

function startDrag(e) {
    if (e.target.classList.contains('placeholder')) return;
    
    // Androidでのスクロール暴発防止
    if(e.type === 'touchstart') e.preventDefault();
    
    dragItem = e.target;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.textContent = dragItem.textContent;
    ghost.style.left = clientX + 'px';
    ghost.style.top = clientY + 'px';
    document.body.appendChild(ghost);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('touchend', onEnd);
}

function onMove(e) {
    if (!ghost) return;
    e.preventDefault(); // Androidスクロール防止
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ghost.style.left = clientX + 'px';
    ghost.style.top = clientY + 'px';
}

function onEnd(e) {
    if (!ghost) return;
    
    // タッチ終了時の座標取得
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    
    ghost.style.display = 'none'; // 一瞬消して下の要素を判定
    const elemBelow = document.elementFromPoint(clientX, clientY);
    
    const slot = elemBelow ? elemBelow.closest('.target-slot') : null;

    if (slot && !slot.hasChildNodes()) {
        placeChar(slot, dragItem.dataset.char);
        dragItem.classList.add('placeholder');
    }

    if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
    ghost = null;
    dragItem = null;
    
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    checkAllFilled();
}

function placeChar(slot, char) {
    const filledDiv = document.createElement('div');
    filledDiv.className = 'filled-char';
    filledDiv.textContent = char;
    filledDiv.dataset.char = char;
    
    filledDiv.onclick = () => {
        const sourceBlocks = document.querySelectorAll('.char-source');
        sourceBlocks.forEach(b => {
            if(b.dataset.char === char) b.classList.remove('placeholder');
        });
        slot.textContent = '';
        placedCount--;
    };
    
    slot.appendChild(filledDiv);
    placedCount++;
}

function checkAllFilled() {
    const total = currentLevel.chars.length;
    if (placedCount < total) return; 

    const slots = document.querySelectorAll('.target-slot');
    let allCorrect = true;

    slots.forEach(slot => {
        const answer = slot.dataset.answer;
        const filled = slot.querySelector('.filled-char');
        if (!filled || filled.dataset.char !== answer) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        if(SOUND_SEIKAI) { SOUND_SEIKAI.currentTime = 0; SOUND_SEIKAI.play().catch(e=>{}); }
        document.getElementById('judge-msg').textContent = "せいかい！つぎのレベルへ！";
        
        if(window.addPointsToUser) window.addPointsToUser(currentLevel.id, `level_${currentLevel.id}`);

        setTimeout(() => {
            const nextId = currentLevel.id + 1;
            if (nextId <= 10) {
                const nextLevel = hiraganaData.find(l => l.id === nextId);
                currentLevel = nextLevel;
                setupGameBoard(nextLevel);
            } else {
                window.showScreen('level-screen'); 
                alert("全レベルクリア！おめでとう！");
            }
        }, 3000);

    } else {
        if(SOUND_BUBU) { SOUND_BUBU.currentTime = 0; SOUND_BUBU.play().catch(e=>{}); }
    }
}