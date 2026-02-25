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
    // Firebase関数ダミー
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => false;
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
        totalQ = currentQueue.length;
        
        menuScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        
        nextQuestion();
    }

    function nextQuestion() {
        if (currentQueue.length === 0) {
            alert("クリア！おめでとう！");
            location.reload();
            return;
        }

        currentQ = currentQueue.pop();
        qText.textContent = currentQ.en;
        input.value = "";
        input.focus();
        feedback.textContent = "";
        
        // 進捗バー
        const percent = ((totalQ - currentQueue.length - 1) / totalQ) * 100;
        progressBar.style.width = percent + '%';
    }

    // ★ async に変更
    async function checkAnswer() {
        const userVal = input.value.trim();
        
        if (userVal === currentQ.jp) {
            // 正解
            sndCorrect.currentTime = 0;
            sndCorrect.play();
            feedback.style.color = "green";
            feedback.textContent = "せいかい！";

            // ★Firebaseポイント加算
            await window.addPointsToUser(POINTS_PER_QUESTION, currentQ.en); // 英語をID代わりに

            setTimeout(nextQuestion, 800);
        } else {
            // 不正解
            sndIncorrect.currentTime = 0;
            sndIncorrect.play();
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