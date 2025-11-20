document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★ 1. データ定義 (ここでトピックと単語を管理します)
    // ----------------------------------------------------
    // 画像は assets/images/トピックID/画像名.png にあると想定
    // 音声は assets/sounds/トピックID/音声名.mp3 にあると想定
    
    const ASSETS_BASE = 'assets/';

    const GAME_DATA = {
        stationery: {
            title: 'ぶんぼうぐ',
            color: '#ffd54f',
            words: [
                { id: 'enpitsu', name: 'えんぴつ', img: 'enpitsu.png', sound: 'enpitsu.mp3' },
                { id: 'keshigomu', name: 'けしゴム', img: 'keshigomu.png', sound: 'keshigomu.mp3' },
                { id: 'pen', name: 'ペン', img: 'pen.png', sound: 'pen.mp3' },
                { id: 'note', name: 'ノート', img: 'note.png', sound: 'note.mp3' },
                { id: 'hasami', name: 'はさみ', img: 'hasami.png', sound: 'hasami.mp3' },
                // ▼ 追加した5単語 ▼
                { id: 'nori', name: 'のり', img: 'nori.png', sound: 'nori.mp3' },
                { id: 'hotchkiss', name: 'ホッチキス', img: 'hotchkiss.png', sound: 'hotchkiss.mp3' },
                { id: 'jougi', name: 'じょうぎ', img: 'jougi.png', sound: 'jougi.mp3' },
                { id: 'fudebako', name: 'ふでばこ', img: 'fudebako.png', sound: 'fudebako.mp3' },
                { id: 'crayon', name: 'クレヨン', img: 'crayon.png', sound: 'crayon.mp3' }
            ]
        },
        food: {
            title: 'たべもの',
            color: '#ffab91', 
            words: [
                { id: 'ringo', name: 'りんご', img: 'apple.png', sound: 'apple.mp3' },
                { id: 'banana', name: 'バナナ', img: 'banana.png', sound: 'banana.mp3' },
                { id: 'pan', name: 'パン', img: 'bread.png', sound: 'bread.mp3' },
                { id: 'gyunyu', name: 'ぎゅうにゅう', img: 'milk.png', sound: 'milk.mp3' },
                { id: 'tamago', name: 'たまご', img: 'egg.png', sound: 'egg.mp3' }
            ]
        },
        clothing: {
            title: 'おようふく',
            color: '#81d4fa', 
            words: [
                { id: 'kutsu', name: 'くつ', img: 'shoes.png', sound: 'shoes.mp3' },
                { id: 'boushi', name: 'ぼうし', img: 'hat.png', sound: 'hat.mp3' },
                { id: 'tshirt', name: 'Tシャツ', img: 'tshirt.png', sound: 'tshirt.mp3' },
                { id: 'kutsushita', name: 'くつした', img: 'socks.png', sound: 'socks.mp3' }
            ]
        },
        toys: {
            title: 'おもちゃ',
            color: '#a5d6a7', 
            words: [
                { id: 'ball', name: 'ボール', img: 'ball.png', sound: 'ball.mp3' },
                { id: 'kuruma', name: 'くるま', img: 'car.png', sound: 'car.mp3' },
                { id: 'ningyou', name: 'にんぎょう', img: 'doll.png', sound: 'doll.mp3' },
                { id: 'block', name: 'ブロック', img: 'block.png', sound: 'block.mp3' }
            ]
        },
        room: {
            title: 'おへや',
            color: '#ce93d8', 
            words: [
                { id: 'isu', name: 'いす', img: 'chair.png', sound: 'chair.mp3' },
                { id: 'tsukue', name: 'つくえ', img: 'desk.png', sound: 'desk.mp3' },
                { id: 'tokei', name: 'とけい', img: 'clock.png', sound: 'clock.mp3' },
                { id: 'tv', name: 'テレビ', img: 'tv.png', sound: 'tv.mp3' }
            ]
        }
    };

    // ----------------------------------------------------
    // ★ 2. 状態管理
    // ----------------------------------------------------
    let currentTopicId = null;
    let currentWordList = [];
    let currentWord = null;
    let videoStream = null;
    const audioCache = {};

    // ポイントシステム用定数
    const GAME_ID_SCAVENGER = 'scavenger_hunt_game';
    const USER_STORAGE_KEY = 'user_accounts'; 
    const SESSION_STORAGE_KEY = 'current_user'; 

    // ----------------------------------------------------
    // ★ 3. DOM要素の取得
    // ----------------------------------------------------
    const screens = document.querySelectorAll('.sc-screen');
    
    // 画面ごとの要素
    const screenTopic = document.getElementById('sc-screen-topic');
    const topicGrid = document.getElementById('sc-topic-grid');

    const screenStudy = document.getElementById('sc-screen-study');
    const studyTitle = document.getElementById('sc-study-title');
    const studyGrid = document.getElementById('sc-study-grid');
    const startGameBtn = document.getElementById('sc-start-game-button');

    const screenGame = document.getElementById('sc-screen-game');
    const gamePrompt = document.getElementById('sc-game-prompt');
    const playSoundBtn = document.getElementById('sc-play-sound-button');
    const openCameraBtn = document.getElementById('sc-open-camera-button');

    const screenCamera = document.getElementById('sc-screen-camera');
    const videoEl = document.getElementById('sc-video-element');
    const canvasEl = document.getElementById('sc-canvas-element');
    const takePicBtn = document.getElementById('sc-take-picture-button');
    const cancelCameraBtn = document.getElementById('sc-cancel-camera-button');

    const screenResult = document.getElementById('sc-screen-result');
    const resProbImg = document.getElementById('sc-problem-image');
    const resProbName = document.getElementById('sc-problem-name');
    const resUserImg = document.getElementById('sc-result-image');
    const btnCorrect = document.getElementById('sc-correct-button');
    const btnIncorrect = document.getElementById('sc-incorrect-button');

    const backToTopicBtns = document.querySelectorAll('.sc-back-to-topic');

    // ----------------------------------------------------
    // ★ 4. 関数定義
    // ----------------------------------------------------

    // 画面切り替え
    function showScreen(screenEl) {
        screens.forEach(s => s.classList.remove('active'));
        screenEl.classList.add('active');
    }

    // 音声再生 (キャッシュ機能付き)
    function playSound(path) {
        if (!audioCache[path]) {
            audioCache[path] = new Audio(path);
        }
        const audio = audioCache[path];
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio Play Error:', e));
    }

    // ポイント加算
    function checkAndAwardPoints(topicId, wordId) {
        const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!currentUser || currentUser === 'ゲスト') return "guest"; 

        const usersJson = localStorage.getItem(USER_STORAGE_KEY);
        let users = usersJson ? JSON.parse(usersJson) : {};
        let user = users[currentUser];
        if (!user) return "error"; 

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const progressKey = `${GAME_ID_SCAVENGER}_${topicId}_${wordId}`;

        user.progress = user.progress || {};
        user.progress[progressKey] = user.progress[progressKey] || {};

        if (user.progress[progressKey][today] === true) return "already_scored"; 

        user.points = (user.points || 0) + 1;
        user.progress[progressKey][today] = true;
        
        users[currentUser] = user;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        return "scored"; 
    }

    // ----------------------------------------------------
    // ★ 5. トピック選択ロジック
    // ----------------------------------------------------
    function initTopicScreen() {
        topicGrid.innerHTML = '';
        Object.keys(GAME_DATA).forEach(key => {
            const data = GAME_DATA[key];
            const card = document.createElement('div');
            card.className = 'sc-topic-card';
            card.textContent = data.title;
            card.style.borderColor = data.color;
            card.onclick = () => selectTopic(key);
            topicGrid.appendChild(card);
        });
        showScreen(screenTopic);
    }

    function selectTopic(key) {
        currentTopicId = key;
        currentWordList = GAME_DATA[key].words;
        
        // 勉強画面のセットアップ
        studyTitle.textContent = `「${GAME_DATA[key].title}」の ことば`;
        studyGrid.innerHTML = '';

        currentWordList.forEach(word => {
            const item = document.createElement('div');
            item.className = 'sc-study-item';
            
            const imgPath = `${ASSETS_BASE}images/${currentTopicId}/${word.img}`;
            const soundPath = `${ASSETS_BASE}sounds/${currentTopicId}/${word.sound}`;

            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = word.name;
            // 画像読み込みエラー時のフォールバック（オプション）
            img.onerror = () => { img.src = 'assets/images/placeholder.png'; };

            const p = document.createElement('p');
            p.textContent = word.name;

            item.onclick = () => playSound(soundPath);
            
            item.appendChild(img);
            item.appendChild(p);
            studyGrid.appendChild(item);
        });

        showScreen(screenStudy);
    }

    // ----------------------------------------------------
    // ★ 6. ゲームロジック
    // ----------------------------------------------------
    function setupNewProblem() {
        // 現在のリストからランダムに選択
        const randIndex = Math.floor(Math.random() * currentWordList.length);
        currentWord = currentWordList[randIndex];

        gamePrompt.textContent = 'したのボタンをおして、きこえたものを さがしてね！';
        playSoundBtn.style.display = 'block';
        openCameraBtn.style.display = 'none';
        
        showScreen(screenGame);
    }

    playSoundBtn.onclick = () => {
        const path = `${ASSETS_BASE}sounds/${currentTopicId}/${currentWord.sound}`;
        playSound(path);
        gamePrompt.textContent = `「${currentWord.name}」を さがしてね！`;
        openCameraBtn.style.display = 'block';
    };

    startGameBtn.onclick = () => setupNewProblem();

    backToTopicBtns.forEach(btn => {
        btn.onclick = () => {
            stopCamera();
            initTopicScreen();
        };
    });

    // ----------------------------------------------------
    // ★ 7. カメラロジック
    // ----------------------------------------------------
    openCameraBtn.onclick = async () => {
        if (videoStream) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }, 
                audio: false 
            });
            videoStream = stream;
            videoEl.srcObject = stream;
            videoEl.onloadedmetadata = () => {
                canvasEl.width = videoEl.videoWidth;
                canvasEl.height = videoEl.videoHeight;
            };
            showScreen(screenCamera);
        } catch (err) {
            console.error(err);
            alert("カメラが つかえませんでした");
        }
    };

    function stopCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
            videoEl.srcObject = null;
        }
    }

    takePicBtn.onclick = () => {
        const ctx = canvasEl.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        const imgData = canvasEl.toDataURL('image/png');

        resUserImg.src = imgData;
        resProbImg.src = `${ASSETS_BASE}images/${currentTopicId}/${currentWord.img}`;
        resProbName.textContent = currentWord.name;

        stopCamera();
        showScreen(screenResult);
    };

    cancelCameraBtn.onclick = () => {
        stopCamera();
        showScreen(screenGame);
    };

    // ----------------------------------------------------
    // ★ 8. 結果ロジック
    // ----------------------------------------------------
    btnCorrect.onclick = () => {
        const result = checkAndAwardPoints(currentTopicId, currentWord.id);
        if (result === "scored") {
            alert("せいかい！ (+1 ポイント！)");
        } else {
            alert("せいかい！");
        }
        
        // 次の問題へ (リセット)
        resUserImg.src = '';
        resProbImg.src = '';
        setupNewProblem();
    };

    btnIncorrect.onclick = () => {
        alert("ざんねん！ つぎは がんばろう！");
        resUserImg.src = '';
        resProbImg.src = '';
        setupNewProblem();
    };

    // 初期化実行
    initTopicScreen();
});