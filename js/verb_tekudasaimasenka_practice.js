const practiceData = [
            { masu: 'かします', te: 'かして', meaning: 'Could you lend me?', example: 'ペンを かして くださいませんか。', context: 'ペンを わすれました。' },
            { masu: 'おしえます', te: 'おしえて', meaning: 'Could you tell/teach me?', example: 'みちを おしえて くださいませんか。', context: 'みちに まよいました。' },
            { masu: 'てつだいます', te: 'てつだって', meaning: 'Could you help me?', example: 'しごとを てつだって くださいませんか。', context: 'しごとが おわりません。' },
            { masu: 'とります', te: 'とって', meaning: 'Could you take (it)?', example: 'しおを とって くださいませんか。', context: 'とどきません。' },
            { masu: 'かきます', te: 'かいて', meaning: 'Could you write?', example: 'ちずを かいて くださいませんか。', context: 'ばしょが わかりません。' },
            { masu: 'みせます', te: 'みせて', meaning: 'Could you show me?', example: 'パスポートを みせて くださいませんか。', context: 'チェックインの とき。' },
            { masu: 'まちます', te: 'まって', meaning: 'Could you wait?', example: 'すこし まって くださいませんか。', context: 'じゅんび しています。' },
            { masu: 'いいます', te: 'いって', meaning: 'Could you say?', example: 'もういちど いって くださいませんか。', context: 'きこえませんでした。' },
            { masu: 'はなします', te: 'はなして', meaning: 'Could you speak?', example: 'ゆっくり はなして くださいませんか。', context: 'はやすぎます。' },
            { masu: 'つかいます', te: 'つかって', meaning: 'Could you use?', example: 'これを つかって くださいませんか。', context: 'おねがい する とき。' },
            { masu: 'あけます', te: 'あけて', meaning: 'Could you open?', example: 'ドアを あけて くださいませんか。', context: 'にもつが おおいです。' },
            { masu: 'しめます', te: 'しめて', meaning: 'Could you close?', example: 'まどを しめて くださいませんか。', context: 'さむいです。' },
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
            const textToSpeak = teForm + "くださいませんか。"; 
            speak(textToSpeak);
        };
        
        window.speakExample = (exampleSentence) => {
            speak("すみませんが、" + exampleSentence);
        };

        function createVerbCard(item) {
            const card = document.createElement('div');
            card.className = 'verb-card';
            
            card.textContent = `
                <div class="verb-forms-container">
                    <div class="masu-box">${item.masu}</div>
                    <i class="fa-solid fa-arrow-right" style="color:#999;"></i>
                    <div class="target-box">
                        <span onclick="speakPhrase('${item.te}')" style="cursor:pointer; padding-right:5px;">
                            ${item.te}<span style="font-size:0.7em;">くださいませんか</span> 
                            <i class="fa-solid fa-volume-high" style="color:var(--primary); font-size: 0.8em;"></i>
                        </span>
                    </div>
                </div>
                
                <div class="example-sentence" onclick="speakExample('${item.example}')" style="cursor:pointer;">
                    <span style="font-size:0.8em; color:#777;">すみませんが、</span><br>
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