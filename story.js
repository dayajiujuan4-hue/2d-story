"use strict";

/*
==========================================================
 杭州探索録
 STORY MODE Ver.3

 第一章「武林の夜」
 第二章「白衣の女」

 ★ Ver.3
 ・Ver.2.2の主人公追跡型同行システムを継承
 ・第一章終了後、そのまま第二章へ進行可能
 ・第二章前半は怪談・ホラー寄り
 ・白衣の女を複数回目撃
 ・最初は主人公にしか見えない
 ・後半で小雨も白衣の女を目撃
 ・「这个，怎么吃？」で緊張を反転
 ・白姑娘との正式な出会い
 ・スマホ決済イベント
 ・三人同行システム
==========================================================
*/


// ==========================================================
// SAVE
// ==========================================================

const STORY_SAVE_KEY = "hangzhouStorySaveV3";


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

  partyActive:false,

  // "xiaoyu" / "trio"
  partyType:null,

  playerTrail:[],

  stallTriggered:false,

  chapter2EventTriggered:false,

  whiteEncounterTriggered:false,

  trioStarted:false

};


// ==========================================================
// SAVE / LOAD
// ==========================================================

function saveStory(){

  try{

    localStorage.setItem(
      STORY_SAVE_KEY,
      JSON.stringify({
        chapter:STORY.chapter,
        step:STORY.step,
        flags:STORY.flags,
        chapterComplete:STORY.chapterComplete
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
    document.createElement("style");

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

      margin:10px 0 36px;

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

      transition:
        opacity .25s;

    }


    #storyPartyStatus.show{
      opacity:1;
    }


    /*
      第二章の不穏演出。
      画面を一瞬暗くするためのオーバーレイ。
    */

    #storyDarkness{

      position:fixed;

      inset:0;

      z-index:8500;

      pointer-events:none;

      opacity:0;

      background:
        rgba(0,5,12,.48);

      transition:
        opacity .7s;

    }


    #storyDarkness.show{
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


  document.head.appendChild(style);

}


// ==========================================================
// DOM
// ==========================================================

function storyCreateDOM(){

  const mode =
    document.createElement("div");

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

  document.body.appendChild(mode);


  const objective =
    document.createElement("div");

  objective.id =
    "storyObjective";

  objective.className =
    "hidden";

  objective.innerHTML = `

    <div
      class="chapter"
      id="storyChapterLabel"
    >
      第一章　武林の夜
    </div>

    <div
      class="objective"
      id="storyObjectiveText"
    ></div>

  `;

  document.body.appendChild(objective);


  const choices =
    document.createElement("div");

  choices.id =
    "storyChoices";

  choices.className =
    "hidden";

  document.body.appendChild(choices);


  const card =
    document.createElement("div");

  card.id =
    "storyChapterCard";

  card.innerHTML = `

    <div class="inner">

      <div
        class="number"
        id="storyCardNumber"
      >
        CHAPTER 1
      </div>

      <div
        class="title"
        id="storyCardTitle"
      >
        武林の夜
      </div>

    </div>

  `;

  document.body.appendChild(card);


  const end =
    document.createElement("div");

  end.id =
    "storyChapterEnd";

  end.innerHTML = `

    <div class="inner">

      <div
        class="small"
        id="storyEndSmall"
      >
        CHAPTER 1
      </div>

      <div
        class="big"
        id="storyEndBig"
      >
        第一章　完
      </div>

      <div
        class="next"
        id="storyEndNext"
      >
        ―― 武林の夜は、まだ続いている。
      </div>

    </div>

  `;

  document.body.appendChild(end);


  const party =
    document.createElement("div");

  party.id =
    "storyPartyStatus";

  party.textContent =
    "同行中：林小雨";

  document.body.appendChild(party);


  const darkness =
    document.createElement("div");

  darkness.id =
    "storyDarkness";

  document.body.appendChild(
    darkness
  );

}


// ==========================================================
// UI UTILITY
// ==========================================================

function setStoryObjective(text){

  const el =
    document.getElementById(
      "storyObjectiveText"
    );

  if(el){
    el.textContent = text;
  }

}


function setChapterLabel(
  chapter,
  title
){

  const el =
    document.getElementById(
      "storyChapterLabel"
    );

  if(el){

    el.textContent =
      `${chapter}　${title}`;

  }

}


function configureChapterCard(
  number,
  title
){

  const num =
    document.getElementById(
      "storyCardNumber"
    );

  const titleEl =
    document.getElementById(
      "storyCardTitle"
    );

  if(num){
    num.textContent =
      `CHAPTER ${number}`;
  }

  if(titleEl){
    titleEl.textContent =
      title;
  }

}


function configureEndCard(
  number,
  title,
  nextText
){

  const small =
    document.getElementById(
      "storyEndSmall"
    );

  const big =
    document.getElementById(
      "storyEndBig"
    );

  const next =
    document.getElementById(
      "storyEndNext"
    );

  if(small){
    small.textContent =
      `CHAPTER ${number}`;
  }

  if(big){
    big.textContent =
      title;
  }

  if(next){
    next.textContent =
      nextText;
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


function showPartyStatus(text){

  const el =
    document.getElementById(
      "storyPartyStatus"
    );

  if(el){

    if(text){
      el.textContent = text;
    }

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


function storyDarken(){

  const el =
    document.getElementById(
      "storyDarkness"
    );

  if(el){
    el.classList.add("show");
  }

}


function storyUndarken(){

  const el =
    document.getElementById(
      "storyDarkness"
    );

  if(el){
    el.classList.remove("show");
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

  STORY.partyType =
    null;

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

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];

  STORY.stallTriggered =
    false;

  STORY.chapter2EventTriggered =
    false;

  STORY.whiteEncounterTriggered =
    false;

  STORY.trioStarted =
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

  configureChapterCard(
    1,
    "武林の夜"
  );

  setChapterLabel(
    "第一章",
    "武林の夜"
  );

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

  xiaoyu.map =
    "food";

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

  chen.map =
    "food";

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

  chen.storyMoving =
    false;


  const lady =
    STORY_NPCS.whiteLady;

  lady.map =
    "food";

  lady.name =
    "？？？";

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

  lady.storyMoving =
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
    npc.visible = true;
  }

}


function hideStoryNPC(id){

  const npc =
    STORY_NPCS[id];

  if(npc){
    npc.visible = false;
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
    STORY.mode === "story" &&
    STORY.choiceOpen
  ){
    return;
  }

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
    STORY.mode === "story" &&
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
    STORY.chapter === 1 &&
    npc.id === "xiaoyu" &&
    STORY.step === 1
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
// CHAPTER 1
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
// CHAPTER 1
// XIAOYU
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
// PARTY START
// ==========================================================

function startXiaoyuParty(){

  STORY.step =
    3;

  STORY.partyActive =
    true;

  STORY.partyType =
    "xiaoyu";

  STORY.playerTrail =
    [];

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

  showPartyStatus(
    "同行中：林小雨"
  );

  setStoryObjective(
    "小雨と一緒に焼烤屋台へ行こう"
  );

  saveStory();

}


// ==========================================================
// PARTY TRAIL SYSTEM
// ==========================================================

function updateStoryParty(){

  if(
    STORY.mode !== "story" ||
    !STORY.partyActive
  ){
    return;
  }

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
        player.direction,
      map:
        currentMapId

    });

  }

  if(
    STORY.playerTrail.length >
    140
  ){
    STORY.playerTrail.shift();
  }


  // ----------------------------------------------------------
  // 小雨
  // ----------------------------------------------------------

  const xiaoyu =
    STORY_NPCS.xiaoyu;

  const xiaoyuDelay =
    12;

  if(
    STORY.playerTrail.length >
    xiaoyuDelay
  ){

    const target =
      STORY.playerTrail[
        STORY.playerTrail.length -
        xiaoyuDelay
      ];

    if(
      target.map ===
      currentMapId
    ){

      const oldX =
        xiaoyu.x;

      const oldY =
        xiaoyu.y;

      xiaoyu.map =
        currentMapId;

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

    }

  }


  // ----------------------------------------------------------
  // 白姑娘
  // 三人同行になった場合のみ
  // ----------------------------------------------------------

  if(
    STORY.partyType ===
    "trio"
  ){

    const lady =
      STORY_NPCS.whiteLady;

    const ladyDelay =
      24;

    if(
      STORY.playerTrail.length >
      ladyDelay
    ){

      const target =
        STORY.playerTrail[
          STORY.playerTrail.length -
          ladyDelay
        ];

      if(
        target.map ===
        currentMapId
      ){

        const oldX =
          lady.x;

        const oldY =
          lady.y;

        lady.map =
          currentMapId;

        lady.x =
          target.x;

        lady.y =
          target.y;

        lady.direction =
          target.direction;

        lady.storyMoving =
          Math.hypot(
            lady.x-oldX,
            lady.y-oldY
          ) > 1;

      }

    }

  }


  if(
    STORY.playerTrail.length >
    60
  ){
    STORY.playerTrail.shift();
  }

}


// ==========================================================
// STORY UPDATE
// ==========================================================

function updateStoryEvents(){

  if(
    STORY.mode !==
    "story"
  ){
    return;
  }

  updateStoryParty();


  // 第一章 焼烤到着

  if(
    STORY.chapter === 1 &&
    STORY.step === 3 &&
    STORY.partyActive &&
    !STORY.stallTriggered &&
    currentMapId === "food" &&
    !dialogue.active &&
    !STORY.choiceOpen
  ){

    checkStallArrival();

  }


  // 第二章
  // 主人公＋小雨で歩き始めてから
  // 白衣の女を再び発見

  if(
    STORY.chapter === 2 &&
    STORY.step === 3 &&
    STORY.partyActive &&
    !STORY.whiteEncounterTriggered &&
    currentMapId === "food" &&
    !dialogue.active &&
    !STORY.choiceOpen
  ){

    checkSecondWhiteEncounter();

  }

}


// ==========================================================
// FIRST CHAPTER STALL ARRIVAL
// ==========================================================

function checkStallArrival(){

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


function beginStallArrival(){

  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];

  hidePartyStatus();

  STORY.step =
    4;

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
// GAME LOOP HOOK
// ==========================================================

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
// CHAPTER 1 WHITE LADY
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


function showFinalChoice(){

  storyChoice([

    {

      jp:
        "今、白い服の女性がいた",

      cn:
        "刚才那里有一个穿白衣服的女人。",

      action(){

        STORY.flags.toldXiaoyu =
          true;

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

        STORY.flags.toldXiaoyu =
          false;

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
// CHAPTER 1 END
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

  STORY.partyType =
    null;

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

    showChapterOneEnd

  );

}


function showChapterOneEnd(){

  configureEndCard(
    1,
    "第一章　完",
    "―― 武林の夜は、まだ続いている。"
  );

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

      setTimeout(
        startChapterTwo,
        700
      );

    },

    2600

  );

}


// ==========================================================
// ==========================================================
// CHAPTER 2
// 「白衣の女」
// ==========================================================
// ==========================================================

function startChapterTwo(){

  STORY.chapter =
    2;

  STORY.step =
    0;

  STORY.chapterComplete =
    false;

  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];

  STORY.whiteEncounterTriggered =
    false;

  STORY.chapter2EventTriggered =
    false;

  STORY.trioStarted =
    false;

  hidePartyStatus();

  hideAllStoryNPCs();

  resetStoryNPCs();

  currentMapId =
    "food";

  player.x =
    26*TILE;

  player.y =
    20*TILE;

  player.direction =
    "up";

  player.moving =
    false;

  STORY_NPCS.xiaoyu.x =
    24*TILE;

  STORY_NPCS.xiaoyu.y =
    20*TILE;

  STORY_NPCS.xiaoyu.direction =
    "right";

  STORY_NPCS.xiaoyu.visible =
    true;

  STORY_NPCS.xiaoyu.marker =
    false;

  STORY_NPCS.xiaoyu.storyInteract =
    false;


  STORY_NPCS.uncleChen.x =
    17*TILE;

  STORY_NPCS.uncleChen.y =
    12*TILE;

  STORY_NPCS.uncleChen.visible =
    true;


  camera.x =
    player.x -
    canvas.width/2;

  camera.y =
    player.y -
    canvas.height/2;

  clampCamera();


  setChapterLabel(
    "第二章",
    "白衣の女"
  );

  configureChapterCard(
    2,
    "白衣の女"
  );

  saveStory();

  showChapterCard();

  setTimeout(
    chapterTwoOpening,
    1400
  );

}


// ==========================================================
// CHAPTER 2 OPENING
// ==========================================================

function chapterTwoOpening(){

  setStoryObjective(
    "小雨と再び武林夜市へ"
  );

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"翌日の夜。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"あなたは昨日と同じ武林の夜市に来ていた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"提灯も、屋台も、人混みも昨日と変わらない。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你还真的来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"看来你挺喜欢这里的嘛。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"对了……昨天你说的那个女人。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"穿白衣服的那个。"
      }

    ],

    chapterTwoWhiteTalk

  );

}


