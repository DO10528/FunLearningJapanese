document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // ★★★ 設定 & ポイントシステム ★★★
    // ----------------------------------------------------
    const GAME_ID = 'hiragana_word_quiz'; 
    const USER_STORAGE_KEY = 'user_accounts'; 
    const SESSION_STORAGE_KEY = 'current_user'; 
    const GUEST_NAME = 'ゲスト'; 

    // DOM要素の取得
    const MENU_AREA = document.getElementById('quiz-menu-area');
    const GAME_AREA = document.getElementById('quiz-game-area');
    const SCORE_MESSAGE = document.getElementById('quiz-score-message');
    const TURN_MESSAGE = document.getElementById('quiz-turn-message');
    const IMAGE_AREA = document.getElementById('quiz-image-area');
    const CHOICE_BUTTONS_AREA = document.getElementById('choice-buttons-area');
    const FEEDBACK = document.getElementById('quiz-feedback');
    const SCORE_VAL = document.getElementById('score-val');
    const START_BUTTON = document.getElementById('quizStartButton'); 

    // 音声設定
    const SOUND_CORRECT = new Audio('assets/sounds/seikai.mp3'); 
    const SOUND_INCORRECT = new Audio('assets/sounds/bubu.mp3'); 

    // ----------------------------------------------------
    // ★★★ 全データリスト (自動生成済み) ★★★
    // ----------------------------------------------------
    // ※画像はすべて assets/images/ 直下にある前提で作成しています
    const gameData = [
        { id: 1, word: 'あひる', image: 'ahiru.png' },
        { id: 2, word: 'あじさい', image: 'ajisai.png' },
        { id: 3, word: 'あか', image: 'aka.png' },
        { id: 4, word: 'あめ', image: 'ame.png' },
        { id: 5, word: 'アメリカ', image: 'america.png' },
        { id: 6, word: 'あんこ', image: 'anko.png' },
        { id: 7, word: 'あお', image: 'ao.png' },
        { id: 8, word: 'あり', image: 'ari.png' },
        { id: 9, word: 'あさがお', image: 'asagao.png' },
        { id: 10, word: 'あし', image: 'ashi.png' },
        { id: 11, word: 'あつい', image: 'atsui.png' },
        { id: 12, word: 'バナナ', image: 'banana.png' },
        { id: 13, word: 'ばつ', image: 'batsu.png' },
        { id: 14, word: 'ばった', image: 'batta.png' },
        { id: 15, word: 'ビール', image: 'beer.png' },
        { id: 16, word: 'ビビンバ', image: 'bibimbap.png' },
        { id: 17, word: 'ビーだま', image: 'biidama.png' },
        { id: 18, word: 'ビスケット', image: 'biscuit.png' },
        { id: 19, word: 'ぼうし', image: 'boshi.png' },
        { id: 20, word: 'ぶた', image: 'buta.png' },
        { id: 21, word: 'キャベツ', image: 'cabbege.png' },
        { id: 22, word: 'カフェ', image: 'cafe.png' },
        { id: 23, word: 'カメラ', image: 'camera.png' },
        { id: 24, word: 'チーター', image: 'cheetah.png' },
        { id: 25, word: 'チェス', image: 'chess.png' },
        { id: 26, word: 'ちびまるこ', image: 'chibimaruko.png' },
        { id: 27, word: 'ちくわ', image: 'chikuwa.png' },
        { id: 28, word: 'ちらしずし', image: 'chirashizushi.png' },
        { id: 29, word: 'ちず', image: 'chizu.png' },
        { id: 30, word: 'ちょう', image: 'cho.png' },
        { id: 31, word: 'チョコ', image: 'choko.png' },
        { id: 32, word: 'チューリップ', image: 'churippu.png' },
        { id: 33, word: 'ココア', image: 'cocoa.png' },
        { id: 34, word: 'コーヒー', image: 'coffee.png' },
        { id: 35, word: 'コーラ', image: 'cola.png' },
        { id: 36, word: 'コンビニ', image: 'combini.png' },
        { id: 37, word: 'だちょう', image: 'dacho.png' },
        { id: 38, word: 'だいこん', image: 'daikon.png' },
        { id: 39, word: 'だんご', image: 'dango.png' },
        { id: 40, word: 'だるま', image: 'daruma.png' },
        { id: 41, word: 'でんしゃ', image: 'densha.png' },
        { id: 42, word: 'ドア', image: 'doa.png' },
        { id: 43, word: 'えび', image: 'ebi.png' },
        { id: 44, word: 'エビチリ', image: 'ebichiri.png' },
        { id: 45, word: 'エビフライ', image: 'ebifurai.png' },
        { id: 46, word: 'えだ', image: 'eda.png' },
        { id: 47, word: 'えほん', image: 'ehon.png' },
        { id: 48, word: 'えい', image: 'ei.png' },
        { id: 49, word: 'えいが', image: 'eiga.png' },
        { id: 50, word: 'えいご', image: 'eigo.png' },
        { id: 51, word: 'えき', image: 'eki.png' },
        { id: 52, word: 'えのぐ', image: 'enogu.png' },
        { id: 53, word: 'えんぴつ', image: 'enpitsu.png' },
        { id: 54, word: 'まんぼう', image: 'fish_mola2.png' },
        { id: 55, word: 'ふじさん', image: 'fujisan.png' },
        { id: 56, word: 'ふく', image: 'fuku.png' },
        { id: 57, word: 'ふね', image: 'fune.png' },
        { id: 58, word: 'ふうりん', image: 'furin.png' },
        { id: 59, word: 'ふうせん', image: 'fusen.png' },
        { id: 60, word: 'がっこう', image: 'gakko.png' },
        { id: 61, word: 'がくせい', image: 'gakusei.png' },
        { id: 62, word: 'ぎんこう', image: 'ginko.png' },
        { id: 63, word: 'ご', image: 'go.png' },
        { id: 64, word: 'ごはん', image: 'gohan.png' },
        { id: 65, word: 'ごくう', image: 'goku.png' },
        { id: 66, word: 'ごま', image: 'goma.png' },
        { id: 67, word: 'ごみばこ', image: 'gomibako.png' },
        { id: 68, word: 'ゴリラ', image: 'gorira.png' },
        { id: 69, word: 'ぎょうざ', image: 'gyoza.png' },
        { id: 70, word: 'は', image: 'ha.png' },
        { id: 71, word: 'はち', image: 'hachi.png' },
        { id: 72, word: 'はちみつ', image: 'hachimitsu.png' },
        { id: 73, word: 'はくちょう', image: 'hakucho.png' },
        { id: 74, word: 'はみがき', image: 'hamigaki.png' },
        { id: 75, word: 'はな', image: 'hana.png' },
        { id: 76, word: 'はなび', image: 'hanabi.png' },
        { id: 77, word: 'ハンカチ', image: 'hankachi.png' },
        { id: 78, word: 'はっぱ', image: 'happa.png' },
        { id: 79, word: 'はさみ', image: 'hasami.png' },
        { id: 80, word: 'はし', image: 'hashi.png' },
        { id: 81, word: 'ハート', image: 'heart.png' },
        { id: 82, word: 'へび', image: 'hebi.png' },
        { id: 83, word: 'へちま', image: 'hechima.png' },
        { id: 84, word: 'ひ', image: 'hi.png' },
        { id: 85, word: 'ひだり', image: 'hidari.png' },
        { id: 86, word: 'ひこうき', image: 'hikoki.png' },
        { id: 87, word: 'ひまわり', image: 'himawari.png' },
        { id: 88, word: 'ひとで', image: 'hitode.png' },
        { id: 89, word: 'ひよこ', image: 'hiyoko.png' },
        { id: 90, word: 'ほうき', image: 'hoki.png' },
        { id: 91, word: 'ほし', image: 'hoshi.png' },
        { id: 92, word: 'アイス', image: 'ice.png' },
        { id: 93, word: 'いち', image: 'ichi.png' },
        { id: 94, word: 'いちご', image: 'ichigo.png' },
        { id: 95, word: 'いか', image: 'ika.png' },
        { id: 96, word: 'いけ', image: 'ike.png' },
        { id: 97, word: 'いくら', image: 'ikura.png' },
        { id: 98, word: 'いも', image: 'imo.png' },
        { id: 99, word: 'インド', image: 'indo.png' },
        { id: 100, word: 'インドネシア', image: 'indonesia.png' },
        { id: 101, word: 'インコ', image: 'inko.png' },
        { id: 102, word: 'いのしし', image: 'inoshishi.png' },
        { id: 103, word: 'いのすけ', image: 'inosuke.png' },
        { id: 104, word: 'いぬ', image: 'inu.png' },
        { id: 105, word: 'イルカ', image: 'iruka.png' },
        { id: 106, word: 'いし', image: 'ishi.png' },
        { id: 107, word: 'いそぎんちゃく', image: 'isoginchaku.png' },
        { id: 108, word: 'いす', image: 'isu.png' },
        { id: 109, word: 'いとまき', image: 'itomaki.png' },
        { id: 110, word: 'じんじゃ', image: 'jinja.png' },
        { id: 111, word: 'じしゃく', image: 'jishaku.png' },
        { id: 112, word: 'じてんしゃ', image: 'jitensha.png' },
        { id: 113, word: 'かば', image: 'kaba.png' },
        { id: 114, word: 'かばん', image: 'kaban.png' },
        { id: 115, word: 'かべ', image: 'kabe.png' },
        { id: 116, word: 'かえる', image: 'kaeru.png' },
        { id: 117, word: 'かがみ', image: 'kagami.png' },
        { id: 118, word: 'かぎ', image: 'kagi.png' },
        { id: 119, word: 'かい', image: 'kai.png' },
        { id: 120, word: 'かじ', image: 'kaji.png' },
        { id: 121, word: 'かかし', image: 'kakashi.png' },
        { id: 122, word: 'かめ', image: 'kame.png' },
        { id: 123, word: 'かみ', image: 'kami.png' },
        { id: 124, word: 'かみさま', image: 'kamisama.png' },
        { id: 125, word: 'カンガルー', image: 'kangaroo.png' },
        { id: 126, word: 'かに', image: 'kani.png' },
        { id: 127, word: 'からす', image: 'karasu.png' },
        { id: 128, word: 'かさ', image: 'kasa.png' },
        { id: 129, word: 'かたな', image: 'katana.png' },
        { id: 130, word: 'かたつむり', image: 'katatsumuri.png' },
        { id: 131, word: 'かわ', image: 'kawa.png' },
        { id: 132, word: 'けいと', image: 'keito.png' },
        { id: 133, word: 'ケーキ', image: 'keki.png' },
        { id: 134, word: 'けむり', image: 'kemuri.png' },
        { id: 135, word: 'けむし', image: 'kemushi.png' },
        { id: 136, word: 'ケロロ', image: 'keroro.png' },
        { id: 137, word: 'けしゴム', image: 'keshigomu.png' },
        { id: 138, word: 'き', image: 'ki.png' },
        { id: 139, word: 'きいろ', image: 'kiiro.png' },
        { id: 140, word: 'ききゅう', image: 'kikyu.png' },
        { id: 141, word: 'きもの', image: 'kimono.png' },
        { id: 142, word: 'キムチ', image: 'kimuchi.png' },
        { id: 143, word: 'きんにく', image: 'kinniku.png' },
        { id: 144, word: 'きのこ', image: 'kinoko.png' },
        { id: 145, word: 'きりん', image: 'kirin.png' },
        { id: 146, word: 'きしゃ', image: 'kisha.png' },
        { id: 147, word: 'きつね', image: 'kitsune.png' },
        { id: 148, word: 'きつつき', image: 'kitsutsuki.png' },
        { id: 149, word: 'ナイフ', image: 'knife.png' },
        { id: 150, word: 'コアラ', image: 'koara.png' },
        { id: 151, word: 'こうちゃ', image: 'kocha.png' },
        { id: 152, word: 'こども', image: 'kodomo.png' },
        { id: 153, word: 'こい', image: 'koi.png' },
        { id: 154, word: 'こいのぼり', image: 'koinobori.png' },
        { id: 155, word: 'こけ', image: 'koke.png' },
        { id: 156, word: 'こま', image: 'koma.png' },
        { id: 157, word: 'こんぶ', image: 'kombu.png' },
        { id: 158, word: 'コップ', image: 'koppu.png' },
        { id: 159, word: 'こおり', image: 'kori.png' },
        { id: 160, word: 'コロッケ', image: 'korokke.png' },
        { id: 161, word: 'こしょう', image: 'kosho.png' },
        { id: 162, word: 'くち', image: 'kuchi.png' },
        { id: 163, word: 'くだもの', image: 'kudamono.png' },
        { id: 164, word: 'くじら', image: 'kujira.png' },
        { id: 165, word: 'くうこう', image: 'kuko.png' },
        { id: 166, word: 'くま', image: 'kuma.png' },
        { id: 167, word: 'くも', image: 'kumo.png' },
        { id: 168, word: 'くり', image: 'kuri.png' },
        { id: 169, word: 'くろ', image: 'kuro.png' },
        { id: 170, word: 'くるま', image: 'kuruma.png' },
        { id: 171, word: 'くるみ', image: 'kurumi.png' },
        { id: 172, word: 'くさ', image: 'kusa.png' },
        { id: 173, word: 'くつ', image: 'kutsu.png' },
        { id: 174, word: 'きょうかしょ', image: 'kyokasho.png' },
        { id: 175, word: 'きょうりゅう', image: 'kyoryu.png' },
        { id: 176, word: 'きゅう', image: 'kyu.png' },
        { id: 177, word: 'きゅうり', image: 'kyuuri.png' },
        { id: 178, word: 'リップ', image: 'lip.png' },
        { id: 179, word: 'まど', image: 'mado.png' },
        { id: 180, word: 'まぐろ', image: 'maguro.png' },
        { id: 181, word: 'マイク', image: 'maiku.png' },
        { id: 182, word: 'まき', image: 'maki.png' },
        { id: 183, word: 'まくら', image: 'makura.png' },
        { id: 184, word: 'まり', image: 'mali.png' },
        { id: 185, word: 'まめ', image: 'mame.png' },
        { id: 186, word: 'マンガ', image: 'manga.png' },
        { id: 187, word: 'マンゴー', image: 'mango.png' },
        { id: 188, word: 'マリオ', image: 'mario.png' },
        { id: 189, word: 'まる', image: 'maru.png' },
        { id: 190, word: 'まっちゃ', image: 'matcha.png' },
        { id: 191, word: 'めだか', image: 'medaka.png' },
        { id: 192, word: 'めだまやき', image: 'medamayaki.png' },
        { id: 193, word: 'めがね', image: 'megane.png' },
        { id: 194, word: 'めんぼう', image: 'membo.png' },
        { id: 195, word: 'メモ', image: 'memo.png' },
        { id: 196, word: 'みち', image: 'michi.png' },
        { id: 197, word: 'みどり', image: 'midori.png' },
        { id: 198, word: 'みぎ', image: 'migi.png' },
        { id: 199, word: 'みかん', image: 'mikan.png' },
        { id: 200, word: 'ミント', image: 'mint.png' },
        { id: 201, word: 'みそ', image: 'miso.png' },
        { id: 202, word: 'みそしる', image: 'misoshiru.png' },
        { id: 203, word: 'みずうみ', image: 'mizuumi.png' },
        { id: 204, word: 'もぐら', image: 'mogura.png' },
        { id: 205, word: 'もも', image: 'momo.png' },
        { id: 206, word: 'もり', image: 'mori.png' },
        { id: 207, word: 'ムエタイ', image: 'muaythai.png' },
        { id: 208, word: 'むぎ', image: 'mugi.png' },
        { id: 209, word: 'むらさき', image: 'murasaki.png' },
        { id: 210, word: 'むし', image: 'mushi.png' },
        { id: 211, word: 'なべ', image: 'nabe.png' },
        { id: 212, word: 'なまこ', image: 'namako.png' },
        { id: 213, word: 'なまず', image: 'namazu.png' },
        { id: 214, word: 'なみ', image: 'nami.png' },
        { id: 215, word: 'なな', image: 'nana.png' },
        { id: 216, word: 'なし', image: 'nashi.png' },
        { id: 217, word: 'なす', image: 'nasu.png' },
        { id: 218, word: 'なっとう', image: 'natto.png' },
        { id: 219, word: 'ねこ', image: 'neko.png' },
        { id: 220, word: 'ねんど', image: 'nendo.png' },
        { id: 221, word: 'ねずみ', image: 'nezumi.png' },
        { id: 222, word: 'に', image: 'ni.png' },
        { id: 223, word: 'にほん', image: 'nihon.png' },
        { id: 224, word: 'にじ', image: 'niji.png' },
        { id: 225, word: 'ナイキ', image: 'nike.png' },
        { id: 226, word: 'にく', image: 'niku.png' },
        { id: 227, word: 'にんぎょ', image: 'ningyo.png' },
        { id: 228, word: 'にんじん', image: 'ninjin.png' },
        { id: 229, word: 'にんにく', image: 'ninniku.png' },
        { id: 230, word: 'にわ', image: 'niwa.png' },
        { id: 231, word: 'にわとり', image: 'niwatori.png' },
        { id: 232, word: 'のびた', image: 'nobita.png' },
        { id: 233, word: 'のこぎり', image: 'nokogiri.png' },
        { id: 234, word: 'のり', image: 'nori.png' },
        { id: 235, word: 'のりもの', image: 'norimono.png' },
        { id: 236, word: 'ぬいぐるみ', image: 'nuigurumi.png' },
        { id: 237, word: 'ぬの', image: 'nuno.png' },
        { id: 238, word: 'ぬりえ', image: 'nurie.png' },
        { id: 239, word: 'おか', image: 'oka.png' },
        { id: 240, word: 'おおかみ', image: 'okami.png' },
        { id: 241, word: 'おかね', image: 'okane.png' },
        { id: 242, word: 'おかし', image: 'okashi.png' },
        { id: 243, word: 'おもちゃ', image: 'omocha.png' },
        { id: 244, word: 'おんぷ', image: 'ompu.png' },
        { id: 245, word: 'オムレツ', image: 'omuretsu.png' },
        { id: 246, word: 'オムライス', image: 'omurice.png' },
        { id: 247, word: 'おに', image: 'oni.png' },
        { id: 248, word: 'おにぎり', image: 'onigiri.png' },
        { id: 249, word: 'おんなのこ', image: 'onnanoko.png' },
        { id: 250, word: 'おの', image: 'ono.png' },
        { id: 251, word: 'おんせん', image: 'onsen.png' },
        { id: 252, word: 'オレンジ', image: 'orenji.png' },
        { id: 253, word: 'おり', image: 'ori.png' },
        { id: 254, word: 'おりがみ', image: 'origami.png' },
        { id: 255, word: 'おさけ', image: 'osake.png' },
        { id: 256, word: 'おさら', image: 'osara.png' },
        { id: 257, word: 'おてら', image: 'otera.png' },
        { id: 258, word: 'おとこのこ', image: 'otokonoko.png' },
        { id: 259, word: 'おうさま', image: 'ousama.png' },
        { id: 260, word: 'パンダ', image: 'panda.png' },
        { id: 261, word: 'ピンク', image: 'pink.png' },
        { id: 262, word: 'ぷっちょ', image: 'puccho.jpg' },
        { id: 263, word: 'ラケット', image: 'racket.png' },
        { id: 264, word: 'ラジオ', image: 'radio.png' },
        { id: 265, word: 'ライオン', image: 'raion.png' },
        { id: 266, word: 'らっこ', image: 'rakko.png' },
        { id: 267, word: 'らくだ', image: 'rakuda.png' },
        { id: 268, word: 'ラーメン', image: 'ramen.png' },
        { id: 269, word: 'ランドセル', image: 'randoseru.png' },
        { id: 270, word: 'らっぱ', image: 'rappa.png' },
        { id: 271, word: 'レモン', image: 'remon.png' },
        { id: 272, word: 'りか', image: 'rika.png' },
        { id: 273, word: 'りきし', image: 'rikishi.png' },
        { id: 274, word: 'りんご', image: 'ringo.png' },
        { id: 275, word: 'りす', image: 'risu.png' },
        { id: 276, word: 'ロバ', image: 'roba.png' },
        { id: 277, word: 'ロボット', image: 'robotto.png' },
        { id: 278, word: 'ロケット', image: 'rocket.png' },
        { id: 279, word: 'ろく', image: 'roku.png' },
        { id: 280, word: 'ろうそく', image: 'rosoku.png' },
        { id: 281, word: 'ルビー', image: 'ruby.png' },
        { id: 282, word: 'ラグビー', image: 'rugby.png' },
        { id: 283, word: 'ルイージ', image: 'ruiji.png' },
        { id: 284, word: 'ルンバ', image: 'runba.png' },
        { id: 285, word: 'るり', image: 'ruri.png' },
        { id: 286, word: 'るりびたき', image: 'ruribitaki.png' },
        { id: 287, word: 'りょこう', image: 'ryoko.png' },
        { id: 288, word: 'さいふ', image: 'saifu.png' },
        { id: 289, word: 'さいころ', image: 'saikoro.png' },
        { id: 290, word: 'さかな', image: 'sakana.png' },
        { id: 291, word: 'さくら', image: 'sakura.png' },
        { id: 292, word: 'さくらんぼ', image: 'sakurambo.png' },
        { id: 293, word: 'さむい', image: 'samui.png' },
        { id: 294, word: 'さん', image: 'san.png' },
        { id: 295, word: 'さんかく', image: 'sankaku.png' },
        { id: 296, word: 'さる', image: 'saru.png' },
        { id: 297, word: 'さしみ', image: 'sashimi.png' },
        { id: 298, word: 'さとう', image: 'sato.png' },
        { id: 299, word: 'さざえ', image: 'sazae.png' },
        { id: 300, word: 'せみ', image: 'semi.png' },
        { id: 301, word: 'せんぷうき', image: 'senpuki.png' },
        { id: 302, word: 'せんせい', image: 'sensei.png' },
        { id: 303, word: 'せんたくき', image: 'sentakuki.png' },
        { id: 304, word: 'セーター', image: 'seta.png' },
        { id: 305, word: 'シャチ', image: 'shachi.png' },
        { id: 306, word: 'シャツ', image: 'shatsu.png' },
        { id: 307, word: 'しいたけ', image: 'shiitake.png' },
        { id: 308, word: 'しか', image: 'shika.png' },
        { id: 309, word: 'しかく', image: 'shikaku.png' },
        { id: 310, word: 'しま', image: 'shima.png' },
        { id: 311, word: 'しまうま', image: 'shimauma.png' },
        { id: 312, word: 'しんごう', image: 'shingou.png' },
        { id: 313, word: 'しんぞう', image: 'shinzo.png' },
        { id: 314, word: 'しお', image: 'shio.png' },
        { id: 315, word: 'しろ', image: 'shiro.png' },
        { id: 316, word: 'しろくま', image: 'shirokuma.png' },
        { id: 317, word: 'しそ', image: 'shiso.png' },
        { id: 318, word: 'した', image: 'shita.png' },
        { id: 319, word: 'しょうゆ', image: 'shoyu.png' },
        { id: 320, word: 'しゅくだい', image: 'shukudai.png' },
        { id: 321, word: 'スケート', image: 'skate.png' },
        { id: 322, word: 'スキー', image: 'ski.png' },
        { id: 323, word: 'スライム', image: 'slime.png' },
        { id: 324, word: 'スリッパ', image: 'slipper.png' },
        { id: 325, word: 'そうじき', image: 'sojiki.png' },
        { id: 326, word: 'そら', image: 'sora.png' },
        { id: 327, word: 'そらまめ', image: 'soramame.png' },
        { id: 328, word: 'スピーカー', image: 'speaker.png' },
        { id: 329, word: 'ステーキ', image: 'steak.png' },
        { id: 330, word: 'すべりだい', image: 'suberidai.png' },
        { id: 331, word: 'すいえい', image: 'suiei.png' },
        { id: 332, word: 'すいか', image: 'suika.png' },
        { id: 333, word: 'すいしゃ', image: 'suisha.png' },
        { id: 334, word: 'すいとう', image: 'suito.png' },
        { id: 335, word: 'すきやき', image: 'sukiyaki.png' },
        { id: 336, word: 'スマホ', image: 'sumaho.png' },
        { id: 337, word: 'すみ', image: 'sumi.png' },
        { id: 338, word: 'すもう', image: 'sumo.png' },
        { id: 339, word: 'すなはま', image: 'sunahama.png' },
        { id: 340, word: 'すねお', image: 'suneo.png' },
        { id: 341, word: 'すし', image: 'sushi.png' },
        { id: 342, word: 'すず', image: 'suzu.png' },
        { id: 343, word: 'すずめ', image: 'suzume.png' },
        { id: 344, word: 'たい', image: 'tai.png' },
        { id: 345, word: 'たいこ', image: 'taiko.png' },
        { id: 346, word: 'タイヤ', image: 'taiya.png' },
        { id: 347, word: 'たいやき', image: 'taiyaki.png' },
        { id: 348, word: 'たいよう', image: 'taiyo.png' },
        { id: 349, word: 'たから', image: 'takara.png' },
        { id: 350, word: 'たけ', image: 'take.png' },
        { id: 351, word: 'たけのこ', image: 'takenoko.png' },
        { id: 352, word: 'たき', image: 'taki.png' },
        { id: 353, word: 'たこ', image: 'tako.png' },
        { id: 354, word: 'たこやき', image: 'takoyaki.png' },
        { id: 355, word: 'たまご', image: 'tamago.png' },
        { id: 356, word: 'たんぼ', image: 'tambo.png' },
        { id: 357, word: 'たぬき', image: 'tanuki.png' },
        { id: 358, word: 'テープ', image: 'tape.png' },
        { id: 359, word: 'たたみ', image: 'tatami.png' },
        { id: 360, word: 'たて', image: 'tate.png' },
        { id: 361, word: 'タクシー', image: 'taxi.png' },
        { id: 362, word: 'て', image: 'te.png' },
        { id: 363, word: 'てぶくろ', image: 'tebukuro.png' },
        { id: 364, word: 'てがみ', image: 'tegami.png' },
        { id: 365, word: 'てんぷら', image: 'tempura.png' },
        { id: 366, word: 'てんとうむし', image: 'tento.png' },
        { id: 367, word: 'テレビ', image: 'terebi.png' },
        { id: 368, word: 'てるてるぼうず', image: 'teruteru.png' },
        { id: 369, word: 'とうふ', image: 'tofu.png' },
        { id: 370, word: 'とうがらし', image: 'togarashi.png' },
        { id: 371, word: 'トイレ', image: 'toilet.png' },
        { id: 372, word: 'トカゲ', image: 'tokage.png' },
        { id: 373, word: 'とけい', image: 'tokei.png' },
        { id: 374, word: 'トマト', image: 'tomato.png' },
        { id: 375, word: 'ともだち', image: 'tomodachi.png' },
        { id: 376, word: 'トナカイ', image: 'tonakai.png' },
        { id: 377, word: 'とら', image: 'tora.png' },
        { id: 378, word: 'とり', image: 'tori.png' },
        { id: 379, word: 'としょしつ', image: 'toshoshitsu.png' },
        { id: 380, word: 'タオル', image: 'towel.png' },
        { id: 381, word: 'トラック', image: 'truck.png' },
        { id: 382, word: 'トランプ', image: 'trump.png' },
        { id: 383, word: 'つばめ', image: 'tsubame.png' },
        { id: 384, word: 'つち', image: 'tsuchi.png' },
        { id: 385, word: 'つえ', image: 'tsue.png' },
        { id: 386, word: 'つき', image: 'tsuki.png' },
        { id: 387, word: 'つくえ', image: 'tsukue.png' },
        { id: 388, word: 'つみき', image: 'tsumiki.png' },
        { id: 389, word: 'つり', image: 'tsuri.png' },
        { id: 390, word: 'ツナ', image: 'tuna.png' },
        { id: 391, word: 'トンネル', image: 'tunnel.png' },
        { id: 392, word: 'うちわ', image: 'uchiwa.png' },
        { id: 393, word: 'うで', image: 'ude.png' },
        { id: 394, word: 'うどん', image: 'udon.png' },
        { id: 395, word: 'うえ', image: 'ue.png' },
        { id: 396, word: 'うきわ', image: 'ukiwa.png' },
        { id: 397, word: 'うま', image: 'uma.png' },
        { id: 398, word: 'うめ', image: 'ume.png' },
        { id: 399, word: 'うみ', image: 'umi,png.jpg' },
        { id: 400, word: 'うさぎ', image: 'usagi.png' },
        { id: 401, word: 'うし', image: 'ushi.png' },
        { id: 402, word: 'わかめ', image: 'wakame.png' },
        { id: 403, word: 'わに', image: 'wani.png' },
        { id: 404, word: 'ワリオ', image: 'wario.png' },
        { id: 405, word: 'やぎ', image: 'yagi.png' },
        { id: 406, word: 'やま', image: 'yama.png' },
        { id: 407, word: 'ようかい', image: 'yokai.png' },
        { id: 408, word: 'よん', image: 'yon.png' },
        { id: 409, word: 'よしず', image: 'yoshizu.png' },
        { id: 410, word: 'よう', image: 'you.png' },
        { id: 411, word: 'ゆびわ', image: 'yubiwa.png' },
        { id: 412, word: 'ゆき', image: 'yuki.png' },
        { id: 413, word: 'ざる', image: 'zaru.png' },
        { id: 414, word: 'ざるそば', image: 'zarusoba.png' }
    ];

    //ゲーム状態
    let currentWord = null;
    let score = 0;
    let questionCount = 0;
    const MAX_QUESTIONS = 10; // 1ゲーム10問
    let askedWordIds = new Set(); 

    // ポイント付与ロジック
    function getTodayDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }
    function checkAndAwardPoints(wordId) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!currentUser || currentUser === GUEST_NAME) return "guest"; 
        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = getTodayDateString();
        const progressKey = `${GAME_ID}_word_${wordId}`;
        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};

        if (user.progress[progressKey][today] === true) return "already_scored"; 

        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        return "scored"; 
    }

    // ----------------------------------------------------
    // 1. ゲーム開始 (HTMLのonclickではなくここで設定)
    // ----------------------------------------------------
    // スタートボタンがクリックされたら startNewGameLogic を実行する設定
    if (START_BUTTON) {
        START_BUTTON.addEventListener('click', startNewGameLogic);
    } else {
        console.error("エラー: スタートボタン(id='quizStartButton')が見つかりません。HTMLを確認してください。");
    }

    function startNewGameLogic() {
        // データチェック
        if (allWords.length < 4) {
            alert('データ不足のためゲームを開始できません(最低4単語必要)');
            return;
        }
        
        MENU_AREA.style.display = 'none'; 
        GAME_AREA.style.display = 'block'; 

        score = 0; 
        questionCount = 0;
        askedWordIds.clear(); 
        updateScoreBoard();
        showNextQuestion();
    }
    
    // 2. 次の問題へ
    function showNextQuestion() {
        if (questionCount >= MAX_QUESTIONS) {
            // ゲーム終了
            alert(`おつかれさま！\n${MAX_QUESTIONS}問中、${score / 10}問せいかい！`);
            location.reload(); // リロードしてメニューに戻る
            return;
        }
        
        questionCount++;
        updateScoreBoard();

        // まだ出題していない単語から選ぶ
        let availableWords = allWords.filter(w => !askedWordIds.has(w.id));
        if (availableWords.length === 0) {
            askedWordIds.clear(); // 一周したらリセット
            availableWords = allWords;
        }

        const correctIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[correctIndex];
        askedWordIds.add(currentWord.id);

        // 不正解の選択肢を3つ選ぶ (合計4択)
        let wrongChoices = [];
        // 無限ループ防止のための安全装置
        let safeCounter = 0;
        while (wrongChoices.length < 3 && safeCounter < 100) {
            const rIndex = Math.floor(Math.random() * allWords.length);
            const w = allWords[rIndex];
            if (w.id !== currentWord.id && !wrongChoices.some(wc => wc.id === w.id)) {
                wrongChoices.push(w);
            }
            safeCounter++;
        }
        
        let choices = [currentWord, ...wrongChoices];
        choices = shuffleArray(choices); // シャッフル

        renderQuestionUI(currentWord, choices);
    }

    // 3. UI描画
    function renderQuestionUI(word, choices) {
        // 画像エリア
        // 画像が見つからない時にエラーで止まらないよう onerror を設定
        IMAGE_AREA.innerHTML = `
            <img src="assets/images/${word.image}" 
                 alt="${word.word}" 
                 onerror="this.style.display='none'; this.parentNode.innerHTML='<p>(${word.image}が見つかりません)</p>'">
        `;
        
        // 選択肢ボタン生成
        CHOICE_BUTTONS_AREA.innerHTML = '';
        FEEDBACK.textContent = '';
        FEEDBACK.style.color = '#333';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn'; // ★CSSでスタイルされたクラス
            btn.textContent = choice.word;
            btn.dataset.word = choice.word;
            btn.onclick = handleAnswer;
            CHOICE_BUTTONS_AREA.appendChild(btn);
        });
    }

    // 4. 回答処理
    function handleAnswer(e) {
        const btn = e.target;
        const selectedWord = btn.dataset.word;
        
        // 連打防止のため全ボタンを無効化
        const allBtns = document.querySelectorAll('.choice-btn');
        allBtns.forEach(b => b.classList.add('disabled'));

        if (selectedWord === currentWord.word) {
            // 正解
            SOUND_CORRECT.currentTime = 0;
            SOUND_CORRECT.play().catch(()=>{});
            
            btn.classList.add('correct'); // 緑色にする
            
            const result = checkAndAwardPoints(currentWord.id);
            let msg = 'せいかい！✨';
            if (result === "scored") msg += ' (+1 pt)';
            
            FEEDBACK.textContent = msg;
            FEEDBACK.style.color = 'var(--correct-color)';
            
            score += 10;
            updateScoreBoard();
            
            setTimeout(showNextQuestion, 1500);

        } else {
            // 不正解
            SOUND_INCORRECT.currentTime = 0;
            SOUND_INCORRECT.play().catch(()=>{});
            
            btn.classList.add('incorrect'); // 赤色にする
            
            // 正解のボタンを緑色にして教えてあげる
            allBtns.forEach(b => {
                if(b.dataset.word === currentWord.word) b.classList.add('correct');
            });

            FEEDBACK.textContent = `ざんねん... こたえは「${currentWord.word}」だよ`;
            FEEDBACK.style.color = 'var(--incorrect-color)';
            
            setTimeout(showNextQuestion, 2500); 
        }
    }

    function updateScoreBoard() {
        if (TURN_MESSAGE) TURN_MESSAGE.textContent = `もん ${questionCount} / ${MAX_QUESTIONS}`;
        if (SCORE_VAL) SCORE_VAL.textContent = score;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ※ loadWords() は削除しました (allWords変数に直接書いたため)
});