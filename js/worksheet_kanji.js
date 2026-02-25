const places = [
        { name: "駅", kana: "えき", icon: "fa-train" },
        { name: "学校", kana: "がっこう", icon: "fa-school" },
        { name: "空港", kana: "くうこう", icon: "fa-plane" },
        { name: "病院", kana: "びょういん", icon: "fa-hospital" },
        { name: "郵便局", kana: "ゆうびんきょく", icon: "fa-envelope" },
        { name: "お土産屋", kana: "おみやげや", icon: "fa-gift" },
        { name: "トイレ", kana: "といれ", icon: "fa-restroom" },
        { name: "コンビニ", kana: "こんびに", icon: "fa-store" },
        { name: "ホテル", kana: "ほてる", icon: "fa-hotel" },
        { name: "レストラン", kana: "れすとらん", icon: "fa-utensils" }
    ];

    const dirs = [
        { name: "右", kana: "みぎ", icon: "fa-arrow-right" },
        { name: "左", kana: "ひだり", icon: "fa-arrow-left" },
        { name: "角", kana: "かど", icon: "fa-turn-up" },
        { name: "1つ目", kana: "ひとつめ", icon: "fa-1" },
        { name: "2つ目", kana: "ふたつめ", icon: "fa-2" },
        { name: "3つ目", kana: "みっつめ", icon: "fa-3" },
        { name: "4つ目", kana: "よっつめ", icon: "fa-4" },
        { name: "まっすぐ", kana: "まっすぐ", icon: "fa-arrow-up" }
    ];

    function createItem(item) {
        return `
        <div class="question-row">
            <div class="q-icon"><i class="fa-solid ${item.icon}"></i></div>
            <div class="q-word">${item.name}</div>
            <div class="a-box">
                <span class="answer-text">${item.kana}</span>
            </div>
        </div>
        `;
    }

    const gridPlaces = document.getElementById('grid-places');
    places.forEach(p => {
        gridPlaces.textContent += createItem(p);
    });

    const gridDirs = document.getElementById('grid-dirs');
    dirs.forEach(d => {
        gridDirs.textContent += createItem(d);
    });

    // 答え表示切り替え
    function toggleAnswer() {
        document.body.classList.toggle('show-answer');
    }