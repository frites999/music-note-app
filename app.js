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

let questionList = [];


/* =================================
   音の一覧

   step
   0 = 低いど
   1 = れ
   2 = み
   3 = ふぁ
   4 = そ
   5 = ら
   6 = し
   7 = 高いど

   回答ボタンは
   ど れ み ふぁ そ ら し ど
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

  if (level === "hard") {

    totalQuestions =
      HARD_QUESTIONS;

  } else {

    totalQuestions =
      EASY_QUESTIONS;

  }


  /* --------------------------------
     問題リスト
  -------------------------------- */

  if (level === "hard") {

    /*
      むずかしい

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
      かんたん

      低いど
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
      高いど
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

     五線譜の中だけに表示する。
     メニューやヘッダーには表示しない。
  -------------------------------- */

  if (clef === "treble") {

    clefSymbol.textContent =
      "𝄞";

  } else {

    clefSymbol.textContent =
      "𝄢";

  }


  showNextQuestion();
}


/* =================================
   次の問題
================================= */

function showNextQuestion() {

  /* --------------------------------
     全問終了
  -------------------------------- */

  if (
    questionNumber >=
    totalQuestions
  ) {

    showResult();

    return;
  }


  /* --------------------------------
     現在の問題
  -------------------------------- */

  currentQuestion =
    questionList[
      questionNumber
    ];


  questionNumber++;

  locked = false;


  /* --------------------------------
     メッセージ
  -------------------------------- */

  messageEl.textContent =
    "";


  /* --------------------------------
     つぎへボタンを隠す
  -------------------------------- */

  nextButton.classList.add(
    "hidden"
  );


  /* --------------------------------
     進行・スコア
  -------------------------------- */

  progressEl.textContent =
    `${questionNumber} / ${totalQuestions}`;

  scoreEl.textContent =
    `⭐ ${score}`;


  /* --------------------------------
     音符を描く
  -------------------------------- */

  drawNote(
    currentQuestion.step
  );


  /* --------------------------------
     解答ボタン
  -------------------------------- */

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

      低いど       = 加線
      れ           = 加線と第1線の間
      み           = 第1線
      ふぁ         = 第1間
      そ           = 第2線
      ら           = 第2間
      し           = 第3線
      高いど       = 第3間
    */

    const treblePositions = [

      205,     // 低いど
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
       ト音記号の棒

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

      低いど       = 下から2番目と3番目の線の間
      れ           = 第2線
      み           = 第2間
      ふぁ         = 第3線
      そ           = 第3間
      ら           = 第4線
      し           = 第4間
      高いど       = 第5線の上＋加線
    */

    const bassPositions = [

      142.5,   // 低いど
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
       へ音記号の棒

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
   解答ボタンを作る
================================= */

function renderAnswers() {

  answersEl.innerHTML =
    "";


  /*
    常に8個

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


      /*
        同じ「ど」が2つあるので、
        stepを保存しておく
      */

      button.dataset.step =
        note.step;


      button.setAttribute(
        "aria-label",
        note.answer
      );


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


  /* --------------------------------
     全ボタンを押せなくする
  -------------------------------- */

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


    /*
      正解なら自動で次へ
    */

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
      stepで正解ボタンを探す
    */

    const correctButton =
      buttons.find(
        (btn) =>
          Number(
            btn.dataset.step
          ) ===
          currentQuestion.step
      );


    if (correctButton) {

      correctButton.classList.add(
        "correct"
      );

    }


    /*
      間違えた場合は
      「つぎへ」ボタンを表示
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


  /* --------------------------------
     メッセージ
  -------------------------------- */

  if (
    score ===
    totalQuestions
  ) {

    resultTextEl.textContent =
      "ぜんぶ せいかい！ すごいね！ 🌟";

  }

  else if (
    score >=
    Math.ceil(
      totalQuestions * 0.7
    )
  ) {

    resultTextEl.textContent =
      "よくできました！ すごい！";

  }

  else if (
    score >=
    Math.ceil(
      totalQuestions * 0.4
    )
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
