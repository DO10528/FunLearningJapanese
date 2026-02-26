// AI音声（SpeechSynthesis）の準備
        const synth = window.speechSynthesis;
        function speakText(text) {
            if (synth.speaking) synth.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'ja-JP';
            utter.rate = 0.9; // 少しゆっくりめに
            synth.speak(utter);
        }

        document.addEventListener('DOMContentLoaded', () => {

            if (typeof window.addPointsToUser !== 'function') {
                window.addPointsToUser = async () => { return false; };
            }
            const POINTS_PER_QUESTION = 1;

            // --- データ定義 (音声認識の揺れに対応するため accepts を追加) ---
            const IMG_PATH = 'assets/images/clocks/';
            const timeData = [
                { hour: 1, text: 'いちじ', img: 'clock_1.png', accepts: ['いちじ', '1時', '一時'] },
                { hour: 2, text: 'にじ', img: 'clock_2.png', accepts: ['にじ', '2時', '二時'] },
                { hour: 3, text: 'さんじ', img: 'clock_3.png', accepts: ['さんじ', '3時', '三時'] },
                { hour: 4, text: 'よじ', img: 'clock_4.png', dummy: 'よんじ', irregular: true, accepts: ['よじ', '4時', '四時', 'よんじ'] },
                { hour: 5, text: 'ごじ', img: 'clock_5.png', accepts: ['ごじ', '5時', '五時'] },
                { hour: 6, text: 'ろくじ', img: 'clock_6.png', accepts: ['ろくじ', '6時', '六時'] },
                { hour: 7, text: 'しちじ', img: 'clock_7.png', dummy: 'ななじ', irregular: true, accepts: ['しちじ', '7時', '七時', 'ななじ'] },
                { hour: 8, text: 'はちじ', img: 'clock_8.png', accepts: ['はちじ', '8時', '八時'] },
                { hour: 9, text: 'くじ', img: 'clock_9.png', dummy: 'きゅうじ', irregular: true, accepts: ['くじ', '9時', '九時', 'きゅうじ'] },
                { hour: 10, text: 'じゅうじ', img: 'clock_10.png', accepts: ['じゅうじ', '10時', '十時'] },
                { hour: 11, text: 'じゅういちじ', img: 'clock_11.png', accepts: ['じゅういちじ', '11時', '十一時'] },
                { hour: 12, text: 'じゅうにじ', img: 'clock_12.png', accepts: ['じゅうにじ', '12時', '十二時'] }
            ];

            const soundCorrect = document.getElementById('tc-sound-correct');
            const soundIncorrect = document.getElementById('tc-sound-incorrect');

            // --- DOM要素 ---
            const screens = document.querySelectorAll('.tc-screen');
            const studyScreen = document.getElementById('tc-screen-study');
            const modesScreen = document.getElementById('tc-screen-modes');
            const quizScreen = document.getElementById('tc-screen-quiz');
            
            const studyGrid = document.getElementById('tc-study-grid');
            const btnToModes = document.getElementById('tc-btn-to-modes');
            
            const quizTitle = document.getElementById('tc-quiz-title');
            const quizPromptArea = document.getElementById('tc-quiz-prompt-area');
            const quizOptions = document.getElementById('tc-quiz-options');
            const quiz3Area = document.getElementById('tc-quiz3-area');
            const feedback = document.getElementById('tc-feedback');

            let currentCorrectAnswer = null;
            let currentMode = 1;

            // --- 音声認識APIの準備 (ゲーム3用) ---
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            let recognition = null;
            let isListening = false;
            let quiz3Step = 1; // 1:質問する, 2:答える
            let quiz3CorrectData = null;

            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.lang = 'ja-JP';
                recognition.interimResults = false;
                recognition.continuous = false;
            }

            // --- 汎用関数 ---
            window.showScreen = function(screenElement) {
                screens.forEach(s => s.classList.remove('active'));
                screenElement.classList.add('active');
            }

            function playSound(audioElement) {
                if (audioElement) {
                    audioElement.currentTime = 0;
                    audioElement.play().catch(e => console.error("音声再生エラー:", e));
                }
            }

            function shuffleArray(array) {
                let newArray = [...array];
                for (let i = newArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
                }
                return newArray;
            }

            // --- 勉強スクリーン ---
            function setupStudyScreen() {
                studyGrid.textContent = '';
                timeData.forEach(time => {
                    const item = document.createElement('div');
                    item.className = 'tc-study-item';
                    if (time.irregular) item.classList.add('irregular');
                    
                    const img = document.createElement('img');
                    img.src = `${IMG_PATH}${time.img}`;
                    
                    const p = document.createElement('p');
                    p.textContent = time.text;
                    
                    item.appendChild(img);
                    item.appendChild(p);
                    item.onclick = () => speakText(time.text); // AI音声読み上げに変更
                    studyGrid.appendChild(item);
                });
            }

            btnToModes.onclick = () => showScreen(modesScreen);

            // --- クイズのメインロジック ---
            window.startSpecificQuiz = function(mode) {
                currentMode = mode;
                quizPromptArea.textContent = '';
                quizOptions.textContent = '';
                quiz3Area.style.display = 'none';
                feedback.textContent = '';
                feedback.className = '';
                
                showScreen(quizScreen);

                if (mode === 1) setupQuiz1();
                else if (mode === 2) setupQuiz2();
                else if (mode === 3) setupQuiz3();
            }

            // --- ゲーム1: 音声 → 時計 ---
            function setupQuiz1() {
                quizTitle.textContent = 'ゲーム1：きいて えらぼう！';
                const optionsData = shuffleArray(timeData).slice(0, 4);
                const correctData = optionsData[Math.floor(Math.random() * 4)];
                currentCorrectAnswer = correctData.hour;
                
                const soundButton = document.createElement('button');
                soundButton.className = 'tc-button btn-game1';
                soundButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                soundButton.style.fontSize = '3em';
                soundButton.style.width = '100px';
                soundButton.style.height = '100px';
                soundButton.style.borderRadius = '50%';
                soundButton.onclick = () => speakText(correctData.text);
                quizPromptArea.appendChild(soundButton);
                
                // 自動で1回読み上げる
                setTimeout(() => speakText(correctData.text), 500);

                optionsData.forEach(time => {
                    const card = document.createElement('div');
                    card.className = 'tc-option-image-card tc-option';
                    card.dataset.hour = time.hour;
                    const img = document.createElement('img');
                    img.src = `${IMG_PATH}${time.img}`;
                    card.appendChild(img);
                    card.onclick = handleQuizChoice;
                    quizOptions.appendChild(card);
                });
            }
            
            // --- ゲーム2: 時計 → 文字 ---
            function setupQuiz2() {
                quizTitle.textContent = 'ゲーム2：みて えらぼう！';
                let correctData;
                if (Math.random() < 0.7) { 
                    const irregulars = timeData.filter(t => t.irregular);
                    correctData = irregulars[Math.floor(Math.random() * irregulars.length)];
                } else {
                    correctData = timeData[Math.floor(Math.random() * timeData.length)];
                }
                currentCorrectAnswer = correctData.hour;

                const img = document.createElement('img');
                img.id = 'tc-quiz-image';
                img.src = `${IMG_PATH}${correctData.img}`;
                quizPromptArea.appendChild(img);

                let optionsText = [correctData.text];
                if (correctData.dummy) optionsText.push(correctData.dummy);
                
                const allTexts = timeData.map(t => t.text);
                if (correctData.dummy) allTexts.push(correctData.dummy); 
                
                while (optionsText.length < 4) {
                    const randomText = allTexts[Math.floor(Math.random() * allTexts.length)];
                    if (!optionsText.includes(randomText)) optionsText.push(randomText);
                }
                
                shuffleArray(optionsText).forEach(text => {
                    const button = document.createElement('button');
                    button.className = 'tc-button tc-option-text-button tc-option';
                    button.textContent = text;
                    button.dataset.hour = (text === correctData.text) ? correctData.hour : 0; 
                    button.onclick = handleQuizChoice;
                    quizOptions.appendChild(button);
                });
            }

            // --- ゲーム1 & 2 答え合わせ ---
            async function handleQuizChoice(e) {
                const chosenOption = e.currentTarget;
                if (chosenOption.classList.contains('disabled')) return;
                
                const chosenHour = parseInt(chosenOption.dataset.hour);
                
                if (chosenHour === currentCorrectAnswer) {
                    playSound(soundCorrect);
                    const success = await window.addPointsToUser(POINTS_PER_QUESTION, currentCorrectAnswer);
                    
                    feedback.textContent = success ? 'せいかい！ (+1 pt)' : 'せいかい！';
                    feedback.className = 'success show';
                    
                    quizOptions.querySelectorAll('.tc-option').forEach(opt => opt.classList.add('disabled'));
                    chosenOption.classList.add('correct');
                    
                    setTimeout(() => startSpecificQuiz(currentMode), 2000);
                } else {
                    playSound(soundIncorrect);
                    feedback.textContent = 'ちがうよ、もういちど！';
                    feedback.className = 'show';
                    chosenOption.classList.add('incorrect', 'disabled');
                }
            }

            // --- ゲーム3: スピーキング ---
            function setupQuiz3() {
                quizTitle.textContent = 'ゲーム3：はなしてみよう！';
                quiz3Area.style.display = 'block';
                quiz3Step = 1;
                quiz3CorrectData = timeData[Math.floor(Math.random() * timeData.length)];
                currentCorrectAnswer = quiz3CorrectData.hour;

                document.getElementById('quiz3-instruction').textContent = "「いま、なんじですか？」ときいてね！";
                document.getElementById('quiz3-transcript').textContent = "";
                document.getElementById('tc-mic-btn').style.display = 'flex';
            }

            window.toggleMic = function() {
                if (!recognition) return alert("お使いのブラウザは音声認識に対応していません。");
                if (isListening) { recognition.stop(); return; }

                isListening = true;
                const btn = document.getElementById('tc-mic-btn');
                btn.classList.add('listening');
                document.getElementById('quiz3-transcript').textContent = "きいています...";

                if (synth.speaking) synth.cancel();

                try { recognition.start(); } catch(e){}

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    document.getElementById('quiz3-transcript').textContent = `「${transcript}」`;
                    handleSpeechResult(transcript);
                };

                recognition.onend = () => {
                    isListening = false;
                    btn.classList.remove('listening');
                };
                recognition.onerror = () => {
                    isListening = false;
                    btn.classList.remove('listening');
                    document.getElementById('quiz3-transcript').textContent = "うまくききとれませんでした";
                };
            }

            async function handleSpeechResult(transcript) {
                const cleanSpeech = transcript.replace(/[\s、。！？!?,，]/g, '');

                if (quiz3Step === 1) {
                    // 質問フェーズ
                    if (cleanSpeech.includes('何時') || cleanSpeech.includes('なんじ') || cleanSpeech.includes('いまなんじ')) {
                        playSound(soundCorrect);
                        quiz3Step = 2;
                        
                        // ★ 指示テキストの変更
                        document.getElementById('quiz3-instruction').textContent = "とけいを みて、「いま、〇〇じ です」と こたえてね！";
                        
                        // 時計の画像を表示
                        const img = document.createElement('img');
                        img.src = `${IMG_PATH}${quiz3CorrectData.img}`;
                        img.style.width = '150px';
                        quizPromptArea.textContent = '';
                        quizPromptArea.appendChild(img);
                    } else {
                        playSound(soundIncorrect);
                        document.getElementById('quiz3-transcript').textContent += " (もういちど！)";
                    }
                } else if (quiz3Step === 2) {
                    // 回答フェーズ
                    let maxSim = 0;
                    
                    // ★ 「今〇〇時です」のパターンを作成して判定
                    let targetAccepts = [];
                    quiz3CorrectData.accepts.forEach(acc => {
                        targetAccepts.push(`いま${acc}です`);
                        targetAccepts.push(`今${acc}です`);
                    });

                    targetAccepts.forEach(acc => {
                        const sim = calculateSimilarity(cleanSpeech, acc);
                        if (sim > maxSim) maxSim = sim;
                    });

                    if (maxSim >= 80) {
                        playSound(soundCorrect);
                        const success = await window.addPointsToUser(POINTS_PER_QUESTION, currentCorrectAnswer);
                        
                        feedback.textContent = success ? 'せいかい！ (+1 pt)' : 'せいかい！';
                        feedback.className = 'success show';
                        document.getElementById('tc-mic-btn').style.display = 'none';
                        
                        setTimeout(() => startSpecificQuiz(3), 2000);
                    } else {
                        playSound(soundIncorrect);
                        feedback.textContent = 'ちがうよ、もういちど！';
                        feedback.className = 'show';
                    }
                }
            }

            function calculateSimilarity(s1, s2) {
                if (s1 === s2) return 100;
                if (!s1 || !s2) return 0;
                let costs = [];
                for (let i = 0; i <= s1.length; i++) {
                    let lastVal = i;
                    for (let j = 0; j <= s2.length; j++) {
                        if (i === 0) costs[j] = j;
                        else if (j > 0) {
                            let newVal = costs[j - 1];
                            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) newVal = Math.min(Math.min(newVal, lastVal), costs[j]) + 1;
                            costs[j - 1] = lastVal; lastVal = newVal;
                        }
                    }
                    if (i > 0) costs[s2.length] = lastVal;
                }
                return ((1 - costs[s2.length] / Math.max(s1.length, s2.length)) * 100);
            }

            // --- 初期起動 ---
            setupStudyScreen();
            showScreen(studyScreen);

        });