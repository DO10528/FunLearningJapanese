// --- データセット ---
    // season: 1=Spring, 2=Summer, 3=Autumn, 4=Winter
    const eventsData = [
        { id: 1, name: "お正月", en: "New Year", month: 1, season: 4, icon: "🎍", item: "おせち (Osechi)", itemIcon:"🍱", action: "初詣に行く (Go to Shrine)", desc: "1年の始まりを祝います。" },
        { id: 2, name: "節分", en: "Setsubun", month: 2, season: 4, icon: "👹", item: "豆 (Beans)", itemIcon:"🥜", action: "豆を投げる (Throw Beans)", desc: "鬼は外！福は内！" },
        { id: 3, name: "バレンタイン", en: "Valentine's", month: 2, season: 4, icon: "🍫", item: "チョコ (Chocolate)", itemIcon:"💝", action: "チョコをあげる (Give Choco)", desc: "好きな人にチョコをあげます。" },
        { id: 4, name: "ひな祭り", en: "Girls' Day", month: 3, season: 1, icon: "🎎", item: "ひな人形 (Dolls)", itemIcon:"🎎", action: "人形を飾る (Display Dolls)", desc: "女の子の成長を祝います。" },
        { id: 5, name: "卒業式", en: "Graduation", month: 3, season: 1, icon: "🎓", item: "証書 (Diploma)", itemIcon:"📜", action: "泣く (Cry)", desc: "学校を卒業します。" },
        { id: 6, name: "お花見", en: "Cherry Blossom", month: 4, season: 1, icon: "🌸", item: "団子 (Dango)", itemIcon:"🍡", action: "桜を見る (See Sakura)", desc: "桜の下でパーティーをします。" },
        { id: 7, name: "入学式", en: "Entrance Ceremony", month: 4, season: 1, icon: "🏫", item: "ランドセル (Bag)", itemIcon:"🎒", action: "写真を撮る (Take Photo)", desc: "新しい学校が始まります。" },
        { id: 8, name: "こどもの日", en: "Children's Day", month: 5, season: 1, icon: "🎏", item: "こいのぼり (Carp)", itemIcon:"🎏", action: "柏餅を食べる (Eat Mochi)", desc: "子供の成長を祝います。" },
        { id: 9, name: "梅雨", en: "Rainy Season", month: 6, season: 2, icon: "☔", item: "あじさい (Hydrangea)", itemIcon:"🐌", action: "傘をさす (Use Umbrella)", desc: "雨がたくさん降ります。" },
        { id: 10, name: "七夕", en: "Star Festival", month: 7, season: 2, icon: "🎋", item: "短冊 (Paper Strip)", itemIcon:"🔖", action: "願いを書く (Write Wish)", desc: "星に願いをかけます。" },
        { id: 11, name: "花火大会", en: "Fireworks", month: 8, season: 2, icon: "🎆", item: "浴衣 (Yukata)", itemIcon:"👘", action: "花火を見る (Watch Fireworks)", desc: "夏祭りに行きます。" },
        { id: 12, name: "お盆", en: "Obon", month: 8, season: 2, icon: "🏮", item: "盆踊り (Dance)", itemIcon:"💃", action: "踊る (Dance)", desc: "先祖が帰ってきます。" },
        { id: 13, name: "お月見", en: "Moon Viewing", month: 9, season: 3, icon: "🎑", item: "月見団子 (Dango)", itemIcon:"🌕", action: "月を見る (View Moon)", desc: "秋の月はきれいです。" },
        { id: 14, name: "運動会", en: "Sports Day", month: 10, season: 3, icon: "🏃", item: "お弁当 (Bento)", itemIcon:"🍙", action: "走る (Run)", desc: "学校のみんなで運動します。" },
        { id: 15, name: "ハロウィン", en: "Halloween", month: 10, season: 3, icon: "🎃", item: "カボチャ (Pumpkin)", itemIcon:"🍬", action: "仮装する (Cosplay)", desc: "お化けの格好をします。" },
        { id: 16, name: "七五三", en: "7-5-3", month: 11, season: 3, icon: "⛩️", item: "千歳飴 (Candy)", itemIcon:"🍭", action: "神社に行く (Go to Shrine)", desc: "3歳、5歳、7歳を祝います。" },
        { id: 17, name: "紅葉", en: "Autumn Leaves", month: 11, season: 3, icon: "🍁", item: "もみじ (Maple)", itemIcon:"🍂", action: "山に行く (Go Mountain)", desc: "山が赤や黄色になります。" },
        { id: 18, name: "クリスマス", en: "Christmas", month: 12, season: 4, icon: "🎄", item: "ケーキ (Cake)", itemIcon:"🎂", action: "チキンを食べる (Eat Chicken)", desc: "サンタさんが来ます。" },
        { id: 19, name: "大晦日", en: "New Year's Eve", month: 12, season: 4, icon: "🔔", item: "そば (Soba)", itemIcon:"🍜", action: "そばを食べる (Eat Soba)", desc: "1年最後の日です。" },
        { id: 20, name: "雪祭り", en: "Snow Festival", month: 2, season: 4, icon: "⛄", item: "雪だるま (Snowman)", itemIcon:"❄️", action: "雪で遊ぶ (Play Snow)", desc: "北海道の祭りが有名です。" }
    ];

    // --- 状態変数 ---
    let currentLevel = 1;
    let quizList = [];
    let currentQIndex = 0;
    let score = 0;

    // --- 画面遷移 ---
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        const footer = document.getElementById('footer-start');
        footer.style.display = (id === 'screen-list') ? 'block' : 'none';
        window.scrollTo(0,0);
        
        // 背景色リセット
        document.body.style.backgroundColor = "var(--bg-color)";
    };

    window.goBack = () => {
        const activeId = document.querySelector('.screen.active').id;
        if (activeId === 'screen-level') showScreen('screen-list');
        else if (activeId === 'screen-game') {
            if(confirm("ゲームをやめますか？")) showScreen('screen-level');
        }
        else if (activeId === 'screen-result') showScreen('screen-level');
        else window.location.href = 'index.html';
    };

    // --- 図鑑生成 ---
    function initList() {
        const container = document.getElementById('calendar-container');
        // 月順にソート
        const sorted = [...eventsData].sort((a,b) => {
            if(a.month !== b.month) return a.month - b.month;
            return a.id - b.id;
        });

        sorted.forEach(ev => {
            const card = document.createElement('div');
            card.className = 'event-card';
            
            // 季節クラス付与
            if(ev.season === 1) card.classList.add('season-spring');
            else if(ev.season === 2) card.classList.add('season-summer');
            else if(ev.season === 3) card.classList.add('season-autumn');
            else card.classList.add('season-winter');

            card.textContent = `
                <div class="event-month">${ev.month}月</div>
                <span class="event-emoji">${ev.icon}</span>
                <div class="event-name">${ev.name}</div>
                <div class="event-en">${ev.en}</div>
                <div class="event-desc">${ev.desc}</div>
            `;
            container.appendChild(card);
        });
    }

    // --- ゲームロジック ---
    window.startGame = (level) => {
        currentLevel = level;
        document.getElementById('game-lvl').textContent = level;
        
        // 問題リスト生成（10問ランダム）
        // Lv4以外は全データから、Lv4は仕分けなので全データ使える
        let source = [...eventsData];
        quizList = [];
        for(let i=0; i<10; i++) {
            const rand = Math.floor(Math.random() * source.length);
            quizList.push(source[rand]);
        }
        
        currentQIndex = 0;
        score = 0;
        showScreen('screen-game');
        nextQuestion();
    };

    function nextQuestion() {
        if(currentQIndex >= 10) {
            endGame();
            return;
        }

        const q = quizList[currentQIndex];
        document.getElementById('q-current').textContent = currentQIndex + 1;
        
        // 季節による背景変更
        updateBackground(q.season);

        // 問題表示
        const imgEl = document.getElementById('q-image');
        const txtEl = document.getElementById('q-text');
        const subEl = document.getElementById('q-sub');
        const btnContainer = document.getElementById('choice-container');
        btnContainer.textContent = '';

        if (currentLevel === 4) {
            // Lv4: 季節仕分け (画像を見て季節を当てる)
            // この場合、表示はItemかEventIconのどちらかをランダムに
            const useItem = Math.random() < 0.5;
            imgEl.textContent = useItem ? q.itemIcon : q.icon;
            txtEl.textContent = useItem ? q.item.split(' ')[0] : q.name;
            subEl.textContent = useItem ? "このアイテムの季節は？" : "この行事の季節は？";

            // 固定4択ボタン
            const seasons = [
                { id: 1, name: "春 (Spring)", cls: "sp" },
                { id: 2, name: "夏 (Summer)", cls: "su" },
                { id: 3, name: "秋 (Autumn)", cls: "au" },
                { id: 4, name: "冬 (Winter)", cls: "wi" }
            ];
            seasons.forEach(s => {
                const btn = document.createElement('button');
                btn.className = `btn-choice season-btn ${s.cls}`;
                btn.textContent = s.name;
                btn.onclick = () => checkAnswer(s.id === q.season);
                btnContainer.appendChild(btn);
            });

        } else {
            // Lv1~3: クイズ形式
            imgEl.textContent = q.icon;
            txtEl.textContent = q.name;
            subEl.textContent = q.en;

            // 正解と誤答の生成
            let correctAnswer, correctText;
            if(currentLevel === 1) { // いつ？
                correctAnswer = q.month;
                correctText = q.month + "月";
            } else if(currentLevel === 2) { // アイテム
                correctAnswer = q.item;
                correctText = `${q.itemIcon} ${q.item}`;
            } else { // アクション
                correctAnswer = q.action;
                correctText = q.action;
            }

            // 誤答候補を作成
            let wrongOptions = [];
            while(wrongOptions.length < 3) {
                const rand = eventsData[Math.floor(Math.random() * eventsData.length)];
                let wrongVal, wrongTxt;
                
                if(currentLevel === 1) {
                    if(rand.month === q.month) continue; // 同じ月は除外
                    wrongVal = rand.month;
                    wrongTxt = rand.month + "月";
                } else if(currentLevel === 2) {
                    if(rand.id === q.id) continue;
                    wrongVal = rand.item;
                    wrongTxt = `${rand.itemIcon} ${rand.item}`;
                } else {
                    if(rand.id === q.id) continue;
                    wrongVal = rand.action;
                    wrongTxt = rand.action;
                }
                
                // 重複チェック
                if(!wrongOptions.some(w => w.val === wrongVal)) {
                    wrongOptions.push({ val: wrongVal, txt: wrongTxt });
                }
            }

            // 選択肢をマージしてシャッフル
            let options = [{ val: correctAnswer, txt: correctText, isCorrect: true }];
            wrongOptions.forEach(w => options.push({ val: w.val, txt: w.txt, isCorrect: false }));
            options.sort(() => 0.5 - Math.random());

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'btn-choice full-width'; // Lv1-3は選択肢の文字数が多いので横長に
                btn.textContent = opt.txt;
                btn.onclick = () => checkAnswer(opt.isCorrect);
                btnContainer.appendChild(btn);
            });
        }
    }

    function updateBackground(season) {
        let color = "";
        if(season === 1) color = "var(--spring)";
        else if(season === 2) color = "var(--summer)";
        else if(season === 3) color = "var(--autumn)";
        else color = "var(--winter)";
        document.body.style.backgroundColor = color;
    }

    function checkAnswer(isCorrect) {
        const fb = document.getElementById('feedback');
        fb.textContent = isCorrect ? '⭕' : '❌';
        fb.style.color = isCorrect ? '#4caf50' : '#f44336';
        fb.style.animation = 'none';
        fb.offsetHeight; 
        fb.style.animation = 'popFeedback 0.6s ease';

        if(isCorrect) score++;

        // ボタンロック
        const btns = document.querySelectorAll('.btn-choice');
        btns.forEach(b => b.disabled = true);

        setTimeout(() => {
            currentQIndex++;
            nextQuestion();
        }, 1000);
    }

    function endGame() {
        document.body.style.backgroundColor = "var(--bg-color)";
        showScreen('screen-result');
        document.getElementById('final-score').textContent = score;
        
        const msg = document.getElementById('result-msg');
        if(score === 10) msg.textContent = "完璧！日本通ですね！🎌";
        else if(score >= 8) msg.textContent = "すごい！日本の文化をよく知っています。✨";
        else if(score >= 5) msg.textContent = "Good! もう少しでマスターです。👍";
        else msg.textContent = "図鑑を見て復習しましょう！📖";
    }

    // 初期化
    initList();