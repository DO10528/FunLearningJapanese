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
    const englishTranslation = document.getElementById('english-translation'); // ★新規追加★

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
            setupDropZoneEvents();
            
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
        
        // ★★★ 1. 問題の動的生成と英語訳の生成 ★★★
        const { japaneseParts, englishText } = generateRandomSentence(template);
        currentCorrectParts = japaneseParts; // 正解の順序を保存
        // ★★★★★★★★★★★★★★★★

        // 1. UIをリセット
        dropZone.innerHTML = '';
        cardContainer.innerHTML = '';
        feedbackMessage.classList.add('hidden');
        feedbackMessage.className = 'quiz-feedback-message';
        checkButton.disabled = false;
        resetButton.disabled = false;
        
        // 2. 問題情報を表示
        questionText.textContent = `ヒント: ${template.hint}`;
        englishTranslation.textContent = englishText; // ★英文を表示★
        updateScoreDisplay();

        // 3. カードを生成し、シャッフルして配置
        const shuffledParts = shuffleArray([...japaneseParts]);
        
        shuffledParts.forEach((part, index) => {
            const card = document.createElement('div');
            card.textContent = part; 
            card.classList.add('word-card');
            card.draggable = true;
            card.dataset.id = `${part}-${index}-${currentQuestionIndex}`; 
            
            cardContainer.appendChild(card);
        });
        
        // 4. ドラッグイベントを設定
        setupCardEvents();
    }

    /**
     * 文型テンプレートと単語プールからランダムな文と英文を生成する
     */
    function generateRandomSentence(template) {
        const japaneseParts = [];
        let englishText = template.english; 
        
        template.pattern.forEach(partKey => {
            if (partKey.startsWith('P_PERSON') || partKey.startsWith('N_') || partKey.startsWith('A_') || partKey.startsWith('V_')) {
                const pool = wordPool[partKey];
                
                if (pool && pool.length > 0) {
                    const randomItem = pool[Math.floor(Math.random() * pool.length)];
                    
                    // 1. 日本語の単語を取得
                    japaneseParts.push(randomItem.japanese);

                    // 2. 英文のプレースホルダーを置換
                    // (PARTKEY) という文字列をそのまま置換します (正規表現を使わず安全に置換)
                    const placeholderString = `(${partKey})`;
                    
                    // 文字列置換を使用
                    englishText = englishText.replace(placeholderString, randomItem.english);

                } else {
                    japaneseParts.push("[エラー]"); 
                }
            } else {
                // 助詞や助動詞などの固定語彙 (は、が、を、へ、です)
                japaneseParts.push(partKey);
            }
        });
        
        // 念のため、残ってしまったプレースホルダーを削除
        englishText = englishText.replace(/\(N_[^\)]+\)|\(A_[^\)]+\)|\(V_[^\)]+\)|\(P_[^\)]+\)/g, '');
        // 句読点を追加（文末にピリオドがない場合）
        if (!englishText.match(/[.!?]$/)) {
            englishText += '.';
        }

        return { japaneseParts, englishText: englishText.trim() };
    }


    // ----------------------------------------------------
    // イベント設定とドラッグ＆ドロップ処理 (変更なし)
    // ----------------------------------------------------
    
    // ... (setupCardEvents, setupDropZoneEvents, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, getDragAfterElement, handleCardClick は前回のコードと同じ)

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

    function handleDragLeave(e) {}

    function handleDrop(e) {
        e.preventDefault();
        
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.querySelector(`[data-id="${cardId}"]`);
        
        if (!card) return;

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
    // 正誤判定とゲーム制御 (変更なし)
    // ----------------------------------------------------

    /**
     * 答え合わせを行う
     */
    function checkAnswer() {
        checkButton.disabled = true;
        resetButton.disabled = true;
        
        const droppedCards = [...dropZone.querySelectorAll('.word-card')];
        
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
            card.draggable = false;
        });

        if (isCorrect) {
            // ★★★ 全て正解 ★★★
            playSound(SOUND_CORRECT_PATH); 
            score++;
            currentQuestionIndex++;
            displayFeedback(true, `🎉 素晴らしい！正解です。`);
            
            setTimeout(startNewQuestion, 2000);
            
        } else {
            // ★★★ 不正解 ★★★
            playSound(SOUND_INCORRECT_PATH); 
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
        feedbackMessage.classList.remove('hidden'); 
        
        feedbackMessage.classList.remove('feedback-correct', 'feedback-incorrect');
        
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
        playSound(SOUND_CORRECT_PATH); 
        questionText.textContent = `🎉 ゲームクリア！`;
        englishTranslation.textContent = `おめでとうございます！` // 英文エリアをクリア
        dropZone.innerHTML = '';
        cardContainer.innerHTML = '';
        checkButton.disabled = true;
        resetButton.disabled = true;
        displayFeedback(true, `全問終了！最終スコアは ${score} 点です。`);
    }

    // ----------------------------------------------------
    // ユーティリティ
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