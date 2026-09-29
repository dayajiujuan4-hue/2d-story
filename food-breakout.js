"use strict";

/*
==========================================================
 杭州探索録
 FOOD PIXEL PUZZLE Ver.4.1

 ・周回ブロック＝砲台
 ・砲台から実弾を発射
 ・弾は手前のドットに遮られる
 ・同色に射線が通った時だけ破壊
 ・料理を外側から削る
 ・余ったブロックは手持ちへ
 ・手持ちは最大4枠
 ・料理図鑑
==========================================================
*/

(function(){

const FOOD_SAVE_KEY = "hangzhouFoodBookV1";

const HAND_MAX = 4;

/* ==============================
   GAME SPEED
============================== */

/* 周回速度。小さいほど遅い */
const ORBIT_SPEED = 0.00043;

/* 発射間隔 */
const FIRE_INTERVAL = 115;

/* 弾速 px / second */
const BULLET_SPEED = 760;

/* 一つのブロックが射撃対象を探す最大時間 */
const MAX_SEARCH_TIME = 6500;

/* 1周して何も撃てなかったら手持ちへ */
const NO_SHOT_ORBITS = 1.15;


/* ==============================
   DISH DATA
============================== */

const DISHES = {

pianerchuan:{

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
            color:"#d9ad4e",
            dark:"#a87831",
            name:"面",
            pinyin:"miàn",
            jp:"麺"
        },

        Y2:{
            color:"#efc967",
            dark:"#b68a3e",
            name:"面",
            pinyin:"miàn",
            jp:"麺"
        },

        G:{
            color:"#697d3f",
            dark:"#3f522b",
            name:"雪菜",
            pinyin:"xuěcài",
            jp:"漬け菜"
        },

        G2:{
            color:"#839653",
            dark:"#566535",
            name:"雪菜",
            pinyin:"xuěcài",
            jp:"漬け菜"
        },

        B:{
            color:"#d6bd7b",
            dark:"#9f834d",
            name:"笋",
            pinyin:"sǔn",
            jp:"たけのこ"
        },

        R:{
            color:"#a7523d",
            dark:"#713428",
            name:"猪肉",
            pinyin:"zhūròu",
            jp:"豚肉"
        },

        R2:{
            color:"#c16c50",
            dark:"#884632",
            name:"猪肉",
            pinyin:"zhūròu",
            jp:"豚肉"
        },

        S:{
            color:"#c99d51",
            dark:"#936b35",
            name:"汤",
            pinyin:"tāng",
            jp:"スープ"
        }
    },

    pixelMap:[
"................YYYYYYYY................",
".............YYYYYYYYYYYYYY.............",
"..........YYYYYYYYYYYYYYYYYYYY..........",
"........YYYYYYYYYYYYYYYYYYYYYYYY........",
"......YYYYYYY2Y2YYYYYYYY2Y2YYYYYYY......",
".....YYYYY2YYYYYYYYYYYYYYYYY2YYYYYY.....",
"....YYYYYYYYYGGGGGGGGGGYYYYYYYYYYYYY....",
"...YYYYYYYYGGGGG2GGGGGGGGYYYYYYYYYYYY...",
"..YYYYYYYYGGGGGGGGGGGGGGGGYYYYYYYYYYYY..",
".YYYYYYYYGGGGGBBBBBBGGGGGGGGYYYYYYYYYYY.",
"YYYYYYYYGGGGBBBBBBBBBBGGGGGGGYYYYYYYYYYY",
"YYYYYYYGGGGBBBBBBBBBBBBGGGGGGGYYYYYYYYYY",
"YYYYYYYGGGBBBBRRRRRBBBBGGGGGGGYYYYYYYYYY",
"YYYYYYGGGGBBBRRR2RRRBBBGGGGGGGYYYYYYYYYY",
"YYYYYYGGGGBBRRRRRRRRRBBGGGGGGGYYYYYYYYYY",
"YYYYYYGGGGBBRRRR2RRRRBBGGGGGGGYYYYYYYYYY",
"YYYYYYGGGGBBBRRRRRRRBBBGGGGGGGYYYYYYYYYY",
"YYYYYYYGGGGBBBRRRRRBBBBGGGGGGGYYYYYYYYYY",
"YYYYYYYGGGGGBBBBBBBBBBGGGGGGGGYYYYYYYYYY",
"YYYYYYYYGGGGGBBBBBBBBGGGGGGGGYYYYYYYYYYY",
"YYYYYYYYYGGGGGGGGGGGGGGGGGGGYYYYYYYYYYYY",
".YYYYYYYYYYGGGGGGGGGGGGGGGGYYYYYYYYYYYY.",
"..YYYYYYYYYYYSSSSSSSSSSSSYYYYYYYYYYYYYY..",
"...YYYYYYYYYYSSSSSSSSSSSSYYYYYYYYYYYYY...",
"....YYYYYYYYYYYSSSSSSSSYYYYYYYYYYYYYYY....",
".....YYYYYYYYYYYYSSSSYYYYYYYYYYYYYYYY.....",
"......YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY......",
"........YYYYYYYYYYYYYYYYYYYYYYYYYY........",
"..........YYYYYYYYYYYYYYYYYYYYYY..........",
".............YYYYYYYYYYYYYY............."
    ]
},


xiabaoshanmian:{

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
            color:"#d6ae55",
            dark:"#9e7535",
            name:"面",
            pinyin:"miàn",
            jp:"麺"
        },

        O:{
            color:"#dd7452",
            dark:"#a64a37",
            name:"虾",
            pinyin:"xiā",
            jp:"エビ"
        },

        O2:{
            color:"#ef9270",
            dark:"#ba6048",
            name:"虾",
            pinyin:"xiā",
            jp:"エビ"
        },

        D:{
            color:"#713d2e",
            dark:"#45261f",
            name:"鳝鱼",
            pinyin:"shànyú",
            jp:"タウナギ"
        },

        D2:{
            color:"#91513b",
            dark:"#603225",
            name:"鳝鱼",
            pinyin:"shànyú",
            jp:"タウナギ"
        },

        G:{
            color:"#71894c",
            dark:"#42592f",
            name:"葱",
            pinyin:"cōng",
            jp:"ネギ"
        },

        S:{
            color:"#bf914c",
            dark:"#895f34",
            name:"汤",
            pinyin:"tāng",
            jp:"スープ"
        }
    },

    pixelMap:[
"................YYYYYYYY................",
"............YYYYYYYYYYYYYYYY............",
".........YYYYYYYYYYYYYYYYYYYYYY.........",
".......YYYYYYYYYYYYYYYYYYYYYYYYYY.......",
"......YYYYYYYYGGGGGGGGYYYYYYYYYYYY......",
"....YYYYYYYYGGGGGGGGGGGGYYYYYYYYYYYY....",
"...YYYYYYYYGGGGYYYYYYGGGGYYYYYYYYYYYY...",
"..YYYYYYYYGGGYYYYYYYYYYGGGYYYYYYYYYYYY..",
".YYYYYYYYGGGYYYOOOOYYYYGGGYYYYYYYYYYYYY.",
"YYYYYYYYGGGYYOOOOOOYYYYGGGYYYYYYYYYYYYYY",
"YYYYYYYGGGYYOOO2OOOOYYYGGGYYYYYYYYYYYYYY",
"YYYYYYYGGGYYOOOOOOOOYYYGGGYYYYYYYYYYYYYY",
"YYYYYYGGGYYYOOOOOOOYYYYGGGYYYYYYYYYYYYYY",
"YYYYYYGGGYYYYOOOOOYYYYYGGGYYYYYYYYYYYYYY",
"YYYYYYGGGYYYYYYYYYYYYYYGGGYYYYYYYYYYYYYY",
"YYYYYYGGGYYYYYDDDDYYYYYGGGYYYYYYYYYYYYYY",
"YYYYYYGGGYYYYDDDDDDYYYYGGGYYYYYYYYYYYYYY",
"YYYYYYYGGGYYDDD2DDDDDYYGGGYYYYYYYYYYYYYY",
"YYYYYYYGGGYYDDDDDDDDDYYGGGYYYYYYYYYYYYYY",
"YYYYYYYYGGGYYDDDDDDDYYGGGYYYYYYYYYYYYYYY",
".YYYYYYYYGGGYYYDDDDDYYGGGYYYYYYYYYYYYYY.",
"..YYYYYYYYGGGGYYYYYYGGGGYYYYYYYYYYYYYYY..",
"...YYYYYYYYYGGGGGGGGGGYYYYYYYYYYYYYYYY...",
"....YYYYYYYYYYYSSSSYYYYYYYYYYYYYYYYYYY....",
".....YYYYYYYYYSSSSSSSSYYYYYYYYYYYYYY.....",
"......YYYYYYYYSSSSSSSSYYYYYYYYYYYYYY......",
"........YYYYYYYYSSSSYYYYYYYYYYYYYY........",
".........YYYYYYYYYYYYYYYYYYYYYYYY.........",
"............YYYYYYYYYYYYYYYY............",
"................YYYYYYYY................"
    ]
},


