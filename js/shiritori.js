document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MENU_AREA = document.getElementById('shiritori-menu');
    const GAME_AREA = document.getElementById('shiritori-game-area');
    const START_BUTTON = document.getElementById('shiritoriStartButton');
    const INPUT_FIELD = document.getElementById('playerInput');
    const SUBMIT_BUTTON = document.getElementById('submitButton');
    const ERROR_MESSAGE = document.getElementById('error-message');
    const TURN_MESSAGE = document.getElementById('turn-message');
    const CURRENT_WORD_DISPLAY = document.getElementById('current-word-display');
    const IMAGE_AREA = document.getElementById('image-area');
    const WORD_HISTORY_DISPLAY = document.getElementById('wordHistory');
    const BACK_BUTTON = document.getElementById('shiritoriBackToMenu');

    let allWords = [];
    let usedWords = new Set();
    let lastChar = ''; // 前の単語の最後の文字
    const MAX_HISTORY = 5; // 表示する履歴の数

    // 1. JSONデータを読み込む関数 (main.jsから流用)
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
        ERROR_MESSAGE.textContent = '';
        CURRENT_WORD_DISPLAY.textContent = '';
        WORD_HISTORY_DISPLAY.textContent = '';
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'none';

        if (START_BUTTON) {
            START_BUTTON.removeEventListener('click', startNewGame);
            START_BUTTON.addEventListener('click', startNewGame);
        }
    }

    // 3. ゲーム開始
    function startNewGame() {
        if (allWords.length === 0) {
            alert('単語データがありません。');
            renderMenu();
            return;
        }
        
        if (MENU_AREA) MENU_AREA.style.display = 'none';
        if (GAME_AREA) GAME_AREA.style.display = 'block';
        
        // 最初の単語をコンピュータが出題
        computerTurn(true); // true は「最初のターン」を示す
        
        // プレイヤーの入力を有効化
        if (INPUT_FIELD) INPUT_FIELD.disabled = false;
        if (SUBMIT_BUTTON) SUBMIT_BUTTON.disabled = false;
        if (INPUT_FIELD) INPUT_FIELD.focus();
        
        // エンターキーで送信できるようにする
        INPUT_FIELD.removeEventListener('keypress', handleEnter);
        INPUT_FIELD.addEventListener('keypress', handleEnter);
        SUBMIT_BUTTON.removeEventListener('click', playerTurn);
        SUBMIT_BUTTON.addEventListener('click', playerTurn);
    }
    
    // エンターキーハンドラ
    function handleEnter(e) {
        if (e.key === 'Enter') {
            playerTurn();
        }
    }

    // 4. プレイヤーのターン
    function playerTurn() {
        const inputWord = INPUT_FIELD.value.trim();
        INPUT_FIELD.value = '';
        ERROR_MESSAGE.textContent = '';

        if (!inputWord) {
            ERROR_MESSAGE.textContent = '単語を入力してください。';
            return;
        }

        const normalizedReading = normalizeReading(inputWord);
        const playerChar = normalizedReading.charAt(0);
        const lastCharOfInput = normalizedReading.slice(-1);

        // 1. 「ん」チェック
        if (lastCharOfInput === 'ん') {
            endGame('あなたの負けです！「ん」で終わってしまいました。');
            return;
        }

        // 2. ルールチェック (最初のターン以外)
        if (lastChar && playerChar !== lastChar) {
            ERROR_MESSAGE.textContent = `前の単語は「${lastChar}」で終わっています。「${lastChar}」から始まる単語を入力してください。`;
            return;
        }
        
        // 3. 辞書に存在するかチェック
        const wordData = allWords.find(word => word.reading === normalizedReading);
        if (!wordData) {
            ERROR_MESSAGE.textContent = `その単語「${inputWord}」は辞書にありません。別の単語を入力してください。`;
            return;
        }

        // 4. 使用済みチェック
        if (usedWords.has(normalizedReading)) {
            ERROR_MESSAGE.textContent = `その単語「${inputWord}」は既に使用されています。`;
            return;
        }

        // --- 成功処理 ---
        useWord(wordData, 'あなた');
        lastChar = lastCharOfInput;

        // コンピュータのターンへ
        TURN_MESSAGE.textContent = '思考中...';
        disableInput(true);
        setTimeout(computerTurn, 2000);
    }

    // 5. コンピュータのターン
    function computerTurn(isFirstTurn = false) {
        TURN_MESSAGE.textContent = 'コンピューターの番';
        
        let availableWords = [];
        
        if (isFirstTurn) {
            // 最初のターンはすべての単語からランダムに選ぶ
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
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const chosenWord = availableWords[randomIndex];
        
        // --- 成功処理 ---
        useWord(chosenWord, 'コンピューター');
        lastChar = chosenWord.reading.slice(-1);

        // プレイヤーのターンへ
        TURN_MESSAGE.textContent = `次はあなたの番です。「${lastChar}」から始まる単語を入力してください。`;
        disableInput(false);
        if (INPUT_FIELD) INPUT_FIELD.focus();
    }

    // 6. 単語の使用と画面表示の更新
    function useWord(wordData, user) {
        const reading = wordData.reading;
        usedWords.add(reading);
        
        // 表示を更新
        CURRENT_WORD_DISPLAY.innerHTML = `${user}: <span style="font-size: 1.2em; color: #5c7aff;">${wordData.word}</span> (${reading})`;
        
        // 画像を表示
        const imagePath = `assets/images/${wordData.image}`;
        IMAGE_AREA.innerHTML = `
            <img src="${imagePath}" 
                 alt="${wordData.word}" 
                 onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${wordData.image})';" 
                 style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin: 15px auto;">
        `;
        
        // 履歴を更新
        updateHistory(wordData.word, reading);
    }

    // 7. 履歴の表示更新
    function updateHistory(word, reading) {
        const entry = document.createElement('div');
        entry.textContent = `${word} (${reading})`;
        entry.style.opacity = '0.7';
        
        if (WORD_HISTORY_DISPLAY.children.length >= MAX_HISTORY) {
            WORD_HISTORY_DISPLAY.removeChild(WORD_HISTORY_DISPLAY.lastChild);
        }
        
        WORD_HISTORY_DISPLAY.prepend(entry);
    }

    // 8. ゲーム終了処理
    function endGame(message) {
        TURN_MESSAGE.textContent = 'ゲーム終了';
        ERROR_MESSAGE.textContent = message;
        disableInput(true);
        if (BACK_BUTTON) BACK_BUTTON.style.display = 'block';
        BACK_BUTTON.addEventListener('click', renderMenu);
    }
    
    // 9. 入力エリアの有効/無効切り替え
    function disableInput(disabled) {
        if (INPUT_FIELD) INPUT_FIELD.disabled = disabled;
        if (SUBMIT_BUTTON) SUBMIT_BUTTON.disabled = disabled;
    }

    // 10. 読み仮名の正規化 (ひらがな/カタカナをひらがなに統一)
    function normalizeReading(text) {
        return text.replace(/[\u30a1-\u30f6]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }

    // 全ての処理を開始
    loadWords().then(renderMenu);
});