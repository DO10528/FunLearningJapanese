// --- 音声合成の準備 ---
    const synth = window.speechSynthesis;
    let voices = [];
    synth.onvoiceschanged = () => { voices = synth.getVoices(); };

    function speak(text) {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        if (jpVoices.length > 0) utterThis.voice = jpVoices[0];
        
        synth.speak(utterThis);
    }

    // --- データ定義 (レベル分け) ---
    const hiraganaLevels = [
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

    let currentLevelChars = [];
    let currentIndex = 0;
    
    // --- UI要素 ---
    const levelGrid = document.getElementById('level-grid');
    const levelScreen = document.getElementById('level-screen');
    const dojoScreen = document.getElementById('dojo-screen');
    const dojoTitle = document.getElementById('dojo-title');
    const guideEl = document.getElementById('guide-char');
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');

    let isDrawing = false;
    let currentColor = '#333';
    let lineWidth = 12;

    // --- 初期化: レベルボタン生成 ---
    function initLevelMenu() {
        levelGrid.textContent = '';
        hiraganaLevels.forEach(level => {
            const btn = document.createElement('div');
            btn.className = 'level-btn';
            btn.style.borderColor = level.color;
            btn.innerHTML = `
                <div class="level-char-icon" style="color:${level.color}">${level.label}</div>
                <div class="level-title">${level.label}行</div>
                <div class="level-tag" style="background:${level.color}">Level ${level.id}</div>
            `;
            btn.onclick = () => startLevel(level);
            levelGrid.appendChild(btn);
        });
    }

    // --- ゲーム開始 (レベル選択後) ---
    function startLevel(levelData) {
        currentLevelChars = levelData.chars;
        currentIndex = 0;
        
        dojoTitle.textContent = `${levelData.label}行の れんしゅう`;
        
        levelScreen.classList.remove('active');
        dojoScreen.classList.add('active');
        
        // 画面切り替え後にキャンバスサイズ調整
        setTimeout(resizeCanvas, 50);
        
        updateGuide();
    }

    function showLevelScreen() {
        dojoScreen.classList.remove('active');
        levelScreen.classList.add('active');
    }

    // --- 描画ロジック ---
    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;
        
        // 設定のリセット
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = currentColor;
    }

    function updateGuide() {
        const char = currentLevelChars[currentIndex];
        guideEl.textContent = char;
        clearCanvas();
        // 自動で読み上げる場合はコメントアウトを外す
        // speak(char); 
    }

    window.speakCurrentChar = () => {
        const char = currentLevelChars[currentIndex];
        speak(char);
    };

    window.nextChar = () => {
        currentIndex++;
        if (currentIndex >= currentLevelChars.length) {
            // レベル終了時
            if(confirm("この行は おわりです！\nメニューに もどりますか？")) {
                showLevelScreen();
                return;
            } else {
                currentIndex = 0; // 最初に戻る
            }
        }
        updateGuide();
    };

    window.setColor = (color, el) => {
        currentColor = color;
        ctx.strokeStyle = currentColor;
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        el.classList.add('active');
    };

    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // --- ペン操作イベント ---
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDraw(e) {
        if(e.type === 'touchstart') e.preventDefault(); // キャンバス内のみスクロール防止
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        if(e.type === 'touchmove') e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function endDraw() {
        isDrawing = false;
        ctx.closePath();
    }

    // イベントリスナー登録
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    window.addEventListener('resize', resizeCanvas);

    // 起動
    initLevelMenu();