const reactionData = [
    { dialogue: 'テストで100点を取りました！', correct: ['おめでとう！', 'すごいですね！'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '財布を落としてしまいました…', correct: ['大変ですね！', 'それはショックですね'], wrong: ['よかったですね', 'おめでとう'] },
    { dialogue: '明日から日本へ旅行に行きます', correct: ['いいですね！', '楽しみですね'], wrong: ['信じられません', '残念です'] },
    { dialogue: '今日は雨が降っていますね', correct: ['そうですね', 'たしかに'], wrong: ['最高！', 'ショックですね'] },
    { dialogue: '好きな人に告白しました！', correct: ['どうだった？', 'すごい勇気ですね！'], wrong: ['ざんねん', '知りません'] },
    { dialogue: 'ペットの犬が生まれました！', correct: ['かわいい！', 'よかったですね！'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '電車に遅れてしまいました…', correct: ['大丈夫ですか？', '大変ですね'], wrong: ['おめでとう', 'すごい！'] },
    { dialogue: '新しいスマホを買いました！', correct: ['いいですね！', 'どんなの？'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '今日の料理は美味しかったです', correct: ['よかったです！', 'また作りますね'], wrong: ['まずかったです', '知りません'] },
    { dialogue: '風邪をひいてしまいました…', correct: ['大丈夫ですか？', 'ゆっくり休んでください'], wrong: ['おめでとう', 'すごい！'] },
    { dialogue: '富士山に登りました！', correct: ['すごい！', '景色はどうでした？'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '明日は早く起きなければなりません', correct: ['頑張ってください！', '寝坊しないようにね'], wrong: ['最高！', 'ショックですね'] },
    { dialogue: '学校で友達ができました！', correct: ['よかったですね！', 'どんな人？'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '昨日のゲームは面白かったです', correct: ['そうですね！', '私も好きです'], wrong: ['つまらなかったです', '知りません'] },
    { dialogue: '財布が見つかりました！', correct: ['よかったです！', '安心しました'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '今日は忙しい一日でした', correct: ['お疲れ様でした！', 'ゆっくり休んでください'], wrong: ['最高！', 'ショックですね'] },
    { dialogue: '誕生日プレゼントをもらいました！', correct: ['おめでとう！', '何をもらいました？'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: 'ラーメンを食べに行きましょう', correct: ['いいですね！', '行きましょう！'], wrong: ['食べたくないです', '知りません'] },
    { dialogue: '今日の空はきれいですね', correct: ['そうですね！', '青くて気持ちいいです'], wrong: ['汚いです', '知りません'] },
    { dialogue: '試験に合格しました！', correct: ['おめでとう！', 'すごいですね！'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: 'スマホを落として壊しました…', correct: ['大変ですね！', '大丈夫ですか？'], wrong: ['よかったですね', 'おめでとう'] },
    { dialogue: '来年の夏休みは海外に行きます', correct: ['楽しみですね！', 'どこに行きますか？'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: 'この本はとても面白いです', correct: ['そうですか？', '読んでみます！'], wrong: ['つまらないです', '知りません'] },
    { dialogue: '今日は寒いですね', correct: ['そうですね！', '暖かくしてください'], wrong: ['暑いです', '知りません'] },
    { dialogue: 'お祭りに行きました！', correct: ['楽しかったですね！', '何をしました？'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '仕事で大失敗しました…', correct: ['大丈夫ですか？', '次は頑張りましょう！'], wrong: ['おめでとう', 'すごい！'] },
    { dialogue: '新しい靴を買いました！', correct: ['いいですね！', 'どんなの？'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '今日はお弁当を作りました', correct: ['すごいですね！', '美味しそうです'], wrong: ['まずそうです', '知りません'] },
    { dialogue: '猫を拾いました！', correct: ['かわいい！', 'よかったですね！'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '電車の中で寝てしまいました…', correct: ['大丈夫ですか？', '疲れていますね'], wrong: ['おめでとう', 'すごい！'] },
    { dialogue: 'ハロウィンの仮装をしました！', correct: ['すごい！', '何になりました？'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: 'クリスマスパーティーに行きます', correct: ['楽しみですね！', 'いいですね！'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '昨日は徹夜で勉強しました', correct: ['お疲れ様でした！', '大丈夫ですか？'], wrong: ['最高！', 'ショックですね'] },
    { dialogue: '花火大会に行きました！', correct: ['きれいでしたね！', '楽しかったですか？'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '自転車を盗まれました…', correct: ['大変ですね！', '警察に届けましたか？'], wrong: ['よかったですね', 'おめでとう'] },
    { dialogue: '日本語の勉強を始めました', correct: ['いいですね！', '頑張ってください！'], wrong: ['難しいです', '知りません'] },
    { dialogue: '今日はランチを一緒に食べませんか？', correct: ['いいですね！', '行きましょう！'], wrong: ['食べたくないです', '知りません'] },
    { dialogue: 'この映画は感動しました', correct: ['そうですか？', '私も見たいです！'], wrong: ['つまらなかったです', '知りません'] },
    { dialogue: '引っ越しをすることになりました', correct: ['大変ですね！', 'どこに引っ越しますか？'], wrong: ['残念です', 'ごめんなさい'] },
    { dialogue: '桜が咲きました！', correct: ['きれいですね！', '花見に行きましょう！'], wrong: ['汚いです', '知りません'] },
    { dialogue: '期末試験が近づいています', correct: ['頑張ってください！', '大丈夫ですか？'], wrong: ['最高！', 'ショックですね'] },
    { dialogue: '新しいアルバイトを始めました', correct: ['頑張ってください！', 'どんな仕事ですか？'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '買い物に行きませんか？', correct: ['いいですね！', '行きましょう！'], wrong: ['行きたくないです', '知りません'] },
    { dialogue: 'この曲は大好きです', correct: ['私も好きです！', 'いい曲ですね！'], wrong: ['嫌いです', '知りません'] },
    { dialogue: '今日は20キロ歩きました', correct: ['すごいですね！', '疲れましたね'], wrong: ['大変ですね', 'ざんねん'] },
    { dialogue: '犬に吠えられました…', correct: ['大丈夫ですか？', '怖かったですね'], wrong: ['おめでとう', 'すごい！'] },
    { dialogue: '夏休みの計画はもう立てましたか？', correct: ['まだです', 'どこかに行きたいです！'], wrong: ['知りません', 'どうでもいいです'] },
    { dialogue: '今日は天気がいいですね', correct: ['そうですね！', '散歩に行きましょう！'], wrong: ['悪いです', '知りません'] },
    { dialogue: '数学の問題が解けません…', correct: ['一緒に考えましょう！', '先生に聞きましょう'], wrong: ['できなくて当然', '知りません'] },
    { dialogue: '誕生日パーティーに来てください', correct: ['いいですね！', '行きます！'], wrong: ['行けません', '知りません'] },
    { dialogue: 'このカメラは高性能です', correct: ['すごいですね！', '写真を撮ってみましょう！'], wrong: ['使いにくいです', '知りません'] }
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
    const availableDialogues = reactionData.slice();
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
    if (dialogueDisplayEl) dialogueDisplayEl.textContent = qData.dialogue;
    if (resultMsgEl) resultMsgEl.textContent = '';

    const correctChoice = qData.correct[Math.floor(Math.random() * qData.correct.length)];
    const wrongChoice1 = qData.wrong[Math.floor(Math.random() * qData.wrong.length)];
    let wrongChoice2;
    do {
        wrongChoice2 = qData.wrong[Math.floor(Math.random() * qData.wrong.length)];
    } while (wrongChoice2 === wrongChoice1 && qData.wrong.length > 1);

    const choices = [
        { text: correctChoice, isCorrect: true },
        { text: wrongChoice1, isCorrect: false },
        { text: wrongChoice2, isCorrect: false }
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
            btn.onclick = () => checkAnswer(btn, choice.isCorrect);
            choicesContainerEl.appendChild(btn);
        });
    }
}

async function checkAnswer(btn, isCorrect) {
    if (!isAnswering) return;
    isAnswering = false;

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
                const pointKey = questions[currentIndex].dialogue;
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
