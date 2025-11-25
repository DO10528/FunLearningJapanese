document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 ---
    const DATA_URL = 'data/kanji.json';
    const POINTS_PER_QUESTION = 1;
    const MAX_QUESTIONS = 10; // 1回のプレイでの出題数
    const CHOICES_COUNT = 3;  // 選択肢の数

    // --- 要素の取得 ---
    const kanjiDisplay = document.getElementById('kanji-display');
    const choicesContainer = document.getElementById('choices-container');
    const qNumEl = document.getElementById('q-num');
    const resultMsg = document.getElementById('result-message');
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const scoreArea = document.getElementById('score-area');
    const quizArea = document.getElementById('quiz-area');
    const scoreText = document.getElementById('score-text');
    const restartBtn = document.getElementById('btn-restart');
    
    // 効果音
    const soundCorrect = document.getElementById('seikai-sound');
    const soundIncorrect = document.getElementById('bubu-sound');

    // --- 状態変数 ---
    let kanjiData = [];
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let currentMode = 'kun'; // 'kun' or 'on'
    let isAnswering = false; 

    // Firebase関数ダミー
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => false;
    }

    // --- 初期化 ---
    async function init() {
        try {
            const response = await fetch(DATA_URL);
            const data = await response.json();
            
            // データ構造チェック：もし kanji_list がなければ data そのものを使うなどの保険
            if (data.kanji_list) {
                kanjiData = data.kanji_list;
            } else if (Array.isArray(data)) {
                kanjiData = data;
            } else {
                throw new Error("データの形式が正しくありません");
            }

            console.log("読み込んだデータ数:", kanjiData.length); // デバッグ用

            startQuiz();
        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
            kanjiDisplay.textContent = "Error";
            resultMsg.textContent = "データを読み込めませんでした。";
        }
    }

    // --- クイズ開始処理 ---
    function startQuiz() {
        // 現在のモードを取得
        modeRadios.forEach(r => { if(r.checked) currentMode = r.value; });

        // データが十分にあるか確認
        if (!kanjiData || kanjiData.length < CHOICES_COUNT) {
            resultMsg.textContent = "データが足りません (3つ以上必要です)";
            return;
        }

        // モードに適したデータがあるものだけフィルタリング
        const validData = kanjiData.filter(item => {
            const readings = currentMode === 'kun' ? item.kun : item.on;
            return readings && readings.length > 0;
        });

        if (validData.length === 0) {
            kanjiDisplay.textContent = "？";
            resultMsg.textContent = "このモードの問題がありません。";
            return;
        }

        // シャッフルして問題を選出
        currentQuestions = shuffleArray(validData).slice(0, MAX_QUESTIONS);
        
        currentIndex = 0;
        score = 0;

        // UIリセット
        quizArea.style.display = 'block';
        scoreArea.style.display = 'none';
        restartBtn.style.display = 'none';
        
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
        
        // 問題番号
        qNumEl.textContent = currentIndex + 1;
        
        // 漢字表示
        kanjiDisplay.textContent = question.kanji;

        // --- 正解の読み方 ---
        const rawReading = currentMode === 'kun' ? question.kun : question.on;
        // 「ひと・つ」→「ひと」のように整形
        const correctAnswer = formatReading(rawReading);

        // --- ダミー選択肢の作成 (修正版) ---
        // 全ての漢字データから、今回の正解以外の読み方を集める
        let allOtherReadings = [];
        
        kanjiData.forEach(item => {
            // 自分（正解の漢字）はスキップ
            if (item.id === question.id) return;

            const rRaw = currentMode === 'kun' ? item.kun : item.on;
            if (rRaw) {
                const rClean = formatReading(rRaw);
                // 空でなく、かつ正解と同じ読み方でなければリストに追加
                if (rClean && rClean !== correctAnswer) {
                    allOtherReadings.push(rClean);
                }
            }
        });

        // 重複を消す
        const uniqueReadings = Array.from(new Set(allOtherReadings));
        
        // シャッフルして2つ選ぶ
        const wrongAnswers = shuffleArray(uniqueReadings).slice(0, CHOICES_COUNT - 1);
        
        // もしデータ不足などでダミーが足りない場合の保険
        while (wrongAnswers.length < CHOICES_COUNT - 1) {
            wrongAnswers.push("---"); // 空のダミー
        }

        // 正解とダミーを混ぜる
        const options = shuffleArray([correctAnswer, ...wrongAnswers]);

        // --- ボタン生成 ---
        choicesContainer.innerHTML = '';
        resultMsg.textContent = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt;
            
            // ダミーテキスト("---")なら押せないようにする（通常は起きないはず）
            if (opt === "---") btn.disabled = true;

            btn.onclick = () => checkAnswer(btn, opt, correctAnswer, question.id);
            choicesContainer.appendChild(btn);
        });
    }

    // 読み方を整形するヘルパー関数
    function formatReading(rawText) {
        if (!rawText) return "";
        // 「・」で区切られた最初の部分を取り出し、「.」以降（ローマ字など）があれば消す
        return rawText.split('・')[0].replace(/\..*$/, '');
    }

    // --- 答え合わせ ---
    async function checkAnswer(btn, selected, correct, kanjiId) {
        if (isAnswering) return;
        isAnswering = true;

        // 全ボタンを無効化
        const allBtns = choicesContainer.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        if (selected === correct) {
            // 正解
            btn.classList.add('correct');
            resultMsg.textContent = "せいかい！";
            resultMsg.style.color = "var(--correct-color)";
            if(soundCorrect) { soundCorrect.currentTime = 0; soundCorrect.play(); }
            score++;

            // ★Firebaseポイント加算
            await window.addPointsToUser(POINTS_PER_QUESTION, kanjiId);

        } else {
            // 不正解
            btn.classList.add('incorrect');
            resultMsg.textContent = `ざんねん… せいかいは「${correct}」`;
            resultMsg.style.color = "var(--incorrect-color)";
            if(soundIncorrect) { soundIncorrect.currentTime = 0; soundIncorrect.play(); }

            // 正解ボタンを教えてあげる
            allBtns.forEach(b => {
                if(b.textContent === correct) b.classList.add('correct');
            });
        }

        // 次へ進むタイマー
        setTimeout(() => {
            currentIndex++;
            loadQuestion();
        }, 1500);
    }

    // --- ゲーム終了 ---
    function endGame() {
        quizArea.style.display = 'none';
        scoreArea.style.display = 'block';
        scoreText.textContent = score;
        restartBtn.style.display = 'inline-block';
    }

    // --- ユーティリティ: 配列シャッフル ---
    function shuffleArray(array) {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    // --- イベントリスナー ---
    modeRadios.forEach(r => r.addEventListener('change', startQuiz));
    restartBtn.addEventListener('click', startQuiz);

    // 開始
    init();
});