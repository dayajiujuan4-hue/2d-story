"use strict";

/*
==========================================================
 杭州探索録
 FOOD PIXEL PUZZLE Ver.5.0

 ・1文字 = 1ドット
 ・大文字/小文字で陰影を表現
 ・ゲーム上は同じ食材として扱う
 ・周回ブロック = 砲台
 ・砲台から実弾を発射
 ・手前のドットが奥を遮る
 ・外側から料理を崩す
 ・余りは4枠の手持ちへ
==========================================================
*/

(function(){

const FOOD_SAVE_KEY = "hangzhouFoodBookV1";

const HAND_MAX = 4;

/* 約10秒で1周 */
const ORBIT_SPEED = 0.00062;

/* 発射チェック間隔 */
const FIRE_INTERVAL = 135;

/* 弾速 */
const BULLET_SPEED = 620;

/* 1周撃てなかったら手持ちへ */
const NO_HIT_ORBIT = Math.PI * 2.05;


/* ======================================================
   DISH DATA

   大文字 = 基本色
   小文字 = 明るい/暗い陰影

   gameplaySymbol() で同じ食材として扱う。
====================================================== */

const DISHES = {

pianerchuan:{

    name:"片儿川",
    pinyin:"piànrchuān",
    region:"浙江省・杭州",
    type:"杭州の麺料理",

    description:
    "雪菜・筍・豚肉などを使う、杭州を代表する麺料理の一つ。",

    palette:{

        Y:{color:"#d8aa49",dark:"#9f7130",name:"面",pinyin:"miàn",jp:"麺"},
        y:{color:"#f0cd72",dark:"#bd9147",name:"面",pinyin:"miàn",jp:"麺"},

        G:{color:"#596f38",dark:"#354724",name:"雪菜",pinyin:"xuěcài",jp:"漬け菜"},
        g:{color:"#829751",dark:"#536534",name:"雪菜",pinyin:"xuěcài",jp:"漬け菜"},

        B:{color:"#cfb06c",dark:"#947640",name:"笋",pinyin:"sǔn",jp:"たけのこ"},
        b:{color:"#ead08b",dark:"#ae8d50",name:"笋",pinyin:"sǔn",jp:"たけのこ"},

        R:{color:"#984936",dark:"#642c24",name:"猪肉",pinyin:"zhūròu",jp:"豚肉"},
        r:{color:"#c66c50",dark:"#88422f",name:"猪肉",pinyin:"zhūròu",jp:"豚肉"},

        S:{color:"#bc8e47",dark:"#805b30",name:"汤",pinyin:"tāng",jp:"スープ"},
        s:{color:"#d2aa63",dark:"#99743d",name:"汤",pinyin:"tāng",jp:"スープ"}
    },

    /*
      片儿川
      麺の曲線・雪菜・筍・豚肉を
      なるべく不規則に配置。
    */

    pixelMap:[
"........................................",
"..............SSSSSSSSSSSS..............",
"..........SSSSSSSSSSSSSSSSSSSS..........",
"........SSSssSSSSSSSSSSssSSSSSS.........",
"......SSSSYYYYYYYYYYYYYYYYYYSSSSSS.......",
".....SSSYYYyyYYYYYYYYYYYYyyYYYSSSS.......",
"....SSYYYyYYYYGGGGGGYYYYYyYYYYSSSSS......",
"...SSYYYYYYGGGgGGGGGGGYYYYYYYYYSSSS......",
"..SSYYYYYGGggGGYYYYGGGGYYYYYYYYYSSSS.....",
"..SYYYYYGGGYYYYYBBBbBYYYYYYGGYYYYSSS.....",
".SSYYYYGGYYYYYYBBbbbBBYYYYYGGGYYYYSS.....",
".SYYYYGGYYYYYYYBBbBBBYYYYYYYGGYYYYYSS....",
"SSYYYYGYYYYRRRYYYYYYYYRRRYYYYYGGYYYYS....",
"SYYYYGGYYYRRrrRYYYYYYRrrRRYYYYGGYYYYSS...",
"SYYYYGYYYYRRrRRYYYYYYYRRrRYYYYYGGYYYYS...",
"SYYYGGYYYYYRRRYYYyyYYYYRRYYYYYYGGYYYYS...",
"SYYYYGYYYyYYYYYYYYYYYYYYYYYyYYYYGYYYYSS..",
"SYYYYGGYYYYYYYBBBbBBBYYYYYYYYYYGGYYYYYS..",
"SYYYYYGGYYYYYBBbbbbBBBYYYYYYYYGGYYYYYYS..",
"SSYYYYGGGYYYYBBBbbBBBYYYYYYYYGGGYYYYYSS..",
".SYYYYYGGGGYYYYBBBBBYYYYYYYYGGGYYYYYYSS..",
".SSYYYYYYGGGGYYYYYYYYYYYYGGGGYYYYYYYSS...",
"..SSYYYYYYYYGGGGGGGGGGGGGGYYYYYYYYYSS....",
"...SSYYYYYYYYYYYYyyyyYYYYYYYYYYYYYYSS.....",
"....SSSYYYYyyYYYYYYYYYYYYyyYYYYYSSS......",
"......SSSYYYYYYYYYYYYYYYYYYYYSSSS........",
"........SSSSYYYYYYYYYYYYSSSSSS...........",
"..........SSSSSSSSSSSSSSSSSS.............",
"..............SSSSSSSSSS..................",
"........................................"
    ]
},


xiabaoshanmian:{

    name:"虾爆鳝面",
    pinyin:"xiābào shànmiàn",
    region:"浙江省・杭州",
    type:"杭州の名物麺",

    description:
    "エビとタウナギを使った杭州の名物麺。香ばしく炒めた具材と麺を合わせる。",

    palette:{

        Y:{color:"#d6ab50",dark:"#9d7332",name:"面",pinyin:"miàn",jp:"麺"},
        y:{color:"#efd077",dark:"#b98c45",name:"面",pinyin:"miàn",jp:"麺"},

        O:{color:"#d96749",dark:"#9c402f",name:"虾",pinyin:"xiā",jp:"エビ"},
        o:{color:"#f0926d",dark:"#b85843",name:"虾",pinyin:"xiā",jp:"エビ"},

        D:{color:"#65372b",dark:"#3e221c",name:"鳝鱼",pinyin:"shànyú",jp:"タウナギ"},
        d:{color:"#8e513b",dark:"#5d3025",name:"鳝鱼",pinyin:"shànyú",jp:"タウナギ"},

        G:{color:"#607a42",dark:"#3b502b",name:"葱",pinyin:"cōng",jp:"ネギ"},
        g:{color:"#8ba45c",dark:"#566d39",name:"葱",pinyin:"cōng",jp:"ネギ"},

        S:{color:"#b98745",dark:"#80572e",name:"汤",pinyin:"tāng",jp:"スープ"},
        s:{color:"#d2aa65",dark:"#98713c",name:"汤",pinyin:"tāng",jp:"スープ"}
    },

    pixelMap:[
"........................................",
"..............SSSSSSSSSSSS..............",
"..........SSSSSSSSSSSSSSSSSSSS..........",
"........SSSSSSSSssssSSSSSSSSSSSS........",
"......SSSYYYYYYYYYYYYYYYYYYYYSSSSS.......",
".....SSYYYYYyyYYYYYYYYYYyyYYYYYSSS.......",
"....SSYYYYYYYYGGggGGYYYYYYYYYYYYSSS......",
"...SSYYYYYYGGGGGGGGGGGGYYYYYYYYYYSS......",
"..SSYYYYYGGGYYYYYYYYGGGYYYYYYYYYYYSS.....",
"..SYYYYYGGYYYYOOOOOOYYGGYYYYYYYYYYSS.....",
".SSYYYYGGYYYOOooooOOOYYGGYYYYYYYYYYSS....",
".SYYYYGGYYYOOoOOOOoOOYYYGGYYYYYYYYYYS....",
"SYYYYYGGYYYYOOooooOOYYYYGGYYYYYYYYYYSS...",
"SYYYYGGYYYYYYOOOOOOYYYYYYGGYYYYYYYYYYS...",
"SYYYYGYYYYYYYYYYYYYYYYYYYYYGYYYYYYYYYYS...",
"SYYYGGYYYYDDDDdDYYYYDDdDDYYGGYYYYYYYYS...",
"SYYYYGYYYDDDdddDDYYYDdddDDDYYGYYYYYYYY...",
"SYYYYGGYYDDdDDDDDYYYDDDdDDDYYGGYYYYYYS...",
"SYYYYYGGYDDDddDDYYYYYDDddDDYGGYYYYYYYS...",
"SSYYYYGGYYDDDDDYYYYYYYDDDDDYYGGYYYYYSS...",
".SYYYYYGGYYYYYYYYyyyyYYYYYYYGGYYYYYYYSS..",
".SSYYYYYGGGGYYYYYYYYYYYYYGGGGYYYYYYYSS...",
"..SSYYYYYYYGGGGGGGGGGGGGGYYYYYYYYYYSS....",
"...SSYYYYYYYYYYYYyyyyYYYYYYYYYYYYYYSS.....",
"....SSSYYYYyyYYYYYYYYYYYYyyYYYYYSSS......",
"......SSSYYYYYYYYYYYYYYYYYYYYSSSS........",
"........SSSSYYYYYYYYYYYYSSSSSS...........",
"..........SSSSSSSSSSSSSSSSSS.............",
"..............SSSSSSSSSS..................",
"........................................"
    ]
},


congyoubanmian:{

    name:"葱油拌面",
    pinyin:"cōngyóu bànmiàn",
    region:"江南地方",
    type:"葱油まぜ麺",

    description:
    "香ばしい葱油を麺に絡めて食べる、シンプルながら香り豊かな麺料理。",

    palette:{

        Y:{color:"#d3a94e",dark:"#986d30",name:"面",pinyin:"miàn",jp:"麺"},
        y:{color:"#edca72",dark:"#b58943",name:"面",pinyin:"miàn",jp:"麺"},

        G:{color:"#5b793e",dark:"#385028",name:"葱",pinyin:"cōng",jp:"ネギ"},
        g:{color:"#8da95c",dark:"#597039",name:"葱",pinyin:"cōng",jp:"ネギ"},

        B:{color:"#7d4d2d",dark:"#4e301e",name:"葱油",pinyin:"cōngyóu",jp:"ネギ油"},
        b:{color:"#a56c3d",dark:"#714527",name:"葱油",pinyin:"cōngyóu",jp:"ネギ油"}
    },

    pixelMap:[
"........................................",
"..............YYYYYYYYYYYY..............",
"..........YYYYYYYYYYYYYYYYYYYY..........",
"........YYYYyyYYYYYYYYYYyyYYYY..........",
"......YYYYYYYYYYYYYYYYYYYYYYYYYYYY.......",
".....YYYYGGggGGYYYYYYYYGGggGGYYYY.......",
"....YYYYGGGGGGGYYYYYYYYGGGGGGGYYYY......",
"...YYYYGGYYYYYYYYYYYYYYYYYYGGYYYYYY......",
"..YYYYGGYYYYBBBbbBBBYYYYYYYYGGYYYYY......",
"..YYYGGYYYYBBbbbbBBBBYYYYYYYYGGYYYY......",
".YYYYGYYYYBBBbBBBBbBBBYYYYYYYYGYYYYY.....",
".YYYGGYYYYBBYYYYYYYYBBYYYYYYYYGGYYYY.....",
"YYYYGYYYYYBBYYYYYYYYBBYYYYYYYYYGYYYY.....",
"YYYGGYYYYYBBBYYYYYYBBBYYYYYYYYGGYYYY.....",
"YYYYGYYYYYYBBBBBBBBBBYYYYYYYYYYGYYYY.....",
"YYYGGYYYYYYYYBBBBBBYYYYYYYYYYYYGGYYY.....",
"YYYYGYYYyYYYYYYYYYYYYYYYYYyYYYYYGYYY.....",
"YYYYGGYYYYGGggGGYYYYGGggGGYYYYGGYYYY.....",
"YYYYYGGYYGGGGGGGGYYGGGGGGGGYYGGYYYY.....",
".YYYYGGGYYYGGGGYYYYYYGGGGYYYGGGYYYY.....",
".YYYYYGGGYYYYYYYYyyyyYYYYYYGGGYYYYY.....",
"..YYYYYYGGGYYYYYYYYYYYYYYGGGYYYYYYY.....",
"...YYYYYYGGGGGGGGGGGGGGGGGGYYYYYYY......",
"....YYYYYYYYGGggGGGGggGGYYYYYYYYY.......",
".....YYYYYYYYYYYYYYYYYYYYYYYYYYYY........",
".......YYYYYyyYYYYYYYYyyYYYYYY..........",
".........YYYYYYYYYYYYYYYYYYYY...........",
"............YYYYYYYYYYYYYY..............",
"........................................",
"........................................"
    ]
}

};


/* ======================================================
   SAVE
====================================================== */

function loadFoodBook(){

    try{

        const raw =
        localStorage.getItem(FOOD_SAVE_KEY);

        if(!raw)return [];

        const data = JSON.parse(raw);

        return Array.isArray(data)
            ? data
            : [];

    }catch(e){

        return [];

    }

}

let discovered = loadFoodBook();


function saveFoodBook(){

    localStorage.setItem(
        FOOD_SAVE_KEY,
        JSON.stringify(discovered)
    );

}


function discoverDish(id){

    if(discovered.includes(id)){
        return;
    }

    discovered.push(id);

    saveFoodBook();

}


/* ======================================================
   STATE
====================================================== */

let foodUIOpen = false;
let selectedDish = null;
let puzzle = null;
let waitingForNoodleMenu = false;
let orbitRAF = null;
let popupTimer = null;


/* ======================================================
   STYLE
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
    box-sizing:border-box;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
    overflow:auto;
    background:
        radial-gradient(circle at 50% 25%,#30271f,#101115 72%);
}

.fp-panel{
    width:min(800px,calc(100vw - 30px));
    max-height:calc(100vh - 30px);
    overflow:auto;
    box-sizing:border-box;
    padding:30px;
    border:1px solid #786246;
    background:linear-gradient(#28231e,#171719);
    box-shadow:0 30px 100px #000b;
}

.fp-eyebrow{
    text-align:center;
    font-size:10px;
    letter-spacing:.24em;
    color:#a98b61;
}

.fp-title{
    text-align:center;
    margin:8px 0;
    color:#f0dfbf;
    font-size:28px;
}

.fp-subtitle{
    text-align:center;
    margin-bottom:22px;
    color:#8f816e;
    font-size:11px;
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
    font-size:20px;
    color:#efddbd;
}

.fp-dish-pinyin{
    margin-top:4px;
    font-size:12px;
    color:#9b8d79;
}

#fpGameScreen{
    align-items:flex-start;
}

.fp-game{
    width:min(930px,96vw);
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
    height:570px;
    display:flex;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    border:1px solid #705d45;
    background:
        radial-gradient(ellipse at center,#35343a 0%,#222328 55%,#15161a 100%);
}

.fp-plate{
    position:absolute;
    width:590px;
    height:390px;
    max-width:78%;
    border-radius:50%;
    border:10px solid #b8aa94;
    background:
        radial-gradient(ellipse at 50% 42%,#eee8dc,#cfc6b8 72%);
    box-shadow:
        0 10px 0 #655b50,
        0 23px 38px #0008,
        inset 0 0 0 7px #f4eee2;
}

#fpPixelBoard{
    position:relative;
    z-index:5;
    display:grid;
    gap:1px;
    filter:drop-shadow(0 7px 5px #0005);
}

.fp-pixel{
    width:10px;
    height:10px;
    box-sizing:border-box;
    border-radius:2px;
    box-shadow:
        inset 1px 1px #ffffff30,
        inset -1px -1px #00000035;
}

.fp-pixel.empty{
    visibility:hidden;
}

.fp-pixel.dead{
    visibility:hidden;
}

.fp-pixel.hit{
    animation:fpHit .14s forwards;
}

@keyframes fpHit{

    0%{
        transform:scale(1);
        opacity:1;
    }

    45%{
        transform:scale(1.7);
        filter:brightness(2.2);
    }

    100%{
        transform:scale(.1);
        opacity:0;
    }

}


/* ORBIT */

#fpOrbitGuide{
    position:absolute;
    z-index:3;
    border:2px dashed #d5b87950;
    border-radius:50%;
    pointer-events:none;
}

#fpOrbiter{
    position:absolute;
    z-index:30;
    width:48px;
    height:48px;
    display:none;
    align-items:center;
    justify-content:center;
    border:3px solid #fff;
    border-radius:9px;
    color:#fff;
    font-size:16px;
    font-weight:900;
    text-shadow:0 2px 3px #000;
    box-shadow:
        0 5px 0 #0008,
        0 0 15px #ffffff70;
    pointer-events:none;
}

