"use strict";

/*
==========================================================
 杭州探索録
 CHAPTER 5 EXPANSION Ver.1.1

 第五章「西湖の夜」

 読み込み順：
 story.js
 story-chapter3.js
 story-chapter4.js
 story-chapter5.js

 ★ Ver.1.1
 ・選択肢の undefined 表示を修正
 ・storyChoice() の正式仕様 jp / cn に統一

 ★ 言語ルール
 ・「杭州探索録」のナレーション → 日本語
 ・その他の登場人物 → 中国語
 ・主人公の選択肢 → 日本語＋中国語

 ★ 第五章
 ・白姑娘が武林に現れない
 ・主人公と小雨の二人で行動
 ・失踪事件を実際に目撃
 ・西湖へ向かう
 ・西湖で白姑娘と再会
 ・湖面に「青い影」
 ・まだ「青蛇」という名前は出さない
==========================================================
*/


// ==========================================================
// CHAPTER 5 STATE
// ==========================================================

const CH5 = {

  active:false,

  startScheduled:false,

  step:0,

  photoTriggered:false,

  missingTriggered:false,

  departureTriggered:false,

  lastMapId:null,

  lakeArrived:false,

  whiteFound:false,

  shadowTriggered:false,

  endingTriggered:false

};


// ==========================================================
// CHAPTER 5 START WATCHER
// ==========================================================

function watchChapterFiveStart(){

  if(
    CH5.active ||
    CH5.startScheduled
  ){
    return;
  }


  if(
    STORY.mode !== "story"
  ){
    return;
  }


  if(
    STORY.chapter !== 4
  ){
    return;
  }


  if(
    STORY.flags.chapter4 !== true
  ){
    return;
  }


  if(
    STORY.chapterComplete !== true
  ){
    return;
  }


  CH5.startScheduled =
    true;


  setTimeout(

    ()=>{

      if(
        !CH5.active &&
        STORY.mode === "story" &&
        STORY.chapter === 4
      ){

        startChapterFive();

      }

    },

    4300

  );

}


// ==========================================================
// CHAPTER 5 START
// ==========================================================

function startChapterFive(){

  CH5.active =
    true;

  CH5.startScheduled =
    true;

  CH5.step =
    0;

  CH5.photoTriggered =
    false;

  CH5.missingTriggered =
    false;

  CH5.departureTriggered =
    false;

  CH5.lastMapId =
    "food";

  CH5.lakeArrived =
    false;

  CH5.whiteFound =
    false;

  CH5.shadowTriggered =
    false;

  CH5.endingTriggered =
    false;


  STORY.chapter =
    5;

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


  // ========================================================
  // START MAP
  // ========================================================

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


  // ========================================================
  // 小雨
  // ========================================================

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


  // ========================================================
  // 白姑娘
  // ========================================================

  STORY_NPCS.whiteLady.visible =
    false;

  STORY_NPCS.whiteLady.marker =
    false;

  STORY_NPCS.whiteLady.storyInteract =
    false;

  STORY_NPCS.whiteLady.storyMoving =
    false;


  // ========================================================
  // 陈叔
  // ========================================================

  STORY_NPCS.uncleChen.visible =
    false;


  // ========================================================
  // CAMERA
  // ========================================================

  camera.x =
    player.x -
    canvas.width/2;

  camera.y =
    player.y -
    canvas.height/2;

  clampCamera();


  // ========================================================
  // UI
  // ========================================================

  setChapterLabel(
    "第五章",
    "西湖の夜"
  );


  configureChapterCard(
    5,
    "西湖の夜"
  );


  setStoryObjective(
    "小雨と待ち合わせる"
  );


  saveStory();

  showChapterCard();


  setTimeout(
    chapterFiveOpening,
    1400
  );

}


// ==========================================================
// OPENING
// ==========================================================

