const practiceData = [
            // 日常動作
            { masu: 'たべます', te: 'たべて', meaning: 'May I eat?', example: 'これを たべても いいですか。', context: 'おかしを たべたい とき。' },
            { masu: 'のみます', te: 'のんで', meaning: 'May I drink?', example: 'ジュースを のんでも いいですか。', context: 'のどが かわいた とき。' },
            { masu: 'すいます', te: 'すって', meaning: 'May I smoke?', example: 'たばこを すっても いいですか。', context: 'きつえんじょ ですか。' },
            { masu: 'とります', te: 'とって', meaning: 'May I take (photo)?', example: 'しゃしんを とっても いいですか。', context: 'しゃしんを とりたい とき。' },
            { masu: 'かえります', te: 'かえって', meaning: 'May I go home?', example: 'もう かえっても いいですか。', context: 'ようじが おわった とき。' },
            { masu: 'はいります', te: 'はいって', meaning: 'May I enter?', example: 'へやに はいっても いいですか。', context: 'ドアを ノック した とき。' },
            { masu: 'すわります', te: 'すわって', meaning: 'May I sit?', example: 'ここに すわっても いいですか。', context: 'いすが あいている とき。' },
            { masu: 'みます', te: 'みて', meaning: 'May I look?', example: 'これを みても いいですか。', context: 'みせて ほしい とき。' },
            
            // 物の貸し借り・操作
            { masu: 'つかいます', te: 'つかって', meaning: 'May I use?', example: 'ペンを つかっても いいですか。', context: 'ペンを かりたい とき。' },
            { masu: 'かります', te: 'かりて', meaning: 'May I borrow?', example: 'かさを かりても いいですか。', context: 'かさを もっていない とき。' },
            { masu: 'おきます', te: 'おいて', meaning: 'May I put?', example: 'にもつを おいても いいですか。', context: 'にもつが おもい とき。' },
            { masu: 'あけます', te: 'あけて', meaning: 'May I open?', example: 'まどを あけても いいですか。', context: 'あつい とき。' },
            { masu: 'しめます', te: 'しめて', meaning: 'May I close?', example: 'ドアを しめても いいですか。', context: 'さむい とき。' },
            { masu: 'つけます', te: 'つけて', meaning: 'May I turn on?', example: 'テレビを つけても いいですか。', context: 'ニュースを みたい とき。' },
            { masu: 'けします', te: 'けして', meaning: 'May I turn off?', example: 'でんきを けしても いいですか。', context: 'ねたい とき。' },
            { masu: 'もらいます', te: 'もらって', meaning: 'May I have?', example: 'これを もらっても いいですか。', context: 'ほしい ものが ある とき。' },
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

        window.speakPhrase = (teForm) => {
            const textToSpeak = teForm + "もいいですか。"; 
            speak(textToSpeak);
        };
        
        window.speakExample = (exampleSentence) => {
            speak(exampleSentence);
        };

        function createVerbCard(item) {
            const card = document.createElement('div');
            card.className = 'verb-card';
            
            card.innerHTML = `
                <div class="verb-forms-container">
                    <div class="masu-box">${item.masu}</div>
                    <i class="fa-solid fa-arrow-right" style="color:#999;"></i>
                    <div class="temoii-box">
                        <span onclick="speakPhrase('${item.te}')" style="cursor:pointer; padding-right:5px;">
                            ${item.te}<span style="font-size:0.7em;">もいいですか</span> 
                            <i class="fa-solid fa-volume-high" style="color:var(--primary); font-size: 0.8em;"></i>
                        </span>
                    </div>
                </div>
                
                <div class="example-sentence" onclick="speakExample('${item.example}')" style="cursor:pointer;">
                    ${item.example} <i class="fa-solid fa-volume-high" style="float:right; color:#777; font-size: 0.8em;"></i>
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