// --- 画像・音声パスの設定 ---
const IMG_PATH = 'assets/images/hiragana_words/';

// 音声
const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

// --- データ定義 ---
const gameLevels = [
    { level: 1, color: '#ff6b81', words: [ 
        { hira: 'あめ', file: 'あめ', accepts: ['あめ', '雨', '飴', 'アメ'] }, 
        { hira: 'いぬ', file: 'いぬ', accepts: ['いぬ', '犬', 'イヌ'] }, 
        { hira: 'うし', file: 'うし', accepts: ['うし', '牛', 'ウシ'] }, 
        { hira: 'えび', file: 'えび', accepts: ['えび', '海老', 'エビ', '蝦'] }, 
        { hira: 'おに', file: 'おに', accepts: ['おに', '鬼', 'オニ'] } 
    ] },
    { level: 2, color: '#ff9f43', words: [ 
        { hira: 'かに', file: 'かに', accepts: ['かに', '蟹', 'カニ'] }, 
        { hira: 'き', file: 'き', accepts: ['き', '木', '気', '機', 'キ'] },
        { hira: 'くるま', file: 'くるま', accepts: ['くるま', '車', 'クルマ'] }, 
        { hira: 'けむし', file: 'けむし', accepts: ['けむし', '毛虫', 'ケムシ'] }, 
        { hira: 'こま', file: 'こま', accepts: ['こま', '駒', '独楽', 'コマ'] } 
    ] },
    { level: 3, color: '#feca57', words: [ 
        { hira: 'さる', file: 'さる', accepts: ['さる', '猿', 'サル'] }, 
        { hira: 'しか', file: 'しか', accepts: ['しか', '鹿', 'シカ'] }, 
        { hira: 'すし', file: 'すし', accepts: ['すし', '寿司', '鮨', 'スシ', 'おすし', 'お寿司'] }, 
        { hira: 'せみ', file: 'せみ', accepts: ['せみ', '蝉', 'セミ'] }, 
        { hira: 'そば', file: 'そば', accepts: ['そば', '蕎麦', 'ソバ', 'おそば'] } 
    ] },
    { level: 4, color: '#1dd1a1', words: [ 
        { hira: 'たこ', file: 'たこ', accepts: ['たこ', '蛸', '凧', 'タコ'] }, 
        { hira: 'はち', file: 'はち', accepts: ['はち', '蜂', '八', '鉢', '8','ハチ'] },
        { hira: 'つき', file: 'つき', accepts: ['つき', '月', 'ツキ', 'おつきさま'] }, 
        { hira: 'てれび', file: 'てれび', accepts: ['てれび', 'テレビ'] }, 
        { hira: 'とり', file: 'とり', accepts: ['とり', '鳥', 'トリ'] } 
    ] },
    { level: 5, color: '#01a3a4', words: [ 
        { hira: 'なす', file: 'なす', accepts: ['なす', '茄子', '那須','ナス'] }, 
        { hira: 'にほん', file: 'にほん', accepts: ['にほん', '日本', 'ニホン', 'にっぽん'] }, 
        { hira: 'ぬの', file: 'ぬの', accepts: ['ぬの', '布', 'ヌノ'] }, 
        { hira: 'ねこ', file: 'ねこ', accepts: ['ねこ', '猫', 'ネコ'] }, 
        { hira: 'のり', file: 'のり', accepts: ['のり', '海苔', '糊', 'ノリ'] } 
    ] },
    { level: 6, color: '#54a0ff', words: [ 
        { hira: 'はし', file: 'はし', accepts: ['はし', '箸', '橋', 'ハシ', 'おはし'] }, 
        { hira: 'ひとで', file: 'ひとで', accepts: ['ひとで', 'ヒトデ', '人手', '海星'] }, 
        { hira: 'ふく', file: 'ふく', accepts: ['ふく', '服', '吹く', '拭く', 'フク'] }, 
        { hira: 'へび', file: 'へび', accepts: ['へび', '蛇', 'ヘビ'] }, 
        { hira: 'ほし', file: 'ほし', accepts: ['ほし', '星', 'ホシ', 'おほしさま'] } 
    ] },
    { level: 7, color: '#2e86de', words: [ 
        { hira: 'まくら', file: 'まくら', accepts: ['まくら', '枕', 'マクラ'] }, 
        { hira: 'みかん', file: 'みかん', accepts: ['みかん', '蜜柑', 'ミカン'] }, 
        { hira: 'むぎ', file: 'むぎ', accepts: ['むぎ', '麦', 'ムギ'] }, 
        { hira: 'めだか', file: 'めだか', accepts: ['めだか', 'メダカ', '鱂'] }, 
        { hira: 'もも', file: 'もも', accepts: ['もも', '桃', '腿', 'モモ'] } 
    ] },
    { level: 8, color: '#5f27cd', words: [ 
        { hira: 'らくだ', file: 'らくだ', accepts: ['らくだ', '駱駝', 'ラクダ'] }, 
        { hira: 'りんご', file: 'りんご', accepts: ['りんご', '林檎', 'リンゴ'] }, 
        { hira: 'るんば', file: 'るんば', accepts: ['るんば', 'ルンバ'] }, 
        { hira: 'れもん', file: 'れもん', accepts: ['れもん', 'レモン', '檸檬'] }, 
        { hira: 'ろば', file: 'ろば', accepts: ['ろば', '驢馬', 'ロバ'] } 
    ] },
    { level: 9, color: '#ff9a9e', words: [ 
        { hira: 'やぎ', file: 'やぎ', accepts: ['やぎ', '山羊', '八木','ヤギ'] }, 
        { hira: 'ゆかた', file: 'ゆかた', accepts: ['ゆかた', '浴衣', 'ユカタ'] }, 
        { hira: 'ようかい', file: 'ようかい', accepts: ['ようかい', '妖怪', 'ヨウカイ'] } 
    ] },
    { level: 10, color: '#e1b12c', words: [ 
        { hira: 'わに', file: 'わに', accepts: ['わに', '鰐', 'ワニ'] }, 
        { hira: 'かばん', file: 'かばん', accepts: ['かばん', '鞄', 'カバン'] } 
    ] }
];

