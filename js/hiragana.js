document.addEventListener('DOMContentLoaded', () => {
    // このファイルは hiragana.html で読み込まれます

    // 仮のひらがな一覧データ
    const hiraganaData = [
        "あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の",
        "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も",
        "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ",
        "わ", "を", "ん"
    ];

    const contentArea = document.getElementById('learning-content');
    const hiraganaButton = document.getElementById('show-hiragana');
    const katakanaButton = document.getElementById('show-katakana');

    function renderHiraganaTable() {
        let html = '<h3>ひらがな一覧</h3><div class="hiragana-grid">';
        
        hiraganaData.forEach(char => {
            html += `<div class="char-card">${char}</div>`;
        });
        
        html += '</div>';
        contentArea.innerHTML = html;
    }

    function renderKatakanaTable() {
        // カタカナはひらがなデータから自動生成 (簡略化のため)
        let html = '<h3>カタカナ一覧</h3><div class="hiragana-grid">';
        
        hiraganaData.forEach(char => {
            // 簡易的なひらがな→カタカナ変換ロジック
            const katakana = char.replace(/あ/g, 'ア').replace(/い/g, 'イ').replace(/う/g, 'ウ').replace(/え/g, 'エ').replace(/お/g, 'オ')
                                 .replace(/か/g, 'カ').replace(/き/g, 'キ').replace(/く/g, 'ク').replace(/け/g, 'ケ').replace(/こ/g, 'コ')
                                 .replace(/さ/g, 'サ').replace(/し/g, 'シ').replace(/す/g, 'ス').replace(/せ/g, 'セ').replace(/そ/g, 'ソ')
                                 .replace(/た/g, 'タ').replace(/ち/g, 'チ').replace(/つ/g, 'ツ').replace(/て/g, 'テ').replace(/と/g, 'ト')
                                 .replace(/な/g, 'ナ').replace(/に/g, 'ニ').replace(/ぬ/g, 'ヌ').replace(/ね/g, 'ネ').replace(/の/g, 'ノ')
                                 .replace(/は/g, 'ハ').replace(/ひ/g, 'ヒ').replace(/ふ/g, 'フ').replace(/へ/g, 'ヘ').replace(/ほ/g, 'ホ')
                                 .replace(/ま/g, 'マ').replace(/み/g, 'ミ').replace(/む/g, 'ム').replace(/め/g, 'メ').replace(/も/g, 'モ')
                                 .replace(/や/g, 'ヤ').replace(/ゆ/g, 'ユ').replace(/よ/g, 'ヨ')
                                 .replace(/ら/g, 'ラ').replace(/り/g, 'リ').replace(/る/g, 'ル').replace(/れ/g, 'レ').replace(/ろ/g, 'ロ')
                                 .replace(/わ/g, 'ワ').replace(/を/g, 'ヲ').replace(/ん/g, 'ン');
                                 
            html += `<div class="char-card">${katakana}</div>`;
        });
        
        html += '</div>';
        contentArea.innerHTML = html;
    }

    if (hiraganaButton) {
        hiraganaButton.addEventListener('click', renderHiraganaTable);
    }
    if (katakanaButton) {
        katakanaButton.addEventListener('click', renderKatakanaTable);
    }

    // 初期表示
    renderHiraganaTable();
});