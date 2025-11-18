document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM要素と定数の定義
    // ----------------------------------------------------
    const DATA_PATH = 'data/sentence_data.json';

    const dropZone = document.getElementById('puzzle-drop-zone');
    const cardContainer = document.getElementById('card-container');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const feedbackMessage = document.getElementById('feedback-message');
    const questionText = document.getElementById('question-text');
    const scoreDisplay = document.getElementById('score-display');
    const englishTranslation = document.getElementById('english-translation');

    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 
    
    let allTemplates = [];         
    let wordPool = {};             
    let currentCorrectParts = [];  // 現在の問題の正しい単語の配列
    let score = 0;
    let totalQuestions = 0;
    let currentQuestionIndex = 0;

    // ----------------------------------------------------
    // 初期化とデータ読み込み
    // ----------------------------------------------------

    async function initializeGame() {
        try {
            const response = await fetch(DATA_PATH);
            const data = await response.json();
            
            allTemplates = shuffleArray(data.templates); 
            wordPool = data.word_pool;
            totalQuestions = allTemplates.length;

            if (totalQuestions === 0) {
                questionText.textContent = "エラー: 問題テンプレートがありません。";
                return;
            }

            checkButton.addEventListener('click', checkAnswer);
            resetButton.addEventListener('click', resetPuzzle);
            
            startNewQuestion();
        } catch (error) {
            console.error("データの読み込みまたはゲーム初期化に失敗しました:", error);
            questionText.textContent = "エラー: ゲームを開始できませんでした。ファイルパスを確認してください。";
        }
    }

    /**
     * 新しい問題を出題する (ランダム生成ロジックを含む)
     */
    function startNewQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            endGame();
            return;
        }

        const template = allTemplates[currentQuestionIndex];
        const { japaneseParts, englishText } = generateRandomSentence(template);
        currentCorrectParts = japaneseParts; // 正解の順序を保存

        // 1. UIをリセット
        dropZone.innerHTML = '';
        cardContainer.innerHTML = '';
        feedbackMessage.classList.add('hidden');
        feedbackMessage.className = 'quiz-feedback-message hidden'; // ★ .hidden も確実に追加
        checkButton.disabled = false;
        resetButton.disabled = false;
        
        // 2. 問題情報を表示
        questionText.textContent = `ヒント: ${template.hint}`;
        englishTranslation.textContent = englishText; 
        updateScoreDisplay();

        // 3. カードを生成し、シャッフルして配置
        const shuffledParts = shuffleArray([...japaneseParts]);
        
        shuffledParts.forEach((part, index) => {
            const card = document.createElement('div');
            card.textContent = part; 
            card.classList.add('puzzle-card'); // ★ ここは修正済み
            
            card.dataset.id = `${part}-${index}-${currentQuestionIndex}`; 
            cardContainer.appendChild(card);
        });
        
        // 4. クリックイベントを設定
        setupCardEvents();
    }

    /**
     * 文型テンプレートと単語プールからランダムな文と英文を生成する
     * (この関数の中身は変更ありません)
     */
    function generateRandomSentence(template) {
        const japaneseParts = [];
        let englishText = template.english; 
        const replacements = [];

        template.pattern.forEach(partKey => {
            if (partKey.startsWith('P_') || partKey.startsWith('N_') || partKey.startsWith('A_') || partKey.startsWith('V_')) {
                const pool = wordPool[partKey];
                
                if (pool && pool.length > 0) {
                    const randomItem = pool[Math.floor(Math.random() * pool.length)];
                    japaneseParts.push(randomItem.japanese);
                    replacements.push({ 
                        placeholder: `(${partKey})`, 
                        replacement: randomItem.english 
                    });
                } else {
                    japaneseParts.push("[エラー]"); 
                }
            } else {
                japaneseParts.push(partKey);
            }
        });
        
        replacements.forEach(item => {
            englishText = englishText.replace(item.placeholder, item.replacement);
        });
        
        englishText = englishText.replace(/\(N_[^\)]+\)|\(A_[^\)]+\)|\(V_[^\)]+\)|\(P_[^\)]+\)/g, '');
        
        if (!englishText.match(/[.!?]$/)) {
            englishText += '.';
        }

        return { japaneseParts, englishText: englishText.trim() };
    }


    // ----------------------------------------------------
    // ★★★ イベント設定とクリック処理 (修正) ★★★
    // ----------------------------------------------------
    
    function setupCardEvents() {
        // ★ 修正 ★： .word-card ではなく .puzzle-card を探す
        document.querySelectorAll('.puzzle-card').forEach(card => {
            card.addEventListener('click', handleCardClick); 
        });
    }

    function handleCardClick(e) {
        // ★ 修正 ★： .word-card ではなく .puzzle-card を探す
        const clickedCard = e.target.closest('.puzzle-card');
        if (!clickedCard) return;

        // 答え合わせ後（正解スロット）は動かないようにする
        if (clickedCard.classList.contains('correct-slot')) {
            return;
        }

        // 答え（dropZone）にあるカードをクリックした場合
        if (clickedCard.parentNode === dropZone) {
            // カード置き場（cardContainer）に戻す
            cardContainer.appendChild(clickedCard);
            // 判定（wrong-slot）をリセット
            clickedCard.classList.remove('wrong-slot');
        } 
        // カード置き場（cardContainer）にあるカードをクリックした場合
        else {
            // 答え（dropZone）に移動する
            dropZone.appendChild(clickedCard);
        }
        
        // メッセージを隠す
        feedbackMessage.classList.add('hidden');
    }


    // ----------------------------------------------------
    // 正誤判定とゲーム制御 (修正)
    // ----------------------------------------------------

    function checkAnswer() {
        checkButton.disabled = true;
        resetButton.disabled = true;
        
        // ★ 修正 ★： .word-card ではなく .puzzle-card を探す
        const droppedCards = [...dropZone.querySelectorAll('.puzzle-card')];
        
        if (droppedCards.length !== currentCorrectParts.length) {
            displayFeedback(false, `❌ カードの数が違います。（${currentCorrectParts.length}枚必要です）`);
            checkButton.disabled = false;
            resetButton.disabled = false;
            return;
        }

        let isCorrect = true;
        
        droppedCards.forEach((card, index) => {
            const correctWord = currentCorrectParts[index];
            
            if (card.textContent === correctWord) {
                card.classList.add('correct-slot');
                card.classList.remove('wrong-slot');
            } else {
                card.classList.add('wrong-slot');
                card.classList.remove('correct-slot');
                isCorrect = false;
            }
        });

        if (isCorrect) {
            playSound(SOUND_CORRECT_PATH); 
            score++;
            currentQuestionIndex++;
            displayFeedback(true, `🎉 素晴らしい！正解です。`);
            
            setTimeout(startNewQuestion, 2000);
            
        } else {
            playSound(SOUND_INCORRECT_PATH); 
            displayFeedback(false, `🤔 残念、並び順が違います。カードをクリックして戻すか、リセットして再挑戦！`);
            checkButton.disabled = false;
            resetButton.disabled = false;
        }
    }

    function resetPuzzle() {
        // ★ 修正 ★： .word-card ではなく .puzzle-card を探す
        const cardsToMove = [...dropZone.querySelectorAll('.puzzle-card')];
        
        cardsToMove.forEach(card => {
            cardContainer.appendChild(card);
            card.classList.remove('correct-slot', 'wrong-slot');
        });
        
        dropZone.innerHTML = '';
        displayFeedback(false, `パズルをリセットしました。`);
        feedbackMessage.classList.remove('feedback-correct', 'feedback-incorrect');
        checkButton.disabled = false;
        resetButton.disabled = false;
    }

    function displayFeedback(isCorrect, message) {
        feedbackMessage.textContent = message;
        feedbackMessage.classList.remove('hidden'); 
        feedbackMessage.classList.remove('feedback-correct', 'feedback-incorrect');
        
        if (isCorrect) {
            feedbackMessage.classList.add('feedback-correct');
        } else {
            feedbackMessage.classList.add('feedback-incorrect');
        }
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `正解数: ${score} / ${totalQuestions} 問`;
    }

    function endGame() {
        playSound(SOUND_CORRECT_PATH); 
        questionText.textContent = `🎉 ゲームクリア！`;
        englishTranslation.textContent = `おめでとうございます！`;
        dropZone.innerHTML = '';
        cardContainer.innerHTML = '';
        checkButton.disabled = true;
        resetButton.disabled = true;
        displayFeedback(true, `全問終了！最終スコアは ${score} 点です。`);
    }

    // ----------------------------------------------------
    // ユーティリティ
    // ----------------------------------------------------
    
    function playSound(path) {
        const audio = new Audio(path);
        audio.play().catch(e => console.error("音声再生エラー:", e));
    }

    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // ゲーム開始
    initializeGame();
});