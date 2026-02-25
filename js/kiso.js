document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ----------------- ユーザー提供の単語リスト -----------------
    // (提供されたJSONデータをここに1回だけ定義します)
    const WORD_DATA = [
        {"id": 101, "word": "いも", "reading": "いも", "image": "imo.png"},
        {"id": 102, "word": "いけ", "reading": "いけ", "image": "ike.png"},
        {"id": 103, "word": "うで", "reading": "うで", "image": "ude.png"},
        {"id": 104, "word": "うめ", "reading": "うめ", "image": "ume.png"},
        {"id": 105, "word": "えだ", "reading": "えだ", "image": "eda.png"},
        {"id": 106, "word": "えほん", "reading": "えほん", "image": "ehon.png"},
        {"id": 107, "word": "おおかみ", "reading": "おおかみ", "image": "okami.png"},
        {"id": 108, "word": "かえる", "reading": "かえる", "image": "kaeru.png"},
        {"id": 109, "word": "かぎ", "reading": "かぎ", "image": "kagi.png"},
        {"id": 110, "word": "きつつき", "reading": "きつつき", "image": "kitsutsuki.png"},
        {"id": 111, "word": "くち", "reading": "くち", "image": "kuchi.png"},
        {"id": 112, "word": "くり", "reading": "くり", "image": "kuri.png"},
        {"id": 113, "word": "けいと", "reading": "けいと", "image": "keito.png"},
        {"id": 114, "word": "こおり", "reading": "こおり", "image": "kori.png"},
        {"id": 115, "word": "さくら", "reading": "さくら", "image": "sakura.png"},
        {"id": 116, "word": "すし", "reading": "すし", "image": "sushi.png"},
        {"id": 117, "word": "すず", "reading": "すず", "image": "suzu.png"},
        {"id": 118, "word": "たけ", "reading": "たけ", "image": "take.png"},
        {"id": 119, "word": "たいよう", "reading": "たいよう", "image": "taiyo.png"},
        {"id": 120, "word": "てぶくろ", "reading": "てぶくろ", "image": "tebukuro.png"},
        {"id": 121, "word": "とかげ", "reading": "とかげ", "image": "tokage.png"},
        {"id": 122, "word": "とり", "reading": "とり", "image": "tori.png"},
        {"id": 123, "word": "なみ", "reading": "なみ", "image": "nami.png"},
        {"id": 124, "word": "にく", "reading": "にく", "image": "niku.png"},
        {"id": 125, "word": "ぬの", "reading": "ぬの", "image": "nuno.png"},
        {"id": 127, "word": "はさみ", "reading": "はさみ", "image": "hasami.png"},
        {"id": 128, "word": "ひとで", "reading": "ひとで", "image": "hitode.png"},
        {"id": 129, "word": "ふうせん", "reading": "ふうせん", "image": "fusen.png"},
        {"id": 130, "word": "へび", "reading": "へび", "image": "hebi.png"},
        {"id": 131, "word": "ほし", "reading": "ほし", "image": "hoshi.png"},
        {"id": 132, "word": "まめ", "reading": "まめ", "image": "mame.png"},
        {"id": 134, "word": "むし", "reading": "むし", "image": "mushi.png"},
        {"id": 135, "word": "めだか", "reading": "めだか", "image": "medaka.png"},
        {"id": 136, "word": "もも", "reading": "もも", "image": "momo.png"},
        {"id": 137, "word": "やぎ", "reading": "やぎ", "image": "yagi.png"},
        {"id": 138, "word": "ゆき", "reading": "ゆき", "image": "yuki.png"},
        {"id": 139, "word": "よう", "reading": "よう", "image": "yo.png"},
        {"id": 140, "word": "らっぱ", "reading": "らっぱ", "image": "rappa.png"},
        {"id": 142, "word": "るり", "reading": "るり", "image": "ruri.png"},
        {"id": 143, "word": "れもん", "reading": "れもん", "image": "remon.png"},
        {"id": 144, "word": "ろうそく", "reading": "ろうそく", "image": "rosoku.png"},
        {"id": 145, "word": "わに", "reading": "わに", "image": "wani.png"},
        {"id": 146, "word": "あさがお", "reading": "あさがお", "image": "asagao.png"},
        {"id": 147, "word": "いるか", "reading": "いるか", "image": "iruka.png"},
        {"id": 149, "word": "えのぐ", "reading": "えのぐ", "image": "enogu.png"},
        {"id": 151, "word": "かたつむり", "reading": "かたつむり", "image": "katatsumuri.png"},
        {"id": 153, "word": "くじら", "reading": "くじら", "image": "kujira.png"},
        {"id": 154, "word": "けむり", "reading": "けむり", "image": "kemuri.png"},
        {"id": 155, "word": "こけ", "reading": "こけ", "image": "koke.png"},
        {"id": 157, "word": "しお", "reading": "しお", "image": "shio.png"},
        {"id": 159, "word": "せんせい", "reading": "せんせい", "image": "sensei.png"},
        {"id": 161, "word": "たいこ", "reading": "たいこ", "image": "taiko.png"},
        {"id": 162, "word": "ちょう", "reading": "ちょう", "image": "cho.png"},
        {"id": 163, "word": "つばめ", "reading": "つばめ", "image": "tsubame.png"},
        {"id": 164, "word": "てるてる", "reading": "てるてる", "image": "teruteru.png"},
        {"id": 165, "word": "とうふ", "reading": "とうふ", "image": "tofu.png"},
        {"id": 166, "word": "なべ", "reading": "なべ", "image": "nabe.png"},
        {"id": 167, "word": "にわ", "reading": "にわ", "image": "niwa.png"},
        {"id": 168, "word": "ぬいぐるみ", "reading": "ぬいぐるみ", "image": "nuigurumi.png"},
        {"id": 169, "word": "のりもの", "reading": "のりもの", "image": "norimono.png"},
        {"id": 170, "word": "はくちょう", "reading": "はくちょう", "image": "hakucho.png"},
        {"id": 172, "word": "ふうりん", "reading": "ふうりん", "image": "furin.png"},
        {"id": 173, "word": "へちま", "reading": "へちま", "image": "hechima.png"},
        {"id": 174, "word": "ほうき", "reading": "ほうき", "image": "hoki.png"},
        {"id": 175, "word": "まくら", "reading": "まくら", "image": "makura.png"},
        {"id": 176, "word": "みずうみ", "reading": "みずうみ", "image": "mizuumi.png"},
        {"id": 177, "word": "むぎ", "reading": "むぎ", "image": "mugi.png"},
        {"id": 178, "word": "めがね", "reading": "めがね", "image": "megane.png"},
        {"id": 179, "word": "もり", "reading": "もり", "image": "mori.png"},
        {"id": 180, "word": "やま", "reading": "やま", "image": "yama.png"},
        {"id": 181, "word": "ゆびわ", "reading": "ゆびわ", "image": "yubiwa.png"},
        {"id": 182, "word": "よしず", "reading": "よしず", "image": "yoshizu.png"},
        {"id": 185, "word": "るりびたき", "reading": "るりびたき", "image": "ruribitaki.png"},
        {"id": 186, "word": "れんげ", "reading": "れんげ", "image": "renge.png"},
        {"id": 187, "word": "ろぼっと", "reading": "ろぼっと", "image": "robotto.png"},
        {"id": 188, "word": "わかめ", "reading": "わかめ", "image": "wakame.png"},
        {"id": 190, "word": "いとまき", "reading": "いとまき", "image": "itomaki.png"},
        {"id": 191, "word": "うちわ", "reading": "うちわ", "image": "uchiwa.png"},
        {"id": 192, "word": "えびふらい", "reading": "えびふらい", "image": "ebifurai.png"},
        {"id": 193, "word": "おもちゃ", "reading": "おもちゃ", "image": "omocha.png"},
        {"id": 194, "word": "かたな", "reading": "かたな", "image": "katana.png"},
        {"id": 195, "word": "きもの", "reading": "きもの", "image": "kimono.png"},
        {"id": 196, "word": "くさ", "reading": "くさ", "image": "kusa.png"},
        {"id": 197, "word": "けしごむ", "reading": "けしごむ", "image": "keshigomu.png"},
        {"id": 198, "word": "こま", "reading": "こま", "image": "koma.png"},
        {"id": 199, "word": "さいふ", "reading": "さいふ", "image": "saifu.png"},
        {"id": 6, "word": "あめ", "reading": "あめ", "image": "ame.png"},
        {"id": 8, "word": "アヒル", "reading": "アヒル", "image": "ahiru.png"},
        {"id": 10, "word": "あり", "reading": "あり", "image": "ari.png"},
        {"id": 17, "word": "いか", "reading": "いか", "image": "ika.png"},
        {"id": 18, "word": "いちご", "reading": "いちご", "image": "ichigo.png"},
        {"id": 16, "word": "いす", "reading": "いす", "image": "isu.png"},
        {"id": 2, "word": "いぬ", "reading": "いぬ", "image": "inu.png"},
        {"id": 92, "word": "うさぎ", "reading": "うさぎ", "image": "usagi.png"},
        {"id": 93, "word": "うし", "reading": "うし", "image": "ushi.png"},
        {"id": 91, "word": "うま", "reading": "うま", "image": "uma.png"},
        {"id": 14, "word": "えび", "reading": "えび", "image": "ebi.png"},
        {"id": 13, "word": "えんぴつ", "reading": "えんぴつ", "image": "enpitsu.png"},
        {"id": 61, "word": "おにぎり", "reading": "おにぎり", "image": "onigiri.png"},
        {"id": 60, "word": "おに", "reading": "おに", "image": "oni.png"},
        {"id": 59, "word": "オムレツ", "reading": "オムレツ", "image": "omuretsu.png"},
        {"id": 19, "word": "かばん", "reading": "かばん", "image": "kaban.png"},
        {"id": 23, "word": "かさ", "reading": "かさ", "image": "kasa.png"},
        {"id": 20, "word": "かに", "reading": "かに", "image": "kani.png"},
        {"id": 22, "word": "かめ", "reading": "かめ", "image": "kame.png"},
        {"id": 46, "word": "きゅうり", "reading": "きゅうり", "image": "kyuuri.png"},
        {"id": 47, "word": "くつ", "reading": "くつ", "image": "kutsu.png"},
        {"id": 40, "word": "くま", "reading": "くま", "image": "kuma.png"},
        {"id": 41, "word": "くも", "reading": "くも", "image": "kumo.png"},
        {"id": 45, "word": "くるま", "reading": "くるま", "image": "kuruma.png"},
        {"id": 21, "word": "ケーキ", "reading": "ケーキ", "image": "keki.png"},
        {"id": 42, "word": "けむし", "reading": "けむし", "image": "kemushi.png"},
        {"id": 35, "word": "き", "reading": "き", "image": "ki.png"},
        {"id": 36, "word": "きりん", "reading": "きりん", "image": "kirin.png"},
        {"id": 43, "word": "きのこ", "reading": "きのこ", "image": "kinoko.png"},
        {"id": 37, "word": "きつね", "reading": "きつね", "image": "kitsune.png"},
        {"id": 39, "word": "コアラ", "reading": "コアラ", "image": "koara.png"},
        {"id": 44, "word": "コップ", "reading": "コップ", "image": "koppu.png"},
        {"id": 38, "word": "こいのぼり", "reading": "こいのぼり", "image": "koinobori.png"},
        {"id": 9, "word": "ごはん", "reading": "ごはん", "image": "gohan.png"},
        {"id": 34, "word": "ごみばこ", "reading": "ごみばこ", "image": "gomibako.png"},
        {"id": 28, "word": "ごくう", "reading": "ごくう", "image": "goku.png"},
        {"id": 25, "word": "ごま", "reading": "ごま", "image": "goma.png"},
        {"id": 30, "word": "ゴリラ", "reading": "ゴリラ", "image": "gorira.png"},
        {"id": 3, "word": "さかな", "reading": "さかな", "image": "sakana.png"},
        {"id": 68, "word": "さる", "reading": "さる", "image": "saru.png"},
        {"id": 71, "word": "しか", "reading": "しか", "image": "shika.png"},
        {"id": 72, "word": "しまうま", "reading": "しまうま", "image": "shimauma.png"},
        {"id": 73, "word": "しんごう", "reading": "しんごう", "image": "shingou.png"},
        {"id": 77, "word": "すいか", "reading": "すいか", "image": "suika.png"},
        {"id": 78, "word": "すなはま", "reading": "すなはま", "image": "sunahama.png"},
        {"id": 76, "word": "すべりだい", "reading": "すべりだい", "image": "suberidai.png"},
        {"id": 69, "word": "せみ", "reading": "せみ", "image": "semi.png"},
        {"id": 70, "word": "せんぷうき", "reading": "せんぷうき", "image": "senpuki.png"},
        {"id": 74, "word": "そら", "reading": "そら", "image": "sora.png"},
        {"id": 75, "word": "そらまめ", "reading": "そらまめ", "image": "soramame.png"},
        {"id": 79, "word": "たこ", "reading": "たこ", "image": "tako.png"},
        {"id": 80, "word": "たまご", "reading": "たまご", "image": "tamago.png"},
        {"id": 81, "word": "たぬき", "reading": "たぬき", "image": "tanuki.png"},
        {"id": 5, "word": "だんご", "reading": "だんご", "image": "dango.png"},
        {"id": 7, "word": "ちず", "reading": "ちず", "image": "chizu.png"},
        {"id": 11, "word": "チョコレート", "reading": "チョコレート", "image": "choko.png"},
        {"id": 12, "word": "チューリップ", "reading": "チューリップ", "image": "churippu.png"},
        {"id": 88, "word": "つき", "reading": "つき", "image": "tsuki.png"},
        {"id": 89, "word": "つくえ", "reading": "つくえ", "image": "tsukue.png"},
        {"id": 90, "word": "つみき", "reading": "つみき", "image": "tsumiki.png"},
        {"id": 82, "word": "て", "reading": "て", "image": "te.png"},
        {"id": 84, "word": "テレビ", "reading": "テレビ", "image": "terebi.png"},
        {"id": 83, "word": "テント", "reading": "テント", "image": "tento.png"},
        {"id": 85, "word": "とけい", "reading": "とけい", "image": "tokei.png"},
        {"id": 87, "word": "とら", "reading": "とら", "image": "tora.png"},
        {"id": 86, "word": "トマト", "reading": "トマト", "image": "tomato.png"},
        {"id": 52, "word": "なす", "reading": "なす", "image": "nasu.png"},
        {"id": 51, "word": "なし", "reading": "なし", "image": "nashi.png"},
        {"id": 48, "word": "なっとう", "reading": "なっとう", "image": "natto.png"},
        {"id": 53, "word": "にじ", "reading": "にじ", "image": "niji.png"},
        {"id": 54, "word": "にんじん", "reading": "にんじん", "image": "ninjin.png"},
        {"id": 55, "word": "にわとり", "reading": "にわとり", "image": "niwatori.png"},
        {"id": 1, "word": "ねこ", "reading": "ねこ", "image": "neko.png"},
        {"id": 50, "word": "ねずみ", "reading": "ねずみ", "image": "nezumi.png"},
        {"id": 49, "word": "ねんど", "reading": "ねんど", "image": "nendo.png"},
        {"id": 56, "word": "のこぎり", "reading": "のこぎり", "image": "nokogiri.png"},
        {"id": 57, "word": "のり", "reading": "のり", "image": "nori.png"},
        {"id": 58, "word": "ぬりえ", "reading": "ぬりえ", "image": "nurie.png"},
        {"id": 29, "word": "は", "reading": "は", "image": "ha.png"},
        {"id": 32, "word": "はし", "reading": "はし", "image": "hashi.png"},
        {"id": 26, "word": "はな", "reading": "はな", "image": "hana.png"},
        {"id": 33, "word": "はみがき", "reading": "はみがき", "image": "hamigaki.png"},
        {"id": 31, "word": "ひ", "reading": "ひ", "image": "hi.png"},
        {"id": 27, "word": "ひこうき", "reading": "ひこうき", "image": "hikoki.png"},
        {"id": 24, "word": "ひよこ", "reading": "ひよこ", "image": "hiyoko.png"},
        {"id": 15, "word": "ひまわり", "reading": "ひまわり", "image": "himawari.png"},
        {"id": 63, "word": "ライオン", "reading": "ライオン", "image": "raion.png"},
        {"id": 64, "word": "ラクダ", "reading": "ラクダ", "image": "rakuda.png"},
        {"id": 62, "word": "ラジオ", "reading": "ラジオ", "image": "radio.png"},
        {"id": 65, "word": "りか", "reading": "りか", "image": "rika.png"},
        {"id": 66, "word": "りきし", "reading": "りきし", "image": "rikishi.png"},
        {"id": 4, "word": "りんご", "reading": "りんご", "image": "ringo.png"},
        {"id": 67, "word": "りす", "reading": "りす", "image": "risu.png"}
    ];

    // 2. ----------------- 単語マップの作成 -----------------
    const WordMap = new Map();
    WORD_DATA.forEach(item => {
        // カタカナの単語（アヒルなど）もひらがなに変換してキーにする
        const firstChar = item.reading.charAt(0);
        
        if (!WordMap.has(firstChar)) {
            WordMap.set(firstChar, { word: item.word, image: item.image });
        }
    });
    
    // ごくう、だんご など、濁音のキーもマップに追加
    WordMap.set('ご', { word: 'ごくう', image: 'goku.png' });
    WordMap.set('だ', { word: 'だんご', image: 'dango.png' });
    // ... (必要に応じて濁音の単語を手動でWordMapに追加)


    // 3. ----------------- データ構造の定義 -----------------

    // 3a. 清音 (Seion) - 50音 (10列の縦レイアウト)
    // ★レイアウト変更: 伝統的な「わ行」が左、「あ行」が右になるように配列の順序を逆にします。
    const SEION_COLUMNS = [
        // 10列目 (わ行) ※これがCSS Gridの1列目（左端）になります
        [ { hira: 'わ', kata: 'ワ' }, { hira: 'を', kata: 'ヲ' }, null, null, { hira: 'ん', kata: 'ン' } ],
        // 9列目 (ら行)
        [ { hira: 'ら', kata: 'ラ' }, { hira: 'り', kata: 'リ' }, { hira: 'る', kata: 'ル' }, { hira: 'れ', kata: 'レ' }, { hira: 'ろ', kata: 'ロ' } ],
        // 8列目 (や行)
        [ { hira: 'や', kata: 'ヤ' }, null, { hira: 'ゆ', kata: 'ユ' }, null, { hira: 'よ', kata: 'ヨ' } ],
        // 7列目 (ま行)
        [ { hira: 'ま', kata: 'マ' }, { hira: 'み', kata: 'ミ' }, { hira: 'む', kata: 'ム' }, { hira: 'め', kata: 'メ' }, { hira: 'も', kata: 'モ' } ],
        // 6列目 (は行)
        [ { hira: 'は', kata: 'ハ' }, { hira: 'ひ', kata: 'ヒ' }, { hira: 'ふ', kata: 'フ' }, { hira: 'へ', kata: 'ヘ' }, { hira: 'ほ', kata: 'ホ' } ],
        // 5列目 (な行)
        [ { hira: 'な', kata: 'ナ' }, { hira: 'に', kata: 'ニ' }, { hira: 'ぬ', kata: 'ヌ' }, { hira: 'ね', kata: 'ネ' }, { hira: 'の', kata: 'ノ' } ],
        // 4列目 (た行)
        [ { hira: 'た', kata: 'タ' }, { hira: 'ち', kata: 'チ' }, { hira: 'つ', kata: 'ツ' }, { hira: 'て', kata: 'テ' }, { hira: 'と', kata: 'ト' } ],
        // 3列目 (さ行)
        [ { hira: 'さ', kata: 'サ' }, { hira: 'し', kata: 'シ' }, { hira: 'す', kata: 'ス' }, { hira: 'せ', kata: 'セ' }, { hira: 'そ', kata: 'ソ' } ],
        // 2列目 (か行)
        [ { hira: 'か', kata: 'カ' }, { hira: 'き', kata: 'キ' }, { hira: 'く', kata: 'ク' }, { hira: 'け', kata: 'ケ' }, { hira: 'こ', kata: 'コ' } ],
        // 1列目 (あ行) ※これがCSS Gridの10列目（右端）になります
        [ { hira: 'あ', kata: 'ア' }, { hira: 'い', kata: 'イ' }, { hira: 'う', kata: 'ウ' }, { hira: 'え', kata: 'エ' }, { hira: 'お', kata: 'オ' } ]
    ];

    // 3b. 濁音 (Dakuon) - 3列テーブル用
    const DAKUON_DATA = [
        { hira: 'が', kata: 'ガ' }, { hira: 'ぎ', kata: 'ギ' }, { hira: 'ぐ', kata: 'グ' }, { hira: 'げ', kata: 'ゲ' }, { hira: 'ご', kata: 'ゴ' },
        { hira: 'ざ', kata: 'ザ' }, { hira: 'じ', kata: 'ジ' }, { hira: 'ず', kata: 'ズ' }, { hira: 'ぜ', kata: 'ゼ' }, { hira: 'ぞ', kata: 'ゾ' },
        { hira: 'だ', kata: 'ダ' }, { hira: 'ぢ', kata: 'ヂ' }, { hira: 'づ', kata: 'ヅ' }, { hira: 'で', kata: 'デ' }, { hira: 'ど', kata: 'ド' },
        { hira: 'ば', kata: 'バ' }, { hira: 'び', kata: 'ビ' }, { hira: 'ぶ', kata: 'ブ' }, { hira: 'べ', kata: 'ベ' }, { hira: 'ぼ', kata: 'ボ' }
    ];

    // 3c. 半濁音 (Handakuon)
    const HANDAKUON_DATA = [
        { hira: 'ぱ', kata: 'パ' }, { hira: 'ぴ', kata: 'ピ' }, { hira: 'ぷ', kata: 'プ' }, { hira: 'ぺ', kata: 'ペ' }, { hira: 'ぽ', kata: 'ポ' }
    ];
    
    // 4. ----------------- 描画ロジック -----------------

    /**
     * 単語マップから画像と単語を取得するヘルパー関数
     */
    function getMappedData(char) {
        // 'きゃ' の場合は 'き' を検索キーにする (拗音は未対応だがロジックとしては安全)
        const searchChar = char.charAt(0); 
        const mapped = WordMap.get(searchChar) || { word: 'なし', image: null };
        
        // ★修正点: 濁音・半濁音（'が', 'ぱ'など）も検索できるようにする★
        const mappedDakuon = WordMap.get(char); 
        
        let finalMapped = mapped;
        // もし「が」で検索して「ごくう」などが見つかれば、そちらを優先
        if (mappedDakuon && mappedDakuon.word !== 'なし') {
            finalMapped = mappedDakuon;
        }

        const imagePath = finalMapped.image ? `assets/images/${finalMapped.image}` : null;
        const wordDisplay = (finalMapped.word && finalMapped.word !== 'なし') ? `<span class="kiso-word">(${finalMapped.word})</span>` : '';
        const imageTag = imagePath ? 
            `<img src="${imagePath}" alt="${finalMapped.word}" class="kiso-illust" onerror="this.style.display='none'; this.nextSibling.style.display='none'; this.previousSibling.style.display='block';">` : 
            '<div class="kiso-illust-placeholder"></div>';
            
        // ★修正: onerror時にプレースホルダーを表示し、単語を隠す
        const imageTagWithErrorHandling = imagePath ?
            `<img src="${imagePath}" alt="${finalMapped.word}" class="kiso-illust" onerror="this.style.display='none'; if(this.nextSibling) this.nextSibling.style.display='none'; this.parentElement.querySelector('.kiso-illust-placeholder').style.display='block';">` :
            '';

        return {
            imageTag: imageTagWithErrorHandling + '<div class="kiso-illust-placeholder" style="display:' + (imagePath ? 'none' : 'block') + ';"></div>',
            wordDisplay: wordDisplay
        };
    }

    // 4a. 清音(Seion) 50音グリッドの描画
    const seionContainer = document.getElementById('kiso-chart-container-seion');
    if (seionContainer) {
        let html = '';
        const numRows = 5; // あ, い, う, え, お (段)
        const numCols = 10; // あ, か, さ, ... わ (行)

        for (let i = 0; i < numRows; i++) { // 縦(i) (0='あ'段, 1='い'段...)
            for (let j = 0; j < numCols; j++) { // 横(j) (0=あ行, 1=か行...)
                
                const cell = (SEION_COLUMNS[j] && SEION_COLUMNS[j][i]) ? SEION_COLUMNS[j][i] : null;

                if (cell) {
                    const { imageTag, wordDisplay } = getMappedData(cell.hira);
                    
                    html += `
                        <div class="kiso-cell">
                            <div class="kiso-chars">
                                <span class="kiso-hira">${cell.hira}</span>
                                <span class="kiso-kata">${cell.kata}</span>
                            </div>
                            ${imageTag}
                            ${wordDisplay}
                        </div>
                    `;
                } else {
                    html += '<div class="kiso-cell empty"></div>'; // (や行・わ行の空き)
                }
            }
        }
        
        seionContainer.textContent = html;
    }

    // 4b. 濁音・半濁音 (3列テーブルの描画)
    function renderTable(tbodyId, data) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        let html = '';
        data.forEach(item => {
            const { imageTag, wordDisplay } = getMappedData(item.hira);

            html += `
                <tr>
                    <td class="char-hira">${item.hira}</td>
                    <td class="char-kata">${item.kata}</td>
                    <td class="char-illust">
                        ${imageTag}
                        ${wordDisplay}
                    </td>
                </tr>
            `;
        });
        tbody.textContent = html;
    }

    renderTable('kiso-tbody-dakuon', DAKUON_DATA);
    renderTable('kiso-tbody-handakuon', HANDAKUON_DATA);

}); // End of DOMContentLoaded