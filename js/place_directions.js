// --- 画像・音声パス ---
    const IMG_PATH = 'assets/images/places/'; 
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // --- 20箇所の単語データ ---
    const placesList = [
        { hira: 'がっこう', kanji: '学校', file: 'がっこう', accepts: ['がっこう', '学校', 'ガッコウ'] },
        { hira: 'くうこう', kanji: '空港', file: 'くうこう', accepts: ['くうこう', '空港', 'クウコウ'] },
        { hira: 'かわ', kanji: '川', file: 'かわ', accepts: ['かわ', '川', 'カワ'] },
        { hira: 'うみ', kanji: '海', file: 'うみ', accepts: ['うみ', '海', 'ウミ'] },
        { hira: 'えき', kanji: '駅', file: 'えき', accepts: ['えき', '駅', 'エキ'] },
        { hira: 'おんせん', kanji: '温泉', file: 'おんせん', accepts: ['おんせん', '温泉', 'オンセン'] },
        { hira: 'にほん', kanji: '日本', file: 'にほん', accepts: ['にほん', '日本', 'ニホン', 'にっぽん'] },
        { hira: 'じんじゃ', kanji: '神社', file: 'じんじゃ', accepts: ['じんじゃ', '神社', 'ジンジャ'] },
        { hira: 'ふじさん', kanji: '富士山', file: 'ふじさん', accepts: ['ふじさん', '富士山', 'フジサン'] },
        { hira: 'ぎんこう', kanji: '銀行', file: 'ぎんこう', accepts: ['ぎんこう', '銀行', 'ギンコウ'] },
        { hira: 'トイレ', kanji: 'トイレ', file: 'トイレ', accepts: ['といれ', 'トイレ', 'お手洗い'] },
        { hira: 'レストラン', kanji: 'レストラン', file: 'レストラン', accepts: ['れすとらん', 'レストラン', 'restaurant'] },
        { hira: 'コンビニ', kanji: 'コンビニ', file: 'コンビニ', accepts: ['こんびに', 'コンビニ', 'convenience'] },
        { hira: 'おてら', kanji: 'お寺', file: 'おてら', accepts: ['おてら', 'お寺', '寺', 'てら'] },
        { hira: 'びょういん', kanji: '病院', file: 'びょういん', accepts: ['びょういん', '病院', 'ビョウイン'] },
        { hira: 'やま', kanji: '山', file: 'やま', accepts: ['やま', '山', 'ヤマ'] },
        { hira: 'ホテル', kanji: 'ホテル', file: 'ホテル', accepts: ['ほてる', 'ホテル', 'hotel'] },
        { hira: 'りょかん', kanji: '旅館', file: 'りょかん', accepts: ['りょかん', '旅館', 'リョカン'] },
        { hira: 'やきにくや', kanji: '焼肉屋', file: 'やきにくや', accepts: ['やきにくや', '焼肉屋', 'やきにく'] },
        { hira: 'いざかや', kanji: '居酒屋', file: 'いざかや', accepts: ['いざかや', '居酒屋', 'イザカヤ'] }
    ];

    const directionWords = ['ここですよ', 'そこですよ', 'あそこですよ'];

    // --- ゲームの進行状態 ---
    let historyStack = ['screen-learning'];
    let currentQuestions = []; 
    let currentQIndex = 0;     
    let currentStep = 1;       // 1:単語発音, 2:質問, 3:教える, 4:お礼
    let targetDirectionPhrase = ''; 

    // --- 音声関連 API ---
    const synth = window.speechSynthesis;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.continuous = false;
    }

    // --- 初期化 ---
    window.onload = () => {
        renderVocabGrid();
        updateHeader();
    };

    function renderVocabGrid() {
        const grid = document.getElementById('vocab-grid');
        placesList.forEach(place => {
            const card = document.createElement('div');
            card.className = 'vocab-card';
            card.textContent = `
                <img src="${IMG_PATH}${place.file}.png" onerror="this.src='https://placehold.co/100x100?text=Image'" alt="${place.hira}">
                <span>${place.kanji}</span>
            `;
            // 学習用の単語読み上げ機能はそのまま残します
            card.onclick = () => speakText(place.hira);
            grid.appendChild(card);
        });
    }

    function speakText(text) {
        if (synth.speaking) synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP'; utter.rate = 0.9;
        synth.speak(utter);
    }

    // --- 画面遷移管理 ---
    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if (historyStack[historyStack.length - 1] !== id) historyStack.push(id);
        
        document.getElementById('start-btn').style.display = (id === 'screen-learning') ? 'flex' : 'none';
        updateHeader();
        window.scrollTo(0,0);
    }

    function goBack() {
        if (historyStack.length > 1) {
            historyStack.pop();
            const prev = historyStack[historyStack.length - 1];
            if (synth.speaking) synth.cancel();
            if (isListening && recognition) recognition.stop();
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(prev).classList.add('active');
            document.getElementById('start-btn').style.display = (prev === 'screen-learning') ? 'flex' : 'none';
            updateHeader();
        }
    }

    function updateHeader() {
        const current = historyStack[historyStack.length - 1];
        document.getElementById('btn-back').style.display = (current === 'screen-learning') ? 'none' : 'block';
        document.getElementById('btn-home').style.display = (current === 'screen-learning') ? 'block' : 'none';
    }

    // --- ゲームの進行 ---
    function startGame() {
        if (!SpeechRecognition) {
            alert("お使いのブラウザは音声認識に対応していません。");
            return;
        }
        
        let shuffled = [...placesList].sort(() => 0.5 - Math.random());
        currentQuestions = shuffled.slice(0, 5);
        currentQIndex = 0;
        
        showScreen('screen-play');
        document.getElementById('q-total').textContent = currentQuestions.length;
        startStep(1);
    }

    function startStep(stepNum) {
        currentStep = stepNum;
        const place = currentQuestions[currentQIndex];
        
        document.getElementById('q-current').textContent = currentQIndex + 1;
        document.getElementById('step-badge').textContent = `STEP ${currentStep}`;
        document.getElementById('feedback-text').textContent = '';
        document.getElementById('user-transcript').textContent = '';
        
        const imgEl = document.getElementById('game-image');
        const phraseEl = document.getElementById('game-phrase');
        const micBtn = document.getElementById('mic-btn');
        const missionText = document.getElementById('mission-text');

        const rubyHtml = (place.kanji === place.hira) ? place.kanji : `<ruby>${place.kanji}<rt>${place.hira}</rt></ruby>`;

        // ゲーム中は読み上げ（ヒント）を行わないため、setTimeoutでのspeakText呼び出しを削除しました
        
        if (currentStep === 1) {
            missionText.textContent = "この場所はどこ？（なまえを言ってね）";
            imgEl.src = `${IMG_PATH}${place.file}.png`;
            imgEl.onerror = function() { this.src = 'https://placehold.co/150x150?text=Image'; };
            imgEl.classList.remove('hidden');
            phraseEl.textContent = rubyHtml;
            
        } else if (currentStep === 2) {
            missionText.textContent = "道を聞いてみよう！";
            imgEl.classList.remove('hidden');
            phraseEl.innerHTML = `すみません、${rubyHtml}は<br>どこですか？`;
            
        } else if (currentStep === 3) {
            // STEP 3: マップ探索をスキップし、そのまま返答の練習へ進む
            missionText.textContent = "道を教えてあげて！";
            imgEl.classList.remove('hidden'); // 対象の場所のイラストを表示し続ける
            targetDirectionPhrase = directionWords[Math.floor(Math.random() * directionWords.length)];
            phraseEl.textContent = targetDirectionPhrase;

        } else if (currentStep === 4) {
            missionText.textContent = "お礼を言おう！";
            imgEl.classList.add('hidden'); // お礼のときはイラストを非表示に
            phraseEl.textContent = "ありがとうございます";
        }
    }

    // --- 音声認識 ---
    function toggleSpeech() {
        if (!recognition) return;
        if (isListening) { recognition.stop(); return; }

        isListening = true;
        const btn = document.getElementById('mic-btn');
        const resText = document.getElementById('feedback-text');
        
        if(synth.speaking) synth.cancel();
        
        btn.classList.add('listening');
        resText.textContent = "聞いています...";
        resText.className = "feedback-text";

        try { recognition.start(); } catch(e){}

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-transcript').textContent = `あなたの声: 「${transcript}」`;
            checkAnswer(transcript);
        };

        recognition.onend = () => {
            isListening = false;
            btn.classList.remove('listening');
        };
        recognition.onerror = () => {
            isListening = false;
            btn.classList.remove('listening');
            resText.textContent = "うまく聞き取れませんでした";
            resText.className = "feedback-text fb-fail";
        };
    }

    function cleanText(text) {
        return text.replace(/[\s、。！？!?,，]/g, '');
    }

    function checkAnswer(speech) {
        const place = currentQuestions[currentQIndex];
        const resText = document.getElementById('feedback-text');
        const cleanSpeech = cleanText(speech);
        let maxSim = 0;

        let accepts = [];

        if (currentStep === 1) {
            accepts = place.accepts;
        } else if (currentStep === 2) {
            place.accepts.forEach(acc => {
                accepts.push(`すみません${acc}はどこですか`);
                accepts.push(`すいません${acc}はどこですか`);
                accepts.push(`${acc}はどこですか`); 
            });
        } else if (currentStep === 3) {
            accepts = [targetDirectionPhrase, targetDirectionPhrase.replace('ですよ', 'です')];
        } else if (currentStep === 4) {
            accepts = ['ありがとうございます', 'ありがとございます'];
        }

        accepts.forEach(acc => {
            const sim = calculateSimilarity(cleanSpeech, cleanText(acc));
            if (sim > maxSim) maxSim = sim;
        });

        if (maxSim >= 80) {
            resText.textContent = "合格！ Excellent!";
            resText.className = "feedback-text fb-success";
            SOUND_CORRECT.currentTime = 0; SOUND_CORRECT.play();
            
            setTimeout(() => { proceedToNextStep(); }, 1500);
        } else {
            resText.textContent = `もう一度！ (一致: ${Math.floor(maxSim)}%)`;
            resText.className = "feedback-text fb-fail";
            SOUND_INCORRECT.currentTime = 0; SOUND_INCORRECT.play();
        }
    }

    function proceedToNextStep() {
        if (currentStep < 4) {
            startStep(currentStep + 1);
        } else {
            currentQIndex++;
            if (currentQIndex < currentQuestions.length) {
                startStep(1);
            } else {
                alert("ぜんぶクリア！完璧な道案内だったよ！");
                goBack();
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