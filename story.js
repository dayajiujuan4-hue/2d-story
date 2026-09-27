"use strict";

/*
==========================================================
 杭州探索録
 STORY MODE Ver.2.1

 第一章「武林の夜」

 Ver.2.1
 ・小雨の移動をウェイポイント方式へ変更
 ・移動途中で止まる問題を修正
 ・最終地点到着を確実に判定
 ・到着後、陈叔イベントへ確実に移行

 portraits.js Ver.1 と併用
==========================================================
*/


// ==========================================================
// SAVE
// ==========================================================

const STORY_SAVE_KEY =
  "hangzhouStorySaveV21";


const STORY = {

  mode:null,

  chapter:1,

  step:0,

  started:false,

  choiceOpen:false,

  flags:{},

  sequence:null,

  sequenceIndex:0,

  movingNPC:null,

  chapterComplete:false

};


function saveStory(){

  localStorage.setItem(

    STORY_SAVE_KEY,

    JSON.stringify({

      chapter:
        STORY.chapter,

      step:
        STORY.step,

      flags:
        STORY.flags,

      chapterComplete:
        STORY.chapterComplete

    })

  );

}


function loadStory(){

  try{

    const data =
      JSON.parse(

        localStorage.getItem(
          STORY_SAVE_KEY
        )

      );


    if(!data){
      return;
    }


    STORY.chapter =
      data.chapter || 1;


    STORY.step =
      data.step || 0;


    STORY.flags =
      data.flags || {};


    STORY.chapterComplete =
      !!data.chapterComplete;

  }
  catch(error){

    console.warn(
      "Story save load failed",
      error
    );

  }

}


// ==========================================================
// STORY NPCS
// ==========================================================

const STORY_NPCS = {


  // --------------------------------------------------------
  // 林小雨
  // --------------------------------------------------------

  xiaoyu:{

    id:"xiaoyu",

    map:"food",

    name:"林小雨",

    x:24*TILE,
    y:16*TILE,

    color:"#708ca0",

    skin:"#f2c6a5",

    hair:"#292329",

    direction:"down",

    portrait:"xiaoyu",

    visible:false,

    marker:true,

    storyInteract:true,

    storyMoving:false

  },


  // --------------------------------------------------------
  // 陈叔
  // --------------------------------------------------------

  uncleChen:{

    id:"uncleChen",

    map:"food",

    name:"陈叔",

    /*
      烧烤屋台付近。
    */

    x:17*TILE,
    y:12*TILE,

    color:"#765746",

    skin:"#d9a67d",

    hair:"#292727",

    direction:"right",

    portrait:"uncleChen",

    visible:false,

    marker:true,

    storyInteract:true,

    storyMoving:false

  },


  // --------------------------------------------------------
  // 白い服の女性
  // --------------------------------------------------------

  whiteLady:{

    id:"whiteLady",

    map:"food",

    name:"？？？",

    x:37*TILE,
    y:19*TILE,

    color:"#e8e5df",

    skin:"#efd0b5",

    hair:"#17171b",

    direction:"left",

    portrait:"whiteLady",

    visible:false,

    marker:false,

    storyInteract:false,

    storyMoving:false

  }

};


// ==========================================================
// WHITE LADY PORTRAIT
// ==========================================================

if(
  typeof PORTRAITS !==
  "undefined"
){

  PORTRAITS.whiteLady = {

    name:"？？？",

    skin:"#efd0b5",

    hair:"#17171b",

    hair2:"#29272d",

    clothes:"#ece8df",

    accent:"#c9d6d0"

  };

}


// ==========================================================
// STYLE
// ==========================================================

