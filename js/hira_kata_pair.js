document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const MENU_AREA = document.getElementById('level-menu-area');
    const GAME_AREA = document.getElementById('game-play-area');
    const LEVEL_GRID = document.getElementById('level-grid');
    const LEVEL_INDICATOR = document.getElementById('level-indicator');

    const HIRA_POOL = document.getElementById('hira-pool');
    const KATA_POOL = document.getElementById('kata-pool');
    const PAIR_ROWS = document.getElementById('pair-rows');

    const MODAL = document.getElementById('success-modal');
    const MODAL_POINT_FEEDBACK = document.getElementById('modal-point-feedback');
    const SOUND_CORRECT = document.getElementById('snd-correct');
    const SOUND_INCORRECT = document.getElementById('snd-incorrect');

    // --- Game Data ---
    const IMG_PATH = 'assets/images/hiragana_words/';
    const POINTS_PER_LEVEL = 15;

    const gameLevels = [
        { level: 1, words: [{ hira: 'あめ', kata: 'アメ', file: 'あめ' }, { hira: 'いぬ', kata: 'イヌ', file: 'いぬ' }, { hira: 'うし', kata: 'ウシ', file: 'うし' }, { hira: 'えび', kata: 'エビ', file: 'えび' }] },
        { level: 2, words: [{ hira: 'かに', kata: 'カニ', file: 'かに' }, { hira: 'き', kata: 'キ', file: 'き' }, { hira: 'くるま', kata: 'クルマ', file: 'くるま' }, { hira: 'こま', kata: 'コマ', file: 'こま' }] },
        { level: 3, words: [{ hira: 'さる', kata: 'サル', file: 'さる' }, { hira: 'しか', kata: 'シカ', file: 'しか' }, { hira: 'すし', kata: 'スシ', file: 'すし' }, { hira: 'せみ', kata: 'セミ', file: 'せみ' }] },
        { level: 4, words: [{ hira: 'たこ', kata: 'タコ', file: 'たこ' }, { hira: 'つき', kata: 'ツキ', file: 'つき' }, { hira: 'てれび', kata: 'テレビ', file: 'てれび' }, { hira: 'とり', kata: 'トリ', file: 'とり' }] },
        { level: 5, words: [{ hira: 'なす', kata: 'ナス', file: 'なす' }, { hira: 'にほん', kata: 'ニホン', file: 'にほん' }, { hira: 'ねこ', kata: 'ネコ', file: 'ねこ' }, { hira: 'のり', kata: 'ノリ', file: 'のり' }] },
        { level: 6, words: [{ hira: 'はし', kata: 'ハシ', file: 'はし' }, { hira: 'ひとで', kata: 'ヒトデ', file: 'ひとで' }, { hira: 'ふく', kata: 'フク', file: 'ふく' }, { hira: 'へび', kata: 'ヘビ', file: 'へび' }] },
        { level: 7, words: [{ hira: 'まくら', kata: 'マクラ', file: 'まくら' }, { hira: 'みかん', kata: 'ミカン', file: 'みかん' }, { hira: 'めだか', kata: 'メダカ', file: 'めだか' }, { hira: 'もも', kata: 'モモ', file: 'もも' }] },
        { level: 8, words: [{ hira: 'やぎ', kata: 'ヤギ', file: 'やぎ' }, { hira: 'りんご', kata: 'リンゴ', file: 'りんご' }, { hira: 'れもん', kata: 'レモン', file: 'れもん' }, { hira: 'わに', kata: 'ワニ', file: 'わに' }] }
    ];

    let currentLevelData = null;
    let selectedHira = null;
    let selectedKata = null;

    // --- Init ---
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

    // --- Load Level ---
    function loadLevel(levelData) {
        currentLevelData = levelData;
        selectedHira = null;
        selectedKata = null;

        MENU_AREA.style.display = 'none';
        GAME_AREA.style.display = 'block';
        MODAL.style.display = 'none';
        LEVEL_INDICATOR.textContent = `レベル ${levelData.level}`;

        HIRA_POOL.textContent = '';
        KATA_POOL.textContent = '';
        PAIR_ROWS.textContent = '';

        const rawWords = [...levelData.words];
        // 全単語リストをシャッフルしてから、最初の5個（5ペア）だけを抽出してゲームに使用する
        const selectedWords = shuffleArray(rawWords).slice(0, 5);

        // 選ばれた5ペアから表示用の配列を作成（それぞれの列で表示順を変えるためさらにシャッフル）
        const shuffHira = shuffleArray([...selectedWords]);
        const shuffKata = shuffleArray([...selectedWords]);

        // ひらがな＋イラスト カード生成
        shuffHira.forEach(w => {
            const card = document.createElement('div');
            card.className = 'card hira-card';
            card.dataset.id = w.hira;

            const img = document.createElement('img');
            img.src = `${IMG_PATH}${w.file}.png`;
            img.alt = w.hira;

            const lbl = document.createElement('div');
            lbl.className = 'card-label';
            lbl.textContent = w.hira;

            card.appendChild(img);
            card.appendChild(lbl);

            // タップイベント（iOS/Android両対応用）
            card.addEventListener('click', () => handleCardTap(card, 'hira'));
            HIRA_POOL.appendChild(card);
        });

        // カタカナ カード生成
        shuffKata.forEach(w => {
            const card = document.createElement('div');
            card.className = 'card kata-card';
            card.dataset.id = w.hira; // IDは対応付けのためひらがなキーを使う

            const lbl = document.createElement('div');
            lbl.className = 'kata-text';
            lbl.textContent = w.kata;

            card.appendChild(lbl);

            card.addEventListener('click', () => handleCardTap(card, 'kata'));
            KATA_POOL.appendChild(card);
        });
    }

    window.showLevelMenu = function () {
        GAME_AREA.style.display = 'none';
        MENU_AREA.style.display = 'block';
    };

    // --- Interaction Logic ---
    function handleCardTap(card, type) {
        // カードが既にペアになっていたら操作無効
        if (card.parentElement.classList.contains('pair-row')) return;

        // 選択状態のトグル
        if (type === 'hira') {
            if (selectedHira === card) {
                card.classList.remove('selected');
                selectedHira = null;
            } else {
                if (selectedHira) selectedHira.classList.remove('selected');
                card.classList.add('selected');
                selectedHira = card;
            }
        } else {
            if (selectedKata === card) {
                card.classList.remove('selected');
                selectedKata = null;
            } else {
                if (selectedKata) selectedKata.classList.remove('selected');
                card.classList.add('selected');
                selectedKata = card;
            }
        }

        // 両方選択されたらペアを作る
        if (selectedHira && selectedKata) {
            createPair(selectedHira, selectedKata);
            selectedHira.classList.remove('selected');
            selectedKata.classList.remove('selected');
            selectedHira = null;
            selectedKata = null;
        }
    }

    function createPair(hiraCard, kataCard) {
        const row = document.createElement('div');
        row.className = 'pair-row pop-in';

        // ペア枠から取り外して元に戻すタップ操作
        row.addEventListener('click', () => {
            if (row.classList.contains('locked-good')) return;

            // 元のプールに戻す
            HIRA_POOL.appendChild(hiraCard);
            KATA_POOL.appendChild(kataCard);
            row.remove();
        });

        row.appendChild(hiraCard);

        // 結合アイコン
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-link link-icon';
        row.appendChild(icon);

        row.appendChild(kataCard);

        PAIR_ROWS.appendChild(row);
    }

    // --- Validation ---
    window.checkAnswer = async function () {
        const rows = document.querySelectorAll('.pair-row');
        // 今回抽出されたペアの数（最大5）を基準にする
        const expectedCount = Math.min(5, currentLevelData.words.length);

        if (rows.length < expectedCount) {
            alert('すべてのカードをペアにしてから「こたえあわせ」をおしてね！');
            return;
        }

        let allCorrect = true;
        rows.forEach(row => {
            const hira = row.querySelector('.hira-card');
            const kata = row.querySelector('.kata-card');

            if (hira.dataset.id === kata.dataset.id) {
                row.classList.add('locked-good');
            } else {
                allCorrect = false;
                row.classList.add('shake-error');
                setTimeout(() => row.classList.remove('shake-error'), 500);
            }
        });

        if (allCorrect) {
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play();

            // ポイント処理
            let ptsText = "";
            if (typeof window.addPointsToUser === 'function') {
                const success = await window.addPointsToUser(POINTS_PER_LEVEL);
                if (success) ptsText = `+${POINTS_PER_LEVEL}pt ゲット！`;
            }
            MODAL_POINT_FEEDBACK.textContent = ptsText;
            MODAL.style.display = 'flex';

        } else {
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play();
            alert('ちがうペアがあるよ。なおしてみてね！ (ペアをタップするともどるよ)');
        }
    };

    window.nextLevel = function () {
        MODAL.style.display = 'none';
        const nextIndex = gameLevels.findIndex(l => l.level === currentLevelData.level) + 1;
        if (nextIndex < gameLevels.length) {
            loadLevel(gameLevels[nextIndex]);
        } else {
            alert('全レベルクリアおめでとう！');
            showLevelMenu();
        }
    };

    // --- Utils ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    initGame();
});
