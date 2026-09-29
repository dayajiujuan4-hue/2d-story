"use strict";

/*
==========================================================
 杭州探索録
 FOOD PIXEL PUZZLE Ver.2.0

 杭州面館
 ・料理注文
 ・料理ピクセルパズル
 ・料理図鑑
 ・料理図鑑セーブ

 前Ver.のボール式ブロック崩しから全面変更
==========================================================
*/

(function(){

  const FOOD_SAVE_KEY =
    "hangzhouFoodBookV1";

  const SLOT_MAX = 5;

  let foodUIOpen = false;
  let selectedDish = null;

  let puzzle = null;

  let waitingForNoodleMenu = false;


  // ======================================================
  // DISH DATA
  // ======================================================

  /*
    pixelMap

    . = 空白

    料理を構成する記号は、
    palette の色と対応する。

    plate は皿なのでゲーム対象外。
  */

  const DISHES = {

    pianerchuan: {

      name:"片儿川",
      pinyin:"piànrchuān",

      region:"浙江省・杭州",

      type:"杭州の麺料理",

      description:
        "雪菜・筍・豚肉などを使う、杭州を代表する麺料理の一つ。",

      ingredients:[
        {
          name:"面",
          pinyin:"miàn",
          jp:"麺"
        },
        {
          name:"雪菜",
          pinyin:"xuěcài",
          jp:"漬け菜"
        },
        {
          name:"笋",
          pinyin:"sǔn",
          jp:"たけのこ"
        },
        {
          name:"猪肉",
          pinyin:"zhūròu",
          jp:"豚肉"
        }
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

      pixelMap:[

        "........YYYYYY........",
        "......YYYYYYYYYY......",
        ".....YYYGGGGYYYYY.....",
        "....YYGGGGGGGYYYYY....",
        "...YYYGGGGGGGYYYYYY...",
        "..YYYYYYYYYYYYYYYYYY..",
        ".YYYYBBBBYYYYRRRRYYYY.",
        "YYYYBBBBBBYYRRRRRRYYYY",
        "YYYBBBBBBYYYRRRRRRYYYY",
        "YYYYBBBBYYYYRRRRYYYYYY",
        "YYYYYYYYYYYYYYYYYYYYYY",
        ".YYYSSSSYYYYSSSSYYYYY.",
        "..YYSSSSSSSSSSSSYYYY..",
        "...YYYSSSSSSSSYYYYY...",
        "....YYYYSSSSYYYYYY....",
        "......YYYYYYYYYY......",
        "........YYYYYY........"

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
        {
          name:"面",
          pinyin:"miàn",
          jp:"麺"
        },
        {
          name:"虾",
          pinyin:"xiā",
          jp:"エビ"
        },
        {
          name:"鳝鱼",
          pinyin:"shànyú",
          jp:"タウナギ"
        },
        {
          name:"葱",
          pinyin:"cōng",
          jp:"ネギ"
        }
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

        "........YYYYYY........",
        "......YYYYYYYYYY......",
        "....YYYGGGGGGYYYYY....",
        "...YYGGGGGGGGYYYYYY...",
        "..YYYYYYYYYYYYYYYYYY..",
        ".YYYYOOOOYYYYDDDDYYYY.",
        "YYYOOOOOOYYDDDDDDYYYY",
        "YYOOOOOOOYYDDDDDDDYYY",
        "YYYOOOOOYYYYDDDDDYYYY",
        "YYYYYYYYYYYYYYYYYYYYYY",
        "YYYSSSSYYYYYYSSSSYYYY",
        ".YYSSSSSSSSSSSSSSYYY.",
        "..YYYSSSSSSSSSSYYYY..",
        "...YYYYSSSSSSYYYYY...",
        ".....YYYYYYYYYYYY.....",
        ".......YYYYYYYY......."

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
        {
          name:"面",
          pinyin:"miàn",
          jp:"麺"
        },
        {
          name:"葱",
          pinyin:"cōng",
          jp:"ネギ"
        },
        {
          name:"葱油",
          pinyin:"cōngyóu",
          jp:"ネギ油"
        }
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

        "........GGGG..........",
        "......GGGGGGGG........",
        "....YYYYGGGGYYYY......",
        "...YYYYYYYYYYYYYY.....",
        "..YYYYBYYYYBYYYYYY....",
        ".YYYYYYYYYYYYYYYYYY...",
        "YYYYBYYYYYYYYBYYYYYY..",
        "YYYYYYYYBYYYYYYYYYYYY.",
        "YYYBYYYYYYYYYYBYYYYYY.",
        "YYYYYYYYYYYYYYYYYYYYYY",
        ".YYYYBYYYYBYYYYYYYYYY.",
        "..YYYYYYYYYYYYYYYYYY..",
        "...YYYYBYYYYYYYYYYY...",
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

      console.warn(
        "FOOD PUZZLE: 料理図鑑の読み込みに失敗",
        error
      );

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
        "FOOD PUZZLE: 料理図鑑の保存に失敗",
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
  // STYLE
  // ======================================================

  const style =
    document.createElement("style");


  style.textContent = `

    #foodPuzzleRoot{

      position:fixed;
      inset:0;

      z-index:16000;

      display:none;

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

      padding:22px;

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

      transition:.15s;

    }


    .fp-button:hover{

      border-color:#a4865c;

      background:#39332a;

    }


    .fp-button.primary{

      border-color:#a36c53;

      background:#623d32;

    }


    .fp-button.primary:hover{

      background:#784a3c;

    }



    /* =============================================
       MENU
    ============================================= */

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

      transition:.15s;

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



    /* =============================================
       INTRO
    ============================================= */

    .fp-big-name{

      margin-top:3px;

      color:#f1dfbe;

      text-align:center;

      font-size:38px;

    }


    .fp-big-pinyin{

      margin-bottom:20px;

      color:#b39970;

      text-align:center;

      font-size:14px;

      letter-spacing:.08em;

    }


    .fp-ingredients{

      margin-bottom:25px;

      color:#a99d8a;

      text-align:center;

      font-size:12px;

      line-height:2;

    }



    /* =============================================
       GAME
    ============================================= */

    #fpGameScreen{

      align-items:flex-start;

      overflow:auto;

      padding:
        18px 20px 28px;

    }


    .fp-game{

      width:
        min(820px,96vw);

      margin:auto;

    }


    .fp-game-header{

      display:flex;

      align-items:flex-end;

      justify-content:space-between;

      gap:20px;

      margin-bottom:10px;

    }


    .fp-game-name{

      color:#ead6b4;

      font-size:21px;

    }


    .fp-game-pinyin{

      margin-top:2px;

      color:#8e806d;

      font-size:11px;

    }


    .fp-progress{

      color:#a99578;

      text-align:right;

      font-size:12px;

    }


    .fp-progress-bar{

      width:160px;
      height:5px;

      margin-top:6px;

      overflow:hidden;

      background:#252428;

    }


    #fpProgressFill{

      width:0%;
      height:100%;

      background:#b18b54;

      transition:
        width .2s;

    }



    /* =============================================
       DISH BOARD
    ============================================= */

    .fp-board-shell{

      position:relative;

      display:flex;

      align-items:center;
      justify-content:center;

      min-height:430px;

      box-sizing:border-box;

      padding:30px;

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

      width:min(620px,88%);
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

      width:17px;
      height:17px;

      box-sizing:border-box;

      border-radius:2px;

      box-shadow:
        inset 2px 2px 0
        rgba(255,255,255,.16),
        inset -2px -2px 0
        rgba(0,0,0,.2);

      transition:
        opacity .18s,
        transform .18s;

    }


    .fp-pixel.empty{

      visibility:hidden;

    }


    .fp-pixel.eaten{

      opacity:0;

      transform:
        scale(.15)
        rotate(15deg);

      pointer-events:none;

    }



    /* =============================================
       INGREDIENT POPUP
    ============================================= */

    #fpIngredientPopup{

      position:absolute;

      z-index:5;

      left:22px;
      top:22px;

      min-width:165px;

      padding:11px 14px;

      border:
        1px solid
        rgba(177,143,92,.35);

      background:
        rgba(12,13,16,.85);

      opacity:0;

      transform:
        translateY(-5px);

      transition:
        .2s;

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

      margin-top:3px;

      color:#9d907d;

      font-size:11px;

    }



    /* =============================================
       TRAY
    ============================================= */

    .fp-tray-title{

      margin:
        18px 0 7px;

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

      box-sizing:border-box;

      border:
        1px solid #524c45;

      border-radius:5px;

      background:
        rgba(255,255,255,.025);

      color:#70695f;

      font-size:11px;

    }


    .fp-tray-slot.used{

      border-color:#8c7557;

      box-shadow:
        inset 0 0 12px
        rgba(0,0,0,.25);

    }



    /* =============================================
       BLOCK QUEUE
    ============================================= */

    .fp-block-title{

      margin:
        18px 0 9px;

      color:#a3947d;

      text-align:center;

      font-size:11px;

      letter-spacing:.12em;

    }


    #fpBlocks{

      display:flex;

      justify-content:center;

      flex-wrap:wrap;

      gap:10px;

    }


    .fp-color-block{

      position:relative;

      display:flex;

      flex-direction:column;

      align-items:center;
      justify-content:center;

      width:84px;
      height:76px;

      box-sizing:border-box;

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

      transition:
        transform .12s,
        filter .12s;

      user-select:none;

    }


    .fp-color-block:hover{

      transform:
        translateY(-3px);

      filter:
        brightness(1.12);

    }


    .fp-color-number{

      font-size:25px;

      font-weight:800;

    }


    .fp-color-label{

      margin-top:2px;

      font-size:9px;

      opacity:.9;

    }



    /* =============================================
       MESSAGE
    ============================================= */

    #fpMessage{

      min-height:25px;

      margin-top:14px;

      color:#b7a88f;

      text-align:center;

      font-size:12px;

    }



    /* =============================================
       COMPLETE / FAIL
    ============================================= */

    .fp-result-mark{

      margin-bottom:8px;

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

      margin:
        4px 0 22px;

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

      letter-spacing:.1em;

    }



    /* =============================================
       BOOK
    ============================================= */

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

      box-sizing:border-box;

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

      letter-spacing:.18em;

    }


    .fp-book-name{

      color:#ead7b8;

      font-size:19px;

    }


    .fp-book-pinyin{

      margin:
        3px 0 10px;

      color:#948673;

      font-size:11px;

    }


    .fp-book-region{

      margin-bottom:7px;

      color:#ad8c62;

      font-size:11px;

    }


    .fp-book-description{

      color:#aaa093;

      font-size:11px;

      line-height:1.7;

    }


    @media(max-width:700px){

      .fp-pixel{

        width:13px;
        height:13px;

      }

      .fp-board-shell{

        min-height:350px;
        padding:15px;

      }

      .fp-color-block{

        width:68px;
        height:65px;

      }

      .fp-panel{

        padding:
          27px 19px;

      }

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
  // HELPERS
  // ======================================================

  function stopPlayer(){

    try{

      if(
        typeof keys !==
        "undefined"
      ){

        for(
          const key in keys
        ){

          keys[key] =
            false;

        }

      }


      if(
        typeof player !==
        "undefined"
      ){

        player.moving =
          false;

      }

    }
    catch(error){

      // independent fallback

    }

  }


  function openRoot(){

    foodUIOpen = true;

    stopPlayer();

    root.classList.add(
      "open"
    );

  }


  function closeRoot(){

    foodUIOpen = false;

    selectedDish = null;

    puzzle = null;

    root.innerHTML = "";

    root.classList.remove(
      "open"
    );

  }


  // ======================================================
  // ORDER
  // ======================================================

  function showOrderQuestion(){

    openRoot();


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


    document
      .getElementById(
        "fpMenuButton"
      )
      .onclick =
        showMenu;


    document
      .getElementById(
        "fpBookButton"
      )
      .onclick =
        showFoodBook;


    document
      .getElementById(
        "fpCloseButton"
      )
      .onclick =
        closeRoot;

  }


  // ======================================================
  // MENU
  // ======================================================

  function showMenu(){

    openRoot();


    const cards =
      Object.entries(DISHES)
      .map(
        ([id,dish])=>`

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

        `
      )
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


    document
      .getElementById(
        "fpMenuBack"
      )
      .onclick =
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


    document
      .getElementById(
        "fpStart"
      )
      .onclick =
        ()=>startPuzzle(id);


    document
      .getElementById(
        "fpIntroBack"
      )
      .onclick =
        showMenu;

  }


  // ======================================================
  // PUZZLE CREATE
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

            if(
              symbol === "."
            ){
              return;
            }


            pixels.push({

              x:x,
              y:y,

              symbol:symbol,

              eaten:false

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

      over:false,

      popupTimer:null

    };


    createQueue();


    renderPuzzle();

  }


  // ======================================================
  // QUEUE GENERATION
  // ======================================================

  function createQueue(){

    if(!puzzle){
      return;
    }


    const counts = {};


    puzzle.pixels
      .filter(pixel=>!pixel.eaten)
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

          let left =
            count;


          while(left>0){

            /*
              1ブロックの数字。

              完全一致ばかりではなく、
              少し余る数字も混ぜる。

              その余りがトレーに入る。
            */

            const base =
              Math.min(
                left,
                8 +
                Math.floor(
                  Math.random()*12
                )
              );


            const extra =
              Math.random() < .32
                ? 1 +
                  Math.floor(
                    Math.random()*5
                  )
                : 0;


            blocks.push({

              symbol:symbol,

              amount:
                base + extra

            });


            left -=
              base;

          }

        }
      );


    /*
      シャッフル
    */

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
  // PUZZLE UI
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


          <div class="fp-board-shell">

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

          </div>


          <div class="fp-tray-title">
            TRAY　使い切れなかったブロック
          </div>

          <div id="fpTray"></div>


          <div class="fp-block-title">
            色ブロックを選んで料理を食べ進めよう
          </div>

          <div id="fpBlocks"></div>


          <div id="fpMessage">
            料理と同じ色のブロックを選んでください
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


    document
      .getElementById(
        "fpQuit"
      )
      .onclick =
        showMenu;


    drawPixels();

    drawTray();

    drawBlocks();

    updateProgress();

  }


  // ======================================================
  // PIXELS
  // ======================================================

  function drawPixels(){

    const board =
      document.getElementById(
        "fpPixelBoard"
      );


    if(
      !board ||
      !puzzle
    ){
      return;
    }


    const dish =
      puzzle.dish;


    board.innerHTML = "";


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


            if(
              symbol === "."
            ){

              cell.classList.add(
                "empty"
              );


              board.appendChild(
                cell
              );


              return;

            }


            const data =
              dish.palette[
                symbol
              ];


            cell.style.background =
              data.color;


            const pixel =
              puzzle.pixels.find(
                p=>
                  p.x===x &&
                  p.y===y
              );


            if(
              pixel &&
              pixel.eaten
            ){

              cell.classList.add(
                "eaten"
              );

            }


            board.appendChild(
              cell
            );

          }

        );

      }

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


    if(
      !tray ||
      !puzzle
    ){
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


        slot.style.textShadow =
          "0 1px 2px #000";


        slot.innerHTML = `

          <strong>
            ${block.amount}
          </strong>

        `;

      }
      else{

        slot.textContent =
          "—";

      }


      tray.appendChild(
        slot
      );

    }

  }


  // ======================================================
  // BLOCKS
  // ======================================================

  function drawBlocks(){

    const container =
      document.getElementById(
        "fpBlocks"
      );


    if(
      !container ||
      !puzzle
    ){
      return;
    }


    container.innerHTML = "";


    /*
      一度に4つ見せる。
    */

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
            ()=>useBlock(index);


          container.appendChild(
            button
          );

        }
      );


    if(
      puzzle.queue.length === 0
    ){

      container.innerHTML =
        `<div style="
          color:#776f64;
          font-size:12px;
          padding:20px;
        ">
          ブロックがありません
        </div>`;

    }

  }


  // ======================================================
  // USE BLOCK
  // ======================================================

  function useBlock(index){

    if(
      !puzzle ||
      puzzle.over
    ){
      return;
    }


    const block =
      puzzle.queue[
        index
      ];


    if(!block){
      return;
    }


    /*
      表示中のqueueから削除
    */

    puzzle.queue.splice(
      index,
      1
    );


    const targets =
      puzzle.pixels
        .filter(
          pixel=>
            !pixel.eaten &&
            pixel.symbol ===
              block.symbol
        );


    const eatCount =
      Math.min(
        block.amount,
        targets.length
      );


    /*
      ランダムではなく、
      上側から順番に消す。

      「食べ進めている」感じが出る。
    */

    targets.sort(
      (a,b)=>
        a.y-b.y ||
        a.x-b.x
    );


    for(
      let i=0;
      i<eatCount;
      i++
    ){

      targets[i].eaten =
        true;

    }


    const remainder =
      block.amount -
      eatCount;


    showIngredient(
      block.symbol
    );


    if(
      remainder > 0
    ){

      puzzle.tray.push({

        symbol:
          block.symbol,

        amount:
          remainder

      });


      setMessage(
        `${block.amount}個中 ${eatCount}個を食べました。余り ${remainder} がトレーへ。`
      );

    }
    else{

      const data =
        puzzle.dish.palette[
          block.symbol
        ];


      setMessage(
        `${data.name}を ${eatCount} ピクセル食べました。`
      );

    }


    drawPixels();

    drawTray();

    drawBlocks();

    updateProgress();


    /*
      クリア判定
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
        450
      );


      return;

    }


    /*
      トレー満杯
    */

    if(
      puzzle.tray.length >=
      SLOT_MAX
    ){

      puzzle.over = true;


      setTimeout(
        showFail,
        400
      );


      return;

    }


    /*
      万一queueが尽きた場合
    */

    if(
      puzzle.queue.length === 0
    ){

      createEmergencyBlocks();

      drawBlocks();

    }

  }


  // ======================================================
  // EMERGENCY
  // ======================================================

  function createEmergencyBlocks(){

    const counts = {};


    puzzle.pixels
      .filter(
        pixel=>!pixel.eaten
      )
      .forEach(
        pixel=>{

          counts[pixel.symbol] =
            (
              counts[pixel.symbol] ||
              0
            ) + 1;

        }
      );


    puzzle.queue =
      Object.entries(counts)
        .map(
          ([symbol,count])=>({

            symbol:symbol,

            amount:count

          })
        );

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
        pixel=>pixel.eaten
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

    if(
      !puzzle
    ){
      return;
    }


    const data =
      puzzle.dish.palette[
        symbol
      ];


    const popup =
      document.getElementById(
        "fpIngredientPopup"
      );


    if(
      !popup ||
      !data
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


    if(
      puzzle.popupTimer
    ){

      clearTimeout(
        puzzle.popupTimer
      );

    }


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

    const message =
      document.getElementById(
        "fpMessage"
      );


    if(message){

      message.textContent =
        text;

    }

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

            ${dish.region}<br><br>

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


    document
      .getElementById(
        "fpAgain"
      )
      .onclick =
        ()=>startPuzzle(id);


    document
      .getElementById(
        "fpCompleteBook"
      )
      .onclick =
        showFoodBook;


    document
      .getElementById(
        "fpReturn"
      )
      .onclick =
        closeRoot;

  }


  // ======================================================
  // FAIL
  // ======================================================

  function showFail(){

    const id =
      puzzle.dishId;


    const dish =
      puzzle.dish;


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

            トレーがいっぱいになりました。<br>

            ブロックの数字と、
            料理に残っている色の量を見ながら
            選んでみましょう。

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


    document
      .getElementById(
        "fpRetry"
      )
      .onclick =
        ()=>startPuzzle(id);


    document
      .getElementById(
        "fpFailMenu"
      )
      .onclick =
        showMenu;

  }


  // ======================================================
  // FOOD BOOK
  // ======================================================

  function showFoodBook(){

    openRoot();


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
                      item=>
                        item.name
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


    document
      .getElementById(
        "fpBookBack"
      )
      .onclick =
        showOrderQuestion;

  }


  // ======================================================
  // KEY CONTROL
  // ======================================================

  window.addEventListener(

    "keydown",

    event=>{

      if(
        !foodUIOpen
      ){
        return;
      }


      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        event.key ===
        "Escape"
      ){

        if(puzzle){

          puzzle = null;

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

  /*
    既存の advanceDialogue を包む。

    面館の老板との通常会話を最後まで読んだ後、
    注文画面を開く。
  */

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

          /*
            ストーリー進行中には
            自動で料理ゲームを挟まない。
          */

          if(
            typeof STORY ===
              "undefined" ||
            STORY.mode !==
              "story"
          ){

            shouldOpen =
              true;

          }

        }

      }
      catch(error){

        // existing game takes priority

      }


      originalAdvanceDialogue();


      if(shouldOpen){

        waitingForNoodleMenu =
          true;

        waitForDialogueEnd();

      }

    };

  }


  // ======================================================
  // WAIT
  // ======================================================

  function waitForDialogueEnd(){

    if(
      !waitingForNoodleMenu
    ){
      return;
    }


    let blocked = false;


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
    catch(error){

      blocked = false;

    }


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
    "杭州探索録 FOOD PIXEL PUZZLE Ver.2.0 loaded"
  );

})();
