const level1Data = [
        { pre: "<ruby>朝<rt>あさ</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を", reading: "た", target: "食", post: "べました。", choices: ["食", "飲", "見"] },
        { pre: "<ruby>映画<rt>えいが</rt></ruby>を", reading: "み", target: "見", post: "ます。", choices: ["見", "貝", "目"] },
        { pre: "<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を", reading: "よ", target: "読", post: "みます。", choices: ["読", "語", "話"] },
        { pre: "<ruby>銀行<rt>ぎんこう</rt></ruby>へ", reading: "い", target: "行", post: "きます。", choices: ["行", "休", "来"] },
        { pre: "<ruby>珈琲<rt>コーヒー</rt></ruby>を", reading: "の", target: "飲", post: "みます。", choices: ["飲", "食", "飯"] },
        { pre: "きょうは", reading: "あめ", target: "雨", post: "ですね。", choices: ["雨", "雪", "天"] },
        { pre: "スーパーで", reading: "か", target: "買", post: "いものをします。", choices: ["買", "見", "貝"] },
        { pre: "<ruby>仕事<rt>しごと</rt></ruby>を", reading: "やす", target: "休", post: "みます。", choices: ["休", "体", "本"] },
        { pre: "<ruby>音楽<rt>おんがく</rt></ruby>を", reading: "き", target: "聞", post: "きます。", choices: ["聞", "間", "耳"] },
        { pre: "<ruby>手紙<rt>てがみ</rt></ruby>を", reading: "か", target: "書", post: "きます。", choices: ["書", "読", "古"] },
        { pre: "<ruby>彼<rt>かれ</rt></ruby>は「いいえ」と", reading: "い", target: "言", post: "いました。", choices: ["言", "語", "口"] },
        { pre: "これは100", reading: "えん", target: "円", post: "です。", choices: ["円", "口", "回"] },
        { pre: "あなたの", reading: "な", target: "名", post: "<ruby>前<rt>まえ</rt></ruby>はなんですか。", choices: ["名", "多", "夕"] },
        { pre: "あそこに", reading: "かわ", target: "川", post: "があります。", choices: ["川", "三", "山"] },
        { pre: "<ruby>右<rt>みぎ</rt></ruby>の", reading: "あし", target: "足", post: "が<ruby>痛<rt>いた</rt></ruby>いです。", choices: ["足", "口", "走"] }
    ];

    const level2Groups = [
        [{ role: "A", pre: "<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>は <ruby>何<rt>なん</rt></ruby>", reading: "じ", target: "時", post: "ですか。", choices: ["時", "分", "寺"] },
         { role: "B", pre: "12時です。<ruby>一緒<rt>いっしょ</rt></ruby>に", reading: "た", target: "食", post: "べましょう。", choices: ["食", "飲", "見"] }],
        [{ role: "A", pre: "今日は <ruby>天<rt>てん</rt></ruby>", reading: "き", target: "気", post: "が <ruby>悪<rt>わる</rt></ruby>いですね。", choices: ["気", "汽", "木"] },
         { role: "B", pre: "そうですね。", reading: "あめ", target: "雨", post: "が <ruby>降<rt>ふ</rt></ruby>りますよ。", choices: ["雨", "雪", "雲"] }],
        [{ role: "A", pre: "お", reading: "な", target: "名", post: "<ruby>前<rt>まえ</rt></ruby>は <ruby>何<rt>なん</rt></ruby>ですか。", choices: ["名", "夕", "多"] },
         { role: "B", pre: "<ruby>田中<rt>たなか</rt></ruby>です。大", reading: "がく", target: "学", post: "<ruby>生<rt>せい</rt></ruby>です。", choices: ["学", "字", "安"] }],
        [{ role: "A", pre: "この <ruby>本<rt>ほん</rt></ruby>は 500", reading: "えん", target: "円", post: "です。", choices: ["円", "口", "目"] },
         { role: "B", pre: "<ruby>安<rt>やす</rt></ruby>いですね。それを", reading: "か", target: "買", post: "います。", choices: ["買", "貝", "見"] }],
        [{ role: "A", pre: "すみません。<ruby>東京<rt>とうきょう</rt></ruby>", reading: "えき", target: "駅", post: "は どこですか。", choices: ["駅", "訳", "馬"] },
         { role: "B", pre: "あちらです。この", reading: "みち", target: "道", post: "を まっすぐです。", choices: ["道", "通", "週"] }],
        [{ role: "A", pre: "<ruby>顔色<rt>かおいろ</rt></ruby>が <ruby>悪<rt>わる</rt></ruby>いですね。", reading: "だい", target: "大", post: "<ruby>丈<rt>じょう</rt></ruby><ruby>夫<rt>ぶ</rt></ruby>ですか。", choices: ["大", "太", "犬"] },
         { role: "B", pre: "いいえ。<ruby>今日<rt>きょう</rt></ruby>は", reading: "やす", target: "休", post: "みます。", choices: ["休", "体", "来"] }],
        [{ role: "A", pre: "<ruby>電話<rt>でんわ</rt></ruby>で", reading: "はな", target: "話", post: "しませんか。", choices: ["話", "語", "読"] },
         { role: "B", pre: "いいですね。<ruby>後<rt>あと</rt></ruby>で", reading: "でん", target: "電", post: "<ruby>話<rt>わ</rt></ruby>します。", choices: ["電", "雷", "雪"] }],
        [{ role: "A", pre: "<ruby>来<rt>らい</rt></ruby>", reading: "しゅう", target: "週", post: "、<ruby>暇<rt>ひま</rt></ruby>ですか。", choices: ["週", "周", "道"] },
         { role: "B", pre: "はい。<ruby>一緒<rt>いっしょ</rt></ruby>に", reading: "あ", target: "会", post: "いましょう。", choices: ["会", "合", "今"] }],
        [{ role: "A", pre: "いつも どんな", reading: "おん", target: "音", post: "<ruby>楽<rt>がく</rt></ruby>を <ruby>聞<rt>き</rt></ruby>きますか。", choices: ["音", "白", "日"] },
         { role: "B", pre: "ラジオを よく", reading: "き", target: "聞", post: "きます。", choices: ["聞", "間", "耳"] }],
        [{ role: "A", pre: "<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>に", reading: "くるま", target: "車", post: "で <ruby>出<rt>で</rt></ruby>かけました。", choices: ["車", "東", "庫"] },
         { role: "B", pre: "いいですね。きれいな", reading: "やま", target: "山", post: "を <ruby>見<rt>み</rt></ruby>ましたか。", choices: ["山", "出", "川"] }]
    ];

    const level3Groups = [
        [{ role: "A", pre: "<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>は", reading: "なに", target: "何", post: "を <ruby>食<rt>た</rt></ruby>べますか。", choices: ["何", "伺", "同"] },
         { role: "B", pre: "私は", reading: "さかな", target: "魚", post: "を <ruby>食<rt>た</rt></ruby>べます。", choices: ["魚", "角", "牛"] },
         { role: "C", pre: "私は", reading: "みず", target: "水", post: "と パンを ください。", choices: ["水", "氷", "木"] }],
        [{ role: "A", pre: "<ruby>先週<rt>せんしゅう</rt></ruby>、<ruby>京都<rt>きょうと</rt></ruby>へ", reading: "い", target: "行", post: "きました。", choices: ["行", "休", "来"] },
         { role: "B", pre: "いいですね。そこで", reading: "なに", target: "何", post: "を しましたか。", choices: ["何", "伺", "可"] },
         { role: "C", pre: "<ruby>古<rt>ふる</rt></ruby>い お<ruby>寺<rt>てら</rt></ruby>を", reading: "み", target: "見", post: "ました。", choices: ["見", "貝", "目"] }],
        [{ role: "A", pre: "日本", reading: "ご", target: "語", post: "の 勉<ruby>強<rt>きょう</rt></ruby>は どうですか。", choices: ["語", "話", "読"] },
         { role: "B", pre: "<ruby>難<rt>むずか</rt></ruby>しいです。<ruby>本<rt>ほん</rt></ruby>を たくさん", reading: "よ", target: "読", post: "みます。", choices: ["読", "語", "言"] },
         { role: "C", pre: "私は <ruby>先生<rt>せんせい</rt></ruby>と たくさん", reading: "はな", target: "話", post: "します。", choices: ["話", "語", "計"] }],
        [{ role: "A", pre: "ご<ruby>家族<rt>かぞく</rt></ruby>は", reading: "なん", target: "何", post: "<ruby>人<rt>にん</rt></ruby>ですか。", choices: ["何", "伺", "可"] },
         { role: "B", pre: "4<ruby>人<rt>にん</rt></ruby>です。<ruby>父<rt>ちち</rt></ruby>と", reading: "はは", target: "母", post: "が います。", choices: ["母", "毎", "海"] },
         { role: "C", pre: "私は 5<ruby>人<rt>にん</rt></ruby>です。<ruby>兄<rt>あに</rt></ruby>が", reading: "ふた", target: "二", post: "<ruby>人<rt>り</rt></ruby> います。", choices: ["二", "三", "一"] }],
        [{ role: "A", pre: "<ruby>週末<rt>しゅうまつ</rt></ruby>、", reading: "とも", target: "友", post: "だちと <ruby>会<rt>あ</rt></ruby>いました。", choices: ["友", "父", "有"] },
         { role: "B", pre: "どこへ <ruby>行<rt>い</rt></ruby>きましたか。", reading: "でん", target: "電", post: "<ruby>車<rt>しゃ</rt></ruby>で <ruby>行<rt>い</rt></ruby>きましたか。", choices: ["電", "雷", "雲"] },
         { role: "C", pre: "はい。<ruby>大<rt>おお</rt></ruby>きい", reading: "みぜ", target: "店", post: "へ <ruby>行<rt>い</rt></ruby>きました。", choices: ["店", "庫", "床"] }],
        [{ role: "A", pre: "<ruby>来週<rt>らいしゅう</rt></ruby>は <ruby>私<rt>わたし</rt></ruby>の", reading: "う", target: "生", post: "まれた<ruby>日<rt>ひ</rt></ruby>です。", choices: ["生", "年", "先"] },
         { role: "B", pre: "おめでとう。<ruby>何<rt>なに</rt></ruby>か", reading: "の", target: "飲", post: "みませんか。", choices: ["飲", "食", "飯"] },
         { role: "C", pre: "ありがとう。<ruby>日曜日<rt>にちようび</rt></ruby>の", reading: "ご", target: "午", post: "<ruby>後<rt>ご</rt></ruby>は どうですか。", choices: ["午", "牛", "千"] }]
    ];

    function renderLv1() {
        const container = document.getElementById('lv1-container');
        level1Data.forEach((q, i) => {
            const div = document.createElement('div');
            div.className = 'question-item';
            div.textContent = `
                <div class="sentence">${i+1}. ${q.pre}<span class="blank">（${q.reading}）</span>${q.post}</div>
                <div class="choices">
                    ${q.choices.map(c => `<div class="choice">${c}</div>`).join('')}
                </div>
            `;
            container.appendChild(div);
        });
    }

    function renderConversation(data, containerId) {
        const container = document.getElementById(containerId);
        data.forEach((group, i) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'conversation-group';
            groupDiv.textContent = `<strong>【セット ${i+1}】</strong>`;
            group.forEach(q => {
                const div = document.createElement('div');
                div.className = 'question-item';
                div.textContent = `
                    <div class="sentence"><span class="role-badge">${q.role}</span> ${q.pre}<span class="blank">（${q.reading}）</span>${q.post}</div>
                    <div class="choices">
                        ${q.choices.map(c => `<div class="choice">${c}</div>`).join('')}
                    </div>
                `;
                groupDiv.appendChild(div);
            });
            container.appendChild(groupDiv);
        });
    }

    window.onload = () => {
        renderLv1();
        renderConversation(level2Groups, 'lv2-container');
        renderConversation(level3Groups, 'lv3-container');
    };