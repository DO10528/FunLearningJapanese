// グローバルスコープにゲーム開始関数を公開 (index.htmlから呼び出される)
window.startMain2Game = function() {
    loadWords().then(renderMenu);
};

document.addEventListener('DOMContentLoaded', () => {
    // HTML要素のIDを正確に取得
    const MAIN_MENU = document.getElementById('main-menu'); 
    const GAME_AREA = document.getElementById('game-area'); 
    const SCORE_MESSAGE = document.getElementById('score-message'); 
    
    let allWords = [];
    let currentWord = null;
    let score = 0;          // 正解数
    let incorrectCount = 0; // 失敗数
    let askedWordIds = new Set();
    let selectedBlocks = []; 
    
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

    // 2. メインメニュー画面を表示する関数
    function renderMenu() {
        if (MAIN_MENU) MAIN_MENU.style.display = 'block';
        if (GAME_AREA) GAME_AREA.style.display = 'none';

        if (SCORE_MESSAGE) {
            SCORE_MESSAGE.innerHTML = `<p id="current-score">前回のスコア: ${score}点 (正解: ${correctCount}問, 失敗: ${incorrectCount}回)</p>`;
        }
    }

    // 3. ゲーム開始と新しい問題の生成
    function startNewGame() {
        if (allWords.length === 0) {
            alert('単語データがありません。');
            renderMenu();
            return;
        }
        
        if (MAIN_MENU) MAIN_MENU.style.display = 'none'; 
        if (GAME_AREA) GAME_AREA.style.display = 'block'; 

        // 状態をリセット
        score = 0; 
        correctCount = 0;
        incorrectCount = 0;
        askedWordIds.clear(); 
        selectedBlocks = [];

        showNextQuestion();
    }

    // 4. 問題をランダムに選び、ブロックを生成する
    function showNextQuestion() {
        
        if (askedWordIds.size >= allWords.length) {
            alert(`全${allWords.length}問を終了しました！\n最終スコア: ${score}点\n正解: ${correctCount}問, 失敗: ${incorrectCount}回`);
            renderMenu(); 
            return;
        }

        let availableWords = allWords.filter(word => !askedWordIds.has(word.id));
        
        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id); 
        
        let readingChars = Array.from(currentWord.reading);
        let shuffledChars = shuffleArray([...readingChars]);
        
        renderQuestion(currentWord, shuffledChars);
    }

    // 5. 画面に問題とブロックを表示する
    function renderQuestion(word, shuffledChars) {
        const imagePath = `assets/images/${word.image}`; 
        
        const scoreDisplay = `${correctCount}/${incorrectCount}`; 

        let blocksHtml = shuffledChars.map((char, index) => 
            `<div class="char-block" data-char="${char}" data-original-index="${index}">${char}</div>`
        ).join('');

        GAME_AREA.innerHTML = `
            <h3>このイラストの言葉を並び替えてください (${scoreDisplay})</h3>
            <div style="min-height: 170px;">
                <img src="${imagePath}" 
                     alt="${word.word}" 
                     onerror="this.style.border='3px solid red'; this.alt='エラー: 画像が見つかりません (${word.image})';" 
                     style="width: 150px; height: 150px; border: 3px solid #ffcc5c; border-radius: 10px; object-fit: cover; margin-bottom: 20px;">
            </div>
            
            <div id="word-container" style="display: flex; justify-content: center; margin-bottom: 20px;">
                ${blocksHtml}
            </div>
            
            <div id="check-area" style="margin-top: 30px;">
                <button id="checkButton" class="menu-card-button choice-button" style="width: 150px; height: 50px; margin: 0 auto; display: block;">答え合わせ</button>
            </div>

            <p id="feedback" style="font-weight: bold; margin-top: 15px; min-height: 25px;">クリックで文字を入れ替え！</p>
            
            <button id="backToMenu2" class="menu-card-button menu-card-reset" style="margin-top: 20px;">メニューに戻る</button>
        `;

        document.querySelectorAll('.char-block').forEach(block => {
            block.addEventListener('click', handleBlockClick);
        });
        
        document.getElementById('checkButton').addEventListener('click', checkAnswer);
        document.getElementById('backToMenu2').addEventListener('click', renderMenu);
    }

    // 6. ブロックをクリックしたときの処理（並び替えロジック）
    function handleBlockClick(event) {
        const clickedBlock = event.target;
        
        if (selectedBlocks.includes(clickedBlock)) {
            selectedBlocks = selectedBlocks.filter(block => block !== clickedBlock);
            clickedBlock.classList.remove('selected');
        } else {
            selectedBlocks.push(clickedBlock);
            clickedBlock.classList.add('selected');
        }

        if (selectedBlocks.length === 2) {
            const block1 = selectedBlocks[0];
            const block2 = selectedBlocks[1];

            const container = document.getElementById('word-container');
            const nodes = Array.from(container.children);
            const index1 = nodes.indexOf(block1);
            const index2 = nodes.indexOf(block2);

            if (index1 !== -1 && index2 !== -1) {
                container.innerHTML = '';
                [nodes[index1], nodes[index2]] = [nodes[index2], nodes[index1]];
                nodes.forEach(node => container.appendChild(node));
            }
            
            block1.classList.remove('selected');
            block2.classList.remove('selected');
            selectedBlocks = [];
        }
        
        FEEDBACK.textContent = 'クリックで文字を入れ替え！';
        FEEDBACK.style.color = '#333';
    }

    // 7. 答え合わせの処理
    function checkAnswer() {
        const blocks = Array.from(document.querySelectorAll('.char-block'));
        const attemptedReading = blocks.map(block => block.dataset.char).join('');
        
        if (attemptedReading === currentWord.reading) {
            FEEDBACK.textContent = 'せいかい！✨';
            FEEDBACK.style.color = '#5c7aff';
            score += 10;
            correctCount += 1; 

            setTimeout(() => {
                showNextQuestion();
            }, 1500);

        } else {
            FEEDBACK.textContent = 'ざんねん... もう一度やり直してください。';
            FEEDBACK.style.color = '#ff6f61';
            incorrectCount += 1; 

            document.querySelectorAll('.char-block').forEach(block => {
                block.classList.remove('selected'); 
            });
            selectedBlocks = [];
            
            renderScoreTitleUpdate();
        }
    }
    
    // 7.5 スコア表示のみを更新する補助関数
    function renderScoreTitleUpdate() {
        const titleElement = GAME_AREA.querySelector('h3');
        if (titleElement) {
            const scoreDisplay = `${correctCount}/${incorrectCount}`; 
            titleElement.textContent = `このイラストの言葉を並び替えてください (${scoreDisplay})`;
        }
    }

    // 8. 配列をランダムにシャッフルするユーティリティ関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // DOMContentLoadedではデータをロードするのみ
    loadWords();
});