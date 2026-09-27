"use strict";

/*
==========================================================
 杭州探索録
 CHAPTER 7 EXPANSION Ver.1.0

 第七章「灯りの消える夜」

 読み込み順：
 story.js
 story-chapter3.js
 story-chapter4.js
 story-chapter5.js
 story-chapter6.js
 story-chapter7.js

 ★ 言語ルール
 ・杭州探索録 → 日本語
 ・登場人物 → 中国語
 ・主人公の選択肢 → 日本語＋中国語（jp / cn）

 ★ 第七章
 ・武林夜市へ戻る
 ・失踪事件の噂で客が減っている
 ・陈叔の屋台を訪れる
 ・白娘子が「自分がいることで夜市が壊れていく」と気づく
 ・三人で最後のような普通の夜を過ごす
 ・三人で撮った写真を再び見る
 ・白娘子が「明日は来ない」と告げる
 ・雷峰塔への決断を匂わせて終了
==========================================================
*/


// ==========================================================
// STATE
// ==========================================================

const CH7 = {

  active:false,

  startScheduled:false,

  step:0,

  lastMapId:null,

  quietTriggered:false,

  chenTriggered:false,

  walkTriggered:false,

  photoTriggered:false,

  decisionTriggered:false,

  endingTriggered:false

};


// ==========================================================
// START WATCHER
// ==========================================================

function watchChapterSevenStart(){

  if(
    CH7.active ||
    CH7.startScheduled
  ){
    return;
  }


  if(
    STORY.mode !== "story"
  ){
    return;
  }


  if(
    STORY.chapter !== 6
  ){
    return;
  }


  if(
    STORY.flags.chapter6 !== true
  ){
    return;
  }


  if(
    STORY.chapterComplete !== true
  ){
    return;
  }


  CH7.startScheduled =
    true;


  setTimeout(

    ()=>{

      if(
        !CH7.active &&
        STORY.mode === "story" &&
        STORY.chapter === 6
      ){

        startChapterSeven();

      }

    },

    4500

  );

}


// ==========================================================
// START CHAPTER
// ==========================================================

function startChapterSeven(){

  CH7.active =
    true;

  CH7.startScheduled =
    true;

  CH7.step =
    0;

  CH7.lastMapId =
    "food";

  CH7.quietTriggered =
    false;

  CH7.chenTriggered =
    false;

  CH7.walkTriggered =
    false;

  CH7.photoTriggered =
    false;

  CH7.decisionTriggered =
    false;

  CH7.endingTriggered =
    false;


  STORY.chapter =
    7;

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
  // 武林夜市
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
    "第七章",
    "灯りの消える夜"
  );


  configureChapterCard(
    7,
    "灯りの消える夜"
  );


  setStoryObjective(
    "三人で武林夜市へ"
  );


  saveStory();

  showChapterCard();


  setTimeout(
    chapterSevenOpening,
    1400
  );

}


// ==========================================================
// OPENING
// ==========================================================

function chapterSevenOpening(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"翌日の夜。約束どおり、三人は武林で再び顔を合わせた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你真的来了。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我答应过你。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"我还以为你会偷偷跑掉呢。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我有那么不守信用吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"有一点。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"……"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"一瞬だけ、以前の三人に戻ったような気がした。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"しかし、歩き始めてすぐに違和感に気づいた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"武林の夜が、静かだった。"
      }

    ],

    startChapterSevenFirstWalk

  );

}


// ==========================================================
// FIRST WALK
// ==========================================================

function startChapterSevenFirstWalk(){

  CH7.step =
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
    "food";

  STORY_NPCS.xiaoyu.visible =
    true;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y +
    TILE*2;

  STORY_NPCS.whiteLady.map =
    "food";

  STORY_NPCS.whiteLady.visible =
    true;


  showPartyStatus();


  setStoryObjective(
    "いつもの夜市を歩いてみよう"
  );


  saveStory();

}


// ==========================================================
// UPDATE
// ==========================================================

function updateChapterSeven(){

  watchChapterSevenStart();


  if(
    !CH7.active ||
    STORY.chapter !== 7
  ){
    return;
  }


  handleChapterSevenMapChange();


  if(
    dialogue.active ||
    STORY.choiceOpen
  ){
    return;
  }


  // --------------------------------------------------------
  // 夜市の異変
  // --------------------------------------------------------

  if(
    CH7.step === 1 &&
    !CH7.quietTriggered &&
    currentMapId === "food"
  ){

    checkChapterSevenQuietScene();

    return;

  }


  // --------------------------------------------------------
  // 陈叔
  // --------------------------------------------------------

  if(
    CH7.step === 2 &&
    !CH7.chenTriggered &&
    currentMapId === "food"
  ){

    checkChapterSevenChen();

    return;

  }


  // --------------------------------------------------------
  // 南側
  // --------------------------------------------------------

  if(
    CH7.step === 3 &&
    !CH7.walkTriggered &&
    currentMapId === "food"
  ){

    checkChapterSevenEmptyMarket();

    return;

  }


  // --------------------------------------------------------
  // 写真
  // --------------------------------------------------------

  if(
    CH7.step === 4 &&
    !CH7.photoTriggered &&
    currentMapId === "food"
  ){

    checkChapterSevenPhoto();

    return;

  }

}


