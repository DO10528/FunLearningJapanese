const synth = window.speechSynthesis;

    function speak(text, onFinished) {
        if (synth.speaking) synth.cancel();
        const cleanText = text.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]*>/g, '');
        const utterThis = new SpeechSynthesisUtterance(cleanText);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 1.0; 
        utterThis.onend = () => { if (onFinished) onFinished(); };
        utterThis.onerror = () => { if (onFinished) onFinished(); };
        synth.speak(utterThis);
    }

    // --- データ定義 ---
    const level1Data = [
        { pre: "<ruby>朝<rt>あさ</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を", reading: "た", target: "食", post: "べました。", wrong1: "飲", wrong2: "見", en: "I ate breakfast." },
        { pre: "<ruby>映画<rt>えいが</rt></ruby>を", reading: "み", target: "見", post: "ます。", wrong1: "貝", wrong2: "目", en: "I watch a movie." },
        { pre: "<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を", reading: "よ", target: "読", post: "みます。", wrong1: "語", wrong2: "話", en: "I read a book at the library." },
        { pre: "<ruby>銀行<rt>ぎんこう</rt></ruby>へ", reading: "い", target: "行", post: "きます。", wrong1: "休", wrong2: "来", en: "I go to the bank." },
        { pre: "<ruby>珈琲<rt>コーヒー</rt></ruby>を", reading: "の", target: "飲", post: "みます。", wrong1: "食", wrong2: "飯", en: "I drink coffee." },
        { pre: "きょうは", reading: "あめ", target: "雨", post: "ですね。", wrong1: "雪", wrong2: "天", en: "It is rainy today, isn't it?" },
        { pre: "スーパーで", reading: "か", target: "買", post: "いものをします。", wrong1: "見", wrong2: "貝", en: "I shop at the supermarket." },
        { pre: "<ruby>仕事<rt>しごと</rt></ruby>を", reading: "やす", target: "休", post: "みます。", wrong1: "体", wrong2: "本", en: "I take a day off work." },
        { pre: "<ruby>音楽<rt>おんがく</rt></ruby>を", reading: "き", target: "聞", post: "きます。", wrong1: "間", wrong2: "耳", en: "I listen to music." },
        { pre: "<ruby>手紙<rt>てがみ</rt></ruby>を", reading: "か", target: "書", post: "きます。", wrong1: "読", wrong2: "古", en: "I write a letter." },
        { pre: "<ruby>彼<rt>かれ</rt></ruby>は「いいえ」と", reading: "い", target: "言", post: "いました。", wrong1: "語", wrong2: "口", en: "He said 'No'." },
        { pre: "これは100", reading: "えん", target: "円", post: "です。", wrong1: "口", wrong2: "回", en: "This is 100 yen." },
        { pre: "あなたの", reading: "な", target: "名", post: "<ruby>前<rt>まえ</rt></ruby>はなんですか。", wrong1: "多", wrong2: "夕", en: "What is your name?" },
        { pre: "あそこに", reading: "かわ", target: "川", post: "があります。", wrong1: "三", wrong2: "山", en: "There is a river over there." },
        { pre: "<ruby>右<rt>みぎ</rt></ruby>の", reading: "あし", target: "足", post: "が<ruby>痛<rt>いた</rt></ruby>いです。", wrong1: "口", wrong2: "走", en: "My right leg hurts." }
    ];

    // Lv2: A-B会話セット (グループ化) - 10セット作成
    const level2Groups = [
        [ // 1. Lunch
            { pre: "<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>は <ruby>何<rt>なん</rt></ruby>", reading: "じ", target: "時", post: "ですか。", wrong1: "分", wrong2: "寺", en: "What time is lunch?", role: "A" },
            { pre: "12時です。<ruby>一緒<rt>いっしょ</rt></ruby>に", reading: "た", target: "食", post: "べましょう。", wrong1: "飲", wrong2: "見", en: "It's 12. Let's eat together.", role: "B", prev: "A: 昼ご飯は 何時ですか。" }
        ],
        [ // 2. Weather
            { pre: "今日は <ruby>天<rt>てん</rt></ruby>", reading: "き", target: "気", post: "が <ruby>悪<rt>わる</rt></ruby>いですね。", wrong1: "汽", wrong2: "木", en: "The weather is bad today.", role: "A" },
            { pre: "そうですね。", reading: "あめ", target: "雨", post: "が <ruby>降<rt>ふ</rt></ruby>りますよ。", wrong1: "雪", wrong2: "雲", en: "That's right. It's going to rain.", role: "B", prev: "A: 今日は 天気が 悪いですね。" }
        ],
        [ // 3. Intro
            { pre: "お", reading: "な", target: "名", post: "<ruby>前<rt>まえ</rt></ruby>は <ruby>何<rt>なん</rt></ruby>ですか。", wrong1: "夕", wrong2: "多", en: "What is your name?", role: "A" },
            { pre: "<ruby>田中<rt>たなか</rt></ruby>です。大", reading: "がく", target: "学", post: "<ruby>生<rt>せい</rt></ruby>です。", wrong1: "字", wrong2: "安", en: "I am Tanaka. I'm a university student.", role: "B", prev: "A: お名前は 何ですか。" }
        ],
        [ // 4. Shopping
            { pre: "この <ruby>本<rt>ほん</rt></ruby>は いくらですか。", reading: "えん", target: "円", post: "", wrong1: "月", wrong2: "口", en: "(Actually target is in prev sentence context implied, fixing structure: This book, how much?) -> Context fix: 'This book is 500 yen.'", 
              // Re-structuring for N5 fit
              pre: "この <ruby>本<rt>ほん</rt></ruby>は 500", reading: "えん", target: "円", post: "です。", wrong1: "口", wrong2: "目", en: "This book is 500 yen.", role: "A" },
            { pre: "<ruby>安<rt>やす</rt></ruby>いですね。それを", reading: "か", target: "買", post: "います。", wrong1: "貝", wrong2: "見", en: "That's cheap. I'll buy it.", role: "B", prev: "A: この 本は 500円です。" }
        ],
        [ // 5. Directions
            { pre: "すみません。<ruby>東京<rt>とうきょう</rt></ruby>", reading: "えき", target: "駅", post: "は どこですか。", wrong1: "訳", wrong2: "馬", en: "Excuse me. Where is Tokyo Station?", role: "A" },
            { pre: "あちらです。この", reading: "みち", target: "道", post: "を まっすぐです。", wrong1: "通", wrong2: "週", en: "It's over there. Go straight on this road.", role: "B", prev: "A: すみません。東京駅は どこですか。" }
        ],
        [ // 6. Sickness
            { pre: "お<ruby>腹<rt>なか</rt></ruby>が <ruby>痛<rt>いた</rt></ruby>いです。<ruby>元気<rt>げんき</rt></ruby>が", reading: "な", target: "無", post: "いです。(※N5外ですが)", // Adjusting to N5 target
              pre: "どうしましたか。<ruby>元気<rt>げんき</rt></ruby>が", reading: "な", target: "無", post: "いですね。(No good target)",
              // Retry
              pre: "<ruby>顔色<rt>かおいろ</rt></ruby>が <ruby>悪<rt>わる</rt></ruby>いですね。", reading: "だい", target: "大", post: "<ruby>丈<rt>じょう</rt></ruby><ruby>夫<rt>ぶ</rt></ruby>ですか。", wrong1: "太", wrong2: "犬", en: "You look pale. Are you okay?", role: "A" },
            { pre: "いいえ。<ruby>今日<rt>きょう</rt></ruby>は", reading: "やす", target: "休", post: "みます。", wrong1: "体", wrong2: "来", en: "No. I will rest today.", role: "B", prev: "A: 顔色が 悪いですね。大丈夫ですか。" }
        ],
        [ // 7. Phone/Contact
            { pre: "<ruby>電話<rt>でんわ</rt></ruby>で", reading: "はな", target: "話", post: "しませんか。", wrong1: "語", wrong2: "読", en: "Shall we talk on the phone?", role: "A" },
            { pre: "いいですね。<ruby>後<rt>あと</rt></ruby>で", reading: "でん", target: "電", post: "<ruby>話<rt>わ</rt></ruby>します。", wrong1: "雷", wrong2: "雪", en: "Sounds good. I'll call you later.", role: "B", prev: "A: 電話で 話しませんか。" }
        ],
        [ // 8. Weekend
            { pre: "<ruby>来<rt>らい</rt></ruby>", reading: "しゅう", target: "週", post: "、<ruby>暇<rt>ひま</rt></ruby>ですか。", wrong1: "周", wrong2: "道", en: "Are you free next week?", role: "A" },
            { pre: "はい。<ruby>一緒<rt>いっしょ</rt></ruby>に", reading: "あ", target: "会", post: "いましょう。", wrong1: "合", wrong2: "今", en: "Yes. Let's meet.", role: "B", prev: "A: 来週、暇ですか。" }
        ],
        [ // 9. Hobby
            { pre: "いつも どんな", reading: "おん", target: "音", post: "<ruby>楽<rt>がく</rt></ruby>を <ruby>聞<rt>き</rt></ruby>きますか。", wrong1: "白", wrong2: "日", en: "What music do you usually listen to?", role: "A" },
            { pre: "ラジオを よく", reading: "き", target: "聞", post: "きます。", wrong1: "間", wrong2: "耳", en: "I often listen to the radio.", role: "B", prev: "A: いつも どんな 音楽を 聞きますか。" }
        ],
        [ // 10. Travel
            { pre: "<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>に", reading: "くるま", target: "車", post: "で <ruby>出<rt>で</rt></ruby>かけました。", wrong1: "東", wrong2: "庫", en: "I went out by car on my day off.", role: "A" },
            { pre: "いいですね。きれいな", reading: "やま", target: "山", post: "を <ruby>見<rt>み</rt></ruby>ましたか。", wrong1: "出", wrong2: "川", en: "Nice. Did you see beautiful mountains?", role: "B", prev: "A: 休みの日に 車で 出かけました。" }
        ]
    ];

    // Lv3: A-B-C会話セット (グループ化) - 6セット作成
    const level3Groups = [
        [ // 1. Restaurant
            { pre: "<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>は", reading: "なに", target: "何", post: "を <ruby>食<rt>た</rt></ruby>べますか。", wrong1: "伺", wrong2: "同", en: "What will you eat for lunch?", role: "A" },
            { pre: "私は", reading: "さかな", target: "魚", post: "を <ruby>食<rt>た</rt></ruby>べます。", wrong1: "角", wrong2: "牛", en: "I will eat fish.", role: "B", prev: "A: 昼ご飯は 何を 食べますか。" },
            { pre: "私は", reading: "みず", target: "水", post: "と パンを ください。", wrong1: "氷", wrong2: "木", en: "Water and bread for me, please.", role: "C", prev: "A: 昼ご飯は 何を 食べますか。<br>B: 私は 魚を 食べます。" }
        ],
        [ // 2. Trip
            { pre: "<ruby>先週<rt>せんしゅう</rt></ruby>、<ruby>京都<rt>きょうと</rt></ruby>へ", reading: "い", target: "行", post: "きました。", wrong1: "休", wrong2: "来", en: "I went to Kyoto last week.", role: "A" },
            { pre: "いいですね。そこで", reading: "なに", target: "何", post: "を しましたか。", wrong1: "伺", wrong2: "可", en: "Nice. What did you do there?", role: "B", prev: "A: 先週、京都へ 行きました。" },
            { pre: "<ruby>古<rt>ふる</rt></ruby>い お<ruby>寺<rt>てら</rt></ruby>を", reading: "み", target: "見", post: "ました。", wrong1: "貝", wrong2: "目", en: "We saw old temples.", role: "C", prev: "A: 先週、京都へ 行きました。<br>B: いいですね。そこで 何を しましたか。" }
        ],
        [ // 3. School
            { pre: "<ruby>日本語<rt>にほんご</rt></ruby>の 勉<ruby>強<rt>きょう</rt></ruby>は どうですか。", reading: "ご", target: "語", post: "", wrong1: "話", wrong2: "読", // context fix
              pre: "日本", reading: "ご", target: "語", post: "の 勉<ruby>強<rt>きょう</rt></ruby>は どうですか。", wrong1: "話", wrong2: "読", en: "How is your Japanese study?", role: "A" },
            { pre: "<ruby>難<rt>むずか</rt></ruby>しいです。<ruby>本<rt>ほん</rt></ruby>を たくさん", reading: "よ", target: "読", post: "みます。", wrong1: "語", wrong2: "言", en: "It's difficult. I read many books.", role: "B", prev: "A: 日本語の 勉強は どうですか。" },
            { pre: "私は <ruby>先生<rt>せんせい</rt></ruby>と たくさん", reading: "はな", target: "話", post: "します。", wrong1: "語", wrong2: "計", en: "I talk a lot with the teacher.", role: "C", prev: "A: 日本語の 勉強は どうですか。<br>B: 難しいです。本を たくさん 読みます。" }
        ],
        [ // 4. Family
            { pre: "ご<ruby>家族<rt>かぞく</rt></ruby>は", reading: "なん", target: "何", post: "<ruby>人<rt>にん</rt></ruby>ですか。", wrong1: "伺", wrong2: "可", en: "How many people are in your family?", role: "A" },
            { pre: "4<ruby>人<rt>にん</rt></ruby>です。<ruby>父<rt>ちち</rt></ruby>と", reading: "はは", target: "母", post: "が います。", wrong1: "毎", wrong2: "海", en: "Four. I have a father and mother.", role: "B", prev: "A: ご家族は 何人ですか。" },
            { pre: "私は 5<ruby>人<rt>にん</rt></ruby>です。<ruby>兄<rt>あに</rt></ruby>が", reading: "ふた", target: "二", post: "<ruby>人<rt>り</rt></ruby> います。", wrong1: "三", wrong2: "一", en: "I have five. I have two older brothers.", role: "C", prev: "A: ご家族は 何人ですか。<br>B: 4人です。父と 母が います。" }
        ],
        [ // 5. Weekend/Electric store
            { pre: "<ruby>週末<rt>しゅうまつ</rt></ruby>、", reading: "とも", target: "友", post: "だちと <ruby>会<rt>あ</rt></ruby>いました。", wrong1: "父", wrong2: "有", en: "I met a friend on the weekend.", role: "A" },
            { pre: "どこへ <ruby>行<rt>い</rt></ruby>きましたか。", reading: "でん", target: "電", post: "<ruby>車<rt>しゃ</rt></ruby>で <ruby>行<rt>い</rt></ruby>きましたか。", wrong1: "雷", wrong2: "雲", en: "Where did you go? Did you go by train?", role: "B", prev: "A: 週末、友だちと 会いました。" },
            { pre: "はい。<ruby>大<rt>おお</rt></ruby>きい", reading: "みせ", target: "店", post: "へ <ruby>行<rt>い</rt></ruby>きました。", wrong1: "庫", wrong2: "床", en: "Yes. We went to a big shop.", role: "C", prev: "A: 週末、友だちと 会いました。<br>B: どこへ 行きましたか。電車で 行きましたか。" }
        ],
        [ // 6. Birthday/Party
            { pre: "<ruby>来週<rt>らいしゅう</rt></ruby>は <ruby>私<rt>わたし</rt></ruby>の", reading: "たん", target: "誕", post: "<ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby>です。(※N5外)", // Keeping simple
              pre: "<ruby>来週<rt>らいしゅう</rt></ruby>は <ruby>私<rt>わたし</rt></ruby>の", reading: "う", target: "生", post: "まれた<ruby>日<rt>ひ</rt></ruby>です。", wrong1: "年", wrong2: "先", en: "Next week is my birthday.", role: "A" },
            { pre: "おめでとう。<ruby>何<rt>なに</rt></ruby>か", reading: "の", target: "飲", post: "みませんか。", wrong1: "食", wrong2: "飯", en: "Congratulations. Shall we drink something?", role: "B", prev: "A: 来週は 私の 生まれた日です。" },
            { pre: "ありがとう。<ruby>日曜日<rt>にちようび</rt></ruby>の", reading: "ご", target: "午", post: "<ruby>後<rt>ご</rt></ruby>は どうですか。", wrong1: "牛", wrong2: "千", en: "Thanks. How about Sunday afternoon?", role: "C", prev: "A: 来週は 私の 生まれた日です。<br>B: おめでとう。何か 飲みませんか。" }
        ]
    ];

    // --- ロジック変数 ---
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let totalQuestions = 0;

    // --- 画面切り替え ---
    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        const footer = document.getElementById('footer-bar');
        if(id === 'view-list') footer.style.display = 'flex';
        else footer.style.display = 'none';
        
        window.scrollTo(0, 0);
    }

    // --- 1. 文章一覧生成 ---
    function initList() {
        const container = document.getElementById('study-list-container');
        container.textContent = '';
        
        // リスト用に全データをフラットにする（グループも分解）
        let allData = [...level1Data];
        level2Groups.forEach(grp => allData.push(...grp));
        level3Groups.forEach(grp => allData.push(...grp));
        
        allData.forEach((q, idx) => {
            const div = document.createElement('div');
            div.className = 'list-item';
            
            const fullHtml = `${q.pre}<span style="color:var(--primary);">${q.target}</span>${q.post}`;
            
            div.textContent = `
                <button class="play-icon-btn" onclick="playSentence(${idx})"><i class="fa-solid fa-volume-high"></i></button>
                <div class="item-text">
                    ${fullHtml}
                    <span class="item-en">${q.en}</span>
                </div>
            `;
            container.appendChild(div);
            q._tempId = idx; // 再生用にID保持
        });
        
        showScreen('view-list');
    }

    // 一覧画面での再生
    window.playSentence = function(idx) {
        let allData = [...level1Data];
        level2Groups.forEach(grp => allData.push(...grp));
        level3Groups.forEach(grp => allData.push(...grp));

        const q = allData[idx];
        const rawHtml = (q.pre + q.target + q.post);
        speak(rawHtml);
    };

    window.showList = function() { showScreen('view-list'); };
    window.showLevelSelect = function() { showScreen('view-level'); };

    // --- 3. ゲーム開始 ---
    window.startGame = function(level) {
        currentQuestions = [];
        
        if (level === 1) {
            // Level 1: 単独シャッフル
            let source = [...level1Data];
            source.sort(() => 0.5 - Math.random());
            currentQuestions = source.slice(0, 10);
        } 
        else if (level === 2) {
            // Level 2: 会話グループ単位でシャッフルしてから展開
            // 10グループあるので、5グループ(10問)を出題する
            let groups = [...level2Groups];
            groups.sort(() => 0.5 - Math.random());
            const selectedGroups = groups.slice(0, 5); // 5セット選択
            
            selectedGroups.forEach(grp => {
                currentQuestions.push(...grp);
            });
        } 
        else if (level === 3) {
            // Level 3: 会話グループ単位でシャッフル
            // 6グループあるので、3グループ(9問)を出題する
            let groups = [...level3Groups];
            groups.sort(() => 0.5 - Math.random());
            const selectedGroups = groups.slice(0, 3); // 3セット選択
            
            selectedGroups.forEach(grp => {
                currentQuestions.push(...grp);
            });
        }
        
        totalQuestions = currentQuestions.length;
        currentIndex = 0;
        score = 0;
        showScreen('view-game');
        updateUI();
        showQuestion();
    };

    window.quitGame = function() {
        showLevelSelect();
    };

    function updateUI() {
        document.getElementById('q-num').textContent = currentIndex + 1;
        const pointPerQ = Math.floor(100 / totalQuestions);
        document.getElementById('score').textContent = score * pointPerQ;
        
        const pct = ((currentIndex) / totalQuestions) * 100;
        document.getElementById('prog-bar').style.width = `${pct}%`;
    }

    function showQuestion() {
        updateUI();
        const q = currentQuestions[currentIndex];
        
        const sentenceDisplay = document.getElementById('sentence-display');
        const englishDisplay = document.getElementById('english-display');
        const choicesContainer = document.getElementById('choices-container');
        
        // コンテキスト（前の文）がある場合は表示
        let htmlContent = "";
        if (q.prev) {
            htmlContent += `<div class="context-line">${q.prev}</div>`;
        }
        
        // 現在の問題文
        htmlContent += `<div class="current-line">${q.pre}<span id="blank-spot" class="blank-part">(${q.reading})</span>${q.post}</div>`;
        
        sentenceDisplay.textContent = htmlContent;
        englishDisplay.textContent = q.en;

        const choices = [q.target, q.wrong1, q.wrong2];
        choices.sort(() => 0.5 - Math.random());

        choicesContainer.textContent = '';
        choices.forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = char;
            btn.onclick = () => checkAnswer(btn, char, q);
            choicesContainer.appendChild(btn);
        });
    }

    function checkAnswer(btn, selected, q) {
        const allBtns = document.querySelectorAll('.choice-btn');
        allBtns.forEach(b => b.disabled = true);
        const feedback = document.getElementById('feedback');

        const isCorrect = (selected === q.target);
        
        if (isCorrect) {
            score++;
            btn.classList.add('correct');
            feedback.textContent = '⭕';
            feedback.style.color = '#4caf50';
            
            if(window.addPoints) window.addPoints(1); // ポイント加算

            const blank = document.getElementById('blank-spot');
            blank.textContent = q.target;
            blank.classList.add('solved');
        } else {
            btn.classList.add('wrong');
            feedback.textContent = '❌';
            feedback.style.color = '#f44336';
            allBtns.forEach(b => { if(b.textContent === q.target) b.classList.add('correct'); });
            
            const blank = document.getElementById('blank-spot');
            blank.textContent = q.target; 
            blank.style.color = '#f44336';
        }

        feedback.style.animation = 'none';
        feedback.offsetHeight; 
        feedback.style.animation = 'popMark 0.6s ease';

        // 読み上げ -> 次へ
        const fullSentenceHtml = q.pre + q.target + q.post;
        
        setTimeout(() => {
            speak(fullSentenceHtml, () => {
                setTimeout(() => {
                    currentIndex++;
                    if (currentIndex < totalQuestions) {
                        showQuestion();
                    } else {
                        endGame();
                    }
                }, 500);
            });
        }, 500);
    }

    function endGame() {
        showScreen('view-result');
        // 簡易スコア計算
        const pointPerQ = Math.floor(100 / totalQuestions);
        const finalScore = score * pointPerQ;
        const displayScore = (score === totalQuestions) ? 100 : finalScore;
        
        document.getElementById('final-score').textContent = displayScore;
        
        const comment = document.getElementById('result-comment');
        if(displayScore === 100) comment.textContent = "すばらしい！かんぺきです！🎉";
        else if(displayScore >= 80) comment.textContent = "すごい！そのちょうしです！✨";
        else comment.textContent = "またチャレンジしてね。💪";
    }

    // 初期化
    window.onload = initList;