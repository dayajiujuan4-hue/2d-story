"use strict";


/*
==========================================================
 杭州探索録
 武林夜市

 AUDIO SYSTEM Ver.1.0

 ・武林夜市BGM
 ・ループ再生
 ・音量管理
 ・再生／停止
 ・ブラウザの自動再生制限に対応
==========================================================
*/


(function(){


  // ======================================================
  // AUDIO CONFIG
  // ======================================================

  const BGM_PATH =
    "assets/audio/wulin-night.mp3";


  const DEFAULT_VOLUME =
    0.30;



  // ======================================================
  // AUDIO STATE
  // ======================================================

  let bgm =
    null;


  let bgmStarted =
    false;



  // ======================================================
  // CREATE BGM
  // ======================================================

  function createBGM(){

    if(
      bgm
    ){

      return bgm;

    }


    bgm =
      new Audio(
        BGM_PATH
      );


    /*
      曲の最後まで行ったら
      最初から再生する。
    */

    bgm.loop =
      true;


    /*
      初期音量。

      0.0 = 無音
      1.0 = 最大
    */

    bgm.volume =
      DEFAULT_VOLUME;


    /*
      BGMなので先に読み込みを促す。
    */

    bgm.preload =
      "auto";


    // ------------------------------------------
    // LOAD ERROR
    // ------------------------------------------

    bgm.addEventListener(

      "error",

      ()=>{

        console.error(
          "AUDIO: BGMを読み込めません。",
          BGM_PATH
        );

      }

    );


    return bgm;

  }



  // ======================================================
  // START BGM
  // ======================================================

  function startBGM(){

    const audio =
      createBGM();


    /*
      すでに再生中なら
      最初から再生し直さない。
    */

    if(
      !audio.paused
    ){

      bgmStarted =
        true;

      return;

    }


    const playPromise =
      audio.play();


    /*
      古いブラウザでは
      play() が Promise を返さない場合もある。
    */

    if(
      playPromise &&
      typeof playPromise.then ===
      "function"
    ){

      playPromise

        .then(

          ()=>{

            bgmStarted =
              true;


            console.log(
              "杭州探索録 AUDIO: 武林夜市BGM START"
            );

          }

        )

        .catch(

          error=>{

            bgmStarted =
              false;


            console.warn(
              "AUDIO: BGMを再生できませんでした。",
              error
            );

          }

        );

    }
    else{

      bgmStarted =
        true;

    }

  }



  // ======================================================
  // PAUSE BGM
  // ======================================================

  function pauseBGM(){

    if(
      !bgm
    ){

      return;

    }


    bgm.pause();


    bgmStarted =
      false;

  }



  // ======================================================
  // RESUME BGM
  // ======================================================

  function resumeBGM(){

    if(
      !bgm
    ){

      startBGM();

      return;

    }


    if(
      !bgm.paused
    ){

      return;

    }


    const playPromise =
      bgm.play();


    if(
      playPromise &&
      typeof playPromise.then ===
      "function"
    ){

      playPromise

        .then(

          ()=>{

            bgmStarted =
              true;

          }

        )

        .catch(

          error=>{

            bgmStarted =
              false;


            console.warn(
              "AUDIO: BGMの再開に失敗しました。",
              error
            );

          }

        );

    }

  }



  // ======================================================
  // STOP BGM
  // ======================================================

  function stopBGM(){

    if(
      !bgm
    ){

      return;

    }


    bgm.pause();


    /*
      完全停止なので
      曲の先頭へ戻す。
    */

    try{

      bgm.currentTime =
        0;

    }
    catch(error){

      // 読み込み前などは何もしない

    }


    bgmStarted =
      false;

  }



  // ======================================================
  // VOLUME
  // ======================================================

  function setBGMVolume(
    value
  ){

    /*
      0～1の範囲に収める。
    */

    const volume =
      Math.max(
        0,
        Math.min(
          1,
          Number(value)
        )
      );


    if(
      !Number.isFinite(
        volume
      )
    ){

      return;

    }


    const audio =
      createBGM();


    audio.volume =
      volume;

  }



  // ======================================================
  // GET VOLUME
  // ======================================================

  function getBGMVolume(){

    const audio =
      createBGM();


    return audio.volume;

  }



  // ======================================================
  // PLAYING CHECK
  // ======================================================

  function isBGMPlaying(){

    if(
      !bgm
    ){

      return false;

    }


    return(
      bgmStarted &&
      !bgm.paused
    );

  }



  // ======================================================
  // PAGE VISIBILITY
  // ======================================================

  /*
    タブを切り替えたときは
    BGMを勝手に停止しない。

    ゲームへ戻ったときにも
    同じ位置からそのまま続けられるようにする。
  */



  // ======================================================
  // GLOBAL API
  // ======================================================

  /*
    title.js など他ファイルから

      startBGM();
      pauseBGM();
      resumeBGM();
      stopBGM();
      setBGMVolume(0.3);

    のように呼び出せるようにする。
  */

  window.startBGM =
    startBGM;


  window.pauseBGM =
    pauseBGM;


  window.resumeBGM =
    resumeBGM;


  window.stopBGM =
    stopBGM;


  window.setBGMVolume =
    setBGMVolume;


  window.getBGMVolume =
    getBGMVolume;


  window.isBGMPlaying =
    isBGMPlaying;



  // ======================================================
  // PREPARE
  // ======================================================

  /*
    ここでは再生しない。

    ブラウザの自動再生制限があるため、
    実際の再生はタイトル画面で
    プレイヤーがモードを決定した瞬間に行う。
  */

  createBGM();



  console.log(
    "杭州探索録 AUDIO SYSTEM Ver.1.0 loaded"
  );


})();
