// --- データセット (英語削除版) ---
    const signsData = {
        1: [ // 初級
            { id: 'stop', html: '<div class="sign-stop"></div>', en: 'Stop' },
            { id: 'exit', html: '<div class="sign-exit"><i class="fa-solid fa-person-running"></i><span>非常口</span></div>', en: 'Emergency Exit' },
            { id: 'toilet_m', html: '<div class="sign-toilet"><i class="fa-solid fa-person" style="color:#1976d2"></i></div>', en: 'Men\'s Room' },
            { id: 'toilet_f', html: '<div class="sign-toilet"><i class="fa-solid fa-person-dress" style="color:#d32f2f"></i></div>', en: 'Women\'s Room' },
            { id: 'no_entry', html: '<div class="sign-danger"><div class="sign-danger-inner">立入禁止</div></div>', en: 'Do Not Enter' },
            { id: 'danger', html: '<div class="sign-generic"><i class="fa-solid fa-triangle-exclamation"></i></div>', en: 'Danger' },
            { id: 'no_smoking', html: '<div class="sign-generic"><i class="fa-solid fa-ban"></i><i class="fa-solid fa-smoking" style="position:absolute; font-size:0.5em; color:#333;"></i></div>', en: 'No Smoking' },
            { id: 'sos', html: '<div class="sign-generic blue square" style="color:white; background:#1976d2; border:none;">SOS</div>', en: 'Emergency Button' }
        ],
        2: [ // 中級
            { id: 'open', html: '<div class="sign-wood">営業中</div>', en: 'Open' },
            { id: 'prep', html: '<div class="sign-wood" style="background:#5d4037;">準備中</div>', en: 'Closed / Prep' },
            // ↓ PUSH/PULLの英語を削除
            { id: 'push', html: '<div class="sign-generic square" style="border-color:#333; color:#333;">押</div>', en: 'Push' },
            { id: 'pull', html: '<div class="sign-generic square" style="border-color:#333; color:#333;">引</div>', en: 'Pull' },
            { id: 'parking', html: '<div class="sign-generic blue" style="border:none; background:#1976d2; color:white;">P</div>', en: 'Parking' },
            { id: 'elevator', html: '<div class="sign-generic square" style="border:none; background:#eee; color:#333;"><i class="fa-solid fa-elevator"></i></div>', en: 'Elevator' },
            { id: 'escalator', html: '<div class="sign-generic square" style="border:none; background:#eee; color:#333;"><i class="fa-solid fa-stairs"></i></div>', en: 'Escalator' },
            { id: 'checkout', html: '<div class="sign-generic square" style="border:none; background:#eee; color:#333;"><i class="fa-solid fa-cash-register"></i></div>', en: 'Cashier' }
        ],
        3: [ // 上級
            { id: 'no_photo', html: '<div class="sign-generic"><i class="fa-solid fa-ban"></i><i class="fa-solid fa-camera" style="position:absolute; font-size:0.5em; color:#333;"></i></div>', en: 'No Photography' },
            { id: 'no_shoes', html: '<div class="sign-generic"><i class="fa-solid fa-ban"></i><i class="fa-solid fa-shoe-prints" style="position:absolute; font-size:0.5em; color:#333;"></i></div>', en: 'Remove Shoes' },
            // ↓ Quietの英語を削除
            { id: 'quiet', html: '<div class="sign-generic square" style="border:3px solid #333; font-size:1.5em;">静かに</div>', en: 'Be Quiet' },
            { id: 'priority', html: '<div class="sign-generic blue"><i class="fa-solid fa-person-cane"></i></div>', en: 'Priority Seat' },
            { id: 'water', html: '<div class="sign-generic blue square" style="background:#1976d2; color:white; border:none;"><i class="fa-solid fa-faucet-drip"></i></div>', en: 'Drinking Water' },
            { id: 'trash', html: '<div class="sign-generic square" style="border:3px solid #333;"><i class="fa-solid fa-trash-can"></i></div>', en: 'Trash Can' },
            { id: 'no_litter', html: '<div class="sign-generic"><i class="fa-solid fa-ban"></i><i class="fa-solid fa-trash" style="position:absolute; font-size:0.5em; color:#333;"></i></div>', en: 'No Littering' }
        ],
        4: [ // 最上級
            { id: 'onsen', html: '<div class="sign-generic" style="border:none; color:#d32f2f;"><i class="fa-solid fa-hot-tub-person"></i></div>', en: 'Hot Spring' },
            { id: 'post', html: '<div class="sign-generic" style="border:none; color:#d32f2f; font-weight:900;">〒</div>', en: 'Post Office' },
            { id: 'koban', html: '<div class="sign-generic" style="border:none; color:#333;"><i class="fa-solid fa-building-shield"></i></div>', en: 'Police Box' },
            { id: 'temple', html: '<div class="sign-generic" style="border:none; color:#333;">卍</div>', en: 'Temple' },
            { id: 'shrine', html: '<div class="sign-generic" style="border:none; color:#333;"><i class="fa-solid fa-torii-gate"></i></div>', en: 'Shrine' },
            { id: 'construction', html: '<div class="sign-generic square" style="background:#fdd835; border:3px solid #333;">工事中</div>', en: 'Construction' },
            { id: 'atm', html: '<div class="sign-generic square" style="background:#00c853; color:white; border:none;">ATM</div>', en: 'ATM' }
        ]
    };

    let currentLevel = 1;
    let questionList = [];
    let currentIndex = 0;
    let score = 0;
    let timerInterval = null;
    let timeLeft = 5000; // ms
    const TIME_LIMIT = 5000;

    // --- 初期化：練習リスト生成 ---
    function initPractice() {
        const container = document.getElementById('practice-container');
        container.textContent = '';
        
        for(let l=1; l<=4; l++) {
            signsData[l].forEach(item => {
                const div = document.createElement('div');
                div.className = 'practice-item';
                div.textContent = `
                    <div style="height:100px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                        <div style="transform:scale(0.5);">${item.html}</div>
                    </div>
                    <div class="practice-label">${item.en}</div>
                `;
                container.appendChild(div);
            });
        }
    }

    // --- 画面遷移 (修正：戻る挙動) ---
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        const footer = document.getElementById('footer-start');
        footer.style.display = (id === 'screen-practice') ? 'block' : 'none';
        window.scrollTo(0,0);
    };

    window.goBack = () => {
        const activeId = document.querySelector('.screen.active').id;
        if (activeId === 'screen-level') {
            showScreen('screen-practice');
        } 
        else if (activeId === 'screen-game') {
            // ダイアログなしで即座にレベル選択へ戻る
            clearInterval(timerInterval);
            showScreen('screen-level'); 
        }
        else if (activeId === 'screen-result') {
            showScreen('screen-level');
        }
        else {
            window.location.href = 'index.html';
        }
    };

    // --- ゲームロジック ---
    window.startGame = (level) => {
        currentLevel = level;
        const source = signsData[level] || signsData[1];
        questionList = [];
        for(let i=0; i<10; i++) {
            questionList.push(source[Math.floor(Math.random() * source.length)]);
        }
        
        currentIndex = 0;
        score = 0;
        showScreen('screen-game');
        nextQuestion();
    };

    function nextQuestion() {
        if (currentIndex >= 10) {
            endGame();
            return;
        }

        const q = questionList[currentIndex];
        document.getElementById('q-current').textContent = currentIndex + 1;
        
        document.getElementById('sign-display').textContent = q.html;

        // 誤答生成
        let allSigns = [];
        for(let l=1; l<=4; l++) allSigns = allSigns.concat(signsData[l]);
        
        const others = allSigns.filter(s => s.id !== q.id);
        const wrongOpts = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        let options = [q, ...wrongOpts];
        options.sort(() => 0.5 - Math.random());

        const btnContainer = document.getElementById('choice-container');
        btnContainer.textContent = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-choice';
            // 選択肢は英語のみに変更
            btn.textContent = opt.en;
            btn.onclick = () => checkAnswer(opt.id === q.id);
            btnContainer.appendChild(btn);
        });

        startTimer();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = TIME_LIMIT;
        const bar = document.getElementById('timer-bar');
        bar.style.width = '100%';
        bar.classList.remove('danger');

        timerInterval = setInterval(() => {
            timeLeft -= 100;
            const pct = (timeLeft / TIME_LIMIT) * 100;
            bar.style.width = pct + '%';
            
            if(pct < 30) bar.classList.add('danger');

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkAnswer(false);
            }
        }, 100);
    }

    function checkAnswer(isCorrect) {
        clearInterval(timerInterval);
        
        const fb = document.getElementById('feedback');
        fb.textContent = isCorrect ? '⭕' : '❌';
        fb.style.color = isCorrect ? '#00e676' : '#ef5350';
        fb.style.animation = 'none';
        fb.offsetHeight; 
        fb.style.animation = 'popFeedback 0.6s ease';

        if(isCorrect) score++;

        setTimeout(() => {
            currentIndex++;
            nextQuestion();
        }, 600);
    }

    function endGame() {
        showScreen('screen-result');
        document.getElementById('final-score').textContent = score;
        
        const msg = document.getElementById('result-msg');
        if(score === 10) msg.textContent = "Perfect! You survived!";
        else if(score >= 8) msg.textContent = "Great job!";
        else if(score >= 5) msg.textContent = "Good. Keep practicing.";
        else msg.textContent = "Danger! Study more!";
    }

    initPractice();