const data = {
            months: [
                { kanji: '一月', kana: 'いちがつ', cue: '1', meaning: 'January' },
                { kanji: '二月', kana: 'にがつ', cue: '2', meaning: 'February' },
                { kanji: '三月', kana: 'さんがつ', cue: '3', meaning: 'March' },
                { kanji: '四月', kana: 'しがつ', cue: '4', meaning: 'April' },
                { kanji: '五月', kana: 'ごがつ', cue: '5', meaning: 'May' },
                { kanji: '六月', kana: 'ろくがつ', cue: '6', meaning: 'June' },
                { kanji: '七月', kana: 'しちがつ', cue: '7', meaning: 'July' },
                { kanji: '八月', kana: 'はちがつ', cue: '8', meaning: 'August' },
                { kanji: '九月', kana: 'くがつ', cue: '9', meaning: 'September' },
                { kanji: '十月', kana: 'じゅうがつ', cue: '10', meaning: 'October' },
                { kanji: '十一月', kana: 'じゅういちがつ', cue: '11', meaning: 'November' },
                { kanji: '十二月', kana: 'じゅうにがつ', cue: '12', meaning: 'December' },
            ],
            daysOfWeek: [
                { kanji: '月曜日', kana: 'げつようび', cue: '月', meaning: 'Monday' },
                { kanji: '火曜日', kana: 'かようび', cue: '火', meaning: 'Tuesday' },
                { kanji: '水曜日', kana: 'すいようび', cue: '水', meaning: 'Wednesday' },
                { kanji: '木曜日', kana: 'もくようび', cue: '木', meaning: 'Thursday' },
                { kanji: '金曜日', kana: 'きんようび', cue: '金', meaning: 'Friday' },
                { kanji: '土曜日', kana: 'どようび', cue: '土', meaning: 'Saturday' },
                { kanji: '日曜日', kana: 'にちようび', cue: '日', meaning: 'Sunday' },
                { kanji: '何曜日', kana: 'なんようび', cue: '?', meaning: 'What day of the week?' },
            ],
            datesIrregular: [
                { kanji: '一日', kana: 'ついたち', cue: '1', meaning: '1st (Irregular)' },
                { kanji: '二日', kana: 'ふつか', cue: '2', meaning: '2nd' },
                { kanji: '三日', kana: 'みっか', cue: '3', meaning: '3rd' },
                { kanji: '四日', kana: 'よっか', cue: '4', meaning: '4th' },
                { kanji: '五日', kana: 'いつか', cue: '5', meaning: '5th' },
                { kanji: '六日', kana: 'むいか', cue: '6', meaning: '6th' },
                { kanji: '七日', kana: 'なのか', cue: '7', meaning: '7th' },
                { kanji: '八日', kana: 'ようか', cue: '8', meaning: '8th' },
                { kanji: '九日', kana: 'ここのか', cue: '9', meaning: '9th' },
                { kanji: '十日', kana: 'とおか', cue: '10', meaning: '10th' },
                { kanji: '十四日', kana: 'じゅうよっか', cue: '14', meaning: '14th (Irregular)' },
                { kanji: '二十日', kana: 'はつか', cue: '20', meaning: '20th (Irregular)' },
            ],
            datesRegular: [
                { kanji: '十一日', kana: 'じゅういちにち', cue: '11', meaning: '11th' },
                { kanji: '二十一日', kana: 'にじゅういちにち', cue: '21', meaning: '21st' },
                { kanji: '二十五日', kana: 'にじゅうごにち', cue: '25', meaning: '25th' },
                { kanji: '三十日', kana: 'さんじゅうにち', cue: '30', meaning: '30th' },
                { kanji: '何日', kana: 'なんにち', cue: '?', meaning: 'What day / How many days?' },
            ],
            years: [
                { kanji: '去年', kana: 'きょねん', cue: '去', meaning: 'Last Year' },
                { kanji: '今年', kana: 'ことし', cue: '今', meaning: 'This Year' },
                { kanji: '来年', kana: 'らいねん', cue: '来', meaning: 'Next Year' },
                { kanji: '毎年', kana: 'まいとし/まいねん', cue: '毎', meaning: 'Every Year' },
                { kanji: '何年', kana: 'なんねん', cue: '?', meaning: 'What Year?' },
            ]
        };

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

        function createCard(item, speakText) {
            const card = document.createElement('div');
            card.className = 'item-card';
            
            const textToSpeak = speakText || item.kana; 
            
            card.setAttribute('onclick', `speak('${textToSpeak}')`);
            
            card.textContent = `
                <div class="visual-cue">${item.cue}</div>
                <span class="word-kanji">${item.kanji}</span>
                <span class="word-kana">${item.kana}</span>
                <p style="font-size:0.8em; color:var(--primary-dark); margin:5px 0 0;">(${item.meaning})</p>
                <i class="fa-solid fa-volume-high audio-icon"></i>
            `;
            return card;
        }

        function renderLists() {
            const monthList = document.getElementById('month-list');
            data.months.forEach(item => monthList.appendChild(createCard(item)));

            const dayOfWeekList = document.getElementById('day-of-week-list');
            data.daysOfWeek.forEach(item => dayOfWeekList.appendChild(createCard(item)));

            const dateIrregularList = document.getElementById('date-list-irregular');
            data.datesIrregular.forEach(item => dateIrregularList.appendChild(createCard(item)));
            
            const dateRegularList = document.getElementById('date-list-regular');
            data.datesRegular.forEach(item => dateRegularList.appendChild(createCard(item)));

            const yearList = document.getElementById('year-list');
            data.years.forEach(item => yearList.appendChild(createCard(item)));
        }

        document.addEventListener('DOMContentLoaded', renderLists);