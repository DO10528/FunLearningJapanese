// データのパス (クイズと同じJSONデータを使用)
const DATA_PATH = 'data/keiyoshi.json';

// DOM要素の取得
const adjectiveTbody = document.getElementById('adjective-tbody');

/**
 * データを読み込み、一覧表を生成する関数
 */
async function loadDataAndGenerateTable() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        const adjectives = data.adjectives;
        
        if (!adjectives || adjectives.length === 0) {
            adjectiveTbody.innerHTML = '<tr><td colspan="4">形容詞のデータが見つかりません。</td></tr>';
            return;
        }

        // テーブルの行を生成
        adjectives.forEach(adjective => {
            const row = adjectiveTbody.insertRow(); // 新しい行を作成

            // 種類に応じてクラスと表示テキストを設定
            let typeText;
            let typeClass;
            if (adjective.type === 'i') {
                typeText = 'い形容詞';
                typeClass = 'type-i';
            } else if (adjective.type === 'na') {
                typeText = 'な形容詞';
                typeClass = 'type-na';
            } else {
                typeText = '不明';
                typeClass = '';
            }

            // 1. 漢字
            let cell1 = row.insertCell();
            cell1.textContent = adjective.kanji || '';

            // 2. ひらがな
            let cell2 = row.insertCell();
            cell2.textContent = adjective.hiragana || '';

            // 3. 種類
            let cell3 = row.insertCell();
            cell3.innerHTML = `<span class="${typeClass}">${typeText}</span>`;

            // 4. 意味
            let cell4 = row.insertCell();
            cell4.textContent = adjective.meaning || '';
        });
        
    } catch (error) {
        console.error("データの読み込み中にエラーが発生しました:", error);
        adjectiveTbody.innerHTML = '<tr><td colspan="4">データの読み込みに失敗しました。ファイルパスやJSON形式を確認してください。</td></tr>';
    }
}

// ページロード時に実行
document.addEventListener('DOMContentLoaded', loadDataAndGenerateTable);