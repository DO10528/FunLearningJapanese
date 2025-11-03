document.addEventListener('DOMContentLoaded', () => {
    const KISO_DATA = [
        { row: 'あ行', hira: 'あ い う え お', kata: 'ア イ ウ エ オ' },
        { row: 'か行', hira: 'か き く け こ', kata: 'カ キ ク ケ コ' },
        { row: 'さ行', hira: 'さ し す せ そ', kata: 'サ シ ス セ ソ' },
        { row: 'た行', hira: 'た ち つ て と', kata: 'タ チ ツ テ ト' },
        { row: 'な行', hira: 'な に ぬ ね の', kata: 'ナ ニ ヌ ネ ノ' },
        { row: 'は行', hira: 'は ひ ふ へ ほ', kata: 'ハ ヒ フ ヘ ホ' },
        { row: 'ま行', hira: 'ま み む め も', kata: 'マ ミ ム メ モ' },
        { row: 'や行', hira: 'や ゆ よ', kata: 'ヤ ユ ヨ' },
        { row: 'ら行', hira: 'ら り る れ ろ', kata: 'ラ リ ル レ ロ' },
        { row: 'わ行', hira: 'わ を ん', kata: 'ワ ヲ ン' },
        { row: '濁音', hira: 'が ぎ ぐ げ ご', kata: 'ガ ギ グ ゲ ゴ' },
        { row: '', hira: 'ざ じ ず ぜ ぞ', kata: 'ザ ジ ズ ゼ ゾ' },
        { row: '', hira: 'だ ぢ づ で ど', kata: 'ダ ヂ ヅ デ ド' },
        { row: '', hira: 'ば び ぶ べ ぼ', kata: 'バ ビ ブ ベ ボ' },
        { row: '半濁音', hira: 'ぱ ぴ ぷ ぺ ぽ', kata: 'パ ピ プ ペ ポ' },
        { row: '拗音', hira: 'きゃ きゅ きょ', kata: 'キャ キュ キョ' },
        { row: '', hira: 'しゃ しゅ しょ', kata: 'シャ シュ ショ' },
        { row: '', hira: 'ちゃ ちゅ ちょ', kata: 'チャ チュ チョ' },
        { row: '', hira: 'にゃ にゅ にょ', kata: 'ニャ ニュ ニョ' },
        { row: '', hira: 'ひゃ ひゅ ひょ', kata: 'ヒャ ヒュ ヒョ' },
        { row: '', hira: 'みゃ みゅ みょ', kata: 'ミャ ミュ ミョ' },
        { row: '', hira: 'りゃ りゅ りょ', kata: 'リャ リュ リョ' },
        { row: '', hira: 'ぎゃ ぎゅ ぎょ', kata: 'ギャ ギュ ギョ' },
        { row: '', hira: 'じゃ じゅ じょ', kata: 'ジャ ジュ ジョ' },
        { row: '', hira: 'びゃ びゅ びょ', kata: 'ビャ ビュ ビョ' },
        { row: '', hira: 'ぴゃ ぴゅ ぴょ', kata: 'ピャ ピュ ピョ' }
    ];

    const tbody = document.getElementById('kiso-tbody'); // kiso.htmlのtbodyにIDが必要
    
    if (tbody) {
        let html = '';
        KISO_DATA.forEach(item => {
            html += `
                <tr>
                    <td>${item.row}</td>
                    <td>${item.hira}</td>
                    <td>${item.kata}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
});