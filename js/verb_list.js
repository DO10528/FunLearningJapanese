// --- マスター動詞データ (全ての活用形を持つ) ---
const masterVerbs = [
    {
        "grp": 1,
        "en": "Write",
        "icon": "fa-solid fa-pen",
        "kanji": {
            "masu": "書きます",
            "mashita": "書きました",
            "te": "書いて",
            "jisho": "書く",
            "nai": "書かない",
            "ta": "書いた"
        },
        "hiragana": {
            "masu": "かきます",
            "mashita": "かきました",
            "te": "かいて",
            "jisho": "かく",
            "nai": "かかない",
            "ta": "かいた"
        }
    },
    {
        "grp": 1,
        "en": "Listen",
        "icon": "fa-solid fa-headphones",
        "kanji": {
            "masu": "聞きます",
            "mashita": "聞きました",
            "te": "聞いて",
            "jisho": "聞く",
            "nai": "聞かない",
            "ta": "聞いた"
        },
        "hiragana": {
            "masu": "ききます",
            "mashita": "ききました",
            "te": "きいて",
            "jisho": "きく",
            "nai": "きかない",
            "ta": "きいた"
        }
    },
    {
        "grp": 1,
        "en": "Go",
        "icon": "fa-solid fa-person-walking-arrow-right",
        "kanji": {
            "masu": "行きます",
            "mashita": "行きました",
            "te": "行って",
            "jisho": "行く",
            "nai": "行かない",
            "ta": "行った"
        },
        "hiragana": {
            "masu": "いきます",
            "mashita": "いきました",
            "te": "いって",
            "jisho": "いく",
            "nai": "いかない",
            "ta": "いった"
        }
    },
    {
        "grp": 1,
        "en": "Swim",
        "icon": "fa-solid fa-person-swimming",
        "kanji": {
            "masu": "泳ぎます",
            "mashita": "泳ぎました",
            "te": "泳いで",
            "jisho": "泳ぐ",
            "nai": "泳がない",
            "ta": "泳いだ"
        },
        "hiragana": {
            "masu": "およぎます",
            "mashita": "およぎました",
            "te": "およいで",
            "jisho": "およぐ",
            "nai": "およがない",
            "ta": "およいだ"
        }
    },
    {
        "grp": 1,
        "en": "Drink",
        "icon": "fa-solid fa-glass-water",
        "kanji": {
            "masu": "飲みます",
            "mashita": "飲みました",
            "te": "飲んで",
            "jisho": "飲む",
            "nai": "飲まない",
            "ta": "飲んだ"
        },
        "hiragana": {
            "masu": "のみます",
            "mashita": "のみました",
            "te": "のんで",
            "jisho": "のむ",
            "nai": "のまない",
            "ta": "のんだ"
        }
    },
    {
        "grp": 1,
        "en": "Read",
        "icon": "fa-solid fa-book-open",
        "kanji": {
            "masu": "読みます",
            "mashita": "読みました",
            "te": "読んで",
            "jisho": "読む",
            "nai": "読まない",
            "ta": "読んだ"
        },
        "hiragana": {
            "masu": "よみます",
            "mashita": "よみました",
            "te": "よんで",
            "jisho": "よむ",
            "nai": "よまない",
            "ta": "よんだ"
        }
    },
    {
        "grp": 1,
        "en": "Rest",
        "icon": "fa-solid fa-bed",
        "kanji": {
            "masu": "休みます",
            "mashita": "休みました",
            "te": "休んで",
            "jisho": "休む",
            "nai": "休まない",
            "ta": "休んだ"
        },
        "hiragana": {
            "masu": "やすみます",
            "mashita": "やすみました",
            "te": "やすんで",
            "jisho": "やすむ",
            "nai": "やすまない",
            "ta": "やすんだ"
        }
    },
    {
        "grp": 1,
        "en": "Play",
        "icon": "fa-solid fa-gamepad",
        "kanji": {
            "masu": "遊びます",
            "mashita": "遊びました",
            "te": "遊んで",
            "jisho": "遊ぶ",
            "nai": "遊ばない",
            "ta": "遊んだ"
        },
        "hiragana": {
            "masu": "あそびます",
            "mashita": "あそびました",
            "te": "あそんで",
            "jisho": "あそぶ",
            "nai": "あそばない",
            "ta": "あそんだ"
        }
    },
    {
        "grp": 1,
        "en": "Buy",
        "icon": "fa-solid fa-cart-shopping",
        "kanji": {
            "masu": "買います",
            "mashita": "買いました",
            "te": "買って",
            "jisho": "買う",
            "nai": "買わない",
            "ta": "買った"
        },
        "hiragana": {
            "masu": "かいます",
            "mashita": "かいました",
            "te": "かって",
            "jisho": "かう",
            "nai": "かわない",
            "ta": "かった"
        }
    },
    {
        "grp": 1,
        "en": "Meet",
        "icon": "fa-solid fa-handshake",
        "kanji": {
            "masu": "会います",
            "mashita": "会いました",
            "te": "会って",
            "jisho": "会う",
            "nai": "会わない",
            "ta": "会った"
        },
        "hiragana": {
            "masu": "あいます",
            "mashita": "あいました",
            "te": "あって",
            "jisho": "あう",
            "nai": "あわない",
            "ta": "あった"
        }
    },
    {
        "grp": 1,
        "en": "Wait",
        "icon": "fa-solid fa-clock",
        "kanji": {
            "masu": "待ちます",
            "mashita": "待ちました",
            "te": "待って",
            "jisho": "待つ",
            "nai": "待たない",
            "ta": "待った"
        },
        "hiragana": {
            "masu": "まちます",
            "mashita": "まちました",
            "te": "まって",
            "jisho": "まつ",
            "nai": "またない",
            "ta": "まった"
        }
    },
    {
        "grp": 1,
        "en": "Hold",
        "icon": "fa-solid fa-bag-shopping",
        "kanji": {
            "masu": "持ちます",
            "mashita": "持ちました",
            "te": "持って",
            "jisho": "持つ",
            "nai": "持たない",
            "ta": "持った"
        },
        "hiragana": {
            "masu": "もちます",
            "mashita": "もちました",
            "te": "もって",
            "jisho": "もつ",
            "nai": "もたない",
            "ta": "もった"
        }
    },
    {
        "grp": 1,
        "en": "Take (photo)",
        "icon": "fa-solid fa-camera",
        "kanji": {
            "masu": "撮ります",
            "mashita": "撮りました",
            "te": "撮って",
            "jisho": "撮る",
            "nai": "撮らない",
            "ta": "撮った"
        },
        "hiragana": {
            "masu": "とります",
            "mashita": "とりました",
            "te": "とって",
            "jisho": "とる",
            "nai": "とらない",
            "ta": "とった"
        }
    },
    {
        "grp": 1,
        "en": "Return",
        "icon": "fa-solid fa-house",
        "kanji": {
            "masu": "帰ります",
            "mashita": "帰りました",
            "te": "帰って",
            "jisho": "帰る",
            "nai": "帰らない",
            "ta": "帰った"
        },
        "hiragana": {
            "masu": "かえります",
            "mashita": "かえりました",
            "te": "かえって",
            "jisho": "かえる",
            "nai": "かえらない",
            "ta": "かえった"
        }
    },
    {
        "grp": 1,
        "en": "Understand",
        "icon": "fa-regular fa-lightbulb",
        "kanji": {
            "masu": "分かります",
            "mashita": "分かりました",
            "te": "分かって",
            "jisho": "分かる",
            "nai": "分からない",
            "ta": "分かった"
        },
        "hiragana": {
            "masu": "わかります",
            "mashita": "わかりました",
            "te": "わかって",
            "jisho": "わかる",
            "nai": "わからない",
            "ta": "わかった"
        }
    },
    {
        "grp": 1,
        "en": "Talk",
        "icon": "fa-solid fa-comments",
        "kanji": {
            "masu": "話します",
            "mashita": "話しました",
            "te": "話して",
            "jisho": "話す",
            "nai": "話さない",
            "ta": "話した"
        },
        "hiragana": {
            "masu": "はなします",
            "mashita": "はなしました",
            "te": "はなして",
            "jisho": "はなす",
            "nai": "はなさない",
            "ta": "はなした"
        }
    },
    {
        "grp": 1,
        "en": "Sell",
        "icon": "fa-solid fa-hand-holding-dollar",
        "kanji": {
            "masu": "売ります",
            "mashita": "売りました",
            "te": "売って",
            "jisho": "売る",
            "nai": "売らない",
            "ta": "売った"
        },
        "hiragana": {
            "masu": "うります",
            "mashita": "うりました",
            "te": "うって",
            "jisho": "うる",
            "nai": "うらない",
            "ta": "うった"
        }
    },
    {
        "grp": 1,
        "en": "Use",
        "icon": "fa-solid fa-hand-pointer",
        "kanji": {
            "masu": "使います",
            "mashita": "使いました",
            "te": "使って",
            "jisho": "使う",
            "nai": "使わない",
            "ta": "使った"
        },
        "hiragana": {
            "masu": "つかいます",
            "mashita": "つかいました",
            "te": "つかって",
            "jisho": "つかう",
            "nai": "つかわない",
            "ta": "つかった"
        }
    },
    {
        "grp": 1,
        "en": "Learn",
        "icon": "fa-solid fa-book-reader",
        "kanji": {
            "masu": "習います",
            "mashita": "習いました",
            "te": "習って",
            "jisho": "習う",
            "nai": "習わない",
            "ta": "習った"
        },
        "hiragana": {
            "masu": "ならいます",
            "mashita": "ならいました",
            "te": "ならって",
            "jisho": "ならう",
            "nai": "ならわない",
            "ta": "ならった"
        }
    },
    {
        "grp": 1,
        "en": "Stand",
        "icon": "fa-solid fa-person",
        "kanji": {
            "masu": "立ちます",
            "mashita": "立ちました",
            "te": "立って",
            "jisho": "立つ",
            "nai": "立たない",
            "ta": "立った"
        },
        "hiragana": {
            "masu": "たちます",
            "mashita": "たちました",
            "te": "たって",
            "jisho": "たつ",
            "nai": "たたない",
            "ta": "たった"
        }
    },
    {
        "grp": 1,
        "en": "Sit",
        "icon": "fa-solid fa-chair",
        "kanji": {
            "masu": "座ります",
            "mashita": "座りました",
            "te": "座って",
            "jisho": "座る",
            "nai": "座らない",
            "ta": "座った"
        },
        "hiragana": {
            "masu": "すわります",
            "mashita": "すわりました",
            "te": "すわって",
            "jisho": "すわる",
            "nai": "すわらない",
            "ta": "すわった"
        }
    },
    {
        "grp": 1,
        "en": "Hurry",
        "icon": "fa-solid fa-person-running",
        "kanji": {
            "masu": "急ぎます",
            "mashita": "急ぎました",
            "te": "急いで",
            "jisho": "急ぐ",
            "nai": "急がない",
            "ta": "急いだ"
        },
        "hiragana": {
            "masu": "いそぎます",
            "mashita": "いそぎました",
            "te": "いそいで",
            "jisho": "いそぐ",
            "nai": "いそがない",
            "ta": "いそいだ"
        }
    },
    {
        "grp": 1,
        "en": "Work",
        "icon": "fa-solid fa-briefcase",
        "kanji": {
            "masu": "働きます",
            "mashita": "働きました",
            "te": "働いて",
            "jisho": "働く",
            "nai": "働かない",
            "ta": "働いた"
        },
        "hiragana": {
            "masu": "はたらきます",
            "mashita": "はたらきました",
            "te": "はたらいて",
            "jisho": "はたらく",
            "nai": "はたらかない",
            "ta": "はたらいた"
        }
    },
    {
        "grp": 1,
        "en": "Lend",
        "icon": "fa-solid fa-hand-holding-heart",
        "kanji": {
            "masu": "貸します",
            "mashita": "貸しました",
            "te": "貸して",
            "jisho": "貸す",
            "nai": "貸さない",
            "ta": "貸した"
        },
        "hiragana": {
            "masu": "かします",
            "mashita": "かしました",
            "te": "かして",
            "jisho": "かす",
            "nai": "かさない",
            "ta": "かした"
        }
    },
    {
        "grp": 1,
        "en": "Walk",
        "icon": "fa-solid fa-person-walking",
        "kanji": {
            "masu": "歩きます",
            "mashita": "歩きました",
            "te": "歩いて",
            "jisho": "歩く",
            "nai": "歩かない",
            "ta": "歩いた"
        },
        "hiragana": {
            "masu": "あるきます",
            "mashita": "あるきました",
            "te": "あるいて",
            "jisho": "あるく",
            "nai": "あるかない",
            "ta": "あるいた"
        }
    },
    {
        "grp": 1,
        "en": "Ride",
        "icon": "fa-solid fa-train-subway",
        "kanji": {
            "masu": "乗ります",
            "mashita": "乗りました",
            "te": "乗って",
            "jisho": "乗る",
            "nai": "乗らない",
            "ta": "乗った"
        },
        "hiragana": {
            "masu": "のります",
            "mashita": "のりました",
            "te": "のって",
            "jisho": "のる",
            "nai": "のらない",
            "ta": "のった"
        }
    },
    {
        "grp": 1,
        "en": "Make",
        "icon": "fa-solid fa-hammer",
        "kanji": {
            "masu": "作ります",
            "mashita": "作りました",
            "te": "作って",
            "jisho": "作る",
            "nai": "作らない",
            "ta": "作った"
        },
        "hiragana": {
            "masu": "つくります",
            "mashita": "つくりました",
            "te": "つくって",
            "jisho": "つくる",
            "nai": "つくらない",
            "ta": "つくった"
        }
    },
    {
        "grp": 1,
        "en": "Laugh",
        "icon": "fa-solid fa-face-laugh-squint",
        "kanji": {
            "masu": "笑います",
            "mashita": "笑いました",
            "te": "笑って",
            "jisho": "笑う",
            "nai": "笑わない",
            "ta": "笑った"
        },
        "hiragana": {
            "masu": "わらいます",
            "mashita": "わらいました",
            "te": "わらって",
            "jisho": "わらう",
            "nai": "わらわない",
            "ta": "わらった"
        }
    },
    {
        "grp": 1,
        "en": "Send",
        "icon": "fa-solid fa-paper-plane",
        "kanji": {
            "masu": "送ります",
            "mashita": "送りました",
            "te": "送って",
            "jisho": "送る",
            "nai": "送らない",
            "ta": "送った"
        },
        "hiragana": {
            "masu": "おくります",
            "mashita": "おくりました",
            "te": "おくって",
            "jisho": "おくる",
            "nai": "おくらない",
            "ta": "おくった"
        }
    },
    {
        "grp": 1,
        "en": "Help",
        "icon": "fa-solid fa-handshake-angle",
        "kanji": {
            "masu": "手伝います",
            "mashita": "手伝いました",
            "te": "手伝って",
            "jisho": "手伝う",
            "nai": "手伝わない",
            "ta": "手伝った"
        },
        "hiragana": {
            "masu": "てつだいます",
            "mashita": "てつだいました",
            "te": "てつだって",
            "jisho": "てつだう",
            "nai": "てつだわない",
            "ta": "てつだった"
        }
    },
    {
        "grp": 2,
        "en": "Sleep",
        "icon": "fa-solid fa-moon",
        "kanji": {
            "masu": "寝ます",
            "mashita": "寝ました",
            "te": "寝て",
            "jisho": "寝る",
            "nai": "寝ない",
            "ta": "寝た"
        },
        "hiragana": {
            "masu": "ねます",
            "mashita": "ねました",
            "te": "ねて",
            "jisho": "ねる",
            "nai": "ねない",
            "ta": "ねた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Eat",
        "icon": "fa-solid fa-utensils",
        "kanji": {
            "masu": "食べます",
            "mashita": "食べました",
            "te": "食べて",
            "jisho": "食べる",
            "nai": "食べない",
            "ta": "食べた"
        },
        "hiragana": {
            "masu": "たべます",
            "mashita": "たべました",
            "te": "たべて",
            "jisho": "たべる",
            "nai": "たべない",
            "ta": "たべた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Give",
        "icon": "fa-solid fa-gift",
        "kanji": {
            "masu": "あげます",
            "mashita": "あげました",
            "te": "あげて",
            "jisho": "あげる",
            "nai": "あげない",
            "ta": "あげた"
        },
        "hiragana": {
            "masu": "あげます",
            "mashita": "あげました",
            "te": "あげて",
            "jisho": "あげる",
            "nai": "あげない",
            "ta": "あげた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Open",
        "icon": "fa-solid fa-door-open",
        "kanji": {
            "masu": "開けます",
            "mashita": "開けました",
            "te": "開けて",
            "jisho": "開ける",
            "nai": "開けない",
            "ta": "開けた"
        },
        "hiragana": {
            "masu": "あけます",
            "mashita": "あけました",
            "te": "あけて",
            "jisho": "あける",
            "nai": "あけない",
            "ta": "あけた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Show",
        "icon": "fa-solid fa-eye",
        "kanji": {
            "masu": "見せます",
            "mashita": "見せました",
            "te": "見せて",
            "jisho": "見せる",
            "nai": "見せない",
            "ta": "見せた"
        },
        "hiragana": {
            "masu": "みせます",
            "mashita": "みせました",
            "te": "みせて",
            "jisho": "みせる",
            "nai": "みせない",
            "ta": "みせた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Teach",
        "icon": "fa-solid fa-chalkboard-user",
        "kanji": {
            "masu": "教えます",
            "mashita": "教えました",
            "te": "教えて",
            "jisho": "教える",
            "nai": "教えない",
            "ta": "教えた"
        },
        "hiragana": {
            "masu": "おしえます",
            "mashita": "おしえました",
            "te": "おしえて",
            "jisho": "おしえる",
            "nai": "おしえない",
            "ta": "おしえた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Start",
        "icon": "fa-solid fa-play",
        "kanji": {
            "masu": "始めます",
            "mashita": "始めました",
            "te": "始めて",
            "jisho": "始める",
            "nai": "始めない",
            "ta": "始めた"
        },
        "hiragana": {
            "masu": "はじめます",
            "mashita": "はじめました",
            "te": "はじめて",
            "jisho": "はじめる",
            "nai": "はじめない",
            "ta": "はじめた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Close",
        "icon": "fa-solid fa-door-closed",
        "kanji": {
            "masu": "閉めます",
            "mashita": "閉めました",
            "te": "閉めて",
            "jisho": "閉める",
            "nai": "閉めない",
            "ta": "閉めた"
        },
        "hiragana": {
            "masu": "しめます",
            "mashita": "しめました",
            "te": "しめて",
            "jisho": "しめる",
            "nai": "しめない",
            "ta": "しめた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Turn on",
        "icon": "fa-solid fa-power-off",
        "kanji": {
            "masu": "つけます",
            "mashita": "つけました",
            "te": "つけて",
            "jisho": "つける",
            "nai": "つけない",
            "ta": "つけた"
        },
        "hiragana": {
            "masu": "つけます",
            "mashita": "つけました",
            "te": "つけて",
            "jisho": "つける",
            "nai": "つけない",
            "ta": "つけた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Forget",
        "icon": "fa-solid fa-circle-question",
        "kanji": {
            "masu": "忘れます",
            "mashita": "忘れました",
            "te": "忘れて",
            "jisho": "忘れる",
            "nai": "忘れない",
            "ta": "忘れた"
        },
        "hiragana": {
            "masu": "わすれます",
            "mashita": "わすれました",
            "te": "わすれて",
            "jisho": "わすれる",
            "nai": "わすれない",
            "ta": "わすれた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Exit/Leave",
        "icon": "fa-solid fa-arrow-right-from-bracket",
        "kanji": {
            "masu": "出ます",
            "mashita": "出ました",
            "te": "出て",
            "jisho": "出る",
            "nai": "出ない",
            "ta": "出た"
        },
        "hiragana": {
            "masu": "でます",
            "mashita": "でました",
            "te": "でて",
            "jisho": "でる",
            "nai": "でない",
            "ta": "でた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Remember",
        "icon": "fa-solid fa-brain",
        "kanji": {
            "masu": "覚えます",
            "mashita": "覚えました",
            "te": "覚えて",
            "jisho": "覚える",
            "nai": "覚えない",
            "ta": "覚えた"
        },
        "hiragana": {
            "masu": "おぼえます",
            "mashita": "おぼえました",
            "te": "おぼえて",
            "jisho": "おぼえる",
            "nai": "おぼえない",
            "ta": "おぼえた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Stop",
        "icon": "fa-solid fa-hand",
        "kanji": {
            "masu": "止めます",
            "mashita": "止めました",
            "te": "止めて",
            "jisho": "止める",
            "nai": "止めない",
            "ta": "止めた"
        },
        "hiragana": {
            "masu": "とめます",
            "mashita": "とめました",
            "te": "とめて",
            "jisho": "とめる",
            "nai": "とめない",
            "ta": "とめた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Throw away",
        "icon": "fa-solid fa-trash",
        "kanji": {
            "masu": "捨てます",
            "mashita": "捨てました",
            "te": "捨てて",
            "jisho": "捨てる",
            "nai": "捨てない",
            "ta": "捨てた"
        },
        "hiragana": {
            "masu": "すてます",
            "mashita": "すてました",
            "te": "すてて",
            "jisho": "すてる",
            "nai": "すてない",
            "ta": "すてた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Think",
        "icon": "fa-solid fa-cloud",
        "kanji": {
            "masu": "考えます",
            "mashita": "考えました",
            "te": "考えて",
            "jisho": "考える",
            "nai": "考えない",
            "ta": "考えた"
        },
        "hiragana": {
            "masu": "かんがえます",
            "mashita": "かんがえました",
            "te": "かんがえて",
            "jisho": "かんがえる",
            "nai": "かんがえない",
            "ta": "かんがえた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Decide",
        "icon": "fa-solid fa-check-double",
        "kanji": {
            "masu": "決めます",
            "mashita": "決めました",
            "te": "決めて",
            "jisho": "決める",
            "nai": "決めない",
            "ta": "決めた"
        },
        "hiragana": {
            "masu": "きめます",
            "mashita": "きめました",
            "te": "きめて",
            "jisho": "きめる",
            "nai": "きめない",
            "ta": "きめた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Change",
        "icon": "fa-solid fa-shuffle",
        "kanji": {
            "masu": "変えます",
            "mashita": "変えました",
            "te": "変えて",
            "jisho": "変える",
            "nai": "変えない",
            "ta": "変えた"
        },
        "hiragana": {
            "masu": "かえます",
            "mashita": "かえました",
            "te": "かえて",
            "jisho": "かえる",
            "nai": "かえない",
            "ta": "かえた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Investigate",
        "icon": "fa-solid fa-magnifying-glass",
        "kanji": {
            "masu": "調べます",
            "mashita": "調べました",
            "te": "調べて",
            "jisho": "調べる",
            "nai": "調べない",
            "ta": "調べた"
        },
        "hiragana": {
            "masu": "しらべます",
            "mashita": "しらべました",
            "te": "しらべて",
            "jisho": "しらべる",
            "nai": "しらべない",
            "ta": "しらべた"
        },
        "sub": "e"
    },
    {
        "grp": 2,
        "en": "Watch/See",
        "icon": "fa-solid fa-tv",
        "kanji": {
            "masu": "見ます",
            "mashita": "見ました",
            "te": "見て",
            "jisho": "見る",
            "nai": "見ない",
            "ta": "見た"
        },
        "hiragana": {
            "masu": "みます",
            "mashita": "みました",
            "te": "みて",
            "jisho": "みる",
            "nai": "みない",
            "ta": "みた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Exist (Living)",
        "icon": "fa-solid fa-person",
        "kanji": {
            "masu": "居ます",
            "mashita": "居ました",
            "te": "居て",
            "jisho": "居る",
            "nai": "居ない",
            "ta": "居た"
        },
        "hiragana": {
            "masu": "います",
            "mashita": "いました",
            "te": "いて",
            "jisho": "いる",
            "nai": "いない",
            "ta": "いた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Wake up",
        "icon": "fa-solid fa-sun",
        "kanji": {
            "masu": "起きます",
            "mashita": "起きました",
            "te": "起きて",
            "jisho": "起きる",
            "nai": "起きない",
            "ta": "起きた"
        },
        "hiragana": {
            "masu": "おきます",
            "mashita": "おきました",
            "te": "おきて",
            "jisho": "おきる",
            "nai": "おきない",
            "ta": "おきた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Borrow",
        "icon": "fa-solid fa-hand-holding",
        "kanji": {
            "masu": "借ります",
            "mashita": "借りました",
            "te": "借りて",
            "jisho": "借りる",
            "nai": "借りない",
            "ta": "借りた"
        },
        "hiragana": {
            "masu": "かります",
            "mashita": "かりました",
            "te": "かりて",
            "jisho": "かりる",
            "nai": "かりない",
            "ta": "かりた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Shower",
        "icon": "fa-solid fa-shower",
        "kanji": {
            "masu": "浴びます",
            "mashita": "浴びました",
            "te": "浴びて",
            "jisho": "浴びる",
            "nai": "浴びない",
            "ta": "浴びた"
        },
        "hiragana": {
            "masu": "あびます",
            "mashita": "あびました",
            "te": "あびて",
            "jisho": "あびる",
            "nai": "あびない",
            "ta": "あびた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Can do",
        "icon": "fa-solid fa-thumbs-up",
        "kanji": {
            "masu": "出来ます",
            "mashita": "出来ました",
            "te": "出来て",
            "jisho": "出来る",
            "nai": "出来ない",
            "ta": "出来た"
        },
        "hiragana": {
            "masu": "できます",
            "mashita": "できました",
            "te": "できて",
            "jisho": "できる",
            "nai": "できない",
            "ta": "できた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Get off",
        "icon": "fa-solid fa-person-walking-luggage",
        "kanji": {
            "masu": "降ります",
            "mashita": "降りました",
            "te": "降りて",
            "jisho": "降りる",
            "nai": "降りない",
            "ta": "降りた"
        },
        "hiragana": {
            "masu": "おります",
            "mashita": "おりました",
            "te": "おりて",
            "jisho": "おりる",
            "nai": "おりない",
            "ta": "おりた"
        },
        "sub": "i"
    },
    {
        "grp": 2,
        "en": "Wear",
        "icon": "fa-solid fa-shirt",
        "kanji": {
            "masu": "着ます",
            "mashita": "着ました",
            "te": "着て",
            "jisho": "着る",
            "nai": "着ない",
            "ta": "着た"
        },
        "hiragana": {
            "masu": "きます",
            "mashita": "きました",
            "te": "きて",
            "jisho": "きる",
            "nai": "きない",
            "ta": "きた"
        },
        "sub": "i"
    },
    {
        "grp": 3,
        "en": "Do",
        "icon": "fa-solid fa-check",
        "kanji": {
            "masu": "します",
            "mashita": "しました",
            "te": "して",
            "jisho": "する",
            "nai": "しない",
            "ta": "した"
        },
        "hiragana": {
            "masu": "します",
            "mashita": "しました",
            "te": "して",
            "jisho": "する",
            "nai": "しない",
            "ta": "した"
        }
    },
    {
        "grp": 3,
        "en": "Come",
        "icon": "fa-solid fa-person-walking-arrow-right",
        "kanji": {
            "masu": "来ます",
            "mashita": "来ました",
            "te": "来て",
            "jisho": "来る",
            "nai": "来ない",
            "ta": "来た"
        },
        "hiragana": {
            "masu": "きます",
            "mashita": "きました",
            "te": "きて",
            "jisho": "くる",
            "nai": "こない",
            "ta": "きた"
        }
    },
    {
        "grp": 3,
        "en": "Study",
        "icon": "fa-solid fa-graduation-cap",
        "kanji": {
            "masu": "勉強\nします",
            "mashita": "勉強\nしま\nした",
            "te": "勉強\nして",
            "jisho": "勉強\nする",
            "nai": "勉強\nしない",
            "ta": "勉強\nした"
        },
        "hiragana": {
            "masu": "べんきょう\nします",
            "mashita": "べんきょう\nしま\nした",
            "te": "べんきょう\nして",
            "jisho": "べんきょう\nする",
            "nai": "べんきょう\nしない",
            "ta": "べんきょう\nした"
        }
    },
    {
        "grp": 3,
        "en": "Shop",
        "icon": "fa-solid fa-basket-shopping",
        "kanji": {
            "masu": "買い物\nします",
            "mashita": "買い物\nしま\nした",
            "te": "買い物\nして",
            "jisho": "買い物\nする",
            "nai": "買い物\nしない",
            "ta": "買い物\nした"
        },
        "hiragana": {
            "masu": "かいもの\nします",
            "mashita": "かいもの\nしま\nした",
            "te": "かいもの\nして",
            "jisho": "かいもの\nする",
            "nai": "かいもの\nしない",
            "ta": "かいもの\nした"
        }
    },
    {
        "grp": 3,
        "en": "Walk",
        "icon": "fa-solid fa-tree",
        "kanji": {
            "masu": "散歩\nします",
            "mashita": "散歩\nしま\nした",
            "te": "散歩\nして",
            "jisho": "散歩\nする",
            "nai": "散歩\nしない",
            "ta": "散歩\nした"
        },
        "hiragana": {
            "masu": "さんぽ\nします",
            "mashita": "さんぽ\nしま\nした",
            "te": "さんぽ\nして",
            "jisho": "さんぽ\nする",
            "nai": "さんぽ\nしない",
            "ta": "さんぽ\nした"
        }
    },
    {
        "grp": 3,
        "en": "Copy",
        "icon": "fa-solid fa-copy",
        "kanji": {
            "masu": "コピー\nします",
            "mashita": "コピー\nしま\nした",
            "te": "コピー\nして",
            "jisho": "コピー\nする",
            "nai": "コピー\nしない",
            "ta": "コピー\nした"
        },
        "hiragana": {
            "masu": "コピー\nします",
            "mashita": "コピー\nしま\nした",
            "te": "コピー\nして",
            "jisho": "コピー\nする",
            "nai": "コピー\nしない",
            "ta": "コピー\nした"
        }
    },
    {
        "grp": 3,
        "en": "Marry",
        "icon": "fa-solid fa-ring",
        "kanji": {
            "masu": "結婚\nします",
            "mashita": "結婚\nしま\nした",
            "te": "結婚\nして",
            "jisho": "結婚\nする",
            "nai": "結婚\nしない",
            "ta": "結婚\nした"
        },
        "hiragana": {
            "masu": "けっこん\nします",
            "mashita": "けっこん\nしま\nした",
            "te": "けっこん\nして",
            "jisho": "けっこん\nする",
            "nai": "けっこん\nしない",
            "ta": "けっこん\nした"
        }
    },
    {
        "grp": 3,
        "en": "Clean",
        "icon": "fa-solid fa-broom",
        "kanji": {
            "masu": "掃除\nします",
            "mashita": "掃除\nしま\nした",
            "te": "掃除\nして",
            "jisho": "掃除\nする",
            "nai": "掃除\nしない",
            "ta": "掃除\nした"
        },
        "hiragana": {
            "masu": "そうじ\nします",
            "mashita": "そうじ\nしま\nした",
            "te": "そうじ\nして",
            "jisho": "そうじ\nする",
            "nai": "そうじ\nしない",
            "ta": "そうじ\nした"
        }
    },
    {
        "grp": 3,
        "en": "Laundry",
        "icon": "fa-solid fa-shirt",
        "kanji": {
            "masu": "洗濯\nします",
            "mashita": "洗濯\nしま\nした",
            "te": "洗濯\nして",
            "jisho": "洗濯\nする",
            "nai": "洗濯\nしない",
            "ta": "洗濯\nした"
        },
        "hiragana": {
            "masu": "せんたく\nします",
            "mashita": "せんたく\nしま\nした",
            "te": "せんたく\nして",
            "jisho": "せんたく\nする",
            "nai": "せんたく\nしない",
            "ta": "せんたく\nした"
        }
    },
    {
        "grp": 3,
        "en": "Cook",
        "icon": "fa-solid fa-kitchen-set",
        "kanji": {
            "masu": "料理\nします",
            "mashita": "料理\nしま\nした",
            "te": "料理\nして",
            "jisho": "料理\nする",
            "nai": "料理\nしない",
            "ta": "料理\nした"
        },
        "hiragana": {
            "masu": "りょうり\nします",
            "mashita": "りょうり\nしま\nした",
            "te": "りょうり\nして",
            "jisho": "りょうり\nする",
            "nai": "りょうり\nしない",
            "ta": "りょうり\nした"
        }
    },
    {
        "grp": 3,
        "en": "Drive",
        "icon": "fa-solid fa-car",
        "kanji": {
            "masu": "運転\nします",
            "mashita": "運転\nしま\nした",
            "te": "運転\nして",
            "jisho": "運転\nする",
            "nai": "運転\nしない",
            "ta": "運転\nした"
        },
        "hiragana": {
            "masu": "うんてん\nします",
            "mashita": "うんてん\nしま\nした",
            "te": "うんてん\nして",
            "jisho": "うんてん\nする",
            "nai": "うんてん\nしない",
            "ta": "うんてん\nした"
        }
    },
    {
        "grp": 3,
        "en": "Call",
        "icon": "fa-solid fa-phone",
        "kanji": {
            "masu": "電話\nします",
            "mashita": "電話\nしま\nした",
            "te": "電話\nして",
            "jisho": "電話\nする",
            "nai": "電話\nしない",
            "ta": "電話\nした"
        },
        "hiragana": {
            "masu": "でんわ\nします",
            "mashita": "でんわ\nしま\nした",
            "te": "でんわ\nして",
            "jisho": "でんわ\nする",
            "nai": "でんわ\nしない",
            "ta": "でんわ\nした"
        }
    },
    {
        "grp": 3,
        "en": "Worry",
        "icon": "fa-solid fa-face-frown",
        "kanji": {
            "masu": "心配\nします",
            "mashita": "心配\nしま\nした",
            "te": "心配\nして",
            "jisho": "心配\nする",
            "nai": "心配\nしない",
            "ta": "心配\nした"
        },
        "hiragana": {
            "masu": "しんぱい\nします",
            "mashita": "しんぱい\nしま\nした",
            "te": "しんぱい\nして",
            "jisho": "しんぱい\nする",
            "nai": "しんぱい\nしない",
            "ta": "しんぱい\nした"
        }
    },
    {
        "grp": 3,
        "en": "Overtime",
        "icon": "fa-solid fa-business-time",
        "kanji": {
            "masu": "残業\nします",
            "mashita": "残業\nしま\nした",
            "te": "残業\nして",
            "jisho": "残業\nする",
            "nai": "残業\nしない",
            "ta": "残業\nした"
        },
        "hiragana": {
            "masu": "ざんぎょう\nします",
            "mashita": "ざんぎょう\nしま\nした",
            "te": "ざんぎょう\nして",
            "jisho": "ざんぎょう\nする",
            "nai": "ざんぎょう\nしない",
            "ta": "ざんぎょう\nした"
        }
    },
    {
        "grp": 3,
        "en": "Meal",
        "icon": "fa-solid fa-bowl-rice",
        "kanji": {
            "masu": "食事\nします",
            "mashita": "食事\nしま\nした",
            "te": "食事\nして",
            "jisho": "食事\nする",
            "nai": "食事\nしない",
            "ta": "食事\nした"
        },
        "hiragana": {
            "masu": "しょくじ\nします",
            "mashita": "しょくじ\nしま\nした",
            "te": "しょくじ\nして",
            "jisho": "しょくじ\nする",
            "nai": "しょくじ\nしない",
            "ta": "しょくじ\nした"
        }
    },
    {
        "grp": 3,
        "en": "Bring",
        "icon": "fa-solid fa-box-open",
        "kanji": {
            "masu": "持って\n来ます",
            "mashita": "持って\n来ま\nした",
            "te": "持って\n来て",
            "jisho": "持って\n\n来る",
            "nai": "持って\n来ない",
            "ta": "持って\n来た"
        },
        "hiragana": {
            "masu": "もって\nきます",
            "mashita": "もって\nきま\nした",
            "te": "もって\nきて",
            "jisho": "もって\nくる",
            "nai": "もって\nこない",
            "ta": "もって\nきた"
        }
    },
    {
        "grp": 3,
        "en": "Bring (person)",
        "icon": "fa-solid fa-people-arrows",
        "kanji": {
            "masu": "連れて\n来ます",
            "mashita": "連れて\n来ま\nした",
            "te": "連れて\n来て",
            "jisho": "連れて\n\n来る",
            "nai": "連れて\n来ない",
            "ta": "連れて\n来た"
        },
        "hiragana": {
            "masu": "つれて\nきます",
            "mashita": "つれて\nきま\nした",
            "te": "つれて\nきて",
            "jisho": "つれて\nくる",
            "nai": "つれて\nこない",
            "ta": "つれて\nきた"
        }
    },
    {
        "grp": 3,
        "en": "Reserve",
        "icon": "fa-solid fa-calendar-check",
        "kanji": {
            "masu": "予約\nします",
            "mashita": "予約\nしま\nした",
            "te": "予約\nして",
            "jisho": "予約\nする",
            "nai": "予約\nしない",
            "ta": "予約\nした"
        },
        "hiragana": {
            "masu": "よやく\nします",
            "mashita": "よやく\nしま\nした",
            "te": "よやく\nして",
            "jisho": "よやく\nする",
            "nai": "よやく\nしない",
            "ta": "よやく\nした"
        }
    },
    {
        "grp": 3,
        "en": "Exercise",
        "icon": "fa-solid fa-dumbbell",
        "kanji": {
            "masu": "運動\nします",
            "mashita": "運動\nしま\nした",
            "te": "運動\nして",
            "jisho": "運動\nする",
            "nai": "運動\nしない",
            "ta": "運動\nした"
        },
        "hiragana": {
            "masu": "うんどう\nします",
            "mashita": "うんどう\nしま\nした",
            "te": "うんどう\nして",
            "jisho": "うんどう\nする",
            "nai": "うんどう\nしない",
            "ta": "うんどう\nした"
        }
    },
    {
        "grp": 3,
        "en": "Guide",
        "icon": "fa-solid fa-map",
        "kanji": {
            "masu": "案内\nします",
            "mashita": "案内\nしま\nした",
            "te": "案内\nして",
            "jisho": "案内\nする",
            "nai": "案内\nしない",
            "ta": "案内\nした"
        },
        "hiragana": {
            "masu": "あんない\nします",
            "mashita": "あんない\nしま\nした",
            "te": "あんない\nして",
            "jisho": "あんない\nする",
            "nai": "あんない\nしない",
            "ta": "あんない\nした"
        }
    },
    {
        "grp": 3,
        "en": "Introduce",
        "icon": "fa-solid fa-users",
        "kanji": {
            "masu": "紹介\nします",
            "mashita": "紹介\nしま\nした",
            "te": "紹介\nして",
            "jisho": "紹介\nする",
            "nai": "紹介\nしない",
            "ta": "紹介\nした"
        },
        "hiragana": {
            "masu": "しょうかい\nします",
            "mashita": "しょうかい\nしま\nした",
            "te": "しょうかい\nして",
            "jisho": "しょうかい\nする",
            "nai": "しょうかい\nしない",
            "ta": "しょうかい\nした"
        }
    },
    {
        "grp": 3,
        "en": "Prepare",
        "icon": "fa-solid fa-box",
        "kanji": {
            "masu": "準備\nします",
            "mashita": "準備\nしま\nした",
            "te": "準備\nして",
            "jisho": "準備\nする",
            "nai": "準備\nしない",
            "ta": "準備\nした"
        },
        "hiragana": {
            "masu": "じゅんび\nします",
            "mashita": "じゅんび\nしま\nした",
            "te": "じゅんび\nして",
            "jisho": "じゅんび\nする",
            "nai": "じゅんび\nしない",
            "ta": "じゅんび\nした"
        }
    }
];

// 全ての動詞にIDと学習状態を付与
masterVerbs.forEach((v, idx) => {
    v.id = idx;
    v.learned = false;
});

let currentForm = 'masu';
window.currentDisplayMode = 'hiragana'; // デフォルトはひらがな
const synth = window.speechSynthesis;


function speak(text) {
    if (synth.speaking) synth.cancel();
    // 読み上げには常に「ひらがな」データを使用するため、テキスト自体はここではそのまま受け取るか、IDで引いてひらがなを取得するか。
    // 引数textには既に正しいひらがなが渡される前提に変更。
    const utterThis = new SpeechSynthesisUtterance(text.replace(/\n/g, ''));
    utterThis.lang = 'ja-JP';
    utterThis.rate = 0.9;
    const voices = synth.getVoices();
    const jpVoice = voices.find(v => v.lang === 'ja-JP');
    if(jpVoice) utterThis.voice = jpVoice;
    synth.speak(utterThis);
}

// --- 表示ロジック ---
window.setForm = (form) => {
    currentForm = form;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-btn');
    if(form === 'masu') buttons[0].classList.add('active');
    else if(form === 'mashita') buttons[1].classList.add('active');
    else if(form === 'te') buttons[2].classList.add('active');
    else if(form === 'jisho') buttons[3].classList.add('active');
    else if(form === 'nai') buttons[4].classList.add('active');
    else if(form === 'ta') buttons[5].classList.add('active');

    const wrapper = document.getElementById('list-container');
    if (wrapper) {
        wrapper.classList.remove('groups-wrapper');
        void wrapper.offsetWidth; 
        wrapper.classList.add('groups-wrapper');
    }

    renderAllGroups();
};

window.toggleDisplayMode = () => {
    // 1. 防弾仕様: 要素が存在するか確認
    const listContainer = document.getElementById('list-container');
    const btn = document.getElementById('display-mode-btn');
    
    if (!listContainer || !btn) {
        console.warn('Antigravity Protocol: display elements not found.');
        return;
    }

    // 2. モードの切り替え
    window.currentDisplayMode = window.currentDisplayMode === 'hiragana' ? 'kanji' : 'hiragana';
    
    // 3. UI（ボタン）の更新
    if (window.currentDisplayMode === 'kanji') {
        btn.innerHTML = '<i class="fa-solid fa-language"></i> ひらがなに切替';
        btn.style.backgroundColor = 'var(--primary)';
        btn.style.color = 'white';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-language"></i> 漢字に切替';
        btn.style.backgroundColor = 'var(--accent)';
        btn.style.color = 'black';
    }

    // 4. リストの再描画（innerHTMLのみ書き換え）
    renderAllGroups();
};

function renderAllGroups() {
    const grp1 = masterVerbs.filter(v => v.grp === 1);
    const grp2e = masterVerbs.filter(v => v.grp === 2 && v.sub === 'e');
    const grp2i = masterVerbs.filter(v => v.grp === 2 && v.sub === 'i');
    const grp3 = masterVerbs.filter(v => v.grp === 3);

    renderList('list-grp1', grp1);
    renderList('list-grp2-e', grp2e);
    renderList('list-grp2-i', grp2i);
    renderList('list-grp3', grp3);
}

function renderList(containerId, data) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.textContent = '';
    
    data.forEach((item) => {
        const card = document.createElement('div');
        card.className = `verb-card ${item.learned ? 'learned' : ''}`;
        
        // 表示用のテキスト（改行を除去して1行にする）
        const displayText = item[window.currentDisplayMode][currentForm].replace(/\n/g, '');
        // 発音用のテキスト（常にひらがな）
        const speechText = item.hiragana[currentForm].replace(/\n/g, '');

        // 動的なフォントサイズ調整（文字数が多い場合は小さくする）
        let dynamicFontSize = '1.15em';
        if (displayText.length >= 7) {
            dynamicFontSize = '0.85em';
        } else if (displayText.length >= 5) {
            dynamicFontSize = '0.95em';
        }

        card.innerHTML = `
            <div class="verb-info">
                <div class="verb-icon"><i class="${item.icon}"></i></div>
                <div class="verb-text-box">
                    <div class="verb-jp" style="font-size: ${dynamicFontSize};">${displayText}</div>
                    <div class="verb-en">${item.en}</div>
                </div>
            </div>
            <div class="check-btn" data-id="${item.id}">
                <i class="fa-solid fa-check"></i>
            </div>
        `;

        card.onclick = (e) => {
            if (e.target.closest('.check-btn')) {
                e.stopPropagation();
                toggleLearned(item.id);
                return;
            }
            // 常にひらがなを読み上げる
            speak(speechText);
        };
        container.appendChild(card);
    });
}

function toggleLearned(id) {
    const target = masterVerbs.find(v => v.id === id);
    if(target) {
        target.learned = !target.learned;
        renderAllGroups(); 
    }
}

// --- ロジック・ヘルパー ---
const logicRules = {
    'masu': {
        title: 'ます形 (Masu form)',
        g1: { desc: 'う段 (u-row) → い段 (i-row) + ます', stem: 'か', drop: 'く', add: 'きます' },
        g2: { desc: '「る」をとる + ます (Drop "ru" + masu)', stem: 'たべ', drop: 'る', add: 'ます' },
        g3: [
            { stem: 'する', result: 'します' },
            { stem: 'くる', result: 'きます' }
        ]
    },
    'mashita': {
        title: 'ました (Mashita form)',
        g1: { desc: 'う段 (u-row) → い段 (i-row) + ました', stem: 'か', drop: 'く', add: 'きました' },
        g2: { desc: '「る」をとる + ました (Drop "ru" + mashita)', stem: 'たべ', drop: 'る', add: 'ました' },
        g3: [
            { stem: 'する', result: 'しました' },
            { stem: 'くる', result: 'きました' }
        ]
    },
    'te': {
        title: 'て形 (Te form)',
        g1: { desc: 'う/つ/る → って<br>む/ぶ/ぬ → んで<br>く → いて / ぐ → いで<br>す → して', stem: 'の', drop: 'む', add: 'んで' },
        g2: { desc: '「る」をとる + て (Drop "ru" + te)', stem: 'たべ', drop: 'る', add: 'て' },
        g3: [
            { stem: 'する', result: 'して' },
            { stem: 'くる', result: 'きて' }
        ]
    },
    'jisho': {
        title: '辞書形 (Dictionary form)',
        g1: { desc: 'そのまま (Base form)', stem: 'か', drop: '', add: 'く' },
        g2: { desc: 'そのまま (Base form)', stem: 'たべ', drop: '', add: 'る' },
        g3: [
            { stem: 'する', result: 'する' },
            { stem: 'くる', result: 'くる' }
        ]
    },
    'nai': {
        title: 'ない形 (Nai form)',
        g1: { desc: 'う段 (u-row) → あ段 (a-row) + ない<br><span style="color:#ff4081;font-size:0.8em">※「う」→「わ」になります</span>', stem: 'か', drop: 'く', add: 'かない' },
        g2: { desc: '「る」をとる + ない (Drop "ru" + nai)', stem: 'たべ', drop: 'る', add: 'ない' },
        g3: [
            { stem: 'する', result: 'しない' },
            { stem: 'くる', result: 'こない' }
        ]
    },
    'ta': {
        title: 'た形 (Ta form)',
        g1: { desc: 'て形と同じルールで「て」が「た/だ」になる', stem: 'の', drop: 'む', add: 'んだ' },
        g2: { desc: '「る」をとる + た (Drop "ru" + ta)', stem: 'たべ', drop: 'る', add: 'た' },
        g3: [
            { stem: 'する', result: 'した' },
            { stem: 'くる', result: 'きた' }
        ]
    }
};

window.openLogicHelper = (form, event) => {
    // タブ切り替えのクリックをキャンセルせず、モーダルを開く
    if(event) event.stopPropagation();

    const modal = document.getElementById('logic-modal');
    const body = document.getElementById('logic-modal-body');
    const title = document.getElementById('logic-modal-title');
    
    // 防弾仕様: 要素が存在しない場合はエラーを回避
    if (!modal || !body || !title) {
        console.warn('Antigravity Protocol: logic modal elements missing.');
        return;
    }

    const rules = logicRules[form];
    if (!rules) return;

    title.innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${rules.title}`;
    
    const buildAnimHTML = (rule) => {
        if (!rule.drop && !rule.add) {
            return `<div class="anim-container"><span class="stem">${rule.stem}</span></div>`;
        }
        return `
            <div class="anim-container">
                <span class="stem">${rule.stem}</span>
                <span class="suffix-container">
                    <span class="drop-suffix">${rule.drop}</span>
                    <span class="add-suffix">${rule.add}</span>
                </span>
            </div>
        `;
    };

    const g3HTML = rules.g3.map(item => `
        <div class="g3-row">
            <span class="stem">${item.stem}</span>
            <i class="fa-solid fa-arrow-right arrow"></i>
            <span class="g3-result">${item.result}</span>
        </div>
    `).join('');

    body.innerHTML = `
        <div class="rule-box g1">
            <div class="rule-title g1">Group I</div>
            <div class="rule-desc">${rules.g1.desc}</div>
            ${buildAnimHTML(rules.g1)}
        </div>
        <div class="rule-box g2">
            <div class="rule-title g2">Group II</div>
            <div class="rule-desc">${rules.g2.desc}</div>
            ${buildAnimHTML(rules.g2)}
        </div>
        <div class="rule-box g3">
            <div class="rule-title g3">Group III</div>
            <div class="rule-desc">不規則 (Irregular)</div>
            <div class="anim-container g3-grid">
                ${g3HTML}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
};

window.closeLogicHelper = () => {
    const modal = document.getElementById('logic-modal');
    if (modal) modal.style.display = 'none';
};

window.onload = () => {
    // ボタンの初期状態と同期
    const btn = document.getElementById('display-mode-btn');
    if(btn) {
        if (window.currentDisplayMode === 'kanji') {
            btn.innerHTML = '<i class="fa-solid fa-language"></i> ひらがなに切替';
            btn.style.backgroundColor = 'var(--primary)';
            btn.style.color = 'white';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-language"></i> 漢字に切替';
            btn.style.backgroundColor = 'var(--accent)';
            btn.style.color = 'black';
        }
    }
    setForm('masu'); 
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {};
    }
};
