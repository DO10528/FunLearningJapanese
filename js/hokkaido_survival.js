// --- データ ---
// 画像検索用のURL生成関数
const gImg = (query) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

const learningData = [
    {
        title: "防寒具・アイテム (Winter Gear)", icon: "fa-mitten", class: "",
        phrases: [
            { text: "カイロ", en: "Heat pack", speech: "かいろ", faIcon: "fa-fire", link: gImg("日本のカイロ") },
            { text: "ダウンジャケット", en: "Down jacket", speech: "だうんじゃけっと", faIcon: "fa-vest", link: gImg("ダウンジャケット 冬") },
            { text: "スノーブーツ", en: "Snow boots", speech: "すのーぶーつ", faIcon: "fa-shoe-prints", link: gImg("スノーブーツ") },
            { text: "スキーウェア", en: "Ski wear", speech: "すきーうぇあ", faIcon: "fa-person-skiing", link: gImg("スキーウェア") },
            { text: "ゴーグル", en: "Goggles", speech: "ごーぐる", faIcon: "fa-glasses", link: gImg("スノーゴーグル") },
            { text: "ニット帽", en: "Knit cap / Beanie", speech: "にっとぼう", faIcon: "fa-hat-wizard", link: gImg("ニット帽 冬") },
            { text: "ネックウォーマー", en: "Neck warmer", speech: "ねっくうぉーまー", faIcon: "fa-scarf", link: gImg("ネックウォーマー") },
            { text: "スノーボード", en: "Snowboard", speech: "すのーぼーど", faIcon: "fa-person-snowboarding", link: gImg("スノーボード") },
            { text: "そり", en: "Sled", speech: "そり", faIcon: "fa-sleigh", link: gImg("雪遊び そり") }
        ]
    },
    {
        title: "観光地・体験 (Sightseeing)", icon: "fa-camera", class: "",
        phrases: [
            { text: "札幌雪まつり", en: "Sapporo Snow Festival", speech: "さっぽろゆきまつり", faIcon: "fa-snowman", link: "https://www.snowfes.com/" },
            { text: "小樽運河", en: "Otaru Canal (Illumination)", speech: "おたるうんが", faIcon: "fa-water", link: "https://otaru.gr.jp/" },
            { text: "旭山動物園", en: "Asahiyama Zoo (Penguins)", speech: "あさひやまどうぶつえん", faIcon: "fa-hippo", link: "https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/" },
            { text: "ニセコ", en: "Niseko (Powder snow & Ski)", speech: "にせこ", faIcon: "fa-mountain", link: "https://www.niseko-ta.jp/" },
            { text: "函館山", en: "Mt. Hakodate (Night view)", speech: "はこだてやま", faIcon: "fa-city", link: "https://334.co.jp/" },
            { text: "網走（流氷）", en: "Abashiri (Drift ice)", speech: "あばしり りゅうひょう", faIcon: "fa-ship", link: "https://www.ms-aurora.com/abashiri/" }
        ]
    },
    {
        title: "海鮮グルメ (Seafood)", icon: "fa-fish", class: "accent-cat",
        phrases: [
            { text: "ズワイガニ", en: "Snow crab", speech: "ずわいがに", faIcon: "fa-crab", link: gImg("ズワイガニ 料理") },
            { text: "タラバガニ", en: "King crab", speech: "たらばがに", faIcon: "fa-crab", link: gImg("タラバガニ 料理") },
            { text: "毛ガニ", en: "Hairy crab", speech: "けがに", faIcon: "fa-crab", link: gImg("毛ガニ 料理") },
            { text: "いくら", en: "Salmon roe", speech: "いくら", faIcon: "fa-bowl-rice", link: gImg("いくら丼") },
            { text: "帆立（ほたて）", en: "Scallop", speech: "ほたて", faIcon: "fa-water", link: gImg("ホタテ焼き 北海道") },
            { text: "牡蠣（かき）", en: "Oyster", speech: "かき", faIcon: "fa-disease", link: gImg("厚岸 牡蠣") }
        ]
    },
    {
        title: "名物グルメ (Local Food)", icon: "fa-utensils", class: "accent-cat",
        phrases: [
            { text: "ジンギスカン", en: "Jingisukan (Grilled mutton)", speech: "じんぎすかん", faIcon: "fa-fire-burner", link: gImg("ジンギスカン 北海道") },
            { text: "スープカレー", en: "Soup curry", speech: "すーぷかれー", faIcon: "fa-bowl-food", link: gImg("北海道 スープカレー") },
            { text: "札幌味噌ラーメン", en: "Sapporo Miso ramen", speech: "さっぽろみそらーめん", faIcon: "fa-bowl-rice", link: gImg("札幌 味噌ラーメン") },
            { text: "ザンギ", en: "Zangi (Hokkaido fried chicken)", speech: "ざんぎ", faIcon: "fa-drumstick-bite", link: gImg("北海道 ザンギ") },
            { text: "バターコーンラーメン", en: "Butter corn ramen", speech: "ばたーこーんらーめん", faIcon: "fa-bowl-rice", link: gImg("バターコーンラーメン") },
            { text: "メロンソフトクリーム", en: "Melon soft serve", speech: "めろんそふとくりーむ", faIcon: "fa-ice-cream", link: gImg("北海道 メロンソフトクリーム") },
            { text: "白い恋人", en: "Shiroi Koibito (Cookie)", speech: "しろいこいびと", faIcon: "fa-cookie", link: gImg("白い恋人 お菓子") }
        ]
    },
    {
        title: "冬のトラブル (Winter Troubles)", icon: "fa-triangle-exclamation", class: "",
        phrases: [
            { text: "吹雪です", en: "It's a blizzard.", speech: "ふぶきです", faIcon: "fa-wind" },
            { text: "道が凍っています", en: "The road is frozen.", speech: "みちがこおっています", faIcon: "fa-icicles" },
            { text: "滑るので気をつけて", en: "Be careful, it's slippery.", speech: "すべるのできをつけて", faIcon: "fa-person-falling" },
            { text: "寒すぎます", en: "It's too cold.", speech: "さむすぎます", faIcon: "fa-temperature-empty" }
        ]
    }
];

