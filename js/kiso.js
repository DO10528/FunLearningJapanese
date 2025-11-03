document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ 注意: imageプロパティには、実際に 'assets/images/' フォルダに保存したファイル名を指定してください。
    const KISO_DATA = [
        { row: 'あ行', hira: 'あ い う え お', kata: 'ア イ ウ エ オ', image: 'a_line.png' },
        { row: 'か行', hira: 'か き く け こ', kata: 'カ キ ク ケ コ', image: 'ka_line.png' },
        { row: 'さ行', hira: 'さ し す せ そ', kata: 'サ シ ス セ ソ', image: 'sa_line.png' },
        { row: 'た行', hira: 'た ち つ て と', kata: 'タ チ ツ テ ト', image: 'ta_line.png' },
        { row: 'な行', hira: 'な に ぬ ね の', kata: 'ナ ニ ヌ ネ ノ', image: 'na_line.png' },
        { row: 'は行', hira: 'は ひ ふ へ ほ', kata: 'ハ ヒ フ ヘ ホ', image: 'ha_line.png' },
        { row: 'ま行', hira: 'ま み む め も', kata: 'マ ミ ム メ モ', image: 'ma_line.png' },
        { row: 'や行', hira: 'や ゆ よ', kata: 'ヤ ユ ヨ', image: 'ya_line.png' },
        { row: 'ら行', hira: 'ら り る れ ろ', kata: 'ラ リ ル レ ロ', image: 'ra_line.png' },
        { row: 'わ行', hira: 'わ を ん', kata: 'ワ ヲ ン', image: 'wa_line.png' },
        
        // 濁音・半濁音・拗音には、代表となるイラスト、または空の画像 'no_image.png' を使用
        { row: '濁音', hira: 'が ぎ ぐ げ ご', kata: 'ガ ギ グ ゲ ゴ', image: 'daku_line.png' },
        { row: '', hira: 'ざ じ ず ぜ ぞ', kata: 'ザ ジ ズ ゼ ゾ', image: 'daku_line.png' },
        { row: '', hira: 'だ ぢ づ で ど', kata: 'ダ ヂ ヅ デ ド', image: 'daku_line.png' },
        { row: '', hira: 'ば び ぶ べ ぼ', kata: 'バ ビ ブ ベ ボ', image: 'daku_line.png' },
        { row: '半濁音', hira: 'ぱ ぴ ぷ ぺ ぽ', kata: 'パ ピ プ ペ ポ', image: 'han_daku_line.png' },
        { row: '拗音', hira: 'きゃ きゅ きょ', kata: 'キャ キュ キョ', image: 'yoon_line.png' },
        { row: '', hira: 'しゃ しゅ しょ', kata: 'シャ シュ ショ', image: 'yoon_line.png' },
        { row: '', hira: 'ちゃ ちゅ ちょ', kata: 'チャ チュ チョ', image: 'yoon_line.png' },
        { row: '', hira: 'にゃ にゅ にょ', kata: 'ニャ ニュ ニョ', image: 'yoon_line.png' },
        { row: '', hira: 'ひゃ ひゅ ひょ', kata: 'ヒャ ヒュ ヒョ', image: 'yoon_line.png' },
        { row: '', hira: 'みゃ みゅ みょ', kata: 'ミャ ミュ ミョ', image: 'yoon_line.png' },
        { row: '', hira: 'りゃ りゅ りょ', kata: 'リャ リュ リョ', image: 'yoon_line.png' },
        { row: '', hira: 'ぎゃ ぎゅ ぎょ', kata: 'ギャ ギュ ギョ', image: 'yoon_daku_line.png' },
        { row: '', hira: 'じゃ じゅ じょ', kata: 'ジャ ジュ ジョ', image: 'yoon_daku_line.png' },
        { row: '', hira: 'びゃ びゅ びょ', kata: 'ビャ ビュ ビョ', image: 'yoon_daku_line.png' },
        { row: '', hira: 'ぴゃ ぴゅ ぴょ', kata: 'ピャ ピュ ピョ', image: 'yoon_han_daku_line.png' }
    ];

    const tbody = document.getElementById('kiso-tbody'); 
    
    if (tbody) {
        let html = '';
        KISO_DATA.forEach(item => {
            const imagePath = `assets/images/${item.image}`;
            
            html += `
                <tr>
                    <td class="row-name">${item.row}</td>
                    <td class="row-image">
                        ${item.image ? `<img src="${imagePath}" alt="${item.row}" onerror="this.style.display='none'" class="kiso-illust">` : ''}
                    </td>
                    <td>${item.hira}</td>
                    <td>${item.kata}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
});