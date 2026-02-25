// --- 画像パス ---
    const IMG_PATH = 'assets/images/school/'; // ※フォルダ名は環境に合わせて変更してください

    // --- データ定義 ---
    const places = [
        { word: 'きょうしつ', kanji: '教室', accepts: ['きょうしつ', '教室'] },
        { word: 'ばいてん', kanji: '売店', accepts: ['ばいてん', '売店'] },
        { word: 'しょくどう', kanji: '食堂', accepts: ['しょくどう', '食堂'] },
        { word: 'としょしつ', kanji: '図書室', accepts: ['としょしつ', '図書室'] },
        { word: 'りかしつ', kanji: '理科室', accepts: ['りかしつ', '理科室'] },
        { word: 'コンピューターしつ', kanji: 'PC室', accepts: ['こんぴゅーたーしつ', 'コンピューター室', 'pc室'] },
        { word: 'ほけんしつ', kanji: '保健室', accepts: ['ほけんしつ', '保健室'] },
        { word: 'じむしつ', kanji: '事務室', accepts: ['じむしつ', '事務室'] },
        { word: 'たいいくかん', kanji: '体育館', accepts: ['たいいくかん', '体育館'] },
        { word: 'こうてい', kanji: '校庭', accepts: ['こうてい', '校庭'] }
    ];

    const living = [ // います
        { word: 'せんせい', kanji: '先生', accepts: ['せんせい', '先生'] },
        { word: 'ともだち', kanji: '友達', accepts: ['ともだち', '友達', 'お友達'] },
        { word: 'がくせい', kanji: '学生', accepts: ['がくせい', '学生', '生徒', 'せいと'] }
    ];

    const objects = [ // あります
        { word: 'ほん', kanji: '本', accepts: ['ほん', '本'] },
        { word: 'ノート', kanji: 'ノート', accepts: ['のーと', 'ノート'] },
        { word: 'テレビ', kanji: 'テレビ', accepts: ['てれび', 'テレビ'] },
        { word: 'ほんだな', kanji: '本棚', accepts: ['ほんだな', '本棚'] },
        { word: 'こくばん', kanji: '黒板', accepts: ['こくばん', '黒板'] },
        { word: 'とけい', kanji: '時計', accepts: ['とけい', '時計'] },
        { word: 'つくえ', kanji: '机', accepts: ['つくえ', '机'] },
        { word: 'いす', kanji: '椅子', accepts: ['いす', '椅子'] },
        { word: 'かばん', kanji: '鞄', accepts: ['かばん', 'カバン', '鞄'] },
        { word: 'ボール', kanji: 'ボール', accepts: ['ぼーる', 'ボール'] }
    ];

    const positions = [
        { word: 'うえ', kanji: '上', accepts: ['うえ', '上'] },
        { word: 'した', kanji: '下', accepts: ['した', '下'] },
        { word: 'なか', kanji: '中', accepts: ['なか', '中'] }
    ];

    // --- アプリのステータス ---
    let currentScreen = 'screen-learning';
    let currentMode = 0;
    let quizData = {}; 
    let game4Step = 1; // 1: 〇〇がいますか？ 2: 〇〇もいますか？

    // --- 音声関連 ---
    const synth = window.speechSynthesis;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.continuous = false;
    }

    const soundCorrect = document.getElementById('sound-correct');
    const soundIncorrect = document.getElementById('sound-incorrect');

    // --- 初期化 ---
    window.onload = () => {
        renderGrid('grid-places', places, '');
        renderGrid('grid-imasu', living, 'type-imasu');
        renderGrid('grid-arimasu', objects, 'type-arimasu');
    };

    function renderGrid(containerId, items, extraClass) {
        const grid = document.getElementById(containerId);
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = `vocab-card ${extraClass}`;
            card.textContent = `
                <img src="${IMG_PATH}${item.word}.png" onerror="this.src='https://placehold.co/80?text=img'" alt="${item.word}">
                <span>${item.kanji}</span>
            `;
            card.onclick = () => speakText(item.word);
            grid.appendChild(card);
        });
    }

    function speakText(text) {
        if (synth.speaking) synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP'; utter.rate = 0.9;
        synth.speak(utter);
    }

    // --- 画面遷移＆ボタン制御 ---
    function switchScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        currentScreen = id;
        updateBottomBtn();
    }

    function updateBottomBtn() {
        const btn = document.getElementById('fixed-action-btn');
        const text = document.getElementById('fixed-btn-text');
        
        if (currentScreen === 'screen-learning') {
            btn.className = 'fixed-bottom-btn';
            btn.textContent = '<i class="fa-solid fa-play"></i> <span id="fixed-btn-text">ゲームスタート！</span>';
        } else if (currentScreen === 'screen-modes') {
            btn.className = 'fixed-bottom-btn btn-mode-return';
            btn.textContent = '<i class="fa-solid fa-book"></i> <span id="fixed-btn-text">れんしゅう に もどる</span>';
        } else {
            btn.className = 'fixed-bottom-btn btn-mode-return';
            btn.textContent = '<i class="fa-solid fa-list"></i> <span id="fixed-btn-text">ゲームを えらぶ</span>';
        }
    }

    function handleBottomBtnClick() {
        if(synth.speaking) synth.cancel();
        if(isListening && recognition) recognition.stop();
        
        if (currentScreen === 'screen-learning') {
            switchScreen('screen-modes');
        } else if (currentScreen === 'screen-modes') {
            switchScreen('screen-learning');
        } else if (currentScreen === 'screen-play') {
            switchScreen('screen-modes');
        }
    }

    // --- 配列ユーティリティ ---
    function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function shuffle(arr) { return arr.sort(() => 0.5 - Math.random()); }
    function cleanText(t) { return t.replace(/[\s、。！？!?,，]/g, ''); }

    // --- ゲーム開始 ---
    window.startGame = function(mode) {
        currentMode = mode;
        switchScreen('screen-play');
        nextQuestion();
    }

    function nextQuestion() {
        document.getElementById('feedback-text').textContent = '';
        document.getElementById('user-transcript').textContent = '';
        document.getElementById('feedback-text').className = 'feedback-text';
        document.getElementById('mic-btn').classList.add('hidden');
        document.getElementById('options-area').classList.add('hidden');
        document.getElementById('image-area').textContent = '';

        if (currentMode === 1) setupGame1();
        else if (currentMode === 2) setupGame2();
        else if (currentMode === 3) setupGame3();
        else if (currentMode === 4) { game4Step = 1; setupGame4(); }
    }

    // ------------------------------------------
    // ゲーム1: リスニング (2択)
    // ------------------------------------------
    function setupGame1() {
        document.getElementById('mission-text').textContent = 'きいて えらぼう！';
        document.getElementById('options-area').classList.remove('hidden');

        // 正解データ
        const isLiving = Math.random() < 0.5;
        const targetList = isLiving ? living : objects;
        const verb = isLiving ? 'います' : 'あります';
        
        const place = getRandom(places);
        const item = getRandom(targetList);
        const correctSentence = `${place.word} に ${item.word} が ${verb}`;

        // ダミーデータ
        const dummyPlace = getRandom(places);
        let dummyItem = getRandom(targetList);
        while(dummyItem.word === item.word) dummyItem = getRandom(targetList);

        const options = shuffle([
            { place: place, item: item, isCorrect: true },
            { place: dummyPlace, item: dummyItem, isCorrect: false }
        ]);

        const optArea = document.getElementById('options-area');
        optArea.textContent = '';
        
        options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.textContent = `
                <div class="opt-images">
                    <img src="${IMG_PATH}${opt.place.word}.png" onerror="this.src='https://placehold.co/50'">
                    <i class="fa-solid fa-plus" style="margin:auto; color:#ccc;"></i>
                    <img src="${IMG_PATH}${opt.item.word}.png" onerror="this.src='https://placehold.co/50'">
                </div>
            `;
            btn.onclick = () => {
                if(btn.classList.contains('disabled')) return;
                checkGame1(btn, opt.isCorrect);
            };
            optArea.appendChild(btn);
        });

        // 音声再生ボタン
        const imgArea = document.getElementById('image-area');
        const playBtn = document.createElement('button');
        playBtn.className = 'mic-btn';
        playBtn.style.background = '#4a69bd'; playBtn.style.boxShadow = '0 6px 0 #1e3799';
        playBtn.textContent = '<i class="fa-solid fa-volume-high"></i>';
        playBtn.onclick = () => speakText(correctSentence);
        imgArea.appendChild(playBtn);

        setTimeout(() => speakText(correctSentence), 500);
    }

    function checkGame1(btn, isCorrect) {
        const opts = document.querySelectorAll('.option-btn');
        opts.forEach(o => o.classList.add('disabled'));

        if (isCorrect) {
            btn.classList.add('correct');
            soundCorrect.currentTime = 0; soundCorrect.play();
            document.getElementById('feedback-text').textContent = 'せいかい！';
            document.getElementById('feedback-text').classList.add('success');
            setTimeout(nextQuestion, 1500);
        } else {
            btn.classList.add('incorrect');
            soundIncorrect.currentTime = 0; soundIncorrect.play();
            document.getElementById('feedback-text').textContent = 'ちがうよ！';
            setTimeout(() => {
                btn.classList.remove('incorrect');
                opts.forEach(o => o.classList.remove('disabled'));
                document.getElementById('feedback-text').textContent = '';
            }, 1000);
        }
    }

    // ------------------------------------------
    // ゲーム2: スピーキング (だれがいる？なにがある？)
    // ------------------------------------------
    function setupGame2() {
        document.getElementById('mission-text').textContent = 'だれ / なに が いる？';
        document.getElementById('mic-btn').classList.remove('hidden');

        const isLiving = Math.random() < 0.5;
        const targetList = isLiving ? living : objects;
        const verb = isLiving ? 'います' : 'あります';
        const qWord = isLiving ? 'だれ' : 'なに';
        
        quizData.place = getRandom(places);
        quizData.item = getRandom(targetList);
        quizData.verb = verb;

        const qSentence = `${quizData.place.word} に ${qWord} が ${verb} か`;

        drawComboImage(quizData.place.word, quizData.item.word);
        
        // 正解パターン生成
        quizData.accepts = [];
        quizData.place.accepts.forEach(p => {
            quizData.item.accepts.forEach(i => {
                quizData.accepts.push(`${p}に${i}が${verb}`);
            });
        });

        setTimeout(() => speakText(qSentence), 500);
    }

    // ------------------------------------------
    // ゲーム3: スピーキング (うえ/した/なか)
    // ------------------------------------------
    function setupGame3() {
        document.getElementById('mission-text').textContent = 'どこに ある？';
        document.getElementById('mic-btn').classList.remove('hidden');

        // ベースになるもの（机か、部屋か）
        const useObjectAsBase = Math.random() < 0.5;
        let base, pos;
        if(useObjectAsBase) {
            base = getRandom(objects.filter(o => o.word === 'つくえ' || o.word === 'いす' || o.word === 'ほんだな'));
            pos = getRandom(positions.filter(p => p.word === 'うえ' || p.word === 'した'));
        } else {
            base = getRandom(places);
            pos = { word: 'なか', kanji: '中', accepts: ['なか', '中'] };
        }

        const isLiving = Math.random() < 0.5;
        const item = getRandom(isLiving ? living : objects);
        const verb = isLiving ? 'います' : 'あります';
        const qWord = isLiving ? 'だれ' : 'なに';

        quizData.base = base;
        quizData.pos = pos;
        quizData.item = item;
        quizData.verb = verb;

        const qSentence = `${base.word} の ${pos.word} に ${qWord} が ${verb} か`;

        // 画像描画
        const imgArea = document.getElementById('image-area');
        imgArea.textContent = `
            <div class="combo-item">
                <img src="${IMG_PATH}${base.word}.png" onerror="this.src='https://placehold.co/80'">
            </div>
            <div style="font-weight:bold; font-size:1.5em;">の ${pos.kanji} に</div>
            <div class="combo-item">
                <img src="${IMG_PATH}${item.word}.png" onerror="this.src='https://placehold.co/80'">
            </div>
        `;

        // 正解パターン
        quizData.accepts = [];
        base.accepts.forEach(b => {
            pos.accepts.forEach(p => {
                item.accepts.forEach(i => {
                    quizData.accepts.push(`${b}の${p}に${i}が${verb}`);
                });
            });
        });

        setTimeout(() => speakText(qSentence), 500);
    }

    // ------------------------------------------
    // ゲーム4: 会話 (はい/いいえ、〇〇も)
    // ------------------------------------------
    function setupGame4() {
        document.getElementById('mic-btn').classList.remove('hidden');
        
        if (game4Step === 1) {
            document.getElementById('mission-text').textContent = 'しつもんに こたえよう！';
            
            quizData.place = getRandom(places);
            const isLiving = Math.random() < 0.5;
            quizData.isLiving = isLiving;
            quizData.verb = isLiving ? 'います' : 'あります';
            quizData.negVerb = isLiving ? 'いません' : 'ありません';
            
            const targetList = isLiving ? living : objects;
            quizData.item1 = getRandom(targetList);
            
            quizData.item2 = getRandom(targetList);
            while(quizData.item2.word === quizData.item1.word) quizData.item2 = getRandom(targetList);
            
            quizData.hasItem2 = Math.random() < 0.5; // 次の質問で「はい」か「いいえ」か

            drawComboImage(quizData.place.word, quizData.item1.word);
            
            // Step1は常に「はい、います/あります」
            quizData.accepts = [`はい${quizData.verb}`, `はい、${quizData.verb}`];
            
            const qSentence = `${quizData.place.word} に ${quizData.item1.word} が ${quizData.verb} か`;
            setTimeout(() => speakText(qSentence), 500);

        } else if (game4Step === 2) {
            document.getElementById('mission-text').textContent = '〇〇 も いる？';
            
            drawComboImage(quizData.place.word, quizData.item2.word, !quizData.hasItem2);

            if (quizData.hasItem2) {
                quizData.accepts = [`はい${quizData.verb}`, `はい、${quizData.verb}`];
            } else {
                quizData.accepts = [`いいえ${quizData.negVerb}`, `いいえ、${quizData.negVerb}`];
            }

            const qSentence = `${quizData.item2.word} も ${quizData.verb} か`;
            setTimeout(() => speakText(qSentence), 500);
        }
    }

    function drawComboImage(img1, img2, showCross = false) {
        const imgArea = document.getElementById('image-area');
        imgArea.textContent = `
            <div class="combo-item">
                <img src="${IMG_PATH}${img1}.png" onerror="this.src='https://placehold.co/80'">
            </div>
            <i class="fa-solid fa-plus plus-icon"></i>
            <div class="combo-item" style="position:relative;">
                <img src="${IMG_PATH}${img2}.png" onerror="this.src='https://placehold.co/80'">
                ${showCross ? '<i class="fa-solid fa-xmark status-icon"></i>' : ''}
            </div>
        `;
    }

    // --- 音声認識の共通処理 (Game 2, 3, 4) ---
    window.toggleSpeech = function() {
        if (!recognition) return alert("お使いのブラウザは音声認識に対応していません。");
        if (isListening) { recognition.stop(); return; }

        isListening = true;
        const btn = document.getElementById('mic-btn');
        btn.classList.add('listening');
        document.getElementById('user-transcript').textContent = "きいています...";

        if (synth.speaking) synth.cancel();
        try { recognition.start(); } catch(e){}

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-transcript').textContent = `「${transcript}」`;
            handleSpeechResult(transcript);
        };

        recognition.onend = () => { isListening = false; btn.classList.remove('listening'); };
        recognition.onerror = () => { 
            isListening = false; btn.classList.remove('listening');
            document.getElementById('user-transcript').textContent = "うまくききとれませんでした";
        };
    }

    function handleSpeechResult(transcript) {
        const cleanSpoken = cleanText(transcript);
        let maxSim = 0;

        quizData.accepts.forEach(acc => {
            const sim = calculateSimilarity(cleanSpoken, cleanText(acc));
            if (sim > maxSim) maxSim = sim;
        });

        const fb = document.getElementById('feedback-text');
        
        // 類似度80%以上で正解
        if (maxSim >= 80) {
            soundCorrect.currentTime = 0; soundCorrect.play();
            fb.textContent = 'せいかい！';
            fb.className = 'feedback-text success';
            document.getElementById('mic-btn').classList.add('hidden');
            
            setTimeout(() => {
                if (currentMode === 4 && game4Step === 1) {
                    game4Step = 2;
                    setupGame4();
                } else {
                    nextQuestion();
                }
            }, 1500);
        } else {
            soundIncorrect.currentTime = 0; soundIncorrect.play();
            fb.textContent = 'もういちど！';
            fb.className = 'feedback-text danger';
        }
    }

    // レーベンシュタイン距離ベースの類似度
    function calculateSimilarity(s1, s2) {
        if (s1 === s2) return 100;
        if (!s1 || !s2) return 0;
        let costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastVal = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) costs[j] = j;
                else if (j > 0) {
                    let newVal = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) newVal = Math.min(Math.min(newVal, lastVal), costs[j]) + 1;
                    costs[j - 1] = lastVal; lastVal = newVal;
                }
            }
            if (i > 0) costs[s2.length] = lastVal;
        }
        return ((1 - costs[s2.length] / Math.max(s1.length, s2.length)) * 100);
    }