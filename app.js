/* =================================
   問題数
================================= */

const EASY_QUESTIONS = 8;
const HARD_QUESTIONS = 10;


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

let currentLevel = null;

let currentQuestion = null;

let questionNumber = 0;

let score = 0;

let locked = false;

let totalQuestions = EASY_QUESTIONS;


/* =================================
   音の一覧

   答えボタンは常にこの8種類
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
   現在の問題リスト
================================= */

let questionList = [];


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
          button.dataset.clef,
          button.dataset.level
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
      currentClef,
      currentLevel
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

function startGame(
  clef,
  level
) {

  currentClef = clef;

  currentLevel = level;

  questionNumber = 0;

  score = 0;

  locked = false;


  /* --------------------------------
     問題数
  -------------------------------- */

  if (
    level === "hard"
  ) {

    totalQuestions =
      HARD_QUESTIONS;

  } else {

    totalQuestions =
      EASY_QUESTIONS;

  }


  /* --------------------------------
     問題を作る
  -------------------------------- */

  if (
    level === "hard"
  ) {

    /*
      むずかしい：

      8種類の音から
      ランダムに10問
    */

    questionList = [];

    for (
      let i = 0;
      i < HARD_QUESTIONS;
      i++
    ) {

      const randomIndex =
        Math.floor(
          Math.random() *
          NOTES.length
        );


      questionList.push(
        NOTES[randomIndex]
      );

    }

  } else {

    /*
      かんたん：

      ど → れ → み → ...
    */

    questionList =
      [...NOTES];

  }


  /* --------------------------------
     画面
  -------------------------------- */

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


  /* --------------------------------
     音部記号
  -------------------------------- */

  if (
    clef === "treble"
  ) {

    clefTitle.textContent =
      level === "hard"
        ? "とおんきごう・むずかしい"
        : "とおんきごう";

    clefSymbol.textContent =
      "𝄞";

  } else {

    clefTitle.textContent =
      level === "hard"
        ? "へおんきごう・むずかしい"
        : "へおんきごう";

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
    totalQuestions
  ) {

    showResult();

    return;
  }


  currentQuestion =
    questionList[
      questionNumber
    ];


  questionNumber++;

  locked = false;


  messageEl.textContent =
    "";


  nextButton.classList.add(
    "hidden"
  );


  progressEl.textContent =
    `${questionNumber} / ${totalQuestions}`;


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


    /* --------------------------------
       低いどの加線
    -------------------------------- */

    if (
      step === 0
    ) {

      ledgerLine.classList.remove(
        "hidden"
      );

      ledgerLine.setAttribute(
        "x1",
        335
      );

      ledgerLine.setAttribute(
        "x2",
        385
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


    /* --------------------------------
       とおんきごうの棒

       上向き
    -------------------------------- */

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
     へおんきごう
  ================================= */

  else {

    /*
      へおんきごう

      ど       = 142.5
      れ       = 130
      み       = 117.5
      ふぁ     = 105
      そ       = 92.5
      ら       = 80
      し       = 67.5
      高いど   = 55 ＋ 加線
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


    /* --------------------------------
       高いどの加線
    -------------------------------- */

    if (
      step === 7
    ) {

      ledgerLine.classList.remove(
        "hidden"
      );

      ledgerLine.setAttribute(
        "x1",
        335
      );

      ledgerLine.setAttribute(
        "x2",
        385
      );

      ledgerLine.setAttribute(
        "y1",
        55
      );

      ledgerLine.setAttribute(
        "y2",
        55
      );

    } else {

      ledgerLine.classList.add(
        "hidden"
      );

    }


    /* --------------------------------
       へおんきごうの棒

       下向き
    -------------------------------- */

    noteStem.setAttribute(
      "x1",
      344
    );

    noteStem.setAttribute(
      "x2",
      344
    );

    noteStem.setAttribute(
      "y1",
      y
    );

    noteStem.setAttribute(
      "y2",
      y + 75
    );

  }


  /* =================================
     音符の頭
  ================================= */

  noteHead.setAttribute(
    "cx",
    360
  );

  noteHead.setAttribute(
    "cy",
    y
  );

}


/* =================================
   回答ボタン
================================= */

function renderAnswers() {

  answersEl.innerHTML =
    "";


  /*
    むずかしい場合も
    ボタンは同じ。

    ど
    れ
    み
    ふぁ
    そ
    ら
    し
    ど
  */

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


    /*
      同じ「ど」が2つあるため、
      stepで正しいボタンを探す。
    */

    const correctButton =
      buttons.find(
        (btn) =>
          btn.textContent ===
          currentQuestion.answer
      );


    /*
      「ど」が2つあるので、
      現在の問題のstepに
      対応するボタンを正解にする。

      ただし表示上は同じ「ど」なので、
      どちらを押しても正解にする。
    */

    if (correctButton) {

      correctButton.classList.add(
        "correct"
      );

    }


    /*
      間違えた場合は
      「つぎへ」
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
    `${score} / ${totalQuestions}`;


  if (
    score ===
    totalQuestions
  ) {

    resultTextEl.textContent =
      "ぜんぶ せいかい！ すごいね！ 🌟";

  }

  else if (
    score >=
    Math.ceil(totalQuestions * 0.7)
  ) {

    resultTextEl.textContent =
      "よくできました！ すごい！";

  }

  else if (
    score >=
    Math.ceil(totalQuestions * 0.4)
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
