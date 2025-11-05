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

    // ★★★ 音声ファイルのパス設定 ★★★
    const SOUND_CORRECT_PATH = 'assets/sounds/seikai.mp3'; 
    const SOUND_INCORRECT_PATH = 'assets/sounds/bubu.mp3'; 
    // ★★★★★★★★★★★★★★★★★★★★★
    
    let allSentences = [];         
    let currentSentence = null;    
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
            allSentences = shuffleArray(data.sentences); 
            totalQuestions = allSentences.length;

            if (totalQuestions === 0) {
                questionText.textContent = "エラー: 問題データがありません。";
                return;
            }

            // イベントリスナー設定
            checkButton.addEventListener('click', checkAnswer);
            resetButton.addEventListener('click', resetPuzzle);
            
            // ドロップゾーンのドラッグイベントを設定
            setupDropZoneEvents();

            startNewQuestion();
        } catch (error) {
            console.error("データの読み込みまたはゲーム初期化に失敗しました:", error);
            questionText.textContent = "エラー: ゲームを開始できませんでした。";
        }
    }

    /**
     * 新しい問題を出題する
     */
    function startNewQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            endGame();
            return;
        }

        currentSentence = allSentences[currentQuestionIndex];
        
        // 1. UIをリセット
        dropZone.innerHTML = '';
        cardContainer.innerHTML = '';
        feedbackMessage.classList.add('hidden');
        feedbackMessage.className = 'quiz-feedback-message'; // クラスをリセット
        checkButton.disabled = false;
        resetButton.disabled = false;
        
        // 2. 問題情報を表示
        questionText.textContent = `ヒント: ${currentSentence.hint}`;
        updateScoreDisplay();

        // 3. カードを生成し、シャッフルして配置
        const shuffledParts = shuffleArray([...currentSentence.parts]);
        
        shuffledParts.forEach((part, index) => {
            const card = document.createElement('div');
            card.textContent = part.word;
            card.classList.add('word-card');
            card.draggable = true;
            card.dataset.correctIndex = currentSentence.parts.findIndex(p => p.word === part.word);
            card.dataset.id = `${part.word}-${index}`; 
            
            cardContainer.appendChild(card);
        });
        
        // 4. ドラッグイベントを設定
        setupCardEvents();
    }

    // ----------------------------------------------------
    // イベント設定とドラッグ＆ドロップ処理
    // ----------------------------------------------------

    function setupCardEvents() {
        document.querySelectorAll('.word-card').forEach(card => {
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('click', handleCardClick); 
        });
    }
    
    function setupDropZoneEvents() {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
    }
    
    let draggedElement = null;

    function handleDragStart(e) {
        draggedElement = e.target;
        draggedElement.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }
    
    document.addEventListener('dragend', () => {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }
    });

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDragLeave(e) {
        // スタイルリセット処理があればここに
    }

    function handleDrop(e) {
        e.preventDefault();
        
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.querySelector(`[data-id="${cardId}"]`);
        
        if (!card) return;

        // ドロップ位置を調整するためのヘルパー関数を呼び出す
        const afterElement = getDragAfterElement(dropZone, e.clientX, e.clientY);
        if (afterElement == null) {
            dropZone.appendChild(card);
        } else {
            dropZone.insertBefore(card, afterElement);
        }
        
        card.classList.remove('dragging');
    }

    function getDragAfterElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.word-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2; 

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    /**
     * ドロップエリアのカードをクリックでカードコンテナに戻す
     */
    function handleCardClick(e) {
        const clickedCard = e.target.closest('.word-card');
        if (!clickedCard) return;

        if (clickedCard.parentNode === dropZone && !clickedCard.classList.contains('correct-slot')) {
             cardContainer.appendChild(clickedCard);
             clickedCard.classList.remove('correct-slot', 'wrong-slot');
             feedbackMessage.classList.add('hidden');
        }
    }


    // ----------------------------------------------------
    // 正誤判定とゲーム制御
    // ----------------------------------------------------

    /**
     * 答え合わせを行う
     */
    function checkAnswer() {
        checkButton.disabled = true;
        resetButton.disabled = true;
        
        const droppedCards = [...dropZone.querySelectorAll('.word-card')];
        
        if (droppedCards.length !== currentSentence.parts.length) {
            displayFeedback(false, `❌ カードの数が違います。（${currentSentence.parts.length}枚必要です）`);
            checkButton.disabled = false;
            resetButton.disabled = false;
            return;
        }

        let isCorrect = true;
        
        droppedCards.forEach((card, index) => {
            const correctWord = currentSentence.parts[index].word;
            
            if (card.textContent === correctWord) {
                card.classList.add('correct-slot');
                card.classList.remove('wrong-slot');
            } else {
                card.classList.add('wrong-slot');
                card.classList.remove('correct-slot');
                isCorrect = false;
            }
            card.draggable = false;
        });

        if (isCorrect) {
            // ★★★ 全て正解 ★★★
            playSound(SOUND_CORRECT_PATH); // ★追加★
            score++;
            currentQuestionIndex++;
            displayFeedback(true, `🎉 素晴らしい！正解です。`);
            
            setTimeout(startNewQuestion, 2000);
            
        } else {
            // ★★★ 不正解 ★★★
            playSound(SOUND_INCORRECT_PATH); // ★追加★
            displayFeedback(false, `🤔 残念、並び順が違います。カードをリセットして再挑戦！`);
            checkButton.disabled = false;
            resetButton.disabled = false;
        }
    }

    /**
     * パズルをリセットし、カードをカードコンテナに戻す
     */
    function resetPuzzle() {
        const cardsToMove = [...dropZone.querySelectorAll('.word-card')];
        
        cardsToMove.forEach(card => {
            cardContainer.appendChild(card);
            card.classList.remove('correct-slot', 'wrong-slot');
            card.draggable = true; 
        });
        
        dropZone.innerHTML = '';
        displayFeedback(false, `パズルをリセットしました。`);
        feedbackMessage.classList.remove('feedback-correct', 'feedback-incorrect');
        checkButton.disabled = false;
        resetButton.disabled = false;
    }

    /**
     * フィードバックメッセージを表示する
     */
    function displayFeedback(isCorrect, message) {
        feedbackMessage.textContent = message;
        feedbackMessage.classList.remove('hidden', 'feedback-correct', 'feedback-incorrect');
        
        if (isCorrect) {
            feedbackMessage.classList.add('feedback-correct');
        } else {
            feedbackMessage.classList.add('feedback-incorrect');
        }
    }

    /**
     * スコア表示を更新する
     */
    function updateScoreDisplay() {
        scoreDisplay.textContent = `正解数: ${score} / ${totalQuestions} 問`;
    }

    /**
     * ゲーム終了処理
     */
    function endGame() {
        playSound(SOUND_CORRECT_PATH); // ★追加★
        questionText.textContent = `🎉 ゲームクリア！`;
        dropZone.innerHTML = '';
        cardContainer.innerHTML = '';
        checkButton.disabled = true;
        resetButton.disabled = true;
        displayFeedback(true, `全問終了！最終スコアは ${score} 点です。`);
    }

    // ----------------------------------------------------
    // ユーティリティ (playSound 関数を追加)
    // ----------------------------------------------------
    
    /**
     * 指定されたパスの音源を再生する関数
     */
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