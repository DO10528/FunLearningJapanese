document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義
    // ----------------------------------------------------
    const skyArea = document.getElementById('sky-area');
    const quizModal = document.getElementById('quiz-modal');
    const questionTextElement = document.getElementById('question-text');
    const choiceButtonsArea = document.getElementById('choice-buttons-area');
    const scoreDisplay = document.getElementById('score');
    const lifeDisplay = document.getElementById('life');
    const quizFeedback = document.getElementById('quiz-feedback');
    const explosionTemplate = document.getElementById('explosion-template');

    // ----------------------------------------------------
    // ゲーム定数と状態
    // ----------------------------------------------------
    const INITIAL_LIFE = 3;
    const METEOR_INTERVAL = 4000; // ★修正: 1500ms(1.5秒)から4000ms(4秒)に変更 (約2.67倍の頻度)
    let gameInterval = null;
    let meteorSpeed = 10.0; // ← 10.0 に設定
    let score = 0;
    let life = INITIAL_LIFE;
    let isModalOpen = false;
    let currentMeteorElement = null;
    let currentQuizData = null;

    // ★★★ 問題データ ★★★
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
    function triggerExplosion(x, y, isMiss = false) {
        const explosion = explosionTemplate.cloneNode(true);
        explosion.classList.remove('hidden');
        explosion.id = '';

        // 地面ヒットや不正解は赤/オレンジ、正解は黄色の爆発
        explosion.style.backgroundColor = isMiss ? 'red' : 'yellow'; 

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
        
        const startX = Math.random() * (skyArea.offsetWidth - 50);
        meteor.style.left = `${startX}px`;
        meteor.style.top = `-50px`;
        
        const quizIndex = Math.floor(Math.random() * QUIZ_DATA.length);
        meteor.dataset.quizIndex = quizIndex;
        
        // 隕石に問題の日本語単語を表示
        meteor.textContent = QUIZ_DATA[quizIndex].word;

        meteor.addEventListener('click', handleMeteorClick);
        skyArea.appendChild(meteor);
    }

    /**
     * 落下アニメーションループ (修正済み)
     */
    function fallLoop() {
        if (life <= 0) return;
        
        const allMeteors = document.querySelectorAll('.meteor');
        
        // ★修正ポイント: game-containerの高さを取得し、地面の位置を安定させる★
        const gameContainer = document.getElementById('game-container');
        // 地面の位置: ゲームコンテナの高さの90%（CSS設定に基づく）
        const groundY = gameContainer.offsetHeight * 0.9; 

        allMeteors.forEach(meteor => {
            if (isModalOpen) return;

            let currentY = parseFloat(meteor.style.top);
            currentY += meteorSpeed;
            meteor.style.top = `${currentY}px`;

            // 地面に到達したら
            if (currentY + meteor.offsetHeight >= groundY) {
                const meteorX = meteor.offsetLeft + meteor.offsetWidth / 2;
                triggerExplosion(meteorX, groundY, true); // 地面ヒット爆発
                
                updateLife(-1);
                meteor.remove();
            }
        });

        /* ★★★ 修正点 2/2 ★★★ */
        // スコアによる速度変更を無効化（コメントアウト）
        // meteorSpeed = Math.min(4, 1 + score / 500); 
        
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
        
        isModalOpen = true;
        currentMeteorElement = e.target;
        
        const quizData = QUIZ_DATA[currentMeteorElement.dataset.quizIndex];
        currentQuizData = quizData;

        currentMeteorElement.style.display = 'none';

        showQuizModal(currentQuizData);
    }

    /**
     * クイズモーダルを表示し、問題を設定する
     */
    function showQuizModal(data) {
        // 質問文エリアを空にする
        questionTextElement.textContent = ``; 

        // 画像/大きな日本語表示エリアを空にする
        document.getElementById('quiz-image-area').innerHTML = ''; 

        // 選択肢の準備: 正解1つ + 不正解1つ
        choiceButtonsArea.innerHTML = '';
        
        const correct = data.english; 
        const incorrects = data.choices.filter(c => c !== correct);
        
        const finalChoices = [correct]; 
        
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
    
    /**
     * 選択肢がクリックされたときの処理
     */
    function handleChoiceClick(e) {
        const selectedAnswer = e.target.dataset.answer;
        
        document.querySelectorAll('#choice-buttons-area button').forEach(btn => btn.disabled = true);

        const meteorX = currentMeteorElement.offsetLeft + currentMeteorElement.offsetWidth / 2;
        const meteorY = currentMeteorElement.offsetTop + currentMeteorElement.offsetHeight / 2;

        if (selectedAnswer === currentQuizData.english) {
            // 正解
            quizFeedback.textContent = '⭕ 正解！隕石破壊！';
            e.target.style.backgroundColor = 'lightgreen';
            updateScore(10);
            
            triggerExplosion(meteorX, meteorY, false); // 黄色い爆発
            currentMeteorElement.remove();

        } else {
            // 不正解
            quizFeedback.textContent = '❌ 不正解... 隕石が爆発！';
            e.target.style.backgroundColor = 'red';
            updateLife(-1);
            
            triggerExplosion(meteorX, meteorY, true); // 赤い爆発
            currentMeteorElement.remove();
        }

        // モーダルを閉じる
        setTimeout(() => {
            quizModal.classList.add('hidden');
            isModalOpen = false;
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
        /* ★★★ 修正点 1/2 ★★★ */
        meteorSpeed = 10.0; // ← 10.0 に変更
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
        isModalOpen = true; 
        alert(`ゲームオーバー！あなたのスコアは ${score} 点です。`);
    }

    // ゲーム開始
    startGame();
});