function storyAddStyle(){

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

  #storyModeScreen{

    position:fixed;

    inset:0;

    z-index:9999;

    display:flex;

    align-items:center;

    justify-content:center;

    background:
      radial-gradient(
        circle at 50% 40%,
        rgba(81,52,42,.35),
        rgba(8,10,15,.97) 65%
      );

    font-family:
      "Noto Sans JP",
      sans-serif;

  }


  #storyModeScreen.hidden{
    display:none;
  }


  .story-title-panel{

    width:min(
      760px,
      calc(100vw - 40px)
    );

    padding:
      44px 48px;

    box-sizing:
      border-box;

    background:
      rgba(18,20,27,.97);

    border:
      1px solid #806748;

    box-shadow:
      0 20px 80px
      rgba(0,0,0,.65);

    text-align:center;

  }


  .story-small{

    color:#b69a70;

    font-size:13px;

    letter-spacing:.25em;

    margin-bottom:10px;

  }


  .story-main-title{

    color:#f3e5ca;

    font-size:38px;

    margin:0;

    letter-spacing:.08em;

  }


  .story-subtitle{

    color:#aaa39a;

    margin:
      10px 0 36px;

  }


  .story-mode-buttons{

    display:grid;

    grid-template-columns:
      1fr 1fr;

    gap:16px;

  }


  .story-mode-button{

    cursor:pointer;

    border:
      1px solid #675842;

    background:#25262c;

    color:#eee5d5;

    padding:
      22px 18px;

    min-height:112px;

    transition:.15s;

  }


  .story-mode-button:hover{

    transform:
      translateY(-2px);

    border-color:#c5a46d;

    background:#303038;

  }


  .story-mode-button strong{

    display:block;

    font-size:20px;

    margin-bottom:9px;

  }


  .story-mode-button span{

    color:#aaa39a;

    font-size:13px;

    line-height:1.7;

  }


  #storyObjective{

    position:fixed;

    left:18px;

    top:100px;

    z-index:600;

    width:280px;

    box-sizing:border-box;

    padding:14px 16px;

    background:
      rgba(15,18,24,.92);

    border-left:
      3px solid #c69d5e;

    box-shadow:
      0 8px 24px
      rgba(0,0,0,.25);

    color:#e9e2d5;

    pointer-events:none;

  }


  #storyObjective.hidden{
    display:none;
  }


  #storyObjective .chapter{

    color:#c6a66d;

    font-size:11px;

    letter-spacing:.14em;

    margin-bottom:5px;

  }


  #storyObjective .objective{

    font-size:14px;

    line-height:1.65;

  }


  #storyChoices{

    position:fixed;

    left:50%;

    bottom:170px;

    transform:
      translateX(-50%);

    z-index:9500;

    width:min(
      620px,
      calc(100vw - 40px)
    );

    padding:12px;

    box-sizing:border-box;

    background:
      rgba(13,15,21,.98);

    border:
      1px solid #806748;

    box-shadow:
      0 18px 60px
      rgba(0,0,0,.55);

  }


  #storyChoices.hidden{
    display:none;
  }


  .story-choice{

    display:block;

    width:100%;

    text-align:left;

    cursor:pointer;

    margin:5px 0;

    padding:
      13px 15px;

    color:#eee6d8;

    background:#24262d;

    border:
      1px solid #44434a;

    font-size:14px;

  }


  .story-choice:hover{

    background:#393128;

    border-color:#bd9b65;

  }


  .story-choice-cn{

    display:block;

    color:#e5c17e;

    font-size:16px;

    margin-top:4px;

  }


  #storyChapterCard{

    position:fixed;

    inset:0;

    z-index:9200;

    display:flex;

    align-items:center;

    justify-content:center;

    pointer-events:none;

    background:
      rgba(5,7,10,.78);

    opacity:0;

    transition:
      opacity .45s;

  }


  #storyChapterCard.show{
    opacity:1;
  }


  #storyChapterCard .inner{

    text-align:center;

    color:white;

  }


  #storyChapterCard .number{

    color:#c6a66d;

    letter-spacing:.25em;

    font-size:13px;

  }


  #storyChapterCard .title{

    margin-top:8px;

    font-size:34px;

    letter-spacing:.12em;

  }


  #storyChapterEnd{

    position:fixed;

    inset:0;

    z-index:9800;

    display:flex;

    align-items:center;

    justify-content:center;

    pointer-events:none;

    opacity:0;

    background:
      rgba(5,7,10,.82);

    transition:
      opacity .7s;

  }


  #storyChapterEnd.show{
    opacity:1;
  }


  #storyChapterEnd .inner{

    text-align:center;

    color:#eee6d8;

  }


  #storyChapterEnd .small{

    color:#b99a68;

    font-size:12px;

    letter-spacing:.28em;

  }


  #storyChapterEnd .big{

    font-size:34px;

    margin-top:10px;

    letter-spacing:.18em;

  }


  #storyChapterEnd .next{

    color:#aaa39a;

    font-size:13px;

    margin-top:18px;

  }


  @media(max-width:700px){

    .story-mode-buttons{
      grid-template-columns:1fr;
    }


    #storyObjective{
      width:220px;
    }

  }

  `;


  document.head.appendChild(
    style
  );

}


// ==========================================================
// DOM
// ==========================================================

function storyCreateDOM(){

  const mode =
    document.createElement(
      "div"
    );


  mode.id =
    "storyModeScreen";


  mode.innerHTML = `

    <div class="story-title-panel">

      <div class="story-small">
        HANGZHOU EXPLORER
      </div>

      <h1 class="story-main-title">
        杭州探索録
      </h1>

      <div class="story-subtitle">
        武林夜市
      </div>

      <div class="story-mode-buttons">

        <button
          id="exploreModeButton"
          class="story-mode-button"
        >

          <strong>
            探索モード
          </strong>

          <span>
            自由に杭州を歩き、
            街の中国語を集める
          </span>

        </button>


        <button
          id="storyModeButton"
          class="story-mode-button"
        >

          <strong>
            ストーリーモード
          </strong>

          <span>
            武林の夜を歩き、
            人々との出会いを体験する
          </span>

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    mode
  );


  const objective =
    document.createElement(
      "div"
    );


  objective.id =
    "storyObjective";

  objective.className =
    "hidden";


  objective.innerHTML = `

    <div class="chapter">
      第一章　武林の夜
    </div>

    <div
      class="objective"
      id="storyObjectiveText"
    ></div>

  `;


  document.body.appendChild(
    objective
  );


  const choices =
    document.createElement(
      "div"
    );


  choices.id =
    "storyChoices";

  choices.className =
    "hidden";


  document.body.appendChild(
    choices
  );


  const card =
    document.createElement(
      "div"
    );


  card.id =
    "storyChapterCard";


  card.innerHTML = `

    <div class="inner">

      <div class="number">
        CHAPTER 1
      </div>

      <div class="title">
        武林の夜
      </div>

    </div>

  `;


  document.body.appendChild(
    card
  );


  const end =
    document.createElement(
      "div"
    );


  end.id =
    "storyChapterEnd";


  end.innerHTML = `

    <div class="inner">

      <div class="small">
        CHAPTER 1
      </div>

      <div class="big">
        第一章　完
      </div>

      <div class="next">
        ―― 武林の夜は、まだ続いている。
      </div>

    </div>

  `;


  document.body.appendChild(
    end
  );

}


