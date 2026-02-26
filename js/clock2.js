// AI音声の準備
        const synth = window.speechSynthesis;
        function speakText(text) {
            if (synth.speaking) synth.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'ja-JP';
            utter.rate = 0.9; 
            synth.speak(utter);
        }

        document.addEventListener('DOMContentLoaded', () => {

            if (typeof window.addPointsToUser !== 'function') {
                window.addPointsToUser = async () => { return false; };
            }
            const POINTS_PER_QUESTION = 1;

            // --- データ定義 (accepts追加) ---
            const hourData = [
                { hour: 1, text: 'いちじ', accepts: ['いちじ', '1時', '一時'] },
                { hour: 2, text: 'にじ', accepts: ['にじ', '2時', '二時'] },
                { hour: 3, text: 'さんじ', accepts: ['さんじ', '3時', '三時'] },
                { hour: 4, text: 'よじ', accepts: ['よじ', '4時', '四時', 'よんじ'] }, 
                { hour: 5, text: 'ごじ', accepts: ['ごじ', '5時', '五時'] },
                { hour: 6, text: 'ろくじ', accepts: ['ろくじ', '6時', '六時'] },
                { hour: 7, text: 'しちじ', accepts: ['しちじ', '7時', '七時', 'ななじ'] }, 
                { hour: 8, text: 'はちじ', accepts: ['はちじ', '8時', '八時'] },
                { hour: 9, text: 'くじ', accepts: ['くじ', '9時', '九時', 'きゅうじ'] }, 
                { hour: 10, text: 'じゅうじ', accepts: ['じゅうじ', '10時', '十時'] },
                { hour: 11, text: 'じゅういちじ', accepts: ['じゅういちじ', '11時', '十一時'] },
                { hour: 12, text: 'じゅうにじ', accepts: ['じゅうにじ', '12時', '十二時'] }
            ];
            const minuteData = [
                { min: 5, text: 'ごふん', type: 'fun', accepts: ['ごふん', '5分', '五分'] },
                { min: 10, text: 'じゅっぷん', type: 'pun', accepts: ['じゅっぷん', 'じっぷん', '10分', '十分'] },
                { min: 15, text: 'じゅうごふん', type: 'fun', accepts: ['じゅうごふん', '15分', '十五分'] },
                { min: 20, text: 'にじゅっぷん', type: 'pun', accepts: ['にじゅっぷん', 'にじっぷん', '20分', '二十分'] },
                { min: 25, text: 'にじゅうごふん', type: 'fun', accepts: ['にじゅうごふん', '25分', '二十五分'] },
                { min: 30, text: 'さんじゅっぷん', type: 'pun', accepts: ['さんじゅっぷん', 'さんじっぷん', '30分', '三十分'] },
                { min: 35, text: 'さんじゅうごふん', type: 'fun', accepts: ['さんじゅうごふん', '35分', '三十五分'] },
                { min: 40, text: 'よんじゅっぷん', type: 'pun', accepts: ['よんじゅっぷん', 'よんじっぷん', '40分', '四十分'] },
                { min: 45, text: 'よんじゅうごふん', type: 'fun', accepts: ['よんじゅうごふん', '45分', '四十五分'] },
                { min: 50, text: 'ごじゅっぷん', type: 'pun', accepts: ['ごじゅっぷん', 'ごじっぷん', '50分', '五十分'] },
                { min: 55, text: 'ごじゅうごふん', type: 'fun', accepts: ['ごじゅうごふん', '55分', '五十五分'] }
            ];
            const hanData = { 
                min: 30, text: 'はん', type: 'han', 
                accepts: ['はん', '半', 'さんじゅっぷん', 'さんじっぷん', '30分', '三十分'] 
            };

            const soundCorrect = document.getElementById('tc-sound-correct');
            const soundIncorrect = document.getElementById('tc-sound-incorrect');

            // --- DOM ---
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

            let currentCorrectText = ""; 
            let currentHourValue = 0; 
            let currentMinuteValue = 0;
            let currentMode = 1;
            
            // --- 音声認識APIの準備 ---
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            let recognition = null;
            let isListening = false;
            let quiz3Step = 1; 
            let quiz3CorrectHour = null;
            let quiz3CorrectMinute = null;

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

            // アナログ時計の描画共通処理
            function drawAnalogClock(hour, minute) {
                quizPromptArea.innerHTML = `
                    <div class="tc-clock-face">
                        <div id="tc-hour-hand" class="tc-hand tc-hour-hand"></div>
                        <div id="tc-minute-hand" class="tc-hand tc-minute-hand"></div>
                        <div class="tc-center-dot"></div>
                    </div>`;
                const hourHand = document.getElementById('tc-hour-hand');
                const minuteHand = document.getElementById('tc-minute-hand');
                const h = hour % 12; 
                const hourDeg = (h * 30) + (minute * 0.5);
                const minuteDeg = minute * 6;
                hourHand.style.transform = `translateY(-50%) rotate(${hourDeg - 90}deg)`;
                minuteHand.style.transform = `translateY(-50%) rotate(${minuteDeg - 90}deg)`;
            }

            // --- 勉強スクリーン ---
            function setupStudyScreen() {
                studyGrid.textContent = '';
                minuteData.forEach(min => {
                    const item = document.createElement('div');
                    item.className = `tc-study-item type-${min.type}`;
                    item.innerHTML = `<span>${min.min}</span><p>${min.text}</p>`;
                    item.onclick = () => speakText(min.text);
                    studyGrid.appendChild(item);
                });
                const hanItem = document.createElement('div');
                hanItem.className = 'tc-study-item type-han';
                hanItem.innerHTML = `<span>30</span><p>「${hanData.text}」 (さんじゅっぷん と おなじ)</p>`;
                hanItem.onclick = () => speakText(hanData.text);
                studyGrid.appendChild(hanItem);
            }

            btnToModes.onclick = () => showScreen(modesScreen);

            // --- クイズ起動 ---
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

            // --- ゲーム1 (音声 → デジタル時計) ---
            function setupQuiz1() {
                quizTitle.textContent = 'ゲーム1：きいて えらぼう！';
                
                const correctHour = hourData[Math.floor(Math.random() * hourData.length)];
                let correctMinute, correctMinuteText;
                
                if (Math.random() < (1 / 12)) { 
                    correctMinute = minuteData.find(m => m.min === 30);
                    correctMinuteText = (Math.random() < 0.5) ? hanData.text : correctMinute.text;
                } else {
                    correctMinute = minuteData[Math.floor(Math.random() * minuteData.length)];
                    correctMinuteText = correctMinute.text;
                }
                currentCorrectText = `${correctHour.text} ${correctMinuteText}`;
                currentHourValue = correctHour.hour; 
                currentMinuteValue = correctMinute.min;
                
                // 再生ボタン
                const soundButton = document.createElement('button');
                soundButton.className = 'tc-button btn-game1';
                soundButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                soundButton.style.fontSize = '3em';
                soundButton.style.width = '100px';
                soundButton.style.height = '100px';
                soundButton.style.borderRadius = '50%';
                soundButton.onclick = () => speakText(currentCorrectText);
                quizPromptArea.appendChild(soundButton);
                
                setTimeout(() => speakText(currentCorrectText), 500);

                let options = [{ hour: correctHour.hour, min: correctMinute.min, digital: `${correctHour.hour}:${String(correctMinute.min).padStart(2, '0')}` }];

                while (options.length < 4) {
                    const dummyHour = hourData[Math.floor(Math.random() * hourData.length)];
                    const dummyMinute = minuteData[Math.floor(Math.random() * minuteData.length)];
                    const newOption = { hour: dummyHour.hour, min: dummyMinute.min, digital: `${dummyHour.hour}:${String(dummyMinute.min).padStart(2, '0')}` };
                    if (!options.some(opt => opt.digital === newOption.digital)) {
                        options.push(newOption);
                    }
                }
                
                shuffleArray(options).forEach(opt => {
                    const button = document.createElement('button');
                    button.className = 'tc-option-button tc-option-digital-button tc-option';
                    button.textContent = opt.digital;
                    button.dataset.hour = opt.hour; 
                    button.dataset.min = opt.min;
                    button.onclick = handleQuizChoice;
                    quizOptions.appendChild(button);
                });
            }

            // --- ゲーム2 (アナログ時計 → 文字) ---
            function setupQuiz2() {
                quizTitle.textContent = 'ゲーム2：みて えらぼう！';

                const correctHour = hourData[Math.floor(Math.random() * hourData.length)];
                let correctMinute = minuteData[Math.floor(Math.random() * minuteData.length)];
                let correctMinuteText = correctMinute.text;
                if (correctMinute.min === 30 && Math.random() < 0.5) {
                    correctMinuteText = hanData.text;
                }
                currentCorrectText = `${correctHour.text} ${correctMinuteText}`;
                currentHourValue = correctHour.hour; 
                currentMinuteValue = correctMinute.min;

                drawAnalogClock(currentHourValue, currentMinuteValue);

                let options = [{ text: currentCorrectText }];
                let optionsSet = new Set([currentCorrectText]);

                // ダミー1: 時が違う
                let dummyHour = hourData[Math.floor(Math.random() * hourData.length)];
                while(dummyHour.hour === correctHour.hour) dummyHour = hourData[Math.floor(Math.random() * hourData.length)];
                options.push({ text: `${dummyHour.text} ${correctMinuteText}` });
                optionsSet.add(`${dummyHour.text} ${correctMinuteText}`);

                // ダミー2: 分が違う
                let dummyMinute = minuteData[Math.floor(Math.random() * minuteData.length)];
                while(dummyMinute.min === correctMinute.min) dummyMinute = minuteData[Math.floor(Math.random() * minuteData.length)];
                options.push({ text: `${correctHour.text} ${dummyMinute.text}` });
                optionsSet.add(`${correctHour.text} ${dummyMinute.text}`);

                // ダミー3: 「ふん/ぷん」または「はん」のひっかけ
                let trapText = "";
                if (correctMinute.min === 30) {
                    trapText = (correctMinuteText === hanData.text) ? minuteData.find(m => m.min === 30).text : hanData.text;
                } else {
                    trapText = (correctMinute.type === 'fun') ? correctMinute.text.replace('ふん', 'ぷん') : correctMinute.text.replace('ぷん', 'ふん');
                }
                const trapOption = `${correctHour.text} ${trapText}`;
                if (!optionsSet.has(trapOption)) options.push({ text: trapOption });
                
                shuffleArray(options).slice(0, 4).forEach(opt => {
                    const button = document.createElement('button');
                    button.className = 'tc-option-button tc-option-text-button tc-option';
                    button.textContent = opt.text;
                    button.dataset.text = opt.text; 
                    button.dataset.hour = (opt.text === currentCorrectText) ? currentHourValue : 0; 
                    button.dataset.min = (opt.text === currentCorrectText) ? currentMinuteValue : 0;
                    button.onclick = handleQuizChoice;
                    quizOptions.appendChild(button);
                });
            }
            
            // --- ゲーム1 & 2 答え合わせ ---
            async function handleQuizChoice(e) { 
                const chosenOption = e.currentTarget;
                if (chosenOption.classList.contains('disabled')) return;
                
                const isQuiz2 = quizTitle.textContent.includes('ゲーム2');
                let isCorrect = false;
                
                if (isQuiz2) {
                    isCorrect = chosenOption.dataset.text === currentCorrectText;
                } else {
                    const chosenHour = parseInt(chosenOption.dataset.hour);
                    const chosenMin = parseInt(chosenOption.dataset.min);
                    isCorrect = chosenHour === currentHourValue && chosenMin === currentMinuteValue;
                }
                
                const pointKey = `${currentHourValue}_${currentMinuteValue}`;
                
                if (isCorrect) {
                    playSound(soundCorrect);
                    const success = await window.addPointsToUser(POINTS_PER_QUESTION, pointKey);
                    
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

                quiz3CorrectHour = hourData[Math.floor(Math.random() * hourData.length)];
                quiz3CorrectMinute = minuteData[Math.floor(Math.random() * minuteData.length)];
                
                // 30分の場合は特別にhanDataを使うか決定（受け入れワードには両方含めるため判定用データとしてセット）
                if(quiz3CorrectMinute.min === 30 && Math.random() < 0.5) {
                    quiz3CorrectMinute = hanData; 
                }

                currentHourValue = quiz3CorrectHour.hour;
                currentMinuteValue = quiz3CorrectMinute.min;

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
                    if (cleanSpeech.includes('何時') || cleanSpeech.includes('なんじ') || cleanSpeech.includes('いまなんじ')) {
                        playSound(soundCorrect);
                        quiz3Step = 2;
                        
                        document.getElementById('quiz3-instruction').textContent = "とけいを みて、「いま、〇〇じ 〇〇ふん(はん) です」と こたえてね！";
                        
                        // アナログ時計の描画
                        drawAnalogClock(currentHourValue, currentMinuteValue);

                    } else {
                        playSound(soundIncorrect);
                        document.getElementById('quiz3-transcript').textContent += " (もういちど！)";
                    }
                } else if (quiz3Step === 2) {
                    let maxSim = 0;
                    let targetAccepts = [];
                    
                    // 「今 〇時 〇分 です」のパターンを作成
                    quiz3CorrectHour.accepts.forEach(hAcc => {
                        // もし30分の場合はhanDataとminuteDataの両方のacceptsを許可する
                        let minuteAccepts = quiz3CorrectMinute.accepts;
                        if(currentMinuteValue === 30) {
                            minuteAccepts = [...new Set([...hanData.accepts, ...minuteData.find(m => m.min === 30).accepts])];
                        }
                        
                        minuteAccepts.forEach(mAcc => {
                            targetAccepts.push(`いま${hAcc}${mAcc}です`);
                            targetAccepts.push(`今${hAcc}${mAcc}です`);
                        });
                    });

                    targetAccepts.forEach(acc => {
                        const sim = calculateSimilarity(cleanSpeech, acc);
                        if (sim > maxSim) maxSim = sim;
                    });

                    if (maxSim >= 80) {
                        playSound(soundCorrect);
                        const pointKey = `${currentHourValue}_${currentMinuteValue}`;
                        const success = await window.addPointsToUser(POINTS_PER_QUESTION, pointKey);
                        
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