// ==========================================================
// DID PLAYER TELL XIAOYU?
// ==========================================================

function chapterTwoWhiteTalk(){

  if(
    STORY.flags.toldXiaoyu ===
    false
  ){

    storyDialogueSequence(

      [

        {
          speaker:"林小雨",
          portrait:"xiaoyu",
          expression:"normal",
          text:"昨天回去以后，我总觉得你好像看到了什么。"
        },

        {
          speaker:"林小雨",
          portrait:"xiaoyu",
          expression:"smile",
          text:"算了，可能是我想多了。"
        }

      ],

      chapterTwoChenRumor

    );

    return;

  }


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你不会真的碰到鬼了吧？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"哈哈，开玩笑的。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不过……我刚才问了陈叔。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"他说最近好像也有人见过。"
      }

    ],

    chapterTwoChenRumor

  );

}


// ==========================================================
// CHEN RUMOR
// ==========================================================

function chapterTwoChenRumor(){

  setStoryObjective(
    "陈叔から話を聞こう"
  );

  storyDialogueSequence(

    [

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"白衣服的女人？"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"……最近，好像有人也说见过。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"真的？"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"有人说她一个人站在人群里，也不买东西。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"一转眼，人就不见了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……听起来还真的有点吓人。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"laugh",
        text:"哈哈！夜市嘛，什么传闻都有。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"别自己吓自己。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"也是。走吧。"
      }

    ],

    startChapterTwoWalk

  );

}


