document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 ---
    const DATA_URL = 'data/kanji.json';
    const POINTS_PER_QUESTION = 1;
    const MAX_QUESTIONS = 10;
    const CHOICES_COUNT = 3;

    // --- 要素 ---
    const kanjiDisplay = document.getElementById('kanji-display');
    const choicesContainer = document.getElementById('choices-container');
    const qNumEl = document.getElementById('q-num');
    const resultMsg = document.getElementById('result-message');
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const scoreArea = document.getElementById('score-area');
    const quizArea = document.getElementById('quiz-area');
    const scoreText = document.getElementById('score-text');
    const restartBtn = document.getElementById('btn-restart');
    const ingameNav = document.getElementById('ingame-nav');
    
    const soundCorrect = document.getElementById('seikai-sound');
    const soundIncorrect = document.getElementById('bubu-sound');

    // --- 変数 ---
    let kanjiData = [];
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let currentMode = 'kun';
    let isAnswering = false; 

    // Firebaseダミー
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => false;
    }

    // --- 初期化 ---
    async function init() {
        try {
            const response = await fetch(DATA_URL);
            const data = await response.json();
            
            // データ形式の揺らぎに対応
            if (data.kanji_list) {
                kanjiData = data.kanji_list;
            } else if (Array.isArray(data)) {
                kanjiData = data;
            } else {
                throw new Error("データ形式エラー");
            }
            startQuiz();
        } catch (error) {
            console.error('読み込みエラー:', error);
            kanjiDisplay.textContent = "Error";
            resultMsg.textContent = "データを読み込めませんでした。";
        }
    }

    // --- クイズ開始 ---
    function startQuiz() {
        modeRadios.forEach(r => { if(r.checked) currentMode = r.value; });

        // 「なし」を除外し、読み方が存在するデータのみ抽出
        const validData = kanjiData.filter(item => {
            const r = currentMode === 'kun' ? item.kun : item.on;
            return r && r !== "なし" && r.trim() !== "";
        });

        if (validData.length < CHOICES_COUNT) {
            resultMsg.textContent = "問題データが足りません。";
            return;
        }

        // シャッフルして出題
        currentQuestions = shuffleArray(validData).slice(0, MAX_QUESTIONS);
        
        currentIndex = 0;
        score = 0;

        quizArea.style.display = 'block';
        scoreArea.style.display = 'none';
        ingameNav.style.display = 'flex';
        
        loadQuestion();
    }

    // --- 問題表示 ---
    function loadQuestion() {
        if (currentIndex >= currentQuestions.length) {
            endGame();
            return;
        }

        const question = currentQuestions[currentIndex];
        isAnswering = false;
        
        qNumEl.textContent = currentIndex + 1;
        kanjiDisplay.textContent = question.kanji;

        // 正解の読み方 (・より前を取得)
        const rawReading = currentMode === 'kun' ? question.kun : question.on;
        const correctAnswer = formatReading(rawReading);

        // ダミー選択肢作成
        // 全データから、今のモードで有効な読み方を収集
        let pool = [];
        kanjiData.forEach(item => {
            // 自分自身は除外
            if (item.kanji === question.kanji) return;

            const rRaw = currentMode === 'kun' ? item.kun : item.on;
            // 「なし」や空文字を除外
            if (rRaw && rRaw !== "なし" && rRaw.trim() !== "") {
                const rClean = formatReading(rRaw);
                // 重複してなければ追加
                if (rClean && rClean !== correctAnswer && !pool.includes(rClean)) {
                    pool.push(rClean);
                }
            }
        });

        // プールからランダムに2つ選ぶ
        const wrongAnswers = shuffleArray(pool).slice(0, CHOICES_COUNT - 1);
        
        // もしダミーが足りない場合の保険
        while (wrongAnswers.length < CHOICES_COUNT - 1) {
            wrongAnswers.push("---");
        }

        // 正解と混ぜる
        const options = shuffleArray([correctAnswer, ...wrongAnswers]);

        // ボタン配置
        choicesContainer.innerHTML = '';
        resultMsg.textContent = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt;
            if (opt === "---") btn.disabled = true; // 保険用
            
            btn.onclick = () => checkAnswer(btn, opt, correctAnswer, question.kanji);
            choicesContainer.appendChild(btn);
        });
    }

    // 読み方の整形 (例: "うえ・あ" -> "うえ")
    function formatReading(str) {
        if (!str) return "";
        return str.split('・')[0].trim();
    }

    // --- 答え合わせ ---
    async function checkAnswer(btn, selected, correct, kanjiId) {
        if (isAnswering) return;
        isAnswering = true;

        const allBtns = choicesContainer.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        if (selected === correct) {
            btn.classList.add('correct');
            resultMsg.textContent = "せいかい！";
            resultMsg.style.color = "var(--correct-color)";
            if(soundCorrect) { soundCorrect.currentTime = 0; soundCorrect.play(); }
            score++;
            // ポイント加算 (IDの代わりに漢字文字を使用)
            await window.addPointsToUser(POINTS_PER_QUESTION, kanjiId);
        } else {
            btn.classList.add('incorrect');
            resultMsg.textContent = `ざんねん… せいかいは「${correct}」`;
            resultMsg.style.color = "var(--incorrect-color)";
            if(soundIncorrect) { soundIncorrect.currentTime = 0; soundIncorrect.play(); }
            // 正解を表示
            allBtns.forEach(b => {
                if(b.textContent === correct) b.classList.add('correct');
            });
        }

        setTimeout(() => {
            currentIndex++;
            loadQuestion();
        }, 1500);
    }

    // --- 終了 ---
    function endGame() {
        quizArea.style.display = 'none';
        ingameNav.style.display = 'none';
        scoreArea.style.display = 'block';
        scoreText.textContent = score;
    }

    function shuffleArray(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    modeRadios.forEach(r => r.addEventListener('change', startQuiz));
    restartBtn.addEventListener('click', startQuiz);
    init();
});