// --- データ ---
    const moneyTypes = [
        { val: 1, type: 'coin', class: 'coin-1', label: '1' },
        { val: 5, type: 'coin', class: 'coin-5', label: '5' },
        { val: 10, type: 'coin', class: 'coin-10', label: '10' },
        { val: 50, type: 'coin', class: 'coin-50', label: '50' },
        { val: 100, type: 'coin', class: 'coin-100', label: '100' },
        { val: 500, type: 'coin', class: 'coin-500', label: '500' },
        { val: 1000, type: 'bill', class: 'bill-1000', label: '1000' },
        { val: 5000, type: 'bill', class: 'bill-5000', label: '5000' },
        { val: 10000, type: 'bill', class: 'bill-10000', label: '10000' },
    ];

    // --- 音声 ---
    const synth = window.speechSynthesis;
    function speak(text) {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = 'ja-JP';
        synth.speak(utterThis);
    }
    
    function speakPrice(amount) {
        speak(`${amount}円`);
    }

    // --- 画面操作 ---
    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
    window.showMenu = () => showScreen('menu-screen');

    // --- 練習モード（初期表示） ---
    window.initPractice = () => {
        const list = document.getElementById('practice-list');
        list.textContent = '';
        moneyTypes.forEach(m => {
            const div = document.createElement('div');
            div.className = 'practice-item';
            
            const el = document.createElement('div');
            el.className = `money ${m.class} ${m.type}`;
            el.textContent = `<span class="money-label">${m.label}</span>`;
            el.onclick = () => speakPrice(m.val);

            const p = document.createElement('div');
            p.textContent = `${m.val}円`;
            p.style.fontWeight = "bold";

            div.appendChild(el);
            div.appendChild(p);
            list.appendChild(div);
        });
        showScreen('practice-screen'); // デフォルト画面
    };

    // --- Level 1: 支払い (ドラッグ) ---
    let currentLv1Target = 0;
    let trayTotal = 0;

    window.startLevel = (lvl) => {
        if (lvl === 1) initLevel1();
        if (lvl === 2) initLevel2();
        if (lvl === 3) initLevel3();
    };

    function initLevel1() {
        const patterns = [
            Math.floor(Math.random() * 9 + 1) * 10,   
            Math.floor(Math.random() * 9 + 1) * 100,  
            Math.floor(Math.random() * 9 + 1) * 100 + Math.floor(Math.random() * 9 + 1) * 10, 
            Math.floor(Math.random() * 20 + 1) * 100 
        ];
        currentLv1Target = patterns[Math.floor(Math.random() * patterns.length)];
        
        document.getElementById('lv1-target').textContent = `${currentLv1Target}円`;
        document.getElementById('tray-area').textContent = '<div style="position:absolute; color:#ccc; font-weight:bold;">ここにおかねをおく</div>';
        trayTotal = 0;
        updateTraySum();
        
        const wallet = document.getElementById('wallet-area');
        wallet.textContent = '';
        moneyTypes.forEach(m => {
            const el = createMoneyElement(m);
            setupDrag(el, m.val);
            wallet.appendChild(el);
        });

        showScreen('level1-screen');
        setTimeout(() => speakPrice(currentLv1Target), 500);
    }

    function createMoneyElement(m) {
        const el = document.createElement('div');
        el.className = `money ${m.class} ${m.type}`;
        el.textContent = `<span class="money-label">${m.label}</span>`;
        return el;
    }

    function setupDrag(el, val) {
        const handleStart = (e) => {
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const ghost = el.cloneNode(true);
            ghost.classList.add('drag-ghost');
            ghost.style.left = clientX + 'px';
            ghost.style.top = clientY + 'px';
            document.body.appendChild(ghost);

            const move = (ev) => {
                ev.preventDefault();
                const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
                const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
                ghost.style.left = cx + 'px';
                ghost.style.top = cy + 'px';
            };

            const end = (ev) => {
                document.removeEventListener('touchmove', move);
                document.removeEventListener('touchend', end);
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);

                const cx = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
                const cy = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
                
                ghost.remove();

                const target = document.elementFromPoint(cx, cy);
                if (target && target.closest('#tray-area')) {
                    addToTray(val);
                }
            };

            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', move, {passive: false});
                document.addEventListener('touchend', end);
            } else {
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', end);
            }
        };

        el.addEventListener('touchstart', handleStart, {passive: false});
        el.addEventListener('mousedown', handleStart);
    }

    function addToTray(val) {
        const m = moneyTypes.find(x => x.val === val);
        const el = createMoneyElement(m);
        el.onclick = () => {
            el.remove();
            trayTotal -= val;
            updateTraySum();
        };
        document.getElementById('tray-area').appendChild(el);
        trayTotal += val;
        updateTraySum();
        speak(val + "円");
    }

    function updateTraySum() {
        document.getElementById('current-sum').textContent = trayTotal;
    }

    window.checkLv1 = () => {
        if (trayTotal === currentLv1Target) {
            showModal(true, "せいかい！");
            if(window.addPointsToUser) window.addPointsToUser(1);
        } else {
            showModal(false, `いま ${trayTotal}円 です。<br>${currentLv1Target}円 にしてね。`);
        }
    };

    // --- Level 2: 聞き取り ---
    let currentLv2Target = 0;
    let inputNum = "";

    function initLevel2() {
        inputNum = "";
        updateInputDisplay(2);
        currentLv2Target = (Math.floor(Math.random() * 50) + 1) * 10;
        showScreen('level2-screen');
        setTimeout(() => speak(`これは ${currentLv2Target}円 です`), 500);
    }

    window.addNum = (n) => {
        if (inputNum.length > 5) return;
        if (inputNum === "0") inputNum = "";
        inputNum += n;
        updateInputDisplay(document.querySelector('#level2-screen.active') ? 2 : 3);
    };

    window.clearNum = () => {
        inputNum = "0";
        updateInputDisplay(document.querySelector('#level2-screen.active') ? 2 : 3);
    };

    function updateInputDisplay(lvl) {
        const id = lvl === 2 ? 'lv2-input-display' : 'lv3-input-display';
        document.getElementById(id).textContent = inputNum === "" ? "0" : inputNum;
    }

    window.checkLv2 = () => {
        if (parseInt(inputNum) === currentLv2Target) {
            showModal(true, "せいかい！");
            if(window.addPointsToUser) window.addPointsToUser(1);
        } else {
            showModal(false, `こたえは ${currentLv2Target}円 でした。`);
        }
    };

    // --- Level 3: おつり ---
    let lv3Price = 0;
    let lv3Paid = 0;

    function initLevel3() {
        inputNum = "";
        updateInputDisplay(3);
        
        lv3Price = Math.floor(Math.random() * 9 + 1) * 100 - (Math.random() > 0.5 ? 0 : Math.floor(Math.random()*5)*10);
        if (lv3Price < 500) lv3Paid = 500;
        else if (lv3Price < 1000) lv3Paid = 1000;
        else lv3Paid = 2000;

        document.getElementById('lv3-price').textContent = `${lv3Price}円`;
        document.getElementById('lv3-paid').textContent = `${lv3Paid}円`;
        
        showScreen('level3-screen');
    }

    window.checkLv3 = () => {
        const correct = lv3Paid - lv3Price;
        if (parseInt(inputNum) === correct) {
            showModal(true, "せいかい！");
            if(window.addPointsToUser) window.addPointsToUser(2);
        } else {
            showModal(false, `こたえは ${correct}円 です。`);
        }
    };

    // --- モーダル制御 ---
    let nextAction = null;
    function showModal(isCorrect, msg) {
        const modal = document.getElementById('modal');
        const icon = document.getElementById('modal-icon');
        const text = document.getElementById('modal-msg');
        const sub = document.getElementById('modal-sub');
        
        modal.style.display = 'flex';
        text.textContent = isCorrect ? "すごい！" : "ざんねん...";
        sub.textContent = msg;
        
        if (isCorrect) {
            icon.textContent = '<i class="fa-regular fa-circle-check" style="color:#4caf50;"></i>';
            speak("せいかい！");
        } else {
            icon.textContent = '<i class="fa-regular fa-circle-xmark" style="color:#f44336;"></i>';
            speak("ちがいます");
        }

        nextAction = () => {
            modal.style.display = 'none';
            if (document.querySelector('#level1-screen.active')) initLevel1();
            else if (document.querySelector('#level2-screen.active')) initLevel2();
            else if (document.querySelector('#level3-screen.active')) initLevel3();
        };
    }

    window.closeModal = () => {
        if (nextAction) nextAction();
    };

    // 初期化
    initPractice();