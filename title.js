"use strict";


/*
==========================================================
 杭州探索録
 武林夜市

 TITLE SCREEN Ver.2.0

 ・探索モード
 ・ストーリーモード
 ・既存 story.js と直接連携
 ・セーブ／ロード処理は追加しない
 ・既存ゲームロジックは変更しない
==========================================================
*/


(function(){


  // ======================================================
  // DOM
  // ======================================================

  const titleScreen =
    document.getElementById(
      "newTitleScreen"
    );


  const titleMenu =
    document.getElementById(
      "newTitleMenu"
    );


  const exploreButton =
    document.getElementById(
      "newExploreButton"
    );


  const storyButton =
    document.getElementById(
      "newStoryButton"
    );


  if(
    !titleScreen ||
    !titleMenu ||
    !exploreButton ||
    !storyButton
  ){

    console.error(
      "TITLE SCREEN: 必要なDOMが見つかりません。"
    );

    return;

  }



  // ======================================================
  // STATE
  // ======================================================

  let titleActive =
    true;


  let transitionLock =
    false;


  let selectedIndex =
    0;


  const buttons = [

    exploreButton,

    storyButton

  ];



  // ======================================================
  // LEGACY STORY MODE SCREEN
  // ======================================================

  function hideOldStoryModeScreen(){

    const oldScreen =
      document.getElementById(
        "storyModeScreen"
      );


    if(
      oldScreen
    ){

      oldScreen.classList.add(
        "hidden"
      );

      oldScreen.style.display =
        "none";

    }

  }



  // ======================================================
  // GAME KEYS
  // ======================================================

  function clearGameKeys(){

    /*
      game.js 側の keys に
      タイトル画面のキー入力を残さない。
    */

    try{

      if(
        typeof keys !==
        "undefined"
      ){

        Object.keys(
          keys
        ).forEach(

          key=>{

            keys[key] =
              false;

          }

        );

      }

    }
    catch(error){

      /*
        keys が存在しない場合は
        何もしない。
      */

    }

  }



  // ======================================================
  // SELECTION
  // ======================================================

  function updateSelection(){

    buttons.forEach(

      (
        button,
        index
      )=>{

        button.classList.toggle(
          "selected",
          index ===
          selectedIndex
        );

      }

    );

  }



  function selectPrevious(){

    selectedIndex--;

    if(
      selectedIndex < 0
    ){

      selectedIndex =
        buttons.length - 1;

    }

    updateSelection();

  }



  function selectNext(){

    selectedIndex++;

    if(
      selectedIndex >=
      buttons.length
    ){

      selectedIndex =
        0;

    }

    updateSelection();

  }



  // ======================================================
  // START EXPLORE
  // ======================================================

  function launchExplore(){

    if(
      transitionLock
    ){
      return;
    }


    transitionLock =
      true;


    clearGameKeys();


    /*
      story.js に実際に存在する
      探索モード開始関数。
    */

    if(
      typeof startExploreMode !==
      "function"
    ){

      console.error(
        "startExploreMode() が見つかりません。"
      );

      transitionLock =
        false;

      return;

    }


    startExploreMode();


    hideOldStoryModeScreen();


    closeTitle();

  }



  // ======================================================
  // START STORY
  // ======================================================

  function launchStory(){

    if(
      transitionLock
    ){
      return;
    }


    transitionLock =
      true;


    clearGameKeys();


    /*
      story.js に実際に存在する
      ストーリーモード開始関数。

      第一章「武林の夜」から
      開始する処理は story.js 側に任せる。
    */

    if(
      typeof startStoryMode !==
      "function"
    ){

      console.error(
        "startStoryMode() が見つかりません。"
      );

      transitionLock =
        false;

      return;

    }


    startStoryMode();


    hideOldStoryModeScreen();


    closeTitle();

  }



  // ======================================================
  // ACTIVATE
  // ======================================================

  function activateSelection(){

    if(
      selectedIndex === 0
    ){

      launchExplore();

      return;

    }


    if(
      selectedIndex === 1
    ){

      launchStory();

    }

  }



  // ======================================================
  // CLOSE TITLE
  // ======================================================

  function closeTitle(){

    titleScreen.classList.add(
      "hide"
    );


    /*
      CSSフェード終了後に
      完全に無効化。
    */

    window.setTimeout(

      ()=>{

        titleActive =
          false;


        transitionLock =
          false;


        clearGameKeys();


        titleScreen.style.display =
          "none";


        /*
          念のため旧モード画面も
          再度隠す。
        */

        hideOldStoryModeScreen();


        /*
          現在地バナーを再表示。
        */

        try{

          if(
            typeof showAreaBanner ===
            "function"
          ){

            showAreaBanner();

          }

        }
        catch(error){

          // 何もしない

        }

      },

      950

    );

  }



  // ======================================================
  // KEY DOWN
  // ======================================================

  function onTitleKeyDown(
    event
  ){

    if(
      !titleActive
    ){

      return;

    }


    const key =
      event.key.toLowerCase();


    /*
      タイトル画面で使用するキーは
      game.js まで伝えない。

      captureフェーズで止める。
    */

    if(
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
        "e",
        "enter",
        "l",
        "h",
        " "
      ].includes(
        key
      )
    ){

      event.preventDefault();

      event.stopImmediatePropagation();

    }


    if(
      transitionLock
    ){

      return;

    }


    if(
      event.repeat
    ){

      return;

    }



    // ------------------------------------------
    // UP
    // ------------------------------------------

    if(
      key === "arrowup" ||
      key === "w"
    ){

      selectPrevious();

      return;

    }



    // ------------------------------------------
    // DOWN
    // ------------------------------------------

    if(
      key === "arrowdown" ||
      key === "s"
    ){

      selectNext();

      return;

    }



    // ------------------------------------------
    // ENTER
    // ------------------------------------------

    if(
      key === "e" ||
      key === "enter"
    ){

      activateSelection();

    }

  }



  // ======================================================
  // KEY UP
  // ======================================================

  function onTitleKeyUp(
    event
  ){

    if(
      !titleActive
    ){

      return;

    }


    const key =
      event.key.toLowerCase();


    if(
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
        "e",
        "enter",
        "l",
        "h",
        " "
      ].includes(
        key
      )
    ){

      event.preventDefault();

      event.stopImmediatePropagation();

    }


    clearGameKeys();

  }



  // ======================================================
  // MOUSE
  // ======================================================

  buttons.forEach(

    (
      button,
      index
    )=>{


      button.addEventListener(

        "mouseenter",

        ()=>{

          if(
            !titleActive ||
            transitionLock
          ){

            return;

          }


          selectedIndex =
            index;


          updateSelection();

        }

      );



      button.addEventListener(

        "click",

        event=>{

          event.preventDefault();


          if(
            !titleActive ||
            transitionLock
          ){

            return;

          }


          selectedIndex =
            index;


          updateSelection();


          activateSelection();

        }

      );


    }

  );



  // ======================================================
  // IMAGE CHECK
  // ======================================================

  const titleImage =
    document.querySelector(
      ".new-title-art"
    );


  if(
    titleImage
  ){

    titleImage.addEventListener(

      "error",

      ()=>{

        console.error(
          "タイトル画像を読み込めません。assets/title/wulin-title.png を確認してください。"
        );

      }

    );

  }



  // ======================================================
  // HIDE LEGACY SCREEN
  // ======================================================

  function keepLegacyScreenHidden(){

    if(
      !titleActive
    ){
      return;
    }


    hideOldStoryModeScreen();

  }



  // ======================================================
  // INITIALIZE
  // ======================================================

  function initializeTitle(){

    titleActive =
      true;


    transitionLock =
      false;


    selectedIndex =
      0;


    updateSelection();


    /*
      story.js は title.js より前に
      読み込まれているので、
      この時点では storyModeScreen が
      作られている。
    */

    hideOldStoryModeScreen();


    clearGameKeys();


    /*
      capture=true。

      game.js の keydown より先に
      タイトル画面が入力を受け取る。
    */

    window.addEventListener(

      "keydown",

      onTitleKeyDown,

      true

    );


    window.addEventListener(

      "keyup",

      onTitleKeyUp,

      true

    );


    /*
      他スクリプトが旧モード画面を
      再表示した場合への保険。
    */

    window.setInterval(

      keepLegacyScreenHidden,

      500

    );


    console.log(
      "杭州探索録 TITLE SCREEN Ver.2.0 loaded"
    );

  }



  // ======================================================
  // START
  // ======================================================

  initializeTitle();


})();