function chapterFiveOpening(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"翌日の夜。私は再び武林夜市へ向かった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨はいつもの場所で待っていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……白姑娘还没来。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"平时这个时间，她应该已经到了。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は何度も人混みの向こうを確認した。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"昨天她走的时候就很奇怪。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你也这么觉得吧？"
      }

    ],

    chapterFiveOpeningChoice

  );

}


// ==========================================================
// OPENING CHOICE
// Ver.1.1 FIX
// ==========================================================

function chapterFiveOpeningChoice(){

  storyChoice([

    {

      jp:"うん、何か知っている気がする",

      cn:"嗯，我觉得她肯定知道些什么。",

      action(){

        STORY.flags.chapter5Concern =
          "knows";

        chapterFiveAfterOpeningChoice();

      }

    },


    {

      jp:"昨日の青い影が気になる",

      cn:"我还是很在意昨天说的那个青色的影子。",

      action(){

        STORY.flags.chapter5Concern =
          "shadow";

        chapterFiveAfterOpeningChoice();

      }

    },


    {

      jp:"今日は来ないのかな",

      cn:"她今天不会不来了吧？",

      action(){

        STORY.flags.chapter5Concern =
          "absent";

        chapterFiveAfterOpeningChoice();

      }

    }

  ]);

}


// ==========================================================
// AFTER OPENING CHOICE
// ==========================================================

function chapterFiveAfterOpeningChoice(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……我也有点担心。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"再等她一会儿吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我们先走走。"
      }

    ],

    startChapterFiveWalk

  );

}


// ==========================================================
// START WALK
// ==========================================================

function startChapterFiveWalk(){

  CH5.step =
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
    player.y +
    TILE;

  STORY_NPCS.xiaoyu.map =
    currentMapId;

  STORY_NPCS.xiaoyu.visible =
    true;


  STORY_NPCS.whiteLady.visible =
    false;


  setChapterFivePartyText(
    "同行中：林小雨"
  );

  showPartyStatus();


  setStoryObjective(
    "小雨と夜市を歩こう"
  );


  saveStory();

}


// ==========================================================
// PARTY STATUS TEXT
// ==========================================================

function setChapterFivePartyText(text){

  const el =
    document.getElementById(
      "storyPartyStatus"
    );


  if(el){

    el.textContent =
      text;

  }

}


// ==========================================================
// CHAPTER 5 UPDATE
// ==========================================================

function updateChapterFive(){

  watchChapterFiveStart();


  if(
    !CH5.active ||
    STORY.chapter !== 5
  ){
    return;
  }


  handleChapterFiveMapChange();


  if(
    dialogue.active ||
    STORY.choiceOpen
  ){
    return;
  }


  // ========================================================
  // STEP 1
  // 写真イベント
  // ========================================================

  if(
    CH5.step === 1 &&
    !CH5.photoTriggered &&
    currentMapId === "food"
  ){

    checkChapterFivePhotoScene();

    return;

  }


  // ========================================================
  // STEP 2
  // 失踪事件
  // ========================================================

  if(
    CH5.step === 2 &&
    !CH5.missingTriggered &&
    currentMapId === "food"
  ){

    checkChapterFiveMissingScene();

    return;

  }


  // ========================================================
  // STEP 3
  // 西湖到着
  // ========================================================

  if(
    CH5.step === 3 &&
    !CH5.lakeArrived &&
    currentMapId === "lake"
  ){

    CH5.lakeArrived =
      true;

    beginChapterFiveLakeArrival();

    return;

  }


  // ========================================================
  // STEP 4
  // 白姑娘発見
  // ========================================================

  if(
    CH5.step === 4 &&
    !CH5.whiteFound &&
    currentMapId === "lake"
  ){

    checkChapterFiveWhiteLady();

    return;

  }


  // ========================================================
  // STEP 5
  // 青い影
  // ========================================================

  if(
    CH5.step === 5 &&
    !CH5.shadowTriggered &&
    currentMapId === "lake"
  ){

    checkChapterFiveShadow();

    return;

  }

}


