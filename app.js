const TOTAL_QUESTIONS = 8;


/* =================================
   HTML要素
================================= */

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


/* =================================
   ゲーム状態
================================= */

let currentClef = null;

let currentQuestion = null;

let questionNumber = 0;

let score = 0;

let locked = false;


/* =================================
   音の一覧

   ランダムにはしない。

   ど
   れ
   み
   ふぁ
   そ
   ら
   し
   ど
================================= */

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


/* =================================
   メニュー
================================= */

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


/* =================================
   ボタン
================================= */

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


/* =================================
   ゲーム開始
================================= */

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
      "とおんきごう";

    clefSymbol.textContent =
      "𝄞";

  } else {

    clefTitle.textContent =
      "へおんきごう";

    clefSymbol.textContent =
      "𝄢";

  }


  showNextQuestion();
}


/* =================================
   次の問題
================================= */

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


/* =================================
   音符を描く
================================= */

function drawNote(step) {

  let y;


  /* =================================
     とおんきごう
  ================================= */

  if (
    currentClef ===
    "treble"
  ) {

    /*
      とおんきごう

      ど       = 加線
      れ       = 加線と第1線の間
      み       = 第1線
      ふぁ     = 第1間
      そ       = 第2線
      ら       = 第2間
      し       = 第3線
      ど       = 第3間
    */

    const treblePositions = [

      205,     // ど

      192.5,   // れ

      180,     // み

      167.5,   // ふぁ

      155,     // そ

      142.5,   // ら

      130,     // し

      117.5    // 高いど

    ];


    y =
      treblePositions[step];

  }


  /* =================================
     へおんきごう
  ================================= */

  else {

    /*
      へおんきごう

      今回は、ユーザー指定の位置。

      ど       = 下から2番目と
                 3番目の線の間
                 （ト音記号の「ら」と同じ高さ）

      れ       = その1段上
      み       = さらに1段上
      ふぁ     = さらに1段上
      そ       = さらに1段上
      ら       = さらに1段上
      し       = さらに1段上
      ど       = さらに1段上

      音が高くなるほど
      画面上で上へ移動する。
    */

    const bassPositions = [

      142.5,   // ど

      130,     // れ

      117.5,   // み

      105,     // ふぁ

      92.5,    // そ

      80,      // ら

      67.5,    // し

      55       // 高いど

    ];


    y =
      bassPositions[step];

  }


  /* =================================
     加線

     とおんきごうの低い「ど」
     だけ表示。

     へおんきごうの「ど」は
     五線内なので加線なし。
  ================================= */

  if (
    currentClef === "treble" &&
    step === 0
  ) {

    ledgerLine.classList.remove(
      "hidden"
    );


    ledgerLine.setAttribute(
      "y1",
      205
    );


    ledgerLine.setAttribute(
      "y2",
      205
    );

  } else {

    ledgerLine.classList.add(
      "hidden"
    );

  }


  /* =================================
     音符の頭
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


/* =================================
   回答ボタン
================================= */

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


/* =================================
   答え合わせ
================================= */

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


  /* =================================
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


    setTimeout(
      showNextQuestion,
      900
    );

  }


  /* =================================
     間違い
  ================================= */

  else {

    button.classList.add(
      "wrong"
    );


    messageEl.textContent =
      `❌ おしい！ こたえは「${currentQuestion.answer}」`;


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
      間違えたときは
      「つぎへ」を押す
    */

    nextButton.classList.remove(
      "hidden"
    );

  }

}


/* =================================
   結果
================================= */

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


/* =================================
   メニューへ戻る
================================= */

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
