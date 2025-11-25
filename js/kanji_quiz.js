let kanjiList = [];
let currentIndex = 0;

// JSON読み込み
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    kanjiList = data.kanji_list;
    shuffleArray(kanjiList); // 出題順をシャッフル
    showQuestion();
  });

// 配列シャッフル関数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 問題を表示
function showQuestion() {
  const q = kanjiList[currentIndex];

  // 問題の漢字を表示
  document.getElementById("kanji-display").textContent = q.kanji;

  // 正解の読み方（今回は訓読みを正解にする例）
  const correct = q.kun;

  // 選択肢生成（訓読み・音読みから3つ）
  let choices = [q.kun, q.on];

  // ダミー選択肢を追加
  while (choices.length < 3) {
    const random = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    if (random.kun !== q.kun) choices.push(random.kun);
  }

  // シャッフル
  shuffleArray(choices);

  // ボタン表示
  const buttons = document.querySelectorAll(".choice-button");
  buttons.forEach((btn, idx) => {
    btn.textContent = choices[idx];
    btn.onclick = () => checkAnswer(choices[idx], correct);
  });

  // 問題番号
  document.getElementById("question-number").textContent =
    `第 ${currentIndex + 1} 問`;
}

// 回答チェック
function checkAnswer(selected, correct) {
  if (selected === correct) {
    alert("正解！");
  } else {
    alert(`不正解… 正しい読み方は「${correct}」です`);
  }

  // 次の問題
  currentIndex++;
  if (currentIndex >= kanjiList.length) currentIndex = 0;

  showQuestion();
}
