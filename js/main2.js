(function(){
    // モジュールスコープの状態
    let MAIN_MENU = null;
    let GAME_AREA = null;
    let SCORE_MESSAGE = null;

    let allWords = [];
    let currentWord = null;
    let score = 0;          // 正解数
    let incorrectCount = 0; // 失敗数
    let correctCount = 0;   // 正解回数（カウント用）
    let FEEDBACK = null;    // feedback 要素を保持（renderQuestion で設定）
    let askedWordIds = new Set();
    let selectedBlocks = []; // 現在選択中のブロックのDOM要素を格納
    // 追跡用: 動的に追加したリスナやタイマーを保持して dispose 時に解除する
    let attachedListeners = [];
    let activeTimeouts = [];

    // ハンドラ参照（dispose のために保持）
    let startButtonHandler = null;

    // 1. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            const data = await response.json();
            // 読み（reading）の最後が「ん」または「ン」で終わる単語のみを除外
            allWords = data.filter(w => {
                const reading = w.reading || '';
                return !reading.endsWith('ん') && !reading.endsWith('ン');
            });
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            allWords = [];
            return [];
        }
    }

    // 2. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MAIN_MENU) MAIN_MENU.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p id="current-score">前回のスコア: ${score}点 (正解: ${correctCount}問, 失敗: ${incorrectCount}回)</p>`;
        }

        // メニューのボタンにイベントリスナーを再設定
        const startButton2 = document.getElementById('startButton2');
        if (startButton2) {
            // 重複登録を避けるため既存ハンドラを除去してから登録
            if (startButtonHandler) startButton2.removeEventListener('click', startButtonHandler);
            startButtonHandler = startNewGame;
            startButton2.addEventListener('click', startButtonHandler);
        }
    }

    // 3. ゲーム開始と新しい問題の生成
    function startNewGame() {
        if (allWords.length === 0) {
            alert('ゲームを開始するには最低限の単語データが必要です。');
            loadWords().then(() => {
                if (allWords.length > 0) startNewGame();
                else renderMenu();
            });
            return;
        }

        if (MAIN_MENU) MAIN_MENU.style.display = 'none';
        if (GAME_AREA) GAME_AREA.style.display = 'block';

        // 状態をリセット
        score = 0;
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear();
        selectedBlocks = [];

        showNextQuestion();
    }

    // 4. 問題をランダムに選び、ブロックを生成する
    function showNextQuestion() {
        if (!allWords || allWords.length === 0) {
            alert('単語データがありません。');
            renderMenu();
            return;
        }

        // 全ての単語が出題されたかチェック
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 失敗: ${incorrectCount}回`);
            renderMenu();
            return;
        }

        // 未出題の単語だけを抽出して選択
        let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
        if (availableWords.length === 0) {
            // 安全策: askedWordIds をリセットして再チャレンジ
            askedWordIds.clear();
            availableWords = allWords.slice();
        }

        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        if (currentWord && currentWord.id !== undefined) askedWordIds.add(currentWord.id);

        // 読み仮名を一文字ずつに分解し、シャッフル
        let readingChars = Array.from(currentWord.reading || '');
        let shuffledChars = shuffleArray([...readingChars]);

        renderQuestion(currentWord, shuffledChars);
    }

    // 5. 画面に問題とブロックを表示する
    function renderQuestion(word, shuffledChars) {
        if (!GAME_AREA) return;

        const imagePath = `assets/images/${word.image}`;
        const scoreDisplay = `${correctCount}/${incorrectCount}`;

        let blocksHtml = shuffledChars.map((char, index) =>
            `<div class="char-block" data-char="${char}" data-original-index="${index}" tabindex="0">${char}</div>`
        ).join('');

        GAME_AREA.innerHTML = `
            <h3>このイラストの言葉を並び替えてください (${scoreDisplay})</h3>
            <div style="min-height: 170px;">
                <img src="${imagePath}"
                     alt="${word.word}"
                     onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';"
                     style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin-bottom: 20px;">
            </div>

            <div id="word-container" style="display: flex; justify-content: center; margin-bottom: 20px;">
                ${blocksHtml}
            </div>

            <div id="check-area" style="margin-top: 30px;">
                <button id="checkButton" class="menu-card-button choice-button" style="width: 150px; height: 50px; margin: 0 auto; display: block;" type="button">答え合わせ</button>
            </div>

            <p id="feedback" style="font-weight: bold; margin-top: 15px; min-height: 25px;">クリックで文字を入れ替え！</p>

            <button id="backToMenu2" class="menu-card-button menu-card-reset" style="margin-top: 20px;" type="button">メニューに戻る</button>
        `;

        // イベントリスナーを設定
        document.querySelectorAll('.char-block').forEach(block => {
            const clickHandler = (ev) => handleBlockClick(ev);
            const keydownHandler = (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    handleBlockClick({ target: block });
                }
            };

            block.addEventListener('click', clickHandler);
            block.addEventListener('keydown', keydownHandler);

            attachedListeners.push({ el: block, type: 'click', fn: clickHandler });
            attachedListeners.push({ el: block, type: 'keydown', fn: keydownHandler });
        });

        FEEDBACK = document.getElementById('feedback');

        const checkBtn = document.getElementById('checkButton');
        if (checkBtn) {
            checkBtn.addEventListener('click', checkAnswer);
            attachedListeners.push({ el: checkBtn, type: 'click', fn: checkAnswer });
        }

        const backBtn = document.getElementById('backToMenu2');
        if (backBtn) {
            backBtn.addEventListener('click', renderMenu);
            attachedListeners.push({ el: backBtn, type: 'click', fn: renderMenu });
        }
    }

    // 6. ブロックをクリックしたときの処理（並び替えロジック）
    function handleBlockClick(event) {
        const clickedBlock = event.target;
        if (!clickedBlock) return;

        if (selectedBlocks.includes(clickedBlock)) {
            selectedBlocks = selectedBlocks.filter(block => block !== clickedBlock);
            clickedBlock.classList.remove('selected');
        } else {
            selectedBlocks.push(clickedBlock);
            clickedBlock.classList.add('selected');
        }

        if (selectedBlocks.length === 2) {
            const block1 = selectedBlocks[0];
            const block2 = selectedBlocks[1];

            const container = document.getElementById('word-container');
            const nodes = Array.from(container.children);
            const index1 = nodes.indexOf(block1);
            const index2 = nodes.indexOf(block2);

            if (index1 !== -1 && index2 !== -1) {
                container.innerHTML = '';
                [nodes[index1], nodes[index2]] = [nodes[index2], nodes[index1]];
                nodes.forEach(node => container.appendChild(node));
            }

            block1.classList.remove('selected');
            block2.classList.remove('selected');
            selectedBlocks = [];
        }

        if (FEEDBACK) {
            FEEDBACK.textContent = 'クリックで文字を入れ替え！';
            FEEDBACK.style.color = '#333';
        }
    }

    // 7. 答え合わせの処理
    function checkAnswer() {
        const blocks = Array.from(document.querySelectorAll('.char-block'));
        const attemptedReading = blocks.map(block => block.dataset.char).join('');

        if (attemptedReading === (currentWord && currentWord.reading)) {
            if (FEEDBACK) {
                FEEDBACK.textContent = 'せいかい！✨';
                FEEDBACK.style.color = '#5c7aff';
            }
            score += 10;
            correctCount += 1;

            const t = setTimeout(() => {
                showNextQuestion();
            }, 900);
            activeTimeouts.push(t);

        } else {
            if (FEEDBACK) {
                FEEDBACK.textContent = 'ざんねん... もう一度やり直してください。';
                FEEDBACK.style.color = '#ff6f61';
            }
            incorrectCount += 1;

            document.querySelectorAll('.char-block').forEach(block => {
                block.classList.remove('selected');
            });
            selectedBlocks = [];

            renderScoreTitleUpdate();
        }
    }

    function renderScoreTitleUpdate() {
        if (!GAME_AREA) return;
        const titleElement = GAME_AREA.querySelector('h3');
        if (titleElement) {
            const scoreDisplay = `${correctCount}/${incorrectCount}`;
            titleElement.textContent = `このイラストの言葉を並び替えてください (${scoreDisplay})`;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 公開 API: init / dispose
    window.initHiragana2 = function() {
        MAIN_MENU = document.getElementById('main-menu');
        GAME_AREA = document.getElementById('game-area');
        SCORE_MESSAGE = document.getElementById('score-message');

        // 初期化前に古い状態が残っている場合は dispose
        if (window.__hiragana2_inited) {
            if (typeof window.disposeHiragana2 === 'function') window.disposeHiragana2();
        }

        window.__hiragana2_inited = true;

        // 読み込みとメニュー初期化
        loadWords().then(() => {
            renderMenu();
        });
    };

    window.disposeHiragana2 = function() {
        // start ボタンのハンドラを削除
        const startButton2 = document.getElementById('startButton2');
        if (startButton2 && startButtonHandler) startButton2.removeEventListener('click', startButtonHandler);
        startButtonHandler = null;
        // 動的に追加したイベントリスナを全て解除
        attachedListeners.forEach(item => {
            try {
                if (item.el && item.type && item.fn) item.el.removeEventListener(item.type, item.fn);
            } catch (e) {
                console.warn('Failed to remove listener', e);
            }
        });
        attachedListeners = [];

        // 保留中のタイマーを全てクリア
        activeTimeouts.forEach(tid => clearTimeout(tid));
        activeTimeouts = [];

        // ゲーム領域をクリア
        if (GAME_AREA) GAME_AREA.innerHTML = '';

        // メニューを再表示
        if (MAIN_MENU) MAIN_MENU.style.display = 'block';

        // 内部状態をリセット
        allWords = [];
        currentWord = null;
        score = 0;
        incorrectCount = 0;
        correctCount = 0;
        askedWordIds.clear();
        selectedBlocks = [];

        window.__hiragana2_inited = false;
    };

    // 自動 init はしない。index.html から明示的に initHiragana2 を呼ぶ。
})();