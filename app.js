const TOTAL_QUESTIONS = 8;


/* ================================
   HTML要素
================================ */

const menu =
  document.getElementById("menu");

const quiz =
  document.getElementById("quiz");

const result =
  document.getElementById("result");

const answersEl =
  document.getElementById("answers");

const messageEl =
  document.getElementById("message");

const progressEl =
  document.getElementById("progress");

const scoreEl =
  document.getElementById("score");

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

const ledgerLine =
  document.getElementById("ledger-line");


/* ================================
   状態
================================ */

let currentClef = null;

let currentQuestion = null;

let questionNumber = 0;

let score = 0;

let locked = false;


/* ================================
   音の一覧

   出題順は固定

   ど
   れ
   み
   ふぁ
   そ
   ら
   し
   ど
================================ */

const NOTES = [

  {
    answer: "ど",
    step: 0
  },

  {
    answer: "れ",
    step: 1
  },

  {
    answer: "み",
    step: 2
  },

  {
    answer: "ふぁ",
    step: 3
  },

  {
    answer: "そ",
    step: 4
  },

  {
    answer: "ら",
    step: 5
  },

  {
    answer: "し",
    step: 6
  },

  {
    answer: "ど",
    step: 7
  }

];


/* ================================
   メニュー
================================ */

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


/* ================================
   ボタン
================================ */

backButton.addEventListener(
  "click",
  showMenu
);


againButton.addEventListener(
  "click",
  () => {

    startGame(
      currentClef
    );

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


  menu.classList.add(
    "hidden"
  );

  result.classList.add(
    "hidden"
  );

  quiz.classList.remove(
    "hidden"
  );


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


/* ================================
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

   の順番
================================ */

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


  messageEl.textContent =
    "";


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


  renderAnswers();
}


/* ================================
   音符を描く
================================ */

function drawNote(step) {

  let y;


  /* =================================
     ト音記号
  ================================= */

  if (
    currentClef ===
    "treble"
  ) {

    /*
      ト音記号

      ど       = 加線1本
      れ       = 加線と第1線の間
      み       = 第1線
      ふぁ     = 第1間
      そ       = 第2線
      ら       = 第2間
      し       = 第3線
      ど       = 第3間
    */


    const treblePositions = [

      205,    // ど

      192.5,  // れ

      180,    // み

      167.5,  // ふぁ

      155,    // そ

      142.5,  // ら

      130,    // し

      117.5   // 高いど

    ];


    y =
      treblePositions[step];

  }


  /* =================================
     ヘ音記号
  ================================= */

  else {

    /*
      ヘ音記号

      ど       = 第1線の下
      れ       = 第1線
      み       = 第1間
      ふぁ     = 第2線
      そ       = 第2間
      ら       = 第3線
      し       = 第3間
      ど       = 第4線

      音が高くなるほど
      画面上では上に移動する。
    */


    const bassPositions = [

      192.5,  // ど

      180,    // れ

      167.5,  // み

      155,    // ふぁ

      142.5,  // そ

      130,    // ら

      117.5,  // し

      105     // 高いど

    ];


    y =
      bassPositions[step];

  }


  /* =================================
     加線

     ト音記号：
     低い「ど」

     ヘ音記号：
     低い「ど」
  ================================= */

  if (
    step === 0
  ) {

    ledgerLine.classList.remove(
      "hidden"
    );

    /*
      ト音記号とヘ音記号で
      加線の位置を変更
    */

    if (
      currentClef ===
      "treble"
    ) {

      ledgerLine.setAttribute(
        "y1",
        205
      );

      ledgerLine.setAttribute(
        "y2",
        205
      );

    } else {

      ledgerLine.setAttribute(
        "y1",
        192.5
      );

      ledgerLine.setAttribute(
        "y2",
        192.5
      );

    }

  } else {

    ledgerLine.classList.add(
      "hidden"
    );

  }


  /* =================================
     音符の位置
  ================================= */

  noteHead.setAttribute(
    "cy",
    y
  );


  /* =================================
     音符の棒
  ================================= */

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

   順番固定

   ど
   れ
   み
   ふぁ
   そ
   ら
   し
   ど
================================ */

function renderAnswers() {

  answersEl.innerHTML =
    "";


  NOTES.forEach(
    (note) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "answer-button";


      button.textContent =
        note.answer;


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


/* ================================
   正解判定
================================ */

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


  /* ================================
     正解
  ================================= */

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


    /*
      正解なら自動的に次へ
    */

    setTimeout(
      showNextQuestion,
      900
    );

  }


  /* ================================
     間違い
  ================================= */

  else {

    button.classList.add(
      "wrong"
    );


    messageEl.textContent =
      `❌ おしい！ こたえは「${currentQuestion.answer}」`;


    /*
      正解ボタンを表示
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
      「つぎへ」を押して進む
    */

    nextButton.classList.remove(
      "hidden"
    );

  }

}


/* ================================
   結果
================================ */

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

  }

  else if (
    score >= 6
  ) {

    resultTextEl.textContent =
      "よくできました！ すごい！";

  }

  else if (
    score >= 4
  ) {

    resultTextEl.textContent =
      "がんばったね！ もういちど やってみよう！";

  }

  else {

    resultTextEl.textContent =
      "れんしゅう おつかれさま！ またやってみよう！";

  }

}


/* ================================
   メニューへ戻る
================================ */

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


  messageEl.textContent =
    "";


  nextButton.classList.add(
    "hidden"
  );

}
