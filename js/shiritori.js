document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const START_BUTTON = document.getElementById('shiritoriStartButton');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_TEXT = document.getElementById('current-word-text');
    const IMAGE_AREA = document.getElementById('image-area');
    const BACK_BUTTON = document.getElementById('shiritoriBackToMenu');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('feedback');
    const QUESTION_TEXT = document.getElementById('question-text');

    let allWords = [];
    let usedWords = new Set();
    let lastChar = ''; 
    let score = 0;             // 正解数（連鎖数）
    let incorrectCount = 0;    // 間違えた回数
    
    // 1. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const url = './data/words.json';
            console.log('[Shiritori] fetching words from', url);
            const response = await fetch(url);
            if (!response.ok) {
                console.error('[Shiritori] fetch failed, status:', response.status, response.statusText);
                allWords = [];
                return allWords;
            }
            const data = await response.json();
            console.log(`[Shiritori] loaded ${Array.isArray(data) ? data.length : 0} raw entries from words.json`);
            // 読み（reading）の最後が「ん」または「ン」で終わる単語のみを除外
            allWords = (Array.isArray(data) ? data : []).filter(word => {
                const r = (word.reading || '').toString();
                return !r.endsWith('ん') && !r.endsWith('ン');
            });
            console.log(`[Shiritori] after filtering (exclude ending ん/ン): ${allWords.length} entries available`);
            return allWords;
        } catch (error) {
            console.error('[Shiritori] 単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 2. スコア表示を更新する関数 (例: 14/2)
    function updateScoreDisplay(message) {
        const scoreDisplay = `${score}連鎖 / 失敗${incorrectCount}回`;
        TURN_MESSAGE.innerHTML = `${message} (${scoreDisplay})`;
    }

    // 3. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MENU_AREA) MENU_AREA.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';
        
        // リセット
        usedWords.clear();
        lastChar = '';
        score = 0;
        incorrectCount = 0;
        CURRENT_WORD_TEXT.textContent = '';
        FEEDBACK.textContent = '単語を選んでね！';
        CHOICE_BUTTONS_AREA.innerHTML = '';
        IMAGE_AREA.innerHTML = ''; // 画像をリセット
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'none';

        // 初期メッセージ
        TURN_MESSAGE.textContent = 'ゲーム開始';
        QUESTION_TEXT.textContent = 'しりとりであそぼう！';


        if (START_BUTTON) {
            START_BUTTON.removeEventListener('click', startNewGame);
            START_BUTTON.addEventListener('click', startNewGame);
            // 単語が十分に読み込まれるまでボタンを無効化
            const startDisabled = !(Array.isArray(allWords) && allWords.length >= 3);
            START_BUTTON.disabled = startDisabled;
            START_BUTTON.title = startDisabled ? '単語データを読み込んでください（少なくとも3件）' : '';
            console.log('[Shiritori] renderMenu: start button disabled =', startDisabled);
        }
    }

    // 4. ゲーム開始 (最初の単語を選び、すぐにプレイヤーのターンへ)
    function startNewGame() {
        if (allWords.length < 3) {
            alert('単語データが不足しています。');
            renderMenu();
            return;
        }
        
        if (MENU_AREA) MENU_AREA.style.display = 'none';
        if (GAME_AREA) GAME_AREA.style.display = 'block';
        
        // 状態リセット
        usedWords.clear();
        lastChar = '';
        score = 0;
        incorrectCount = 0;
        FEEDBACK.textContent = '単語を選んでね！';
        
        // 最初の単語をランダムに選び、ゲーム開始
        const firstWord = allWords[Math.floor(Math.random() * allWords.length)];
        useWord(firstWord, 'スタート'); 
        lastChar = firstWord.reading.slice(-1);
        score = 1; // スタート単語を1連鎖目とする

        playerTurn(); 
    }
    
    // js/shiritori.js 内の function playerTurn() をこのコードに置き換えてください

    // 5. プレイヤーのターン (3択クイズとして表示)
    function playerTurn() {
        
        // しりとりルールを満たす単語（正解候補）を見つける
        let availableWords = allWords.filter(word => 
            !usedWords.has(word.reading) && (lastChar === '' || word.reading.charAt(0) === lastChar)
        );

        if (availableWords.length === 0) {
            endGame('おめでとう！辞書のすべての単語を使い切りました。', true); 
            return;
        }
        
        // 正解の単語を1つ選ぶ
        const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        let choices = [correctWord]; 

        // 2. ★ 修正: 不正解の選択肢を2つ選ぶ ★
        let wrongWords = [];
        let attempts = 0;
        const MAX_ATTEMPTS = allWords.length * 2; 

        // ★ 修正: 2つ見つかるまでループする (wrongWords.length < 2) ★
        while (wrongWords.length < 2 && attempts < MAX_ATTEMPTS) { 
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            const isUsed = usedWords.has(randomWord.reading);
            const isDuplicate = wrongWords.some(w => w.id === randomWord.id);
            const isCorrect = correctWord.id === randomWord.id;

            if (!isUsed && !isDuplicate && !isCorrect) {
                // 不正解の条件: 正解の単語と、読みの最初の文字が異なる単語を選ぶ
                if (randomWord.reading.charAt(0) !== correctWord.reading.charAt(0)) {
                    wrongWords.push(randomWord);
                }
            }
            attempts++;
        }
        
        // 選択肢を3つに固定する (正解1つ + 不正解2つ)
        let finalChoices = shuffleArray([...choices, ...wrongWords.slice(0, 2)]);
        
        // 画面を更新
        updateScoreDisplay(`チャレンジ中！`);
        QUESTION_TEXT.textContent = `直前の単語は「${lastChar}」で終わりました。この文字から始まるイラストを選んでください。`;
        renderChoices(finalChoices);
    }

    // 6. ユーザーの回答を処理
    function handleAnswer(event) {
        const card = event.target.closest('.choice-card');
        if (!card) return;

        const selectedReading = card.dataset.wordReading;
        const selectedWordData = allWords.find(word => word.reading === selectedReading);
        const allChoiceCards = document.querySelectorAll('.choice-card');
        allChoiceCards.forEach(btn => btn.style.pointerEvents = 'none');
        
        // 1. ルールチェック (しりとりが繋がっているか)
        if (selectedReading.charAt(0) !== lastChar) {
            FEEDBACK.textContent = `ざんねん！「${lastChar}」から始まっていません。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; 
            endGame(`ゲームオーバー: ルール違反`, false);
            return;
        }

        // 2. 「ん」チェック (ゲームオーバー)
        if (selectedReading.slice(-1) === 'ん') {
            FEEDBACK.textContent = `「${selectedWordData.word}」は「ん」で終わります！ゲームオーバーです。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            incorrectCount++; 
            endGame(`ゲームオーバー: 「ん」で終了`, false);
            return;
        }
        
        // 3. 使用済みチェック 
        if (usedWords.has(selectedReading)) {
             FEEDBACK.textContent = `既に使用されています。`;
             FEEDBACK.style.color = '#ff6f61';
             incorrectCount++;
             endGame(`ゲームオーバー: 使用済み`, false);
             return;
        }

        // --- 成功処理（ルール適合）---
        FEEDBACK.textContent = 'せいかい！✨ しりとりが繋がりました。';
        FEEDBACK.style.color = '#5c7aff';
        card.style.backgroundColor = '#d1e7dd';
        
        useWord(selectedWordData, 'あなた');
        lastChar = selectedReading.slice(-1);
        score++; // 連鎖数をカウントアップ

        // 次のターンへ（コンピュータのターンはなし）
        setTimeout(() => {
            FEEDBACK.textContent = '単語を選んでね！'; // フィードバックをリセット
            allChoiceCards.forEach(btn => btn.style.pointerEvents = 'auto'); // ボタンを再有効化
            playerTurn();
        }, 1500);
    }

    // 7. 単語の使用と画面表示の更新 (履歴のHTML表示を削除)
    function useWord(wordData, user) {
        const reading = wordData.reading;
        usedWords.add(reading);
        
        // 問題画像を更新
        const imagePath = `assets/images/${wordData.image}`;
        IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" 
                 alt="${wordData.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
        `;
        
        // 現在の単語表示を更新
        CURRENT_WORD_TEXT.innerHTML = `直前の単語: <span style="font-weight: bold; color: #ff6f61;">${wordData.word} (${reading})</span>`;
    }

    // 8. ゲーム終了処理
    function endGame(message, isWin) {
        const finalMessage = isWin ? 
            `🎉 完走！${message}` : 
            `😭 ${message}。`;
            
        updateScoreDisplay('ゲーム終了');
        FEEDBACK.innerHTML = `<span style="font-size: 1.2em;">${finalMessage}</span><br>あなたの連鎖記録は**${score}連鎖**でした！`;
        CHOICE_BUTTONS_AREA.innerHTML = '';
        
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'block';
        BACK_BUTTON.addEventListener('click', renderMenu);
    }
    
    // 9. 選択肢を画面に描画 (イラストのみ)
    function renderChoices(choices) {
        CHOICE_BUTTONS_AREA.innerHTML = choices.map((word, index) => {
            const imagePath = `assets/images/${word.image}`;
            
            // カード型のボタンでイラストのみ表示
            return `
                <div class="menu-card-button menu-card-reset choice-card" data-word-reading="${word.reading}" data-index="${index}">
                    <img src="${imagePath}" 
                         alt="${word.word}" 
                         onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません';" 
                         style="object-fit: cover; border-radius: 5px;">
                </div>
            `;
        }).join('');

        document.querySelectorAll('.choice-card').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    // 10. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 起動
    loadWords().then(renderMenu);
});