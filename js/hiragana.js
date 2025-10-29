(function() {
    // ゲーム状態
    let gameData = {
        words: [],
        currentWord: null,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        usedWords: new Set()
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
                word.difficulty === 'basic' && 
                word.image && 
                word.reading
            );
            console.log(`[Hiragana] Loaded ${gameData.words.length} basic words`);
            return true;
        } catch (error) {
            console.error('[Hiragana] Error loading words:', error);
            return false;
        }
    }

    // ゲーム画面の描画
    function renderGame() {
        if (!gameContent) return;
        
        const word = gameData.currentWord;
        if (!word) return;

        // 選択肢の生成（正解+ランダムな不正解）
        const choices = generateChoices(word);

        gameContent.innerHTML = `
            <div class="game-question">
                <h2>どれが「${word.word}」かな？</h2>
                <img src="assets/images/${word.image}" alt="" class="game-image">
                <p class="game-hint">ヒント: ${word.reading}</p>
            </div>
            <div class="game-choices">
                ${choices.map(choice => `
                    <button class="choice-button" data-value="${choice}">
                        ${choice}
                    </button>
                `).join('')}
            </div>
            <div class="game-stats">
                <p>せいかい: ${gameData.correctCount} / まちがい: ${gameData.incorrectCount}</p>
            </div>
        `;

        // イベントリスナーの設定
        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    // 選択肢の生成
    function generateChoices(correctWord) {
        const choices = [correctWord.reading];
        const availableWords = gameData.words.filter(w => 
            w.id !== correctWord.id && 
            w.reading !== correctWord.reading
        );

        while (choices.length < 4 && availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            const word = availableWords.splice(randomIndex, 1)[0];
            choices.push(word.reading);
        }

        return shuffleArray(choices);
    }

    // 回答ハンドリング
    function handleAnswer(event) {
        const selectedAnswer = event.target.dataset.value;
        const correctAnswer = gameData.currentWord.reading;
        const isCorrect = selectedAnswer === correctAnswer;

        // ボタンを無効化
        document.querySelectorAll('.choice-button').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.value === correctAnswer) {
                btn.style.backgroundColor = '#4CAF50';
            } else if (btn.dataset.value === selectedAnswer && !isCorrect) {
                btn.style.backgroundColor = '#f44336';
            }
        });

        // スコア更新
        if (isCorrect) {
            gameData.score += 10;
            gameData.correctCount++;
            showFeedback('せいかい！', 'success');
        } else {
            gameData.incorrectCount++;
            showFeedback(`ざんねん... こたえは「${correctAnswer}」だよ`, 'error');
        }

        // スコア表示を更新
        updateScore(gameData.score);

        // 次の問題
        setTimeout(() => {
            if (gameData.usedWords.size >= gameData.words.length) {
                showGameOver();
            } else {
                selectNewWord();
                renderGame();
            }
        }, 2000);
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
                <button class="choice-button" onclick="window.initHiragana()">
                    もういちどあそぶ
                </button>
            </div>
        `;
    }

    // 新しい単語の選択
    function selectNewWord() {
        const availableWords = gameData.words.filter(word => 
            !gameData.usedWords.has(word.id)
        );
        if (availableWords.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWord = availableWords[randomIndex];
        gameData.currentWord = selectedWord;
        gameData.usedWords.add(selectedWord.id);
        return selectedWord;
    }

    // 配列のシャッフル
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 公開API: 初期化
    window.initHiragana = async function() {
        console.log('[Hiragana] Initializing game...');
        gameContent = document.getElementById('game-content');
        
        // ゲームデータのリセット
        gameData = {
            words: [],
            currentWord: null,
            score: 0,
            correctCount: 0,
            incorrectCount: 0,
            usedWords: new Set()
        };

        // ローディング表示
        gameContent.innerHTML = `
            <div class="loading-spinner"></div>
            <p>よみこみちゅう...</p>
        `;

        // データのロード
        if (await loadGameData()) {
            selectNewWord();
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
    window.disposeHiragana = function() {
        gameData = {
            words: [],
            currentWord: null,
            score: 0,
            correctCount: 0,
            incorrectCount: 0,
            usedWords: new Set()
        };
        if (gameContent) {
            gameContent.innerHTML = '';
        }
    };
})();