(function() {
    // ゲーム状態
    let gameData = {
        mode: 'hiragana', // 'hiragana' または 'katakana'
        currentChar: null,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        usedChars: new Set()
    };

    // 文字データ
    const characterSets = {
        hiragana: [
            { char: 'あ', reading: 'a' }, { char: 'い', reading: 'i' },
            { char: 'う', reading: 'u' }, { char: 'え', reading: 'e' },
            { char: 'お', reading: 'o' },
            { char: 'か', reading: 'ka' }, { char: 'き', reading: 'ki' },
            { char: 'く', reading: 'ku' }, { char: 'け', reading: 'ke' },
            { char: 'こ', reading: 'ko' },
            // 他の文字も同様に追加
        ],
        katakana: [
            { char: 'ア', reading: 'a' }, { char: 'イ', reading: 'i' },
            { char: 'ウ', reading: 'u' }, { char: 'エ', reading: 'e' },
            { char: 'オ', reading: 'o' },
            { char: 'カ', reading: 'ka' }, { char: 'キ', reading: 'ki' },
            { char: 'ク', reading: 'ku' }, { char: 'ケ', reading: 'ke' },
            { char: 'コ', reading: 'ko' },
            // 他の文字も同様に追加
        ]
    };

    // DOM要素の参照
    let gameContent = null;

    // ゲーム画面の描画
    function renderGame() {
        if (!gameContent || !gameData.currentChar) return;

        const modeTitle = gameData.mode === 'hiragana' ? 'ひらがな' : 'カタカナ';

        gameContent.innerHTML = `
            <div class="mode-selector">
                <button class="mode-button ${gameData.mode === 'hiragana' ? 'active' : ''}"
                        onclick="window.switchMode('hiragana')">
                    ひらがな
                </button>
                <button class="mode-button ${gameData.mode === 'katakana' ? 'active' : ''}"
                        onclick="window.switchMode('katakana')">
                    カタカナ
                </button>
            </div>

            <div class="game-area">
                <h2>${modeTitle}の よみかた</h2>
                
                <div class="character-display">
                    <div class="character">${gameData.currentChar.char}</div>
                </div>

                <div class="input-area">
                    <input type="text" class="answer-input" 
                           placeholder="ローマじで にゅうりょく (a, ka, sa...)"
                           maxlength="3">
                    <button class="submit-button">かくてい</button>
                </div>

                <div class="stats">
                    <p>せいかい: ${gameData.correctCount} / まちがい: ${gameData.incorrectCount}</p>
                </div>
            </div>
        `;

        setupEventListeners();
    }

    // イベントリスナーの設定
    function setupEventListeners() {
        const input = gameContent.querySelector('.answer-input');
        const submitButton = gameContent.querySelector('.submit-button');

        if (!input || !submitButton) return;

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAnswer();
            }
        });

        submitButton.addEventListener('click', handleAnswer);
        input.focus();
    }

    // 回答のハンドリング
    function handleAnswer() {
        const input = gameContent.querySelector('.answer-input');
        if (!input) return;

        const answer = input.value.trim().toLowerCase();
        input.value = '';

        if (!answer) return;

        const isCorrect = answer === gameData.currentChar.reading;

        if (isCorrect) {
            gameData.score += 10;
            gameData.correctCount++;
            showFeedback('せいかい！', 'success');
        } else {
            gameData.incorrectCount++;
            showFeedback(`ざんねん... こたえは「${gameData.currentChar.reading}」だよ`, 'error');
        }

        updateScore(gameData.score);

        // 次の文字
        setTimeout(() => {
            if (gameData.usedChars.size >= characterSets[gameData.mode].length) {
                showGameOver();
            } else {
                selectNewCharacter();
                renderGame();
            }
        }, 2000);
    }

    // 新しい文字の選択
    function selectNewCharacter() {
        const availableChars = characterSets[gameData.mode].filter(char =>
            !gameData.usedChars.has(char.char)
        );
        
        if (availableChars.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * availableChars.length);
        const selectedChar = availableChars[randomIndex];
        gameData.currentChar = selectedChar;
        gameData.usedChars.add(selectedChar.char);
        return selectedChar;
    }

    // フィードバック表示
    function showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `game-feedback ${type}`;
        feedback.textContent = message;
        gameContent.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 1900);
    }

    // ゲーム終了画面
    function showGameOver() {
        const modeTitle = gameData.mode === 'hiragana' ? 'ひらがな' : 'カタカナ';
        
        gameContent.innerHTML = `
            <div class="game-over">
                <h2>${modeTitle}モード クリア！</h2>
                <p>せいかい: ${gameData.correctCount}もん</p>
                <p>まちがい: ${gameData.incorrectCount}もん</p>
                <p>とくてん: ${gameData.score}てん</p>
                <button class="choice-button" onclick="window.switchMode('${gameData.mode === 'hiragana' ? 'katakana' : 'hiragana'}')">
                    ${gameData.mode === 'hiragana' ? 'カタカナ' : 'ひらがな'}モードに チャレンジ
                </button>
                <button class="choice-button" onclick="returnToMenu()">
                    メニューにもどる
                </button>
            </div>
        `;
    }

    // モード切り替え
    window.switchMode = function(mode) {
        gameData.mode = mode;
        gameData.usedChars.clear();
        gameData.correctCount = 0;
        gameData.incorrectCount = 0;
        gameData.score = 0;
        selectNewCharacter();
        renderGame();
    };

    // 公開API: 初期化
    window.initPronunciation = function() {
        console.log('[Pronunciation] Initializing game...');
        gameContent = document.getElementById('game-content');
        
        // ゲームデータのリセット
        gameData = {
            mode: 'hiragana',
            currentChar: null,
            score: 0,
            correctCount: 0,
            incorrectCount: 0,
            usedChars: new Set()
        };

        selectNewCharacter();
        renderGame();
    };

    // 公開API: クリーンアップ
    window.disposePronunciation = function() {
        gameData = {
            mode: 'hiragana',
            currentChar: null,
            score: 0,
            correctCount: 0,
            incorrectCount: 0,
            usedChars: new Set()
        };
        if (gameContent) {
            gameContent.innerHTML = '';
        }
    };
})();