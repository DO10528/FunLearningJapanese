document.addEventListener('DOMContentLoaded', () => {
    
    const synth = window.speechSynthesis;
    let voices = [];
    synth.onvoiceschanged = () => { voices = synth.getVoices(); };
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    const SOUND_SEIKAI = new Audio('assets/sounds/seikai.mp3');
    const SOUND_BUBU = new Audio('assets/sounds/bubu.mp3');

    // --- データ (カタカナに変更) ---
    const katakanaData = [
        { id: 1, label: "ア", chars: ['ア','イ','ウ','エ','オ'] },
        { id: 2, label: "カ", chars: ['カ','キ','ク','ケ','コ'] },
        { id: 3, label: "サ", chars: ['サ','シ','ス','セ','ソ'] },
        { id: 4, label: "タ", chars: ['タ','チ','ツ','テ','ト'] },
        { id: 5, label: "ナ", chars: ['ナ','ニ','ヌ','ネ','ノ'] },
        { id: 6, label: "ハ", chars: ['ハ','ヒ','フ','ヘ','ホ'] },
        { id: 7, label: "マ", chars: ['マ','ミ','ム','メ','モ'] },
        { id: 8, label: "ヤ", chars: ['ヤ','ユ','ヨ'] }, 
        { id: 9, label: "ラ", chars: ['ラ','リ','ル','レ','ロ'] },
        { id: 10, label: "ワ", chars: ['ワ','ヲ','ン'] }
    ];

    let currentLevel = null;
    let placedCount = 0;

    // --- 音声再生 ---
    function speak(text) {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 0.3; 
        utterThis.pitch = 1.0; 

        const femaleKeywords = ['Google', 'Microsoft', 'Kyoko', 'O-Ren', 'Haruka', 'Ayumi', 'Female'];
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        let targetVoice = null;
        for (const keyword of femaleKeywords) {
            targetVoice = jpVoices.find(v => v.name.includes(keyword));
            if (targetVoice) break;
        }
        if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
        if (targetVoice) utterThis.voice = targetVoice;

        synth.speak(utterThis);
    }

    // --- 画面切り替え ---
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    };

    // --- 1. レベル画面 ---
    const levelGrid = document.getElementById('level-grid');
    katakanaData.forEach(level => {
        const btn = document.createElement('button');
        btn.className = `level-btn lvl-${level.id}`;
        btn.textContent = `<div class="level-num">Level ${level.id}</div><div class="level-char">${level.label}</div>`;
        btn.onclick = () => initPractice(level);
        levelGrid.appendChild(btn);
    });

    // --- 2. 練習モード ---
    window.initPractice = (level) => {
        currentLevel = level;
        const container = document.getElementById('practice-container');
        container.textContent = '';
        level.chars.forEach(char => {
            const block = document.createElement('div');
            block.className = 'practice-block';
            block.textContent = char;
            block.onclick = () => speak(char);
            container.appendChild(block);
        });
        showScreen('practice-screen');
    };

    // --- 3. ゲーム開始 ---
    window.startGame = () => {
        setupGameBoard(currentLevel);
        showScreen('game-screen');
    };

    function setupGameBoard(level) {
        const board = document.getElementById('game-board');
        board.textContent = '';
        document.getElementById('level-indicator').textContent = `Level ${level.id}`;
        document.getElementById('judge-msg').textContent = '';
        placedCount = 0;

        // シャッフル
        const leftChars = [...level.chars].sort(() => Math.random() - 0.5);
        const rightPairs = level.chars.map(char => ({ char: char })).sort(() => Math.random() - 0.5);

        const colLeft = document.createElement('div'); colLeft.className = 'col';
        const colCenter = document.createElement('div'); colCenter.className = 'col';
        const colRight = document.createElement('div'); colRight.className = 'col';

        // 左: ドラッグ元
        leftChars.forEach(char => {
            const block = document.createElement('div');
            block.className = 'block char-source';
            block.textContent = char;
            block.dataset.char = char;
            setupDrag(block);
            colLeft.appendChild(block);
        });

        // 中 & 右
        rightPairs.forEach(pair => {
            // 中: 穴
            const slot = document.createElement('div');
            slot.className = 'block target-slot';
            slot.dataset.answer = pair.char;
            colCenter.appendChild(slot);

            // 右: 音声
            const audioBtn = document.createElement('button');
            audioBtn.className = 'block audio-btn';
            audioBtn.textContent = '<i class="fa-solid fa-volume-high"></i>';
            audioBtn.onclick = () => speak(pair.char);
            colRight.appendChild(audioBtn);
        });

        board.appendChild(colLeft);
        board.appendChild(colCenter);
        board.appendChild(colRight);
    }

    // --- ドラッグ&ドロップ ロジック ---
    let dragItem = null;
    let ghost = null;

    function setupDrag(el) {
        el.addEventListener('mousedown', startDrag);
        el.addEventListener('touchstart', startDrag, {passive: false});
    }

    function startDrag(e) {
        if (e.target.classList.contains('placeholder')) return;
        e.preventDefault();
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
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        ghost.style.left = clientX + 'px';
        ghost.style.top = clientY + 'px';
    }

    function onEnd(e) {
        if (!ghost) return;
        
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        
        ghost.style.display = 'none';
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

    // --- 判定ロジック ---
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
            SOUND_SEIKAI.currentTime = 0;
            SOUND_SEIKAI.play();
            document.getElementById('judge-msg').textContent = "せいかい！つぎのレベルへ！";
            
            if(window.addPointsToUser) window.addPointsToUser(currentLevel.id, `katakana_level_${currentLevel.id}`);

            setTimeout(() => {
                const nextId = currentLevel.id + 1;
                if (nextId <= 10) {
                    const nextLevel = katakanaData.find(l => l.id === nextId);
                    currentLevel = nextLevel;
                    setupGameBoard(nextLevel);
                } else {
                    showScreen('level-screen'); 
                    alert("全レベルクリア！おめでとう！");
                }
            }, 3000);

        } else {
            SOUND_BUBU.currentTime = 0;
            SOUND_BUBU.play();
        }
    }

});