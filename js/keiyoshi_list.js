// データ保持用
        let adjectiveData = [];

        // ページ読み込み完了時
        document.addEventListener('DOMContentLoaded', async () => {
            const container = document.getElementById('list-container');
            const searchInput = document.getElementById('search-input');
            
            // 音声合成の準備
            const synth = window.speechSynthesis;
            let voices = [];
            
            const loadVoices = () => { 
                voices = synth.getVoices(); 
            };
            if (synth.onvoiceschanged !== undefined) {
                synth.onvoiceschanged = loadVoices;
            }
            setTimeout(loadVoices, 500); // 念のため少し遅延させて取得

            // 1. JSONデータの取得
            try {
                const response = await fetch('data/keiyoshi.json');
                if (!response.ok) throw new Error("JSON not found");
                const jsonData = await response.json();
                adjectiveData = jsonData.adjectives; // JSON構造に合わせて配列を取得
                console.log("JSON loaded:", adjectiveData.length + " words");
                renderList(adjectiveData);
            } catch (e) {
                console.error("Error loading data/keiyoshi.json:", e);
                container.innerHTML = '<p style="text-align:center; color:red;">データの読み込みに失敗しました。</p>';
            }

            // 2. リスト描画関数
            function renderList(list) {
                container.textContent = '';
                if (list.length === 0) {
                    container.innerHTML = '<p style="text-align:center; color:#999; grid-column:1/-1;">みつかりませんでした。</p>';
                    return;
                }

                list.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'word-card';
                    
                    // 文字数が多い場合にフォントサイズを調整
                    const fontSize = item.kanji.length > 4 ? '1.2em' : '1.8em';
                    
                    // 形容詞タイプのラベル
                    const typeLabel = item.type === 'i' ? 'い-adj' : 'な-adj';
                    const typeClass = item.type === 'i' ? 'type-i' : 'type-na';

                    card.innerHTML = `
                        <div class="word-box" style="font-size: ${fontSize}">${item.kanji}</div>
                        <div class="info-box">
                            <div class="meaning">${item.meaning}</div>
                            <div class="reading">${item.hiragana}</div>
                            <span class="type-badge ${typeClass}">${typeLabel}</span>
                        </div>
                        <button class="sound-btn" onclick="speak('${item.kanji}')">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    `;
                    container.appendChild(card);
                });
            }

            // 3. 音声再生関数 (Global)
            window.speak = (text) => {
                if (synth.speaking) synth.cancel();

                const utterThis = new SpeechSynthesisUtterance(text);
                utterThis.lang = 'ja-JP';
                utterThis.rate = 0.9;

                // 日本語の女性の声を探すロジック
                const jpVoices = voices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
                
                // 優先キーワード: Google, Female, Kyoko など
                const preferredKeywords = ['Google', 'Female', 'Kyoko', 'O-Ren', 'Haruka'];
                let targetVoice = jpVoices.find(v => preferredKeywords.some(k => v.name.includes(k)));
                
                if (!targetVoice && jpVoices.length > 0) targetVoice = jpVoices[0];
                if (targetVoice) utterThis.voice = targetVoice;

                synth.speak(utterThis);
            };

            // 4. 検索フィルタ機能
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                const filtered = adjectiveData.filter(item => {
                    return item.kanji.includes(val) || 
                           item.hiragana.includes(val) ||
                           item.meaning.toLowerCase().includes(val);
                });
                renderList(filtered);
            });
        });