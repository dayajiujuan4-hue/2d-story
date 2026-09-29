"use strict";

/*
==========================================================
 杭州探索録
 FOOD PIXEL PUZZLE Ver.4.0

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
const ORBIT_SPEED = 0.00072;

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

    /*
       前より細かい料理。

       同じ食材でも明暗を分け、
       料理として立体感を出している。
    */

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

const style =
document.createElement("style");

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
    min-height:500px;
    display:flex;
    align-items:center;
    justify-content:center;
    overflow:hidden;
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


/* ORBIT BLOCK */

#fpOrbiter{
    position:absolute;
    z-index:20;
    width:42px;
    height:42px;
    display:none;
    align-items:center;
    justify-content:center;
    border-radius:8px;
    border:3px solid #ffffff88;
    color:white;
    font-weight:800;
    font-size:14px;
    text-shadow:0 2px 3px #000;
    box-shadow:
    0 5px 0 #0006,
    0 0 15px #ffffff30;
    pointer-events:none;
}

#fpOrbiter.active{
    display:flex;
}


/* BULLET */

.fp-bullet{
    position:absolute;
    z-index:18;
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
    z-index:19;
    width:4px;
    height:4px;
    animation:fpParticle .3s forwards;
}

@keyframes fpParticle{

    to{
        opacity:0;
        transform:
        translate(var(--x),var(--y))
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
    border:1px solid #554e45;
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
    transform:translateY(-2px);
    filter:brightness(1.1);
}


/* QUEUE */

.fp-block-title{
    margin:15px 0 8px;
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
    border:2px solid #ffffff55;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    color:white;
    text-shadow:0 2px 3px #000;
    box-shadow:
    inset 0 4px #ffffff30,
    inset 0 -5px #0003,
    0 5px #0006;
}

.fp-color-block:hover{
    transform:translateY(-3px);
    filter:brightness(1.12);
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
    z-index:30;
    top:16px;
    left:16px;
    padding:8px 12px;
    background:#111217e8;
    border:1px solid #a584584f;
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
    repeat(auto-fit,minmax(190px,1fr));
    gap:11px;
}

.fp-book-card{
    min-height:120px;
    padding:16px;
    border:1px solid #a68a5e4c;
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
   QUEUE
====================================================== */

function gameplaySymbol(symbol){

    /*
      明暗違いは同じ食材として扱う。
    */

    if(symbol === "Y2")return "Y";
    if(symbol === "G2")return "G";
    if(symbol === "R2")return "R";
    if(symbol === "O2")return "O";
    if(symbol === "D2")return "D";
    if(symbol === "B2")return "B";

    return symbol;

}


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
              少しだけ余剰値を持たせる。
              これが手持ち発生の原因になる。
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
   DISPLAY BLOCKS
====================================================== */

function getPalette(symbol){

    return puzzle.dish.palette[symbol]
        ||
        puzzle.dish.palette[
            gameplaySymbol(symbol)
        ];

}


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
      目で追える速度で周回。
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
      一定間隔で射線を確認。
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
      ブロックを使い切った
    */

    if(
        puzzle.activeBlock &&
        puzzle.activeBlock.amount <= 0
    ){

        finishActiveBlock();

        return;

    }

    /*
      一周以上して、
      現在撃てる場所が無い。
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
      念のため時間上限。
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

    const cx =
    br.left-sr.left+
    br.width/2;

    const cy =
    br.top-sr.top+
    br.height/2;

    const rx =
    br.width/2+70;

    const ry =
    br.height/2+64;

    const x =
    cx+
    Math.cos(puzzle.angle)*rx;

    const y =
    cy+
    Math.sin(puzzle.angle)*ry;

    orb.style.left =
    `${x-21}px`;

    orb.style.top =
    `${y-21}px`;

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
        or.left-sr.left+
        or.width/2,

        y:
        or.top-sr.top+
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
        pr.left-sr.left+
        pr.width/2,

        y:
        pr.top-sr.top+
        pr.height/2

    };

}


/*
==========================================================
 重要：
 「外周判定」ではなく実際の射線で判定。

 砲台から対象へ線を引き、
 その線上で最初にぶつかる生きたピクセルを調べる。
==========================================================
*/

function firstPixelOnRay(
    start,
    target
){

    const dx =
    target.x-start.x;

    const dy =
    target.y-start.y;

    const distance =
    Math.hypot(dx,dy);

    if(distance === 0){
        return null;
    }

    const ux =
    dx/distance;

    const uy =
    dy/distance;

    /*
      4px刻みでレイを進める。
    */

    for(
        let d=8;
        d<distance+7;
        d+=4
    ){

        const x =
        start.x+
        ux*d;

        const y =
        start.y+
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


function findPixelAtScreenPoint(
    x,
    y
){

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    if(!shell)return null;

    const sr =
    shell.getBoundingClientRect();

    for(const pixel of puzzle.pixels){

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
        r.left-sr.left;

        const top =
        r.top-sr.top;

        if(
            x>=left &&
            x<=left+r.width &&
            y>=top &&
            y<=top+r.height
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

    const candidates =
    puzzle.pixels
    .filter(p=>
        !p.eaten &&
        gameplaySymbol(p.symbol)
        === wanted
    );

    let best = null;

    let bestDistance =
    Infinity;

    for(const pixel of candidates){

        const target =
        getPixelCenter(pixel);

        if(!target)continue;

        const first =
        firstPixelOnRay(
            start,
            target
        );

        /*
          対象自身が最初の衝突物なら、
          射線が通っている。
        */

        if(first !== pixel){
            continue;
        }

        const distance =
        Math.hypot(
            target.x-start.x,
            target.y-start.y
        );

        if(distance < bestDistance){

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
        !puzzle.activeBlock ||
        puzzle.activeBlock.amount <= 0
    ){
        return;
    }

    /*
      発射時点で1発予約する。
      同じマスへの大量同時射撃を防ぐ。
    */

    if(target.reserved){
        return;
    }

    target.reserved = true;

    const start =
    getOrbiterCenter();

    const end =
    getPixelCenter(target);

    if(!start || !end){

        target.reserved = false;

        return;
    }

    const shell =
    document.getElementById(
        "fpBoardShell"
    );

    const bullet =
    document.createElement("div");

    bullet.className =
    "fp-bullet";

    const data =
    getPalette(
        puzzle.activeBlock.symbol
    );

    bullet.style.background =
    data.color;

    bullet.style.color =
    data.color;

    bullet.style.left =
    `${start.x-4}px`;

    bullet.style.top =
    `${start.y-4}px`;

    shell.appendChild(bullet);

    const dx =
    end.x-start.x;

    const dy =
    end.y-start.y;

    const distance =
    Math.hypot(dx,dy);

    const duration =
    Math.max(
        70,
        distance/
        BULLET_SPEED*
        1000
    );

    const started =
    performance.now();

    function fly(now){

        if(
            !puzzle ||
            !puzzle.busy
        ){

            bullet.remove();

            target.reserved = false;

            return;

        }

        const t =
        Math.min(
            1,
            (now-started)/duration
        );

        const x =
        start.x+
        dx*t;

        const y =
        start.y+
        dy*t;

        bullet.style.left =
        `${x-4}px`;

        bullet.style.top =
        `${y-4}px`;

        /*
          飛行中にも衝突を見る。

          これにより途中のドットを
          すり抜けない。
        */

        const hit =
        findPixelAtScreenPoint(
            x,
            y
        );

        if(hit){

            bullet.remove();

            target.reserved = false;

            /*
              最初にぶつかったものが
              狙った色なら破壊。

              別色なら弾はそこで消える。
            */

            if(
                gameplaySymbol(hit.symbol)
                ===
                puzzle.activeBlock.symbol
            ){

                hitPixel(hit);

            }

            return;

        }

        if(t >= 1){

            bullet.remove();

            target.reserved = false;

            return;

        }

        requestAnimationFrame(fly);

    }

    requestAnimationFrame(fly);

}


/* ======================================================
   HIT
====================================================== */

function hitPixel(pixel){

    if(
        pixel.eaten ||
        !puzzle.activeBlock ||
        puzzle.activeBlock.amount <= 0
    ){
        return;
    }

    pixel.eaten = true;

    puzzle.activeBlock.amount--;

    puzzle.shotsThisRun++;

    pixel.element.classList.add(
        "hit"
    );

    createParticles(pixel);

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
      全消し判定
    */

    if(
        puzzle.pixels.every(
            p=>p.eaten
        )
    ){

        puzzle.over = true;

        puzzle.busy = false;

        if(raf){
            cancelAnimationFrame(raf);
        }

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

    for(let i=0;i<4;i++){

        const p =
        document.createElement("div");

        p.className =
        "fp-particle";

        p.style.background =
        data.color;

        p.style.left =
        `${
            pr.left-sr.left+
            pr.width/2
        }px`;

        p.style.top =
        `${
            pr.top-sr.top+
            pr.height/2
        }px`;

        p.style.setProperty(
            "--x",
            `${(Math.random()-.5)*38}px`
        );

        p.style.setProperty(
            "--y",
            `${(Math.random()-.5)*38}px`
        );

        shell.appendChild(p);

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

    if(!puzzle)return;

    const data =
    getPalette(
        puzzle.activeBlock.symbol
    );

    setMessage(
        `${data.name}を使い切った！`
    );

    hideOrbiter();

    puzzle.activeBlock = null;

    puzzle.busy = false;

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
    getPalette(block.symbol);

    hideOrbiter();

    /*
      手持ちが既に4つならGAME OVER。
    */

    if(
        puzzle.hand.length >=
        HAND_MAX
    ){

        puzzle.over = true;

        puzzle.busy = false;

        puzzle.activeBlock = null;

        setMessage(
            "手持ちがいっぱいだ！"
        );

        setTimeout(
            showFail,
            500
        );

        return;

    }

    puzzle.hand.push({

        symbol:
        block.symbol,

        amount:
        block.amount

    });

    setMessage(
        `${data.name} ${block.amount} はまだ届かない。手持ちへ。`
    );

    puzzle.activeBlock = null;

    puzzle.busy = false;

    drawHand();

    drawBlocks();

    checkQueueState();

}


/* ======================================================
   HIDE ORBITER
====================================================== */

function hideOrbiter(){

    if(raf){
        cancelAnimationFrame(raf);
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

    if(
        puzzle.pixels.every(
            p=>p.eaten
        )
    ){

        showComplete();

        return;

    }

    /*
      新規ブロックが無くても
      手持ちがあれば続行。
    */

    if(
        puzzle.queue.length === 0 &&
        puzzle.hand.length === 0
    ){

        /*
          残った料理がある場合は
          残数に応じた救済ブロックを作る。
        */

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
    .filter(p=>!p.eaten)
    .forEach(p=>{

        const s =
        gameplaySymbol(p.symbol);

        counts[s] =
        (counts[s] || 0)+1;

    });

    puzzle.queue =
    Object.entries(counts)
    .map(([symbol,count])=>({

        symbol,

        amount:
        Math.min(
            count,
            16
        )

    }));

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

    const eaten =
    puzzle.pixels
    .filter(p=>p.eaten)
    .length;

    const percent =
    Math.round(
        eaten/
        puzzle.originalCount*
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

    if(!puzzle)return;

    const data =
    puzzle.dish.palette[symbol]
    ||
    getPalette(symbol);

    const popup =
    document.getElementById(
        "fpIngredientPopup"
    );

    if(!popup || !data)return;

    popup.innerHTML = `

    <div class="fp-popup-cn">
        ${data.name}
    </div>

    <div class="fp-popup-sub">
        ${data.pinyin}
        　
        ${data.jp}
    </div>

    `;

    popup.classList.add("show");

    clearTimeout(popupTimer);

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

    const id =
    puzzle.dishId;

    const dish =
    puzzle.dish;

    discoverDish(id);

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

    document.getElementById("fpAgain").onclick =
    ()=>startPuzzle(id);

    document.getElementById("fpCompleteBook").onclick =
    showFoodBook;

    document.getElementById("fpReturn").onclick =
    closeRoot;

}


/* ======================================================
   FAIL
====================================================== */

function showFail(){

    const id =
    puzzle.dishId;

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

                <br>

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

    document.getElementById("fpRetry").onclick =
    ()=>startPuzzle(id);

    document.getElementById("fpFailMenu").onclick =
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

        if(!discovered.includes(id)){

            return `

            <div class="fp-book-card locked">
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

    document.getElementById("fpBookBack").onclick =
    showOrderQuestion;

}


/* ======================================================
   ESC
====================================================== */

window.addEventListener(
"keydown",
event=>{

    if(!foodUIOpen)return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if(event.key === "Escape"){

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

if(
    typeof advanceDialogue ===
    "function"
){

    const originalAdvanceDialogue =
    advanceDialogue;

    advanceDialogue =
    function(){

        let shouldOpen = false;

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
                    "undefined"
                    ||
                    STORY.mode !==
                    "story"
                ){

                    shouldOpen = true;

                }

            }

        }catch(e){}

        originalAdvanceDialogue();

        if(shouldOpen){

            waitingForNoodleMenu = true;

            waitForDialogueEnd();

        }

    };

}


/* ======================================================
   WAIT DIALOGUE
====================================================== */

function waitForDialogueEnd(){

    if(!waitingForNoodleMenu)return;

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

    }catch(e){}

    if(blocked){

        setTimeout(
            waitForDialogueEnd,
            120
        );

        return;

    }

    waitingForNoodleMenu = false;

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


console.log(
"杭州探索録 FOOD PIXEL PUZZLE Ver.4.0 loaded"
);

})();
