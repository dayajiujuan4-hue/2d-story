"use strict";

/*
==========================================================
 杭州探索録
 PORTRAIT SYSTEM Ver.1

 NPC会話用ピクセルポートレート
 外部画像不要
==========================================================
*/


const PORTRAITS={

  xiaoyu:{
    name:"林小雨",
    skin:"#f2c6a5",
    hair:"#292329",
    hair2:"#3a3037",
    clothes:"#708ca0",
    accent:"#d9e7ee"
  },

  uncleChen:{
    name:"陈叔",
    skin:"#d9a67d",
    hair:"#292727",
    hair2:"#44403d",
    clothes:"#765746",
    accent:"#d3a45c"
  },

  xiaozhou:{
    name:"小周",
    skin:"#e4b58e",
    hair:"#24252a",
    hair2:"#343640",
    clothes:"#586879",
    accent:"#8eb0c7"
  },

  hotelStaff:{
    name:"前台",
    skin:"#edc2a0",
    hair:"#312729",
    hair2:"#4b3a3e",
    clothes:"#474d65",
    accent:"#d4b96c"
  },

  vendorWoman:{
    name:"老板娘",
    skin:"#e4b18b",
    hair:"#302528",
    hair2:"#443238",
    clothes:"#8a5349",
    accent:"#e0a862"
  },

  student:{
    name:"大学生",
    skin:"#efc39e",
    hair:"#28252d",
    hair2:"#3c3744",
    clothes:"#536b7a",
    accent:"#87aebe"
  },

  tourist:{
    name:"游客",
    skin:"#e9ba94",
    hair:"#43332d",
    hair2:"#5b463d",
    clothes:"#65714f",
    accent:"#c6a66b"
  }

};


function portraitColor(
  value,
  fallback
){

  return value || fallback;

}