// ==========================================================
// UTILITY
// ==========================================================

function setStoryObjective(text){

  const el =
    document.getElementById(
      "storyObjectiveText"
    );


  if(el){

    el.textContent =
      text;

  }

}


function showChapterCard(){

  const card =
    document.getElementById(
      "storyChapterCard"
    );


  card.classList.add(
    "show"
  );


  setTimeout(
    ()=>{

      card.classList.remove(
        "show"
      );

    },
    1200
  );

}


// ==========================================================
// MODE SELECT
// ==========================================================

function startExploreMode(){

  STORY.mode =
    "explore";


  STORY.started =
    false;


  STORY.movingNPC =
    null;


  hideAllStoryNPCs();


  document
    .getElementById(
      "storyModeScreen"
    )
    .classList.add(
      "hidden"
    );


  document
    .getElementById(
      "storyObjective"
    )
    .classList.add(
      "hidden"
    );

}


function startStoryMode(){

  STORY.mode =
    "story";


  STORY.started =
    true;


  STORY.chapter =
    1;


  STORY.step =
    0;


  STORY.flags =
    {};


  STORY.chapterComplete =
    false;


  STORY.movingNPC =
    null;


  document
    .getElementById(
      "storyModeScreen"
    )
    .classList.add(
      "hidden"
    );


  document
    .getElementById(
      "storyObjective"
    )
    .classList.remove(
      "hidden"
    );


  currentMapId =
    "food";


  player.x =
    MAPS.food.spawn.x*TILE;


  player.y =
    MAPS.food.spawn.y*TILE;


  player.direction =
    "up";


  camera.x =
    player.x -
    canvas.width/2;


  camera.y =
    player.y -
    canvas.height/2;


  clampCamera();


  /*
    NPCを初期位置へ戻す。
  */

  resetStoryNPCs();


  saveStory();


  showChapterCard();


  setTimeout(
    storyOpening,
    1400
  );

}


// ==========================================================
// RESET STORY NPC
// ==========================================================

