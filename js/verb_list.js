// --- マスター動詞データ (全ての活用形を持つ) ---
    // Grp1: 五段, Grp2: 一段, Grp3: 変格
    // subGroup: 'e' (e-masu), 'i' (i-masu exception), 's' (shimasu), 'k' (kimasu)

    const masterVerbs = [
        // --- Group I (u-verbs) ---
        { grp: 1, en: "Write", icon: "fa-solid fa-pen", 
          masu: "かきます", mashita: "かきました", te: "かいて", jisho: "かく", nai: "かかない", ta: "かいた" },
        { grp: 1, en: "Listen", icon: "fa-solid fa-headphones", 
          masu: "ききます", mashita: "ききました", te: "きいて", jisho: "きく", nai: "きかない", ta: "きいた" },
        { grp: 1, en: "Go", icon: "fa-solid fa-person-walking-arrow-right", 
          masu: "いきます", mashita: "いきました", te: "いって", jisho: "いく", nai: "いかない", ta: "いった" },
        { grp: 1, en: "Swim", icon: "fa-solid fa-person-swimming", 
          masu: "およぎます", mashita: "およぎました", te: "およいで", jisho: "およぐ", nai: "およがない", ta: "およいだ" },
        { grp: 1, en: "Drink", icon: "fa-solid fa-glass-water", 
          masu: "のみます", mashita: "のみました", te: "のんで", jisho: "のむ", nai: "のまない", ta: "のんだ" },
        { grp: 1, en: "Read", icon: "fa-solid fa-book-open", 
          masu: "よみます", mashita: "よみました", te: "よんで", jisho: "よむ", nai: "よまない", ta: "よんだ" },
        { grp: 1, en: "Rest", icon: "fa-solid fa-bed", 
          masu: "やすみます", mashita: "やすみました", te: "やすんで", jisho: "やすむ", nai: "やすまない", ta: "やすんだ" },
        { grp: 1, en: "Play", icon: "fa-solid fa-gamepad", 
          masu: "あそびます", mashita: "あそびました", te: "あそんで", jisho: "あそぶ", nai: "あそばない", ta: "あそんだ" },
        { grp: 1, en: "Buy", icon: "fa-solid fa-cart-shopping", 
          masu: "かいます", mashita: "かいました", te: "かって", jisho: "かう", nai: "かわない", ta: "かった" },
        { grp: 1, en: "Meet", icon: "fa-solid fa-handshake", 
          masu: "あいます", mashita: "あいました", te: "あって", jisho: "あう", nai: "あわない", ta: "あった" },
        { grp: 1, en: "Wait", icon: "fa-solid fa-clock", 
          masu: "まちます", mashita: "まちました", te: "まって", jisho: "まつ", nai: "またない", ta: "まった" },
        { grp: 1, en: "Hold", icon: "fa-solid fa-bag-shopping", 
          masu: "もちます", mashita: "もちました", te: "もって", jisho: "もつ", nai: "もたない", ta: "もった" },
        { grp: 1, en: "Take (photo)", icon: "fa-solid fa-camera", 
          masu: "とります", mashita: "とりました", te: "とって", jisho: "とる", nai: "とらない", ta: "とった" },
        { grp: 1, en: "Return", icon: "fa-solid fa-house", 
          masu: "かえります", mashita: "かえりました", te: "かえって", jisho: "かえる", nai: "かえらない", ta: "かえった" },
        { grp: 1, en: "Understand", icon: "fa-regular fa-lightbulb", 
          masu: "わかります", mashita: "わかりました", te: "わかって", jisho: "わかる", nai: "わからない", ta: "わかった" },
        { grp: 1, en: "Talk", icon: "fa-solid fa-comments", 
          masu: "はなします", mashita: "はなしました", te: "はなして", jisho: "はなす", nai: "はなさない", ta: "はなした" },
        { grp: 1, en: "Sell", icon: "fa-solid fa-hand-holding-dollar", 
          masu: "うります", mashita: "うりました", te: "うって", jisho: "うる", nai: "うらない", ta: "うった" },
        { grp: 1, en: "Use", icon: "fa-solid fa-hand-pointer", 
          masu: "つかいます", mashita: "つかいました", te: "つかって", jisho: "つかう", nai: "つかわない", ta: "つかった" },
        { grp: 1, en: "Learn", icon: "fa-solid fa-book-reader", 
          masu: "ならいます", mashita: "ならいました", te: "ならって", jisho: "ならう", nai: "ならわない", ta: "ならった" },
        { grp: 1, en: "Stand", icon: "fa-solid fa-person", 
          masu: "たちます", mashita: "たちました", te: "たって", jisho: "たつ", nai: "たたない", ta: "たった" },
        { grp: 1, en: "Sit", icon: "fa-solid fa-chair", 
          masu: "すわります", mashita: "すわりました", te: "すわって", jisho: "すわる", nai: "すわらない", ta: "すわった" },
        { grp: 1, en: "Hurry", icon: "fa-solid fa-person-running", 
          masu: "いそぎます", mashita: "いそぎました", te: "いそいで", jisho: "いそぐ", nai: "いそがない", ta: "いそいだ" },
        { grp: 1, en: "Work", icon: "fa-solid fa-briefcase", 
          masu: "はたらきます", mashita: "はたらきました", te: "はたらいて", jisho: "はたらく", nai: "はたらかない", ta: "はたらいた" },
        { grp: 1, en: "Lend", icon: "fa-solid fa-hand-holding-heart", 
          masu: "かします", mashita: "かしました", te: "かして", jisho: "かす", nai: "かさない", ta: "かした" },
        { grp: 1, en: "Walk", icon: "fa-solid fa-person-walking", 
          masu: "あるきます", mashita: "あるきました", te: "あるいて", jisho: "あるく", nai: "あるかない", ta: "あるいた" },
        { grp: 1, en: "Ride", icon: "fa-solid fa-train-subway", 
          masu: "のります", mashita: "のりました", te: "のって", jisho: "のる", nai: "のらない", ta: "のった" },

        // --- Group II (ru-verbs) ---
        { grp: 2, sub: 'e', en: "Sleep", icon: "fa-solid fa-moon", 
          masu: "ねます", mashita: "ねました", te: "ねて", jisho: "ねる", nai: "ねない", ta: "ねた" },
        { grp: 2, sub: 'e', en: "Eat", icon: "fa-solid fa-utensils", 
          masu: "たべます", mashita: "たべました", te: "たべて", jisho: "たべる", nai: "たべない", ta: "たべた" },
        { grp: 2, sub: 'e', en: "Give", icon: "fa-solid fa-gift", 
          masu: "あげます", mashita: "あげました", te: "あげて", jisho: "あげる", nai: "あげない", ta: "あげた" },
        { grp: 2, sub: 'e', en: "Open", icon: "fa-solid fa-door-open", 
          masu: "あけます", mashita: "あけました", te: "あけて", jisho: "あける", nai: "あけない", ta: "あけた" },
        { grp: 2, sub: 'e', en: "Show", icon: "fa-solid fa-eye", 
          masu: "みせます", mashita: "みせました", te: "みせて", jisho: "みせる", nai: "みせない", ta: "みせた" },
        { grp: 2, sub: 'e', en: "Teach", icon: "fa-solid fa-chalkboard-user", 
          masu: "おしえます", mashita: "おしえました", te: "おしえて", jisho: "おしえる", nai: "おしえない", ta: "おしえた" },
        { grp: 2, sub: 'e', en: "Start", icon: "fa-solid fa-play", 
          masu: "はじめます", mashita: "はじめました", te: "はじめて", jisho: "はじめる", nai: "はじめない", ta: "はじめた" },
        { grp: 2, sub: 'e', en: "Close", icon: "fa-solid fa-door-closed", 
          masu: "しめます", mashita: "しめました", te: "しめて", jisho: "しめる", nai: "しめない", ta: "しめた" },
        { grp: 2, sub: 'e', en: "Turn on", icon: "fa-solid fa-power-off", 
          masu: "つけます", mashita: "つけました", te: "つけて", jisho: "つける", nai: "つけない", ta: "つけた" },
        { grp: 2, sub: 'e', en: "Forget", icon: "fa-solid fa-circle-question", 
          masu: "わすれます", mashita: "わすれました", te: "わすれて", jisho: "わすれる", nai: "わすれない", ta: "わすれた" },
        { grp: 2, sub: 'e', en: "Exit/Leave", icon: "fa-solid fa-arrow-right-from-bracket", 
          masu: "でます", mashita: "でました", te: "でて", jisho: "でる", nai: "でない", ta: "でた" },
        { grp: 2, sub: 'e', en: "Remember", icon: "fa-solid fa-brain", 
          masu: "おぼえます", mashita: "おぼえました", te: "おぼえて", jisho: "おぼえる", nai: "おぼえない", ta: "おぼえた" },
        { grp: 2, sub: 'e', en: "Stop", icon: "fa-solid fa-hand", 
          masu: "とめます", mashita: "とめました", te: "とめて", jisho: "とめる", nai: "とめない", ta: "とめた" },
        { grp: 2, sub: 'e', en: "Throw away", icon: "fa-solid fa-trash", 
          masu: "すてます", mashita: "すてました", te: "すてて", jisho: "すてる", nai: "すてない", ta: "すてた" },
        { grp: 2, sub: 'e', en: "Think", icon: "fa-solid fa-cloud", 
          masu: "かんがえます", mashita: "かんがえました", te: "かんがえて", jisho: "かんがえる", nai: "かんがえない", ta: "かんがえた" },

        // --- Group II (i-masu exceptions) ---
        { grp: 2, sub: 'i', en: "Watch/See", icon: "fa-solid fa-tv", 
          masu: "みます", mashita: "みました", te: "みて", jisho: "みる", nai: "みない", ta: "みた" },
        { grp: 2, sub: 'i', en: "Exist (Living)", icon: "fa-solid fa-person", 
          masu: "います", mashita: "いました", te: "いて", jisho: "いる", nai: "いない", ta: "いた" },
        { grp: 2, sub: 'i', en: "Wake up", icon: "fa-solid fa-sun", 
          masu: "おきます", mashita: "おきました", te: "おきて", jisho: "おきる", nai: "おきない", ta: "おきた" },
        { grp: 2, sub: 'i', en: "Borrow", icon: "fa-solid fa-hand-holding", 
          masu: "かります", mashita: "かりました", te: "かりて", jisho: "かりる", nai: "かりない", ta: "かりた" },
        { grp: 2, sub: 'i', en: "Shower", icon: "fa-solid fa-shower", 
          masu: "あびます", mashita: "あびました", te: "あびて", jisho: "あびる", nai: "あびない", ta: "あびた" },
        { grp: 2, sub: 'i', en: "Can do", icon: "fa-solid fa-thumbs-up", 
          masu: "できます", mashita: "できました", te: "できて", jisho: "できる", nai: "できない", ta: "できた" },
        { grp: 2, sub: 'i', en: "Get off", icon: "fa-solid fa-person-walking-luggage", 
          masu: "おります", mashita: "おりました", te: "おりて", jisho: "おりる", nai: "おりない", ta: "おりた" },
        { grp: 2, sub: 'i', en: "Wear", icon: "fa-solid fa-shirt", 
          masu: "きます", mashita: "きました", te: "きて", jisho: "きる", nai: "きない", ta: "きた" },

        // --- Group III (Irregular) ---
        { grp: 3, en: "Do", icon: "fa-solid fa-check", 
          masu: "します", mashita: "しました", te: "して", jisho: "する", nai: "しない", ta: "した" },
        { grp: 3, en: "Come", icon: "fa-solid fa-person-walking-arrow-right", 
          masu: "きます", mashita: "きました", te: "きて", jisho: "くる", nai: "こない", ta: "きた" },
        
        { grp: 3, en: "Study", icon: "fa-solid fa-graduation-cap", 
          masu: "べんきょう\nします", mashita: "べんきょう\nしました", te: "べんきょう\nして", jisho: "べんきょう\nする", nai: "べんきょう\nしない", ta: "べんきょう\nした" },
        { grp: 3, en: "Shop", icon: "fa-solid fa-basket-shopping", 
          masu: "かいもの\nします", mashita: "かいもの\nしました", te: "かいもの\nして", jisho: "かいもの\nする", nai: "かいもの\nしない", ta: "かいもの\nした" },
        { grp: 3, en: "Walk", icon: "fa-solid fa-tree", 
          masu: "さんぽ\nします", mashita: "さんぽ\nしました", te: "さんぽ\nして", jisho: "さんぽ\nする", nai: "さんぽ\nしない", ta: "さんぽ\nした" },
        { grp: 3, en: "Copy", icon: "fa-solid fa-copy", 
          masu: "コピー\nします", mashita: "コピー\nしました", te: "コピー\nして", jisho: "コピー\nする", nai: "コピー\nしない", ta: "コピー\nした" },
        { grp: 3, en: "Marry", icon: "fa-solid fa-ring", 
          masu: "けっこん\nします", mashita: "けっこん\nしました", te: "けっこん\nして", jisho: "けっこん\nする", nai: "けっこん\nしない", ta: "けっこん\nした" },
        { grp: 3, en: "Clean", icon: "fa-solid fa-broom", 
          masu: "そうじ\nします", mashita: "そうじ\nしました", te: "そうじ\nして", jisho: "そうじ\nする", nai: "そうじ\nしない", ta: "そうじ\nした" },
        { grp: 3, en: "Laundry", icon: "fa-solid fa-shirt", 
          masu: "せんたく\nします", mashita: "せんたく\nしました", te: "せんたく\nして", jisho: "せんたく\nする", nai: "せんたく\nしない", ta: "せんたく\nした" },
        { grp: 3, en: "Cook", icon: "fa-solid fa-kitchen-set", 
          masu: "りょうり\nします", mashita: "りょうり\nしました", te: "りょうり\nして", jisho: "りょうり\nする", nai: "りょうり\nしない", ta: "りょうり\nした" },
        { grp: 3, en: "Drive", icon: "fa-solid fa-car", 
          masu: "うんてん\nします", mashita: "うんてん\nしました", te: "うんてん\nして", jisho: "うんてん\nする", nai: "うんてん\nしない", ta: "うんてん\nした" },
        { grp: 3, en: "Call", icon: "fa-solid fa-phone", 
          masu: "でんわ\nします", mashita: "でんわ\nしました", te: "でんわ\nして", jisho: "でんわ\nする", nai: "でんわ\nしない", ta: "でんわ\nした" },
        { grp: 3, en: "Worry", icon: "fa-solid fa-face-frown", 
          masu: "しんぱい\nします", mashita: "しんぱい\nしました", te: "しんぱい\nして", jisho: "しんぱい\nする", nai: "しんぱい\nしない", ta: "しんぱい\nした" },
        { grp: 3, en: "Overtime", icon: "fa-solid fa-business-time", 
          masu: "ざんぎょう\nします", mashita: "ざんぎょう\nしました", te: "ざんぎょう\nして", jisho: "ざんぎょう\nする", nai: "ざんぎょう\nしない", ta: "ざんぎょう\nした" },
        { grp: 3, en: "Meal", icon: "fa-solid fa-bowl-rice", 
          masu: "しょくじ\nします", mashita: "しょくじ\nしました", te: "しょくじ\nして", jisho: "しょくじ\nする", nai: "しょくじ\nしない", ta: "しょくじ\nした" },
        { grp: 3, en: "Bring", icon: "fa-solid fa-box-open", 
          masu: "もって\nきます", mashita: "もって\nきました", te: "もって\nきて", jisho: "もって\nくる", nai: "もって\nこない", ta: "もって\nきた" },
        { grp: 3, en: "Bring (person)", icon: "fa-solid fa-people-arrows", 
          masu: "つれて\nきます", mashita: "つれて\nきました", te: "つれて\nきて", jisho: "つれて\nくる", nai: "つれて\nこない", ta: "つれて\nきた" }
    ];

    // 全ての動詞にIDと学習状態を付与
    masterVerbs.forEach((v, idx) => {
        v.id = idx;
        v.learned = false;
    });

    let currentForm = 'masu';
    const synth = window.speechSynthesis;

    function speak(text) {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text.replace('\n', ''));
        utterThis.lang = 'ja-JP';
        utterThis.rate = 0.9;
        const voices = synth.getVoices();
        const jpVoice = voices.find(v => v.lang === 'ja-JP');
        if(jpVoice) utterThis.voice = jpVoice;
        synth.speak(utterThis);
    }

    // --- 表示ロジック ---
    window.setForm = (form) => {
        currentForm = form;
        
        // タブのアクティブ化
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        // 押されたボタンをactiveに（eventから取得できない場合もあるのでループで処理）
        // 簡易的にHTMLのonclickで指定した関数引数とマッチするボタンを探す
        const buttons = document.querySelectorAll('.tab-btn');
        if(form === 'masu') buttons[0].classList.add('active');
        else if(form === 'mashita') buttons[1].classList.add('active');
        else if(form === 'te') buttons[2].classList.add('active');
        else if(form === 'jisho') buttons[3].classList.add('active');
        else if(form === 'nai') buttons[4].classList.add('active');
        else if(form === 'ta') buttons[5].classList.add('active');

        // コンテナの再描画 (アニメーション用クラス付与)
        const wrapper = document.getElementById('list-container');
        wrapper.classList.remove('groups-wrapper');
        void wrapper.offsetWidth; // trigger reflow
        wrapper.classList.add('groups-wrapper');

        renderAllGroups();
    };

    function renderAllGroups() {
        const grp1 = masterVerbs.filter(v => v.grp === 1);
        const grp2e = masterVerbs.filter(v => v.grp === 2 && v.sub === 'e');
        const grp2i = masterVerbs.filter(v => v.grp === 2 && v.sub === 'i');
        const grp3 = masterVerbs.filter(v => v.grp === 3);

        renderList('list-grp1', grp1);
        renderList('list-grp2-e', grp2e);
        renderList('list-grp2-i', grp2i);
        renderList('list-grp3', grp3);
    }

    function renderList(containerId, data) {
        const container = document.getElementById(containerId);
        container.textContent = '';
        
        data.forEach((item) => {
            const card = document.createElement('div');
            card.className = `verb-card ${item.learned ? 'learned' : ''}`;
            
            // 現在のフォームのテキストを取得
            const displayText = item[currentForm];

            card.innerHTML = `
                <div class="verb-info">
                    <div class="verb-icon"><i class="${item.icon}"></i></div>
                    <div class="verb-text-box">
                        <div class="verb-jp">${displayText.replace('\n', '<br>')}</div>
                        <div class="verb-en">${item.en}</div>
                    </div>
                </div>
                <div class="check-btn" data-id="${item.id}">
                    <i class="fa-solid fa-check"></i>
                </div>
            `;

            // クリックイベント
            card.onclick = (e) => {
                // チェックボタンが押された場合
                if (e.target.closest('.check-btn')) {
                    e.stopPropagation();
                    toggleLearned(item.id);
                    return;
                }
                // カード本体なら読み上げ
                speak(displayText);
            };
            container.appendChild(card);
        });
    }

    function toggleLearned(id) {
        const target = masterVerbs.find(v => v.id === id);
        if(target) {
            target.learned = !target.learned;
            renderAllGroups(); // 全再描画して状態を反映
        }
    }

    window.onload = () => {
        setForm('masu'); // 初期表示
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {};
        }
    };