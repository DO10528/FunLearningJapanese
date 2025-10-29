// ゲームの状態管理
const gameState = {
    currentGame: null,
    score: 0,
    isLoading: false
};

// ゲーム設定
const games = {
    hiragana: {
        title: 'ひらがな',
        script: 'js/hiragana.js',
        init: 'initHiragana'
    },
    hiragana2: {
        title: 'ひらがな２',
        script: 'js/hiragana2.js',
        init: 'initHiragana2'
    },
    shiritori: {
        title: 'しりとり',
        script: 'js/shiritori.js',
        init: 'initShiritori'
    },
    pronunciation: {
        title: 'よみかた',
        script: 'js/pronunciation.js',
        init: 'initPronunciation'
    }
};

// ゲームをロードする
async function loadGame(gameId) {
    if (gameState.isLoading) return;
    if (!games[gameId]) {
        showError('ゲームが見つかりません');
        return;
    }

    gameState.isLoading = true;
    const game = games[gameId];
    
    // UI更新
    document.getElementById('main-menu').style.display = 'none';
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.display = 'block';
    document.getElementById('game-title').textContent = game.title;
    
    try {
        // 既存のゲームをクリーンアップ
        if (gameState.currentGame && window[`dispose${gameState.currentGame}`]) {
            window[`dispose${gameState.currentGame}`]();
        }

        // スクリプトのロード
        await loadScript(game.script);
        
        // ゲームの初期化
        if (typeof window[game.init] === 'function') {
            window[game.init]();
            gameState.currentGame = gameId;
        } else {
            throw new Error('初期化関数が見つかりません');
        }
    } catch (error) {
        console.error('ゲームのロードに失敗しました:', error);
        showError('ゲームのロードに失敗しました');
    } finally {
        gameState.isLoading = false;
    }
}

// スクリプトを動的にロードする
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`スクリプトのロードに失敗: ${src}`));
        document.body.appendChild(script);
    });
}

// メニューに戻る
function returnToMenu() {
    // 現在のゲームをクリーンアップ
    if (gameState.currentGame && window[`dispose${gameState.currentGame}`]) {
        window[`dispose${gameState.currentGame}`]();
    }
    
    // UI更新
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('game-content').innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading...</p>
    `;
    document.getElementById('game-score').textContent = '';
    
    gameState.currentGame = null;
    gameState.score = 0;
}

// エラー表示
function showError(message) {
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button onclick="returnToMenu()" class="back-button">
                メニューに戻る
            </button>
        </div>
    `;
}

// スコア更新
function updateScore(score) {
    gameState.score = score;
    document.getElementById('game-score').textContent = `スコア: ${score}`;
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // エラーハンドリング
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('Global error:', error);
        showError('予期せぬエラーが発生しました');
        return false;
    };
});