function resetStoryNPCs(){

  STORY_NPCS.xiaoyu.x =
    24*TILE;


  STORY_NPCS.xiaoyu.y =
    16*TILE;


  STORY_NPCS.xiaoyu.direction =
    "down";


  STORY_NPCS.xiaoyu.marker =
    true;


  STORY_NPCS.xiaoyu.storyInteract =
    true;


  STORY_NPCS.xiaoyu.storyMoving =
    false;


  STORY_NPCS.uncleChen.x =
    17*TILE;


  STORY_NPCS.uncleChen.y =
    12*TILE;


  STORY_NPCS.uncleChen.marker =
    true;


  STORY_NPCS.uncleChen.storyInteract =
    true;


  STORY_NPCS.whiteLady.x =
    37*TILE;


  STORY_NPCS.whiteLady.y =
    19*TILE;


  hideAllStoryNPCs();

}


// ==========================================================
// NPC VISIBILITY
// ==========================================================

function hideAllStoryNPCs(){

  for(
    const npc
    of Object.values(
      STORY_NPCS
    )
  ){

    npc.visible =
      false;

  }

}


function showStoryNPC(id){

  const npc =
    STORY_NPCS[id];


  if(npc){

    npc.visible =
      true;

  }

}


function hideStoryNPC(id){

  const npc =
    STORY_NPCS[id];


  if(npc){

    npc.visible =
      false;

  }

}


// ==========================================================
// DRAW STORY NPC
// ==========================================================

const STORY_originalDrawEntities =
  drawEntities;


drawEntities =
function(time){

  STORY_originalDrawEntities(
    time
  );


  if(
    STORY.mode !==
    "story"
  ){

    return;

  }


  for(
    const npc
    of Object.values(
      STORY_NPCS
    )
  ){

    if(
      !npc.visible ||
      npc.map !== currentMapId
    ){

      continue;

    }


    const x =
      Math.floor(
        npc.x -
        camera.x
      );


    const y =
      Math.floor(
        npc.y -
        camera.y
      );


    drawPerson(

      x,
      y,

      npc,

      !!npc.storyMoving,

      time

    );


    if(
      npc.marker &&
      npc.storyInteract
    ){

      const bounce =
        Math.sin(
          time*5
        )*2;


      ctx.save();


      ctx.fillStyle =
        "#f4d06f";


      ctx.font =
        "bold 20px sans-serif";


      ctx.textAlign =
        "center";


      ctx.shadowColor =
        "rgba(0,0,0,.8)";


      ctx.shadowBlur =
        4;


      ctx.fillText(

        "!",

        x+11,

        y-9+bounce

      );


      ctx.restore();

    }

  }

};


// ==========================================================
// STORY NPC SEARCH
// ==========================================================

function getNearbyStoryNPC(){

  if(
    STORY.mode !==
    "story"
  ){

    return null;

  }


  const px =
    player.x +
    player.width/2;


  const py =
    player.y +
    player.height/2;


  let nearest =
    null;


  let best =
    62;


  for(
    const npc
    of Object.values(
      STORY_NPCS
    )
  ){

    if(
      !npc.visible ||
      !npc.storyInteract ||
      npc.map !== currentMapId
    ){

      continue;

    }


    const d =
      Math.hypot(

        npc.x+11-px,

        npc.y+14-py

      );


    if(d<best){

      best =
        d;

      nearest =
        npc;

    }

  }


  return nearest;

}


// ==========================================================
// PATCH INTERACT
// ==========================================================

const STORY_originalInteract =
  interact;


interact =
function(){

  if(
    STORY.mode ===
    "story"
  ){

    const storyNPC =
      getNearbyStoryNPC();


    if(storyNPC){

      interactStoryNPC(
        storyNPC
      );


      return;

    }

  }


  STORY_originalInteract();

};


// ==========================================================
// PATCH INTERACTION HINT
// ==========================================================

const STORY_originalUpdateInteractionHint =
  updateInteractionHint;


updateInteractionHint =
function(){

  if(
    STORY.mode ===
      "story" &&

    !dialogue.active &&

    !STORY.choiceOpen
  ){

    const npc =
      getNearbyStoryNPC();


    if(npc){

      interactionText.textContent =
        `${npc.name}に話す`;


      interactionHint
        .classList
        .remove(
          "hidden"
        );


      return;

    }

  }


  STORY_originalUpdateInteractionHint();

};


// ==========================================================
// STORY NPC INTERACTION
// ==========================================================

function interactStoryNPC(npc){

  if(
    npc.id ===
    "xiaoyu"
  ){

    if(
      STORY.step ===
      1
    ){

      beginXiaoyuMeeting();

      return;

    }

  }


  if(
    npc.id ===
      "uncleChen" &&

    STORY.step ===
      4
  ){

    beginChenScene();

    return;

  }

}


// ==========================================================
// DIALOGUE SEQUENCE
// ==========================================================

