document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // クイズデータ
    // ----------------------------------------------------
    // ★重要★: imagesフォルダに、対応する画像ファイル（ame.png, kuruma.pngなど）を入れてください。
    const quizData = [
        {
            image: "images/ame.png",
            options: ["あまい", "にぎやか", "かんたん"],
            correct: "あまい",
            english: "Sweet"
        },
        {
            image: "images/kuruma.png",
            options: ["あおい", "おもい", "すずしい"],
            correct: "あおい",
            english: "Blue"
        },
        {
            image: "images/zou.png",
            options: ["ちいさい", "おおきい", "かるい"],
            correct: "おおきい",
            english: "Big"
        },
        {
            image: "images/taiyo.png",
            options: ["くらい", "さむい", "あかるい"],
            correct: "あかるい",
            english: "Bright"
        },
        {
            image: "images/koori.png",
            options: ["あたたかい", "つめたい", "やさしい"],
            correct: "つめたい",
            english: "Cold"
        }
        // ここに問題を追加できます
    ];

    // ----------------------------------------------------
    // DOM要素の取得
    // ----------------------------------------------------
    const imageElement = document.getElementById('quiz-image');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackElement = document.getElementById('quiz-feedback');

    let currentQuestionIndex = 0;
    let isClickable = true; // 連続クリック防止用

    // ----------------------------------------------------
    // クイズの読み込み処理
    // ----------------------------------------------------
    function loadQuestion() {
        // すべての問題が終わったら
        if (currentQuestionIndex >= quizData.length) {
            imageElement.style.display = 'none'; // 画像を隠す
            optionsContainer.innerHTML = '';
            feedbackElement.textContent = "🎉 すべての問題がおわりました！";
            feedbackElement.classList.remove('hidden');
            feedbackElement.classList.add('feedback-correct');
            return;
        }

        isClickable = true; // クリック可能に戻す
        const currentQuiz = quizData[currentQuestionIndex];

        // 1. 画像をセット
        imageElement.src = currentQuiz.image;
        imageElement.alt = currentQuiz.correct; // altテキストに答えを設定（デバッグ用）

        // 2. 選択肢ボタンを作成
        optionsContainer.innerHTML = ''; // 前の問題のボタンを消去
        feedbackElement.classList.add('hidden'); // フィードバックを隠す
        feedbackElement.classList.remove('feedback-correct', 'feedback-incorrect');

        currentQuiz.options.forEach(optionText => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.classList.add('option-button', 'action-button'); // 既存のスタイルを流用
            
            // 3. ボタンにクリックイベントを設定
            button.addEventListener('click', checkAnswer);
            optionsContainer.appendChild(button);
        });
    }

    // ----------------------------------------------------
    // 答え合わせの処理
    // ----------------------------------------------------
    function checkAnswer(event) {
        if (!isClickable) return; // 処理中はクリックを無視

        const selectedButton = event.target;
        const selectedAnswer = selectedButton.textContent;
        const correctAnswer = quizData[currentQuestionIndex].correct;

        // 4. 間違えた場合
        if (selectedAnswer !== correctAnswer) {
            feedbackElement.textContent = "🤔 ちがうよ、もういちど！";
            feedbackElement.classList.remove('hidden');
            feedbackElement.classList.add('feedback-incorrect');
            
            // 間違えたボタンだけを無効化
            selectedButton.disabled = true; 
            selectedButton.classList.add('wrong-selection'); // CSS用
            isClickable = true; // 他のボタンはまだ押せる
        } 
        // 5. 正解した場合
        else {
            isClickable = false; // 次の問題が読み込まれるまでクリック不可
            const englishTranslation = quizData[currentQuestionIndex].english;

            feedbackElement.textContent = `🎉 せいかい！ ( ${englishTranslation} )`;
            feedbackElement.classList.remove('hidden');
            feedbackElement.classList.add('feedback-correct');

            // すべてのボタンを無効化
            optionsContainer.querySelectorAll('.option-button').forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct-selection'); // CSS用
                }
            });

            // 1.5秒後に次の問題へ進む
            currentQuestionIndex++;
            setTimeout(loadQuestion, 1500);
        }
    }

    // 最初の問題を読み込む
    loadQuestion();
});