// ==========================================================
// UPDATE HOOK
// ==========================================================

const CH5_originalUpdateStoryEvents =
  updateStoryEvents;


updateStoryEvents =
function(){

  CH5_originalUpdateStoryEvents();

  updateChapterFive();

};


// ==========================================================
// MAP CHANGE HANDLER
// ==========================================================

function handleChapterFiveMapChange(){

  if(
    CH5.lastMapId ===
    currentMapId
  ){
    return;
  }


  CH5.lastMapId =
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
      player.y +
      TILE;

    STORY_NPCS.xiaoyu.direction =
      player.direction;

    STORY_NPCS.xiaoyu.visible =
      true;

    STORY_NPCS.xiaoyu.storyMoving =
      false;

  }

}


// ==========================================================
// CH5 FOLLOWER SYSTEM
// ==========================================================

function updateChapterFiveFollower(){

  if(
    !CH5.active ||
    STORY.chapter !== 5 ||
    !STORY.partyActive ||
    STORY.partyType !== "xiaoyu"
  ){
    return;
  }


  const xiaoyu =
    STORY_NPCS.xiaoyu;


  if(
    xiaoyu.map !== currentMapId
  ){

    xiaoyu.map =
      currentMapId;

    xiaoyu.x =
      player.x;

    xiaoyu.y =
      player.y +
      TILE;

  }


  const last =
    STORY.playerTrail[
      STORY.playerTrail.length - 1
    ];


  const movedEnough =
    !last ||
    last.map !== currentMapId ||
    Math.hypot(
      player.x - last.x,
      player.y - last.y
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
    120
  ){

    STORY.playerTrail.shift();

  }


  if(
    STORY.playerTrail.length >
    12
  ){

    const target =
      STORY.playerTrail[
        STORY.playerTrail.length - 12
      ];


    if(
      target &&
      target.map === currentMapId
    ){

      xiaoyu.x =
        target.x;

      xiaoyu.y =
        target.y;

      xiaoyu.direction =
        target.direction;

    }

  }

}


// ==========================================================
// FOLLOWER UPDATE HOOK
// ==========================================================

const CH5_originalUpdateNPCs =
  updateNPCs;


updateNPCs =
function(dt){

  CH5_originalUpdateNPCs(dt);

  updateChapterFiveFollower();

};


// ==========================================================
// PHOTO SCENE AREA
// ==========================================================

function checkChapterFivePhotoScene(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 21 &&
    px <= 32 &&

    py >= 18 &&
    py <= 26;


  if(!inside){
    return;
  }


  CH5.photoTriggered =
    true;


  beginChapterFivePhotoScene();

}


// ==========================================================
// PHOTO SCENE
// ==========================================================

function beginChapterFivePhotoScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH5.step =
    2;

  STORY.step =
    2;


  STORY_NPCS.xiaoyu.x =
    player.x +
    TILE;

  STORY_NPCS.xiaoyu.y =
    player.y;

  STORY_NPCS.xiaoyu.direction =
    "left";


  setStoryObjective(
    "三人で撮った写真"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"しばらく歩いたところで、小雨が足を止めた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……她今天真的不来了吗。"
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
        text:"你看。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"画面には、あの夜に三人で撮った写真が映っていた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"写真の中では、白姑娘も私たちと同じように笑っている。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"ほんの数日前のことなのに、ずいぶん昔のことのように感じた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那天她还问我，照片是不是会一直留着。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我当时还觉得她问得很奇怪。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"现在想想……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"总觉得有点不对劲。"
      }

    ],

    restartChapterFiveAfterPhoto

  );

}


// ==========================================================
// AFTER PHOTO
// ==========================================================

function restartChapterFiveAfterPhoto(){

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


  setChapterFivePartyText(
    "同行中：林小雨"
  );

  showPartyStatus();


  setStoryObjective(
    "もう少し夜市を歩こう"
  );


  saveStory();

}


