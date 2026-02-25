// 提供されたJSONデータ
    const rawData = {
      "adjectives": [
        { "kanji": "新しい", "hiragana": "あたらしい", "type": "i", "meaning": "new" },
        { "kanji": "古い", "hiragana": "ふるい", "type": "i", "meaning": "old" },
        { "kanji": "熱い", "hiragana": "あつい", "type": "i", "meaning": "hot (thing)" },
        { "kanji": "寒い", "hiragana": "さむい", "type": "i", "meaning": "cold (weather)" },
        { "kanji": "冷たい", "hiragana": "つめたい", "type": "i", "meaning": "cold (touch)" },
        { "kanji": "易しい", "hiragana": "やさしい", "type": "i", "meaning": "easy" },
        { "kanji": "難しい", "hiragana": "むずかしい", "type": "i", "meaning": "difficult" },
        { "kanji": "高い", "hiragana": "たかい", "type": "i", "meaning": "high, expensive" },
        { "kanji": "安い", "hiragana": "やすい", "type": "i", "meaning": "cheap" },
        { "kanji": "大きい", "hiragana": "おおきい", "type": "i", "meaning": "big" },
        { "kanji": "小さい", "hiragana": "ちいさい", "type": "i", "meaning": "small" },
        { "kanji": "良い", "hiragana": "よい", "type": "i", "meaning": "good" }, // 例外
        { "kanji": "悪い", "hiragana": "わるい", "type": "i", "meaning": "bad" },
        { "kanji": "忙しい", "hiragana": "いそがしい", "type": "i", "meaning": "busy" },
        { "kanji": "楽しい", "hiragana": "たのしい", "type": "i", "meaning": "fun" },
        { "kanji": "美味しい", "hiragana": "おいしい", "type": "i", "meaning": "delicious" },
        { "kanji": "甘い", "hiragana": "あまい", "type": "i", "meaning": "sweet" },
        { "kanji": "辛い", "hiragana": "からい", "type": "i", "meaning": "spicy" },
        { "kanji": "近い", "hiragana": "ちかい", "type": "i", "meaning": "near" },
        { "kanji": "遠い", "hiragana": "とおい", "type": "i", "meaning": "far" },
        { "kanji": "面白い", "hiragana": "おもしろい", "type": "i", "meaning": "interesting" },
        
        { "kanji": "暇", "hiragana": "ひまな", "type": "na", "meaning": "free (time)" },
        { "kanji": "元気", "hiragana": "げんきな", "type": "na", "meaning": "healthy" },
        { "kanji": "静か", "hiragana": "しずかな", "type": "na", "meaning": "quiet" },
        { "kanji": "賑やか", "hiragana": "にぎやかな", "type": "na", "meaning": "lively" },
        { "kanji": "有名", "hiragana": "ゆうめいな", "type": "na", "meaning": "famous" },
        { "kanji": "親切", "hiragana": "しんせつな", "type": "na", "meaning": "kind" },
        { "kanji": "便利", "hiragana": "べんりな", "type": "na", "meaning": "convenient" },
        { "kanji": "好き", "hiragana": "すきな", "type": "na", "meaning": "like" },
        { "kanji": "嫌い", "hiragana": "きらいな", "type": "na", "meaning": "dislike" },
        { "kanji": "簡単", "hiragana": "かんたんな", "type": "na", "meaning": "simple" },
        { "kanji": "きれい", "hiragana": "きれいな", "type": "na", "meaning": "clean/beautiful" }
      ]
    };

    function getExample(item, negForm) {
        if(item.type === 'i') {
            return `この___は ${negForm}。 (This ___ is not ${item.meaning}.)`;
        } else {
            return `かれは ${negForm}。 (He is not ${item.meaning}.)`;
        }
    }

    const container = document.getElementById('card-container');
    const synth = window.speechSynthesis;

    function renderCards(type) {
        container.textContent = '';
        const filtered = rawData.adjectives.filter(a => a.type === type);

        filtered.forEach(item => {
            let negForm = '';
            let basicForm = item.hiragana;
            
            if (item.type === 'i') {
                if (item.hiragana === 'よい') { 
                     basicForm = 'いい (よい)';
                     negForm = 'よくないです';
                } else {
                    negForm = item.hiragana.slice(0, -1) + 'くないです';
                }
            } else {
                let stem = item.hiragana;
                if(stem.endsWith('な')) stem = stem.slice(0, -1);
                negForm = stem + 'ではありません';
                basicForm = stem + ' (な)';
            }

            const card = document.createElement('div');
            card.className = `card ${item.type}-type`;
            
            card.textContent = `
                <div class="card-label">${item.type === 'i' ? 'い-Adj' : 'な-Adj'}</div>
                <button class="audio-btn" onclick="speak('${negForm}')"><i class="fa-solid fa-volume-high"></i></button>
                
                <div class="transform-row">
                    <div class="word-group">
                        <span class="word-main">${basicForm}</span>
                        <span class="word-sub">${item.kanji}</span>
                    </div>
                    <i class="fa-solid fa-arrow-right arrow-icon"></i>
                    <div class="word-group">
                        <span class="word-main neg-text">${negForm}</span>
                        <span class="word-sub">Negative</span>
                    </div>
                </div>

                <div class="example-box">
                    <div class="en-meaning"><i class="fa-solid fa-language"></i> ${item.meaning}</div>
                    <div class="jp-ex">${getExample(item, negForm)}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function filterType(type) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.tab-btn.${type}-adj`).classList.add('active');
        renderCards(type);
    }

    function speak(text) {
        if (synth.speaking) { return; }
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'ja-JP';
        ut.rate = 0.9;
        synth.speak(ut);
    }

    // 初期表示
    renderCards('i');