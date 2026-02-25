// --- 設定 ---
    const PAGES_PER_CATEGORY = 3; // ★修正点：各カテゴリー3ページ (合計12枠)
    
    const CATEGORIES = [
        { title: 'ぶんぼうぐ', color: '#fdd835', icon: 'fa-solid fa-pen-ruler' },
        { title: 'たべもの',   color: '#ff8a65', icon: 'fa-solid fa-utensils' },
        { title: 'おようふく', color: '#4fc3f7', icon: 'fa-solid fa-shirt' },
        { title: 'おもちゃ',   color: '#aed581', icon: 'fa-solid fa-robot' },
        { title: 'おへや',     color: '#ba68c8', icon: 'fa-solid fa-couch' }
    ];

    const container = document.getElementById('workbook');

    // 1. 表紙生成
    function createCover() {
        const sheet = document.createElement('div');
        sheet.className = 'sheet';
        sheet.textContent = `
            <div class="cover-frame">
                <i class="fa-solid fa-camera deco" style="top:50px; left:50px; color:#ffab91;"></i>
                <i class="fa-solid fa-star deco" style="bottom:50px; right:50px; color:#ffd54f;"></i>
                
                <i class="fa-solid fa-camera-retro" style="font-size:8em; color:#5c7aff; margin-bottom:30px;"></i>
                <h1 class="cover-title">たからさがし</h1>
                <div class="cover-sub">みつけて 写真をとろう！</div>
                
                <div class="name-area">
                    <span style="font-size:1.5em; color:#888;">なまえ</span>
                    <div class="name-line"></div>
                </div>
            </div>
        `;
        container.appendChild(sheet);
    }

    // 2. 中身ページ生成
    function createPages() {
        CATEGORIES.forEach(cat => {
            for (let i = 1; i <= PAGES_PER_CATEGORY; i++) {
                const sheet = document.createElement('div');
                sheet.className = 'sheet';

                // ヘッダー
                const header = `
                    <div class="page-header">
                        <div class="ph-title" style="color:${cat.color}">
                            <i class="${cat.icon}"></i> ${cat.title}
                        </div>
                        <div style="display:flex; align-items:center;">
                            <span class="page-num" style="background:${cat.color}">${i} / ${PAGES_PER_CATEGORY}</span>
                        </div>
                    </div>
                `;

                // グリッド (1ページに4つ)
                let grid = '<div class="big-grid">';
                for (let j = 0; j < 4; j++) {
                    grid += `
                        <div class="big-card" style="border-color:${cat.color};">
                            <div class="card-top">
                                <div class="check-box"></div>
                            </div>
                            <div class="art-area">
                                <i class="fa-solid fa-camera camera-icon"></i>
                            </div>
                            <div class="text-area">
                                <span class="label">なまえ：</span>
                            </div>
                        </div>
                    `;
                }
                grid += '</div>';

                sheet.textContent = header + grid;
                container.appendChild(sheet);
            }
        });
    }

    // 実行
    createCover();
    createPages();