// ==========================================================
// MISSING PERSON AREA
// ==========================================================

function checkChapterFiveMissingScene(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 20 &&
    px <= 33 &&

    py >= 28 &&
    py <= 34;


  if(!inside){
    return;
  }


  CH5.missingTriggered =
    true;


  beginChapterFiveMissingScene();

}


// ==========================================================
// MISSING PERSON SCENE
// ==========================================================

function beginChapterFiveMissingScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH5.step =
    3;

  STORY.step =
    3;


  setStoryObjective(
    "目の前で起きた異変"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"夜市の南側へ歩いていると、一人の男性が私たちの前を横切った。"
      },

      {
        speaker:"男",
        portrait:"tourist",
        expression:"normal",
        text:"奇怪……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"怎么了？"
      },

      {
        speaker:"男",
        portrait:"tourist",
        expression:"normal",
        text:"刚才好像有人叫我。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"有人叫你？"
      },

      {
        speaker:"男",
        portrait:"tourist",
        expression:"normal",
        text:"嗯……好像是从那边传来的。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"男性は武林の南、西湖へ続く方向を指さした。"
      },

      {
        speaker:"男",
        portrait:"tourist",
        expression:"normal",
        text:"我去看看。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"等等，那边——"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"男性は人混みの向こうへ歩いていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"ほんの数秒、屋台の客が私たちの視界を遮った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"再び前が見えたとき――男性の姿は消えていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……人呢？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"刚才那个人呢？！"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"周囲を見回しても、男性の姿はどこにもなかった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不可能……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"刚才他明明就在这里。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"足元を見ると、石畳の一部だけが濡れていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……水？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"这里为什么会有水？"
      }

    ],

    chapterFiveDecision

  );

}


// ==========================================================
// DECISION
// Ver.1.1 FIX
// ==========================================================

function chapterFiveDecision(){

  storyChoice([

    {

      jp:"西湖へ行こう",

      cn:"我们去西湖吧。",

      action(){

        STORY.flags.chapter5Decision =
          "go";

        chapterFiveGoToLake();

      }

    },


    {

      jp:"白姑娘を探そう",

      cn:"我们去找白姑娘吧。",

      action(){

        STORY.flags.chapter5Decision =
          "findWhite";

        chapterFiveGoToLake();

      }

    },


    {

      jp:"あの水が気になる",

      cn:"我很在意地上的这些水。",

      action(){

        STORY.flags.chapter5Decision =
          "water";

        chapterFiveGoToLake();

      }

    }

  ]);

}


// ==========================================================
// GO TO WEST LAKE
// ==========================================================

function chapterFiveGoToLake(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"嗯。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"昨天的传闻也是西湖。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白姑娘听到“青色”以后，马上就走了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"如果她真的知道什么……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"也许她现在就在西湖。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"走吧。"
      }

    ],

    startJourneyToLake

  );

}


// ==========================================================
// JOURNEY START
// ==========================================================

function startJourneyToLake(){

  CH5.departureTriggered =
    true;


  STORY.partyActive =
    true;

  STORY.partyType =
    "xiaoyu";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.map =
    currentMapId;

  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;

  STORY_NPCS.xiaoyu.visible =
    true;


  setChapterFivePartyText(
    "同行中：林小雨"
  );

  showPartyStatus();


  setStoryObjective(
    "小雨と一緒に西湖へ向かおう"
  );


  saveStory();

}


// ==========================================================
// LAKE ARRIVAL
// ==========================================================

