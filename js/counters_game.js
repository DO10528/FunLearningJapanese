// --- データ定義 ---
const counters = {
    'tsu': { 
        label: 'つ', read: 'つ', usage: 'いろいろなもの',
        counts: ['ひとつ','ふたつ','みっつ','よっつ','いつつ','むっつ','ななつ','やっつ','ここのつ','とお']
    },
    'ko': { 
        label: '個', read: 'こ', usage: '小さいもの、丸いもの',
        counts: ['いっこ','にこ','さんこ','よんこ','ごこ','ろっこ','ななこ','はっこ','きゅうこ','じゅっこ']
    },
    'hon': { 
        label: '本', read: 'ほん', usage: '細長いもの',
        counts: ['いっぽん','にほん','さんぼん','よんほん','ごほん','ろっぽん','ななほん','はっぽん','きゅうほん','じゅっぽん']
    },
    'mai': { 
        label: '枚', read: 'まい', usage: '薄いもの',
        counts: ['いちまい','にまい','さんまい','よんまい','ごまい','ろくまい','ななまい','はちまい','きゅうまい','じゅうまい']
    },
    'dai': { 
        label: '台', read: 'だい', usage: '機械、乗り物',
        counts: ['いちだい','にだい','さんだい','よんだい','ごだい','ろくだい','ななだい','はちだい','きゅうだい','じゅうだい']
    },
    'hiki': { 
        label: '匹', read: 'ひき', usage: '小さい動物',
        counts: ['いっぴき','にひき','さんびき','よんひき','ごひき','ろっぴき','ななひき','はっぴき','きゅうひき','じゅっぴき']
    },
    'nin': { 
        label: '人', read: 'にん', usage: '人間',
        counts: ['ひとり','ふたり','さんにん','よにん','ごにん','ろくにん','ななにん','はちにん','きゅうにん','じゅうにん']
    },
    'satsu': { 
        label: '冊', read: 'さつ', usage: '本、ノート',
        counts: ['いっさつ','にさつ','さんさつ','よんさつ','ごさつ','ろくさつ','ななさつ','はっさつ','きゅうさつ','じゅっさつ']
    },
    'hai': { 
        label: '杯', read: 'はい', usage: '飲み物',
        counts: ['いっぱい','にはい','さんばい','よんはい','ごはい','ろっぱ い','ななはい','はっぱい','きゅうはい','じゅっぱい']
    },
    'soku': { 
        label: '足', read: 'そく', usage: '靴、靴下',
        counts: ['いっそく','にそく','さんぞく','よんそく','ごそく','ろくそく','ななそく','はっそく','きゅうそく','じゅっそく']
    },
    'kai': { 
        label: '回', read: 'かい', usage: '回数',
        counts: ['いっかい','にかい','さんかい','よんかい','ごかい','ろっかい','ななかい','はっかい','きゅうかい','じゅっかい']
    }
};

