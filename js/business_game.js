document.addEventListener('DOMContentLoaded', () => {

    const synth = window.speechSynthesis;
    let voices = [];
    synth.onvoiceschanged = () => { voices = synth.getVoices(); };
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    // --- データセット ---
    const scenarios = {
        'office': {
            title: "オフィス・挨拶",
            // 練習用リスト（追加：挨拶・オフィス言葉）
            words: [
                { jp: "おはようございます", en: "Good morning" },
                { jp: "お疲れ様です", en: "Thank you for your hard work (Hello/Goodbye)" },
                { jp: "お先に失礼します", en: "Excuse me for leaving first" },
                { jp: "行って参ります", en: "I'm going out (for business)" },
                { jp: "ただいま戻りました", en: "I'm back (in the office)" },
                { jp: "承知いたしました", en: "Certainly / Understood" }
            ],
            quizzes: [
                {
                    situation: "朝、会社に着きました。同僚に会いました。",
                    role: "同僚",
                    icon: "fa-users",
                    question: "おはよう！",
                    voice: "おはよう！",
                    options: [
                        { text: "おはようございます。", correct: true, fb: "正解！丁寧で明るい挨拶です。" },
                        { text: "やあ。", correct: false, fb: "ビジネスでは少しカジュアルすぎます。" },
                        { text: "さようなら。", correct: false, fb: "朝の挨拶ではありません。" }
                    ]
                },
                {
                    situation: "仕事が終わって、先に帰ります。",
                    role: "上司・同僚",
                    icon: "fa-building",
                    question: "（みんなはまだ仕事をしています）",
                    voice: "（みんなはまだ仕事をしています）", // ナレーション風
                    options: [
                        { text: "お先に失礼します。", correct: true, fb: "正解！「先に帰ってすみません」という気持ちを表します。" },
                        { text: "帰ります。", correct: false, fb: "少し冷たい印象を与えます。" },
                        { text: "バイバイ！", correct: false, fb: "友達ではありません。" }
                    ]
                },
                {
                    situation: "営業に出かけます。",
                    role: "上司",
                    icon: "fa-user-tie",
                    question: "（カバンを持って立ち上がりました）",
                    voice: "", 
                    options: [
                        { text: "行って参ります。", correct: true, fb: "正解！外へ仕事に行くときに使います。" },
                        { text: "行ってきます。", correct: false, fb: "少しカジュアルです。「参ります」の方が丁寧です。" },
                        { text: "さようなら。", correct: false, fb: "もう戻らないように聞こえます。" }
                    ]
                }
            ]
        },
        'titles': {
            title: "役職・ランク",
            // 練習用リスト（追加：役職・関係）
            words: [
                // 関係
                { jp: "先輩 (せんぱい)", en: "Senior (in experience)" },
                { jp: "後輩 (こうはい)", en: "Junior (in experience)" },
                // 現場管理職
                { jp: "主任 (しゅにん)", en: "Chief / Team Leader" },
                { jp: "係長 (かかりちょう)", en: "Subsection Chief" },
                { jp: "課長 (かちょう)", en: "Section Manager" },
                { jp: "部長 (ぶちょう)", en: "General Manager" },
                { jp: "本部長 (ほんぶちょう)", en: "Division Director" },
                // 役員
                { jp: "常務 (じょうむ)", en: "Managing Director" },
                { jp: "専務 (せんむ)", en: "Senior Managing Director" },
                { jp: "副社長 (ふくしゃちょう)", en: "Vice President" },
                { jp: "社長 (しゃちょう)", en: "President / CEO" }
            ],
            quizzes: [
                {
                    situation: "田中さんは「課長」です。鈴木さんは「部長」です。どちらが偉いですか？",
                    role: "質問",
                    icon: "fa-sitemap",
                    question: "どちらが 上司（偉い人）ですか？",
                    voice: "どちらが 上司ですか？",
                    options: [
                        { text: "鈴木さん（部長）", correct: true, fb: "正解！課長よりも部長の方が上の役職です。" },
                        { text: "田中さん（課長）", correct: false, fb: "課長は部長の部下にあたります。" }
                    ]
                },
                {
                    situation: "会社のトップ（一番偉い人）を呼びます。",
                    role: "社員",
                    icon: "fa-user-tie",
                    question: "この会社の代表は誰ですか？",
                    voice: "この会社の代表は誰ですか？",
                    options: [
                        { text: "社長", correct: true, fb: "正解！社長（または代表取締役）がトップです。" },
                        { text: "店長", correct: false, fb: "お店のトップですが、会社のトップは社長です。" },
                        { text: "係長", correct: false, fb: "係長は現場のリーダーです。" }
                    ]
                },
                {
                    situation: "自分より先に入社して、経験がある人のことを何と呼びますか？",
                    role: "質問",
                    icon: "fa-user-group",
                    question: "（鈴木さんは私より3年早く入社しました）",
                    voice: "鈴木さんは私より3年早く入社しました。",
                    options: [
                        { text: "先輩", correct: true, fb: "正解！経験が上の人は「先輩」です。" },
                        { text: "後輩", correct: false, fb: "後輩は、自分より後に入った人です。" },
                        { text: "先生", correct: false, fb: "会社ではあまり使いません。" }
                    ]
                }
            ]
        },
        'phone': {
            title: "電話・対応",
            words: [
                { jp: "少々お待ちください", en: "Please wait a moment." },
                { jp: "お電話ありがとうございます", en: "Thank you for calling." },
                { jp: "あいにく席を外しております", en: "He/She is not at their desk right now." }
            ],
            quizzes: [
                {
                    situation: "電話で、担当の人を確認します。",
                    role: "電話の相手",
                    icon: "fa-phone",
                    question: "田中さんをお願いします。",
                    voice: "田中さんをお願いします。",
                    options: [
                        { text: "はい、少々お待ちください。", correct: true, fb: "正解！保留にして確認するときに使います。" },
                        { text: "はい、ちょっと待って。", correct: false, fb: "ビジネスでは丁寧語を使いましょう。" },
                        { text: "はい、待ちます。", correct: false, fb: "あなたが待つわけではありません。" }
                    ]
                },
                {
                    situation: "田中さんは今、トイレに行っていて席にいません。",
                    role: "電話の相手",
                    icon: "fa-phone",
                    question: "田中さんはいらっしゃいますか？",
                    voice: "田中さんはいらっしゃいますか？",
                    options: [
                        { text: "あいにく、席を外しております。", correct: true, fb: "正解！具体的な場所は言わず、「席にいない」と伝えます。" },
                        { text: "トイレに行っています。", correct: false, fb: "失礼になります。" },
                        { text: "田中はいません。", correct: false, fb: "少しぶっきらぼうです。" }
                    ]
                }
            ]
        },
        'visit': {
            title: "訪問・マナー",
            words: [
                { jp: "失礼します", en: "Excuse me (Entering/Leaving)" },
                { jp: "お世話になっております", en: "Thank you for your continued support" },
                { jp: "名刺 (めいし)", en: "Business Card" }
            ],
            quizzes: [
                {
                    situation: "会議室に入ります。ドアをノックしました。",
                    role: "あなた",
                    icon: "fa-door-open",
                    question: "（中に入るときの言葉は？）",
                    voice: "", 
                    options: [
                        { text: "失礼します。", correct: true, fb: "正解！入るときも出るときも使えます。" },
                        { text: "お邪魔します。", correct: false, fb: "友達の家に行くときに使います。" },
                        { text: "ごめんください。", correct: false, fb: "会社では使いません。" }
                    ]
                },
                {
                    situation: "取引先の人に会いました。最初の挨拶は？",
                    role: "取引先",
                    icon: "fa-user-group",
                    question: "（名刺を出しながら...）",
                    voice: "",
                    options: [
                        { text: "いつもお世話になっております。", correct: true, fb: "正解！ビジネスの定番の挨拶です。" },
                        { text: "はじめまして、元気ですか？", correct: false, fb: "ビジネスではあまり使いません。" },
                        { text: "やあ、こんにちは。", correct: false, fb: "馴れ馴れしすぎます。" }
                    ]
                }
            ]
        }
    };

    let currentMode = null;
    let quizIndex = 0;
    let score = 0;
    let currentQuizData = [];

    // --- 音声再生 (修正：一度だけ再生するように制御) ---
    window.speak = (text) => {
        if (!text) return;
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        
        const jpVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
        if(jpVoice) utterThis.voice = jpVoice;
        
        synth.speak(utterThis);
    };

    // --- 画面操作 ---
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    };

    // --- シナリオ選択 ---
    window.loadScenario = (key) => {
        currentMode = key;
        const data = scenarios[key];
        
        document.getElementById('practice-title').textContent = data.title;
        
        const listEl = document.getElementById('word-list');
        listEl.textContent = '';
        data.words.forEach(w => {
            const div = document.createElement('div');
            div.className = 'practice-item';
            div.innerHTML = `
                <div class="phrase-row">
                    <div class="phrase-content">
                        <div class="phrase-jp">${w.jp}</div>
                        <div class="phrase-en">${w.en}</div>
                    </div>
                    <button class="play-btn-mini" onclick="speak('${w.jp}')">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            `;
            listEl.appendChild(div);
        });

        window.showScreen('practice-screen');
    };

    // --- クイズ開始 ---
    window.startQuiz = () => {
        currentQuizData = scenarios[currentMode].quizzes;
        quizIndex = 0;
        score = 0;
        document.getElementById('q-total').textContent = currentQuizData.length;
        window.showScreen('quiz-screen');
        loadQuestion();
    };

    function loadQuestion() {
        const q = currentQuizData[quizIndex];
        document.getElementById('q-current').textContent = quizIndex + 1;
        document.getElementById('sim-situation').textContent = q.situation;
        document.getElementById('char-role').textContent = q.role;
        document.getElementById('question-text').textContent = q.question;
        
        const iconEl = document.getElementById('char-icon');
        iconEl.innerHTML = `<i class="fa-solid ${q.icon}"></i>`;

        const container = document.getElementById('options-container');
        container.textContent = '';
        
        const options = [...q.options].sort(() => Math.random() - 0.5);
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => handleAnswer(opt, btn);
            container.appendChild(btn);
        });

        // ★修正: 質問読み上げはここでのみ実行（一度きり）
        if(q.voice) window.speak(q.voice);
    }

    window.replayVoice = () => {
        const q = currentQuizData[quizIndex];
        if(q.voice) window.speak(q.voice);
    };

    function handleAnswer(opt, btn) {
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.disabled = true);

        const modal = document.getElementById('fb-modal');
        const icon = document.getElementById('fb-icon');
        const title = document.getElementById('fb-title');
        const text = document.getElementById('fb-text');
        
        if(opt.correct) {
            btn.classList.add('correct');
            icon.innerHTML = '<i class="fa-regular fa-circle-check" style="color:#4caf50;"></i>';
            title.textContent = "正解！";
            title.style.color = "#4caf50";
            score += 1;
            if(window.addPoints) window.addPoints(1);
        } else {
            btn.classList.add('incorrect');
            icon.innerHTML = '<i class="fa-regular fa-circle-xmark" style="color:#f44336;"></i>';
            title.textContent = "おしい！";
            title.style.color = "#f44336";
        }
        
        text.textContent = opt.fb;
        modal.style.display = 'flex';
    }

    window.nextQuestion = () => {
        document.getElementById('fb-modal').style.display = 'none';
        quizIndex++;
        if(quizIndex < currentQuizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    };

    function showResult() {
        document.getElementById('final-score').textContent = score;
        window.showScreen('result-screen');
    }

    // ★追加: どこからでも課金画面を呼び出せるようにする
    window.openPremiumModal = () => {
        if(confirm("【プレミアム会員限定】\nこのゲームを遊ぶにはプレミアム登録が必要です。\n(月額99 THB)\n\nお支払いページへ移動しますか？")) {
            window.open("https://buy.stripe.com/test_aFa8wIcw2ezZdEe5ah3VC00", "_blank");
        }
    };

});