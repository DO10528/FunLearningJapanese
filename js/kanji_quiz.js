document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 ---
    const DATA_URL = 'data/kanji.json'; // JSONファイルがある場合
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

    // Firebaseダミー (エラー防止)
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => false;
    }

    // --- 初期化 ---
    async function init() {
        // もしHTML側に直接 KANJI_DATA が書かれていればそれを使う
        if (typeof KANJI_DATA !== 'undefined') {
            kanjiData = KANJI_DATA;
            startQuiz();
            return;
        }

        // なければJSONを読みに行く
        try {
            const response = await fetch(DATA_URL);
            const data = await response.json();
            
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
            // データがない場合のフォールバック（テスト用データ）
            if (kanjiData.length === 0) {
                 kanjiDisplay.textContent = "Error";
                 resultMsg.textContent = "データを読み込めませんでした。";
            }
        }
    }

    // --- クイズ開始（リセット） ---
    function startQuiz() {
        // 現在のモードを取得
        modeRadios.forEach(r => { if(r.checked) currentMode = r.value; });

        // データチェック
        if (!kanjiData || kanjiData.length < CHOICES_COUNT) {
            resultMsg.textContent = "問題データが足りません。";
            return;
        }

        // ★ここで問題をシャッフル（ゲーム開始時のみ）
        currentQuestions = shuffleArray(kanjiData).slice(0, MAX_QUESTIONS);
        
        currentIndex = 0;
        score = 0;

        quizArea.style.display = 'block';
        scoreArea.style.display = 'none';
        ingameNav.style.display = 'flex';
        
        loadQuestion();
    }

    // --- ★修正箇所：モード切替（リセットしない） ---
    function switchMode(e) {
        // 正解演出中は切り替えない（バグ防止）
        if (isAnswering) {
            e.preventDefault(); 
            // ラジオボタンの見た目を元に戻す処理が必要ならここで行うが、
            // 複雑になるので今回は「演出が終わるまで待ってね」とするか、そのまま切り替える
            // ここでは「即時切り替え」を実装します。
        }

        // 新しいモードをセット
        currentMode = e.target.value;
        
        // ★重要：currentIndex（今の問題番号）や score（点数）はリセットせず、
        // 今の画面を再描画するだけにする
        loadQuestion();
    }

    // --- 問題表示 ---
    function loadQuestion() {
        if (currentIndex >= currentQuestions.length) {
            endGame();
            return;
        }

        const question = currentQuestions[currentIndex];
        
        // 回答中フラグをリセット（モード切替時などに必要）
        // ただし、「正解！」と出ている最中にモードを変えた場合は
        // 次の問題に進む処理が待機しているので、無理にリセットしないほうが良いが
        // シンプルにするため、モードを変えたら「回答待ち」状態に戻します
        if (!isAnswering) {
             resultMsg.textContent = '';
        }

        qNumEl.textContent = currentIndex + 1;
        kanjiDisplay.textContent = question.kanji || question.char; // プロパティ名の揺らぎ対応

        // 正解の読み方
        const rawReading = currentMode === 'kun' ? question.kun : question.on;
        const correctAnswer = formatReading(rawReading);

        // --- 選択肢の生成 ---
        
        // ダミー選択肢作成（自分以外の漢字から、今のモードの読みを取得）
        let pool = [];
        kanjiData.forEach(item => {
            const itemChar = item.kanji || item.char;
            const qChar = question.kanji || question.char;
            
            // 自分自身は除外
            if (itemChar === qChar) return;

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

        // もしダミー候補が足りなければ、固定のダミーを追加（エラー防止）
        while (pool.length < CHOICES_COUNT - 1) {
            pool.push("---");
        }

        // プールからランダムに選ぶ
        const wrongAnswers = shuffleArray(pool).slice(0, CHOICES_COUNT - 1);
        
        // 正解と混ぜる
        const options = shuffleArray([correctAnswer, ...wrongAnswers]);

        // ボタン配置
        choicesContainer.textContent = '';
        
        // ★もし正解演出中ならメッセージは消さない、そうでなければ消す
        if (!isAnswering) {
            resultMsg.textContent = '';
        }
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt;
            if (opt === "---" || opt === "") btn.disabled = true;
            
            // もし正解演出中にモードを変えた場合、ボタンは押せないようにしておく
            if (isAnswering) btn.disabled = true;

            btn.onclick = () => checkAnswer(btn, opt, correctAnswer, (question.kanji || question.char));
            choicesContainer.appendChild(btn);
        });
    }

    // 読み方の整形 (例: "うえ・あ" -> "うえ")
    function formatReading(str) {
        if (!str) return "";
        // 全角・半角スペース削除
        let s = str.replace(/[\s　]+/g, '');
        // ・で分割して最初だけ使う
        return s.split('・')[0].trim();
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
            // ポイント加算
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
            isAnswering = false; // フラグ解除
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

    // --- イベントリスナー設定 ---
    
    // ★修正: startQuizではなく、switchModeを呼ぶように変更
    modeRadios.forEach(r => r.addEventListener('change', switchMode));
    
    restartBtn.addEventListener('click', startQuiz);
    
    // 開始
    init();
});