function beginChapterFiveLakeArrival(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH5.step =
    4;

  STORY.step =
    4;


  STORY_NPCS.xiaoyu.map =
    "lake";

  STORY_NPCS.xiaoyu.x =
    player.x +
    TILE;

  STORY_NPCS.xiaoyu.y =
    player.y;

  STORY_NPCS.xiaoyu.visible =
    true;

  STORY_NPCS.xiaoyu.direction =
    "left";


  STORY_NPCS.whiteLady.visible =
    false;


  setStoryObjective(
    "夜の西湖"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"武林を離れ、私たちは西湖へ向かった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"夜市の賑わいが遠ざかるにつれて、人の声も少なくなっていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"湖面には街の灯りが揺れている。だが今夜は、その景色さえどこか冷たく見えた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……今天这里怎么这么安静。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"平时这个时间应该还有很多人的。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は湖畔を見渡した。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我们找找她。"
      }

    ],

    startLakeSearch

  );

}


// ==========================================================
// SEARCH WEST LAKE
// ==========================================================

function startLakeSearch(){

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
    "lake";


  setChapterFivePartyText(
    "同行中：林小雨"
  );

  showPartyStatus();


  setStoryObjective(
    "西湖の湖畔で白姑娘を探そう"
  );


  saveStory();

}


// ==========================================================
// WHITE LADY SEARCH AREA
// ==========================================================

function checkChapterFiveWhiteLady(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 18 &&
    px <= 30 &&

    py >= 14 &&
    py <= 24;


  if(!inside){
    return;
  }


  CH5.whiteFound =
    true;


  beginWhiteLadyLakeScene();

}


// ==========================================================
// WHITE LADY AT WEST LAKE
// ==========================================================

function beginWhiteLadyLakeScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH5.step =
    5;

  STORY.step =
    5;


  STORY_NPCS.whiteLady.map =
    "lake";

  STORY_NPCS.whiteLady.name =
    "白姑娘";

  STORY_NPCS.whiteLady.x =
    21*TILE;

  STORY_NPCS.whiteLady.y =
    18*TILE;

  STORY_NPCS.whiteLady.direction =
    "left";

  STORY_NPCS.whiteLady.visible =
    true;

  STORY_NPCS.whiteLady.marker =
    false;

  STORY_NPCS.whiteLady.storyInteract =
    false;

  STORY_NPCS.whiteLady.storyMoving =
    false;


  STORY_NPCS.xiaoyu.map =
    "lake";

  STORY_NPCS.xiaoyu.x =
    24*TILE;

  STORY_NPCS.xiaoyu.y =
    18*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";


  setStoryObjective(
    "湖畔にいた白姑娘"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"柳の向こうに、白い服が見えた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……白姑娘！"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は湖のすぐそばに立ち、水面を見つめていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你怎么一个人在这里？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我们一直在找你。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……你们不该来的。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"这里现在很危险。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"刚才在武林，有个人突然不见了。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……又有人？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"“又”？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白姑娘，你果然知道些什么。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我只是……还不确定。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不确定什么？"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は答えず、再び湖を見た。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……果然是她。"
      }

    ],

    chapterFiveWhoIsShe

  );

}


// ==========================================================
// WHO IS SHE?
// ==========================================================

function chapterFiveWhoIsShe(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"“她”？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她是谁？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你认识她，对不对？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"现在还不能告诉你。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"为什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"因为如果真的是她……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"这件事就是因我而起的。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"因你而起？"
      }

    ],

    startShadowSearch

  );

}


// ==========================================================
// BEFORE SHADOW
// ==========================================================

function startShadowSearch(){

  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];


  hidePartyStatus();


  setStoryObjective(
    "湖面を調べよう"
  );


  saveStory();

}


// ==========================================================
// SHADOW AREA
// ==========================================================

function checkChapterFiveShadow(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 19 &&
    px <= 24 &&

    py >= 16 &&
    py <= 22;


  if(!inside){
    return;
  }


  CH5.shadowTriggered =
    true;


  beginChapterFiveShadowScene();

}


// ==========================================================
// BLUE SHADOW
// ==========================================================

