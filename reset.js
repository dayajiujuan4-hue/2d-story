"use strict";

/*
==========================================================
 杭州探索録
 GAME DATA RESET Ver.1.0

 ・タイトル画面からゲーム進行データを初期化
 ・词语収集状況をリセット
 ・杭州话収集状況をリセット
 ・ストーリー進行状況をリセット
 ・音量/BGM設定は保持
 ・確認画面あり
==========================================================
*/


(function(){

  // ======================================================
  // RESET TARGETS
  // ======================================================

  /*
    localStorage.clear() は使わない。

    ゲーム進行に関係するデータだけを
    明示的に削除する。
  */

  const RESET_KEYS = [

    // 普通話100語
    "hangzhouExplorerVocabularyV2",

    // 普通話100語コンプリート
    "hangzhouExplorerCompleteV1",

    // 杭州話20語
    "hangzhouDialectCollection",

    // 杭州話コンプリート
    "hangzhouDialectCompleted",

    // ストーリー進行
    "hangzhouStorySaveV3"

  ];


  // ======================================================
  // DOM CHECK
  // ======================================================

  const titleScreen =
    document.getElementById(
      "newTitleScreen"
    );


  const titleMenu =
    document.getElementById(
      "newTitleMenu"
    );


  if(
    !titleScreen ||
    !titleMenu
  ){

    console.warn(
      "RESET SYSTEM: タイトル画面が見つかりません。"
    );

    return;

  }


  // ======================================================
  // STYLE
  // ======================================================

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    /* ==============================================
       RESET BUTTON
    ============================================== */

    #gameResetButton{

      display:block;

      margin:
        14px auto 0;

      padding:
        7px 16px;

      border:
        1px solid
        rgba(220,205,180,.35);

      background:
        rgba(10,12,16,.48);

      color:
        rgba(235,225,208,.66);

      font-family:
        "Noto Sans JP",
        sans-serif;

      font-size:
        11px;

      letter-spacing:
        .12em;

      cursor:pointer;

      transition:
        background .18s,
        border-color .18s,
        color .18s;

    }


    #gameResetButton:hover{

      background:
        rgba(70,35,31,.72);

      border-color:
        rgba(205,133,115,.72);

      color:
        #f0ddd5;

    }


    #gameResetButton:focus-visible{

      outline:
        2px solid
        rgba(210,169,100,.8);

      outline-offset:
        3px;

    }



    /* ==============================================
       RESET OVERLAY
    ============================================== */

    #gameResetOverlay{

      position:fixed;

      inset:0;

      z-index:20000;

      display:flex;

      align-items:center;

      justify-content:center;

      box-sizing:border-box;

      padding:24px;

      background:
        rgba(4,6,9,.82);

      backdrop-filter:
        blur(5px);

      opacity:0;

      visibility:hidden;

      transition:
        opacity .2s,
        visibility .2s;

    }


    #gameResetOverlay.show{

      opacity:1;

      visibility:visible;

    }



    /* ==============================================
       WINDOW
    ============================================== */

    .game-reset-window{

      position:relative;

      width:
        min(
          520px,
          calc(100vw - 40px)
        );

      box-sizing:border-box;

      padding:
        36px 38px 32px;

      background:

        linear-gradient(
          rgba(28,26,24,.97),
          rgba(18,19,22,.98)
        );

      border:
        1px solid
        #796348;

      box-shadow:
        0 25px 90px
        rgba(0,0,0,.7);

      text-align:center;

      color:
        #eee4d3;

      font-family:
        "Noto Sans JP",
        sans-serif;

    }


    .game-reset-window::before{

      content:"";

      position:absolute;

      left:12px;
      right:12px;
      top:12px;
      bottom:12px;

      border:
        1px solid
        rgba(177,146,98,.18);

      pointer-events:none;

    }



    /* ==============================================
       LABEL
    ============================================== */

    .game-reset-small{

      margin-bottom:10px;

      color:
        #b99b6c;

      font-size:
        10px;

      letter-spacing:
        .26em;

    }


    .game-reset-title{

      margin:
        0 0 14px;

      color:
        #f2e4cc;

      font-size:
        24px;

      font-weight:
        600;

      letter-spacing:
        .06em;

    }


    .game-reset-cn{

      margin-bottom:
        22px;

      color:
        #ad9270;

      font-size:
        13px;

      letter-spacing:
        .12em;

    }



    /* ==============================================
       DESCRIPTION
    ============================================== */

    .game-reset-description{

      margin:
        0 auto 22px;

      color:
        #c8c0b4;

      font-size:
        13px;

      line-height:
        1.9;

    }


    .game-reset-targets{

      margin:
        0 0 22px;

      padding:
        15px 18px;

      background:
        rgba(0,0,0,.20);

      border-top:
        1px solid
        rgba(170,140,95,.25);

      border-bottom:
        1px solid
        rgba(170,140,95,.25);

      color:
        #bdb4a6;

      font-size:
        12px;

      line-height:
        2;

    }


    .game-reset-warning{

      margin-bottom:
        25px;

      color:
        #d9a89a;

      font-size:
        12px;

      line-height:
        1.7;

    }



    /* ==============================================
       BUTTONS
    ============================================== */

    .game-reset-buttons{

      position:relative;

      display:grid;

      grid-template-columns:
        1fr 1fr;

      gap:12px;

      z-index:1;

    }


    .game-reset-choice{

      min-height:48px;

      padding:
        10px 14px;

      cursor:pointer;

      font-family:
        "Noto Sans JP",
        sans-serif;

      font-size:
        13px;

      letter-spacing:
        .05em;

      transition:
        .15s;

    }


    #gameResetCancel{

      color:
        #e7dfd2;

      background:
        #292a2e;

      border:
        1px solid
        #555057;

    }


    #gameResetCancel:hover{

      background:
        #35363c;

      border-color:
        #8b8174;

    }


    #gameResetConfirm{

      color:
        #f1dcd5;

      background:
        #51312f;

      border:
        1px solid
        #8b5550;

    }


    #gameResetConfirm:hover{

      background:
        #6a3935;

      border-color:
        #bc7168;

    }



    /* ==============================================
       COMPLETE
    ============================================== */

    #gameResetComplete{

      position:fixed;

      inset:0;

      z-index:21000;

      display:flex;

      align-items:center;

      justify-content:center;

      background:
        rgba(5,7,10,.94);

      color:
        #eee5d7;

      font-family:
        "Noto Sans JP",
        sans-serif;

      text-align:center;

      opacity:0;

      visibility:hidden;

      transition:
        opacity .3s;

    }


    #gameResetComplete.show{

      opacity:1;

      visibility:visible;

    }


    .game-reset-complete-inner{

      padding:40px;

    }


    .game-reset-complete-small{

      color:
        #b99a68;

      font-size:
        11px;

      letter-spacing:
        .28em;

      margin-bottom:
        12px;

    }


    .game-reset-complete-title{

      font-size:
        25px;

      letter-spacing:
        .08em;

      margin-bottom:
        12px;

    }


    .game-reset-complete-text{

      color:
        #aaa39a;

      font-size:
        13px;

    }



    /* ==============================================
       MOBILE
    ============================================== */

    @media(
      max-width:600px
    ){

      .game-reset-window{

        padding:
          30px 22px 26px;

      }


      .game-reset-buttons{

        grid-template-columns:
          1fr;

      }

    }

  `;


  document.head.appendChild(
    style
  );


  // ======================================================
  // RESET BUTTON
  // ======================================================

  const resetButton =
    document.createElement(
      "button"
    );


  resetButton.id =
    "gameResetButton";


  resetButton.type =
    "button";


  resetButton.textContent =
    "ゲームデータをリセット";


  /*
    モード選択メニューの下に追加。
  */

  titleMenu.appendChild(
    resetButton
  );


  // ======================================================
  // CONFIRM OVERLAY
  // ======================================================

  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "gameResetOverlay";


  overlay.innerHTML = `

    <div
      class="game-reset-window"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameResetTitle"
    >

      <div
        class="game-reset-small"
      >
        RESET GAME DATA
      </div>

      <h2
        id="gameResetTitle"
        class="game-reset-title"
      >
        ゲームデータをリセットしますか？
      </h2>

      <div
        class="game-reset-cn"
      >
        是否重置游戏进度？
      </div>

      <p
        class="game-reset-description"
      >
        これまでの探索・収集・物語の進行状況を
        初期状態に戻します。
      </p>

      <div
        class="game-reset-targets"
      >
        词语の収集状況<br>
        杭州话の収集状況<br>
        ストーリーモードの進行状況
      </div>

      <div
        class="game-reset-warning"
      >
        この操作は取り消せません。<br>
        BGM・音量設定はそのまま残ります。
      </div>

      <div
        class="game-reset-buttons"
      >

        <button
          id="gameResetCancel"
          class="game-reset-choice"
          type="button"
        >
          キャンセル
        </button>

        <button
          id="gameResetConfirm"
          class="game-reset-choice"
          type="button"
        >
          リセットする
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  // ======================================================
  // COMPLETE SCREEN
  // ======================================================

  const completeScreen =
    document.createElement(
      "div"
    );


  completeScreen.id =
    "gameResetComplete";


  completeScreen.innerHTML = `

    <div
      class="game-reset-complete-inner"
    >

      <div
        class="game-reset-complete-small"
      >
        RESET COMPLETE
      </div>

      <div
        class="game-reset-complete-title"
      >
        ゲームデータをリセットしました
      </div>

      <div
        class="game-reset-complete-text"
      >
        杭州探索録を最初から始めます。
      </div>

    </div>

  `;


  document.body.appendChild(
    completeScreen
  );


  // ======================================================
  // ELEMENTS
  // ======================================================

  const cancelButton =
    overlay.querySelector(
      "#gameResetCancel"
    );


  const confirmButton =
    overlay.querySelector(
      "#gameResetConfirm"
    );


  let resetDialogOpen =
    false;


  let resetRunning =
    false;


  // ======================================================
  // OPEN
  // ======================================================

  function openResetDialog(){

    if(
      resetRunning
    ){
      return;
    }


    resetDialogOpen =
      true;


    overlay.classList.add(
      "show"
    );


    /*
      タイトル画面側へ
      クリックを伝えない。
    */

    window.setTimeout(
      ()=>{

        cancelButton.focus();

      },
      30
    );

  }


  // ======================================================
  // CLOSE
  // ======================================================

  function closeResetDialog(){

    if(
      resetRunning
    ){
      return;
    }


    resetDialogOpen =
      false;


    overlay.classList.remove(
      "show"
    );


    resetButton.focus();

  }


  // ======================================================
  // RESET
  // ======================================================

  function resetGameData(){

    if(
      resetRunning
    ){
      return;
    }


    resetRunning =
      true;


    try{

      RESET_KEYS.forEach(

        key=>{

          localStorage.removeItem(
            key
          );

        }

      );

    }
    catch(error){

      console.error(
        "RESET SYSTEM: セーブデータの削除に失敗しました。",
        error
      );


      resetRunning =
        false;

      return;

    }


    /*
      確認画面を閉じる。
    */

    overlay.classList.remove(
      "show"
    );


    resetDialogOpen =
      false;


    /*
      完了表示。
    */

    completeScreen.classList.add(
      "show"
    );


    /*
      JSメモリ上には
      collectedVocabulary や STORY などの
      古い状態が残っている。

      そのためリロードして
      完全な初期状態から読み直す。
    */

    window.setTimeout(

      ()=>{

        window.location.reload();

      },

      1200

    );

  }


  // ======================================================
  // BUTTON EVENTS
  // ======================================================

  resetButton.addEventListener(

    "click",

    event=>{

      event.preventDefault();

      event.stopPropagation();

      openResetDialog();

    }

  );


  cancelButton.addEventListener(

    "click",

    event=>{

      event.preventDefault();

      event.stopPropagation();

      closeResetDialog();

    }

  );


  confirmButton.addEventListener(

    "click",

    event=>{

      event.preventDefault();

      event.stopPropagation();

      resetGameData();

    }

  );


  // ======================================================
  // CLICK OUTSIDE
  // ======================================================

  overlay.addEventListener(

    "click",

    event=>{

      if(
        event.target === overlay
      ){

        closeResetDialog();

      }

    }

  );


  // ======================================================
  // KEYBOARD
  // ======================================================

  window.addEventListener(

    "keydown",

    event=>{

      if(
        !resetDialogOpen
      ){
        return;
      }


      /*
        reset画面表示中は
        title.js / game.js に入力させない。
      */

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        event.repeat
      ){
        return;
      }


      const key =
        event.key.toLowerCase();


      // ESC = cancel
      if(
        key === "escape"
      ){

        closeResetDialog();

        return;

      }


      /*
        左右キーで
        キャンセル / リセットを選択。
      */

      if(
        key === "arrowleft" ||
        key === "a"
      ){

        cancelButton.focus();

        return;

      }


      if(
        key === "arrowright" ||
        key === "d"
      ){

        confirmButton.focus();

        return;

      }


      /*
        Enter / E は
        現在フォーカス中のボタンを実行。
      */

      if(
        key === "enter" ||
        key === "e"
      ){

        if(
          document.activeElement ===
          confirmButton
        ){

          resetGameData();

        }
        else{

          closeResetDialog();

        }

      }

    },

    true

  );


  // ======================================================
  // EXPOSE
  // ======================================================

  window.openGameResetDialog =
    openResetDialog;


  window.closeGameResetDialog =
    closeResetDialog;


  // ======================================================
  // READY
  // ======================================================

  console.log(
    "杭州探索録 RESET SYSTEM Ver.1.0 loaded"
  );

})();
