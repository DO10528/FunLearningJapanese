document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 ---
    const GAME_ID = 'katakana_drag_match';

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

    // 画像パス
    const IMG_PATH = 'assets/images/katakana_words/';

    // データ
    const POINTS_PER_LEVEL = 10;

    const gameLevels = [
        { level: 1, words: [{ kana: 'アイス', file: 'アイス' }, { kana: 'イヤホン', file: 'イヤホン' }, { kana: 'ウインナー', file: 'ウインナー' }, { kana: 'エプロン', file: 'エプロン' }, { kana: 'オムライス', file: 'オムライス' }] },
        { level: 2, words: [{ kana: 'カレンダー', file: 'カレンダー' }, { kana: 'キャベツ', file: 'キャベツ' }, { kana: 'クレヨン', file: 'クレヨン' }, { kana: 'ケーキ', file: 'ケーキ' }, { kana: 'コップ', file: 'コップ' }] },
        { level: 3, words: [{ kana: 'サッカー', file: 'サッカー' }, { kana: 'シャツ', file: 'シャツ' }, { kana: 'ストロー', file: 'ストロー' }, { kana: 'セーター', file: 'セーター' }, { kana: 'ソーダ', file: 'ソーダ' }] },
        { level: 4, words: [{ kana: 'タイヤ', file: 'タイヤ' }, { kana: 'タオル', file: 'タオル' }, { kana: 'チョコ', file: 'チョコ' }, { kana: 'ツナ', file: 'ツナ' }, { kana: 'テント', file: 'テント' }] },
        { level: 5, words: [{ kana: 'トナカイ', file: 'トナカイ' }, { kana: 'ナマズ', file: 'ナマズ' }, { kana: 'ニワトリ', file: 'ニワトリ' }, { kana: 'ヌードル', file: 'ヌードル' }, { kana: 'ネクタイ', file: 'ネクタイ' }] },
        { level: 6, words: [{ kana: 'ノート', file: 'ノート' }, { kana: 'パン', file: 'パン' }, { kana: 'ハンガー', file: 'ハンガー' }, { kana: 'ヒトデ', file: 'ヒトデ' }, { kana: 'フグ', file: 'フグ' }] },
        { level: 7, words: [{ kana: 'ヘルメット', file: 'ヘルメット' }, { kana: 'ホタテ', file: 'ホタテ' }, { kana: 'マフラー', file: 'マフラー' }, { kana: 'ミミズ', file: 'ミミズ' }, { kana: 'ムササビ', file: 'ムササビ' }] },
        { level: 8, words: [{ kana: 'メダカ', file: 'メダカ' }, { kana: 'メモ', file: 'メモ' }, { kana: 'ユーフォー', file: 'ユーフォー' }, { kana: 'ヨーヨー', file: 'ヨーヨー' }, { kana: 'ラーメン', file: 'ラーメン' }] },
        { level: 9, words: [{ kana: 'リュック', file: 'リュック' }, { kana: 'ルビー', file: 'ルビー' }, { kana: 'レタス', file: 'レタス' }, { kana: 'ロケット', file: 'ロケット' }, { kana: 'ワイン', file: 'ワイン' }] }
    ];

    let currentLevelData = null;
    let currentDragItem = null;
    let isLevelClear = false;

    // --- 初期化 ---
    function initGame() {
        LEVEL_GRID.textContent = '';
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
        isLevelClear = false;

        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';
        LEVEL_TITLE.textContent = `レベル ${levelData.level}`;
        FEEDBACK.textContent = '';
        FEEDBACK.className = 'feedback-msg';

        ILLUST_POOL.textContent = '';
        WORD_LIST.textContent = '';

        // シャッフル
        const words = shuffleArray([...levelData.words]);
        const illusts = shuffleArray([...levelData.words]);

        // 単語リスト作成 (Target)
        words.forEach(w => {
            const row = document.createElement('div');
            row.className = 'word-row';

            const target = document.createElement('div');
            target.className = 'drop-target';
            target.dataset.word = w.kana;
            target.classList.remove('correct');
            setupDropZone(target);

            const label = document.createElement('span');
            label.className = 'word-label';
            label.textContent = w.kana;

            row.appendChild(target);
            row.appendChild(label);
            WORD_LIST.appendChild(row);
        });

        // イラスト作成 (Source)
        illusts.forEach(w => {
            const item = document.createElement('div');
            item.className = 'drag-item';
            item.dataset.word = w.kana;
            item.draggable = true;

            const img = document.createElement('img');
            img.src = `${IMG_PATH}${w.file}.png`;
            img.alt = w.kana;

            item.appendChild(img);
            setupDragItem(item);
            ILLUST_POOL.appendChild(item);
        });
    }

    window.showLevelMenu = function () {
        GAME_AREA.style.display = 'none';
        MENU_AREA.style.display = 'block';
    };

    // --- ドラッグ＆ドロップロジック ---

    function setupDragItem(item) {
        // クリックで戻す (配置済みの場合)
        item.addEventListener('click', () => {
            if (isLevelClear) return;

            if (item.parentElement && item.parentElement.classList.contains('drop-target')) {
                if (!item.parentElement.classList.contains('correct')) {
                    ILLUST_POOL.appendChild(item);
                    item.classList.remove('placed');
                    FEEDBACK.textContent = '';
                    const parentTarget = item.parentElement;
                    parentTarget.classList.remove('correct');
                }
            }
        });

        // PC ドラッグ
        item.addEventListener('dragstart', (e) => {
            if (isLevelClear) {
                e.preventDefault();
                return;
            }
            currentDragItem = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            currentDragItem = null;
        });

        // スマホ タッチドラッグ用の変数
        let initialX = 0;
        let initialY = 0;
        let originalParent = null;

        item.addEventListener('touchstart', (e) => {
            if (isLevelClear) return;
            currentDragItem = item;
            item.style.opacity = '0.5';

            const touch = e.touches[0];
            initialX = touch.clientX;
            initialY = touch.clientY;
            originalParent = item.parentElement;
        }, { passive: false });

        // 追加: touchmove で画面スクロールを防止
        item.addEventListener('touchmove', (e) => {
            if (isLevelClear || !currentDragItem) return;
            e.preventDefault(); // これがないとAndroid等で画面がスクロールしてドラッグが失敗する
        }, { passive: false });

        item.addEventListener('touchend', (e) => {
            item.style.opacity = '1';

            if (isLevelClear || !currentDragItem) {
                currentDragItem = null;
                return;
            }

            // タッチ終了位置にある要素を取得
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);

            if (target) {
                // ドロップターゲットか確認
                let dropZone = target.closest('.drop-target');
                if (dropZone && !dropZone.querySelector('.drag-item') && dropZone !== originalParent) {
                    handleDrop(dropZone);
                }
                // もし元の場所（プール）以外に戻そうとしていればプールに戻す
                else if (target.closest('.illust-pool') && originalParent !== ILLUST_POOL) {
                    ILLUST_POOL.appendChild(item);
                    item.classList.remove('placed');
                    FEEDBACK.textContent = '';
                    const targets = document.querySelectorAll('.drop-target');
                    targets.forEach(t => t.classList.remove('correct'));
                }
            }
            currentDragItem = null;
        });
    }

    function setupDropZone(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!isLevelClear && !zone.querySelector('.drag-item')) {
                zone.classList.add('drag-over');
            }
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (!isLevelClear && !zone.querySelector('.drag-item') && currentDragItem) {
                handleDrop(zone);
            }
        });
    }

    function handleDrop(zone) {
        if (zone.querySelector('.drag-item')) {
            const existingItem = zone.querySelector('.drag-item');
            ILLUST_POOL.appendChild(existingItem);
            existingItem.classList.remove('placed');
        }

        if (currentDragItem.parentElement && currentDragItem.parentElement.classList.contains('drop-target')) {
            currentDragItem.parentElement.classList.remove('correct');
        }

        zone.appendChild(currentDragItem);
        currentDragItem.classList.add('placed');
        checkAnswers();
    }

    // --- 判定 ---
    async function checkAnswers() {
        if (isLevelClear) return;

        const targets = document.querySelectorAll('.drop-target');
        const total = targets.length;
        let filled = 0;

        targets.forEach(t => {
            if (t.querySelector('.drag-item')) filled++;
        });

        if (filled < total) {
            FEEDBACK.textContent = `あと ${total - filled} こ のイラストをあわせてね`;
            FEEDBACK.className = 'feedback-msg';
            return;
        }

        let allCorrect = true;
        targets.forEach(t => {
            const placed = t.querySelector('.drag-item');
            if (placed.dataset.word !== t.dataset.word) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            isLevelClear = true;
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play();
            FEEDBACK.textContent = 'せいかい！ おめでとう！';
            FEEDBACK.className = 'feedback-msg success';

            targets.forEach(t => t.classList.add('correct'));

            // ポイント加算
            if (typeof window.addPointsToUser === 'function') {
                const success = await window.addPointsToUser(POINTS_PER_LEVEL);
                if (success) {
                    FEEDBACK.textContent += ` (+${POINTS_PER_LEVEL}pt 記録)`;
                }
            }

            setTimeout(() => {
                if (currentLevelData.level < gameLevels.length) {
                    FEEDBACK.textContent += ' -> つぎのレベルへ！';
                    setTimeout(() => {
                        const nextLvl = gameLevels.find(l => l.level === currentLevelData.level + 1);
                        if (nextLvl) loadLevel(nextLvl);
                    }, 2000);
                } else {
                    FEEDBACK.textContent = 'すごい！ぜんぶのレベルをクリアしたよ！';
                }
            }, 1000);

        } else {
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