function beginChapterFiveShadowScene(){

  CH5.step =
    6;

  STORY.step =
    6;


  setStoryObjective(
    "湖面に現れた影"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"湖面に目を向けた、その瞬間だった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"街の灯りの下を、巨大な影が横切った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"魚ではない。船でもない。細長く、異様なほど大きい。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……你看见了吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"刚才水里有东西！"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"影は水面の下で大きく曲がり、柳の影へ消えた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"那到底是什么……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……不可能。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"初めて見る表情だった。白姑娘は明らかに怯えていた。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"她真的来了……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你说的“她”到底是谁？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"你们两个，马上回去。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"不要再来西湖了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"可是你呢？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我有必须确认的事情。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那我们一起——"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"不行。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘の声は、これまで聞いたことがないほど強かった。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"这一次，听我的。"
      }

    ],

    chapterFiveFinalChoice

  );

}


// ==========================================================
// FINAL CHOICE
// Ver.1.1 FIX
// ==========================================================

function chapterFiveFinalChoice(){

  storyChoice([

    {

      jp:"あなたはいったい何者なの？",

      cn:"你到底是什么人？",

      action(){

        STORY.flags.chapter5FinalChoice =
          "identity";

        chapterFiveFinalResponse(
          "identity"
        );

      }

    },


    {

      jp:"あの影を知っているんだね",

      cn:"你认识刚才那个东西，对吧？",

      action(){

        STORY.flags.chapter5FinalChoice =
          "shadow";

        chapterFiveFinalResponse(
          "shadow"
        );

      }

    },


    {

      jp:"一人で残るのは危険だ",

      cn:"你一个人留在这里太危险了。",

      action(){

        STORY.flags.chapter5FinalChoice =
          "danger";

        chapterFiveFinalResponse(
          "danger"
        );

      }

    }

  ]);

}


// ==========================================================
// FINAL RESPONSE
// ==========================================================

function chapterFiveFinalResponse(type){

  const lines =
    [];


  if(type === "identity"){

    lines.push(

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……等这件事结束以后。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"如果还有机会，我会告诉你。"
      }

    );

  }


  if(type === "shadow"){

    lines.push(

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……认识。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"而且，我认识她很久了。"
      }

    );

  }


  if(type === "danger"){

    lines.push(

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"你是在担心我吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"谢谢。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"可是这件事……只有我能确认。"
      }

    );

  }


  lines.push(

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
      text:"小雨。"
    },

    {
      speaker:"白姑娘",
      portrait:"whiteLady",
      expression:"smile",
      text:"今天先回去吧。"
    },

    {
      speaker:"白姑娘",
      portrait:"whiteLady",
      expression:"normal",
      text:"拜托了。"
    }

  );


  storyDialogueSequence(

    lines,

    finishChapterFive

  );

}


// ==========================================================
// CHAPTER 5 END
// ==========================================================

function finishChapterFive(){

  if(
    CH5.endingTriggered
  ){
    return;
  }


  CH5.endingTriggered =
    true;


  CH5.step =
    7;

  STORY.step =
    7;

  STORY.chapterComplete =
    true;

  STORY.flags.chapter5 =
    true;

  STORY.flags.sawBlueShadow =
    true;

  STORY.flags.whiteKnowsShadow =
    true;


  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];


  hidePartyStatus();


  saveStory();


  setStoryObjective(
    "第五章　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は再び湖へ向き直った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その横顔は、武林で奶茶を飲んで笑っていた彼女とはまるで別人のようだった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"私たちはまだ知らなかった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"彼女が何者なのか。そして、湖の底にいる「彼女」が誰なのか。"
      }

    ],

    showChapterFiveEnd

  );

}


// ==========================================================
// END CARD
// ==========================================================

function showChapterFiveEnd(){

  configureEndCard(
    5,
    "第五章　完",
    "―― 西湖の夜は、静かすぎた。"
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
        "第五章クリア"
      );

    },

    3800

  );

}


console.log(
  "杭州探索録 Chapter 5 Ver.1.1 / 西湖の夜 loaded"
);
