document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義
    // ----------------------------------------------------
    const skyArea = document.getElementById('sky-area');
    // クイズモーダル関連のDOM要素は、HTMLから完全に削除するか、
    // CSSで display: none !important; を設定してJSからは操作しない
    // const quizModal = document.getElementById('quiz-modal'); 
    // const questionTextElement = document.getElementById('question-text'); 
    // const choiceButtonsArea = document.getElementById('choice-buttons-area'); 
    // const quizFeedback = document.getElementById('quiz-feedback'); 
    const scoreDisplay = document.getElementById('score');
    const lifeDisplay = document.getElementById('life');
    const explosionTemplate = document.getElementById('explosion-template');

    // ----------------------------------------------------
    // ゲーム定数と状態
    // ----------------------------------------------------
    const INITIAL_LIFE = 3;
    const METEOR_INTERVAL = 4000; 
    let gameInterval = null;
    let meteorSpeed = 3.33; 
    let score = 0;
    let life = INITIAL_LIFE;
    let isQuestionActive = false; // ★変更★ `isModalOpen`から`isQuestionActive`に変更し、問題表示中を示す
    let currentMeteorElement = null; // クリックされた隕石
    let currentQuizData = null; // クリックされた隕石の問題データ
    let currentChoiceButtons = []; // ★変更★ 表示された選択肢ボタンの配列

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
        
        // CSSで隕石のサイズを100pxに設定しているので、それに合わせて調整
        const meteorSize = 100; // CSSと同期させる
        const startX = Math.random() * (skyArea.offsetWidth - meteorSize); 
        meteor.style.left = `${startX}px`;
        meteor.style.top = `-${meteorSize}px`; // 画面外からスタート
        
        const quizIndex = Math.floor(Math.random() * QUIZ_DATA.length);
        meteor.dataset.quizIndex = quizIndex;
        
        // 隕石に問題の日本語単語を表示
        meteor.textContent = QUIZ_DATA[quizIndex].word;

        meteor.addEventListener('click', handleMeteorClick);
        skyArea.appendChild(meteor);
    }

    /**
     * 落下アニメーションループ (★ロジック修正版★)
     */
    function fallLoop() {
        if (life <= 0) return;
        
        const allMeteors = document.querySelectorAll('.meteor');
        
        const gameContainer = document.getElementById('game-container');
        const groundY = gameContainer.offsetHeight * 0.9; 

        allMeteors.forEach(meteor => {
            
            // ★修正★
            // 停止条件：問題表示中で、かつ、それが「クリックされた隕石」である場合
            if (isQuestionActive && meteor === currentMeteorElement) {
                return; // この隕石の処理だけをスキップ（落下停止）
            }

            // 上記以外（問題が表示されていない、または、他の隕石）の場合は落下させる
            let currentY = parseFloat(meteor.style.top);
            currentY += meteorSpeed;
            meteor.style.top = `${currentY}px`;
            
            // 地面に到達したら
            if (parseFloat(meteor.style.top) + meteor.offsetHeight >= groundY) {
                const meteorX = meteor.offsetLeft + meteor.offsetWidth / 2;
                triggerExplosion(meteorX, groundY, true); // 地面ヒット爆発
                
                updateLife(-1);
                meteor.remove();
            }
        });

        requestAnimationFrame(fallLoop);
    }


    // ----------------------------------------------------
    // イベントハンドラ
    // ----------------------------------------------------

    /**
     * 隕石がクリックされたときの処理
     */
    function handleMeteorClick(e) {
        // ★変更★ `isModalOpen`を`isQuestionActive`に変更
        if (isQuestionActive) return; // 既に問題が表示されていたら何もしない
        
        isQuestionActive = true; // ★変更★ 問題表示中フラグを立てる
        currentMeteorElement = e.target; // クリックされた隕石を保持
        
        const quizData = QUIZ_DATA[currentMeteorElement.dataset.quizIndex];
        currentQuizData = quizData; // 問題データを保持

        // ★★★ 2つの選択肢ボタンを生成してアニメーション表示 ★★★
        createAnimatedChoiceButtons(currentMeteorElement, currentQuizData);

        // 答えを生成した後に、隕石を非表示にする
        currentMeteorElement.style.display = 'none';
    }

    /**
     * ★追加★ 2つの選択肢ボタンを生成し、アニメーション表示する
     */
    function createAnimatedChoiceButtons(meteorElement, quizData) {
        const correctChoice = quizData.english;
        const incorrects = quizData.choices.filter(c => c !== correctChoice);
        const wrongChoice = shuffleArray(incorrects)[0] || "None"; // 不正解がなければ適当な文字列

        const choices = shuffleArray([correctChoice, wrongChoice]); // 正解と不正解をシャッフル

        currentChoiceButtons = []; // ボタン配列をリセット

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.classList.add('quiz-choice-button');
            button.textContent = choice;
            button.dataset.answer = choice; // 正解判定のためにデータ属性に保存
            button.dataset.correct = (choice === correctChoice) ? 'true' : 'false'; // 正解かどうか

            // 隕石の中心位置
            const meteorCenterX = meteorElement.offsetLeft + meteorElement.offsetWidth / 2;
            const meteorCenterY = meteorElement.offsetTop + meteorElement.offsetHeight / 2;
            
            // ボタンの初期位置（隕石の中心）
            button.style.setProperty('--button-start-top', `${meteorCenterY}px`);
            button.style.setProperty('--button-start-left', `${meteorCenterX}px`);

            // 最終的なボタンの位置を調整
            let endTopOffset = 0;
            if (index === 0) { // 1つ目のボタン
                endTopOffset = -150; // 隕石より上
            } else { // 2つ目のボタン
                endTopOffset = -50; // 隕石の少し上
            }
            button.style.setProperty('--button-end-top', `${meteorCenterY + endTopOffset}px`);
            
            // アニメーションの遅延 (順番にポップアップ)
            button.style.animationDelay = `${index * 0.1}s`;
            button.style.animation = `choiceButtonPopUp 0.4s ease-out forwards ${index * 0.1}s`;

            skyArea.appendChild(button);
            currentChoiceButtons.push(button);

            button.addEventListener('click', handleChoiceButtonClick);
        });
    }

    /**
     * ★追加★ 選択肢ボタンがクリックされたときの処理
     */
    function handleChoiceButtonClick(e) {
        // ★変更★ `isModalOpen`を`isQuestionActive`に変更
        if (!isQuestionActive) return; 

        const selectedAnswer = e.target.dataset.answer;
        const isCorrect = e.target.dataset.correct === 'true';

        // すべてのボタンを無効化し、クリックできないようにする
        currentChoiceButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            if (btn.dataset.correct === 'true') {
                btn.style.backgroundColor = 'lightgreen'; // 正解は緑色にする
            } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
                btn.style.backgroundColor = 'red'; // 間違った選択肢は赤色にする
            }
        });

        const meteorX = currentMeteorElement.offsetLeft + currentMeteorElement.offsetWidth / 2;
        const meteorY = currentMeteorElement.offsetTop + currentMeteorElement.offsetHeight / 2;

        if (isCorrect) {
            updateScore(10);
            triggerExplosion(meteorX, meteorY, false); // 黄色い爆発
        } else {
            updateLife(-1);
            triggerExplosion(meteorX, meteorY, true); // 赤い爆発
        }

        // 選択肢ボタンと隕石の要素を少し遅れて削除し、ゲームを再開
        setTimeout(() => {
            // 選択肢ボタンを全て削除
            currentChoiceButtons.forEach(btn => btn.remove());
            currentChoiceButtons = [];

            // クリックされた隕石を削除
            if (currentMeteorElement) {
                currentMeteorElement.remove();
                currentMeteorElement = null;
            }

            // ★変更★ フラグをリセット
            isQuestionActive = false; 
            currentQuizData = null; // 問題データ参照をリセット
        }, 1000); // 1秒後に削除
    }


    /**
     * クイズモーダルを表示し、問題を設定する (★削除)
     */
    // function showQuizModal(data) { /* 削除 */ }
    
    /**
     * 選択肢がクリックされたときの処理 (★削除)
     */
    // function handleChoiceClick(e) { /* 削除 */ }


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
        meteorSpeed = 3.33; 
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
        isQuestionActive = true; // ★変更★ ゲームオーバー中は問題を出さない
        alert(`ゲームオーバー！あなたのスコアは ${score} 点です。`);
    }

    // ゲーム開始
    startGame();
});