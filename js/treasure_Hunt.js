document.addEventListener('DOMContentLoaded', () => {

    const POINTS_PER_CORRECT = 1; 
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
            color: '#ffcc80',
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
            color: '#80deea',
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
            color: '#b0bec5',
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
            color: '#f48fb1',
            words: [
                { id: 'aka', name: 'あか', img: 'red.png' },
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
            color: '#ffccbc',
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

    let currentTopicId = null;
    let currentWordList = [];
    let currentWord = null;
    let videoStream = null;

    function showScreen(screenEl) {
        const screens = document.querySelectorAll('.sc-screen');
        if (screens) {
            screens.forEach(s => s.classList.remove('active'));
        }
        if (screenEl) {
            screenEl.classList.add('active');
        }
    }

    function speakText(text) {
        if (!window.speechSynthesis) {
            console.error("このブラウザは音声読み上げに対応していません");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    function initTopicScreen() {
        const topicGrid = document.getElementById('sc-topic-grid');
        const screenTopic = document.getElementById('sc-screen-topic');
        
        if (!topicGrid) return;
        
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
        const studyTitle = document.getElementById('sc-study-title');
        const studyGrid = document.getElementById('sc-study-grid');
        const screenStudy = document.getElementById('sc-screen-study');
        
        if (!GAME_DATA[key]) return;
        
        currentTopicId = key;
        currentWordList = GAME_DATA[key].words;
        
        if (studyTitle) {
            studyTitle.textContent = `「${GAME_DATA[key].title}」の ことば`;
        }
        if (studyGrid) {
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
                item.onclick = () => speakText(word.name);
                
                item.appendChild(img);
                item.appendChild(p);
                studyGrid.appendChild(item);
            });
        }
        showScreen(screenStudy);
    }

    function setupNewProblem() {
        const gamePrompt = document.getElementById('sc-game-prompt');
        const playSoundBtn = document.getElementById('sc-play-sound-button');
        const openCameraBtn = document.getElementById('sc-open-camera-button');
        const screenGame = document.getElementById('sc-screen-game');
        
        if (!currentWordList || currentWordList.length === 0) return;
        
        const randIndex = Math.floor(Math.random() * currentWordList.length);
        currentWord = currentWordList[randIndex];

        if (gamePrompt) gamePrompt.textContent = 'したのボタンをおして、きこえたものを さがしてね！';
        if (playSoundBtn) playSoundBtn.style.display = 'block';
        if (openCameraBtn) openCameraBtn.style.display = 'none';
        
        showScreen(screenGame);
    }

    function setupEventListeners() {
        const playSoundBtn = document.getElementById('sc-play-sound-button');
        const startGameBtn = document.getElementById('sc-start-game-button');
        const backToTopicBtns = document.querySelectorAll('.sc-back-to-topic');
        const openCameraBtn = document.getElementById('sc-open-camera-button');
        const takePicBtn = document.getElementById('sc-take-picture-button');
        const cancelCameraBtn = document.getElementById('sc-cancel-camera-button');
        const btnCorrect = document.getElementById('sc-correct-button');
        const btnIncorrect = document.getElementById('sc-incorrect-button');

        if (playSoundBtn) {
            playSoundBtn.onclick = () => {
                if (currentWord) {
                    speakText(currentWord.name);
                    const gamePrompt = document.getElementById('sc-game-prompt');
                    if (gamePrompt) gamePrompt.textContent = `「${currentWord.name}」をさがしてね！`;
                    if (openCameraBtn) openCameraBtn.style.display = 'block';
                }
            };
        }

        if (startGameBtn) {
            startGameBtn.onclick = () => setupNewProblem();
        }

        backToTopicBtns.forEach(btn => {
            btn.onclick = () => {
                stopCamera();
                initTopicScreen();
            };
        });

        if (openCameraBtn) {
            openCameraBtn.onclick = async () => {
                if (videoStream) return;
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' }, 
                        audio: false 
                    });
                    videoStream = stream;
                    const videoEl = document.getElementById('sc-video-element');
                    const canvasEl = document.getElementById('sc-canvas-element');
                    const screenCamera = document.getElementById('sc-screen-camera');
                    
                    if (videoEl) {
                        videoEl.srcObject = stream;
                        videoEl.onloadedmetadata = () => {
                            if (canvasEl) {
                                canvasEl.width = videoEl.videoWidth;
                                canvasEl.height = videoEl.videoHeight;
                            }
                        };
                        await videoEl.play();
                    }
                    showScreen(screenCamera);
                } catch (err) {
                    console.error(err);
                    alert("カメラが つかえませんでした");
                }
            };
        }

        if (takePicBtn) {
            takePicBtn.onclick = () => {
                const videoEl = document.getElementById('sc-video-element');
                const canvasEl = document.getElementById('sc-canvas-element');
                const resUserImg = document.getElementById('sc-result-image');
                const resProbImg = document.getElementById('sc-problem-image');
                const resProbName = document.getElementById('sc-problem-name');
                const screenResult = document.getElementById('sc-screen-result');
                
                if (canvasEl && videoEl && currentWord && currentTopicId) {
                    const ctx = canvasEl.getContext('2d');
                    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
                    const imgData = canvasEl.toDataURL('image/png');
                    
                    if (resUserImg) resUserImg.src = imgData;
                    if (resProbImg) resProbImg.src = `${ASSETS_BASE}images/${currentTopicId}/${currentWord.img}`;
                    if (resProbName) resProbName.textContent = currentWord.name;
                    
                    stopCamera();
                    showScreen(screenResult);
                }
            };
        }

        if (cancelCameraBtn) {
            cancelCameraBtn.onclick = () => {
                stopCamera();
                const screenGame = document.getElementById('sc-screen-game');
                showScreen(screenGame);
            };
        }

        if (btnCorrect) {
            btnCorrect.onclick = () => handleSelfAssessment(true);
        }
        if (btnIncorrect) {
            btnIncorrect.onclick = () => handleSelfAssessment(false);
        }
    }

    function stopCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
            const videoEl = document.getElementById('sc-video-element');
            if (videoEl) videoEl.srcObject = null;
        }
    }

    async function handleSelfAssessment(isCorrect) {
        const btnCorrect = document.getElementById('sc-correct-button');
        const btnIncorrect = document.getElementById('sc-incorrect-button');
        const pointFeedback = document.getElementById('sc-point-feedback');
        
        if (btnCorrect) btnCorrect.disabled = true;
        if (btnIncorrect) btnIncorrect.disabled = true;

        if (isCorrect) {
            speakText("せいかい！やったね！");
            
            let success = false;
            if (currentWord && window.Antigravity && typeof window.Antigravity.addPoint === 'function') {
                const wordKey = currentTopicId + '_' + currentWord.id;
                try {
                    success = await window.Antigravity.addPoint('treasure_hunt', wordKey);
                } catch (e) {
                    console.error('Antigravity error:', e);
                }
            }
            
            let message = `⭕️ せいかい！おめでとう！`;
            if (success) {
                message += ` (+${POINTS_PER_CORRECT} ポイント)`;
                if (pointFeedback) pointFeedback.style.color = 'var(--correct-color)';
            } else {
                message += ' (ポイント記録済み)';
                if (pointFeedback) pointFeedback.style.color = 'var(--accent)';
            }
            if (pointFeedback) pointFeedback.textContent = message;

        } else {
            speakText("ざんねん。つぎ、がんばろう！");
            if (pointFeedback) {
                pointFeedback.textContent = '❌ ざんねん！ちがったみたい。がんばろうね。';
                pointFeedback.style.color = 'var(--incorrect-color)';
            }
        }
        
        setTimeout(() => {
            const resUserImg = document.getElementById('sc-result-image');
            const resProbImg = document.getElementById('sc-problem-image');
            
            if (resUserImg) resUserImg.src = '';
            if (resProbImg) resProbImg.src = '';
            if (btnCorrect) btnCorrect.disabled = false;
            if (btnIncorrect) btnIncorrect.disabled = false;
            
            setupNewProblem();
        }, 2000);
    }

    setupEventListeners();
    initTopicScreen();
});
