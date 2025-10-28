document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const START_BUTTON = document.getElementById('shiritoriStartButton');
    const ERROR_MESSAGE = document.getElementById('error-message'); // (使用しませんが残す)
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_TEXT = document.getElementById('current-word-text');
    const CURRENT_WORD_DISPLAY = document.getElementById('current-word-display');
    const IMAGE_AREA = document.getElementById('image-area');
    const WORD_HISTORY_DISPLAY = document.getElementById('wordHistory');
    const BACK_BUTTON = document.getElementById('shiritoriBackToMenu');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('feedback');

    let allWords = [];
    let usedWords = new Set();
    let lastChar = ''; // 前の単語の最後の文字
    let currentChoices = []; // 現在の選択肢のデータ
    const MAX_HISTORY = 5;

    // 1. JSONデータを読み込む関数
    async function loadWords() {
        try {
            const response = await fetch('data/words.json');
            const data = await response.json();
            // 読み仮名が「ん」で終わらない単語のみを使用
            allWords = data.filter(word => !word.reading.endsWith('ん'));
            return allWords;
        } catch (error) {
            console.error('単語データの読み込みに失敗しました:', error);
            return [];
        }
    }

    // 2. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MENU_AREA) MENU_AREA.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';
        
        // リセット
        usedWords.clear();
        lastChar = '';
        CURRENT_WORD_DISPLAY.textContent = '';
        WORD_HISTORY_DISPLAY.textContent = '';
        FEEDBACK.textContent = '単語を選んでね！';
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'none';

        if (START_BUTTON) {
            START_BUTTON.removeEventListener('click', startNewGame);
            START_BUTTON.addEventListener('click', startNewGame);
        }
    }

    // 3. ゲーム開始
    function startNewGame() {
        if (allWords.length < 3) {
            alert('単語データが不足しています。');
            renderMenu();
            return;
        }
        
        if (MENU_AREA) MENU_AREA.style.display = 'none';
        if (GAME_AREA) GAME_AREA.style.display = 'block';
        
        // 最初の単語をコンピュータが出題
        computerTurn(true); 
    }
    
    // 4. プレイヤーのターン (3択クイズとして表示)
    function playerTurn(wordData) {
        
        // 1. 正解の単語を選び、選択肢を生成
        // 「lastChar」から始まる、未使用の単語を見つける
        let availableWords = allWords.filter(word => 
            !usedWords.has(word.reading) && (lastChar === '' || word.reading.charAt(0) === lastChar)
        );

        if (availableWords.length === 0) {
            endGame('あなたの勝ちです！コンピューターは単語が見つかりませんでした。');
            return;
        }
        
        // 正解の単語を選ぶ (ランダム)
        const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        currentChoices = [correctWord]; // 正解をリストに格納

        // 2. 不正解の選択肢を2つ選ぶ
        let wrongWords = [];
        while (wrongWords.length < 2) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex];
            
            // 選択済みの単語や、既に不正解リストにある単語は避ける
            const isUsed = usedWords.has(randomWord.reading);
            const isDuplicate = wrongWords.some(w => w.id === randomWord.id);
            const isCorrect = correctWord.id === randomWord.id;

            if (!isUsed && !isDuplicate && !isCorrect) {
                // 不正解の単語は、**しりとりルールを満たさない**単語から選ぶ（ゲーム性を維持）
                // ただし、最後の文字が「ん」の単語は避ける
                if (randomWord.reading.charAt(0) !== correctWord.reading.charAt(0) || randomWord.reading.slice(-1) === 'ん') {
                    wrongWords.push(randomWord);
                }
            }
        }
        
        // 3. 選択肢をシャッフルして表示
        let choices = shuffleArray([...currentChoices, ...wrongWords]);
        
        // 4. 画面を更新
        TURN_MESSAGE.textContent = `次はあなたの番です。「${lastChar}」から始まる単語を選んでください。`;
        renderChoices(choices);
    }

    // 5. 選択肢を画面に描画
    function renderChoices(choices) {
        currentChoices = choices;
        CHOICE_BUTTONS_AREA.innerHTML = choices.map((word, index) => {
            const imagePath = `assets/images/${word.image}`;
            
            // 各選択肢をカード型のボタンで表示
            return `
                <div class="menu-card-button menu-card-reset choice-card" data-word-reading="${word.reading}" data-index="${index}" style="width: 200px; height: 180px; margin: 10px;">
                    <img src="${imagePath}" 
                         alt="${word.word}" 
                         onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません';" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    <span style="font-size: 1.1em; margin-top: 5px;">${word.word} (${word.reading})</span>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.choice-card').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    // 6. ユーザーの回答を処理
    function handleAnswer(event) {
        // クリックされたカード要素、またはその親要素を取得
        const card = event.target.closest('.choice-card');
        if (!card) return;

        const selectedReading = card.dataset.wordReading;
        const selectedWordData = allWords.find(word => word.reading === selectedReading);

        // ボタンを無効化
        document.querySelectorAll('.choice-card').forEach(btn => btn.style.pointerEvents = 'none');

        // 1. 「ん」チェック (プレイヤー負け)
        if (selectedReading.slice(-1) === 'ん') {
            FEEDBACK.textContent = `「${selectedWordData.word}」は「ん」で終わります！あなたの負けです。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61'; // 負けを示す赤
            endGame('敗北: 「ん」で終了');
            return;
        }

        // 2. ルールチェック (最初のターン以外)
        if (lastChar && selectedReading.charAt(0) !== lastChar) {
            FEEDBACK.textContent = `不正解！「${lastChar}」から始まっていません。`;
            FEEDBACK.style.color = '#ff6f61';
            card.style.backgroundColor = '#ff6f61';
            
            // 正解はどれかハイライト
            highlightCorrectChoice(card, selectedWordData, false);
            endGame('ルール違反による敗北'); // ルールを満たさない選択肢は負けとする
            return;
        }
        
        // 3. 使用済みチェック (ロジック上は発生しないが念のため)
        if (usedWords.has(selectedReading)) {
             FEEDBACK.textContent = `既に使用されています。`;
             FEEDBACK.style.color = '#ff6f61';
             highlightCorrectChoice(card, selectedWordData, false);
             endGame('使用済みによる敗北');
             return;
        }

        // --- 成功処理 ---
        FEEDBACK.textContent = 'せいかい！✨ 次はコンピューターの番。';
        FEEDBACK.style.color = '#5c7aff';
        card.style.backgroundColor = '#d1e7dd'; // 正解を示す緑（薄い）
        
        useWord(selectedWordData, 'あなた');
        lastChar = selectedReading.slice(-1);

        // コンピュータのターンへ
        TURN_MESSAGE.textContent = '思考中...';
        setTimeout(() => {
            computerTurn(false);
        }, 2000);
    }

    // 7. コンピュータのターン
    function computerTurn(isFirstTurn = false) {
        TURN_MESSAGE.textContent = 'コンピューターの番';
        CHOICE_BUTTONS_AREA.innerHTML = ''; // 選択肢をクリア

        let availableWords = [];
        
        if (isFirstTurn) {
            // 最初のターンは全ての単語からランダムに選ぶ
            availableWords = allWords.filter(word => !usedWords.has(word.reading));
        } else {
            // 続きのターンは、最後の文字から始まる単語を探す
            availableWords = allWords.filter(word => 
                !usedWords.has(word.reading) && word.reading.charAt(0) === lastChar
            );
        }

        if (availableWords.length === 0) {
            endGame('あなたの勝ちです！コンピューターは単語が見つかりませんでした。');
            return;
        }

        // ランダムに単語を選択
        const chosenWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        // --- 成功処理 ---
        useWord(chosenWord, 'コンピューター');
        lastChar = chosenWord.reading.slice(-1);

        // プレイヤーのターンへ
        TURN_MESSAGE.textContent = `次はあなたの番です。「${lastChar}」から始まる単語を選んでください。`;
        
        // クイズを再表示
        setTimeout(() => {
            playerTurn(chosenWord);
        }, 1500);
    }
    
    // 8. 単語の使用と画面表示の更新
    function useWord(wordData, user) {
        const reading = wordData.reading;
        usedWords.add(reading);
        
        // 表示を更新
        CURRENT_WORD_DISPLAY.textContent = `${wordData.word} (${reading})`;
        CURRENT_WORD_TEXT.innerHTML = `${user}の単語: <span id="current-word-display" style="font-weight: bold; color: #ff6f61;">${wordData.word} (${reading})</span>`;
        
        // 画像を表示
        const imagePath = `assets/images/${wordData.image}`;
        IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" 
                 alt="${wordData.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
        `;
        
        // 履歴を更新
        updateHistory(wordData.word, reading, user);
    }

    // 9. 履歴の表示更新
    function updateHistory(word, reading, user) {
        const entry = document.createElement('div');
        entry.textContent = `${user}: ${word} (${reading})`;
        entry.style.opacity = '0.7';
        
        if (WORD_HISTORY_DISPLAY.children.length >= MAX_HISTORY) {
            WORD_HISTORY_DISPLAY.removeChild(WORD_HISTORY_DISPLAY.lastChild);
        }
        
        WORD_HISTORY_DISPLAY.prepend(entry);
    }

    // 10. ゲーム終了処理
    function endGame(message) {
        TURN_MESSAGE.textContent = 'ゲーム終了';
        FEEDBACK.textContent = message;
        CHOICE_BUTTONS_AREA.innerHTML = '';
        
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'block';
        BACK_BUTTON.addEventListener('click', renderMenu);
    }

    // 11. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 12. 読み仮名の正規化（今回は辞書の読み仮名を使うため不要だが念のため残す）
    function normalizeReading(text) {
        return text.replace(/[\u30a1-\u30f6]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }
    
    // 起動
    loadWords().then(renderMenu);
});