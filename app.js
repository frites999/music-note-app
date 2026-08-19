const TOTAL_QUESTIONS = 10;

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


/* ================================
   音の一覧
================================ */

const NOTES = [
  {
    name: "ド",
    step: 0
  },
  {
    name: "レ",
    step: 1
  },
  {
    name: "ミ",
    step: 2
  },
  {
    name: "ファ",
    step: 3
  },
  {
    name: "ソ",
    step: 4
  },
  {
    name: "ラ",
    step: 5
  },
  {
    name: "シ",
    step: 6
  },
  {
    name: "高いド",
    step: 7
  }
];


/* ================================
   メニュー
================================ */

document
  .querySelectorAll(".clef-button")
  .forEach((button) => {

    button.addEventListener("click", () => {
      startGame(button.dataset.clef);
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


/* ================================
   ゲーム開始
================================ */

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


/* ================================
   次の問題
================================ */

function showNextQuestion() {

  if (questionNumber >= TOTAL_QUESTIONS) {
    showResult();
    return;
  }

  questionNumber++;

  locked = false;

  messageEl.textContent = "";

  nextButton.classList.add("hidden");

  progressEl.textContent =
    `${questionNumber} / ${TOTAL_QUESTIONS}`;

  scoreEl.textContent =
    `⭐ ${score}`;

  currentQuestion = makeQuestion();

  drawNote(currentQuestion.step);

  renderAnswers(currentQuestion);
}


/* ================================
   問題作成
================================ */

function makeQuestion() {

  const index = randomInt(
    0,
    NOTES.length - 1
  );

  return NOTES[index];
}


/* ================================
   音符を描画
================================ */

function drawNote(step) {

  /*
    五線譜

    第1線 = y 180
    第2線 = y 155
    第3線 = y 130
    第4線 = y 105
    第5線 = y 80

    音階1つ分 = 12.5px
  */


  let y;


  if (currentClef === "treble") {

    /*
      ト音記号

      中央のド〜高いド

      ド       = 第1線の下
      レ       = 第1線の下の間
      ミ       = 第1線
      ファ     = 第1間
      ソ       = 第2線
      ラ       = 第2間
      シ       = 第3線
      高いド   = 第3間
    */

    const trebleY = [
      192.5, // ド
      186.25, // レ
      180,   // ミ
      167.5, // ファ
      155,   // ソ
      142.5, // ラ
      130,   // シ
      117.5  // 高いド
    ];

    y = trebleY[step];

  } else {

    /*
      ヘ音記号

      中央のド〜高いド

      ド       = 第5線の上
      レ       = 第5線
      ミ       = 第4間
      ファ     = 第4線
      ソ       = 第3間
      ラ       = 第3線
      シ       = 第2間
      高いド   = 第2線
    */

    const bassY = [
      67.5,  // ド
      80,    // レ
      92.5,  // ミ
      105,   // ファ
      117.5, // ソ
      130,   // ラ
      142.5, // シ
      155    // 高いド
    ];

    y = bassY[step];
  }


  /*
    音符の位置
  */

  noteHead.setAttribute(
    "cy",
    y
  );


  /*
    棒は音符の右側から上へ
  */

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


/* ================================
   答え
================================ */

function renderAnswers(question) {

  answersEl.innerHTML = "";

  const answers = NOTES.map(
    (note) => note.name
  );

  shuffle(answers);

  answers.forEach((answer) => {

    const button =
      document.createElement("button");

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

    answersEl.appendChild(button);

  });
}


/* ================================
   正解判定
================================ */

function checkAnswer(
  selected,
  button
) {

  if (locked) return;

  locked = true;

  const buttons = [
    ...document.querySelectorAll(
      ".answer-button"
    )
  ];

  buttons.forEach((btn) => {
    btn.disabled = true;
  });


  if (
    selected === currentQuestion.name
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

    nextButton.classList.remove(
      "hidden"
    );
  }
}


/* ================================
   結果
================================ */

function showResult() {

  quiz.classList.add("hidden");

  result.classList.remove("hidden");

  resultScoreEl.textContent =
    `${score} / ${TOTAL_QUESTIONS}`;


  if (score === TOTAL_QUESTIONS) {

    resultTextEl.textContent =
      "ぜんぶ せいかい！ すごいね！ 🌟";

  } else if (score >= 7) {

    resultTextEl.textContent =
      "よくできました！ すごい！";

  } else if (score >= 4) {

    resultTextEl.textContent =
      "がんばったね！ もういちど やってみよう！";

  } else {

    resultTextEl.textContent =
      "れんしゅう おつかれさま！ またやってみよう！";
  }
}


/* ================================
   メニューへ戻る
================================ */

function showMenu() {

  quiz.classList.add("hidden");

  result.classList.add("hidden");

  menu.classList.remove("hidden");

  messageEl.textContent = "";

  nextButton.classList.add("hidden");
}


/* ================================
   ランダム
================================ */

function randomInt(min, max) {

  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}


/* ================================
   シャッフル
================================ */

function shuffle(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j = randomInt(0, i);

    [
      array[i],
      array[j]
    ] = [
      array[j],
      array[i]
    ];
  }

  return array;
}
