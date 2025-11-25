document.addEventListener('DOMContentLoaded', () => {

    // --- 設定 ---
    const GAME_ID = 'hiragana_drag_match'; // ゲームID (将来的な拡張用)

    // DOM
    const MENU_AREA = document.getElementById('level-menu-area');
    const GAME_AREA = document.getElementById('game-play-area');
    const LEVEL_GRID = document.getElementById('level-grid');
    const LEVEL_TITLE = document.getElementById('level-title');
    const ILLUST_POOL = document.getElementById('illust-pool');
    const WORD_LIST = document.getElementById('word-list');
    const FEEDBACK = document.getElementById('feedback');
    const AUTH_STATUS = document.getElementById('auth-status'); // HTMLから取得

    // 音声
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // 画像パス (元の設定を維持)
    const IMG_PATH = 'assets/images/hiragana_words/';
    
    // --- データ (元のコードから移植) ---
    // ポイントはレベルクリアで10点とします。
    const POINTS_PER_LEVEL = 10; 
    
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
    let isLevelClear = false; // 二重ポイント加算防止

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
        isLevelClear = false; // レベル開始時にリセット
        
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
            // 正解済み状態で再ロードされた場合に備え、クラスをリセット
            target.classList.remove('correct'); 
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
            if(isLevelClear) return; // クリア後は操作不可

            if (item.parentElement && item.parentElement.classList.contains('drop-target')) {
                if (!item.parentElement.classList.contains('correct')) { 
                    ILLUST_POOL.appendChild(item);
                    item.classList.remove('placed');
                    FEEDBACK.textContent = '';
                    // 正解が崩れたらロックを外す
                    const parentTarget = item.parentElement;
                    parentTarget.classList.remove('correct');
                }
            }
        });

        // PC ドラッグ
        item.addEventListener('dragstart', (e) => {
            if(isLevelClear) {
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

        // スマホ タッチ
        item.addEventListener('touchstart', (e) => {
             if(isLevelClear) return;
            currentDragItem = item;
            item.style.opacity = '0.5';
        }, {passive: true});

        item.addEventListener('touchend', (e) => {
            item.style.opacity = '1';
            
            if(isLevelClear) return;

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
                    FEEDBACK.textContent = '';
                    // プールに戻したら、以前配置されていたスロットから 'correct' クラスを削除
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
        // もし配置しようとしているスロットにすでにアイテムがある場合、それをプールに戻す
        if (zone.querySelector('.drag-item')) {
            const existingItem = zone.querySelector('.drag-item');
            ILLUST_POOL.appendChild(existingItem);
            existingItem.classList.remove('placed');
        }

        // ドロップ前に、現在のアイテムが配置されていたスロットから 'correct' クラスを削除
        if (currentDragItem.parentElement && currentDragItem.parentElement.classList.contains('drop-target')) {
             currentDragItem.parentElement.classList.remove('correct');
        }

        zone.appendChild(currentDragItem);
        currentDragItem.classList.add('placed');
        checkAnswers();
    }

    // --- 判定 ---
    async function checkAnswers() {
        if (isLevelClear) return; // クリア済みなら再実行しない

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

        // 全部埋まったら判定
        let allCorrect = true;
        targets.forEach(t => {
            const placed = t.querySelector('.drag-item');
            if (placed.dataset.word !== t.dataset.word) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            isLevelClear = true; // クリアフラグを立てる
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play();
            FEEDBACK.textContent = 'せいかい！ おめでとう！';
            FEEDBACK.className = 'feedback-msg success';
            
            // ロックする
            targets.forEach(t => t.classList.add('correct'));

            // ★★★ Firebaseポイント加算ロジック (HTML側で定義されたグローバル関数を使用) ★★★
            if (typeof window.addPointsToUser === 'function') {
                 const success = await window.addPointsToUser(POINTS_PER_LEVEL);
                 if (success) {
                     FEEDBACK.textContent += ` (+${POINTS_PER_LEVEL}pt 記録)`;
                 } else if (window.currentUserId) {
                     FEEDBACK.textContent += ' (ポイント記録エラー)';
                 } else {
                     FEEDBACK.textContent += ' (ゲストモードのためポイント記録なし)';
                 }
            } else {
                 FEEDBACK.textContent += ' (ポイントシステム未初期化)';
            }
            // ★★★ Firebaseポイント加算ロジック 終了 ★★★
            
            // 次のレベルへ自動遷移の準備など
            setTimeout(() => {
                // 全クリアかチェック
                if (currentLevelData.level < gameLevels.length) {
                    FEEDBACK.textContent += ' -> つぎのレベルへ！';
                    setTimeout(() => {
                        // 次のレベルを探してロード
                        const nextLvl = gameLevels.find(l => l.level === currentLevelData.level + 1);
                        if(nextLvl) loadLevel(nextLvl);
                    }, 2000);
                } else {
                    FEEDBACK.textContent = 'すごい！ぜんぶのレベルをクリアしたよ！ ホームにもどろう！';
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