const cssVars = {
        incorrect: getComputedStyle(document.documentElement).getPropertyValue('--incorrect').trim(),
        correct: getComputedStyle(document.documentElement).getPropertyValue('--correct').trim()
    };
    
    function updateScore() {} 

    const GAME_BASE_ID = "date_time"; 

    const dateOptions = {
        years: [
            { kanji: '今年', kana: 'ことし' },
            { kanji: '去年', kana: 'きょねん' },
            { kanji: '来年', kana: 'らいねん' },
            { kanji: '何年', kana: 'なんねん' }
        ],
        months: [
            { kanji: '一月', kana: 'いちがつ' }, { kanji: '二月', kana: 'にがつ' }, { kanji: '三月', kana: 'さんがつ' },
            { kanji: '四月', kana: 'しがつ' }, { kanji: '五月', kana: 'ごがつ' }, { kanji: '六月', kana: 'ろくがつ' },
            { kanji: '七月', kana: 'しちがつ' }, { kanji: '八月', kana: 'はちがつ' }, { kanji: '九月', kana: 'くがつ' },
            { kanji: '十月', kana: 'じゅうがつ' }, { kanji: '十一月', kana: 'じゅういちがつ' }, { kanji: '十二月', kana: 'じゅうにがつ' },
            { kanji: '何月', kana: 'なんがつ' }
        ],
        dates: [
            { kanji: '一日', kana: 'ついたち' }, { kanji: '二日', kana: 'ふつか' }, { kanji: '三日', kana: 'みっか' },
            { kanji: '四日', kana: 'よっか' }, { kanji: '五日', kana: 'いつか' }, { kanji: '六日', kana: 'むいか' },
            { kanji: '七日', kana: 'なのか' }, { kanji: '八日', kana: 'ようか' }, { kanji: '九日', kana: 'ここのか' },
            { kanji: '十日', kana: 'とおか' }, { kanji: '十一日', kana: 'じゅういちにち' }, { kanji: '十二日', kana: 'じゅうににち' },
            { kanji: '十三日', kana: 'じゅうさんにち' }, { kanji: '十四日', kana: 'じゅうよっか' }, { kanji: '十五日', kana: 'じゅうごにち' },
            { kanji: '十六日', kana: 'じゅうろくにち' }, { kanji: '十七日', kana: 'じゅうしちにち' }, { kanji: '十八日', kana: 'じゅうはちにち' },
            { kanji: '十九日', kana: 'じゅうくにち' }, { kanji: '二十日', kana: 'はつか' }, { kanji: '二十一日', kana: 'にじゅういちにち' },
            { kanji: '二十二日', kana: 'にじゅうににち' }, { kanji: '二十三日', kana: 'にじゅうさんにち' }, { kanji: '二十四日', kana: 'にじゅうよっか' },
            { kanji: '二十五日', kana: 'にじゅうごにち' }, { kanji: '二十六日', kana: 'にじゅうろくにち' }, { kanji: '二十七日', kana: 'にじゅうしちにち' },
            { kanji: '二十八日', kana: 'にじゅうはちにち' }, { kanji: '二十九日', kana: 'にじゅうくにち' }, { kanji: '三十日', kana: 'さんじゅうにち' },
            { kanji: '三十一日', kana: 'さんじゅういちにち' }, { kanji: '何日', kana: 'なんにち' }, { kanji: '七日', kana: 'なのかん' }
        ],
        daysOfWeek: [
            { kanji: '月曜日', kana: 'げつようび' }, { kanji: '火曜日', kana: 'かようび' }, { kanji: '水曜日', kana: 'すいようび' },
            { kanji: '木曜日', kana: 'もくようび' }, { kanji: '金曜日', kana: 'きんようび' }, { kanji: '土曜日', kana: 'どようび' },
            { kanji: '日曜日', kana: 'にちようび' }, { kanji: '何曜日', kana: 'なんようび' }
        ],
        dayCounts: [
            { kanji: '一日', kana: 'いちにち' }, { kanji: '二日', kana: 'ふつか' }, { kanji: '三日', kana: 'みっか' },
            { kanji: '七日', kana: 'なのかん' }, { kanji: '七日', kana: 'いっしゅうかん' }
        ]
    };

    const mode1Questions = [
        { kanji: '一日', kana: 'ついたち', type: 'date' }, { kanji: '二日', kana: 'ふつか', type: 'date' },
        { kanji: '三日', kana: 'みっか', type: 'date' }, { kanji: '四日', kana: 'よっか', type: 'date' },
        { kanji: '七日', kana: 'なのか', type: 'date' }, { kanji: '十日', kana: 'とおか', type: 'date' },
        { kanji: '十四日', kana: 'じゅうよっか', type: 'date' }, { kanji: '二十日', kana: 'はつか', type: 'date' },
        { kanji: '二十四日', kana: 'にじゅうよっか', type: 'date' }, { kanji: '何日', kana: 'なんにち', type: 'date' },
        { kanji: '四月', kana: 'しがつ', type: 'month' }, { kanji: '九月', kana: 'くがつ', type: 'month' },
        { kanji: '七月', kana: 'しちがつ', type: 'month' }, { kanji: '金曜日', kana: 'きんようび', type: 'day' },
        { kanji: '水曜日', kana: 'すいようび', type: 'day' }, { kanji: '去年', kana: 'きょねん', type: 'year' },
        { kanji: '今年', kana: 'ことし', type: 'year' }, { kanji: '来年', kana: 'らいねん', type: 'year' },
    ];
    
    const mode2Combinations = [
        { month: '一月', date: '三日', day: '月曜日', text: '一月、三日、月曜日です。' },
        { month: '七月', date: '七日', day: '土曜日', text: '七月、七日、土曜日です。' },
        { month: '十二月', date: '二十五日', day: '金曜日', text: '十二月、二十五日、金曜日です。' },
        { month: '二月', date: '二十日', day: '水曜日', text: '二月、二十日、水曜日です。' },
        { month: '五月', date: '五日', day: '日曜日', text: '五月、五日、日曜日です。' },
        { month: '四月', date: '一日', day: '火曜日', text: '四月、一日、火曜日です。' },
        { month: '九月', date: '十四日', day: '木曜日', text: '九月、十四日、木曜日です。' },
        ...Array(20).fill(0).map(() => {
            const month = getRandomItem(dateOptions.months.slice(0, 12));
            const date = getRandomItem(dateOptions.dates.slice(0, 31));
            const day = getRandomItem(dateOptions.daysOfWeek.slice(0, 7));
            const monthKana = dateOptions.months.find(m => m.kanji === month.kanji)?.kana || month.kanji;
            const dateKana = dateOptions.dates.find(d => d.kanji === date.kanji)?.kana || date.kanji;
            const dayKana = dateOptions.daysOfWeek.find(d => d.kanji === day.kanji)?.kana || day.kanji;
            
            const text = `${monthKana}、${dateKana}、${dayKana}です。`;
            return { month: month.kanji, date: date.kanji, day: day.kanji, text: text };
        })
    ];

    const mode3Questions = [
        { id: 1, question: '年の終わり、除夜の鐘を聞くのは何月何日ですか？', answer: { month: '十二月', date: '三十一日' }, components: ['month', 'date'] },
        { id: 2, question: '日本の新年（お正月）は、何月何日ですか？', answer: { month: '一月', date: '一日' }, components: ['month', 'date'] },
        { id: 3, question: '日本の学校や会社が休みになることが多いのは、何曜日と何曜日ですか？', answer: { day: '土曜日', day2: '日曜日' }, components: ['day', 'day2'] }, 
        { id: 4, question: '来年のオリンピック（仮）は何年ですか？', answer: { year: '来年' }, components: ['year'] },
        { id: 5, question: 'クリスマスは何月何日ですか？', answer: { month: '十二月', date: '二十五日' }, components: ['month', 'date'] },
        { id: 6, question: 'バレンタインデーは何月何日ですか？', answer: { month: '二月', date: '十四日' }, components: ['month', 'date'] },
        { id: 7, question: 'ゴールデンウィークはだいたい何月ですか？', answer: { month: '五月' }, components: ['month'] },
        { id: 8, question: '子どもの日（こどものひ）は何月何日ですか？', answer: { month: '五月', date: '五日' }, components: ['month', 'date'] },
        { id: 9, question: '七夕（たなばた）は何月何日ですか？', answer: { month: '七月', date: '七日' }, components: ['month', 'date'] },
        { id: 10, question: '日本の学校の夏休みはだいたい何月ごろですか？', answer: { month: '八月' }, components: ['month'] },
        { id: 11, question: '敬老の日（けいろうのひ）はだいたい何月ですか？', answer: { month: '九月' }, components: ['month'] },
        { id: 12, question: '今日（きょう）は月曜日です。明日は何曜日ですか？', answer: { day: '火曜日' }, components: ['day'] },
        { id: 13, question: '今日（きょう）は木曜日です。昨日は何曜日でしたか？', answer: { day: '水曜日' }, components: ['day'] },
        { id: 14, question: '今日（きょう）は金曜日です。明後日（あさって）は何曜日ですか？', answer: { day: '日曜日' }, components: ['day'] },
        { id: 15, question: '月曜日の前は何曜日ですか？', answer: { day: '日曜日' }, components: ['day'] },
        { id: 16, question: '一般的に、日本の企業でボーナスが支給されるのは、何月と何月ですか？', answer: { month: '七月', month2: '十二月' }, components: ['month', 'month2'] }, 
        { id: 17, question: '鏡開き（かがみびらき）は一月の何日ですか？', answer: { date: '十一日' }, components: ['date'] },
        { id: 18, question: '一般的に、あなたの国で一番暑い季節は何月ですか？', answer: { month: '八月' }, components: ['month'] },
        { id: 19, question: '1週間で真ん中の日（中心）は何曜日ですか？', answer: { day: '水曜日' }, components: ['day'] },
        { id: 20, question: '春分の日（しゅんぶんのひ）はだいたい何月ですか？', answer: { month: '三月' }, components: ['month'] },
        { id: 21, question: 'お正月休みが始まるのは何月何日ごろですか？', answer: { date: '二十九日', month: '十二月' }, components: ['month', 'date'] },
        { id: 22, question: '28日の次の日にちは何日ですか？', answer: { date: '二十九日' }, components: ['date'] },
        { id: 23, question: '15日の前の日にちは何日ですか？', answer: { date: '十四日' }, components: ['date'] },
        { id: 24, question: '五月の前は何月ですか？', answer: { month: '四月' }, components: ['month'] },
        { id: 25, question: '六月の次は何月ですか？', answer: { month: '七月' }, components: ['month'] },
        { id: 26, question: '年末（ねんまつ）は何月ですか？', answer: { month: '十二月' }, components: ['month'] },
        { id: 27, question: '月初め（つきはじめ）は何日ですか？', answer: { date: '一日' }, components: ['date'] },
        { id: 28, question: '今日（きょう）は土曜日です。一週間後は何曜日ですか？', answer: { day: '土曜日' }, components: ['day'] },
        { id: 29, question: '会社の新しい年度は何月から始まりますか？', answer: { month: '四月' }, components: ['month'] },
        { id: 30, question: '学校の新しい年度（入学式）は何月ですか？', answer: { month: '四月' }, components: ['month'] }
    ];


    // --- ゲーム状態変数 ---
    let currentMode = 0;
    let questionData = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    const maxQuestions = 10;
    let isAnswered = false;
    let selectedChoice = null;

    // --- TTS/音声機能 ---
    const synth = window.speechSynthesis;
    let voices = [];
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    function speak(text) {
        if (synth.speaking) synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'ja-JP'; 
        ut.rate = 0.8; 
        const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
        let targetVoice = jpVoices.find(v => v.name.includes('Google') || v.name.includes('Female'));
        if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
        if (targetVoice) ut.voice = targetVoice;
        synth.speak(ut);
    }
    
    // ★ 戻るボタンの制御: モード選択時なら練習画面へ、ゲーム中ならモード選択へ
    window.handleHeaderBack = function() {
        if (currentMode === 0) {
            window.location.href = 'date_time_practice.html';
        } else {
            resetGame();
        }
    }


    // --- ユーティリティ関数 ---

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function filterOptions(type, correctKanji) {
        let pool;
        if (type === 'date') {
            pool = dateOptions.dates.filter(item => item.kanji !== correctKanji);
        } else if (type === 'month') {
            pool = dateOptions.months.filter(item => item.kanji !== correctKanji);
        } else if (type === 'day') {
            pool = dateOptions.daysOfWeek.filter(item => item.kanji !== correctKanji);
        } else if (type === 'year') {
            pool = dateOptions.years.filter(item => item.kanji !== correctKanji);
        } else {
            return [];
        }

        return shuffleArray(pool).slice(0, 3).map(item => item.kana);
    }
    
    function resetGame() {
        // UIのリセット
        document.querySelectorAll('.game-area').forEach(el => el.style.display = 'none');
        document.getElementById('scoreboard').style.display = 'none';
        document.getElementById('mode-selection').style.display = 'block';
        document.getElementById('daily-point-limit').textContent = ''; 

        // 状態変数のリセット
        currentMode = 0;
        questionData = [];
        currentQuestionIndex = 0;
        score = 0;
        isAnswered = false;

        // ヘッダーボタンの更新
        const btn = document.getElementById('header-back-btn');
        if(btn) btn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> 練習に戻る';
    }


    // --- ゲーム制御 ---

    function startGame(mode) {
        if (currentMode !== 0) return; 
        currentMode = mode;
        score = 0;
        currentQuestionIndex = 0;
        isAnswered = false;
        
        document.getElementById('mode-selection').style.display = 'none';
        const gameArea = document.getElementById(`mode${mode}-game`);
        gameArea.style.display = 'block';

        // ヘッダーボタンの更新
        const btn = document.getElementById('header-back-btn');
        if(btn) btn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> ゲームを選ぶ';

        let sourceData;
        if (mode === 1) {
            sourceData = mode1Questions;
        } else if (mode === 2) {
            sourceData = mode2Combinations;
        } else if (mode === 3) {
            sourceData = mode3Questions;
        }
        questionData = shuffleArray(sourceData).slice(0, maxQuestions);

        loadQuestion(mode);
        
        if (mode === 3) {
            setTimeout(() => speakCurrentQuestion(3), 500); 
        }
    }

    function loadQuestion(mode) {
        isAnswered = false;
        selectedChoice = null;
        const currentQ = questionData[currentQuestionIndex];
        document.getElementById(`question-counter-${mode}`).textContent = `問 ${currentQuestionIndex + 1} / ${maxQuestions}`;
        document.getElementById(`feedback-message-${mode}`).innerHTML = '';
        const checkBtn = document.getElementById(`mode${mode}-check-btn`);
        checkBtn.style.display = 'block';
        checkBtn.disabled = false;
        document.getElementById(`mode${mode}-next-btn`).style.display = 'none';
        
        if (mode === 1) {
            checkBtn.disabled = true; 
            const kanji = currentQ.kanji;
            const correctKana = currentQ.kana;
            document.getElementById('mode1-question-box').textContent = kanji;
            
            let choices = [correctKana];
            const distractors = filterOptions(currentQ.type, kanji);
            choices.push(...distractors.slice(0, 3)); 

            choices = shuffleArray(choices);

            const choicesEl = document.getElementById('mode1-choices');
            choicesEl.textContent = '';
            
            choices.forEach(kana => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = kana;
                btn.setAttribute('data-value', kana);
                btn.onclick = () => selectChoice(btn);
                choicesEl.appendChild(btn);
            });

        } else if (mode === 2) {
            const dropdowns = [
                { id: 'month', type: 'month' },
                { id: 'date', type: 'date' },
                { id: 'day', type: 'day' }
            ];
            setupDynamicDropdowns(2, dropdowns);
            document.getElementById('play-audio-btn').textContent = '音声を再生';

        } else if (mode === 3) {
            document.getElementById('mode3-question-text').textContent = currentQ.question;
            
            const currentComponents = [];
            const answerKeys = Object.keys(currentQ.answer);
            
            answerKeys.forEach(key => {
                let baseType = key.replace(/[0-9]/g, ''); 
                
                let type;
                if (baseType === 'day') type = 'day';
                else if (baseType === 'month') type = 'month';
                else if (baseType === 'date') type = 'date';
                else if (baseType === 'year') type = 'year';

                currentComponents.push({ id: key, type: type });
            });
            
            
            setupDynamicDropdowns(3, currentComponents);
        }
    }
    
    function selectChoice(btn) {
        if (isAnswered) return;
        document.querySelectorAll('#mode1-choices .choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedChoice = btn.getAttribute('data-value');
        document.getElementById('mode1-check-btn').disabled = false;
    }

    function setupDynamicDropdowns(mode, components) {
        const container = document.getElementById(`mode${mode}-dropdowns`);
        container.textContent = '';
        
        const kanjiMap = {
            'year': dateOptions.years,
            'month': dateOptions.months,
            'date': dateOptions.dates,
            'day': dateOptions.daysOfWeek,
        };

        components.forEach(comp => {
            const group = document.createElement('div');
            group.className = 'dropdown-group';

            const labelText = comp.id
                .replace('day2', '曜日2')
                .replace('month2', '月2')
                .replace('day_count', '日数')
                .replace('year', '年')
                .replace('month', '月')
                .replace('date', '日にち')
                .replace('day', '曜日');

            const label = document.createElement('label');
            label.textContent = labelText;
            label.setAttribute('for', `mode${mode}-${comp.id}`);

            const selectEl = document.createElement('select');
            selectEl.id = `mode${mode}-${comp.id}`;
            selectEl.name = `mode${mode}-${comp.id}`;
            
            const optionsData = kanjiMap[comp.type] || [];
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `-- ${labelText}を選択 --`;
            selectEl.appendChild(defaultOption);

            optionsData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.kanji; 
                option.textContent = `${item.kanji} (${item.kana})`;
                selectEl.appendChild(option);
            });

            group.appendChild(label);
            group.appendChild(selectEl);
            container.appendChild(group);
        });
    }
    
    window.speakCurrentQuestion = function(mode) {
        if (isAnswered) return;
        
        let textToSpeak = '';
        if (mode === 2) {
            const currentQ = questionData[currentQuestionIndex];
            textToSpeak = currentQ.text;
            document.getElementById('play-audio-btn').textContent = '再生中...';
            setTimeout(() => {
                document.getElementById('play-audio-btn').textContent = 'もう一度再生';
            }, 3000); 
        } else if (mode === 3) {
            textToSpeak = document.getElementById('mode3-question-text').textContent;
        }

        if (textToSpeak) {
            speak(textToSpeak);
        }
    }

    // --- 回答チェック機能 ---

    window.checkAnswer = async function(mode) { 
        if (isAnswered) return;
        isAnswered = true;
        let correct = false;
        
        const checkBtn = document.getElementById(`mode${mode}-check-btn`);
        checkBtn.disabled = true; 
        
        const currentQ = questionData[currentQuestionIndex];
        let correctKanjiText = '';

        if (mode === 1) {
            const correctKana = currentQ.kana;
            const buttons = document.querySelectorAll('#mode1-choices .choice-btn');
            
            buttons.forEach(btn => {
                const value = btn.getAttribute('data-value');
                if (value === correctKana) {
                    btn.classList.add('correct', 'answered');
                    if (value === selectedChoice) {
                        correct = true;
                    }
                } else if (value === selectedChoice) {
                    btn.classList.add('incorrect', 'answered');
                } else {
                    btn.classList.add('answered');
                }
            });
        
        } else if (mode === 2) {
            const selectedMonth = document.getElementById('mode2-month').value;
            const selectedDate = document.getElementById('mode2-date').value;
            const selectedDay = document.getElementById('mode2-day').value;
            
            const correctMonth = currentQ.month;
            const correctDate = currentQ.date;
            const correctDay = currentQ.day;

            correct = (selectedMonth === correctMonth && selectedDate === correctDate && selectedDay === correctDay);

        } else if (mode === 3) {
            const correctAnswers = currentQ.answer;
            correct = true;

            for (const key in correctAnswers) {
                const selectEl = document.getElementById(`mode3-${key}`);
                
                if (!selectEl) continue; 

                const selectedValue = selectEl.value;

                if (!selectedValue || selectedValue !== correctAnswers[key]) {
                    correct = false;
                    selectEl.style.borderColor = cssVars.incorrect; 
                } else {
                    selectEl.style.borderColor = cssVars.correct;
                }
                
                correctKanjiText += `${correctAnswers[key]}`;
            }
        }
        
        let feedback = '';
        
        if (correct) {
            const GAME_ID = `${GAME_BASE_ID}_${mode}`; 
            let pointAdded = false;
            
            try {
                if (typeof window.addPuzzlePoints === 'function') {
                    pointAdded = await window.addPuzzlePoints(currentQuestionIndex + 1, GAME_ID); 
                }
            } catch (error) {
                console.warn("Failed to add puzzle points:", error);
            }
            
            score++;
            
            if (pointAdded) {
                document.getElementById('daily-point-limit').textContent = `🎉 ポイント獲得！ (+1pt)`;
                feedback = `<span style="color:${cssVars.correct};"><i class="fa-solid fa-circle-check"></i> 大正解！ (+1pt)</span>`;
            } else {
                document.getElementById('daily-point-limit').textContent = `(今日はポイント獲得済み)`;
                feedback = `<span style="color:${cssVars.correct};"><i class="fa-solid fa-circle-check"></i> 正解です！</span>`;
            }

            setTimeout(() => {
                nextQuestion(mode);
            }, 1500); 

        } else {
            feedback = `<span style="color:${cssVars.incorrect};"><i class="fa-solid fa-circle-xmark"></i> 残念。もう一度考えてみましょう。</span>`;
            
            isAnswered = false;
            checkBtn.disabled = false;
        }
        
        document.getElementById(`feedback-message-${mode}`).innerHTML = feedback;
    }

    function nextQuestion(mode) {
        currentQuestionIndex++;
        if (currentQuestionIndex < maxQuestions) {
            loadQuestion(mode);
            if (mode === 3) {
                 setTimeout(() => speakCurrentQuestion(3), 500); 
            }
        } else {
            showResults(mode);
        }
    }

    function showResults(mode) {
        document.getElementById(`mode${mode}-game`).style.display = 'none';
        
        const scoreboard = document.getElementById('scoreboard');
        scoreboard.style.display = 'block';

        document.getElementById('score-text').innerHTML = `<p>お疲れ様でした！</p>
            <p style="font-size:2em; margin:10px 0;">あなたのスコアは <span style="color:var(--accent);">${score}</span> / ${maxQuestions} 点です。</p>`;
        
        if (score >= maxQuestions * 0.7) { 
            document.getElementById('score-text').innerHTML += 
                `<p style="color:var(--accent); font-weight:900;">🎉 素晴らしい！ポイント獲得チャンスを活かしました！ 🎉</p>`;
        } else {
            document.getElementById('score-text').innerHTML += 
                `<p style="font-weight:700;">もう一度チャレンジして、ポイントを獲得しましょう！</p>`;
        }
    }


    // --- 初期化 ---
    document.addEventListener('DOMContentLoaded', () => {
        resetGame();
        if (synth.getVoices().length === 0) {
            synth.addEventListener('voiceschanged', () => {
                voices = synth.getVoices();
            });
        }
    });