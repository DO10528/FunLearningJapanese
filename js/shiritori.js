// js/shiritori.js のコード全体をこれで置き換えてください (一部関数のみ表示)

document.addEventListener('DOMContentLoaded', () => {
    // ... (グローバル変数定義) ...
    let MENU_AREA = document.getElementById('shiritori-menu');
    let GAME_AREA = document.getElementById('shiritori-game-area');
    // ... (その他の要素の取得) ...
    let GAME_CONTROLS = document.getElementById('game-controls');
    let END_GAME_CONTROLS = document.getElementById('endGameControls');
    
    // ... (loadWords, startNewGame, startGameLogic 関数は省略) ...

    function playerTurn() {
        
        // ... (単語選択ロジックは省略) ...
        
        // 画面を更新
        // ... (画面更新ロジックは省略) ...
        
        // ★修正: プレイ中に常に表示される「メニューに戻る」ボタンを制御する★
        renderGameControls(false, false); // プレイ中はメニューに戻るボタンのみ表示
    }

    // ... (handleAnswer 関数は省略) ...

    // ゲーム終了処理
    function endGame(message, isWin) {
        // ... (スコア表示、フィードバック表示ロジックは省略) ...
        
        // ゲーム終了時用のボタンを生成し、表示する (再スタートを含む)
        if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.display = 'flex';
        if(END_GAME_CONTROLS) END_GAME_CONTROLS.style.justifyContent = 'center';

        if(END_GAME_CONTROLS) END_GAME_CONTROLS.innerHTML = `
            <button id="restartButton" class="menu-card-button choice-button" style="width: 200px; margin-right: 10px;">
                🔁 もう一度あそぶ！
            </button>
            <a href="index.html" class="menu-card-button menu-card-reset" style="width: 200px;">
                🏠 ホームに戻る
            </a>
        `;

        document.getElementById('restartButton').addEventListener('click', startGameLogic);
        
        // プレイ中のボタンを非表示にする
        renderGameControls(false, true); // プレイ中ボタンを非表示
    }

    // ... (renderChoices, shuffleArray 関数は省略) ...
    
    // ★修正: 新規追加/修正 - プレイ中のコントロールボタンの表示ロジック★
    function renderGameControls(showNextButton, hideOnly = false) {
        if (!GAME_CONTROLS) return;

        if (hideOnly) {
            GAME_CONTROLS.innerHTML = ''; 
            return;
        }

        GAME_CONTROLS.style.display = 'flex';
        GAME_CONTROLS.style.justifyContent = 'center';

        // 常に「ホームに戻る」ボタンを表示
        let buttonsHtml = `
            <a href="index.html" class="menu-card-button menu-card-reset" style="width: 200px; height: 50px;">
                🏠 ホームに戻る
            </a>
        `;
        
        GAME_CONTROLS.innerHTML = buttonsHtml;
    }

    // ... (DOMContentLoaded の初期化ロジックは省略) ...
    // document.addEventListener('DOMContentLoaded', () => { ... } );
});