// ==========================================================
// UPDATE HOOK
// ==========================================================

const CH7_originalUpdateStoryEvents =
  updateStoryEvents;


updateStoryEvents =
function(){

  CH7_originalUpdateStoryEvents();

  updateChapterSeven();

};


// ==========================================================
// MAP CHANGE
// ==========================================================

function handleChapterSevenMapChange(){

  if(
    CH7.lastMapId === currentMapId
  ){
    return;
  }


  CH7.lastMapId =
    currentMapId;


  STORY.playerTrail =
    [];


  if(
    STORY.partyActive
  ){

    STORY_NPCS.xiaoyu.map =
      currentMapId;

    STORY_NPCS.xiaoyu.x =
      player.x;

    STORY_NPCS.xiaoyu.y =
      player.y + TILE;

    STORY_NPCS.xiaoyu.visible =
      true;


    if(
      STORY.partyType === "trio"
    ){

      STORY_NPCS.whiteLady.map =
        currentMapId;

      STORY_NPCS.whiteLady.x =
        player.x;

      STORY_NPCS.whiteLady.y =
        player.y + TILE*2;

      STORY_NPCS.whiteLady.visible =
        true;

    }

  }

}


// ==========================================================
// QUIET NIGHT MARKET
// ==========================================================

function checkChapterSevenQuietScene(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  const inside =

    px >= 20 &&
    px <= 33 &&

    py >= 17 &&
    py <= 26;


  if(!inside){
    return;
  }


  CH7.quietTriggered =
    true;


  beginChapterSevenQuietScene();

}


// ==========================================================
// QUIET SCENE
// ==========================================================

function beginChapterSevenQuietScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH7.step =
    2;

  STORY.step =
    2;


  STORY_NPCS.xiaoyu.x =
    player.x + TILE;

  STORY_NPCS.xiaoyu.y =
    player.y;


  STORY_NPCS.whiteLady.x =
    player.x - TILE;

  STORY_NPCS.whiteLady.y =
    player.y;


  setStoryObjective(
    "静かになった武林"
  );


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"……人真的少了很多。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"嗯。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"屋台の灯りはいつもと同じだった。だが、その前に立つ人の数が明らかに少ない。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"笑い声も、呼び込みの声も、以前より遠く感じた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"网上已经传开了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"有人说晚上不要来武林，也不要靠近西湖。"
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
        text:"还有人说，看见过很大的蛇。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我知道。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は人の少ない夜市を、黙って見つめていた。"
      }

    ],

    restartChapterSevenToChen

  );

}


// ==========================================================
// GO TO CHEN
// ==========================================================

function restartChapterSevenToChen(){

  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y + TILE;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y + TILE*2;


  showPartyStatus();


  setStoryObjective(
    "陈叔の屋台へ行こう"
  );


  saveStory();

}


// ==========================================================
// CHEN AREA
// ==========================================================

function checkChapterSevenChen(){

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


  CH7.chenTriggered =
    true;


  beginChapterSevenChen();

}


// ==========================================================
// CHEN SCENE
// ==========================================================

function beginChapterSevenChen(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH7.step =
    3;

  STORY.step =
    3;


  STORY_NPCS.uncleChen.visible =
    true;

  STORY_NPCS.uncleChen.x =
    17*TILE;

  STORY_NPCS.uncleChen.y =
    12*TILE;


  STORY_NPCS.xiaoyu.x =
    19*TILE;

  STORY_NPCS.xiaoyu.y =
    15*TILE;


  STORY_NPCS.whiteLady.x =
    20*TILE;

  STORY_NPCS.whiteLady.y =
    15*TILE;


  setStoryObjective(
    "陈叔の屋台"
  );


  storyDialogueSequence(

    [

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"你们来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"陈叔，今天怎么这么安静？"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"还能为什么。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"最近那些传闻闹得太厉害了。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"很多人天一黑就不来了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"生意影响很大吗？"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"当然。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"旁边已经有两家今天提前收摊了。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"再这样下去，不知道会变成什么样。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"normal",
        text:"白姑娘，你今天怎么这么安静？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"没什么。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"是不是今天不想吃烤串了？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"想吃。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"那就好。"
      },

      {
        speaker:"陈叔",
        portrait:"uncleChen",
        expression:"smile",
        text:"至少还有你们几个老顾客。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その言葉を聞いた瞬間、白姑娘の笑顔が少しだけ曇った。"
      }

    ],

    chapterSevenAfterChen

  );

}


