// --- データ定義: 「ましょうか」は V-stem (ます形から「ます」を取った形) につく ---
    // stem: ブロックとして表示される形（例：もち、てつだい）
    const baseOfferVerbs = [
        { v_masu: "もちます", stem: "もち", object: "にもつ" }, 
        { v_masu: "てつだいます", stem: "てつだい", object: "" }, 
        { v_masu: "かします", stem: "かし", object: "かさ" }, 
        { v_masu: "あけます", stem: "あけ", object: "まど" },
        { v_masu: "しめます", stem: "しめ", object: "ドア" }, 
        { v_masu: "つけます", stem: "つけ", object: "でんき" },
        { v_masu: "けします", stem: "けし", object: "テレビ" }, 
        { v_masu: "おしえます", stem: "おしえ", object: "ちず" },
        { v_masu: "むかえにいきます", stem: "むかえにいき", object: "えきまで" }, 
        { v_masu: "かきます", stem: "かき", object: "ちず" },
    ];
    
    const baseInviteVerbs = [
        { v_masu: "たべます", stem: "たべ", object: "ごはん" }, 
        { v_masu: "のみます", stem: "のみ", object: "コーヒー" },
        { v_masu: "いきます", stem: "いき", object: "えいがに" }, 
        { v_masu: "やすみます", stem: "やすみ", object: "すこし" },
        { v_masu: "かえります", stem: "かえり", object: "" }, 
        { v_masu: "はじめます", stem: "はじめ", object: "そろそろ" },
        { v_masu: "あそびます", stem: "あそび", object: "ゲームで" }, 
        { v_masu: "みます", stem: "み", object: "えいが" },
        { v_masu: "あいます", stem: "あい", object: "あした" }, 
        { v_masu: "さんぽします", stem: "さんぽし", object: "こうえんを" },
    ];

    // Game 1: お手伝い (Offer) - 30問生成
    const offerScenarios = [
        { verb_index: 0, scenario: "にもつがおもそうです。「もちます」といいます。", prefix: "", particles: ["を"], verb: "もち" },
        { verb_index: 1, scenario: "いそがしそうなともだちに「てつだいます」といいます。", prefix: "", particles: [], verb: "てつだい" },
        { verb_index: 2, scenario: "あめがふっています。かさがありません。", prefix: "かさ", particles: ["を"], verb: "かし" },
        { verb_index: 3, scenario: "へやがあついです。まどをあけたいです。", prefix: "まど", particles: ["を"], verb: "あけ" },
        { verb_index: 4, scenario: "さむいのでドアをしめたいです。", prefix: "", particles: ["を"], verb: "しめ" },
        { verb_index: 5, scenario: "へやがくらいです。でんきをつけたいです。", prefix: "でんき", particles: ["を"], verb: "つけ" },
        { verb_index: 6, scenario: "テレビがうるさいです。けしたいです。", prefix: "テレビ", particles: ["を"], verb: "けし" },
        { verb_index: 7, scenario: "みちにまよっているひとがいます。", prefix: "", particles: ["を"], verb: "おしえ" },
        { verb_index: 8, scenario: "あめがふっています。えきまでいきます。", prefix: "", particles: [], verb: "むかえにいき" },
        { verb_index: 9, scenario: "みちをせつめいします。ちずをかきます。", prefix: "", particles: ["を"], verb: "かき" },
        
        // バリエーション
        { verb_index: 0, scenario: "かばんがおもそうです。", prefix: "かばん", custom_object: "", particles: ["を"], verb: "もち" },
        { verb_index: 1, scenario: "しごとがおわらないようです。てつだいます。", prefix: "しごと", custom_object: "", particles: ["を"], verb: "てつだい" },
        { verb_index: 2, scenario: "ぺんをわすれたひとに。", prefix: "ぺん", custom_object: "", particles: ["を"], verb: "かし" },
        { verb_index: 3, scenario: "カーテンをあけたいです。", prefix: "カーテン", custom_object: "", particles: ["を"], verb: "あけ" },
        { verb_index: 6, scenario: "ラジオをけしたいです。", prefix: "ラジオ", custom_object: "", particles: ["を"], verb: "けし" },
        { verb_index: 7, scenario: "でんわばんごうをおしえます。", prefix: "ばんごう", custom_object: "", particles: ["を"], verb: "おしえ" },
    ];

    // Game 2: お誘い (Invitation) - 30問生成
    const inviteScenarios = [
        { verb_index: 0, scenario: "おひるごはんをいっしょにたべたいです。", prefix: "いっしょに", particles: ["を"], verb: "たべ" },
        { verb_index: 1, scenario: "カフェにいきました。", prefix: "", particles: ["を"], verb: "のみ" },
        { verb_index: 2, scenario: "えいがにさそいます。", prefix: "いっしょに", custom_object: "えいが", particles: ["に"], verb: "いき" },
        { verb_index: 3, scenario: "たくさんあるきました。つかれました。", prefix: "", particles: [], verb: "やすみ" },
        { verb_index: 4, scenario: "もうおそくなりました。", prefix: "そろそろ", particles: [], verb: "かえり" },
        { verb_index: 5, scenario: "じかんになりました。", prefix: "", particles: [], verb: "はじめ" },
        { verb_index: 6, scenario: "ひまなとき、ゲームにさそいます。", prefix: "いっしょに", particles: ["で"], verb: "あそび" },
        { verb_index: 7, scenario: "おもしろいテレビがあります。", prefix: "テレビ", custom_object: "", particles: ["を"], verb: "み" },
        { verb_index: 8, scenario: "またあいたいです。", prefix: "また", particles: [], verb: "あい" },
        { verb_index: 9, scenario: "てんきがいいのでこうえんでさんぽしたいです。", prefix: "いっしょに", particles: [""], verb: "さんぽし" },

        { verb_index: 0, scenario: "ゆうごはんをさそいます。", prefix: "ゆうごはん", custom_object: "", particles: ["を"], verb: "たべ" },
        { verb_index: 1, scenario: "おちゃをのみたいです。", prefix: "おちゃ", custom_object: "", particles: ["を"], verb: "のみ" },
        { verb_index: 2, scenario: "かいものにさそいます。", prefix: "かいもの", custom_object: "", particles: ["に"], verb: "いき" },
        { verb_index: 3, scenario: "ベンチがあります。すわりたいです。", prefix: "あそこで", custom_object: "", particles: [], verb: "やすみ" },
    ];

    let currentQuizData = []; 
    let score = 0;
    let currentQIndex = 0;
    let isChecking = false;
    let currentMode = '';
    const GAME_BASE_ID = "mashouka"; // ★ ユニークなゲームIDを定義

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

    // TTS/Helper Functions (簡略化)
    const synth = window.speechSynthesis;
    let voices = [];
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    function speak(text) {
        synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'ja-JP'; ut.rate = 0.9;
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
        if (currentQ) speak(currentQ.scenario);
    }

    // 戻るボタン処理
    window.handleHeaderBack = function() {
        if (mainGameArea.style.display !== 'none') {
            mainGameArea.style.display = 'none';
            modeSelection.style.display = 'block';
            synth.cancel();
        } else {
            window.location.href = 'verb_mashouka_practice.html';
        }
    };

    window.startGame = function(mode) {
        // --- モード設定 ---
        currentMode = mode;
        modeSelection.style.display = 'none';
        mainGameArea.style.display = 'block';
        
        let scenarios = mode === 'offer' ? offerScenarios : inviteScenarios;
        let verbs = mode === 'offer' ? baseOfferVerbs : baseInviteVerbs;
        
        currentQuizData = [];
        for (let i = 0; i < 30; i++) { 
            const scenario = scenarios[i % scenarios.length]; 
            const verbData = verbs[scenario.verb_index];
            
            let objectBlock = verbData.object;
            if (scenario.custom_object !== undefined) {
                objectBlock = scenario.custom_object;
            }

            const variableBlocks = [scenario.prefix, objectBlock].concat(scenario.particles).concat(scenario.verb);
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
        gameModeDisplay.innerText = mode === 'offer' ? "おてつだいモード" : "おさそいモード";
        currentQIndex = 0; score = 0; updateScore();
        nextQuestion();
    }

    function nextQuestion() {
        if (currentQIndex >= currentQuizData.length) {
            showFinalResult(); return;
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
        
        const fixedBlock = createBlock("ましょうか", true);
        constructionArea.appendChild(fixedBlock);

        const blocksToShuffle = currentQ.all_blocks.slice(); 
        const shuffledBlocks = shuffleArray(blocksToShuffle);
        
        renderBlocks(shuffledBlocks);
        readQuestion();
    }
    
    function renderBlocks(shuffledBlocks) {
        blockChoices.textContent = '';
        shuffledBlocks.forEach(word => {
            blockChoices.appendChild(createBlock(word, false));
        });
    }
    
    function createBlock(word, isFixed) {
        const block = document.createElement('div');
        block.className = 'word-block';
        if (isFixed) {
            block.classList.add('fixed'); block.onclick = null;
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
    
    window.checkSentence = async function() { // ★ async function に変更
        if (isChecking) return;
        isChecking = true; checkBtn.disabled = true;
        
        const constructedWords = Array.from(constructionArea.children)
            .filter(block => !block.classList.contains('fixed'))
            .map(block => block.innerText);
            
        const constructedSentence = constructedWords.join('');
        const correctSentence = currentQ.correct_order.join('');

        if (constructedSentence === correctSentence) {
            playSeikai();

            // --- ★ Firebase Point Logic ---
            const GAME_ID = `mashouka_${currentMode}`; // mashouka_offer or mashouka_invite
            
            // window.addPuzzlePoints は module script で定義されています
            const pointAdded = await window.addPuzzlePoints(currentQIndex + 1, GAME_ID); 
            
            if (pointAdded) {
                score++;
                updateScore();
                resultMessage.innerHTML = `⭕️ **せいかい！ (+1pt)** <span style="font-size:0.9em;">（${constructedSentence}ましょうか）</span>`;
            } else {
                resultMessage.innerHTML = `⭕️ **せいかい！** (今日はこの問題のポイント獲得済み) <span style="font-size:0.9em;">（${constructedSentence}ましょうか）</span>`;
            }
            // --- ★ End Point Logic ---

            speak("せいかい！"); 
            currentQIndex++;
            setTimeout(() => { 
                resultMessage.textContent = ''; checkBtn.disabled = false; nextQuestion(); 
            }, 2500);
        } else {
            playBubu();
            constructionArea.classList.add('shaking');
            resultMessage.className = 'incorrect-msg';
            resultMessage.textContent = `❌ **ちがいます...** もう一度ならびかえてみてね！`;
            speak("ちがいます");
            setTimeout(() => {
                constructionArea.classList.remove('shaking'); isChecking = false; checkBtn.disabled = false;
            }, 1500);
        }
    }

    function showFinalResult() {
        document.getElementById('main-game-area').textContent = `
            <div class="main-card">
                <h2 style="color:var(--primary-dark);">ゲーム終了！</h2>
                <p style="font-size:1.5em; font-weight:bold;">${currentQuizData.length}問中 ${score} 点です。</p>
                <p style="color:#777;">よくがんばりました！</p>
                <a class="back-to-practice" style="background: var(--correct); box-shadow: 0 4px 0 #3a7d40; display: inline-block;" href="verb_mashouka_puzzle_master.html">
                    <i class="fa-solid fa-sync"></i> もういちど
                </a>
            </div>`;
        speak(`ゲーム終了です。${currentQuizData.length}問中${score}点でした。`);
    }