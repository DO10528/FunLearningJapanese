// --- 設定 ---
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const guideEl = document.getElementById('guide-char');
    
    // ★カタカナリストに変更
    const chars = [
        "ア","イ","ウ","エ","オ",
        "カ","キ","ク","ケ","コ",
        "サ","シ","ス","セ","ソ",
        "タ","チ","ツ","テ","ト",
        "ナ","ニ","ヌ","ネ","ノ",
        "ハ","ヒ","フ","ヘ","ホ",
        "マ","ミ","ム","メ","モ",
        "ヤ","ユ","ヨ",
        "ラ","リ","ル","レ","ロ",
        "ワ","ヲ","ン"
    ];
    let currentIndex = 0;
    let isDrawing = false;
    let currentColor = '#333';
    let lineWidth = 12; 

    // --- 初期化 ---
    function init() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = currentColor;

        updateGuide();
    }

    // --- ガイド文字の更新 ---
    function updateGuide() {
        guideEl.textContent = chars[currentIndex];
        clearCanvas(); 
    }

    // --- 次の文字へ ---
    function nextChar() {
        currentIndex++;
        if (currentIndex >= chars.length) {
            currentIndex = 0; 
        }
        updateGuide();
    }

    // --- 色の変更 ---
    window.setColor = (color, el) => {
        currentColor = color;
        ctx.strokeStyle = currentColor;
        
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        el.classList.add('active');
    };

    // --- キャンバスをクリア ---
    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // --- 描画イベント処理 ---
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
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function endDraw() {
        isDrawing = false;
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    window.onload = init;
    window.addEventListener('resize', init);