let selectedMode = 1; 
let currentLevelIdx = 0;
let currentWordIdx = 0;
let isListening = false;

// Web Speech APIの存在チェック
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

window.onload = () => {
    const grid = document.getElementById('level-buttons');
    if (!grid) return; 
    
    gameLevels.forEach((lv, idx) => {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = `グループ ${lv.level}`;
        btn.style.backgroundColor = lv.color; 
        btn.onclick = () => startLevel(idx);
        grid.appendChild(btn);
    });
};

function selectGameMode(mode) {
    selectedMode = mode;
    showScreen('screen-levels');
}

function startLevel(idx) {
    currentLevelIdx = idx;
    currentWordIdx = 0;
    showScreen('screen-play');
    loadWord();
}

// マイクの状態を完全にリセットしてクリアにする安全装置
window.forceResetMic = function() {
    if (recognition) {
        try { recognition.abort(); } catch(e) {}
        recognition = null;
    }
    isListening = false;
    const btn = document.getElementById('mic-btn');
    if (btn) btn.classList.remove('listening');
};

function loadWord() {
    // 問題が切り替わるたびに、マイクのバグった状態を必ずリセットする
    forceResetMic();

    const levelData = gameLevels[currentLevelIdx];
    const wordData = levelData.words[currentWordIdx];
    
    document.documentElement.style.setProperty('--current-theme', levelData.color);

    document.getElementById('current-level-display').textContent = levelData.level;
    document.getElementById('word-progress-text').textContent = `${currentWordIdx + 1} / ${levelData.words.length}`;
    document.getElementById('result-text').textContent = "マイクをおして はなしてね";
    document.getElementById('result-text').className = "result-text";
    document.getElementById('transcript-text').textContent = "";
    
    const totalInLevel = levelData.words.length;
    document.getElementById('progress-fill').style.width = `${((currentWordIdx) / totalInLevel) * 100}%`;

    const imgEl = document.getElementById('display-image');
    const textEl = document.getElementById('display-text');

    if (selectedMode === 1) {
        imgEl.src = `${IMG_PATH}${wordData.file}.png`;
        imgEl.alt = wordData.hira;
        imgEl.style.display = 'block';
        textEl.style.display = 'none';
    } else {
        textEl.textContent = wordData.hira;
        textEl.style.display = 'block';
        imgEl.style.display = 'none';
    }

    // --- 動的「次へ」ボタンの生成と表示リセット ---
    const micBtn = document.getElementById('mic-btn');
    let nextBtn = document.getElementById('next-btn-dynamic');

    if (micBtn) {
        micBtn.style.display = 'inline-block'; // マイクボタンを復活させる
        
        // 次へボタンがまだ無ければ作成する
        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'next-btn-dynamic';
            nextBtn.innerHTML = 'つぎへすすむ <i class="fa-solid fa-arrow-right"></i>';
            nextBtn.style.padding = '15px 40px';
            nextBtn.style.fontSize = '1.3em';
            nextBtn.style.fontWeight = 'bold';
            nextBtn.style.backgroundColor = '#4caf50';
            nextBtn.style.color = 'white';
            nextBtn.style.border = 'none';
            nextBtn.style.borderRadius = '50px';
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.boxShadow = '0 5px 0 #2e7d32';
            nextBtn.style.marginTop = '20px';
            
            nextBtn.onmousedown = () => { nextBtn.style.transform = 'translateY(5px)'; nextBtn.style.boxShadow = 'none'; };
            nextBtn.onmouseup = () => { nextBtn.style.transform = 'translateY(0)'; nextBtn.style.boxShadow = '0 5px 0 #2e7d32'; };
            
            nextBtn.onclick = nextStep;
            micBtn.parentNode.insertBefore(nextBtn, micBtn.nextSibling);
        }
        nextBtn.style.display = 'none'; // 問題ロード時は必ず隠す
    }
}

