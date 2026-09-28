"use strict";


/*
==========================================================
 杭州探索録
 武林夜市

 AUDIO SYSTEM Ver.2.0

 ・武林夜市BGM
 ・ループ再生
 ・BGM ON / OFF
 ・音量スライダー
 ・設定をlocalStorageへ保存
 ・屋内では自動的にBGMを小さくする
 ・屋外へ戻ると元の音量へ戻す
 ・既存 game.js / map.js は変更しない
==========================================================
*/


(function(){


  // ======================================================
  // CONFIG
  // ======================================================

  const BGM_PATH =
    "assets/audio/wulin-night.mp3";


  /*
    初回起動時の基本音量。
    0.30 = 30%
  */

  const DEFAULT_VOLUME =
    0.30;


  /*
    屋内ではユーザー設定音量の
    60%まで下げる。

    例：
    30% → 18%
    50% → 30%
  */

  const INDOOR_VOLUME_RATIO =
    0.60;


  /*
    設定保存用キー
  */

  const STORAGE_KEY =
    "hangzhouAudioSettingsV2";



  // ======================================================
  // STATE
  // ======================================================

  let bgm =
    null;


  let bgmStarted =
    false;


  let bgmEnabled =
    true;


  /*
    プレイヤー自身が設定した音量。

    屋内補正前の値。
  */

  let userVolume =
    DEFAULT_VOLUME;


  let lastIndoorState =
    null;


  let audioUI =
    null;


  let audioPanel =
    null;


  let audioButton =
    null;


  let toggleButton =
    null;


  let volumeSlider =
    null;


  let volumeText =
    null;



  // ======================================================
  // STORAGE
  // ======================================================

  function loadSettings(){

    try{

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );


      if(
        !raw
      ){

        return;

      }


      const data =
        JSON.parse(
          raw
        );


      if(
        typeof data.enabled ===
        "boolean"
      ){

        bgmEnabled =
          data.enabled;

      }


      if(
        typeof data.volume ===
        "number" &&
        Number.isFinite(
          data.volume
        )
      ){

        userVolume =
          Math.max(
            0,
            Math.min(
              1,
              data.volume
            )
          );

      }

    }
    catch(error){

      console.warn(
        "AUDIO: 音声設定を読み込めませんでした。",
        error
      );

    }

  }



  function saveSettings(){

    try{

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify({

          enabled:
            bgmEnabled,

          volume:
            userVolume

        })

      );

    }
    catch(error){

      console.warn(
        "AUDIO: 音声設定を保存できませんでした。",
        error
      );

    }

  }



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


    bgm.loop =
      true;


    bgm.preload =
      "auto";


    bgm.volume =
      0;


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
  // CURRENT MAP
  // ======================================================

  function getAudioMap(){

    try{

      if(
        typeof currentMapId ===
        "undefined"
      ){

        return null;

      }


      if(
        typeof MAPS ===
        "undefined"
      ){

        return null;

      }


      if(
        !MAPS[currentMapId]
      ){

        return null;

      }


      return MAPS[currentMapId];

    }
    catch(error){

      return null;

    }

  }



  // ======================================================
  // INDOOR CHECK
  // ======================================================

  function isIndoor(){

    const map =
      getAudioMap();


    if(
      !map
    ){

      return false;

    }


    return(
      map.ambient ===
      "indoor"
    );

  }



  // ======================================================
  // TARGET VOLUME
  // ======================================================

  function getTargetVolume(){

    if(
      !bgmEnabled
    ){

      return 0;

    }


    if(
      isIndoor()
    ){

      return(
        userVolume *
        INDOOR_VOLUME_RATIO
      );

    }


    return userVolume;

  }



  // ======================================================
  // APPLY VOLUME
  // ======================================================

  function applyVolume(){

    if(
      !bgm
    ){

      return;

    }


    const target =
      getTargetVolume();


    bgm.volume =
      Math.max(
        0,
        Math.min(
          1,
          target
        )
      );


    updateUI();

  }



  // ======================================================
  // START BGM
  // ======================================================

  function startBGM(){

    const audio =
      createBGM();


    /*
      OFF設定の場合は
      モード開始時にも再生しない。
    */

    if(
      !bgmEnabled
    ){

      bgmStarted =
        false;

      applyVolume();

      return;

    }


    applyVolume();


    /*
      すでに再生中なら
      再スタートしない。
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


            applyVolume();


            console.log(
              "杭州探索録 AUDIO: BGM START"
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


      applyVolume();

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


    updateUI();

  }



  // ======================================================
  // RESUME BGM
  // ======================================================

  function resumeBGM(){

    if(
      !bgmEnabled
    ){

      return;

    }


    if(
      !bgm
    ){

      startBGM();

      return;

    }


    applyVolume();


    if(
      !bgm.paused
    ){

      bgmStarted =
        true;

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


            applyVolume();


            updateUI();

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
    else{

      bgmStarted =
        true;


      updateUI();

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


    try{

      bgm.currentTime =
        0;

    }
    catch(error){

      // 何もしない

    }


    bgmStarted =
      false;


    updateUI();

  }



  // ======================================================
  // BGM ON
  // ======================================================

  function enableBGM(){

    bgmEnabled =
      true;


    saveSettings();


    resumeBGM();


    updateUI();

  }



  // ======================================================
  // BGM OFF
  // ======================================================

  function disableBGM(){

    bgmEnabled =
      false;


    /*
      OFFの場合は停止するが
      再生位置は維持する。

      再びONにしたら
      続きから再生される。
    */

    if(
      bgm
    ){

      bgm.pause();

    }


    bgmStarted =
      false;


    saveSettings();


    updateUI();

  }



  // ======================================================
  // TOGGLE
  // ======================================================

  function toggleBGM(){

    if(
      bgmEnabled
    ){

      disableBGM();

    }
    else{

      enableBGM();

    }

  }



  // ======================================================
  // SET VOLUME
  // ======================================================

  function setBGMVolume(
    value
  ){

    const number =
      Number(
        value
      );


    if(
      !Number.isFinite(
        number
      )
    ){

      return;

    }


    userVolume =
      Math.max(
        0,
        Math.min(
          1,
          number
        )
      );


    saveSettings();


    applyVolume();


    updateUI();

  }



  // ======================================================
  // GET VOLUME
  // ======================================================

  function getBGMVolume(){

    return userVolume;

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
      bgmEnabled &&
      bgmStarted &&
      !bgm.paused
    );

  }



  // ======================================================
  // ENABLE CHECK
  // ======================================================

  function isBGMEnabled(){

    return bgmEnabled;

  }



  // ======================================================
  // MAP VOLUME WATCH
  // ======================================================

  function updateMapAudio(){

    const indoor =
      isIndoor();


    /*
      屋内・屋外が変化した時だけ
      音量を更新。
    */

    if(
      indoor !==
      lastIndoorState
    ){

      lastIndoorState =
        indoor;


      applyVolume();


      if(
        indoor
      ){

        console.log(
          "AUDIO: INDOOR MODE"
        );

      }
      else{

        console.log(
          "AUDIO: OUTDOOR MODE"
        );

      }

    }

  }



  // ======================================================
  // UI STYLE
  // ======================================================

  function injectAudioStyle(){

    if(
      document.getElementById(
        "hangzhouAudioStyle"
      )
    ){

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "hangzhouAudioStyle";


    style.textContent = `

      #hangzhouAudioUI{

        position:fixed;

        top:18px;
        right:18px;

        z-index:99999;

        font-family:
          "Noto Sans JP",
          "Yu Gothic",
          "Meiryo",
          sans-serif;

        user-select:none;

      }


      #hangzhouAudioButton{

        width:42px;
        height:42px;

        border:1px solid rgba(255,220,150,0.55);

        border-radius:10px;

        background:
          rgba(20,16,24,0.82);

        color:
          #ffe0a3;

        font-size:20px;

        cursor:pointer;

        display:flex;

        align-items:center;
        justify-content:center;

        box-shadow:
          0 4px 18px rgba(0,0,0,0.38);

        backdrop-filter:
          blur(6px);

        transition:
          transform 0.15s ease,
          background 0.15s ease,
          border-color 0.15s ease;

      }


      #hangzhouAudioButton:hover{

        transform:
          translateY(-1px);

        background:
          rgba(38,27,35,0.94);

        border-color:
          rgba(255,220,150,0.85);

      }


      #hangzhouAudioPanel{

        position:absolute;

        top:50px;
        right:0;

        width:210px;

        padding:
          14px 14px 13px;

        box-sizing:border-box;

        border:
          1px solid
          rgba(255,220,150,0.42);

        border-radius:
          12px;

        background:
          rgba(18,15,22,0.94);

        color:
          #f6ead6;

        box-shadow:
          0 8px 28px
          rgba(0,0,0,0.48);

        backdrop-filter:
          blur(10px);

        opacity:0;

        visibility:hidden;

        transform:
          translateY(-5px);

        transition:
          opacity 0.16s ease,
          transform 0.16s ease,
          visibility 0.16s;

      }


      #hangzhouAudioPanel.open{

        opacity:1;

        visibility:visible;

        transform:
          translateY(0);

      }


      .hangzhou-audio-title{

        font-size:12px;

        letter-spacing:
          0.16em;

        color:
          #e9c98c;

        margin-bottom:
          12px;

      }


      .hangzhou-audio-row{

        display:flex;

        align-items:center;

        justify-content:
          space-between;

        gap:10px;

      }


      #hangzhouBgmToggle{

        border:
          1px solid
          rgba(255,220,150,0.4);

        border-radius:
          7px;

        padding:
          5px 10px;

        background:
          rgba(255,255,255,0.06);

        color:
          #f8e7c3;

        font-size:
          12px;

        font-weight:
          700;

        cursor:pointer;

      }


      #hangzhouBgmToggle:hover{

        background:
          rgba(255,220,150,0.12);

      }


      .hangzhou-volume-wrap{

        margin-top:
          13px;

      }


      .hangzhou-volume-head{

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        margin-bottom:
          7px;

        font-size:
          11px;

        color:
          rgba(255,245,225,0.76);

      }


      #hangzhouVolumeSlider{

        width:100%;

        cursor:pointer;

        accent-color:
          #e9c98c;

      }


      #hangzhouAudioStatus{

        margin-top:
          9px;

        font-size:
          10px;

        color:
          rgba(255,245,225,0.46);

        min-height:
          14px;

      }


      @media(
        max-width:700px
      ){

        #hangzhouAudioUI{

          top:10px;
          right:10px;

        }


        #hangzhouAudioButton{

          width:38px;
          height:38px;

          font-size:18px;

        }


        #hangzhouAudioPanel{

          top:46px;

          width:190px;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }



  // ======================================================
  // CREATE UI
  // ======================================================

  function createAudioUI(){

    if(
      document.getElementById(
        "hangzhouAudioUI"
      )
    ){

      return;

    }


    injectAudioStyle();


    audioUI =
      document.createElement(
        "div"
      );


    audioUI.id =
      "hangzhouAudioUI";



    // ------------------------------------------------------
    // MAIN BUTTON
    // ------------------------------------------------------

    audioButton =
      document.createElement(
        "button"
      );


    audioButton.id =
      "hangzhouAudioButton";


    audioButton.type =
      "button";


    audioButton.setAttribute(
      "aria-label",
      "BGM設定"
    );


    audioButton.textContent =
      "♫";



    // ------------------------------------------------------
    // PANEL
    // ------------------------------------------------------

    audioPanel =
      document.createElement(
        "div"
      );


    audioPanel.id =
      "hangzhouAudioPanel";



    // ------------------------------------------------------
    // TITLE
    // ------------------------------------------------------

    const title =
      document.createElement(
        "div"
      );


    title.className =
      "hangzhou-audio-title";


    title.textContent =
      "SOUND / BGM";



    // ------------------------------------------------------
    // BGM ROW
    // ------------------------------------------------------

    const bgmRow =
      document.createElement(
        "div"
      );


    bgmRow.className =
      "hangzhou-audio-row";


    const bgmLabel =
      document.createElement(
        "span"
      );


    bgmLabel.textContent =
      "BGM";


    toggleButton =
      document.createElement(
        "button"
      );


    toggleButton.id =
      "hangzhouBgmToggle";


    toggleButton.type =
      "button";



    bgmRow.appendChild(
      bgmLabel
    );


    bgmRow.appendChild(
      toggleButton
    );



    // ------------------------------------------------------
    // VOLUME
    // ------------------------------------------------------

    const volumeWrap =
      document.createElement(
        "div"
      );


    volumeWrap.className =
      "hangzhou-volume-wrap";


    const volumeHead =
      document.createElement(
        "div"
      );


    volumeHead.className =
      "hangzhou-volume-head";


    const volumeLabel =
      document.createElement(
        "span"
      );


    volumeLabel.textContent =
      "音量";


    volumeText =
      document.createElement(
        "span"
      );


    volumeHead.appendChild(
      volumeLabel
    );


    volumeHead.appendChild(
      volumeText
    );


    volumeSlider =
      document.createElement(
        "input"
      );


    volumeSlider.id =
      "hangzhouVolumeSlider";


    volumeSlider.type =
      "range";


    volumeSlider.min =
      "0";


    volumeSlider.max =
      "100";


    volumeSlider.step =
      "1";



    // ------------------------------------------------------
    // STATUS
    // ------------------------------------------------------

    const status =
      document.createElement(
        "div"
      );


    status.id =
      "hangzhouAudioStatus";



    // ------------------------------------------------------
    // BUILD
    // ------------------------------------------------------

    volumeWrap.appendChild(
      volumeHead
    );


    volumeWrap.appendChild(
      volumeSlider
    );


    audioPanel.appendChild(
      title
    );


    audioPanel.appendChild(
      bgmRow
    );


    audioPanel.appendChild(
      volumeWrap
    );


    audioPanel.appendChild(
      status
    );


    audioUI.appendChild(
      audioButton
    );


    audioUI.appendChild(
      audioPanel
    );


    document.body.appendChild(
      audioUI
    );



    // ====================================================
    // UI EVENTS
    // ====================================================

    audioButton.addEventListener(

      "click",

      event=>{

        event.preventDefault();

        event.stopPropagation();


        audioPanel.classList.toggle(
          "open"
        );

      }

    );


    toggleButton.addEventListener(

      "click",

      event=>{

        event.preventDefault();

        event.stopPropagation();


        toggleBGM();

      }

    );


    volumeSlider.addEventListener(

      "input",

      ()=>{

        const value =
          Number(
            volumeSlider.value
          ) / 100;


        setBGMVolume(
          value
        );

      }

    );


    /*
      パネル内をクリックしても
      閉じないようにする。
    */

    audioPanel.addEventListener(

      "click",

      event=>{

        event.stopPropagation();

      }

    );


    /*
      パネル外をクリックしたら閉じる。
    */

    document.addEventListener(

      "click",

      ()=>{

        if(
          audioPanel
        ){

          audioPanel.classList.remove(
            "open"
          );

        }

      }

    );


    updateUI();

  }



  // ======================================================
  // UPDATE UI
  // ======================================================

  function updateUI(){

    if(
      !audioUI
    ){

      return;

    }


    if(
      toggleButton
    ){

      toggleButton.textContent =
        bgmEnabled
          ? "ON"
          : "OFF";

    }


    if(
      volumeSlider
    ){

      volumeSlider.value =
        String(
          Math.round(
            userVolume *
            100
          )
        );


      volumeSlider.disabled =
        !bgmEnabled;

    }


    if(
      volumeText
    ){

      volumeText.textContent =
        Math.round(
          userVolume *
          100
        ) +
        "%";

    }


    if(
      audioButton
    ){

      audioButton.textContent =
        bgmEnabled
          ? "♫"
          : "♪̸";


      audioButton.title =
        bgmEnabled
          ? "BGM設定"
          : "BGM OFF";

    }


    const status =
      document.getElementById(
        "hangzhouAudioStatus"
      );


    if(
      status
    ){

      if(
        !bgmEnabled
      ){

        status.textContent =
          "BGM OFF";

      }
      else if(
        isIndoor()
      ){

        status.textContent =
          "屋内：BGMを自動調整中";

      }
      else{

        status.textContent =
          "屋外：通常音量";

      }

    }

  }



  // ======================================================
  // UI KEY PROTECTION
  // ======================================================

  /*
    スライダー等を操作している時に
    ゲーム側へキー入力が流れにくくする。
  */

  function protectAudioUIKeys(){

    if(
      !audioUI
    ){

      return;

    }


    audioUI.addEventListener(

      "keydown",

      event=>{

        event.stopPropagation();

      }

    );


    audioUI.addEventListener(

      "keyup",

      event=>{

        event.stopPropagation();

      }

    );

  }



  // ======================================================
  // GLOBAL API
  // ======================================================

  window.startBGM =
    startBGM;


  window.pauseBGM =
    pauseBGM;


  window.resumeBGM =
    resumeBGM;


  window.stopBGM =
    stopBGM;


  window.enableBGM =
    enableBGM;


  window.disableBGM =
    disableBGM;


  window.toggleBGM =
    toggleBGM;


  window.setBGMVolume =
    setBGMVolume;


  window.getBGMVolume =
    getBGMVolume;


  window.isBGMPlaying =
    isBGMPlaying;


  window.isBGMEnabled =
    isBGMEnabled;



  // ======================================================
  // INITIALIZE
  // ======================================================

  function initializeAudio(){

    loadSettings();


    createBGM();


    createAudioUI();


    protectAudioUIKeys();


    /*
      最初のマップ状態を記録。
    */

    lastIndoorState =
      isIndoor();


    applyVolume();


    /*
      マップ変更監視。

      game.js を書き換えず、
      currentMapId の変化を
      audio.js 側から確認する。

      200ms間隔なので負荷は非常に小さい。
    */

    window.setInterval(

      ()=>{

        updateMapAudio();

      },

      200

    );


    console.log(
      "杭州探索録 AUDIO SYSTEM Ver.2.0 loaded"
    );

  }



  // ======================================================
  // START
  // ======================================================

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(

      "DOMContentLoaded",

      initializeAudio,

      {
        once:true
      }

    );

  }
  else{

    initializeAudio();

  }


})();
