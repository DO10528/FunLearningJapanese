// --- 画像・音声パスの設定 ---
const IMG_PATH = 'assets/images/katakana_words/';
const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

// --- データ定義 ---
// 音声認識が「あいす」や英語の「ice」に変換してしまうケースをカバーするため、acceptsを定義しています
const gameLevels = [
    { level: 1, color: '#ff9f43', words: [ 
        { kata: 'アイス', file: 'アイス', accepts: ['アイス', 'あいす', 'ice'] }, 
        { kata: 'イヤホン', file: 'イヤホン', accepts: ['イヤホン', 'いやほん', 'earphone'] }, 
        { kata: 'ウインナー', file: 'ウインナー', accepts: ['ウインナー', 'ういんなー', 'ウィンナー', 'wiener'] }, 
        { kata: 'エプロン', file: 'エプロン', accepts: ['エプロン', 'えぷろん', 'apron'] }, 
        { kata: 'オムライス', file: 'オムライス', accepts: ['オムライス', 'おむらいす', 'omurice'] } 
    ] },
    { level: 2, color: '#feca57', words: [ 
        { kata: 'カレンダー', file: 'カレンダー', accepts: ['カレンダー', 'かれんだー', 'calendar'] }, 
        { kata: 'キャベツ', file: 'キャベツ', accepts: ['キャベツ', 'きゃべつ', 'cabbage'] }, 
        { kata: 'クレヨン', file: 'クレヨン', accepts: ['クレヨン', 'くれよん', 'crayon'] }, 
        { kata: 'ケーキ', file: 'ケーキ', accepts: ['ケーキ', 'けーき', 'cake'] }, 
        { kata: 'コップ', file: 'コップ', accepts: ['コップ', 'こっぷ', 'cup'] } 
    ] },
    { level: 3, color: '#1dd1a1', words: [ 
        { kata: 'サッカー', file: 'サッカー', accepts: ['サッカー', 'さっかー', 'soccer'] }, 
        { kata: 'シャツ', file: 'シャツ', accepts: ['シャツ', 'しゃつ', 'shirt'] }, 
        { kata: 'ストロー', file: 'ストロー', accepts: ['ストロー', 'すとろー', 'straw'] }, 
        { kata: 'セーター', file: 'セーター', accepts: ['セーター', 'せーたー', 'sweater'] }, 
        { kata: 'ソーダ', file: 'ソーダ', accepts: ['ソーダ', 'そーだ', 'soda'] } 
    ] },
    { level: 4, color: '#01a3a4', words: [ 
        { kata: 'タオル', file: 'タオル', accepts: ['タオル', 'たおる', 'towel'] }, 
        { kata: 'チョコ', file: 'チョコ', accepts: ['チョコ', 'ちょこ', 'チョコレート', 'chocolate', 'choco'] }, 
        { kata: 'ツナ', file: 'ツナ', accepts: ['ツナ', 'つな', 'tuna'] }, 
        { kata: 'テント', file: 'テント', accepts: ['テント', 'てんと', 'tent'] }, 
        { kata: 'トナカイ', file: 'トナカイ', accepts: ['トナカイ', 'となかい', 'reindeer'] } 
    ] },
    { level: 5, color: '#54a0ff', words: [ 
        { kata: 'ナマズ', file: 'ナマズ', accepts: ['ナマズ', 'なまず', '鯰', 'catfish'] }, 
        { kata: 'ニワトリ', file: 'ニワトリ', accepts: ['ニワトリ', 'にわとり', '鶏', 'chicken'] }, 
        { kata: 'ヌードル', file: 'ヌードル', accepts: ['ヌードル', 'ぬーどる', 'noodle'] }, 
        { kata: 'ネクタイ', file: 'ネクタイ', accepts: ['ネクタイ', 'ねくたい', 'tie', 'necktie'] }, 
        { kata: 'ノート', file: 'ノート', accepts: ['ノート', 'のーと', 'note', 'notebook'] } 
    ] },
    { level: 6, color: '#2e86de', words: [ 
        { kata: 'ハンガー', file: 'ハンガー', accepts: ['ハンガー', 'はんがー', 'hanger'] }, 
        { kata: 'ヒトデ', file: 'ヒトデ', accepts: ['ヒトデ', 'ひとで', '人手', '海星'] }, 
        { kata: 'フグ', file: 'フグ', accepts: ['フグ', 'ふぐ', '河豚'] }, 
        { kata: 'ヘルメット', file: 'ヘルメット', accepts: ['ヘルメット', 'へるめっと', 'helmet'] }, 
        { kata: 'ホタテ', file: 'ホタテ', accepts: ['ホタテ', 'ほたて', '帆立'] } 
    ] },
    { level: 7, color: '#9b59b6', words: [ 
        { kata: 'マフラー', file: 'マフラー', accepts: ['マフラー', 'まふらー', 'muffler'] }, 
        { kata: 'ミミズ', file: 'ミミズ', accepts: ['ミミズ', 'みみず', '蚯蚓'] }, 
        { kata: 'ムササビ', file: 'ムササビ', accepts: ['ムササビ', 'むささび'] }, 
        { kata: 'メダカ', file: 'メダカ', accepts: ['メダカ', 'めだか', '鱂'] }, 
        { kata: 'メモ', file: 'メモ', accepts: ['メモ', 'めも', 'memo'] } 
    ] },
    { level: 8, color: '#e84393', words: [ 
        { kata: 'タイヤ', file: 'タイヤ', accepts: ['タイヤ', 'たいや', 'tire', 'tyre'] }, 
        { kata: 'ユーフォー', file: 'ユーフォー', accepts: ['ユーフォー', 'ゆーふぉー', 'UFO', 'ufo'] }, 
        { kata: 'ヨーヨー', file: 'ヨーヨー', accepts: ['ヨーヨー', 'よーよー', 'yoyo'] }, 
        { kata: 'ワイン', file: 'ワイン', accepts: ['ワイン', 'わいん', 'wine'] }, 
        { kata: 'パン', file: 'パン', accepts: ['パン', 'ぱん', 'pan', 'bread'] } 
    ] },
    { level: 9, color: '#ff6b81', words: [ 
        { kata: 'ラーメン', file: 'ラーメン', accepts: ['ラーメン', 'らーめん', 'ramen', '拉麺'] }, 
        { kata: 'リュック', file: 'リュック', accepts: ['リュック', 'りゅっく', 'リュックサック', 'backpack'] }, 
        { kata: 'ルビー', file: 'ルビー', accepts: ['ルビー', 'るびー', 'ruby'] }, 
        { kata: 'レタス', file: 'レタス', accepts: ['レタス', 'れたす', 'lettuce'] }, 
        { kata: 'ロケット', file: 'ロケット', accepts: ['ロケット', 'ろけっと', 'rocket'] } 
    ] }
];

let selectedMode = 1; // 1: イラスト, 2: 文字, 3: ミックス
let currentLevelIdx = 0;
let currentWordIdx = 0;
let isListening = false;

// --- 音声認識APIの準備 ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

window.onload = () => {
    const grid = document.getElementById('level-buttons');
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

function loadWord() {
    const levelData = gameLevels[currentLevelIdx];
    const wordData = levelData.words[currentWordIdx];
    
    // CSS変数を更新して、画面全体のテーマカラーを変更
    document.documentElement.style.setProperty('--current-theme', levelData.color);

    document.getElementById('current-level-display').textContent = levelData.level;
    document.getElementById('word-progress-text').textContent = `${currentWordIdx + 1} / ${levelData.words.length}`;
    document.getElementById('result-text').textContent = "";
    document.getElementById('transcript-text').textContent = "";
    
    const totalInLevel = levelData.words.length;
    document.getElementById('progress-fill').style.width = `${((currentWordIdx) / totalInLevel) * 100}%`;

    const imgEl = document.getElementById('display-image');
    const textEl = document.getElementById('display-text');

    // ★マイクボタンを再表示し、次へボタンを隠す（初期化）
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.style.display = 'inline-block';
    const nextBtn = document.getElementById('tc-next-btn-dynamic');
    if (nextBtn) nextBtn.style.display = 'none';

    // 表示モードの決定（ミックスモードの場合はランダム）
    let displayMode = selectedMode;
    if (selectedMode === 3) {
        displayMode = Math.random() < 0.5 ? 1 : 2; // 1か2をランダムに選ぶ
    }

    if (displayMode === 1) {
        // イラスト表示
        imgEl.src = `${IMG_PATH}${wordData.file}.png`;
        imgEl.alt = wordData.kata;
        imgEl.style.display = 'block';
        textEl.style.display = 'none';
    } else {
        // カタカナ表示
        textEl.textContent = wordData.kata;
        textEl.style.display = 'block';
        imgEl.style.display = 'none';
    }
}

// ★最強のマイク起動ルールに差し替え
function startSpeechRecognition() {
    if (!SpeechRecognition) {
        alert("お使いのブラウザは音声認識に対応していません。");
        return;
    }

    const btn = document.getElementById('mic-btn');
    if (btn.classList.contains('listening') || btn.disabled) return;

    // もし音声読み上げ中などがあれば止める
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // 起動中のマイクがあれば確実にリセットする
    if (recognition) {
        try { recognition.abort(); } catch(e){}
    }

    const resText = document.getElementById('result-text');
    const transcriptText = document.getElementById('transcript-text');

    // ★iPad連打フリーズ対策：0.8秒間マイクをロック
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    resText.textContent = "マイクをじゅんびしています... (少しまってね)";
    resText.className = "result-text";
    transcriptText.textContent = "";

    setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.pointerEvents = '';
        
        // ★毎回新品のマイクを作り直す
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            isListening = true;
            btn.classList.add('listening');
            resText.textContent = "きいています...";
            resText.style.color = '#333';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            transcriptText.textContent = `あなたの声: 「${transcript}」`;
            checkPronunciation(transcript);
        };

        recognition.onerror = (event) => {
            console.warn("音声認識エラー:", event.error);
            isListening = false;
            btn.classList.remove('listening');
            if (event.error !== 'aborted') {
                resText.textContent = "うまくききとれませんでした。もういちどおしてね。";
                resText.className = "result-text retry";
            }
        };

        recognition.onend = () => {
            isListening = false;
            btn.classList.remove('listening');
            if (resText.textContent === "きいています...") {
                resText.textContent = "もういちど マイクをおしてね";
                resText.className = "result-text retry";
            }
        };

        try {
            recognition.start();
        } catch(e) {
            resText.textContent = "エラーがおきました。もういちどおしてね。";
            resText.className = "result-text retry";
        }
    }, 800);
}

// ★正解判定時に「手動でつぎへ進む」ボタンを表示するように変更
function checkPronunciation(speech) {
    const wordData = gameLevels[currentLevelIdx].words[currentWordIdx];
    const resText = document.getElementById('result-text');
    const micBtn = document.getElementById('mic-btn');

    // カタカナそのものとの一致率を計算
    let maxSim = calculateSimilarity(speech, wordData.kata);
    
    // 追加したひらがな・英語・漢字のバリエーションとの一致率も計算して、一番高いものを採用
    if (wordData.accepts) {
        wordData.accepts.forEach(acc => {
            const sim = calculateSimilarity(speech, acc);
            if (sim > maxSim) maxSim = sim;
        });
    }

    console.log(`Speech: ${speech}, Max Similarity: ${maxSim}%`);

    if (maxSim >= 80) {
        resText.textContent = "合格！ (Excellent!)";
        resText.className = "result-text success";
        
        // 正解の音を鳴らす
        SOUND_CORRECT.currentTime = 0;
        SOUND_CORRECT.play();
        
        // ★自動で進まず、手動で「つぎへ」ボタンを表示する（フリーズ完全対策）
        micBtn.style.display = 'none'; // マイクを隠す
        
        let nextBtn = document.getElementById('tc-next-btn-dynamic');
        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'tc-next-btn-dynamic';
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
            
            micBtn.parentNode.insertBefore(nextBtn, micBtn.nextSibling);
        }
        
        nextBtn.innerHTML = 'つぎへすすむ <i class="fa-solid fa-arrow-right"></i>';
        nextBtn.style.display = 'inline-block';
        nextBtn.onclick = () => {
            // 次へ進むときにマイクを確実に強制停止
            if (recognition) { try { recognition.abort(); } catch(e){} recognition = null; }
            nextStep();
        };

    } else {
        resText.textContent = "おしい！もういちど。";
        resText.className = "result-text retry";
        
        // 不正解の音を鳴らす
        SOUND_INCORRECT.currentTime = 0;
        SOUND_INCORRECT.play();
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

// 類似度計算アルゴリズム
function calculateSimilarity(s1, s2) {
    const cleanS1 = s1.replace(/[\s、。！？]/g, '');
    const cleanS2 = s2.replace(/[\s、。！？]/g, '');
    
    if (cleanS1 === cleanS2) return 100;
    if (!cleanS1 || !cleanS2) return 0;
    
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

function showScreen(id) {
    // 画面切り替え時にマイクを強制停止
    if (recognition) { try { recognition.abort(); } catch(e){} recognition = null; }
    isListening = false;
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goHome() {
    showScreen('screen-modes');
}