// ==========================================================
// CHAPTER 2 WALK
// ==========================================================

function startChapterTwoWalk(){

  STORY.step =
    3;

  STORY.partyActive =
    true;

  STORY.partyType =
    "xiaoyu";

  STORY.playerTrail =
    [];

  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;

  STORY_NPCS.xiaoyu.map =
    currentMapId;

  STORY_NPCS.xiaoyu.visible =
    true;

  STORY_NPCS.uncleChen.visible =
    false;

  showPartyStatus(
    "同行中：林小雨"
  );

  setStoryObjective(
    "小雨と夜市を歩こう"
  );

  saveStory();

}


// ==========================================================
// SECOND WHITE ENCOUNTER
// ==========================================================

function checkSecondWhiteEncounter(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;

  /*
    第一章の焼烤とは反対側へ行くと発生。
    小笼包・生煎側の通路。
  */

  const inside =

    px >= 29 &&
    px <= 39 &&

    py >= 15 &&
    py <= 25;

  if(!inside){
    return;
  }

  STORY.whiteEncounterTriggered =
    true;

  beginSecondWhiteEncounter();

}


// ==========================================================
// PLAYER SEES HER AGAIN
// ==========================================================

function beginSecondWhiteEncounter(){

  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];

  hidePartyStatus();

  STORY.step =
    4;

  STORY_NPCS.xiaoyu.x =
    player.x -
    TILE;

  STORY_NPCS.xiaoyu.y =
    player.y;

  STORY_NPCS.xiaoyu.visible =
    true;

  STORY_NPCS.whiteLady.map =
    "food";

  STORY_NPCS.whiteLady.x =
    37*TILE;

  STORY_NPCS.whiteLady.y =
    19*TILE;

  STORY_NPCS.whiteLady.direction =
    "left";

  STORY_NPCS.whiteLady.visible =
    true;

  storyDarken();

  setStoryObjective(
    "……"
  );

  setTimeout(

    ()=>{

      storyDialogueSequence(

        [

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"ふと、人混みの向こうに白いものが見えた。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"昨日と同じ、白い服。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"女性は人混みの中で立ち止まり、こちらを見ている。"
          },

          {
            speaker:"？？？",
            portrait:"whiteLady",
            expression:"normal",
            text:"…………"
          }

        ],

        secondWhiteVanish

      );

    },

    500

  );

}


