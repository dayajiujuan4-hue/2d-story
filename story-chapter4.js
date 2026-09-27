"use strict";

/*
==========================================================
 杭州探索録
 CHAPTER 4 EXPANSION Ver.1.2

 第四章「消える人」

 読み込み順：
 story.js
 story-chapter3.js
 story-chapter4.js

 ★ Ver.1.2
 ・Ver.1.1の正常動作ロジックを維持
 ・杭州探索録（ナレーション）のみ日本語
 ・その他の登場人物の発言はすべて中国語
 ・第三章終了フラグを監視して第四章を自動開始
==========================================================
*/


// ==========================================================
// CHAPTER 4 STATE
// ==========================================================

const CH4 = {

  active:false,

  startScheduled:false,

  step:0,

  chenTriggered:false,

  rumorTriggered:false,

  secondRumorTriggered:false,

  blueClueTriggered:false,

  whiteLeavesTriggered:false,

  finalRumorTriggered:false

};


// ==========================================================
// START WATCHER
// ==========================================================

function watchChapterFourStart(){

  if(
    CH4.active ||
    CH4.startScheduled
  ){
    return;
  }


  if(
    STORY.mode !== "story"
  ){
    return;
  }


  if(
    STORY.chapter !== 3
  ){
    return;
  }


  if(
    STORY.flags.chapter3 !== true
  ){
    return;
  }


  if(
    STORY.chapterComplete !== true
  ){
    return;
  }


  CH4.startScheduled =
    true;


  setTimeout(

    ()=>{

      if(
        !CH4.active &&
        STORY.mode === "story" &&
        STORY.chapter === 3
      ){

        startChapterFour();

      }

    },

    4100

  );

}


// ==========================================================
// CHAPTER 4 START
// ==========================================================

function startChapterFour(){

  CH4.active =
    true;

  CH4.startScheduled =
    true;

  CH4.step =
    0;

  CH4.chenTriggered =
    false;

  CH4.rumorTriggered =
    false;

  CH4.secondRumorTriggered =
    false;

  CH4.blueClueTriggered =
    false;

  CH4.whiteLeavesTriggered =
    false;

  CH4.finalRumorTriggered =
    false;


  STORY.chapter =
    4;

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
  // MAP RESET
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

  STORY_NPCS.whiteLady.map =
    "food";

  STORY_NPCS.whiteLady.name =
    "白姑娘";

  STORY_NPCS.whiteLady.x =
    23*TILE;

  STORY_NPCS.whiteLady.y =
    20*TILE;

  STORY_NPCS.whiteLady.direction =
    "right";

  STORY_NPCS.whiteLady.visible =
    true;

  STORY_NPCS.whiteLady.marker =
    false;

  STORY_NPCS.whiteLady.storyInteract =
    false;

  STORY_NPCS.whiteLady.storyMoving =
    false;


  // ========================================================
  // 陈叔
  // ========================================================

  STORY_NPCS.uncleChen.map =
    "food";

  STORY_NPCS.uncleChen.x =
    17*TILE;

  STORY_NPCS.uncleChen.y =
    12*TILE;

  STORY_NPCS.uncleChen.direction =
    "right";

  STORY_NPCS.uncleChen.visible =
    false;

  STORY_NPCS.uncleChen.marker =
    false;

  STORY_NPCS.uncleChen.storyInteract =
    false;

  STORY_NPCS.uncleChen.storyMoving =
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
    "第四章",
    "消える人"
  );


  configureChapterCard(
    4,
    "消える人"
  );


  setStoryObjective(
    "いつもの武林夜市へ"
  );


  saveStory();

  showChapterCard();


  setTimeout(
    chapterFourOpening,
    1400
  );

}


// ==========================================================
// OPENING
// ==========================================================

function chapterFourOpening(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"それから、三人で武林を歩くことが少しずつ当たり前になっていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"今夜も夜市には提灯が灯り、大勢の人が行き交っている。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"白姑娘，今天还喝奶茶吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……还喝那么甜的吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"哈哈，你不是说挺好喝的吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"好喝是好喝……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"那不就行了。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"いつもと変わらない夜だった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"――少なくとも、そのときはそう思っていた。"
      }

    ],

    startChapterFourFirstWalk

  );

}


