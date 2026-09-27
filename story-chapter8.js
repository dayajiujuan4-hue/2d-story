"use strict";

/*
==========================================================
 杭州探索録
 FINAL CHAPTER Ver.1.0

 第八章「灯火の向こう」

 ★ 最終章

 ・白姑娘が武林に来ない
 ・小雨と西湖へ
 ・雷峰塔専用マップ解放
 ・白姑娘との最後の会話
 ・小青登場
 ・失踪者解放
 ・白姑娘が雷峰塔へ戻る
 ・数日後の武林
 ・三人の写真
 ・白衣の女性
 ・STORY COMPLETE
 ・「武林夜話」クリアバッジ
 ・クリア後の武林
==========================================================
*/


// ==========================================================
// COMPLETE KEY
// ==========================================================

const HANGZHOU_STORY_COMPLETE_KEY =
  "hangzhouStoryComplete";


// ==========================================================
// STATE
// ==========================================================

const CH8 = {

  active:false,

  startScheduled:false,

  step:0,

  lastMapId:null,

  chenTriggered:false,

  lakeTriggered:false,

  towerEntered:false,

  towerMidTriggered:false,

  towerTopTriggered:false,

  xiaoqingTriggered:false,

  farewellTriggered:false,

  epilogueTriggered:false,

  finalChoiceTriggered:false,

  endingTriggered:false,

  postGame:false

};


// ==========================================================
// PORTRAIT : 小青
// ==========================================================

if(
  typeof PORTRAITS !== "undefined" &&
  !PORTRAITS.xiaoqing
){

  PORTRAITS.xiaoqing = {

    skin:"#edc5a6",

    hair:"#171c1d",

    hair2:"#243737",

    clothes:"#315f58",

    accent:"#6ca99b"

  };

}


// ==========================================================
// STYLE
// ==========================================================

(function(){

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    /* =====================================================
       STORY COMPLETE
    ===================================================== */

    #storyCompleteScreen{

      position:fixed;

      inset:0;

      z-index:12000;

      display:flex;

      align-items:center;

      justify-content:center;

      background:
        rgba(4,7,10,.96);

      opacity:0;

      pointer-events:none;

      transition:
        opacity 1.2s;

    }


    #storyCompleteScreen.show{

      opacity:1;

      pointer-events:auto;

    }


    .story-complete-panel{

      width:min(
        520px,
        calc(100vw - 40px)
      );

      box-sizing:border-box;

      padding:
        42px 32px;

      text-align:center;

      border:
        1px solid
        rgba(206,174,111,.52);

      background:

        radial-gradient(
          circle at 50% 0%,
          rgba(180,135,62,.16),
          transparent 45%
        ),

        linear-gradient(
          180deg,
          rgba(20,22,27,.98),
          rgba(8,10,14,.98)
        );

      box-shadow:
        0 28px 80px
        rgba(0,0,0,.6);

    }


    .story-complete-symbol{

      font-size:28px;

      color:#c8a86d;

      margin-bottom:15px;

    }


    .story-complete-small{

      font-size:11px;

      letter-spacing:.32em;

      color:#9c8b72;

    }


    .story-complete-title{

      margin-top:10px;

      font-size:36px;

      letter-spacing:.16em;

      color:#eee6d8;

    }


    .story-complete-badge{

      width:150px;

      height:150px;

      box-sizing:border-box;

      margin:
        28px auto 22px;

      border-radius:50%;

      display:flex;

      flex-direction:column;

      align-items:center;

      justify-content:center;

      border:
        2px solid #c6a66d;

      box-shadow:

        0 0 0 6px
        rgba(198,166,109,.08),

        inset 0 0 35px
        rgba(198,166,109,.08);

      color:#e5d4b3;

    }


    .story-complete-badge .badge-small{

      font-size:10px;

      letter-spacing:.22em;

      color:#9f8a68;

    }


    .story-complete-badge .badge-main{

      margin-top:7px;

      font-size:24px;

      letter-spacing:.15em;

    }


    .story-complete-badge .badge-bottom{

      margin-top:6px;

      font-size:10px;

      letter-spacing:.15em;

      color:#b7a17b;

    }


    .story-complete-quote{

      margin-top:18px;

      line-height:1.9;

      font-size:14px;

      color:#bcb4a7;

    }


    #storyPostGameButton{

      margin-top:28px;

      min-width:210px;

      padding:
        13px 24px;

      border:
        1px solid
        rgba(206,174,111,.7);

      background:
        rgba(198,166,109,.08);

      color:#eee6d8;

      cursor:pointer;

      font-size:14px;

      letter-spacing:.1em;

    }


    #storyPostGameButton:hover{

      background:
        rgba(198,166,109,.18);

    }


    /* =====================================================
       MODE SCREEN BADGE
    ===================================================== */

    #storyClearBadge{

      display:none;

      margin:
        22px auto 0;

      width:210px;

      padding:
        12px 14px;

      box-sizing:border-box;

      border:
        1px solid
        rgba(198,166,109,.5);

      background:
        rgba(198,166,109,.07);

      text-align:center;

      color:#d8c49f;

    }


    #storyClearBadge.show{

      display:block;

    }


    #storyClearBadge .clear-mark{

      font-size:10px;

      letter-spacing:.25em;

      color:#968469;

    }


    #storyClearBadge .clear-name{

      margin-top:5px;

      font-size:18px;

      letter-spacing:.18em;

    }


    #storyClearBadge .clear-sub{

      margin-top:5px;

      font-size:10px;

      letter-spacing:.16em;

      color:#9f9588;

    }


    /* =====================================================
       TOWER TITLE
    ===================================================== */

    #towerFloorLabel{

      position:fixed;

      top:82px;

      left:50%;

      transform:
        translateX(-50%);

      z-index:550;

      padding:
        7px 15px;

      background:
        rgba(5,7,10,.78);

      border:
        1px solid
        rgba(198,166,109,.25);

      color:#aaa095;

      font-size:11px;

      letter-spacing:.16em;

      pointer-events:none;

      opacity:0;

      transition:
        opacity .4s;

    }


    #towerFloorLabel.show{

      opacity:1;

    }

  `;


  document.head.appendChild(
    style
  );

})();


// ==========================================================
// CREATE FINAL DOM
// ==========================================================

(function(){

  // --------------------------------------------------------
  // Complete screen
  // --------------------------------------------------------

  if(
    !document.getElementById(
      "storyCompleteScreen"
    )
  ){

    const complete =
      document.createElement(
        "div"
      );


    complete.id =
      "storyCompleteScreen";


    complete.innerHTML = `

      <div class="story-complete-panel">

        <div class="story-complete-symbol">
          ◇
        </div>

        <div class="story-complete-small">
          HANGZHOU EXPLORER
        </div>

        <div class="story-complete-title">
          杭州探索録
        </div>

        <div class="story-complete-badge">

          <div class="badge-small">
            STORY COMPLETE
          </div>

          <div class="badge-main">
            武林夜話
          </div>

          <div class="badge-bottom">
            灯火の向こう
          </div>

        </div>

        <div class="story-complete-quote">
          何でもない夜を、<br>
          忘れないために。
        </div>

        <button id="storyPostGameButton">
          武林夜市へ戻る
        </button>

      </div>

    `;


    document.body.appendChild(
      complete
    );


    document
      .getElementById(
        "storyPostGameButton"
      )
      .addEventListener(

        "click",

        startPostGameWulin

      );

  }


  // --------------------------------------------------------
  // Tower label
  // --------------------------------------------------------

  if(
    !document.getElementById(
      "towerFloorLabel"
    )
  ){

    const floor =
      document.createElement(
        "div"
      );


    floor.id =
      "towerFloorLabel";


    floor.textContent =
      "雷峰塔";


    document.body.appendChild(
      floor
    );

  }


  // --------------------------------------------------------
  // Clear badge
  // mode screenに追加
  // --------------------------------------------------------

  const modePanel =
    document.querySelector(
      "#storyModeScreen .story-title-panel"
    );


  if(
    modePanel &&
    !document.getElementById(
      "storyClearBadge"
    )
  ){

    const badge =
      document.createElement(
        "div"
      );


    badge.id =
      "storyClearBadge";


    badge.innerHTML = `

      <div class="clear-mark">
        STORY CLEAR
      </div>

      <div class="clear-name">
        ◇ 武林夜話 ◇
      </div>

      <div class="clear-sub">
        第八章「灯火の向こう」
      </div>

    `;


    modePanel.appendChild(
      badge
    );

  }


  refreshStoryClearBadge();

})();


// ==========================================================
// CLEAR BADGE
// ==========================================================

function refreshStoryClearBadge(){

  const cleared =

    localStorage.getItem(
      HANGZHOU_STORY_COMPLETE_KEY
    ) === "true";


  const badge =
    document.getElementById(
      "storyClearBadge"
    );


  if(!badge){
    return;
  }


  badge.classList.toggle(
    "show",
    cleared
  );

}


// ==========================================================
// START WATCHER
// ==========================================================

function watchChapterEightStart(){

  if(
    CH8.active ||
    CH8.startScheduled
  ){
    return;
  }


  if(
    STORY.mode !== "story"
  ){
    return;
  }


  if(
    STORY.chapter !== 7
  ){
    return;
  }


  if(
    STORY.flags.chapter7 !== true
  ){
    return;
  }


  if(
    STORY.chapterComplete !== true
  ){
    return;
  }


  CH8.startScheduled =
    true;


  setTimeout(

    ()=>{

      if(
        !CH8.active &&
        STORY.mode === "story" &&
        STORY.chapter === 7
      ){

        startChapterEight();

      }

    },

    4700

  );

}


// ==========================================================
// START CHAPTER 8
// ==========================================================

function startChapterEight(){

  CH8.active =
    true;

  CH8.startScheduled =
    true;

  CH8.step =
    0;

  CH8.lastMapId =
    "food";

  CH8.chenTriggered =
    false;

  CH8.lakeTriggered =
    false;

  CH8.towerEntered =
    false;

  CH8.towerMidTriggered =
    false;

  CH8.towerTopTriggered =
    false;

  CH8.xiaoqingTriggered =
    false;

  CH8.farewellTriggered =
    false;

  CH8.epilogueTriggered =
    false;

  CH8.finalChoiceTriggered =
    false;

  CH8.endingTriggered =
    false;

  CH8.postGame =
    false;


  STORY.chapter =
    8;

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


  hidePartyStatus();


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


  // 小雨
  STORY_NPCS.xiaoyu.map =
    "food";

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

  STORY_NPCS.xiaoyu.storyMoving =
    false;


  // 白姑娘
  STORY_NPCS.whiteLady.visible =
    false;


  // 陈叔
  STORY_NPCS.uncleChen.map =
    "food";

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
    "最終章",
    "灯火の向こう"
  );


  configureChapterCard(
    8,
    "灯火の向こう"
  );


  setStoryObjective(
    "白姑娘を待つ"
  );


  saveStory();

  showChapterCard();


  setTimeout(
    chapterEightOpening,
    1500
  );

}


// ==========================================================
// OPENING
// ==========================================================

function chapterEightOpening(){

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
        text:"約束の時間を過ぎても、白姑娘は武林に現れなかった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……果然没来。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨はスマートフォンを取り出した。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"画面には、昨夜撮った三人の写真が残っていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她昨天就已经决定好了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"只是我们没有发现。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"夜市では、いつもより早く店じまいを始める屋台もあった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"先去问问陈叔。"
      }

    ],

    startChapterEightChenWalk

  );

}


// ==========================================================
// CHEN WALK
// ==========================================================

function startChapterEightChenWalk(){

  CH8.step =
    1;

  STORY.step =
    1;


  STORY.partyActive =
    true;

  STORY.partyType =
    "xiaoyu";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y + TILE;


  showPartyStatus();


  setStoryObjective(
    "陈叔の屋台へ行こう"
  );


  saveStory();

}


// ==========================================================
// UPDATE
// ==========================================================

function updateChapterEight(){

  watchChapterEightStart();


  if(
    !CH8.active ||
    STORY.chapter !== 8
  ){
    return;
  }


  handleChapterEightMapChange();


  if(
    dialogue.active ||
    STORY.choiceOpen
  ){
    return;
  }


  // 陈叔
  if(
    CH8.step === 1 &&
    !CH8.chenTriggered &&
    currentMapId === "food"
  ){

    checkChapterEightChen();

    return;

  }


  // 西湖到着
  if(
    CH8.step === 2 &&
    !CH8.lakeTriggered &&
    currentMapId === "lake"
  ){

    CH8.lakeTriggered =
      true;

    beginChapterEightLake();

    return;

  }


  // 雷峰塔入口
  if(
    CH8.step === 3 &&
    !CH8.towerEntered &&
    currentMapId === "lake"
  ){

    checkChapterEightTowerEntrance();

    return;

  }


  // 雷峰塔中腹
  if(
    CH8.step === 4 &&
    currentMapId === "leifengTower" &&
    !CH8.towerMidTriggered
  ){

    checkTowerMid();

    return;

  }


  // 雷峰塔上層
  if(
    CH8.step === 5 &&
    currentMapId === "leifengTower" &&
    !CH8.towerTopTriggered
  ){

    checkTowerTop();

    return;

  }

}


// ==========================================================
// UPDATE HOOK
// ==========================================================

const CH8_originalUpdateStoryEvents =
  updateStoryEvents;


updateStoryEvents =
function(){

  CH8_originalUpdateStoryEvents();

  updateChapterEight();

};


// ==========================================================
// MAP CHANGE
// ==========================================================

function handleChapterEightMapChange(){

  if(
    CH8.lastMapId ===
    currentMapId
  ){
    return;
  }


  CH8.lastMapId =
    currentMapId;


  STORY.playerTrail =
    [];


  if(
    STORY.partyActive &&
    STORY.partyType === "xiaoyu"
  ){

    STORY_NPCS.xiaoyu.map =
      currentMapId;

    STORY_NPCS.xiaoyu.x =
      player.x;

    STORY_NPCS.xiaoyu.y =
      player.y + TILE;

    STORY_NPCS.xiaoyu.visible =
      true;

  }

}


// ==========================================================
// CHEN
// ==========================================================

function checkChapterEightChen(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  const inside =

    px >= 13 &&
    px <= 21 &&

    py >= 11 &&
    py <= 18;


  if(!inside){
    return;
  }


  CH8.chenTriggered =
    true;


  beginChapterEightChen();

}


// ==========================================================
// CHEN SCENE
// ==========================================================

function beginChapterEightChen(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH8.step =
    2;

  STORY.step =
    2;


  STORY_NPCS.xiaoyu.x =
    19*TILE;

  STORY_NPCS.xiaoyu.y =
    15*TILE;


  STORY_NPCS.uncleChen.visible =
    true;


  setStoryObjective(
    "白姑娘の行方"
  );


  storyDialogueSequence(

    [

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"白姑娘今天没来？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"嗯。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"奇怪。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"她不是最喜欢这里吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……就是因为喜欢。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"什么？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"没什么。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は私を見た。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"走吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"去西湖。"
      }

    ],

    startChapterEightLakeJourney

  );

}


// ==========================================================
// JOURNEY TO LAKE
// ==========================================================

function startChapterEightLakeJourney(){

  STORY_NPCS.uncleChen.visible =
    false;


  STORY.partyActive =
    true;

  STORY.partyType =
    "xiaoyu";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y + TILE;


  showPartyStatus();


  setStoryObjective(
    "小雨と西湖へ向かおう"
  );


  saveStory();

}


// ==========================================================
// LAKE ARRIVAL
// ==========================================================

function beginChapterEightLake(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH8.step =
    3;

  STORY.step =
    3;


  STORY_NPCS.xiaoyu.map =
    "lake";

  STORY_NPCS.xiaoyu.x =
    player.x + TILE;

  STORY_NPCS.xiaoyu.y =
    player.y;


  setStoryObjective(
    "雷峰塔へ"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"西湖は静かだった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"昨夜まで湖面に見えていた青い影は、今夜はどこにもない。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"雷峰塔。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她一定在那里。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"私たちは、湖の向こうに立つ塔へ向かった。"
      }

    ],

    ()=>{

      STORY.partyActive =
        true;

      STORY.partyType =
        "xiaoyu";

      STORY.playerTrail =
        [];


      STORY_NPCS.xiaoyu.x =
        player.x;

      STORY_NPCS.xiaoyu.y =
        player.y + TILE;


      showPartyStatus();


      setStoryObjective(
        "西湖の南側から雷峰塔へ向かおう"
      );

    }

  );

}


// ==========================================================
// TOWER ENTRANCE
// ==========================================================

function checkChapterEightTowerEntrance(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  /*
    既存の雷峰塔写真・伝説ポイント周辺
  */

  const inside =

    px >= 22 &&
    px <= 32 &&

    py >= 27 &&
    py <= 34;


  if(!inside){
    return;
  }


  CH8.towerEntered =
    true;


  enterLeifengTower();

}


// ==========================================================
// ENTER TOWER
// ==========================================================

function enterLeifengTower(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH8.step =
    4;

  STORY.step =
    4;


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"雷峰塔の入口は、夜の中に静かに開いていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……进去吧。"
      }

    ],

    ()=>{

      currentMapId =
        "leifengTower";


      player.x =
        MAPS.leifengTower.spawn.x *
        TILE;

      player.y =
        MAPS.leifengTower.spawn.y *
        TILE;

      player.direction =
        "up";

      player.moving =
        false;


      STORY_NPCS.xiaoyu.map =
        "leifengTower";

      STORY_NPCS.xiaoyu.x =
        player.x;

      STORY_NPCS.xiaoyu.y =
        player.y + TILE;

      STORY_NPCS.xiaoyu.visible =
        true;


      STORY_NPCS.whiteLady.visible =
        false;


      camera.x =
        player.x -
        canvas.width/2;

      camera.y =
        player.y -
        canvas.height/2;

      clampCamera();


      STORY.partyActive =
        true;

      STORY.partyType =
        "xiaoyu";

      STORY.playerTrail =
        [];


      showPartyStatus();


      const floor =
        document.getElementById(
          "towerFloorLabel"
        );


      floor.textContent =
        "雷峰塔・塔内";

      floor.classList.add(
        "show"
      );


      setStoryObjective(
        "小雨と塔を上ろう"
      );


      saveStory();

    }

  );

}


// ==========================================================
// TOWER MID
// ==========================================================

function checkTowerMid(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  const inside =

    py <= 22;


  if(!inside){
    return;
  }


  CH8.towerMidTriggered =
    true;


  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH8.step =
    5;

  STORY.step =
    5;


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"塔を上るにつれて、街の音が遠ざかっていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"聞こえるのは、二人分の足音だけだった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……她为什么总是一个人决定。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"明明我们已经是朋友了。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨はそれ以上何も言わず、再び階段を上り始めた。"
      }

    ],

    ()=>{

      STORY.partyActive =
        true;

      STORY.partyType =
        "xiaoyu";

      STORY.playerTrail =
        [];


      STORY_NPCS.xiaoyu.x =
        player.x;

      STORY_NPCS.xiaoyu.y =
        player.y + TILE;


      showPartyStatus();


      setStoryObjective(
        "雷峰塔の上層へ"
      );

    }

  );

}


// ==========================================================
// TOWER TOP
// ==========================================================

function checkTowerTop(){

  const py =
    player.y / TILE;


  if(
    py > 11
  ){
    return;
  }


  CH8.towerTopTriggered =
    true;


  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH8.step =
    6;

  STORY.step =
    6;


  STORY_NPCS.whiteLady.map =
    "leifengTower";

  STORY_NPCS.whiteLady.x =
    17*TILE;

  STORY_NPCS.whiteLady.y =
    6*TILE;

  STORY_NPCS.whiteLady.direction =
    "down";

  STORY_NPCS.whiteLady.visible =
    true;


  STORY_NPCS.xiaoyu.x =
    16*TILE;

  STORY_NPCS.xiaoyu.y =
    10*TILE;

  STORY_NPCS.xiaoyu.direction =
    "up";


  setStoryObjective(
    "白姑娘"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"塔の上層に、白い服が見えた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"白姑娘！"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……你们还是来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你昨天为什么什么都不告诉我们？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"为什么一个人跑到这里来？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"因为我要回去了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"回去？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"回哪里？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"这里。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"雷峰塔。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"为什么？！"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"可是你也喜欢那里啊！"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你不是每天晚上都想出去吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"所以才要回去啊。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は言葉を失った。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"只要我还出去，小青就不会停下来。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"人会越来越少。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"店会越来越早关门。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"最后……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我喜欢的那个武林，就会消失。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我不想看到那一天。"
      }

    ],

    chapterEightStayChoice

  );

}


// ==========================================================
// STAY CHOICE
// ==========================================================

function chapterEightStayChoice(){

  storyChoice([

    {
      jp:"他の方法があるはずだ",
      cn:"一定还有别的办法。",
      action(){

        STORY.flags.chapter8Response =
          "otherWay";

        chapterEightThemeScene();

      }
    },

    {
      jp:"戻らないでほしい",
      cn:"我不希望你回去。",
      action(){

        STORY.flags.chapter8Response =
          "dontGo";

        chapterEightThemeScene();

      }
    },

    {
      jp:"本当にそれでいいの？",
      cn:"你真的决定好了吗？",
      action(){

        STORY.flags.chapter8Response =
          "decision";

        chapterEightThemeScene();

      }
    }

  ]);

}


// ==========================================================
// THEME SCENE
// ==========================================================

function chapterEightThemeScene(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那你就别回去啊！"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我们可以想别的办法！"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"小雨。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"人不能永远留住自己喜欢的东西。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"有时候……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"正因为喜欢，才更不能让它因为自己消失。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"そのとき、塔の奥から足音が聞こえた。"
      }

    ],

    beginXiaoqingScene

  );

}


// ==========================================================
// XIAOQING
// ==========================================================

function beginXiaoqingScene(){

  if(
    CH8.xiaoqingTriggered
  ){
    return;
  }


  CH8.xiaoqingTriggered =
    true;


  storyDialogueSequence(

    [

      {
        speaker:"？？？",
        portrait:"xiaoqing",
        expression:"normal",
        text:"姐姐。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……！"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"暗がりから、青緑色の服を着た女性が姿を現した。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"小青。"
      },

      {
        speaker:"小青",
        portrait:"xiaoqing",
        expression:"normal",
        text:"你终于回来了。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"把那些人放回来。"
      },

      {
        speaker:"小青",
        portrait:"xiaoqing",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"小青",
        portrait:"xiaoqing",
        expression:"normal",
        text:"你真的愿意回去？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"嗯。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"所以，放他们回去。"
      },

      {
        speaker:"小青",
        portrait:"xiaoqing",
        expression:"normal",
        text:"如果你再偷偷跑出去呢？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"不会了。"
      },

      {
        speaker:"小青",
        portrait:"xiaoqing",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"小青",
        portrait:"xiaoqing",
        expression:"normal",
        text:"好。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小青は白姑娘を見つめたあと、静かに塔の奥へ消えた。"
      }

    ],

    beginChapterEightFarewell

  );

}


// ==========================================================
// FAREWELL
// ==========================================================

function beginChapterEightFarewell(){

  if(
    CH8.farewellTriggered
  ){
    return;
  }


  CH8.farewellTriggered =
    true;


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……真的没有别的办法了吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"别这样。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我已经很开心了。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"小雨。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"嗯。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"照片……还在吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨はスマートフォンを取り出した。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"当然在。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我不会删的。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"那就好。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"还有……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"奶茶还是太甜了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你都要走了，还在说这个。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"因为真的很甜啊。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は笑った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"けれど、その声は少し震えていた。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"谢谢你们。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"让我重新看到了现在的杭州。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"也让我知道……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"现在的人间，也很好。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白姑娘……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"再见，小雨。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"再见。"
      }

    ],

    chapterEightWhiteLeaves

  );

}


// ==========================================================
// WHITE LEAVES
// ==========================================================

function chapterEightWhiteLeaves(){

  STORY_NPCS.whiteLady.visible =
    false;


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は塔の奥へ歩いていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白い服が暗闇の向こうへ消えていく。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は最後まで、彼女の名前を呼ばなかった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"呼んでしまえば、本当に引き止めてしまうと思ったのかもしれない。"
      }

    ],

    startChapterEightEpilogue

  );

}


// ==========================================================
// EPILOGUE
// ==========================================================

function startChapterEightEpilogue(){

  CH8.epilogueTriggered =
    true;


  const floor =
    document.getElementById(
      "towerFloorLabel"
    );


  if(floor){

    floor.classList.remove(
      "show"
    );

  }


  currentMapId =
    "food";


  player.x =
    26*TILE;

  player.y =
    20*TILE;

  player.direction =
    "up";


  STORY_NPCS.xiaoyu.map =
    "food";

  STORY_NPCS.xiaoyu.x =
    24*TILE;

  STORY_NPCS.xiaoyu.y =
    20*TILE;

  STORY_NPCS.xiaoyu.visible =
    true;


  STORY_NPCS.whiteLady.visible =
    false;

  STORY_NPCS.uncleChen.visible =
    true;


  camera.x =
    player.x -
    canvas.width/2;

  camera.y =
    player.y -
    canvas.height/2;

  clampCamera();


  setStoryObjective(
    "数日後"
  );


  setTimeout(

    ()=>{

      storyDialogueSequence(

        [

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"数日後。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"失踪していた人々は、全員無事に戻ってきた。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"彼ら自身も、どこにいたのかよく覚えていなかったという。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"西湖の青い蛇の噂も、いつの間にか聞かれなくなった。"
          },

          {
            speaker:"陈叔",
            portrait:"uncleChen",
            expression:"smile",
            text:"最近总算又热闹起来了。"
          },

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"normal",
            text:"嗯。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"武林には再び、人の声が戻っていた。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"食べる人。笑う人。友人を待つ人。子どもを急かす親。店じまいを始める店主。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"彼女が好きだった、何でもない人間の夜だった。"
          },

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"normal",
            text:"……今天也挺热闹的。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"私は頷いた。"
          },

          {
            speaker:"林小雨",
            portrait:"xiaoyu",
            expression:"normal",
            text:"可是，总觉得少了一个人。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"小雨はスマートフォンを開いた。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"そこには、三人で撮った写真が残っていた。"
          }

        ],

        chapterEightFinalGlimpse

      );

    },

    900

  );

}


// ==========================================================
// FINAL GLIMPSE
// ==========================================================

function chapterEightFinalGlimpse(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その帰り、西湖の近くを歩いていたときだった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"遠くの柳のそばに、一瞬だけ白い服が見えた気がした。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"振り返る。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"そこには、もう誰もいなかった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"怎么了？"
      }

    ],

    chapterEightFinalChoice

  );

}


// ==========================================================
// FINAL CHOICE
// ==========================================================

function chapterEightFinalChoice(){

  if(
    CH8.finalChoiceTriggered
  ){
    return;
  }


  CH8.finalChoiceTriggered =
    true;


  storyChoice([

    {
      jp:"何でもない",
      cn:"没什么。",
      action(){

        STORY.flags.finalAnswer =
          "nothing";

        finishHangzhouStory();

      }
    },

    {
      jp:"白い服の人がいた気がした",
      cn:"我好像看见了一个穿白衣服的人。",
      action(){

        STORY.flags.finalAnswer =
          "white";

        finishHangzhouStory();

      }
    },

    {
      jp:"また会える気がする",
      cn:"我觉得……我们还会再见的。",
      action(){

        STORY.flags.finalAnswer =
          "again";

        finishHangzhouStory();

      }
    }

  ]);

}


// ==========================================================
// STORY END
// ==========================================================

function finishHangzhouStory(){

  if(
    CH8.endingTriggered
  ){
    return;
  }


  CH8.endingTriggered =
    true;


  STORY.chapterComplete =
    true;

  STORY.flags.chapter8 =
    true;

  STORY.flags.storyComplete =
    true;


  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];


  hidePartyStatus();


  localStorage.setItem(
    HANGZHOU_STORY_COMPLETE_KEY,
    "true"
  );


  refreshStoryClearBadge();


  saveStory();


  setStoryObjective(
    "杭州探索録　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"武林の夜は、今日も続いている。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"人が笑い、食べ、誰かを待ち、店じまいをする。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"彼女が好きだった、何でもない人間の夜が。"
      }

    ],

    showHangzhouStoryEnding

  );

}


// ==========================================================
// END TITLE
// ==========================================================

function showHangzhouStoryEnding(){

  configureEndCard(
    8,
    "杭州探索録",
    "―― 完 ――"
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
        showStoryCompleteScreen,
        900
      );

    },

    4300

  );

}


// ==========================================================
// COMPLETE SCREEN
// ==========================================================

function showStoryCompleteScreen(){

  const screen =
    document.getElementById(
      "storyCompleteScreen"
    );


  if(screen){

    screen.classList.add(
      "show"
    );

  }

}


// ==========================================================
// POST GAME
// ==========================================================

function startPostGameWulin(){

  const screen =
    document.getElementById(
      "storyCompleteScreen"
    );


  if(screen){

    screen.classList.remove(
      "show"
    );

  }


  CH8.postGame =
    true;


  STORY.mode =
    "story";

  STORY.started =
    true;

  STORY.chapter =
    8;

  STORY.chapterComplete =
    true;

  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];


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


  // 小雨は武林に残る
  STORY_NPCS.xiaoyu.map =
    "food";

  STORY_NPCS.xiaoyu.x =
    29*TILE;

  STORY_NPCS.xiaoyu.y =
    21*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";

  STORY_NPCS.xiaoyu.visible =
    true;

  STORY_NPCS.xiaoyu.storyInteract =
    false;

  STORY_NPCS.xiaoyu.marker =
    false;


  // 陈叔
  STORY_NPCS.uncleChen.map =
    "food";

  STORY_NPCS.uncleChen.x =
    17*TILE;

  STORY_NPCS.uncleChen.y =
    12*TILE;

  STORY_NPCS.uncleChen.visible =
    true;


  // 白姑娘はいない
  STORY_NPCS.whiteLady.visible =
    false;


  camera.x =
    player.x -
    canvas.width/2;

  camera.y =
    player.y -
    canvas.height/2;

  clampCamera();


  setStoryObjective(
    "クリア後：武林の夜"
  );


  saveStory();


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"物語は終わった。けれど、武林の夜はこれからも続いていく。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"走吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"今天也去逛逛。"
      }

    ],

    ()=>{

      setStoryObjective(
        "クリア後：自由に武林を歩こう"
      );

    }

  );

}


// ==========================================================
// MODE SCREEN BADGE REFRESH
// ==========================================================

const CH8_originalStartExploreMode =
  startExploreMode;


startExploreMode =
function(){

  refreshStoryClearBadge();

  CH8_originalStartExploreMode();

};


// ==========================================================
// LOAD COMPLETE BADGE
// ==========================================================

window.addEventListener(

  "load",

  ()=>{

    refreshStoryClearBadge();

  }

);


// ==========================================================
// FINAL CHAPTER LOG
// ==========================================================

console.log(
  "杭州探索録 FINAL CHAPTER Ver.1.0 / 灯火の向こう loaded"
);
