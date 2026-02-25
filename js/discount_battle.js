// --- ゲームデータ ---
    const products = [
        { name: "お弁当 (Bento)", icon: "🍱", prices: [400, 500, 600, 800, 1000] },
        { name: "お寿司 (Sushi)", icon: "🍣", prices: [800, 1000, 1200, 1500, 2000] },
        { name: "お肉 (Meat)", icon: "🥩", prices: [1000, 1500, 2000, 3000] },
        { name: "パン (Bread)", icon: "🍞", prices: [100, 150, 200, 300] },
        { name: "おにぎり (Onigiri)", icon: "🍙", prices: [100, 120, 150, 200] },
        { name: "ケーキ (Cake)", icon: "🍰", prices: [300, 400, 500, 600] },
        { name: "唐揚げ (Fried Chicken)", icon: "🍗", prices: [300, 400, 500] },
        { name: "刺身 (Sashimi)", icon: "🐟", prices: [500, 700, 1000, 1200] }
    ];

    let currentLevel = 1;
    let questionCount = 0;
    let score = 0;
    let correctPrice = 0;
    let currentInput = "";
    let isProcessing = false; // 連打防止用

    // --- 画面遷移 ---
    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        // フッター制御
        const footer = document.getElementById('footer-start');
        if(id === 'screen-practice') {
            footer.style.display = 'block';
        } else {
            footer.style.display = 'none';
        }
        window.scrollTo(0,0);
    }

    function goBack() {
        const activeId = document.querySelector('.screen.active').id;
        if (activeId === 'screen-level') showScreen('screen-practice');
        else if (activeId === 'screen-game') {
            if(confirm("ゲームをやめて戻りますか？")) showScreen('screen-level');
        }
        else if (activeId === 'screen-result') showScreen('screen-level');
        else window.location.href = 'index.html'; // メインメニューへ
    }

    // --- ゲームロジック ---
    function startGame(level) {
        currentLevel = level;
        questionCount = 0;
        score = 0;
        isProcessing = false;
        document.getElementById('current-level-display').innerText = level;
        showScreen('screen-game');
        nextQuestion();
    }

    function nextQuestion() {
        if (questionCount >= 10) {
            endGame();
            return;
        }

        questionCount++;
        isProcessing = false; // 入力ロック解除
        document.getElementById('q-current').innerText = questionCount;
        document.getElementById('progress-bar').style.width = `${(questionCount-1)*10}%`;
        clearInput();

        // 1. 商品決定
        const prod = products[Math.floor(Math.random() * products.length)];
        const basePrice = prod.prices[Math.floor(Math.random() * prod.prices.length)];

        // 2. 割引決定 (レベル別)
        let discountType = "";
        let discountValue = 0; // %単位
        let stickerMain = "";
        let stickerSub = "";
        
        if (currentLevel === 1) {
            // Level 1: 半額のみ (たまに簡単な10%など)
            if(Math.random() < 0.8) {
                discountType = "hangaku";
                stickerMain = "半額";
                stickerSub = "";
                discountValue = 50;
            } else {
                discountType = "percent";
                discountValue = 10;
                stickerMain = "10%"; stickerSub = "OFF";
            }
        } else if (currentLevel === 2) {
            // Level 2: 10%, 20%, 30%, 50%
            const opts = [10, 20, 30, 50];
            discountValue = opts[Math.floor(Math.random() * opts.length)];
            stickerMain = discountValue + "%"; stickerSub = "OFF";
            
            // 【修正箇所】カッコ {} を追加しました
            if(discountValue === 50 && Math.random() < 0.3) {
                stickerMain = "半額"; 
                stickerSub = "";
            }
        } else {
            // Level 3: 割引きも含む
            const mode = Math.random();
            if (mode < 0.4) {
                // 割
                const wari = Math.floor(Math.random() * 4) + 1; // 1~4割
                discountValue = wari * 10;
                stickerMain = wari + "割"; stickerSub = "引";
            } else if (mode < 0.7) {
                // 半額
                discountValue = 50;
                stickerMain = "半額";
                stickerSub = "";
            } else {
                // %
                const opts = [5, 10, 15, 20, 25, 30, 40];
                discountValue = opts[Math.floor(Math.random() * opts.length)];
                stickerMain = discountValue + "%"; stickerSub = "引";
            }
        }

        // 正解計算
        correctPrice = Math.floor(basePrice * (100 - discountValue) / 100);

        // 表示更新
        document.getElementById('product-icon').innerText = prod.icon;
        document.getElementById('product-name').innerText = prod.name;
        document.getElementById('original-price').innerText = basePrice;
        
        const stickerEl = document.getElementById('sticker-el');
        const mainEl = document.getElementById('sticker-main');
        const subEl = document.getElementById('sticker-sub');

        mainEl.innerText = stickerMain;
        subEl.innerText = stickerSub;

        // シールの色変え
        stickerEl.classList.remove('sticker-yellow');
        if (discountValue !== 50) { 
            if (Math.random() > 0.5) stickerEl.style.background = "radial-gradient(circle at 30% 30%, #fdd835, #fbc02d)";
            else stickerEl.style.background = "radial-gradient(circle at 30% 30%, #ff5252, #d32f2f)";
            
            if (stickerEl.style.background.includes('fdd835')) stickerEl.style.color = "#d32f2f";
            else stickerEl.style.color = "white";
        } else {
            stickerEl.style.background = "radial-gradient(circle at 30% 30%, #ff5252, #d32f2f)";
            stickerEl.style.color = "white";
        }
        
        // アニメーションリセット
        stickerEl.style.animation = 'none';
        stickerEl.offsetHeight; 
        stickerEl.style.animation = 'stickOn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }

    // --- 入力処理 ---
    function inputNum(n) {
        if (isProcessing) return; // 処理中は入力不可
        if (currentInput.length >= 6) return;
        currentInput += n;
        updateDisplay();
    }
    function clearInput() {
        if (isProcessing) return;
        currentInput = "";
        updateDisplay();
    }
    function backspace() {
        if (isProcessing) return;
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
    function updateDisplay() {
        const display = document.getElementById('user-input');
        display.innerText = currentInput;
    }

    function checkAnswer() {
        if (isProcessing) return; // 連打防止
        if (currentInput === "") return;
        
        isProcessing = true; // ロック開始
        const userVal = parseInt(currentInput);

        if (userVal === correctPrice) {
            score += 10;
            showFeedback(true);
        } else {
            showFeedback(false);
        }
    }

    function showFeedback(isCorrect) {
        const display = document.getElementById('user-input');
        
        if (isCorrect) {
            display.style.color = "#00e676";
            display.innerText = "⭕ " + currentInput;
            setTimeout(() => {
                display.style.color = "";
                nextQuestion();
            }, 800);
        } else {
            display.style.color = "#ff1744";
            // 間違いの時は、わかりやすく正解を表示
            display.innerText = "❌ " + correctPrice; 
            setTimeout(() => {
                display.style.color = "";
                nextQuestion();
            }, 1500);
        }
    }

    function endGame() {
        showScreen('screen-result');
        document.getElementById('final-score').innerText = score;
        const msg = document.getElementById('final-msg');
        const icon = document.getElementById('result-icon');
        
        if (score === 100) {
            msg.innerText = "パーフェクト！買い物マスターです！";
            icon.innerText = "🏆";
        } else if (score >= 80) {
            msg.innerText = "すごい！ほとんど正解です。";
            icon.innerText = "😎";
        } else if (score >= 50) {
            msg.innerText = "あと少し！練習しましょう。";
            icon.innerText = "👍";
        } else {
            msg.innerText = "もう一度チャレンジしよう！";
            icon.innerText = "💪";
        }
    }