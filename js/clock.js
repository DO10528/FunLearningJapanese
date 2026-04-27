// AI音声（SpeechSynthesis）の準備
const synth = window.speechSynthesis;
function speakText(text) {
    // 【フリーズ対策】読み上げ時にマイクが起動していたら強制停止する
    if (isListening && recognition) {
        try { recognition.abort(); } catch(e){}
        isListening = false;
        const btn = document.getElementById('tc-mic-btn');
        if (btn) btn.classList.remove('listening');
    }

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

    // --- データ定義 ---
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

    // --- DOM要素 ---
    const screens = document.querySelectorAll('.tc-screen');
    const studyScreen = document.getElementById('tc-screen-study');
    const modesScreen = document.getElementById('tc-screen-modes');
    const quizScreen = document.getElementById('tc-screen-quiz');
    const studyGrid = document.getElementById('tc-study-grid');
    
    const quizTitle = document.getElementById('tc-quiz-title');
    const quizPromptArea = document.getElementById('tc-quiz-prompt-area');
    const quizOptions = document.getElementById('tc-quiz-options');
    const quiz3Area = document.getElementById('tc-quiz3-area');
    const feedback = document.getElementById('tc-feedback');

    let currentCorrectAnswer = null;
    let currentMode = 1;

    // --- 音声認識APIの準備 ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    let quiz3Step = 1;
    let quiz3CorrectData = null;

    // --- Antigravity Session Tracking ---
    let agQuestionCount = 0;
    let agEarnedPoints = 0;
    const AG_MAX_QUESTIONS = 10;

    // --- 汎用関数 ---
    window.showScreen = function(screenElement) {
        // 画面を切り替える（戻る）際に、裏で動いているマイクや音声を安全に消去する
        if (recognition) { try { recognition.abort(); } catch(e){} recognition = null; }
        if (synth.speaking) synth.cancel();
        isListening = false;

        if (screenElement.id === 'tc-screen-modes' || screenElement.id === 'tc-screen-study') {
            agQuestionCount = 0;
            agEarnedPoints = 0;
        }

        screens.forEach(s => s.classList.remove('active'));
        screenElement.classList.add('active');
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
            item.onclick = () => speakText(time.text);
            studyGrid.appendChild(item);
        });
    }

    // --- クイズのメインロジック ---
    window.startSpecificQuiz = function(mode) {
        if (agQuestionCount >= AG_MAX_QUESTIONS) {
            if (window.Antigravity && window.Antigravity.showResultScreen) {
                window.Antigravity.showResultScreen(agEarnedPoints);
            }
            return;
        }
        agQuestionCount++;

        currentMode = mode;
        quizPromptArea.textContent = '';
        quizOptions.textContent = '';
        quiz3Area.style.display = 'none';
        feedback.textContent = '';
        feedback.className = '';
        
        // 次へ進むボタンが残っていたら隠す
        let globalNextBtn = document.getElementById('tc-global-next-btn');
        if (globalNextBtn) globalNextBtn.style.display = 'none';
        
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
            let success = false;
            if (window.Antigravity && window.Antigravity.addPoint) {
                success = await window.Antigravity.addPoint('clock_' + currentMode, currentCorrectAnswer);
            } else if (window.addPointsToUser) {
                success = await window.addPointsToUser(POINTS_PER_QUESTION, currentCorrectAnswer);
            }
            if (success) agEarnedPoints++;
            
            // 音を鳴らさず視覚的に正解を表示
            feedback.textContent = success ? '合格！ Excellent! (+1 pt)' : '合格！ Excellent!';
            feedback.className = 'success show';
            feedback.style.color = '#4caf50';
            feedback.style.fontWeight = 'bold';
            
            quizOptions.querySelectorAll('.tc-option').forEach(opt => opt.classList.add('disabled'));
            chosenOption.classList.add('correct');
            
            // 次へ進むボタンを表示
            let globalNextBtn = document.getElementById('tc-global-next-btn');
            if (!globalNextBtn) {
                globalNextBtn = document.createElement('button');
                globalNextBtn.id = 'tc-global-next-btn';
                globalNextBtn.style.padding = '15px 40px';
                globalNextBtn.style.fontSize = '1.3em';
                globalNextBtn.style.fontWeight = 'bold';
                globalNextBtn.style.backgroundColor = '#4caf50';
                globalNextBtn.style.color = 'white';
                globalNextBtn.style.border = 'none';
                globalNextBtn.style.borderRadius = '50px';
                globalNextBtn.style.cursor = 'pointer';
                globalNextBtn.style.boxShadow = '0 5px 0 #2e7d32';
                globalNextBtn.style.marginTop = '20px';
                
                globalNextBtn.onmousedown = () => { globalNextBtn.style.transform = 'translateY(5px)'; globalNextBtn.style.boxShadow = 'none'; };
                globalNextBtn.onmouseup = () => { globalNextBtn.style.transform = 'translateY(0)'; globalNextBtn.style.boxShadow = '0 5px 0 #2e7d32'; };
                
                quizPromptArea.parentNode.insertBefore(globalNextBtn, feedback.nextSibling);
            }
            globalNextBtn.innerHTML = 'つぎへすすむ <i class="fa-solid fa-arrow-right"></i>';
            globalNextBtn.style.display = 'inline-block';
            globalNextBtn.onclick = () => {
                globalNextBtn.style.display = 'none';
                startSpecificQuiz(currentMode);
            };
            
        } else {
            feedback.textContent = 'おしい！もういちど。';
            feedback.className = 'error show';
            feedback.style.color = '#f44336';
            feedback.style.fontWeight = 'bold';
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

        setupMicUI("「いま、なんじですか？」ときいてね！");
    }

    function setupMicUI(instructionText) {
        if (recognition) {
            try { recognition.abort(); } catch(e){}
            recognition = null;
        }
        isListening = false;

        document.getElementById('quiz3-instruction').textContent = instructionText;
        const transcriptEl = document.getElementById('quiz3-transcript');
        
        const micBtn = document.getElementById('tc-mic-btn');
        let nextBtn = document.getElementById('tc-next-btn-dynamic');

        if (!nextBtn && micBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'tc-next-btn-dynamic';
            nextBtn.style.padding = '15px 40px';
            nextBtn.style.fontSize = '1.3em';
            nextBtn.style.fontWeight = 'bold';
            nextBtn.style.backgroundColor = '#4caf50';
            nextBtn.style.color = 'white';
            nextBtn.style.border = 'none';
            nextBtn.style.borderRadius = '50px';
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.boxShadow = '0 5px 0 #2e7d32';
            nextBtn.style.marginTop = '20px';
            
            nextBtn.onmousedown = () => { nextBtn.style.transform = 'translateY(5px)'; nextBtn.style.boxShadow = 'none'; };
            nextBtn.onmouseup = () => { nextBtn.style.transform = 'translateY(0)'; nextBtn.style.boxShadow = '0 5px 0 #2e7d32'; };
            
            micBtn.parentNode.insertBefore(nextBtn, micBtn.nextSibling);
        }

        if (nextBtn) nextBtn.style.display = 'none';

        if (micBtn) {
            micBtn.style.display = 'flex'; 
            micBtn.classList.remove('listening');
            
            // iPad対応: 0.8秒間マイクをロック
            micBtn.disabled = true;
            micBtn.style.opacity = '0.5';
            micBtn.style.pointerEvents = 'none';
            
            transcriptEl.textContent = "マイクをじゅんびしています... (少しまってね)";
            transcriptEl.style.color = '#333';

            setTimeout(() => {
                micBtn.disabled = false;
                micBtn.style.opacity = '1';
                micBtn.style.pointerEvents = '';
                transcriptEl.textContent = "マイクをおして はなしてね";
            }, 800);
        }
    }

    window.toggleMic = function() {
        if (!SpeechRecognition) return alert("お使いのブラウザは音声認識に対応していません。");
        const btn = document.getElementById('tc-mic-btn');
        if (btn.classList.contains('listening') || btn.disabled) return;

        if (window.speechSynthesis) window.speechSynthesis.cancel();

        // 毎回新品のマイクを作り直す
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        const transcriptEl = document.getElementById('quiz3-transcript');

        recognition.onstart = () => {
            isListening = true;
            btn.classList.add('listening');
            transcriptEl.textContent = "きいています...";
            transcriptEl.style.color = '#333';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            transcriptEl.textContent = `あなたの声: 「${transcript}」`;
            handleSpeechResult(transcript);
        };

        recognition.onerror = (event) => {
            console.warn("音声認識エラー:", event.error);
            isListening = false;
            btn.classList.remove('listening');
            if (event.error !== 'aborted') {
                transcriptEl.textContent = "うまくききとれませんでした。もういちどおしてね。";
                transcriptEl.style.color = '#f44336';
            }
        };

        recognition.onend = () => {
            isListening = false;
            btn.classList.remove('listening');
            if (transcriptEl.textContent === "きいています...") {
                transcriptEl.textContent = "もういちど マイクをおしてね";
                transcriptEl.style.color = '#f44336';
            }
        };

        try { recognition.start(); } catch(e) { 
            transcriptEl.textContent = "エラーがおきました。もういちどおしてね。";
            transcriptEl.style.color = '#f44336';
        }
    }

    async function handleSpeechResult(transcript) {
        const cleanSpeech = transcript.replace(/[\s、。！？!?,，]/g, '');
        const transcriptEl = document.getElementById('quiz3-transcript');

        if (quiz3Step === 1) {
            if (cleanSpeech.includes('何時') || cleanSpeech.includes('なんじ') || cleanSpeech.includes('いまなんじ')) {
                transcriptEl.textContent = "合格！ Excellent!";
                transcriptEl.style.color = '#4caf50';
                transcriptEl.style.fontWeight = 'bold';
                
                showNextButton('とけいをみる', () => {
                    quiz3Step = 2;
                    const img = document.createElement('img');
                    img.src = `${IMG_PATH}${quiz3CorrectData.img}`;
                    img.style.width = '150px';
                    quizPromptArea.textContent = '';
                    quizPromptArea.appendChild(img);
                    
                    setupMicUI("とけいを みて、「いま、〇〇じ です」と こたえてね！");
                });
            } else {
                transcriptEl.textContent = "おしい！もういちど。";
                transcriptEl.style.color = '#f44336';
                transcriptEl.style.fontWeight = 'bold';
            }
        } else if (quiz3Step === 2) {
            let maxSim = 0;
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
                let success = false;
                if (window.Antigravity && window.Antigravity.addPoint) {
                    success = await window.Antigravity.addPoint('clock_' + currentMode, currentCorrectAnswer);
                } else if (window.addPointsToUser) {
                    success = await window.addPointsToUser(POINTS_PER_QUESTION, currentCorrectAnswer);
                }
                if (success) agEarnedPoints++;
                
                transcriptEl.textContent = "合格！ Excellent!";
                transcriptEl.style.color = '#4caf50';
                transcriptEl.style.fontWeight = 'bold';
                
                showNextButton('つぎへすすむ', () => {
                    startSpecificQuiz(3); 
                });
            } else {
                transcriptEl.textContent = "おしい！もういちど。";
                transcriptEl.style.color = '#f44336';
                transcriptEl.style.fontWeight = 'bold';
            }
        }
    }

    function showNextButton(text, callback) {
        const micBtn = document.getElementById('tc-mic-btn');
        let nextBtn = document.getElementById('tc-next-btn-dynamic');
        if (micBtn && nextBtn) {
            micBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
            nextBtn.innerHTML = `${text} <i class="fa-solid fa-arrow-right"></i>`;
            nextBtn.onclick = () => {
                if (recognition) {
                    try { recognition.abort(); } catch(e){}
                    recognition = null;
                }
                callback();
            };
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