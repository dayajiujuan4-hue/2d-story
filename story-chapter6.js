"use strict";

/*
==========================================================
 杭州探索録
 CHAPTER 6 EXPANSION Ver.1.0

 第六章「白蛇伝」

 ★ 言語ルール
 ・杭州探索録 → 日本語
 ・登場人物 → 中国語
 ・主人公の選択肢 → jp / cn

 ★ 第六章
 ・第五章終了後に開始
 ・小雨と西湖を調査
 ・「西湖の伝説」を調べる
 ・雷峰塔の写真を見る
 ・白姑娘との共通点に気づく
 ・白姑娘を探す
 ・白姑娘の正体が明らかになる
 ・青い影＝青蛇だと判明
 ・青蛇の目的はまだ完全には明かさない
==========================================================
*/


// ==========================================================
// STATE
// ==========================================================

const CH6 = {

  active:false,

  startScheduled:false,

  step:0,

  lastMapId:null,

  legendTriggered:false,

  towerTriggered:false,

  realizationTriggered:false,

  whiteTriggered:false,

  revealTriggered:false,

  endingTriggered:false

};


// ==========================================================
// START WATCHER
// ==========================================================

function watchChapterSixStart(){

  if(
    CH6.active ||
    CH6.startScheduled
  ){
    return;
  }


  if(
    STORY.mode !== "story"
  ){
    return;
  }


  if(
    STORY.chapter !== 5
  ){
    return;
  }


  if(
    STORY.flags.chapter5 !== true
  ){
    return;
  }


  if(
    STORY.chapterComplete !== true
  ){
    return;
  }


  CH6.startScheduled =
    true;


  setTimeout(

    ()=>{

      if(
        !CH6.active &&
        STORY.mode === "story" &&
        STORY.chapter === 5
      ){

        startChapterSix();

      }

    },

    4400

  );

}


// ==========================================================
// START CHAPTER 6
// ==========================================================

function startChapterSix(){

  CH6.active =
    true;

  CH6.startScheduled =
    true;

  CH6.step =
    0;

  CH6.lastMapId =
    "lake";

  CH6.legendTriggered =
    false;

  CH6.towerTriggered =
    false;

  CH6.realizationTriggered =
    false;

  CH6.whiteTriggered =
    false;

  CH6.revealTriggered =
    false;

  CH6.endingTriggered =
    false;


  STORY.chapter =
    6;

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
  // 西湖から開始
  // ========================================================

  currentMapId =
    "lake";


  player.x =
    27*TILE;

  player.y =
    8*TILE;

  player.direction =
    "down";

  player.moving =
    false;


  // ========================================================
  // 小雨
  // ========================================================

  STORY_NPCS.xiaoyu.map =
    "lake";

  STORY_NPCS.xiaoyu.x =
    25*TILE;

  STORY_NPCS.xiaoyu.y =
    8*TILE;

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
  // 白姑娘はまだ出さない
  // ========================================================

  STORY_NPCS.whiteLady.map =
    "lake";

  STORY_NPCS.whiteLady.visible =
    false;

  STORY_NPCS.whiteLady.marker =
    false;

  STORY_NPCS.whiteLady.storyInteract =
    false;

  STORY_NPCS.whiteLady.storyMoving =
    false;


  STORY_NPCS.uncleChen.visible =
    false;


  camera.x =
    player.x -
    canvas.width/2;

  camera.y =
    player.y -
    canvas.height/2;

  clampCamera();


  setChapterLabel(
    "第六章",
    "白蛇伝"
  );


  configureChapterCard(
    6,
    "白蛇伝"
  );


  setStoryObjective(
    "翌日の西湖"
  );


  saveStory();

  showChapterCard();


  setTimeout(
    chapterSixOpening,
    1400
  );

}


// ==========================================================
// OPENING
// ==========================================================

function chapterSixOpening(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"翌日の夕方、私は再び小雨と西湖を訪れた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"昨夜、白姑娘から「もう西湖へ来るな」と言われたばかりだった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我想了一晚上。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"越想越觉得不对劲。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她认识水里的那个东西。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"而且她还说，这件事是因她而起的。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"所以……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"她越不让我们来，我就越想弄清楚。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"いかにも小雨らしい答えだった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我们先从西湖本身查起吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"这里的传说那么多，说不定会有什么线索。"
      }

    ],

    startChapterSixInvestigation

  );

}


