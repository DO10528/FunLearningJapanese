const characters = [
    { id: 'friend', name: '友達', icon: 'fa-solid fa-user-group', color: '#4caf50' },
    { id: 'teacher', name: '先生', icon: 'fa-solid fa-chalkboard-user', color: '#2196f3' },
    { id: 'president', name: '社長', icon: 'fa-solid fa-user-tie', color: '#9c27b0' }
];

const honorifics = {
    '飲む': '召し上がる',
    '食べる': '召し上がる',
    'する': 'なさる',
    'くる': 'いらっしゃる',
    '来る': 'いらっしゃる',
    'いく': 'いらっしゃる',
    '行く': 'いらっしゃる',
    'みる': 'ご覧になる',
    '見る': 'ご覧になる',
    'いう': 'おっしゃる',
    '言う': 'おっしゃる',
    'しる': 'ご存知',
    '知る': 'ご存知',
    'いる': 'いらっしゃる',
    '居る': 'いらっしゃる',
    'ねる': 'お休みになる',
    '寝る': 'お休みになる',
    'きる': 'お召しになる',
    '着る': 'お召しになる',
    'あるく': 'お歩きになる',
    '歩く': 'お歩きになる',
    'はなす': 'お話しになる',
    '話す': 'お話しになる',
    'かく': 'お書きになる',
    '書く': 'お書きになる',
    'よむ': 'お読みになる',
    '読む': 'お読みになる',
    'たべる': '召し上がる',
    '食べる': '召し上がる',
    'のむ': '召し上がる',
    '飲む': '召し上がる'
};

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

    const selectedVerbs = [];
    const availableVerbs = masterVerbs.slice();
    for (let i = 0; i < totalQuestions && availableVerbs.length > 0; i++) {
        const idx = Math.floor(Math.random() * availableVerbs.length);
        const verb = availableVerbs.splice(idx, 1)[0];
        const char = characters[Math.floor(Math.random() * characters.length)];
        selectedVerbs.push({ verb, character: char });
    }
    questions = selectedVerbs;

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

function getMasuForm(jishoForm) {
    if (!jishoForm) return '';
    if (jishoForm.endsWith('する')) {
        return jishoForm.replace('する', 'します');
    } else if (jishoForm.endsWith('くる')) {
        return jishoForm.replace('くる', 'きます');
    } else if (jishoForm.endsWith('る')) {
        return jishoForm.replace('る', 'ます');
    } else {
        const lastChar = jishoForm.slice(-1);
        const map = {
            'く': 'きます', 'ぐ': 'ぎます', 'す': 'します',
            'つ': 'ちます', 'ぬ': 'にます', 'ぶ': 'びます',
            'む': 'みます', 'る': 'ります', 'う': 'います'
        };
        return jishoForm.slice(0, -1) + (map[lastChar] || 'ます');
    }
}

function getStem(jishoForm) {
    if (!jishoForm) return '';
    if (jishoForm.endsWith('する')) {
        return jishoForm.replace('する', '');
    } else if (jishoForm.endsWith('くる')) {
        return jishoForm.replace('くる', '');
    } else if (jishoForm.endsWith('る')) {
        return jishoForm.slice(0, -1);
    } else {
        const lastChar = jishoForm.slice(-1);
        const map = {
            'く': 'き', 'ぐ': 'ぎ', 'す': 'し',
            'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び',
            'む': 'み', 'る': 'り', 'う': 'い'
        };
        return jishoForm.slice(0, -1) + (map[lastChar] || '');
    }
}

function getHonorificForm(jishoForm) {
    if (honorifics[jishoForm]) {
        const honJisho = honorifics[jishoForm];
        if (honJisho === 'ご存知') {
            return 'ご存知ですか？';
        }
        return getMasuForm(honJisho) + 'か？';
    }
    const stem = getStem(jishoForm);
    if (stem) {
        if (jishoForm.match(/[\u4e00-\u9faf]/) && !jishoForm.match(/^[ぁ-ん]+$/)) {
            return 'ご' + stem + 'になりますか？';
        } else {
            return 'お' + stem + 'になりますか？';
        }
    }
    return getMasuForm(jishoForm) + 'か？';
}

function showQuestion() {
    if (currentIndex >= questions.length) {
        showResult();
        return;
    }

    isAnswering = true;
    const qData = questions[currentIndex];
    const verbJisho = qData.verb.kanji.jisho;
    const character = qData.character;

    const qNumEl = document.getElementById('q-num');
    const charDisplayEl = document.getElementById('character-display');
    const verbDisplayEl = document.getElementById('verb-display');
    const resultMsgEl = document.getElementById('result-message');
    const choicesContainerEl = document.getElementById('choices-container');

    if (qNumEl) qNumEl.textContent = currentIndex + 1;
    if (charDisplayEl) {
        charDisplayEl.innerHTML = `<i class="${character.icon}"></i><br>${character.name}`;
        charDisplayEl.style.color = character.color;
    }
    if (verbDisplayEl) verbDisplayEl.textContent = `動詞：${verbJisho}`;
    if (resultMsgEl) resultMsgEl.textContent = '';

    const friendForm = verbJisho + '？';
    const teacherForm = getMasuForm(verbJisho) + 'か？';
    const presidentForm = getHonorificForm(verbJisho);

    const choices = [
        { text: friendForm, target: 'friend' },
        { text: teacherForm, target: 'teacher' },
        { text: presidentForm, target: 'president' }
    ];

    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    if (choicesContainerEl) {
        choicesContainerEl.textContent = '';
        choicesContainerEl.className = 'choices-grid';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => checkAnswer(btn, choice.target, character.id);
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
                const pointKey = `${questions[currentIndex].verb.en}_${questions[currentIndex].character.id}`;
                await window.Antigravity.addPoint('politeness_battle', pointKey);
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
