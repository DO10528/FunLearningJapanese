document.addEventListener('DOMContentLoaded', () => {

    // --- 音声認識の初期化 ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;

    if (!SpeechRecognition) {
        alert("このブラウザは音声認識に対応していません。\niPadの場合はSafariをご利用ください。");
    } else {
        try {
            recognition = new SpeechRecognition();
            recognition.lang = 'ja-JP';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.continuous = false;
        } catch (e) {
            console.error("Mic init error:", e);
        }
    }

    // --- 音声合成とルビの除去 ---
    const synth = window.speechSynthesis;
    let voices = [];
    
    const loadVoices = () => { voices = synth.getVoices(); };
    synth.onvoiceschanged = loadVoices;
    loadVoices();

    function stripRuby(htmlString) {
        if (!htmlString) return '';
        let text = htmlString.replace(/<rt>.*?<\/rt>/g, '');
        return text.replace(/<[^>]*>/g, '');
    }

    window.speak = (rawText) => {
        const text = stripRuby(rawText);
        if (!text) return;

        if (isRecording && recognition) {
            try { recognition.stop(); } catch(e){}
            isRecording = false;
            updateMicUI('stop');
        }
        
        synth.cancel();

        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 1.0;
        
        const jpVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
        if(jpVoice) utterThis.voice = jpVoice;
        
        synth.speak(utterThis);
    };

    window.toggleRecording = () => {
        const micBtn = document.getElementById('mic-btn');
        const statusText = document.getElementById('recognized-text');

        if (!recognition) return;

        if (synth.speaking || synth.pending) {
            synth.cancel();
        }

        if (isRecording) {
            try { recognition.stop(); } catch(e) {}
            isRecording = false;
            updateMicUI('stop');
            statusText.textContent = "停止しました";
            return;
        }

        try {
            statusText.textContent = "マイク起動中...";
            micBtn.classList.add('processing');
            micBtn.disabled = true;

            setTimeout(() => {
                try {
                    recognition.start();
                } catch (e) {
                    if (e.name !== 'InvalidStateError') {
                        micBtn.disabled = false;
                        micBtn.classList.remove('processing');
                        statusText.textContent = "エラー: 再読み込みしてください";
                    }
                }
            }, 100);

        } catch (e) {
            micBtn.disabled = false;
        }
    };

    if (recognition) {
        recognition.onstart = () => {
            isRecording = true;
            updateMicUI('recording');
            document.getElementById('recognized-text').textContent = "聞いています...どうぞ！";
            document.getElementById('mic-btn').disabled = false;
        };

        recognition.onend = () => {
            isRecording = false;
            updateMicUI('stop');
            const statusText = document.getElementById('recognized-text');
            if (statusText.textContent === "聞いています...どうぞ！") {
                statusText.textContent = "もう一度押してください";
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('recognized-text').textContent = `「${transcript}」`;
            evaluateSpeech(transcript);
        };

        recognition.onerror = (event) => {
            isRecording = false;
            updateMicUI('stop');
            const statusText = document.getElementById('recognized-text');
            if (event.error === 'not-allowed') {
                statusText.textContent = "マイクの使用が許可されていません";
            } else if (event.error === 'no-speech') {
                statusText.textContent = "声が聞こえませんでした";
            } else if (event.error === 'aborted') {
                statusText.textContent = "中断されました";
            } else {
                statusText.textContent = "エラー: もう一度押してください";
            }
        };
    }

    function updateMicUI(state) {
        const micBtn = document.getElementById('mic-btn');
        if(!micBtn) return;
        micBtn.classList.remove('processing');
        micBtn.disabled = false;
        if (state === 'recording') micBtn.classList.add('listening');
        else micBtn.classList.remove('listening');
    }

    // --- シナリオデータ ---
    const scenarios = {
        'konbini': {
            name: "コンビニ (Convenience Store)",
            steps: [
                {
                    clerk: { jp: "いらっしゃいませ。お<ruby>支払<rt>しはら</rt></ruby>いはどうなさいますか？", en: "How would you like to pay?" },
                    options: [
                        { jp: "<ruby>現金<rt>げんきん</rt></ruby>でお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Cash, please.", correct: true },
                        { jp: "クレジットカードで。", en: "By credit card.", correct: true },
                        { jp: "<ruby>電子<rt>でんし</rt></ruby>マネーで。", en: "By electronic money.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "お<ruby>弁当<rt>べんとう</rt></ruby>は<ruby>温<rt>あたた</rt></ruby>めますか？", en: "Would you like your bento warmed up?" },
                    options: [
                        { jp: "はい、お<ruby>願<rt>ねが</rt></ruby>いします。", en: "Yes, please.", correct: true },
                        { jp: "いいえ、<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。", en: "No, thank you.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "お<ruby>箸<rt>はし</rt></ruby>はお<ruby>使<rt>つか</rt></ruby>いになりますか？", en: "Do you need chopsticks?" },
                    options: [
                        { jp: "はい、<ruby>一膳<rt>いちぜん</rt></ruby>ください。", en: "Yes, one pair please.", correct: true },
                        { jp: "スプーンをください。", en: "Spoon, please.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "レジ<ruby>袋<rt>ぶくろ</rt></ruby>はご<ruby>利用<rt>りよう</rt></ruby>ですか？", en: "Do you need a plastic bag?" },
                    options: [
                        { jp: "はい、お<ruby>願<rt>ねが</rt></ruby>いします。", en: "Yes, please.", correct: true },
                        { jp: "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。", en: "I'm fine.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "レシートはご<ruby>利用<rt>りよう</rt></ruby>ですか？", en: "Do you need a receipt?" },
                    options: [
                        { jp: "はい、ください。", en: "Yes, please.", correct: true },
                        { jp: "いりません。", en: "No need.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "（<ruby>店員<rt>てんいん</rt></ruby>に<ruby>何<rt>なに</rt></ruby>か<ruby>質問<rt>しつもん</rt></ruby>してみよう）", en: "(Ask the clerk something)" },
                    options: [
                        { jp: "すみません、トイレはありますか？", en: "Excuse me, is there a toilet?", correct: true },
                        { jp: "<ruby>両替<rt>りょうがえ</rt></ruby>はできますか？", en: "Can I exchange money?", correct: true },
                        { jp: "<ruby>肉<rt>にく</rt></ruby>まんはありますか？", en: "Do you have meat buns?", correct: true },
                        { jp: "おしぼりもらえますか？", en: "Can I have a wet towel?", correct: true }
                    ]
                }
            ]
        },
        'burger': {
            name: "ハンバーガー (Burger Shop)",
            steps: [
                {
                    clerk: { jp: "いらっしゃいませ。ご<ruby>注文<rt>ちゅうもん</rt></ruby>をお<ruby>伺<rt>うかが</rt></ruby>いします。", en: "May I take your order?" },
                    options: [
                        { jp: "チーズバーガーをひとつ。", en: "One Cheeseburger.", correct: true },
                        { jp: "てりやきバーガーセットをください。", en: "Teriyaki Burger Set please.", correct: true },
                        { jp: "フィレオフィッシュをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Filet-O-Fish please.", correct: true },
                        { jp: "ビッグマックを<ruby>単品<rt>たんぴん</rt></ruby>で。", en: "Big Mac (item only).", correct: true }
                    ]
                },
                {
                    clerk: { jp: "セットのお<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>はいかがしますか？", en: "What drink for the set?" },
                    options: [
                        { jp: "コーラで。", en: "Coke.", correct: true },
                        { jp: "ウーロン<ruby>茶<rt>ちゃ</rt></ruby>で。", en: "Oolong tea.", correct: true },
                        { jp: "オレンジジュースで。", en: "Orange juice.", correct: true },
                        { jp: "アイスティーで。", en: "Iced tea.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "サイズはいかがなさいますか？", en: "Which size?" },
                    options: [
                        { jp: "Sサイズで。", en: "Small.", correct: true },
                        { jp: "Mサイズで。", en: "Medium.", correct: true },
                        { jp: "Lサイズにしてください。", en: "Large.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "ご<ruby>一緒<rt>いっしょ</rt></ruby>にサイドメニューはいかがですか？", en: "Any side menu?" },
                    options: [
                        { jp: "ポテトをください。", en: "Fries please.", correct: true },
                        { jp: "チキンナゲットをください。", en: "Chicken nuggets please.", correct: true },
                        { jp: "アップルパイをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Apple pie please.", correct: true },
                        { jp: "サラダをください。", en: "Salad please.", correct: true },
                        { jp: "<ruby>結構<rt>けっこう</rt></ruby>です。", en: "No thank you.", correct: true }
                    ]
                }
            ]
        },
        'cafe': {
            name: "カフェ (Cafe)",
            steps: [
                {
                    clerk: { jp: "こんにちは。ご<ruby>注文<rt>ちゅうもん</rt></ruby>をどうぞ。", en: "Order please." },
                    options: [
                        { jp: "スターバックスラテをください。", en: "Starbucks Latte please.", correct: true },
                        { jp: "キャラメルフラペチーノをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Caramel Frappuccino please.", correct: true },
                        { jp: "アイスコーヒーをください。", en: "Iced coffee please.", correct: true },
                        { jp: "カプチーノをください。", en: "Cappuccino please.", correct: true },
                        { jp: "<ruby>抹茶<rt>まっちゃ</rt></ruby>ティーラテをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Matcha Tea Latte please.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "サイズはいかがなさいますか？", en: "Which size?" },
                    options: [
                        { jp: "ショートで。", en: "Short.", correct: true },
                        { jp: "トールで。", en: "Tall.", correct: true },
                        { jp: "グランデで。", en: "Grande.", correct: true },
                        { jp: "ベンティで。", en: "Venti.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "ご<ruby>一緒<rt>いっしょ</rt></ruby>にフードはいかがですか？", en: "Any food?" },
                    options: [
                        { jp: "チョコレートスコーンをください。", en: "Chocolate scone please.", correct: true },
                        { jp: "チーズケーキをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Cheesecake please.", correct: true },
                        { jp: "サンドイッチをください。", en: "Sandwich please.", correct: true },
                        { jp: "ドーナツをひとつ。", en: "One donut.", correct: true },
                        { jp: "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。", en: "I'm fine.", correct: true }
                    ]
                }
            ]
        },
        'ramen': {
            name: "ラーメン屋 (Ramen Shop)",
            steps: [
                {
                    clerk: { jp: "いらっしゃいませ！ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりですか？", en: "Ready to order?" },
                    options: [
                        { jp: "<ruby>醤油<rt>しょうゆ</rt></ruby>ラーメンをください。", en: "Shoyu Ramen.", correct: true },
                        { jp: "<ruby>味噌<rt>みそ</rt></ruby>ラーメンをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Miso Ramen.", correct: true },
                        { jp: "<ruby>豚骨<rt>とんこつ</rt></ruby>ラーメンをひとつ。", en: "Tonkotsu Ramen.", correct: true },
                        { jp: "<ruby>塩<rt>しお</rt></ruby>ラーメンをください。", en: "Shio Ramen.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "<ruby>麺<rt>めん</rt></ruby>の<ruby>硬<rt>かた</rt></ruby>さはどうしますか？", en: "Noodle firmness?" },
                    options: [
                        { jp: "<ruby>硬<rt>かた</rt></ruby>めでお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Firm (Katame).", correct: true },
                        { jp: "<ruby>普通<rt>ふつう</rt></ruby>で。", en: "Normal (Futsuu).", correct: true },
                        { jp: "<ruby>柔<rt>やわ</rt></ruby>らかめで。", en: "Soft (Yawarakame).", correct: true }
                    ]
                }
            ]
        },
        'yakiniku': {
            name: "焼肉屋 (Yakiniku/BBQ)",
            steps: [
                {
                    clerk: { jp: "いらっしゃいませ。コースになさいますか？", en: "Would you like a course?" },
                    options: [
                        { jp: "<ruby>食<rt>た</rt></ruby>べ<ruby>放題<rt>ほうだい</rt></ruby>コースで。", en: "All-you-can-eat course.", correct: true },
                        { jp: "<ruby>単品<rt>たんぴん</rt></ruby>で<ruby>注文<rt>ちゅうもん</rt></ruby>します。", en: "A la carte.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "お<ruby>肉<rt>にく</rt></ruby>のご<ruby>注文<rt>ちゅうもん</rt></ruby>をどうぞ。", en: "Please order meat." },
                    options: [
                        { jp: "カルビとロースをください。", en: "Kalbi and Loin.", correct: true },
                        { jp: "<ruby>牛<rt>ぎゅう</rt></ruby>タンとハラミをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Beef tongue and Skirt steak.", correct: true },
                        { jp: "ホルモンをください。", en: "Horumon.", correct: true },
                        { jp: "<ruby>豚<rt>とん</rt></ruby>トロをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Pork neck.", correct: true }
                    ]
                }
            ]
        },
        'izakaya': {
            name: "居酒屋 (Izakaya/Pub)",
            steps: [
                {
                    clerk: { jp: "<ruby>何名様<rt>なんめいさま</rt></ruby>ですか？おタバコは<ruby>吸<rt>す</rt></ruby>われますか？", en: "How many? Smoking?" },
                    options: [
                        { jp: "2<ruby>人<rt>ふたり</rt></ruby>です。<ruby>禁煙席<rt>きんえんせき</rt></ruby>で。", en: "Two. Non-smoking.", correct: true },
                        { jp: "4<ruby>人<rt>よにん</rt></ruby>です。<ruby>喫煙席<rt>きつえんせき</rt></ruby>で。", en: "Four. Smoking.", correct: true },
                        { jp: "<ruby>個室<rt>こしつ</rt></ruby>は<ruby>空<rt>あ</rt></ruby>いていますか？", en: "Is a private room available?", correct: true }
                    ]
                },
                {
                    clerk: { jp: "お<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>は<ruby>決<rt>き</rt></ruby>まりましたか？", en: "Drinks?" },
                    options: [
                        { jp: "とりあえず<ruby>生<rt>なま</rt></ruby>ふたつ。", en: "Two draft beers for now.", correct: true },
                        { jp: "ハイボールをください。", en: "Highball please.", correct: true },
                        { jp: "レモンサワーをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Lemon sour please.", correct: true }
                    ]
                }
            ]
        },
        'pizza': {
            name: "ピザ屋 (Pizza Shop)",
            steps: [
                {
                    clerk: { jp: "ご<ruby>注文<rt>ちゅうもん</rt></ruby>をお<ruby>伺<rt>うかが</rt></ruby>いします。", en: "Order please." },
                    options: [
                        { jp: "マルゲリータをください。", en: "Margherita.", correct: true },
                        { jp: "シーフードピザをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Seafood Pizza.", correct: true },
                        { jp: "テリヤキチキンピザをください。", en: "Teriyaki Chicken Pizza.", correct: true }
                    ]
                },
                {
                    clerk: { jp: "サイズと<ruby>生地<rt>きじ</rt></ruby>はどうしますか？", en: "Size and Crust?" },
                    options: [
                        { jp: "Mサイズのクリスピーで。", en: "Medium, Crispy.", correct: true },
                        { jp: "Lサイズのハンドトスで。", en: "Large, Hand-tossed.", correct: true },
                        { jp: "<ruby>耳<rt>みみ</rt></ruby>にチーズを<ruby>入<rt>い</rt></ruby>れてください。", en: "Cheese in the crust.", correct: true }
                    ]
                }
            ]
        },
        'restaurant': {
            name: "ファミレス (Family Restaurant)",
            steps: [
                {
                    clerk: { jp: "いらっしゃいませ。<ruby>何名様<rt>なんめいさま</rt></ruby>ですか？", en: "How many people?" },
                    options: [
                        { jp: "3<ruby>人<rt>さんにん</rt></ruby>です。", en: "Three people.", correct: true },
                        { jp: "ひとりです。", en: "One person.", correct: true },
                        { jp: "<ruby>子供用<rt>こどもよう</rt></ruby>の<ruby>椅子<rt>いす</rt></ruby>はありますか？", en: "Do you have a child chair?", correct: true }
                    ]
                },
                {
                    clerk: { jp: "ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりですか？", en: "Ready to order?" },
                    options: [
                        { jp: "ハンバーグステーキをください。", en: "Hamburg steak.", correct: true },
                        { jp: "オムライスをお<ruby>願<rt>ねが</rt></ruby>いします。", en: "Omurice.", correct: true },
                        { jp: "カレーライスをください。", en: "Curry rice.", correct: true },
                        { jp: "お<ruby>子様<rt>こさま</rt></ruby>ランチをひとつ。", en: "Kid's meal.", correct: true }
                    ]
                }
            ]
        }
    };

    // ランダムモードの表示用に、全stepに店舗名を持たせておく
    for (const key in scenarios) {
        scenarios[key].steps.forEach(step => {
            step.shopName = scenarios[key].name;
        });
    }

    let currentScenarioId = '';
    let currentData = null;
    let stepIndex = 0;
    let currentTargetPhrase = null;

    function normalizeText(text) {
        if(!text) return "";
        let t = text;
        t = t.replace(/[ 、。！？,.!?]/g, "");
        t = t.replace(/照り焼き|照焼/g, "てりやき");
        t = t.replace(/ビッグマック/g, "ビックマック");
        t = t.replace(/珈琲/g, "コーヒー");
        t = t.replace(/下さい/g, "ください");
        t = t.replace(/致します/g, "いたします");
        t = t.replace(/御座います/g, "ございます");
        t = t.replace(/唐揚/g, "唐揚げ");
        t = t.replace(/鳥皿/g, "取り皿");
        t = t.replace(/取皿/g, "取り皿");
        t = t.replace(/ふたり|二人/g, "2人");
        t = t.replace(/ひとり|一人/g, "1人");
        t = t.replace(/さんにん|三人/g, "3人");
        t = t.replace(/よにん|四人/g, "4人");
        t = t.replace(/ひとつ|一つ/g, "1つ");
        t = t.replace(/ふたつ|二つ/g, "2つ");
        t = t.replace(/みっつ|三つ/g, "3つ");
        t = t.replace(/一/g, "1");
        t = t.replace(/二/g, "2");
        t = t.replace(/三/g, "3");
        t = t.replace(/四/g, "4");
        t = t.replace(/五/g, "5");
        t = t.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
        return t;
    }

    function getSimilarity(s1, s2) {
        s1 = normalizeText(s1);
        s2 = normalizeText(s2);
        const len1 = s1.length;
        const len2 = s2.length;
        const matrix = [];
        for (let i = 0; i <= len1; i++) matrix[i] = [i];
        for (let j = 0; j <= len2; j++) matrix[0][j] = j;
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return (Math.max(len1, len2) - matrix[len1][len2]) / Math.max(len1, len2);
    }

    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0,0);
        
        const footer = document.getElementById('fixed-footer-practice');
        if(id === 'practice-screen') footer.style.display = 'block';
        else footer.style.display = 'none';
    };

    window.loadScenario = (id) => {
        currentScenarioId = id;
        
        if (id === 'random') {
            let allSteps = [];
            for (const key in scenarios) {
                scenarios[key].steps.forEach(step => {
                    allSteps.push(step);
                });
            }
            // ランダムに並び替え
            for (let i = allSteps.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allSteps[i], allSteps[j]] = [allSteps[j], allSteps[i]];
            }
            // 5問だけ抽出
            allSteps = allSteps.slice(0, 5);

            currentData = {
                name: "ランダムミックス (応用)",
                steps: allSteps
            };
            
            // ★ ランダムモードの場合は練習画面を作らず、直ちにテスト開始
            startSimulation();
            return;
        } else {
            currentData = scenarios[id];
        }

        const listEl = document.getElementById('practice-list');
        listEl.textContent = '';
        document.getElementById('practice-title').textContent = currentData.name;

        currentData.steps.forEach((step, idx) => {
            let answersHtml = '';
            step.options.forEach(opt => {
                const escapedJp = opt.jp.replace(/'/g, "\\'");
                answersHtml += `
                    <div class="answer-item">
                        <div class="text-content">
                            <div class="text-jp" style="color:var(--primary);">${opt.jp}</div>
                            <div class="text-en">${opt.en}</div>
                        </div>
                        <button class="play-btn-mini" onclick="speak('${escapedJp}')">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                `;
            });
            const escapedClerkJp = step.clerk.jp.replace(/'/g, "\\'");

            const div = document.createElement('div');
            div.className = 'practice-item';
            div.innerHTML = `
                <div style="font-size:0.8em; color:#999; margin-bottom:5px;">Step ${idx+1}</div>
                <div class="practice-row">
                    <div class="role-badge badge-clerk">店員</div>
                    <div class="text-content">
                        <div class="text-jp">${step.clerk.jp}</div>
                        <div class="text-en">${step.clerk.en}</div>
                    </div>
                    <button class="play-btn-mini" onclick="speak('${escapedClerkJp}')"><i class="fa-solid fa-volume-high"></i></button>
                </div>
                <div class="practice-row" style="align-items: flex-start;">
                    <div class="role-badge badge-you" style="margin-top:8px;">あなた</div>
                    <div class="answer-list">${answersHtml}</div>
                </div>
            `;
            listEl.appendChild(div);
        });
        window.showScreen('practice-screen');
    };

    // シミュレーション画面からの戻る処理
    window.goBackFromSim = () => {
        if (currentScenarioId === 'random') {
            showScreen('menu-screen'); // ランダムモードなら直接メニューへ
        } else {
            showScreen('practice-screen'); // 個別店舗なら練習画面へ
        }
    };

    window.startSimulation = () => {
        stepIndex = 0;
        document.getElementById('total-step').textContent = currentData.steps.length;
        window.showScreen('sim-screen');
        loadStep();
    };

    function loadStep() {
        const step = currentData.steps[stepIndex];
        document.getElementById('step-count').textContent = stepIndex + 1;
        
        // 店員ラベルに現在の店舗名を表示
        document.getElementById('clerk-role-label').textContent = `店員 / Situation [${step.shopName}]`;

        document.getElementById('clerk-text-jp').textContent = step.clerk.jp;
        document.getElementById('clerk-text-en').textContent = step.clerk.en;
        window.speak(step.clerk.jp);

        document.getElementById('score-result').textContent = '';
        document.getElementById('recognized-text').textContent = '...';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('mic-btn').disabled = false;
        
        const correctOpts = step.options.filter(o => o.correct);
        const randomOpt = correctOpts[Math.floor(Math.random() * correctOpts.length)];
        currentTargetPhrase = randomOpt;

        document.getElementById('target-phrase').textContent = randomOpt.jp;
        document.getElementById('target-sub').textContent = randomOpt.en;
    }

    window.replayClerkVoice = () => {
        window.speak(currentData.steps[stepIndex].clerk.jp);
    };

    function evaluateSpeech(userText) {
        if(!currentTargetPhrase) return;
        const targetText = stripRuby(currentTargetPhrase.jp);
        const similarity = getSimilarity(userText, targetText);
        const percentage = Math.floor(similarity * 100);

        const resultEl = document.getElementById('score-result');
        const nextBtn = document.getElementById('next-btn');

        if (percentage >= 60) {
            resultEl.innerHTML = `<span class="score-badge score-high">Great! ${percentage}%</span>`;
            document.getElementById('mic-btn').disabled = true;
            if(window.addPointsToUser) window.addPointsToUser(1, currentScenarioId);
            nextBtn.style.display = 'block';
            nextBtn.textContent = '次へ';
            nextBtn.onclick = nextStep;
        } else {
            resultEl.innerHTML = `<span class="score-badge score-low">Try again... ${percentage}%</span><br><span style="font-size:0.8em; color:#777;">もう一度マイクを押してね</span>`;
        }
    }

    window.nextStep = () => {
        stepIndex++;
        if (stepIndex < currentData.steps.length) {
            loadStep();
        } else {
            document.getElementById('final-msg').textContent = "すべての会話ができました！";
            window.showScreen('result-screen');
        }
    };
});