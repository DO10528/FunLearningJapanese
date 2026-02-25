document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // ★★★ Firebase連携設定 ★★★
    // ----------------------------------------------------
    if (typeof window.addPointsToUser !== 'function') {
        window.addPointsToUser = async () => { return false; };
    }
    const POINTS_PER_CORRECT = 1; 

    // ----------------------------------------------------
    // ★ 1. データ定義
    // (soundプロパティは使用しませんが、データ構造はそのままでも問題ありません)
    // ----------------------------------------------------
    const ASSETS_BASE = 'assets/';

    const GAME_DATA = {
        stationery: {
            title: 'ぶんぼうぐ',
            color: '#ffd54f',
            words: [
                { id: 'enpitsu', name: 'えんぴつ', img: 'enpitsu.png' },
                { id: 'keshigomu', name: 'けしごむ', img: 'keshigomu.png' },
                { id: 'pen', name: 'ぺん', img: 'pen.png' },
                { id: 'note', name: 'のーと', img: 'note.png' },
                { id: 'hasami', name: 'はさみ', img: 'hasami.png' },
                { id: 'nori', name: 'のり', img: 'nori.png' },
                { id: 'hotchkiss', name: 'ほっちきす', img: 'hotchkiss.png' },
                { id: 'jougi', name: 'じょうぎ', img: 'jougi.png' },
                { id: 'fudebako', name: 'ふでばこ', img: 'fudebako.png' },
                { id: 'crayon', name: 'くれよん', img: 'crayon.png' }
            ]
        },
        food: {
            title: 'たべもの',
            color: '#ffab91', 
            words: [
                { id: 'ringo', name: 'りんご', img: 'apple.png' },
                { id: 'banana', name: 'ばなな', img: 'banana.png' },
                { id: 'pan', name: 'ぱん', img: 'bread.png' },
                { id: 'gyunyu', name: 'ぎゅうにゅう', img: 'milk.png' },
                { id: 'tamago', name: 'たまご', img: 'egg.png' },
                { id: 'onigiri', name: 'おにぎり', img: 'onigiri.png' },
                { id: 'mikan', name: 'みかん', img: 'orange.png' },
                { id: 'juice', name: 'じゅーす', img: 'juice.png' },
                { id: 'cookie', name: 'くっきー', img: 'cookie.png' },
                { id: 'tomato', name: 'とまと', img: 'tomato.png' }
            ]
        },
        clothing: {
            title: 'おようふく',
            color: '#81d4fa', 
            words: [
                { id: 'kutsu', name: 'くつ', img: 'shoes.png' },
                { id: 'boushi', name: 'ぼうし', img: 'hat.png' },
                { id: 'tshirt', name: 'Tしゃつ', img: 'tshirt.png' },
                { id: 'kutsushita', name: 'くつした', img: 'socks.png' },
                { id: 'zubon', name: 'ずぼん', img: 'pants.png' },
                { id: 'uwagi', name: 'うわぎ', img: 'jacket.png' },
                { id: 'skirt', name: 'すかーと', img: 'skirt.png' },
                { id: 'kaban', name: 'かばん', img: 'bag.png' },
                { id: 'kasa', name: 'かさ', img: 'umbrella.png' },
                { id: 'megane', name: 'めがね', img: 'glasses.png' }
            ]
        },
        toys: {
            title: 'おもちゃ',
            color: '#a5d6a7', 
            words: [
                { id: 'ball', name: 'ボール', img: 'ball.png' },
                { id: 'kuruma', name: 'くるま', img: 'car.png' },
                { id: 'ningyou', name: 'にんぎょう', img: 'doll.png' },
                { id: 'block', name: 'ブロック', img: 'block.png' },
                { id: 'nuigurumi', name: 'ぬいぐるみ', img: 'plush.png' },
                { id: 'densha', name: 'でんしゃ', img: 'train.png' },
                { id: 'hikouki', name: 'ひこうき', img: 'airplane.png' },
                { id: 'robotto', name: 'ロボット', img: 'robot.png' },
                { id: 'ehon', name: 'えほん', img: 'book.png' },
                { id: 'fuusen', name: 'ふうせん', img: 'balloon.png' }
            ]
        },
        room: {
            title: 'おへや',
            color: '#ce93d8', 
            words: [
                { id: 'isu', name: 'いす', img: 'chair.png' },
                { id: 'tsukue', name: 'つくえ', img: 'desk.png' },
                { id: 'tokei', name: 'とけい', img: 'clock.png' },
                { id: 'tv', name: 'テレビ', img: 'tv.png' },
                { id: 'gomibako', name: 'ごみばこ', img: 'trashcan.png' },
                { id: 'beddo', name: 'ベッド', img: 'bed.png' },
                { id: 'doa', name: 'ドア', img: 'door.png' },
                { id: 'mado', name: 'まど', img: 'window.png' },
                { id: 'denki', name: 'でんき', img: 'light.png' },
                { id: 'sofa', name: 'ソファ', img: 'sofa.png' }
            ]
        },
        kitchen: {
            title: 'キッチン・\nしょっき',
            color: '#ffcc80', // オレンジ系
            words: [
                { id: 'spoon', name: 'スプーン', img: 'spoon.png' },
                { id: 'fork', name: 'フォーク', img: 'fork.png' },
                { id: 'cup', name: 'コップ', img: 'cup.png' },
                { id: 'osara', name: 'おさら', img: 'plate.png' },
                { id: 'ohashi', name: 'おはし', img: 'chopsticks.png' },
                { id: 'fryingpan', name: 'フライパン', img: 'fryingpan.png' },
                { id: 'pot', name: 'ポット', img: 'pot.png' },
                { id: 'suihanki', name: 'すいはんき', img: 'ricecooker.png' },
                { id: 'renji', name: 'レンジ', img: 'microwave.png' },
                { id: 'apron', name: 'エプロン', img: 'apron.png' }
            ]
        },
        bathroom: {
            title: 'おふろ・\nせんめんじょ',
            color: '#80deea', // 水色系
            words: [
                { id: 'haburashi', name: 'はブラシ', img: 'toothbrush.png' },
                { id: 'towel', name: 'タオル', img: 'towel.png' },
                { id: 'sekken', name: 'せっけん', img: 'soap.png' },
                { id: 'shampoo', name: 'シャンプー', img: 'shampoo.png' },
                { id: 'kagami', name: 'かがみ', img: 'mirror.png' },
                { id: 'doraiya', name: 'ドライヤー', img: 'hairdryer.png' },
                { id: 'oke', name: 'おけ', img: 'bucket.png' },
                { id: 'jaguchi', name: 'じゃぐち', img: 'faucet.png' },
                { id: 'kushi', name: 'くし', img: 'comb.png' },
                { id: 'washingmachine', name: 'せんたくき', img: 'washingmachine.png' }
            ]
        },
        electronics: {
            title: 'かでん',
            color: '#b0bec5', // メタリック/グレー系
            words: [
                { id: 'rimokon', name: 'リモコン', img: 'remote.png' },
                { id: 'soujiki', name: 'そうじき', img: 'vacuum.png' },
                { id: 'reizouko', name: 'れいぞうこ', img: 'fridge.png' },
                { id: 'senpuuki', name: 'せんぷうき', img: 'fan.png' },
                { id: 'sumaho', name: 'スマホ', img: 'smartphone.png' },
                { id: 'iron', name: 'アイロン', img: 'iron.png' },
                { id: 'stove', name: 'ストーブ', img: 'heater.png' },
                { id: 'switch', name: 'スイッチ', img: 'switch.png' },
                { id: 'camera', name: 'カメラ', img: 'camera.png' },
                { id: 'tokei_digital', name: 'とけい', img: 'digitalclock.png' }
            ]
        },
        colors: {
            title: 'いろ',
            color: '#f48fb1', // ピンク系
            words: [
                { id: 'aka', name: 'あか', img: 'red.png' }, // 赤い色紙などの画像を用意
                { id: 'ao', name: 'あお', img: 'blue.png' },
                { id: 'kiiro', name: 'きいろ', img: 'yellow.png' },
                { id: 'midori', name: 'みどり', img: 'green.png' },
                { id: 'pink', name: 'ピンク', img: 'pink.png' },
                { id: 'shiro', name: 'しろ', img: 'white.png' },
                { id: 'kuro', name: 'くろ', img: 'black.png' },
                { id: 'orange', name: 'オレンジ', img: 'orange_color.png' },
                { id: 'murasaki', name: 'むらさき', img: 'purple.png' },
                { id: 'chairo', name: 'ちゃいろ', img: 'brown.png' }
            ]
        },
        body: {
            title: 'からだ',
            color: '#ffccbc', // 肌色系
            words: [
                { id: 'te', name: 'て', img: 'hand.png' },
                { id: 'ashi', name: 'あし', img: 'foot.png' },
                { id: 'atama', name: 'あたま', img: 'head.png' },
                { id: 'me', name: 'め', img: 'eye.png' },
                { id: 'mimi', name: 'みみ', img: 'ear.png' },
                { id: 'kuchi', name: 'くち', img: 'mouth.png' },
                { id: 'hana', name: 'はな', img: 'nose.png' },
                { id: 'kata', name: 'かた', img: 'shoulder.png' },
                { id: 'onaka', name: 'おなか', img: 'stomach.png' },
                { id: 'senaka', name: 'せなか', img: 'back.png' }
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
    // audioCache は削除しました

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
    const pointFeedback = document.getElementById('sc-point-feedback'); 

    const backToTopicBtns = document.querySelectorAll('.sc-back-to-topic');

    // ----------------------------------------------------
    // ★ 4. 関数定義 (音声読み上げに変更)
    // ----------------------------------------------------

    // 画面切り替え
    function showScreen(screenEl) {
        screens.forEach(s => s.classList.remove('active'));
        screenEl.classList.add('active');
    }

    // ★★★ 音声読み上げ関数 (Text-to-Speech) ★★★
    function speakText(text) {
        if (!window.speechSynthesis) {
            console.error("このブラウザは音声読み上げに対応していません");
            return;
        }
        
        // 読み上げ中のものがあればキャンセル
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // 日本語
        utterance.rate = 0.9;     // 速さ (1.0が標準、0.9は少しゆっくり)
        utterance.pitch = 1.0;    // 高さ
        utterance.volume = 1.0;   // 音量

        window.speechSynthesis.speak(utterance);
    }

    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // ----------------------------------------------------
    // ★ 5. トピック選択ロジック
    // ----------------------------------------------------
    function initTopicScreen() {
        topicGrid.textContent = '';
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
        studyGrid.textContent = '';

        currentWordList.forEach(word => {
            const item = document.createElement('div');
            item.className = 'sc-study-item';
            
            const imgPath = `${ASSETS_BASE}images/${currentTopicId}/${word.img}`;

            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = word.name;
            img.onerror = () => { img.src = 'assets/images/placeholder.png'; };

            const p = document.createElement('p');
            p.textContent = word.name;

            // ★変更: クリック時にテキストを読み上げ
            item.onclick = () => speakText(word.name);
            
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
        // ★変更: テキストを読み上げ
        speakText(currentWord.name);

        gamePrompt.textContent = `「${currentWord.name}」をさがしてね！`;
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
            await videoEl.play();
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
    
    async function handleSelfAssessment(isCorrect) {
        
        btnCorrect.disabled = true;
        btnIncorrect.disabled = true;

        if (isCorrect) {
            // ★変更: 正解時の音声もTTSで言わせる
            speakText("せいかい！やったね！");

            const wordKey = currentWord.name; // nameをキーとして使用
            const success = await window.addPointsToUser(POINTS_PER_CORRECT, wordKey);
            
            let message = `⭕️ せいかい！おめでとう！`;
            if (success) {
                message += ` (+${POINTS_PER_CORRECT} ポイント)`;
                pointFeedback.style.color = 'var(--correct-color)';
            } else {
                message += ' (ポイント記録エラー)';
                pointFeedback.style.color = 'var(--accent)';
            }
            pointFeedback.textContent = message;

        } else {
            // ★変更: 不正解時の音声もTTSで言わせる
            speakText("ざんねん。つぎ、がんばろう！");

            pointFeedback.textContent = '❌ ざんねん！ちがったみたい。がんばろうね。';
            pointFeedback.style.color = 'var(--incorrect-color)';
        }
        
        setTimeout(() => {
            resUserImg.src = '';
            resProbImg.src = '';
            btnCorrect.disabled = false;
            btnIncorrect.disabled = false;
            setupNewProblem();
        }, 2000); // 読み上げ時間を考慮して少し長めに待機
    }
    
    btnCorrect.onclick = () => handleSelfAssessment(true);
    btnIncorrect.onclick = () => handleSelfAssessment(false);


    // 初期化実行
    initTopicScreen();
});