const synth = window.speechSynthesis;
    let voices = [];
    synth.onvoiceschanged = () => { voices = synth.getVoices(); };

    // --- データ ---
    const kanjiList = [
        { "kanji": "一", "kun": "ひと", "on": "いち", "meaning": "One" },
        { "kanji": "二", "kun": "ふた", "on": "に", "meaning": "Two" },
        { "kanji": "三", "kun": "み", "on": "さん", "meaning": "Three" },
        { "kanji": "四", "kun": "よ・よん", "on": "し", "meaning": "Four" },
        { "kanji": "五", "kun": "いつ", "on": "ご", "meaning": "Five" },
        { "kanji": "六", "kun": "む", "on": "ろく", "meaning": "Six" },
        { "kanji": "七", "kun": "なな", "on": "しち", "meaning": "Seven" },
        { "kanji": "八", "kun": "や", "on": "はち", "meaning": "Eight" },
        { "kanji": "九", "kun": "ここの", "on": "く・きゅう", "meaning": "Nine" },
        { "kanji": "十", "kun": "とお", "on": "じゅう", "meaning": "Ten" },
        { "kanji": "百", "kun": "もも", "on": "ひゃく", "meaning": "Hundred" },
        { "kanji": "千", "kun": "ち", "on": "せん", "meaning": "Thousand" },
        { "kanji": "万", "kun": "よろず", "on": "まん", "meaning": "Ten Thousand" },
        { "kanji": "円", "kun": "まる", "on": "えん", "meaning": "Yen, Circle" },
        { "kanji": "年", "kun": "とし", "on": "ねん", "meaning": "Year" },
        { "kanji": "月", "kun": "つき", "on": "げつ・がつ", "meaning": "Month, Moon" },
        { "kanji": "日", "kun": "ひ・か", "on": "にち・じつ", "meaning": "Day, Sun" },
        { "kanji": "火", "kun": "ひ", "on": "か", "meaning": "Fire" },
        { "kanji": "水", "kun": "みず", "on": "すい", "meaning": "Water" },
        { "kanji": "木", "kun": "き", "on": "もく・ぼく", "meaning": "Tree, Wood" },
        { "kanji": "金", "kun": "かね", "on": "きん", "meaning": "Gold, Money" },
        { "kanji": "土", "kun": "つち", "on": "ど", "meaning": "Earth, Soil" },
        { "kanji": "山", "kun": "やま", "on": "さん", "meaning": "Mountain" },
        { "kanji": "川", "kun": "かわ", "on": "せん", "meaning": "River" },
        { "kanji": "田", "kun": "た", "on": "でん", "meaning": "Rice field" },
        { "kanji": "人", "kun": "ひと", "on": "じん・にん", "meaning": "Person" },
        { "kanji": "大", "kun": "おお", "on": "だい・たい", "meaning": "Big, Large" },
        { "kanji": "小", "kun": "ちい", "on": "しょう", "meaning": "Small, Little" },
        { "kanji": "上", "kun": "うえ・あ", "on": "じょう", "meaning": "Up, Above" },
        { "kanji": "下", "kun": "した・さ", "on": "か・げ", "meaning": "Down, Below" },
        { "kanji": "口", "kun": "くち", "on": "こう・く", "meaning": "Mouth" },
        { "kanji": "耳", "kun": "みみ", "on": "じ", "meaning": "Ear" },
        { "kanji": "手", "kun": "て", "on": "しゅ", "meaning": "Hand" },
        { "kanji": "目", "kun": "め", "on": "もく", "meaning": "Eye" },
        { "kanji": "力", "kun": "ちから", "on": "りょく・りき", "meaning": "Power, Strength" },
        { "kanji": "父", "kun": "ちち", "on": "ふ", "meaning": "Father" },
        { "kanji": "母", "kun": "はは", "on": "ぼ", "meaning": "Mother" },
        { "kanji": "子", "kun": "こ", "on": "し・す", "meaning": "Child" },
        { "kanji": "女", "kun": "おんな", "on": "じょ・にょ", "meaning": "Woman" },
        { "kanji": "男", "kun": "おとこ", "on": "だん・なん", "meaning": "Man" },
        { "kanji": "先", "kun": "さき", "on": "せん", "meaning": "Ahead, Previous" },
        { "kanji": "生", "kun": "い・う・なま", "on": "せい・しょう", "meaning": "Life, Birth" },
        { "kanji": "学", "kun": "まな", "on": "がく", "meaning": "Study, Learning" },
        { "kanji": "校", "kun": "なし", "on": "こう", "meaning": "School" },
        { "kanji": "文", "kun": "ふみ", "on": "ぶん・もん", "meaning": "Sentence, Writing" },
        { "kanji": "字", "kun": "あざ", "on": "じ", "meaning": "Character, Letter" },
        { "kanji": "語", "kun": "かた", "on": "ご", "meaning": "Word, Language" },
        { "kanji": "前", "kun": "まえ", "on": "ぜん", "meaning": "Before, Front" },
        { "kanji": "後", "kun": "のち・うし・あと", "on": "ご・こう", "meaning": "After, Back" },
        { "kanji": "外", "kun": "そと・ほか", "on": "がい・げ", "meaning": "Outside" },
        { "kanji": "右", "kun": "みぎ", "on": "う・ゆう", "meaning": "Right" },
        { "kanji": "左", "kun": "ひだり", "on": "さ", "meaning": "Left" },
        { "kanji": "入", "kun": "い・はい", "on": "にゅう・じゅ", "meaning": "Enter, Insert" },
        { "kanji": "出", "kun": "で・だ", "on": "しゅつ・すい", "meaning": "Go out, Exit" },
        { "kanji": "立", "kun": "た", "on": "りつ・りゅう", "meaning": "Stand" },
        { "kanji": "休", "kun": "やす", "on": "きゅう", "meaning": "Rest, Day off" },
        { "kanji": "見", "kun": "み", "on": "けん", "meaning": "See, Look" },
        { "kanji": "行", "kun": "い・ゆ", "on": "こう・ぎょう", "meaning": "Go, Travel" },
        { "kanji": "来", "kun": "く・きた", "on": "らい", "meaning": "Come, Next" },
        { "kanji": "気", "kun": "なし", "on": "き・け", "meaning": "Spirit, Air, Mood" },
        { "kanji": "空", "kun": "そら・あ・から", "on": "くう", "meaning": "Sky, Empty" },
        { "kanji": "天", "kun": "あめ・あま", "on": "てん", "meaning": "Heaven, Sky" },
        { "kanji": "雨", "kun": "あめ・あま", "on": "う", "meaning": "Rain" },
        { "kanji": "早", "kun": "はや", "on": "そう", "meaning": "Early" },
        { "kanji": "草", "kun": "くさ", "on": "そう", "meaning": "Grass" },
        { "kanji": "虫", "kun": "むし", "on": "ちゅう", "meaning": "Insect" },
        { "kanji": "犬", "kun": "いぬ", "on": "けん", "meaning": "Dog" },
        { "kanji": "竹", "kun": "たけ", "on": "ちく", "meaning": "Bamboo" },
        { "kanji": "林", "kun": "はやし", "on": "りん", "meaning": "Woods" },
        { "kanji": "森", "kun": "もり", "on": "しん", "meaning": "Forest" },
        { "kanji": "石", "kun": "いし", "on": "せき", "meaning": "Stone" },
        { "kanji": "王", "kun": "なし", "on": "おう", "meaning": "King" },
        { "kanji": "玉", "kun": "たま", "on": "ぎょく", "meaning": "Ball, Jewel" },
        { "kanji": "車", "kun": "くるま", "on": "しゃ", "meaning": "Car, Vehicle" },
        { "kanji": "町", "kun": "まち", "on": "ちょう", "meaning": "Town, Village" },
        { "kanji": "村", "kun": "むら", "on": "そん", "meaning": "Village" },
        { "kanji": "音", "kun": "おと・ね", "on": "おん", "meaning": "Sound" },
        { "kanji": "糸", "kun": "いと", "on": "し", "meaning": "Thread" },
        { "kanji": "中", "kun": "なか", "on": "ちゅう", "meaning": "Middle, Inside" },
        { "kanji": "北", "kun": "きた", "on": "ほく", "meaning": "North" },
        { "kanji": "南", "kun": "みなみ", "on": "なん", "meaning": "South" },
        { "kanji": "西", "kun": "にし", "on": "せい・さい", "meaning": "West" },
        { "kanji": "東", "kun": "ひがし", "on": "とう", "meaning": "East" },
        { "kanji": "本", "kun": "もと", "on": "ほん", "meaning": "Book, Origin" },
        { "kanji": "名", "kun": "な", "on": "めい・みょう", "meaning": "Name" },
        { "kanji": "足", "kun": "あし", "on": "そく", "meaning": "Foot, Leg" },
        { "kanji": "赤", "kun": "あか", "on": "せき・しゃく", "meaning": "Red" },
        { "kanji": "青", "kun": "あお", "on": "せい・しょう", "meaning": "Blue" },
        { "kanji": "白", "kun": "しろ", "on": "はく", "meaning": "White" }
    ];

    const grid = document.getElementById('kanji-grid');
    const modal = document.getElementById('practice-modal');
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');
    
    let isDrawing = false;
    let currentKanji = null;

    // --- 初期化 ---
    function init() {
        kanjiList.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'kanji-card';
            card.textContent = `
                <div class="kanji-char">${item.kanji}</div>
                <div class="kanji-meaning">${item.meaning}</div>
            `;
            card.onclick = () => openModal(item);
            grid.appendChild(card);
        });
        setupCanvas();
    }

    // --- 音声再生 ---
    window.playAudio = () => {
        if (!currentKanji) return;
        if (synth.speaking) synth.cancel();

        const onText = currentKanji.on !== 'なし' ? currentKanji.on : '';
        const kunText = currentKanji.kun !== 'なし' ? currentKanji.kun : '';
        
        // 読み上げテキスト: "漢字。音読み、〇〇。訓読み、〇〇。"
        const utterText = `${currentKanji.kanji}。音読み、${onText}。訓読み、${kunText}`;
        
        const utterThis = new SpeechSynthesisUtterance(utterText);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 0.9;
        
        // 女性声優先
        const femaleKeywords = ['Google', 'Microsoft', 'Kyoko', 'O-Ren', 'Haruka', 'Ayumi', 'Female'];
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        let targetVoice = null;
        for (const keyword of femaleKeywords) {
            targetVoice = jpVoices.find(v => v.name.includes(keyword));
            if (targetVoice) break;
        }
        if (targetVoice) utterThis.voice = targetVoice;
        
        synth.speak(utterThis);
    };

    // --- モーダル操作 ---
    window.openModal = (item) => {
        currentKanji = item;
        
        document.getElementById('info-on').textContent = item.on;
        document.getElementById('info-kun').textContent = item.kun;
        document.getElementById('info-mean').textContent = item.meaning;
        document.getElementById('guide-char').textContent = item.kanji;
        
        clearCanvas();
        modal.classList.add('active');
        
        // 自動再生はせず、ユーザーがボタンを押す形式にしています
    };

    window.closeModal = () => {
        modal.classList.remove('active');
        currentKanji = null;
    };

    // --- キャンバスロジック ---
    function setupCanvas() {
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseout', stopDraw);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDraw(e.touches[0]);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e.touches[0]);
        }, { passive: false });
        canvas.addEventListener('touchend', stopDraw);
    }

    function startDraw(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#333';
        ctx.globalAlpha = 0.8;

        ctx.beginPath();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        ctx.moveTo(x, y);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDraw() {
        isDrawing = false;
        ctx.closePath();
    }

    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    window.finishPractice = () => {
        // ★修正点：1ポイント加算
        if (window.addPoints) {
            window.addPoints(1);
        }
        
        const btn = document.querySelector('.btn-done');
        const originalText = btn.textContent;
        btn.innerHTML = '<i class="fa-solid fa-star"></i> すごい！';
        btn.style.background = '#ff9800';
        
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#4caf50';
            }, 500);
        }, 800);
    };

    init();