congyoubanmian:{

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
            color:"#d7b25c",
            dark:"#a17b3a",
            name:"面",
            pinyin:"miàn",
            jp:"麺"
        },

        G:{
            color:"#698449",
            dark:"#3e582e",
            name:"葱",
            pinyin:"cōng",
            jp:"ネギ"
        },

        G2:{
            color:"#8ba35a",
            dark:"#566c38",
            name:"葱",
            pinyin:"cōng",
            jp:"ネギ"
        },

        B:{
            color:"#8a5934",
            dark:"#573822",
            name:"葱油",
            pinyin:"cōngyóu",
            jp:"ネギ油"
        },

        B2:{
            color:"#a36d3e",
            dark:"#704628",
            name:"葱油",
            pinyin:"cōngyóu",
            jp:"ネギ油"
        }
    },

    pixelMap:[
"................YYYYYYYY................",
"............YYYYYYYYYYYYYYYY............",
".........YYYYYYYYYYYYYYYYYYYYYY.........",
".......YYYYYYYYYYYYYYYYYYYYYYYYYY.......",
"......YYYYYYYYYYYYYYYYYYYYYYYYYYYY......",
"....YYYYYYYGGGGGGGGGGGGGGYYYYYYYYYY....",
"...YYYYYYGGGGG2GGGGGG2GGGGGYYYYYYYYY...",
"..YYYYYYGGGGYYYYYYYYYYYYGGGGYYYYYYYYYY..",
".YYYYYYGGGYYYYYYYYYYYYYYYYGGGYYYYYYYYYY.",
"YYYYYYGGGYYYYBBBBBBBBYYYYYYGGGYYYYYYYYYY",
"YYYYYYGGYYYYBBBBBBBBBBYYYYYYGGYYYYYYYYYY",
"YYYYYGGGYYYBBB2BBBBBBBBYYYYYGGGYYYYYYYYY",
"YYYYYGGGYYYBBBBBBBBBBBBYYYYYGGGYYYYYYYYY",
"YYYYYGGYYYYBBBBYYYYBBBBYYYYYYGGYYYYYYYYY",
"YYYYYGGYYYYYYYYYYYYYYYYYYYYYYGGYYYYYYYYY",
"YYYYYGGYYYYYYYYYYYYYYYYYYYYYYGGYYYYYYYYY",
"YYYYYGGYYYYBBBBYYYYBBBBYYYYYYGGYYYYYYYYY",
"YYYYYGGGYYYBBBBBBBBBBBBYYYYYGGGYYYYYYYYY",
"YYYYYYGGYYYBBBBB2BBBBBBYYYYYGGYYYYYYYYYY",
"YYYYYYGGGYYYBBBBBBBBBBYYYYYGGGYYYYYYYYYY",
".YYYYYYGGGYYYYBBBBBBYYYYYYYGGGYYYYYYYYY.",
"..YYYYYYGGGGYYYYYYYYYYYYYYGGGGYYYYYYYY..",
"...YYYYYYYGGGGGGGGGGGGGGGGGGYYYYYYYYY...",
"....YYYYYYYYGGGGG2GGGGGGYYYYYYYYYYYY....",
"......YYYYYYYYYYYYYYYYYYYYYYYYYYYY......",
".......YYYYYYYYYYYYYYYYYYYYYYYYYY.......",
".........YYYYYYYYYYYYYYYYYYYYYY.........",
"............YYYYYYYYYYYYYYYY............",
"................YYYYYYYY................"
    ]
}

};


/* ======================================================
   SAVE
====================================================== */

function loadFoodBook(){

    try{

        const raw =
            localStorage.getItem(
                FOOD_SAVE_KEY
            );

        if(!raw){
            return [];
        }

        const data =
            JSON.parse(raw);

        return Array.isArray(data)
            ? data
            : [];

    }catch(e){

        return [];

    }

}

let discovered =
    loadFoodBook();


function saveFoodBook(){

    localStorage.setItem(
        FOOD_SAVE_KEY,
        JSON.stringify(discovered)
    );

}


function discoverDish(id){

    if(discovered.includes(id)){
        return false;
    }

    discovered.push(id);

    saveFoodBook();

    return true;

}


/* ======================================================
   STATE
====================================================== */

let foodUIOpen = false;
let selectedDish = null;
let puzzle = null;
let waitingForNoodleMenu = false;
let raf = null;


/* ======================================================
   CSS
====================================================== */

const style = document.createElement("style");

