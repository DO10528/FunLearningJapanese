function stripRuby(htmlString) {
if (!htmlString) return '';
let text = htmlString.replace(/<rt>.*?<\/rt>/g, '');
return text.replace(/<[^>]*>/g, '');
}

const learningData = [
{
title: "基本・書類 (Basics)", icon: "fa-passport",
phrases: [
{ text: "パスポートを<ruby>見<rt>み</rt></ruby>せてください", en: "Please show your passport.", speech: "ぱすぽーとをみせてください" },
{ text: "はい、どうぞ", en: "Here you go.", speech: "はいどうぞ" }
]
},
{
title: "目的 (Purpose)", icon: "fa-camera",
phrases: [
{ text: "<ruby>観光<rt>かんこう</rt></ruby>です", en: "For sightseeing.", speech: "かんこうです" },
{ text: "<ruby>仕事<rt>しごと</rt></ruby>です", en: "For business.", speech: "しごとです" },
{ text: "<ruby>留学<rt>りゅうがく</rt></ruby>です", en: "To study abroad.", speech: "りゅうがくです" }
]
},
{
title: "期間 (Duration)", icon: "fa-calendar-days",
phrases: [
{ text: "<ruby>5日間<rt>いつかかん</rt></ruby>です", en: "For 5 days.", speech: "いつかかんです" },
{ text: "<ruby>1週間<rt>いっしゅうかん</rt></ruby>です", en: "For 1 week.", speech: "いっしゅうかんです" },
{ text: "<ruby>2週間<rt>にしゅうかん</rt></ruby>です", en: "For 2 weeks.", speech: "にしゅうかんです" },
{ text: "<ruby>14日間<rt>じゅうよっかかん</rt></ruby>です", en: "For 14 days.", speech: "じゅうよっかかんです" },
{ text: "<ruby>1ヶ月<rt>いっかげつ</rt></ruby>です", en: "For 1 month.", speech: "いっかげつです" }
]
},
{
title: "滞在先 (Accommodation)", icon: "fa-hotel",
phrases: [
{ text: "<ruby>東京<rt>とうきょう</rt></ruby>のホテルです", en: "A hotel in Tokyo.", speech: "とうきょうのほてるです" },
{ text: "<ruby>大阪<rt>おおさか</rt></ruby>のホテルです", en: "A hotel in Osaka.", speech: "おおさかのほてるです" },
{ text: "<ruby>京都<rt>きょうと</rt></ruby>のホテルです", en: "A hotel in Kyoto.", speech: "きょうとのほてるです" },
{ text: "<ruby>友達<rt>ともだち</rt></ruby>の<ruby>家<rt>いえ</rt></ruby>です", en: "My friend's house.", speech: "ともだちのいえです" },
{ text: "<ruby>親戚<rt>しんせき</rt></ruby>の<ruby>家<rt>いえ</rt></ruby>です", en: "Relative's house.", speech: "しんせきのいえです" },
{ text: "Airbnbです", en: "Airbnb.", speech: "えあびーあんどびーです" },
{ text: "ゲストハウスです", en: "Guest house.", speech: "げすとはうすです" }
]
},
{
title: "同伴者 (Companions)", icon: "fa-users",
phrases: [
{ text: "<ruby>一人<rt>ひとり</rt></ruby>です", en: "I am alone.", speech: "ひとりです" },
{ text: "<ruby>家族<rt>かぞく</rt></ruby>と<ruby>来<rt>き</rt></ruby>ました", en: "I came with my family.", speech: "かぞくときました" },
{ text: "<ruby>友達<rt>ともだち</rt></ruby>と<ruby>一緒<rt>いっしょ</rt></ruby>です", en: "I am with my friend.", speech: "ともだちといっしょです" }
]
},
{
title: "税関・所持金 (Customs & Money)", icon: "fa-money-bill-wave",
phrases: [
{ text: "ありません", en: "I have nothing to declare.", speech: "ありません" },
{ text: "<ruby>10万円<rt>じゅうまんえん</rt></ruby>くらいです", en: "About 100,000 yen.", speech: "じゅうまんえんくらいです" },
{ text: "<ruby>20万円<rt>にじゅうまんえん</rt></ruby>くらいです", en: "About 200,000 yen.", speech: "にじゅうまんえんくらいです" },
{ text: "クレジットカードです", en: "I have a credit card.", speech: "くれじっとかーどです" },
{ text: "VISAカードです", en: "I have a VISA card.", speech: "びざかーどです" }
]
}
];

