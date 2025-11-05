document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義
    // ----------------------------------------------------
    const skyArea = document.getElementById('sky-area');
    const quizModal = document.getElementById('quiz-modal');
    const groundArea = document.getElementById('ground-area');
    const questionTextElement = document.getElementById('question-text');
    const choiceButtonsArea = document.getElementById('choice-buttons-area');
    const quizFeedback = document.getElementById('quiz-feedback');
    const scoreDisplay = document.getElementById('score');
    const lifeDisplay = document.getElementById('life');
    const explosionTemplate = document.getElementById('explosion-template');

    // ----------------------------------------------------
    // ゲーム定数と状態
    // ----------------------------------------------------
    const INITIAL_LIFE = 3;
    const METEOR_INTERVAL = 1500; // 1.5秒ごとに隕石生成
    let gameInterval = null;
    let meteorSpeed = 1; // 初期落下速度 (ピクセル/フレーム)
    let score = 0;
    let life = INITIAL_LIFE;
    let isModalOpen = false;        // モーダルが開いているか
    let currentMeteorElement = null; // 現在クリックされた隕石要素
    let currentQuizData = null;      // 現在の問題データ

    // ★★★ 問題データ (日本語、英語、画像、不正解の選択肢) ★★★
    // 以前の単語リストを元に作成
    const QUIZ_DATA = [
        { word: "いぬ", english: "Dog", image: "inu.png", choices: ["Dog", "Cat", "Bird", "Mouse"] },
        { word: "ねこ", english: "Cat", image: "neko.png", choices: ["Cat", "Rabbit", "Fox", "Wolf"] },
        { word: "りんご", english: "Apple", image: "ringo.png", choices: ["Apple", "Banana", "Orange", "Grape"] },
        { word: "さかな", english: "Fish", image: "sakana.png", choices: ["Fish", "Crab", "Squid", "Whale"] },
        { word: "たまご", english: "Egg", image: "tamago.png", choices: ["Egg", "Cheese", "Milk", "Bread"] },
        { word: "つくえ", english: "Desk", image: "tsukue.png", choices: ["Desk", "Chair", "Table", "Bed"] },
        { word: "くるま", english: "Car", image: "kuruma.png", choices: ["Car", "Bus", "Train", "Plane"] },
        { word: "はさみ", english: "Scissors", image: "hasami.png", choices: ["Scissors", "Knife", "Tool", "Ruler"] },
        { word: "ひこうき", english: "Airplane", image: "hikoki.png", choices: ["Airplane", "Helicopter", "Rocket", "Boat"] },
        { word: "めがね", english: "Glasses", image: "megane.png", choices: ["Glasses", "Watch", "Ring", "Hat"] },
        { word: "やま", english: "Mountain", image: "yama.png", choices: ["Mountain", "River", "Forest", "Sea"] },
        { word: "ゆき", english: "Snow", image: "yuki.png", choices: ["Snow", "Rain", "Ice", "Cloud"] },
    ];

    // ----------------------------------------------------
    // ユーティリティ関数
    // ----------------------------------------------------

    /**
     * 配列をシャッフルする
     */
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    /**
     * 爆発アニメーションを生成し再生する
     */
    function triggerExplosion(x, y, isGroundHit = false) {
        const explosion = explosionTemplate.cloneNode(true);
        explosion.classList.remove('hidden');
        explosion.id = '';

        // 地面ヒットは赤、プレイヤーのミスは黄色の爆発
        explosion.style.backgroundColor = isGroundHit ? 'orange' : 'yellow';

        explosion.style.left = `${x - 25}px`;
        explosion.style.top = `${y - 25}px`;
        explosion.style.animation = 'explode 0.5s forwards';

        skyArea.appendChild(explosion);

        explosion.addEventListener('animationend', () => {
            explosion.remove();
        });
    }

    // ----------------------------------------------------
    // 隕石の生成と落下処理
    // ----------------------------------------------------

    /**
     * 新しい隕石を生成する
     */
    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        
        // 画面上部ランダムなX位置
        const startX = Math.random() * (skyArea.offsetWidth - 50); // 隕石の幅(50px)を考慮
        meteor.style.left = `${startX}px`;
        meteor.style.top = `-50px`; // 初期位置
        
        // 問題データをランダムに割り当てる
        const quizIndex = Math.floor(Math.random() * QUIZ_DATA.length);
        meteor.dataset.quizIndex = quizIndex;
        
        // 隕石に問題のテキストを表示する行を削除しました
        // meteor.textContent = QUIZ_DATA[quizIndex].word; 

        // クリックイベントを設定
        meteor.addEventListener('click', handleMeteorClick);
        
        skyArea.appendChild(meteor);
    }

    /**
     * 落下アニメーションループ
     */
    function fallLoop() {
        if (life <= 0) return;
        
        const allMeteors = document.querySelectorAll('.meteor');
        const groundY = skyArea.offsetHeight;

        allMeteors.forEach(meteor => {
            // モーダルが開いている間は落下を停止
            if (isModalOpen) return;

            let currentY = parseFloat(meteor.style.top);
            currentY += meteorSpeed;
            meteor.style.top = `${currentY}px`;

            // 地面に到達したら
            if (currentY + meteor.offsetHeight >= groundY) {
                // 地面に到達した隕石を爆発させる
                const meteorX = meteor.offsetLeft + meteor.offsetWidth / 2;
                triggerExplosion(meteorX, groundY, true); // 地面ヒット爆発
                
                // ライフを減らす
                updateLife(-1);
                
                // 隕石を削除
                meteor.remove();
            }
        });

        // 隕石の落下速度を時間と共に少し上げる（難易度調整）
        meteorSpeed = Math.min(4, 1 + score / 500); 
        
        requestAnimationFrame(fallLoop);
    }

    // ----------------------------------------------------
    // イベントハンドラ
    // ----------------------------------------------------

    /**
     * 隕石がクリックされたときの処理
     */
    function handleMeteorClick(e) {
        if (isModalOpen) return;
        
        isModalOpen = true; // モーダルオープンフラグを立てる
        currentMeteorElement = e.target;
        
        // クリックされた隕石のデータを取得
        const quizData = QUIZ_DATA[currentMeteorElement.dataset.quizIndex];
        currentQuizData = quizData;

        // 隕石を画面から非表示にする（クイズ中は消える）
        currentMeteorElement.style.display = 'none';

        showQuizModal(currentQuizData);
    }

    /**
     * クイズモーダルを表示し、問題を設定する
     */
    function showQuizModal(data) {
        // 問題文: 隕石の日本語単語を表示
        questionTextElement.textContent = `この単語の英語は？`;

        // 画像の代わりに日本語単語を大きく表示する
        document.getElementById('quiz-image-area').innerHTML = 
            `<p style="font-size: 3em; color: #ff6f61; font-weight: bold; margin-bottom: 20px;">${data.word}</p>`;

        // 選択肢の準備: 正解1つ + 不正解1つ
        choiceButtonsArea.innerHTML = '';
        
        const correct = data.english; // 正解
        
        // 不正解の選択肢のプール: 正解と重複しないもの
        const incorrects = data.choices.filter(c => c !== correct);
        
        // 常に2つの選択肢のみを格納する配列
        const finalChoices = [correct]; 
        
        // 不正解な選択肢をランダムに1つ選ぶ (選択肢のプールがある場合)
        if (incorrects.length > 0) {
             const randomIndex = Math.floor(Math.random() * incorrects.length);
             finalChoices.push(incorrects[randomIndex]);
        }
        
        // 最終選択肢をシャッフルしてボタンを生成
        shuffleArray(finalChoices).forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.dataset.answer = choice;
            button.addEventListener('click', handleChoiceClick);
            choiceButtonsArea.appendChild(button);
        });
        
        quizFeedback.textContent = '答えを選んでください。';
        quizModal.classList.remove('hidden');
    }

    // (他の関数はそのまま)

    /**
     * 選択肢がクリックされたときの処理
     */
    function handleChoiceClick(e) {
        const selectedAnswer = e.target.dataset.answer;
        
        // 全ボタンを無効化
        document.querySelectorAll('#choice-buttons-area button').forEach(btn => btn.disabled = true);

        const meteorX = currentMeteorElement.offsetLeft + currentMeteorElement.offsetWidth / 2;
        const meteorY = currentMeteorElement.offsetTop + currentMeteorElement.offsetHeight / 2;

        if (selectedAnswer === currentQuizData.english) {
            // 正解
            quizFeedback.textContent = '⭕ 正解！隕石破壊！';
            e.target.style.backgroundColor = 'lightgreen';
            updateScore(10);
            
            // 隕石の消滅アニメーション（黄色い爆発）
            triggerExplosion(meteorX, meteorY, false); 
            currentMeteorElement.remove();

        } else {
            // 不正解
            quizFeedback.textContent = '❌ 不正解... 隕石が爆発！';
            e.target.style.backgroundColor = 'red';
            updateLife(-1);
            
            // 不正解による爆発（赤い爆発）
            triggerExplosion(meteorX, meteorY, true); 
            currentMeteorElement.remove();
        }

        // モーダルを閉じる
        setTimeout(() => {
            quizModal.classList.add('hidden');
            isModalOpen = false; // モーダルオープンフラグを戻す
        }, 1000);
    }

    // ----------------------------------------------------
    // スコアとライフの更新
    // ----------------------------------------------------

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
    }

    function updateLife(change) {
        life += change;
        lifeDisplay.textContent = Math.max(0, life);

        if (life <= 0) {
            endGame();
        }
    }
    
    // ----------------------------------------------------
    // ゲームの開始と終了
    // ----------------------------------------------------

    function startGame() {
        score = 0;
        life = INITIAL_LIFE;
        meteorSpeed = 1;
        scoreDisplay.textContent = score;
        lifeDisplay.textContent = life;
        skyArea.innerHTML = ''; 

        // 隕石生成インターバルを開始
        gameInterval = setInterval(createMeteor, METEOR_INTERVAL);
        
        // 落下ループを開始
        requestAnimationFrame(fallLoop);
    }

    function endGame() {
        clearInterval(gameInterval);
        isModalOpen = true; // ゲームオーバー中はモーダルは開かない
        alert(`ゲームオーバー！あなたのスコアは ${score} 点です。`);
        // リスタートオプションなどを追加する場合はここに記述
    }

    // ゲーム開始
    startGame();
});