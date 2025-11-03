// データのパス
const DATA_PATH = 'data/kanji.json';

// DOM要素の取得
const kanjiTbody = document.getElementById('kanji-tbody');

/**
 * データを読み込み、漢字一覧表を生成する関数
 */
async function loadDataAndGenerateTable() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        const kanjiList = data.kanji_list;
        
        if (!kanjiList || kanjiList.length === 0) {
            kanjiTbody.innerHTML = '<tr><td colspan="5">漢字のデータが見つかりません。</td></tr>';
            return;
        }

        // テーブルの行を生成
        kanjiList.forEach((item, index) => { // ★index を取得
            const row = kanjiTbody.insertRow(); 

            // 1. ★連番 (No.) のセルを追加
            let cell0 = row.insertCell();
            cell0.innerHTML = `<span class="kanji-number">${index + 1}</span>`;

            // 2. 漢字
            let cell1 = row.insertCell();
            cell1.innerHTML = `<span class="kanji-char">${item.kanji}</span>`;

            // 3. 訓読み
            let cell2 = row.insertCell();
            cell2.innerHTML = `<span class="reading-kun">${item.kun || ''}</span>`;

            // 4. 音読み
            let cell3 = row.insertCell();
            cell3.innerHTML = `<span class="reading-on">${item.on || ''}</span>`;

            // 5. 意味
            let cell4 = row.insertCell();
            cell4.textContent = item.meaning || '';
        });
        
    } catch (error) {
        console.error("漢字データの読み込み中にエラーが発生しました:", error);
        kanjiTbody.innerHTML = '<tr><td colspan="5">データの読み込みに失敗しました。ファイルパスやJSON形式を確認してください。</td></tr>';
    }
}

// ページロード時に実行
document.addEventListener('DOMContentLoaded', loadDataAndGenerateTable);