// ==========================================================
// VANISH AGAIN
// ==========================================================

function secondWhiteVanish(){

  hideStoryNPC(
    "whiteLady"
  );

  storyUndarken();

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"目の前を、買い物袋を持った数人の客が横切った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"ほんの数秒だった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"人の流れが途切れたとき、そこにはもう誰もいなかった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"怎么又停下来了？"
      }

    ],

    showSecondWhiteChoice

  );

}


// ==========================================================
// SECOND WHITE CHOICE
// ==========================================================

function showSecondWhiteChoice(){

  storyChoice([

    {

      jp:"またあの人だ",

      cn:"又是那个女人。",

      action(){

        STORY.flags.secondSight =
          "again";

        storyDialogueSequence(

          [

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"surprised",
              text:"又是她？"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"……在哪里？"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"我什么都没看到。"
            }

          ],

          beginThirdEncounter

        );

      }

    },


    {

      jp:"今、こっちを見ていた",

      cn:"她刚才在看我们。",

      action(){

        STORY.flags.secondSight =
          "watching";

        storyDialogueSequence(

          [

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"surprised",
              text:"看我们？"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"你别吓我啊……"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"那里明明没有人。"
            }

          ],

          beginThirdEncounter

        );

      }

    },


    {

      jp:"……やっぱり何でもない",

      cn:"……还是没什么。",

      action(){

        STORY.flags.secondSight =
          "silent";

        storyDialogueSequence(

          [

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"normal",
              text:"……你今天真的有点奇怪。"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"走吧。"
            }

          ],

          beginThirdEncounter

        );

      }

    }

  ]);

}


