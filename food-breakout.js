"use strict";

/*
==========================================================
 杭州探索録
 FOOD PIXEL PUZZLE Ver.3.0

 ・杭州面館 料理注文
 ・外周侵食型カラーパズル
 ・周回ブロックアニメーション
 ・高速連続破壊
 ・TRAYシステム
 ・料理図鑑
==========================================================
*/

(function(){

  const FOOD_SAVE_KEY = "hangzhouFoodBookV1";

  const SLOT_MAX = 5;

  // 破壊速度
  const DESTROY_INTERVAL = 55;

  // 外周を探す演出時間
  const SEARCH_TIME = 650;

  // 周回速度
  const ORBIT_SPEED = 0.009;

  let foodUIOpen = false;
  let selectedDish = null;
  let puzzle = null;
  let waitingForNoodleMenu = false;

  let animationFrame = null;


  // ======================================================
  // DISH DATA
  // ======================================================

  const DISHES = {

    pianerchuan: {

      name:"片儿川",
      pinyin:"piànrchuān",

      region:"浙江省・杭州",

      type:"杭州の麺料理",

      description:
        "雪菜・筍・豚肉などを使う、杭州を代表する麺料理の一つ。",

      ingredients:[
        {name:"面",pinyin:"miàn",jp:"麺"},
        {name:"雪菜",pinyin:"xuěcài",jp:"漬け菜"},
        {name:"笋",pinyin:"sǔn",jp:"たけのこ"},
        {name:"猪肉",pinyin:"zhūròu",jp:"豚肉"}
      ],

      palette:{

        Y:{
          color:"#e6bc55",
          dark:"#b77e32",
          name:"面",
          pinyin:"miàn",
          jp:"麺"
        },

        G:{
          color:"#70854c",
          dark:"#475b34",
          name:"雪菜",
          pinyin:"xuěcài",
          jp:"漬け菜"
        },

        B:{
          color:"#d9c48c",
          dark:"#aa8d59",
          name:"笋",
          pinyin:"sǔn",
          jp:"たけのこ"
        },

        R:{
          color:"#a95d49",
          dark:"#71392f",
          name:"猪肉",
          pinyin:"zhūròu",
          jp:"豚肉"
        },

        S:{
          color:"#d8c17a",
          dark:"#a7874d",
          name:"汤",
          pinyin:"tāng",
          jp:"スープ"
        }

      },

      /*
        外側の麺を削らないと
        中央の具材に届きにくい構造。
      */

      pixelMap:[

        ".........YYYY.........",
        ".......YYYYYYYY.......",
        "......YYYYYYYYYY......",
        "....YYYYYYYYYYYYYY....",
        "...YYYYGGGGGGYYYYYY...",
        "..YYYYGGGGGGGGYYYYYY..",
        ".YYYYGGGBBBGGGYYYYYYY.",
        "YYYYYGBBBBBBGYYYYYYYYY",
        "YYYYGBBRRRRBBGYYYYYYYY",
        "YYYYGBRRRRRRGYYYYYYYYY",
        "YYYYGBRRRRRRGYYYYYYYYY",
        "YYYYGBBRRRRBBGYYYYYYYY",
        ".YYYYGGBBBBGGYYYYYYYY.",
        "..YYYYGGGGGGYYYYYYYY..",
        "...YYYYSSSSYYYYYYYY...",
        "....YYYYSSSSYYYYYY....",
        "......YYYYYYYYYY......",
        ".......YYYYYYYY.......",
        ".........YYYY........."

      ]

    },


    xiabaoshanmian: {

      name:"虾爆鳝面",
      pinyin:"xiābào shànmiàn",

      region:"浙江省・杭州",

      type:"杭州の名物麺",

      description:
        "エビとタウナギを使った杭州の名物麺。香ばしく炒めた具材と麺を合わせる。",

      ingredients:[
        {name:"面",pinyin:"miàn",jp:"麺"},
        {name:"虾",pinyin:"xiā",jp:"エビ"},
        {name:"鳝鱼",pinyin:"shànyú",jp:"タウナギ"},
        {name:"葱",pinyin:"cōng",jp:"ネギ"}
      ],

      palette:{

        Y:{
          color:"#d8b35f",
          dark:"#a57c39",
          name:"面",
          pinyin:"miàn",
          jp:"麺"
        },

        O:{
          color:"#dd7655",
          dark:"#a74837",
          name:"虾",
          pinyin:"xiā",
          jp:"エビ"
        },

        D:{
          color:"#713d2e",
          dark:"#48271f",
          name:"鳝鱼",
          pinyin:"shànyú",
          jp:"タウナギ"
        },

        G:{
          color:"#70884c",
          dark:"#42572f",
          name:"葱",
          pinyin:"cōng",
          jp:"ネギ"
        },

        S:{
          color:"#c99d58",
          dark:"#8f6738",
          name:"汤",
          pinyin:"tāng",
          jp:"スープ"
        }

      },

      pixelMap:[

        ".........YYYY.........",
        ".......YYYYYYYY.......",
        ".....YYYYYYYYYYYY.....",
        "....YYYYGGGGYYYYYY....",
        "...YYYYGGGGGGYYYYYY...",
        "..YYYYYYYYYYYYYYYYYY..",
        ".YYYYYOOOYYDDDYYYYYYY.",
        "YYYYYOOOOYYDDDDYYYYYYY",
        "YYYYOOOOOYYDDDDDYYYYYY",
        "YYYYOOOOYYYYDDDDYYYYYY",
        "YYYYYOOYYYYYYDDDYYYYYY",
        "YYYYYYYYSSYYYYYYYYYYYY",
        ".YYYYYSSSSSSSSYYYYYYY.",
        "..YYYYSSSSSSSSYYYYYY..",
        "...YYYYYSSSSYYYYYYY...",
        "....YYYYYYYYYYYYYY....",
        "......YYYYYYYYYY......",
        "........YYYYYY........"

      ]

    },


    congyoubanmian: {

      name:"葱油拌面",
      pinyin:"cōngyóu bànmiàn",

      region:"江南地方",

      type:"葱油まぜ麺",

      description:
        "香ばしい葱油を麺に絡めて食べる、シンプルながら香り豊かな麺料理。",

      ingredients:[
        {name:"面",pinyin:"miàn",jp:"麺"},
        {name:"葱",pinyin:"cōng",jp:"ネギ"},
        {name:"葱油",pinyin:"cōngyóu",jp:"ネギ油"}
      ],

      palette:{

        Y:{
          color:"#d7b461",
          dark:"#a57d3c",
          name:"面",
          pinyin:"miàn",
          jp:"麺"
        },

        G:{
          color:"#69844b",
          dark:"#405a31",
          name:"葱",
          pinyin:"cōng",
          jp:"ネギ"
        },

        B:{
          color:"#8c5b35",
          dark:"#5b3925",
          name:"葱油",
          pinyin:"cōngyóu",
          jp:"ネギ油"
        }

      },

      pixelMap:[

        ".........YYYY.........",
        ".......YYYYYYYY.......",
        ".....YYYYYYYYYYYY.....",
        "....YYYYYYYYYYYYYY....",
        "...YYYYGGGGGGYYYYYY...",
        "..YYYYGGGGGGGGYYYYYY..",
        ".YYYYGGYYYYYYGGYYYYYY.",
        "YYYYGGYYYYYYYYGGYYYYYY",
        "YYYYGYYYYBBYYYYGYYYYYY",
        "YYYYGYYYBBBBYYYGYYYYYY",
        "YYYYGYYYBBBBYYYGYYYYYY",
        "YYYYGGYYYYYYYYGGYYYYYY",
        ".YYYYGGYYYYYYGGYYYYYY.",
        "..YYYYGGGGGGGGYYYYYY..",
        "...YYYYGGGGGGYYYYYY...",
        "....YYYYYYYYYYYYYY....",
        "......YYYYYYYYYY......",
        "........YYYYYY........"

      ]

    }

  };


  // ======================================================
  // SAVE
  // ======================================================

  function loadFoodBook(){

    try{

      const raw =
        localStorage.getItem(
          FOOD_SAVE_KEY
        );

      if(!raw){
        return [];
      }

      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];

    }
    catch(error){

      return [];

    }

  }


  let discovered =
    loadFoodBook();


  function saveFoodBook(){

    try{

      localStorage.setItem(
        FOOD_SAVE_KEY,
        JSON.stringify(discovered)
      );

    }
    catch(error){

      console.warn(
        "料理図鑑保存失敗",
        error
      );

    }

  }


  function discoverDish(id){

    if(
      discovered.includes(id)
    ){
      return false;
    }

    discovered.push(id);

    saveFoodBook();

    return true;

  }


  // ======================================================
  // CSS
  // ======================================================

  const style =
    document.createElement("style");


  style.textContent = `

  #foodPuzzleRoot{

    position:fixed;
    inset:0;

    display:none;

    z-index:16000;

    color:#eee4d2;

    font-family:
      "Noto Sans JP",
      "Yu Gothic",
      sans-serif;

  }


  #foodPuzzleRoot.open{

    display:block;

  }


  .fp-screen{

    position:absolute;
    inset:0;

    display:flex;

    align-items:center;
    justify-content:center;

    box-sizing:border-box;

    padding:20px;

    background:
      radial-gradient(
        circle at 50% 30%,
        #30271f,
        #101115 70%
      );

  }


  .fp-panel{

    width:min(
      780px,
      calc(100vw - 32px)
    );

    max-height:
      calc(100vh - 32px);

    overflow:auto;

    box-sizing:border-box;

    padding:34px;

    border:
      1px solid #786246;

    background:
      linear-gradient(
        180deg,
        #28231e,
        #171719
      );

    box-shadow:
      0 30px 100px
      rgba(0,0,0,.75);

  }


  .fp-eyebrow{

    margin-bottom:8px;

    text-align:center;

    color:#a98b61;

    font-size:10px;

    letter-spacing:.27em;

  }


  .fp-title{

    margin:0;

    text-align:center;

    color:#f0dfbf;

    font-size:28px;

    font-weight:500;

    letter-spacing:.1em;

  }


  .fp-subtitle{

    margin:
      5px 0 27px;

    text-align:center;

    color:#8f816e;

    font-size:11px;

    letter-spacing:.16em;

  }


  .fp-description{

    max-width:570px;

    margin:
      0 auto 24px;

    color:#c8bdab;

    text-align:center;

    font-size:13px;

    line-height:1.9;

  }


  .fp-buttons{

    display:flex;

    justify-content:center;

    flex-wrap:wrap;

    gap:11px;

  }


  .fp-button{

    min-width:145px;

    padding:
      12px 17px;

    border:
      1px solid #665943;

    background:#292724;

    color:#e7ddca;

    cursor:pointer;

    font:inherit;

  }


  .fp-button:hover{

    border-color:#a4865c;

    background:#39332a;

  }


  .fp-button.primary{

    border-color:#a36c53;

    background:#623d32;

  }


  /* MENU */

  .fp-menu{

    display:grid;

    gap:10px;

  }


  .fp-dish{

    display:grid;

    grid-template-columns:
      1fr auto;

    align-items:center;

    gap:20px;

    padding:16px 18px;

    border:
      1px solid
      rgba(177,147,101,.28);

    background:
      rgba(255,255,255,.025);

    cursor:pointer;

  }


  .fp-dish:hover{

    transform:
      translateX(3px);

    border-color:
      rgba(205,166,106,.72);

    background:
      rgba(173,126,70,.09);

  }


  .fp-dish-name{

    color:#efddbd;

    font-size:20px;

  }


  .fp-dish-pinyin{

    margin-top:3px;

    color:#a39682;

    font-size:12px;

  }


  .fp-dish-region{

    color:#9e8361;

    text-align:right;

    font-size:11px;

    line-height:1.7;

  }


  .fp-big-name{

    color:#f1dfbe;

    text-align:center;

    font-size:38px;

  }


  .fp-big-pinyin{

    margin-bottom:20px;

    color:#b39970;

    text-align:center;

    font-size:14px;

  }


  .fp-ingredients{

    margin-bottom:25px;

    color:#a99d8a;

    text-align:center;

    font-size:12px;

    line-height:2;

  }


  /* GAME */

  #fpGameScreen{

    align-items:flex-start;

    overflow:auto;

    padding:
      16px 20px 30px;

  }


  .fp-game{

    width:
      min(850px,96vw);

    margin:auto;

  }


  .fp-game-header{

    display:flex;

    align-items:flex-end;

    justify-content:space-between;

    margin-bottom:10px;

  }


  .fp-game-name{

    color:#ead6b4;

    font-size:21px;

  }


  .fp-game-pinyin{

    color:#8e806d;

    font-size:11px;

  }


  .fp-progress{

    color:#a99578;

    text-align:right;

    font-size:12px;

  }


  .fp-progress-bar{

    width:170px;
    height:5px;

    margin-top:6px;

    overflow:hidden;

    background:#252428;

  }


  #fpProgressFill{

    width:0;
    height:100%;

    background:#b18b54;

    transition:width .15s;

  }


  /* BOARD */

  .fp-board-shell{

    position:relative;

    display:flex;

    align-items:center;
    justify-content:center;

    min-height:455px;

    overflow:hidden;

    border:
      1px solid #705d45;

    background:
      linear-gradient(
        180deg,
        #242328,
        #17181d
      );

    box-shadow:
      inset 0 0 70px
      rgba(0,0,0,.45);

  }


  .fp-plate{

    position:absolute;

    width:min(620px,86%);

    aspect-ratio:1.55;

    border:
      9px solid #b8aa92;

    border-radius:50%;

    background:#d9d2c6;

    box-shadow:
      0 13px 0 #62574b,
      0 20px 35px
      rgba(0,0,0,.4);

    opacity:.92;

  }


  #fpPixelBoard{

    position:relative;

    z-index:2;

    display:grid;

    gap:1px;

    filter:
      drop-shadow(
        0 6px 5px
        rgba(0,0,0,.35)
      );

  }


  .fp-pixel{

    position:relative;

    width:17px;
    height:17px;

    box-sizing:border-box;

    border-radius:2px;

    box-shadow:
      inset 2px 2px 0
      rgba(255,255,255,.15),
      inset -2px -2px 0
      rgba(0,0,0,.22);

  }


  .fp-pixel.empty{

    visibility:hidden;

  }


  .fp-pixel.eaten{

    opacity:0;

    transform:
      scale(.15)
      rotate(20deg);

    transition:
      opacity .12s,
      transform .12s;

  }


  .fp-pixel.hit{

    animation:
      fpHit .13s ease-out;

  }


  @keyframes fpHit{

    0%{
      transform:scale(1);
    }

    45%{
      transform:scale(1.4);
      filter:brightness(1.7);
    }

    100%{
      transform:scale(.15);
    }

  }


  /* ORBIT */

  #fpOrbiter{

    position:absolute;

    z-index:20;

    display:none;

    width:31px;
    height:31px;

    align-items:center;
    justify-content:center;

    border:
      3px solid
      rgba(255,255,255,.55);

    border-radius:7px;

    color:white;

    font-size:11px;
    font-weight:bold;

    text-shadow:
      0 1px 3px #000;

    box-shadow:
      0 4px 0
      rgba(0,0,0,.35),
      0 0 14px
      rgba(255,255,255,.18);

    pointer-events:none;

  }


  #fpOrbiter.active{

    display:flex;

  }


  #fpOrbiter.attack{

    animation:
      fpAttack .12s
      ease-out;

  }


  @keyframes fpAttack{

    0%{
      transform:scale(1);
    }

    50%{
      transform:scale(1.45);
    }

    100%{
      transform:scale(1);
    }

  }


  /* PARTICLES */

  .fp-particle{

    position:absolute;

    z-index:15;

    width:5px;
    height:5px;

    pointer-events:none;

    animation:
      fpParticle .32s
      forwards;

  }


  @keyframes fpParticle{

    from{

      opacity:1;

      transform:
        translate(0,0)
        scale(1);

    }

    to{

      opacity:0;

      transform:
        translate(
          var(--px),
          var(--py)
        )
        scale(.3);

    }

  }


  /* POPUP */

  #fpIngredientPopup{

    position:absolute;

    z-index:30;

    left:20px;
    top:20px;

    min-width:160px;

    padding:10px 13px;

    border:
      1px solid
      rgba(177,143,92,.35);

    background:
      rgba(12,13,16,.88);

    opacity:0;

    transform:
      translateY(-5px);

    transition:.2s;

    pointer-events:none;

  }


  #fpIngredientPopup.show{

    opacity:1;

    transform:
      translateY(0);

  }


  .fp-popup-cn{

    color:#ead8b9;

    font-size:20px;

  }


  .fp-popup-sub{

    color:#9d907d;

    font-size:11px;

  }


  /* TRAY */

  .fp-tray-title{

    margin:
      17px 0 7px;

    color:#887d6d;

    text-align:center;

    font-size:10px;

    letter-spacing:.16em;

  }


  #fpTray{

    display:flex;

    justify-content:center;

    gap:8px;

    min-height:52px;

  }


  .fp-tray-slot{

    display:flex;

    align-items:center;
    justify-content:center;

    width:58px;
    height:48px;

    border:
      1px solid #524c45;

    border-radius:5px;

    background:
      rgba(255,255,255,.025);

    color:#70695f;

  }


  .fp-tray-slot.used{

    border-color:#8c7557;

  }


  /* BLOCKS */

  .fp-block-title{

    margin:
      17px 0 9px;

    color:#a3947d;

    text-align:center;

    font-size:11px;

  }


  #fpBlocks{

    display:flex;

    justify-content:center;

    flex-wrap:wrap;

    gap:10px;

  }


  .fp-color-block{

    display:flex;

    flex-direction:column;

    align-items:center;
    justify-content:center;

    width:84px;
    height:76px;

    border:
      2px solid
      rgba(255,255,255,.35);

    border-radius:9px;

    cursor:pointer;

    color:#fff;

    text-shadow:
      0 2px 3px
      rgba(0,0,0,.7);

    box-shadow:
      inset 0 4px 0
      rgba(255,255,255,.2),
      inset 0 -5px 0
      rgba(0,0,0,.2),
      0 5px 0
      rgba(0,0,0,.35);

    user-select:none;

    transition:.12s;

  }


  .fp-color-block:hover{

    transform:
      translateY(-3px);

    filter:brightness(1.12);

  }


  .fp-color-block.disabled{

    pointer-events:none;

    opacity:.4;

  }


  .fp-color-number{

    font-size:25px;

    font-weight:800;

  }


  .fp-color-label{

    font-size:9px;

  }


  #fpMessage{

    min-height:27px;

    margin-top:14px;

    color:#b7a88f;

    text-align:center;

    font-size:12px;

  }


  /* RESULT */

  .fp-result-mark{

    color:#b58d55;

    text-align:center;

    font-size:11px;

    letter-spacing:.28em;

  }


  .fp-result-title{

    color:#f0debc;

    text-align:center;

    font-size:38px;

  }


  .fp-result-cn{

    margin-bottom:22px;

    color:#aa8d66;

    text-align:center;

  }


  .fp-new{

    width:max-content;

    max-width:100%;

    margin:
      0 auto 22px;

    padding:
      7px 14px;

    border:
      1px solid #8a6748;

    color:#d0a975;

    font-size:11px;

  }


  /* BOOK */

  .fp-book-grid{

    display:grid;

    grid-template-columns:
      repeat(
        auto-fit,
        minmax(190px,1fr)
      );

    gap:12px;

    margin-bottom:25px;

  }


  .fp-book-card{

    min-height:130px;

    padding:17px;

    border:
      1px solid
      rgba(166,138,94,.3);

    background:
      rgba(255,255,255,.025);

  }


  .fp-book-card.locked{

    display:flex;

    align-items:center;
    justify-content:center;

    color:#625e57;

    font-size:22px;

  }


  .fp-book-name{

    color:#ead7b8;

    font-size:19px;

  }


  .fp-book-pinyin{

    color:#948673;

    font-size:11px;

  }


  .fp-book-region{

    margin:
      9px 0 7px;

    color:#ad8c62;

    font-size:11px;

  }


  .fp-book-description{

    color:#aaa093;

    font-size:11px;

    line-height:1.7;

  }

  `;


  document.head.appendChild(style);


  // ======================================================
  // ROOT
  // ======================================================

  const root =
    document.createElement("div");


  root.id =
    "foodPuzzleRoot";


  document.body.appendChild(root);


  // ======================================================
  // COMMON
  // ======================================================

  function stopPlayer(){

    try{

      if(typeof keys !== "undefined"){

        for(const key in keys){

          keys[key] = false;

        }

      }

      if(typeof player !== "undefined"){

        player.moving = false;

      }

    }
    catch(error){}

  }


  function openRoot(){

    foodUIOpen = true;

    stopPlayer();

    root.classList.add("open");

  }


  function closeRoot(){

    foodUIOpen = false;

    selectedDish = null;

    puzzle = null;

    cancelAnimationFrame(
      animationFrame
    );

    root.innerHTML = "";

    root.classList.remove("open");

  }


  // ======================================================
  // ORDER SCREEN
  // ======================================================

  function showOrderQuestion(){

    openRoot();

    puzzle = null;


    root.innerHTML = `

      <div class="fp-screen">

        <div class="fp-panel">

          <div class="fp-eyebrow">
            杭州探索録・食文化
          </div>

          <h2 class="fp-title">
            杭州面館
          </h2>

          <div class="fp-subtitle">
            HANGZHOU NOODLE HOUSE
          </div>

          <div class="fp-description">

            老板「腹が減ってるなら、
            何か食べていくかい？」

          </div>

          <div class="fp-buttons">

            <button
              class="fp-button primary"
              id="fpMenuButton"
            >
              菜单を見る
            </button>

            <button
              class="fp-button"
              id="fpBookButton"
            >
              料理図鑑
            </button>

            <button
              class="fp-button"
              id="fpCloseButton"
            >
              また今度
            </button>

          </div>

        </div>

      </div>

    `;


    document.getElementById(
      "fpMenuButton"
    ).onclick =
      showMenu;


    document.getElementById(
      "fpBookButton"
    ).onclick =
      showFoodBook;


    document.getElementById(
      "fpCloseButton"
    ).onclick =
      closeRoot;

  }


  // ======================================================
  // MENU
  // ======================================================

  function showMenu(){

    openRoot();

    puzzle = null;


    const cards =
      Object.entries(DISHES)
      .map(([id,dish])=>`

        <div
          class="fp-dish"
          data-id="${id}"
        >

          <div>

            <div class="fp-dish-name">
              ${dish.name}
            </div>

            <div class="fp-dish-pinyin">
              ${dish.pinyin}
            </div>

          </div>

          <div class="fp-dish-region">
            ${dish.region}<br>
            ${dish.type}
          </div>

        </div>

      `)
      .join("");


    root.innerHTML = `

      <div class="fp-screen">

        <div class="fp-panel">

          <div class="fp-eyebrow">
            菜单
          </div>

          <h2 class="fp-title">
            何を注文しますか？
          </h2>

          <div class="fp-subtitle">
            SELECT A DISH
          </div>

          <div class="fp-menu">
            ${cards}
          </div>

          <div
            class="fp-buttons"
            style="margin-top:24px"
          >

            <button
              class="fp-button"
              id="fpMenuBack"
            >
              戻る
            </button>

          </div>

        </div>

      </div>

    `;


    root
      .querySelectorAll(
        ".fp-dish"
      )
      .forEach(card=>{

        card.onclick =
          ()=>showDishIntro(
            card.dataset.id
          );

      });


    document.getElementById(
      "fpMenuBack"
    ).onclick =
      showOrderQuestion;

  }


  // ======================================================
  // INTRO
  // ======================================================

  function showDishIntro(id){

    const dish =
      DISHES[id];

    if(!dish){
      return;
    }


    selectedDish = id;


    root.innerHTML = `

      <div class="fp-screen">

        <div class="fp-panel">

          <div class="fp-eyebrow">
            本日の一杯
          </div>

          <div class="fp-big-name">
            ${dish.name}
          </div>

          <div class="fp-big-pinyin">
            ${dish.pinyin}
          </div>

          <div class="fp-description">
            ${dish.description}
          </div>

          <div class="fp-ingredients">

            主な食材<br>

            ${
              dish.ingredients
              .map(
                item=>
                  `${item.name}（${item.jp}）`
              )
              .join("　")
            }

          </div>

          <div class="fp-buttons">

            <button
              class="fp-button primary"
              id="fpStart"
            >
              いただきます！
            </button>

            <button
              class="fp-button"
              id="fpIntroBack"
            >
              菜单に戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document.getElementById(
      "fpStart"
    ).onclick =
      ()=>startPuzzle(id);


    document.getElementById(
      "fpIntroBack"
    ).onclick =
      showMenu;

  }


  // ======================================================
  // CREATE PUZZLE
  // ======================================================

  function startPuzzle(id){

    const dish =
      DISHES[id];

    if(!dish){
      return;
    }


    selectedDish = id;


    const pixels = [];


    dish.pixelMap.forEach(
      (row,y)=>{

        [...row].forEach(
          (symbol,x)=>{

            if(symbol === "."){
              return;
            }

            pixels.push({

              x:x,
              y:y,

              symbol:symbol,

              eaten:false,

              element:null

            });

          }

        );

      }

    );


    puzzle = {

      dishId:id,

      dish:dish,

      pixels:pixels,

      originalCount:
        pixels.length,

      tray:[],

      queue:[],

      busy:false,

      over:false,

      activeBlock:null,

      orbitAngle:
        Math.PI * 1.5,

      popupTimer:null

    };


    createQueue();

    renderPuzzle();

  }


  // ======================================================
  // QUEUE
  // ======================================================

  function createQueue(){

    const counts = {};


    puzzle.pixels
      .filter(
        pixel=>!pixel.eaten
      )
      .forEach(pixel=>{

        counts[pixel.symbol] =
          (
            counts[pixel.symbol] ||
            0
          ) + 1;

      });


    const blocks = [];


    Object.entries(counts)
      .forEach(
        ([symbol,count])=>{

          let remaining =
            count;


          while(remaining > 0){

            /*
              Ver.3ではあえて
              少し大きめの数字を混ぜる。

              色順を間違えると
              TRAYに余りやすくなる。
            */

            const usable =
              Math.min(
                remaining,
                7 +
                Math.floor(
                  Math.random()*11
                )
              );


            const extra =
              Math.random() < .38
              ? 1 +
                Math.floor(
                  Math.random()*5
                )
              : 0;


            blocks.push({

              symbol:symbol,

              amount:
                usable + extra

            });


            remaining -=
              usable;

          }

        }
      );


    // shuffle

    for(
      let i=
        blocks.length-1;

      i>0;

      i--
    ){

      const j =
        Math.floor(
          Math.random()*
          (i+1)
        );


      [
        blocks[i],
        blocks[j]
      ] =
      [
        blocks[j],
        blocks[i]
      ];

    }


    puzzle.queue =
      blocks;

  }


  // ======================================================
  // RENDER GAME
  // ======================================================

  function renderPuzzle(){

    openRoot();


    const dish =
      puzzle.dish;


    const cols =
      Math.max(
        ...dish.pixelMap.map(
          row=>row.length
        )
      );


    root.innerHTML = `

      <div
        class="fp-screen"
        id="fpGameScreen"
      >

        <div class="fp-game">

          <div class="fp-game-header">

            <div>

              <div class="fp-game-name">
                ${dish.name}
              </div>

              <div class="fp-game-pinyin">
                ${dish.pinyin}
              </div>

            </div>

            <div class="fp-progress">

              <span id="fpProgressText">
                0%
              </span>

              <div class="fp-progress-bar">

                <div
                  id="fpProgressFill"
                ></div>

              </div>

            </div>

          </div>


          <div
            class="fp-board-shell"
            id="fpBoardShell"
          >

            <div class="fp-plate"></div>

            <div
              id="fpIngredientPopup"
            ></div>

            <div
              id="fpPixelBoard"

              style="
                grid-template-columns:
                repeat(${cols},17px);
              "
            ></div>


            <div id="fpOrbiter"></div>

          </div>


          <div class="fp-tray-title">
            TRAY
            ・
            使い切れなかったブロック
          </div>

          <div id="fpTray"></div>


          <div class="fp-block-title">

            外側から食べられる色を
            見極めよう

          </div>

          <div id="fpBlocks"></div>


          <div id="fpMessage">

            色ブロックを選んでください

          </div>


          <div
            class="fp-buttons"
            style="margin-top:16px"
          >

            <button
              class="fp-button"
              id="fpQuit"
            >
              食べるのをやめる
            </button>

          </div>

        </div>

      </div>

    `;


    document.getElementById(
      "fpQuit"
    ).onclick =
      ()=>{

        if(!puzzle.busy){
          showMenu();
        }

      };


    buildPixelBoard();

    drawTray();

    drawBlocks();

    updateProgress();

  }


  // ======================================================
  // BUILD PIXELS
  // ======================================================

  function buildPixelBoard(){

    const board =
      document.getElementById(
        "fpPixelBoard"
      );


    board.innerHTML = "";


    const dish =
      puzzle.dish;


    dish.pixelMap.forEach(
      (row,y)=>{

        [...row].forEach(
          (symbol,x)=>{

            const cell =
              document.createElement(
                "div"
              );


            cell.className =
              "fp-pixel";


            if(symbol === "."){

              cell.classList.add(
                "empty"
              );

              board.appendChild(cell);

              return;

            }


            const data =
              dish.palette[symbol];


            cell.style.background =
              data.color;


            const pixel =
              getPixel(x,y);


            if(pixel){

              pixel.element =
                cell;

            }


            board.appendChild(cell);

          }

        );

      }

    );

  }


  // ======================================================
  // PIXEL HELPERS
  // ======================================================

  function getPixel(x,y){

    return puzzle.pixels.find(
      pixel=>
        pixel.x === x &&
        pixel.y === y
    );

  }


  function isSolid(x,y){

    const pixel =
      getPixel(x,y);

    return !!(
      pixel &&
      !pixel.eaten
    );

  }


  /*
    核心。

    上下左右のどこかに
    生きたピクセルが存在しなければ、
    その方向は「外気」に接している。

    よって現在の外周。
  */

  function isExposedPixel(pixel){

    if(
      !pixel ||
      pixel.eaten
    ){
      return false;
    }


    const directions = [

      [0,-1],
      [1,0],
      [0,1],
      [-1,0]

    ];


    return directions.some(
      ([dx,dy])=>
        !isSolid(
          pixel.x+dx,
          pixel.y+dy
        )
    );

  }


  function getExposedPixels(
    symbol
  ){

    return puzzle.pixels
      .filter(
        pixel=>
          !pixel.eaten &&
          pixel.symbol === symbol &&
          isExposedPixel(pixel)
      );

  }


  // ======================================================
  // BLOCK DISPLAY
  // ======================================================

  function drawBlocks(){

    const container =
      document.getElementById(
        "fpBlocks"
      );


    if(!container){
      return;
    }


    container.innerHTML = "";


    puzzle.queue
      .slice(0,4)
      .forEach(
        (block,index)=>{

          const data =
            puzzle.dish.palette[
              block.symbol
            ];


          const button =
            document.createElement(
              "div"
            );


          button.className =
            "fp-color-block";


          if(puzzle.busy){

            button.classList.add(
              "disabled"
            );

          }


          button.style.background =
            `
            linear-gradient(
              180deg,
              ${data.color},
              ${data.dark}
            )
            `;


          button.innerHTML = `

            <div class="fp-color-number">
              ${block.amount}
            </div>

            <div class="fp-color-label">
              ${data.name}
            </div>

          `;


          button.onclick =
            ()=>selectBlock(index);


          container.appendChild(
            button
          );

        }
      );

  }


  // ======================================================
  // SELECT BLOCK
  // ======================================================

  function selectBlock(index){

    if(
      !puzzle ||
      puzzle.busy ||
      puzzle.over
    ){
      return;
    }


    const block =
      puzzle.queue[index];


    if(!block){
      return;
    }


    puzzle.queue.splice(
      index,
      1
    );


    puzzle.busy =
      true;


    puzzle.activeBlock = {

      symbol:
        block.symbol,

      amount:
        block.amount,

      originalAmount:
        block.amount

    };


    const data =
      puzzle.dish.palette[
        block.symbol
      ];


    setMessage(
      `${data.name} ${block.amount} が料理の周囲を探しています……`
    );


    drawBlocks();


    startOrbit();

  }


  // ======================================================
  // ORBIT
  // ======================================================

  function startOrbit(){

    const orbiter =
      document.getElementById(
        "fpOrbiter"
      );


    if(
      !orbiter ||
      !puzzle.activeBlock
    ){
      return;
    }


    const data =
      puzzle.dish.palette[
        puzzle.activeBlock.symbol
      ];


    orbiter.style.background =
      `
      linear-gradient(
        180deg,
        ${data.color},
        ${data.dark}
      )
      `;


    orbiter.textContent =
      puzzle.activeBlock.amount;


    orbiter.classList.add(
      "active"
    );


    const start =
      performance.now();


    puzzle.orbitAngle =
      -Math.PI/2;


    function orbit(now){

      if(
        !puzzle ||
        !puzzle.busy ||
        !puzzle.activeBlock
      ){
        return;
      }


      const shell =
        document.getElementById(
          "fpBoardShell"
        );


      const board =
        document.getElementById(
          "fpPixelBoard"
        );


      const orb =
        document.getElementById(
          "fpOrbiter"
        );


      if(
        !shell ||
        !board ||
        !orb
      ){
        return;
      }


      const shellRect =
        shell.getBoundingClientRect();


      const boardRect =
        board.getBoundingClientRect();


      const centerX =
        boardRect.left -
        shellRect.left +
        boardRect.width/2;


      const centerY =
        boardRect.top -
        shellRect.top +
        boardRect.height/2;


      const radiusX =
        boardRect.width/2 +
        58;


      const radiusY =
        boardRect.height/2 +
        48;


      const elapsed =
        now-start;


      puzzle.orbitAngle =
        -Math.PI/2 +
        elapsed *
        ORBIT_SPEED;


      const x =
        centerX +
        Math.cos(
          puzzle.orbitAngle
        ) *
        radiusX;


      const y =
        centerY +
        Math.sin(
          puzzle.orbitAngle
        ) *
        radiusY;


      orb.style.left =
        `${x-15}px`;


      orb.style.top =
        `${y-15}px`;


      /*
        約一周見せたら
        攻撃判定へ。
      */

      if(
        elapsed >=
        SEARCH_TIME
      ){

        beginAttack();

        return;

      }


      animationFrame =
        requestAnimationFrame(
          orbit
        );

    }


    animationFrame =
      requestAnimationFrame(
        orbit
      );

  }


  // ======================================================
  // ATTACK
  // ======================================================

  async function beginAttack(){

    if(
      !puzzle ||
      !puzzle.activeBlock
    ){
      return;
    }


    const active =
      puzzle.activeBlock;


    const data =
      puzzle.dish.palette[
        active.symbol
      ];


    showIngredient(
      active.symbol
    );


    /*
      重要：

      1マス壊すごとに
      getExposedPixels() を呼び直す。

      そのため壊した奥から
      新しい同色が露出すれば
      そのまま連続破壊できる。
    */

    while(
      active.amount > 0
    ){

      const exposed =
        getExposedPixels(
          active.symbol
        );


      if(
        exposed.length === 0
      ){

        break;

      }


      const target =
        chooseAttackTarget(
          exposed
        );


      await moveOrbiterToPixel(
        target
      );


      destroyPixel(
        target
      );


      active.amount--;


      updateOrbiterNumber();


      updateProgress();


      await wait(
        DESTROY_INTERVAL
      );

    }


    /*
      全部使えた
    */

    if(
      active.amount <= 0
    ){

      setMessage(
        `${data.name}を全部使い切った！`
      );


      await wait(180);


      finishBlockAction();

      return;

    }


    /*
      同色がまだ存在するが、
      外から届かない。

      これがパズル要素。
    */

    const remainingSameColor =
      puzzle.pixels.filter(
        pixel=>
          !pixel.eaten &&
          pixel.symbol ===
            active.symbol
      ).length;


    if(
      remainingSameColor > 0
    ){

      setMessage(
        `${data.name}はまだ内側に隠れている。残り ${active.amount} がTRAYへ！`
      );

    }
    else{

      setMessage(
        `${data.name}を食べ切った。余り ${active.amount} がTRAYへ。`
      );

    }


    puzzle.tray.push({

      symbol:
        active.symbol,

      amount:
        active.amount

    });


    drawTray();


    await wait(350);


    if(
      puzzle.tray.length >=
      SLOT_MAX
    ){

      puzzle.over = true;

      setTimeout(
        showFail,
        350
      );

      return;

    }


    finishBlockAction();

  }


  // ======================================================
  // TARGET SELECTION
  // ======================================================

  function chooseAttackTarget(
    pixels
  ){

    /*
      外周を時計回りに
      なぞっているように見せるため、

      上 → 右 → 下 → 左
      に近い順序で優先する。
    */

    const alive =
      puzzle.pixels.filter(
        p=>!p.eaten
      );


    const minX =
      Math.min(
        ...alive.map(p=>p.x)
      );


    const maxX =
      Math.max(
        ...alive.map(p=>p.x)
      );


    const minY =
      Math.min(
        ...alive.map(p=>p.y)
      );


    const maxY =
      Math.max(
        ...alive.map(p=>p.y)
      );


    function perimeterScore(p){

      if(p.y === minY){

        return p.x;

      }


      if(p.x === maxX){

        return 1000 + p.y;

      }


      if(p.y === maxY){

        return 2000 - p.x;

      }


      if(p.x === minX){

        return 3000 - p.y;

      }


      /*
        凹凸部分
      */

      return (
        4000 +
        p.y*100 +
        p.x
      );

    }


    return [...pixels]
      .sort(
        (a,b)=>
          perimeterScore(a) -
          perimeterScore(b)
      )[0];

  }


  // ======================================================
  // MOVE ORBITER TO TARGET
  // ======================================================

  function moveOrbiterToPixel(
    pixel
  ){

    return new Promise(
      resolve=>{

        const orb =
          document.getElementById(
            "fpOrbiter"
          );


        const shell =
          document.getElementById(
            "fpBoardShell"
          );


        if(
          !orb ||
          !shell ||
          !pixel.element
        ){

          resolve();

          return;

        }


        const shellRect =
          shell.getBoundingClientRect();


        const targetRect =
          pixel.element
          .getBoundingClientRect();


        const targetX =
          targetRect.left -
          shellRect.left +
          targetRect.width/2;


        const targetY =
          targetRect.top -
          shellRect.top +
          targetRect.height/2;


        orb.style.transition =
          "left .10s linear, top .10s linear";


        orb.style.left =
          `${targetX-15}px`;


        orb.style.top =
          `${targetY-15}px`;


        orb.classList.add(
          "attack"
        );


        setTimeout(
          ()=>{

            orb.classList.remove(
              "attack"
            );

            resolve();

          },
          105
        );

      }

    );

  }


  // ======================================================
  // DESTROY
  // ======================================================

  function destroyPixel(pixel){

    if(
      !pixel ||
      pixel.eaten
    ){
      return;
    }


    pixel.eaten = true;


    const element =
      pixel.element;


    if(element){

      element.classList.add(
        "hit"
      );


      createParticles(
        element,
        pixel.symbol
      );


      setTimeout(
        ()=>{

          element.classList.add(
            "eaten"
          );

        },
        50
      );

    }

  }


  // ======================================================
  // PARTICLES
  // ======================================================

  function createParticles(
    element,
    symbol
  ){

    const shell =
      document.getElementById(
        "fpBoardShell"
      );


    if(
      !shell ||
      !element
    ){
      return;
    }


    const shellRect =
      shell.getBoundingClientRect();


    const rect =
      element.getBoundingClientRect();


    const color =
      puzzle.dish.palette[
        symbol
      ].color;


    for(
      let i=0;
      i<4;
      i++
    ){

      const particle =
        document.createElement(
          "div"
        );


      particle.className =
        "fp-particle";


      particle.style.background =
        color;


      particle.style.left =
        `${
          rect.left -
          shellRect.left +
          rect.width/2
        }px`;


      particle.style.top =
        `${
          rect.top -
          shellRect.top +
          rect.height/2
        }px`;


      particle.style.setProperty(
        "--px",
        `${
          (Math.random()-.5)*45
        }px`
      );


      particle.style.setProperty(
        "--py",
        `${
          (Math.random()-.5)*45
        }px`
      );


      shell.appendChild(
        particle
      );


      setTimeout(
        ()=>particle.remove(),
        350
      );

    }

  }


  // ======================================================
  // FINISH ACTION
  // ======================================================

  function finishBlockAction(){

    if(!puzzle){
      return;
    }


    const orb =
      document.getElementById(
        "fpOrbiter"
      );


    if(orb){

      orb.classList.remove(
        "active"
      );

      orb.style.transition =
        "";

    }


    puzzle.activeBlock =
      null;


    puzzle.busy =
      false;


    /*
      全料理消滅
    */

    const remaining =
      puzzle.pixels.filter(
        pixel=>!pixel.eaten
      );


    if(
      remaining.length === 0
    ){

      puzzle.over = true;


      setTimeout(
        showComplete,
        350
      );

      return;

    }


    /*
      queueがなくなった場合
      残存ピクセルから補充。
    */

    if(
      puzzle.queue.length === 0
    ){

      createEmergencyBlocks();

    }


    drawBlocks();

  }


  // ======================================================
  // EMERGENCY BLOCKS
  // ======================================================

  function createEmergencyBlocks(){

    const counts = {};


    puzzle.pixels
      .filter(
        p=>!p.eaten
      )
      .forEach(p=>{

        counts[p.symbol] =
          (
            counts[p.symbol] ||
            0
          ) + 1;

      });


    puzzle.queue =
      Object.entries(counts)
      .map(
        ([symbol,count])=>({

          symbol:symbol,

          amount:
            Math.min(
              count,
              12
            )

        })
      );

  }


  // ======================================================
  // TRAY
  // ======================================================

  function drawTray(){

    const tray =
      document.getElementById(
        "fpTray"
      );


    if(!tray){
      return;
    }


    tray.innerHTML = "";


    for(
      let i=0;
      i<SLOT_MAX;
      i++
    ){

      const slot =
        document.createElement(
          "div"
        );


      slot.className =
        "fp-tray-slot";


      const block =
        puzzle.tray[i];


      if(block){

        const data =
          puzzle.dish.palette[
            block.symbol
          ];


        slot.classList.add(
          "used"
        );


        slot.style.background =
          data.color;


        slot.style.color =
          "#fff";


        slot.innerHTML =
          `<strong>${block.amount}</strong>`;

      }
      else{

        slot.textContent =
          "—";

      }


      tray.appendChild(slot);

    }

  }


  // ======================================================
  // ORBIT NUMBER
  // ======================================================

  function updateOrbiterNumber(){

    const orb =
      document.getElementById(
        "fpOrbiter"
      );


    if(
      orb &&
      puzzle &&
      puzzle.activeBlock
    ){

      orb.textContent =
        puzzle.activeBlock.amount;

    }

  }


  // ======================================================
  // PROGRESS
  // ======================================================

  function updateProgress(){

    if(!puzzle){
      return;
    }


    const eaten =
      puzzle.pixels.filter(
        p=>p.eaten
      ).length;


    const percent =
      Math.round(
        eaten /
        puzzle.originalCount *
        100
      );


    const text =
      document.getElementById(
        "fpProgressText"
      );


    const fill =
      document.getElementById(
        "fpProgressFill"
      );


    if(text){

      text.textContent =
        `${percent}%`;

    }


    if(fill){

      fill.style.width =
        `${percent}%`;

    }

  }


  // ======================================================
  // INGREDIENT POPUP
  // ======================================================

  function showIngredient(symbol){

    const data =
      puzzle.dish.palette[
        symbol
      ];


    const popup =
      document.getElementById(
        "fpIngredientPopup"
      );


    if(
      !data ||
      !popup
    ){
      return;
    }


    popup.innerHTML = `

      <div class="fp-popup-cn">
        ${data.name}
      </div>

      <div class="fp-popup-sub">
        ${data.pinyin}
        　
        ${data.jp}
      </div>

    `;


    popup.classList.add(
      "show"
    );


    clearTimeout(
      puzzle.popupTimer
    );


    puzzle.popupTimer =
      setTimeout(
        ()=>{

          popup.classList.remove(
            "show"
          );

        },
        1300
      );

  }


  // ======================================================
  // MESSAGE
  // ======================================================

  function setMessage(text){

    const element =
      document.getElementById(
        "fpMessage"
      );


    if(element){

      element.textContent =
        text;

    }

  }


  // ======================================================
  // WAIT
  // ======================================================

  function wait(ms){

    return new Promise(
      resolve=>
        setTimeout(
          resolve,
          ms
        )
    );

  }


  // ======================================================
  // COMPLETE
  // ======================================================

  function showComplete(){

    const id =
      puzzle.dishId;


    const dish =
      puzzle.dish;


    const isNew =
      discoverDish(id);


    root.innerHTML = `

      <div class="fp-screen">

        <div class="fp-panel">

          <div class="fp-result-mark">
            FINISHED
          </div>

          <div class="fp-result-title">
            完食！
          </div>

          <div class="fp-result-cn">
            吃完了！
          </div>

          ${
            isNew
            ? `
              <div class="fp-new">
                NEW　料理図鑑に登録されました
              </div>
            `
            : ""
          }

          <div class="fp-big-name">
            ${dish.name}
          </div>

          <div class="fp-big-pinyin">
            ${dish.pinyin}
          </div>

          <div class="fp-description">
            ${dish.description}
          </div>

          <div class="fp-ingredients">

            ${dish.region}

            <br><br>

            主な食材<br>

            ${
              dish.ingredients
              .map(
                item=>
                  `${item.name}（${item.jp}）`
              )
              .join("　")
            }

          </div>

          <div class="fp-buttons">

            <button
              class="fp-button primary"
              id="fpAgain"
            >
              もう一杯
            </button>

            <button
              class="fp-button"
              id="fpCompleteBook"
            >
              料理図鑑
            </button>

            <button
              class="fp-button"
              id="fpReturn"
            >
              店に戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document.getElementById(
      "fpAgain"
    ).onclick =
      ()=>startPuzzle(id);


    document.getElementById(
      "fpCompleteBook"
    ).onclick =
      showFoodBook;


    document.getElementById(
      "fpReturn"
    ).onclick =
      closeRoot;

  }


  // ======================================================
  // FAIL
  // ======================================================

  function showFail(){

    const id =
      puzzle.dishId;


    root.innerHTML = `

      <div class="fp-screen">

        <div class="fp-panel">

          <div class="fp-result-mark">
            TRAY FULL
          </div>

          <div class="fp-result-title">
            満腹……
          </div>

          <div class="fp-result-cn">
            吃不下了……
          </div>

          <div class="fp-description">

            TRAYがいっぱいになりました。

            <br><br>

            料理の外側に露出している色を
            よく見てください。

            <br>

            内側に埋まった色を先に選ぶと、
            ブロックを使い切れません。

          </div>

          <div class="fp-buttons">

            <button
              class="fp-button primary"
              id="fpRetry"
            >
              もう一度
            </button>

            <button
              class="fp-button"
              id="fpFailMenu"
            >
              菜单に戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document.getElementById(
      "fpRetry"
    ).onclick =
      ()=>startPuzzle(id);


    document.getElementById(
      "fpFailMenu"
    ).onclick =
      showMenu;

  }


  // ======================================================
  // FOOD BOOK
  // ======================================================

  function showFoodBook(){

    openRoot();

    puzzle = null;


    const cards =
      Object.entries(DISHES)
      .map(
        ([id,dish])=>{

          if(
            !discovered.includes(id)
          ){

            return `

              <div
                class="
                  fp-book-card
                  locked
                "
              >
                ？？？
              </div>

            `;

          }


          return `

            <div class="fp-book-card">

              <div class="fp-book-name">
                ${dish.name}
              </div>

              <div class="fp-book-pinyin">
                ${dish.pinyin}
              </div>

              <div class="fp-book-region">
                ${dish.region}
              </div>

              <div class="fp-book-description">

                ${dish.description}

                <br><br>

                ${
                  dish.ingredients
                  .map(
                    item=>item.name
                  )
                  .join("・")
                }

              </div>

            </div>

          `;

        }
      )
      .join("");


    root.innerHTML = `

      <div class="fp-screen">

        <div class="fp-panel">

          <div class="fp-eyebrow">
            中国料理を知る旅
          </div>

          <h2 class="fp-title">
            料理図鑑
          </h2>

          <div class="fp-subtitle">

            CHINESE FOOD COLLECTION
            　
            ${discovered.length}
            /
            ${Object.keys(DISHES).length}

          </div>

          <div class="fp-book-grid">
            ${cards}
          </div>

          <div class="fp-buttons">

            <button
              class="fp-button"
              id="fpBookBack"
            >
              戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document.getElementById(
      "fpBookBack"
    ).onclick =
      showOrderQuestion;

  }


  // ======================================================
  // KEYBOARD
  // ======================================================

  window.addEventListener(

    "keydown",

    event=>{

      if(!foodUIOpen){
        return;
      }


      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        event.key === "Escape"
      ){

        if(
          puzzle &&
          puzzle.busy
        ){

          return;

        }


        if(puzzle){

          showMenu();

        }
        else{

          closeRoot();

        }

      }

    },

    true

  );


  // ======================================================
  // NOODLE SHOP CONNECTION
  // ======================================================

  if(
    typeof advanceDialogue ===
    "function"
  ){

    const originalAdvanceDialogue =
      advanceDialogue;


    advanceDialogue =
    function(){

      let shouldOpen =
        false;


      try{

        if(
          dialogue &&
          dialogue.active &&
          dialogue.npc &&
          dialogue.npc.name ===
            "面館の老板" &&
          currentMapId ===
            "noodle" &&
          dialogue.index ===
            dialogue.npc.dialogue.length-1
        ){

          if(
            typeof STORY ===
              "undefined" ||
            STORY.mode !==
              "story"
          ){

            shouldOpen = true;

          }

        }

      }
      catch(error){}


      originalAdvanceDialogue();


      if(shouldOpen){

        waitingForNoodleMenu =
          true;

        waitForDialogueEnd();

      }

    };

  }


  // ======================================================
  // WAIT FOR DIALOGUE
  // ======================================================

  function waitForDialogueEnd(){

    if(
      !waitingForNoodleMenu
    ){
      return;
    }


    let blocked =
      false;


    try{

      blocked =

        (
          typeof dialogue !==
            "undefined" &&
          dialogue.active
        )

        ||

        (
          typeof wordGetActive !==
            "undefined" &&
          wordGetActive
        )

        ||

        (
          typeof rankUpActive !==
            "undefined" &&
          rankUpActive
        )

        ||

        (
          typeof completionActive !==
            "undefined" &&
          completionActive
        );

    }
    catch(error){}


    if(blocked){

      setTimeout(
        waitForDialogueEnd,
        120
      );

      return;

    }


    waitingForNoodleMenu =
      false;


    showOrderQuestion();

  }


  // ======================================================
  // PUBLIC
  // ======================================================

  window.openNoodleMenu =
    showOrderQuestion;


  window.openFoodBook =
    showFoodBook;


  window.FOOD_DISHES =
    DISHES;


  console.log(
    "杭州探索録 FOOD PIXEL PUZZLE Ver.3.0 loaded"
  );

})();
