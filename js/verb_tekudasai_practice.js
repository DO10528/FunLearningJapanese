// --- データ定義 (30+30=60項目) ---
        // ★修正3: 例文 (example) のプロパティを追加
        const practiceData = [
            // ========== お願い（依頼）(30項目) ==========
            { type: 'request', masu: 'かします', te: 'かして', meaning: 'Lend', example: 'えんぴつを かしてください。', context: 'えんぴつを かして ほしいとき。' },
            { type: 'request', masu: 'てつだいます', te: 'てつだって', meaning: 'Help', example: 'にもつを てつだってください。', context: 'おもい にもつを はこぶとき。' },
            { type: 'request', masu: 'おしえます', te: 'おしえて', meaning: 'Tell/Show', example: 'みちを おしえてください。', context: 'みちや でんわばんごうを ききたいとき。' },
            { type: 'request', masu: 'あけます', te: 'あけて', meaning: 'Open', example: 'まどを あけてください。', context: 'まどや ドアを あけて ほしいとき。' },
            { type: 'request', masu: 'しめます', te: 'しめて', meaning: 'Close', example: 'ドアを しめてください。', context: 'まどや ドアを しめて ほしいとき。' },
            { type: 'request', masu: 'まちます', te: 'まって', meaning: 'Wait', example: 'ちょっと まってください。', context: 'すこし まって ほしいとき。' },
            { type: 'request', masu: 'とめます', te: 'とめて', meaning: 'Stop', example: 'くるまを とめてください。', context: 'あぶないので くるまを とめて ほしいとき。' },
            { type: 'request', masu: 'みせます', te: 'みせて', meaning: 'Show', example: 'ノートを みせてください。', context: 'あいての ノートを みたいとき。' },
            { type: 'request', masu: 'とります', te: 'とって', meaning: 'Take/Pass', example: 'しおを とってください。', context: 'たかい ところの ほを とって ほしいとき。' },
            { type: 'request', masu: 'いいます', te: 'いって', meaning: 'Say/Tell', example: 'もういちど いってください。', context: 'なまえを もういちど ききたいとき。' },
            { type: 'request', masu: 'かきます', te: 'かいて', meaning: 'Write', example: 'メモを かいてください。', context: 'メモを かいて ほしいとき。' },
            { type: 'request', masu: 'つかいます', te: 'つかわせて', meaning: 'Use', example: 'これ、つかわせてください。', context: 'あいての どうぐを つかわせて ほしいとき。' },
            { type: 'request', masu: 'かります', te: 'かりて', meaning: 'Borrow', example: 'ほんを かりてください。', context: 'ほんを いちじてきに かりたいとき。' },
            { type: 'request', masu: 'なおします', te: 'なおして', meaning: 'Fix', example: 'こわれた とけいを なおしてください。', context: 'こわれた ものを しゅうり して ほしいとき。' },
            { type: 'request', masu: 'わすれます', te: 'わすれて', meaning: 'Forget', example: 'しけんの ことを わすれてください。', context: 'いやな ことを きにしないで ほしいとき。' },
            { type: 'request', masu: 'つけます', te: 'つけて', meaning: 'Turn On', example: 'でんきを つけてください。', context: 'へやが くらいので でんきを つけて ほしいとき。' },
            { type: 'request', masu: 'けします', te: 'けして', meaning: 'Turn Off', example: 'テレビを けしてください。', context: 'でんきが あかるすぎるので けして ほしいとき。' },
            { type: 'request', masu: 'のぼります', te: 'のぼって', meaning: 'Climb', example: 'はしごを のぼってください。', context: 'たかいところの ものを とるとき。' },
            { type: 'request', masu: 'おります', te: 'おりて', meaning: 'Come Down', example: 'ここから おりてください。', context: 'たかいところから おりて ほしいとき。' },
            { type: 'request', masu: 'おくります', te: 'おくって', meaning: 'Send', example: 'にもつを おくってください。', context: 'にもつを おくって ほしいとき。' },
            { type: 'request', masu: 'はこびます', te: 'はこんで', meaning: 'Carry', example: 'この はこを はこんでください。', context: 'おもい はこを はこんで ほしいとき。' },
            { type: 'request', masu: 'いれます', te: 'いれて', meaning: 'Put In', example: 'おさけを いれてください。', context: 'コーヒーに さとうを いれて ほしいとき。' },
            { type: 'request', masu: 'だします', te: 'だして', meaning: 'Take Out', example: 'カードを だしてください。', context: 'ひきだしから かぎを だして ほしいとき。' },
            { type: 'request', masu: 'すわります', te: 'すわって', meaning: 'Sit', example: 'どうぞ、すわってください。', context: 'でんしゃで せきを つめて ほしいとき。' },
            { type: 'request', masu: 'たちます', te: 'たって', meaning: 'Stand Up', example: 'ここに たってください。', context: 'まえの ひとが じゃまな とき。' },
            { type: 'request', masu: 'あつめます', te: 'あつめて', meaning: 'Collect', example: 'ごみを あつめてください。', context: 'おちた かみを あつめて ほしいとき。' },
            { type: 'request', masu: 'ならべます', te: 'ならべて', meaning: 'Line Up', example: 'いすを ならべてください。', context: 'いすを ならべて ほしいとき。' },
            { type: 'request', masu: 'ならびます', te: 'ならんで', meaning: 'Form a Line', example: 'ここに ならんでください。', context: 'れつに ならんで ほしいとき。' },
            { type: 'request', masu: 'まとめます', te: 'まとめて', meaning: 'Gather', example: 'しゅるいを まとめてください。', context: 'ちらかった しょるいを まとめて ほしいとき。' },
            { type: 'request', masu: 'さわります', te: 'さわって', meaning: 'Touch', example: 'この ボタンを さわってください。', context: 'おちそうな ものを さわって ほしいとき。' },

            // ========== 指示・勧め（命令・提供）(30項目) ==========
            { type: 'instruction', masu: 'みます', te: 'みて', meaning: 'Look at', example: 'ホワイトボードを みてください。', context: 'ホワイトボードを みるよう しじ する とき。' },
            { type: 'instruction', masu: 'ききます', te: 'きいて', meaning: 'Listen', example: 'よく きいてください。', context: 'せんせいが はなしを きくよう しじ する とき。' },
            { type: 'instruction', masu: 'よみます', te: 'よんで', meaning: 'Read', example: 'この ページを よんでください。', context: 'ほんを よむよう しじ する とき。' },
            { type: 'instruction', masu: 'かきます', te: 'かいて', meaning: 'Write', example: 'ノートに かいてください。', context: 'ノートに こたえを かくよう しじ する とき。' },
            { type: 'instruction', masu: 'すわります', te: 'すわって', meaning: 'Sit down', example: 'あそこに すわってください。', context: 'つかれた ひとに せきを すすめる とき。' },
            { type: 'instruction', masu: 'たちます', te: 'たって', meaning: 'Stand up', example: 'たってください。', context: 'きりつ や あいてが じゃまな とき。' },
            { type: 'instruction', masu: 'はいります', te: 'はいって', meaning: 'Come in', example: 'どうぞ、はいってください。', context: 'へやに はいるよう すすめる とき。' },
            { type: 'instruction', masu: 'でます', te: 'でて', meaning: 'Go out', example: 'そとに でてください。', context: 'きょうしつから でるよう しじ する とき。' },
            { type: 'instruction', masu: 'たべます', te: 'たべて', meaning: 'Eat/Have', example: 'この りんごを たべてください。', context: 'おかし や りょうりを すすめる とき。' },
            { type: 'instruction', masu: 'のみます', te: 'のんで', meaning: 'Drink/Have', example: 'おちゃを のんでください。', context: 'おちゃ や のみものを すすめる とき。' },
            { type: 'instruction', masu: 'おぼえます', te: 'おぼえて', meaning: 'Memorize', example: 'この かんじを おぼえてください。', context: 'たんご や かんじを きおく するよう しじ する とき。' },
            { type: 'instruction', masu: 'あけます', te: 'あけて', meaning: 'Open', example: '3ページを あけてください。', context: 'ほんの あたらしい ページを あける とき。' },
            { type: 'instruction', masu: 'しめます', te: 'しめて', meaning: 'Close', example: 'ほんを しめてください。', context: 'ほんや じしょを とじるよう しじ する とき。' },
            { type: 'instruction', masu: 'わすれます', te: 'わすれて', meaning: 'Forget', example: 'パスワードを わすれてください。', context: 'いやな ことを すぐ わすれるよう すすめる とき。' },
            { type: 'instruction', masu: 'つかいます', te: 'つかって', meaning: 'Use', example: 'この じしょを つかってください。', context: 'どうぐや きかいを つかうよう すすめる とき。' },
            { type: 'instruction', masu: 'いいます', te: 'いって', meaning: 'Say/Tell', example: 'なまえを いってください。', context: 'なまえや じゅうしょを いうよう しじ する とき。' },
            { type: 'instruction', masu: 'やめます', te: 'やめて', meaning: 'Stop', example: 'たばこを やめてください。', context: 'わるい しゅうかんを とめるよう しじ する とき。' },
            { type: 'instruction', masu: 'でかけます', te: 'でかけて', meaning: 'Go out', example: 'あした、いっしょに でかけてください。', context: 'そとへ あそびに いくよう すすめる とき。' },
            { type: 'instruction', masu: 'かえります', te: 'かえって', meaning: 'Go home', example: 'もう じかんですから、かえってください。', context: 'いえに かえるよう しじ する とき。' },
            { type: 'instruction', masu: 'かえします', te: 'かえして', meaning: 'Return', example: 'かりた ほんを かえしてください。', context: 'かりた ほんを かえすよう しじ する とき。' },
            { type: 'instruction', masu: 'あげます', te: 'あげて', meaning: 'Raise/Lift', example: 'てを あげてください。', context: 'ものを たなにあげるよう しじ する とき。' },
            { type: 'instruction', masu: 'もらいます', te: 'もらって', meaning: 'Receive', example: 'プレゼントを もらってください。', context: 'プレゼントを うけとるよう すすめる とき。' },
            { type: 'instruction', masu: 'あそびます', te: 'あそんで', meaning: 'Play', example: 'そとで あそんでください。', context: 'しゅくだいが おわったら あそぶよう すすめる とき。' },
            { type: 'instruction', masu: 'およぎます', te: 'およいで', meaning: 'Swim', example: 'プールで およいでください。', context: 'プールで およぐよう すすめる とき。' },
            { type: 'instruction', masu: 'あるきます', te: 'あるいて', meaning: 'Walk', example: 'もっと あるいてください。', context: 'けんこうの ために あるくよう すすめる とき。' },
            { type: 'instruction', masu: 'はしります', te: 'はしって', meaning: 'Run', example: 'はやく はしってください。', context: 'はやく はしるよう しじ する とき。' },
            { type: 'instruction', masu: 'とびます', te: 'とんで', meaning: 'Jump', example: 'ジャンプして とんでください。', context: 'なわとびを するよう すすめる とき。' },
            { type: 'instruction', masu: 'すみます', te: 'すんで', meaning: 'Live', example: 'ここに すんでください。', context: 'この まちに すむよう すすめる とき。' },
            { type: 'instruction', masu: 'つくります', te: 'つくって', meaning: 'Make/Create', example: 'ケーキを つくってください。', context: 'もんだいを つくるよう しじ する とき。' },
            { type: 'instruction', masu: 'えらびます', te: 'えらんで', meaning: 'Choose', example: 'すきな いろを えらんでください。', context: 'ただしい こたえを えらぶよう しじ する とき。' },
        ];

        
        // --- 共通機能：音声合成 ---
        const synth = window.speechSynthesis;
        let voices = [];
        setTimeout(() => { voices = synth.getVoices(); }, 500);

        window.speakPhrase = (teForm) => {
            if (synth.speaking) synth.cancel();
            
            // 読み上げは「[Te形]、ください」
            const hiraganaTeForm = teForm.replace(/（[^）]*）/g, ''); 
            const textToSpeak = hiraganaTeForm + "、ください。"; 
            
            const ut = new SpeechSynthesisUtterance(textToSpeak);
            ut.lang = 'ja-JP';
            ut.rate = 0.9;

            const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
            const preferredKeywords = ['Google', 'Female', 'Kyoko', 'Haruka'];
            let targetVoice = jpVoices.find(v => preferredKeywords.some(k => v.name.includes(k)));
            
            if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
            if (targetVoice) ut.voice = targetVoice;

            synth.speak(ut);
        };
        
        // 例文の読み上げ
        window.speakExample = (exampleSentence) => {
            if (synth.speaking) synth.cancel();
            
            const ut = new SpeechSynthesisUtterance(exampleSentence);
            ut.lang = 'ja-JP';
            ut.rate = 0.9;

            const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
            const preferredKeywords = ['Google', 'Female', 'Kyoko', 'Haruka'];
            let targetVoice = jpVoices.find(v => preferredKeywords.some(k => v.name.includes(k)));
            
            if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
            if (targetVoice) ut.voice = targetVoice;

            synth.speak(ut);
        };


        // --- リスト描画ロジック ---
        function createVerbCard(item) {
            const isRequest = item.type === 'request';
            const cardColor = isRequest ? 'var(--request-color)' : 'var(--instruction-color)';
            
            const card = document.createElement('div');
            card.className = 'verb-card ' + (isRequest ? 'request-type' : 'instruction-type');
            card.style.borderColor = cardColor;
            
            card.textContent = `
                
                <div class="verb-forms-container">
                    <div class="masu-box">
                        ${item.masu}
                    </div>
                    <i class="fa-solid fa-arrow-right" style="color:#999;"></i>
                    <div class="tekudasai-box">
                        <span onclick="speakPhrase('${item.te}')" style="cursor:pointer; padding-right:5px;">
                            ${item.te}<span style="font-size:0.7em;">ください</span> <i class="fa-solid fa-volume-high" style="color:${cardColor}; font-size: 0.8em;"></i>
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
                    <i class="fa-solid ${isRequest ? 'fa-user-group' : 'fa-hand-point-right'}"></i> 
                    ${isRequest ? 'おねがい（たのみごと）' : 'しじ・すすめ'}
                </p>
            `;
            return card;
        }

        function renderLists() {
            const requestList = document.getElementById('request-list');
            const instructionList = document.getElementById('instruction-list');

            const requests = practiceData.filter(item => item.type === 'request');
            const instructions = practiceData.filter(item => item.type === 'instruction');

            requests.forEach(item => {
                requestList.appendChild(createVerbCard(item));
            });
            
            instructions.forEach(item => {
                instructionList.appendChild(createVerbCard(item));
            });
        }

        // ページロード時に実行
        document.addEventListener('DOMContentLoaded', () => {
            renderLists();
        });