document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義
    // ----------------------------------------------------
    const skyArea = document.getElementById('sky-area');
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
    let isQuestionActive = false; 
    let currentMeteorElement = null; 
    let currentQuizData = null; 
    let currentChoiceButtons = []; 

    // ★★★ 問題データ ★★★
    // ★修正★
    // imagesフォルダにあるイラストのデータを追加してください。
    // 例として「すし」を追加しました。
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
        
        // ★追加例★ assets/images/sushi.png がある場合
        { word: "すし", english: "Sushi", image: "sushi.png", choices: ["Sushi", "Steak", "Curry", "Pizza"] }
        
        // ★★★ assets/images フォルダにある他の画像もここに追加してください ★★★
        // { word: "すいか", english: "Watermelon", image: "suika.png", choices: ["Watermelon", "Apple", "Orange", "Grape"] },
        // { word: "たいこ", english: "Drum", image: "taiko.png", choices: ["Drum", "Piano", "Guitar", "Flute"] },
    ];
    
    // ----------------------------------------------------
    // ユーティリティ関数
    // ----------------------------------------------------

    /**
     * 配列をシャッフルする
     */
    function shuffleArray(array) {
        // 配列のコピーを作成してからシャッフルする
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * 爆発アニメーションを生成し再生する
     */
    function triggerExplosion(x, y, isMiss = false) {
        const explosion = explosionTemplate.cloneNode(true);
        explosion.classList.remove('hidden');
        explosion.id = '';

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
     * ★★★ 大幅に修正 ★★★
     */
    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        
        const meteorSize = 100; // CSSと同期
        const startX = Math.random() * (skyArea.offsetWidth - meteorSize); 
        meteor.style.left = `${startX}px`;
        meteor.style.top = `-${meteorSize}px`; 
        
        const quizIndex = Math.floor(Math.random() * QUIZ_DATA.length);
        const quizData = QUIZ_DATA[quizIndex];
        meteor.dataset.quizIndex = quizIndex;
        
        // ★ランダムで「言葉」か「イラスト」かを決める★
        const quizType = Math.random() < 0.5 ? 'word' : 'image'; 
        meteor.dataset.quizType = quizType; // クイズの種類を隕石に保存

        if (quizType === 'word') {
            // タイプ1: 隕石に日本語の「言葉」を表示
            meteor.textContent = quizData.word;
        } else {
            // タイプ2: 隕石に「イラスト」を表示
            meteor.classList.add('meteor-image'); // CSSスタイルを適用
            // HTML(index.html)から見た画像パスを指定
            meteor.style.backgroundImage = `url('assets/images/${quizData.image}')`; 
        }

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
     * ★★★ 修正 ★★★
     */
    function handleMeteorClick(e) {
        if (isQuestionActive) return; 
        
        isQuestionActive = true; 
        currentMeteorElement = e.target; 
        
        const quizData = QUIZ_DATA[currentMeteorElement.dataset.quizIndex];
        const quizType = currentMeteorElement.dataset.quizType; // 隕石からクイズタイプを取得
        currentQuizData = quizData; 

        // ★クイズタイプを渡すように変更★
        createAnimatedChoiceButtons(currentMeteorElement, currentQuizData, quizType);

        // 答えを生成した後に、隕石を非表示にする
        currentMeteorElement.style.display = 'none';
    }

    /**
     * 2つの選択肢ボタンを生成し、アニメーション表示する
     * ★★★ 大幅に修正 ★★★
     */
    function createAnimatedChoiceButtons(meteorElement, quizData, quizType) {
        let correctChoice = '';
        let wrongChoice = '';
        
        if (quizType === 'word') {
            // タイプ1: 隕石が「言葉」の場合 -> 答えは「英語」
            correctChoice = quizData.english;
            
            // 不正解の「英語」をランダムで1つ選ぶ
            const incorrects = quizData.choices.filter(c => c !== correctChoice);
            wrongChoice = shuffleArray(incorrects)[0] || "Wrong"; 

        } else {
            // タイプ2: 隕石が「イラスト」の場合 -> 答えは「日本語」
            correctChoice = quizData.word; // 正解は "いぬ", "すし" など

            // 不正解の「日本語」を QUIZ_DATA 全体からランダムで1つ選ぶ
            const allJapaneseWords = QUIZ_DATA.map(q => q.word);
            const incorrects = allJapaneseWords.filter(w => w !== correctChoice);
            wrongChoice = shuffleArray(incorrects)[0] || "ちがう";
        }

        const choices = shuffleArray([correctChoice, wrongChoice]); // 正解と不正解をシャッフル

        currentChoiceButtons = []; // ボタン配列をリセット

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.classList.add('quiz-choice-button');
            button.textContent = choice;
            button.dataset.answer = choice; 
            button.dataset.correct = (choice === correctChoice) ? 'true' : 'false'; 

            const meteorCenterX = meteorElement.offsetLeft + meteorElement.offsetWidth / 2;
            const meteorCenterY = meteorElement.offsetTop + meteorElement.offsetHeight / 2;
            
            button.style.setProperty('--button-start-top', `${meteorCenterY}px`);
            button.style.setProperty('--button-start-left', `${meteorCenterX}px`);

            let endTopOffset = 0;
            if (index === 0) { 
                endTopOffset = -150; // 隕石より上
            } else { 
                endTopOffset = -50; // 隕石の少し上
            }
            button.style.setProperty('--button-end-top', `${meteorCenterY + endTopOffset}px`);
            
            button.style.animationDelay = `${index * 0.1}s`;
            button.style.animation = `choiceButtonPopUp 0.4s ease-out forwards ${index * 0.1}s`;

            skyArea.appendChild(button);
            currentChoiceButtons.push(button);

            button.addEventListener('click', handleChoiceButtonClick);
        });
    }

    /**
     * 選択肢ボタンがクリックされたときの処理 (変更なし)
     */
    function handleChoiceButtonClick(e) {
        if (!isQuestionActive) return; 

        const selectedAnswer = e.target.dataset.answer;
        const isCorrect = e.target.dataset.correct === 'true';

        currentChoiceButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            if (btn.dataset.correct === 'true') {
                btn.style.backgroundColor = 'lightgreen'; 
            } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
                btn.style.backgroundColor = 'red'; 
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

        setTimeout(() => {
            currentChoiceButtons.forEach(btn => btn.remove());
            currentChoiceButtons = [];

            if (currentMeteorElement) {
                currentMeteorElement.remove();
                currentMeteorElement = null;
            }

            isQuestionActive = false; 
            currentQuizData = null; 
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
        meteorSpeed = 3.33; 
        scoreDisplay.textContent = score;
        lifeDisplay.textContent = life;
        skyArea.innerHTML = ''; 

        gameInterval = setInterval(createMeteor, METEOR_INTERVAL);
        
        requestAnimationFrame(fallLoop);
    }

    function endGame() {
        clearInterval(gameInterval);
        isQuestionActive = true; 
        alert(`ゲームオーバー！あなたのスコアは ${score} 点です。`);
    }

    // ゲーム開始
    startGame();
});