// ★ 答えを複数用意し、ランダムに出題されるように変更
// ★ 「100,000円です」などの言い切りやカンマ付きの数字も網羅的に許容
const gameData = {
immigration: {
title: "入国審査",
questions: [
{ 
    examiner: "パスポートを<ruby>見<rt>み</rt></ruby>せてください。", 
    targets: [
        { text: "はい、どうぞ", accepts: ["はいどうぞ", "はい", "どうぞ"] }
    ] 
},
{ 
    examiner: "<ruby>目的<rt>もくてき</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか？", 
    targets: [
        { text: "<ruby>観光<rt>かんこう</rt></ruby>です", accepts: ["かんこうです", "観光", "かんこう", "観光です"] },
        { text: "<ruby>仕事<rt>しごと</rt></ruby>です", accepts: ["しごとです", "仕事", "しごと", "仕事です"] },
        { text: "<ruby>留学<rt>りゅうがく</rt></ruby>です", accepts: ["りゅうがくです", "留学", "りゅうがく", "留学です"] }
    ] 
},
{ 
    examiner: "どのくらい<ruby>滞在<rt>たいざい</rt></ruby>しますか？", 
    targets: [
        { text: "<ruby>5日間<rt>いつかかん</rt></ruby>です", accepts: ["いつかかんです", "5日かんです", "5日間", "いつかかん", "5日"] },
        { text: "<ruby>1週間<rt>いっしゅうかん</rt></ruby>です", accepts: ["いっしゅうかんです", "1しゅうかんです", "1週間", "いっしゅうかん", "いっしゅうかんくらいです"] },
        { text: "<ruby>2週間<rt>にしゅうかん</rt></ruby>です", accepts: ["にしゅうかんです", "2しゅうかんです", "2週間", "にしゅうかん"] }
    ] 
},
{ 
    examiner: "どこに<ruby>泊<rt>と</rt></ruby>まりますか？", 
    targets: [
        { text: "<ruby>東京<rt>とうきょう</rt></ruby>のホテルです", accepts: ["とうきょうのほてるです", "東京のホテル", "とうきょうのほてる"] },
        { text: "<ruby>大阪<rt>おおさか</rt></ruby>のホテルです", accepts: ["おおさかのほてるです", "大阪のホテル", "おおさかのほてる"] },
        { text: "<ruby>友達<rt>ともだち</rt></ruby>の<ruby>家<rt>いえ</rt></ruby>です", accepts: ["ともだちのいえです", "友達の家", "ともだちのいえ"] }
    ] 
},
{ 
    examiner: "<ruby>誰<rt>だれ</rt></ruby>と<ruby>来<rt>き</rt></ruby>ましたか？", 
    targets: [
        { text: "<ruby>一人<rt>ひとり</rt></ruby>です", accepts: ["ひとりです", "一人", "ひとり"] },
        { text: "<ruby>家族<rt>かぞく</rt></ruby>と<ruby>来<rt>き</rt></ruby>ました", accepts: ["かぞくときました", "家族と", "かぞくと", "家族", "かぞく", "かぞくときました"] },
        { text: "<ruby>友達<rt>ともだち</rt></ruby>と<ruby>一緒<rt>いっしょ</rt></ruby>です", accepts: ["ともだちといっしょです", "友達と一緒", "ともだちといっしょ", "友達と", "友達とです","ともだちと"] }
    ] 
}
]
},
customs: {
title: "税関",
questions: [
{ 
    examiner: "<ruby>申告<rt>しんこく</rt></ruby>するものはありますか？", 
    targets: [
        { text: "ありません", accepts: ["ないです", "いいえ", "ない", "ありません"] }
    ] 
},
{ 
    examiner: "<ruby>所持金<rt>しょじきん</rt></ruby>はいくらですか？", 
    targets: [
        { 
            text: "<ruby>10万円<rt>じゅうまんえん</rt></ruby>くらいです", 
            accepts: [
                "じゅうまんえんくらいです", "十万円くらいです", "10万円くらいです", "100000円位です", "100,000円位です", "100,000えんくらいです",
                "じゅうまんえんです", "十万円です", "10万円です", "100000円です", "100,000円です", "100,000えんです",
                "じゅうまんえん", "十万円", "10万円", "100000円", "100,000円", "10万"
            ] 
        },
        { 
            text: "<ruby>5万円<rt>ごまんえん</rt></ruby>くらいです", 
            accepts: [
                "ごまんえんくらいです", "五万円くらいです", "5万円くらいです", "50000円位です", "50,000円位です", "50,000えんくらいです",
                "ごまんえんです", "五万円です", "5万円です", "50000円です", "50,000円です", "50,000えんです",
                "ごまんえん", "五万円", "5万円", "50000円", "50,000円", "5万"
            ] 
        },
        { 
            text: "<ruby>20万円<rt>にじゅうまんえん</rt></ruby>くらいです", 
            accepts: [
                "にじゅうまんえんくらいです", "二十万円くらいです", "20万円くらいです", "200000円位です", "200,000円位です", "200,000えんくらいです",
                "にじゅうまんえんです", "二十万円です", "20万円です", "200000円です", "200,000円です", "200,000えんです",
                "にじゅうまんえん", "二十万円", "20万円", "200000円", "200,000円", "20万"
            ] 
        }
    ] 
},
{ 
    examiner: "<ruby>他<rt>ほか</rt></ruby>に<ruby>支払<rt>しはら</rt></ruby>いのカードはありますか？", 
    targets: [
        { text: "VISAカードです", accepts: ["びざかーどです", "ビザカードです","クレジットカードです", "visaかーどです", "visaカードです", "VISAカード", "クレジットカード", "あります", "はい"] },
        { text: "クレジットカードです", accepts: ["くれじっとかーどです", "クレジットカード", "くれじっとかーど", "あります", "はい"] }
    ] 
},
{ 
    examiner: "カバンの<ruby>中身<rt>なかみ</rt></ruby>を<ruby>見<rt>み</rt></ruby>せてください。", 
    targets: [
        { text: "はい、わかりました", accepts: ["はいわかりました", "はい", "わかりました", "どうぞ"] }
    ] 
}
]
}
};

