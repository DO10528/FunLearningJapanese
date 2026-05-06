import json

verbs = [
    # Grp 1
    (1, "書く", "かく", "Write", "fa-solid fa-pen"),
    (1, "聞く", "きく", "Listen", "fa-solid fa-headphones"),
    (1, "行く", "いく", "Go", "fa-solid fa-person-walking-arrow-right"),
    (1, "泳ぐ", "およぐ", "Swim", "fa-solid fa-person-swimming"),
    (1, "飲む", "のむ", "Drink", "fa-solid fa-glass-water"),
    (1, "読む", "よむ", "Read", "fa-solid fa-book-open"),
    (1, "休む", "やすむ", "Rest", "fa-solid fa-bed"),
    (1, "遊ぶ", "あそぶ", "Play", "fa-solid fa-gamepad"),
    (1, "買う", "かう", "Buy", "fa-solid fa-cart-shopping"),
    (1, "会う", "あう", "Meet", "fa-solid fa-handshake"),
    (1, "待つ", "まつ", "Wait", "fa-solid fa-clock"),
    (1, "持つ", "もつ", "Hold", "fa-solid fa-bag-shopping"),
    (1, "撮る", "とる", "Take (photo)", "fa-solid fa-camera"),
    (1, "帰る", "かえる", "Return", "fa-solid fa-house"),
    (1, "分かる", "わかる", "Understand", "fa-regular fa-lightbulb"),
    (1, "話す", "はなす", "Talk", "fa-solid fa-comments"),
    (1, "売る", "うる", "Sell", "fa-solid fa-hand-holding-dollar"),
    (1, "使う", "つかう", "Use", "fa-solid fa-hand-pointer"),
    (1, "習う", "ならう", "Learn", "fa-solid fa-book-reader"),
    (1, "立つ", "たつ", "Stand", "fa-solid fa-person"),
    (1, "座る", "すわる", "Sit", "fa-solid fa-chair"),
    (1, "急ぐ", "いそぐ", "Hurry", "fa-solid fa-person-running"),
    (1, "働く", "はたらく", "Work", "fa-solid fa-briefcase"),
    (1, "貸す", "かす", "Lend", "fa-solid fa-hand-holding-heart"),
    (1, "歩く", "あるく", "Walk", "fa-solid fa-person-walking"),
    (1, "乗る", "のる", "Ride", "fa-solid fa-train-subway"),
    # New Grp 1
    (1, "作る", "つくる", "Make", "fa-solid fa-hammer"),
    (1, "笑う", "わらう", "Laugh", "fa-solid fa-face-laugh-squint"),
    (1, "送る", "おくる", "Send", "fa-solid fa-paper-plane"),
    (1, "手伝う", "てつだう", "Help", "fa-solid fa-handshake-angle"),

    # Grp 2 e
    (2, "寝る", "ねる", "Sleep", "fa-solid fa-moon", 'e'),
    (2, "食べる", "たべる", "Eat", "fa-solid fa-utensils", 'e'),
    (2, "あげる", "あげる", "Give", "fa-solid fa-gift", 'e'),
    (2, "開ける", "あける", "Open", "fa-solid fa-door-open", 'e'),
    (2, "見せる", "みせる", "Show", "fa-solid fa-eye", 'e'),
    (2, "教える", "おしえる", "Teach", "fa-solid fa-chalkboard-user", 'e'),
    (2, "始める", "はじめる", "Start", "fa-solid fa-play", 'e'),
    (2, "閉める", "しめる", "Close", "fa-solid fa-door-closed", 'e'),
    (2, "つける", "つける", "Turn on", "fa-solid fa-power-off", 'e'),
    (2, "忘れる", "わすれる", "Forget", "fa-solid fa-circle-question", 'e'),
    (2, "出る", "でる", "Exit/Leave", "fa-solid fa-arrow-right-from-bracket", 'e'),
    (2, "覚える", "おぼえる", "Remember", "fa-solid fa-brain", 'e'),
    (2, "止める", "とめる", "Stop", "fa-solid fa-hand", 'e'),
    (2, "捨てる", "すてる", "Throw away", "fa-solid fa-trash", 'e'),
    (2, "考える", "かんがえる", "Think", "fa-solid fa-cloud", 'e'),
    # New Grp 2 e
    (2, "決める", "きめる", "Decide", "fa-solid fa-check-double", 'e'),
    (2, "変える", "かえる", "Change", "fa-solid fa-shuffle", 'e'),
    (2, "調べる", "しらべる", "Investigate", "fa-solid fa-magnifying-glass", 'e'),

    # Grp 2 i
    (2, "見る", "みる", "Watch/See", "fa-solid fa-tv", 'i'),
    (2, "居る", "いる", "Exist (Living)", "fa-solid fa-person", 'i'),
    (2, "起きる", "おきる", "Wake up", "fa-solid fa-sun", 'i'),
    (2, "借りる", "かりる", "Borrow", "fa-solid fa-hand-holding", 'i'),
    (2, "浴びる", "あびる", "Shower", "fa-solid fa-shower", 'i'),
    (2, "出来る", "できる", "Can do", "fa-solid fa-thumbs-up", 'i'),
    (2, "降りる", "おりる", "Get off", "fa-solid fa-person-walking-luggage", 'i'),
    (2, "着る", "きる", "Wear", "fa-solid fa-shirt", 'i'),

    # Grp 3
    (3, "する", "する", "Do", "fa-solid fa-check"),
    (3, "来る", "くる", "Come", "fa-solid fa-person-walking-arrow-right"),
    (3, "勉強する", "べんきょうする", "Study", "fa-solid fa-graduation-cap"),
    (3, "買い物する", "かいものする", "Shop", "fa-solid fa-basket-shopping"),
    (3, "散歩する", "さんぽする", "Walk", "fa-solid fa-tree"),
    (3, "コピーする", "コピーする", "Copy", "fa-solid fa-copy"),
    (3, "結婚する", "けっこんする", "Marry", "fa-solid fa-ring"),
    (3, "掃除する", "そうじする", "Clean", "fa-solid fa-broom"),
    (3, "洗濯する", "せんたくする", "Laundry", "fa-solid fa-shirt"),
    (3, "料理する", "りょうりする", "Cook", "fa-solid fa-kitchen-set"),
    (3, "運転する", "うんてんする", "Drive", "fa-solid fa-car"),
    (3, "電話する", "でんわする", "Call", "fa-solid fa-phone"),
    (3, "心配する", "しんぱいする", "Worry", "fa-solid fa-face-frown"),
    (3, "残業する", "ざんぎょうする", "Overtime", "fa-solid fa-business-time"),
    (3, "食事する", "しょくじする", "Meal", "fa-solid fa-bowl-rice"),
    (3, "持って来る", "もってくる", "Bring", "fa-solid fa-box-open"),
    (3, "連れて来る", "つれてくる", "Bring (person)", "fa-solid fa-people-arrows"),
    # New Grp 3
    (3, "予約する", "よやくする", "Reserve", "fa-solid fa-calendar-check"),
    (3, "運動する", "うんどうする", "Exercise", "fa-solid fa-dumbbell"),
    (3, "案内する", "あんないする", "Guide", "fa-solid fa-map"),
    (3, "紹介する", "しょうかいする", "Introduce", "fa-solid fa-users"),
    (3, "準備する", "じゅんびする", "Prepare", "fa-solid fa-box")
]

