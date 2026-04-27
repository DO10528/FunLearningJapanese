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

    // レベル1〜10まで、各レベル5個ずつの単語データに拡張
    const gameLevels = [
        { level: 1, words: [
            { hira: 'あめ', kata: 'アメ', file: 'あめ' }, 
            { hira: 'いぬ', kata: 'イヌ', file: 'いぬ' }, 
            { hira: 'うし', kata: 'ウシ', file: 'うし' }, 
            { hira: 'えび', kata: 'エビ', file: 'えび' }, 
            { hira: 'おに', kata: 'オニ', file: 'おに' }
        ] },
        { level: 2, words: [
            { hira: 'かに', kata: 'カニ', file: 'かに' }, 
            { hira: 'き', kata: 'キ', file: 'き' }, 
            { hira: 'くるま', kata: 'クルマ', file: 'くるま' }, 
            { hira: 'けむし', kata: 'ケムシ', file: 'けむし' }, 
            { hira: 'こま', kata: 'コマ', file: 'こま' }
        ] },
        { level: 3, words: [
            { hira: 'さる', kata: 'サル', file: 'さる' }, 
            { hira: 'しか', kata: 'シカ', file: 'しか' }, 
            { hira: 'すし', kata: 'スシ', file: 'すし' }, 
            { hira: 'せみ', kata: 'セミ', file: 'せみ' }, 
            { hira: 'そば', kata: 'ソバ', file: 'そば' }
        ] },
        { level: 4, words: [
            { hira: 'たこ', kata: 'タコ', file: 'たこ' }, 
            { hira: 'はち', kata: 'ハチ', file: 'はち' }, 
            { hira: 'つき', kata: 'ツキ', file: 'つき' }, 
            { hira: 'てれび', kata: 'テレビ', file: 'てれび' }, 
            { hira: 'とり', kata: 'トリ', file: 'とり' }
        ] },
        { level: 5, words: [
            { hira: 'なす', kata: 'ナス', file: 'なす' }, 
            { hira: 'にほん', kata: 'ニホン', file: 'にほん' }, 
            { hira: 'ぬの', kata: 'ヌノ', file: 'ぬの' }, 
            { hira: 'ねこ', kata: 'ネコ', file: 'ねこ' }, 
            { hira: 'のり', kata: 'ノリ', file: 'のり' }
        ] },
        { level: 6, words: [
            { hira: 'はし', kata: 'ハシ', file: 'はし' }, 
            { hira: 'ひとで', kata: 'ヒトデ', file: 'ひとで' }, 
            { hira: 'ふく', kata: 'フク', file: 'ふく' }, 
            { hira: 'へび', kata: 'ヘビ', file: 'へび' }, 
            { hira: 'ほし', kata: 'ホシ', file: 'ほし' }
        ] },
        { level: 7, words: [
            { hira: 'まくら', kata: 'マクラ', file: 'まくら' }, 
            { hira: 'みかん', kata: 'ミカン', file: 'みかん' }, 
            { hira: 'むぎ', kata: 'ムギ', file: 'むぎ' }, 
            { hira: 'めだか', kata: 'メダカ', file: 'めだか' }, 
            { hira: 'もも', kata: 'モモ', file: 'もも' }
        ] },
        { level: 8, words: [
            { hira: 'らくだ', kata: 'ラクダ', file: 'らくだ' }, 
            { hira: 'りんご', kata: 'リンゴ', file: 'りんご' }, 
            { hira: 'るんば', kata: 'ルンバ', file: 'るんば' }, 
            { hira: 'れもん', kata: 'レモン', file: 'れもん' }, 
            { hira: 'ろば', kata: 'ロバ', file: 'ろば' }
        ] },
        { level: 9, words: [
            { hira: 'やぎ', kata: 'ヤギ', file: 'やぎ' }, 
            { hira: 'ゆかた', kata: 'ユカタ', file: 'ゆかた' }, 
            { hira: 'ようかい', kata: 'ヨウカイ', file: 'ようかい' },
            { hira: 'すいか', kata: 'スイカ', file: 'すいか' }, // レベル9に追加
            { hira: 'とまと', kata: 'トマト', file: 'とまと' } // レベル9に追加
        ] },
        { level: 10, words: [
            { hira: 'わに', kata: 'ワニ', file: 'わに' }, 
            { hira: 'かばん', kata: 'カバン', file: 'かばん' },
            { hira: 'かめら', kata: 'カメラ', file: 'かめら' }, // レベル10に追加
            { hira: 'ぴあの', kata: 'ピアノ', file: 'ぴあの' }, // レベル10に追加
            { hira: 'ばす', kata: 'バス', file: 'ばす' } // レベル10に追加
        ] }
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
            // イラストが見つからなかった場合の代替テキスト処理
            img.onerror = function() { this.style.display = 'none'; };

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
            hiraCard.classList.remove('selected');
            kataCard.classList.remove('selected');
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
        // 今回抽出されたペアの数（5）を基準にする
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
            // 正解音の再生（フリーズ対策）
            if (typeof SOUND_CORRECT !== 'undefined' && SOUND_CORRECT) {
                SOUND_CORRECT.currentTime = 0;
                SOUND_CORRECT.play().catch(e => console.log(e));
            }

            // ポイント処理
            let ptsText = "";
            if (window.Antigravity && window.Antigravity.addPoint) {
                const success = await window.Antigravity.addPoint('hira_kata_pair', newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    initGame();
});