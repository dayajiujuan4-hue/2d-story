"use strict";

// ======================================================
// 杭州探索録 WEATHER SYSTEM Ver.2.1
//
// 自動天候ループ
//
// ゲーム開始
//   ↓ 30秒
// 晴れ
//   ↓
// 雨（徐々に降り始める）
//   ↓
// 雨上がり
//   ↓
// 晴れ
//   ↓ 30秒
// 再び雨
//
// DEBUG
// 1 = 晴れ
// 2 = 雨
// 3 = 雨上がり
//
// ※ 1 / 2 / 3 を押しても
//    自動天候ループは停止しません。
// ======================================================

(function(){

  // ======================================================
  // WEATHER TYPES
  // ======================================================

  const WEATHER={

    CLEAR:"clear",

    RAIN:"rain",

    AFTER_RAIN:"after_rain"

  };


  // ======================================================
  // SETTINGS
  // ======================================================

  // 晴れは必ず30秒
  //
  // ゲーム開始から30秒後に
  // 最初の雨が降り始める。

  const CLEAR_DURATION=30;


  // 雨の長さ
  //
  // 毎回45～60秒の間で変化する。

  const RAIN_DURATION_MIN=45;

  const RAIN_DURATION_MAX=60;


  // 雨上がりの長さ
  //
  // 毎回30～45秒の間で変化する。

  const AFTER_RAIN_DURATION_MIN=30;

  const AFTER_RAIN_DURATION_MAX=45;


  // 雨が本降りになるまでの時間

  const RAIN_FADE_IN=8;


  // 雨が止むまでの時間

  const RAIN_FADE_OUT=7;


  // ======================================================
  // STATE
  // ======================================================

  let currentWeather=
    WEATHER.CLEAR;


  // 現在の天候になってからの時間

  let weatherTimer=0;


  // 現在の天候の継続時間

  let weatherDuration=
    CLEAR_DURATION;


  // 0 ～ 1
  //
  // 雨の強さ。
  //
  // 0 = 雨なし
  // 1 = 本降り

  let rainIntensity=0;


  // 雨粒

  let rainDrops=[];


  // 地面の波紋

  let ripples=[];


  // 波紋生成タイマー

  let splashTimer=0;


  // 天候表示用

  let noticeTimer=null;


  // ======================================================
  // UTILITY
  // ======================================================

  function randomRange(
    min,
    max
  ){

    return (
      min+
      Math.random()*
      (max-min)
    );

  }


  function clamp(
    value,
    min,
    max
  ){

    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );

  }


  // ======================================================
  // INDOOR CHECK
  // ======================================================

  function isIndoor(){

    try{

      const map=
        typeof getCurrentMap==="function"
        ? getCurrentMap()
        : null;


      return !!(
        map &&
        (
          map.ambient==="indoor" ||
          map.indoor===true
        )
      );

    }

    catch(error){

      return false;

    }

  }


  // ======================================================
  // WEATHER DURATION
  // ======================================================

  function chooseDuration(type){

    // --------------------------------------
    // CLEAR
    // --------------------------------------

    if(
      type===
      WEATHER.CLEAR
    ){

      return CLEAR_DURATION;

    }


    // --------------------------------------
    // RAIN
    // --------------------------------------

    if(
      type===
      WEATHER.RAIN
    ){

      return randomRange(
        RAIN_DURATION_MIN,
        RAIN_DURATION_MAX
      );

    }


    // --------------------------------------
    // AFTER RAIN
    // --------------------------------------

    if(
      type===
      WEATHER.AFTER_RAIN
    ){

      return randomRange(
        AFTER_RAIN_DURATION_MIN,
        AFTER_RAIN_DURATION_MAX
      );

    }


    return 30;

  }


  // ======================================================
  // SET WEATHER
  // ======================================================

  function setWeather(
    type,
    options={}
  ){

    if(
      !Object.values(
        WEATHER
      ).includes(type)
    ){

      return;

    }


    currentWeather=
      type;


    weatherTimer=0;


    weatherDuration=
      chooseDuration(type);


    // --------------------------------------
    // CLEAR
    // --------------------------------------

    if(
      type===
      WEATHER.CLEAR
    ){

      rainIntensity=0;

      ripples.length=0;

    }


    // --------------------------------------
    // RAIN
    // --------------------------------------

    else if(
      type===
      WEATHER.RAIN
    ){

      ensureRainDrops();


      // デバッグキー2の場合は
      // すぐ雨を確認できる。

      if(
        options.instant===true
      ){

        rainIntensity=1;

      }

      else{

        // 自動天候の場合は
        // 0から徐々に雨が強くなる。

        rainIntensity=0;

      }

    }


    // --------------------------------------
    // AFTER RAIN
    // --------------------------------------

    else if(
      type===
      WEATHER.AFTER_RAIN
    ){

      rainIntensity=0;

      ripples.length=0;

    }


    if(
      options.notice!==false
    ){

      showWeatherNotice();

    }

  }


  // ======================================================
  // GET WEATHER
  // ======================================================

  function getWeather(){

    return currentWeather;

  }


  // ======================================================
  // NEXT WEATHER
  // ======================================================

  function goToNextWeather(){

    // --------------------------------------
    // CLEAR → RAIN
    // --------------------------------------

    if(
      currentWeather===
      WEATHER.CLEAR
    ){

      setWeather(
        WEATHER.RAIN,
        {
          instant:false,
          notice:true
        }
      );


      return;

    }


    // --------------------------------------
    // RAIN → AFTER RAIN
    // --------------------------------------

    if(
      currentWeather===
      WEATHER.RAIN
    ){

      setWeather(
        WEATHER.AFTER_RAIN,
        {
          notice:true
        }
      );


      return;

    }


    // --------------------------------------
    // AFTER RAIN → CLEAR
    // --------------------------------------

    setWeather(
      WEATHER.CLEAR,
      {
        notice:true
      }
    );

  }


  // ======================================================
  // AUTOMATIC WEATHER
  // ======================================================

  function updateAutomaticWeather(dt){

    weatherTimer+=dt;


    // ==================================================
    // RAIN INTENSITY
    // ==================================================

    if(
      currentWeather===
      WEATHER.RAIN
    ){

      // --------------------------------------
      // 降り始め
      // --------------------------------------

      if(
        weatherTimer<
        RAIN_FADE_IN
      ){

        rainIntensity=
          clamp(
            weatherTimer/
            RAIN_FADE_IN,
            0,
            1
          );

      }

      else{

        rainIntensity=1;

      }


      // --------------------------------------
      // 雨の終盤
      // --------------------------------------

      const remaining=
        weatherDuration-
        weatherTimer;


      if(
        remaining<
        RAIN_FADE_OUT
      ){

        rainIntensity=
          clamp(
            remaining/
            RAIN_FADE_OUT,
            0,
            1
          );

      }

    }


    // ==================================================
    // NEXT WEATHER
    // ==================================================

    if(
      weatherTimer>=
      weatherDuration
    ){

      goToNextWeather();

    }

  }


  // ======================================================
  // RAIN DROP SETUP
  // ======================================================

  function ensureRainDrops(){

    if(
      typeof canvas===
      "undefined"
    ){

      return;

    }


    const desired=
      Math.max(
        100,
        Math.floor(
          (
            canvas.width*
            canvas.height
          )/6000
        )
      );


    while(
      rainDrops.length<
      desired
    ){

      rainDrops.push(
        createRainDrop(true)
      );

    }


    if(
      rainDrops.length>
      desired
    ){

      rainDrops.length=
        desired;

    }

  }


  // ======================================================
  // CREATE RAIN DROP
  // ======================================================

  function createRainDrop(
    randomY=false
  ){

    const w=
      typeof canvas!=="undefined"
      ? canvas.width
      : 1280;


    const h=
      typeof canvas!=="undefined"
      ? canvas.height
      : 720;


    return {

      x:
        Math.random()*
        (w+180)-90,


      y:
        randomY
        ? Math.random()*h
        : -30-Math.random()*120,


      length:
        8+
        Math.random()*15,


      speed:
        470+
        Math.random()*300,


      drift:
        55+
        Math.random()*45,


      alpha:
        .16+
        Math.random()*.22

    };

  }


  // ======================================================
  // RESET RAIN DROP
  // ======================================================

  function resetRainDrop(drop){

    const fresh=
      createRainDrop(false);


    drop.x=
      fresh.x;


    drop.y=
      fresh.y;


    drop.length=
      fresh.length;


    drop.speed=
      fresh.speed;


    drop.drift=
      fresh.drift;


    drop.alpha=
      fresh.alpha;

  }


  // ======================================================
  // UPDATE WEATHER
  // ======================================================

  function updateWeather(dt){

    // ==================================================
    // 自動天候
    // ==================================================
    //
    // 屋内でも時間は進む。
    //
    // 例えば雨のときに茶館へ入り、
    // 長時間滞在して外へ出たら
    // 雨上がりになっていることもある。

    updateAutomaticWeather(dt);


    // ==================================================
    // 雨以外
    // ==================================================

    if(
      currentWeather!==
      WEATHER.RAIN
    ){

      return;

    }


    ensureRainDrops();


    // ==================================================
    // INDOOR
    // ==================================================

    if(
      isIndoor()
    ){

      return;

    }


    const w=
      canvas.width;


    const h=
      canvas.height;


    // ==================================================
    // RAIN DROP UPDATE
    // ==================================================

    for(
      const drop of rainDrops
    ){

      drop.x+=
        drop.drift*
        dt;


      drop.y+=
        drop.speed*
        dt;


      if(
        drop.y>h+40 ||
        drop.x>w+100
      ){

        resetRainDrop(
          drop
        );

      }

    }


    // ==================================================
    // SPLASH TIMER
    // ==================================================

    splashTimer-=dt;


    if(
      splashTimer<=0 &&
      rainIntensity>.08
    ){

      splashTimer=
        (
          .04+
          Math.random()*.07
        )/
        Math.max(
          .2,
          rainIntensity
        );


      const maxRipples=
        Math.max(
          1,
          Math.floor(
            30*
            rainIntensity
          )
        );


      if(
        ripples.length<
        maxRipples
      ){

        ripples.push({

          x:
            Math.random()*w,


          y:
            h*.48+
            Math.random()*
            h*.47,


          age:0,


          life:
            .35+
            Math.random()*.35,


          size:
            2+
            Math.random()*5

        });

      }

    }


    // ==================================================
    // RIPPLE UPDATE
    // ==================================================

    for(
      let i=
        ripples.length-1;

      i>=0;

      i--
    ){

      ripples[i].age+=dt;


      if(
        ripples[i].age>=
        ripples[i].life
      ){

        ripples.splice(
          i,
          1
        );

      }

    }

  }


  // ======================================================
  // DRAW WEATHER
  // ======================================================

  function drawWeather(time){

    if(
      typeof ctx==="undefined" ||
      typeof canvas==="undefined"
    ){

      return;

    }


    // ==================================================
    // INDOOR
    // ==================================================

    if(
      isIndoor()
    ){

      return;

    }


    // ==================================================
    // RAIN
    // ==================================================

    if(
      currentWeather===
      WEATHER.RAIN
    ){

      drawRainAtmosphere();

      drawRain();

      drawRipples();

    }


    // ==================================================
    // AFTER RAIN
    // ==================================================

    else if(
      currentWeather===
      WEATHER.AFTER_RAIN
    ){

      drawAfterRain(time);

    }

  }


  // ======================================================
  // RAIN ATMOSPHERE
  // ======================================================

  function drawRainAtmosphere(){

    if(
      rainIntensity<=0
    ){

      return;

    }


    ctx.save();


    const gradient=
      ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
      );


    gradient.addColorStop(
      0,
      `rgba(
        28,
        38,
        55,
        ${.11*rainIntensity}
      )`
    );


    gradient.addColorStop(
      .55,
      `rgba(
        18,
        29,
        43,
        ${.07*rainIntensity}
      )`
    );


    gradient.addColorStop(
      1,
      `rgba(
        8,
        18,
        28,
        ${.03*rainIntensity}
      )`
    );


    ctx.fillStyle=
      gradient;


    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.restore();

  }


  // ======================================================
  // DRAW RAIN
  // ======================================================

  function drawRain(){

    if(
      rainIntensity<=0
    ){

      return;

    }


    ctx.save();


    ctx.lineWidth=1;


    ctx.lineCap=
      "round";


    for(
      const drop of rainDrops
    ){

      ctx.strokeStyle=
        `rgba(
          190,
          215,
          235,
          ${
            drop.alpha*
            rainIntensity
          }
        )`;


      ctx.beginPath();


      ctx.moveTo(
        drop.x,
        drop.y
      );


      ctx.lineTo(
        drop.x+
        drop.length*.18,

        drop.y+
        drop.length
      );


      ctx.stroke();

    }


    ctx.restore();

  }


  // ======================================================
  // DRAW RIPPLES
  // ======================================================

  function drawRipples(){

    if(
      rainIntensity<=0
    ){

      return;

    }


    ctx.save();


    ctx.lineWidth=1;


    for(
      const ripple of ripples
    ){

      const t=
        ripple.age/
        ripple.life;


      const alpha=
        (
          1-t
        )*
        .22*
        rainIntensity;


      const radius=
        ripple.size+
        t*7;


      ctx.strokeStyle=
        `rgba(
          185,
          210,
          225,
          ${alpha}
        )`;


      ctx.beginPath();


      ctx.ellipse(
        ripple.x,
        ripple.y,
        radius,
        radius*.32,
        0,
        0,
        Math.PI*2
      );


      ctx.stroke();

    }


    ctx.restore();

  }


  // ======================================================
  // AFTER RAIN
  // ======================================================

  function drawAfterRain(time){

    ctx.save();


    const bottom=
      canvas.height;


    // ==================================================
    // WET GROUND
    // ==================================================

    const sheen=
      ctx.createLinearGradient(
        0,
        bottom*.45,
        0,
        bottom
      );


    sheen.addColorStop(
      0,
      "rgba(60,90,110,0)"
    );


    sheen.addColorStop(
      1,
      "rgba(70,105,125,.055)"
    );


    ctx.fillStyle=
      sheen;


    ctx.fillRect(
      0,
      bottom*.45,
      canvas.width,
      bottom*.55
    );


    // ==================================================
    // LIGHT REFLECTION
    // ==================================================

    ctx.globalCompositeOperation=
      "screen";


    const glow=
      Math.sin(
        time*.7
      )*.01;


    for(
      let x=34;

      x<canvas.width;

      x+=115
    ){

      const height=
        24+
        (
          (x*13)%46
        );


      const reflection=
        ctx.createLinearGradient(
          x,
          bottom*.60,
          x,
          bottom*.60+
          height
        );


      reflection.addColorStop(
        0,
        `rgba(
          236,
          135,
          72,
          ${.055+glow}
        )`
      );


      reflection.addColorStop(
        1,
        "rgba(236,135,72,0)"
      );


      ctx.fillStyle=
        reflection;


      ctx.fillRect(
        x,
        bottom*.60,
        3,
        height
      );

    }


    ctx.restore();

  }


  // ======================================================
  // WEATHER NOTICE
  // ======================================================

  function showWeatherNotice(){

    let el=
      document.getElementById(
        "weatherDebugNotice"
      );


    if(!el){

      el=
        document.createElement(
          "div"
        );


      el.id=
        "weatherDebugNotice";


      Object.assign(
        el.style,
        {

          position:"fixed",

          left:"50%",

          top:"18px",

          transform:
            "translateX(-50%)",

          zIndex:"99999",

          padding:
            "7px 12px",

          border:
            "1px solid rgba(255,255,255,.16)",

          borderRadius:"7px",

          background:
            "rgba(12,15,22,.76)",

          color:"#f2e8cf",

          font:
            "12px sans-serif",

          letterSpacing:
            ".08em",

          pointerEvents:
            "none",

          opacity:"0",

          transition:
            "opacity .18s ease"

        }
      );


      document.body.appendChild(
        el
      );

    }


    const names={

      [WEATHER.CLEAR]:
        "晴れ / CLEAR",

      [WEATHER.RAIN]:
        "雨 / RAIN",

      [WEATHER.AFTER_RAIN]:
        "雨上がり / AFTER RAIN"

    };


    el.textContent=
      `WEATHER : ${
        names[currentWeather]
      }`;


    el.style.opacity=
      "1";


    clearTimeout(
      noticeTimer
    );


    noticeTimer=
      setTimeout(
        ()=>{

          el.style.opacity=
            "0";

        },
        1300
      );

  }


  // ======================================================
  // DEBUG KEYS
  // ======================================================

  window.addEventListener(
    "keydown",
    event=>{

      if(
        event.repeat
      ){

        return;

      }


      // 入力フォーム使用中は無視

      const tag=
        event.target &&
        event.target.tagName
        ? event.target.tagName.toLowerCase()
        : "";


      if(
        tag==="input" ||
        tag==="textarea" ||
        tag==="select"
      ){

        return;

      }


      // ==================================================
      // 1 = CLEAR
      // ==================================================

      if(
        event.key==="1"
      ){

        setWeather(
          WEATHER.CLEAR,
          {
            instant:true,
            notice:true
          }
        );

      }


      // ==================================================
      // 2 = RAIN
      // ==================================================

      else if(
        event.key==="2"
      ){

        setWeather(
          WEATHER.RAIN,
          {
            instant:true,
            notice:true
          }
        );

      }


      // ==================================================
      // 3 = AFTER RAIN
      // ==================================================

      else if(
        event.key==="3"
      ){

        setWeather(
          WEATHER.AFTER_RAIN,
          {
            instant:true,
            notice:true
          }
        );

      }

    }
  );


  // ======================================================
  // GLOBAL API
  // ======================================================

  window.WEATHER=
    WEATHER;


  window.setWeather=
    setWeather;


  window.getWeather=
    getWeather;


  window.updateWeather=
    updateWeather;


  window.drawWeather=
    drawWeather;


  // ======================================================
  // INITIALIZE
  // ======================================================

  currentWeather=
    WEATHER.CLEAR;


  weatherTimer=0;


  weatherDuration=
    CLEAR_DURATION;


  rainIntensity=0;


  console.log(
    "杭州探索録 WEATHER SYSTEM Ver.2.1 loaded"
  );


  console.log(
    "最初の雨まで30秒"
  );

})();
