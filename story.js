"use strict";

/*
==========================================================
 杭州探索録
 STORY MODE Ver.2.2

 第一章「武林の夜」

 ★ Ver.2.2
 ・小雨の自動経路移動を完全廃止
 ・主人公の移動履歴を利用した同行システム
 ・小雨が主人公の後ろをついてくる
 ・主人公が屋台エリアへ入ると自動イベント
 ・屋台到着時に小雨を所定位置へ配置
 ・motion.js のNPC移動処理に依存しない
 ・将来、白姑娘を2人目の同行者として追加可能

 portraits.js Ver.1 と併用
==========================================================
*/


// ==========================================================
// SAVE
// ==========================================================

const STORY_SAVE_KEY =
  "hangzhouStorySaveV22";


const STORY = {

  mode:null,

  chapter:1,

  step:0,

  started:false,

  choiceOpen:false,

  flags:{},

  sequence:null,

  sequenceIndex:0,

  chapterComplete:false,

  // 同行状態
  partyActive:false,

  // 主人公の過去位置
  playerTrail:[],

  // 屋台イベント発火済みか
  stallTriggered:false

};


// ==========================================================
// SAVE / LOAD
// ==========================================================

function saveStory(){

  try{

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
  catch(error){

    console.warn(
      "Story save failed",
      error
    );

  }

}


function loadStory(){

  try{

    const raw =
      localStorage.getItem(
        STORY_SAVE_KEY
      );


    if(!raw){
      return;
    }


    const data =
      JSON.parse(raw);


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

    x:17*TILE,
    y:12*TILE,

    color:"#765746",

    skin:"#d9a67d",

    hair:"#292727",

    direction:"right",

    portrait:"uncleChen",

    visible:false,

    marker:false,

    storyInteract:false,

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

    color:"#ece9e3",

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
  typeof PORTRAITS !== "undefined"
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

      padding:44px 48px;

      box-sizing:border-box;

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

      padding:22px 18px;

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

      width:290px;

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

      padding:13px 15px;

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
        rgba(5,7,10,.84);

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


    /*
    ========================================================
     同行中表示
    ========================================================
    */

    #storyPartyStatus{

      position:fixed;

      right:18px;

      bottom:18px;

      z-index:500;

      padding:9px 13px;

      background:
        rgba(15,18,24,.85);

      border:
        1px solid rgba(198,166,109,.4);

      color:#ddd5c7;

      font-size:12px;

      pointer-events:none;

      opacity:0;

      transition:opacity .25s;

    }


    #storyPartyStatus.show{
      opacity:1;
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


  const party =
    document.createElement(
      "div"
    );


  party.id =
    "storyPartyStatus";


  party.textContent =
    "同行中：林小雨";


  document.body.appendChild(
    party
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


function showPartyStatus(){

  const el =
    document.getElementById(
      "storyPartyStatus"
    );


  if(el){

    el.classList.add(
      "show"
    );

  }

}


function hidePartyStatus(){

  const el =
    document.getElementById(
      "storyPartyStatus"
    );


  if(el){

    el.classList.remove(
      "show"
    );

  }

}


// ==========================================================
// MODE
// ==========================================================

function startExploreMode(){

  STORY.mode =
    "explore";


  STORY.started =
    false;


  STORY.partyActive =
    false;


  STORY.playerTrail =
    [];


  hidePartyStatus();


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


  STORY.partyActive =
    false;


  STORY.playerTrail =
    [];


  STORY.stallTriggered =
    false;


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


  hidePartyStatus();


  currentMapId =
    "food";


  player.x =
    MAPS.food.spawn.x*TILE;


  player.y =
    MAPS.food.spawn.y*TILE;


  player.direction =
    "up";


  player.moving =
    false;


  camera.x =
    player.x -
    canvas.width/2;


  camera.y =
    player.y -
    canvas.height/2;


  clampCamera();


  resetStoryNPCs();


  saveStory();


  showChapterCard();


  setTimeout(
    storyOpening,
    1400
  );

}


// ==========================================================
// NPC RESET
// ==========================================================

function resetStoryNPCs(){

  const xiaoyu =
    STORY_NPCS.xiaoyu;


  xiaoyu.x =
    24*TILE;


  xiaoyu.y =
    16*TILE;


  xiaoyu.direction =
    "down";


  xiaoyu.visible =
    false;


  xiaoyu.marker =
    true;


  xiaoyu.storyInteract =
    true;


  xiaoyu.storyMoving =
    false;


  const chen =
    STORY_NPCS.uncleChen;


  chen.x =
    17*TILE;


  chen.y =
    12*TILE;


  chen.direction =
    "right";


  chen.visible =
    false;


  chen.marker =
    false;


  chen.storyInteract =
    false;


  const lady =
    STORY_NPCS.whiteLady;


  lady.x =
    37*TILE;


  lady.y =
    19*TILE;


  lady.direction =
    "left";


  lady.visible =
    false;


  lady.marker =
    false;


  lady.storyInteract =
    false;

}


// ==========================================================
// VISIBILITY
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
// DRAW STORY NPCS
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
        camera.x +
        5
      );


    const y =
      Math.floor(
        npc.y -
        camera.y +
        3
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
// NEAR STORY NPC
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


    const distance =
      Math.hypot(

        npc.x+11-px,

        npc.y+14-py

      );


    if(
      distance <
      best
    ){

      best =
        distance;


      nearest =
        npc;

    }

  }


  return nearest;

}


// ==========================================================
// INTERACTION PATCH
// ==========================================================

const STORY_originalInteract =
  interact;


interact =
function(){

  if(
    STORY.mode ===
    "story"
  ){

    const npc =
      getNearbyStoryNPC();


    if(npc){

      interactStoryNPC(
        npc
      );


      return;

    }

  }


  STORY_originalInteract();

};


// ==========================================================
// HINT PATCH
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
      "xiaoyu" &&

    STORY.step ===
      1
  ){

    beginXiaoyuMeeting();

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


function renderStoryDialogueLine(line){

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
// ADVANCE DIALOGUE PATCH
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
// CHOICE
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
// XIAOYU MEETING
// ==========================================================

function beginXiaoyuMeeting(){

  STORY_NPCS.xiaoyu.marker =
    false;


  STORY_NPCS.xiaoyu.storyInteract =
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

    showXiaoyuChoice

  );

}


// ==========================================================
// FIRST CHOICE
// ==========================================================

function showXiaoyuChoice(){

  storyChoice([

    {

      jp:"留学に来ました",

      cn:"我来杭州留学。",

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


    {

      jp:"旅行で来ました",

      cn:"我是来杭州旅游的。",

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


    {

      jp:"ちょっと散歩しています",

      cn:"我只是随便逛逛。",

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


// ==========================================================
// START PARTY
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
        text:"走吧，我们一起过去。"
      }

    ],

    startXiaoyuParty

  );

}


// ==========================================================
// PARTY SYSTEM
// ==========================================================

function startXiaoyuParty(){

  STORY.step =
    3;


  STORY.partyActive =
    true;


  STORY.playerTrail =
    [];


  /*
    小雨を主人公の少し後ろへ配置。

    ここから小雨自身が
    「目的地へ歩く」のではなく、

    主人公が実際に通った場所を
    後から再生する。
  */

  STORY_NPCS.xiaoyu.x =
    player.x;


  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;


  STORY_NPCS.xiaoyu.direction =
    player.direction;


  STORY_NPCS.xiaoyu.visible =
    true;


  STORY_NPCS.xiaoyu.marker =
    false;


  STORY_NPCS.xiaoyu.storyInteract =
    false;


  STORY_NPCS.xiaoyu.storyMoving =
    false;


  showPartyStatus();


  setStoryObjective(
    "小雨と一緒に焼烤屋台へ行こう"
  );


  saveStory();

}


// ==========================================================
// PLAYER TRAIL
// ==========================================================

/*
==========================================================
 同行システム

 小雨にAIで道を探させない。

 主人公の過去座標を保存して、
 少し前の主人公の位置を
 小雨がそのまま通る。

 これなら障害物に引っ掛からない。
==========================================================
*/

function updateStoryParty(){

  if(
    STORY.mode !== "story" ||
    !STORY.partyActive ||
    currentMapId !== "food"
  ){

    return;

  }


  const xiaoyu =
    STORY_NPCS.xiaoyu;


  /*
    主人公が実際に移動したときだけ
    履歴を追加。
  */

  const last =
    STORY.playerTrail[
      STORY.playerTrail.length-1
    ];


  const movedEnough =
    !last ||

    Math.hypot(
      player.x-last.x,
      player.y-last.y
    ) > 3;


  if(movedEnough){

    STORY.playerTrail.push({

      x:player.x,

      y:player.y,

      direction:
        player.direction

    });

  }


  /*
    履歴が増えすぎないようにする。
  */

  if(
    STORY.playerTrail.length >
    100
  ){

    STORY.playerTrail.shift();

  }


  /*
    12履歴分ほど後ろを歩く。

    もっと距離を離したければ
    12 → 16 などに変更可能。
  */

  const delay =
    12;


  if(
    STORY.playerTrail.length <=
    delay
  ){

    xiaoyu.storyMoving =
      false;


    return;

  }


  const target =
    STORY.playerTrail[
      STORY.playerTrail.length -
      delay
    ];


  const oldX =
    xiaoyu.x;


  const oldY =
    xiaoyu.y;


  /*
    目的地点へ直接スナップ。

    これは「テレポート」ではなく、
    主人公の履歴が数px刻みなので
    見た目では普通に歩いて見える。
  */

  xiaoyu.x =
    target.x;


  xiaoyu.y =
    target.y;


  xiaoyu.direction =
    target.direction;


  xiaoyu.storyMoving =

    Math.hypot(
      xiaoyu.x-oldX,
      xiaoyu.y-oldY
    ) > 1;


  /*
    古すぎる履歴は捨てる。
  */

  if(
    STORY.playerTrail.length >
    delay+25
  ){

    STORY.playerTrail.shift();

  }

}


// ==========================================================
// STORY EVENT UPDATE
// ==========================================================

function updateStoryEvents(){

  if(
    STORY.mode !== "story"
  ){

    return;

  }


  updateStoryParty();


  /*
    STEP 3

    小雨同行中。

    焼烤屋台周辺に主人公が
    入ったらイベントを開始する。

    「小雨が目的地に到着したか」は
    一切判定しない。

    主人公だけを見る。
  */

  if(
    STORY.step === 3 &&
    STORY.partyActive &&
    !STORY.stallTriggered &&
    currentMapId === "food" &&
    !dialogue.active &&
    !STORY.choiceOpen
  ){

    checkStallArrival();

  }

}


// ==========================================================
// STALL ARRIVAL
// ==========================================================

function checkStallArrival(){

  /*
    焼烤屋台はマップ上の
    x=13, y=10付近。

    プレイヤーが屋台そのものに
    ぶつかる必要はなく、

    前の通路に来れば発火する。

    広めのエリアにして
    「ピンポイント判定」を避ける。
  */

  const px =
    player.x /
    TILE;


  const py =
    player.y /
    TILE;


  const inside =

    px >= 13 &&
    px <= 21 &&

    py >= 12 &&
    py <= 18;


  if(!inside){

    return;

  }


  STORY.stallTriggered =
    true;


  beginStallArrival();

}


// ==========================================================
// ARRIVE AT STALL
// ==========================================================

function beginStallArrival(){

  STORY.partyActive =
    false;


  STORY.playerTrail =
    [];


  hidePartyStatus();


  STORY.step =
    4;


  /*
    ここが今回のポイント。

    到着したら小雨を
    必ず屋台前へ配置する。

    小雨自身の移動成功を
    待つ必要がない。
  */

  STORY_NPCS.xiaoyu.x =
    19*TILE;


  STORY_NPCS.xiaoyu.y =
    15*TILE;


  STORY_NPCS.xiaoyu.direction =
    "left";


  STORY_NPCS.xiaoyu.storyMoving =
    false;


  STORY_NPCS.xiaoyu.visible =
    true;


  showStoryNPC(
    "uncleChen"
  );


  STORY_NPCS.uncleChen.marker =
    false;


  STORY_NPCS.uncleChen.storyInteract =
    false;


  setStoryObjective(
    "陈叔の焼烤屋台"
  );


  saveStory();


  /*
    Eを押させず、
    到着した瞬間にイベント開始。
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
      },

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
// HOOK INTO EXISTING GAME LOOP
// ==========================================================

/*
  game.jsでは毎フレーム

  updatePlayer()
  updateNPCs()
  updateCamera()
  ...

  と実行される。

  updateNPCsそのものを書き換えず、
  元の処理が終わったあとだけ
  story処理を追加する。
*/

const STORY_baseUpdateNPCs =
  updateNPCs;


updateNPCs =
function(dt){

  STORY_baseUpdateNPCs(
    dt
  );


  updateStoryEvents();

};


// ==========================================================
// FOOD CHOICE
// ==========================================================

function showFoodChoice(){

  storyChoice([

    {

      jp:"焼き串をください",

      cn:"我要一份烤串。",

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

      jp:"おすすめは何ですか？",

      cn:"有什么推荐的吗？",

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

      jp:"辛くしないでください",

      cn:"不要辣，谢谢。",

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
// WHITE LADY
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
            text:"そのとき、人混みの向こうに、一人の女性が見えた。"
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
            text:"まるで初めて夜市を見るように、楽しそうに。"
          }

        ],

        whiteLadyMoment

      );

    },

    650

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


  STORY.partyActive =
    false;


  hidePartyStatus();


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
// END CARD
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
  "杭州探索録 Story Mode Ver.2.2 / Party System loaded"
);