#fpOrbiter.active{
    display:flex;
}

#fpOrbiter::after{
    content:"";
    position:absolute;
    width:10px;
    height:14px;
    bottom:-11px;
    left:50%;
    transform:translateX(-50%);
    background:#e7e1d7;
    clip-path:polygon(50% 100%,0 0,100% 0);
}


/* BULLET */

.fp-bullet{
    position:absolute;
    z-index:29;
    width:9px;
    height:9px;
    border-radius:50%;
    pointer-events:none;
    box-shadow:
        0 0 7px currentColor,
        0 0 13px currentColor;
}


/* PARTICLE */

.fp-particle{
    position:absolute;
    z-index:35;
    width:4px;
    height:4px;
    pointer-events:none;
    animation:fpParticle .32s forwards;
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

.fp-hand-title,
.fp-block-title{
    margin:13px 0 7px;
    text-align:center;
    color:#918573;
    font-size:10px;
    letter-spacing:.15em;
}

#fpHand,
#fpBlocks{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:9px;
}

.fp-hand-slot{
    width:72px;
    height:54px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    border:1px solid #554e45;
    border-radius:7px;
    color:#70695f;
}

.fp-hand-slot.used{
    color:white;
    font-weight:bold;
    cursor:pointer;
    box-shadow:
        inset 0 3px #ffffff30,
        0 4px #0005;
}