// ==========================================================
// INVESTIGATION START
// ==========================================================

function startChapterSixInvestigation(){

  CH6.step =
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
    "lake";


  showPartyStatus();


  setStoryObjective(
    "西湖の南側で伝説を調べよう"
  );


  saveStory();

}


// ==========================================================
// UPDATE
// ==========================================================

function updateChapterSix(){

  watchChapterSixStart();


  if(
    !CH6.active ||
    STORY.chapter !== 6
  ){
    return;
  }


  handleChapterSixMapChange();


  if(
    dialogue.active ||
    STORY.choiceOpen
  ){
    return;
  }


  // --------------------------------------------------------
  // 西湖の伝説
  // 実マップ (30,30)
  // --------------------------------------------------------

  if(
    CH6.step === 1 &&
    !CH6.legendTriggered &&
    currentMapId === "lake"
  ){

    checkChapterSixLegend();

    return;

  }


  // --------------------------------------------------------
  // 雷峰塔
  // 実マップ (25,31)
  // --------------------------------------------------------

  if(
    CH6.step === 2 &&
    !CH6.towerTriggered &&
    currentMapId === "lake"
  ){

    checkChapterSixTower();

    return;

  }


  // --------------------------------------------------------
  // 白姑娘を探す
  // --------------------------------------------------------

  if(
    CH6.step === 3 &&
    !CH6.whiteTriggered &&
    currentMapId === "lake"
  ){

    checkChapterSixWhiteLady();

    return;

  }

}


// ==========================================================
// UPDATE HOOK
// ==========================================================

const CH6_originalUpdateStoryEvents =
  updateStoryEvents;


updateStoryEvents =
function(){

  CH6_originalUpdateStoryEvents();

  updateChapterSix();

};


// ==========================================================
// MAP CHANGE
// ==========================================================

function handleChapterSixMapChange(){

  if(
    CH6.lastMapId === currentMapId
  ){
    return;
  }


  CH6.lastMapId =
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
// LEGEND AREA
// ==========================================================

function checkChapterSixLegend(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  /*
    「西湖の伝説を読む」
    実座標 (30,30)
  */

  const inside =

    px >= 27 &&
    px <= 33 &&

    py >= 27 &&
    py <= 33;


  if(!inside){
    return;
  }


  CH6.legendTriggered =
    true;


  beginChapterSixLegend();

}


// ==========================================================
// LEGEND EVENT
// ==========================================================

function beginChapterSixLegend(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH6.step =
    2;

  STORY.step =
    2;


  STORY_NPCS.xiaoyu.x =
    32*TILE;

  STORY_NPCS.xiaoyu.y =
    29*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";


  setStoryObjective(
    "西湖に残る伝説"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"湖畔に、西湖にまつわる伝説を紹介する案内があった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"这里写了好多西湖的传说。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"梁山伯与祝英台……济公……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"还有……白蛇传。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨の指が、その文字の上で止まった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"这个你知道吧？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白娘子和许仙的故事。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白娘子本来是一条白蛇，后来变成了人的样子。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"故事里还有一条青蛇。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"大家一般叫她小青。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"青い蛇。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"昨夜、西湖の水面を横切った巨大な青い影が頭をよぎった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……等等。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"青蛇？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不会吧……"
      }

    ],

    restartChapterSixAfterLegend

  );

}


// ==========================================================
// AFTER LEGEND
// ==========================================================

function restartChapterSixAfterLegend(){

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


  showPartyStatus();


  setStoryObjective(
    "近くにある塔の写真を調べよう"
  );


  saveStory();

}


// ==========================================================
// TOWER AREA
// ==========================================================

function checkChapterSixTower(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  /*
    「塔の写真を見る」
    実座標 (25,31)
  */

  const inside =

    px >= 22 &&
    px <= 28 &&

    py >= 28 &&
    py <= 34;


  if(!inside){
    return;
  }


  CH6.towerTriggered =
    true;


  beginChapterSixTower();

}


// ==========================================================
// LEIFENG TOWER
// ==========================================================

