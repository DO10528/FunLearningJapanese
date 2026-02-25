// --- データセット (約100語) ---
    const onomatopoeiaData = {
        1: [ // Feelings & State (25)
            { jp: "ドキドキ", en: "nervous / heart-pounding", kana: "dokidoki" },
            { jp: "ワクワク", en: "excited", kana: "wakuwaku" },
            { jp: "ニコニコ", en: "smiling", kana: "niconico" },
            { jp: "ペコペコ", en: "hungry / bowing", kana: "pekopeko" },
            { jp: "イライラ", en: "annoyed / irritated", kana: "iraira" },
            { jp: "ハラハラ", en: "suspense / nervous", kana: "harahara" },
            { jp: "ニヤニヤ", en: "grinning", kana: "niyaniya" },
            { jp: "プンプン", en: "angry / fuming", kana: "punpun" },
            { jp: "クスクス", en: "giggle / heh heh", kana: "kusukusu" },
            { jp: "しくしく", en: "weeping / sniffle", kana: "shikushiku" },
            { jp: "ガーン", en: "shock", kana: "gaan" },
            { jp: "ズッキューン", en: "heart struck / squee", kana: "zukkyun" },
            { jp: "ムカッ", en: "angry / snap", kana: "muka" },
            { jp: "ギクッ", en: "startled / gulp", kana: "giku" },
            { jp: "ホッ", en: "relieved / phew", kana: "ho" },
            { jp: "がっかり", en: "disappointed", kana: "gakkari" },
            { jp: "びっくり", en: "surprised", kana: "bikkuri" },
            { jp: "すっきり", en: "refreshed", kana: "sukkiri" },
            { jp: "うっかり", en: "carelessly", kana: "ukkari" },
            { jp: "のんびり", en: "relaxed", kana: "nonbiri" },
            { jp: "ぼんやり", en: "spacing out", kana: "bonyari" },
            { jp: "もじもじ", en: "fidgety / shy", kana: "mojimoji" },
            { jp: "メラメラ", en: "flaming (passion/anger)", kana: "meramera" },
            { jp: "ルンルン", en: "happy / humming", kana: "runrun" },
            { jp: "しょんぼり", en: "downhearted", kana: "shonbori" }
        ],
        2: [ // Actions & Body (25)
            { jp: "ゴクゴク", en: "gulping (drink)", kana: "gokugoku" },
            { jp: "モグモグ", en: "chewing", kana: "mogumogu" },
            { jp: "じー", en: "stare", kana: "jii" },
            { jp: "キョロキョロ", en: "look around", kana: "kyorokyoro" },
            { jp: "ジロジロ", en: "stare rudely", kana: "jirojiro" },
            { jp: "スタスタ", en: "brisk walk", kana: "sutasuta" },
            { jp: "ノロノロ", en: "slow / sluggish", kana: "noronoro" },
            { jp: "ウロウロ", en: "loiter / wander", kana: "urouro" },
            { jp: "バタバタ", en: "running around / busy", kana: "batabata" },
            { jp: "なでなで", en: "petting / pat", kana: "nadenade" },
            { jp: "パンパン", en: "pat / clap", kana: "panpan" },
            { jp: "パシッ", en: "catch", kana: "pashi" },
            { jp: "ポイッ", en: "toss", kana: "poi" },
            { jp: "クンクン", en: "sniff", kana: "kunkun" },
            { jp: "ふむふむ", en: "nodding / hmm", kana: "fumufumu" },
            { jp: "ガブッ", en: "bite", kana: "gabu" },
            { jp: "ペロペロ", en: "lick", kana: "peropero" },
            { jp: "グーグー", en: "snoring / stomach growl", kana: "guuguu" },
            { jp: "スイスイ", en: "swimming / smooth", kana: "suisui" },
            { jp: "ゴシゴシ", en: "scrubbing", kana: "goshigoshi" },
            { jp: "グルグル", en: "spinning", kana: "guruguru" },
            { jp: "フラフラ", en: "dizzy / unsteady", kana: "furafura" },
            { jp: "ペラペラ", en: "fluent / chatting", kana: "perapera" },
            { jp: "コソコソ", en: "sneaking / whispering", kana: "kosokoso" },
            { jp: "ギュー", en: "squeeze / hug", kana: "gyuu" }
        ],
        3: [ // Sounds & Nature (25)
            { jp: "ザーザー", en: "heavy rain", kana: "zaazaa" },
            { jp: "ポツポツ", en: "light rain", kana: "potsupotsu" },
            { jp: "ゴロゴロ", en: "thunder / rolling", kana: "gorogoro" },
            { jp: "ヒュー", en: "wind / swish", kana: "hyuu" },
            { jp: "ビューン", en: "zoom (fast)", kana: "byuun" },
            { jp: "キラキラ", en: "sparkle", kana: "kirakira" },
            { jp: "ピカピカ", en: "shiny", kana: "pikapika" },
            { jp: "トントン", en: "knock / tap", kana: "tonton" },
            { jp: "ピンポン", en: "ding dong", kana: "pinpon" },
            { jp: "ガチャ", en: "door opening / click", kana: "gacha" },
            { jp: "カチャカチャ", en: "typing / click clack", kana: "kachakacha" },
            { jp: "ガシャン", en: "crash", kana: "gashan" },
            { jp: "ドカン", en: "boom / explosion", kana: "dokan" },
            { jp: "バタン", en: "slam (door)", kana: "batan" },
            { jp: "ピシャ", en: "splash / splat", kana: "pisha" },
            { jp: "ボチャ", en: "splish / splash", kana: "bocha" },
            { jp: "ふわふわ", en: "fluffy", kana: "fuwafuwa" },
            { jp: "ツルツル", en: "slippery / smooth", kana: "tsurutsuru" },
            { jp: "ネバネバ", en: "sticky", kana: "nebaneba" },
            { jp: "ベタベタ", en: "sticky (unpleasant)", kana: "betabeta" },
            { jp: "サラサラ", en: "silky / dry", kana: "sarasara" },
            { jp: "ワンワン", en: "woof (dog)", kana: "wanwan" },
            { jp: "ニャー", en: "meow (cat)", kana: "nyaa" },
            { jp: "コケコッコー", en: "cock-a-doodle-doo", kana: "kokekokko" },
            { jp: "ゲロゲロ", en: "ribbit (frog)", kana: "gerogero" }
        ],
        4: [ // Manga SFX & Impact (25)
            { jp: "シーン", en: "silence", kana: "shiin" },
            { jp: "ズーン", en: "gloom / doom", kana: "zuun" },
            { jp: "ドクン", en: "heartbeat / badum", kana: "dokun" },
            { jp: "ビクッ", en: "jolt / twitch", kana: "biku" },
            { jp: "パシッ", en: "slap / catch", kana: "pashi" },
            { jp: "ボカッ", en: "hit / punch", kana: "boka" },
            { jp: "ドシン", en: "heavy thud / flump", kana: "doshin" },
            { jp: "ピシッ", en: "crack / flick", kana: "pishi" },
            { jp: "バリッ", en: "rip / tear", kana: "bari" },
            { jp: "ジャジャーン", en: "Ta-da!", kana: "jajaan" },
            { jp: "キラーン", en: "flash / gleam", kana: "kiraan" },
            { jp: "ゴゴゴゴ", en: "menacing rumble", kana: "gogogogo" },
            { jp: "ササッ", en: "rustle / quick move", kana: "sasa" },
            { jp: "ピタッ", en: "stop suddenly", kana: "pita" },
            { jp: "クルクル", en: "spin", kana: "kurukuru" },
            { jp: "ガヤガヤ", en: "noise / crowd", kana: "gayagaya" },
            { jp: "トォー", en: "jump / hup", kana: "too" },
            { jp: "ズッドン", en: "heavy fall / kaboom", kana: "zuddon" },
            { jp: "ポン", en: "pop / pat", kana: "pon" },
            { jp: "くねくね", en: "slither / wiggle", kana: "kunekune" },
            { jp: "めちゃめちゃ", en: "messy / extreme", kana: "mechamecha" },
            { jp: "バラバラ", en: "scattered / crumbling", kana: "barabara" },
            { jp: "ボロボロ", en: "worn out / crumbling", kana: "boroboro" },
            { jp: "ギリギリ", en: "just barely / grinding", kana: "girigiri" },
            { jp: "あちゃ～", en: "oops / yikes", kana: "achaa" }
        ]
    };

    const synth = window.speechSynthesis;
    let voices = [];
    synth.onvoiceschanged = () => { voices = synth.getVoices(); };
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    // --- 状態変数 ---
    let currentLevel = 1;
    let quizList = [];
    let currentQIndex = 0;
    let score = 0;
    let currentItem = null;

    // --- 音声再生 ---
    window.speak = (text) => {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 1.0;
        const jpVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
        if(jpVoice) utterThis.voice = jpVoice;
        synth.speak(utterThis);
    };

    // --- 画面遷移 ---
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        const footer = document.getElementById('footer-start');
        footer.style.display = (id === 'screen-practice') ? 'block' : 'none';
        window.scrollTo(0,0);
    };

    window.goBack = () => {
        const activeId = document.querySelector('.screen.active').id;
        if (activeId === 'screen-level') showScreen('screen-practice');
        else if (activeId === 'screen-game') {
            if(confirm("ゲームをやめますか？")) showScreen('screen-level');
        }
        else if (activeId === 'screen-result') showScreen('screen-level');
        else window.location.href = 'index.html';
    };

    // --- 辞書生成 ---
    function initDictionary() {
        const container = document.getElementById('dictionary-container');
        container.textContent = '';
        
        // 全データをフラットに
        let allWords = [];
        for(let l=1; l<=4; l++) allWords = allWords.concat(onomatopoeiaData[l]);
        // 名前順ソート (任意)
        // allWords.sort((a,b) => a.kana.localeCompare(b.kana));

        allWords.forEach(item => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.dataset.kana = item.kana; // 検索用
            card.dataset.en = item.en.toLowerCase();
            
            card.textContent = `
                <div class="word-jp">${item.jp}</div>
                <div class="word-en">${item.en}</div>
                <div class="play-icon"><i class="fa-solid fa-volume-high"></i></div>
            `;
            card.onclick = () => speak(item.jp);
            container.appendChild(card);
        });
    }

    // --- 検索機能 ---
    window.filterList = () => {
        const input = document.getElementById('search-input').value.toLowerCase();
        const cards = document.querySelectorAll('.word-card');
        
        cards.forEach(card => {
            const kana = card.dataset.kana;
            const en = card.dataset.en;
            if(kana.includes(input) || en.includes(input)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- ゲームロジック ---
    window.startGame = (level) => {
        currentLevel = level;
        const source = onomatopoeiaData[level];
        // ランダムに10問
        quizList = [];
        for(let i=0; i<10; i++) {
            quizList.push(source[Math.floor(Math.random() * source.length)]);
        }
        currentQIndex = 0;
        score = 0;
        
        document.getElementById('game-lvl').textContent = level;
        showScreen('screen-game');
        nextQuestion();
    };

    function nextQuestion() {
        if(currentQIndex >= 10) {
            endGame();
            return;
        }

        currentItem = quizList[currentQIndex];
        document.getElementById('q-current').textContent = currentQIndex + 1;
        
        const qWordEl = document.getElementById('q-word');
        qWordEl.textContent = currentItem.jp;
        
        // アニメーションリセット
        qWordEl.style.animation = 'none';
        qWordEl.offsetHeight; 
        qWordEl.style.animation = 'popWord 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // 音声再生
        window.playQuestionSound = () => speak(currentItem.jp);
        setTimeout(() => speak(currentItem.jp), 300);

        // 選択肢生成 (正解1 + 誤答2)
        // 誤答は同レベルから選ぶ
        const source = onomatopoeiaData[currentLevel];
        const others = source.filter(i => i.jp !== currentItem.jp);
        const wrong = others.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        let choices = [currentItem, ...wrong];
        choices.sort(() => 0.5 - Math.random());
        
        const btnContainer = document.getElementById('choice-container');
        btnContainer.textContent = '';
        
        choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = c.en;
            btn.onclick = () => checkAnswer(c.jp === currentItem.jp, btn);
            btnContainer.appendChild(btn);
        });
    }

    function checkAnswer(isCorrect, btn) {
        // ボタン無効化
        const btns = document.querySelectorAll('.choice-btn');
        btns.forEach(b => b.disabled = true);

        if(isCorrect) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('incorrect');
            // 正解を表示
            btns.forEach(b => {
                if(b.textContent === currentItem.en) b.classList.add('correct');
            });
        }

        setTimeout(() => {
            currentQIndex++;
            nextQuestion();
        }, 1200);
    }

    function endGame() {
        showScreen('screen-result');
        document.getElementById('final-score').textContent = score;
        const msg = document.getElementById('result-msg');
        
        if(score === 10) msg.textContent = "Excellent! You are a Manga Master!";
        else if(score >= 8) msg.textContent = "Great job! Keep reading manga!";
        else if(score >= 5) msg.textContent = "Good! Try again!";
        else msg.textContent = "Fight! Ganbatte!";
    }

    // 初期化
    initDictionary();