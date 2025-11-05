document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の定義 (省略)
    // ----------------------------------------------------
    const skyArea = document.getElementById('sky-area');
    const quizModal = document.getElementById('quiz-modal');
    const questionTextElement = document.getElementById('question-text');
    const choiceButtonsArea = document.getElementById('choice-buttons-area');
    const englishTranslation = document.getElementById('english-translation'); // 参照はありますが、未使用

    // ----------------------------------------------------
    // ゲーム定数と状態 (省略)
    // ----------------------------------------------------
    const INITIAL_LIFE = 3;
    const METEOR_INTERVAL = 1500;
    let gameInterval = null;
    let meteorSpeed = 1;
    let score = 0;
    let life = INITIAL_LIFE;
    let isModalOpen = false;
    let currentMeteorElement = null;
    let currentQuizData = null;

    // ★★★ 問題データ (日本語、英語、画像、不正解の選択肢) ★★★
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
    // ユーティリティ関数 (省略)
    // ----------------------------------------------------

    // ... (triggerExplosion, shuffleArray, updateScore, updateLife, endGame, startGame)

    // ----------------------------------------------------
    // 隕石の生成とクリック
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
        
        // ★隕石に問題の日本語単語を表示★
        meteor.textContent = QUIZ_DATA[quizIndex].word;

        meteor.addEventListener('click', handleMeteorClick);
        skyArea.appendChild(meteor);
    }

    // ... (fallLoop, handleMeteorClick)

    // ----------------------------------------------------
    // クイズ表示ロジック
    // ----------------------------------------------------

    /**
     * クイズモーダルを表示し、問題を設定する
     */
    function showQuizModal(data) {
        // ★修正点: 質問文エリアを空にする★
        questionTextElement.textContent = ``; 

        // ★修正点: 画像/大きな日本語表示エリアを空にする★
        document.getElementById('quiz-image-area').innerHTML = ''; 

        // 選択肢の準備: 正解1つ + 不正解1つ
        choiceButtonsArea.innerHTML = '';
        
        const correct = data.english; 
        const incorrects = data.choices.filter(c => c !== correct);
        
        // ★常に2つの選択肢のみを最終決定★
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
        
        // フィードバックメッセージは残す
        quizFeedback.textContent = '答えを選んでください。';
        quizModal.classList.remove('hidden');
    }
    
    // ... (handleChoiceClick とその他の関数)
});