function beginChapterSixTower(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH6.step =
    3;

  STORY.step =
    3;


  STORY_NPCS.xiaoyu.x =
    27*TILE;

  STORY_NPCS.xiaoyu.y =
    31*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";


  setStoryObjective(
    "雷峰塔"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"少し離れた場所に、雷峰塔の写真が掲示されていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"雷峰塔……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白蛇传里，白娘子最后就是被压在雷峰塔下面的。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その名前を聞いた瞬間、これまでの白姑娘の言葉が次々と思い出された。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"「杭州变了很多。」"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"「我很久没出来了。」"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"初めて見るスマートフォン。QRコード決済への戸惑い。そして、古い杭州を知っているような言葉。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……不会吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"穿白衣服……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不知道手机怎么用……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"还说自己很久没出来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"而且她认识那条青色的蛇。"
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
        expression:"surprised",
        text:"难道……"
      }

    ],

    chapterSixRealizationChoice

  );

}


// ==========================================================
// REALIZATION CHOICE
// ==========================================================

function chapterSixRealizationChoice(){

  storyChoice([

    {
      jp:"白姑娘は、白娘子なのかもしれない",
      cn:"白姑娘……也许就是白娘子。",
      action(){

        STORY.flags.chapter6Guess =
          "whiteSnake";

        chapterSixAfterRealization();

      }
    },

    {
      jp:"青い影は、青蛇なのかもしれない",
      cn:"昨天那个青色的影子……也许就是青蛇。",
      action(){

        STORY.flags.chapter6Guess =
          "greenSnake";

        chapterSixAfterRealization();

      }
    },

    {
      jp:"二人は知り合いなのかもしれない",
      cn:"她们两个……也许本来就认识。",
      action(){

        STORY.flags.chapter6Guess =
          "connection";

        chapterSixAfterRealization();

      }
    }

  ]);

}


// ==========================================================
// AFTER REALIZATION
// ==========================================================

function chapterSixAfterRealization(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……我也在想这个。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"虽然听起来太离谱了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"可是到现在为止发生的事，本来就已经够离谱了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我们去问她。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"这次不能再让她一句“没什么”就糊弄过去了。"
      }

    ],

    startChapterSixWhiteSearch

  );

}


// ==========================================================
// SEARCH WHITE LADY
// ==========================================================

function startChapterSixWhiteSearch(){

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


  showPartyStatus();


  setStoryObjective(
    "湖畔で白姑娘を探そう"
  );


  saveStory();

}


// ==========================================================
// WHITE LADY AREA
// ==========================================================

function checkChapterSixWhiteLady(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  /*
    柳・水面付近へ戻る
  */

  const inside =

    px >= 18 &&
    px <= 25 &&

    py >= 14 &&
    py <= 23;


  if(!inside){
    return;
  }


  CH6.whiteTriggered =
    true;


  beginChapterSixWhiteLady();

}


// ==========================================================
// WHITE LADY APPEARS
// ==========================================================

function beginChapterSixWhiteLady(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH6.step =
    4;

  STORY.step =
    4;


  STORY_NPCS.whiteLady.map =
    "lake";

  STORY_NPCS.whiteLady.name =
    "白姑娘";

  STORY_NPCS.whiteLady.x =
    21*TILE;

  STORY_NPCS.whiteLady.y =
    18*TILE;

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


  STORY_NPCS.xiaoyu.x =
    24*TILE;

  STORY_NPCS.xiaoyu.y =
    18*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";


  setStoryObjective(
    "白姑娘に真実を聞く"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"昨夜と同じ場所に、白姑娘は立っていた。"
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
        text:"嗯。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我不是让你们不要再来西湖了吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"因为你什么都不告诉我们。"
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
        text:"我们刚才看了白蛇传的介绍。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その言葉に、白姑娘の表情がわずかに変わった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"还有雷峰塔。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……雷峰塔。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白姑娘。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我问你一件事。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你到底是谁？"
      }

    ],

    chapterSixIdentityChoice

  );

}


// ==========================================================
// IDENTITY CHOICE
// ==========================================================

function chapterSixIdentityChoice(){

  storyChoice([

    {
      jp:"あなたは白娘子なの？",
      cn:"你……就是白娘子吗？",
      action(){

        STORY.flags.chapter6IdentityQuestion =
          "direct";

        chapterSixReveal();

      }
    },

    {
      jp:"あなたも人間ではないの？",
      cn:"你……也不是普通人，对吗？",
      action(){

        STORY.flags.chapter6IdentityQuestion =
          "human";

        chapterSixReveal();

      }
    },

    {
      jp:"雷峰塔と関係があるの？",
      cn:"你和雷峰塔……有什么关系？",
      action(){

        STORY.flags.chapter6IdentityQuestion =
          "tower";

        chapterSixReveal();

      }
    }

  ]);

}


