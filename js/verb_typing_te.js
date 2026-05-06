// データセット（ます形 -> て形）
    const verbData = {
        grp1: [
            { masu: "かきます", te: "かいて" }, { masu: "ききます", te: "きいて" },
            { masu: "いきます", te: "いって" }, { masu: "およぎます", te: "およいで" },
            { masu: "のみます", te: "のんで" }, { masu: "よみます", te: "よんで" },
            { masu: "あそびます", te: "あそんで" }, { masu: "かいます", te: "かって" },
            { masu: "あいます", te: "あって" }, { masu: "まちます", te: "まって" },
            { masu: "もちます", te: "もって" }, { masu: "かえります", te: "かえって" },
            { masu: "はなします", te: "はなして" }
        ],
        grp2: [
            { masu: "たべます", te: "たべて" }, { masu: "ねます", te: "ねて" },
            { masu: "あげます", te: "あげて" }, { masu: "あけます", te: "あけて" },
            { masu: "みます", te: "みて" }, { masu: "おきます", te: "おきて" },
            { masu: "かります", te: "かりて" }, { masu: "できます", te: "できて" }
        ],
        grp3: [
            { masu: "べんきょうします", te: "べんきょうして" }, { masu: "かいものします", te: "かいものして" },
            { masu: "さんぽします", te: "さんぽして" }, { masu: "きます", te: "きて" },
            { masu: "もってきます", te: "もってきて" }
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
        let color = '#ff9800';
        if(group === 'grp1') color = '#f48fb1';
        if(group === 'grp2') color = '#80deea';
        if(group === 'grp3') color = '#9575cd';
        qCard.style.borderColor = color;

        currentQueue = [...verbData[group]];
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
        qText.textContent = currentQ.masu;
        input.value = "";
        input.focus();
        feedback.textContent = "";
        
        const percent = ((totalQ - currentQueue.length - 1) / totalQ) * 100;
        progressBar.style.width = percent + '%';
    }

    // ★ async に変更
    async function checkAnswer() {
        const userVal = input.value.trim();
        
        if (userVal === currentQ.te) {
            sndCorrect.currentTime = 0;
            sndCorrect.play();
            feedback.style.color = "green";
            feedback.textContent = "せいかい！";

            // ★Firebaseポイント加算
            await window.addPointsToUser(POINTS_PER_QUESTION, currentQ.masu); // ます形をID代わりに

            setTimeout(nextQuestion, 800);
        } else {
            sndIncorrect.currentTime = 0;
            sndIncorrect.play();
            input.classList.add('shake');
            feedback.style.color = "red";
            feedback.textContent = `こたえ: ${currentQ.te}`;
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });