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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.continuous = false;
    }

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
    }

    function startSpeechRecognition() {
        if (!recognition) {
            alert("お使いのブラウザは音声認識に対応していません。");
            return;
        }

        // すでに録音中の場合は停止する（マイクのトグル機能）
        if (isListening) {
            recognition.stop();
            return;
        }

        // 【高速化の秘訣1】iPadは直前の音声(TTSなど)が残っているとマイクの起動が遅れるため、強制リセット
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        isListening = true;
        const btn = document.getElementById('mic-btn');
        const resText = document.getElementById('result-text');
        
        btn.classList.add('listening');
        resText.textContent = "きいています...";
        resText.className = "result-text";

        // 【高速化の秘訣2】連続認識をオフにし、選択肢も1つに絞ってサーバー通信を最軽量化
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        try {
            recognition.start();
        } catch (e) {
            console.error("マイク起動エラー:", e);
        }

        // 【高速化の秘訣3】iPad特有の「話し終わってからの長い沈黙(2〜3秒)」をカット！
        // ユーザーが話し終わったと検知した瞬間に、強制的に音声認識を終了させて結果を急がせます。
        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onresult = (event) => {
            // 【高速化の秘訣4】結果が出たらすぐにマイクを完全にオフにする
            recognition.stop();
            
            const transcript = event.results[0][0].transcript;
            document.getElementById('transcript-text').textContent = `ききとった言葉: 「${transcript}」`;
            checkPronunciation(transcript);
        };

        recognition.onend = () => {
            isListening = false;
            btn.classList.remove('listening');
            
            // 何も聞き取れずに終了した場合のフォロー（iPadでよく起こる現象の対策）
            if (resText.textContent === "きいています...") {
                resText.textContent = "もういちど マイクをおしてね";
                resText.className = "result-text retry";
            }
        };

        recognition.onerror = (event) => {
            isListening = false;
            btn.classList.remove('listening');
            // ユーザーが意図的に中断した時以外のエラーを表示
            if (event.error !== 'aborted') {
                resText.textContent = "うまくききとれませんでした。";
                resText.className = "result-text retry";
            }
        };
    }

    function checkPronunciation(speech) {
        const wordData = gameLevels[currentLevelIdx].words[currentWordIdx];
        const resText = document.getElementById('result-text');

        // ひらがなそのものとの一致率を計算
        let maxSim = calculateSimilarity(speech, wordData.hira);
        
        // 追加した漢字・カタカナのバリエーションとの一致率も計算して、一番高いものを採用
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
            
            // 正解の音を鳴らす (連続再生対策で currentTime を 0 にする)
            if(typeof SOUND_CORRECT !== 'undefined') {
                SOUND_CORRECT.currentTime = 0;
                SOUND_CORRECT.play();
            }
            
            setTimeout(() => {
                nextStep();
            }, 1500);
        } else {
            resText.textContent = "おしい！もういちど。";
            resText.className = "result-text retry";
            
            // 不正解の音を鳴らす
            if(typeof SOUND_INCORRECT !== 'undefined') {
                SOUND_INCORRECT.currentTime = 0;
                SOUND_INCORRECT.play();
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

    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    function goHome() {
        showScreen('screen-modes');
    }

    function goBack() {
        const playScr = document.getElementById('screen-play');
        const levelScr = document.getElementById('screen-levels');
        if (playScr.classList.contains('active')) showScreen('screen-levels');
        else if (levelScr.classList.contains('active')) showScreen('screen-modes');
    }