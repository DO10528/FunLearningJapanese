document.addEventListener('DOMContentLoaded', () => {

    const CONTENT_AREA = document.getElementById('learning-content-kiso');
    const HIRAGANA_BUTTON = document.getElementById('show-hiragana-kiso');
    const KATAKANA_BUTTON = document.getElementById('show-katakana-kiso');

    // ★ひらがなと、対応する英語の読み方、イラストのファイル名を定義★
    // ※画像ファイル名が assets/images フォルダ内のファイルと一致している必要があります
    const kisoData = [
        { char: "あ", reading: "a / Ant (アリ)", image: "ari.png" },
        { char: "い", reading: "i / Squid (イカ)", image: "ika.png" },
        { char: "う", reading: "u / Cow (ウシ)", image: "ushi.png" },
        { char: "え", reading: "e / Shrimp (エビ)", image: "ebi.png" },
        { char: "お", reading: "o / Ogre (オニ)", image: "oni.png" },
        
        { char: "か", reading: "ka / Umbrella (カサ)", image: "kasa.png" },
        { char: "き", reading: "ki / Tree (キ)", image: "ki.png" },
        { char: "く", reading: "ku / Bear (クマ)", image: "kuma.png" },
        { char: "け", reading: "ke / Cake (ケーキ)", image: "keki.png" },
        { char: "こ", reading: "ko / Koala (コアラ)", image: "koara.png" },
        
        { char: "さ", reading: "sa / Monkey (サル)", image: "saru.png" },
        { char: "し", reading: "shi / Deer (シカ)", image: "shika.png" },
        { char: "す", reading: "su / Watermelon (スイカ)", image: "suika.png" },
        { char: "せ", reading: "se / Fan (センプウキ)", image: "senpuki.png" },
        { char: "そ", reading: "so / Sky (ソラ)", image: "sora.jpeg" },

        { char: "た", reading: "ta / Octopus (タコ)", image: "tako.png" },
        { char: "ち", reading: "chi / Tiger (トラ)", image: "tora.png" },
        { char: "つ", reading: "tsu / Desk (ツクエ)", image: "tsukue.png" },
        { char: "て", reading: "te / Hand (テ)", image: "te.png" },
        { char: "と", reading: "to / Clock (トケイ)", image: "tokei.png" },

        { char: "な", reading: "na / Eggplant (ナス)", image: "nasu.png" },
        { char: "に", reading: "ni / Rainbow (ニジ)", image: "niji.png" },
        { char: "ぬ", reading: "nu / Coloring (ヌリエ)", image: "nurie.png" },
        { char: "ね", reading: "ne / Mouse (ネズミ)", image: "nezumi.png" },
        { char: "の", reading: "no / Saw (ノコギリ)", image: "nokogiri.png" },

        { char: "は", reading: "ha / Toothbrush (ハミガキ)", image: "hamigaki.png" },
        { char: "ひ", reading: "hi / Fire (ヒ)", image: "hi.png" },
        { char: "ふ", reading: "fu / Ship (フネ)", image: "fune.png" },
        { char: "へ", reading: "he / Snake (ヘビ)", image: "hebi.png" },
        { char: "ほ", reading: "ho / Star (ホシ)", image: "hoshi.png" },
        
        // ※データが不足している場合は、assets/images/にある画像名に合わせて追記してください
    ];
    
    // ひらがな -> カタカナの簡易変換マップ
    const hiraganaToKatakana = {
        'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
        'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
        'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
        'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
        'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
        'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
        'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
        'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
        'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
        'わ': 'ワ', 'を': 'ヲ', 'ん': 'ン'
    };


    function renderKisoTable(type = 'hiragana') {
        if (!CONTENT_AREA) return;
        
        let html = `<h3>${type === 'hiragana' ? 'ひらがな' : 'カタカナ'}基礎一覧</h3><div class="kiso-grid">`;
        
        kisoData.forEach(item => {
            const char = type === 'hiragana' ? item.char : hiraganaToKatakana[item.char] || '';
            const reading = item.reading;
            const imagePath = `assets/images/${item.image}`;
            
            if (char) {
                html += `
                    <div class="char-card-kiso">
                        <h3>${char}</h3>
                        <p>${reading}</p>
                        <img src="${imagePath}" 
                             alt="${char}のイラスト" 
                             onerror="this.src='assets/images/placeholder.png'; this.alt='No Image';">
                    </div>
                `;
            }
        });
        
        html += '</div>';
        CONTENT_AREA.innerHTML = html;
    }

    // ★修正: ボタンが存在することを確認してからリスナーを設定し、初期表示を行う★
    if (HIRAGANA_BUTTON && KATAKANA_BUTTON) {
        HIRAGANA_BUTTON.addEventListener('click', () => {
            renderKisoTable('hiragana');
        });
        KATAKANA_BUTTON.addEventListener('click', () => {
            renderKisoTable('katakana');
        });

        // ページロード時にコンテンツを自動表示する
        renderKisoTable('hiragana');
    } else if (CONTENT_AREA) {
        // ボタン要素の取得に失敗した場合
        CONTENT_AREA.innerHTML = '<h3>エラー: ボタン要素の読み込みに失敗しました。kiso.htmlのIDを確認してください。</h3>';
    }
});