function storyDialogueSequence(
  sequence,
  onEnd=null
){

  if(
    !sequence ||
    sequence.length === 0
  ){

    if(onEnd){
      onEnd();
    }


    return;

  }


  STORY.sequence =
    sequence;


  STORY.sequenceIndex =
    0;


  const first =
    sequence[0];


  const npc = {

    name:
      first.speaker,

    portrait:
      first.portrait ||
      "student",

    expression:
      first.expression ||
      "normal",

    dialogue:[
      first.text
    ],

    rewards:[],

    storySequence:
      true,

    storyOnEnd:
      onEnd

  };


  dialogue.active =
    true;


  dialogue.npc =
    npc;


  dialogue.index =
    0;


  renderStoryDialogueLine(
    first
  );


  dialogueBox
    .classList
    .remove(
      "hidden"
    );

}


function renderStoryDialogueLine(
  line
){

  speakerName.textContent =
    line.speaker || "";


  dialogueText.textContent =
    line.text || "";


  showNPCPortrait(

    line.portrait ||
    "student",

    line.expression ||
    "normal"

  );

}


// ==========================================================
// PATCH ADVANCE DIALOGUE
// ==========================================================

const STORY_originalAdvanceDialogue =
  advanceDialogue;


advanceDialogue =
function(){

  if(
    !dialogue.active ||
    !dialogue.npc ||
    !dialogue.npc.storySequence
  ){

    STORY_originalAdvanceDialogue();

    return;

  }


  STORY.sequenceIndex++;


  if(
    STORY.sequenceIndex >=
    STORY.sequence.length
  ){

    const callback =
      dialogue.npc.storyOnEnd;


    closeDialogue();


    STORY.sequence =
      null;


    STORY.sequenceIndex =
      0;


    if(callback){

      callback();

    }


    return;

  }


  renderStoryDialogueLine(

    STORY.sequence[
      STORY.sequenceIndex
    ]

  );

};


// ==========================================================
// CHOICES
// ==========================================================

function storyChoice(choices){

  STORY.choiceOpen =
    true;


  const holder =
    document.getElementById(
      "storyChoices"
    );


  holder.innerHTML =
    "";


  for(
    const choice
    of choices
  ){

    const button =
      document.createElement(
        "button"
      );


    button.className =
      "story-choice";


    button.innerHTML = `

      ${choice.jp}

      <span class="story-choice-cn">
        ${choice.cn}
      </span>

    `;


    button.addEventListener(
      "click",
      ()=>{

        STORY.choiceOpen =
          false;


        holder
          .classList
          .add(
            "hidden"
          );


        if(
          choice.action
        ){

          choice.action();

        }

      }
    );


    holder.appendChild(
      button
    );

  }


  holder
    .classList
    .remove(
      "hidden"
    );

}


// ==========================================================
// OPENING
// ==========================================================

function storyOpening(){

  setStoryObjective(
    "武林夜市を歩いてみよう"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"杭州に来て最初の夜。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"宿舎にいても眠れず、あなたは一人で武林の街へ出てきた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"提灯の下には大勢の人が行き交い、屋台からは湯気と香辛料の匂いが漂っている。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"せっかく杭州まで来たのだ。少し歩いてみよう。"
      }

    ],

    ()=>{

      STORY.step =
        1;


      showStoryNPC(
        "xiaoyu"
      );


      setStoryObjective(
        "「！」のついた女の子に話しかけよう"
      );


      saveStory();

    }

  );

}


// ==========================================================
// XIAOYU FIRST MEETING
// ==========================================================