style.textContent = `

#foodPuzzleRoot{
    position:fixed;
    inset:0;
    z-index:16000;
    display:none;
    color:#eee4d2;
    font-family:"Noto Sans JP","Yu Gothic",sans-serif;
}

#foodPuzzleRoot.open{
    display:block;
}

.fp-screen{
    position:absolute;
    inset:0;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:18px;
    box-sizing:border-box;
    background:
    radial-gradient(circle at 50% 30%,#30271f,#101115 72%);
}

.fp-panel{
    width:min(800px,calc(100vw - 30px));
    max-height:calc(100vh - 30px);
    overflow:auto;
    padding:32px;
    box-sizing:border-box;
    border:1px solid #786246;
    background:linear-gradient(#28231e,#171719);
    box-shadow:0 30px 100px #000b;
}

.fp-eyebrow{
    text-align:center;
    font-size:10px;
    letter-spacing:.25em;
    color:#a98b61;
}

.fp-title{
    text-align:center;
    color:#f0dfbf;
    font-size:28px;
    font-weight:500;
}

.fp-subtitle{
    text-align:center;
    color:#8f816e;
    font-size:11px;
    margin-bottom:25px;
}

.fp-description{
    max-width:600px;
    margin:0 auto 24px;
    text-align:center;
    line-height:1.9;
    color:#c8bdab;
    font-size:13px;
}

.fp-buttons{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:10px;
}

.fp-button{
    min-width:140px;
    padding:11px 16px;
    border:1px solid #665943;
    background:#292724;
    color:#e7ddca;
    cursor:pointer;
}

.fp-button.primary{
    background:#623d32;
    border-color:#a36c53;
}

.fp-menu{
    display:grid;
    gap:10px;
}

.fp-dish{
    padding:16px 18px;
    border:1px solid #9b80504d;
    cursor:pointer;
}

.fp-dish:hover{
    background:#a87d4618;
}

.fp-dish-name{
    color:#efddbd;
    font-size:20px;
}

.fp-dish-pinyin{
    color:#9b8d79;
    font-size:12px;
}

#fpGameScreen{
    align-items:flex-start;
    overflow:auto;
}

.fp-game{
    width:min(920px,96vw);
    margin:auto;
}

.fp-game-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    margin-bottom:9px;
}

.fp-game-name{
    font-size:22px;
    color:#ead6b4;
}

.fp-game-pinyin{
    font-size:11px;
    color:#8e806d;
}

.fp-progress{
    font-size:12px;
    color:#a99578;
}

.fp-progress-bar{
    width:170px;
    height:5px;
    margin-top:5px;
    background:#29282a;
}

#fpProgressFill{
    height:100%;
    width:0;
    background:#b18b54;
    transition:.15s;
}


/* BOARD */

.fp-board-shell{
    position:relative;
    min-height:560px;
    display:flex;
    align-items:center;
    justify-content:center;

    /*
      Ver.4.0では hidden だったため、
      周回ブロックが軌道上で切れてしまう場合があった。
    */
    overflow:visible;

    border:1px solid #705d45;

    background:
    radial-gradient(
        ellipse at center,
        #343239 0%,
        #202126 55%,
        #15161a 100%
    );
}

.fp-plate{
    position:absolute;
    width:690px;
    max-width:88%;
    height:390px;
    border-radius:50%;
    border:9px solid #b9ac97;
    background:#d7d0c4;

    box-shadow:
    0 11px 0 #665b4f,
    0 22px 35px #0007;
}

#fpPixelBoard{
    position:relative;
    z-index:3;
    display:grid;
    gap:1px;
    filter:drop-shadow(0 7px 5px #0006);
}

.fp-pixel{
    width:11px;
    height:11px;
    box-sizing:border-box;
    border-radius:1px;

    box-shadow:
    inset 1px 1px #ffffff35,
    inset -1px -1px #00000040;
}

.fp-pixel.empty{
    visibility:hidden;
}

.fp-pixel.dead{
    opacity:0;
}

.fp-pixel.hit{
    animation:fpDestroy .14s forwards;
}

@keyframes fpDestroy{

    0%{
        transform:scale(1);
        opacity:1;
    }

    40%{
        transform:scale(1.55);
        filter:brightness(1.8);
    }

    100%{
        transform:scale(.1);
        opacity:0;
    }
}


/* ======================================
   ORBIT GUIDE
====================================== */

.fp-orbit-guide{
    position:absolute;
    z-index:4;
    pointer-events:none;

    border:1px dashed #e7d8bd55;
    border-radius:50%;

    box-shadow:
    0 0 18px #d6b77d10;
}


/* ======================================
   ORBIT BLOCK / CANNON
====================================== */

#fpOrbiter{
    position:absolute;
    z-index:40;

    width:46px;
    height:46px;

    display:none;
    align-items:center;
    justify-content:center;

    border-radius:8px;
    border:3px solid #fff;

    color:white;
    font-weight:800;
    font-size:15px;

    text-shadow:
    0 2px 3px #000;

    box-shadow:
    0 5px 0 #0006,
    0 0 15px #ffffff55,
    0 0 26px #ffffff20;

    pointer-events:none;
}

#fpOrbiter.active{
    display:flex;
}


/* BULLET */

.fp-bullet{
    position:absolute;
    z-index:38;

    width:9px;
    height:9px;

    border-radius:50%;

    box-shadow:
    0 0 6px currentColor,
    0 0 11px currentColor;

    pointer-events:none;
}


/* PARTICLES */

.fp-particle{
    position:absolute;
    z-index:39;

    width:4px;
    height:4px;

    animation:
    fpParticle .3s forwards;
}

@keyframes fpParticle{

    to{
        opacity:0;

        transform:
        translate(
            var(--x),
            var(--y)
        )
        scale(.2);
    }
}


/* HAND */

.fp-hand-title{
    margin-top:14px;
    margin-bottom:6px;

    text-align:center;

    font-size:10px;
    letter-spacing:.17em;

    color:#918573;
}

#fpHand{
    display:flex;
    justify-content:center;
    gap:9px;
}

.fp-hand-slot{
    width:68px;
    height:52px;

    border:
    1px solid #554e45;

    border-radius:6px;

    display:flex;
    align-items:center;
    justify-content:center;

    color:#70695f;

    cursor:default;
}

.fp-hand-slot.used{
    cursor:pointer;

    color:white;
    font-weight:bold;

    box-shadow:
    inset 0 3px #ffffff30,
    0 4px #0005;
}

.fp-hand-slot.used:hover{
    transform:
    translateY(-2px);

    filter:
    brightness(1.1);
}


/* QUEUE */

.fp-block-title{
    margin:
    15px 0 8px;

    text-align:center;

    color:#9f917b;

    font-size:11px;
}

#fpBlocks{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:9px;
}

.fp-color-block{
    width:82px;
    height:69px;

    border-radius:8px;

    border:
    2px solid #ffffff55;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;

    cursor:pointer;

    color:white;

    text-shadow:
    0 2px 3px #000;

    box-shadow:
    inset 0 4px #ffffff30,
    inset 0 -5px #0003,
    0 5px #0006;
}

.fp-color-block:hover{
    transform:
    translateY(-3px);

    filter:
    brightness(1.12);
}

.fp-color-block.disabled{
    opacity:.4;
    pointer-events:none;
}

.fp-color-number{
    font-size:24px;
    font-weight:800;
}

.fp-color-label{
    font-size:9px;
}

#fpMessage{
    min-height:26px;

    margin-top:12px;

    text-align:center;

    color:#c0b098;

    font-size:12px;
}


/* INGREDIENT */

#fpIngredientPopup{
    position:absolute;

    z-index:50;

    top:16px;
    left:16px;

    padding:
    8px 12px;

    background:
    #111217e8;

    border:
    1px solid #a584584f;

    opacity:0;

    transition:.2s;
}

#fpIngredientPopup.show{
    opacity:1;
}

.fp-popup-cn{
    font-size:18px;
    color:#ead8b9;
}

.fp-popup-sub{
    font-size:10px;
    color:#a69a88;
}


/* BOOK */

.fp-book-grid{
    display:grid;

    grid-template-columns:
    repeat(
        auto-fit,
        minmax(190px,1fr)
    );

    gap:11px;
}

.fp-book-card{
    min-height:120px;

    padding:16px;

    border:
    1px solid #a68a5e4c;
}

.fp-book-card.locked{
    display:flex;
    justify-content:center;
    align-items:center;

    color:#625e57;
}

.fp-book-name{
    font-size:19px;
    color:#ead7b8;
}

.fp-book-pinyin,
.fp-book-description{
    color:#9e9280;

    font-size:11px;

    line-height:1.7;
}

.fp-result-title{
    text-align:center;

    color:#f0debc;

    font-size:38px;
}

.fp-result-cn{
    text-align:center;

    color:#aa8d66;

    margin-bottom:20px;
}

`;

