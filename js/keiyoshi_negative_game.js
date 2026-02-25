// 提供されたJSONデータから抽出
    const rawData = [
        { "kanji": "美味しい", "hiragana": "おいしい", "type": "i", "meaning": "delicious" },
        { "kanji": "高い", "hiragana": "たかい", "type": "i", "meaning": "expensive" },
        { "kanji": "暑い", "hiragana": "あつい", "type": "i", "meaning": "hot" },
        { "kanji": "寒い", "hiragana": "さむい", "type": "i", "meaning": "cold" },
        { "kanji": "難しい", "hiragana": "むずかしい", "type": "i", "meaning": "difficult" },
        { "kanji": "忙しい", "hiragana": "いそがしい", "type": "i", "meaning": "busy" },
        { "kanji": "元気", "hiragana": "げんきな", "type": "na", "meaning": "healthy/energetic" },
        { "kanji": "暇", "hiragana": "ひまな", "type": "na", "meaning": "free (time)" },
        { "kanji": "静か", "hiragana": "しずかな", "type": "na", "meaning": "quiet" },
        { "kanji": "簡単", "hiragana": "かんたんな", "type": "na", "meaning": "easy/simple" },
        { "kanji": "きれい", "hiragana": "きれいな", "type": "na", "meaning": "clean/beautiful" }
    ];

    function getNegative(hiragana, type) {
        if (type === 'i') {
            if (hiragana === 'よい') return 'よくないです'; 
            return hiragana.slice(0, -1) + 'くないです';
        } else {
            let stem = hiragana.endsWith('な') ? hiragana.slice(0, -1) : hiragana;
            return stem + 'ではありません';
        }
    }

    // --- Game 1 Data (Q&A) ---
    let g1Items = [];
    
    function generateG1Data() {
        g1Items = rawData.map(item => {
            const neg = getNegative(item.hiragana, item.type);
            let wrong1, wrong2;
            
            if (item.type === 'i') {
                wrong1 = item.hiragana + 'じゃないです'; 
                wrong2 = item.hiragana + 'くありません'; 
            } else {
                let stem = item.hiragana.endsWith('な') ? item.hiragana.slice(0, -1) : item.hiragana;
                wrong1 = stem + 'くないです';
                wrong2 = stem + 'なではありません'; 
            }

            return {
                type: item.type,
                q: `${item.hiragana}ですか？`,
                correct: `いいえ、${neg}。`,
                choices: [
                    `いいえ、${neg}。`, 
                    `いいえ、${wrong1}。`, 
                    `いいえ、${wrong2}。`
                ]
            };
        });
    }
    generateG1Data();

    // --- Game 2 Data (Puzzle) ---
    const g2Data = [
        { eng: 'Is this car expensive?', blocks: ['この', 'くるま', 'は', 'たかい', 'ですか'], correctOrder: ['この','くるま','は','たかい','ですか'] },
        { eng: 'Is Sato-san energetic?', blocks: ['さとうさん', 'は', 'げんき', 'ですか'], correctOrder: ['さとうさん','は','げんき','ですか'] },
        { eng: 'Is that room quiet?', blocks: ['その', 'へや', 'は', 'しずか', 'ですか'], correctOrder: ['その','へや','は','しずか','ですか'] },
        { eng: 'Is Japanese difficult?', blocks: ['にほんご', 'は', 'むずかしい', 'ですか'], correctOrder: ['にほんご','は','むずかしい','ですか'] },
        { eng: 'Is this book interesting?', blocks: ['この', 'ほん', 'は', 'おもしろい', 'ですか'], correctOrder: ['この','ほん','は','おもしろい','ですか'] }
    ];

    // --- Game 3 Data (Conversation) ---
    const g3Data = [
        { 
            q: 'やきにくは おいしいですか？', 
            correctText: 'おいしくないです', 
            correctIcon: 'fa-face-frown', 
            wrongText: 'おいしいです', 
            wrongIcon: 'fa-face-grin-hearts' 
        },
        { 
            q: 'きょうは ひまですか？', 
            correctText: 'ひまではありません', 
            correctIcon: 'fa-briefcase', 
            wrongText: 'ひまです', 
            wrongIcon: 'fa-gamepad' 
        },
        { 
            q: 'この パソコンは たかいですか？', 
            correctText: 'たかくないです (Cheap)', 
            correctIcon: 'fa-tag', 
            wrongText: 'たかいです (Expensive)', 
            wrongIcon: 'fa-sack-dollar' 
        },
        { 
            q: 'へやは きれいですか？', 
            correctText: 'きれいではありません (Dirty)', 
            correctIcon: 'fa-trash-can', 
            wrongText: 'きれいです (Clean)', 
            wrongIcon: 'fa-sparkles' 
        }
    ];

    // --- State Management ---
    let g1CurrentIndex = 0;
    let g1CurrentType = 'i';
    let g1FilteredItems = [];

    let g2CurrentIndex = 0;
    let g2CurrentBlocks = [];

    let g3CurrentIndex = 0;

    // --- Tab Switching ---
    function switchGame(id) {
        document.querySelectorAll('.game-section').forEach(el => el.classList.add('hidden'));
        document.getElementById(`game${id}`).classList.remove('hidden');
        document.querySelectorAll('.g-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.g-tab')[id-1].classList.add('active');
        
        if(id === 1) loadG1();
        if(id === 2) loadG2();
        if(id === 3) loadG3();
    }

    // --- Game 1 Logic ---
    function setG1Type(type) {
        g1CurrentType = type;
        document.querySelectorAll('.s-tab').forEach(el => el.classList.remove('active'));
        const btnIndex = type === 'i' ? 0 : 1;
        document.querySelectorAll('.s-tab')[btnIndex].classList.add('active');
        g1CurrentIndex = 0;
        loadG1();
    }

    function loadG1() {
        g1FilteredItems = g1Items.filter(item => item.type === g1CurrentType);
        
        if (g1CurrentIndex >= g1FilteredItems.length) {
            document.getElementById('g1-q').innerText = "Clear! よくできました！";
            document.getElementById('g1-choices').textContent = "";
            document.getElementById('g1-next').style.display = 'none';
            document.getElementById('g1-result').textContent = '<button class="next-btn" style="display:block" onclick="location.reload()">もういちど</button>';
            return;
        }

        const data = g1FilteredItems[g1CurrentIndex];
        document.getElementById('g1-q').innerText = data.q;
        document.getElementById('g1-result').innerText = '';
        document.getElementById('g1-next').style.display = 'none';

        const grid = document.getElementById('g1-choices');
        grid.textContent = '';
        
        const shuffled = [...data.choices].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = choice;
            btn.onclick = () => checkG1(btn, choice, data.correct);
            grid.appendChild(btn);
        });
    }

    async function checkG1(btn, choice, correct) {
        if (document.getElementById('g1-next').style.display === 'block') return;

        if (choice === correct) {
            btn.classList.add('selected-correct');
            // ポイント付与
            const added = await window.addPuzzlePoints(g1CurrentIndex, `kei_neg_g1_${g1CurrentType}`);
            const ptText = added ? ' <span class="point-get">(+1pt)</span>' : '';
            
            document.getElementById('g1-result').textContent = `<span class="correct"><i class="fa-regular fa-circle"></i> せいかい！${ptText}</span>`;
        } else {
            btn.classList.add('selected-wrong');
            document.getElementById('g1-result').textContent = '<span class="wrong"><i class="fa-solid fa-xmark"></i> ざんねん...</span>';
        }
        document.getElementById('g1-next').style.display = 'block';
    }

    function nextG1() {
        g1CurrentIndex++;
        loadG1();
    }

    // --- Game 2 Logic ---
    function loadG2() {
        if (g2CurrentIndex >= g2Data.length) {
            document.getElementById('game2').textContent = '<h2>Clear! 全問正解！</h2><button class="next-btn" style="display:block" onclick="location.reload()">もういちど</button>';
            return;
        }
        const data = g2Data[g2CurrentIndex];
        document.getElementById('g2-eng').innerText = data.eng;
        document.getElementById('g2-dropzone').textContent = '';
        document.getElementById('g2-result').innerText = '';
        document.getElementById('g2-next').style.display = 'none';

        const bank = document.getElementById('g2-bank');
        bank.textContent = '';
        
        let blocksToShow = [...data.blocks].sort(() => Math.random() - 0.5);

        blocksToShow.forEach((word) => {
            const el = document.createElement('div');
            el.className = 'block';
            el.innerText = word;
            el.onclick = () => addToZone(word, el);
            bank.appendChild(el);
        });
        g2CurrentBlocks = [];
    }

    function addToZone(word, element) {
        if (element.classList.contains('used')) return;
        g2CurrentBlocks.push(word);
        element.classList.add('used');

        const zone = document.getElementById('g2-dropzone');
        const piece = document.createElement('div');
        piece.className = 'block';
        piece.style.cursor = 'default';
        piece.style.boxShadow = 'none';
        piece.innerText = word;
        zone.appendChild(piece);
    }

    function resetG2Puzzle() {
        g2CurrentBlocks = [];
        document.getElementById('g2-dropzone').textContent = '';
        document.getElementById('g2-result').innerText = '';
        const blocks = document.querySelectorAll('#g2-bank .block');
        blocks.forEach(b => b.classList.remove('used'));
    }

    async function checkG2() {
        const data = g2Data[g2CurrentIndex];
        const attempt = JSON.stringify(g2CurrentBlocks);
        const ans = JSON.stringify(data.correctOrder);

        if (attempt === ans) {
            const added = await window.addPuzzlePoints(g2CurrentIndex, 'kei_neg_g2');
            const ptText = added ? ' <span class="point-get">(+1pt)</span>' : '';

            document.getElementById('g2-result').textContent = `<span class="correct">Great! せいかい！${ptText}</span>`;
            document.getElementById('g2-next').style.display = 'block';
        } else {
            document.getElementById('g2-result').textContent = '<span class="wrong">Try again...</span>';
        }
    }

    function nextG2() {
        g2CurrentIndex++;
        loadG2();
    }

    // --- Game 3 Logic ---
    function loadG3() {
        if (g3CurrentIndex >= g3Data.length) {
            document.getElementById('game3').textContent = '<h2>Congratulations!</h2><button class="next-btn" style="display:block" onclick="location.reload()">最初から</button>';
            return;
        }
        const data = g3Data[g3CurrentIndex];
        document.getElementById('g3-q').innerText = data.q;
        document.getElementById('g3-result').innerText = '';
        document.getElementById('g3-next').style.display = 'none';

        const grid = document.getElementById('g3-choices');
        grid.textContent = '';

        const card1 = createImgCard(data.correctText, data.correctIcon, true);
        const card2 = createImgCard(data.wrongText, data.wrongIcon, false);

        const cards = Math.random() > 0.5 ? [card1, card2] : [card2, card1];
        cards.forEach(c => grid.appendChild(c));
    }

    function createImgCard(text, iconClass, isCorrect) {
        const div = document.createElement('div');
        div.className = 'img-card';
        div.textContent = `<i class="fa-solid ${iconClass}"></i><div>${text}</div>`;
        div.onclick = async () => {
             if (document.getElementById('g3-next').style.display === 'block') return;

             if (isCorrect) {
                 div.classList.add('correct-ans');
                 const added = await window.addPuzzlePoints(g3CurrentIndex, 'kei_neg_g3');
                 const ptText = added ? ' <span class="point-get">(+1pt)</span>' : '';
                 document.getElementById('g3-result').textContent = `<span class="correct">せいかい！${ptText}</span>`;
             } else {
                 div.classList.add('wrong-ans');
                 document.getElementById('g3-result').textContent = '<span class="wrong">ちがいます...</span>';
             }
             document.getElementById('g3-next').style.display = 'block';
        };
        return div;
    }

    function nextG3() {
        g3CurrentIndex++;
        loadG3();
    }

    // 初期化
    window.onload = function() {
        loadG1();
    };