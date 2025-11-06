document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義
    // ----------------------------------------------------
    const skyArea = document.getElementById('sky-area');
    const quizModal = document.getElementById('quiz-modal'); // ★使わないが、残しておく
    const questionTextElement = document.getElementById('question-text'); // ★使わないが、残しておく
    const choiceButtonsArea = document.getElementById('choice-buttons-area'); // ★使わないが、残しておく
    const scoreDisplay = document.getElementById('score');
    const lifeDisplay = document.getElementById('life');
    const quizFeedback = document.getElementById('quiz-feedback'); // ★使わないが、残しておく
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
    let isModalOpen = false; // モーダルは使わないが、クリック判定のフラグとして残す
    let currentMeteorElement = null; // クリックされた隕石
    let currentQuizData = null; // クリックされた隕石の問題データ
    let currentAnimatedAnswerElement = null; // ★追加★ 表示されたアニメーション答え要素

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
     * 配列をシャッフルする (今回は使わない)
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
     * 落下アニメーションループ
     */
    function fallLoop() {
        if (life <= 0) return;
        
        const allMeteors = document.querySelectorAll('.meteor');
        
        const gameContainer = document.getElementById('game-container');
        const groundY = gameContainer.offsetHeight * 0.9; 

        allMeteors.forEach(meteor => {
            // isModalOpenはクリックされたらtrueになるので、その間は落下停止
            if (isModalOpen && meteor === currentMeteorElement) return;
            // クリック済みでアニメーション中、かつ現在の隕石でなければ落下継続
            if (isModalOpen && meteor !== currentMeteorElement) {
                let currentY = parseFloat(meteor.style.top);
                currentY += meteorSpeed;
                meteor.style.top = `${currentY}px`;
            }

            // クリックされていない隕石は普通に落下
            if (!isModalOpen) {
                let currentY = parseFloat(meteor.style.top);
                currentY += meteorSpeed;
                meteor.style.top = `${currentY}px`;
            }


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
        if (isModalOpen) return; // 既に問題が表示されていたら何もしない
        
        isModalOpen = true; // 問題表示中フラグを立てる
        currentMeteorElement = e.target; // クリックされた隕石を保持
        
        const quizData = QUIZ_DATA[currentMeteorElement.dataset.quizIndex];
        currentQuizData = quizData; // 問題データを保持

        // 隕石を一時的に非表示にする
        currentMeteorElement.style.display = 'none';

        // ★★★ モーダルを表示する代わりにアニメーションする答えを生成 ★★★
        createAnimatedAnswer(currentMeteorElement, currentQuizData.english);
    }

    /**
     * ★追加★ アニメーションする答えの要素を生成し表示する
     */
    function createAnimatedAnswer(meteorElement, answerText) {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('animated-answer');
        answerDiv.textContent = answerText;
        answerDiv.dataset.answer = answerText; // 正解判定のためにデータ属性に保存

        // 隕石の位置情報をCSS変数として渡す
        // これにより、CSSアニメーションが隕石の位置を基準に動く
        answerDiv.style.setProperty('--meteor-top', `${meteorElement.offsetTop}px`);
        answerDiv.style.setProperty('--meteor-left', `${meteorElement.offsetLeft}px`);
        answerDiv.style.setProperty('--meteor-width', `${meteorElement.offsetWidth}px`);
        answerDiv.style.setProperty('--meteor-height', `${meteorElement.offsetHeight}px`);
        
        skyArea.appendChild(answerDiv);
        currentAnimatedAnswerElement = answerDiv; // 表示した答え要素を保持

        // 答えがクリックされたときの処理
        answerDiv.addEventListener('click', handleAnswerClick);
    }

    /**
     * ★追加★ アニメーションする答えがクリックされたときの処理
     */
    function handleAnswerClick(e) {
        if (!isModalOpen) return; // クリック判定フラグが立ってなければ何もしない

        const selectedAnswer = e.target.dataset.answer;
        
        // 答え要素を一時的に無効化 (連続クリック防止)
        e.target.style.pointerEvents = 'none';

        const meteorX = currentMeteorElement.offsetLeft + currentMeteorElement.offsetWidth / 2;
        const meteorY = currentMeteorElement.offsetTop + currentMeteorElement.offsetHeight / 2;

        if (selectedAnswer === currentQuizData.english) {
            // 正解
            e.target.style.backgroundColor = 'lightgreen';
            e.target.textContent = '⭕ Correct!'; // フィードバックを答えに表示
            updateScore(10);
            
            triggerExplosion(meteorX, meteorY, false); // 黄色い爆発
            
        } else {
            // 不正解
            e.target.style.backgroundColor = 'red';
            e.target.textContent = '❌ Wrong!'; // フィードバックを答えに表示
            updateLife(-1);
            
            triggerExplosion(meteorX, meteorY, true); // 赤い爆発
        }

        // 答えの要素を少し遅れて削除し、ゲームを再開
        setTimeout(() => {
            if (currentAnimatedAnswerElement) {
                currentAnimatedAnswerElement.remove();
                currentAnimatedAnswerElement = null;
            }
            isModalOpen = false; // フラグをリセット
            currentMeteorElement = null; // 隕石参照をリセット
            currentQuizData = null; // 問題データ参照をリセット
        }, 1000); // 1秒後に削除
    }


    /**
     * クイズモーダルを表示し、問題を設定する (★今回は使わないので、中身は空にするか削除しても良い)
     */
    function showQuizModal(data) {
        // この関数は使われない
        // quizModal.classList.add('hidden'); // 非表示にする
    }
    
    /**
     * 選択肢がクリックされたときの処理 (★今回は使わないので、中身は空にするか削除しても良い)
     */
    function handleChoiceClick(e) {
        // この関数は使われない
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
        isModalOpen = true; 
        alert(`ゲームオーバー！あなたのスコアは ${score} 点です。`);
    }

    // ゲーム開始
    startGame();
});