def conjugate_g1(word):
    stem = word[:-1]
    last = word[-1]
    masu_map = {'く':'き', 'ぐ':'ぎ', 'す':'し', 'つ':'ち', 'ぬ':'に', 'ぶ':'び', 'む':'み', 'る':'り', 'う':'い'}
    nai_map = {'く':'か', 'ぐ':'が', 'す':'さ', 'つ':'た', 'ぬ':'な', 'ぶ':'ば', 'む':'ま', 'る':'ら', 'う':'わ'}
    
    masu = stem + masu_map[last] + "ます"
    mashita = stem + masu_map[last] + "ました"
    nai = stem + nai_map[last] + "ない"
    
    if word in ['行く', 'いく']:
        te = stem + 'って'
    else:
        if last in ['う', 'つ', 'る']: te = stem + 'って'
        elif last in ['む', 'ぶ', 'ぬ']: te = stem + 'んで'
        elif last == 'く': te = stem + 'いて'
        elif last == 'ぐ': te = stem + 'いで'
        elif last == 'す': te = stem + 'して'
        else: te = word
        
    ta = te[:-1] + ('た' if te[-1] == 'て' else 'だ')
    return masu, mashita, te, nai, ta

def conjugate_g2(word):
    stem = word[:-1]
    masu = stem + 'ます'
    mashita = stem + 'ました'
    te = stem + 'て'
    nai = stem + 'ない'
    ta = stem + 'た'
    return masu, mashita, te, nai, ta