function beginXiaoyuMeeting(){

  STORY_NPCS
    .xiaoyu
    .marker =
      false;


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你好。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你是不是第一次来杭州？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"看你好像一直在找什么。"
      }

    ],

    ()=>{

      storyChoice([


        // ----------------------------------------------
        // 留学
        // ----------------------------------------------

        {

          jp:
            "留学に来ました",

          cn:
            "我来杭州留学。",


          action(){

            STORY.flags.reason =
              "study";


            storyDialogueSequence(

              [

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"surprised",
                  text:"原来是留学生啊！"
                },

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"smile",
                  text:"那你以后应该会经常来武林。"
                },

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"smile",
                  text:"我叫林小雨。杭州人。"
                }

              ],

              finishXiaoyuIntroduction

            );

          }

        },


        // ----------------------------------------------
        // 旅行
        // ----------------------------------------------

        {

          jp:
            "旅行で来ました",

          cn:
            "我是来杭州旅游的。",


          action(){

            STORY.flags.reason =
              "travel";


            storyDialogueSequence(

              [

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"smile",
                  text:"来杭州旅游啊！"
                },

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"normal",
                  text:"那可不能只去西湖。"
                },

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"smile",
                  text:"我叫林小雨。这里我很熟。"
                }

              ],

              finishXiaoyuIntroduction

            );

          }

        },


        // ----------------------------------------------
        // 散歩
        // ----------------------------------------------

        {

          jp:
            "ちょっと散歩しています",

          cn:
            "我只是随便逛逛。",


          action(){

            STORY.flags.reason =
              "walk";


            storyDialogueSequence(

              [

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"smile",
                  text:"随便逛逛也挺好的。"
                },

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"normal",
                  text:"有时候这样反而能看到真正的杭州。"
                },

                {
                  speaker:"林小雨",
                  portrait:"xiaoyu",
                  expression:"smile",
                  text:"我叫林小雨。走，我带你看看。"
                }

              ],

              finishXiaoyuIntroduction

            );

          }

        }

      ]);

    }

  );

}


// ==========================================================
// AFTER INTRODUCTION
// ==========================================================

function finishXiaoyuIntroduction(){

  STORY.step =
    2;


  saveStory();


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你吃晚饭了吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"前面有个烧烤摊，我经常去。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"老板姓陈，大家都叫他陈叔。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"走吧。"
      }

    ],

    startXiaoyuWalk

  );

}


// ==========================================================
// XIAOYU WALK
// ==========================================================

function startXiaoyuWalk(){

  STORY.step =
    3;


  setStoryObjective(
    "小雨についていこう"
  );


  /*
  ========================================================
   Ver.2.1

   1地点への直進を廃止。

   waypointを

   24,16
      ↓
   23,17
      ↓
   21,17
      ↓
   20,16
      ↓
   19,15

   と順番に通過する。

   これにより夜市を歩いて
   屋台へ向かうように見せる。
  ========================================================
  */


  STORY.movingNPC = {

    npc:
      STORY_NPCS.xiaoyu,


    waypoints:[

      {
        x:24*TILE,
        y:17*TILE
      },

      {
        x:22*TILE,
        y:17*TILE
      },

      {
        x:20*TILE,
        y:17*TILE
      },

      {
        x:20*TILE,
        y:15*TILE
      },

      {
        x:19*TILE,
        y:15*TILE
      }

    ],


    waypointIndex:
      0,


    speed:
      46,


    /*
      6px以内なら
      waypoint到着とみなす。
    */

    tolerance:
      6,


    onArrive:
      onXiaoyuArrivedAtStall

  };


  STORY_NPCS
    .xiaoyu
    .storyMoving =
      true;


  /*
    移動中は話しかけられない。
  */

  STORY_NPCS
    .xiaoyu
    .storyInteract =
      false;

}


// ==========================================================
// XIAOYU ARRIVAL
// ==========================================================

function onXiaoyuArrivedAtStall(){

  const xiaoyu =
    STORY_NPCS.xiaoyu;


  /*
    最終位置を確実に固定。
  */

  xiaoyu.x =
    19*TILE;


  xiaoyu.y =
    15*TILE;


  xiaoyu.direction =
    "left";


  xiaoyu.storyMoving =
    false;


  xiaoyu.storyInteract =
    false;


  xiaoyu.marker =
    false;


  STORY.step =
    4;


  /*
    陈叔登場。
  */

  showStoryNPC(
    "uncleChen"
  );


  STORY_NPCS
    .uncleChen
    .marker =
      true;


  STORY_NPCS
    .uncleChen
    .storyInteract =
      true;


  setStoryObjective(
    "焼烤屋台の陈叔に話しかけよう"
  );


  saveStory();


  /*
    到着時に小雨から一言。
    これでプレイヤーにも
    到着したことが明確に分かる。
  */

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"到了，就是这里。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"陈叔！"
      }

    ]

  );

}


// ==========================================================
// STORY MOVEMENT UPDATE
// ==========================================================

const STORY_originalUpdateNPCs =
  updateNPCs;


updateNPCs =
function(dt){

  STORY_originalUpdateNPCs(
    dt
  );


  updateStoryMovement(
    dt
  );

};


