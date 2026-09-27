"use strict";

/*
==========================================================
 杭州探索録
 CHAPTER 3 EXPANSION Ver.1

 第三章「人間の夜」

 story.js Ver.3 の後に読み込む。

 ・第二章終了後 → 第三章へ
 ・主人公＋小雨＋白姑娘の三人同行
 ・奶茶屋台を実際に探す
 ・白姑娘「太甜了！」
 ・三人で写真
 ・白姑娘の写真への特別な反応
 ・現代杭州への違和感
 ・「我很久没出来了」
 ・「杭州变了很多」
 ・夜市が好きな理由
 ・最後に「以前这里……」
==========================================================
*/


// ==========================================================
// CHAPTER 3 STATE
// ==========================================================

const CH3 = {

  active:false,

  step:0,

  milkTeaTriggered:false,

  photoTriggered:false,

  memoryTriggered:false,

  endingTriggered:false

};


// ==========================================================
// CHAPTER 2 END HOOK
// ==========================================================

/*
  Ver.3 の第二章終了処理を包む。

  元のエンドカードをそのまま表示し、
  その後に第三章を開始する。
*/

const CH3_originalShowChapterTwoEnd =
  showChapterTwoEnd;


showChapterTwoEnd =
function(){

  CH3_originalShowChapterTwoEnd();


  /*
    Ver.3側のエンドカードが
    約3.2秒表示されるため、
    少し待って第三章へ。
  */

  setTimeout(
    startChapterThree,
    3900
  );

};


// ==========================================================
// CHAPTER 3 START
// ==========================================================

function startChapterThree(){

  CH3.active =
    true;

  CH3.step =
    0;

  CH3.milkTeaTriggered =
    false;

  CH3.photoTriggered =
    false;

  CH3.memoryTriggered =
    false;

  CH3.endingTriggered =
    false;


  STORY.chapter =
    3;

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


  /*
    第三章も小吃街から開始。
  */

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


  /*
    小雨
  */

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


  /*
    白姑娘
  */

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


  /*
    陈叔は今回は退場。
  */

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
    "第三章",
    "人間の夜"
  );


  configureChapterCard(
    3,
    "人間の夜"
  );


  setStoryObjective(
    "三人で武林夜市へ"
  );


  saveStory();


  showChapterCard();


  setTimeout(
    chapterThreeOpening,
    1400
  );

}


// ==========================================================
// OPENING
// ==========================================================

function chapterThreeOpening(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"それから数日後の夜。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"あなたと小雨は、また武林の夜市を歩いていた。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"她今天真的会来吗？"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨がそう言った直後だった。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"晚上好。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"哇！你什么时候来的？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"刚刚。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"你每次出现都没有声音的吗……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"有吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"有。非常有。"
      }

    ],

    chapterThreeMilkTeaIntro

  );

}


// ==========================================================
// MILK TEA INTRO
// ==========================================================

function chapterThreeMilkTeaIntro(){

  storyDialogueSequence(

    [

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"对了。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"昨天我看到很多人拿着一种杯子。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"里面好像有茶，还有……白色的东西。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"白色的东西？"
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
        expression:"surprised",
        text:"……你说的不会是奶茶吧？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"奶茶？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"你连奶茶都没喝过？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"没有。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"那今天第一个任务决定了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"我们带你去喝奶茶！"
      }

    ],

    startChapterThreeParty

  );

}


// ==========================================================
// START TRIO PARTY
// ==========================================================

function startChapterThreeParty(){

  CH3.step =
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
    "三人で奶茶屋台へ行こう"
  );


  saveStory();

}


// ==========================================================
// CHAPTER 3 UPDATE
// ==========================================================

const CH3_originalUpdateStoryEvents =
  updateStoryEvents;


updateStoryEvents =
function(){

  CH3_originalUpdateStoryEvents();


  if(
    !CH3.active ||
    STORY.chapter !== 3 ||
    dialogue.active ||
    STORY.choiceOpen
  ){
    return;
  }


  // --------------------------------------------------------
  // 奶茶屋台
  // --------------------------------------------------------

  if(
    CH3.step === 1 &&
    !CH3.milkTeaTriggered &&
    currentMapId === "food"
  ){

    checkChapterThreeMilkTea();

    return;

  }


  // --------------------------------------------------------
  // 写真イベント
  // --------------------------------------------------------

  if(
    CH3.step === 2 &&
    !CH3.photoTriggered &&
    currentMapId === "food"
  ){

    checkChapterThreePhoto();

    return;

  }


  // --------------------------------------------------------
  // 夜市の記憶
  // --------------------------------------------------------

  if(
    CH3.step === 3 &&
    !CH3.memoryTriggered &&
    currentMapId === "food"
  ){

    checkChapterThreeMemory();

    return;

  }

};


