document.addEventListener('DOMContentLoaded', () => {

            // --- Point System ---
            const GAME_ID_VERB = 'verb_game'; 
            const USER_STORAGE_KEY_VERB = 'user_accounts'; 
            const SESSION_STORAGE_KEY_VERB = 'current_user'; 
            const GUEST_NAME_VERB = 'ゲスト'; 

            let gameTimer = null; 

            function getTodayDateString() {
                const now = new Date();
                return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            }

            function checkAndAwardPoints(gameType, verbId) {
                const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEY_VERB);
                if (!currentUser || currentUser === GUEST_NAME_VERB) return "guest"; 

                const usersJson = localStorage.getItem(USER_STORAGE_KEY_VERB);
                let users = usersJson ? JSON.parse(usersJson) : {};
                let user = users[currentUser];
                if (!user) return "error"; 

                const today = getTodayDateString();
                const progressKey = `${GAME_ID_VERB}_${gameType}_${verbId}`;

                user.progress = user.progress || {};
                user.progress[progressKey] = user.progress[progressKey] || {};

                if (user.progress[progressKey][today] === true) return "already_scored"; 

                user.points = (user.points || 0) + 1;
                user.progress[progressKey][today] = true;
                users[currentUser] = user;
                localStorage.setItem(USER_STORAGE_KEY_VERB, JSON.stringify(users));
                return "scored"; 
            }

            // ----------------------------------------------------
            // Data Definitions (No external images/audio)
            // ----------------------------------------------------
            // icon: FontAwesome classes
            // animation: CSS animation class defined in style
            const verbData = [
                { id: 'tabemasu', masu: 'たべます', mashita: 'たべました', icon: 'fa-solid fa-bowl-rice', animation: 'anim-eat', noun: 'ごはん', nounIcon: 'fa-solid fa-bowl-rice' },
                { id: 'nomimasu', masu: 'のみます', mashita: 'のみました', icon: 'fa-solid fa-mug-hot', animation: 'anim-drink', noun: 'ジュース', nounIcon: 'fa-solid fa-glass-water' },
                { id: 'nemasu', masu: 'ねます', mashita: 'ねました', icon: 'fa-solid fa-bed', animation: 'anim-sleep', noun: 'ベッド', nounIcon: 'fa-solid fa-bed' },
                { id: 'mimasu', masu: 'みます', mashita: 'みました', icon: 'fa-solid fa-tv', animation: 'anim-listen', noun: 'テレビ', nounIcon: 'fa-solid fa-tv' },
                { id: 'yomimasu', masu: 'よみます', mashita: 'よみました', icon: 'fa-solid fa-book-open', animation: 'anim-listen', noun: 'ほん', nounIcon: 'fa-solid fa-book' },
                { id: 'kakimasu', masu: 'かきます', mashita: 'かきました', icon: 'fa-solid fa-pen', animation: 'anim-eat', noun: 'え', nounIcon: 'fa-solid fa-image' },
                { id: 'kikimasu', masu: 'ききます', mashita: 'ききました', icon: 'fa-solid fa-headphones', animation: 'anim-listen', noun: 'おんがく', nounIcon: 'fa-solid fa-music' },
                { id: 'kaimasu', masu: 'かいます', mashita: 'かいました', icon: 'fa-solid fa-cart-shopping', animation: 'anim-walk', noun: 'おかし', nounIcon: 'fa-solid fa-cookie' },
                { id: 'ikimasu', masu: 'いきます', mashita: 'いきました', icon: 'fa-solid fa-person-walking', animation: 'anim-walk', noun: null, nounIcon: null },
                { id: 'kimasu', masu: 'きます', mashita: 'きました', icon: 'fa-solid fa-person-walking-arrow-right', animation: 'anim-walk', noun: null, nounIcon: null }
            ];

            // ----------------------------------------------------
            // Web Speech API (Browser Text-to-Speech)
            // ----------------------------------------------------
            function speak(text) {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel(); // Stop previous
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'ja-JP'; // Japanese
                    utterance.rate = 1.0; 
                    utterance.pitch = 1.0;
                    window.speechSynthesis.speak(utterance);
                } else {
                    console.warn("Web Speech API not supported.");
                }
            }
            
            // Simple beep sounds for feedback (using Web Audio API or simple tone not needed, simply Speech for "Seikai"?)
            // Let's use Speech for feedback too to keep it asset-free.
            function speakFeedback(isCorrect) {
                if(isCorrect) speak("せいかい！");
                else speak("ちがうよ");
            }

            // ----------------------------------------------------
            // DOM & Logic
            // ----------------------------------------------------
            const screens = document.querySelectorAll('.dv-screen');
            const menuScreen = document.getElementById('dv-screen-menu');
            
            function showScreen(screen) {
                screens.forEach(s => s.classList.remove('active'));
                screen.classList.add('active');
            }

            function shuffle(array) {
                return array.sort(() => Math.random() - 0.5);
            }

            // Setup Menu
            document.querySelectorAll('.dv-back-to-menu').forEach(btn => {
                btn.onclick = () => showScreen(menuScreen);
            });

            document.getElementById('dv-menu-game1').onclick = () => { setupGame1(); showScreen(document.getElementById('dv-screen-game1')); };
            document.getElementById('dv-menu-game2').onclick = () => { setupGame2(); showScreen(document.getElementById('dv-screen-game2')); };
            document.getElementById('dv-menu-game3').onclick = () => { setupGame3(); showScreen(document.getElementById('dv-screen-game3')); };

            // --- Game 1: Action (Listen) ---
            let game1Target = null;
            
            window.playCurrentGame1Sound = function() {
                if(game1Target) speak(game1Target.masu);
            }

            function setupGame1() {
                const optionsDiv = document.getElementById('dv-game1-options');
                const feedback = document.getElementById('dv-game1-feedback');
                optionsDiv.textContent = '';
                feedback.textContent = '';
                feedback.className = 'dv-feedback';

                const shuffled = shuffle([...verbData]);
                const choices = shuffled.slice(0, 4);
                game1Target = choices[Math.floor(Math.random() * choices.length)];

                // Play sound (Delayed slightly to allow screen transition)
                setTimeout(() => speak(game1Target.masu), 500);

                choices.forEach(v => {
                    const card = document.createElement('div');
                    card.className = 'dv-game1-option-card';
                    // Use FontAwesome Icon instead of Image
                    card.innerHTML = `<i class="${v.icon}"></i>`;
                    
                    card.onclick = () => {
                        if (v.id === game1Target.id) {
                            card.style.background = '#dcedc8';
                            card.innerHTML = `<i class="${v.icon} ${v.animation}"></i>`; // Add animation
                            feedback.textContent = 'せいかい！';
                            feedback.className = 'dv-feedback show success';
                            speakFeedback(true);
                            checkAndAwardPoints('game1', v.id);
                            setTimeout(setupGame1, 2000);
                        } else {
                            feedback.textContent = 'ちがうよ';
                            feedback.className = 'dv-feedback show';
                            speakFeedback(false);
                        }
                    };
                    optionsDiv.appendChild(card);
                });
            }

            // --- Game 2: Tense (Now vs Past) ---
            // Improved logic: Show "Tomorrow" or "Yesterday" context box
            let game2Target = null;
            let game2IsPast = false;

            function setupGame2() {
                const feedback = document.getElementById('dv-game2-feedback');
                feedback.textContent = '';
                feedback.className = 'dv-feedback';
                
                game2Target = verbData[Math.floor(Math.random() * verbData.length)];
                game2IsPast = Math.random() < 0.5;

                // Update Context Box
                const contextBox = document.getElementById('dv-game2-context');
                const timeText = document.getElementById('dv-game2-time-text');
                
                contextBox.className = 'dv-game2-context-box ' + (game2IsPast ? 'past' : 'future');
                // Explicit text prompt
                timeText.textContent = game2IsPast ? 'きのう (Past)' : 'あした (Future)';

                // Show Verb Icon
                const mainIcon = document.getElementById('dv-game2-main-icon');
                mainIcon.className = game2Target.icon; // Reset class
                
                // Setup Options
                const opt1 = document.getElementById('dv-game2-option1');
                const opt2 = document.getElementById('dv-game2-option2');
                
                // Shuffle order
                const isOrderNormal = Math.random() < 0.5;
                const txt1 = isOrderNormal ? game2Target.masu : game2Target.mashita;
                const txt2 = isOrderNormal ? game2Target.mashita : game2Target.masu;
                
                opt1.textContent = txt1;
                opt2.textContent = txt2;
                
                opt1.onclick = () => checkGame2(txt1, opt1);
                opt2.onclick = () => checkGame2(txt2, opt2);
                
                // Reset button styles
                opt1.className = 'dv-button dv-game2-option-button';
                opt2.className = 'dv-button dv-game2-option-button';
            }

            function checkGame2(selectedText, btn) {
                const correctText = game2IsPast ? game2Target.mashita : game2Target.masu;
                const feedback = document.getElementById('dv-game2-feedback');

                if (selectedText === correctText) {
                    btn.classList.add('correct');
                    feedback.textContent = 'せいかい！';
                    feedback.className = 'dv-feedback show success';
                    speak(correctText); // Speak the correct answer
                    checkAndAwardPoints('game2', game2Target.id);
                    setTimeout(setupGame2, 2000);
                } else {
                    btn.classList.add('incorrect');
                    feedback.textContent = 'ちがうよ';
                    feedback.className = 'dv-feedback show';
                    speakFeedback(false);
                }
            }

            // --- Game 3: Sentence Building ---
            function setupGame3() {
                const nounContainer = document.getElementById('dv-game3-card-container-noun');
                const verbContainer = document.getElementById('dv-game3-card-container-verb');
                const slotNoun = document.getElementById('dv-game3-slot-noun');
                const slotVerb = document.getElementById('dv-game3-slot-verb');
                const feedback = document.getElementById('dv-game3-feedback');
                const checkBtn = document.getElementById('dv-game3-check-button');

                nounContainer.textContent = '';
                verbContainer.textContent = '';
                slotNoun.textContent = '';
                slotVerb.textContent = '';
                feedback.textContent = '';
                feedback.className = 'dv-feedback';
                checkBtn.disabled = false;
                checkBtn.style.background = '#5c7aff';

                // Filter verbs that have nouns
                const availableVerbs = verbData.filter(v => v.noun);
                const shuffled = shuffle(availableVerbs).slice(0, 3); // Pick 3 random pairs

                const nounCards = [];
                const verbCards = [];

                shuffled.forEach(v => {
                    nounCards.push({ id: v.id, text: v.noun, icon: v.nounIcon, type: 'noun' });
                    verbCards.push({ id: v.id, text: v.masu, icon: v.icon, type: 'verb' });
                });

                shuffle(nounCards).forEach(data => createGame3Card(data, nounContainer));
                shuffle(verbCards).forEach(data => createGame3Card(data, verbContainer));

                checkBtn.onclick = () => {
                    const n = slotNoun.querySelector('.dv-game3-card');
                    const v = slotVerb.querySelector('.dv-game3-card');
                    if(!n || !v) {
                        feedback.textContent = 'カードを えらんでね';
                        feedback.className = 'dv-feedback show';
                        return;
                    }
                    if(n.dataset.id === v.dataset.id) {
                        feedback.textContent = 'せいかい！';
                        feedback.className = 'dv-feedback show success';
                        speak(n.textContent + "を" + v.textContent);
                        checkAndAwardPoints('game3', n.dataset.id);
                        setTimeout(setupGame3, 2500);
                    } else {
                        feedback.textContent = 'ちがうよ';
                        feedback.className = 'dv-feedback show';
                        speakFeedback(false);
                        // Return cards
                        nounContainer.appendChild(n);
                        verbContainer.appendChild(v);
                    }
                };
            }

            function createGame3Card(data, container) {
                const el = document.createElement('div');
                el.className = 'dv-game3-card';
                el.dataset.id = data.id;
                el.dataset.type = data.type;
                el.innerHTML = `<i class="${data.icon}"></i> ${data.text}`;
                
                el.onclick = () => {
                    // Move logic
                    const targetSlot = (data.type === 'noun') ? document.getElementById('dv-game3-slot-noun') : document.getElementById('dv-game3-slot-verb');
                    const originalContainer = (data.type === 'noun') ? document.getElementById('dv-game3-card-container-noun') : document.getElementById('dv-game3-card-container-verb');
                    
                    speak(data.text); // Speak card text on click

                    if(el.parentElement === targetSlot) {
                        originalContainer.appendChild(el); // Return
                    } else {
                        if(targetSlot.children.length > 0) {
                            originalContainer.appendChild(targetSlot.firstChild); // Swap
                        }
                        targetSlot.appendChild(el);
                    }
                };
                container.appendChild(el);
            }

        });