// ==========================================================
// XIAOYU SEES HER
// ==========================================================

function beginThirdEncounter(){

  STORY.step =
    5;

  setStoryObjective(
    "人通りの少ない場所へ"
  );

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"二人は少し人通りの少ない場所へ移動した。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"屋台の声が、さっきより遠く聞こえる。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……等一下。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"你看。"
      }

    ],

    showWhiteLadyToBoth

  );

}


function showWhiteLadyToBoth(){

  STORY_NPCS.whiteLady.x =
    32*TILE;

  STORY_NPCS.whiteLady.y =
    22*TILE;

  STORY_NPCS.whiteLady.direction =
    "left";

  STORY_NPCS.whiteLady.visible =
    true;

  storyDarken();

  setTimeout(

    ()=>{

      storyDialogueSequence(

        [

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"surprised",
            text:"……是不是她？"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"白い服の女性が、少し離れたところに立っている。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"今度は消えない。"
          },

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"surprised",
            text:"她为什么一直看着我们……？"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"女性が、ゆっくりこちらへ近づいてくる。"
          },

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"surprised",
            text:"……"
          },

          {
            speaker:"？？？",
            portrait:"whiteLady",
            expression:"normal",
            text:"……不好意思。"
          },

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"surprised",
            text:"……啊？"
          },

          {
            speaker:"？？？",
            portrait:"whiteLady",
            expression:"normal",
            text:"那个……"
          },

          {
            speaker:"？？？",
            portrait:"whiteLady",
            expression:"normal",
            text:"这个，怎么吃？"
          }

        ],

        whiteLadyFoodReveal

      );

    },

    650

  );

}


