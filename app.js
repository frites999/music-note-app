const TOTAL_QUESTIONS = 8;

const menu = document.getElementById("menu");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const answersEl = document.getElementById("answers");
const messageEl = document.getElementById("message");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");

const resultScoreEl =
  document.getElementById("result-score");

const resultTextEl =
  document.getElementById("result-text");

const backButton =
  document.getElementById("back-button");

const againButton =
  document.getElementById("again-button");

const menuButton =
  document.getElementById("menu-button");

const nextButton =
  document.getElementById("next-button");

const clefTitle =
  document.getElementById("clef-title");

const clefSymbol =
  document.getElementById("clef-symbol");

const noteHead =
  document.getElementById("note-head");

const noteStem =
  document.getElementById("note-stem");

let currentClef = null;
let currentQuestion = null;
let questionNumber = 0;
let score = 0;
let locked = false;


/*
================================
音の順番

画面には

ど
れ
み
ふぁ
そ
ら
し
ど

と表示する。

最後の「ど」は高いド。
================================
*/

const NOTES = [
  {
    answer: "ど",
    label: "ど",
    step: 0
  },
  {
    answer: "れ",
    label: "れ",
    step: 1
  },
  {
    answer: "み",
    label: "み",
    step: 2
  },
  {
    answer: "ふぁ",
    label: "ふぁ",
    step: 3
  },
  {
    answer: "そ",
    label: "そ",
    step: 4
  },
  {
    answer: "ら",
    label: "ら",
    step: 5
  },
  {
    answer: "し",
    label: "し",
    step: 6
  },
  {
    answer: "ど",
    label: "ど",
    step: 7
  }
];


/*
================================
メニュー
================================
*/

document
  .querySelectorAll(".clef-button")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        startGame(
          button.dataset.clef
        );

      }
    );

  });


backButton.addEventListener(
  "click",
  showMenu
);


againButton.addEventListener(
  "click",
  () => {

    startGame(currentClef);

  }
);


menuButton.addEventListener(
  "click",
  showMenu
);


nextButton.addEventListener(
  "click",
  showNextQuestion
);


/*
================================
ゲーム開始
================================
*/

function startGame(clef) {

  currentClef = clef;

  questionNumber = 0;

  score = 0;

  locked = false;

  menu.classList.add("hidden");

  result.classList.add("hidden");

  quiz.classList.remove("hidden");

  nextButton.classList.add(
    "hidden"
  );


  if (clef === "treble") {

    clefTitle.textContent =
      "🎼 ト音記号";

    clefSymbol.textContent =
      "𝄞";

  } else {

    clefTitle.textContent =
      "🎼 ヘ音記号";

    clefSymbol.textContent =
      "𝄢";

  }


  showNextQuestion();
}


/*
================================
次の問題

ランダムではなく、

ど
↓
れ
↓
み
↓
ふぁ
↓
そ
↓
ら
↓
し
↓
ど

の順番。
================================
*/

function showNextQuestion() {

  if (
    questionNumber >=
    TOTAL_QUESTIONS
  ) {

    showResult();

    return;
  }


  currentQuestion =
    NOTES[questionNumber];


  questionNumber++;

  locked = false;

  messageEl.textContent = "";

  nextButton.classList.add(
    "hidden"
  );


  progressEl.textContent =
    `${questionNumber} / ${TOTAL_QUESTIONS}`;


  scoreEl.textContent =
    `⭐ ${score}`;


  drawNote(
    currentQuestion.step
  );


  renderAnswers(
    currentQuestion
  );
}


/*
================================
音符の位置

五線譜

第1線 = 180
第2線 = 155
第3線 = 130
第4線 = 105
第5線 = 80

線と線の間 = 12.5px
================================
*/

