"use strict";

/*
==========================================================
 杭州探索録
 PORTRAIT SYSTEM Ver.1.1

 NPC会話用ピクセルポートレート
 外部画像不要

 Ver.1.1
 ・白姑娘を正式追加
 ・白姑娘を黒髪ロング＋白衣に変更
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

  /*
  ========================================================
  白姑娘
  ========================================================
  */

  whiteLady:{
    name:"白姑娘",
    skin:"#f2d1ba",

    // ほぼ黒に近い長い髪
    hair:"#17171b",
    hair2:"#29272d",

    // 白衣
    clothes:"#eeeae2",
    accent:"#cfd8dc"
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
  白姑娘：後ろ髪

  顔や肩より先に描くことで
  長い髪が背中側へ落ちて見える
  --------------------------------------------------------
  */

  if(id==="whiteLady"){

    ctx.fillStyle=
      p.hair;


    // 左側の長い髪

    ctx.fillRect(
      10,20,
      10,40
    );

    ctx.fillRect(
      8,29,
      8,31
    );


    // 右側の長い髪

    ctx.fillRect(
      44,20,
      10,40
    );

    ctx.fillRect(
      48,29,
      8,31
    );


    // 背中側

    ctx.fillRect(
      15,40,
      34,22
    );


    // 毛先を少し不揃いに

    ctx.fillRect(
      11,57,
      6,6
    );

    ctx.fillRect(
      47,56,
      6,7
    );


    ctx.fillStyle=
      p.hair2;


    // 長髪に少しだけ光を入れる

    ctx.fillRect(
      12,27,
      3,24
    );

    ctx.fillRect(
      49,25,
      2,20
    );

  }


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


  /*
  白姑娘は普通の縦ラインではなく
  白衣らしい襟にする
  */

  if(id==="whiteLady"){

    ctx.fillStyle=
      p.accent;


    // 左襟

    ctx.fillRect(
      24,49,
      5,12
    );

    ctx.fillRect(
      27,52,
      4,12
    );


    // 右襟

    ctx.fillRect(
      35,49,
      5,12
    );

    ctx.fillRect(
      33,52,
      4,12
    );


    // 白衣の明るい部分

    ctx.fillStyle=
      "#faf8f2";

    ctx.fillRect(
      14,51,
      8,10
    );

    ctx.fillRect(
      42,51,
      8,10
    );

  }
  else{

    ctx.fillStyle=
      p.accent;

    ctx.fillRect(
      27,49,
      10,15
    );

  }


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
  ========================================================
  白姑娘専用

  ・黒髪ロング
  ・顔の両側に長い髪
  ・毛先は肩より下
  ========================================================
  */

  if(id==="whiteLady"){

    /*
    頭頂部を少し丸く
    */

    ctx.fillStyle=
      p.hair;

    ctx.fillRect(
      18,8,
      28,5
    );

    ctx.fillRect(
      14,12,
      36,8
    );


    /*
    顔の左側
    */

    ctx.fillRect(
      12,18,
      8,30
    );

    ctx.fillRect(
      10,31,
      8,27
    );


    /*
    顔の右側
    */

    ctx.fillRect(
      44,18,
      8,30
    );

    ctx.fillRect(
      46,31,
      8,27
    );


    /*
    頬の横に細い髪
    */

    ctx.fillRect(
      17,25,
      3,22
    );

    ctx.fillRect(
      44,25,
      3,22
    );


    /*
    前髪
    */

    ctx.fillRect(
      18,14,
      9,7
    );

    ctx.fillRect(
      25,12,
      7,8
    );

    ctx.fillRect(
      38,13,
      7,8
    );


    /*
    髪のハイライト
    */

    ctx.fillStyle=
      p.hair2;

    ctx.fillRect(
      14,23,
      2,20
    );

    ctx.fillRect(
      48,22,
      2,19
    );

    ctx.fillRect(
      21,10,
      17,2
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
    id==="whiteLady"
      ? "#30262a"
      : "#3b2925";


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
  白姑娘だけ目元を少し柔らかくする
  */

  if(
    id==="whiteLady" &&
    expression==="normal"
  ){

    ctx.fillStyle=
      "#3a3035";

    ctx.fillRect(
      23,28,
      5,1
    );

    ctx.fillRect(
      36,28,
      5,1
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
  "杭州探索録 Portrait System Ver.1.1 / White Lady Long Hair loaded"
);
