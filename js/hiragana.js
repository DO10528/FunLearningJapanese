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

    // ★★★ 音声ファイルのパス設定 (ご自身のファイル名に合わせて修正してください) ★★★
    const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/incorrect.mp3'; 
    // ★★★★★★★★★★★★★★★★★★★★★

    let allWords = [];
    let currentWord = null;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let askedWordIds = new Set(); 

    // ★★★ 補助関数: 音源を再生する関数 ★★★
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }
    // ★★★★★★★★★★★★★★★★★★★★★

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
        
        // ★修正: 不正解時は currentWord がそのまま残っているので、ここで新しい問題を選ぶのは「正解時」または「新規開始時」のみ
        if (!currentWord || askedWordIds.has(currentWord.id)) {
            let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
            const correctIndex = Math.floor(Math.random() * availableWords.length);
            currentWord = availableWords[correctIndex];
        }


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
            // ★修正: 選択肢を有効化
            card.style.pointerEvents = 'auto'; 
            card.style.opacity = '1';
            card.classList.remove('incorrect-choice');
        });
    }

    // 6. ユーザーの回答を処理する
    function handleAnswer(event) {
        const cardElement = event.target.closest('.choice-card');
        if (!cardElement) return;
        
        // 回答直後に全ての選択肢を無効化（二重クリック防止）
        document.querySelectorAll('.choice-card').forEach(btn => btn.style.pointerEvents = 'none');


        const selectedWord = cardElement.dataset.word;
        const feedbackElement = FEEDBACK;
        
        if (selectedWord === currentWord.word) {
            // ★★★ 正解時の音源再生と自動次へ移行 ★★★
            playSound(SOUND_CORRECT_PATH);
            
            feedbackElement.textContent = 'せいかい！✨';
            feedbackElement.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; 
            askedWordIds.add(currentWord.id); // 正解時のみ追加

            updateTurnMessage();
            
            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            // ★★★ 不正解時の音源再生と再挑戦 ★★★
            playSound(SOUND_INCORRECT_PATH);
            
            feedbackElement.textContent = `ざんねん...。もう一度、よーく考えて選んでね。`;
            feedbackElement.style.color = '#ff6f61';
            
            cardElement.classList.add('incorrect-choice'); // スタイルで不正解を強調
            cardElement.style.pointerEvents = 'none'; // 間違った選択肢を無効化
            
            // 間違ったので、他の選択肢を再度有効化して再挑戦を促す
            document.querySelectorAll('.choice-card').forEach(btn => {
                if (btn !== cardElement) {
                    btn.style.pointerEvents = 'auto';
                }
            });
            // ★不正解時はスコアやカウントを更新しない（正解するまでやり直しのため）★
        }
        // ★不正解時は renderGameControls(true) を削除し、再挑戦を促す★
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
        GAME_CONTROLS.innerHTML = '';
        
        let menuButtonHtml = `
            <button id="backToMenuControl" class="menu-card-button menu-card-reset" style="width: 200px; height: 50px; margin: 0 auto;">
                メニューに戻る
            </button>
        `;

        // 常にメニューボタンは表示 
        GAME_CONTROLS.innerHTML = menuButtonHtml;
        
        // イベントリスナーの設定
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