// ==========================================================
// AFTER CHEN
// ==========================================================

function chapterSevenAfterChen(){

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
    player.y + TILE;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y + TILE*2;


  showPartyStatus();


  setStoryObjective(
    "三人でもう少し夜市を歩こう"
  );


  saveStory();

}


// ==========================================================
// EMPTY MARKET AREA
// ==========================================================

function checkChapterSevenEmptyMarket(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  const inside =

    px >= 18 &&
    px <= 36 &&

    py >= 27 &&
    py <= 34;


  if(!inside){
    return;
  }


  CH7.walkTriggered =
    true;


  beginChapterSevenEmptyMarket();

}


// ==========================================================
// EMPTY MARKET SCENE
// ==========================================================

function beginChapterSevenEmptyMarket(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH7.step =
    4;

  STORY.step =
    4;


  setStoryObjective(
    "人の少ない夜市"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"夜市の南側へ進むほど、人影はさらに少なくなった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"以前は人を避けながら歩いていた場所を、今日はまっすぐ歩けてしまう。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"以前这里不是这样的。"
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
        text:"第一次见到你们的时候……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"这里明明挤得连路都看不见。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你那时候还一直站在人群里看别人。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"因为很有意思。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"我当时还以为你是鬼。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"鬼？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"穿着白衣服，一句话也不说，还突然消失。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"……那确实有点像。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"三人で笑った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"けれど、その笑い声さえ今夜の夜市では妙に大きく響いた。"
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
        text:"是因为我。"
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
        expression:"normal",
        text:"这里变成这样，是因为我。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不是你的错。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"可是小青是因为我才来的。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那也是她自己做的事。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……"
      }

    ],

    chapterSevenChoice

  );

}


// ==========================================================
// CHOICE
// ==========================================================

function chapterSevenChoice(){

  storyChoice([

    {
      jp:"白姑娘が消える必要はない",
      cn:"你没有必要离开。",
      action(){

        STORY.flags.chapter7Response =
          "stay";

        chapterSevenChoiceResponse(
          "stay"
        );

      }
    },

    {
      jp:"三人で方法を考えよう",
      cn:"我们三个人一起想办法吧。",
      action(){

        STORY.flags.chapter7Response =
          "together";

        chapterSevenChoiceResponse(
          "together"
        );

      }
    },

    {
      jp:"武林が好きなんでしょう？",
      cn:"你不是很喜欢武林吗？",
      action(){

        STORY.flags.chapter7Response =
          "love";

        chapterSevenChoiceResponse(
          "love"
        );

      }
    }

  ]);

}


// ==========================================================
// CHOICE RESPONSE
// ==========================================================

function chapterSevenChoiceResponse(type){

  const lines =
    [];


  if(type === "stay"){

    lines.push(

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……我知道。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"可是有时候，不是只有想不想离开的问题。"
      }

    );

  }


  if(type === "together"){

    lines.push(

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"你们两个真的很奇怪。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你现在才知道？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"嗯。现在才知道。"
      }

    );

  }


  if(type === "love"){

    lines.push(

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……就是因为喜欢。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"所以才不想看着它变成现在这样。"
      }

    );

  }


  lines.push(

    {
      speaker:"林小雨",
      portrait:"xiaoyu",
      expression:"normal",
      text:"白姑娘。"
    },

    {
      speaker:"白姑娘",
      portrait:"whiteLady",
      expression:"smile",
      text:"别露出这种表情。"
    },

    {
      speaker:"白姑娘",
      portrait:"whiteLady",
      expression:"smile",
      text:"今天不是还没结束吗？"
    },

    {
      speaker:"白姑娘",
      portrait:"whiteLady",
      expression:"smile",
      text:"再陪我走一会儿吧。"
    }

  );


  storyDialogueSequence(

    lines,

    startChapterSevenFinalWalk

  );

}


// ==========================================================
// FINAL WALK
// ==========================================================

function startChapterSevenFinalWalk(){

  STORY.partyActive =
    true;

  STORY.partyType =
    "trio";

  STORY.playerTrail =
    [];


  STORY_NPCS.xiaoyu.x =
    player.x;

  STORY_NPCS.xiaoyu.y =
    player.y + TILE;


  STORY_NPCS.whiteLady.x =
    player.x;

  STORY_NPCS.whiteLady.y =
    player.y + TILE*2;


  showPartyStatus();


  setStoryObjective(
    "三人で夜市の中央へ戻ろう"
  );


  saveStory();

}


// ==========================================================
// PHOTO AREA
// ==========================================================

