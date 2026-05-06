import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// === Variables ===
let currentLevel = 'n5';
let questions = [];
let currentIndex = 0;
let score = 0;
const totalQuestions = 10;
let isAnswering = false;

// We will recreate Audio objects on the fly to prevent iPad freezing bugs
const playSound = (type) => {
    const src = type === 'correct' ? 'assets/sounds/seikai.mp3' : 'assets/sounds/bubu.mp3';
    const audio = new Audio(src);
    audio.play().catch(e => console.warn('Audio play failed:', e));
};

// === Initialize DOM ===
const views = {
    level: document.getElementById('level-select-view'),
    quiz: document.getElementById('quiz-view')
};

// Check if Antigravity object exists
if (!window.Antigravity) {
    console.warn("Antigravity object not found. Point system may not work.");
}

// === Quiz Logic ===
window.startQuiz = async (level) => {
    try {
        currentLevel = level;
        score = 0;
        currentIndex = 0;

        // Check if DB is loaded
        if (!window.kanjiDatabase) {
            console.error("kanjiDatabase is not loaded.");
            alert("データの読み込みに失敗しました。");
            return;
        }

        // Fetch user data for dailyTracker
        let tracker = {};
        if (auth.currentUser && sessionStorage.getItem('fun_japanese_user_v2') !== 'guest') {
            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    tracker = userSnap.data().dailyTracker || {};
                }
            } catch (error) {
                console.error("Error fetching user tracker:", error);
            }
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const rawData = window.kanjiDatabase[level];

        if (!rawData) {
            alert(`レベル ${level} のデータがありません。`);
            return;
        }

        // Filter valid kanjis that have at least one reading
        const validData = rawData.filter(item => {
            const hasKun = (item.kun && item.kun !== "" && item.kun !== "-" && item.kun !== "なし");
            const hasOn = (item.on && item.on !== "" && item.on !== "-" && item.on !== "なし");
            return hasKun || hasOn;
        });

        // Prioritize un-acquired ones
        const unacquired = [];
        const acquired = [];
        validData.forEach(item => {
            const questionId = 'kanji_yomi_' + item.kanji;
            if (tracker[questionId] === todayStr) {
                acquired.push(item);
            } else {
                unacquired.push(item);
            }
        });

        // Shuffle both arrays
        unacquired.sort(() => 0.5 - Math.random());
        acquired.sort(() => 0.5 - Math.random());

        // Combine them, taking unacquired first
        let selectedData = [...unacquired, ...acquired];
        
        // Pick exactly 10 or max available
        const count = Math.min(selectedData.length, totalQuestions);
        questions = selectedData.slice(0, count);

        // Switch View
        const scoreArea = document.getElementById('score-area');
        const ingameNav = document.getElementById('ingame-nav');
        const quizArea = document.getElementById('quiz-area');
        const levelLabel = document.getElementById('level-label');

        if (scoreArea) scoreArea.style.display = 'none';
        if (ingameNav) ingameNav.style.display = 'block';
        if (quizArea) quizArea.style.display = 'block';
        if (levelLabel) levelLabel.textContent = level.toUpperCase();
        
        if (views.level) views.level.style.display = 'none';
        if (views.quiz) {
            views.quiz.style.display = 'block';
            views.quiz.classList.add('active');
        }
        
        showQuestion();
    } catch (err) {
        console.error("Error in startQuiz:", err);
        alert("エラーが発生しました: " + err.message);
    }
};

function showQuestion() {
    if (currentIndex >= questions.length) return;

    isAnswering = true;
    const qData = questions[currentIndex];
    
    // Choose which reading to show (kun or on), pick random if both exist
    const hasKun = (qData.kun && qData.kun !== "" && qData.kun !== "-" && qData.kun !== "なし");
    const hasOn = (qData.on && qData.on !== "" && qData.on !== "-" && qData.on !== "なし");
    
    let displayReading = "";
    if (hasKun && hasOn) {
        displayReading = Math.random() < 0.5 ? qData.kun : qData.on;
    } else if (hasKun) {
        displayReading = qData.kun;
    } else {
        displayReading = qData.on;
    }

    const qNum = document.getElementById('q-num');
    const yomiDisplay = document.getElementById('yomi-display');
    const resultMsg = document.getElementById('result-message');
    
    if (qNum) qNum.textContent = currentIndex + 1;
    if (yomiDisplay) yomiDisplay.textContent = displayReading;
    if (resultMsg) resultMsg.textContent = "";

    // Generate choices: 1 correct kanji, 1 incorrect kanji from same level
    const correctKanji = qData.kanji;
    
    const allCandidates = window.kanjiDatabase[currentLevel].filter(item => item.kanji !== correctKanji);
    let distractorKanji = "?";
    if (allCandidates.length >= 1) {
        const shuffled = allCandidates.sort(() => 0.5 - Math.random());
        distractorKanji = shuffled[0].kanji;
    }

    const choices = [correctKanji, distractorKanji];
    choices.sort(() => 0.5 - Math.random());

    // Render buttons
    const container = document.getElementById('choices-container');
    if (container) {
        container.innerHTML = "";
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.onclick = () => checkAnswer(btn, choice, correctKanji, qData.kanji);
            container.appendChild(btn);
        });
    }
}

async function checkAnswer(btn, selected, correct, kanjiId) {
    if (!isAnswering) return;
    isAnswering = false;

    const isCorrect = (selected === correct);
    const resultMsg = document.getElementById('result-message');

    if (isCorrect) {
        btn.classList.add('correct');
        if (resultMsg) {
            resultMsg.textContent = "せいかい！";
            resultMsg.style.color = "var(--correct-color)";
        }
        playSound('correct');
        score += 10;
        
        // Antigravity protocol: add point
        if (window.Antigravity && window.Antigravity.addPoint) {
            window.Antigravity.addPoint('kanji_yomi', 'kanji_yomi_' + kanjiId);
        } else if (window.addPointsToUser) {
            window.addPointsToUser(1, 'kanji_yomi_' + kanjiId);
        }
    } else {
        btn.classList.add('incorrect');
        if (resultMsg) {
            resultMsg.textContent = `ざんねん... せいかいは「${correct}」`;
            resultMsg.style.color = "var(--incorrect-color)";
        }
        playSound('incorrect');
        
        // Highlight correct button
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(b => {
            if (b.textContent === correct) b.classList.add('correct');
        });
    }

    // Proceed to next
    setTimeout(() => {
        currentIndex++;
        if (currentIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    const quizArea = document.getElementById('quiz-area');
    const ingameNav = document.getElementById('ingame-nav');
    const scoreArea = document.getElementById('score-area');
    const scoreText = document.getElementById('score-text');

    if (quizArea) quizArea.style.display = 'none';
    if (ingameNav) ingameNav.style.display = 'none';
    if (scoreArea) scoreArea.style.display = 'block';
    if (scoreText) scoreText.textContent = score;
}

window.backToLevelSelect = () => {
    if (views.quiz) {
        views.quiz.classList.remove('active');
        views.quiz.style.display = 'none';
    }
    if (views.level) views.level.style.display = 'block';
};