function drawNote(step) {

  let y;


  if (
    currentClef ===
    "treble"
  ) {

    /*
    ト音記号

    ど       = 第1線の下
    れ       = 第1線の下の間
    み       = 第1線
    ふぁ     = 第1間
    そ       = 第2線
    ら       = 第2間
    し       = 第3線
    ど       = 第3間
    */

    const positions = [
      192.5, // ど
      186.25, // れ
      180,    // み
      167.5,  // ふぁ
      155,    // そ
      142.5,  // ら
      130,    // し
      117.5   // 高いど
    ];

    y = positions[step];

  } else {

    /*
    ヘ音記号

    ど       = 第5線の上
    れ       = 第5線
    み       = 第4間
    ふぁ     = 第4線
    そ       = 第3間
    ら       = 第3線
    し       = 第2間
    ど       = 第2線
    */

    const positions = [
      67.5,   // ど
      80,     // れ
      92.5,   // み
      105,    // ふぁ
      117.5,  // そ
      130,    // ら
      142.5,  // し
      155     // 高いど
    ];

    y = positions[step];
  }


  noteHead.setAttribute(
    "cy",
    y
  );


  noteStem.setAttribute(
    "x1",
    376
  );

  noteStem.setAttribute(
    "x2",
    376
  );

  noteStem.setAttribute(
    "y1",
    y
  );

  noteStem.setAttribute(
    "y2",
    y - 75
  );
}


/*
================================
回答ボタン

順番を固定。

ど れ み ふぁ
そ ら し ど
================================
*/

function renderAnswers() {

  answersEl.innerHTML = "";


  NOTES.forEach(
    (note) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "answer-button";


      button.textContent =
        note.label;


      button.addEventListener(
        "click",
        () => {

          checkAnswer(
            note,
            button
          );

        }
      );


      answersEl.appendChild(
        button
      );

    }
  );
}


/*
================================
正解判定
================================
*/

function checkAnswer(
  selected,
  button
) {

  if (locked) {
    return;
  }


  locked = true;


  const buttons = [
    ...document.querySelectorAll(
      ".answer-button"
    )
  ];


  buttons.forEach(
    (btn) => {

      btn.disabled = true;

    }
  );


  /*
  stepで比較する。

  これにより、

  最初の「ど」と
  最後の「ど」

  を正しく区別できる。
  */

  if (
    selected.step ===
    currentQuestion.step
  ) {

    score++;


    button.classList.add(
      "correct"
    );


    messageEl.textContent =
      "⭕ せいかい！ すごい！";


    scoreEl.textContent =
      `⭐ ${score}`;


    setTimeout(
      showNextQuestion,
      900
    );

  } else {

    button.classList.add(
      "wrong"
    );


    messageEl.textContent =
      `❌ おしい！ こたえは「${currentQuestion.label}」`;


    /*
    正解ボタンを探す。

    最後の「ど」はstep=7なので
    最初の「ど」と区別できる。
    */

    const correctButton =
      buttons[
        currentQuestion.step
      ];


    if (correctButton) {

      correctButton.classList.add(
        "correct"
      );

    }


    /*
    間違えたら
    自分で「つぎへ」を押す。
    */

    nextButton.classList.remove(
      "hidden"
    );
  }
}


/*
================================
結果
================================
*/

function showResult() {

  quiz.classList.add(
    "hidden"
  );

  result.classList.remove(
    "hidden"
  );


  resultScoreEl.textContent =
    `${score} / ${TOTAL_QUESTIONS}`;


  if (
    score ===
    TOTAL_QUESTIONS
  ) {

    resultTextEl.textContent =
      "ぜんぶ せいかい！ すごいね！ 🌟";

  } else if (
    score >= 6
  ) {

    resultTextEl.textContent =
      "よくできました！ すごい！";

  } else if (
    score >= 4
  ) {

    resultTextEl.textContent =
      "がんばったね！ もういちど やってみよう！";

  } else {

    resultTextEl.textContent =
      "れんしゅう おつかれさま！ またやってみよう！";
  }
}


/*
================================
メニューへ
================================
*/

function showMenu() {

  quiz.classList.add(
    "hidden"
  );

  result.classList.add(
    "hidden"
  );

  menu.classList.remove(
    "hidden"
  );


  messageEl.textContent = "";


  nextButton.classList.add(
    "hidden"
  );
}