// ==========================================================
// FIRST WALK
// ==========================================================

function startChapterFourFirstWalk(){

  CH4.step =
    1;

  STORY.step =
    1;


  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

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


  showPartyStatus(
    "同行中：林小雨・白姑娘"
  );


  setStoryObjective(
    "三人で陈叔の焼烤屋台へ行こう"
  );


  saveStory();

}


// ==========================================================
// CHAPTER 4 EVENT UPDATE
// ==========================================================

function updateChapterFour(){

  watchChapterFourStart();


  if(
    !CH4.active ||
    STORY.chapter !== 4
  ){
    return;
  }


  if(
    dialogue.active ||
    STORY.choiceOpen
  ){
    return;
  }


  // 陈叔
  if(
    CH4.step === 1 &&
    !CH4.chenTriggered &&
    currentMapId === "food"
  ){

    checkChapterFourChen();

    return;

  }


  // 最初の失踪の噂
  if(
    CH4.step === 2 &&
    !CH4.rumorTriggered &&
    currentMapId === "food"
  ){

    checkChapterFourRumor();

    return;

  }


  // 二つ目の噂
  if(
    CH4.step === 3 &&
    !CH4.secondRumorTriggered &&
    currentMapId === "food"
  ){

    checkChapterFourSecondRumor();

    return;

  }


  // 青い影
  if(
    CH4.step === 4 &&
    !CH4.blueClueTriggered &&
    currentMapId === "food"
  ){

    checkChapterFourBlueClue();

    return;

  }

}


// ==========================================================
// UPDATE HOOK
// ==========================================================

const CH4_originalUpdateStoryEvents =
  updateStoryEvents;


updateStoryEvents =
function(){

  CH4_originalUpdateStoryEvents();

  updateChapterFour();

};


// ==========================================================
// CHEN AREA
// ==========================================================

function checkChapterFourChen(){

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


  CH4.chenTriggered =
    true;


  beginChapterFourChenScene();

}


// ==========================================================
// CHEN SCENE
// ==========================================================

function beginChapterFourChenScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH4.step =
    2;

  STORY.step =
    2;


  STORY_NPCS.xiaoyu.x =
    19*TILE;

  STORY_NPCS.xiaoyu.y =
    15*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";

  STORY_NPCS.xiaoyu.storyMoving =
    false;


  STORY_NPCS.whiteLady.x =
    20*TILE;

  STORY_NPCS.whiteLady.y =
    15*TILE;

  STORY_NPCS.whiteLady.direction =
    "left";

  STORY_NPCS.whiteLady.storyMoving =
    false;


  STORY_NPCS.uncleChen.visible =
    true;


  setStoryObjective(
    "陈叔の焼烤屋台"
  );


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"陈叔！我们又来了。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"哟，又是你们三个。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"今天吃点什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我想吃上次那个。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"你学得还挺快嘛。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"说起来……"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"今天少了个人。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"谁？"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"有个姓赵的老顾客。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"他几乎每天晚上都来。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"昨天没来，今天也没来。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"可能有事吧。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"可能吧。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"不过他连电话也不接。"
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
        text:"怎么了？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"没什么。"
      }

    ],

    restartChapterFourWalkAfterChen

  );

}


// ==========================================================
// WALK AFTER CHEN
// ==========================================================

function restartChapterFourWalkAfterChen(){

  STORY_NPCS.uncleChen.visible =
    false;


  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y +
    TILE*2;


  showPartyStatus(
    "同行中：林小雨・白姑娘"
  );


  setStoryObjective(
    "夜市をもう少し歩こう"
  );


  saveStory();

}


// ==========================================================
// FIRST RUMOR AREA
// ==========================================================

function checkChapterFourRumor(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 27 &&
    px <= 39 &&

    py >= 18 &&
    py <= 26;


  if(!inside){
    return;
  }


  CH4.rumorTriggered =
    true;


  beginChapterFourRumor();

}