.fp-hand-slot.used:hover{
    transform:translateY(-2px);
    filter:brightness(1.12);
}

.fp-color-block{
    width:82px;
    height:68px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    border:2px solid #ffffff55;
    border-radius:8px;
    color:white;
    cursor:pointer;
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
    opacity:.35;
    pointer-events:none;
}

.fp-color-number{
    font-size:24px;
    font-weight:900;
}

.fp-color-label{
    font-size:9px;
}

#fpMessage{
    min-height:27px;
    margin-top:12px;
    text-align:center;
    color:#c0b098;
    font-size:12px;
}


/* POPUP */

#fpIngredientPopup{
    position:absolute;
    z-index:50;
    top:14px;
    left:14px;
    padding:8px 12px;
    border:1px solid #a584584f;
    background:#111217e8;
    opacity:0;
    transition:.18s;
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
    grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
    gap:11px;
}

.fp-book-card{
    min-height:120px;
    padding:16px;
    border:1px solid #a68a5e4c;
}

.fp-book-card.locked{
    display:flex;
    align-items:center;
    justify-content:center;
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
    margin-bottom:20px;
    text-align:center;
    color:#aa8d66;
}

`;

document.head.appendChild(style);


/* ======================================================
   ROOT
====================================================== */

const root = document.createElement("div");

root.id = "foodPuzzleRoot";

document.body.appendChild(root);


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

    cancelPuzzle();

    root.innerHTML = "";

    root.classList.remove("open");

}


function cancelPuzzle(){

    if(orbitRAF){
        cancelAnimationFrame(orbitRAF);
        orbitRAF = null;
    }

    if(puzzle){
        puzzle.runToken++;
    }

    puzzle = null;

}

/* ======================================================
   ORDER
====================================================== */

function showOrderQuestion(){

    cancelPuzzle();

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
                老板「腹が減ってるなら、何か食べていくかい？」
            </div>

            <div class="fp-buttons">

                <button class="fp-button primary" id="fpMenuButton">
                    菜单を見る
                </button>

                <button class="fp-button" id="fpBookButton">
                    料理図鑑
                </button>

                <button class="fp-button" id="fpCloseButton">
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

    cancelPuzzle();

    openRoot();

    const cards =
    Object.entries(DISHES)
    .map(([id,d])=>`

        <div class="fp-dish" data-id="${id}">

            <div class="fp-dish-name">
                ${d.name}
            </div>

            <div class="fp-dish-pinyin">
                ${d.pinyin} ／ ${d.region}
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

            <div class="fp-buttons" style="margin-top:20px">

                <button class="fp-button" id="fpMenuBack">
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

    const dish = DISHES[id];

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

                <button class="fp-button primary" id="fpStart">
                    いただきます！
                </button>

                <button class="fp-button" id="fpIntroBack">
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
   SYMBOL

   小文字もゲーム上では大文字と同じ色。
