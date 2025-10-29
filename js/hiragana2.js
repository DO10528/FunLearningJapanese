(function() {
    // ゲーム状態
    let gameData = {
        words: [],
        currentWord: null,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        usedWords: new Set(),
        currentHint: '',
        revealedHints: 0
    };

    // DOM要素の参照
    let gameContent = null;

    // 単語データの読み込み
    async function loadGameData() {
        try {
            const response = await fetch('data/words.json');
            if (!response.ok) throw new Error('Failed to load words');
            const data = await response.json();
            gameData.words = data.filter(word => 
                word.difficulty === 'advanced' && 
                word.image && 
                word.reading &&
                word.reading.length > 2  // より長い単語を選択
            );
            console.log(`[Hiragana2] Loaded ${gameData.words.length} advanced words`);
            return true;
        } catch (error) {
            console.error('[Hiragana2] Error loading words:', error);
            return false;
        }
    }

    // ゲーム画面の描画
    function renderGame() {
        if (!gameContent || !gameData.currentWord) return;

        const word = gameData.currentWord;
        const displayReading = gameData.currentHint || '？'.repeat(word.reading.length);

        gameContent.innerHTML = `
            <div class="game-question">
                <h2>この絵のよみかたは？</h2>
                <img src="assets/images/${word.image}" alt="" class="game-image">
                <div class="reading-display">
                    ${Array.from(displayReading).map(char => `
                        <div class="char-block">${char}</div>
                    `).join('')}
                </div>
                <div class="hint-area">
                    <button class="hint-button" ${gameData.revealedHints >= word.reading.length ? 'disabled' : ''}>
                        ヒントをみる
                    </button>
                    <p class="hint-text">のこり ヒント: ${word.reading.length - gameData.revealedHints}</p>
                </div>
            </div>
            <div class="input-area">
                <input type="text" class="answer-input" placeholder="ここに こたえを にゅうりょく"
                       maxlength="${word.reading.length}">
                <button class="submit-button">こたえあわせ</button>
            </div>
            <div class="game-stats">
                <p>せいかい: ${gameData.correctCount} / まちがい: ${gameData.incorrectCount}</p>
            </div>
        `;

        // イベントリスナーの設定
        setupEventListeners();
    }

    // イベントリスナーの設定
    function setupEventListeners() {
        const input = gameContent.querySelector('.answer-input');
        const submitButton = gameContent.querySelector('.submit-button');
        const hintButton = gameContent.querySelector('.hint-button');

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAnswer();
            }
        });

        submitButton.addEventListener('click', handleAnswer);
        hintButton.addEventListener('click', showHint);

        // 入力フィールドにフォーカス
        input.focus();
    }

    // ヒントの表示
    function showHint() {
        const word = gameData.currentWord;
        if (!word || gameData.revealedHints >= word.reading.length) return;

        let currentDisplay = gameData.currentHint || '？'.repeat(word.reading.length);
        let displayArray = Array.from(currentDisplay);
        
        // まだ明かされていない文字をランダムに1つ選んで表示
        let hiddenIndices = displayArray.reduce((acc, char, idx) => {
            if (char === '？') acc.push(idx);
            return acc;
        }, []);

        if (hiddenIndices.length > 0) {
            const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
            displayArray[randomIndex] = word.reading[randomIndex];
            gameData.currentHint = displayArray.join('');
            gameData.revealedHints++;
            gameData.score = Math.max(0, gameData.score - 2); // ヒントを使うとポイント減少
            updateScore(gameData.score);
            renderGame();
        }
    }

    // 回答ハンドリング
    function handleAnswer() {
        const input = gameContent.querySelector('.answer-input');
        const answer = input.value.trim();
        const correctAnswer = gameData.currentWord.reading;

        if (!answer) return;

        const isCorrect = answer === correctAnswer;
        
        if (isCorrect) {
            gameData.score += Math.max(5, 10 - gameData.revealedHints * 2);
            gameData.correctCount++;
            showFeedback('せいかい！', 'success');
        } else {
            gameData.incorrectCount++;
            showFeedback(`ざんねん... こたえは「${correctAnswer}」だよ`, 'error');
        }

        updateScore(gameData.score);

        // 次の問題
        setTimeout(() => {
            if (gameData.usedWords.size >= gameData.words.length) {
                showGameOver();
            } else {
                resetCurrentWord();
                renderGame();
            }
        }, 2000);
    }

    // 新しい単語の選択とリセット
    function resetCurrentWord() {
        const availableWords = gameData.words.filter(word => 
            !gameData.usedWords.has(word.id)
        );
        if (availableWords.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWord = availableWords[randomIndex];
        gameData.currentWord = selectedWord;
        gameData.usedWords.add(selectedWord.id);
        gameData.currentHint = '';
        gameData.revealedHints = 0;
        return selectedWord;
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
        gameContent.innerHTML = `
            <div class="game-over">
                <h2>おしまい！</h2>
                <p>せいかい: ${gameData.correctCount}もん</p>
                <p>まちがい: ${gameData.incorrectCount}もん</p>
                <p>とくてん: ${gameData.score}てん</p>
                <button class="choice-button" onclick="returnToMenu()">
                    メニューにもどる
                </button>
                <button class="choice-button" onclick="window.initHiragana2()">
                    もういちどあそぶ
                </button>
            </div>
        `;
    }

    // 公開API: 初期化
    window.initHiragana2 = async function() {
        console.log('[Hiragana2] Initializing game...');
        gameContent = document.getElementById('game-content');
        
        // ゲームデータのリセット
        gameData = {
            words: [],
            currentWord: null,
            score: 0,
            correctCount: 0,
            incorrectCount: 0,
            usedWords: new Set(),
            currentHint: '',
            revealedHints: 0
        };

        // ローディング表示
        gameContent.innerHTML = `
            <div class="loading-spinner"></div>
            <p>よみこみちゅう...</p>
        `;

        // データのロード
        if (await loadGameData()) {
            resetCurrentWord();
            renderGame();
        } else {
            gameContent.innerHTML = `
                <div class="error-message">
                    <p>データのよみこみに しっぱいしました</p>
                    <button onclick="returnToMenu()" class="back-button">
                        メニューにもどる
                    </button>
                </div>
            `;
        }
    };

    // 公開API: クリーンアップ
    window.disposeHiragana2 = function() {
        gameData = {
            words: [],
            currentWord: null,
            score: 0,
            correctCount: 0,
            incorrectCount: 0,
            usedWords: new Set(),
            currentHint: '',
            revealedHints: 0
        };
        if (gameContent) {
            gameContent.innerHTML = '';
        }
    };
})();