// --- データ（Geminiが生成したダミー画像リンク付き） ---
// お客様は画像ファイルを用意する必要はありません。このまま動きます。
const mannersData = {
    shrine: {
        title: "神社・お寺",
        icon: "fa-torii-gate",
        learning: [
            { text: "鳥居（とりい）をくぐる前に、軽く一礼（いちれい）します。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：鳥居の前でお辞儀" },
            { text: "神社では「二礼・二拍手・一礼」でお参りします。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：神社で手を叩く様子" },
            { text: "お寺では拍手（はくしゅ）をしません。静かに手を合わせます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：お寺で静かに合掌" }
        ],
        quizzes: [
            { q: "神社でお参りする時、どうしますか？", options: [{t:"2回おじぎ、2回はくしゅ、1回おじぎ", c:true}, {t:"静かに手をあわせるだけ", c:false}] },
            { q: "お寺でお参りする時、どうしますか？", options: [{t:"静かに手をあわせる", c:true}, {t:"大きな音ではくしゅする", c:false}] },
            { q: "鳥居（とりい）の前で どうしますか？", options: [{t:"一礼（いちれい）する", c:true}, {t:"走って通る", c:false}] },
            { q: "お参りの前に 手と口を どうしますか？", options: [{t:"水で きよめる（あらう）", c:true}, {t:"何もしない", c:false}] }
        ]
    },
    onsen: {
        title: "温泉・お風呂",
        icon: "fa-hot-tub-person",
        learning: [
            { text: "湯船（ゆぶね）に入る前に、必ず「かけ湯」をするか、体を洗います。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：温泉でかけ湯をする" },
            { text: "タオルは湯船の中に入れません（頭の上に乗せるのはOK）。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：頭にタオルを乗せて入浴" },
            { text: "脱衣所（だついじょ）に戻る前に、体をよく拭きます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：風呂上がりに体を拭く" }
        ],
        quizzes: [
            { q: "湯船（ゆぶね）に入る前に 何をしますか？", options: [{t:"頭や体をあらう（かけ湯）", c:true}, {t:"何もしないで入る", c:false}] },
            { q: "タオルは どこに置きますか？", options: [{t:"頭の上や お風呂の外", c:true}, {t:"お湯の中に入れる", c:false}] },
            { q: "お風呂から出る時、どうしますか？", options: [{t:"体をよくふく", c:true}, {t:"ぬれたまま出る", c:false}] },
            { q: "長い髪は どうしますか？", options: [{t:"ゴムでむすぶ", c:true}, {t:"お湯につける", c:false}] }
        ]
    },
    meal: {
        title: "食事",
        icon: "fa-utensils",
        learning: [
            { text: "食べる前は「いただきます」、食べた後は「ごちそうさま」と言います。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：食事の挨拶（いただきます）" },
            { text: "お箸（はし）からお箸へ、食べ物を渡してはいけません。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：箸渡しの禁止（×マーク）" },
            { text: "お茶碗（ちゃわん）は手に持って食べます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：茶碗を持ってご飯を食べる" }
        ],
        quizzes: [
            { q: "ご飯を食べ終わった時、何と言いますか？", options: [{t:"ごちそうさまでした", c:true}, {t:"いただきます", c:false}] },
            { q: "ご飯を食べる時、お茶碗は どうしますか？", options: [{t:"手にもって食べる", c:true}, {t:"机においたまま食べる", c:false}] },
            { q: "お箸（はし）のマナーで 正しいのは？", options: [{t:"お箸でおかずをつかむ", c:true}, {t:"お箸からお箸へ 食べ物をわたす", c:false}] },
            { q: "ご飯を食べる前、何と言いますか？", options: [{t:"いただきます", c:true}, {t:"こんにちは", c:false}] }
        ]
    },
    train: {
        title: "電車・公共",
        icon: "fa-train-subway",
        learning: [
            { text: "電車の中では、電話で話しません。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：電車内での通話禁止" },
            { text: "優先席（ゆうせんせき）はお年寄りや体の不自由な人のための席です。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：優先席マークと座る人" },
            { text: "電車を待つ時は、列（れつ）を作って並びます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：ホームで整列乗車" }
        ],
        quizzes: [
            { q: "電車で電話がかかってきました。どうしますか？", options: [{t:"出ない / 後でかけなおす", c:true}, {t:"大きな声で話す", c:false}] },
            { q: "電車を待つ時、どうしますか？", options: [{t:"列（れつ）にならぶ", c:true}, {t:"ドアの前で 割り込む", c:false}] },
            { q: "優先席（ゆうせんせき）は 誰の席ですか？", options: [{t:"お年寄りや 妊婦さん", c:true}, {t:"誰でもいい", c:false}] },
            { q: "電車に乗る時、どちらが先ですか？", options: [{t:"降りる人が先", c:true}, {t:"乗る人が先", c:false}] }
        ]
    },
    daily: {
        title: "挨拶・日常",
        icon: "fa-handshake",
        learning: [
            { text: "お辞儀（おじぎ）は、相手に合わせて角度を変えます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：丁寧なお辞儀" },
            { text: "日本の家に入る時は、靴（くつ）を脱ぎます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：玄関で靴を脱ぐ" },
            { text: "脱いだ靴は、つま先をドアの方に向けて揃えます。", image: "https://placehold.co/600x400/e8f5e9/2e7d32?text=イラスト：脱いだ靴を揃える" }
        ],
        quizzes: [
            { q: "日本の家に入る時、どうしますか？", options: [{t:"くつをぬぐ", c:true}, {t:"くつをはいたまま入る", c:false}] },
            { q: "ぬいだ靴は どうしますか？", options: [{t:"向きをそろえて おく", c:true}, {t:"そのままにする", c:false}] },
            { q: "おじぎ（Bow）は いつしますか？", options: [{t:"あいさつの時", c:true}, {t:"電話の時", c:false}] },
            { q: "プレゼントを渡す時、何と言いますか？", options: [{t:"つまらないものですが...", c:true}, {t:"これは高いですよ！", c:false}] }
        ]
    }
};