====================================================== */

function gameplaySymbol(symbol){

    return symbol.toUpperCase();

}


/* ======================================================
   START
====================================================== */

function startPuzzle(id){

    const dish = DISHES[id];

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

                group:
                    gameplaySymbol(symbol),

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

        lastFrame:
            performance.now(),

        lastShotCheck:0,

        travelWithoutHit:0,

        projectileBusy:false,

        runToken:1

    };

    createQueue();

    renderPuzzle();

}


/* ======================================================
   QUEUE
====================================================== */

function createQueue(){

    const counts = {};

    puzzle.pixels.forEach(pixel=>{

        counts[pixel.group] =
            (counts[pixel.group] || 0)+1;

    });

    const blocks = [];

    Object.entries(counts)
    .forEach(([symbol,count])=>{

        let remaining = count;

        while(remaining > 0){

            const base =
                Math.min(
                    remaining,
                    10 +
                    Math.floor(
                        Math.random()*10
                    )
                );

            /*
              少しだけ余分な弾を混ぜる。
              選択順を間違えると
              手持ちが増えやすくなる。
            */

            const extra =
                Math.random() < .22
                ? 1 + Math.floor(Math.random()*3)
                : 0;

            blocks.push({

                symbol,

                amount:
                    base + extra

            });

            remaining -= base;

        }

    });

    /*
      シャッフル
    */

    for(
        let i=blocks.length-1;
        i>0;
        i--
    ){

        const j =
            Math.floor(
                Math.random()*(i+1)
            );

        [
            blocks[i],
            blocks[j]
        ] = [
            blocks[j],
            blocks[i]
        ];

    }

    puzzle.queue = blocks;

}


/* ======================================================
   GAME SCREEN
====================================================== */

