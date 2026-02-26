// --- データ定義 ---
        const practiceData = [
            // ========== 動作進行 (Action: 今やっている) ==========
            { type: 'action', masu: 'たべます', te: 'たべて', meaning: 'is eating', example: 'ごはんを たべています。', context: 'いま、しょくじちゅう です。' },
            { type: 'action', masu: 'のみます', te: 'のんで', meaning: 'is drinking', example: 'おちゃを のんでいます。', context: 'いま、きゅうけいちゅう です。' },
            { type: 'action', masu: 'よみます', te: 'よんで', meaning: 'is reading', example: 'ほんを よんでいます。', context: 'いま、どくしょちゅう です。' },
            { type: 'action', masu: 'かきます', te: 'かいて', meaning: 'is writing', example: 'てがみを かいています。', context: 'いま、つくえに むかっています。' },
            { type: 'action', masu: 'べんきょうします', te: 'べんきょうして', meaning: 'is studying', example: 'にほんごを べんきょうしています。', context: 'いま、がっこうに います。' },
            { type: 'action', masu: 'まっています', te: 'まって', meaning: 'is waiting', example: 'バスを まっています。', context: 'いま、バスていに います。' },
            { type: 'action', masu: 'はなします', te: 'はなして', meaning: 'is talking', example: 'ともだちと はなしています。', context: 'いま、でんわを しています。' },
            { type: 'action', masu: 'ねます', te: 'ねて', meaning: 'is sleeping', example: 'あかちゃんが ねています。', context: 'いま、ベッドに います。' },
            { type: 'action', masu: 'みます', te: 'みて', meaning: 'is watching', example: 'テレビを みています。', context: 'いま、リビングに います。' },
            { type: 'action', masu: 'ききます', te: 'きいて', meaning: 'is listening', example: 'おんがくを きいています。', context: 'いま、イヤホンを しています。' },
            { type: 'action', masu: 'はしります', te: 'はしって', meaning: 'is running', example: 'こうえんを はしっています。', context: 'いま、うんどう しています。' },
            { type: 'action', masu: 'あそびます', te: 'あそんで', meaning: 'is playing', example: 'こどもが あそんでいます。', context: 'いま、そとに います。' },
            { type: 'action', masu: 'つくります', te: 'つくって', meaning: 'is cooking/making', example: 'りょうりを つくっています。', context: 'いま、キッチンに います。' },
            { type: 'action', masu: 'およぎます', te: 'およいで', meaning: 'is swimming', example: 'プールで およいでいます。', context: 'いま、みずのなかに います。' },

            // ========== 状態 (State: 結果の状態・習慣) ==========
            { type: 'state', masu: 'すみます', te: 'すんで', meaning: 'live in', example: 'とうきょうに すんでいます。', context: 'じゅうしょは どこですか。' },
            { type: 'state', masu: 'けっこんします', te: 'けっこんして', meaning: 'is married', example: 'けっこんしています。', context: 'どくしん ですか。' },
            { type: 'state', masu: 'しります', te: 'しって', meaning: 'know', example: 'かのじょを しっています。', context: 'あのひとが だれか わかりますか。' },
            { type: 'state', masu: 'もちます', te: 'もって', meaning: 'have/own', example: 'くるまを もっています。', context: 'じぶんの くるまが ありますか。' },
            { type: 'state', masu: 'きます', te: 'きて', meaning: 'is wearing (shirt)', example: 'シャツを きています。', context: 'なにを きていますか。' },
            { type: 'state', masu: 'はきます', te: 'はいて', meaning: 'is wearing (shoes/pants)', example: 'ズボンを はいています。', context: 'なにを はいていますか。' },
            { type: 'state', masu: 'かぶります', te: 'かぶって', meaning: 'is wearing (hat)', example: 'ぼうしを かぶっています。', context: 'あたまに なにが ありますか。' },
            { type: 'state', masu: 'かけます', te: 'かけて', meaning: 'is wearing (glasses)', example: 'めがねを かけています。', context: 'めがねを していますか。' },
            { type: 'state', masu: 'おぼえます', te: 'おぼえて', meaning: 'remember', example: 'パスワードを おぼえています。', context: 'わすれて いません。' },
            { type: 'state', masu: 'つかれます', te: 'つかれて', meaning: 'is tired', example: 'すこし つかれています。', context: 'げんきが ないようです。' },
        ];

        const synth = window.speechSynthesis;
        let voices = [];
        setTimeout(() => { voices = synth.getVoices(); }, 500);

        // V-ています読み上げ
        window.speakPhrase = (teForm) => {
            if (synth.speaking) synth.cancel();
            // ひらがなのみ抽出
            const textToSpeak = teForm + "います。"; 
            speak(textToSpeak);
        };
        
        // 例文読み上げ
        window.speakExample = (exampleSentence) => {
            if (synth.speaking) synth.cancel();
            speak(exampleSentence);
        };

        function speak(text) {
            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'ja-JP'; ut.rate = 0.9;
            const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
            let targetVoice = jpVoices.find(v => v.name.includes('Google') || v.name.includes('Female'));
            if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
            if (targetVoice) ut.voice = targetVoice;
            synth.speak(ut);
        }

        function createVerbCard(item) {
            const isAction = item.type === 'action';
            const cardColor = isAction ? 'var(--action-color)' : 'var(--state-color)';
            
            const card = document.createElement('div');
            card.className = 'verb-card ' + (isAction ? 'action-type' : 'state-type');
            card.style.borderColor = cardColor;
            
            card.innerHTML = `
                <div class="verb-forms-container">
                    <div class="masu-box">${item.masu}</div>
                    <i class="fa-solid fa-arrow-right" style="color:#999;"></i>
                    <div class="teimasu-box">
                        <span onclick="speakPhrase('${item.te}')" style="cursor:pointer; padding-right:5px;">
                            ${item.te}<span style="font-size:0.7em;">います</span> 
                            <i class="fa-solid fa-volume-high" style="color:${cardColor}; font-size: 0.8em;"></i>
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
                
                <p style="font-weight:bold; color: ${cardColor}; margin: 5px 0 5px 0; font-size: 0.9em;">
                    <i class="fa-solid ${isAction ? 'fa-person-running' : 'fa-shirt'}"></i> 
                    ${isAction ? 'いま しています (Action)' : 'ずっと しています (State)'}
                </p>
            `;
            return card;
        }

        function renderLists() {
            const actionList = document.getElementById('action-list');
            const stateList = document.getElementById('state-list');

            const actions = practiceData.filter(item => item.type === 'action');
            const states = practiceData.filter(item => item.type === 'state');

            actions.forEach(item => actionList.appendChild(createVerbCard(item)));
            states.forEach(item => stateList.appendChild(createVerbCard(item)));
        }

        document.addEventListener('DOMContentLoaded', renderLists);