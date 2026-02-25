// --- データ定義 ---
    const baseVerbs = [
        { v_masu: "たべます", v_te: "たべて", object: "これ" },
        { v_masu: "のみます", v_te: "のんで", object: "ジュース" },
        { v_masu: "とります", v_te: "とって", object: "しゃしん" },
        { v_masu: "つかいます", v_te: "つかって", object: "ペン" },
        { v_masu: "はいります", v_te: "はいって", object: "へや" },
        { v_masu: "すわります", v_te: "すわって", object: "ここ" },
        { v_masu: "あけます", v_te: "あけて", object: "まど" },
        { v_masu: "みます", v_te: "みて", object: "テレビ" },
        { v_masu: "かえります", v_te: "かえって", object: "もう" },
        { v_masu: "おきます", v_te: "おいて", object: "にもつ" },
    ];
    
    // Game 1: 質問 (Ask) - 30問生成
    const askScenarios = [
        { verb_index: 0, scenario: "おなかがすきました。きょかを もとめます。", prefix: "", particles: ["を"], verb: "たべても" },
        { verb_index: 1, scenario: "のどがかわきました。", prefix: "", particles: ["を"], verb: "のんでも" },
        { verb_index: 2, scenario: "しゃしんをとりたいです。", prefix: "", particles: ["を"], verb: "とっても" },
        { verb_index: 3, scenario: "ペンをかりたいです。", prefix: "この", particles: ["を"], verb: "つかっても" },
        { verb_index: 4, scenario: "ノックしました。「はいってください」", prefix: "へや", particles: ["に"], verb: "はいっても" },
        { verb_index: 5, scenario: "いすがあいています。", prefix: "", particles: ["に"], verb: "すわっても" },
        { verb_index: 6, scenario: "あついです。", prefix: "", particles: ["を"], verb: "あけても" },
        { verb_index: 7, scenario: "テレビをみたいです。", prefix: "", particles: ["を"], verb: "みても" },
        { verb_index: 8, scenario: "ようじがおわりました。", prefix: "", particles: [], verb: "かえっても" },
        { verb_index: 9, scenario: "にもつがおもいです。", prefix: "ここに", custom_object: "にもつ", particles: ["を"], verb: "おいても" },
        
        { verb_index: 0, scenario: "おかしをたべたいです。", prefix: "おかし", custom_object: "", particles: ["を"], verb: "たべても" },
        { verb_index: 1, scenario: "みずをのみたいです。", prefix: "みず", custom_object: "", particles: ["を"], verb: "のんでも" },
        { verb_index: 3, scenario: "パソコンをつかいたいです。", prefix: "パソコン", custom_object: "", particles: ["を"], verb: "つかっても" },
    ];

    // Game 2: 返事 (Reply) - 30問生成
    const replyScenarios = [
        { scenario: "Q. しゃしんをとってもいいですか？ (OK)", blocks: ["はい", "、", "いいですよ"], correct: "はい、いいですよ" },
        { scenario: "Q. ここでたばこをすってもいいですか？ (NO)", blocks: ["すみません", "、", "ちょっと", "…"], correct: "すみません、ちょっと…" },
        { scenario: "Q. このペンをつかってもいいですか？ (OK)", blocks: ["はい", "、", "どうぞ"], correct: "はい、どうぞ" },
        { scenario: "Q. まどをあけてもいいですか？ (OK)", blocks: ["ええ", "、", "いいですよ"], correct: "ええ、いいですよ" },
        { scenario: "Q. ここにすわってもいいですか？ (OK)", blocks: ["はい", "、", "どうぞ"], correct: "はい、どうぞ" },
        { scenario: "Q. このパソコンをつかってもいいですか？ (NO)", blocks: ["すみません", "、", "いま", "つかっています"], correct: "すみません、いまつかっています" },
        { scenario: "Q. トイレにいってもいいですか？ (OK)", blocks: ["はい", "、", "いいですよ"], correct: "はい、いいですよ" },
        { scenario: "Q. ここにはいってもいいですか？ (NO)", blocks: ["すみません", "、", "だめです"], correct: "すみません、だめです" },
        { scenario: "Q. これをたべてもいいですか？ (OK)", blocks: ["はい", "、", "どうぞ"], correct: "はい、どうぞ" },
        { scenario: "Q. かえってもいいですか？ (OK)", blocks: ["はい", "、", "いいですよ"], correct: "はい、いいですよ" },
        
        // バリエーション
        { scenario: "Q. テレビをみてもいいですか？ (OK)", blocks: ["はい", "、", "いいですよ"], correct: "はい、いいですよ" },
        { scenario: "Q. エアコンをけしてもいいですか？ (NO)", blocks: ["すみません", "、", "ちょっと", "…"], correct: "すみません、ちょっと…" },
    ];

    let currentQuizData = []; 
    let score = 0;
    let currentQIndex = 0;
    let isChecking = false;
    let currentMode = 'ask';
    const GAME_BASE_ID = "temoii"; // ★ ユニークなゲームIDを定義

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
        if (currentQ) speak(currentQ.scenario);
    }

    window.handleHeaderBack = function() {
        if (mainGameArea.style.display !== 'none') {
            mainGameArea.style.display = 'none';
            modeSelection.style.display = 'block';
            synth.cancel();
        } else {
            window.location.href = 'verb_temoii_practice.html';
        }
    };

    window.startGame = function(mode) {
        currentMode = mode;
        modeSelection.style.display = 'none';
        mainGameArea.style.display = 'block';
        
        currentQuizData = [];
        
        if (mode === 'ask') {
            // Ask Mode: Standard Verb Building
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
                    fixed_suffix: "いいですか"
                });
            }
        } else {
            // Reply Mode: Phrase Building
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
        gameModeDisplay.innerText = mode === 'ask' ? "しつもんモード" : "へんじモード";
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
            const GAME_ID = `${GAME_BASE_ID}_${currentMode}`; // temoii_ask or temoii_reply
            
            // window.addPuzzlePoints は module script で定義されています
            const pointAdded = await window.addPuzzlePoints(currentQIndex + 1, GAME_ID); 
            
            if (pointAdded) {
                score++;
                updateScore();
                resultMessage.textContent = `⭕️ **せいかい！ (+1pt)** <span style="font-size:0.9em;">（${constructedSentence}${currentQ.fixed_suffix}）</span>`;
            } else {
                resultMessage.textContent = `⭕️ **せいかい！** (今日はこの問題のポイント獲得済み) <span style="font-size:0.9em;">（${constructedSentence}${currentQ.fixed_suffix}）</span>`;
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
                <a class="back-to-practice" style="background: var(--correct); box-shadow: 0 4px 0 #3a7d40; display: inline-block;" href="verb_temoii_puzzle_master.html">
                    <i class="fa-solid fa-sync"></i> もういちど
                </a>
            </div>`;
        speak(`ゲーム終了です。${currentQuizData.length}問中${score}点でした。`);
    }