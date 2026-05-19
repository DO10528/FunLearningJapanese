// データセット（英語 -> ます形）
    const verbData = {
        grp1: [
            { en: "Write", jp: "かきます" }, { en: "Listen", jp: "ききます" },
            { en: "Go", jp: "いきます" }, { en: "Swim", jp: "およぎます" },
            { en: "Drink", jp: "のみます" }, { en: "Read", jp: "よみます" },
            { en: "Rest", jp: "やすみます" }, { en: "Play", jp: "あそびます" },
            { en: "Buy", jp: "かいます" }, { en: "Meet", jp: "あいます" },
            { en: "Wait", jp: "まちます" }, { en: "Return", jp: "かえります" }
        ],
        grp2: [
            { en: "Eat", jp: "たべます" }, { en: "Sleep", jp: "ねます" },
            { en: "Give", jp: "あげます" }, { en: "Open", jp: "あけます" },
            { en: "Watch/See", jp: "みます" }, { en: "Wake up", jp: "おきます" },
            { en: "Can do", jp: "できます" }, { en: "Borrow", jp: "かります" }
        ],
        grp3: [
            { en: "Study", jp: "べんきょうします" }, { en: "Shop", jp: "かいものします" },
            { en: "Walk", jp: "さんぽします" }, { en: "Copy", jp: "コピーします" },
            { en: "Come", jp: "きます" }, { en: "Bring", jp: "もってきます" }
        ]
    };

    let currentQueue = [];
    let currentQ = null;
    let totalQ = 0;
    let answeredCount = 0;
    let earnedPoints = 0;
    const MAX_QUESTIONS = 10;
    
    // Firebase関数ダミー
    if (!(window.Antigravity && window.Antigravity.addPoint)) {
        
    }
    const POINTS_PER_QUESTION = 1;
    
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    const qText = document.getElementById('q-text');
    const input = document.getElementById('answer-input');
    const feedback = document.getElementById('feedback');
    const progressBar = document.getElementById('progress-bar');
    const qCard = document.getElementById('q-card');

    const sndCorrect = document.getElementById('snd-correct');
    const sndIncorrect = document.getElementById('snd-incorrect');

    function startGame(group) {
        // テーマカラーの変更
        let color = '#00bcd4';
        if(group === 'grp1') color = '#f48fb1';
        if(group === 'grp2') color = '#80deea';
        if(group === 'grp3') color = '#9575cd';
        qCard.style.borderColor = color;

        currentQueue = [...verbData[group]];
        // シャッフル
        currentQueue.sort(() => Math.random() - 0.5);
        
        // 最大10問に制限する
        if (currentQueue.length > MAX_QUESTIONS) {
            currentQueue = currentQueue.slice(0, MAX_QUESTIONS);
        }
        
        totalQ = currentQueue.length;
        answeredCount = 0;
        earnedPoints = 0;
        
        menuScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        
        nextQuestion();
    }

    function nextQuestion() {
        if (currentQueue.length === 0) {
            // 安全のためのフォールバック（通常はcheckAnswer内で遷移）
            if (window.Antigravity && window.Antigravity.showResultScreen) {
                window.Antigravity.showResultScreen(earnedPoints);
            } else {
                alert(`クリア！おめでとう！\nかくとくポイント: ${earnedPoints}`);
                location.reload();
            }
            return;
        }

        currentQ = currentQueue.pop();
        qText.textContent = currentQ.en;
        input.value = "";
        input.disabled = false;
        input.focus();
        feedback.textContent = "";
        
        // 進捗バー
        const percent = ((totalQ - currentQueue.length - 1) / totalQ) * 100;
        progressBar.style.width = percent + '%';
    }

    // 正解判定後の自動遷移ロジックの追加・防弾仕様の表記ゆれ対策
    function checkAnswer() {
        if (input.disabled) return; // 二重送信防止
        
        // 入力値と正解データを正規化（余分な空白削除、全角・半角差異の吸収、小文字化）
        const userVal = input.value.trim().replace(/　/g, "").replace(/\s+/g, "").toLowerCase();
        const correctVal = currentQ.jp.replace(/　/g, "").replace(/\s+/g, "").toLowerCase();
        
        if (userVal === correctVal) {
            // 正解
            input.disabled = true; // 遷移完了まで入力をロック
            
            sndCorrect.currentTime = 0;
            sndCorrect.play().catch(e => console.log('Audio play error:', e));
            
            // 視覚的な「丸（✔）」のフィードバックを表示
            feedback.style.color = "green";
            feedback.innerHTML = '<i class="fa-solid fa-check-circle" style="font-size: 1.5rem; margin-right: 8px; vertical-align: middle;"></i>せいかい！';

            answeredCount++;
            earnedPoints += POINTS_PER_QUESTION;

            // ポイント加算（エラーでブロックされないように非同期実行）
            try {
                if (window.Antigravity && window.Antigravity.addPoint) {
                    window.Antigravity.addPoint('verb_typing_masu', currentQ.en).catch(e => console.warn('Point track warning:', e));
                }
            } catch(e) {
                console.warn('Point track error:', e);
            }

            // 1.5秒後に次の問題またはリザルト画面へ遷移
            setTimeout(() => {
                if (answeredCount >= MAX_QUESTIONS || currentQueue.length === 0) {
                    if (window.Antigravity && window.Antigravity.showResultScreen) {
                        window.Antigravity.showResultScreen(earnedPoints);
                    } else {
                        alert(`クリア！おめでとう！\nかくとくポイント: ${earnedPoints}`);
                        location.reload();
                    }
                } else {
                    nextQuestion();
                }
            }, 1500);
            
        } else {
            // 不正解
            sndIncorrect.currentTime = 0;
            sndIncorrect.play().catch(e => console.log('Audio play error:', e));
            input.classList.add('shake');
            feedback.style.color = "red";
            feedback.textContent = `こたえ: ${currentQ.jp}`;
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    }

    // Enterキー対応
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });