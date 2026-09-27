"use strict";

/*
==========================================================
 杭州探索録
 STORY MODE Ver.1

 ・探索モード
 ・ストーリーモード
 ・章進行
 ・目的表示
 ・選択肢
 ・NPCポートレート連携

 第1章：
 「武林の夜」
==========================================================
*/


// ==========================================================
// STORY STATE
// ==========================================================

const STORY_SAVE_KEY=
  "hangzhouStorySaveV1";


const STORY={

  mode:null,

  chapter:1,

  step:0,

  started:false,

  choiceOpen:false,

  choiceIndex:0,

  flags:{},

  currentEvent:null

};



function loadStory(){

  try{

    const saved=
      JSON.parse(
        localStorage.getItem(
          STORY_SAVE_KEY
        )
      );


    if(!saved){
      return;
    }


    STORY.chapter=
      saved.chapter || 1;

    STORY.step=
      saved.step || 0;

    STORY.flags=
      saved.flags || {};

  }
  catch(error){

    console.warn(
      "Story save load failed",
      error
    );

  }

}



function saveStory(){

  localStorage.setItem(
    STORY_SAVE_KEY,

    JSON.stringify({

      chapter:
        STORY.chapter,

      step:
        STORY.step,

      flags:
        STORY.flags

    })

  );

}



// ==========================================================
// STYLE
// ==========================================================

function storyAddStyle(){

  const style=
    document.createElement(
      "style"
    );


  style.textContent=`

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
        rgba(8,10,15,.96) 65%
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
      rgba(18,20,27,.96);

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
    color:#a8a4a0;

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

    background:
      #25262c;

    color:
      #eee5d5;

    padding:
      22px 18px;

    min-height:
      112px;

    transition:
      .15s;
  }


  .story-mode-button:hover{
    transform:
      translateY(-2px);

    border-color:
      #c5a46d;

    background:
      #303038;
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

    width:270px;

    box-sizing:border-box;

    padding:14px 16px;

    background:
      rgba(15,18,24,.90);

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
      rgba(13,15,21,.97);

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


  .story-choice:hover,
  .story-choice.selected{
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
      rgba(5,7,10,.72);

    opacity:0;

    transition:
      opacity .4s;
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

  const mode=
    document.createElement(
      "div"
    );


  mode.id=
    "storyModeScreen";


  mode.innerHTML=`

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
            人々との会話から物語を進める
          </span>

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    mode
  );


  const objective=
    document.createElement(
      "div"
    );


  objective.id=
    "storyObjective";

  objective.className=
    "hidden";


  objective.innerHTML=`

    <div class="chapter">
      STORY
    </div>

    <div
      class="objective"
      id="storyObjectiveText"
    ></div>

  `;


  document.body.appendChild(
    objective
  );


  const choices=
    document.createElement(
      "div"
    );


  choices.id=
    "storyChoices";

  choices.className=
    "hidden";


  document.body.appendChild(
    choices
  );


  const chapterCard=
    document.createElement(
      "div"
    );


  chapterCard.id=
    "storyChapterCard";


  chapterCard.innerHTML=`

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
    chapterCard
  );

}



// ==========================================================
// MODE
// ==========================================================

function startExploreMode(){

  STORY.mode=
    "explore";


  STORY.started=false;


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

  STORY.mode=
    "story";


  STORY.started=true;


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


  /*
   * 第1章開始地点
   */

  currentMapId=
    "food";


  player.x=
    MAPS.food.spawn.x*TILE;

  player.y=
    MAPS.food.spawn.y*TILE;


  camera.x=
    Math.max(
      0,
      player.x-
      canvas.width/2
    );

  camera.y=
    Math.max(
      0,
      player.y-
      canvas.height/2
    );


  STORY.step=0;


  showChapterCard();


  setTimeout(
    ()=>{
      storyOpening();
    },
    1300
  );

}



// ==========================================================
// CHAPTER CARD
// ==========================================================

function showChapterCard(){

  const card=
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
    1100
  );

}



// ==========================================================
// OBJECTIVE
// ==========================================================

function setStoryObjective(
  text
){

  const el=
    document.getElementById(
      "storyObjectiveText"
    );


  if(el){
    el.textContent=
      text;
  }

}



// ==========================================================
// STORY DIALOGUE
// ==========================================================

function storyDialogue(
  character,
  lines,
  onEnd=null
){

  const npc={

    name:
      character.name,

    portrait:
      character.portrait,

    expression:
      character.expression ||
      "normal",

    dialogue:
      lines,

    rewards:[]

  };


  /*
   * ストーリー終了処理を
   * NPCへ一時保存
   */

  npc.storyOnEnd=
    onEnd;


  startDialogue(
    npc
  );

}



// ==========================================================
// PATCH ADVANCE DIALOGUE
// ==========================================================

const storyOriginalAdvanceDialogue=
  advanceDialogue;


advanceDialogue=function(){

  if(
    STORY.mode!=="story" ||
    !dialogue.active ||
    !dialogue.npc ||
    !dialogue.npc.storyOnEnd
  ){

    storyOriginalAdvanceDialogue();

    return;

  }


  dialogue.index++;


  if(
    dialogue.index>=
    dialogue.npc.dialogue.length
  ){

    const callback=
      dialogue.npc.storyOnEnd;


    closeDialogue();


    if(callback){
      callback();
    }


    return;

  }


  dialogueText.textContent=
    dialogue.npc.dialogue[
      dialogue.index
    ];


  /*
   * portraitを再描画
   */

  showNPCPortrait(

    dialogue.npc.portrait ||
    "student",

    dialogue.npc.expression ||
    "normal"

  );

};



// ==========================================================
// CHOICE SYSTEM
// ==========================================================

function storyChoice(
  choices
){

  STORY.choiceOpen=true;

  STORY.choiceIndex=0;


  const holder=
    document.getElementById(
      "storyChoices"
    );


  holder.innerHTML="";


  choices.forEach(
    (choice,index)=>{

      const button=
        document.createElement(
          "button"
        );


      button.className=
        "story-choice";


      button.innerHTML=`

        ${choice.jp}

        <span class="story-choice-cn">
          ${choice.cn}
        </span>

      `;


      button.addEventListener(
        "click",
        ()=>{

          STORY.choiceOpen=false;

          holder.classList.add(
            "hidden"
          );


          if(choice.action){
            choice.action();
          }

        }
      );


      holder.appendChild(
        button
      );

    }
  );


  holder.classList.remove(
    "hidden"
  );

}



// ==========================================================
// CHARACTERS
// ==========================================================

const STORY_CHARACTERS={

  xiaoyu:{

    name:"林小雨",

    portrait:"xiaoyu"

  },


  uncleChen:{

    name:"陈叔",

    portrait:"uncleChen"

  },


  narrator:{

    name:"",

    portrait:"tourist"

  }

};



// ==========================================================
// CHAPTER 1
// ==========================================================

function storyOpening(){

  setStoryObjective(
    "武林夜市を歩いてみよう"
  );


  storyDialogue(

    {
      name:"杭州探索録",
      portrait:"tourist"
    },

    [

      "杭州に来て最初の夜。",

      "宿舎にいても眠れず、あなたは武林の街へ出てきた。",

      "通りには赤い提灯が揺れ、屋台から湯気が立ち上っている。",

      "せっかく杭州まで来たのだから、何か食べてみよう。"

    ],

    ()=>{

      STORY.step=1;

      saveStory();

      setStoryObjective(
        "夜市の屋台を探そう"
      );

    }

  );

}



// ==========================================================
// XIAOYU ENCOUNTER
// ==========================================================

function startXiaoyuEncounter(){

  if(
    STORY.mode!=="story"
  ){
    return;
  }


  if(
    STORY.flags.metXiaoyu
  ){
    return;
  }


  STORY.flags.metXiaoyu=true;

  saveStory();


  storyDialogue(

    {
      name:"林小雨",
      portrait:"xiaoyu",
      expression:"normal"
    },

    [

      "你好。",

      "你是不是第一次来杭州？",

      "看你好像一直在找什么。"

    ],

    ()=>{

      storyChoice([

        {

          jp:"留学に来ました",

          cn:"我来杭州留学。",

          action(){

            STORY.flags.reason=
              "study";


            storyDialogue(

              {
                name:"林小雨",
                portrait:"xiaoyu",
                expression:"smile"
              },

              [

                "原来是留学生啊！",

                "那你以后应该会经常来武林。",

                "这里晚上很热闹，我带你逛逛吧。"

              ],

              afterXiaoyuChoice

            );

          }

        },


        {

          jp:"旅行で来ました",

          cn:"我是来杭州旅游的。",

          action(){

            STORY.flags.reason=
              "travel";


            storyDialogue(

              {
                name:"林小雨",
                portrait:"xiaoyu",
                expression:"smile"
              },

              [

                "来杭州旅游啊！",

                "那可不能只去西湖。",

                "晚上也应该看看杭州人生活的地方。"

              ],

              afterXiaoyuChoice

            );

          }

        },


        {

          jp:"ちょっと散歩しています",

          cn:"我只是随便逛逛。",

          action(){

            STORY.flags.reason=
              "walk";


            storyDialogue(

              {
                name:"林小雨",
                portrait:"xiaoyu",
                expression:"smile"
              },

              [

                "随便逛逛也挺好的。",

                "有时候这样反而能看到真正的杭州。",

                "走吧，我正好也要去买点吃的。"

              ],

              afterXiaoyuChoice

            );

          }

        }

      ]);

    }

  );

}



function afterXiaoyuChoice(){

  STORY.step=2;

  saveStory();


  setStoryObjective(
    "林小雨と一緒に屋台へ行こう"
  );


  storyDialogue(

    {
      name:"林小雨",
      portrait:"xiaoyu",
      expression:"smile"
    },

    [

      "对了，我叫林小雨。",

      "你呢？",

      "算了，边走边说吧。",

      "前面那家摊子我经常去。"

    ]

  );

}



// ==========================================================
// TEST STORY EVENT
// ==========================================================

/*
 * Ver.1では動作確認のため
 * Sキーで小雨とのイベントを開始できる。
 *
 * 最終版ではマップ上のNPCに接触・会話して
 * 発生する方式へ変更する。
 */

window.addEventListener(
  "keydown",
  event=>{

    if(
      STORY.mode!=="story"
    ){
      return;
    }


    if(
      event.key.toLowerCase()==="s" &&
      !dialogue.active &&
      !STORY.choiceOpen
    ){

      startXiaoyuEncounter();

    }

  }
);



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
  "杭州探索録 Story Mode Ver.1 loaded"
);
