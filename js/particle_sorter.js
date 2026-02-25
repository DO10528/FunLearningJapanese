// --- 問題データセット ---
    const gameData = {
        'wa_o': {
            left: { label: "は", sub: "〜は (Topic)" },
            right: { label: "を", sub: "〜を (Object)" },
            questions: [
                { text: "わたし[ ]", sub: "I (Topic)", ans: "left" },
                { text: "りんご[ ]", sub: "Apple (Object)", ans: "right" },
                { text: "これ[ ]", sub: "This (Topic)", ans: "left" },
                { text: "みず[ ]", sub: "Water (Object)", ans: "right" },
                { text: "せんせい[ ]", sub: "Teacher (Topic)", ans: "left" },
                { text: "パン[ ]", sub: "Bread (Object)", ans: "right" }
            ]
        },
        'ni_de': {
            left: { label: "に", sub: "〜に (Time/Dest)" },
            right: { label: "で", sub: "〜で (Place/Tool)" },
            questions: [
                { text: "６じ[ ]", sub: "At 6 o'clock", ans: "left" },
                { text: "がっこう[ ]", sub: "At school (Action)", ans: "right" },
                { text: "うみ[ ]", sub: "To the sea", ans: "left" },
                { text: "バス[ ]", sub: "By bus", ans: "right" },
                { text: "ここ[ ]", sub: "Here (Exist)", ans: "left" },
                { text: "はし[ ]", sub: "With chopsticks", ans: "right" }
            ]
        },
        'no_mo': {
            left: { label: "の", sub: "〜の (Possession)" },
            right: { label: "も", sub: "〜も (Also)" },
            questions: [
                { text: "わたし[ ]", sub: "My...", ans: "left" },
                { text: "わたし[ ]", sub: "Me too", ans: "right" },
                { text: "にほん[ ]", sub: "Japan's...", ans: "left" },
                { text: "これ[ ]", sub: "This too", ans: "right" },
                { text: "あなた[ ]", sub: "Yours", ans: "left" },
                { text: "ねこ[ ]", sub: "Cat too", ans: "right" }
            ]
        },
        'ni_he': {
            left: { label: "に", sub: "〜に (To/At)" },
            right: { label: "へ", sub: "〜へ (Toward)" },
            questions: [
                { text: "いえ[ ]", sub: "To home", ans: "right" },
                { text: "あそこ[ ]", sub: "There (Exist)", ans: "left" },
                { text: "どこ[ ]", sub: "To where?", ans: "right" },
                { text: "ともだち[ ]", sub: "To friend (Give)", ans: "left" },
                { text: "かいしゃ[ ]", sub: "Toward office", ans: "right" }
            ]
        }
    };

    let currentMode = '';
    let questionQueue = [];
    let currentQ = null;
    let score = 0;
    
    // Firebase関数ダミー
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => false;
    }
    const POINTS_PER_QUESTION = 1;
    
    // DOM
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    const cardArea = document.getElementById('card-area');
    const labelLeft = document.getElementById('label-left');
    const subLeft = document.getElementById('sub-left');
    const labelRight = document.getElementById('label-right');
    const subRight = document.getElementById('sub-right');
    const scoreBadge = document.getElementById('score-badge');
    const feedback = document.getElementById('feedback');
    
    const sndCorrect = document.getElementById('snd-correct');
    const sndIncorrect = document.getElementById('snd-incorrect');

    function showMenu() {
        menuScreen.style.display = 'block';
        gameScreen.style.display = 'none';
    }

    function startGame(mode) {
        currentMode = mode;
        const data = gameData[mode];
        
        // UIセットアップ
        labelLeft.textContent = data.left.label;
        subLeft.textContent = data.left.sub;
        labelRight.textContent = data.right.label;
        subRight.textContent = data.right.sub;
        
        // 問題キュー作成（シャッフル）
        questionQueue = [...data.questions].sort(() => Math.random() - 0.5);
        score = 0;
        updateScore();
        
        menuScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        
        spawnCard();
    }

    function updateScore() {
        scoreBadge.textContent = `${score} / ${questionQueue.length + score}`; // 簡易表示
    }

    function spawnCard() {
        cardArea.textContent = ''; // クリア
        
        if (questionQueue.length === 0) {
            alert("クリア！おめでとう！");
            showMenu();
            return;
        }

        currentQ = questionQueue.pop();
        
        // カード生成
        const card = document.createElement('div');
        card.className = 'question-card popIn';
        // 穴埋め表示
        const htmlText = currentQ.text.replace('[ ]', '<span class="blank-box"></span>');
        
        card.textContent = `
            <div class="q-text">${htmlText}</div>
            <div class="q-sub">${currentQ.sub}</div>
        `;
        
        setupDrag(card);
        cardArea.appendChild(card);
    }

    // --- ドラッグ＆ドロップ ---
    let draggedItem = null;
    let ghost = null;
    let touchOffsetX, touchOffsetY;

    function setupDrag(el) {
        el.addEventListener('mousedown', startDrag);
        el.addEventListener('touchstart', startDrag, {passive: false});
    }

    function startDrag(e) {
        e.preventDefault();
        draggedItem = e.target.closest('.question-card');
        if(!draggedItem) return;

        const rect = draggedItem.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        touchOffsetX = clientX - rect.left;
        touchOffsetY = clientY - rect.top;

        // ゴースト生成
        ghost = draggedItem.cloneNode(true);
        ghost.classList.add('ghost');
        document.body.appendChild(ghost);
        moveGhost(clientX, clientY);

        draggedItem.style.opacity = '0'; // 元は見えなくする

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, {passive: false});
        document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        moveGhost(clientX, clientY);

        const target = getTargetBin(clientX, clientY);
        document.querySelectorAll('.bin').forEach(b => b.classList.remove('drag-over'));
        if (target) target.classList.add('drag-over');
    }

    function moveGhost(x, y) {
        if(ghost) {
            ghost.style.left = (x - touchOffsetX) + 'px';
            ghost.style.top = (y - touchOffsetY) + 'px';
        }
    }

    function onEnd(e) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const target = getTargetBin(clientX, clientY);

        if (target) {
            const chosenSide = target.dataset.target; // 'left' or 'right'
            checkAnswer(chosenSide);
        } else {
            // 元に戻る
            draggedItem.style.opacity = '1';
        }

        if(ghost) ghost.remove();
        ghost = null;
        draggedItem = null;
        document.querySelectorAll('.bin').forEach(b => b.classList.remove('drag-over'));
    }

    function getTargetBin(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        return el.closest('.bin');
    }

    // ★ async に変更
    async function checkAnswer(side) {
        if (side === currentQ.ans) {
            // 正解
            sndCorrect.currentTime = 0;
            sndCorrect.play();
            showFeedback(true);
            
            // ★★★ Firebaseポイント加算 ★★★
            // テキストをID代わりに
            await window.addPointsToUser(POINTS_PER_QUESTION, currentQ.text);
            // ★★★★★★★★★★★★★★★★★

            score++;
            updateScore();
            setTimeout(spawnCard, 600);
        } else {
            // 不正解
            sndIncorrect.currentTime = 0;
            sndIncorrect.play();
            showFeedback(false);
            // カードを戻す
            draggedItem.style.opacity = '1';
        }
    }

    function showFeedback(isCorrect) {
        feedback.className = 'feedback-overlay';
        if(isCorrect) {
            feedback.textContent = "○";
            feedback.classList.add('fb-correct');
        } else {
            feedback.textContent = "×";
            feedback.classList.add('fb-wrong');
        }
    }