function updateStoryMovement(dt){

  if(
    STORY.mode !==
      "story" ||

    !STORY.movingNPC
  ){

    return;

  }


  if(
    dialogue.active ||
    STORY.choiceOpen
  ){

    return;

  }


  const movement =
    STORY.movingNPC;


  const npc =
    movement.npc;


  const waypoints =
    movement.waypoints;


  /*
    waypointが無い場合は
    安全に終了。
  */

  if(
    !waypoints ||
    waypoints.length === 0
  ){

    finishStoryMovement();

    return;

  }


  /*
    現在の目的地点。
  */

  const waypoint =
    waypoints[
      movement.waypointIndex
    ];


  /*
    全waypointを通過済みなら終了。
  */

  if(!waypoint){

    finishStoryMovement();

    return;

  }


  const dx =
    waypoint.x -
    npc.x;


  const dy =
    waypoint.y -
    npc.y;


  const distance =
    Math.hypot(
      dx,
      dy
    );


  /*
  ========================================================
   到着判定

   前回は4px未満だったため、
   微妙な座標誤差で止まる可能性があった。

   今回は6px以内で
   強制的にwaypointへスナップする。
  ========================================================
  */

  if(
    distance <=
    movement.tolerance
  ){

    npc.x =
      waypoint.x;


    npc.y =
      waypoint.y;


    movement.waypointIndex++;


    /*
      最後のwaypointだった場合。
    */

    if(
      movement.waypointIndex >=
      waypoints.length
    ){

      finishStoryMovement();

    }


    return;

  }


  /*
  ========================================================
   移動

   waypointまでは
   X/Yのうち距離が大きい方を優先。

   斜め移動させず、
   RPGらしい上下左右移動にする。
  ========================================================
  */

  const step =
    movement.speed *
    dt;


  if(
    Math.abs(dx) >=
    Math.abs(dy)
  ){

    /*
      横移動。
    */

    const moveX =
      Math.sign(dx) *
      Math.min(
        Math.abs(dx),
        step
      );


    npc.x +=
      moveX;


    npc.direction =
      dx > 0
      ? "right"
      : "left";

  }
  else{

    /*
      縦移動。
    */

    const moveY =
      Math.sign(dy) *
      Math.min(
        Math.abs(dy),
        step
      );


    npc.y +=
      moveY;


    npc.direction =
      dy > 0
      ? "down"
      : "up";

  }

}


// ==========================================================
// FINISH STORY MOVEMENT
// ==========================================================

function finishStoryMovement(){

  if(
    !STORY.movingNPC
  ){

    return;

  }


  const movement =
    STORY.movingNPC;


  const callback =
    movement.onArrive;


  movement.npc.storyMoving =
    false;


  /*
    先にnullへする。

    callbackの中で
    新しいイベントを開始しても
    旧movementが残らない。
  */

  STORY.movingNPC =
    null;


  if(callback){

    callback();

  }

}


// ==========================================================
// CHEN SCENE
// ==========================================================

function beginChenScene(){

  STORY_NPCS
    .uncleChen
    .marker =
      false;


  STORY_NPCS
    .uncleChen
    .storyInteract =
      false;


  storyDialogueSequence(

    [

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"小雨，今天还是老样子？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"不是，今天我带了一个朋友。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"surprised",
        text:"哦？外国朋友？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"嗯，刚来杭州。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"欢迎欢迎！想吃什么？"
      }

    ],

    showFoodChoice

  );

}


// ==========================================================
// ORDER
// ==========================================================

function showFoodChoice(){

  storyChoice([

    {

      jp:
        "焼き串をください",

      cn:
        "我要一份烤串。",


      action(){

        STORY.flags.order =
          "kaochuan";


        storyDialogueSequence(

          [

            {
              speaker:"陈叔",
              portrait:"uncleChen",
              expression:"smile",
              text:"好嘞！一份烤串。"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"不错嘛，说得很自然。"
            }

          ],

          finishFoodScene

        );

      }

    },


    {

      jp:
        "おすすめは何ですか？",

      cn:
        "有什么推荐的吗？",


      action(){

        STORY.flags.order =
          "recommend";


        storyDialogueSequence(

          [

            {
              speaker:"陈叔",
              portrait:"uncleChen",
              expression:"smile",
              text:"第一次来？那就尝尝烤串吧。"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"陈叔的烤串真的不错。"
            },

            {
              speaker:"陈叔",
              portrait:"uncleChen",
              expression:"smile",
              text:"哈哈，小雨每次都这么说。"
            }

          ],

          finishFoodScene

        );

      }

    },


    {

      jp:
        "辛くしないでください",

      cn:
        "不要辣，谢谢。",


      action(){

        STORY.flags.order =
          "notSpicy";


        storyDialogueSequence(

          [

            {
              speaker:"陈叔",
              portrait:"uncleChen",
              expression:"normal",
              text:"没问题，不放辣。"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"你还挺会点菜的嘛。"
            }

          ],

          finishFoodScene

        );

      }

    }

  ]);

}