// --- iPadパニック回避マイクシステム ---
window.startSpeechRecognition = function() {
    if (!SpeechRecognition) {
        alert("お使いのブラウザは音声認識に対応していません。SafariかChromeの最新版をお使いください。");
        return;
    }

    const btn = document.getElementById('mic-btn');
    const resText = document.getElementById('result-text');

    if (isListening) {
        forceResetMic();
        resText.textContent = "もういちど マイクをおしてね";
        return;
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    isListening = true;
    btn.classList.add('listening');
    resText.textContent = "マイクをじゅんび中...";
    resText.className = "result-text";

    try {
        recognition = new SpeechRecognition();
    } catch(e) {
        forceResetMic();
        resText.textContent = "エラーがおきました。もういちどおしてね。";
        return;
    }
    
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('transcript-text').textContent = `ききとった言葉: 「${transcript}」`;
        checkPronunciation(transcript);
    };

    recognition.onend = () => {
        forceResetMic();
        if (resText.textContent === "きいています..." || resText.textContent === "マイクをじゅんび中...") {
            resText.textContent = "もういちど マイクをおしてね";
            resText.className = "result-text retry";
        }
    };

    recognition.onerror = (event) => {
        forceResetMic();
        if (event.error !== 'aborted') {
            console.warn("音声認識エラー:", event.error);
            if (event.error === 'not-allowed') {
                resText.textContent = "マイクのきょかがありません。設定(せってい)をかくにんしてね。";
            } else {
                resText.textContent = "うまくききとれませんでした。";
            }
            resText.className = "result-text retry";
        }
    };

    setTimeout(() => {
        if (!isListening) return;
        try {
            resText.textContent = "きいています...";
            recognition.start();
        } catch (e) {
            console.error("マイク起動エラー:", e);
            forceResetMic();
            resText.textContent = "エラーがおきました。もういちどおしてね。";
        }
    }, 100);
}

function checkPronunciation(speech) {
    const wordData = gameLevels[currentLevelIdx].words[currentWordIdx];
    const resText = document.getElementById('result-text');

    let maxSim = calculateSimilarity(speech, wordData.hira);
    
    if (wordData.accepts) {
        wordData.accepts.forEach(acc => {
            const sim = calculateSimilarity(speech, acc);
            if (sim > maxSim) maxSim = sim;
        });
    }

    if (maxSim >= 80) {
        resText.textContent = "合格！ (Excellent!)";
        resText.className = "result-text success";
        
        if(typeof SOUND_CORRECT !== 'undefined') {
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play().catch(e => console.log(e));
        }
        
        // 正解したらマイクを隠して「つぎへすすむ」ボタンを表示する
        const micBtn = document.getElementById('mic-btn');
        const nextBtn = document.getElementById('next-btn-dynamic');
        if (micBtn && nextBtn) {
            micBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
        }
        
    } else {
        resText.textContent = "おしい！もういちど。";
        resText.className = "result-text retry";
        
        if(typeof SOUND_INCORRECT !== 'undefined') {
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play().catch(e => console.log(e));
        }
    }
}

function nextStep() {
    currentWordIdx++;
    const levelWords = gameLevels[currentLevelIdx].words;

    if (currentWordIdx < levelWords.length) {
        loadWord();
    } else {
        currentLevelIdx++;
        if (currentLevelIdx < gameLevels.length) {
            currentWordIdx = 0;
            loadWord();
        } else {
            alert("ぜんぶクリア！おめでとう！");
            goHome();
        }
    }
}

function calculateSimilarity(s1, s2) {
    const cleanS1 = s1.replace(/[\s、。！？]/g, '');
    const cleanS2 = s2.replace(/[\s、。！？]/g, '');
    
    if (cleanS1 === cleanS2) return 100;
    
    let costs = new Array();
    for (let i = 0; i <= cleanS1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= cleanS2.length; j++) {
            if (i == 0) costs[j] = j;
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (cleanS1.charAt(i - 1) != cleanS2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
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

window.showScreen = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

window.goHome = function() {
    showScreen('screen-modes');
}

window.goBack = function() {
    const playScr = document.getElementById('screen-play');
    const levelScr = document.getElementById('screen-levels');
    if (playScr.classList.contains('active')) showScreen('screen-levels');
    else if (levelScr.classList.contains('active')) showScreen('screen-modes');
}