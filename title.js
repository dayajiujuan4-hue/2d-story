"use strict";


/*
============================================================
 杭州探索録
 TITLE SYSTEM Ver.1.0

 ・パッケージイラストを使用したタイトル画面
 ・W/S / ↑↓ で選択
 ・E / ENTER で決定
 ・マウス操作対応
 ・はじめから
 ・つづきから
 ・夜市散策
 ・既存 STORY MODE と連携
 ・既存 game.js を極力変更しない
============================================================
*/


(function(){


  // =========================================================
  // CONFIG
  // =========================================================

  const TITLE_CONFIG = {

    storySaveKey:
      "hangzhouStorySaveV3",

    introDuration:
      5200,

    fadeDuration:
      1100,

    petalInterval:
      720,

    maxPetals:
      18

  };



  // =========================================================
  // DOM
  // =========================================================

  const titleScreen =
    document.getElementById(
      "titleScreen"
    );


  const titleMenu =
    document.getElementById(
      "titleMenu"
    );


  const introScreen =
    document.getElementById(
      "introScreen"
    );


  const continueButton =
    document.getElementById(
      "continueButton"
    );


  const continueSub =
    document.getElementById(
      "continueSub"
    );


  const petalLayer =
    document.getElementById(
      "titlePetals"
    );


  if(
    !titleScreen ||
    !titleMenu
  ){

    console.warn(
      "Title System: DOM not found."
    );

    return;

  }



  // =========================================================
  // STATE
  // =========================================================

  const TITLE = {

    active:
      true,

    transitioning:
      false,

    selection:
      0,

    buttons:
      [],

    continueAvailable:
      false,

    continueData:
      null,

    petalTimer:
      null

  };



  // =========================================================
  // BUTTONS
  // =========================================================

  TITLE.buttons =
    Array.from(
      titleMenu.querySelectorAll(
        ".title-menu-item"
      )
    );



  // =========================================================
  // STORY CHAPTER NAMES
  // =========================================================

  const CHAPTER_NAMES = {

    1:
      "武林の夜",

    2:
      "白衣の女",

    3:
      "人間の夜",

    4:
      "消える人",

    5:
      "西湖の夜",

    6:
      "白蛇伝",

    7:
      "灯りの消える夜",

    8:
      "灯火の向こう"

  };



  // =========================================================
  // UTILITY
  // =========================================================

  function safeJSONParse(
    raw
  ){

    try{

      return JSON.parse(
        raw
      );

    }
    catch(error){

      return null;

    }

  }



  function clearGameKeys(){

    /*
      game.js の keys が存在する場合、
      タイトル操作のキー入力を
      本編へ持ち越さない。
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

      // 何もしない

    }

  }



  // =========================================================
  // CONTINUE DATA
  // =========================================================

  function loadContinueData(){

    let raw =
      null;


    try{

      raw =
        localStorage.getItem(
          TITLE_CONFIG.storySaveKey
        );

    }
    catch(error){

      raw =
        null;

    }


    if(!raw){

      TITLE.continueAvailable =
        false;

      TITLE.continueData =
        null;

      return;

    }


    const data =
      safeJSONParse(
        raw
      );


    if(
      !data ||
      typeof data !==
      "object"
    ){

      TITLE.continueAvailable =
        false;

      TITLE.continueData =
        null;

      return;

    }


    TITLE.continueAvailable =
      true;

    TITLE.continueData =
      data;

  }



  // =========================================================
  // CONTINUE UI
  // =========================================================

  function updateContinueUI(){

    loadContinueData();


    if(
      !continueButton
    ){
      return;
    }


    if(
      !TITLE.continueAvailable
    ){

      continueButton
        .classList
        .add(
          "disabled"
        );


      continueButton
        .setAttribute(
          "aria-disabled",
          "true"
        );


      if(
        continueSub
      ){

        continueSub.textContent =
          "NO SAVE DATA";

      }


      return;

    }


    continueButton
      .classList
      .remove(
        "disabled"
      );


    continueButton
      .setAttribute(
        "aria-disabled",
        "false"
      );


    const chapter =
      Number(
        TITLE.continueData.chapter
      ) || 1;


    const chapterName =
      CHAPTER_NAMES[
        chapter
      ] || "";


    if(
      continueSub
    ){

      continueSub.textContent =
        `第${chapter}章 ${chapterName}`;

    }

  }



  // =========================================================
  // SELECTABLE
  // =========================================================

  function isSelectable(
    index
  ){

    const button =
      TITLE.buttons[
        index
      ];


    if(!button){

      return false;

    }


    if(
      button.dataset.titleAction ===
      "continue" &&
      !TITLE.continueAvailable
    ){

      return false;

    }


    return true;

  }



  // =========================================================
  // SELECTION
  // =========================================================

  function setSelection(
    index
  ){

    const length =
      TITLE.buttons.length;


    if(
      length === 0
    ){
      return;
    }


    let next =
      index;


    while(
      next < 0
    ){

      next +=
        length;

    }


    next =
      next %
      length;


    /*
      使用不可項目なら
      次の項目へ進む
    */

    let safety =
      0;


    while(
      !isSelectable(
        next
      ) &&
      safety <
      length
    ){

      next =
        (
          next + 1
        ) %
        length;

      safety++;

    }


    TITLE.selection =
      next;


    TITLE.buttons.forEach(

      (
        button,
        i
      )=>{

        button
          .classList
          .toggle(
            "selected",
            i === next
          );

      }

    );

  }



  function moveSelection(
    amount
  ){

    if(
      TITLE.transitioning
    ){
      return;
    }


    const length =
      TITLE.buttons.length;


    let next =
      TITLE.selection;


    let safety =
      0;


    do{

      next =
        (
          next +
          amount +
          length
        ) %
        length;

      safety++;

    }
    while(
      !isSelectable(
        next
      ) &&
      safety <
      length
    );


    setSelection(
      next
    );

  }



  // =========================================================
  // TITLE INPUT
  // =========================================================

  function handleTitleKeydown(
    event
  ){

    if(
      !TITLE.active
    ){
      return;
    }


    const key =
      event.key.toLowerCase();


    /*
      タイトル表示中は
      本編へキーイベントを渡さない。
    */

    if(
      [
        "arrowup",
        "arrowdown",
        "w",
        "s",
        "e",
        "enter",
        " "
      ].includes(
        key
      )
    ){

      event.preventDefault();

      event.stopImmediatePropagation();

    }


    if(
      TITLE.transitioning
    ){
      return;
    }


    if(
      event.repeat
    ){
      return;
    }


    if(
      key ===
      "arrowup" ||
      key ===
      "w"
    ){

      moveSelection(
        -1
      );

      return;

    }


    if(
      key ===
      "arrowdown" ||
      key ===
      "s"
    ){

      moveSelection(
        1
      );

      return;

    }


    if(
      key ===
      "e" ||
      key ===
      "enter"
    ){

      activateCurrent();

    }

  }



  // =========================================================
  // MOUSE
  // =========================================================

  function installMouseControls(){

    TITLE.buttons.forEach(

      (
        button,
        index
      )=>{


        button.addEventListener(

          "mouseenter",

          ()=>{

            if(
              TITLE.transitioning
            ){
              return;
            }


            if(
              !isSelectable(
                index
              )
            ){
              return;
            }


            setSelection(
              index
            );

          }

        );


        button.addEventListener(

          "click",

          event=>{

            event.preventDefault();


            if(
              TITLE.transitioning
            ){
              return;
            }


            if(
              !isSelectable(
                index
              )
            ){
              return;
            }


            setSelection(
              index
            );


            activateCurrent();

          }

        );


      }

    );

  }



  // =========================================================
  // ACTIVATE
  // =========================================================

  function activateCurrent(){

    const button =
      TITLE.buttons[
        TITLE.selection
      ];


    if(!button){

      return;
    }


    if(
      !isSelectable(
        TITLE.selection
      )
    ){

      return;

    }


    const action =
      button.dataset.titleAction;


    switch(
      action
    ){

      case "new":

        beginNewStory();

        break;


      case "continue":

        continueStory();

        break;


      case "explore":

        beginExplore();

        break;

    }

  }



  // =========================================================
  // HIDE ORIGINAL STORY MODE SCREEN
  // =========================================================

  function hideLegacyModeScreen(){

    const screen =
      document.getElementById(
        "storyModeScreen"
      );


    if(
      screen
    ){

      screen
        .classList
        .add(
          "hidden"
        );

    }

  }



  // =========================================================
  // NEW STORY
  // =========================================================

  function beginNewStory(){

    if(
      TITLE.transitioning
    ){
      return;
    }


    TITLE.transitioning =
      true;


    clearGameKeys();


    /*
      既存 startStoryMode() が
      第一章初期化を担当する。
    */

    if(
      typeof startStoryMode ===
      "function"
    ){

      startStoryMode();

    }
    else{

      console.warn(
        "startStoryMode() not found."
      );

    }


    hideLegacyModeScreen();


    playIntro(
      ()=>{
        enterGame();
      }
    );

  }



  // =========================================================
  // EXPLORE
  // =========================================================

  function beginExplore(){

    if(
      TITLE.transitioning
    ){
      return;
    }


    TITLE.transitioning =
      true;


    clearGameKeys();


    if(
      typeof startExploreMode ===
      "function"
    ){

      startExploreMode();

    }
    else{

      console.warn(
        "startExploreMode() not found."
      );

    }


    hideLegacyModeScreen();


    /*
      散策モードは
      ストーリー導入を出さず、
      短く暗転して開始。
    */

    titleScreen
      .classList
      .add(
        "title-hide"
      );


    setTimeout(

      ()=>{

        enterGame();

      },

      TITLE_CONFIG.fadeDuration

    );

  }



  // =========================================================
  // CONTINUE STORY
  // =========================================================

  function continueStory(){

    if(
      TITLE.transitioning ||
      !TITLE.continueAvailable
    ){

      return;

    }


    TITLE.transitioning =
      true;


    clearGameKeys();


    /*
      story.js はロード時に
      loadStory() を実行している。

      念のため再ロードする。
    */

    if(
      typeof loadStory ===
      "function"
    ){

      loadStory();

    }


    if(
      typeof STORY !==
      "undefined"
    ){

      STORY.mode =
        "story";

      STORY.started =
        true;

    }


    hideLegacyModeScreen();


    /*
      保存された章に応じた
      復帰処理を行う。
    */

    restoreStoryPosition();


    titleScreen
      .classList
      .add(
        "title-hide"
      );


    setTimeout(

      ()=>{

        enterGame();

      },

      TITLE_CONFIG.fadeDuration

    );

  }



  // =========================================================
  // RESTORE STORY
  // =========================================================

  function restoreStoryPosition(){

    if(
      typeof STORY ===
      "undefined"
    ){

      return;

    }


    const chapter =
      Number(
        STORY.chapter
      ) || 1;


    /*
      第一章
    */

    if(
      chapter === 1
    ){

      if(
        typeof resetStoryNPCs ===
        "function"
      ){

        resetStoryNPCs();

      }


      currentMapId =
        "food";


      player.x =
        MAPS.food.spawn.x *
        TILE;


      player.y =
        MAPS.food.spawn.y *
        TILE;


      player.direction =
        "up";


      player.moving =
        false;


      if(
        typeof setChapterLabel ===
        "function"
      ){

        setChapterLabel(
          "第一章",
          "武林の夜"
        );

      }


      return;

    }


    /*
      第2章以降については
      各章スクリプトが持っている
      START関数を利用する。

      セーブ章に応じて
      その章の開始地点へ戻す。
    */


    if(
      chapter === 2
    ){

      /*
        Chapter 2 は
        story.js 内部で管理されているため
        現在位置を武林へ戻す。
      */

      currentMapId =
        "food";


      player.x =
        MAPS.food.spawn.x *
        TILE;


      player.y =
        MAPS.food.spawn.y *
        TILE;


      player.direction =
        "up";


      player.moving =
        false;


      return;

    }


    if(
      chapter === 3 &&
      typeof startChapterThree ===
      "function"
    ){

      startChapterThree();

      return;

    }


    if(
      chapter === 4 &&
      typeof startChapterFour ===
      "function"
    ){

      startChapterFour();

      return;

    }


    if(
      chapter === 5 &&
      typeof startChapterFive ===
      "function"
    ){

      startChapterFive();

      return;

    }


    if(
      chapter === 6 &&
      typeof startChapterSix ===
      "function"
    ){

      startChapterSix();

      return;

    }


    if(
      chapter === 7 &&
      typeof startChapterSeven ===
      "function"
    ){

      startChapterSeven();

      return;

    }


    if(
      chapter === 8 &&
      typeof startChapterEight ===
      "function"
    ){

      startChapterEight();

      return;

    }


    /*
      万一復帰関数が見つからない場合
    */

    currentMapId =
      "food";


    player.x =
      MAPS.food.spawn.x *
      TILE;


    player.y =
      MAPS.food.spawn.y *
      TILE;


    player.direction =
      "up";


    player.moving =
      false;

  }



  // =========================================================
  // INTRO
  // =========================================================

  function playIntro(
    callback
  ){

    if(
      !introScreen
    ){

      titleScreen
        .classList
        .add(
          "title-hide"
        );


      setTimeout(

        callback,

        TITLE_CONFIG.fadeDuration

      );


      return;

    }


    introScreen
      .classList
      .add(
        "show"
      );


    requestAnimationFrame(

      ()=>{

        requestAnimationFrame(

          ()=>{

            introScreen
              .classList
              .add(
                "play"
              );

          }

        );

      }

    );


    titleScreen
      .classList
      .add(
        "title-hide"
      );


    setTimeout(

      ()=>{

        introScreen
          .classList
          .remove(
            "show"
          );


        setTimeout(

          ()=>{

            introScreen
              .classList
              .remove(
                "play"
              );


            callback();

          },

          850

        );

      },

      TITLE_CONFIG.introDuration

    );

  }



  // =========================================================
  // ENTER GAME
  // =========================================================

  function enterGame(){

    TITLE.active =
      false;


    TITLE.transitioning =
      false;


    clearGameKeys();


    document.body
      .classList
      .remove(
        "title-mode"
      );


    titleScreen
      .classList
      .add(
        "title-hide"
      );


    hideLegacyModeScreen();


    /*
      カメラを現在の
      プレイヤー位置へ合わせる。
    */

    try{

      if(
        typeof updateCamera ===
        "function"
      ){

        updateCamera();

      }

    }
    catch(error){

      // no-op

    }


    /*
      エリア表示
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

      // no-op

    }


    stopPetals();

  }



  // =========================================================
  // PETALS
  // =========================================================

  function createPetal(){

    if(
      !TITLE.active ||
      !petalLayer
    ){

      return;

    }


    const petals =
      petalLayer.querySelectorAll(
        ".title-petal"
      );


    if(
      petals.length >=
      TITLE_CONFIG.maxPetals
    ){

      return;

    }


    const petal =
      document.createElement(
        "span"
      );


    petal.className =
      "title-petal";


    const left =
      Math.random() *
      100;


    const duration =
      8 +
      Math.random() *
      7;


    const delay =
      Math.random() *
      .8;


    const scale =
      .55 +
      Math.random() *
      .8;


    petal.style.left =
      `${left}%`;


    petal.style.animationDuration =
      `${duration}s`;


    petal.style.animationDelay =
      `${delay}s`;


    petal.style.transform =
      `scale(${scale})`;


    petalLayer.appendChild(
      petal
    );


    setTimeout(

      ()=>{

        if(
          petal.parentNode
        ){

          petal.remove();

        }

      },

      (
        duration +
        delay +
        1
      ) *
      1000

    );

  }



  function startPetals(){

    if(
      !petalLayer
    ){
      return;
    }


    /*
      最初に数枚だけ出す
    */

    for(
      let i=0;
      i<7;
      i++
    ){

      setTimeout(

        createPetal,

        i *
        260

      );

    }


    TITLE.petalTimer =
      setInterval(

        createPetal,

        TITLE_CONFIG.petalInterval

      );

  }



  function stopPetals(){

    if(
      TITLE.petalTimer
    ){

      clearInterval(
        TITLE.petalTimer
      );


      TITLE.petalTimer =
        null;

    }


    if(
      petalLayer
    ){

      petalLayer
        .innerHTML =
        "";

    }

  }



  // =========================================================
  // PROTECT GAME INPUT
  // =========================================================

  function protectGameInput(){

    /*
      capture=true が重要。

      game.js の window keydown より先に
      タイトル画面がイベントを受け取る。
    */

    window.addEventListener(

      "keydown",

      handleTitleKeydown,

      true

    );


    window.addEventListener(

      "keyup",

      event=>{

        if(
          !TITLE.active
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

      },

      true

    );

  }



  // =========================================================
  // LEGACY STORY SCREEN WATCHER
  // =========================================================

  function watchLegacyScreen(){

    /*
      story.js が生成する旧モード選択画面を
      タイトル画面表示中も隠しておく。
    */

    const observer =
      new MutationObserver(

        ()=>{

          if(
            TITLE.active
          ){

            hideLegacyModeScreen();

          }

        }

      );


    observer.observe(

      document.body,

      {
        childList:
          true,

        subtree:
          true,

        attributes:
          true,

        attributeFilter:[
          "class"
        ]
      }

    );

  }



  // =========================================================
  // IMAGE ERROR
  // =========================================================

  function installImageFallback(){

    const image =
      document.querySelector(
        ".title-visual"
      );


    if(!image){

      return;

    }


    image.addEventListener(

      "error",

      ()=>{

        console.warn(
          "タイトル画像が見つかりません。assets/title/wulin-title.png を確認してください。"
        );

      }

    );

  }



  // =========================================================
  // INITIALIZE
  // =========================================================

  function initializeTitle(){

    TITLE.active =
      true;


    TITLE.transitioning =
      false;


    document.body
      .classList
      .add(
        "title-mode"
      );


    /*
      story.js が生成した
      旧モード画面を隠す。
    */

    hideLegacyModeScreen();


    updateContinueUI();


    /*
      Continueが無効なら
      最初は「はじめから」。
    */

    setSelection(
      0
    );


    installMouseControls();


    protectGameInput();


    watchLegacyScreen();


    installImageFallback();


    startPetals();


    clearGameKeys();


    console.log(
      "杭州探索録 Title System Ver.1.0 loaded"
    );

  }



  // =========================================================
  // START
  // =========================================================

  initializeTitle();


})();
