const aizuchiData = {
    happy: [
        { text: '最高！', icon: 'fa-solid fa-face-laugh-beam' },
        { text: 'いいですね！', icon: 'fa-solid fa-thumbs-up' },
        { text: 'よかった！', icon: 'fa-solid fa-face-smile' },
        { text: 'すごい！', icon: 'fa-solid fa-star' },
        { text: 'おめでとう！', icon: 'fa-solid fa-gift' },
        { text: 'さすが！', icon: 'fa-solid fa-fire' },
        { text: 'うれしい！', icon: 'fa-solid fa-heart' },
        { text: 'すばらしい！', icon: 'fa-solid fa-trophy' },
        { text: 'よくやった！', icon: 'fa-solid fa-hand-sparkles' },
        { text: 'たのしい！', icon: 'fa-solid fa-party-horn' },
        { text: 'ほんとうに！', icon: 'fa-solid fa-circle-check' },
        { text: 'ナイス！', icon: 'fa-solid fa-hand-peace' },
        { text: '大成功！', icon: 'fa-solid fa-check-double' }
    ],
    sad: [
        { text: '大変ですね', icon: 'fa-solid fa-face-frown' },
        { text: 'ショックですね', icon: 'fa-solid fa-face-surprise' },
        { text: '残念です', icon: 'fa-solid fa-face-sad-tear' },
        { text: 'かわいそうに', icon: 'fa-solid fa-heart-circle-minus' },
        { text: 'つらいですね', icon: 'fa-solid fa-hand-holding-heart' },
        { text: 'きびしいですね', icon: 'fa-solid fa-cloud' },
        { text: 'こまったな', icon: 'fa-solid fa-face-dizzy' },
        { text: 'むずかしいですね', icon: 'fa-solid fa-puzzle-piece' }
    ],
    surprise: [
        { text: '本当ですか！？', icon: 'fa-solid fa-face-open-mouth' },
        { text: 'ええっ！', icon: 'fa-solid fa-bolt' },
        { text: '信じられません！', icon: 'fa-solid fa-face-surprise' },
        { text: 'まさか！', icon: 'fa-solid fa-face-flushed' },
        { text: 'すごい！', icon: 'fa-solid fa-star' },
        { text: 'びっくりしました！', icon: 'fa-solid fa-bomb' },
        { text: 'マジで！？', icon: 'fa-solid fa-circle-exclamation' }
    ],
    neutral: [
        { text: 'なるほど', icon: 'fa-solid fa-lightbulb' },
        { text: 'そうですね', icon: 'fa-solid fa-check' },
        { text: 'たしかに', icon: 'fa-solid fa-thumbs-up' },
        { text: 'わかりました', icon: 'fa-solid fa-hand-holding' },
        { text: 'そうなんですね', icon: 'fa-solid fa-circle-info' },
        { text: 'なるほどね', icon: 'fa-solid fa-face-thinking' },
        { text: 'そうですか', icon: 'fa-solid fa-question' }
    ]
};

const dialogues = [
    { text: '宝くじに当たりました！', category: 'happy' },
    { text: '今日はとてもいい天気です！', category: 'happy' },
    { text: '試験に合格しました！', category: 'happy' },
    { text: '新しい友達ができました！', category: 'happy' },
    { text: '好きな人に告白したらOKでした！', category: 'happy' },
    { text: 'ペットが生まれました！', category: 'happy' },
    { text: '仕事が早く終わりました！', category: 'happy' },
    { text: '家族に会いに行きます！', category: 'happy' },
    { text: '大好きなレストランに行けます！', category: 'happy' },
    { text: 'プレゼントをもらいました！', category: 'happy' },
    { text: '犬にかまれました...', category: 'sad' },
    { text: '財布を落としました...', category: 'sad' },
    { text: '電車に遅れました...', category: 'sad' },
    { text: '雨でピクニックが中止になりました...', category: 'sad' },
    { text: '好きな人にふられました...', category: 'sad' },
    { text: '風邪をひきました...', category: 'sad' },
    { text: '大切なものを壊しました...', category: 'sad' },
    { text: '試験に落ちました...', category: 'sad' },
    { text: 'ペットが逃げました...', category: 'sad' },
    { text: '仕事で大失敗しました...', category: 'sad' },
    { text: '宇宙人に会いました！', category: 'surprise' },
    { text: '100万円拾いました！', category: 'surprise' },
    { text: '有名人に会いました！', category: 'surprise' },
    { text: '空を飛べるようになりました！', category: 'surprise' },
    { text: 'タイムマシンが発明されました！', category: 'surprise' },
    { text: '明日から夏休みです！', category: 'surprise' },
    { text: 'ずっと会いたかった人に突然会えました！', category: 'surprise' },
    { text: '家にサンタさんが来ました！', category: 'surprise' },
    { text: 'ラーメンが無料で食べられます！', category: 'surprise' },
    { text: '突然空が紫色になりました！', category: 'surprise' },
    { text: '昨日は図書館に行きました', category: 'neutral' },
    { text: '今日はパンを食べました', category: 'neutral' },
    { text: '散歩に行きたいです', category: 'neutral' },
    { text: '来月旅行に行きます', category: 'neutral' },
    { text: 'この本はとても面白いです', category: 'neutral' },
    { text: '毎日朝7時に起きます', category: 'neutral' },
    { text: 'この辺りは静かです', category: 'neutral' },
    { text: '好きな色は青です', category: 'neutral' },
    { text: '趣味は写真です', category: 'neutral' },
    { text: 'このレストランの料理は美味しいです', category: 'neutral' }
];

