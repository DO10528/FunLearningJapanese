// --- データ定義 ---
    const baseVerbs = [
        { v_masu: "かします", v_te: "かして", object: "ペン" },
        { v_masu: "おしえます", v_te: "おしえて", object: "みち" },
        { v_masu: "てつだいます", v_te: "てつだって", object: "しごと" },
        { v_masu: "とります", v_te: "とって", object: "しお" },
        { v_masu: "かきます", v_te: "かいて", object: "ちず" },
        { v_masu: "みせます", v_te: "みせて", object: "パスポート" },
        { v_masu: "まちます", v_te: "まって", object: "すこし" },
        { v_masu: "いいます", v_te: "いって", object: "もういちど" },
        { v_masu: "はなします", v_te: "はなして", object: "ゆっくり" },
        { v_masu: "あけます", v_te: "あけて", object: "まど" },
    ];
    
    // Game 1: 依頼 (Request) - 30問生成
    const askScenarios = [
        { verb_index: 0, scenario: "ペンをわすれました。", prefix: "すみませんが", particles: ["を"], verb: "かして" },
        { verb_index: 1, scenario: "みちにまよいました。", prefix: "すみませんが", particles: ["を"], verb: "おしえて" },
        { verb_index: 2, scenario: "しごとがおわりません。", prefix: "すみませんが", particles: ["を"], verb: "てつだって" },
        { verb_index: 3, scenario: "しおがとどきません。", prefix: "すみませんが", particles: ["を"], verb: "とって" },
        { verb_index: 4, scenario: "ばしょがわかりません。", prefix: "すみませんが", particles: ["を"], verb: "かいて" },
        { verb_index: 5, scenario: "チェックインします。", prefix: "すみませんが", particles: ["を"], verb: "みせて" },
        { verb_index: 6, scenario: "じゅんびしています。", prefix: "すみませんが", custom_object: "", particles: [], verb: "まって" },
        { verb_index: 7, scenario: "きこえませんでした。", prefix: "すみませんが", custom_object: "もういちど", particles: [], verb: "いって" },
        { verb_index: 8, scenario: "はやすぎます。", prefix: "すみませんが", custom_object: "", particles: [], verb: "はなして" },
        { verb_index: 9, scenario: "あついです。", prefix: "すみませんが", particles: ["を"], verb: "あけて" },
        
        // バリエーション（custom_object）
        { verb_index: 0, scenario: "かさがありません。", prefix: "すみませんが", custom_object: "かさ", particles: ["を"], verb: "かして" },
        { verb_index: 1, scenario: "じゅうしょがわかりません。", prefix: "すみませんが", custom_object: "じゅうしょ", particles: ["を"], verb: "おしえて" },
        { verb_index: 3, scenario: "あのおさわをとってください。", prefix: "すみませんが", custom_object: "おさら", particles: ["を"], verb: "とって" },
        { verb_index: 4, scenario: "なまえをかいてください。", prefix: "すみませんが", custom_object: "なまえ", particles: ["を"], verb: "かいて" },
        { verb_index: 5, scenario: "きっぷをみせてください。", prefix: "すみませんが", custom_object: "きっぷ", particles: ["を"], verb: "みせて" },
    ];

    // Game 2: 会話 (Dialogue: Response & Thanks) - 30問生成
    const replyScenarios = [
        // OK -> Thanks
        { scenario: "Q. すみませんが、てつだってくださいませんか？ (OK)", blocks: ["はい", "、", "いいですよ"], correct: "はい、いいですよ" },
        { scenario: "A. はい、いいですよ。(Say Thanks)", blocks: ["ありがとう", "ございます"], correct: "ありがとうございます" },
        { scenario: "A. はい、どうぞ。(Say Thanks)", blocks: ["ありがとう", "ございました"], correct: "ありがとうございました" },
        
        // NO -> Sorry
        { scenario: "Q. すみませんが、ちょっとまってくださいませんか？ (NO)", blocks: ["すみません", "、", "いま", "ちょっと", "…"], correct: "すみません、いまちょっと…" },
        { scenario: "Q. すみませんが、あけてくださいませんか？ (NO)", blocks: ["すみません", "、", "いま", "だめです"], correct: "すみません、いまだめです" },
        
        // Contextual
        { scenario: "Q. すみませんが、かしてくださいませんか？ (OK)", blocks: ["はい", "、", "どうぞ"], correct: "はい、どうぞ" },
        { scenario: "Q. すみませんが、しゃしんをとってくださいませんか？ (OK)", blocks: ["いいですよ"], correct: "いいですよ" },
        { scenario: "Q. すみませんが、おしえてくださいませんか？ (OK)", blocks: ["はい", "、", "もちろん"], correct: "はい、もちろん" },
        { scenario: "A. はい、もちろん。(Say Thanks)", blocks: ["すみません", "、", "ありがとう", "ございます"], correct: "すみません、ありがとうございます" },
        { scenario: "Q. すみませんが、なまえをかいてくださいませんか？ (NO)", blocks: ["すみません", "、", "ちょっと", "…"], correct: "すみません、ちょっと…" },
    ];

    let currentQuizData = []; 
    let score = 0;
    let currentQIndex = 0;
    let isChecking = false;
    let currentMode = 'ask';
    const GAME_BASE_ID = "tekudasaimasenka"; // ★ ユニークなゲームIDを定義

    // DOM要素
    const scenarioText = document.getElementById('scenario-text');
    const constructionArea = document.getElementById('construction-area');
    const blockChoices = document.getElementById('block-choices');
    const checkBtn = document.getElementById('check-btn');
    const resultMessage = document.getElementById('result-message');
    const questionHeader = document.getElementById('question-header');
    const gameModeDisplay = document.getElementById('game-mode-display');
    const mainGameArea = document.getElementById('main-game-area');
    const modeSelection = document.getElementById('mode-selection');

    // TTS/Helper Functions (簡略化)
    const synth = window.speechSynthesis;
    let voices = [];
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    function speak(text) {
        // TTSロジック...
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
        // 質問読み上げロジック...
    }

    window.handleHeaderBack = function() {
        if (mainGameArea.style.display !== 'none') {
            mainGameArea.style.display = 'none';
            modeSelection.style.display = 'block';
            synth.cancel();
        } else {
            window.location.href = 'verb_tekudasaimasenka_practice.html';
        }
    };

    window.startGame = function(mode) {
        currentMode = mode;
        modeSelection.style.display = 'none';
        mainGameArea.style.display = 'block';
        
        currentQuizData = [];
        
        if (mode === 'ask') {
            // Ask Mode
            for (let i = 0; i < 30; i++) { 
                const scenario = askScenarios[i % askScenarios.length]; 
                const verbData = baseVerbs[scenario.verb_index];
                
                let objectBlock = verbData.object;
                if (scenario.custom_object !== undefined) objectBlock = scenario.custom_object;

                const variableBlocks = [scenario.prefix, objectBlock].concat(scenario.particles).concat(scenario.verb);
                const correctOrder = variableBlocks.filter(b => b && b !== ""); 

                currentQuizData.push({
                    id: i + 1, type: 'ask',
                    scenario: scenario.scenario,
                    v_masu: verbData.v_masu,
                    all_blocks: correctOrder.slice(), 
                    correct_order: correctOrder.slice(),
                    fixed_suffix: "てくださいませんか"
                });
            }
        } else {
            // Reply Mode
            for (let i = 0; i < 30; i++) {
                const scenario = replyScenarios[i % replyScenarios.length];
                currentQuizData.push({
                    id: i + 1, type: 'reply',
                    scenario: scenario.scenario,
                    v_masu: "こたえましょう (Reply)",
                    all_blocks: scenario.blocks.slice(),
                    correct_order: scenario.blocks.slice(),
                    fixed_suffix: "。"
                });
            }
        }
        
        shuffleArray(currentQuizData);
        gameModeDisplay.innerText = mode === 'ask' ? "いらいモード" : "かいわモード";
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
        if (currentMode === 'ask') {
            questionHeader.innerText = `V-ます形: ${currentQ.v_masu}`;
        } else {
            questionHeader.innerText = currentQ.v_masu;
        }
        
        constructionArea.textContent = '';
        constructionArea.classList.remove('shaking');
        resultMessage.textContent = '';
        checkBtn.disabled = false;
        
        const fixedBlock = createBlock(currentQ.fixed_suffix, true);
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
            const GAME_ID = `${GAME_BASE_ID}_${currentMode}`; // tekudasaimasenka_ask or tekudasaimasenka_reply
            
            // window.addPuzzlePoints は module script で定義されています
            const pointAdded = await window.addPuzzlePoints(currentQIndex + 1, GAME_ID); 
            
            if (pointAdded) {
                score++;
                updateScore();
                resultMessage.innerHTML = `⭕️ **せいかい！ (+1pt)** <span style="font-size:0.9em;">（${constructedSentence}${currentQ.fixed_suffix}）</span>`;
            } else {
                resultMessage.innerHTML = `⭕️ **せいかい！** (今日はこの問題のポイント獲得済み) <span style="font-size:0.9em;">（${constructedSentence}${currentQ.fixed_suffix}）</span>`;
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
        document.getElementById('main-game-area').innerHTML = `
            <div class="main-card">
                <h2 style="color:var(--primary-dark);">ゲーム終了！</h2>
                <p style="font-size:1.5em; font-weight:bold;">${currentQuizData.length}問中 ${score} 点です。</p>
                <p style="color:#777;">よくがんばりました！</p>
                <a class="back-to-practice" style="background: var(--correct); box-shadow: 0 4px 0 #3a7d40; display: inline-block;" href="verb_tekudasaimasenka_puzzle_master.html">
                    <i class="fa-solid fa-sync"></i> もういちど
                </a>
            </div>`;
        speak(`ゲーム終了です。${currentQuizData.length}問中${score}点でした。`);
    }