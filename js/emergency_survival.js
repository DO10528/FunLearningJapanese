// --- ふりがなを除去してテキストだけにする便利関数（正誤判定・音声読み上げ用） ---
        function stripRuby(htmlString) {
            if (!htmlString) return '';
            let text = htmlString.replace(/<rt>.*?<\/rt>/g, '');
            return text.replace(/<[^>]*>/g, '');
        }

        // --- データ ---
        // 漢字の上にフリガナ（rubyタグ）を追加しました
        const learningData = [
            {
                title: "症状 (Symptoms)", icon: "fa-head-side-cough", class: "",
                phrases: [
                    { text: "<ruby>頭<rt>あたま</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです", en: "I have a headache.", speech: "あたまがいたいです", faIcon: "fa-bolt" },
                    { text: "お<ruby>腹<rt>なか</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです", en: "I have a stomachache.", speech: "おなかがいたいです", faIcon: "fa-face-grimace" },
                    { text: "<ruby>熱<rt>ねつ</rt></ruby>があります", en: "I have a fever.", speech: "ねつがあります", faIcon: "fa-temperature-high" },
                    { text: "<ruby>気持<rt>きも</rt></ruby>ち<ruby>悪<rt>わる</rt></ruby>いです", en: "I feel sick / nauseous.", speech: "きもちわるいです", faIcon: "fa-face-dizzy" },
                    { text: "<ruby>咳<rt>せき</rt></ruby>が<ruby>出<rt>で</rt></ruby>ます", en: "I have a cough.", speech: "せきがでます", faIcon: "fa-head-side-cough" },
                    { text: "<ruby>喉<rt>のど</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです", en: "I have a sore throat.", speech: "のどがいたいです", faIcon: "fa-lungs-virus" },
                    { text: "めまいがします", en: "I feel dizzy.", speech: "めまいがします", faIcon: "fa-asterisk" },
                    { text: "<ruby>寒気<rt>さむけ</rt></ruby>がします", en: "I have chills.", speech: "さむけがします", faIcon: "fa-temperature-arrow-down" },
                    { text: "アレルギーがあります", en: "I have an allergy.", speech: "あれるぎーがあります", faIcon: "fa-leaf" }
                ]
            },
            {
                title: "薬局 (At the Pharmacy)", icon: "fa-capsules", class: "pharmacy-cat",
                phrases: [
                    { text: "<ruby>風邪薬<rt>かぜぐすり</rt></ruby>はありますか？", en: "Do you have cold medicine?", speech: "かぜぐすりはありますか", faIcon: "fa-pills" },
                    { text: "<ruby>痛<rt>いた</rt></ruby>み<ruby>止<rt>ど</rt></ruby>めをください", en: "I'd like a painkiller, please.", speech: "いたみどめをください", faIcon: "fa-capsules" },
                    { text: "<ruby>胃薬<rt>いぐすり</rt></ruby>をください", en: "I'd like stomach medicine, please.", speech: "いぐすりをください", faIcon: "fa-prescription-bottle-medical" },
                    { text: "<ruby>目薬<rt>めぐすり</rt></ruby>はありますか？", en: "Do you have eye drops?", speech: "めぐすりはありますか", faIcon: "fa-eye-dropper" },
                    { text: "<ruby>酔<rt>よ</rt></ruby>い<ruby>止<rt>ど</rt></ruby>めをください", en: "I'd like motion sickness medicine.", speech: "よいどめをください", faIcon: "fa-car" },
                    { text: "<ruby>虫刺<rt>むしさ</rt></ruby>されの<ruby>薬<rt>くすり</rt></ruby>はどこですか？", en: "Where is the medicine for insect bites?", speech: "むしさされのくすりはどこですか", faIcon: "fa-bug" },
                    { text: "<ruby>湿布<rt>しっぷ</rt></ruby>はありますか？", en: "Do you have pain relief patches?", speech: "しっぷはありますか", faIcon: "fa-note-sticky" },
                    { text: "<ruby>絆創膏<rt>ばんそうこう</rt></ruby>はどこですか？", en: "Where are the band-aids?", speech: "ばんそうこうはどこですか", faIcon: "fa-bandage" },
                    { text: "マスクをください", en: "I'd like a mask, please.", speech: "ますくをください", faIcon: "fa-mask-face" }
                ]
            },
            {
                title: "緊急・助け (Emergency & Help)", icon: "fa-bell", class: "",
                phrases: [
                    { text: "<ruby>助<rt>たす</rt></ruby>けて！", en: "Help!", speech: "たすけて", faIcon: "fa-hand-holding-hand" },
                    { text: "<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください", en: "Please call an ambulance.", speech: "きゅうきゅうしゃをよんでください", faIcon: "fa-truck-medical" },
                    { text: "<ruby>警察<rt>けいさつ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください", en: "Please call the police.", speech: "けいさつをよんでください", faIcon: "fa-building-shield" },
                    { text: "<ruby>病院<rt>びょういん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きたいです", en: "I want to go to a hospital.", speech: "びょういんにいきたいです", faIcon: "fa-hospital" }
                ]
            },
            {
                title: "トラブル・紛失 (Trouble & Lost)", icon: "fa-passport", class: "",
                phrases: [
                    { text: "パスポートをなくしました", en: "I lost my passport.", speech: "ぱすぽーとをなくしました", faIcon: "fa-passport" },
                    { text: "<ruby>財布<rt>さいふ</rt></ruby>を<ruby>落<rt>お</rt></ruby>としました", en: "I dropped my wallet.", speech: "さいふをおとしました", faIcon: "fa-wallet" },
                    { text: "カバンを<ruby>盗<rt>ぬす</rt></ruby>まれました", en: "My bag was stolen.", speech: "かばんをぬすまれました", faIcon: "fa-suitcase-rolling" },
                    { text: "<ruby>道<rt>みち</rt></ruby>に<ruby>迷<rt>まよ</rt></ruby>いました", en: "I am lost.", speech: "みちにまよいました", faIcon: "fa-map-location-dot" }
                ]
            }
        ];

        // ゲームデータにもフリガナ（rubyタグ）を追加
        const gameData = {
            pharmacy: {
                title: "症状・薬局",
                color: "#2e7d32",
                questions: [
                    { situation: "You have a headache.", target: "<ruby>頭<rt>あたま</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです", accepts: ["あたまがいたいです"] },
                    { situation: "You have a stomachache.", target: "お<ruby>腹<rt>なか</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです", accepts: ["おなかがいたいです"] },
                    { situation: "You have a cough.", target: "<ruby>咳<rt>せき</rt></ruby>が<ruby>出<rt>で</rt></ruby>ます", accepts: ["せきがでます", "せきがでています"] },
                    { situation: "You feel dizzy.", target: "めまいがします", accepts: ["めまいがします"] },
                    { situation: "Ask for a painkiller.", target: "<ruby>痛<rt>いた</rt></ruby>み<ruby>止<rt>ど</rt></ruby>めをください", accepts: ["いたみどめをください", "いたみどめください"] },
                    { situation: "Ask for stomach medicine.", target: "<ruby>胃薬<rt>いぐすり</rt></ruby>をください", accepts: ["いぐすりをください", "いぐすりください"] },
                    { situation: "Ask if they have eye drops.", target: "<ruby>目薬<rt>めぐすり</rt></ruby>はありますか？", accepts: ["めぐすりはありますか", "めぐすりありますか"] },
                    { situation: "Ask for motion sickness medicine.", target: "<ruby>酔<rt>よ</rt></ruby>い<ruby>止<rt>ど</rt></ruby>めをください", accepts: ["よいどめをください", "よいどめください"] }
                ]
            },
            emergency: {
                title: "緊急・トラブル",
                color: "#d32f2f",
                questions: [
                    { situation: "Ask for help!", target: "<ruby>助<rt>たす</rt></ruby>けて！", accepts: ["たすけて", "たすけてください"] },
                    { situation: "Ask someone to call an ambulance.", target: "<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください", accepts: ["きゅうきゅうしゃをよんでください"] },
                    { situation: "Ask someone to call the police.", target: "<ruby>警察<rt>けいさつ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください", accepts: ["けいさつをよんでください"] },
                    { situation: "You lost your passport.", target: "パスポートをなくしました", accepts: ["ぱすぽーとをなくしました"] },
                    { situation: "You dropped your wallet.", target: "<ruby>財布<rt>さいふ</rt></ruby>を<ruby>落<rt>お</rt></ruby>としました", accepts: ["さいふをおとしました"] },
                    { situation: "You are lost.", target: "<ruby>道<rt>みち</rt></ruby>に<ruby>迷<rt>まよ</rt></ruby>いました", accepts: ["みちにまよいました"] }
                ]
            }
        };

        // --- アプリ状態 ---
        let historyStack = ['screen-learning'];
        let currentGameType = null;
        let currentQuestionIndex = 0;
        let isListening = false;

        // --- 音声関連 API ---
        const synth = window.speechSynthesis;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.lang = 'ja-JP';
            recognition.interimResults = false;
            recognition.continuous = false;
        }

        // --- 初期化・描画 ---
        window.onload = () => {
            renderLearning();
            updateHeader();
        };

        function showScreen(id) {
            document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
            document.getElementById(id).classList.add('active');

            if (historyStack[historyStack.length - 1] !== id) {
                historyStack.push(id);
            }

            document.getElementById('start-game-btn').style.display = (id === 'screen-learning') ? 'flex' : 'none';
            updateHeader();
            window.scrollTo(0, 0);
        }

        window.goBack = () => {
            if (historyStack.length > 1) {
                historyStack.pop();
                const prev = historyStack[historyStack.length - 1];

                if (synth.speaking) synth.cancel();
                if (isListening && recognition) recognition.stop();

                document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
                document.getElementById(prev).classList.add('active');
                document.getElementById('start-game-btn').style.display = (prev === 'screen-learning') ? 'flex' : 'none';
                updateHeader();
            }
        };

        function updateHeader() {
            const backBtn = document.getElementById('header-back-btn');
            const homeBtn = document.getElementById('header-home-btn');
            const current = historyStack[historyStack.length - 1];

            if (current === 'screen-learning') {
                backBtn.style.display = 'none';
                if (homeBtn) homeBtn.style.display = 'block';
            } else {
                backBtn.style.display = 'block';
                if (homeBtn) homeBtn.style.display = 'none';
            }
        }

        // 1. 練習画面（FontAwesomeアイコンで描画）
        function renderLearning() {
            const container = document.getElementById('learning-content');
            container.textContent = '';

            learningData.forEach(cat => {
                const section = document.createElement('div');
                section.className = `learning-section ${cat.class}`;

                let phrasesHtml = '';
                cat.phrases.forEach(phrase => {
                    phrasesHtml += `
                <div class="phrase-item">
                    <div class="phrase-text-group">
                        <span class="phrase-text">${phrase.text}</span>
                        <span class="phrase-en">${phrase.en}</span>
                    </div>
                    <div class="phrase-icon-box">
                        <i class="fa-solid ${phrase.faIcon}"></i>
                    </div>
                    <button class="play-btn" onclick="speakText('${phrase.speech || stripRuby(phrase.text)}')">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>`;
                });

                section.innerHTML = `
            <div class="cat-title"><i class="fa-solid ${cat.icon}"></i> ${cat.title}</div>
            <div>${phrasesHtml}</div>
        `;
                container.appendChild(section);
            });
        }

        window.speakText = (text) => {
            if (synth.speaking) synth.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'ja-JP';
            utter.rate = 0.85;
            synth.speak(utter);
        };

        // 2. ゲームロジック
        window.startGame = (type) => {
            if (!SpeechRecognition) {
                alert("お使いのブラウザは音声認識に対応していません。SafariかChromeをご利用ください。");
                return;
            }
            currentGameType = type;
            currentQuestionIndex = 0;

            document.getElementById('player-area-box').style.borderColor = gameData[type].color;
            document.getElementById('target-phrase').style.color = gameData[type].color;

            gameData[type].questions.sort(() => Math.random() - 0.5);

            showScreen('screen-game');
            document.getElementById('game-title').textContent = gameData[type].title;
            loadQuestion();
        };

        function loadQuestion() {
            const qList = gameData[currentGameType].questions;
            const qData = qList[currentQuestionIndex];

            document.getElementById('game-progress').textContent = `(${currentQuestionIndex + 1}/${qList.length})`;
            document.getElementById('situation-text').textContent = qData.situation;

            // HTMLとしてレンダリングするため、insertAdjacentHTMLを使用
            const targetElement = document.getElementById('target-phrase');
            targetElement.textContent = '';
            targetElement.insertAdjacentHTML('beforeend', qData.target);

            document.getElementById('feedback-text').textContent = "";
            document.getElementById('recognized-text').textContent = "";
            document.getElementById('mic-btn').classList.remove('listening');
            isListening = false;
        }

        // 3. 音声認識と判定
        window.toggleSpeechRecognition = () => {
            const micBtn = document.getElementById('mic-btn');
            const feedbackText = document.getElementById('feedback-text');

            if (synth.speaking) synth.cancel();

            if (isListening) {
                recognition.stop();
                return;
            }

            try {
                recognition.start();
                isListening = true;
                micBtn.classList.add('listening');
                feedbackText.textContent = "聞いています...";
                feedbackText.className = "feedback-text";
            } catch (e) {
                console.error(e);
            }
        };

        if (recognition) {
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('recognized-text').textContent = `あなたの発音: 「${transcript}」`;
                checkAnswer(transcript);
            };

            recognition.onend = () => {
                isListening = false;
                document.getElementById('mic-btn').classList.remove('listening');
                if (document.getElementById('feedback-text').textContent === "聞いています...") {
                    document.getElementById('feedback-text').textContent = "音声が認識できませんでした。もう一度！";
                    document.getElementById('feedback-text').className = "feedback-text fb-fail";
                }
            };

            recognition.onerror = (event) => {
                isListening = false;
                document.getElementById('mic-btn').classList.remove('listening');
                document.getElementById('feedback-text').textContent = "エラーが発生しました。";
            };
        }

        // カンマやスペース、さらにHTMLタグ(ルビ)を削除して比較する関数
        function calculateSimilarity(s1, s2) {
            const cleanS1 = stripRuby(s1).toLowerCase().replace(/[\s、。！？!?,，]/g, '');
            const cleanS2 = stripRuby(s2).toLowerCase().replace(/[\s、。！？!?,，]/g, '');

            if (cleanS1 === cleanS2) return 100;
            if (cleanS1.length === 0 || cleanS2.length === 0) return 0;

            let costs = [];
            for (let i = 0; i <= cleanS1.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= cleanS2.length; j++) {
                    if (i === 0) {
                        costs[j] = j;
                    } else if (j > 0) {
                        let newValue = costs[j - 1];
                        if (cleanS1.charAt(i - 1) !== cleanS2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
                if (i > 0) costs[cleanS2.length] = lastValue;
            }
            const distance = costs[cleanS2.length];
            const maxLen = Math.max(cleanS1.length, cleanS2.length);
            return ((1 - distance / maxLen) * 100);
        }

        function checkAnswer(transcript) {
            const qData = gameData[currentGameType].questions[currentQuestionIndex];
            const fbText = document.getElementById('feedback-text');

            let maxSimilarity = calculateSimilarity(transcript, qData.target);

            qData.accepts.forEach(acc => {
                const sim = calculateSimilarity(transcript, acc);
                if (sim > maxSimilarity) maxSimilarity = sim;
            });

            console.log(`Similarity: ${maxSimilarity.toFixed(1)}%`);

            if (maxSimilarity >= 90) {
                fbText.textContent = "合格！ (Excellent)";
                fbText.className = "feedback-text fb-success";

                const utter = new SpeechSynthesisUtterance("ピンポーン！");
                utter.rate = 1.5; synth.speak(utter);

                // 正解したら1.5秒後に次へ
                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < gameData[currentGameType].questions.length) {
                        loadQuestion();
                    } else {
                        alert("クリアおめでとうございます！緊急時もこれで安心ですね。");
                        goBack();
                    }
                }, 1500);

            } else {
                fbText.textContent = `惜しい！もう一度！ (一致率: ${Math.floor(maxSimilarity)}%)`;
                fbText.className = "feedback-text fb-fail";
            }
        }