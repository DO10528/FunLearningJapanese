document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ ゲームロジック用定数 ★★★
    // ----------------------------------------------------
    // DOM要素の定義
    const skyArea = document.getElementById('sky-area');
    const scoreDisplay = document.getElementById('score');
    const lifeDisplay = document.getElementById('life');
    const explosionTemplate = document.getElementById('explosion-template');
    const gameContainer = document.getElementById('game-container'); 

    // ゲーム定数と状態
    const INITIAL_LIFE = 3;
    const METEOR_INTERVAL = 4000; 
    const POINTS_PER_CORRECT_ANSWER = 1; // 正解時のポイント
    
    const IMAGE_BASE_PATH = 'assets/images/'; 
    
    let gameInterval = null;
    let meteorSpeed = 3.33; 
    let score = 0;
    let life = INITIAL_LIFE;
    let isQuestionActive = false; 
    let currentMeteorElement = null; 
    let currentQuizData = null; 
    let currentChoiceButtons = []; 
    
   // ★★★ 問題データ ★★★
    const QUIZ_DATA = [
        { "word": "いぬ", "english": "dog", "image": "inu.png" },
        { "word": "ねこ", "english": "cat", "image": "neko.png" },
        { "word": "りんご", "english": "apple", "image": "ringo.png" },
        { "word": "さかな", "english": "fish", "image": "sakana.png" },
        { "word": "たまご", "english": "egg", "image": "tamago.png" },
        { "word": "つくえ", "english": "desk", "image": "tsukue.png" },
        { "word": "くるま", "english": "car", "image": "kuruma.png" }, 
        { "word": "はさみ", "english": "scissors", "image": "hasami.png" },
        { "word": "ひこうき", "english": "airplane", "image": "hikoki.png" },
        { "word": "めがね", "english": "glasses", "image": "megane.png" },
        { "word": "やま", "english": "mountain", "image": "yama.png" }, 
        { "word": "ゆき", "english": "snow", "image": "yuki.png" },
        { "word": "すし", "english": "sushi", "image": "sushi.png" },
        { "word": "いも", "english": "potato", "image": "imo.png" },
        { "word": "いけ", "english": "pond", "image": "ike.png" },
        { "word": "うで", "english": "arm", "image": "ude.png" },
        { "word": "うめ", "english": "plum", "image": "ume.png" },
        { "word": "えだ", "english": "branch", "image": "eda.png" },
        { "word": "えほん", "english": "picture book", "image": "ehon.png" },
        { "word": "おおかみ", "english": "wolf", "image": "okami.png" },
        { "word": "かえる", "english": "frog", "image": "kaeru.png" },
        { "word": "かぎ", "english": "key", "image": "kagi.png" },
        { "word": "きつつき", "english": "woodpecker", "image": "kitsutsuki.png" },
        { "word": "くち", "english": "mouth", "image": "kuchi.png" },
        { "word": "くり", "english": "chestnut", "image": "kuri.png" },
        { "word": "けいと", "english": "yarn", "image": "keito.png" },
        { "word": "こおり", "english": "ice", "image": "kori.png" },
        { "word": "さくら", "english": "cherry blossom", "image": "sakura.png" },
        { "word": "すず", "english": "bell", "image": "suzu.png" },
        { "word": "たけ", "english": "bamboo", "image": "take.png" },
        { "word": "たいよう", "english": "sun", "image": "taiyo.png" },
        { "word": "てぶくろ", "english": "glove", "image": "tebukuro.png" },
        { "word": "とかげ", "english": "lizard", "image": "tokage.png" },
        { "word": "とり", "english": "bird", "image": "tori.png" },
        { "word": "なみ", "english": "wave", "image": "nami.png" },
        { "word": "にく", "english": "meat", "image": "niku.png" },
        { "word": "ぬの", "english": "fabric", "image": "nuno.png" },
        { "word": "ひとで", "english": "starfish", "image": "hitode.png" },
        { "word": "ふうせん", "english": "balloon", "image": "fusen.png" },
        { "word": "へちま", "english": "loofah", "image": "hechima.png" },
        { "word": "へび", "english": "snake", "image": "hebi.png" },
        { "word": "ほし", "english": "star", "image": "hoshi.png" },
        { "word": "まめ", "english": "bean", "image": "mame.png" },
        { "word": "むし", "english": "insect", "image": "mushi.png" },
        { "word": "めだか", "english": "killifish", "image": "medaka.png" },
        { "word": "もも", "english": "peach", "image": "momo.png" },
        { "word": "やぎ", "english": "goat", "image": "yagi.png" },
        { "word": "よう", "english": "leaf", "image": "yo.png" },
        { "word": "らっぱ", "english": "trumpet", "image": "rappa.png" },
        { "word": "るり", "english": "lapis lazuli", "image": "ruri.png" },
        { "word": "れもん", "english": "lemon", "image": "remon.png" },
        { "word": "ろうそく", "english": "candle", "image": "rosoku.png" },
        { "word": "わに", "english": "crocodile", "image": "wani.png" },
        { "word": "あさがお", "english": "morning glory", "image": "asagao.png" },
        { "word": "いるか", "english": "dolphin", "image": "iruka.png" },
        { "word": "えのぐ", "english": "paint", "image": "enogu.png" },
        { "word": "かたつむり", "english": "snail", "image": "katatsumuri.png" },
        { "word": "くじら", "english": "whale", "image": "kujira.png" },
        { "word": "けむり", "english": "smoke", "image": "kemuri.png" },
        { "word": "こけ", "english": "moss", "image": "koke.png" },
        { "word": "しお", "english": "salt", "image": "shio.png" },
        { "word": "せんせい", "english": "teacher", "image": "sensei.png" },
        { "word": "たいこ", "english": "drum", "image": "taiko.png" },
        { "word": "ちょう", "english": "butterfly", "image": "cho.png" },
        { "word": "つばめ", "english": "swallow", "image": "tsubame.png" },
        { "word": "てるてる", "english": "teru teru bozu", "image": "teruteru.png" },
        { "word": "とうふ", "english": "tofu", "image": "tofu.png" },
        { "word": "なべ", "english": "pot", "image": "nabe.png" },
        { "word": "にわ", "english": "garden", "image": "niwa.png" },
        { "word": "ぬいぐるみ", "english": "stuffed toy", "image": "nuigurumi.png" },
        { "word": "のりもの", "english": "vehicle", "image": "norimono.png" },
        { "word": "はくちょう", "english": "swan", "image": "hakucho.png" },
        { "word": "ふうりん", "english": "wind chime", "image": "furin.png" },
        { "word": "へちま", "english": "loofah", "image": "hechima.png" },
        { "word": "ほうき", "english": "broom", "image": "hoki.png" },
        { "word": "まくら", "english": "pillow", "image": "makura.png" },
        { "word": "みずうみ", "english": "lake", "image": "mizuumi.png" },
        { "word": "むぎ", "english": "wheat", "image": "mugi.png" },
        { "word": "もり", "english": "forest", "image": "mori.png" },
        { "word": "ゆびわ", "english": "ring", "image": "yubiwa.png" },
        { "word": "よしず", "english": "bamboo blind", "image": "yoshizu.png" },
        { "word": "るりびたき", "english": "red-flanked bluetail", "image": "ruribitaki.png" },
        { "word": "れんげ", "english": "Chinese milk vetch", "image": "renge.png" },
        { "word": "ろぼっと", "english": "robot", "image": "robotto.png" },
        { "word": "わかめ", "english": "seaweed", "image": "wakame.png" },
        { "word": "いとまき", "english": "thread spool", "image": "itomaki.png" },
        { "word": "うちわ", "english": "fan", "image": "uchiwa.png" },
        { "word": "えびふらい", "english": "fried shrimp", "image": "ebifurai.png" },
        { "word": "おもちゃ", "english": "toy", "image": "omocha.png" },
        { "word": "かたな", "english": "sword", "image": "katana.png" },
        { "word": "きもの", "english": "kimono", "image": "kimono.png" },
        { "word": "くさ", "english": "grass", "image": "kusa.png" },
        { "word": "けしごむ", "english": "eraser", "image": "keshigomu.png" },
        { "word": "こま", "english": "top (toy)", "image": "koma.png" },
        { "word": "さいふ", "english": "wallet", "image": "saifu.png" },
        { "word": "あめ", "english": "candy", "image": "ame.png" },
        { "word": "アヒル", "english": "duck", "image": "ahiru.png" },
        { "word": "あり", "english": "ant", "image": "ari.png" },
        { "word": "いか", "english": "squid", "image": "ika.png" },
        { "word": "いちご", "english": "strawberry", "image": "ichigo.png" },
        { "word": "いす", "english": "chair", "image": "isu.png" },
        { "word": "うさぎ", "english": "rabbit", "image": "usagi.png" },
        { "word": "うし", "english": "cow", "image": "ushi.png" },
        { "word": "うま", "english": "horse", "image": "uma.png" },
        { "word": "えび", "english": "shrimp", "image": "ebi.png" },
        { "word": "えんぴつ", "english": "pencil", "image": "enpitsu.png" },
        { "word": "おにぎり", "english": "rice ball (onigiri)", "image": "onigiri.png" },
        { "word": "おに", "english": "demon (oni)", "image": "oni.png" },
        { "word": "オムレツ", "english": "omelette", "image": "omuretsu.png" },
        { "word": "かばん", "english": "bag", "image": "kaban.png" },
        { "word": "かさ", "english": "umbrella", "image": "kasa.png" },
        { "word": "かに", "english": "crab", "image": "kani.png" },
        { "word": "かめ", "english": "turtle", "image": "kame.png" },
        { "word": "きゅうり", "english": "cucumber", "image": "kyuuri.png" },
        { "word": "くつ", "english": "shoes", "image": "kutsu.png" },
        { "word": "くま", "english": "bear", "image": "kuma.png" },
        { "word": "くも", "english": "spider/cloud", "image": "kumo.png" },
        { "word": "ケーキ", "english": "cake", "image": "keki.png" },
        { "word": "けむし", "english": "caterpillar", "image": "kemushi.png" },
        { "word": "き", "english": "tree", "image": "ki.png" },
        { "word": "きりん", "english": "giraffe", "image": "kirin.png" },
        { "word": "きのこ", "english": "mushroom", "image": "kinoko.png" },
        { "word": "きつね", "english": "fox", "image": "kitsune.png" },
        { "word": "コアラ", "english": "koala", "image": "koara.png" },
        { "word": "コップ", "english": "cup", "image": "koppu.png" },
        { "word": "こいのぼり", "english": "carp streamer", "image": "koinobori.png" },
        { "word": "ごはん", "english": "rice", "image": "gohan.png" },
        { "word": "ごみばこ", "english": "trash can", "image": "gomibako.png" },
        { "word": "ごくう", "english": "Goku", "image": "goku.png" },
        { "word": "ごま", "english": "sesame", "image": "goma.png" },
        { "word": "ゴリラ", "english": "gorilla", "image": "gorira.png" },
        { "word": "さる", "english": "monkey", "image": "saru.png" },
        { "word": "しか", "english": "deer", "image": "shika.png" },
        { "word": "しまうま", "english": "zebra", "image": "shimauma.png" },
        { "word": "しんごう", "english": "traffic light", "image": "shingou.png" },
        { "word": "すいか", "english": "watermelon", "image": "suika.png" },
        { "word": "すなはま", "english": "sandy beach", "image": "sunahama.png" },
        { "word": "すべりだい", "english": "slide", "image": "suberidai.png" },
        { "word": "せみ", "english": "cicada", "image": "semi.png" },
        { "word": "せんぷうき", "english": "electric fan", "image": "senpuki.png" },
        { "word": "そら", "english": "sky", "image": "sora.png" },
        { "word": "そらまめ", "english": "fava bean", "image": "soramame.png" },
        { "word": "たこ", "english": "octopus", "image": "tako.png" },
        { "word": "たぬき", "english": "raccoon dog", "image": "tanuki.png" },
        { "word": "だんご", "english": "dango (sweet dumpling)", "image": "dango.png" },
        { "word": "ちず", "english": "map", "image": "chizu.png" },
        { "word": "チョコレート", "english": "chocolate", "image": "choko.png" },
        { "word": "チューリップ", "english": "tulip", "image": "churippu.png" },
        { "word": "つき", "english": "moon", "image": "tsuki.png" },
        { "word": "つみき", "english": "building blocks", "image": "tsumiki.png" },
        { "word": "て", "english": "hand", "image": "te.png" },
        { "word": "テレビ", "english": "television", "image": "terebi.png" },
        { "word": "テント", "english": "tent", "image": "tento.png" },
        { "word": "とけい", "english": "clock", "image": "tokei.png" },
        { "word": "とら", "english": "tiger", "image": "tora.png" },
        { "word": "トマト", "english": "tomato", "image": "tomato.png" }, 
        { "word": "なす", "english": "eggplant", "image": "nasu.png" },
        { "word": "なし", "english": "Japanese pear", "image": "nashi.png" },
        { "word": "なっとう", "english": "natto (fermented soybeans)", "image": "natto.png" },
        { "word": "にじ", "english": "rainbow", "image": "niji.png" },
        { "word": "にんじん", "english": "carrot", "image": "ninjin.png" },
        { "word": "にわとり", "english": "chicken", "image": "niwatori.png" },
        { "word": "ねずみ", "english": "mouse", "image": "nezumi.png" },
        { "word": "ねんど", "english": "clay/playdough", "image": "nendo.png" },
        { "word": "のこぎり", "english": "saw", "image": "nokogiri.png" },
        { "word": "のり", "english": "seaweed (nori)", "image": "nori.png" },
        { "word": "ぬりえ", "english": "coloring book/page", "image": "nurie.png" },
        { "word": "は", "english": "tooth", "image": "ha.png" },
        { "word": "はし", "english": "chopsticks/bridge", "image": "hashi.png" },
        { "word": "はな", "english": "flower", "image": "hana.png" },
        { "word": "はみがき", "english": "tooth-brushing", "image": "hamigaki.png" },
        { "word": "ひ", "english": "fire", "image": "hi.png" },
        { "word": "ひよこ", "english": "chick", "image": "hiyoko.png" },
        { "word": "ひまわり", "english": "sunflower", "image": "himawari.png" },
        { "word": "ライオン", "english": "lion", "image": "raion.png" },
        { "word": "ラクダ", "english": "camel", "image": "rakuda.png" },
        { "word": "ラジオ", "english": "radio", "image": "radio.png" },
        { "word": "りか", "english": "science", "image": "rika.png" },
        { "word": "りきし", "english": "sumo wrestler", "image": "rikishi.png" },
        { "word": "りす", "english": "squirrel", "image": "risu.png" }
    ];
    
    // ----------------------------------------------------
    // ユーティリティ関数
    // ----------------------------------------------------

    /**
     * 配列をシャッフルする
     */
    function shuffleArray(array) {
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
     */
    function createMeteor() {
        if (life <= 0) return;

        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        
        const meteorSize = 100; // CSSと同期
        const startX = Math.random() * (skyArea.offsetWidth - meteorSize); 
        meteor.style.left = `${startX}px`;
        meteor.style.top = `-${meteorSize}px`; 
        
        const quizIndex = Math.floor(Math.random() * QUIZ_DATA.length);
        const quizData = QUIZ_DATA[quizIndex];
        meteor.dataset.quizIndex = quizIndex;
        
        // ランダムで「言葉」か「イラスト」かを決める
        const quizType = Math.random() < 0.5 ? 'word' : 'image'; 
        meteor.dataset.quizType = quizType; // クイズの種類を隕石に保存

        if (quizType === 'word') {
            // タイプ1: 隕石に日本語の「言葉」を表示
            meteor.textContent = quizData.word;
        } else {
            // タイプ2: 隕石に「イラスト」を表示
            meteor.classList.add('meteor-image'); // CSSスタイルを適用
            // ★画像パスを調整
            meteor.style.backgroundImage = `url('${IMAGE_BASE_PATH}${quizData.image}')`; 
        }

        meteor.addEventListener('click', handleMeteorClick);
        skyArea.appendChild(meteor);
    }

    /**
     * 落下アニメーションループ
     */
    function fallLoop() {
        if (life <= 0) {
            return; 
        }
        
        const allMeteors = document.querySelectorAll('.meteor');
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
     */
    function handleMeteorClick(e) {
        if (isQuestionActive || life <= 0) return; 
        
        isQuestionActive = true; 
        currentMeteorElement = e.target; 
        
        const quizData = QUIZ_DATA[currentMeteorElement.dataset.quizIndex];
        const quizType = currentMeteorElement.dataset.quizType;
        currentQuizData = quizData; 

        createAnimatedChoiceButtons(currentMeteorElement, currentQuizData, quizType);

        // 答えを生成した後に、隕石を非表示にする
        currentMeteorElement.style.display = 'none';
    }

    /**
     * 2つの選択肢ボタンを生成し、アニメーション表示する
     */
    function createAnimatedChoiceButtons(meteorElement, quizData, quizType) {
        let correctChoice = '';
        let wrongChoice = '';
        
        if (quizType === 'word') {
            // タイプ1: 隕石が「言葉」(日本語) の場合 -> 答えは「英語」
            correctChoice = quizData.english;
            
            // ★★★ 修正ロジック ★★★
            const allEnglishWords = QUIZ_DATA.map(q => q.english);
            
            // 正解と異なる単語のリストを作成
            const incorrects = allEnglishWords.filter(w => w !== correctChoice);
            
            // リストが空でないことを確認し、ランダムに1つ選ぶ
            if (incorrects.length > 0) {
                wrongChoice = shuffleArray(incorrects)[0];
            } else {
                 // 万が一不正解の選択肢がない場合 (データが重複している場合など)、フォールバックする
                 // 実際には約100個のデータがあるので起こらないはず
                 wrongChoice = "NO CHOICE"; 
            }

        } else {
            // タイプ2: 隕石が「イラスト」の場合 -> 答えは「日本語」
            correctChoice = quizData.word; 

            // ★★★ 修正ロジック ★★★
            const allJapaneseWords = QUIZ_DATA.map(q => q.word);
            const incorrects = allJapaneseWords.filter(w => w !== correctChoice);
            
            if (incorrects.length > 0) {
                 wrongChoice = shuffleArray(incorrects)[0];
            } else {
                 wrongChoice = "ちがう";
            }
        }

        const choices = shuffleArray([correctChoice, wrongChoice]);

        currentChoiceButtons = []; 

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.classList.add('quiz-choice-button');
            button.textContent = choice;
            button.dataset.answer = choice; 
            button.dataset.correct = (choice === correctChoice) ? 'true' : 'false'; 

            const meteorCenterX = meteorElement.offsetLeft + meteorElement.offsetWidth / 2;
            const meteorCenterY = meteorElement.offsetTop + meteorElement.offsetHeight / 2;
            
            // スタイルを設定
            button.style.position = 'absolute';
            button.style.left = `${meteorCenterX - 50}px`; // ボタンを隕石の中心から少し左に寄せる
            button.style.top = `${meteorCenterY + (index === 0 ? -150 : -50)}px`;
            button.style.zIndex = '50';
            button.style.opacity = '0'; // アニメーションのために初期値0

            skyArea.appendChild(button);
            currentChoiceButtons.push(button);

            // アニメーションを適用
            setTimeout(() => {
                 button.style.transition = 'opacity 0.2s, transform 0.2s';
                 button.style.opacity = '1';
                 button.style.transform = 'translateY(0)';
            }, index * 100);


            button.addEventListener('click', handleChoiceButtonClick);
        });
    }

    /**
     * 選択肢ボタンがクリックされたときの処理
     */
    async function handleChoiceButtonClick(e) { 
        if (!isQuestionActive) return; 

        const selectedAnswer = e.target.dataset.answer;
        const isCorrect = e.target.dataset.correct === 'true';
        
        // 全ボタンを無効化
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
        
        let scoreMessage = '';
        if (isCorrect) {
            updateScore(POINTS_PER_CORRECT_ANSWER);
            triggerExplosion(meteorX, meteorY, false); // 黄色い爆発

            // ★★★ Firebaseポイント加算 ★★★
            if (typeof window.addPointsToUser === 'function') {
                const success = await window.addPointsToUser(POINTS_PER_CORRECT_ANSWER);
                scoreMessage = success ? ` (+${POINTS_PER_CORRECT_ANSWER}pt 記録)` : ' (ポイント記録エラー)';
            } else {
                scoreMessage = ' (ゲストモード/ポイント未記録)';
            }
            // ★★★★★★★★★★★★★★★★★★★★★★★★★

        } else {
            updateLife(-1);
            triggerExplosion(meteorX, meteorY, true); // 赤い爆発
        }
        
        console.log(`[Quiz Result] ${isCorrect ? 'Correct' : 'Incorrect'}! ${scoreMessage}`);


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
        const gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.remove();
        }

        score = 0;
        life = INITIAL_LIFE;
        meteorSpeed = 3.33; 
        scoreDisplay.textContent = score;
        lifeDisplay.textContent = life;
        skyArea.textContent = ''; 

        isQuestionActive = false;

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(createMeteor, METEOR_INTERVAL);
        
        requestAnimationFrame(fallLoop);
    }

    async function endGame() {
        clearInterval(gameInterval);
        isQuestionActive = true; 
        
        document.querySelectorAll('.meteor').forEach(m => m.remove());

        const finalScore = score;
        let scoreRecordMsg = 'ポイントは記録されません。';
        
        // ★★★ Firebaseポイント加算 (最終スコアをまとめて記録) ★★★
        if (finalScore > 0 && typeof window.addPointsToUser === 'function') {
             const success = await window.addPointsToUser(finalScore);
             if (success) {
                 scoreRecordMsg = `スコア ${finalScore} 点をランキングに記録しました！`;
             } else if (window.currentUserId) {
                 scoreRecordMsg = 'ポイント記録中にエラーが発生しました。';
             }
        }
        // ★★★ Firebaseポイント加算 終了 ★★★

        // --- ゲームオーバー画面の作成 ---
        const overlay = document.createElement('div');
        overlay.id = 'game-over-screen'; 
        // スタイルは省略。CSSファイルに移動するのがベストです。
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '100'; 

        const gameOverText = document.createElement('h2');
        gameOverText.textContent = 'ゲームオーバー！';
        gameOverText.style.color = 'white';
        gameOverText.style.fontSize = '3em';
        gameOverText.style.marginBottom = '10px';

        const scoreText = document.createElement('p');
        scoreText.innerHTML = `最終スコア: ${finalScore}<br><span style="font-size: 0.8em;">${scoreRecordMsg}</span>`;
        scoreText.style.color = 'white';
        scoreText.style.fontSize = '1.5em';
        scoreText.style.marginBottom = '30px';

        const restartButton = document.createElement('button');
        restartButton.textContent = 'もう一度プレイ';
        // スタイルは省略。CSSファイルに移動するのがベストです。
        restartButton.style.padding = '12px 25px';
        restartButton.style.fontSize = '1.2em';
        restartButton.style.color = '#333';
        restartButton.style.backgroundColor = '#ffd700'; 
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '25px';
        restartButton.style.cursor = 'pointer';

        restartButton.addEventListener('click', startGame);

        overlay.appendChild(gameOverText);
        overlay.appendChild(scoreText);
        overlay.appendChild(restartButton);

        if (gameContainer) {
            gameContainer.appendChild(overlay);
        } else {
            document.body.appendChild(overlay); 
        }
    }

    // ゲーム開始
    startGame();
});