// ==========================================================
// HORROR -> COMEDY
// ==========================================================

function whiteLadyFoodReveal(){

  storyUndarken();

  setStoryObjective(
    "白い服の女性と話そう"
  );

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"女性の手には、屋台で買ったばかりらしい食べ物が握られていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……啊？"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"normal",
        text:"我看大家都在吃，所以也买了一个。"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"normal",
        text:"可是……不知道怎么吃。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"噗……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"你刚才一直站在那里，就是因为这个？"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"smile",
        text:"嗯。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你吓死我们了。"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"surprised",
        text:"我？"
      }

    ],

    beginPaymentScene

  );

}


// ==========================================================
// MOBILE PAYMENT
// ==========================================================

function beginPaymentScene(){

  STORY.step =
    6;

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"算了，我再给你买一个吧。这个比较好吃。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は屋台のQRコードにスマートフォンを向けた。"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"surprised",
        text:"你刚才……没有给他钱吧？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"啊？"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"normal",
        text:"那怎么买到的？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"手机支付啊。"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……手机？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"你到底是哪个年代的人啊？"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"smile",
        text:"……很奇怪吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"非常奇怪。"
      }

    ],

    beginWhiteLadyNameScene

  );

}


// ==========================================================
// NAME
// ==========================================================

function beginWhiteLadyNameScene(){

  STORY.step =
    7;

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"对了，我叫林小雨。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你叫什么名字？"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"？？？",
        portrait:"whiteLady",
        expression:"smile",
        text:"叫我白姑娘就好。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"白姑娘？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"这是名字吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"嗯。这样就好。"
      }

    ],

    startTrioParty

  );

}


// ==========================================================
// THREE-PERSON PARTY
// ==========================================================

function startTrioParty(){

  STORY_NPCS.whiteLady.name =
    "白姑娘";

  STORY.step =
    8;

  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

  STORY.trioStarted =
    true;

  STORY.playerTrail =
    [];

  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;

  STORY_NPCS.xiaoyu.map =
    currentMapId;

  STORY_NPCS.xiaoyu.visible =
    true;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y +
    TILE*2;

  STORY_NPCS.whiteLady.map =
    currentMapId;

  STORY_NPCS.whiteLady.visible =
    true;

  STORY_NPCS.whiteLady.storyMoving =
    false;


  showPartyStatus(
    "同行中：林小雨・白姑娘"
  );

  setStoryObjective(
    "三人で夜市を歩こう"
  );

  saveStory();


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"那一起逛逛吧。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"我也可以吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"当然可以。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"……好。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"こうして、少し変わった三人の夜市歩きが始まった。"
      }

    ],

    finishChapterTwo

  );

}


// ==========================================================
// CHAPTER 2 END
// ==========================================================

function finishChapterTwo(){

  STORY.step =
    9;

  STORY.chapterComplete =
    true;

  STORY.flags.chapter2 =
    true;

  saveStory();

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は、目に入るものすべてを珍しそうに眺めていた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"スマートフォンも、屋台の灯りも、行き交う人々も。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"まるで、長いあいだこの街を見ていなかったかのように。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"杭州……真的变了很多。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"嗯？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……没什么。"
      }

    ],

    showChapterTwoEnd

  );

}


function showChapterTwoEnd(){

  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];

  hidePartyStatus();

  setStoryObjective(
    "第二章　完"
  );

  configureEndCard(
    2,
    "第二章　完",
    "―― 白衣の女は、白姑娘と名乗った。"
  );

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
        "第二章クリア"
      );

    },

    3200

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
  "杭州探索録 Story Mode Ver.3 / Chapter 1 + Chapter 2 loaded"
);