// ==========================================================
// AFTER FOOD
// ==========================================================

function finishFoodScene(){

  STORY.step =
    5;


  saveStory();


  setStoryObjective(
    "小雨と夜市を楽しもう"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"焼けた肉の香りが、夜の通りに広がっていく。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"怎么样？好吃吧？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我小时候就经常来这一带。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"杭州不只有西湖。像这样的地方，也是杭州。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"周囲では店主の声、笑い声、食器の音が絶えず聞こえている。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"以后想逛杭州的话，可以找我。"
      }

    ],

    beginWhiteLadyScene

  );

}


// ==========================================================
// WHITE LADY SCENE
// ==========================================================

function beginWhiteLadyScene(){

  STORY.step =
    6;


  setStoryObjective(
    "……"
  );


  showStoryNPC(
    "whiteLady"
  );


  setTimeout(

    ()=>{

      storyDialogueSequence(

        [

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"そのとき、人混みの向こうに一人の女性が見えた。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"白い服を着たその女性は、一人で屋台を眺めている。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"何か珍しいものでも見るように、楽しそうに。"
          }

        ],

        whiteLadyMoment

      );

    },

    700

  );

}


// ==========================================================
// WHITE LADY MOMENT
// ==========================================================

function whiteLadyMoment(){

  storyDialogueSequence(

    [

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"smile",
        text:"……"
      }

    ],

    ()=>{

      hideStoryNPC(
        "whiteLady"
      );


      setTimeout(

        ()=>{

          storyDialogueSequence(

            [

              {
                speaker:"杭州探索録",
                portrait:"tourist",
                expression:"normal",
                text:"ほんの一瞬、目を離した。"
              },

              {
                speaker:"杭州探索録",
                portrait:"tourist",
                expression:"normal",
                text:"もう一度見ると、白い服の女性の姿はなかった。"
              },

              {
                speaker:"林小雨",
                portrait:"xiaoyu",
                expression:"normal",
                text:"怎么了？"
              }

            ],

            showFinalChoice

          );

        },

        400

      );

    }

  );

}


// ==========================================================
// FINAL CHOICE
// ==========================================================

function showFinalChoice(){

  storyChoice([

    {

      jp:
        "今、白い服の女性がいた",

      cn:
        "刚才那里有一个穿白衣服的女人。",


      action(){

        storyDialogueSequence(

          [

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"surprised",
              text:"白衣服的女人？"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"我没注意到。"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"可能已经走了吧。"
            }

          ],

          finishChapterOne

        );

      }

    },


    {

      jp:
        "……なんでもない",

      cn:
        "……没什么。",


      action(){

        storyDialogueSequence(

          [

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"真的？"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"那走吧，人越来越多了。"
            }

          ],

          finishChapterOne

        );

      }

    }

  ]);

}


// ==========================================================
// CHAPTER END
// ==========================================================

function finishChapterOne(){

  STORY.step =
    7;


  STORY.chapterComplete =
    true;


  STORY.flags.chapter1 =
    true;


  saveStory();


  setStoryObjective(
    "第一章　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"武林の夜は、変わらず賑わっている。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"この夜の小さな出会いが、これから何につながっていくのか。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"このときのあなたは、まだ知る由もなかった。"
      }

    ],

    showChapterEnd

  );

}


// ==========================================================
// CHAPTER END CARD
// ==========================================================

function showChapterEnd(){

  const end =
    document.getElementById(
      "storyChapterEnd"
    );


  end.classList.add(
    "show"
  );


  setTimeout(

    ()=>{

      end.classList.remove(
        "show"
      );


      setStoryObjective(
        "第一章クリア"
      );

    },

    3000

  );

}


// ==========================================================
// INITIALIZE
// ==========================================================

function initializeStoryMode(){

  loadStory();


  storyAddStyle();


  storyCreateDOM();


  document
    .getElementById(
      "exploreModeButton"
    )
    .addEventListener(

      "click",

      startExploreMode

    );


  document
    .getElementById(
      "storyModeButton"
    )
    .addEventListener(

      "click",

      startStoryMode

    );

}


initializeStoryMode();


console.log(
  "杭州探索録 Story Mode Ver.2.1 / Chapter 1 loaded"
);
