// --- ゲームデータ ---
    const quizData = [
        { word: "おおきい", reading: "おおきい", kanji: "大きい", correct: "🐘", wrong: "🐜", en: "Big" },
        { word: "ちいさい", reading: "ちいさい", kanji: "小さい", correct: "🐜", wrong: "🐘", en: "Small" },
        { word: "あつい", reading: "あつい", kanji: "熱い", correct: "🔥", wrong: "🧊", en: "Hot" },
        { word: "つめたい", reading: "つめたい", kanji: "冷たい", correct: "🧊", wrong: "🔥", en: "Cold" },
        { word: "はやい", reading: "はやい", kanji: "速い", correct: "🏎️", wrong: "🐢", en: "Fast" },
        { word: "おそい", reading: "おそい", kanji: "遅い", correct: "🐢", wrong: "🏎️", en: "Slow" },
        { word: "たかい", reading: "たかい", kanji: "高い", correct: "🦒", wrong: "🐈", en: "Tall" }, 
        { word: "ながい", reading: "ながい", kanji: "長い", correct: "🐍", wrong: "🐛", en: "Long" }, 
        { word: "おもい", reading: "おもい", kanji: "重い", correct: "🪨", wrong: "🪶", en: "Heavy" }, 
        { word: "かるい", reading: "かるい", kanji: "軽い", correct: "🪶", wrong: "🪨", en: "Light" },
        { word: "うれしい", reading: "うれしい", kanji: "嬉しい", correct: "😄", wrong: "😭", en: "Happy" },
        { word: "かなしい", reading: "かなしい", kanji: "悲しい", correct: "😭", wrong: "😄", en: "Sad" },
        { word: "あまい", reading: "あまい", kanji: "甘い", correct: "🍰", wrong: "🍋", en: "Sweet" },
        { word: "すっぱい", reading: "すっぱい", kanji: "酸っぱい", correct: "🍋", wrong: "🍰", en: "Sour" },
        { word: "あかるい", reading: "あかるい", kanji: "明るい", correct: "☀️", wrong: "🌑", en: "Bright" },
        { word: "くらい", reading: "くらい", kanji: "暗い", correct: "🌑", wrong: "☀️", en: "Dark" },
        { word: "おいしい", reading: "おいしい", kanji: "美味しい", correct: "😋", wrong: "🤢", en: "Delicious" },
        { word: "くさい", reading: "くさい", kanji: "臭い", correct: "💩", wrong: "🌸", en: "Smelly" },
        { word: "あたらしい", reading: "あたらしい", kanji: "新しい", correct: "✨👟", wrong: "🏚️", en: "New" },
        { word: "ふるい", reading: "ふるい", kanji: "古い", correct: "🏚️", wrong: "✨🏡", en: "Old" }
    ];

    let currentQ = null;
    let score = 0;
    let streak = 0;
    let isAnswering = false;

    // --- 音声合成 ---
    const synth = window.speechSynthesis;
    let voices = [];
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    function speak(text) {
        synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'ja-JP';
        ut.rate = 0.9;
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        let target = jpVoices.find(v => v.name.includes('Google') || v.name.includes('Female'));
        if(!target && jpVoices.length) target = jpVoices[0];
        if(target) ut.voice = target;
        synth.speak(ut);
    }

    function playSeikai() { new Audio('assets/sounds/seikai.mp3').play().catch(()=>{}); }
    function playBubu() { new Audio('assets/sounds/bubu.mp3').play().catch(()=>{}); }

    function playQuestionSound() {
        if(currentQ) speak(currentQ.word); 
    }

    // --- ゲームロジック ---
    function initGame() {
        score = 0;
        streak = 0;
        updateScore();
        nextQuestion();
    }

    function nextQuestion() {
        isAnswering = true;
        document.getElementById('next-btn').style.display = 'none';
        
        const randomIndex = Math.floor(Math.random() * quizData.length);
        currentQ = quizData[randomIndex];

        document.getElementById('q-word').innerText = currentQ.kanji;
        document.getElementById('q-reading').innerText = currentQ.reading;
        
        setTimeout(() => playQuestionSound(), 300);

        const container = document.getElementById('choices-area');
        container.textContent = '';

        const isLeftCorrect = Math.random() > 0.5;
        const leftContent = isLeftCorrect ? currentQ.correct : currentQ.wrong;
        const rightContent = isLeftCorrect ? currentQ.wrong : currentQ.correct;

        container.appendChild(createCard(leftContent, isLeftCorrect));
        container.appendChild(createCard(rightContent, !isLeftCorrect));
    }

    function createCard(content, isCorrect) {
        const div = document.createElement('div');
        div.className = 'choice-card';
        div.innerHTML = `
            <div class="choice-img">${content}</div>
            <div class="mark" style="color:${isCorrect ? '#4caf50' : '#ef5350'}">
                ${isCorrect ? '<i class="fa-regular fa-circle"></i>' : '<i class="fa-solid fa-xmark"></i>'}
            </div>
        `;
        div.onclick = (e) => checkAnswer(div, isCorrect, e);
        return div;
    }

    function checkAnswer(cardEl, isCorrect, e) {
        if(!isAnswering) return; 
        isAnswering = false;

        const mark = cardEl.querySelector('.mark');
        mark.classList.add('show');

        if(isCorrect) {
            cardEl.classList.add('correct-anim');
            playSeikai();
            
            // ★修正: 1点加算
            score += 1;
            streak++;
            updateScore();
            
            // +1 Pt アニメーション
            showPointAnim(e.clientX, e.clientY);
            
            if(window.addPoints) window.addPoints('adj_' + currentQ.reading);

            setTimeout(() => nextQuestion(), 1500);
        } else {
            cardEl.classList.add('incorrect-anim');
            playBubu();
            streak = 0;
            updateScore();
            document.getElementById('next-btn').style.display = 'inline-block';
        }
    }

    function showPointAnim(x, y) {
        const el = document.createElement('div');
        el.className = 'point-anim';
        el.innerText = "+1";
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    function updateScore() {
        document.getElementById('score').innerText = score;
        document.getElementById('streak').innerText = streak;
    }

    initGame();