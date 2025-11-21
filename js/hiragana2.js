document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ 設定 & ポイントシステム ★★★
    // ----------------------------------------------------
    const GAME_ID = 'hiragana_sort_game';
    const USER_STORAGE_KEY = 'user_accounts';
    const SESSION_STORAGE_KEY = 'current_user';
    const GUEST_NAME = 'ゲスト'; 

    // DOM要素
    const MENU_AREA = document.getElementById('main-menu-2');
    const GAME_AREA = document.getElementById('game-area-2');
    const START_BTN = document.getElementById('startButtonGame2');
    const IMAGE_AREA = document.getElementById('image-area');
    const ANSWER_CONTAINER = document.getElementById('answer-container');
    const POOL_CONTAINER = document.getElementById('pool-container');
    const CHECK_BTN = document.getElementById('checkButton');
    const FEEDBACK = document.getElementById('feedback');
    const TURN_MSG = document.getElementById('turn-msg');
    const SCORE_VAL = document.getElementById('score-val');

    // 音声
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 
    const SOUND_POP = new Audio('assets/sounds/pop.mp3'); // (無ければ削除可)

    // ★★★ データ (JSONを使わず直接記述) ★★★
    // reading: ひらがな読み (並び替えの正解)
    const gameData = [
        { id: 1, word: 'りんご', reading: 'りんご', image: 'apple.png' },
        { id: 2, word: 'くるま', reading: 'くるま', image: 'car.png' },
        { id: 3, word: 'さかな', reading: 'さかな', image: 'fish.png' },
        { id: 4, word: 'えんぴつ', reading: 'えんぴつ', image: 'stationery/enpitsu.png' },
        { id: 5, word: 'はさみ', reading: 'はさみ', image: 'stationery/hasami.png' },
        { id: 6, word: 'とけい', reading: 'とけい', image: 'clock.png' },
        { id: 7, word: 'めがね', reading: 'めがね', image: 'clothing/glasses.png' },
        { id: 8, word: 'ぼうし', reading: 'ぼうし', image: 'clothing/hat.png' },
        { id: 9, word: 'つくえ', reading: 'つくえ', image: 'room/desk.png' },
        { id: 10, word: 'いす', reading: 'いす', image: 'room/chair.png' }
    ];

    // ゲーム状態
    let currentWord = null;
    let score = 0;
    let questionCount = 0;
    const MAX_QUESTIONS = 10;
    let askedWordIds = new Set();
    
    // ドラッグ用
    let currentDragItem = null;

    // ポイント付与
    function getTodayDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }
    function checkAndAwardPoints(wordId) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!currentUser || currentUser === GUEST_NAME) return "guest"; 
        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 
        const today = getTodayDateString();
        const progressKey = `${GAME_ID}_word_${wordId}`;
        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};
        if (user.progress[progressKey][today] === true) return "already_scored"; 
        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        return "scored"; 
    }

    // 1. ゲーム開始
    if(START_BTN) {
        START_BTN.addEventListener('click', startGameLogic);
    }
    
    function startGameLogic() {
        if (gameData.length < 1) {
            alert('データがありません');
            return;
        }
        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';
        
        score = 0;
        questionCount = 0;
        askedWordIds.clear();
        updateScoreBoard();
        showNextQuestion();
    }

    // 2. 次の問題
    function showNextQuestion() {
        if (questionCount >= MAX_QUESTIONS) {
            alert(`全${MAX_QUESTIONS}問 クリア！\nスコア: ${score}点`);
            location.reload();
            return;
        }

        // まだ出題していない単語
        let available = gameData.filter(w => !askedWordIds.has(w.id));
        if (available.length === 0) {
            askedWordIds.clear();
            available = gameData;
        }
        
        const rIndex = Math.floor(Math.random() * available.length);
        currentWord = available[rIndex];
        askedWordIds.add(currentWord.id);
        
        questionCount++;
        updateScoreBoard();
        renderQuestionUI(currentWord);
    }

    // 3. 画面描画
    function renderQuestionUI(word) {
        // 画像
        IMAGE_AREA.innerHTML = `<img src="assets/images/${word.image}" alt="${word.word}" onerror="this.style.display='none'">`;
        
        // 文字のシャッフル
        const chars = Array.from(word.reading);
        const shuffled = shuffleArray([...chars]);

        // ドロップゾーン作成 (答えの数だけ枠を作る)
        ANSWER_CONTAINER.innerHTML = '';
        chars.forEach((_, i) => {
            const slot = document.createElement('div');
            slot.className = 'drop-slot';
            slot.dataset.index = i;
            setupDropZone(slot);
            ANSWER_CONTAINER.appendChild(slot);
        });

        // 文字ピース作成 (プールに配置)
        POOL_CONTAINER.innerHTML = '';
        setupDropZone(POOL_CONTAINER); // プールもドロップ可能にする

        shuffled.forEach((char, i) => {
            const piece = document.createElement('div');
            piece.className = 'char-piece';
            piece.textContent = char;
            piece.dataset.char = char;
            piece.draggable = true;
            piece.id = `piece-${i}`;
            
            setupDragItem(piece);
            POOL_CONTAINER.appendChild(piece);
        });

        FEEDBACK.textContent = '';
        CHECK_BTN.disabled = false;
    }

    // ----------------------------------------------------
    // ★★★ ドラッグ＆ドロップ & クリック移動ロジック ★★★
    // ----------------------------------------------------
    
    function setupDragItem(item) {
        // --- クリックで移動 (簡易操作) ---
        item.addEventListener('click', (e) => {
            // 今いる場所がプールなら、空いてるスロットへ
            if (item.parentElement === POOL_CONTAINER) {
                const emptySlot = Array.from(ANSWER_CONTAINER.children).find(slot => !slot.hasChildNodes());
                if (emptySlot) {
                    emptySlot.appendChild(item);
                    playPopSound();
                }
            } else {
                // スロットにいるなら、プールへ戻る
                POOL_CONTAINER.appendChild(item);
                playPopSound();
            }
        });

        // --- PC: ドラッグ開始 ---
        item.addEventListener('dragstart', (e) => {
            currentDragItem = item;
            setTimeout(() => item.classList.add('dragging'), 0);
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            currentDragItem = null;
        });

        // --- スマホ: タッチ開始 ---
        item.addEventListener('touchstart', (e) => {
            // タッチでもドラッグ扱いに
            currentDragItem = item;
            item.classList.add('dragging');
        }, {passive: true});

        item.addEventListener('touchend', (e) => {
            // スマホでのドロップ判定は複雑なので、今回は「クリック移動」を推奨
            // (タッチ終了時に指の下にある要素を判定するのは計算コストが高いため)
            item.classList.remove('dragging');
            currentDragItem = null;
        });
    }

    function setupDropZone(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // これ必須
            zone.classList.add('hovered');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hovered');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('hovered');
            
            if (currentDragItem) {
                // もしスロットに既に文字があったら、入れ替える（プールに戻す）
                if (zone.classList.contains('drop-slot') && zone.hasChildNodes()) {
                    POOL_CONTAINER.appendChild(zone.firstChild);
                }
                zone.appendChild(currentDragItem);
                playPopSound();
            }
        });
    }


    // 4. 答え合わせ
    CHECK_BTN.addEventListener('click', () => {
        const slots = document.querySelectorAll('.drop-slot');
        let answer = '';
        let isComplete = true;

        slots.forEach(slot => {
            if (slot.firstChild) {
                answer += slot.firstChild.dataset.char;
            } else {
                isComplete = false;
            }
        });

        if (!isComplete) {
            FEEDBACK.textContent = 'ぜんぶの マス をうめてね！';
            FEEDBACK.style.color = '#f57c00';
            return;
        }

        if (answer === currentWord.reading) {
            // 正解
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play();
            
            const res = checkAndAwardPoints(currentWord.id);
            let msg = 'せいかい！✨';
            if(res === 'scored') msg += ' (+1 pt)';
            
            FEEDBACK.textContent = msg;
            FEEDBACK.style.color = 'var(--correct-color)';
            CHECK_BTN.disabled = true;
            score += 1;
            updateScoreBoard();
            
            setTimeout(() => {
                showNextQuestion();
            }, 1500);
        } else {
            // 不正解
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play();
            FEEDBACK.textContent = 'ちがうよ... もういちど かんがえてみて！';
            FEEDBACK.style.color = 'var(--incorrect-color)';
        }
    });

    // ユーティリティ
    function updateScoreBoard() {
        TURN_MSG.textContent = `問 ${questionCount} / ${MAX_QUESTIONS}`;
        SCORE_VAL.textContent = score;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function playPopSound() {
        // サウンドファイルがあれば鳴らす
        try { 
            SOUND_POP.currentTime = 0; 
            SOUND_POP.play().catch(()=>{}); 
        } catch(e){}
    }

});