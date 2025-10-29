// ゲームの状態管理
let gameState = {
    currentGame: null,
    currentScript: null,
    score: 0,
    isLoading: false
};

// スクリプトの読み込み状態を追跡
const loadedScripts = new Set();

// ゲームをロードする
async function loadGameScript(scriptPath, title) {
    console.log(`[GameLoader] Loading game script: ${scriptPath}`);
    if (gameState.isLoading) {
        console.log('[GameLoader] Already loading a game, please wait...');
        return;
    }

    gameState.isLoading = true;

    try {
        // メインメニューを非表示にし、ゲームエリアを表示
        document.getElementById('main-menu').style.display = 'none';
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'block';
        document.getElementById('game-title').textContent = title;

        // 既存のゲームをクリーンアップ
        cleanupCurrentGame();

        // ゲームコンテンツエリアをリセット
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <div class="loading-spinner"></div>
            <p>ゲームを読み込んでいます...</p>
        `;

        // スクリプトの読み込み
        await loadScript(scriptPath);
        gameState.currentScript = scriptPath;

        // 初期化関数の名前を特定
        const initFunctionName = getInitFunctionName(scriptPath);
        if (typeof window[initFunctionName] === 'function') {
            console.log(`[GameLoader] Initializing game with ${initFunctionName}`);
            window[initFunctionName]();
            gameState.currentGame = initFunctionName;
        } else {
            throw new Error(`初期化関数 ${initFunctionName} が見つかりません`);
        }
    } catch (error) {
        console.error('[GameLoader] Error:', error);
        showError('ゲームの読み込みに失敗しました');
        returnToMenu();
    } finally {
        gameState.isLoading = false;
    }
}

// スクリプトを動的にロードする
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // 既に読み込み済みの場合は即時解決
        if (loadedScripts.has(src)) {
            console.log(`[GameLoader] Script already loaded: ${src}`);
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        
        script.onload = () => {
            console.log(`[GameLoader] Script loaded successfully: ${src}`);
            loadedScripts.add(src);
            resolve();
        };
        
        script.onerror = () => {
            console.error(`[GameLoader] Failed to load script: ${src}`);
            reject(new Error(`スクリプトのロードに失敗: ${src}`));
        };
        
        document.body.appendChild(script);
    });
}

// 初期化関数名を取得
function getInitFunctionName(scriptPath) {
    const baseName = scriptPath.split('/').pop().split('.')[0];
    return `init${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
}

// 現在のゲームをクリーンアップ
function cleanupCurrentGame() {
    if (!gameState.currentGame) return;

    const disposeFunctionName = gameState.currentGame.replace('init', 'dispose');
    if (typeof window[disposeFunctionName] === 'function') {
        try {
            console.log(`[GameLoader] Cleaning up game with ${disposeFunctionName}`);
            window[disposeFunctionName]();
        } catch (e) {
            console.warn(`[GameLoader] Error during cleanup:`, e);
        }
    }

    gameState.currentGame = null;
}

// メニューに戻る
window.returnToMenu = function() {
    console.log('[GameLoader] Returning to menu');
    
    // 現在のゲームをクリーンアップ
    cleanupCurrentGame();
    
    // UI更新
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('game-content').innerHTML = '';
    document.getElementById('game-score').textContent = '';
    
    // ゲーム状態をリセット
    gameState = {
        currentGame: null,
        currentScript: null,
        score: 0,
        isLoading: false
    };
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