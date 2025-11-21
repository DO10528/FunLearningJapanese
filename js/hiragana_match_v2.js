document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 & ポイントシステム ---
    const GAME_ID = 'hiragana_drag_match';
    const USER_STORAGE_KEY = 'user_accounts';
    const SESSION_STORAGE_KEY = 'current_user';
    const GUEST_NAME = 'ゲスト'; 

    // DOM
    const MENU_AREA = document.getElementById('level-menu-area');
    const GAME_AREA = document.getElementById('game-play-area');
    const LEVEL_GRID = document.getElementById('level-grid');
    const LEVEL_TITLE = document.getElementById('level-title');
    const ILLUST_POOL = document.getElementById('illust-pool');
    const WORD_LIST = document.getElementById('word-list');
    const FEEDBACK = document.getElementById('feedback');

    // 音声
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // 画像パス (元の設定を維持)
    const IMG_PATH = 'assets/images/hiragana_words/';
    
    // --- データ (元のコードから移植) ---
    const gameLevels = [
        { level: 1, words: [ { hira: 'あめ', file: 'あめ' }, { hira: 'いぬ', file: 'いぬ' }, { hira: 'うし', file: 'うし' }, { hira: 'えび', file: 'えび' }, { hira: 'おに', file: 'おに' } ] },
        { level: 2, words: [ { hira: 'かに', file: 'かに' }, { hira: 'き', file: 'き' },{ hira: 'くるま', file: 'くるま' }, { hira: 'けむし', file: 'けむし' }, { hira: 'こま', file: 'こま' } ] },
        { level: 3, words: [ { hira: 'さる', file: 'さる' }, { hira: 'しか', file: 'しか' }, { hira: 'すし', file: 'すし' }, { hira: 'せみ', file: 'せみ' }, { hira: 'そば', file: 'そば' } ] },
        { level: 4, words: [ { hira: 'たこ', file: 'たこ' }, { hira: 'はち', file: 'はち' },{ hira: 'つき', file: 'つき' }, { hira: 'てれび', file: 'てれび' }, { hira: 'とり', file: 'とり' } ] },
        { level: 5, words: [ { hira: 'なす', file: 'なす' }, { hira: 'にほん', file: 'にほん' }, { hira: 'ぬの', file: 'ぬの' }, { hira: 'ねこ', file: 'ねこ' }, { hira: 'のり', file: 'のり' } ] },
        { level: 6, words: [ { hira: 'はし', file: 'はし' }, { hira: 'ひとで', file: 'ひとで' }, { hira: 'ふく', file: 'ふく' }, { hira: 'へび', file: 'へび' }, { hira: 'ほし', file: 'ほし' } ] },
        { level: 7, words: [ { hira: 'まくら', file: 'まくら' }, { hira: 'みかん', file: 'みかん' }, { hira: 'むぎ', file: 'むぎ' }, { hira: 'めだか', file: 'めだか' }, { hira: 'もも', file: 'もも' } ] },
        { level: 8, words: [ { hira: 'らくだ', file: 'らくだ' }, { hira: 'りんご', file: 'りんご' }, { hira: 'るんば', file: 'るんば' }, { hira: 'れもん', file: 'れもん' }, { hira: 'ろば', file: 'ろば' } ] },
        { level: 9, words: [ { hira: 'やぎ', file: 'やぎ' }, { hira: 'ゆかた', file: 'ゆかた' }, { hira: 'ようかい', file: 'ようかい' } ] },
        { level: 10, words: [ { hira: 'わに', file: 'わに' }, { hira: 'かばん', file: 'かばん' } ] }
    ];

    let currentLevelData = null;
    let currentDragItem = null;

    // --- ポイント関数 ---
    function getTodayDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }
    function checkAndAwardPoints(level) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!currentUser || currentUser === GUEST_NAME) return "guest"; 
        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = getTodayDateString();
        const levelKey = `${GAME_ID}_level_${level}`;
        user.progress = user.progress || {};
        user.progress[levelKey] = user.progress[levelKey] || {};

        if (user.progress[levelKey][today] === true) return "already_scored"; 

        user.points = (user.points || 0) + 1;
        user.progress[levelKey][today] = true;
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        return "scored"; 
    }

    // --- 初期化 ---
    function initGame() {
        LEVEL_GRID.innerHTML = '';
        gameLevels.forEach(level => {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = `Lv.${level.level}`;
            btn.onclick = () => loadLevel(level);
            LEVEL_GRID.appendChild(btn);
        });
    }

    // --- レベルロード ---
    function loadLevel(levelData) {
        currentLevelData = levelData;
        
        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';
        LEVEL_TITLE.textContent = `レベル ${levelData.level}`;
        FEEDBACK.textContent = '';
        FEEDBACK.className = 'feedback-msg';

        ILLUST_POOL.innerHTML = '';
        WORD_LIST.innerHTML = '';

        // シャッフル
        const words = shuffleArray([...levelData.words]);
        const illusts = shuffleArray([...levelData.words]);

        // 単語リスト作成 (Target)
        words.forEach(w => {
            const row = document.createElement('div');
            row.className = 'word-row';
            
            const target = document.createElement('div');
            target.className = 'drop-target';
            target.dataset.word = w.hira;
            setupDropZone(target);

            const label = document.createElement('span');
            label.className = 'word-label';
            label.textContent = w.hira;

            row.appendChild(target);
            row.appendChild(label);
            WORD_LIST.appendChild(row);
        });

        // イラスト作成 (Source)
        illusts.forEach(w => {
            const item = document.createElement('div');
            item.className = 'drag-item';
            item.dataset.word = w.hira;
            item.draggable = true;
            
            const img = document.createElement('img');
            img.src = `${IMG_PATH}${w.file}.png`;
            img.alt = w.hira;
            
            item.appendChild(img);
            setupDragItem(item);
            ILLUST_POOL.appendChild(item);
        });
    }

    window.showLevelMenu = function() {
        GAME_AREA.style.display = 'none';
        MENU_AREA.style.display = 'block';
    };

    // --- ドラッグ＆ドロップロジック ---
    
    function setupDragItem(item) {
        // クリックで戻す (配置済みの場合)
        item.addEventListener('click', () => {
            if (item.parentElement && item.parentElement.classList.contains('drop-target')) {
                if (!item.parentElement.classList.contains('correct')) { // 正解済みでなければ戻せる
                    ILLUST_POOL.appendChild(item);
                    item.classList.remove('placed');
                    FEEDBACK.textContent = '';
                }
            }
        });

        // PC ドラッグ
        item.addEventListener('dragstart', (e) => {
            currentDragItem = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            currentDragItem = null;
        });

        // スマホ タッチ
        item.addEventListener('touchstart', (e) => {
            // すでに配置済みでロックされている場合は無視
            if (item.parentElement.classList.contains('correct')) return;

            currentDragItem = item;
            item.style.opacity = '0.5';
        }, {passive: true});

        item.addEventListener('touchend', (e) => {
            item.style.opacity = '1';
            
            // タッチ終了位置にある要素を取得
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (target) {
                // ドロップターゲットか確認
                let dropZone = target.closest('.drop-target');
                if (dropZone && !dropZone.querySelector('.drag-item')) {
                     handleDrop(dropZone);
                } else if (target.closest('.illust-pool')) {
                    // プールに戻す
                    ILLUST_POOL.appendChild(item);
                    item.classList.remove('placed');
                }
            }
            currentDragItem = null;
        });
    }

    function setupDropZone(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!zone.querySelector('.drag-item')) {
                zone.classList.add('drag-over');
            }
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (!zone.querySelector('.drag-item') && currentDragItem) {
                handleDrop(zone);
            }
        });
    }

    function handleDrop(zone) {
        zone.appendChild(currentDragItem);
        currentDragItem.classList.add('placed');
        checkAnswers();
    }

    // --- 判定 ---
    function checkAnswers() {
        const targets = document.querySelectorAll('.drop-target');
        const total = targets.length;
        let filled = 0;
        
        targets.forEach(t => {
            if (t.querySelector('.drag-item')) filled++;
        });

        if (filled < total) {
            FEEDBACK.textContent = `あと ${total - filled} こ`;
            return;
        }

        // 全部埋まったら判定
        let allCorrect = true;
        targets.forEach(t => {
            const placed = t.querySelector('.drag-item');
            if (placed.dataset.word !== t.dataset.word) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            // 正解
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play();
            FEEDBACK.textContent = 'ぜんぶ せいかい！';
            FEEDBACK.className = 'feedback-msg success';
            
            // ロックする
            targets.forEach(t => t.classList.add('correct'));

            // ポイント付与
            const res = checkAndAwardPoints(currentLevelData.level);
            if (res === 'scored') FEEDBACK.textContent += ' (+1 pt)';
            
            // 次のレベルへ自動遷移の準備など (ここではメッセージのみ)
            setTimeout(() => {
                // 全クリアかチェック
                if (currentLevelData.level < 10) {
                    FEEDBACK.textContent += ' -> つぎのレベルへいくよ！';
                    setTimeout(() => {
                        // 次のレベルを探してロード
                        const nextLvl = gameLevels.find(l => l.level === currentLevelData.level + 1);
                        if(nextLvl) loadLevel(nextLvl);
                    }, 2000);
                } else {
                    FEEDBACK.textContent = 'すごい！ぜんぶのレベルをクリアしたよ！';
                }
            }, 1000);

        } else {
            // 不正解
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play();
            FEEDBACK.textContent = 'ちがうものがあるよ。なおしてみてね。';
            FEEDBACK.className = 'feedback-msg error';
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // スタート
    initGame();
});