// --- アプリロジック ---
let currentCategory = null;
let currentQuizIndex = 0;
let currentScore = 0;
const synth = window.speechSynthesis;

window.showScreen = (id) => {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // 学習モードの時だけ固定ボタンを表示
    const btn = document.getElementById('start-game-btn');
    if(id === 'screen-learning') {
        btn.style.display = 'flex';
        renderLearning();
    } else {
        btn.style.display = 'none';
    }

    if(id === 'screen-select') renderCategoryButtons();
    window.scrollTo(0,0);
};

// 1. 練習画面の描画（イラスト付き）
function renderLearning() {
    const container = document.getElementById('learning-content');
    container.textContent = '';
    
    Object.keys(mannersData).forEach(key => {
        const data = mannersData[key];
        const card = document.createElement('div');
        card.className = 'learning-card';
        
        let listHtml = '';
        data.learning.forEach(item => {
            // イラストを追加
            listHtml += `
                <li class="manner-item">
                    <div class="manner-img-box"><img src="${item.image}" class="manner-img" alt="マナーイラスト"></div>
                    <div class="manner-text">
                        <i class="fa-solid fa-check check-icon"></i> 
                        <span>${item.text}</span>
                    </div>
                </li>`;
        });

        card.textContent = `
            <div class="cat-title"><i class="fa-solid ${data.icon}"></i> ${data.title}</div>
            <ul class="manner-list">${listHtml}</ul>
        `;
        container.appendChild(card);
    });
}

// 2. カテゴリ選択ボタンの描画
function renderCategoryButtons() {
    const grid = document.getElementById('cat-grid');
    grid.textContent = '';
    Object.keys(mannersData).forEach(key => {
        const data = mannersData[key];
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerHTML = `<i class="fa-solid ${data.icon}"></i><span>${data.title}</span>`;
        btn.onclick = () => startGame(key);
        grid.appendChild(btn);
    });
}

// 3. ゲーム開始
window.startGame = (catKey) => {
    currentCategory = mannersData[catKey];
    currentQuizIndex = 0;
    currentScore = 0;
    // シャッフル
    currentCategory.quizzes.sort(() => Math.random() - 0.5);
    
    showScreen('screen-quiz');
    document.getElementById('quiz-cat-name').textContent = currentCategory.title;
    loadQuiz();
};

function loadQuiz() {
    const qData = currentCategory.quizzes[currentQuizIndex];
    document.getElementById('quiz-progress').textContent = `${currentQuizIndex + 1} / ${currentCategory.quizzes.length}`;
    document.getElementById('quiz-question').textContent = qData.q;
    speak(qData.q);

    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.textContent = '';

    // 選択肢シャッフル
    const options = [...qData.options].sort(() => Math.random() - 0.5);

    options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        const label = idx === 0 ? "A" : idx === 1 ? "B" : "C";
        btn.innerHTML = `<span class="option-tag">${label}</span> <span>${opt.t}</span>`;
        btn.onclick = () => checkAnswer(opt.c, opt.t);
        optionsDiv.appendChild(btn);
    });
}

function speak(text) {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    synth.speak(utter);
}

// 4. 判定
window.checkAnswer = (isCorrect, text) => {
    const modal = document.getElementById('feedback-modal');
    const icon = document.getElementById('fb-icon');
    const title = document.getElementById('fb-text');
    const detail = document.getElementById('fb-detail');
    const nextBtn = document.getElementById('fb-next-btn');

    modal.style.display = 'flex';
    
    // 読み上げ
    speak(isCorrect ? "せいかい！" : "ちがいます");

    if (isCorrect) {
        currentScore++;
        icon.innerHTML = '<i class="fa-regular fa-circle fb-correct"></i>';
        title.textContent = "正解！";
        title.style.color = "#4caf50";
        detail.textContent = "すばらしい！そのとおりです。";
        // ポイント加算（1問正解で10pt）
        if(window.addPoints) window.addPoints(10);
    } else {
        icon.innerHTML = '<i class="fa-solid fa-xmark fb-wrong"></i>';
        title.textContent = "残念...";
        title.style.color = "#f44336";
        detail.textContent = "正しいのは... 他の答えです。";
    }

    if (currentQuizIndex >= currentCategory.quizzes.length - 1) {
        nextBtn.textContent = "結果を見る";
        nextBtn.onclick = showResult;
    } else {
        nextBtn.textContent = "次へ";
        nextBtn.onclick = () => {
            modal.style.display = 'none';
            nextQuestion();
        };
    }
};

window.nextQuestion = () => {
    currentQuizIndex++;
    loadQuiz();
};

window.showResult = () => {
    document.getElementById('feedback-modal').style.display = 'none';
    alert(`お疲れ様でした！\n正解数: ${currentScore} / ${currentCategory.quizzes.length}\n獲得ポイント: ${currentScore * 10}pt`);
    showScreen('screen-select');
};

window.quitGame = () => {
    if(confirm("ゲームをやめますか？")) {
        showScreen('screen-select');
    }
};

// 初期化
window.onload = () => {
    renderLearning();
    showScreen('screen-learning');
};