function renderPuzzle(){

    openRoot();

    const dish = puzzle.dish;

    const cols =
        Math.max(
            ...dish.pixelMap.map(
                row=>row.length
            )
        );

    root.innerHTML = `

    <div class="fp-screen" id="fpGameScreen">

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

                        <div id="fpProgressFill"></div>

                    </div>

                </div>

            </div>


            <div class="fp-board-shell" id="fpBoardShell">

                <div class="fp-plate"></div>

                <div
                    id="fpPixelBoard"
                    style="grid-template-columns:repeat(${cols},10px)"
                ></div>

                <div id="fpOrbitGuide"></div>

                <div id="fpOrbiter"></div>

                <div id="fpIngredientPopup"></div>

            </div>


            <div class="fp-hand-title">
                手持ち　0 / 4
            </div>

            <div id="fpHand"></div>


            <div class="fp-block-title">
                色ブロックを選ぶ
            </div>

            <div id="fpBlocks"></div>


            <div id="fpMessage">
                外側に見えている色から崩していこう
            </div>


            <div class="fp-buttons" style="margin-top:14px">

                <button class="fp-button" id="fpQuit">
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

    /*
      DOMが完成した後で
      軌道を描く。
    */

    requestAnimationFrame(
        updateOrbitGeometry
    );

}


/* ======================================================
   BUILD FOOD
====================================================== */

function buildPixelBoard(){

    const board =
        document.getElementById(
            "fpPixelBoard"
        );

    board.innerHTML = "";

    const lookup = new Map();

    puzzle.pixels.forEach(pixel=>{

        lookup.set(
            `${pixel.x},${pixel.y}`,
            pixel
        );

    });

    puzzle.dish.pixelMap
    .forEach((row,y)=>{

        [...row].forEach((symbol,x)=>{

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
                puzzle.dish.palette[symbol];

            if(!data){

                console.error(
                    "Unknown food pixel:",
                    symbol
                );

                cell.classList.add(
                    "empty"
                );

                board.appendChild(cell);

                return;

            }

            cell.style.background =
                `linear-gradient(
                    135deg,
                    ${data.color},
                    ${data.dark}
                )`;

            const pixel =
                lookup.get(
                    `${x},${y}`
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

    if(!puzzle)return null;

    /*
      queueでは大文字だけが来る。

      同じgroupに属するpaletteから
      基本色を探す。
    */

    if(puzzle.dish.palette[symbol]){
        return puzzle.dish.palette[symbol];
    }

    const key =
        Object.keys(
            puzzle.dish.palette
        )
        .find(k=>
            gameplaySymbol(k) ===
            gameplaySymbol(symbol)
        );

    return key
        ? puzzle.dish.palette[key]
        : null;

}


/* ======================================================
   QUEUE DISPLAY
====================================================== */

function drawBlocks(){

    const holder =
        document.getElementById(
            "fpBlocks"
        );

    if(!holder || !puzzle)return;

    holder.innerHTML = "";

    puzzle.queue
    .slice(0,5)
    .forEach((block,index)=>{

        const data =
            getPalette(
                block.symbol
            );

        const el =
            document.createElement(
                "div"
            );

        el.className =
            "fp-color-block";

        if(puzzle.busy){
            el.classList.add(
                "disabled"
            );
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
   HAND DISPLAY
====================================================== */

function drawHand(){

    const holder =
        document.getElementById(
            "fpHand"
        );

    if(!holder || !puzzle)return;

    const title =
        root.querySelector(
            ".fp-hand-title"
        );

    if(title){

        title.textContent =
            `手持ち　${puzzle.hand.length} / ${HAND_MAX}`;

    }

    holder.innerHTML = "";

    for(let i=0;i<HAND_MAX;i++){

        const slot =
            document.createElement(
                "div"
            );

        slot.className =
            "fp-hand-slot";

        const block =
            puzzle.hand[i];

        if(block){

            const data =
                getPalette(
                    block.symbol
                );

            slot.classList.add(
                "used"
            );

            slot.style.background =
                `linear-gradient(
                    ${data.color},
                    ${data.dark}
                )`;

            slot.innerHTML = `

            <div>
                ${data.name}
            </div>

            <strong>
                ${block.amount}
            </strong>

            `;

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
   SELECT BLOCK
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

    puzzle.queue.splice(
        index,
        1
    );

    activateBlock(block);

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

    puzzle.hand.splice(
        index,
        1
    );

    activateBlock(block);

}


function activateBlock(block){

    puzzle.busy = true;

    puzzle.projectileBusy = false;

    puzzle.activeBlock = {

        symbol:
            gameplaySymbol(
                block.symbol
            ),

        amount:
            block.amount

    };

    /*
      「最後に1発当たってから
       何周したか」を見る。
    */

    puzzle.travelWithoutHit = 0;

    puzzle.lastFrame =
        performance.now();

    puzzle.lastShotCheck = 0;

    drawBlocks();

    drawHand();

    showIngredient(
        block.symbol
    );

    const data =
        getPalette(
            block.symbol
        );

    setMessage(
        `${data.name} ${block.amount}：砲台が射線を探しています`
    );

    const orb =
        document.getElementById(
            "fpOrbiter"
        );

    orb.style.background =
        `linear-gradient(
            ${data.color},
            ${data.dark}
        )`;

    orb.textContent =
        block.amount;

    orb.classList.add(
        "active"
    );

    updateOrbitGeometry();

    if(orbitRAF){
        cancelAnimationFrame(
            orbitRAF
        );
    }

    orbitRAF =
        requestAnimationFrame(
            puzzleLoop
        );

}

/* ======================================================
   ORBIT
====================================================== */

function updateOrbitGeometry(){

    if(!puzzle)return;

    const shell =
        document.getElementById(
            "fpBoardShell"
        );

    const board =
        document.getElementById(
            "fpPixelBoard"
        );

    const guide =
        document.getElementById(
            "fpOrbitGuide"
        );

    if(
        !shell ||
        !board ||
        !guide
    ){
        return;
    }

    const sr =
        shell.getBoundingClientRect();

    const br =
        board.getBoundingClientRect();

    const cx =
        br.left -
        sr.left +
        br.width/2;

    const cy =
        br.top -
        sr.top +
        br.height/2;

    /*
      料理より十分外側。
      ただしshellから絶対に出さない。
    */

    const desiredRX =
        br.width/2 + 62;

    const desiredRY =
        br.height/2 + 72;

    const rx =
        Math.min(
            desiredRX,
            sr.width/2 - 34
        );

    const ry =
        Math.min(
            desiredRY,
            sr.height/2 - 34
        );

    puzzle.orbit = {
        cx,
        cy,
        rx,
        ry
    };

    guide.style.width =
        `${rx*2}px`;

    guide.style.height =
        `${ry*2}px`;

    guide.style.left =
        `${cx-rx}px`;

    guide.style.top =
        `${cy-ry}px`;

    updateOrbiterPosition();

}


function updateOrbiterPosition(){

    if(
        !puzzle ||
        !puzzle.orbit
    ){
        return;
    }

    const orb =
        document.getElementById(
            "fpOrbiter"
        );

    if(!orb)return;

    const {
        cx,
        cy,
        rx,
        ry
    } = puzzle.orbit;

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
        `${x-24}px`;

    orb.style.top =
        `${y-24}px`;

}


/* ======================================================
   MAIN LOOP
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
            now-puzzle.lastFrame,
            50
        );

    puzzle.lastFrame = now;

    const deltaAngle =
        ORBIT_SPEED * dt;

    puzzle.angle +=
        deltaAngle;

    puzzle.travelWithoutHit +=
        Math.abs(deltaAngle);

    updateOrbiterPosition();

    /*
      弾が飛んでいない時だけ
      次の射線を探す。
    */

    if(
        !puzzle.projectileBusy &&
        now-puzzle.lastShotCheck >=
        FIRE_INTERVAL
    ){

        puzzle.lastShotCheck = now;

        const target =
            findShootableTarget();

        if(target){

            fireBullet(target);

        }

    }

    /*
      最後の命中から一周しても
      1発も当てられない。

      →残りは手持ち。
    */

    if(
        !puzzle.projectileBusy &&
        puzzle.travelWithoutHit >=
        NO_HIT_ORBIT
    ){

        storeActiveBlock();

        return;

    }

    orbitRAF =
        requestAnimationFrame(
            puzzleLoop
        );

}


/* ======================================================
   SCREEN POSITIONS
====================================================== */

function getShellRect(){

    const shell =
        document.getElementById(
            "fpBoardShell"
        );

    return shell
        ? shell.getBoundingClientRect()
        : null;

}


function getOrbiterCenter(){

    const shellRect =
        getShellRect();

    const orb =
        document.getElementById(
            "fpOrbiter"
        );

    if(
        !shellRect ||
        !orb
    ){
        return null;
    }

    const r =
        orb.getBoundingClientRect();

    return {

        x:
            r.left -
            shellRect.left +
            r.width/2,

        y:
            r.top -
            shellRect.top +
            r.height/2

    };

}


function getPixelRect(pixel){

    const shellRect =
        getShellRect();

    if(
        !shellRect ||
        !pixel.element
    ){
        return null;
    }

    const r =
        pixel.element
        .getBoundingClientRect();

    return {

        left:
            r.left -
            shellRect.left,

        right:
            r.right -
            shellRect.left,

        top:
            r.top -
            shellRect.top,

        bottom:
            r.bottom -
            shellRect.top,

        cx:
            r.left -
            shellRect.left +
            r.width/2,

        cy:
            r.top -
            shellRect.top +
            r.height/2

    };

}


/* ======================================================
   SEGMENT / RECT INTERSECTION

   線分がドットに入る位置 t を返す。

   t=0 → 砲台
   t=1 → 狙ったドット

   一番小さいtのドットが
   「手前のドット」。
====================================================== */

function segmentRectEntryT(
    x0,
    y0,
    x1,
    y1,
    rect
){

    const dx = x1-x0;
    const dy = y1-y0;

    /*
      角をかすっただけで
      遮られないよう少し縮める。
    */

    const inset = 1.2;

    const left =
        rect.left + inset;

    const right =
        rect.right - inset;

    const top =
        rect.top + inset;

    const bottom =
        rect.bottom - inset;

    let tMin = 0;
    let tMax = 1;

    const axes = [

        {
            origin:x0,
            delta:dx,
            min:left,
            max:right
        },

        {
            origin:y0,
            delta:dy,
            min:top,
            max:bottom
        }

    ];

    for(const axis of axes){

        if(
            Math.abs(axis.delta) <
            0.000001
        ){

            if(
                axis.origin <
                axis.min ||
                axis.origin >
                axis.max
            ){
                return null;
            }

            continue;

        }

        let t1 =
            (
                axis.min -
                axis.origin
            ) /
            axis.delta;

        let t2 =
            (
                axis.max -
                axis.origin
            ) /
            axis.delta;

        if(t1 > t2){

            const temp = t1;

            t1 = t2;
            t2 = temp;

        }

        tMin =
            Math.max(
                tMin,
                t1
            );

        tMax =
            Math.min(
                tMax,
                t2
            );

        if(tMin > tMax){
            return null;
        }

    }

    if(
        tMax < 0 ||
        tMin > 1
    ){
        return null;
    }

    return Math.max(
        0,
        tMin
    );

}


/* ======================================================
   FIRST PIXEL ON LINE

   ここが外周判定の本体。

   色は関係ない。
   砲台から見て最初にぶつかる
   生きたドットを調べる。
====================================================== */

function firstPixelOnLine(
    start,
    end
){

    let first = null;

    let firstT = Infinity;

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

        const rect =
            getPixelRect(pixel);

        if(!rect)continue;

        const t =
            segmentRectEntryT(
                start.x,
                start.y,
                end.x,
                end.y,
                rect
            );

        if(t === null){
            continue;
        }

        if(t < firstT){

            firstT = t;

            first = pixel;

        }

    }

    return {
        pixel:first,
        t:firstT
    };

}


/* ======================================================
   FIND TARGET

   選択色のドットのうち、

   砲台 → そのドット

   の線上で「最初に当たるもの」が
   そのドット自身なら撃てる。
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

    if(!start)return null;

    const wanted =
        puzzle.activeBlock.symbol;

    const candidates =
        puzzle.pixels
        .filter(pixel=>

            !pixel.eaten &&

            !pixel.reserved &&

            pixel.group === wanted

        );

    let best = null;

    let bestDistance =
        Infinity;

    for(
        const candidate of
        candidates
    ){

        const rect =
            getPixelRect(
                candidate
            );

        if(!rect)continue;

        const end = {
            x:rect.cx,
            y:rect.cy
        };

        const hit =
            firstPixelOnLine(
                start,
                end
            );

        /*
          手前に別のドットがある。
        */

        if(
            hit.pixel !==
            candidate
        ){
            continue;
        }

        const distance =
            Math.hypot(
                end.x-start.x,
                end.y-start.y
            );

        if(
            distance <
            bestDistance
        ){

            bestDistance =
                distance;

            best =
                candidate;

        }

    }

    return best;

}


/* ======================================================
   FIRE REAL BULLET
====================================================== */

function fireBullet(target){

    if(
        !puzzle ||
        !puzzle.activeBlock ||
        puzzle.projectileBusy ||
        target.reserved
    ){
        return;
    }

    const start =
        getOrbiterCenter();

    const rect =
        getPixelRect(
            target
        );

    if(
        !start ||
        !rect
    ){
        return;
    }

    const shotSymbol =
        puzzle.activeBlock.symbol;

    const token =
        puzzle.runToken;

    target.reserved = true;

    puzzle.projectileBusy =
        true;

    const shell =
        document.getElementById(
            "fpBoardShell"
        );

    const bullet =
        document.createElement(
            "div"
        );

    bullet.className =
        "fp-bullet";

    const data =
        getPalette(
            shotSymbol
        );

    bullet.style.background =
        data.color;

    bullet.style.color =
        data.color;

    shell.appendChild(
        bullet
    );

    const end = {
        x:rect.cx,
        y:rect.cy
    };

    const dx =
        end.x-start.x;

    const dy =
        end.y-start.y;

    const distance =
        Math.hypot(dx,dy);

    const duration =
        Math.max(
            90,
            distance /
            BULLET_SPEED *
            1000
        );

    const started =
        performance.now();


    function fly(now){

        /*
          別ゲームになった場合は終了。
        */

        if(
            !puzzle ||
            puzzle.runToken !== token
        ){

            bullet.remove();

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
            `${x-4.5}px`;

        bullet.style.top =
            `${y-4.5}px`;

        /*
          弾の現在位置にある
          最初の料理ドットを調べる。
        */

        const hit =
            findPixelAtPoint(
                x,
                y
            );

        if(hit){

            bullet.remove();

            target.reserved =
                false;

            puzzle.projectileBusy =
                false;

            /*
              同色なら破壊。
              別色なら弾だけ消える。
            */

            if(
                hit.group ===
                shotSymbol
            ){

                hitPixel(
                    hit
                );

            }else{

                flashBlocked(
                    hit
                );

            }

            return;

        }

        if(t >= 1){

            bullet.remove();

            target.reserved =
                false;

            puzzle.projectileBusy =
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
   COLLISION AT POINT
====================================================== */

function findPixelAtPoint(x,y){

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

        const rect =
            getPixelRect(
                pixel
            );

        if(!rect)continue;

        if(
            x >= rect.left+1 &&
            x <= rect.right-1 &&
            y >= rect.top+1 &&
            y <= rect.bottom-1
        ){
            return pixel;
        }

    }

    return null;

}


/* ======================================================
   HIT
====================================================== */

function hitPixel(pixel){

    if(
        !puzzle ||
        !puzzle.activeBlock ||
        pixel.eaten
    ){
        return;
    }

    pixel.eaten = true;

    pixel.reserved = false;

    puzzle.activeBlock.amount--;

    /*
      命中したので
      「撃てないまま進んだ角度」をリセット。
    */

    puzzle.travelWithoutHit = 0;

    pixel.element.classList.add(
        "hit"
    );

    createParticles(pixel);

    showIngredient(
        pixel.symbol
    );

    updateProgress();

    updateOrbiterNumber();

    setTimeout(()=>{

        if(pixel.element){

            pixel.element
            .classList.add(
                "dead"
            );

        }

    },140);


    /*
      完食
    */

    if(
        puzzle.pixels.every(
            p=>p.eaten
        )
    ){

        puzzle.over = true;

        puzzle.busy = false;

        puzzle.projectileBusy =
            false;

        hideOrbiter();

        setTimeout(
            showComplete,
            450
        );

        return;

    }


    /*
      選択ブロックを使い切った
    */

    if(
        puzzle.activeBlock.amount <= 0
    ){

        finishActiveBlock();

    }

}


/* ======================================================
   BLOCKED
====================================================== */

function flashBlocked(pixel){

    if(
        !pixel ||
        !pixel.element
    ){
        return;
    }

    pixel.element.style.filter =
        "brightness(1.8)";

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
   PARTICLES
====================================================== */

function createParticles(pixel){

    const shell =
        document.getElementById(
            "fpBoardShell"
        );

    const rect =
        getPixelRect(
            pixel
        );

    if(
        !shell ||
        !rect
    ){
        return;
    }

    const data =
        puzzle.dish.palette[
            pixel.symbol
        ];

    for(let i=0;i<6;i++){

        const part =
            document.createElement(
                "div"
            );

        part.className =
            "fp-particle";

        part.style.background =
            data.color;

        part.style.left =
            `${rect.cx}px`;

        part.style.top =
            `${rect.cy}px`;

        part.style.setProperty(
            "--x",
            `${
                (Math.random()-.5)*46
            }px`
        );

        part.style.setProperty(
            "--y",
            `${
                (Math.random()-.5)*46
            }px`
        );

        shell.appendChild(part);

        setTimeout(
            ()=>part.remove(),
            340
        );

    }

}

/* ======================================================
   FINISH ACTIVE BLOCK
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

    hideOrbiter();

    setMessage(
        `${data.name}を使い切った！`
    );

    puzzle.activeBlock = null;

    puzzle.busy = false;

    puzzle.projectileBusy =
        false;

    drawBlocks();

    drawHand();

    checkGameState();

}


/* ======================================================
   STORE LEFTOVER
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

    hideOrbiter();

    /*
      すでに4枠使用中。

      ここに5個目が来たらGAME OVER。
    */

    if(
        puzzle.hand.length >=
        HAND_MAX
    ){

        puzzle.over = true;

        puzzle.busy = false;

        puzzle.projectileBusy =
            false;

        puzzle.activeBlock =
            null;

        setTimeout(
            showFail,
            250
        );

        return;

    }

    const data =
        getPalette(
            block.symbol
        );

    puzzle.hand.push({

        symbol:
            block.symbol,

        amount:
            block.amount

    });

    puzzle.activeBlock = null;

    puzzle.busy = false;

    puzzle.projectileBusy =
        false;

    setMessage(
        `${data.name} ${block.amount} はまだ届かない。手持ちへ。`
    );

    drawHand();

    drawBlocks();

    checkGameState();

}


/* ======================================================
   HIDE CANNON
====================================================== */

function hideOrbiter(){

    if(orbitRAF){

        cancelAnimationFrame(
            orbitRAF
        );

        orbitRAF = null;

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
   CHECK GAME
====================================================== */

function checkGameState(){

    if(!puzzle)return;

    if(
        puzzle.pixels.every(
            p=>p.eaten
        )
    ){

        showComplete();

        return;

    }

    /*
      queueもhandも無くなった場合だけ、
      残った料理量に合わせて補充。

      詰み防止用。
    */

    if(
        puzzle.queue.length === 0 &&
        puzzle.hand.length === 0
    ){

        createEmergencyBlocks();

        drawBlocks();

    }

}


/* ======================================================
   EMERGENCY BLOCKS
====================================================== */

function createEmergencyBlocks(){

    const counts = {};

    puzzle.pixels
    .filter(p=>!p.eaten)
    .forEach(pixel=>{

        counts[pixel.group] =
            (counts[pixel.group] || 0)+1;

    });

    puzzle.queue =
        Object.entries(counts)
        .map(([symbol,count])=>({

            symbol,

            amount:
                Math.min(
                    count,
                    14
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

    if(!puzzle)return;

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
   INGREDIENT POPUP
====================================================== */

function showIngredient(symbol){

    if(!puzzle)return;

    const data =
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
        ${data.pinyin}　${data.jp}
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

    if(!puzzle)return;

    const id =
        puzzle.dishId;

    const dish =
        puzzle.dish;

    discoverDish(id);

    hideOrbiter();

    puzzle.busy = false;

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
   GAME OVER
====================================================== */

function showFail(){

    if(!puzzle)return;

    const id =
        puzzle.dishId;

    hideOrbiter();

    root.innerHTML = `

    <div class="fp-screen">

        <div class="fp-panel">

            <div class="fp-result-title">
                GAME OVER
            </div>

            <div class="fp-result-cn">
                手持ちがいっぱい！
            </div>

            <div class="fp-description">

                使い切れなかったブロックが
                4枠を超えてしまいました。

                <br><br>

                奥に埋まっている色を先に選ぶと、
                弾が届かず手持ちになってしまいます。

                <br>

                料理の外側に見えている色から
                崩してみましょう。

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

    cancelPuzzle();

    openRoot();

    const cards =
        Object.entries(DISHES)
        .map(([id,d])=>{

            if(
                !discovered.includes(id)
            ){

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

    document.getElementById(
        "fpBookBack"
    ).onclick =
        showOrderQuestion;

}


/* ======================================================
   ESCAPE
====================================================== */

window.addEventListener(
"keydown",
event=>{

    if(!foodUIOpen){
        return;
    }

    event.preventDefault();

    event.stopImmediatePropagation();

    if(
        event.key !==
        "Escape"
    ){
        return;
    }

    /*
      射撃中・周回中は
      誤操作防止。
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

},
true
);


/* ======================================================
   RESIZE

   ウィンドウサイズが変わっても
   周回軌道を再計算。
====================================================== */

window.addEventListener(
"resize",
()=>{

    if(
        puzzle &&
        foodUIOpen
    ){

        updateOrbitGeometry();

    }

}
);


/* ======================================================
   NOODLE SHOP CONNECTION

   現行Ver.4と同じ方式。
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

            waitingForNoodleMenu =
                true;

            waitForDialogueEnd();

        }

    };

}


/* ======================================================
   WAIT FOR NORMAL GAME DIALOGUE
====================================================== */

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


/* ======================================================
   VERSION
====================================================== */

console.log(
    "杭州探索録 FOOD PIXEL PUZZLE Ver.5.0 loaded"
);

})();
