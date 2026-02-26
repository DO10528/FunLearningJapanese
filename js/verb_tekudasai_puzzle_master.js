// --- データ定義 ---
    const baseRequestVerbs = [
        { v_masu: "かします", v_te: "かして", object: "えんぴつ", reading: "かします" }, 
        { v_masu: "てつだいます", v_te: "てつだって", object: "にもつ", reading: "てつだいます" },
        { v_masu: "おしえます", v_te: "おしえて", object: "みち", reading: "おしえます" }, 
        { v_masu: "あけます", v_te: "あけて", object: "まど", reading: "あけます" },
        { v_masu: "しめます", v_te: "しめて", object: "ドア", reading: "しめます" }, 
        { v_masu: "とります", v_te: "とって", object: "あのほん", reading: "とります" },
        { v_masu: "まちます", v_te: "まって", object: "すこし", reading: "まちます" }, 
        { v_masu: "つかわせます", v_te: "つかわせて", object: "このぺん", reading: "つかわせます" },
        { v_masu: "かえします", v_te: "かえして", object: "あのほん", reading: "かえします" }, 
        { v_masu: "なおします", v_te: "なおして", object: "こわれたいす", reading: "なおします" },
    ];
    
    const baseOfferVerbs = [
        { v_masu: "たべます", v_te: "たべて", object: "このけーき", reading: "たべます" }, 
        { v_masu: "のみます", v_te: "のんで", object: "おちゃ", reading: "のみます" },
        { v_masu: "すわります", v_te: "すわって", object: "ここ", reading: "すわります" }, 
        { v_masu: "みます", v_te: "みて", object: "しゃしん", reading: "みます" },
        { v_masu: "ききます", v_te: "きいて", object: "おんがく", reading: "ききます" }, 
        { v_masu: "はいります", v_te: "はいって", object: "へや", reading: "はいります" },
        { v_masu: "いいます", v_te: "いって", object: "なまえ", reading: "いいます" }, 
        { v_masu: "ためします", v_te: "ためして", object: "このふく", reading: "ためします" },
        { v_masu: "やすみます", v_te: "やすんで", object: "ゆっくり", reading: "やすみます" }, 
        { v_masu: "かきます", v_te: "かいて", object: "メモ", reading: "かきます" },
    ];

    // Game 1: お願い (依頼)
    const requestScenarios = [
        { verb_index: 0, scenario: "えんぴつがありません。ともだちになんといいますか？", prefix: "ちょっと", particles: ["を"], verb: "かして" },
        { verb_index: 1, scenario: "おもいにもつをもっています。てつだいをたのみます。", prefix: "ちょっと", particles: ["を"], verb: "てつだって" },
        { verb_index: 2, scenario: "みちにまよいました。みちをたずねます。", prefix: "すみません", particles: ["を"], verb: "おしえて" },
        { verb_index: 3, scenario: "へやがあついです。まどをあけてほしいです。", prefix: "ちょっと", particles: ["を"], verb: "あけて" },
        { verb_index: 4, scenario: "さむいので、ドアをしめてほしいです。", prefix: "すみません", particles: ["を"], verb: "しめて" },
        { verb_index: 5, scenario: "たかいところにあるほんをとってほしいです。", prefix: "ちょっと", particles: ["を"], verb: "とって" },
        { verb_index: 6, scenario: "あいてがおくれているので、もう少しまってほしいです。", prefix: "ごめん", particles: [""], verb: "まって" },
        { verb_index: 7, scenario: "じぶんのぺんがこわれたので、つかわせてほしい。", prefix: "ちょっと", particles: ["を"], verb: "つかわせて" }, 
        { verb_index: 8, scenario: "かりたほんをかえしてほしいです。", prefix: "すみません", particles: ["を"], verb: "かえして" },
        { verb_index: 9, scenario: "こわれたいすをなおしてほしいです。", prefix: "ちょっと", particles: ["を"], verb: "なおして" },
        
        { verb_index: 0, scenario: "おかねがたりません。すこしかしてほしいです。", prefix: "すこし", custom_object: "おかね", particles: ["を"], verb: "かして" },
        { verb_index: 1, scenario: "いっしょにそうじをするのをてつだってほしいです。", prefix: "そうじ", custom_object: "", particles: ["を"], verb: "てつだって" },
        { verb_index: 2, scenario: "じゅうしょをおしえてほしいです。", prefix: "じゅうしょ", custom_object: "", particles: ["を"], verb: "おしえて" }, 
        { verb_index: 3, scenario: "ドアをあけるのをてつだってほしいです。", prefix: "いっしょに", custom_object: "ドア", particles: ["を"], verb: "あけて" },
        { verb_index: 5, scenario: "あのたなのたかいほんをとってほしいです。", prefix: "たかいほん", custom_object: "", particles: ["を"], verb: "とって" },
        { verb_index: 9, scenario: "こわれたとけいをなおしてほしいです。", prefix: "このとけい", custom_object: "", particles: ["を"], verb: "なおして" },
    ];

    // Game 2: 勧め (Offer/Suggestion)
    const offerScenarios = [
        { verb_index: 0, scenario: "おかしをともだちにわたします。どうぞとすすめます。", prefix: "どうぞ", particles: ["を"], verb: "たべて" },
        { verb_index: 1, scenario: "おちゃをいれました。どうぞとすすめます。", prefix: "どうぞ", particles: ["を"], verb: "のんで" },
        { verb_index: 2, scenario: "つかれているひとにせきをすすめます。", prefix: "どうぞ", particles: ["に"], verb: "すわって" },
        { verb_index: 3, scenario: "じぶんのしゃしんをともだちにみせます。", prefix: "ちょっと", particles: ["を"], verb: "みて" },
        { verb_index: 4, scenario: "あたらしいおんがくをきくようすすめます。", prefix: "どうぞ", particles: ["を"], verb: "きいて" },
        { verb_index: 5, scenario: "へやにさきにはいるようすすめます。", prefix: "どうぞ", particles: ["に"], verb: "はいって" },
        { verb_index: 6, scenario: "なまえをよぶようすすめます。", prefix: "なまえ", custom_object: "", particles: ["を"], verb: "いって" },
        { verb_index: 7, scenario: "あたらしいふくをためすようすすめます。", prefix: "これを", custom_object: "", particles: ["を"], verb: "ためして" },
        { verb_index: 8, scenario: "むりせずゆっくりやすむようすすめます。", prefix: "ゆっくり", custom_object: "", particles: ["で"], verb: "やすんで" },
        { verb_index: 9, scenario: "わすれないようにメモをとるようすすめます。", prefix: "メモ", custom_object: "", particles: ["を"], verb: "かいて" },
        
        { verb_index: 0, scenario: "つくったクッキーをたべてほしいです。", prefix: "よかったら", custom_object: "クッキー", particles: ["を"], verb: "たべて" },
        { verb_index: 1, scenario: "のどがかわいたひとにみずをすすめます。", prefix: "どうぞ", custom_object: "みず", particles: ["を"], verb: "のんで" },
        { verb_index: 2, scenario: "かぞくといっしょにすわるようすすめます。", prefix: "みんな", custom_object: "", particles: ["と"], verb: "すわって" },
        { verb_index: 3, scenario: "あたらしいえいがのよこくをみてほしいです。", prefix: "このえいが", custom_object: "", particles: ["を"], verb: "みて" },
        { verb_index: 4, scenario: "このうたをいっしょにうたうようすすめます。", prefix: "いっしょに", custom_object: "うた", particles: ["を"], verb: "きいて" },
    ];


    let currentQuizData = []; 
    let score = 0;
    let currentQIndex = 0;
    let isChecking = false;
    let currentMode = ''; // 'request' or 'offer'

    // DOM要素
    const scenarioText = document.getElementById('scenario-text');
    const constructionArea = document.getElementById('construction-area');
    const blockChoices = document.getElementById('block-choices');
    const checkBtn = document.getElementById('check-btn');
    const resultMessage = document.getElementById('result-message');
    const verbMasuDisplay = document.getElementById('verb-masu-display');
    const gameModeDisplay = document.getElementById('game-mode-display');
    const mainGameArea = document.getElementById('main-game-area');
    const modeSelection = document.getElementById('mode-selection');

    // --- TTS/Helper Functions ---
    const synth = window.speechSynthesis;
    let voices = [];
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    function speak(text) {
        synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'ja-JP';
        ut.rate = 0.9;
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        let target = jpVoices.find(v => v.name.includes('Google') || v.name.includes('Female'));
        if(!target && jpVoices.length) target = jpVoices[0];
        if(target) ut.voice = target;
        synth.speak(ut);
    }
    function playSeikai() { /* Sound placeholder */ }
    function playBubu() { /* Sound placeholder */ }
    function updateScore() { document.getElementById('score').innerText = score; }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function readQuestion() {
        if (currentQ) {
            speak(currentQ.scenario);
        }
    }
    
    window.handleHeaderBack = function() {
        if (mainGameArea.style.display !== 'none') {
            mainGameArea.style.display = 'none';
            modeSelection.style.display = 'block';
            synth.cancel();
        } else {
            window.location.href = 'verb_tekudasai_practice.html';
        }
    };
    // ----------------------------


    // --- ゲーム管理ロジック ---
    window.startGame = function(mode) {
        currentMode = mode;
        modeSelection.style.display = 'none';
        mainGameArea.style.display = 'block';
        
        let scenarios = mode === 'request' ? requestScenarios : offerScenarios;
        let verbs = mode === 'request' ? baseRequestVerbs : baseOfferVerbs;
        
        currentQuizData = [];
        
        for (let i = 0; i < 30; i++) { 
            const scenario = scenarios[i % scenarios.length]; 
            const verbData = verbs[scenario.verb_index];
            
            // ★修正: custom_object があればそれを使い、""なら無視、undefinedなら元の動詞のobjectを使う
            let objectBlock = verbData.object;
            if (scenario.custom_object !== undefined) {
                objectBlock = scenario.custom_object;
            }

            const variableBlocks = [scenario.prefix, objectBlock].concat(scenario.particles).concat(scenario.verb);
            
            // 空のブロックを除去 (custom_object: "" の場合など)
            const correctOrder = variableBlocks.filter(b => b && b !== ""); 

            currentQuizData.push({
                id: i + 1,
                scenario: scenario.scenario,
                v_masu: verbData.v_masu,
                all_blocks: correctOrder.slice(), 
                correct_order: correctOrder.slice(),
            });
        }
        
        shuffleArray(currentQuizData);

        gameModeDisplay.innerText = mode === 'request' ? "おねがいモード" : "すすめモード";
        currentQIndex = 0;
        score = 0;
        updateScore();
        nextQuestion();
    }

    function nextQuestion() {
        if (currentQIndex >= currentQuizData.length) {
            showFinalResult();
            return;
        }
        isChecking = false;
        currentQ = currentQuizData[currentQIndex];
        
        document.getElementById('q-number').innerText = currentQIndex + 1;
        scenarioText.innerText = currentQ.scenario;
        verbMasuDisplay.innerText = `V-ます形: ${currentQ.v_masu}`;
        
        constructionArea.textContent = '';
        constructionArea.classList.remove('shaking');
        resultMessage.textContent = '';
        checkBtn.disabled = false;
        
        const fixedKudasai = createBlock("ください", true);
        constructionArea.appendChild(fixedKudasai);

        const blocksToShuffle = currentQ.all_blocks.slice(); 
        const shuffledBlocks = shuffleArray(blocksToShuffle);
        
        renderBlocks(shuffledBlocks);

        readQuestion();
    }
    
    function renderBlocks(shuffledBlocks) {
        blockChoices.textContent = '';
        shuffledBlocks.forEach(word => {
            const block = createBlock(word, false);
            blockChoices.appendChild(block);
        });
    }
    
    function createBlock(word, isFixed) {
        const block = document.createElement('div');
        block.className = 'word-block';
        if (isFixed) {
            block.classList.add('fixed');
            block.onclick = null;
        } else {
            block.onclick = () => moveBlock(block);
        }
        block.innerText = word;
        return block;
    }

    function moveBlock(block) {
        if (isChecking || block.classList.contains('fixed')) return;
        
        if (block.parentElement.id === 'block-choices') {
            blockChoices.removeChild(block);
            constructionArea.insertBefore(block, constructionArea.lastChild);
        } else if (block.parentElement.id === 'construction-area') {
            constructionArea.removeChild(block);
            blockChoices.appendChild(block);
        }
    }
    
    window.checkSentence = async function() {
        if (isChecking) return;
        isChecking = true;
        
        checkBtn.disabled = true;
        
        const constructedWords = Array.from(constructionArea.children)
            .filter(block => !block.classList.contains('fixed'))
            .map(block => block.innerText);
            
        const constructedSentence = constructedWords.join('');
        const correctSentence = currentQ.correct_order.join('');

        if (constructedSentence === correctSentence) {
            playSeikai();
            
            // --- ★ Firebase Point Logic ---
            const GAME_ID = `tekudasai_${currentMode}`;
            const pointAdded = await window.addPuzzlePoints(currentQIndex + 1, GAME_ID);

            if (pointAdded) {
                score++;
                updateScore();
                resultMessage.innerHTML = `⭕️ **せいかい！ (+1pt)** <span style="font-size:0.9em;">（${correctSentence}ください）</span>`;
            } else {
                resultMessage.innerHTML = `⭕️ **せいかい！** (今日はこの問題のポイント獲得済み) <span style="font-size:0.9em;">（${correctSentence}ください）</span>`;
            }
            // --- ★ End Point Logic ---

            speak("せいかい！"); 
            
            currentQIndex++;
            setTimeout(() => { 
                resultMessage.textContent = '';
                checkBtn.disabled = false;
                nextQuestion(); 
            }, 2500);

        } else {
            playBubu();
            constructionArea.classList.add('shaking');
            resultMessage.className = 'incorrect-msg';
            resultMessage.textContent = `❌ **ちがいます...** もう一度ならびかえてみてね！`;
            speak("ちがいます");
            
            setTimeout(() => {
                constructionArea.classList.remove('shaking');
                isChecking = false; 
                checkBtn.disabled = false;
            }, 1500);
        }
    }

    function showFinalResult() {
        document.getElementById('main-game-area').textContent = `
            <div class="main-card">
                <h2 style="color:var(--primary-dark);">ゲーム終了！</h2>
                <p style="font-size:1.5em; font-weight:bold;">${currentQuizData.length}問中 ${score} 点です。</p>
                <p style="color:#777;">よくがんばりました！</p>
                <a class="back-to-practice" style="background: var(--correct); box-shadow: 0 4px 0 #3a7d40; display: inline-block;" href="verb_tekudasai_puzzle_master.html">
                    <i class="fa-solid fa-sync"></i> もういちど
                </a>
            </div>`;
        speak(`ゲーム終了です。${currentQuizData.length}問中${score}点でした。`);
    }