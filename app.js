const TOTAL_QUESTIONS = 10;

const menu = document.getElementById("menu");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const questionEl = document.getElementById("question");
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


/* --------------------------------
   音の定義
-------------------------------- */

const NOTES = [
  {
    name: "ド",
    short: "ド",
    step: 0
  },

  {
    name: "レ",
    short: "レ",
    step: 1
  },

  {
    name: "ミ",
    short: "ミ",
    step: 2
  },

  {
    name: "ファ",
    short: "ファ",
    step: 3
  },

  {
    name: "ソ",
    short: "ソ",
    step: 4
  },

  {
    name: "ラ",
    short: "ラ",
    step: 5
  },

  {
    name: "シ",
    short: "シ",
    step: 6
  },

  {
    name: "高いド",
    short: "高いド",
    step: 7
  }
];


/* --------------------------------
   メニュー
-------------------------------- */

document
  .querySelectorAll(".clef-button")
  .forEach((button) => {

    button.addEventListener("click", () => {

      startGame(
        button.dataset.clef
      );

    });

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


/* --------------------------------
   ゲーム開始
-------------------------------- */

function startGame(clef) {

  currentClef = clef;

  questionNumber = 0;

  score = 0;

  locked = false;

  menu.classList.add("hidden");

  result.classList.add("hidden");

  quiz.classList.remove("hidden");

  nextButton.classList.add("hidden");

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


/* --------------------------------
   次の問題
-------------------------------- */

function showNextQuestion() {

  if (
    questionNumber >=
    TOTAL_QUESTIONS
  ) {

    showResult();

    return;
  }

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

  currentQuestion =
    makeQuestion();

  drawNote(
    currentQuestion.step
  );

  renderAnswers(
    currentQuestion
  );
}


/* --------------------------------
   問題を作る
-------------------------------- */

function makeQuestion() {

  const index =
    randomInt(
      0,
      NOTES.length - 1
    );

  const note =
    NOTES[index];

  return {

    name: note.name,

    short: note.short,

    step: note.step

  };
}


/* --------------------------------
   音符を描く
-------------------------------- */

function drawNote(step) {

  /*
    五線譜

    上から

    第1線
    第2線
    第3線
    第4線
    第5線

    の間隔を25pxとしている。
  */


  let y;


  if (currentClef === "treble") {

    /*
      ト音記号

      ミ = 第1線
      ファ = 第1間
      ソ = 第2線
      ラ = 第2間
      シ = 第3線
      ド = 第3間
      レ = 第4線
      高いド = 第5線
    */

    const trebleY = [
      180, // ド
      167.5, // レ
      155, // ミ
      142.5, // ファ
      130, // ソ
      117.5, // ラ
      105, // シ
      92.5 // 高いド
    ];

    y = trebleY[step];

  } else {

    /*
      ヘ音記号

      ド = 第1間の下
      レ = 第1線
      ミ = 第1間
      ファ = 第2線
      ソ = 第2間
      ラ = 第3線
      シ = 第3間
      高いド = 第3間の上
    */

    const bassY = [
      192.5, // ド
      180,   // レ
      167.5, // ミ
      155,   // ファ
      142.5, // ソ
      130,   // ラ
      117.5, // シ
      105    // 高いド
    ];

    y = bassY[step];

  }


  /*
    音符
  */

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


/* --------------------------------
   答えボタン
-------------------------------- */

function renderAnswers(question) {

  answersEl.innerHTML = "";


  const answers =
    NOTES.map(
      (note) => note.name
    );


  shuffle(answers);


  answers.forEach(
    (answer) => {

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "answer-button";

      button.textContent =
        answer;

      button.addEventListener(
        "click",
        () => {

          checkAnswer(
            answer,
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


/* --------------------------------
   正解判定
-------------------------------- */

function checkAnswer(
  selected,
  button
) {

  if (locked) return;

  locked = true;


  const buttons =
    [
      ...document.querySelectorAll(
        ".answer-button"
      )
    ];


  buttons.forEach(
    (btn) => {

      btn.disabled = true;

    }
  );


  if (
    selected ===
    currentQuestion.name
  ) {

    score++;

    button.classList.add(
      "correct"
    );

    messageEl.textContent =
      "⭕ せいかい！ すごい！";

    scoreEl.textContent =
      `⭐ ${score}`;


    /*
      正解なら自動的に次へ
    */

    setTimeout(
      showNextQuestion,
      900
    );


  } else {

    button.classList.add(
      "wrong"
    );


    messageEl.textContent =
      `❌ おしい！ これは ${currentQuestion.name}`;


    const correctButton =
      buttons.find(
        (btn) =>
          btn.textContent ===
          currentQuestion.name
      );


    if (correctButton) {

      correctButton.classList.add(
        "correct"
      );

    }


    /*
      間違えたら
      「つぎへ」を表示
    */

    nextButton.classList.remove(
      "hidden"
    );
  }
}


/* --------------------------------
   結果
-------------------------------- */

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
    score >= 7
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


/* --------------------------------
   メニューに戻る
-------------------------------- */

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


/* --------------------------------
   ランダム
-------------------------------- */

function randomInt(
  min,
  max
) {

  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;

}


/* --------------------------------
   シャッフル
-------------------------------- */

function shuffle(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      randomInt(
        0,
        i
      );

    [
      array[i],
      array[j]
    ] =
      [
        array[j],
        array[i]
      ];

  }

  return array;
}