function drawPixelPortrait(
  canvas,
  id,
  expression="normal"
){

  if(!canvas){
    return;
  }


  const p=
    PORTRAITS[id] ||
    PORTRAITS.student;


  const ctx=
    canvas.getContext("2d");


  const W=
    canvas.width;

  const H=
    canvas.height;


  ctx.clearRect(
    0,0,W,H
  );


  ctx.imageSmoothingEnabled=
    false;


  /*
  --------------------------------------------------------
  BACKGROUND
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#1b2028";

  ctx.fillRect(
    0,0,W,H
  );


  ctx.fillStyle=
    "#252d38";

  ctx.fillRect(
    4,4,
    W-8,
    H-8
  );


  /*
  --------------------------------------------------------
  SHOULDERS
  --------------------------------------------------------
  */

  ctx.fillStyle=
    p.clothes;

  ctx.fillRect(
    13,48,
    38,16
  );

  ctx.fillRect(
    8,55,
    48,9
  );


  ctx.fillStyle=
    p.accent;

  ctx.fillRect(
    27,49,
    10,15
  );


  /*
  --------------------------------------------------------
  NECK
  --------------------------------------------------------
  */

  ctx.fillStyle=
    p.skin;

  ctx.fillRect(
    27,42,
    10,10
  );


  /*
  --------------------------------------------------------
  EARS
  --------------------------------------------------------
  */

  ctx.fillRect(
    14,24,
    5,13
  );

  ctx.fillRect(
    45,24,
    5,13
  );


  /*
  --------------------------------------------------------
  FACE
  --------------------------------------------------------
  */

  ctx.fillStyle=
    p.skin;

  ctx.fillRect(
    18,16,
    28,30
  );


  /*
  --------------------------------------------------------
  HAIR
  --------------------------------------------------------
  */

  ctx.fillStyle=
    p.hair;

  ctx.fillRect(
    16,10,
    32,12
  );

  ctx.fillRect(
    14,15,
    7,20
  );

  ctx.fillRect(
    43,15,
    7,18
  );


  ctx.fillStyle=
    p.hair2;

  ctx.fillRect(
    20,8,
    24,5
  );

  ctx.fillRect(
    17,13,
    12,5
  );


  /*
  小雨だけ少し長めの髪
  */

  if(id==="xiaoyu"){

    ctx.fillStyle=
      p.hair;

    ctx.fillRect(
      14,30,
      5,17
    );

    ctx.fillRect(
      45,30,
      5,17
    );

  }


  /*
  陈叔
  */

  if(id==="uncleChen"){

    ctx.fillStyle=
      "#59493f";

    ctx.fillRect(
      23,39,
      18,3
    );

  }


  /*
  --------------------------------------------------------
  EYEBROWS
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#3b2925";


  if(expression==="angry"){

    ctx.fillRect(
      22,25,
      6,2
    );

    ctx.fillRect(
      36,25,
      6,2
    );

  }
  else{

    ctx.fillRect(
      22,24,
      6,2
    );

    ctx.fillRect(
      36,24,
      6,2
    );

  }


  /*
  --------------------------------------------------------
  EYES
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#252125";


  if(
    expression==="smile" ||
    expression==="laugh"
  ){

    ctx.fillRect(
      23,29,
      5,1
    );

    ctx.fillRect(
      36,29,
      5,1
    );

  }
  else if(
    expression==="surprised"
  ){

    ctx.fillRect(
      24,28,
      3,4
    );

    ctx.fillRect(
      37,28,
      3,4
    );

  }
  else{

    ctx.fillRect(
      24,28,
      3,3
    );

    ctx.fillRect(
      37,28,
      3,3
    );

  }


  /*
  --------------------------------------------------------
  NOSE
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#c98970";

  ctx.fillRect(
    31,32,
    2,3
  );


  /*
  --------------------------------------------------------
  MOUTH
  --------------------------------------------------------
  */

  ctx.fillStyle=
    "#934e4c";


  if(
    expression==="smile" ||
    expression==="laugh"
  ){

    ctx.fillRect(
      28,38,
      8,2
    );

    ctx.fillRect(
      30,40,
      4,1
    );

  }
  else if(
    expression==="surprised"
  ){

    ctx.fillRect(
      30,37,
      4,4
    );

  }
  else if(
    expression==="sad"
  ){

    ctx.fillRect(
      29,39,
      6,1
    );

    ctx.fillRect(
      31,38,
      2,1
    );

  }
  else{

    ctx.fillRect(
      29,38,
      6,1
    );

  }


  /*
  --------------------------------------------------------
  BORDER
  --------------------------------------------------------
  */

  ctx.strokeStyle=
    "#d3b574";

  ctx.lineWidth=
    2;

  ctx.strokeRect(
    1,1,
    W-2,
    H-2
  );

}



// ==========================================================
// PORTRAIT DOM
// ==========================================================

function ensurePortraitCanvas(){

  const holder=
    document.getElementById(
      "portraitFace"
    );


  if(!holder){
    return null;
  }


  let canvas=
    document.getElementById(
      "npcPortraitCanvas"
    );


  if(canvas){
    return canvas;
  }


  holder.textContent="";


  canvas=
    document.createElement(
      "canvas"
    );


  canvas.id=
    "npcPortraitCanvas";


  canvas.width=64;
  canvas.height=64;


  canvas.style.width=
    "100%";

  canvas.style.height=
    "100%";

  canvas.style.imageRendering=
    "pixelated";


  holder.appendChild(
    canvas
  );


  return canvas;

}



function showNPCPortrait(
  portrait,
  expression="normal"
){

  const canvas=
    ensurePortraitCanvas();


  if(!canvas){
    return;
  }


  drawPixelPortrait(
    canvas,
    portrait,
    expression
  );

}



// ==========================================================
// HOOK EXISTING DIALOGUE
// ==========================================================

const portraitOriginalStartDialogue=
  startDialogue;


startDialogue=function(npc){

  portraitOriginalStartDialogue(
    npc
  );


  /*
   * 元のgame.jsではportraitFaceの
   * textContentを書き換えるので、
   * その直後にCanvasへ差し替える。
   */

  showNPCPortrait(
    npc.portrait ||
    "student",

    npc.expression ||
    "normal"
  );

};



console.log(
  "杭州探索録 Portrait System Ver.1 loaded"
);
