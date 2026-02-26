// --- データ定義 ---
    const GAME_DATA = {
        stationery: {
            title: 'ぶんぼうぐ',
            color: '#ffd54f', // 黄色
            words: new Array(10).fill({}) // アイテム数は10個（中身は空でOK）
        },
        food: {
            title: 'たべもの',
            color: '#ffab91', // オレンジ
            words: new Array(10).fill({})
        },
        clothing: {
            title: 'おようふく',
            color: '#81d4fa', // 水色
            words: new Array(10).fill({})
        },
        toys: {
            title: 'おもちゃ',
            color: '#a5d6a7', // 緑
            words: new Array(10).fill({})
        },
        room: {
            title: 'おへや',
            color: '#ce93d8', // 紫
            words: new Array(10).fill({})
        },
        kitchen: {
            title: 'キッチン',
            color: '#ffcc80', // 薄オレンジ
            words: new Array(10).fill({})
        },
        bathroom: {
            title: 'おふろ',
            color: '#80deea', // シアン
            words: new Array(10).fill({})
        },
        electronics: {
            title: 'かでん',
            color: '#b0bec5', // グレー
            words: new Array(10).fill({})
        },
        colors: {
            title: 'いろ',
            color: '#f48fb1', // ピンク
            words: new Array(10).fill({})
        },
        body: {
            title: 'からだ',
            color: '#ffccbc', // 肌色
            words: new Array(10).fill({})
        }
    };

    const container = document.getElementById('worksheet-container');

    // -------------------------------------------
    // 1. 表紙の生成
    // -------------------------------------------
    const coverSheet = document.createElement('div');
    coverSheet.className = 'sheet';
    coverSheet.textContent = `
        <div class="cover-container">
            <div class="main-title">たからさがし</div>
            <div class="sub-title">おうちにあるものを さがして えをかこう！</div>
            <div class="name-box">
                <span class="name-label">なまえ：</span>
            </div>
        </div>
    `;
    container.appendChild(coverSheet);

    // -------------------------------------------
    // 2. トピックページの生成
    // -------------------------------------------
    Object.keys(GAME_DATA).forEach(key => {
        const topic = GAME_DATA[key];
        const words = topic.words;
        const itemsPerPage = 4; // 1ページ4問
        
        for (let i = 0; i < words.length; i += itemsPerPage) {
            
            // ページ作成
            const sheet = document.createElement('div');
            sheet.className = 'sheet';

            // ヘッダー
            const header = document.createElement('div');
            header.className = 'header';
            header.style.borderColor = topic.color;

            const titleDiv = document.createElement('div');
            titleDiv.className = 'topic-title';
            titleDiv.textContent = topic.title;
            titleDiv.style.backgroundColor = topic.color;

            const pageNum = document.createElement('div');
            pageNum.className = 'page-number';
            const currentPage = Math.floor(i / itemsPerPage) + 1;
            const totalPages = Math.ceil(words.length / itemsPerPage);
            pageNum.textContent = `${currentPage} / ${totalPages}`;

            header.appendChild(titleDiv);
            header.appendChild(pageNum);
            sheet.appendChild(header);

            // グリッド作成
            const grid = document.createElement('div');
            grid.className = 'grid';

            // 4つのカードを作成
            for (let j = 0; j < itemsPerPage; j++) {
                if (i + j >= words.length) break; // アイテム数を超えたら終了

                const card = document.createElement('div');
                card.className = 'card';
                // ★修正点: 枠線をトピックの色に変更（太め）
                card.style.border = `4px solid ${topic.color}`;

                // ★修正点: 単語名を削除し、「（なまえ）」ラベルと記入線を表示
                const wordSection = document.createElement('div');
                wordSection.className = 'word-section';
                wordSection.textContent = `
                    <div class="name-label-text">（なまえ）</div>
                    <div class="write-line" style="border-color: ${topic.color}"></div>
                `;

                // 絵を描く欄
                const drawSection = document.createElement('div');
                drawSection.className = 'draw-section';
                drawSection.innerHTML = `<span class="draw-label">えをかこう</span>`;

                card.appendChild(wordSection);
                card.appendChild(drawSection);
                grid.appendChild(card);
            }

            // レイアウト崩れ防止の空白埋め
            while (grid.children.length < 4) {
                const emptyCard = document.createElement('div');
                emptyCard.style.visibility = 'hidden'; 
                grid.appendChild(emptyCard);
            }

            sheet.appendChild(grid);
            container.appendChild(sheet);
        }
    });