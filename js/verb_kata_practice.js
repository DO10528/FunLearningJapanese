const practiceData = [
            { masu: 'つかいます', stem: 'つかい', meaning: 'How to use', example: 'このパソコンの つかい方が わかりません。', context: '機械の 操作が わからない とき。' },
            { masu: 'よみます', stem: 'よみ', meaning: 'How to read/pronounce', example: 'このかんじの よみ方が わかりません。', context: '漢字や 案内を 読む とき。' },
            { masu: 'かきます', stem: 'かき', meaning: 'How to write/draw', example: 'このえの かき方が わかりません。', context: '絵や 文字を 書く とき。' },
            { masu: 'つくります', stem: 'つくり', meaning: 'How to make', example: 'ラーメンの つくり方が わかりません。', context: '料理や 作品を 作る とき。' },
            { masu: 'のります', stem: 'のり', meaning: 'How to ride/board', example: 'バスの のり方が わかりません。', context: '交通手段を 利用 する とき。' },
            { masu: 'あるきます', stem: 'あるき', meaning: 'How to walk/way of walking', example: 'あのひとの あるき方は へんです。', context: '人の 歩き方を 説明 する とき。' },
            { masu: 'なおします', stem: 'なおし', meaning: 'How to fix', example: 'カメラの なおし方が わかりません。', context: '故障した ものを 直す とき。' },
            { masu: 'きります', stem: 'きり', meaning: 'How to cut', example: 'ハサミの きり方が わかりません。', context: '紙や 食べ物を 切る とき。' },
            { masu: 'あけます', stem: 'あけ', meaning: 'How to open', example: 'ビンの あけ方が わかりません。', context: 'ビンの ふたが かたい とき。' },
            { masu: 'しめます', stem: 'しめ', meaning: 'How to close', example: 'ドアの しめ方が わかりません。', context: 'ドアの 閉め方に 問題 がある とき。' },
        ];

        const synth = window.speechSynthesis;
        let voices = [];
        setTimeout(() => { voices = synth.getVoices(); }, 500);

        window.speak = (text) => {
            if (synth.speaking) synth.cancel();
            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'ja-JP'; ut.rate = 0.9;
            const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
            let targetVoice = jpVoices.find(v => v.name.includes('Google') || v.name.includes('Female'));
            if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
            if (targetVoice) ut.voice = targetVoice;
            synth.speak(ut);
        };

        window.speakPhrase = (stem) => {
            const textToSpeak = stem + "かた。"; 
            speak(textToSpeak);
        };
        
        window.speakExample = (exampleSentence) => {
            speak(exampleSentence + "おしえてくださいませんか？");
        };

        function createVerbCard(item) {
            const card = document.createElement('div');
            card.className = 'verb-card';
            
            card.textContent = `
                <div class="verb-forms-container">
                    <div class="masu-box">${item.masu}</div>
                    <i class="fa-solid fa-arrow-right" style="color:#999;"></i>
                    <div class="target-box">
                        <span onclick="speakPhrase('${item.stem}')" style="cursor:pointer; padding-right:5px;">
                            ${item.stem}<span style="font-size:0.7em;">方</span> 
                            <i class="fa-solid fa-volume-high" style="color:var(--primary); font-size: 0.8em;"></i>
                        </span>
                    </div>
                </div>
                
                <div class="example-sentence" onclick="speakExample('${item.example}')" style="cursor:pointer;">
                    ${item.example} <br>
                    <span style="font-weight:700; color:var(--primary);">おしえてくださいませんか？</span>
                    <i class="fa-solid fa-volume-high" style="float:right; color:#777; font-size: 0.8em;"></i>
                </div>

                <p class="simple-meaning">
                    <span class="english-meaning">${item.meaning}</span>
                    <br>${item.context}
                </p>
            `;
            return card;
        }

        function renderLists() {
            const list = document.getElementById('verb-list');
            practiceData.forEach(item => list.appendChild(createVerbCard(item)));
        }

        document.addEventListener('DOMContentLoaded', renderLists);