document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MAIN_MENU = document.getElementById('main-menu'); 
    const GAME_AREA = document.getElementById('game-area');
    const SCORE_MESSAGE = document.getElementById('score-message'); 
    
    let allWords = [];
    let currentWord = null;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let askedWordIds = new Set(); 

    // 1. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            allWords = await response.json();
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 2. ゲーム開始処理
    function startNewGame() {
        if (allWords.length < 3) {
            alert('ゲームを開始するには最低3つ以上の単語データが必要です。');
            renderMenu();
            return;
        }
        
        if (MAIN_MENU) MAIN_MENU.style.display = 'none'; 
        if (GAME_AREA) GAME_AREA.style.display = 'block'; 

        score = 0; 
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear(); 

        showNextQuestion();
    }

    // 3. メニューに戻る
    function renderMenu() {
        if (MAIN_MENU) MAIN_MENU.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p id="current-score">前回のスコア: ${score}点 (正解: ${correctCount}問, 不正解: ${incorrectCount}問)</p>`;
        }
    }

    // 4. 問題をランダムに選び、選択肢を生成する
    function showNextQuestion() {
        // ... (問題ロジックは省略) ...
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 不正解: ${incorrectCount}問`);
            renderMenu();
            return;
        }
        let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id); 

        let wrongChoices = [];
        while (wrongChoices.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            const isDifferent = randomWord.reading !== currentWord.reading;
            const isDuplicate = wrongChoices.includes(randomWord.word);

            if (isDifferent && !isDuplicate) {
                wrongChoices.push(randomWord.word);
            }
        }
        
        let choices = [currentWord.word, ...wrongChoices];
        choices = shuffleArray(choices);
        renderQuestion(currentWord, choices);
    }

    // 5. 画面に問題と選択肢を表示する
    function renderQuestion(word, choices) {
        const imagePath = `assets/images/${word.image}`; 
        
        let buttonsHtml = choices.map(choice => 
            `<button class="choice-button" data-word="${choice}">${choice}</button>`
        ).join('');

        const scoreDisplay = `${correctCount}/${incorrectCount}`; 

        GAME_AREA.innerHTML = `
            <h3>この絵はどれかな？ (${scoreDisplay})</h3>
            <img src="${imagePath}" 
                 alt="${word.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover;">
            <div style="margin-top: 20px;">
                ${buttonsHtml}
            </div>
            <p id="feedback" style="font-weight: bold; margin-top: 15px;">答えを選んでね！</p>
            
            <button id="backToMenu" class="menu-card-button menu-card-reset" style="margin-top: 20px;">メニューに戻る</button>
        `;

        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
        
        document.getElementById('backToMenu').addEventListener('click', renderMenu);
    }

    // 6. ユーザーの回答を処理する 
    function handleAnswer(event) {
        // ... (回答ロジックは省略) ...
        const selectedWord = event.target.dataset.word;
        const feedbackElement = document.getElementById('feedback');
        
        document.querySelectorAll('.choice-button').forEach(btn => btn.disabled = true);

        if (selectedWord === currentWord.word) {
            feedbackElement.textContent = 'せいかい！✨';
            feedbackElement.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; 
            
            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            feedbackElement.textContent = `ざんねん...。正解は「${currentWord.word}」だよ。`;
            feedbackElement.style.color = '#ff6f61';
            incorrectCount += 1; 
            
            setTimeout(() => {
                const nextButton = document.createElement('button');
                nextButton.id = 'nextButton';
                nextButton.textContent = 'つぎのもんだいへ';
                nextButton.className = 'menu-card-button menu-card-reset'; 
                nextButton.style.marginTop = '20px';
                
                const backButton = document.getElementById('backToMenu');
                backButton.parentNode.insertBefore(nextButton, backButton);

                document.getElementById('nextButton').addEventListener('click', showNextQuestion);
                
                renderScoreTitleUpdate();
            }, 1500); 
        }
    }

    // 7. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 8. DOMContentLoaded (イベントリスナーの設定)
    document.addEventListener('DOMContentLoaded', () => {
        const startButton1 = document.getElementById('startButton1');

        // 外部から呼ばれる startMainGame 関数を公開
        window.startMainGame = function() {
            loadWords().then(startNewGame);
        };

        if (startButton1) {
            startButton1.addEventListener('click', () => {
                // index.html側で既に定義されている要素を再取得
                const MAIN_MENU = document.getElementById('main-menu');
                const GAME_AREA = document.getElementById('game-area');
                if (MAIN_MENU) MAIN_MENU.style.display = 'none';
                if (GAME_AREA) GAME_AREA.style.display = 'block';
                
                window.startMainGame();
            });
        }
        
        loadWords();
    });
});