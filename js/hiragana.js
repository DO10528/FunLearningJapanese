document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素の取得
    // ----------------------------------------------------
    const MENU_AREA = document.getElementById('quiz-menu-area');
    const GAME_AREA = document.getElementById('quiz-game-area');
    const SCORE_MESSAGE = document.getElementById('quiz-score-message');
    const TURN_MESSAGE = document.getElementById('quiz-turn-message');
    const IMAGE_AREA = document.getElementById('quiz-image-area');
    const QUESTION_TEXT = document.getElementById('quiz-question-text');
    const FEEDBACK = document.getElementById('quiz-feedback');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const GAME_CONTROLS = document.getElementById('quiz-game-controls');

    let allWords = [];
    let currentWord = null;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let askedWordIds = new Set(); 

    // 1. ゲーム開始関数 (HTMLの onclick="startQuizGame()" から呼ばれる)
    window.startQuizGame = function() {
        if (allWords.length === 0) {
            loadWords().then(startNewGameLogic);
        } else {
            startNewGameLogic();
        }
    };

    function startNewGameLogic() {
        if (allWords.length < 3) {
            alert('ゲームを開始するには最低3つ以上の単語データが必要です。');
            renderMenu();
            return;
        }
        
        if (MENU_AREA) MENU_AREA.style.display = 'none'; 
        if (GAME_AREA) GAME_AREA.style.display = 'block'; 

        // 状態をリセット
        score = 0; 
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear(); 
        
        if (TURN_MESSAGE) TURN_MESSAGE.textContent = 'チャレンジ中！ (正解 0/失敗 0)';
        
        showNextQuestion();
    }
    
    // 2. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 3. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MENU_AREA) MENU_AREA.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p>前回のスコア: ${score}点 (正解: ${correctCount}問, 不正解: ${incorrectCount}問)</p>`;
        }
        if (GAME_CONTROLS) GAME_CONTROLS.innerHTML = '';
    }

    // 4. 問題をランダムに選び、選択肢を生成する
    function showNextQuestion() {
        
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 不正解: ${incorrectCount}問`);
            renderMenu();
            return;
        }

        let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id);

        let wrongWords = [];
        let wrongChoices = [];
        
        while (wrongWords.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            const isDuplicate = randomWord.id === currentWord.id || wrongWords.includes(randomWord.id);

            if (!isDuplicate) {
                wrongWords.push(randomWord.id);
                wrongChoices.push(randomWord.word);
            }
        }
        
        let choices = [currentWord.word, ...wrongChoices];
        choices = shuffleArray(choices);

        renderQuestion(currentWord, choices);
        
        // ★修正: 新しい問題が表示されたら、メニューボタンのみを表示する★
        renderGameControls(false); 
    }

    // 5. 画面に問題と選択肢を表示する
    function renderQuestion(word, choices) {
        const imagePath = `assets/images/${word.image}`; 
        
        if (IMAGE_AREA) {
            IMAGE_AREA.innerHTML = `
                <img src="${imagePath}" 
                     alt="${word.word}" 
                     onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                     style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover;">
            `;
        }
        
        if (CHOICE_BUTTONS_AREA) {
            CHOICE_BUTTONS_AREA.innerHTML = choices.map(choice => 
                `<div class="menu-card-button menu-card-reset choice-card" data-word="${choice}" data-reading="${word.reading}">
                    <div style="font-size: 1.5em; font-weight: bold;">${choice}</div>
                </div>`
            ).join('');
        }

        if (QUESTION_TEXT) QUESTION_TEXT.textContent = `このイラストはどれかな？`;
        if (FEEDBACK) FEEDBACK.textContent = '答えを選んでね！';
        
        
        document.querySelectorAll('.choice-card').forEach(card => {
            card.addEventListener('click', handleAnswer);
        });
    }

    // 6. ユーザーの回答を処理する
    function handleAnswer(event) {
        const cardElement = event.target.closest('.choice-card');
        if (!cardElement) return;

        const selectedWord = cardElement.dataset.word;
        const feedbackElement = FEEDBACK;
        
        document.querySelectorAll('.choice-card').forEach(btn => btn.style.pointerEvents = 'none');

        if (selectedWord === currentWord.word) {
            feedbackElement.textContent = 'せいかい！✨';
            feedbackElement.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; 
            updateTurnMessage();
            
            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            feedbackElement.textContent = `ざんねん...。正解は「${currentWord.word}」だよ。`;
            feedbackElement.style.color = '#ff6f61';
            incorrectCount += 1; 
            updateTurnMessage();
            
            // ★修正: 不正解時は「次へ」ボタンと「メニューに戻る」ボタンの両方を表示★
            setTimeout(() => {
                renderGameControls(true); 
            }, 1500); 
        }
    }
    
    // 7. 補助関数: スコア表示を更新
    function updateTurnMessage() {
        if (TURN_MESSAGE) {
            TURN_MESSAGE.textContent = `チャレンジ中！ (正解 ${correctCount}/失敗 ${incorrectCount})`;
        }
    }
    
    // 8. 補助関数: プレイ中のメニューボタンを表示
    function renderGameControls(showNextButton) {
        if (!GAME_CONTROLS) return;
        
        GAME_CONTROLS.style.display = 'flex'; 
        GAME_CONTROLS.style.justifyContent = 'center';

        // 常にメニューボタンは表示 
        let menuButtonHtml = `
            <button id="backToMenuControl" class="menu-card-button menu-card-reset" style="width: 200px; height: 50px;">
                メニューに戻る
            </button>
        `;

        if (showNextButton) {
            // 不正解時: 「次へ」と「メニュー」を並べる
            GAME_CONTROLS.innerHTML = `
                <button id="nextQuizButton" class="menu-card-button choice-button" style="width: 200px; height: 50px; margin-right: 10px;">
                    つぎのもんだいへ
                </button>
                ${menuButtonHtml}
            `;
            GAME_CONTROLS.style.justifyContent = 'center'; // 2つのボタンを中央寄せ
        } else {
             // 正解/初期表示時: メニューボタン単独で中央寄せ
             GAME_CONTROLS.innerHTML = menuButtonHtml;
             GAME_CONTROLS.style.justifyContent = 'center'; 
             document.getElementById('backToMenuControl').style.margin = '0 auto'; // 単独ボタンを中央に
        }

        // イベントリスナーの設定
        if (showNextButton) {
            document.getElementById('nextQuizButton').addEventListener('click', () => {
                GAME_CONTROLS.innerHTML = '';
                showNextQuestion();
            });
        }
        document.getElementById('backToMenuControl').addEventListener('click', renderMenu);
    }

    // 9. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ページロード時に単語データをプリロードしておく
    loadWords();
});