// --- データ定義: 固定は「います」。ブロックは V-て形 ---
    const baseActionVerbs = [
        { v_masu: "たべます", v_te: "たべて", object: "ごはん" },
        { v_masu: "のみます", v_te: "のんで", object: "おちゃ" },
        { v_masu: "よみます", v_te: "よんで", object: "ほん" },
        { v_masu: "かきます", v_te: "かいて", object: "てがみ" },
        { v_masu: "べんきょうします", v_te: "べんきょうして", object: "にほんご" },
        { v_masu: "まちます", v_te: "まって", object: "バス" },
        { v_masu: "はなします", v_te: "はなして", object: "ともだち" },
        { v_masu: "ねます", v_te: "ねて", object: "あかちゃん" },
        { v_masu: "みます", v_te: "みて", object: "テレビ" },
        { v_masu: "ききます", v_te: "きいて", object: "おんがく" },
    ];
    
    const baseStateVerbs = [
        { v_masu: "すみます", v_te: "すんで", object: "とうきょう" },
        { v_masu: "けっこんします", v_te: "けっこんして", object: "たなかさん" },
        { v_masu: "もちます", v_te: "もって", object: "くるま" },
        { v_masu: "しります", v_te: "しって", object: "かのじょ" },
        { v_masu: "きます", v_te: "きて", object: "シャツ" },
        { v_masu: "はきます", v_te: "はいて", object: "ズボン" },
        { v_masu: "かぶります", v_te: "かぶって", object: "ぼうし" },
        { v_masu: "かけます", v_te: "かけて", object: "めがね" },
        { v_masu: "おぼえます", v_te: "おぼえて", object: "パスワード" },
        { v_masu: "つかれます", v_te: "つかれて", object: "わたし" },
    ];

    // Game 1: 動作進行 (Action) - 30問生成
    const actionScenarios = [
        { verb_index: 0, scenario: "いま、なにをしていますか？（しょくじ）", prefix: "", particles: ["を"], verb: "たべて" },
        { verb_index: 1, scenario: "いま、なにをしていますか？（きゅうけい）", prefix: "", particles: ["を"], verb: "のんで" },
        { verb_index: 2, scenario: "いま、なにをしていますか？（どくしょ）", prefix: "", particles: ["を"], verb: "よんで" },
        { verb_index: 3, scenario: "いま、なにをしていますか？（しごと）", prefix: "", particles: ["を"], verb: "かいて" },
        { verb_index: 4, scenario: "いま、なにをしていますか？（がっこう）", prefix: "", particles: ["を"], verb: "べんきょうして" },
        { verb_index: 5, scenario: "いま、なにをしていますか？（バスてい）", prefix: "", particles: ["を"], verb: "まって" },
        { verb_index: 6, scenario: "いま、だれといますか？", prefix: "", particles: ["と"], verb: "はなして" },
        { verb_index: 7, scenario: "いま、あかちゃんはどうですか？", prefix: "", particles: ["が"], verb: "ねて" },
        { verb_index: 8, scenario: "いま、なにをしていますか？（リビング）", prefix: "", particles: ["を"], verb: "みて" },
        { verb_index: 9, scenario: "いま、なにをしていますか？（イヤホン）", prefix: "", particles: ["を"], verb: "きいて" },
        
        // バリエーション
        { verb_index: 0, scenario: "いま、あさごはんのじかんです。", prefix: "あさごはん", custom_object: "", particles: ["を"], verb: "たべて" },
        { verb_index: 1, scenario: "いま、コーヒータイムです。", prefix: "コーヒー", custom_object: "", particles: ["を"], verb: "のんで" },
        { verb_index: 2, scenario: "いま、マンガをみています。", prefix: "マンガ", custom_object: "", particles: ["を"], verb: "よんで" },
        { verb_index: 3, scenario: "いま、メールをうっています。", prefix: "メール", custom_object: "", particles: ["を"], verb: "かいて" },
    ];

    // Game 2: 状態 (State) - 30問生成
    const stateScenarios = [
        { verb_index: 0, scenario: "どこにすんでいますか？", prefix: "", particles: ["に"], verb: "すんで" },
        { verb_index: 1, scenario: "たなかさんは、どうですか？", prefix: "", particles: ["は"], verb: "けっこんして" },
        { verb_index: 2, scenario: "じぶんのくるまがありますか？", prefix: "", particles: ["を"], verb: "もって" },
        { verb_index: 3, scenario: "あのひとをしっていますか？", prefix: "", particles: ["を"], verb: "しって" },
        { verb_index: 4, scenario: "なにをきていますか？（うわぎ）", prefix: "", particles: ["を"], verb: "きて" },
        { verb_index: 5, scenario: "なにをはいていますか？（した）", prefix: "", particles: ["を"], verb: "はいて" },
        { verb_index: 6, scenario: "なにをかぶっていますか？（あたま）", prefix: "", particles: ["を"], verb: "かぶって" },
        { verb_index: 7, scenario: "めがねをしていますか？", prefix: "", particles: ["を"], verb: "かけて" },
        { verb_index: 8, scenario: "パスワードをわすれましたか？いいえ。", prefix: "", particles: ["を"], verb: "おぼえて" },
        { verb_index: 9, scenario: "げんきがありません。どうしましたか？", prefix: "", particles: ["は"], verb: "つかれて" },
        
        { verb_index: 0, scenario: "日本にすんでいますか？", prefix: "にほん", custom_object: "", particles: ["に"], verb: "すんで" },
        { verb_index: 2, scenario: "パソコンをもっていますか？", prefix: "パソコン", custom_object: "", particles: ["を"], verb: "もって" },
        { verb_index: 4, scenario: "スーツをきています。", prefix: "スーツ", custom_object: "", particles: ["を"], verb: "きて" },
    ];

    let currentQuizData = []; 
    let score = 0;
    let currentQIndex = 0;
    let isChecking = false;
    let currentMode = '';
    const GAME_BASE_ID = "teimasu"; // ★ ユニークなゲームIDを定義

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

    window.handleHeaderBack = function() {
        if (mainGameArea.style.display !== 'none') {
            mainGameArea.style.display = 'none';
            modeSelection.style.display = 'block';
            synth.cancel();
        } else {
            window.location.href = 'verb_teimasu_practice.html';
        }
    };

    window.startGame = function(mode) {
        // --- モード設定 ---
        currentMode = mode;
        modeSelection.style.display = 'none';
        mainGameArea.style.display = 'block';
        
        let scenarios = mode === 'action' ? actionScenarios : stateScenarios;
        let verbs = mode === 'action' ? baseActionVerbs : baseStateVerbs;
        
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
        gameModeDisplay.innerText = mode === 'action' ? "いま していますモード" : "ずっと していますモード";
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
        
        const fixedBlock = createBlock("います", true);
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
            const GAME_ID = `${GAME_BASE_ID}_${currentMode}`; // teimasu_action or teimasu_state
            
            // window.addPuzzlePoints は module script で定義されています
            const pointAdded = await window.addPuzzlePoints(currentQIndex + 1, GAME_ID); 
            
            if (pointAdded) {
                score++;
                updateScore();
                resultMessage.innerHTML = `⭕️ **せいかい！ (+1pt)** <span style="font-size:0.9em;">（${constructedSentence}います）</span>`;
            } else {
                resultMessage.innerHTML = `⭕️ **せいかい！** (今日はこの問題のポイント獲得済み) <span style="font-size:0.9em;">（${constructedSentence}います）</span>`;
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
                <a class="back-to-practice" style="background: var(--correct); box-shadow: 0 4px 0 #3a7d40; display: inline-block;" href="verb_teimasu_puzzle_master.html">
                    <i class="fa-solid fa-sync"></i> もういちど
                </a>
            </div>`;
        speak(`ゲーム終了です。${currentQuizData.length}問中${score}点でした。`);
    }