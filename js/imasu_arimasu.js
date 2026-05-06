// --- データ ---
    // Type 1 = います (Living), Type 0 = あります (Non-living)
    // isPerson = true の場合は「だれ」
    const wordsData = [
        { id: "w01", text: "せんせい", type: 1, isPerson: true, icon: "fa-user-tie" },
        { id: "w02", text: "がくせい", type: 1, isPerson: true, icon: "fa-user-graduate" },
        { id: "w03", text: "ねこ", type: 1, isPerson: false, icon: "fa-cat" },
        { id: "w04", text: "いぬ", type: 1, isPerson: false, icon: "fa-dog" },
        { id: "w05", text: "とり", type: 1, isPerson: false, icon: "fa-crow" },
        { id: "w06", text: "さかな", type: 1, isPerson: false, icon: "fa-fish" },
        { id: "w07", text: "ぞう", type: 1, isPerson: false, icon: "fa-elephant" },
        { id: "w08", text: "おとこのひと", type: 1, isPerson: true, icon: "fa-person" },
        { id: "w09", text: "おんなのひと", type: 1, isPerson: true, icon: "fa-person-dress" },
        { id: "w10", text: "おとこのこ", type: 1, isPerson: true, icon: "fa-child" },
        { id: "w11", text: "おんなのこ", type: 1, isPerson: true, icon: "fa-child-dress" },
        { id: "w12", text: "パンダ", type: 1, isPerson: false, icon: "fa-paw" },
        { id: "w13", text: "うさぎ", type: 1, isPerson: false, icon: "fa-paw" },
        { id: "w14", text: "うま", type: 1, isPerson: false, icon: "fa-horse" },
        { id: "w15", text: "うし", type: 1, isPerson: false, icon: "fa-cow" },
        { id: "w16", text: "むし", type: 1, isPerson: false, icon: "fa-bug" },
        { id: "w17", text: "かえる", type: 1, isPerson: false, icon: "fa-frog" },
        { id: "w18", text: "ともだち", type: 1, isPerson: true, icon: "fa-user-group" },
        { id: "w19", text: "かぞく", type: 1, isPerson: true, icon: "fa-people-roof" },
        { id: "w20", text: "あかちゃん", type: 1, isPerson: true, icon: "fa-baby" },
        { id: "w21", text: "ほん", type: 0, icon: "fa-book" },
        { id: "w22", text: "えんぴつ", type: 0, icon: "fa-pen" },
        { id: "w23", text: "つくえ", type: 0, icon: "fa-table" },
        { id: "w24", text: "いす", type: 0, icon: "fa-chair" },
        { id: "w25", text: "とけい", type: 0, icon: "fa-clock" },
        { id: "w26", text: "かばん", type: 0, icon: "fa-briefcase" },
        { id: "w27", text: "テレビ", type: 0, icon: "fa-tv" },
        { id: "w28", text: "くるま", type: 0, icon: "fa-car" },
        { id: "w29", text: "でんしゃ", type: 0, icon: "fa-train" },
        { id: "w30", text: "いえ", type: 0, icon: "fa-house" },
        { id: "w31", text: "き", type: 0, icon: "fa-tree" },
        { id: "w32", text: "はな", type: 0, icon: "fa-fan" },
        { id: "w33", text: "ケータイ", type: 0, icon: "fa-mobile" },
        { id: "w34", text: "パソコン", type: 0, icon: "fa-laptop" },
        { id: "w35", text: "くつ", type: 0, icon: "fa-shoe-prints" },
        { id: "w36", text: "ぼうし", type: 0, icon: "fa-hat-cowboy" },
        { id: "w37", text: "かさ", type: 0, icon: "fa-umbrella" },
        { id: "w38", text: "れいぞうこ", type: 0, icon: "fa-snowflake" },
        { id: "w39", text: "ベッド", type: 0, icon: "fa-bed" },
        { id: "w40", text: "おふろ", type: 0, icon: "fa-bath" }
    ];

    // --- 音声 ---
    const synth = window.speechSynthesis;
    let currentQuizObj = null; 

    function speak(text, callback) {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        utterThis.rate = 0.9;
        if(callback) utterThis.onend = () => callback();
        synth.speak(utterThis);
    }

    function playQuizAudio() {
        if(!currentQuizObj) return;
        if (quizLvl === 4 && currentQuizObj.answerKana) {
            // Level 4 は質問 → 答えの流れ
            speak(currentQuizObj.text, () => {
                setTimeout(() => {
                    speak(currentQuizObj.answerKana);
                }, 1500);
            });
        } else {
            speak(currentQuizObj.text);
        }
    }

    function grantDailyPoint(questId) {
        if (!window.currentUserId) return;
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `imasu_arimasu_points_${window.currentUserId}_${today}`;
        let answered = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (!answered.includes(questId)) {
            if(window.addPointsToUser) window.addPointsToUser(1);
            answered.push(questId);
            localStorage.setItem(storageKey, JSON.stringify(answered));
        }
    }

    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if(synth.speaking) synth.cancel();
    }
    window.showMenu = () => showScreen('menu-screen');

    function initWordLists() {
        const iList = document.getElementById('list-imasu');
        const aList = document.getElementById('list-arimasu');
        iList.textContent = ''; aList.textContent = '';
        wordsData.forEach(w => {
            const div = document.createElement('div');
            div.className = `word-card ${w.type === 1 ? 'imasu' : 'arimasu'}`;
            div.innerHTML = `<i class="fa-solid ${w.icon} word-icon" style="color:${w.type===1?'var(--imasu-color)':'var(--arimasu-color)'}"></i><div class="word-text">${w.text}</div>`;
            div.onclick = () => speak(w.text);
            if (w.type === 1) iList.appendChild(div);
            else aList.appendChild(div);
        });
    }

    // --- Level 1 Logic (Drag) ---
    let lvl1Queue = [];
    let currentWord = null;

    window.startLevel = (lvl) => {
        if (lvl === 1) {
            const shuffled = [...wordsData].sort(() => Math.random() - 0.5);
            lvl1Queue = shuffled.slice(0, 10);
            showScreen('level1-screen');
            nextLevel1Question();
        } else {
            startQuizLevel(lvl);
        }
    };

    window.nextLevel1Question = () => {
        if (lvl1Queue.length === 0) {
            alert("Level 1 クリア！");
            showMenu();
            return;
        }
        currentWord = lvl1Queue.pop();
        
        const old = document.querySelector('.center-piece');
        if (old) old.remove();

        const area = document.getElementById('drag-area');
        const piece = document.createElement('div');
        piece.className = 'center-piece';
        piece.textContent = currentWord.text;
        
        setTimeout(() => speak(currentWord.text), 300);
        
        setupCommonDrag(piece);
        area.appendChild(piece);
    };

    let dragGhost = null;
    function setupCommonDrag(el) {
        const handleStart = (e) => {
            e.preventDefault();
            speak(currentWord.text);
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            dragGhost = document.createElement('div');
            dragGhost.className = 'drag-ghost';
            dragGhost.textContent = el.textContent;
            dragGhost.style.border = el.style.border; 
            dragGhost.style.left = clientX + 'px';
            dragGhost.style.top = clientY + 'px';
            document.body.appendChild(dragGhost);
            
            el.style.opacity = '0'; 

            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', handleMove, {passive: false});
                document.addEventListener('touchend', handleEnd);
            } else {
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleEnd);
            }
        };

        const handleMove = (e) => {
            e.preventDefault();
            if (!dragGhost) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            dragGhost.style.left = clientX + 'px';
            dragGhost.style.top = clientY + 'px';
        };

        const handleEnd = (e) => {
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);

            const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

            if (dragGhost) dragGhost.remove();
            dragGhost = null;
            el.style.opacity = '1';

            const target = document.elementFromPoint(clientX, clientY);
            if (target) {
                const zone = target.closest('.drop-zone');
                if (zone) checkDrop(zone, el);
            }
        };

        el.addEventListener('touchstart', handleStart, {passive: false});
        el.addEventListener('mousedown', handleStart);
    }

    function checkDrop(zone, piece) {
        const isImasuZone = zone.id === 'zone-imasu';
        const isCorrect = (isImasuZone && currentWord.type === 1) || (!isImasuZone && currentWord.type === 0);
        showFeedback(isCorrect, currentWord, () => {
             document.getElementById('feedback-modal').style.display = 'none';
             nextLevel1Question();
        });
        if (isCorrect) grantDailyPoint(`lvl1_${currentWord.id}`);
    }

    // --- Quiz Logic (Dynamic Generation) ---
    let quizQueue = [];
    let quizNow = null;
    let quizLvl = 0;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Level 2 生成ロジック: ランダムな場所 + 適切な前置詞
    function generateLevel2() {
        const questions = [];
        const locations = [
            { text: "つくえ", icon: "fa-table", pos: ["うえ", "した"] },
            { text: "いす", icon: "fa-chair", pos: ["うえ", "した"] },
            { text: "かばん", icon: "fa-briefcase", pos: ["なか"] },
            { text: "はこ", icon: "fa-box-open", pos: ["なか", "うえ"] }, 
            { text: "へや", icon: "fa-door-open", pos: ["なか"] },
            { text: "ベッド", icon: "fa-bed", pos: ["うえ", "した"] },
            { text: "れいぞうこ", icon: "fa-snowflake", pos: ["なか"] }
        ];

        for(let i=0; i<10; i++) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const pos = loc.pos[Math.floor(Math.random() * loc.pos.length)];
            
            // ターゲット（正解）を選ぶ
            const target = wordsData[Math.floor(Math.random() * wordsData.length)];
            const verb = target.type === 1 ? "います" : "あります";

            // 選択肢作成 (正解 + ダミー3つ)
            const others = shuffle(wordsData.filter(w => w.id !== target.id)).slice(0, 3);
            const options = shuffle([target, ...others]).map(w => w.text);
            const correctIdx = options.indexOf(target.text);

            questions.push({
                text: `${loc.text}の ${pos}に なにが ${verb}か？`,
                icon: target.icon, // 正解のターゲットアイコンを表示
                options: options,
                correct: correctIdx,
                targetWord: target 
            });
        }
        return questions;
    }

    // Level 3 生成ロジック: だれが/なにが いますか/ありますか ランダム
    function generateLevel3() {
        const questions = [];
        for(let i=0; i<10; i++) {
            const target = wordsData[Math.floor(Math.random() * wordsData.length)];
            const verb = target.type === 1 ? "います" : "あります";
            
            // ★修正: 人なら「だれ」、動物/物なら「なに」
            let qWord = "なに";
            if (target.type === 1 && target.isPerson) {
                qWord = "だれ";
            }

            // 選択肢作成
            const others = shuffle(wordsData.filter(w => w.id !== target.id)).slice(0, 3);
            const options = shuffle([target, ...others]).map(w => w.text);
            const correctIdx = options.indexOf(target.text);

            questions.push({
                text: `あそこに ${qWord}が ${verb}か？`,
                icon: target.icon, 
                options: options,
                correct: correctIdx,
                targetWord: target
            });
        }
        return questions;
    }

    // Level 4 生成ロジック: 場所と階数をランダム
    function generateLevel4() {
        const questions = [];
        const places = ["トイレ", "じむしょ", "しょくどう", "かいぎしつ", "うけつけ", "ロビー", "エレベーター"];
        const floors = ["1かい", "2かい", "3かい", "4かい", "5かい", "ちか1かい"];
        
        for(let i=0; i<10; i++) {
            const place = places[Math.floor(Math.random() * places.length)];
            const correctFloor = floors[Math.floor(Math.random() * floors.length)];
            
            // 選択肢 (正解 + ランダム3つ)
            const otherFloors = shuffle(floors.filter(f => f !== correctFloor)).slice(0, 3);
            const options = shuffle([correctFloor, ...otherFloors]);
            const correctIdx = options.indexOf(correctFloor);

            questions.push({
                text: `${place}は なんがい ですか？`,
                answerKana: `${place}は... ${correctFloor}に あります。`,
                icon: "fa-building",
                options: options,
                correct: correctIdx,
                targetWord: { text: correctFloor, icon: "fa-building" } 
            });
        }
        return questions;
    }

    function startQuizLevel(lvl) {
        quizLvl = lvl;
        if (lvl === 2) quizQueue = generateLevel2();
        else if (lvl === 3) quizQueue = generateLevel3();
        else if (lvl === 4) quizQueue = generateLevel4();

        showScreen('quiz-screen');
        document.getElementById('quiz-title').textContent = `Level ${lvl}`;
        const imgArea = document.getElementById('quiz-img');
        
        // ★修正: 前回Level 2に適用していた縮小クラスを削除
        imgArea.classList.remove('small-img');

        nextQuizQuestion();
    }

    function nextQuizQuestion() {
        if (quizQueue.length === 0) {
            alert(`Level ${quizLvl} クリア！`);
            showMenu();
            return;
        }
        quizNow = quizQueue.pop();
        currentQuizObj = quizNow; 
        
        const imgArea = document.getElementById('quiz-img');
        
        const iconColor = (quizNow.targetWord && quizNow.targetWord.type === 1) ? 'var(--imasu-color)' : 
                          (quizNow.targetWord && quizNow.targetWord.type === 0) ? 'var(--arimasu-color)' : '#555';
        
        imgArea.innerHTML = `<i class="fa-solid ${quizNow.icon}" style="color:${iconColor}"></i>`;
        
        document.getElementById('quiz-question').textContent = quizNow.text;

        playQuizAudio();
        
        const optsDiv = document.getElementById('quiz-options');
        optsDiv.textContent = '';
        quizNow.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => checkQuiz(idx, btn);
            optsDiv.appendChild(btn);
        });
    }

    function checkQuiz(idx, btn) {
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.disabled = true);
        const isCorrect = idx === quizNow.correct;
        
        if (isCorrect) {
            btn.classList.add('correct');
            grantDailyPoint(`lvl${quizLvl}_q`);
        } else {
            btn.classList.add('wrong');
            btns[quizNow.correct].classList.add('correct');
        }

        // Level 4 は答えの音声を流す
        if (quizLvl === 4) {
            setTimeout(() => speak(quizNow.answerKana), 200);
        }

        setTimeout(nextQuizQuestion, 2500); 
    }

    let onNextAction = null;
    window.nextQuestionAction = () => { if(onNextAction) onNextAction(); };

    function showFeedback(isCorrect, word, callback) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('fb-icon');
        const wText = document.getElementById('fb-word');
        const msg = document.getElementById('fb-msg');
        icon.innerHTML = `<i class="fa-solid ${word.icon}" style="color:${word.type===1?'var(--imasu-color)':'var(--arimasu-color)'}"></i>`;
        wText.textContent = word.text;
        if (isCorrect) {
            msg.textContent = "せいかい！ (Correct!)";
            msg.style.color = "#28a745";
        } else {
            msg.textContent = word.type === 1 ? "正解は「います」です" : "正解は「あります」です";
            msg.style.color = "#dc3545";
        }
        onNextAction = callback;
        modal.style.display = 'flex';
    }

    initWordLists();