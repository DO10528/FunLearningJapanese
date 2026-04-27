// --- 問題データ (JLPT N5レベル) ---
    const questions = [
        // 1. 基本の「は」と「の」 (Topic / Possession)
        { 
            parts: ["これ", "target", "わたし", "target", "ほん", "です"], 
            answers: ["は", "の"],
            english: "This is my book."
        },
        // 2. 移動「へ」 (Direction)
        { 
            parts: ["あした", "がっこう", "target", "いきます"], 
            answers: ["へ"],
            english: "I will go to school tomorrow."
        },
        // 3. 目的語「を」 (Object)
        { 
            parts: ["まいにち", "みず", "target", "のみます"], 
            answers: ["を"],
            english: "I drink water every day."
        },
        // 4. 場所「で」と目的語「を」 (Place of action)
        { 
            parts: ["図書館(としょかん)", "target", "ほん", "target", "よみます"], 
            answers: ["で", "を"],
            english: "I read a book at the library."
        },
        // 5. 時間「に」と移動「へ」 (Time / Direction)
        { 
            parts: ["７じ", "target", "うち", "target", "かえります"], 
            answers: ["に", "へ"],
            english: "I return home at 7 o'clock."
        },
        // 6. 手段「で」 (Means/Method)
        { 
            parts: ["バス", "target", "かいしゃ", "target", "いきます"], 
            answers: ["で", "へ"], /* "に"も可ですがプール内の正解として設定 */
            english: "I go to the office by bus."
        },
        // 7. 存在「に」と「が」(Existence - Inanimate)
        { 
            parts: ["つくえ", "の", "うえ", "target", "ペン", "target", "あります"], 
            answers: ["に", "が"],
            english: "There is a pen on the desk."
        },
        // 8. 存在「に」と「が」(Existence - Animate)
        { 
            parts: ["あそこ", "target", "おとこのこ", "target", "います"], 
            answers: ["に", "が"],
            english: "There is a boy over there."
        },
        // 9. 好き嫌い「が」 (Like/Dislike)
        { 
            parts: ["わたし", "は", "ねこ", "target", "すきです"], 
            answers: ["が"],
            english: "I like cats."
        },
        // 10. 共同動作「と」 (With someone)
        { 
            parts: ["ともだち", "target", "テニス", "target", "します"], 
            answers: ["と", "を"],
            english: "I play tennis with my friend."
        },
        // 11. 対象「に」 (Giving)
        { 
            parts: ["ともだち", "target", "プレゼント", "target", "あげます"], 
            answers: ["に", "を"],
            english: "I give a present to my friend."
        },
        // 12. 道具「で」 (Tool)
        { 
            parts: ["はし", "target", "ごはん", "target", "たべます"], 
            answers: ["で", "を"],
            english: "I eat rice with chopsticks."
        },
        // 13. 具体的な時間「に」 (Specific Time)
        { 
            parts: ["にちようび", "target", "デパート", "target", "いきます"], 
            answers: ["に", "へ"],
            english: "I go to the department store on Sunday."
        },
        // 14. 欲しい「が」 (Desire)
        { 
            parts: ["わたし", "は", "あたらしい", "くるま", "target", "ほしいです"], 
            answers: ["が"],
            english: "I want a new car."
        },
        // 15. 会う「に」 (Meeting someone)
        { 
            parts: ["えき", "で", "せんせい", "target", "あいました"], 
            answers: ["に"],
            english: "I met the teacher at the station."
        },
        // 16. 上手・下手「が」 (Skill)
        { 
            parts: ["かのじょ", "は", "うた", "target", "じょうずです"], 
            answers: ["が"],
            english: "She is good at singing."
        },
        // 17. 目的地「に」 (Entrance/Arrival)
        { 
            parts: ["おふろ", "target", "はいります"], 
            answers: ["に"],
            english: "I take a bath. (Enter the bath)"
        },
        // 18. 並列「と」 (And)
        { 
            parts: ["つくえ", "の", "うえ", "に", "ほん", "target", "ノート", "が", "あります"], 
            answers: ["と"],
            english: "There is a book and a notebook on the desk."
        },
        // 19. 理由「で」 (Cause/Reason)
        { 
            parts: ["びょうき", "target", "がっこう", "を", "やすみました"], 
            answers: ["で"],
            english: "I was absent from school because of illness."
        },
        // 20. 誰のもの「の」 (Whose)
        { 
            parts: ["あれ", "target", "わたし", "target", "かばん", "では", "ありません"], 
            answers: ["は", "の"],
            english: "That is not my bag."
        }
    ];

    // 選択肢プール (常にこれらから選ばせる)
    const particlePool = ["は", "を", "が", "に", "で", "へ", "と"];

    let currentQIndex = 0;
    let currentQuestion = null;
    let filledCount = 0; // 埋まった数
    
    // Firebase関数ダミー
    if (!(window.Antigravity && window.Antigravity.addPoint)) {
        window.addPointsToUser = async () => false;
    }
    const POINTS_PER_QUESTION = 1;

    const sentenceArea = document.getElementById('sentence-area');
    const choicesArea = document.getElementById('choices-area');
    const nextBtn = document.getElementById('next-btn');
    const feedbackMsg = document.getElementById('feedback-msg');
    const progressText = document.getElementById('progress-text');
    
    const sndCorrect = document.getElementById('snd-correct');
    const sndIncorrect = document.getElementById('snd-incorrect');

    window.onload = initGame;

    function initGame() {
        currentQIndex = 0;
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQIndex >= questions.length) {
            sentenceArea.textContent = "🎉 ぜんぶ クリア！";
            choicesArea.textContent = "";
            nextBtn.style.display = 'none';
            feedbackMsg.textContent = "おめでとう！";
            return;
        }

        currentQuestion = questions[currentQIndex];
        filledCount = 0;
        nextBtn.style.display = 'none';
        feedbackMsg.textContent = "";
        progressText.textContent = `だい ${currentQIndex + 1} もん`;

        // 文の生成
        sentenceArea.textContent = '';
        let ansIndex = 0;
        currentQuestion.parts.forEach(part => {
            if (part === "target") {
                const target = document.createElement('div');
                target.className = 'drop-target';
                target.dataset.answer = currentQuestion.answers[ansIndex];
                target.dataset.index = ansIndex; // 何番目の穴か
                sentenceArea.appendChild(target);
                ansIndex++;
            } else {
                const span = document.createElement('span');
                span.className = 'word-block';
                span.textContent = part;
                sentenceArea.appendChild(span);
            }
        });

        // 選択肢の生成 (正解を含みつつ、プールからランダムに数個追加)
        choicesArea.textContent = '';
        // 必要な正解
        let choices = [...currentQuestion.answers];
        // ダミーを追加 (合計5個くらいになるまで)
        while(choices.length < 5) {
            const rand = particlePool[Math.floor(Math.random() * particlePool.length)];
            if(!choices.includes(rand)) choices.push(rand);
        }
        // シャッフル
        choices.sort(() => Math.random() - 0.5);

        choices.forEach(char => {
            const chip = document.createElement('div');
            chip.className = 'particle-chip';
            chip.textContent = char;
            chip.dataset.char = char;
            setupDrag(chip); // ドラッグ設定
            choicesArea.appendChild(chip);
        });
    }

    // --- ドラッグ＆ドロップ制御 ---
    let draggedItem = null;
    let ghost = null;
    let touchOffsetX, touchOffsetY;

    function setupDrag(el) {
        el.addEventListener('mousedown', startDrag);
        el.addEventListener('touchstart', startDrag, {passive: false});
    }

    function startDrag(e) {
        e.preventDefault();
        // 既に配置済みのアイテムは動かせない
        if(e.target.classList.contains('placed')) return;

        draggedItem = e.target;
        const rect = draggedItem.getBoundingClientRect();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        touchOffsetX = clientX - rect.left;
        touchOffsetY = clientY - rect.top;

        // ゴースト生成
        ghost = draggedItem.cloneNode(true);
        ghost.className = 'particle-chip ghost';
        document.body.appendChild(ghost);
        moveGhost(clientX, clientY);

        draggedItem.style.opacity = '0.3';

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, {passive: false});
        document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        moveGhost(clientX, clientY);

        const target = getTargetSlot(clientX, clientY);
        document.querySelectorAll('.drop-target').forEach(s => s.classList.remove('drag-over'));
        
        // 既に埋まっているターゲットにはドロップ不可
        if (target && !target.hasChildNodes()) {
            target.classList.add('drag-over');
        }
    }

    function moveGhost(x, y) {
        if(ghost) {
            ghost.style.left = (x - touchOffsetX) + 'px';
            ghost.style.top = (y - touchOffsetY) + 'px';
        }
    }

    function onEnd(e) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        if(ghost) ghost.remove();
        ghost = null;
        draggedItem.style.opacity = '1';

        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const target = getTargetSlot(clientX, clientY);
        
        document.querySelectorAll('.drop-target').forEach(s => s.classList.remove('drag-over'));

        // ドロップ判定
        if (target && !target.hasChildNodes()) {
            // 正誤判定
            const correctAnswer = target.dataset.answer;
            const droppedChar = draggedItem.dataset.char;

            if (droppedChar === correctAnswer) {
                // 正解！
                playCorrect();
                const placedItem = draggedItem.cloneNode(true);
                placedItem.style.opacity = '1';
                placedItem.style.cursor = 'default';
                placedItem.classList.add('placed'); 
                
                placedItem.style.border = 'none';
                placedItem.style.boxShadow = 'none';
                placedItem.style.background = 'transparent';
                
                target.appendChild(placedItem);
                target.classList.add('filled', 'correct-anim');
                
                filledCount++;
                checkCompletion();

            } else {
                // 不正解
                playIncorrect();
                target.classList.add('incorrect-anim');
                feedbackMsg.textContent = "ちがうよ！";
                setTimeout(() => {
                    target.classList.remove('incorrect-anim');
                    feedbackMsg.textContent = "";
                }, 500);
            }
        }
        draggedItem = null;
    }

    function getTargetSlot(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        return el.closest('.drop-target');
    }

    function playCorrect() {
        sndCorrect.currentTime = 0;
        sndCorrect.play();
        feedbackMsg.textContent = "せいかい！";
        feedbackMsg.style.color = "green";
    }

    function playIncorrect() {
        sndIncorrect.currentTime = 0;
        sndIncorrect.play();
        feedbackMsg.style.color = "red";
    }

    // ★ async に変更してポイント加算を待機 (しなくても動作はするが、非同期処理であることを明示)
    async function checkCompletion() {
        if (filledCount >= currentQuestion.answers.length) {
            // ★★★ Firebaseポイント加算 ★★★
            // 全ての穴埋めが完了したらポイント付与
            const result = await window.Antigravity.addPoint('particle_quiz', currentQIndex);
            let msg = "よくできました！";
            if (result) {
                msg += " (+1pt)";
            }
            feedbackMsg.textContent = msg;
            // ★★★★★★★★★★★★★★★★★
            
            nextBtn.style.display = 'inline-block';
        }
    }

    window.nextQuestion = () => {
        currentQIndex++;
        loadQuestion();
    };