let historyStack = ['screen-learning'];
let currentGameType = null;
let currentQuestionIndex = 0;
let isListening = false;
let currentTargetData = null; // 現在の正解データを保持

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = false;
recognition.continuous = false;
}

window.onload = () => {
renderLearning();
updateHeader();
};

function showScreen(id) {
document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
document.getElementById(id).classList.add('active');
if (historyStack[historyStack.length - 1] !== id) {
historyStack.push(id);
}
document.getElementById('start-game-btn').style.display = (id === 'screen-learning') ? 'flex' : 'none';
updateHeader();
window.scrollTo(0,0);
}

window.goBack = () => {
if (historyStack.length > 1) {
historyStack.pop();
const prev = historyStack[historyStack.length - 1];
if (synth.speaking) synth.cancel();
if (isListening && recognition) recognition.stop();
document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
document.getElementById(prev).classList.add('active');
document.getElementById('start-game-btn').style.display = (prev === 'screen-learning') ? 'flex' : 'none';
updateHeader();
}
};

function updateHeader() {
const backBtn = document.getElementById('header-back-btn');
const homeBtn = document.getElementById('header-home-btn');
const current = historyStack[historyStack.length - 1];
if (current === 'screen-learning') {
backBtn.style.display = 'none';
if (homeBtn) homeBtn.style.display = 'block';
} else {
backBtn.style.display = 'block';
if (homeBtn) homeBtn.style.display = 'none';
}
}

function renderLearning() {
const container = document.getElementById('learning-content');
container.textContent = '';
learningData.forEach(cat => {
const section = document.createElement('div');
section.className = 'learning-section';
let phrasesHtml = '';
cat.phrases.forEach(phrase => {
phrasesHtml += `
<div class="phrase-item">
<div class="phrase-text-group">
<span class="phrase-text">${phrase.text}</span>
<span class="phrase-en">${phrase.en}</span>
</div>
<button class="play-btn" onclick="speakText('${phrase.speech || stripRuby(phrase.text)}')">
<i class="fa-solid fa-volume-high"></i>
</button>
</div>`;
});

section.textContent = `
<div class="cat-title"><i class="fa-solid ${cat.icon}"></i> ${cat.title}</div>
<div>${phrasesHtml}</div>
`;
container.appendChild(section);
});
}

window.speakText = (text) => {
if (synth.speaking) synth.cancel();
const utter = new SpeechSynthesisUtterance(text);
utter.lang = 'ja-JP';
utter.rate = 0.85;
synth.speak(utter);
};