// ==========================================================
// FIRST RUMOR
// ==========================================================

function beginChapterFourRumor(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH4.step =
    3;

  STORY.step =
    3;


  setStoryObjective(
    "夜市で聞こえた話"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"人混みを歩いていると、近くにいた二人の話し声が耳に入った。"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"normal",
        text:"听说了吗？昨晚有人失踪了。"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"surprised",
        text:"失踪？在这里？"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"normal",
        text:"不知道。"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"normal",
        text:"听说最后有人看见他往西湖那边去了。"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"西湖？"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"normal",
        text:"嗯。之后就联系不上了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"陈叔说的那个人，不会就是……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"只是碰巧吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"嗯？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"杭州这么大。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"每天都会发生很多事。"
      }

    ],

    restartChapterFourWalkAfterRumor

  );

}


// ==========================================================
// WALK AFTER FIRST RUMOR
// ==========================================================

function restartChapterFourWalkAfterRumor(){

  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y +
    TILE*2;


  showPartyStatus(
    "同行中：林小雨・白姑娘"
  );


  setStoryObjective(
    "夜市の南側へ行ってみよう"
  );


  saveStory();

}


// ==========================================================
// SECOND RUMOR AREA
// ==========================================================

function checkChapterFourSecondRumor(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 17 &&
    px <= 37 &&

    py >= 27 &&
    py <= 34;


  if(!inside){
    return;
  }


  CH4.secondRumorTriggered =
    true;


  beginChapterFourSecondRumor();

}


// ==========================================================
// SECOND RUMOR
// ==========================================================

function beginChapterFourSecondRumor(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH4.step =
    4;

  STORY.step =
    4;


  setStoryObjective(
    "もう一つの噂"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"南側の屋台でも、似たような話が聞こえてきた。"
      },

      {
        speaker:"屋台の店主",
        portrait:"vendorWoman",
        expression:"normal",
        text:"最近晚上还是早点回去吧。"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"normal",
        text:"怎么了？"
      },

      {
        speaker:"屋台の店主",
        portrait:"vendorWoman",
        expression:"normal",
        text:"这两天好像不止一个人联系不上。"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"surprised",
        text:"还有别人？"
      },

      {
        speaker:"屋台の店主",
        portrait:"vendorWoman",
        expression:"normal",
        text:"我也是听别人说的。"
      },

      {
        speaker:"屋台の店主",
        portrait:"vendorWoman",
        expression:"normal",
        text:"不知道是真是假。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……这就有点奇怪了。"
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
        text:"白姑娘？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我没事。"
      }

    ],

    restartChapterFourWalkForBlueClue

  );

}


// ==========================================================
// WALK TO BLUE CLUE
// ==========================================================

function restartChapterFourWalkForBlueClue(){

  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y +
    TILE;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y +
    TILE*2;


  showPartyStatus(
    "同行中：林小雨・白姑娘"
  );


  setStoryObjective(
    "夜市の中央へ戻ろう"
  );


  saveStory();

}


// ==========================================================
// BLUE CLUE AREA
// ==========================================================

function checkChapterFourBlueClue(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 20 &&
    px <= 32 &&

    py >= 18 &&
    py <= 25;


  if(!inside){
    return;
  }


  CH4.blueClueTriggered =
    true;


  beginBlueClueScene();

}


// ==========================================================
// BLUE CLUE
// ==========================================================

function beginBlueClueScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH4.step =
    5;

  STORY.step =
    5;


  setStoryObjective(
    "青い影"
  );


  storyDialogueSequence(

    [

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"对了，昨天晚上我在西湖附近……"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"normal",
        text:"怎么了？"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"我在湖边看见了一个奇怪的东西。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"什么东西？"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"我也没看清楚。"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"好像有个很大的东西在水边动。"
      },

      {
        speaker:"夜市の客",
        portrait:"student",
        expression:"surprised",
        text:"很大的东西？"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"嗯。看起来好像是青色的。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……青色的？"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘の声が、それまでより少し強くなった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"怎么了？"
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
        text:"你确定是青色的吗？"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"天太黑了，我也不太确定……"
      },

      {
        speaker:"夜市の客",
        portrait:"tourist",
        expression:"normal",
        text:"不过，我觉得应该是。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……这样啊。"
      }

    ],

    beginWhiteLadyUnease

  );

}