def conjugate_g3(word):
    if word.endswith('来る'):
        stem = word[:-2]
        return stem+'来ます', stem+'来ました', stem+'来て', stem+'来ない', stem+'来た'
    elif word.endswith('くる'):
        stem = word[:-2]
        return stem+'きます', stem+'きました', stem+'きて', stem+'こない', stem+'きた'
    elif word.endswith('する'):
        stem = word[:-2]
        return stem+'します', stem+'しました', stem+'して', stem+'しない', stem+'した'
    return word, word, word, word, word

output = []
for v in verbs:
    grp = v[0]
    kanji = v[1]
    hira = v[2]
    en = v[3]
    icon = v[4]
    sub = v[5] if len(v) > 5 else None

    # Kanji
    if grp == 1: k_masu, k_mashita, k_te, k_nai, k_ta = conjugate_g1(kanji)
    elif grp == 2: k_masu, k_mashita, k_te, k_nai, k_ta = conjugate_g2(kanji)
    else: k_masu, k_mashita, k_te, k_nai, k_ta = conjugate_g3(kanji)
    k_dict = {'masu': k_masu, 'mashita': k_mashita, 'te': k_te, 'jisho': kanji, 'nai': k_nai, 'ta': k_ta}

    # Hiragana
    if grp == 1: h_masu, h_mashita, h_te, h_nai, h_ta = conjugate_g1(hira)
    elif grp == 2: h_masu, h_mashita, h_te, h_nai, h_ta = conjugate_g2(hira)
    else: h_masu, h_mashita, h_te, h_nai, h_ta = conjugate_g3(hira)
    
    # Optional: break long Grp3 words into 2 lines for UI if needed?
    # Original code had e.g. "べんきょう\nします"
    # To keep it simple and clean, let's just use CSS for wrapping and use space if necessary.
    # Actually, original UI had \n for some long grp3 words. I will replace " " with "\n" if I want, but let's just let it be.
    if grp == 3 and kanji not in ['する', '来る']:
        k_dict = {k: v.replace('する', '\nする').replace('します', '\nします').replace('しました', '\nしました').replace('して', '\nして').replace('しない', '\nしない').replace('した', '\nした') for k, v in k_dict.items()}
        h_dict = {'masu': h_masu, 'mashita': h_mashita, 'te': h_te, 'jisho': hira, 'nai': h_nai, 'ta': h_ta}
        h_dict = {k: v.replace('する', '\nする').replace('します', '\nします').replace('しました', '\nしました').replace('して', '\nして').replace('しない', '\nしない').replace('した', '\nした') for k, v in h_dict.items()}
    else:
        h_dict = {'masu': h_masu, 'mashita': h_mashita, 'te': h_te, 'jisho': hira, 'nai': h_nai, 'ta': h_ta}

    # Grp3 Kuru specific wrap
    if kanji in ['持って来る', '連れて来る']:
        k_dict = {k: v.replace('来る', '\n来る').replace('来', '\n来') for k, v in k_dict.items()}
        h_dict = {k: v.replace('くる', '\nくる').replace('き', '\nき').replace('こ', '\nこ') for k, v in h_dict.items()}
        
    obj = {
        'grp': grp, 'en': en, 'icon': icon,
        'kanji': k_dict, 'hiragana': h_dict
    }
    if sub: obj['sub'] = sub
    output.append(obj)