function checkChapterSevenPhoto(){

  const px =
    player.x / TILE;

  const py =
    player.y / TILE;


  const inside =

    px >= 21 &&
    px <= 32 &&

    py >= 18 &&
    py <= 26;


  if(!inside){
    return;
  }


  CH7.photoTriggered =
    true;


  beginChapterSevenPhoto();

}


// ==========================================================
// PHOTO SCENE
// ==========================================================

function beginChapterSevenPhoto(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH7.step =
    5;

  STORY.step =
    5;


  setStoryObjective(
    "三人の写真"
  );


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"对了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"我们再拍一张吧。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"照片？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你现在应该知道照片是什么了吧？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"这个我已经学会了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"那就站过来。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"三、二、一——"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"画面の中に、三人の姿が残った。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"……拍得很好。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"当然。"
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
        text:"嗯？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"上次你说……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"只要不删掉，照片就会一直留着，对吧？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"对啊。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"那就好。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は写真をしばらく見つめていた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"その「よかった」が、なぜか別れの言葉のように聞こえた。"
      }

    ],

    chapterSevenDecisionScene

  );

}


// ==========================================================
// DECISION
// ==========================================================

function chapterSevenDecisionScene(){

  if(
    CH7.decisionTriggered
  ){
    return;
  }


  CH7.decisionTriggered =
    true;


  storyDialogueSequence(

    [

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"今天……很开心。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"怎么突然说这个？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"就是想说。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"第一次喝奶茶的时候也是。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"虽然真的太甜了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你还记着啊。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"当然。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"还有陈叔的烤串。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"还有你教我怎么用手机付款。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"还有我们第一次拍的照片。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"彼女は、ひとつひとつ確かめるように思い出を口にした。"
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
        text:"你今天真的很奇怪。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"是吗？"
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
        text:"……小雨。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"明天不要等我了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我明天不会来了。"
      }

    ],

    chapterSevenLastChoice

  );

}


// ==========================================================
// LAST CHOICE
// ==========================================================

function chapterSevenLastChoice(){

  storyChoice([

    {
      jp:"どういう意味？",
      cn:"什么意思？",
      action(){

        STORY.flags.chapter7Final =
          "meaning";

        chapterSevenFarewell();

      }
    },

    {
      jp:"どこへ行くつもり？",
      cn:"你打算去哪里？",
      action(){

        STORY.flags.chapter7Final =
          "where";

        chapterSevenFarewell();

      }
    },

    {
      jp:"また三人で来ればいい",
      cn:"我们还可以三个人再来啊。",
      action(){

        STORY.flags.chapter7Final =
          "again";

        chapterSevenFarewell();

      }
    }

  ]);

}


// ==========================================================
// FAREWELL
// ==========================================================

function chapterSevenFarewell(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白姑娘，你到底想做什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我要去见小青。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"一个人？"
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
        text:"那我们也去。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"不行。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"又是“不行”？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"嗯。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你每次都是这样。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"因为这是我和她之间的事。"
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
        expression:"smile",
        text:"别担心。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我只是去和她说几句话。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘はそう言って笑った。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"けれど、その笑顔を見て安心することはできなかった。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"还有……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"谢谢你们陪我逛了这么多次武林。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"你为什么说得像是在告别一样？"
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
        expression:"smile",
        text:"晚安，小雨。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"晚安。"
      }

    ],

    finishChapterSeven

  );

}


// ==========================================================
// FINISH
// ==========================================================

function finishChapterSeven(){

  if(
    CH7.endingTriggered
  ){
    return;
  }


  CH7.endingTriggered =
    true;


  CH7.step =
    6;

  STORY.step =
    6;


  STORY.chapterComplete =
    true;


  STORY.flags.chapter7 =
    true;

  STORY.flags.whiteLadyDecision =
    true;

  STORY.flags.lastWulinNight =
    true;

  STORY.flags.secondTrioPhoto =
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
    "第七章　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘は一人で、人の少ない夜市の向こうへ歩いていった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"今夜は、一度も振り返らなかった。"
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
        text:"我不喜欢这样。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她肯定有什么事没告诉我们。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨は、白姑娘が消えた方向を見つめたまま動かなかった。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"明天她不来……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"那我们就去找她。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘が向かった先を、このとき私たちはまだ知らなかった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"ただ、西湖の向こうに立つ雷峰塔だけが、夜の中に静かに浮かんでいた。"
      }

    ],

    showChapterSevenEnd

  );

}


// ==========================================================
// END CARD
// ==========================================================

function showChapterSevenEnd(){

  configureEndCard(
    7,
    "第七章　完",
    "―― 大切だからこそ、離れなければならない夜がある。"
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
        "第七章クリア"
      );

    },

    4200

  );

}


console.log(
  "杭州探索録 Chapter 7 Ver.1.0 / 灯りの消える夜 loaded"
);
