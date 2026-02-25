// --- データ定義 ---
        const practiceData = [
            // ========== お手伝い (Offer: 私がしましょうか？) ==========
            { type: 'offer', masu: 'もちます', stem: 'もち', meaning: 'Shall I carry?', example: 'にもつを もちましょうか。', context: 'おもい にもつを もっている ひとに。' },
            { type: 'offer', masu: 'てつだいます', stem: 'てつだい', meaning: 'Shall I help?', example: 'てつだいましょうか。', context: 'いそがしそうな ひとに。' },
            { type: 'offer', masu: 'かします', stem: 'かし', meaning: 'Shall I lend?', example: 'かさを かしましょうか。', context: 'あめで かさが ない ひとに。' },
            { type: 'offer', masu: 'あけます', stem: 'あけ', meaning: 'Shall I open?', example: 'まどを あけましょうか。', context: 'へやが あつい とき。' },
            { type: 'offer', masu: 'しめます', stem: 'しめ', meaning: 'Shall I close?', example: 'ドアを しめましょうか。', context: 'さむい とき。' },
            { type: 'offer', masu: 'つけます', stem: 'つけ', meaning: 'Shall I turn on?', example: 'エアコンを つけましょうか。', context: 'へやが あつい とき。' },
            { type: 'offer', masu: 'けします', stem: 'けし', meaning: 'Shall I turn off?', example: 'テレビを けしましょうか。', context: 'うるさい とき。' },
            { type: 'offer', masu: 'おしえます', stem: 'おしえ', meaning: 'Shall I tell?', example: 'ちずを おしえましょうか。', context: 'みちに まよっている ひとに。' },
            { type: 'offer', masu: 'むかえにいきます', stem: 'むかえにいき', meaning: 'Shall I pick you up?', example: 'えきまで むかえにいきましょうか。', context: 'あめが ふっている とき。' },
            { type: 'offer', masu: 'かきます', stem: 'かき', meaning: 'Shall I write?', example: 'ちずを かきましょうか。', context: 'みちを せつめい する とき。' },
            { type: 'offer', masu: 'とります', stem: 'とり', meaning: 'Shall I take?', example: 'しゃしんを とりましょうか。', context: 'かんこうきゃくに。' },
            { type: 'offer', masu: 'よびます', stem: 'よび', meaning: 'Shall I call?', example: 'タクシーを よびましょうか。', context: 'にもつが おおい とき。' },
            { type: 'offer', masu: 'あらいます', stem: 'あらい', meaning: 'Shall I wash?', example: 'おさらを あらいましょうか。', context: 'しょくじの あとで。' },
            { type: 'offer', masu: 'コピーします', stem: 'コピーし', meaning: 'Shall I copy?', example: 'しりょうを コピーしましょうか。', context: 'かいぎの まえに。' },

            // ========== お誘い (Invitation: 一緒にしましょうか？) ==========
            { type: 'invite', masu: 'いきます', stem: 'いき', meaning: 'Shall we go?', example: 'いっしょに いきましょうか。', context: 'ランチに さそう とき。' },
            { type: 'invite', masu: 'たべます', stem: 'たべ', meaning: 'Shall we eat?', example: 'なにか たべましょうか。', context: 'おなかが すいた とき。' },
            { type: 'invite', masu: 'のみます', stem: 'のみ', meaning: 'Shall we drink?', example: 'コーヒーを のみましょうか。', context: 'つかれた とき。' },
            { type: 'invite', masu: 'やすみます', stem: 'やすみ', meaning: 'Shall we rest?', example: 'すこし やすみましょうか。', context: 'たくさん あるいた とき。' },
            { type: 'invite', masu: 'かえります', stem: 'かえり', meaning: 'Shall we go home?', example: 'そろそろ かえりましょうか。', context: 'おそく なった とき。' },
            { type: 'invite', masu: 'はじめます', stem: 'はじめ', meaning: 'Shall we start?', example: 'そろそろ はじめましょうか。', context: 'じかんに なった とき。' },
            { type: 'invite', masu: 'あそびます', stem: 'あそび', meaning: 'Shall we play?', example: 'ゲームで あそびましょうか。', context: 'ひまな とき。' },
            { type: 'invite', masu: 'みます', stem: 'み', meaning: 'Shall we watch?', example: 'えいがを みましょうか。', context: 'デートの とき。' },
            { type: 'invite', masu: 'あいます', stem: 'あい', meaning: 'Shall we meet?', example: 'あした あいましょうか。', context: 'やくそくを する とき。' },
            { type: 'invite', masu: 'さんぽします', stem: 'さんぽし', meaning: 'Shall we walk?', example: 'こうえんで さんぽしましょうか。', context: 'てんきが いい とき。' },
        ];

        const synth = window.speechSynthesis;
        let voices = [];
        setTimeout(() => { voices = synth.getVoices(); }, 500);

        // V-ましょうか読み上げ
        window.speakPhrase = (stem) => {
            if (synth.speaking) synth.cancel();
            const textToSpeak = stem + "ましょうか。"; 
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
            const isOffer = item.type === 'offer';
            const cardColor = isOffer ? 'var(--offer-color)' : '#fbc02d'; // Invitation color
            
            const card = document.createElement('div');
            card.className = 'verb-card ' + (isOffer ? 'offer-type' : 'invite-type');
            card.style.borderColor = cardColor;
            
            card.textContent = `
                <div class="verb-forms-container">
                    <div class="masu-box">${item.masu}</div>
                    <i class="fa-solid fa-arrow-right" style="color:#999;"></i>
                    <div class="mashouka-box">
                        <span onclick="speakPhrase('${item.stem}')" style="cursor:pointer; padding-right:5px;">
                            ${item.stem}<span style="font-size:0.7em;">ましょうか</span> 
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
                    <i class="fa-solid ${isOffer ? 'fa-hand-holding-heart' : 'fa-users'}"></i> 
                    ${isOffer ? 'おてつだい (Shall I?)' : 'おさそい (Shall we?)'}
                </p>
            `;
            return card;
        }

        function renderLists() {
            const offerList = document.getElementById('offer-list');
            const inviteList = document.getElementById('invite-list');

            const offers = practiceData.filter(item => item.type === 'offer');
            const invites = practiceData.filter(item => item.type === 'invite');

            offers.forEach(item => offerList.appendChild(createVerbCard(item)));
            invites.forEach(item => inviteList.appendChild(createVerbCard(item)));
        }

        document.addEventListener('DOMContentLoaded', renderLists);