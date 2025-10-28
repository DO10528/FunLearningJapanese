document.addEventListener('DOMContentLoaded', () => {
    const charDisplay = document.getElementById('char-display');
    const showHiraganaButton = document.getElementById('show-hiragana');
    const showKatakanaButton = document.getElementById('show-katakana');

    // ひらがなとカタカナの基本データ（あ行だけテスト用）
    const HIRAGANA_CHARS = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'];
    const KATAKANA_CHARS = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];

    // 文字一覧を表示する関数
    function renderCharacters(charArray, type) {
        charDisplay.innerHTML = `<h2>${type} 一覧</h2>`;
        
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(5, 1fr)'; // 5列で表示
        grid.style.gap = '10px';

        charArray.forEach(char => {
            const charBox = document.createElement('div');
            charBox.className = 'char-box';
            charBox.textContent = char;
            charBox.style.padding = '15px';
            charBox.style.fontSize = '2em';
            charBox.style.border = '2px solid #ffcc5c';
            charBox.style.borderRadius = '5px';
            charBox.style.cursor = 'pointer';
            
            // クリックで読み方を音声再生する機能（後で実装）
            charBox.addEventListener('click', () => {
                alert(`「${char}」の読み方（音声機能は後で追加します）`);
            });

            grid.appendChild(charBox);
        });

        charDisplay.appendChild(grid);
    }

    // イベントリスナーの設定
    showHiraganaButton.addEventListener('click', () => {
        renderCharacters(HIRAGANA_CHARS, 'ひらがな');
    });

    showKatakanaButton.addEventListener('click', () => {
        renderCharacters(KATAKANA_CHARS, 'カタカナ');
    });

    // 初回表示
    renderCharacters(HIRAGANA_CHARS, 'ひらがな');
});