// ゲームデータ
const gameData = {
    shopping: {
        title: "買い物・グルメ",
        color: "#ff9800",
        questions: [
            { situation: "Order Snow Crab.", target: "ズワイガニをお願いします", accepts: ["ずわいがにをおねがいします", "ずわいがにおねがいします"] },
            { situation: "Order Salmon roe and Scallop.", target: "いくらと帆立をください", accepts: ["いくらとほたてをください", "いくらとほたてください"] },
            { situation: "Ask where to buy goggles.", target: "ゴーグルはどこで買えますか？", accepts: ["ごーぐるはどこでかえますか"] },
            { situation: "Tell them you want to eat Jingisukan.", target: "ジンギスカンを食べたいです", accepts: ["じんぎすかんをたべたいです", "じんぎすかんたべたいです"] },
            { situation: "Ask if they have heat packs.", target: "カイロはありますか？", accepts: ["かいろはありますか"] },
            { situation: "Order Sapporo Miso Ramen.", target: "札幌味噌ラーメンをお願いします", accepts: ["さっぽろみそらーめんをおねがいします", "みそらーめんをおねがいします"] }
        ]
    },
    sightseeing: {
        title: "観光・トラブル",
        color: "#0277bd",
        questions: [
            { situation: "Ask where the Snow Festival is.", target: "雪まつりはどこですか？", accepts: ["ゆきまつりはどこですか"] },
            { situation: "Tell the driver you want to go to Asahiyama Zoo.", target: "旭山動物園に行きたいです", accepts: ["あさひやまどうぶつえんにいきたいです"] },
            { situation: "Warn someone the road is frozen.", target: "道が凍っています", accepts: ["みちがこおっています"] },
            { situation: "Warn someone it is slippery.", target: "滑るので気をつけてください", accepts: ["すべるのできをつけてください", "すべるのできをつけて"] },
            { situation: "Ask if you can take a picture.", target: "写真を撮ってもいいですか？", accepts: ["しゃしんをとってもいいですか", "しゃしんとってもいいですか"] }
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
    window.scrollTo(0,0);
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

// 1. 練習画面
function renderLearning() {
    const container = document.getElementById('learning-content');
    container.textContent = '';
    
    learningData.forEach(cat => {
        const section = document.createElement('div');
        section.className = `learning-section ${cat.class}`;
        
        let phrasesHtml = '';
        cat.phrases.forEach(phrase => {
            // リンクボタンのHTML（リンクがある場合のみ作成）
            let linkHtml = phrase.link 
                ? `<button class="action-btn link-btn" onclick="window.open('${phrase.link}', '_blank')" title="画像・サイトを見る"><i class="fa-solid fa-globe"></i></button>` 
                : '';

            phrasesHtml += `
                <div class="phrase-item">
                    <div class="phrase-icon-box">
                        <i class="fa-solid ${phrase.faIcon || 'fa-star'}"></i>
                    </div>
                    <div class="phrase-text-group">
                        <span class="phrase-text">${phrase.text}</span>
                        <span class="phrase-en">${phrase.en}</span>
                    </div>
                    <div class="action-btns">
                        ${linkHtml}
                        <button class="action-btn play-btn" onclick="speakText('${phrase.speech || phrase.text}')" title="音声を聞く">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                </div>`;
        });

        section.textContent = `
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
    document.getElementById('target-phrase').textContent = qData.target;
    
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

function calculateSimilarity(s1, s2) {
    const cleanS1 = s1.toLowerCase().replace(/[\s、。！？!?,，]/g, '');
    const cleanS2 = s2.toLowerCase().replace(/[\s、。！？!?,，]/g, '');
    
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

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < gameData[currentGameType].questions.length) {
                loadQuestion();
            } else {
                alert("クリアおめでとうございます！北海道旅行の準備はバッチリですね！");
                goBack();
            }
        }, 1500);

    } else {
        fbText.textContent = `惜しい！もう一度！ (一致率: ${Math.floor(maxSimilarity)}%)`;
        fbText.className = "feedback-text fb-fail";
    }
}