document.head.appendChild(style);


/* ======================================================
   ROOT
====================================================== */

const root =
document.createElement("div");

root.id =
"foodPuzzleRoot";

document.body.appendChild(root);


/* ======================================================
   UI BASICS
====================================================== */

function stopPlayer(){

    try{

        if(typeof keys !== "undefined"){

            for(const k in keys){
                keys[k] = false;
            }

        }

        if(typeof player !== "undefined"){
            player.moving = false;
        }

    }catch(e){}

}


function openRoot(){

    foodUIOpen = true;

    stopPlayer();

    root.classList.add("open");

}


function closeRoot(){

    foodUIOpen = false;

    selectedDish = null;

    if(raf){
        cancelAnimationFrame(raf);
    }

    puzzle = null;

    root.innerHTML = "";

    root.classList.remove("open");

}

/* ======================================================
   ORDER
====================================================== */

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
                老板「腹が減ってるなら、何か食べていくかい？」
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

    document.getElementById("fpMenuButton").onclick =
    showMenu;

    document.getElementById("fpBookButton").onclick =
    showFoodBook;

    document.getElementById("fpCloseButton").onclick =
    closeRoot;

}


/* ======================================================
   MENU
====================================================== */

function showMenu(){

    openRoot();

    puzzle = null;

    const cards =
    Object.entries(DISHES)
    .map(([id,d])=>`

        <div
            class="fp-dish"
            data-id="${id}"
        >

            <div class="fp-dish-name">
                ${d.name}
            </div>

            <div class="fp-dish-pinyin">
                ${d.pinyin}
                ／
                ${d.region}
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
                style="margin-top:20px"
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

    root.querySelectorAll(".fp-dish")
    .forEach(card=>{

        card.onclick =
        ()=>showDishIntro(
            card.dataset.id
        );

    });

    document.getElementById("fpMenuBack").onclick =
    showOrderQuestion;

}


/* ======================================================
   INTRO
====================================================== */

function showDishIntro(id){

    const dish =
    DISHES[id];

    if(!dish)return;

    selectedDish = id;

    root.innerHTML = `

    <div class="fp-screen">

        <div class="fp-panel">

            <div class="fp-eyebrow">
                本日の一杯
            </div>

            <h2 class="fp-title">
                ${dish.name}
            </h2>

            <div class="fp-subtitle">
                ${dish.pinyin}
            </div>

            <div class="fp-description">
                ${dish.description}
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

    document.getElementById("fpStart").onclick =
    ()=>startPuzzle(id);

    document.getElementById("fpIntroBack").onclick =
    showMenu;

}


/* ======================================================
   START PUZZLE
====================================================== */

function startPuzzle(id){

    const dish =
    DISHES[id];

    if(!dish)return;

    selectedDish = id;

    const pixels = [];

    dish.pixelMap.forEach((row,y)=>{

        [...row].forEach((symbol,x)=>{

            if(symbol === ".")return;

            pixels.push({

                x,
                y,
                symbol,

                eaten:false,

                reserved:false,

                element:null

            });

        });

    });

    puzzle = {

        dishId:id,

        dish,

        pixels,

        originalCount:
        pixels.length,

        queue:[],

        hand:[],

        busy:false,

        over:false,

        activeBlock:null,

        angle:
        -Math.PI/2,

        lastTime:
        performance.now(),

        lastShot:
        0,

        activeStart:
        0,

        angleTravelled:
        0,

        shotsThisRun:
        0

    };

    createQueue();

    renderPuzzle();

}


/* ======================================================
   GAMEPLAY SYMBOL
====================================================== */

function gameplaySymbol(symbol){

    /*
      Y / Y2 のような明暗違いは
      ゲーム上では同じ食材として扱う。
    */

    if(symbol === "Y2")return "Y";
    if(symbol === "G2")return "G";
    if(symbol === "R2")return "R";
    if(symbol === "O2")return "O";
    if(symbol === "D2")return "D";
    if(symbol === "B2")return "B";

    return symbol;

}


/* ======================================================
   QUEUE
====================================================== */

function createQueue(){

    const counts = {};

    puzzle.pixels.forEach(p=>{

        const s =
        gameplaySymbol(p.symbol);

        counts[s] =
        (counts[s] || 0)+1;

    });

    const blocks = [];

    Object.entries(counts)
    .forEach(([symbol,count])=>{

        let left = count;

        while(left > 0){

            const base =
            Math.min(
                left,
                9 +
                Math.floor(
                    Math.random()*14
                )
            );

            /*
              一部のブロックには
              実際の残りドットより少し多めの弾数を持たせる。

              この余りが「手持ち」に回る。
            */

            const extra =
            Math.random() < .28
            ? Math.floor(Math.random()*4)
            : 0;

            blocks.push({

                symbol,

                amount:
                base + extra

            });

            left -= base;

        }

    });

    /*
      順番をシャッフル。
    */

    for(let i=blocks.length-1;i>0;i--){

        const j =
        Math.floor(
            Math.random()*(i+1)
        );

        [blocks[i],blocks[j]] =
        [blocks[j],blocks[i]];

    }

    puzzle.queue =
    blocks;

}


/* ======================================================
   GAME UI
====================================================== */

function renderPuzzle(){

    openRoot();

    const dish =
    puzzle.dish;

    const cols =
    Math.max(
        ...dish.pixelMap.map(
            r=>r.length
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
                    id="fpPixelBoard"
                    style="
                    grid-template-columns:
                    repeat(${cols},11px)
                    "
                ></div>

                <div
                    id="fpOrbitGuide"
                    class="fp-orbit-guide"
                ></div>

                <div id="fpOrbiter"></div>

                <div id="fpIngredientPopup"></div>

            </div>


            <div class="fp-hand-title">
                手持ち　4枠
            </div>

            <div id="fpHand"></div>


            <div class="fp-block-title">
                次に使う色ブロックを選ぶ
            </div>

            <div id="fpBlocks"></div>


            <div id="fpMessage">
                外側に見えている色を狙おう
            </div>


            <div
                class="fp-buttons"
                style="margin-top:14px"
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

    document.getElementById("fpQuit").onclick =
    ()=>{

        if(!puzzle.busy){
            showMenu();
        }

    };

    buildPixelBoard();

    drawHand();

    drawBlocks();

    updateProgress();

}


/* ======================================================
   PIXEL BOARD
====================================================== */

function buildPixelBoard(){

    const board =
    document.getElementById(
        "fpPixelBoard"
    );

    board.innerHTML = "";

    puzzle.dish.pixelMap
    .forEach((row,y)=>{

        [...row].forEach((symbol,x)=>{

            const cell =
            document.createElement("div");

            cell.className =
            "fp-pixel";

            if(symbol === "."){

                cell.classList.add("empty");

                board.appendChild(cell);

                return;

            }

            const palette =
            puzzle.dish.palette[symbol];

            cell.style.background =
            palette.color;

            const pixel =
            puzzle.pixels.find(
                p=>p.x===x && p.y===y
            );

            if(pixel){
                pixel.element = cell;
            }

            board.appendChild(cell);

        });

    });

}


/* ======================================================
   PALETTE
====================================================== */

function getPalette(symbol){

    return puzzle.dish.palette[symbol]
        ||
        puzzle.dish.palette[
            gameplaySymbol(symbol)
        ];

}


/* ======================================================
   DISPLAY BLOCKS
====================================================== */

function drawBlocks(){

    const holder =
    document.getElementById(
        "fpBlocks"
    );

    if(!holder)return;

    holder.innerHTML = "";

    puzzle.queue
    .slice(0,5)
    .forEach((block,index)=>{

        const data =
        getPalette(block.symbol);

        const el =
        document.createElement("div");

        el.className =
        "fp-color-block";

        if(puzzle.busy){
            el.classList.add("disabled");
        }

        el.style.background =
        `linear-gradient(
            ${data.color},
            ${data.dark}
        )`;

        el.innerHTML = `

        <div class="fp-color-number">
            ${block.amount}
        </div>

        <div class="fp-color-label">
            ${data.name}
        </div>

        `;

        el.onclick =
        ()=>activateQueueBlock(index);

        holder.appendChild(el);

    });

}


/* ======================================================
   HAND
====================================================== */

function drawHand(){

    const holder =
    document.getElementById(
        "fpHand"
    );

    if(!holder)return;

    holder.innerHTML = "";

    for(let i=0;i<HAND_MAX;i++){

        const slot =
        document.createElement("div");

        slot.className =
        "fp-hand-slot";

        const block =
        puzzle.hand[i];

        if(block){

            const data =
            getPalette(block.symbol);

            slot.classList.add("used");

            slot.style.background =
            `linear-gradient(
                ${data.color},
                ${data.dark}
            )`;

            slot.innerHTML =
            `${data.name}<br>${block.amount}`;

            if(!puzzle.busy){

                slot.onclick =
                ()=>activateHandBlock(i);

            }

        }else{

            slot.textContent =
            "—";

        }

        holder.appendChild(slot);

    }

}


/* ======================================================
   ACTIVATE BLOCK
====================================================== */

function activateQueueBlock(index){

    if(
        !puzzle ||
        puzzle.busy ||
        puzzle.over
    ){
        return;
    }

    const block =
    puzzle.queue[index];

    if(!block)return;

    puzzle.queue.splice(index,1);

    activateBlock(
        block,
        "queue"
    );

}


function activateHandBlock(index){

    if(
        !puzzle ||
        puzzle.busy ||
        puzzle.over
    ){
        return;
    }

    const block =
    puzzle.hand[index];

    if(!block)return;

    puzzle.hand.splice(index,1);

    activateBlock(
        block,
        "hand"
    );

}


function activateBlock(block,source){

    puzzle.busy = true;

    puzzle.activeBlock = {

        symbol:
        block.symbol,

        amount:
        block.amount,

        source

    };

    puzzle.activeStart =
    performance.now();

    puzzle.lastShot = 0;

    puzzle.shotsThisRun = 0;

    puzzle.angleTravelled = 0;

    puzzle.lastTime =
    performance.now();

    drawBlocks();

    drawHand();

    const data =
    getPalette(block.symbol);

    showIngredient(
        block.symbol
    );

    setMessage(
        `${data.name} ${block.amount}：射線を探しています……`
    );

    const orbiter =
    document.getElementById(
        "fpOrbiter"
    );

    /*
      Ver.4.1:
      選択直後に位置を決めてから表示する。
      これで一瞬左上に出たり、
      表示されない状態になるのを防ぐ。
    */

    updateOrbiterPosition();

    orbiter.classList.add("active");

    orbiter.style.background =
    `linear-gradient(
        ${data.color},
        ${data.dark}
    )`;

    orbiter.textContent =
    block.amount;

    raf =
    requestAnimationFrame(
        puzzleLoop
    );

}


/* ======================================================
   MAIN PUZZLE LOOP
====================================================== */

function puzzleLoop(now){

    if(
        !puzzle ||
        !puzzle.busy ||
        !puzzle.activeBlock
    ){
        return;
    }

    const dt =
    Math.min(
        (now-puzzle.lastTime)/1000,
        .05
    );

    puzzle.lastTime = now;

    /*
      Ver.4.1

      以前よりかなり遅い。
      砲台の位置を目で追える速度。
    */

    const oldAngle =
    puzzle.angle;

    puzzle.angle +=
    ORBIT_SPEED *
    (dt*1000);

    puzzle.angleTravelled +=
    Math.abs(
        puzzle.angle-oldAngle
    );

    updateOrbiterPosition();

    /*
      一定間隔で
      「現在位置から撃てる同色ドット」
      を探す。
    */

    if(
        now-puzzle.lastShot >=
        FIRE_INTERVAL
    ){

        const target =
        findShootableTarget();

        if(target){

            puzzle.lastShot = now;

            fireBullet(target);

        }

    }

    /*
      ブロックを使い切った。
    */

    if(
        puzzle.activeBlock &&
        puzzle.activeBlock.amount <= 0
    ){

        finishActiveBlock();

        return;

    }

    /*
      1周以上しても
      現在の色に射線が通らない場合。
    */

    if(
        puzzle.angleTravelled >=
        Math.PI*2*NO_SHOT_ORBITS
    ){

        if(
            !findShootableTarget()
        ){

            storeActiveBlock();

            return;

        }

        puzzle.angleTravelled = 0;

    }

    /*
      念のための時間上限。
    */

    if(
        now-puzzle.activeStart >
        MAX_SEARCH_TIME
    ){

        storeActiveBlock();

        return;

    }

    raf =
    requestAnimationFrame(
        puzzleLoop
    );

}


/* ======================================================
   ORBIT POSITION
====================================================== */

function updateOrbiterPosition(){

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

    const guide =
    document.getElementById(
        "fpOrbitGuide"
    );

    if(
        !shell ||
        !board ||
        !orb
    ){
        return;
    }

    const sr =
    shell.getBoundingClientRect();

    const br =
    board.getBoundingClientRect();

    /*
      料理ドット絵の中心。
    */

    const cx =
    br.left -
    sr.left +
    br.width/2;

    const cy =
    br.top -
    sr.top +
    br.height/2;

    /*
      Ver.4.1の重要修正。

      料理から少しだけ離れた軌道を作るが、
      fpBoardShellの外にはみ出しすぎない。
    */

    const margin = 38;

    const orbHalf = 23;

    const maxRx =
    Math.max(
        70,
        sr.width/2 -
        orbHalf -
        12
    );

    const maxRy =
    Math.max(
        70,
        sr.height/2 -
        orbHalf -
        12
    );

    const rx =
    Math.min(
        br.width/2 + margin,
        maxRx
    );

    const ry =
    Math.min(
        br.height/2 + margin,
        maxRy
    );

    const x =
    cx +
    Math.cos(
        puzzle.angle
    )*rx;

    const y =
    cy +
    Math.sin(
        puzzle.angle
    )*ry;

    orb.style.left =
    `${x-orbHalf}px`;

    orb.style.top =
    `${y-orbHalf}px`;

    /*
      薄い点線で
      周回ルートも見えるようにする。
    */

    if(guide){

        guide.style.width =
        `${rx*2}px`;

        guide.style.height =
        `${ry*2}px`;

        guide.style.left =
        `${cx-rx}px`;

        guide.style.top =
        `${cy-ry}px`;

    }

}

/* ======================================================
   LINE OF SIGHT
====================================================== */

function getOrbiterCenter(){

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    const orb =
    document.getElementById(
        "fpOrbiter"
    );

    if(!shell || !orb){
        return null;
    }

    const sr =
    shell.getBoundingClientRect();

    const or =
    orb.getBoundingClientRect();

    return {

        x:
        or.left -
        sr.left +
        or.width/2,

        y:
        or.top -
        sr.top +
        or.height/2

    };

}


function getPixelCenter(pixel){

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    if(
        !shell ||
        !pixel.element
    ){
        return null;
    }

    const sr =
    shell.getBoundingClientRect();

    const pr =
    pixel.element
    .getBoundingClientRect();

    return {

        x:
        pr.left -
        sr.left +
        pr.width/2,

        y:
        pr.top -
        sr.top +
        pr.height/2

    };

}


/*
==========================================================
 射線判定

 砲台から対象ドットへ向かって
 実際に線を進める。

 奥に赤があっても、
 手前に黄色があれば黄色が先にヒットする。

   ● → → → 🟨 🟥

 この場合、赤は撃てない。
==========================================================
*/

function firstPixelOnRay(
    start,
    target
){

    const dx =
    target.x -
    start.x;

    const dy =
    target.y -
    start.y;

    const distance =
    Math.hypot(
        dx,
        dy
    );

    if(distance === 0){
        return null;
    }

    const ux =
    dx/distance;

    const uy =
    dy/distance;

    /*
      3px刻みに変更。

      11pxのドットに対して十分細かく、
      隙間をすり抜けにくくする。
    */

    for(
        let d=8;
        d<distance+7;
        d+=3
    ){

        const x =
        start.x +
        ux*d;

        const y =
        start.y +
        uy*d;

        const hit =
        findPixelAtScreenPoint(
            x,
            y
        );

        if(hit){
            return hit;
        }

    }

    return null;

}


/* ======================================================
   PIXEL COLLISION
====================================================== */

function findPixelAtScreenPoint(
    x,
    y
){

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    if(!shell){
        return null;
    }

    const sr =
    shell.getBoundingClientRect();

    for(
        const pixel of
        puzzle.pixels
    ){

        if(
            pixel.eaten ||
            !pixel.element
        ){
            continue;
        }

        const r =
        pixel.element
        .getBoundingClientRect();

        const left =
        r.left -
        sr.left;

        const top =
        r.top -
        sr.top;

        /*
          少し内側で判定する。

          ドットの角ギリギリを
          弾がかすっただけで
          遮られる現象を減らす。
        */

        const inset = 1;

        if(
            x >= left + inset &&
            x <= left + r.width - inset &&
            y >= top + inset &&
            y <= top + r.height - inset
        ){
            return pixel;
        }

    }

    return null;

}


/* ======================================================
   FIND SHOOTABLE PIXEL
====================================================== */

function findShootableTarget(){

    if(
        !puzzle ||
        !puzzle.activeBlock
    ){
        return null;
    }

    const start =
    getOrbiterCenter();

    if(!start){
        return null;
    }

    const wanted =
    puzzle.activeBlock.symbol;

    /*
      選択中の色だけを候補にする。
    */

    const candidates =
    puzzle.pixels
    .filter(p=>

        !p.eaten &&

        !p.reserved &&

        gameplaySymbol(
            p.symbol
        ) === wanted

    );

    let best = null;

    let bestDistance =
    Infinity;

    for(
        const pixel of
        candidates
    ){

        const target =
        getPixelCenter(
            pixel
        );

        if(!target){
            continue;
        }

        /*
          このドットへ向かって
          レイを飛ばす。
        */

        const first =
        firstPixelOnRay(
            start,
            target
        );

        /*
          最初にぶつかったものが
          その対象自身なら、
          外から見えている。
        */

        if(first !== pixel){
            continue;
        }

        const distance =
        Math.hypot(
            target.x -
            start.x,

            target.y -
            start.y
        );

        /*
          見えている候補の中で
          砲台に近いものから撃つ。

          これによって外側から
          削っている感覚が強くなる。
        */

        if(
            distance <
            bestDistance
        ){

            bestDistance =
            distance;

            best =
            pixel;

        }

    }

    return best;

}


/* ======================================================
   FIRE
====================================================== */

function fireBullet(target){

    if(
        !puzzle ||
        !puzzle.activeBlock ||
        puzzle.activeBlock.amount <= 0
    ){
        return;
    }

    /*
      同じドットへ
      複数の弾を同時発射しない。
    */

    if(target.reserved){
        return;
    }

    target.reserved = true;

    const start =
    getOrbiterCenter();

    const end =
    getPixelCenter(
        target
    );

    if(
        !start ||
        !end
    ){

        target.reserved =
        false;

        return;
    }

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    if(!shell){

        target.reserved =
        false;

        return;
    }

    const bullet =
    document.createElement(
        "div"
    );

    bullet.className =
    "fp-bullet";

    const data =
    getPalette(
        puzzle.activeBlock.symbol
    );

    /*
      弾は選択した食材色。
    */

    bullet.style.background =
    data.color;

    bullet.style.color =
    data.color;

    bullet.style.left =
    `${start.x-4}px`;

    bullet.style.top =
    `${start.y-4}px`;

    shell.appendChild(
        bullet
    );

    const dx =
    end.x -
    start.x;

    const dy =
    end.y -
    start.y;

    const distance =
    Math.hypot(
        dx,
        dy
    );

    const duration =
    Math.max(
        70,

        distance /
        BULLET_SPEED *
        1000
    );

    const started =
    performance.now();

    /*
      弾を飛ばす。
    */

    function fly(now){

        if(
            !puzzle ||
            !puzzle.busy ||
            !puzzle.activeBlock
        ){

            bullet.remove();

            target.reserved =
            false;

            return;
        }

        const t =
        Math.min(
            1,
            (now-started) /
            duration
        );

        const x =
        start.x +
        dx*t;

        const y =
        start.y +
        dy*t;

        bullet.style.left =
        `${x-4}px`;

        bullet.style.top =
        `${y-4}px`;

        /*
          飛行中にも
          実際の衝突をチェック。

          見た目だけの弾ではない。
        */

        const hit =
        findPixelAtScreenPoint(
            x,
            y
        );

        if(hit){

            bullet.remove();

            target.reserved =
            false;

            /*
              選択色と
              最初にぶつかった色が同じなら破壊。
            */

            if(
                gameplaySymbol(
                    hit.symbol
                )
                ===
                puzzle.activeBlock.symbol
            ){

                hitPixel(
                    hit
                );

            }else{

                /*
                  別色なら遮られる。

                  弾だけ消える。
                  相手のドットは壊れない。
                */

                blockedShotEffect(
                    hit
                );

            }

            return;
        }

        if(t >= 1){

            bullet.remove();

            target.reserved =
            false;

            return;
        }

        requestAnimationFrame(
            fly
        );

    }

    requestAnimationFrame(
        fly
    );

}


/* ======================================================
   BLOCKED SHOT EFFECT
====================================================== */

function blockedShotEffect(pixel){

    if(
        !pixel ||
        !pixel.element
    ){
        return;
    }

    /*
      遮られた時は
      ごく短く光らせるだけ。
      破壊はしない。
    */

    pixel.element.style.filter =
    "brightness(1.6)";

    setTimeout(()=>{

        if(
            pixel.element &&
            !pixel.eaten
        ){

            pixel.element.style.filter =
            "";

        }

    },80);

}


/* ======================================================
   HIT
====================================================== */

function hitPixel(pixel){

    if(
        !pixel ||
        pixel.eaten ||
        !puzzle ||
        !puzzle.activeBlock ||
        puzzle.activeBlock.amount <= 0
    ){
        return;
    }

    pixel.eaten =
    true;

    pixel.reserved =
    false;

    puzzle.activeBlock.amount--;

    puzzle.shotsThisRun++;

    /*
      カッ！と弾ける。
    */

    pixel.element.classList.add(
        "hit"
    );

    createParticles(
        pixel
    );

    setTimeout(()=>{

        if(pixel.element){

            pixel.element.classList.add(
                "dead"
            );

        }

    },120);

    updateOrbiterNumber();

    updateProgress();

    showIngredient(
        pixel.symbol
    );

    /*
      全消し。
    */

    if(
        puzzle.pixels.every(
            p=>p.eaten
        )
    ){

        puzzle.over =
        true;

        puzzle.busy =
        false;

        if(raf){
            cancelAnimationFrame(
                raf
            );
        }

        hideOrbiter();

        setTimeout(
            showComplete,
            450
        );

    }

}


/* ======================================================
   PARTICLES
====================================================== */

function createParticles(pixel){

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    if(
        !shell ||
        !pixel.element
    ){
        return;
    }

    const sr =
    shell.getBoundingClientRect();

    const pr =
    pixel.element
    .getBoundingClientRect();

    const data =
    puzzle.dish.palette[
        pixel.symbol
    ];

    for(
        let i=0;
        i<5;
        i++
    ){

        const p =
        document.createElement(
            "div"
        );

        p.className =
        "fp-particle";

        p.style.background =
        data.color;

        p.style.left =
        `${
            pr.left -
            sr.left +
            pr.width/2
        }px`;

        p.style.top =
        `${
            pr.top -
            sr.top +
            pr.height/2
        }px`;

        p.style.setProperty(
            "--x",
            `${
                (Math.random()-.5)*42
            }px`
        );

        p.style.setProperty(
            "--y",
            `${
                (Math.random()-.5)*42
            }px`
        );

        shell.appendChild(
            p
        );

        setTimeout(
            ()=>p.remove(),
            320
        );

    }

}


/* ======================================================
   ACTIVE BLOCK FINISHED
====================================================== */

function finishActiveBlock(){

    if(
        !puzzle ||
        !puzzle.activeBlock
    ){
        return;
    }

    const data =
    getPalette(
        puzzle.activeBlock.symbol
    );

    setMessage(
        `${data.name}を使い切った！`
    );

    hideOrbiter();

    puzzle.activeBlock =
    null;

    puzzle.busy =
    false;

    drawBlocks();

    drawHand();

    checkQueueState();

}


/* ======================================================
   STORE UNUSED BLOCK
====================================================== */

function storeActiveBlock(){

    if(
        !puzzle ||
        !puzzle.activeBlock
    ){
        return;
    }

    const block =
    puzzle.activeBlock;

    if(block.amount <= 0){

        finishActiveBlock();

        return;
    }

    const data =
    getPalette(
        block.symbol
    );

    hideOrbiter();

    /*
      4枠が埋まっている状態で
      さらに余りが発生したら
      GAME OVER。
    */

    if(
        puzzle.hand.length >=
        HAND_MAX
    ){

        puzzle.over =
        true;

        puzzle.busy =
        false;

        puzzle.activeBlock =
        null;

        setMessage(
            "手持ちがいっぱいだ！"
        );

        setTimeout(
            showFail,
            500
        );

        return;
    }

    /*
      使い切れなかったブロックを
      手持ちに保存。
    */

    puzzle.hand.push({

        symbol:
        block.symbol,

        amount:
        block.amount

    });

    setMessage(
        `${data.name} ${block.amount} はまだ届かない。手持ちへ。`
    );

    puzzle.activeBlock =
    null;

    puzzle.busy =
    false;

    drawHand();

    drawBlocks();

    checkQueueState();

}


/* ======================================================
   HIDE ORBITER
====================================================== */

function hideOrbiter(){

    if(raf){

        cancelAnimationFrame(
            raf
        );

        raf = null;

    }

    const orb =
    document.getElementById(
        "fpOrbiter"
    );

    if(orb){

        orb.classList.remove(
            "active"
        );

    }

}


/* ======================================================
   CHECK STATE
====================================================== */

function checkQueueState(){

    if(!puzzle){
        return;
    }

    if(
        puzzle.pixels.every(
            p=>p.eaten
        )
    ){

        showComplete();

        return;
    }

    /*
      新しいブロックがなくても
      手持ちがあればゲーム続行。
    */

    if(
        puzzle.queue.length === 0 &&
        puzzle.hand.length === 0
    ){

        createRemainingBlocks();

        drawBlocks();

    }

}


/* ======================================================
   REMAINING BLOCKS
====================================================== */

function createRemainingBlocks(){

    const counts = {};

    puzzle.pixels
    .filter(
        p=>!p.eaten
    )
    .forEach(p=>{

        const s =
        gameplaySymbol(
            p.symbol
        );

        counts[s] =
        (counts[s] || 0)+1;

    });

    puzzle.queue =
    Object.entries(counts)
    .map(
        ([symbol,count])=>({

            symbol,

            amount:
            Math.min(
                count,
                16
            )

        })
    );

}


/* ======================================================
   ORBIT NUMBER
====================================================== */

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


/* ======================================================
   PROGRESS
====================================================== */

function updateProgress(){

    if(!puzzle){
        return;
    }

    const eaten =
    puzzle.pixels
    .filter(
        p=>p.eaten
    )
    .length;

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

/* ======================================================
   INGREDIENT
====================================================== */

let popupTimer = null;

function showIngredient(symbol){

    if(!puzzle){
        return;
    }

    const data =
    puzzle.dish.palette[symbol]
    ||
    getPalette(symbol);

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

    clearTimeout(
        popupTimer
    );

    popupTimer =
    setTimeout(()=>{

        popup.classList.remove(
            "show"
        );

    },900);

}


/* ======================================================
   MESSAGE
====================================================== */

function setMessage(text){

    const el =
    document.getElementById(
        "fpMessage"
    );

    if(el){
        el.textContent = text;
    }

}


/* ======================================================
   COMPLETE
====================================================== */

function showComplete(){

    if(!puzzle){
        return;
    }

    const id =
    puzzle.dishId;

    const dish =
    puzzle.dish;

    discoverDish(id);

    hideOrbiter();

    root.innerHTML = `

    <div class="fp-screen">

        <div class="fp-panel">

            <div class="fp-result-title">
                完食！
            </div>

            <div class="fp-result-cn">
                吃完了！
            </div>

            <h2 class="fp-title">
                ${dish.name}
            </h2>

            <div class="fp-subtitle">
                ${dish.pinyin}
            </div>

            <div class="fp-description">
                ${dish.description}
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


/* ======================================================
   FAIL
====================================================== */

function showFail(){

    if(!puzzle){
        return;
    }

    const id =
    puzzle.dishId;

    hideOrbiter();

    root.innerHTML = `

    <div class="fp-screen">

        <div class="fp-panel">

            <div class="fp-result-title">
                手持ちがいっぱい！
            </div>

            <div class="fp-result-cn">
                吃不下了……
            </div>

            <div class="fp-description">

                使い切れなかった色ブロックが
                4枠を超えてしまいました。

                <br><br>

                周回する砲台から料理を見て、
                球が届く色から崩していきましょう。

                <br><br>

                奥にある色は、
                手前の料理に遮られて撃てません。

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


/* ======================================================
   FOOD BOOK
====================================================== */

function showFoodBook(){

    openRoot();

    puzzle = null;

    const cards =
    Object.entries(DISHES)
    .map(([id,d])=>{

        if(
            !discovered.includes(id)
        ){

            return `

            <div
                class="fp-book-card locked"
            >
                ？？？
            </div>

            `;

        }

        return `

        <div class="fp-book-card">

            <div class="fp-book-name">
                ${d.name}
            </div>

            <div class="fp-book-pinyin">
                ${d.pinyin}
            </div>

            <div class="fp-book-description">

                ${d.region}

                <br><br>

                ${d.description}

            </div>

        </div>

        `;

    })
    .join("");

    root.innerHTML = `

    <div class="fp-screen">

        <div class="fp-panel">

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

            <div
                class="fp-buttons"
                style="margin-top:20px"
            >

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


/* ======================================================
   ESC
====================================================== */

window.addEventListener(
"keydown",
event=>{

    if(!foodUIOpen){
        return;
    }

    /*
      ミニゲーム中は
      本編側にキー入力を渡さない。
    */

    event.preventDefault();

    event.stopImmediatePropagation();

    if(
        event.key ===
        "Escape"
    ){

        /*
          砲台が動いている最中は
          誤操作防止のため閉じない。
        */

        if(
            puzzle &&
            puzzle.busy
        ){
            return;
        }

        if(puzzle){

            showMenu();

        }else{

            closeRoot();

        }

    }

},
true
);


/* ======================================================
   NOODLE SHOP CONNECTION
====================================================== */

/*
  story.jsなどによる
  advanceDialogueの上書き後に
  food-breakout.jsを読み込むこと。

  面館の老板との通常会話が
  最後まで終了した時だけ
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
                  ストーリーモード中には
                  自動で料理ゲームを開かない。
                */

                if(
                    typeof STORY ===
                    "undefined"
                    ||
                    STORY.mode !==
                    "story"
                ){

                    shouldOpen =
                    true;

                }

            }

        }catch(e){}

        originalAdvanceDialogue();

        if(shouldOpen){

            waitingForNoodleMenu =
            true;

            waitForDialogueEnd();

        }

    };

}


/* ======================================================
   WAIT DIALOGUE
====================================================== */

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

    }catch(e){}

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


/* ======================================================
   PUBLIC
====================================================== */

window.openNoodleMenu =
showOrderQuestion;

window.openFoodBook =
showFoodBook;

window.FOOD_DISHES =
DISHES;


/* ======================================================
   DEBUG / VERSION
====================================================== */

console.log(
    "杭州探索録 FOOD PIXEL PUZZLE Ver.4.1 loaded"
);

})();