const items = [
    // つ (Tsu)
    { name: 'おかし', en: 'Sweets', emoji: '🍬', counter: 'tsu', one: 'ひとつ' },
    { name: 'もも', en: 'Peach', emoji: '🍑', counter: 'tsu', one: 'ひとつ' },
    // 個 (Ko)
    { name: 'りんご', en: 'Apple', emoji: '🍎', counter: 'ko', one: 'いっこ' },
    { name: 'ボール', en: 'Ball', emoji: '⚽', counter: 'ko', one: 'いっこ' },
    { name: 'みかん', en: 'Orange', emoji: '🍊', counter: 'ko', one: 'いっこ' },
    // 本 (Hon)
    { name: 'えんぴつ', en: 'Pencil', emoji: '✏️', counter: 'hon', one: 'いっぽん' },
    { name: '傘', en: 'Umbrella', emoji: '☂️', counter: 'hon', one: 'いっぽん' },
    { name: 'ネクタイ', en: 'Tie', emoji: '👔', counter: 'hon', one: 'いっぽん' },
    { name: 'にんじん', en: 'Carrot', emoji: '🥕', counter: 'hon', one: 'いっぽん' },
    { name: 'きゅうり', en: 'Cucumber', emoji: '🥒', counter: 'hon', one: 'いっぽん' },
    // 枚 (Mai)
    { name: 'シャツ', en: 'Shirt', emoji: '👕', counter: 'mai', one: 'いちまい' },
    { name: '紙', en: 'Paper', emoji: '📄', counter: 'mai', one: 'いちまい' },
    { name: 'ハンカチ', en: 'Handkerchief', emoji: '🤧', counter: 'mai', one: 'いちまい' },
    // 台 (Dai)
    { name: '車', en: 'Car', emoji: '🚗', counter: 'dai', one: 'いちだい' },
    { name: 'スマホ', en: 'Phone', emoji: '📱', counter: 'dai', one: 'いちだい' },
    { name: 'じてんしゃ', en: 'Bicycle', emoji: '🚲', counter: 'dai', one: 'いちだい' },
    { name: 'テレビ', en: 'TV', emoji: '📺', counter: 'dai', one: 'いちだい' },
    { name: 'ラジオ', en: 'Radio', emoji: '📻', counter: 'dai', one: 'いちだい' },
    // 匹 (Hiki)
    { name: '犬', en: 'Dog', emoji: '🐶', counter: 'hiki', one: 'いっぴき' },
    { name: '猫', en: 'Cat', emoji: '🐱', counter: 'hiki', one: 'いっぴき' },
    { name: 'うさぎ', en: 'Rabbit', emoji: '🐰', counter: 'hiki', one: 'いっぴき' },
    { name: 'ねずみ', en: 'Mouse', emoji: '🐭', counter: 'hiki', one: 'いっぴき' },
    { name: 'さる', en: 'Monkey', emoji: '🐵', counter: 'hiki', one: 'いっぴき' },
    // 人 (Nin)
    { name: '男の子', en: 'Boy', emoji: '👦', counter: 'nin', one: 'ひとり' },
    { name: '女の子', en: 'Girl', emoji: '👧', counter: 'nin', one: 'ひとり' },
    { name: 'タイ人', en: 'Thai', emoji: '🇹🇭', counter: 'nin', one: 'ひとり' },
    { name: 'アメリカ人', en: 'American', emoji: '🇺🇸', counter: 'nin', one: 'ひとり' },
    // 冊 (Satsu)
    { name: '本', en: 'Book', emoji: '📚', counter: 'satsu', one: 'いっさつ' },
    { name: 'ノート', en: 'Notebook', emoji: '📓', counter: 'satsu', one: 'いっさつ' },
    { name: 'じしょ', en: 'Dictionary', emoji: '📖', counter: 'satsu', one: 'いっさつ' },
    { name: 'えほん', en: 'Picture book', emoji: '🐻', counter: 'satsu', one: 'いっさつ' },
    // 杯 (Hai)
    { name: 'コーヒー', en: 'Coffee', emoji: '☕', counter: 'hai', one: 'いっぱい' },
    { name: 'オレンジジュース', en: 'Orange Juice', emoji: '🍹', counter: 'hai', one: 'いっぱい' },
    { name: 'りんごジュース', en: 'Apple Juice', emoji: '🧃', counter: 'hai', one: 'いっぱい' },
    { name: 'コーラ', en: 'Coke', emoji: '🥤', counter: 'hai', one: 'いっぱい' },
    { name: 'ビール', en: 'Beer', emoji: '🍺', counter: 'hai', one: 'いっぱい' },
    { name: '日本酒', en: 'Sake', emoji: '🍶', counter: 'hai', one: 'いっぱい' },
    { name: 'ワイン', en: 'Wine', emoji: '🍷', counter: 'hai', one: 'いっぱい' },
    // 足 (Soku)
    { name: 'くつ', en: 'Shoes', emoji: '👟', counter: 'soku', one: 'いっそく' },
    { name: 'くつした', en: 'Socks', emoji: '🧦', counter: 'soku', one: 'いっそく' },
    // 回 (Kai)
    { name: 'シャンプー', en: 'Shampoo', emoji: '🧴', counter: 'kai', one: 'いっかい' }
];

// --- 共通処理 ---
const synth = window.speechSynthesis;
let voices = [];
synth.onvoiceschanged = () => { voices = synth.getVoices(); };