let currentLevel = 'beginner';
let questions = [];
let currentIndex = 0;
let score = 0;
let agEarnedPoints = 0;
const totalQuestions = 10;
let isAnswering = false;

const views = {
    level: document.getElementById('level-select-view'),
    quiz: document.getElementById('quiz-view')
};

window.startQuiz = (level) => {
    currentLevel = level;
    score = 0;
    agEarnedPoints = 0;
    currentIndex = 0;

    const selectedDialogues = [];
    const availableDialogues = dialogues.slice();
    for (let i = 0; i < totalQuestions && availableDialogues.length > 0; i++) {
        const idx = Math.floor(Math.random() * availableDialogues.length);
        selectedDialogues.push(availableDialogues.splice(idx, 1)[0]);
    }
    questions = selectedDialogues;

    const scoreAreaEl = document.getElementById('score-area');
    const ingameNavEl = document.getElementById('ingame-nav');
    const quizAreaEl = document.getElementById('quiz-area');
    if (scoreAreaEl) scoreAreaEl.style.display = 'none';
    if (ingameNavEl) ingameNavEl.style.display = 'block';
    if (quizAreaEl) quizAreaEl.style.display = 'block';

    if (views.level) views.level.style.display = 'none';
    if (views.quiz) views.quiz.classList.add('active');

    showQuestion();
};

function showQuestion() {
    if (currentIndex >= questions.length) {
        showResult();
        return;
    }

    isAnswering = true;
    const qData = questions[currentIndex];

    const qNumEl = document.getElementById('q-num');
    const dialogueDisplayEl = document.getElementById('dialogue-display');
    const resultMsgEl = document.getElementById('result-message');
    const choicesContainerEl = document.getElementById('choices-container');

    if (qNumEl) qNumEl.textContent = currentIndex + 1;
    if (dialogueDisplayEl) dialogueDisplayEl.textContent = qData.text;
    if (resultMsgEl) resultMsgEl.textContent = '';

    const categories = [
        { id: 'happy', name: 'うれしい', icon: 'fa-solid fa-face-laugh', color: '#4caf50' },
        { id: 'sad', name: 'かなしい', icon: 'fa-solid fa-face-frown', color: '#f44336' },
        { id: 'surprise', name: 'びっくり', icon: 'fa-solid fa-face-surprise', color: '#ff9800' },
        { id: 'neutral', name: 'ふつう', icon: 'fa-solid fa-face-smile', color: '#2196f3' }
    ];

    for (let i = categories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categories[i], categories[j]] = [categories[j], categories[i]];
    }

    if (choicesContainerEl) {
        choicesContainerEl.textContent = '';
        choicesContainerEl.className = 'choices-grid';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<i class="${cat.icon}"></i><br>${cat.name}`;
            btn.style.color = cat.color;
            btn.onclick = () => checkAnswer(btn, cat.id, qData.category);
            choicesContainerEl.appendChild(btn);
        });
    }
}

async function checkAnswer(btn, selected, correct) {
    if (!isAnswering) return;
    isAnswering = false;

    const isCorrect = (selected === correct);
    const buttons = document.querySelectorAll('.choice-btn');
    const resultMessageEl = document.getElementById('result-message');
    const seikaiSoundEl = document.getElementById('seikai-sound');
    const bubuSoundEl = document.getElementById('bubu-sound');

    if (isCorrect) {
        btn.classList.add('correct');
        if (resultMessageEl) {
            resultMessageEl.textContent = '🎉 Excellent! せいかい！';
            resultMessageEl.style.color = 'var(--correct-color)';
        }
        if (seikaiSoundEl) {
            seikaiSoundEl.currentTime = 0;
            seikaiSoundEl.play().catch(e => console.error('Sound error:', e));
        }
        score += 10;

        if (window.Antigravity && window.Antigravity.addPoint) {
            try {
                const pointKey = questions[currentIndex].text;
                await window.Antigravity.addPoint('reaction_king', pointKey);
                agEarnedPoints++;
            } catch(e) {
                console.error('Antigravity point error:', e);
            }
        }
    } else {
        btn.classList.add('incorrect');
        if (resultMessageEl) {
            resultMessageEl.textContent = `Oops! ざんねん...`;
            resultMessageEl.style.color = 'var(--incorrect-color)';
        }
        if (bubuSoundEl) {
            bubuSoundEl.currentTime = 0;
            bubuSoundEl.play().catch(e => console.error('Sound error:', e));
        }
    }

    buttons.forEach(b => {
        b.disabled = true;
    });

    setTimeout(() => {
        currentIndex++;
        if (currentIndex >= questions.length) {
            showResult();
        } else {
            showQuestion();
        }
    }, 1800);
}

function showResult() {
    const quizAreaEl = document.getElementById('quiz-area');
    const ingameNavEl = document.getElementById('ingame-nav');
    const scoreAreaEl = document.getElementById('score-area');
    const scoreTextEl = document.getElementById('score-text');
    const pointsTextEl = document.getElementById('points-text');

    if (quizAreaEl) quizAreaEl.style.display = 'none';
    if (ingameNavEl) ingameNavEl.style.display = 'none';

    if (window.Antigravity && window.Antigravity.showResultScreen) {
        window.Antigravity.showResultScreen(agEarnedPoints);
    } else {
        if (scoreAreaEl) scoreAreaEl.style.display = 'block';
        if (scoreTextEl) scoreTextEl.textContent = score;
        if (pointsTextEl) pointsTextEl.textContent = agEarnedPoints;
    }
}

window.backToLevelSelect = () => {
    if (views.quiz) views.quiz.classList.remove('active');
    if (views.level) views.level.style.display = 'block';
};