// ==========================================================
// REVEAL
// ==========================================================

function chapterSixReveal(){

  if(
    CH6.revealTriggered
  ){
    return;
  }


  CH6.revealTriggered =
    true;


  storyDialogueSequence(

    [

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘はしばらく何も言わなかった。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"你们已经猜到了，对吧。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"所以……是真的？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"你们现在叫我“白姑娘”。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"很久以前，也有人叫我白娘子。"
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
        expression:"surprised",
        text:"真的？！"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"你不是已经猜到了吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"猜到是一回事，你亲口承认又是另一回事啊！"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨らしい反応に、白姑娘はほんの少しだけ笑った。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那昨天水里的那个……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"是小青。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"青蛇？"
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
        text:"她发现我出来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"出来？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我不是每天晚上都能出来的。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"只是偶尔……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"趁没人注意的时候，偷偷出来看看。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"所以你每天晚上跑去武林……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"那里很热闹。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我喜欢那里。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"喜欢听人说话。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"喜欢看大家吃东西、笑、吵架、等人。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"也喜欢看老板收摊。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"第三章の夜、彼女が語った言葉と同じだった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"可是小青为什么要把人带走？"
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
        text:"那些失踪的人，真的是她带走的吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……是。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"为什么？！"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"因为她想让我回去。"
      }

    ],

    chapterSixWhyChoice

  );

}


// ==========================================================
// WHY?
// ==========================================================

function chapterSixWhyChoice(){

  storyChoice([

    {
      jp:"どこへ戻るの？",
      cn:"回哪里？",
      action(){

        STORY.flags.chapter6Question =
          "where";

        chapterSixFinalConversation();

      }
    },

    {
      jp:"なぜ人間をさらえば戻ると思うの？",
      cn:"为什么把人带走，你就会回去？",
      action(){

        STORY.flags.chapter6Question =
          "why";

        chapterSixFinalConversation();

      }
    },

    {
      jp:"青蛇はあなたを連れ戻したいの？",
      cn:"小青是想把你带回去吗？",
      action(){

        STORY.flags.chapter6Question =
          "xiaoqing";

        chapterSixFinalConversation();

      }
    }

  ]);

}


// ==========================================================
// FINAL CONVERSATION
// ==========================================================

function chapterSixFinalConversation(){

  storyDialogueSequence(

    [

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"小青一直觉得，我不应该再和人间有关系。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"她不是在恨你们。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"她只是……太怕我再次失去什么。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"可是这和那些人有什么关系？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"因为她知道。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"只要这里还像以前一样热闹……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我就还会想出来。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"所以她想让这里变得不再适合我留下。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その言葉の意味を理解するまで、少し時間がかかった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"人が消えれば、噂が広がる。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"噂が広がれば、人は夜の武林や西湖から離れていく。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"そして白姑娘が好きだった「人間の夜」そのものが失われていく。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那你打算怎么办？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……我还不知道。"
      },

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
        text:"让我再想一晚吧。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"明天……我们还在武林见。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"真的？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"嗯。"
      }

    ],

    finishChapterSix

  );

}


// ==========================================================
// CHAPTER END
// ==========================================================

function finishChapterSix(){

  if(
    CH6.endingTriggered
  ){
    return;
  }


  CH6.endingTriggered =
    true;


  CH6.step =
    5;

  STORY.step =
    5;

  STORY.chapterComplete =
    true;


  STORY.flags.chapter6 =
    true;

  STORY.flags.whiteLadyIdentityRevealed =
    true;

  STORY.flags.blueSnakeIdentityRevealed =
    true;

  STORY.flags.xiaoqingTakingPeople =
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
    "第六章　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘――白娘子は、静かな西湖の前に立っていた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"伝説の中の存在だと思っていた彼女は、奶茶の甘さに驚き、写真を珍しがり、武林の夜を愛していた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"そして今、その大好きな場所から少しずつ人が消え始めている。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"明日の夜、彼女はどんな答えを出すのだろう。"
      }

    ],

    showChapterSixEnd

  );

}


// ==========================================================
// END CARD
// ==========================================================

function showChapterSixEnd(){

  configureEndCard(
    6,
    "第六章　完",
    "―― 伝説は、まだ終わっていなかった。"
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
        "第六章クリア"
      );

    },

    4000

  );

}


console.log(
  "杭州探索録 Chapter 6 Ver.1.0 / 白蛇伝 loaded"
);