window.startGame = (type) => {
if (!SpeechRecognition) {
alert("お使いのブラウザは音声認識に対応していません。SafariかChromeをご利用ください。");
return;
}
currentGameType = type;
currentQuestionIndex = 0;
showScreen('screen-game');
document.getElementById('game-title').textContent = gameData[type].title;
loadQuestion();
};

function loadQuestion() {
const qList = gameData[currentGameType].questions;
const qData = qList[currentQuestionIndex];

// 複数の答えの候補からランダムに1つ選ぶ
currentTargetData = qData.targets[Math.floor(Math.random() * qData.targets.length)];

document.getElementById('game-progress').textContent = `(${currentQuestionIndex + 1}/${qList.length})`;
document.getElementById('examiner-text').textContent = qData.examiner;
document.getElementById('target-phrase').textContent = currentTargetData.text;
document.getElementById('feedback-text').textContent = "";
document.getElementById('recognized-text').textContent = "";
document.getElementById('mic-btn').classList.remove('listening');
isListening = false;

setTimeout(() => { speakText(stripRuby(qData.examiner)); }, 500);
}

window.toggleSpeechRecognition = () => {
const micBtn = document.getElementById('mic-btn');
const feedbackText = document.getElementById('feedback-text');
if (synth.speaking) synth.cancel();

if (isListening) {
recognition.stop();
return;
}

try {
recognition.start();
isListening = true;
micBtn.classList.add('listening');
feedbackText.textContent = "聞いています...";
feedbackText.className = "feedback-text";
} catch (e) {
console.error(e);
}
};

if (recognition) {
recognition.onresult = (event) => {
const transcript = event.results[0][0].transcript;
document.getElementById('recognized-text').textContent = `あなたの発音: 「${transcript}」`;
checkAnswer(transcript);
};

recognition.onend = () => {
isListening = false;
document.getElementById('mic-btn').classList.remove('listening');
if (document.getElementById('feedback-text').textContent === "聞いています...") {
document.getElementById('feedback-text').textContent = "音声が認識できませんでした。もう一度！";
document.getElementById('feedback-text').className = "feedback-text fb-fail";
}
};

recognition.onerror = (event) => {
isListening = false;
document.getElementById('mic-btn').classList.remove('listening');
document.getElementById('feedback-text').textContent = "エラーが発生しました。";
};
}

function calculateSimilarity(s1, s2) {
const cleanS1 = stripRuby(s1).toLowerCase().replace(/[\s、。！？!?,，]/g, '');
const cleanS2 = stripRuby(s2).toLowerCase().replace(/[\s、。！？!?,，]/g, '');
if (cleanS1 === cleanS2) return 100;
if (cleanS1.length === 0 || cleanS2.length === 0) return 0;

let costs = [];
for (let i = 0; i <= cleanS1.length; i++) {
let lastValue = i;
for (let j = 0; j <= cleanS2.length; j++) {
if (i === 0) {
costs[j] = j;
} else if (j > 0) {
let newValue = costs[j - 1];
if (cleanS1.charAt(i - 1) !== cleanS2.charAt(j - 1)) {
newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
}
costs[j - 1] = lastValue;
lastValue = newValue;
}
}
if (i > 0) costs[cleanS2.length] = lastValue;
}
const distance = costs[cleanS2.length];
const maxLen = Math.max(cleanS1.length, cleanS2.length);
return ((1 - distance / maxLen) * 100);
}

function checkAnswer(transcript) {
const fbText = document.getElementById('feedback-text');
// 選ばれたランダムなターゲットデータに対して判定を行う
let maxSimilarity = calculateSimilarity(transcript, currentTargetData.text);
currentTargetData.accepts.forEach(acc => {
const sim = calculateSimilarity(transcript, acc);
if (sim > maxSimilarity) maxSimilarity = sim;
});

console.log(`Similarity: ${maxSimilarity.toFixed(1)}%`);

if (maxSimilarity >= 90) {
fbText.textContent = "合格！ (Excellent)";
fbText.className = "feedback-text fb-success";
const utter = new SpeechSynthesisUtterance("ピンポーン！");
utter.rate = 1.5; synth.speak(utter);

setTimeout(() => {
currentQuestionIndex++;
if (currentQuestionIndex < gameData[currentGameType].questions.length) {
loadQuestion();
} else {
alert("クリアおめでとうございます！");
goBack();
}
}, 1500);

} else {
fbText.textContent = `惜しい！もう一度！`; // パーセンテージ表示は子供が混乱しないように非表示にしました
fbText.className = "feedback-text fb-fail";
}
}