function speak(text) {
    if (synth.speaking) synth.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'ja-JP';
    const jpVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
    if(jpVoice) ut.voice = jpVoice;
    synth.speak(ut);
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function goHome() { showScreen('screen-practice'); }

function showFeedback(isCorrect) {
    const fb = document.getElementById('feedback');
    const icon = document.getElementById('fb-icon');
    fb.style.display = 'flex';
    if(isCorrect) {
        icon.className = 'fa-regular fa-circle-check feedback-icon';
        icon.style.color = 'var(--correct)';
    } else {
        icon.className = 'fa-regular fa-circle-xmark feedback-icon';
        icon.style.color = 'var(--wrong)';
    }
    setTimeout(() => { fb.style.display = 'none'; }, 800);
}

// --- 練習モード ---
function startPractice() {
    const list = document.getElementById('practice-list');
    list.textContent = '';
    
    // 定義された順に表示
    Object.keys(counters).forEach(key => {
        const c = counters[key];
        const groupItems = items.filter(i => i.counter === key);
        
        // 1-10 の読み方グリッド
        let countGridHtml = '<div class="count-grid">';
        c.counts.forEach((val, idx) => {
            countGridHtml += `
                <div class="count-cell" onclick="speak('${val}')">
                    <span class="count-num">${idx+1}</span>
                    <span>${val}</span>
                </div>`;
        });
        countGridHtml += '</div>';

        // 単語リスト
        let itemScrollHtml = '<div class="item-scroll">';
        groupItems.forEach(i => {
            itemScrollHtml += `
                <div class="item-card">
                    <div class="item-emoji">${i.emoji}</div>
                    <div class="item-name">${i.name}</div>
                    <button class="audio-btn" style="width:30px; height:30px;" onclick="speak('${i.name}')">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>`;
        });
        itemScrollHtml += '</div>';

        const div = document.createElement('div');
        div.className = 'practice-group';
        div.textContent = `
            <div class="group-header">
                <div class="group-title">${c.label} (${c.read})</div>
                <div class="group-desc">${c.usage}</div>
                <button class="audio-btn" style="width:30px; height:30px;" onclick="speak('${c.read}')">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            ${countGridHtml}
            ${itemScrollHtml}
        `;
        list.appendChild(div);
    });
}

// --- Level 1: どっち？ ---
let l1_currentItem = null;
let l1_score = 0;

function startLevel1() {
    l1_score = 0;
    nextLevel1();
    showScreen('screen-level1');
}

function nextLevel1() {
    document.getElementById('l1-score').textContent = `正解数: ${l1_score}`;
    
    l1_currentItem = items[Math.floor(Math.random() * items.length)];
    const correctKey = l1_currentItem.counter;
    
    const keys = Object.keys(counters);
    let wrongKey = keys[Math.floor(Math.random() * keys.length)];
    while(wrongKey === correctKey) {
        wrongKey = keys[Math.floor(Math.random() * keys.length)];
    }
    
    document.getElementById('l1-emoji').textContent = l1_currentItem.emoji;
    document.getElementById('l1-word').textContent = l1_currentItem.name;
    
    const isLeftCorrect = Math.random() < 0.5;
    const btnL = document.getElementById('l1-btn-left');
    const btnR = document.getElementById('l1-btn-right');
    
    btnL.textContent = counters[isLeftCorrect ? correctKey : wrongKey].label;
    btnL.dataset.key = isLeftCorrect ? correctKey : wrongKey;
    
    btnR.textContent = counters[isLeftCorrect ? wrongKey : correctKey].label;
    btnR.dataset.key = isLeftCorrect ? wrongKey : correctKey;
}

function checkLevel1(side) {
    const btn = side === 0 ? document.getElementById('l1-btn-left') : document.getElementById('l1-btn-right');
    const selectedKey = btn.dataset.key;
    
    if(selectedKey === l1_currentItem.counter) {
        showFeedback(true);
        l1_score++;
        speak("せいかい！");
        setTimeout(nextLevel1, 1000);
    } else {
        showFeedback(false);
        speak("ちがうよ");
    }
}

// --- Level 2: 音声認識 (修正版：数もランダム) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;
let l2_currentItem = null;
let l2_targetNumber = 1;

function startLevel2() {
    if (!SpeechRecognition) { alert("音声認識が使えません"); return; }
    nextLevel2();
    showScreen('screen-level2');
}

function nextLevel2() {
    l2_currentItem = items[Math.floor(Math.random() * items.length)];
    // 1〜10のランダムな数
    l2_targetNumber = Math.floor(Math.random() * 10) + 1;
    
    document.getElementById('l2-emoji').textContent = l2_currentItem.emoji;
    document.getElementById('l2-num').textContent = l2_targetNumber;
    document.getElementById('l2-word').textContent = l2_currentItem.name;
    
    document.getElementById('mic-status').textContent = "マイクを押して話してね";
    document.getElementById('mic-btn').classList.remove('listening');
    
    // 単語だけ読み上げ
    speak(l2_currentItem.name);
}

function toggleRecording() {
    const statusText = document.getElementById('mic-status');
    const micBtn = document.getElementById('mic-btn');

    if (synth.speaking) synth.cancel();

    if (isRecording) {
        if (recognition) recognition.stop();
        isRecording = false;
        micBtn.classList.remove('listening');
        return;
    }

    try {
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;

        recognition.onstart = () => {
            isRecording = true;
            micBtn.classList.add('listening');
            statusText.textContent = "聞いています...";
        };

        recognition.onend = () => {
            isRecording = false;
            micBtn.classList.remove('listening');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            statusText.textContent = `「${transcript}」`;
            checkLevel2(transcript);
        };
        
        recognition.start();

    } catch(e) {
        console.error(e);
        statusText.textContent = "エラー";
    }
}

function checkLevel2(text) {
    // 正解の読み方リストから取得 (例: counters['hon'].counts[2] = 'さんぼん')
    const targetCounter = counters[l2_currentItem.counter];
    const targetReading = targetCounter.counts[l2_targetNumber - 1]; // 配列は0始まり
    const kanjiLabel = targetCounter.label; // 例: 本
    
    let t = text.replace(/[ 、。]/g, "");
    
    // 判定ロジック: 
    // 1. 正しい読み方 (例: さんぼん) が含まれる
    // 2. または、数字+漢字 (例: 3本) が含まれる (APIが漢字変換する場合があるため)
    const numericMatch = l2_targetNumber + kanjiLabel; // 3本
    const kanjiNumMatch = ["","一","二","三","四","五","六","七","八","九","十"][l2_targetNumber] + kanjiLabel; // 三本

    if (t.includes(targetReading) || t.includes(numericMatch) || t.includes(kanjiNumMatch)) {
        showFeedback(true);
        speak("すごい！");
        setTimeout(nextLevel2, 1500);
    } else {
        showFeedback(false);
        speak("おしい！正解は、" + targetReading + "、だよ");
    }
}

// --- Level 3: 仕分け (重複なし・中央揃え) ---
let l3_selectedItem = null;

function startLevel3() {
    // 3種類の助数詞を選ぶ
    const allKeys = Object.keys(counters);
    const targetKeys = [];
    while(targetKeys.length < 3) {
        const k = allKeys[Math.floor(Math.random() * allKeys.length)];
        if(!targetKeys.includes(k)) targetKeys.push(k);
    }
    
    // 箱エリア (中央揃え済)
    const boxContainer = document.getElementById('l3-boxes');
    boxContainer.textContent = '';
    targetKeys.forEach(key => {
        const div = document.createElement('div');
        div.className = 'category-box';
        div.textContent = counters[key].label;
        div.dataset.key = key;
        div.onclick = () => checkLevel3Box(key);
        boxContainer.appendChild(div);
    });

    // アイテムプール作成 (重複なしロジック)
    const pool = document.getElementById('l3-items');
    pool.textContent = '';
    
    // 1. 対象の助数詞を持つアイテム候補を全て集める
    let candidates = items.filter(it => targetKeys.includes(it.counter));
    
    // 2. シャッフル
    candidates.sort(() => Math.random() - 0.5);
    
    // 3. 最大10個を取り出す (候補が10個未満なら全て)
    const selectedItems = candidates.slice(0, 10);
    
    // 4. 描画
    selectedItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'game-item';
        div.textContent = item.emoji;
        div.dataset.counter = item.counter;
        div.dataset.name = item.name; // 読み上げ用
        div.onclick = (e) => selectLevel3Item(e.target);
        pool.appendChild(div);
    });

    document.getElementById('l3-msg').textContent = "アイテムを選んでね";
    showScreen('screen-level3');
}

function selectLevel3Item(el) {
    document.querySelectorAll('.game-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    l3_selectedItem = el;
    document.getElementById('l3-msg').textContent = "どこの箱に入るかな？";
    speak(el.dataset.name);
}

function checkLevel3Box(boxKey) {
    if(!l3_selectedItem) {
        speak("先にアイテムを選んでね");
        return;
    }
    const correctKey = l3_selectedItem.dataset.counter;
    if(boxKey === correctKey) {
        l3_selectedItem.classList.remove('active');
        l3_selectedItem.classList.add('solved');
        l3_selectedItem = null;
        showFeedback(true);
        speak("せいかい");
        const remaining = document.querySelectorAll('.game-item:not(.solved)').length;
        if(remaining === 0) {
            document.getElementById('l3-msg').textContent = "クリア！おめでとう！";
            speak("ぜんぶできたね！すごい！");
        }
    } else {
        showFeedback(false);
        speak("ちがうよ");
    }
}

// 初期化
window.onload = startPractice;