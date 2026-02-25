// --- データ定義 ---
    const verbs = [
        { id: 'go', name: 'いきます', en: 'go', emoji: '➡️' },
        { id: 'come', name: 'きます', en: 'come', emoji: '⬅️' },
        { id: 'return', name: 'かえります', en: 'return', emoji: '🏠' }
    ];

    const transports = [
        { id: 'bus', name: 'バス', en: 'bus', emoji: '🚌', particle: 'で' },
        { id: 'train', name: 'でんしゃ', en: 'train', emoji: '🚃', particle: 'で' },
        { id: 'car', name: 'くるま', en: 'car', emoji: '🚗', particle: 'で' },
        { id: 'walk', name: 'あるいて', en: 'on foot', emoji: '🚶', particle: '' }, 
        { id: 'bicycle', name: 'じてんしゃ', en: 'bicycle', emoji: '🚲', particle: 'で' },
        { id: 'taxi', name: 'タクシー', en: 'taxi', emoji: '🚕', particle: 'で' },
        { id: 'shinkansen', name: 'しんかんせん', en: 'Shinkansen', emoji: '🚅', particle: 'で' },
        { id: 'plane', name: 'ひこうき', en: 'plane', emoji: '✈️', particle: 'で' },
        { id: 'ship', name: 'ふね', en: 'ship', emoji: '🚢', particle: 'で' }
    ];

    const places = [
        { id: 'school', name: 'がっこう', en: 'school', emoji: '🏫' },
        { id: 'hospital', name: 'びょういん', en: 'hospital', emoji: '🏥' },
        { id: 'restaurant', name: 'レストラン', en: 'restaurant', emoji: '🍽️' },
        { id: 'bank', name: 'ぎんこう', en: 'bank', emoji: '🏦' },
        { id: 'home', name: 'うち', en: 'home', emoji: '🏠' },
        { id: 'park', name: 'こうえん', en: 'park', emoji: '🛝' },
        { id: 'station', name: 'えき', en: 'station', emoji: '🚉' },
        { id: 'supermarket', name: 'スーパー', en: 'supermarket', emoji: '🛒' },
        { id: 'conbini', name: 'コンビニ', en: 'convenience store', emoji: '🏪' }
    ];

    const people = [
        { id: 'me', name: 'わたし', en: 'I', emoji: '😊' },
        { id: 'you', name: 'あなた', en: 'You', emoji: '🫵' },
        { id: 'teacher', name: 'せんせい', en: 'Teacher', emoji: '👩‍🏫' },
        { id: 'father', name: 'おとうさん', en: 'Father', emoji: '👨' },
        { id: 'mother', name: 'おかあさん', en: 'Mother', emoji: '👩' },
        { id: 'friend', name: 'ともだち', en: 'Friend', emoji: '👫' }
    ];

    // --- 共通関数 ---
    function speak(text) {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'ja-JP';
        ut.rate = 0.9;
        window.speechSynthesis.speak(ut);
    }
    function playSeikai() { new Audio('assets/sounds/seikai.mp3').play().catch(()=>{}); }
    function playBubu() { new Audio('assets/sounds/bubu.mp3').play().catch(()=>{}); }

    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-' + screenId).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        if(event && event.target) event.target.classList.add('active');
        
        if (screenId === 'study') initStudy();
        if (screenId === 'game1') initGame1();
        if (screenId === 'game2') initGame2();
        if (screenId === 'game3') initGame3();
        if (screenId === 'game4') initGame4();
    }

    function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

    // --- Study Mode ---
    function initStudy() {
        renderGrid('grid-people', people);
        renderGrid('grid-transport', transports);
        renderGrid('grid-place', places);
        renderGrid('grid-verb', verbs);
    }

    function renderGrid(elemId, dataList) {
        const container = document.getElementById(elemId);
        container.textContent = '';
        dataList.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card';
            div.textContent = `<div class="emoji-img">${item.emoji}</div><span>${item.name}</span>`;
            div.onclick = () => speak(item.name);
            container.appendChild(div);
        });
    }

    // --- Game 1 ---
    let g1Answer = [], g1CurrentId = "";
    
    function initGame1() {
        document.getElementById('feedback-game1').innerText = '';
        document.getElementById('area-game1').textContent = '';
        
        const sub = getRandom(people);
        const plc = getRandom(places);
        const vrb = getRandom(verbs);

        // ID生成 (例: g1_me_school_go)
        g1CurrentId = `g1_${sub.id}_${plc.id}_${vrb.id}`;

        let enVerb = vrb.en;
        if(sub.id !== 'me' && sub.id !== 'you' && sub.id !== 'friend') enVerb += 's'; 
        if(sub.id === 'you' || sub.id === 'friend' || sub.id === 'me') enVerb = vrb.en;
        document.getElementById('q1-text').innerText = `${sub.en} ${enVerb} to ${plc.en}.`;
        
        const parts = [
            { text: sub.name + 'は', type: 'sub' },
            { text: plc.name + 'に', type: 'plc' }, 
            { text: vrb.name, type: 'vrb' }
        ];
        g1Answer = parts.map(p => p.text).join('');

        const pool = document.getElementById('pool-game1');
        pool.textContent = '';
        shuffle([...parts]).forEach(p => {
            const btn = document.createElement('div');
            btn.className = 'word-block';
            btn.innerText = p.text;
            btn.onclick = () => moveBlock(btn, 'pool-game1', 'area-game1');
            pool.appendChild(btn);
        });
    }

    function moveBlock(el, fromId, toId) {
        const parent = el.parentNode;
        if(parent.id === fromId) document.getElementById(toId).appendChild(el);
        else document.getElementById(fromId).appendChild(el);
        speak(el.innerText);
    }

    function checkGame1() {
        const blocks = document.querySelectorAll('#area-game1 .word-block');
        let userAnswer = "";
        blocks.forEach(b => userAnswer += b.innerText);
        const fb = document.getElementById('feedback-game1');
        if (userAnswer === g1Answer) {
            fb.innerText = "⭕️ せいかい！";
            fb.style.color = "var(--correct-color)";
            playSeikai();
            if(window.addPointsToUser) window.addPointsToUser(g1CurrentId);
            setTimeout(() => initGame1(), 2000);
        } else {
            fb.innerText = "❌ ちがいます...";
            fb.style.color = "var(--incorrect-color)";
            playBubu();
        }
    }

    // --- Game 2 ---
    let g2Target, g2CurrentId = "";
    let g2IsCorrectCase;

    function initGame2() {
        resetGameUI('game2');
        g2Target = getRandom(places);
        g2IsCorrectCase = Math.random() > 0.5;
        
        // ID生成 (例: g2_school_yes または g2_school_no)
        g2CurrentId = `g2_${g2Target.id}_${g2IsCorrectCase ? 'yes' : 'no'}`;

        document.getElementById('img-game2').innerText = g2Target.emoji;

        let qText = "";
        if (g2IsCorrectCase) {
            qText = `${g2Target.name} に いきますか？`;
        } else {
            let wrong;
            do { wrong = getRandom(places); } while(wrong.id === g2Target.id);
            qText = `${wrong.name} に いきますか？`;
        }
        document.getElementById('q2-text').innerText = qText;
        speak(qText);
    }

    function answerGame2(isYes) {
        const fb = document.getElementById('feedback-game2');
        if ( (g2IsCorrectCase && isYes) || (!g2IsCorrectCase && !isYes) ) {
            if(isYes) {
                fb.innerText = `⭕️ はい、${g2Target.name} に いきます。`;
                fb.style.color = "var(--correct-color)";
                playSeikai();
                if(window.addPointsToUser) window.addPointsToUser(g2CurrentId);
                setTimeout(() => initGame2(), 2000);
            } else {
                playSeikai();
                setTimeout(() => showFixQuestion2(), 1000);
            }
            disableYesNo('game2');
        } else {
            fb.innerText = "❌ ちがいます...";
            fb.style.color = "var(--incorrect-color)";
            playBubu();
        }
    }

    function showFixQuestion2() {
        const fixArea = document.getElementById('area-fix-game2');
        fixArea.style.display = 'block';
        const optsDiv = document.getElementById('opts-game2');
        optsDiv.textContent = '';
        
        let dummy = getRandom(places);
        while(dummy.id === g2Target.id) dummy = getRandom(places);
        
        const choices = shuffle([g2Target, dummy]);
        choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = c.name;
            btn.onclick = () => {
                if(c.id === g2Target.id) {
                    document.getElementById('feedback-game2').innerText = `⭕️ せいかい！ ${g2Target.name} に いきます。`;
                    playSeikai();
                    if(window.addPointsToUser) window.addPointsToUser(g2CurrentId);
                    optsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
                    setTimeout(() => initGame2(), 2000);
                } else {
                    playBubu();
                }
            };
            optsDiv.appendChild(btn);
        });
        speak("どこへ いきますか？");
    }

    // --- Game 3 ---
    let g3Target, g3CurrentId = "";
    let g3IsCorrectCase;

    function initGame3() {
        resetGameUI('game3');
        g3Target = getRandom(transports);
        g3IsCorrectCase = Math.random() > 0.5;
        g3CurrentId = `g3_${g3Target.id}_${g3IsCorrectCase ? 'yes' : 'no'}`;

        document.getElementById('img-game3').innerText = g3Target.emoji;

        let targetWord = g3Target.name + (g3Target.particle || '');
        let qText = "";
        if (g3IsCorrectCase) {
            qText = `${targetWord} いきますか？`;
        } else {
            let wrong;
            do { wrong = getRandom(transports); } while(wrong.id === g3Target.id);
            let wrongWord = wrong.name + (wrong.particle || '');
            qText = `${wrongWord} いきますか？`;
        }
        document.getElementById('q3-text').innerText = qText;
        speak(qText);
    }

    function answerGame3(isYes) {
        const fb = document.getElementById('feedback-game3');
        let targetWord = g3Target.name + (g3Target.particle || '');

        if ( (g3IsCorrectCase && isYes) || (!g3IsCorrectCase && !isYes) ) {
            if(isYes) {
                fb.innerText = `⭕️ はい、${targetWord} いきます。`;
                fb.style.color = "var(--correct-color)";
                playSeikai();
                if(window.addPointsToUser) window.addPointsToUser(g3CurrentId);
                setTimeout(() => initGame3(), 2000);
            } else {
                playSeikai();
                setTimeout(() => showFixQuestion3(), 1000);
            }
            disableYesNo('game3');
        } else {
            fb.innerText = "❌ ちがいます...";
            fb.style.color = "var(--incorrect-color)";
            playBubu();
        }
    }

    function showFixQuestion3() {
        document.getElementById('area-fix-game3').style.display = 'block';
        const optsDiv = document.getElementById('opts-game3');
        optsDiv.textContent = '';
        
        let dummy = getRandom(transports);
        while(dummy.id === g3Target.id) dummy = getRandom(transports);
        
        const choices = shuffle([g3Target, dummy]);
        choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = c.name;
            btn.onclick = () => {
                if(c.id === g3Target.id) {
                    let text = c.name + (c.particle || '');
                    document.getElementById('feedback-game3').innerText = `⭕️ せいかい！ ${text} いきます。`;
                    playSeikai();
                    if(window.addPointsToUser) window.addPointsToUser(g3CurrentId);
                    optsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
                    setTimeout(() => initGame3(), 2000);
                } else {
                    playBubu();
                }
            };
            optsDiv.appendChild(btn);
        });
        speak("どうやって いきますか？");
    }

    // --- Game 4 ---
    let g4Answer = "", g4CurrentId = "";

    function initGame4() {
        document.getElementById('feedback-game4').innerText = '';
        document.getElementById('area-game4').textContent = '';

        const sub = getRandom(people);
        const trn = getRandom(transports);
        const plc = getRandom(places);
        const vrb = getRandom(verbs);

        // ID生成 (例: g4_me_bus_school_go)
        g4CurrentId = `g4_${sub.id}_${trn.id}_${plc.id}_${vrb.id}`;

        let enVerb = vrb.en;
        if(sub.id !== 'me' && sub.id !== 'you') enVerb += 's';
        let enTrn = trn.id === 'walk' ? 'on foot' : `by ${trn.en}`;
        
        const enText = `${sub.en} ${enVerb} to ${plc.en} ${enTrn}.`;
        document.getElementById('q4-text').innerText = enText;
        
        const p1 = sub.name + 'は';
        const p2 = trn.name + (trn.particle || '');
        const p3 = plc.name + 'に';
        const p4 = vrb.name;

        g4Answer = p1 + p2 + p3 + p4;

        const parts = [p1, p2, p3, p4];
        const pool = document.getElementById('pool-game4');
        pool.textContent = '';
        shuffle(parts).forEach(txt => {
            const btn = document.createElement('div');
            btn.className = 'word-block';
            btn.innerText = txt;
            btn.onclick = () => moveBlock(btn, 'pool-game4', 'area-game4');
            pool.appendChild(btn);
        });
    }

    function checkGame4() {
        const blocks = document.querySelectorAll('#area-game4 .word-block');
        let userAnswer = "";
        blocks.forEach(b => userAnswer += b.innerText);
        const fb = document.getElementById('feedback-game4');
        if (userAnswer === g4Answer) {
            fb.innerText = "⭕️ かんぺきです！";
            fb.style.color = "var(--correct-color)";
            playSeikai();
            if(window.addPointsToUser) window.addPointsToUser(g4CurrentId);
            setTimeout(() => initGame4(), 2000);
        } else {
            fb.innerText = "❌ おしい！";
            fb.style.color = "var(--incorrect-color)";
            playBubu();
        }
    }

    function resetGameUI(gameId) {
        const yesBtn = document.getElementById(`g${gameId.slice(-1)}-yes`);
        const noBtn = document.getElementById(`g${gameId.slice(-1)}-no`);
        yesBtn.disabled = false; noBtn.disabled = false;
        document.getElementById(`area-fix-${gameId}`).style.display = 'none';
        document.getElementById(`feedback-${gameId}`).innerText = '';
    }
    function disableYesNo(gameId) {
        const yesBtn = document.getElementById(`g${gameId.slice(-1)}-yes`);
        const noBtn = document.getElementById(`g${gameId.slice(-1)}-no`);
        yesBtn.disabled = true; noBtn.disabled = true;
    }

    initStudy();