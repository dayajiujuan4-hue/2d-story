"use strict";

// ======================================================
// 杭州探索録 WEATHER SYSTEM Ver.1.0
// CLEAR / RAIN / AFTER_RAIN
//
// デバッグ操作
// 1 = 晴れ
// 2 = 雨
// 3 = 雨上がり
// ======================================================

(function(){

  const WEATHER={
    CLEAR:"clear",
    RAIN:"rain",
    AFTER_RAIN:"after_rain"
  };

  let currentWeather=WEATHER.CLEAR;

  let rainDrops=[];
  let ripples=[];

  let splashTimer=0;
  let noticeTimer=null;


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
  // WEATHER STATE
  // ======================================================

  function setWeather(type){

    if(
      !Object.values(WEATHER).includes(type)
    ){
      return;
    }


    currentWeather=type;


    if(
      type===WEATHER.RAIN
    ){
      ensureRainDrops();
    }


    showWeatherNotice();

  }


  function getWeather(){

    return currentWeather;

  }


  // ======================================================
  // RAIN DROP SETUP
  // ======================================================

  function ensureRainDrops(){

    if(
      typeof canvas==="undefined"
    ){
      return;
    }


    const desired=
      Math.max(
        90,
        Math.floor(
          (
            canvas.width*
            canvas.height
          )/6500
        )
      );


    while(
      rainDrops.length<desired
    ){

      rainDrops.push(
        createRainDrop(true)
      );

    }


    if(
      rainDrops.length>desired
    ){

      rainDrops.length=desired;

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

    if(
      currentWeather!==WEATHER.RAIN
    ){
      return;
    }


    ensureRainDrops();


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
        drop.drift*dt;

      drop.y+=
        drop.speed*dt;


      if(
        drop.y>h+40 ||
        drop.x>w+100
      ){

        resetRainDrop(drop);

      }

    }


    // --------------------------------------
    // 地面の雨粒
    // --------------------------------------

    splashTimer-=dt;


    if(
      splashTimer<=0
    ){

      splashTimer=
        .045+
        Math.random()*.07;


      if(
        ripples.length<28
      ){

        ripples.push({

          x:
            Math.random()*w,

          y:
            h*.48+
            Math.random()*h*.47,

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


    // 店内では天候を描画しない

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
      "rgba(28,38,55,.11)"
    );

    gradient.addColorStop(
      .55,
      "rgba(18,29,43,.07)"
    );

    gradient.addColorStop(
      1,
      "rgba(8,18,28,.03)"
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
          ${drop.alpha}
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

    ctx.save();


    ctx.lineWidth=1;


    for(
      const ripple of ripples
    ){

      const t=
        ripple.age/
        ripple.life;


      const alpha=
        (1-t)*.22;


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
    // 濡れた路面の薄い光沢
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
    // 提灯・街灯をイメージした反射
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
        1200
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


      if(
        event.key==="1"
      ){

        setWeather(
          WEATHER.CLEAR
        );

      }

      else if(
        event.key==="2"
      ){

        setWeather(
          WEATHER.RAIN
        );

      }

      else if(
        event.key==="3"
      ){

        setWeather(
          WEATHER.AFTER_RAIN
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


  console.log(
    "杭州探索録 WEATHER SYSTEM Ver.1.0 loaded"
  );

})();
