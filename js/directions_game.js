// --- データ ---
    const places = [
        { id: 10, name: "コンビニ", kana: "こんびに", icon: "fa-store", color: "#ff9800" },
        { id: 11, name: "駅", kana: "えき", icon: "fa-train", color: "#795548" },
        { id: 12, name: "ホテル", kana: "ほてる", icon: "fa-hotel", color: "#3f51b5" },
        { id: 13, name: "郵便局", kana: "ゆうびんきょく", icon: "fa-envelope", color: "#f44336" },
        { id: 14, name: "トイレ", kana: "といれ", icon: "fa-restroom", color: "#00bcd4" },
        { id: 15, name: "レストラン", kana: "れすとらん", icon: "fa-utensils", color: "#4caf50" },
        { id: 16, name: "学校", kana: "がっこう", icon: "fa-school", color: "#9c27b0" },
        { id: 17, name: "病院", kana: "びょういん", icon: "fa-hospital", color: "#e91e63" },
        { id: 18, name: "空港", kana: "くうこう", icon: "fa-plane", color: "#2196f3" },
        { id: 19, name: "お土産屋", kana: "おみやげや", icon: "fa-gift", color: "#ff5722" }
    ];

    const commands = [
        { key: "up", text: "まっすぐ いってください" },
        { key: "down", text: "うしろに もどってください" },
        { key: "left", text: "ひだりに まがってください" },
        { key: "right", text: "みぎに まがってください" }
    ];

    // --- 音声合成 ---
    const synth = window.speechSynthesis;
    let voices = [];
    if(speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => { voices = synth.getVoices(); };
    }
    setTimeout(() => { voices = synth.getVoices(); }, 500);

    // 発音修正用辞書
    function cleanTextForSpeech(text) {
        let t = text.replace(/\(.*?\)/g, "").replace(/（.*?）/g, "");
        t = t.replace(/行く/g, "いく");
        t = t.replace(/行って/g, "いって");
        t = t.replace(/行き/g, "いき");
        t = t.replace(/右/g, "みぎ");
        t = t.replace(/左/g, "ひだり");
        t = t.replace(/角/g, "かど");
        t = t.replace(/1つ目/g, "ひとつめ");
        t = t.replace(/2つ目/g, "ふたつめ");
        t = t.replace(/3つ目/g, "みっつめ");
        t = t.replace(/4つ目/g, "よっつめ");
        return t;
    }

    function speak(text) {
        if (synth.speaking) synth.cancel();
        const t = cleanTextForSpeech(text);
        const utter = new SpeechSynthesisUtterance(t);
        utter.lang = 'ja-JP';
        utter.rate = 0.9;
        const jp = voices.find(v => v.lang.includes('ja'));
        if(jp) utter.voice = jp;
        synth.speak(utter);
    }

    // --- 音声認識 ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    if(SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = false;
    }

    function isSimilar(transcript, keyword) {
        return transcript.includes(keyword); 
    }

    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(e => e.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0,0);
    };

    // ==========================================
    // 1. 単語練習 (カウンター追加)
    // ==========================================
    const vGrid = document.getElementById('vocab-grid');
    places.forEach(p => {
        const div = document.createElement('div');
        div.className = 'vocab-card';
        div.innerHTML = `<div class="vocab-icon"><i class="fa-solid ${p.icon}" style="color:${p.color}"></i></div><div>${p.name}</div><div style="font-size:0.8em; color:#888;">${p.kana}</div>`;
        div.onclick = () => speak(p.kana);
        vGrid.appendChild(div);
    });
    // 方向・数
    const extras = [
        {n:"1つ目",k:"ひとつめ",i:"fa-1"}, {n:"2つ目",k:"ふたつめ",i:"fa-2"},
        {n:"3つ目",k:"みっつめ",i:"fa-3"}, {n:"4つ目",k:"よっつめ",i:"fa-4"},
        {n:"右",k:"みぎ",i:"fa-arrow-right"}, {n:"左",k:"ひだり",i:"fa-arrow-left"},
        {n:"まっすぐ",k:"まっすぐ",i:"fa-arrow-up"}, {n:"角",k:"かど",i:"fa-turn-up"}
    ];
    extras.forEach(d => {
        const div = document.createElement('div');
        div.className = 'vocab-card';
        div.innerHTML = `<div class="vocab-icon"><i class="fa-solid ${d.i}" style="color:#555"></i></div><div>${d.n}</div><div style="font-size:0.8em; color:#888;">${d.k}</div>`;
        div.onclick = () => speak(d.k);
        vGrid.appendChild(div);
    });

    // ==========================================
    // 2. 質問練習
    // ==========================================
    let askTarget = null;
    window.setupAskGame = () => {
        askTarget = places[Math.floor(Math.random() * places.length)];
        document.getElementById('ask-target-text').textContent = askTarget.name;
        document.getElementById('ask-target-kana').textContent = askTarget.name;
        document.getElementById('ask-target-icon').innerHTML = `<i class="fa-solid ${askTarget.icon}" style="color:${askTarget.color}"></i>`;
        document.getElementById('ask-feedback').textContent = "";
    };
    window.checkSpeechGame2 = () => {
        if(!recognition) return alert("マイクが使えません");
        const btn = document.getElementById('mic-btn-ask');
        btn.classList.add('listening');
        document.getElementById('ask-feedback').textContent = "聞いています...";
        
        recognition.start();
        recognition.onresult = (e) => {
            const tr = e.results[0][0].transcript;
            if(isSimilar(tr, askTarget.name)) {
                document.getElementById('ask-feedback').textContent = "OK! すばらしい！";
                document.getElementById('ask-feedback').style.color = "#4caf50";
                speak("すばらしいです");
            } else {
                document.getElementById('ask-feedback').textContent = `もう一度！`;
                document.getElementById('ask-feedback').style.color = "#f44336";
                speak("もういちど おねがいします");
            }
            btn.classList.remove('listening');
        };
        recognition.onend = () => btn.classList.remove('listening');
    };
    setupAskGame();

    // ==========================================
    // 3. 聞いて動こう
    // ==========================================
    let currentListenCmd = null;
    window.playRandomCommand = () => {
        currentListenCmd = commands[Math.floor(Math.random() * commands.length)];
        document.getElementById('listen-feedback').textContent = "聞いてください...";
        speak(currentListenCmd.text);
    };
    window.checkListenAnswer = (key) => {
        if(!currentListenCmd) return;
        if(key === currentListenCmd.key) {
            document.getElementById('listen-feedback').textContent = "せいかい！";
            document.getElementById('listen-feedback').style.color = "#4caf50";
            speak("せいかいです");
            currentListenCmd = null;
        } else {
            document.getElementById('listen-feedback').textContent = "ちがいます";
            document.getElementById('listen-feedback').style.color = "#f44336";
            speak("ちがいます");
        }
    };

    // ==========================================
    // 4 & 5. マップ生成 (横長 9x5)
    // ==========================================
    const GRID_W = 9;
    const GRID_H = 5;
    let mapGrid = []; 
    let playerPos = {x:0, y:0};
    let targetObj = null; 
    let targetPos = {x:0, y:0};
    let distractions = []; 
    let navigationText = ""; 
    let currentGameMode = 4; 

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateCityMap() {
        // 初期化: 建物(2)
        mapGrid = Array(GRID_H).fill().map(() => Array(GRID_W).fill(2));
        
        // 道路(1)
        for(let x=0; x<GRID_W; x+=2) for(let y=0; y<GRID_H; y++) mapGrid[y][x] = 1;
        for(let y=0; y<GRID_H; y+=2) for(let x=0; x<GRID_W; x++) mapGrid[y][x] = 1;

        // ランダムで川(3)と橋(4) (奇数列 x=3 or 5 or 7)
        if(Math.random() > 0.3) {
            const riverX = 3 + (Math.floor(Math.random()*2) * 2); // 3, 5, 7? No, roads are even. Buildings are odd. River replaces building column.
            for(let y=0; y<GRID_H; y++) {
                if(mapGrid[y][riverX] === 1) mapGrid[y][riverX] = 4; // Bridge
                else mapGrid[y][riverX] = 3; // River
            }
        }

        // スタート地点
        let validStart = false;
        while(!validStart) {
            let sx = (Math.floor(Math.random()*5))*2;
            let sy = (Math.floor(Math.random()*3))*2;
            if(sx < GRID_W && sy < GRID_H && mapGrid[sy][sx] === 1) {
                playerPos = {x:sx, y:sy};
                validStart = true;
            }
        }

        // 建物配置
        let availablePlaces = shuffleArray([...places]);
        targetObj = availablePlaces.pop();
        distractions = [];
        let placedCoords = [];

        function getValidBuildingPos() {
            for(let i=0; i<100; i++) {
                let bx = 1 + (Math.floor(Math.random()*4))*2;
                let by = 1 + (Math.floor(Math.random()*2))*2;
                if(bx >= GRID_W || by >= GRID_H) continue;
                if(mapGrid[by][bx] === 3) continue; // River
                let occupied = placedCoords.some(c => c.x === bx && c.y === by);
                if(!occupied) return {x:bx, y:by};
            }
            return null;
        }

        targetPos = getValidBuildingPos();
        placedCoords.push(targetPos);

        const dummyCount = 5;
        for(let i=0; i<dummyCount; i++) {
            let p = getValidBuildingPos();
            if(p && availablePlaces.length > 0) {
                let dummy = availablePlaces.pop();
                distractions.push({pos:p, obj:dummy});
                placedCoords.push(p);
            }
        }
    }

    function renderMap() {
        const wrapper = document.getElementById('map-wrapper');
        Array.from(wrapper.children).forEach(c => { if(c.id !== 'player') c.remove(); });

        for(let y=0; y<GRID_H; y++) {
            for(let x=0; x<GRID_W; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                const type = mapGrid[y][x];

                if(type === 1 || type === 4) { 
                    if(type === 4) cell.className += ' bridge';
                    else cell.className += ' road';
                    if(type === 1) {
                        let neighbors = 0;
                        if(y>0 && mapGrid[y-1][x]!==2 && mapGrid[y-1][x]!==3) neighbors++;
                        if(y<GRID_H-1 && mapGrid[y+1][x]!==2 && mapGrid[y+1][x]!==3) neighbors++;
                        if(x>0 && mapGrid[y][x-1]!==2 && mapGrid[y][x-1]!==3) neighbors++;
                        if(x<GRID_W-1 && mapGrid[y][x+1]!==2 && mapGrid[y][x+1]!==3) neighbors++;
                        
                        if(neighbors > 2) cell.className += ' cross';
                        else if(x%2===0 && y%2!==0) cell.className += ' v-road';
                        else cell.className += ' h-road';
                    }
                } else if (type === 3) {
                    cell.className += ' water';
                } else {
                    cell.className += ' block';
                }

                // アイコン描画
                if(currentGameMode === 5) {
                    // Game 5: 全て同じアイコン
                    if((x === targetPos.x && y === targetPos.y) || distractions.some(d => d.pos.x===x && d.pos.y===y)) {
                        cell.innerHTML = `<i class="fa-solid fa-building building-icon" style="color:#607d8b;"></i>`;
                    }
                } else {
                    // Game 4: アイコンのみ（文字なし）
                    if(x === targetPos.x && y === targetPos.y) {
                        cell.innerHTML = `<i class="fa-solid ${targetObj.icon} building-icon" style="color:${targetObj.color}"></i>`;
                    }
                    distractions.forEach(d => {
                        if(d.pos.x === x && d.pos.y === y) {
                            cell.innerHTML = `<i class="fa-solid ${d.obj.icon} building-icon" style="color:${d.obj.color}"></i>`;
                        }
                    });
                }
                wrapper.appendChild(cell);
            }
        }
        updatePlayerUI();
    }

    function updatePlayerUI() {
        const p = document.getElementById('player');
        const wPct = 100 / GRID_W;
        const hPct = 100 / GRID_H;
        p.style.left = (playerPos.x * wPct + 1) + "%";
        p.style.top = (playerPos.y * hPct + 2) + "%";
        p.style.width = (wPct * 0.6) + "%";
        p.style.height = (hPct * 0.6) + "%";
    }

    // --- ナビ生成ロジック ---
    function calculateRoute() {
        let queue = [{x:playerPos.x, y:playerPos.y, path:[]}];
        let visited = new Set();
        let goalNode = null;

        // BFSでターゲット(建物)へ
        while(queue.length > 0) {
            let curr = queue.shift();
            let key = `${curr.x},${curr.y}`;
            if(visited.has(key)) continue;
            visited.add(key);
            
            if(curr.x === targetPos.x && curr.y === targetPos.y) {
                goalNode = curr;
                break;
            }
            const dirs = [[0,-1],[1,0],[0,1],[-1,0]]; // 0:Up, 1:Right, 2:Down, 3:Left
            dirs.forEach((d, i) => {
                let nx = curr.x + d[0];
                let ny = curr.y + d[1];
                if(nx>=0 && nx<GRID_W && ny>=0 && ny<GRID_H) {
                    // 川以外は通れる (建物はゴールのみOK)
                    const type = mapGrid[ny][nx];
                    if(type !== 3) { 
                        queue.push({x:nx, y:ny, path:[...curr.path, i]});
                    }
                }
            });
        }

        if(!goalNode) return "すぐ ちかく です。";
        let steps = goalNode.path;
        if(steps.length === 0) return "めのまえ です。";

        // --- ルート解説 ---
        // 1. 最初の直進
        let currentDir = steps[0];
        let dirName = ["うえ","みぎ","した","ひだり"][currentDir];
        let script = `まずは、${dirName}に まっすぐ いって、`;

        // 2. 曲がるポイントを探す
        let turnIndex = -1;
        let turnDir = -1;
        for(let i=1; i<steps.length; i++) {
            if(steps[i] !== currentDir) {
                turnIndex = i;
                turnDir = steps[i];
                break;
            }
        }

        // 3. 曲がるか直進か
        if(turnIndex === -1) {
            // 曲がらない -> 最後に左右どちらか
            // 到着直前の道(last road)からターゲット(target)への向き
            // stepsの最後の1つは「道路から建物へ」の動き
            let lastMove = steps[steps.length-1];
            // ずっと直進してきた場合、lastMove == currentDir。つまり「正面の建物」
            script += "そのまま まっすぐ いけば あります。";
        } else {
            // 曲がる
            // 交差点を数える
            let cornerCount = 0;
            let checkX = playerPos.x;
            let checkY = playerPos.y;
            const dx = [0,1,0,-1];
            const dy = [-1,0,1,0];
            
            for(let k=0; k<turnIndex; k++) {
                checkX += dx[currentDir];
                checkY += dy[currentDir];
                let roads = 0;
                for(let d=0; d<4; d++) {
                    let tx = checkX + dx[d];
                    let ty = checkY + dy[d];
                    if(tx>=0 && tx<GRID_W && ty>=0 && ty<GRID_H && (mapGrid[ty][tx]===1 || mapGrid[ty][tx]===4)) roads++;
                }
                if(roads > 2) cornerCount++;
            }

            let rel = turnDir - currentDir;
            if(rel === -3) rel = 1;
            if(rel === 3) rel = -1;
            let turnWord = (rel === 1) ? "みぎ" : "ひだり";
            let countWord = (cornerCount === 0) ? "すぐ" : (cornerCount + 1) + "つめの かどを";
            
            script += `${countWord} ${turnWord}に まがって ください。`;
        }

        // 4. 最後に「その右/左の建物です」を追加
        // ゴール直前のステップを取得
        // path配列があれば楽だが、stepsしか保存していないので簡易計算
        // stepsの最後のアクションが「道路 -> 建物」
        // stepsの最後から2番目のアクションが「曲がった後の道路移動」
        
        // 最終的な進行方向 (建物に入る直前の道路上の向き)
        let finalRoadDir = -1;
        // turnIndex以降、再度曲がる可能性もあるが、今回は「1回曲がる」前提の簡易案内
        if(turnIndex !== -1) finalRoadDir = turnDir;
        else finalRoadDir = currentDir;

        // 建物へ入る方向 (stepsの最後)
        let enterDir = steps[steps.length-1];

        // 道路進行方向(finalRoadDir)に対して、建物(enterDir)がどっちにあるか
        // 例: 北(0)に進んでいて、建物へは東(1)に入る -> 右側
        let sideRel = enterDir - finalRoadDir;
        if(sideRel === -3) sideRel = 1;
        if(sideRel === 3) sideRel = -1;

        if(sideRel === 1) script += " その みぎがわの たてもの です。";
        else if(sideRel === -1) script += " その ひだりがわの たてもの です。";
        else script += " その つきあたりの たてもの です。";

        return script;
    }

    // --- Game 4 ---
    window.initGame4 = () => {
        currentGameMode = 4;
        showScreen('game-screen');
        generateCityMap();
        renderMap();
        
        document.getElementById('game5-phase1').style.display = 'none';
        document.getElementById('map-controls').style.display = 'block';
        document.getElementById('replay-nav-btn').style.display = 'none';
        document.getElementById('replay-task-btn').style.display = 'block';
        
        document.getElementById('game-title').textContent = "Mission: 探せ！";
        setTimeout(() => speakTask(), 500);
    };

    window.speakTask = () => {
        speak(`${targetObj.kana} に いって ください`);
    }

    // --- Game 5 ---
    window.initGame5 = () => {
        currentGameMode = 5;
        showScreen('game-screen');
        generateCityMap();
        renderMap();
        
        document.getElementById('game5-phase1').style.display = 'block';
        document.getElementById('map-controls').style.display = 'none';
        document.getElementById('replay-nav-btn').style.display = 'none';
        document.getElementById('replay-task-btn').style.display = 'none';
        
        document.getElementById('g5-target-name').textContent = targetObj.name;
        document.getElementById('game-title').textContent = "Mission: 聞き込み";
        document.getElementById('g5-status').textContent = "";
    };

    window.game5SpeechCheck = () => {
        if(!recognition) return alert("マイク不可");
        const btn = document.getElementById('g5-mic-btn');
        btn.classList.add('listening');
        document.getElementById('g5-status').textContent = "聞いています...";
        
        recognition.start();
        recognition.onresult = (e) => {
            const tr = e.results[0][0].transcript;
            if(isSimilar(tr, targetObj.name)) {
                btn.classList.remove('listening');
                startNavigationPhase();
            } else {
                document.getElementById('g5-status').textContent = "もういちど...";
                speak("もういちど おねがいします");
                btn.classList.remove('listening');
            }
        };
        recognition.onend = () => btn.classList.remove('listening');
    };

    function startNavigationPhase() {
        document.getElementById('game5-phase1').style.display = 'none';
        document.getElementById('map-controls').style.display = 'block';
        document.getElementById('replay-nav-btn').style.display = 'block';
        
        navigationText = calculateRoute();
        speak("はい、わかりました。" + navigationText);
    }

    window.speakNavigation = () => {
        speak(navigationText);
    };

    // 移動
    window.movePlayer = (dx, dy) => {
        const nx = playerPos.x + dx;
        const ny = playerPos.y + dy;
        
        if(nx<0 || nx>=GRID_W || ny<0 || ny>=GRID_H) return;
        
        // 川(3)の上は通れない
        if(mapGrid[ny][nx] === 3) return;

        // 建物(2)の上に乗ることも許可する（乗ってゴール）
        
        playerPos.x = nx;
        playerPos.y = ny;
        updatePlayerUI();
    };

    window.checkArrival = () => {
        if(playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
            speak("とうちゃくしました！");
            alert("Congratulations! 正解です！");
            if(currentGameMode===4) initGame4();
            else initGame5();
        } else {
            speak("ここじゃ ありません");
            alert("建物の上に乗ってからボタンを押してください。");
        }
    };