"use strict";

// ======================================================
// 杭州探索録 WEATHER SYSTEM Ver.2.0
//
// 自動天候ループ
// 晴れ → 雨 → 雨上がり → 晴れ
//
// デバッグ
// 1 = 晴れ
// 2 = 雨
// 3 = 雨上がり
// 0 = 自動天候へ戻る
// ======================================================

(function(){

  const WEATHER={
    CLEAR:"clear",
    RAIN:"rain",
    AFTER_RAIN:"after_rain"
  };


  // ======================================================
  // SETTINGS
  // ======================================================

  // 自動天候を最初から有効化
  let autoWeather=true;


  // 各天候の継続時間（秒）
  //
  // 実際の時間は、この範囲から
  // 毎回ランダムに決まる。
  //
  // テスト時は短くしてもOK。

  const WEATHER_DURATION={

    clear:{
      min:70,
      max:120
    },

    rain:{
      min:55,
      max:90
    },

    after_rain:{
      min:45,
      max:75
    }

  };


  // 雨が最大量になるまでの時間
  const RAIN_FADE_IN=8;

  // 雨が止むまでの時間
  const RAIN_FADE_OUT=7;


  // ======================================================
  // STATE
  // ======================================================

  let currentWeather=
    WEATHER.CLEAR;


  let weatherTimer=0;

  let weatherDuration=0;


  // 0～1
  // 実際の雨の強さ

  let rainIntensity=0;


  // 雨状態を抜ける直前に使う

  let rainEnding=false;


  let rainDrops=[];

  let ripples=[];

  let splashTimer=0;

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

    const setting=
      WEATHER_DURATION[type];


    if(!setting){

      return 60;

    }


    return randomRange(
      setting.min,
      setting.max
    );

  }


  // ======================================================
  // WEATHER STATE
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


    currentWeather=type;

    weatherTimer=0;

    weatherDuration=
      chooseDuration(type);


    rainEnding=false;


    if(
      type===WEATHER.RAIN
    ){

      ensureRainDrops();


      // 手動切替なら
      // すぐ雨を確認できるようにする

      if(
        options.instant===true
      ){

        rainIntensity=1;

      }
      else{

        rainIntensity=0;

      }

    }


    if(
      type===WEATHER.CLEAR
    ){

      rainIntensity=0;

      ripples.length=0;

    }


    if(
      type===WEATHER.AFTER_RAIN
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


  function getWeather(){

    return currentWeather;

  }


  // ======================================================
  // AUTO WEATHER
  // ======================================================

  function getNextWeather(){

    if(
      currentWeather===
      WEATHER.CLEAR
    ){

      return WEATHER.RAIN;

    }


    if(
      currentWeather===
      WEATHER.RAIN
    ){

      return WEATHER.AFTER_RAIN;

    }


    return WEATHER.CLEAR;

  }


  function updateAutomaticWeather(dt){

    if(!autoWeather){

      return;

    }


    weatherTimer+=dt;


    // --------------------------------------
    // 雨
    // --------------------------------------

    if(
      currentWeather===
      WEATHER.RAIN
    ){

      // 降り始め

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


      // 通常の雨

      else{

        rainIntensity=1;

      }


      // 止み際

      const remaining=
        weatherDuration-
        weatherTimer;


      if(
        remaining<
        RAIN_FADE_OUT
      ){

        rainEnding=true;


        rainIntensity=
          clamp(
            remaining/
            RAIN_FADE_OUT,
            0,
            1
          );

      }

    }


    // --------------------------------------
    // 次の天候へ
    // --------------------------------------

    if(
      weatherTimer>=
      weatherDuration
    ){

      const next=
        getNextWeather();


      setWeather(
        next,
        {
          notice:true
        }
      );

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
  // UPDATE
  // ======================================================

  function updateWeather(dt){

    // 自動天候そのものは
    // 屋内でも時間を進める。
    //
    // そのため、
    // 店に入っている間にも
    // 外の天候は変化する。

    updateAutomaticWeather(dt);


    if(
      currentWeather!==
      WEATHER.RAIN
    ){
      return;
    }


    ensureRainDrops();


    // 屋内では雨粒を描画しないため、
    // 雨粒更新も停止。

    if(
      isIndoor()
    ){
      return;
    }


    const w=
      canvas.width;

    const h=
      canvas.height;


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
    // GROUND SPLASH
    // ==================================================

    splashTimer-=dt;


    if(
      splashTimer<=0 &&
      rainIntensity>.08
    ){

      // 雨が弱いと
      // 波紋の発生頻度も下がる

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
        Math.floor(
          30*
          rainIntensity
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
  // DRAW
  // ======================================================

  function drawWeather(time){

    if(
      typeof ctx==="undefined" ||
      typeof canvas==="undefined"
    ){
      return;
    }


    // 屋内では描画しない

    if(
      isIndoor()
    ){
      return;
    }


    if(
      currentWeather===
      WEATHER.RAIN
    ){

      drawRainAtmosphere();

      drawRain();

      drawRipples();

    }


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
  // RAIN
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
  // RIPPLES
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


    // --------------------------------------
    // 濡れた路面
    // --------------------------------------

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


    // --------------------------------------
    // 夜市の光の反射
    // --------------------------------------

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
  // DEBUG NOTICE
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
      }${
        autoWeather
        ? ""
        : " / MANUAL"
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


  function showAutoNotice(){

    let el=
      document.getElementById(
        "weatherDebugNotice"
      );


    if(!el){

      showWeatherNotice();

      return;

    }


    el.textContent=
      "WEATHER : AUTO";


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


      // --------------------------------------
      // CLEAR
      // --------------------------------------

      if(
        event.key==="1"
      ){

        autoWeather=false;


        setWeather(
          WEATHER.CLEAR,
          {
            instant:true
          }
        );

      }


      // --------------------------------------
      // RAIN
      // --------------------------------------

      else if(
        event.key==="2"
      ){

        autoWeather=false;


        setWeather(
          WEATHER.RAIN,
          {
            instant:true
          }
        );

      }


      // --------------------------------------
      // AFTER RAIN
      // --------------------------------------

      else if(
        event.key==="3"
      ){

        autoWeather=false;


        setWeather(
          WEATHER.AFTER_RAIN,
          {
            instant:true
          }
        );

      }


      // --------------------------------------
      // AUTO
      // --------------------------------------

      else if(
        event.key==="0"
      ){

        autoWeather=true;

        weatherTimer=0;

        weatherDuration=
          chooseDuration(
            currentWeather
          );


        showAutoNotice();

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


  window.isAutoWeather=
    function(){

      return autoWeather;

    };


  window.enableAutoWeather=
    function(){

      autoWeather=true;

      weatherTimer=0;

      weatherDuration=
        chooseDuration(
          currentWeather
        );

    };


  window.disableAutoWeather=
    function(){

      autoWeather=false;

    };


  // ======================================================
  // START
  // ======================================================

  weatherDuration=
    chooseDuration(
      currentWeather
    );


  console.log(
    "杭州探索録 WEATHER SYSTEM Ver.2.0 loaded"
  );

})();