js_code = """// --- マスター動詞データ (全ての活用形を持つ) ---
const masterVerbs = """ + json.dumps(output, ensure_ascii=False, indent=4) + """;

// 全ての動詞にIDと学習状態を付与
masterVerbs.forEach((v, idx) => {
    v.id = idx;
    v.learned = false;
});

let currentForm = 'masu';
let displayMode = 'kanji'; // デフォルトは漢字
const synth = window.speechSynthesis;

function toggleDisplayMode() {
    const isKanji = document.getElementById('mode-toggle').checked;
    displayMode = isKanji ? 'kanji' : 'hiragana';
    renderAllGroups();
}

function speak(text) {
    if (synth.speaking) synth.cancel();
    // 読み上げには常に「ひらがな」データを使用するため、テキスト自体はここではそのまま受け取るか、IDで引いてひらがなを取得するか。
    // 引数textには既に正しいひらがなが渡される前提に変更。
    const utterThis = new SpeechSynthesisUtterance(text.replace(/\\n/g, ''));
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
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-btn');
    if(form === 'masu') buttons[0].classList.add('active');
    else if(form === 'mashita') buttons[1].classList.add('active');
    else if(form === 'te') buttons[2].classList.add('active');
    else if(form === 'jisho') buttons[3].classList.add('active');
    else if(form === 'nai') buttons[4].classList.add('active');
    else if(form === 'ta') buttons[5].classList.add('active');

    const wrapper = document.getElementById('list-container');
    if (wrapper) {
        wrapper.classList.remove('groups-wrapper');
        void wrapper.offsetWidth; 
        wrapper.classList.add('groups-wrapper');
    }

    renderAllGroups();
};

window.toggleDisplayMode = () => {
    const cb = document.getElementById('mode-toggle');
    if(cb) {
        // Toggle UI logic handles the switch. If checked, it's kanji? Wait, the label order was Kanji -> Hiragana.
        // Usually, checked = right side (Hiragana). Let's define checked=hiragana.
        displayMode = cb.checked ? 'hiragana' : 'kanji';
        renderAllGroups();
    }
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
    if(!container) return;
    container.textContent = '';
    
    data.forEach((item) => {
        const card = document.createElement('div');
        card.className = `verb-card ${item.learned ? 'learned' : ''}`;
        
        // 表示用のテキスト
        const displayText = item[displayMode][currentForm];
        // 発音用のテキスト（常にひらがな）
        const speechText = item.hiragana[currentForm];

        card.innerHTML = `
            <div class="verb-info">
                <div class="verb-icon"><i class="${item.icon}"></i></div>
                <div class="verb-text-box">
                    <div class="verb-jp">${displayText.replace(/\\n/g, '<br>')}</div>
                    <div class="verb-en">${item.en}</div>
                </div>
            </div>
            <div class="check-btn" data-id="${item.id}">
                <i class="fa-solid fa-check"></i>
            </div>
        `;

        card.onclick = (e) => {
            if (e.target.closest('.check-btn')) {
                e.stopPropagation();
                toggleLearned(item.id);
                return;
            }
            // 常にひらがなを読み上げる
            speak(speechText);
        };
        container.appendChild(card);
    });
}

function toggleLearned(id) {
    const target = masterVerbs.find(v => v.id === id);
    if(target) {
        target.learned = !target.learned;
        renderAllGroups(); 
    }
}

window.onload = () => {
    // スイッチの初期状態と同期
    const cb = document.getElementById('mode-toggle');
    if(cb) {
        displayMode = cb.checked ? 'hiragana' : 'kanji';
    }
    setForm('masu'); 
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {};
    }
};
"""

with open('/Users/daisuke/Desktop/FunLearningJapanese/js/verb_list.js', 'w', encoding='utf-8') as f:
    f.write(js_code)
print("js/verb_list.js generated successfully!")
