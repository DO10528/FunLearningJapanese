document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MAIN_MENU = document.getElementById('main-menu'); 
    const GAME_AREA = document.getElementById('game-area');
    const START_BUTTON = document.getElementById('startButton'); 
    const SCORE_MESSAGE = document.getElementById('score-message'); 
    
    let allWords = [];
    let currentWord = null;
    let score = 0;
    
    // --- 【改善点2, 3のために追加】 ---
    let correctCount = 0;      // 正解数
    let incorrectCount = 0;    // 不正解数
    let askedWordIds = new Set(); // 出題済みの単語IDを記録
    // ---------------------------------

    // 1. JSONデータを読み込む関数 (変更なし)
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

    // 2. メインメニュー画面を表示する関数
    function renderMenu() {
        // メインメニューを表示し、ゲームエリアを非表示
        if (MAIN_MENU) MAIN_MENU.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        // スコア表示を更新
        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p id="current-score">現在のスコア: ${score}点</p>`;
        }

        // スタートボタンにクリックイベントを設定
        if (START_BUTTON) {
            START_BUTTON.removeEventListener('click', startNewGame);
            START_BUTTON.addEventListener('click', startNewGame);
        }
    }

    // 3. ゲーム開始と新しい問題の生成
    function startNewGame() {
        if (allWords.length < 3) {
            alert('ゲームを開始するには最低3つ以上の単語データが必要です。');
            return;
        }
        
        // 画面の表示を切り替え
        if (MAIN_MENU) MAIN_MENU.style.display = 'none'; 
        if (GAME_AREA) GAME_AREA.style.display = 'block'; 

        // 状態をリセット
        score = 0; 
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear(); // 出題済みリストをクリア

        showNextQuestion();
    }

    // 4. 問題をランダムに選び、選択肢を生成する
    function showNextQuestion() {
        
        // 改善点2: 全ての単語が出題されたかチェック
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n正解: ${correctCount}問, 不正解: ${incorrectCount}問`);
            renderMenu(); // メニューに戻る
            return;
        }

        // 改善点2: 未出題の単語だけを抽出して選択
        let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
        
        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id); // 出題リストに追加

        // 不正解の選択肢を2つ選ぶ (ロジックは変更なし)
        let wrongChoices = [];
        while (wrongChoices.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            if (randomWord.id !== currentWord.id && !wrongChoices.includes(randomWord.word)) {
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

        // 改善点3: タイトルに正解数/不正解数を表示
        const scoreDisplay = `${correctCount}/${incorrectCount}`; 

        GAME_AREA.innerHTML = `
            <h3>この絵はどれかな？ (${scoreDisplay})</h3>
            <img src="${imagePath}" alt="${word.word}" style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px;">
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
        const selectedWord = event.target.dataset.word;
        const feedbackElement = document.getElementById('feedback');
        
        // ボタンを無効化
        document.querySelectorAll('.choice-button').forEach(btn => btn.disabled = true);

        if (selectedWord === currentWord.word) {
            feedbackElement.textContent = 'せいかい！✨';
            feedbackElement.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; // 正解数をカウントアップ
            
            // 改善点1: 正解の場合、自動で次の問題へ (1.5秒後)
            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            feedbackElement.textContent = `ざんねん...。正解は「${currentWord.word}」だよ。`;
            feedbackElement.style.color = '#ff6f61';
            incorrectCount += 1; // 不正解数をカウントアップ
            
            // 不正解の場合、手動で次の問題へ進むボタンを表示
            setTimeout(() => {
                const nextButton = document.createElement('button');
                nextButton.id = 'nextButton';
                nextButton.textContent = 'つぎのもんだいへ';
                nextButton.className = 'menu-card-button menu-card-reset'; 
                nextButton.style.marginTop = '20px';
                
                const backButton = document.getElementById('backToMenu');
                backButton.parentNode.insertBefore(nextButton, backButton);

                document.getElementById('nextButton').addEventListener('click', showNextQuestion);
                
                // 改善点3の表示を更新するため、タイトルを再描画
                renderScoreTitleUpdate();
            }, 1500); 
        }
    }

    // 6.5. スコア表示のみを更新する補助関数 (不正解時用)
    function renderScoreTitleUpdate() {
        const titleElement = GAME_AREA.querySelector('h3');
        if (titleElement) {
            const scoreDisplay = `${correctCount}/${incorrectCount}`; 
            titleElement.textContent = `この絵はどれかな？ (${scoreDisplay})`;
        }
    }

    // 7. 配列をランダムにシャッフルするユーティリティ関数 (変更なし)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 全ての処理を開始
    loadWords().then(renderMenu);
});