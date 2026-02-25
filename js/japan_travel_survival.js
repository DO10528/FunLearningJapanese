const places = [
        { name: "コンビニ", kana: "konbini", icon: "fa-store" },
        { name: "駅", kana: "eki", icon: "fa-train" },
        { name: "ホテル", kana: "hoteru", icon: "fa-hotel" },
        { name: "郵便局", kana: "yuubinkyoku", icon: "fa-envelope" },
        { name: "トイレ", kana: "toire", icon: "fa-restroom" },
        { name: "レストラン", kana: "resutoran", icon: "fa-utensils" },
        { name: "学校", kana: "gakkou", icon: "fa-school" },
        { name: "病院", kana: "byouin", icon: "fa-hospital" },
        { name: "空港", kana: "kuukou", icon: "fa-plane" },
        { name: "お土産屋", kana: "omiyageya", icon: "fa-gift" }
    ];

    const directions = [
        { name: "右", kana: "migi", icon: "fa-arrow-right" },
        { name: "左", kana: "hidari", icon: "fa-arrow-left" },
        { name: "まっすぐ", kana: "massugu", icon: "fa-arrow-up" },
        { name: "角", kana: "kado", icon: "fa-turn-up" }
    ];

    const counters = [
        { name: "1つ目", kana: "hitotsume", icon: "fa-1" },
        { name: "2つ目", kana: "futatsume", icon: "fa-2" },
        { name: "3つ目", kana: "mittsume", icon: "fa-3" },
        { name: "4つ目", kana: "yottsume", icon: "fa-4" }
    ];

    function createRow(item) {
        return `
        <div class="word-row">
            <div class="icon-box"><i class="fa-solid ${item.icon}"></i></div>
            <div class="practice-area">
                <div>
                    <div class="model-text">${item.name}</div>
                    <span class="sub-text">${item.kana}</span>
                </div>
                <div class="trace-text">${item.name}</div>
                <div class="write-box"></div>
            </div>
        </div>
        `;
    }

    // 場所のレンダリング (左右に分ける)
    const pLeft = document.getElementById('places-container-left');
    const pRight = document.getElementById('places-container-right');
    
    places.forEach((p, index) => {
        const html = createRow(p);
        if(index < 5) pLeft.textContent += html;
        else pRight.textContent += html;
    });

    // 方向のレンダリング
    const dContainer = document.getElementById('directions-container');
    const dContainer2 = document.getElementById('directions-container-2');
    directions.forEach((d, index) => {
        const html = createRow(d);
        if(index < 2) dContainer.textContent += html;
        else dContainer2.textContent += html;
    });

    // 数のレンダリング
    const cContainer = document.getElementById('counters-container');
    const cContainer2 = document.getElementById('counters-container-2');
    counters.forEach((c, index) => {
        const html = createRow(c);
        if(index < 2) cContainer.textContent += html;
        else cContainer2.textContent += html;
    });