// ==========================================================
// MILK TEA AREA
// ==========================================================

function checkChapterThreeMilkTea(){

  /*
    map.js上の奶茶屋台：
    x=21, y=8, width=3

    屋台そのものではなく、
    周辺の通路に入れば発火。
  */

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  const inside =

    px >= 18 &&
    px <= 27 &&

    py >= 9 &&
    py <= 15;


  if(!inside){
    return;
  }


  CH3.milkTeaTriggered =
    true;


  beginMilkTeaScene();

}


// ==========================================================
// MILK TEA SCENE
// ==========================================================

function beginMilkTeaScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH3.step =
    2;

  STORY.step =
    2;


  /*
    イベント中は三人を
    屋台前へ固定。
  */

  STORY_NPCS.xiaoyu.x =
    25*TILE;

  STORY_NPCS.xiaoyu.y =
    12*TILE;

  STORY_NPCS.xiaoyu.direction =
    "left";


  STORY_NPCS.whiteLady.x =
    26*TILE;

  STORY_NPCS.whiteLady.y =
    12*TILE;

  STORY_NPCS.whiteLady.direction =
    "left";


  setStoryObjective(
    "白姑娘、初めての奶茶"
  );


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"就是这个。奶茶。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"原来是这个。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"茶里面真的可以放奶吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"当然可以啊。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你想喝什么？"
      }

    ],

    showMilkTeaChoice

  );

}


// ==========================================================
// MILK TEA CHOICE
// ==========================================================

function showMilkTeaChoice(){

  storyChoice([

    {

      jp:"普通のミルクティー",

      cn:"给她一杯原味奶茶吧。",

      action(){

        STORY.flags.whiteMilkTea =
          "original";

        drinkMilkTea();

      }

    },


    {

      jp:"タピオカ入り",

      cn:"试试珍珠奶茶吧。",

      action(){

        STORY.flags.whiteMilkTea =
          "pearl";

        storyDialogueSequence(

          [

            {
              speaker:"白姑娘",
              portrait:"whiteLady",
              expression:"normal",
              text:"珍珠？"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"laugh",
              text:"不是你想的那种珍珠。"
            }

          ],

          drinkMilkTea

        );

      }

    },


    {

      jp:"小雨に選んでもらう",

      cn:"小雨，你来选吧。",

      action(){

        STORY.flags.whiteMilkTea =
          "xiaoyu";

        storyDialogueSequence(

          [

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"那就听我的。"
            },

            {
              speaker:"林小雨",
              portrait:"xiaoyu",
              expression:"smile",
              text:"老板，一杯招牌奶茶！"
            }

          ],

          drinkMilkTea

        );

      }

    }

  ]);

}


// ==========================================================
// DRINK
// ==========================================================

function drinkMilkTea(){

  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘はストローを不思議そうに眺め、それから恐る恐る一口飲んだ。"
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
        expression:"surprised",
        text:"……太甜了！"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"哈哈哈哈！"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"surprised",
        text:"现在的人都喝这么甜的东西吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"也没有那么夸张啦。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……可是。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"还挺好喝的。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"这就对了。"
      }

    ],

    restartTrioAfterMilkTea

  );

}


// ==========================================================
// WALK AGAIN
// ==========================================================

function restartTrioAfterMilkTea(){

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
    "三人でもう少し夜市を歩こう"
  );


  saveStory();

}


// ==========================================================
// PHOTO AREA
// ==========================================================

function checkChapterThreePhoto(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  /*
    中央のテーブル・人混み付近。
  */

  const inside =

    px >= 21 &&
    px <= 32 &&

    py >= 18 &&
    py <= 26;


  if(!inside){
    return;
  }


  CH3.photoTriggered =
    true;


  beginPhotoScene();

}


// ==========================================================
// PHOTO SCENE
// ==========================================================

function beginPhotoScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH3.step =
    3;

  STORY.step =
    3;


  setStoryObjective(
    "三人の記念写真"
  );


  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"对了。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"我们拍张照片吧。"
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
        expression:"normal",
        text:"你不会连拍照都不知道吧？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"我知道。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"只是……以前没有这么方便。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"来，看这里。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"小雨がスマートフォンを持ち上げる。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"三、二、一！"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"画面の中に、三人の笑顔が残った。"
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
        text:"这个……会一直留着吗？"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"当然啊。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"只要不删掉，就一直在。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"这样啊……"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"真好。"
      }

    ],

    afterPhotoScene

  );

}


// ==========================================================
// AFTER PHOTO
// ==========================================================

function afterPhotoScene(){

  STORY.flags.trioPhoto =
    true;


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
    "夜市の灯りを眺めながら歩こう"
  );


  saveStory();

}


// ==========================================================
// MEMORY AREA
// ==========================================================

function checkChapterThreeMemory(){

  const px =
    player.x /
    TILE;

  const py =
    player.y /
    TILE;


  /*
    南側。
    夜市の出口に近づいた頃に
    静かな会話へ移行。
  */

  const inside =

    px >= 18 &&
    px <= 35 &&

    py >= 27 &&
    py <= 34;


  if(!inside){
    return;
  }


  CH3.memoryTriggered =
    true;


  beginMemoryScene();

}


// ==========================================================
// MEMORY / HUMAN WORLD SCENE
// ==========================================================

function beginMemoryScene(){

  STORY.partyActive =
    false;

  STORY.playerTrail =
    [];

  hidePartyStatus();


  CH3.step =
    4;

  STORY.step =
    4;


  setStoryObjective(
    "夜市の灯り"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"三人は夜市の端で足を止めた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"少し離れた場所から見ると、赤い提灯と屋台の灯りが人混みの上で揺れている。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我喜欢这里。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"武林？"
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
        text:"为什么？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"因为这里有很多人。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"……人多也算优点吗？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"大家说话、吃东西、笑。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"有人在等朋友，有人在催孩子回家。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"还有人在收摊，想着明天再来。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"我喜欢看这些。"
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
        expression:"smile",
        text:"你这个人真的很奇怪。"
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
        expression:"laugh",
        text:"是啊。"
      }

    ],

    beginOldHangzhouClue

  );

}


// ==========================================================
// OLD HANGZHOU CLUE
// ==========================================================

function beginOldHangzhouClue(){

  storyDialogueSequence(

    [

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"不过你真的什么都觉得新鲜。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"smile",
        text:"你到底多久没出门了？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"……很久。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"很久是多久？"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"很久就是……很久。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"laugh",
        text:"你这算什么回答啊。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"smile",
        text:"杭州变了很多。"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"normal",
        text:"杭州当然一直在变啊。"
      },

      {
        speaker:"白姑娘",
        portrait:"whiteLady",
        expression:"normal",
        text:"以前这里……"
      },

      {
        speaker:"林小雨",
        portrait:"xiaoyu",
        expression:"surprised",
        text:"以前？"
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
        text:"没什么。"
      }

    ],

    finishChapterThree

  );

}


// ==========================================================
// CHAPTER 3 ENDING
// ==========================================================

function finishChapterThree(){

  CH3.step =
    5;

  STORY.step =
    5;

  STORY.chapterComplete =
    true;

  STORY.flags.chapter3 =
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
    "第三章　完"
  );


  storyDialogueSequence(

    [

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"白姑娘はそれ以上、昔の杭州について話そうとはしなかった。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"ただ、帰る直前まで何度も夜市を振り返っていた。"
      },

      {
        speaker:"杭州探索録",
        portrait:"tourist",
        expression:"normal",
        text:"まるで、この何でもない夜を忘れないようにするかのように。"
      }

    ],

    showChapterThreeEnd

  );

}


// ==========================================================
// END CARD
// ==========================================================

function showChapterThreeEnd(){

  configureEndCard(
    3,
    "第三章　完",
    "―― 何でもない夜ほど、忘れたくない。"
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
        "第三章クリア"
      );

    },

    3400

  );

}


console.log(
  "杭州探索録 Chapter 3 / 人間の夜 loaded"
);