// ==========================================================
// WHITE LADY UNEASE
// ==========================================================

function beginWhiteLadyUnease(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白姑娘。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"嗯？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你是不是知道什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……不知道。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"可是刚才你——"
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
        expression:"surprised",
        text:"嗯？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"今天……我先回去了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"现在？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"嗯。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"怎么突然……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"没事。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"只是今天有点累了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……好吧。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"明天见。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"明天见。"
      }

    ],

    whiteLadyLeaves

  );

}


// ==========================================================
// WHITE LADY LEAVES
// ==========================================================

function whiteLadyLeaves(){

  CH4.whiteLeavesTriggered =
    true;


  hideStoryNPC(
    "whiteLady"
  );


  STORY.partyActive =
    false;

  STORY.partyType =
    null;

  STORY.playerTrail =
    [];


  hidePartyStatus();


  setStoryObjective(
    "白姑娘を見送る"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は人混みの中へ歩いていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"前の夜とは違い、彼女は一度も振り返らなかった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她肯定知道些什么。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我还是第一次看到她这个样子。"
      }

    ],

    beginFinalRumor

  );

}


// ==========================================================
// FINAL RUMOR
// ==========================================================

function beginFinalRumor(){

  CH4.finalRumorTriggered =
    true;


  setStoryObjective(
    "西湖から来た噂"
  );


  setTimeout(

    ()=>{

      storyDialogueSequence(

        [

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"そのとき、近くを通り過ぎた二人の声が聞こえた。"
          },

          {
            speaker:"夜市の客",
            portrait:"student",
            expression:"normal",
            text:"你听说西湖那件事了吗？"
          },

          {
            speaker:"夜市の客",
            portrait:"tourist",
            expression:"normal",
            text:"什么？"
          },

          {
            speaker:"夜市の客",
            portrait:"student",
            expression:"normal",
            text:"昨天晚上，有人说在湖边看见了一条蛇。"
          },

          {
            speaker:"夜市の客",
            portrait:"tourist",
            expression:"surprised",
            text:"蛇？"
          },

          {
            speaker:"夜市の客",
            portrait:"student",
            expression:"normal",
            text:"嗯。"
          },

          {
            speaker:"夜市の客",
            portrait:"student",
            expression:"normal",
            text:"很大的蛇。"
          },

          {
            speaker:"夜市の客",
            portrait:"student",
            expression:"normal",
            text:"听说……是青色的。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"小雨は何も言わなかった。"
          },

          {
            speaker:"杭州探索録",
            portrait:"tourist",
            expression:"normal",
            text:"ただ、白姑娘が消えていった方向を見つめていた。"
          }

        ],

        finishChapterFour

      );

    },

    500

  );

}


// ==========================================================
// CHAPTER 4 END
// ==========================================================

function finishChapterFour(){

  CH4.step =
    6;

  STORY.step =
    6;

  STORY.chapterComplete =
    true;

  STORY.flags.chapter4 =
    true;

  STORY.flags.missingPeopleRumor =
    true;

  STORY.flags.blueSnakeRumor =
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
    "第四章　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は、何を知っていたのだろう。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"そして、西湖の近くで目撃されたという青い影は何だったのか。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"賑やかな武林の夜に、目に見えない何かが少しずつ近づいていた。"
      }

    ],

    showChapterFourEnd

  );

}


// ==========================================================
// END CARD
// ==========================================================

function showChapterFourEnd(){

  configureEndCard(
    4,
    "第四章　完",
    "―― 西湖の水辺で、青い影が揺れていた。"
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
        "第四章クリア"
      );

    },

    3600

  );

}


console.log(
  "杭州探索録 Chapter 4 Ver.1.2 / 消える人 loaded"
);
