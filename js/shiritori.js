// Clean, single IIFE module exposing initShiritori/disposeShiritori
(function () {
  // ゲーム状態
  let allWords = [];
  let usedWords = new Set();
  let lastChar = '';
  let score = 0;
  let incorrectCount = 0;

  // DOM 要素参照
  let elements = null;

  function initElements() {
    elements = {
      menuArea: document.getElementById('shiritori-menu'),
      gameArea: document.getElementById('shiritori-game-area'),
      startButton: document.getElementById('shiritoriStartButton'),
      turnMessage: document.getElementById('turn-message'),
      currentWordText: document.getElementById('current-word-text'),
      imageArea: document.getElementById('image-area'),
      backButton: document.getElementById('shiritoriBackToMenu'),
      choiceButtonsArea: document.getElementById('choice-buttons-area'),
      feedback: document.getElementById('feedback'),
      questionText: document.getElementById('question-text')
    };
  }

  async function loadWords() {
    try {
      const res = await fetch('./data/words.json');
      if (!res.ok) {
        console.error('[Shiritori] failed to fetch words', res.status);
        allWords = [];
        return allWords;
      }
      const data = await res.json();
      allWords = (Array.isArray(data) ? data : []).filter(w => {
        const r = (w.reading || '').toString();
        return r && !r.endsWith('ん') && !r.endsWith('ン');
      });
      console.log('[Shiritori] words loaded:', allWords.length);
      return allWords;
    } catch (err) {
      console.error('[Shiritori] loadWords error', err);
      allWords = [];
      return allWords;
    }
  }

  function updateScoreDisplay(message) {
    if (!elements) return;
    const scoreDisplay = `${score}連鎖 / 失敗${incorrectCount}回`;
    if (elements.turnMessage) elements.turnMessage.innerHTML = `${message} (${scoreDisplay})`;
  }

  function renderMenu() {
    if (!elements) return;
    if (elements.menuArea) elements.menuArea.style.display = 'block';
    if (elements.gameArea) elements.gameArea.style.display = 'none';

    usedWords.clear();
    lastChar = '';
    score = 0;
    incorrectCount = 0;

    if (elements.currentWordText) elements.currentWordText.textContent = '';
    if (elements.feedback) elements.feedback.textContent = '単語を選んでね！';
    if (elements.choiceButtonsArea) elements.choiceButtonsArea.innerHTML = '';
    if (elements.imageArea) elements.imageArea.innerHTML = '';
    if (elements.backButton) elements.backButton.style.display = 'none';

    if (elements.turnMessage) elements.turnMessage.textContent = 'ゲーム開始';
    if (elements.questionText) elements.questionText.textContent = 'しりとりであそぼう！';

    if (elements.startButton) {
      elements.startButton.removeEventListener('click', startNewGame);
      elements.startButton.addEventListener('click', startNewGame);
      const startDisabled = !(Array.isArray(allWords) && allWords.length >= 3);
      elements.startButton.disabled = startDisabled;
      elements.startButton.title = startDisabled ? '単語データを読み込んでください（少なくとも3件）' : '';
    }
  }

  function startNewGame() {
    if (!elements) return;
    if (allWords.length < 3) {
      alert('単語データが不足しています。');
      renderMenu();
      return;
    }

    if (elements.menuArea) elements.menuArea.style.display = 'none';
    if (elements.gameArea) elements.gameArea.style.display = 'block';

    usedWords.clear();
    lastChar = '';
    score = 0;
    incorrectCount = 0;
    if (elements.feedback) elements.feedback.textContent = '単語を選んでね！';

    const firstWord = allWords[Math.floor(Math.random() * allWords.length)];
    useWord(firstWord, 'スタート');
    lastChar = firstWord.reading.slice(-1);
    score = 1;

    playerTurn();
  }

  function playerTurn() {
    if (!elements) return;
    let available = allWords.filter(w => !usedWords.has(w.reading) && (lastChar === '' || w.reading.charAt(0) === lastChar));
    if (available.length === 0) {
      endGame('おめでとう！辞書のすべての単語を使い切りました。', true);
      return;
    }

    const correct = available[Math.floor(Math.random() * available.length)];
    const wrong = [];
    let attempts = 0;
    const MAX = Math.max(allWords.length * 2, 50);
    while (wrong.length < 2 && attempts < MAX) {
      const r = allWords[Math.floor(Math.random() * allWords.length)];
      if (!usedWords.has(r.reading) && r.id !== correct.id && !wrong.some(w => w.id === r.id) && r.reading.charAt(0) !== correct.reading.charAt(0)) {
        wrong.push(r);
      }
      attempts++;
    }

    const choices = shuffleArray([correct, ...wrong.slice(0, 2)]);
    updateScoreDisplay('チャレンジ中！');
    if (elements.questionText) elements.questionText.textContent = `直前の単語は「${lastChar}」で終わりました。この文字から始まるイラストを選んでください。`;
    renderChoices(choices);
  }

  function handleAnswer(e) {
    const card = e.target.closest('.choice-card');
    if (!card) return;
    const reading = card.dataset.wordReading;
    const word = allWords.find(w => w.reading === reading);
    const cards = document.querySelectorAll('.choice-card');
    cards.forEach(c => (c.style.pointerEvents = 'none'));

    if (reading.charAt(0) !== lastChar) {
      if (elements.feedback) {
        elements.feedback.textContent = `ざんねん！「${lastChar}」から始まっていません。`;
        elements.feedback.style.color = '#ff6f61';
      }
      card.style.backgroundColor = '#ff6f61';
      incorrectCount++;
      endGame('ゲームオーバー: ルール違反', false);
      return;
    }

    if (reading.slice(-1) === 'ん') {
      if (elements.feedback) {
        elements.feedback.textContent = `「${word.word}」は「ん」で終わります！ゲームオーバーです。`;
        elements.feedback.style.color = '#ff6f61';
      }
      card.style.backgroundColor = '#ff6f61';
      incorrectCount++;
      endGame('ゲームオーバー: 「ん」で終了', false);
      return;
    }

    if (usedWords.has(reading)) {
      if (elements.feedback) {
        elements.feedback.textContent = `既に使用されています。`;
        elements.feedback.style.color = '#ff6f61';
      }
      incorrectCount++;
      endGame('ゲームオーバー: 使用済み', false);
      return;
    }

    if (elements.feedback) {
      elements.feedback.textContent = 'せいかい！✨ しりとりが繋がりました。';
      elements.feedback.style.color = '#5c7aff';
    }
    card.style.backgroundColor = '#d1e7dd';
    useWord(word, 'あなた');
    lastChar = reading.slice(-1);
    score++;

    setTimeout(() => {
      if (elements.feedback) elements.feedback.textContent = '単語を選んでね！';
      cards.forEach(c => (c.style.pointerEvents = 'auto'));
      playerTurn();
    }, 900);
  }

  function useWord(wordData, user) {
    if (!wordData) return;
    usedWords.add(wordData.reading);
    const img = `assets/images/${wordData.image}`;
    if (elements && elements.imageArea) {
      elements.imageArea.innerHTML = `<img src="${img}" alt="${wordData.word}" onerror="this.style.border='3px solid red';this.alt='画像エラー';" style="width:150px;height:150px;object-fit:cover;border-radius:8px">`;
    }
    if (elements && elements.currentWordText) {
      elements.currentWordText.innerHTML = `直前の単語: <strong style="color:#ff6f61">${wordData.word} (${wordData.reading})</strong>`;
    }
  }

  function endGame(message, isWin) {
    if (!elements) return;
    const finalMessage = isWin ? `🎉 ${message}` : `😭 ${message}`;
    updateScoreDisplay('ゲーム終了');
    if (elements.feedback) elements.feedback.innerHTML = `<div style="font-size:1.05em">${finalMessage}</div><div>あなたの連鎖記録は <strong>${score}連鎖</strong> でした</div>`;
    if (elements.choiceButtonsArea) elements.choiceButtonsArea.innerHTML = '';
    if (elements.backButton) {
      elements.backButton.style.display = 'block';
      elements.backButton.removeEventListener('click', renderMenu);
      elements.backButton.addEventListener('click', renderMenu);
    }
  }

  function renderChoices(choices) {
    if (!elements || !elements.choiceButtonsArea) return;
    elements.choiceButtonsArea.innerHTML = choices
      .map((w, i) => {
        const img = `assets/images/${w.image}`;
        return `<div class="menu-card-button menu-card-reset choice-card" data-word-reading="${w.reading}" data-index="${i}"><img src="${img}" alt="${w.word}" onerror="this.style.border='3px solid red';this.alt='画像エラー';" style="width:120px;height:120px;object-fit:cover;border-radius:6px"></div>`;
      })
      .join('');

    document.querySelectorAll('.choice-card').forEach(btn => btn.addEventListener('click', handleAnswer));
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 公開 API
  window.initShiritori = async function () {
    initElements();
    const words = await loadWords();
    if (words && words.length > 0) {
      renderMenu();
      return true;
    }
    return false;
  };

  window.disposeShiritori = function () {
    elements = null;
    allWords = [];
    usedWords.clear();
    lastChar = '';
    score = 0;
    incorrectCount = 0;
  };

  // 自動初期化は gameLoader が呼ぶこともあるので安全に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try { window.initShiritori(); } catch (e) { /* ignore */ }
    });
  } else {
    try { window.initShiritori(); } catch (e) { /* ignore */ }
  }

})();