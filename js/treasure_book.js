// --- データ (言葉指定を削除し、カテゴリのみに) ---
    // count: ページ内の枠の数 (10個)
    const GAME_DATA = {
        stationery: {
            title: 'ぶんぼうぐ',
            color: '#ffd54f',
            icon: 'fa-solid fa-pen-ruler',
            count: 10
        },
        food: {
            title: 'たべもの',
            color: '#ffab91',
            icon: 'fa-solid fa-utensils',
            count: 10
        },
        clothing: {
            title: 'おようふく',
            color: '#81d4fa',
            icon: 'fa-solid fa-shirt',
            count: 10
        },
        toys: {
            title: 'おもちゃ',
            color: '#a5d6a7',
            icon: 'fa-solid fa-robot',
            count: 10
        },
        room: {
            title: 'おへや',
            color: '#ce93d8',
            icon: 'fa-solid fa-couch',
            count: 10
        }
    };

    const container = document.getElementById('book-content');

    // --- 1. 表紙 ---
    function renderCover() {
        const sheet = document.createElement('div');
        sheet.className = 'sheet';
        sheet.innerHTML = `
            <div class="cover-frame">
                <i class="fa-solid fa-star deco-icon d-1"></i>
                <i class="fa-solid fa-shapes deco-icon d-2"></i>
                <i class="fa-solid fa-heart deco-icon d-3"></i>
                <i class="fa-solid fa-rocket deco-icon d-4"></i>

                <i class="fa-solid fa-box-open" style="font-size:6em; color:#ffcc5c; margin-bottom:20px;"></i>
                <h1 class="cover-title">たからさがし</h1>
                <div class="cover-sub">みつけて かいてみよう！</div>

                <div class="name-area">
                    <span style="font-size:1.2em; color:#888;">なまえ</span>
                    <div class="name-line"></div>
                </div>
            </div>
        `;
        container.appendChild(sheet);
    }

    // --- 2. ページ生成 ---
    function renderPages() {
        Object.keys(GAME_DATA).forEach(key => {
            const data = GAME_DATA[key];
            const sheet = document.createElement('div');
            sheet.className = 'sheet';

            // ヘッダー
            const headerHtml = `
                <div class="page-header">
                    <div class="ph-title" style="color:${data.color}">
                        <i class="${data.icon}"></i> ${data.title}
                    </div>
                    <div class="ph-date">　　月　　日</div>
                </div>
            `;

            // グリッド (言葉指定なしの空枠を10個生成)
            let gridHtml = '<div class="item-grid">';
            for(let i=0; i < data.count; i++) {
                gridHtml += `
                    <div class="item-card" style="border-color:${data.color};">
                        <div class="card-header">
                            <div class="check-circle"></div>
                        </div>
                        <div class="draw-space">
                            <i class="fa-regular fa-image draw-icon"></i>
                        </div>
                        <div class="write-space">
                            <span class="write-guide">なまえ：</span>
                            <div class="write-line"></div>
                        </div>
                    </div>
                `;
            }
            gridHtml += '</div>';

            sheet.textContent = headerHtml + gridHtml;
            container.appendChild(sheet);
        });
    }

    renderCover();
    renderPages();