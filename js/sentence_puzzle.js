document.addEventListener('DOMContentLoaded', () => {
            
            // ----------------------------------------------------
            // ★★★ Firebase連携ポイント設定 ★★★
            // ----------------------------------------------------
            // モジュールで定義した関数のフォールバック
            if (!(window.Antigravity && window.Antigravity.addPoint)) {
                
            }
            const POINTS_PER_QUESTION = 1;

            // ----------------------------------------------------
            // DOM要素と定数の定義
            // ----------------------------------------------------
            const DATA_PATH = 'data/sentence_data.json';

            const dropZone = document.getElementById('sp-drop-zone');
            const cardContainer = document.getElementById('sp-card-container');
            const checkButton = document.getElementById('sp-check-button');
            const resetButton = document.getElementById('sp-reset-button');
            const feedbackMessage = document.getElementById('sp-feedback-message');
            const questionText = document.getElementById('sp-question-text');
            const scoreDisplay = document.getElementById('sp-score-display');
            const englishTranslation = document.getElementById('sp-english-translation');

            const SOUND_CORRECT_PATH = 'assets/sounds/correct.mp3'; 
            const SOUND_INCORRECT_PATH = 'assets/sounds/wrong.mp3'; 
            
            let allTemplates = [];         
            let wordPool = {};             
            let currentCorrectParts = [];
            let currentTemplate = null; 
            let score = 0;
            let totalQuestions = 0;
            let currentQuestionIndex = 0;

            // ----------------------------------------------------
            // 初期化とデータ読み込み
            // ----------------------------------------------------

            async function initializeGame() {
                try {
                    // 防弾仕様: 必須要素が存在するか確認
                    if (!dropZone || !cardContainer || !checkButton || !resetButton || !questionText || !scoreDisplay) {
                        console.warn('Antigravity Protocol: Game elements are missing. Halting execution.');
                        return;
                    }

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
                    if (questionText) questionText.textContent = "エラー: ゲームを開始できませんでした。ファイルパスを確認してください。";
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

                currentTemplate = allTemplates[currentQuestionIndex]; 
                const { japaneseParts, englishText } = generateRandomSentence(currentTemplate);
                currentCorrectParts = japaneseParts; 

                // 1. UIをリセット
                dropZone.textContent = '';
                cardContainer.textContent = '';
                feedbackMessage.classList.add('hidden');
                feedbackMessage.className = 'sp-quiz-feedback-message hidden'; 
                checkButton.disabled = false;
                resetButton.disabled = false;
                
                // 2. 問題情報を表示
                questionText.textContent = `ヒント: ${currentTemplate.hint}`;
                englishTranslation.textContent = englishText; 
                updateScoreDisplay();

                // 3. カードを生成し、シャッフルして配置
                const shuffledParts = shuffleArray([...japaneseParts]);
                
                shuffledParts.forEach((part, index) => {
                    const card = document.createElement('div');
                    card.textContent = part; 
                    card.classList.add('puzzle-card'); 
                    
                    card.dataset.id = `${part}-${index}-${currentQuestionIndex}`; 
                    cardContainer.appendChild(card);
                });
                
                // 4. クリックイベントを設定
                setupCardEvents();
            }

            /**
             * 文型テンプレートと単語プールからランダムな文と英文を生成する
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
            // イベント設定とクリック処理
            // ----------------------------------------------------
            
            function setupCardEvents() {
                document.querySelectorAll('.puzzle-card').forEach(card => {
                    card.addEventListener('click', handleCardClick); 
                });
            }

            function handleCardClick(e) {
                const clickedCard = e.target.closest('.puzzle-card');
                if (!clickedCard) return;

                if (clickedCard.classList.contains('correct-slot')) {
                    return;
                }

                if (clickedCard.parentNode === dropZone) {
                    cardContainer.appendChild(clickedCard);
                    clickedCard.classList.remove('wrong-slot');
                } 
                else {
                    dropZone.appendChild(clickedCard);
                }
                
                feedbackMessage.classList.add('hidden');
            }

            // ----------------------------------------------------
            // 正誤判定とゲーム制御 (asyncに変更)
            // ----------------------------------------------------

            async function checkAnswer() {
                checkButton.disabled = true;
                resetButton.disabled = true;
                
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
                    
                    // 文字列の空白を除去して厳密に比較する（見えないスペースによるバグ解消）
                    const cleanCardText = card.textContent.trim().replace(/\s+/g, '');
                    const cleanCorrectWord = correctWord.trim().replace(/\s+/g, '');
                    
                    if (cleanCardText === cleanCorrectWord) {
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
                    
                    // ★★★ Firebaseポイント加算 ★★★
                    if (window.Antigravity && window.Antigravity.addPoint) {
                        try {
                            const pointKey = currentTemplate.id || currentQuestionIndex.toString();
                            await window.Antigravity.addPoint('sentence_puzzle', pointKey);
                        } catch(e) {
                            console.error('Antigravity point error:', e);
                        }
                    }
                    
                    let msg = `🎉 Excellent! 素晴らしい！ (+1 ポイント！)`;
                    // ★★★★★★★★★★★★★★★★★★★★★★★

                    score++;
                    currentQuestionIndex++;
                    displayFeedback(true, msg);
                    feedbackMessage.style.display = "block"; // 確実に表示
                    
                    setTimeout(() => {
                        startNewQuestion();
                    }, 2000);
                    return; // 処理をここで完全に遮断
                }
                
                // --- 不正解時の処理 ---
                playSound(SOUND_INCORRECT_PATH); 
                // 不正解時は「残念」メッセージを非表示にする
                displayFeedback(false, "");
                feedbackMessage.style.display = "none";
                
                checkButton.disabled = false;
                resetButton.disabled = false;
            }

            function resetPuzzle() {
                const cardsToMove = [...dropZone.querySelectorAll('.puzzle-card')];
                
                cardsToMove.forEach(card => {
                    cardContainer.appendChild(card);
                    card.classList.remove('correct-slot', 'wrong-slot');
                });
                
                dropZone.textContent = '';
                displayFeedback(false, `パズルをリセットしました。`);
                feedbackMessage.className = 'sp-quiz-feedback-message hidden';
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
                if (questionText) questionText.textContent = `🎉 ゲームクリア！`;
                if (englishTranslation) englishTranslation.textContent = `おめでとうございます！`;
                
                if (dropZone) {
                    dropZone.innerHTML = `
                        <div style="text-align:center; width:100%; padding: 20px;">
                            <h2 style="color: #4CAF50; font-size: 1.8em; margin-bottom: 10px;">最終スコア: ${score} / ${totalQuestions} 点</h2>
                            <p style="margin-bottom: 25px; color: #555;">よくがんばりました！</p>
                            <div style="display:flex; justify-content:center; gap:20px; flex-wrap: wrap;">
                                <button class="sp-action-button sp-tertiary" onclick="exitGameToHome()">ホームへ戻る</button>
                                <button class="sp-action-button sp-primary" onclick="exitGameToCategory()">一覧へ戻る</button>
                            </div>
                        </div>
                    `;
                }
                
                if (cardContainer) cardContainer.textContent = '';
                if (checkButton) checkButton.style.display = 'none';
                if (resetButton) resetButton.style.display = 'none';
                if (feedbackMessage) feedbackMessage.style.display = 'none';
            }

            // ----------------------------------------------------
            // ユーティリティ
            // ----------------------------------------------------
            
            let currentAudio = null;
            function playSound(path) {
                // 前の音をリセットして重なりを防ぐ
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = new Audio(path);
                currentAudio.play().catch(e => console.error("音声再生エラー:", e));
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