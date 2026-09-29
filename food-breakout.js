"use strict";

/*
==========================================================
 杭州探索録
 FOOD BREAKOUT SYSTEM Ver.1.0

 杭州面館
 ・料理注文
 ・料理ブロック崩し
 ・料理図鑑
==========================================================
*/

(function(){

  const FOOD_SAVE_KEY =
    "hangzhouFoodBookV1";


  // ======================================================
  // DISH DATA
  // ======================================================

  const DISHES = {

    pianerchuan: {

      name:"片儿川",
      pinyin:"piànrchuān",
      jp:"ピェンアルチュアン",

      region:"浙江省・杭州",

      type:"杭州の麺料理",

      description:
        "雪菜・筍・豚肉などを使う、杭州を代表する麺料理の一つ。",

      ingredients:[
        "雪菜",
        "笋",
        "猪肉",
        "面"
      ],

      ingredientJP:[
        "雪菜",
        "たけのこ",
        "豚肉",
        "麺"
      ],

      accent:"#d7b76d",

      pattern:[
        "....MMMM....",
        "...MMMMMM...",
        "..MVMBBVMM..",
        ".MMNNNNNNMM.",
        ".MNNNNNNNNM.",
        "MMNNNNNNNNMM",
        "MMMMMMMMMMMM"
      ]

    },


    xiabaoshanmian: {

      name:"虾爆鳝面",
      pinyin:"xiābào shànmiàn",
      jp:"シャーバオシャンミエン",

      region:"浙江省・杭州",

      type:"杭州の麺料理",

      description:
        "エビとタウナギを使った杭州の名物麺。香ばしく炒めた具材と麺を味わう料理。",

      ingredients:[
        "虾",
        "鳝鱼",
        "面"
      ],

      ingredientJP:[
        "エビ",
        "タウナギ",
        "麺"
      ],

      accent:"#cf8b61",

      pattern:[
        "...SSSSSS...",
        "..SSSSSSSS..",
        ".SSEEEEEEES.",
        "SSENNNNNNESS",
        "SSNNNNNNNNSS",
        ".SNNNNNNNNS.",
        "..SSSSSSSS.."
      ]

    },


    congyoubanmian: {

      name:"葱油拌面",
      pinyin:"cōngyóu bànmiàn",
      jp:"ツォンヨウバンミエン",

      region:"江南地方",

      type:"葱油まぜ麺",

      description:
        "香ばしい葱油を麺に絡めて食べる、シンプルながら香り豊かな麺料理。",

      ingredients:[
        "葱",
        "葱油",
        "面"
      ],

      ingredientJP:[
        "ネギ",
        "ネギ油",
        "麺"
      ],

      accent:"#9bad62",

      pattern:[
        "....GGGG....",
        "...GGGGGG...",
        "..GNNNNNNG..",
        ".GNNGGNNNNG.",
        "GGNNNNGGNNGG",
        "GNNNNNNNNNNG",
        "GGGGGGGGGGGG"
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

      const data =
        JSON.parse(raw);

      return Array.isArray(data)
        ? data
        : [];

    }
    catch(error){

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

    if(
      !discovered.includes(id)
    ){

      discovered.push(id);

      saveFoodBook();

      return true;

    }

    return false;

  }


  // ======================================================
  // STATE
  // ======================================================

  let foodUIOpen = false;

  let breakoutActive = false;

  let selectedDish = null;

  let animationId = null;

  let lastTime = 0;

  let waitingForNoodleMenu = false;


  // ======================================================
  // CSS
  // ======================================================

  const style =
    document.createElement("style");


  style.textContent = `

    #foodBreakoutRoot{

      position:fixed;
      inset:0;

      z-index:16000;

      display:none;

      font-family:
        "Noto Sans JP",
        "Yu Gothic",
        sans-serif;

      color:#eee4cf;

    }


    #foodBreakoutRoot.open{

      display:block;

    }


    .food-screen{

      position:absolute;
      inset:0;

      display:flex;

      align-items:center;
      justify-content:center;

      background:
        radial-gradient(
          circle at center,
          rgba(48,36,29,.97),
          rgba(10,11,15,.99)
        );

    }


    .food-panel{

      width:min(
        760px,
        calc(100vw - 40px)
      );

      max-height:
        calc(100vh - 40px);

      overflow:auto;

      box-sizing:border-box;

      padding:36px;

      background:
        linear-gradient(
          180deg,
          #25201c,
          #171719
        );

      border:
        1px solid #80694a;

      box-shadow:
        0 30px 100px
        rgba(0,0,0,.75);

    }


    .food-eyebrow{

      text-align:center;

      font-size:10px;

      letter-spacing:.28em;

      color:#a98a5d;

      margin-bottom:8px;

    }


    .food-title{

      margin:0;

      text-align:center;

      font-size:28px;

      font-weight:500;

      letter-spacing:.12em;

      color:#f0dfbd;

    }


    .food-subtitle{

      text-align:center;

      color:#8e806c;

      font-size:11px;

      letter-spacing:.18em;

      margin:
        5px 0 28px;

    }


    .food-message{

      text-align:center;

      color:#c8bca8;

      line-height:1.9;

      font-size:14px;

      margin-bottom:24px;

    }


    .food-buttons{

      display:flex;

      justify-content:center;

      gap:12px;

      flex-wrap:wrap;

    }


    .food-button{

      min-width:150px;

      padding:13px 18px;

      background:#292724;

      border:
        1px solid #665943;

      color:#e7ddca;

      cursor:pointer;

      font:inherit;

      transition:.15s;

    }


    .food-button:hover{

      background:#39332a;

      border-color:#a48559;

    }


    .food-button.primary{

      background:#633c31;

      border-color:#a56d55;

    }


    .food-button.primary:hover{

      background:#7a493a;

    }



    /* MENU */

    .dish-menu{

      display:grid;

      gap:10px;

    }


    .dish-card{

      display:grid;

      grid-template-columns:
        1fr auto;

      align-items:center;

      gap:20px;

      padding:16px 18px;

      background:
        rgba(255,255,255,.025);

      border:
        1px solid
        rgba(179,150,104,.25);

      cursor:pointer;

      transition:.15s;

    }


    .dish-card:hover{

      background:
        rgba(179,130,72,.09);

      border-color:
        rgba(200,163,105,.7);

      transform:
        translateX(3px);

    }


    .dish-name{

      font-size:20px;

      color:#f0dfc1;

    }


    .dish-pinyin{

      margin-top:3px;

      color:#a99a83;

      font-size:12px;

    }


    .dish-region{

      color:#9d8260;

      font-size:11px;

      text-align:right;

    }



    /* INTRO */

    .dish-intro-name{

      text-align:center;

      font-size:38px;

      color:#f0dfbd;

      margin-top:5px;

    }


    .dish-intro-pinyin{

      text-align:center;

      color:#b59a70;

      font-size:14px;

      letter-spacing:.1em;

      margin-bottom:22px;

    }


    .dish-description{

      max-width:560px;

      margin:
        0 auto 20px;

      text-align:center;

      color:#c8bdab;

      line-height:1.9;

      font-size:13px;

    }


    .ingredients{

      text-align:center;

      margin-bottom:27px;

      color:#a99d8a;

      font-size:12px;

      line-height:2;

    }



    /* BREAKOUT */

    #foodGameScreen{

      flex-direction:column;

      padding:15px;

      box-sizing:border-box;

    }


    .breakout-header{

      width:
        min(900px,96vw);

      display:flex;

      justify-content:
        space-between;

      align-items:end;

      margin-bottom:10px;

      color:#c9b99d;

    }


    .breakout-dish-name{

      font-size:20px;

      color:#ead7b5;

    }


    .breakout-dish-pinyin{

      font-size:11px;

      color:#8f816d;

    }


    #foodBreakoutCanvas{

      width:
        min(900px,96vw);

      max-height:
        72vh;

      aspect-ratio:
        16 / 10;

      background:#111217;

      border:
        1px solid #6f5a3c;

      box-shadow:
        0 20px 70px
        rgba(0,0,0,.65);

      image-rendering:
        pixelated;

    }


    .breakout-controls{

      margin-top:10px;

      font-size:11px;

      color:#82796c;

      letter-spacing:.08em;

    }



    /* COMPLETE */

    .complete-mark{

      text-align:center;

      color:#b88c52;

      font-size:12px;

      letter-spacing:.3em;

      margin-bottom:8px;

    }


    .complete-title{

      text-align:center;

      font-size:36px;

      color:#f0dfbd;

      margin-bottom:5px;

    }


    .complete-cn{

      text-align:center;

      color:#aa8d65;

      margin-bottom:25px;

    }


    .new-dish{

      width:max-content;

      max-width:100%;

      margin:
        0 auto 25px;

      padding:
        7px 15px;

      border:
        1px solid #8b6647;

      color:#d0aa74;

      font-size:11px;

      letter-spacing:.12em;

    }



    /* FOOD BOOK */

    .food-book-grid{

      display:grid;

      grid-template-columns:
        repeat(
          auto-fit,
          minmax(190px,1fr)
        );

      gap:12px;

      margin-bottom:25px;

    }


    .book-card{

      min-height:120px;

      box-sizing:border-box;

      padding:17px;

      border:
        1px solid
        rgba(164,136,91,.3);

      background:
        rgba(255,255,255,.025);

    }


    .book-card.locked{

      display:flex;

      align-items:center;

      justify-content:center;

      color:#615d56;

      font-size:22px;

      letter-spacing:.18em;

    }


    .book-name{

      color:#ead7b8;

      font-size:19px;

    }


    .book-pinyin{

      color:#948673;

      font-size:11px;

      margin:
        3px 0 12px;

    }


    .book-region{

      color:#ad8c62;

      font-size:11px;

      margin-bottom:8px;

    }


    .book-description{

      color:#aaa093;

      font-size:11px;

      line-height:1.7;

    }


    @media(max-width:600px){

      .food-panel{

        padding:
          28px 20px;

      }

      .dish-intro-name{

        font-size:30px;

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
    "foodBreakoutRoot";


  document.body.appendChild(root);


  // ======================================================
  // COMMON
  // ======================================================

  function stopPlayer(){

    try{

      for(
        const key in keys
      ){
        keys[key] = false;
      }

      player.moving = false;

    }
    catch(error){
      // independent fallback
    }

  }


  function openRoot(){

    foodUIOpen = true;

    stopPlayer();

    root.classList.add("open");

  }


  function closeRoot(){

    foodUIOpen = false;

    breakoutActive = false;

    selectedDish = null;

    root.classList.remove("open");

    root.innerHTML = "";

    if(animationId){

      cancelAnimationFrame(
        animationId
      );

      animationId = null;

    }

  }


  // ======================================================
  // ORDER QUESTION
  // ======================================================

  function showOrderQuestion(){

    openRoot();

    root.innerHTML = `

      <div class="food-screen">

        <div class="food-panel">

          <div class="food-eyebrow">
            杭州探索録・食文化
          </div>

          <h2 class="food-title">
            杭州面館
          </h2>

          <div class="food-subtitle">
            HANGZHOU NOODLE HOUSE
          </div>

          <div class="food-message">
            老板「腹が減ってるなら、
            何か食べていくかい？」
          </div>

          <div class="food-buttons">

            <button
              class="food-button primary"
              id="foodOrderYes"
            >
              菜单を見る
            </button>

            <button
              class="food-button"
              id="foodBookButton"
            >
              料理図鑑
            </button>

            <button
              class="food-button"
              id="foodOrderNo"
            >
              また今度
            </button>

          </div>

        </div>

      </div>

    `;


    document
      .getElementById(
        "foodOrderYes"
      )
      .onclick =
        showMenu;


    document
      .getElementById(
        "foodBookButton"
      )
      .onclick =
        showFoodBook;


    document
      .getElementById(
        "foodOrderNo"
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
      .map(([id,dish])=>`

        <div
          class="dish-card"
          data-dish="${id}"
        >

          <div>

            <div class="dish-name">
              ${dish.name}
            </div>

            <div class="dish-pinyin">
              ${dish.pinyin}
            </div>

          </div>

          <div class="dish-region">
            ${dish.region}<br>
            ${dish.type}
          </div>

        </div>

      `)
      .join("");


    root.innerHTML = `

      <div class="food-screen">

        <div class="food-panel">

          <div class="food-eyebrow">
            菜单
          </div>

          <h2 class="food-title">
            何を注文しますか？
          </h2>

          <div class="food-subtitle">
            SELECT A DISH
          </div>

          <div class="dish-menu">
            ${cards}
          </div>

          <div
            class="food-buttons"
            style="margin-top:24px"
          >

            <button
              class="food-button"
              id="foodMenuBack"
            >
              戻る
            </button>

          </div>

        </div>

      </div>

    `;


    root
      .querySelectorAll(
        ".dish-card"
      )
      .forEach(card=>{

        card.addEventListener(
          "click",
          ()=>{

            showDishIntro(
              card.dataset.dish
            );

          }
        );

      });


    document
      .getElementById(
        "foodMenuBack"
      )
      .onclick =
        showOrderQuestion;

  }


  // ======================================================
  // DISH INTRO
  // ======================================================

  function showDishIntro(id){

    const dish =
      DISHES[id];

    if(!dish){
      return;
    }


    selectedDish = id;


    root.innerHTML = `

      <div class="food-screen">

        <div class="food-panel">

          <div class="food-eyebrow">
            本日の一杯
          </div>

          <div class="dish-intro-name">
            ${dish.name}
          </div>

          <div class="dish-intro-pinyin">
            ${dish.pinyin}
          </div>

          <div class="dish-description">
            ${dish.description}
          </div>

          <div class="ingredients">

            主な食材<br>

            ${dish.ingredients
              .map(
                (x,i)=>
                  `${x}（${dish.ingredientJP[i]}）`
              )
              .join("　")
            }

          </div>

          <div class="food-buttons">

            <button
              class="food-button primary"
              id="foodStartButton"
            >
              いただきます！
            </button>

            <button
              class="food-button"
              id="foodIntroBack"
            >
              菜单に戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document
      .getElementById(
        "foodStartButton"
      )
      .onclick =
        ()=>startBreakout(id);


    document
      .getElementById(
        "foodIntroBack"
      )
      .onclick =
        showMenu;

  }


  // ======================================================
  // BREAKOUT
  // ======================================================

  let game = null;


  function startBreakout(id){

    const dish =
      DISHES[id];

    if(!dish){
      return;
    }


    selectedDish = id;

    breakoutActive = true;

    stopPlayer();


    root.innerHTML = `

      <div
        class="food-screen"
        id="foodGameScreen"
      >

        <div class="breakout-header">

          <div>

            <div class="breakout-dish-name">
              ${dish.name}
            </div>

            <div class="breakout-dish-pinyin">
              ${dish.pinyin}
            </div>

          </div>

          <div id="foodRemaining">
            完食まで --
          </div>

        </div>

        <canvas
          id="foodBreakoutCanvas"
          width="900"
          height="560"
        ></canvas>

        <div class="breakout-controls">
          ← → / A D　移動　
          SPACE　ボール発射　
          ESC　中断
        </div>

      </div>

    `;


    const c =
      document.getElementById(
        "foodBreakoutCanvas"
      );


    const g =
      c.getContext("2d");


    g.imageSmoothingEnabled =
      false;


    game = {

      canvas:c,
      ctx:g,

      running:true,

      launched:false,

      paddle:{
        x:365,
        y:515,
        w:170,
        h:14,
        speed:560
      },

      ball:{
        x:450,
        y:495,
        r:7,
        vx:240,
        vy:-330
      },

      left:false,
      right:false,

      blocks:[],

      particles:[],

      lastIngredient:"",

      dish:dish

    };


    createDishBlocks(
      dish,
      game
    );


    updateRemaining();


    lastTime =
      performance.now();


    animationId =
      requestAnimationFrame(
        breakoutLoop
      );

  }


  // ======================================================
  // BLOCK GENERATION
  // ======================================================

  function createDishBlocks(
    dish,
    state
  ){

    const pattern =
      dish.pattern;


    const cols =
      Math.max(
        ...pattern.map(
          row=>row.length
        )
      );


    const bw = 45;
    const bh = 25;
    const gap = 3;


    const totalWidth =
      cols * (bw+gap);


    const startX =
      (
        state.canvas.width -
        totalWidth
      ) / 2;


    const startY = 85;


    pattern.forEach(
      (row,r)=>{

        [...row].forEach(
          (symbol,col)=>{

            if(symbol === "."){
              return;
            }


            state.blocks.push({

              x:
                startX +
                col*(bw+gap),

              y:
                startY +
                r*(bh+gap),

              w:bw,
              h:bh,

              symbol:symbol,

              alive:true

            });

          }

        );

      }

    );

  }


  // ======================================================
  // LOOP
  // ======================================================

  function breakoutLoop(now){

    if(
      !breakoutActive ||
      !game ||
      !game.running
    ){
      return;
    }


    const dt =
      Math.min(
        (now-lastTime)/1000,
        .03
      );


    lastTime = now;


    updateBreakout(dt);

    drawBreakout();


    animationId =
      requestAnimationFrame(
        breakoutLoop
      );

  }


  // ======================================================
  // UPDATE
  // ======================================================

  function updateBreakout(dt){

    const p =
      game.paddle;


    if(game.left){

      p.x -=
        p.speed*dt;

    }


    if(game.right){

      p.x +=
        p.speed*dt;

    }


    p.x =
      Math.max(
        10,
        Math.min(
          game.canvas.width -
          p.w -
          10,
          p.x
        )
      );


    const ball =
      game.ball;


    if(
      !game.launched
    ){

      ball.x =
        p.x +
        p.w/2;

      ball.y =
        p.y -
        ball.r -
        3;

      return;

    }


    ball.x +=
      ball.vx*dt;

    ball.y +=
      ball.vy*dt;


    // walls

    if(
      ball.x-ball.r <= 0
    ){

      ball.x =
        ball.r;

      ball.vx =
        Math.abs(ball.vx);

    }


    if(
      ball.x+ball.r >=
      game.canvas.width
    ){

      ball.x =
        game.canvas.width -
        ball.r;

      ball.vx =
        -Math.abs(ball.vx);

    }


    if(
      ball.y-ball.r <= 0
    ){

      ball.y =
        ball.r;

      ball.vy =
        Math.abs(ball.vy);

    }


    // paddle

    if(
      ball.vy > 0 &&
      ball.x >= p.x &&
      ball.x <= p.x+p.w &&
      ball.y+ball.r >= p.y &&
      ball.y-ball.r <=
        p.y+p.h
    ){

      ball.y =
        p.y-ball.r;


      const hit =
        (
          ball.x -
          (p.x+p.w/2)
        ) /
        (p.w/2);


      ball.vx =
        hit*430;


      ball.vy =
        -Math.abs(
          ball.vy
        );

    }


    // blocks

    for(
      const block of
      game.blocks
    ){

      if(!block.alive){
        continue;
      }


      if(
        ball.x+ball.r >
          block.x &&

        ball.x-ball.r <
          block.x+block.w &&

        ball.y+ball.r >
          block.y &&

        ball.y-ball.r <
          block.y+block.h
      ){

        block.alive =
          false;


        ball.vy *= -1;


        createParticles(
          block.x+
          block.w/2,

          block.y+
          block.h/2,

          block.symbol
        );


        showIngredient(
          block.symbol
        );


        updateRemaining();


        break;

      }

    }


    // particles

    game.particles.forEach(
      particle=>{

        particle.x +=
          particle.vx*dt;

        particle.y +=
          particle.vy*dt;

        particle.vy +=
          150*dt;

        particle.life -=
          dt;

      }
    );


    game.particles =
      game.particles.filter(
        p=>p.life>0
      );


    // clear

    const remaining =
      game.blocks.filter(
        b=>b.alive
      ).length;


    if(
      remaining === 0
    ){

      game.running =
        false;

      breakoutActive =
        false;


      setTimeout(
        completeDish,
        450
      );

      return;

    }


    // miss

    if(
      ball.y-ball.r >
      game.canvas.height
    ){

      resetBall();

    }

  }


  // ======================================================
  // RESET BALL
  // ======================================================

  function resetBall(){

    game.launched =
      false;


    game.ball.vx =
      Math.random() < .5
        ? -240
        : 240;


    game.ball.vy =
      -330;

  }


  // ======================================================
  // INGREDIENT NAME
  // ======================================================

  function getIngredient(
    symbol
  ){

    const dish =
      game.dish;


    if(
      selectedDish ===
      "pianerchuan"
    ){

      const map = {

        M:[
          "面",
          "miàn",
          "麺"
        ],

        V:[
          "雪菜",
          "xuěcài",
          "雪菜"
        ],

        B:[
          "笋",
          "sǔn",
          "たけのこ"
        ],

        N:[
          "猪肉",
          "zhūròu",
          "豚肉"
        ]

      };


      return map[symbol] ||
        map.M;

    }


    if(
      selectedDish ===
      "xiabaoshanmian"
    ){

      const map = {

        S:[
          "面",
          "miàn",
          "麺"
        ],

        E:[
          "虾",
          "xiā",
          "エビ"
        ],

        N:[
          "鳝鱼",
          "shànyú",
          "タウナギ"
        ]

      };


      return map[symbol] ||
        map.S;

    }


    const map = {

      G:[
        "葱",
        "cōng",
        "ネギ"
      ],

      N:[
        "面",
        "miàn",
        "麺"
      ]

    };


    return map[symbol] ||
      map.N;

  }


  // ======================================================
  // COLORS
  // ======================================================

  function blockColor(
    symbol
  ){

    const colors = {

      M:"#d7b56d",
      V:"#667a45",
      B:"#c8a15f",
      N:"#a95f4b",

      S:"#d1a763",
      E:"#d87959",

      G:"#70864c"

    };


    return (
      colors[symbol] ||
      "#b88b58"
    );

  }


  // ======================================================
  // PARTICLES
  // ======================================================

  function createParticles(
    x,
    y,
    symbol
  ){

    for(
      let i=0;
      i<5;
      i++
    ){

      game.particles.push({

        x:x,
        y:y,

        vx:
          (
            Math.random()-.5
          )*130,

        vy:
          -Math.random()*100,

        life:
          .3+
          Math.random()*.25,

        color:
          blockColor(symbol)

      });

    }

  }


  // ======================================================
  // INGREDIENT POPUP
  // ======================================================

  function showIngredient(
    symbol
  ){

    const ingredient =
      getIngredient(
        symbol
      );


    game.lastIngredient =
      ingredient;

  }


  // ======================================================
  // REMAINING
  // ======================================================

  function updateRemaining(){

    const element =
      document.getElementById(
        "foodRemaining"
      );


    if(
      !element ||
      !game
    ){
      return;
    }


    const remaining =
      game.blocks.filter(
        b=>b.alive
      ).length;


    element.textContent =
      `完食まで ${remaining}`;

  }


  // ======================================================
  // DRAW
  // ======================================================

  function drawBreakout(){

    const g =
      game.ctx;


    const c =
      game.canvas;


    // background

    g.fillStyle =
      "#101116";

    g.fillRect(
      0,0,
      c.width,
      c.height
    );


    // subtle floor lines

    g.strokeStyle =
      "rgba(184,145,88,.07)";

    g.lineWidth=1;


    for(
      let y=0;
      y<c.height;
      y+=28
    ){

      g.beginPath();

      g.moveTo(
        0,y+.5
      );

      g.lineTo(
        c.width,
        y+.5
      );

      g.stroke();

    }


    // dish plate

    g.fillStyle =
      "#28272a";

    g.beginPath();

    g.ellipse(
      c.width/2,
      255,
      335,
      155,
      0,
      0,
      Math.PI*2
    );

    g.fill();


    g.strokeStyle =
      "#665b4b";

    g.lineWidth=4;

    g.stroke();


    // blocks

    game.blocks.forEach(
      block=>{

        if(!block.alive){
          return;
        }


        g.fillStyle =
          blockColor(
            block.symbol
          );


        g.fillRect(
          block.x,
          block.y,
          block.w,
          block.h
        );


        g.fillStyle =
          "rgba(255,255,255,.12)";


        g.fillRect(
          block.x+3,
          block.y+3,
          block.w-6,
          4
        );


        g.fillStyle =
          "rgba(0,0,0,.18)";


        g.fillRect(
          block.x+3,
          block.y+
          block.h-5,
          block.w-6,
          3
        );

      }
    );


    // particles

    game.particles.forEach(
      particle=>{

        g.globalAlpha =
          Math.max(
            0,
            particle.life*2
          );


        g.fillStyle =
          particle.color;


        g.fillRect(
          particle.x,
          particle.y,
          4,
          4
        );

      }
    );


    g.globalAlpha=1;


    // paddle

    const p =
      game.paddle;


    g.fillStyle =
      "#d6c7a9";


    g.fillRect(
      p.x,
      p.y,
      p.w,
      p.h
    );


    g.fillStyle =
      "#80674c";


    g.fillRect(
      p.x+5,
      p.y+4,
      p.w-10,
      5
    );


    // ball

    const ball =
      game.ball;


    g.fillStyle =
      "#f4e5bf";


    g.beginPath();

    g.arc(
      ball.x,
      ball.y,
      ball.r,
      0,
      Math.PI*2
    );

    g.fill();


    // ingredient information

    if(
      game.lastIngredient
    ){

      const [
        cn,
        py,
        jp
      ] =
        game.lastIngredient;


      g.fillStyle =
        "rgba(9,10,13,.78)";


      g.fillRect(
        22,
        22,
        190,
        67
      );


      g.fillStyle =
        "#ead9ba";


      g.font =
        "20px sans-serif";


      g.fillText(
        cn,
        37,
        49
      );


      g.fillStyle =
        "#a99a83";


      g.font =
        "11px sans-serif";


      g.fillText(
        `${py}　${jp}`,
        37,
        72
      );

    }


    // ready

    if(
      !game.launched
    ){

      g.fillStyle =
        "rgba(0,0,0,.55)";


      g.fillRect(
        300,
        390,
        300,
        60
      );


      g.fillStyle =
        "#eadbc0";


      g.font =
        "16px sans-serif";


      g.textAlign =
        "center";


      g.fillText(
        "SPACE でスタート",
        450,
        425
      );


      g.textAlign =
        "left";

    }

  }


  // ======================================================
  // COMPLETE
  // ======================================================

  function completeDish(){

    const id =
      selectedDish;


    const dish =
      DISHES[id];


    const isNew =
      discoverDish(id);


    root.innerHTML = `

      <div class="food-screen">

        <div class="food-panel">

          <div class="complete-mark">
            FINISHED
          </div>

          <div class="complete-title">
            完食！
          </div>

          <div class="complete-cn">
            吃完了！
          </div>

          ${
            isNew
            ? `
              <div class="new-dish">
                NEW　料理図鑑に登録されました
              </div>
            `
            : ""
          }

          <div class="dish-intro-name">
            ${dish.name}
          </div>

          <div class="dish-intro-pinyin">
            ${dish.pinyin}
          </div>

          <div class="dish-description">
            ${dish.description}
          </div>

          <div class="ingredients">

            ${dish.region}<br>

            主な食材：
            ${dish.ingredients.join("・")}

          </div>

          <div class="food-buttons">

            <button
              class="food-button primary"
              id="foodAgain"
            >
              もう一杯
            </button>

            <button
              class="food-button"
              id="foodCompleteBook"
            >
              料理図鑑
            </button>

            <button
              class="food-button"
              id="foodReturnShop"
            >
              店に戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document
      .getElementById(
        "foodAgain"
      )
      .onclick =
        ()=>startBreakout(id);


    document
      .getElementById(
        "foodCompleteBook"
      )
      .onclick =
        showFoodBook;


    document
      .getElementById(
        "foodReturnShop"
      )
      .onclick =
        closeRoot;

  }


  // ======================================================
  // FOOD BOOK
  // ======================================================

  function showFoodBook(){

    openRoot();


    const cards =
      Object.entries(DISHES)
      .map(([id,dish])=>{

        if(
          !discovered.includes(id)
        ){

          return `

            <div
              class="book-card locked"
            >
              ？？？
            </div>

          `;

        }


        return `

          <div class="book-card">

            <div class="book-name">
              ${dish.name}
            </div>

            <div class="book-pinyin">
              ${dish.pinyin}
            </div>

            <div class="book-region">
              ${dish.region}
            </div>

            <div class="book-description">
              ${dish.description}
            </div>

          </div>

        `;

      })
      .join("");


    root.innerHTML = `

      <div class="food-screen">

        <div class="food-panel">

          <div class="food-eyebrow">
            中国料理を知る旅
          </div>

          <h2 class="food-title">
            料理図鑑
          </h2>

          <div class="food-subtitle">
            CHINESE FOOD COLLECTION
            ・
            ${discovered.length}
            /
            ${Object.keys(DISHES).length}
          </div>

          <div class="food-book-grid">
            ${cards}
          </div>

          <div class="food-buttons">

            <button
              class="food-button"
              id="foodBookBack"
            >
              戻る
            </button>

          </div>

        </div>

      </div>

    `;


    document
      .getElementById(
        "foodBookBack"
      )
      .onclick =
        showOrderQuestion;

  }


  // ======================================================
  // KEYBOARD
  // ======================================================

  window.addEventListener(

    "keydown",

    event=>{

      if(
        !foodUIOpen
      ){
        return;
      }


      const key =
        event.key.toLowerCase();


      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        breakoutActive &&
        game
      ){

        if(
          key === "arrowleft" ||
          key === "a"
        ){

          game.left = true;

        }


        if(
          key === "arrowright" ||
          key === "d"
        ){

          game.right = true;

        }


        if(
          key === " "
        ){

          game.launched =
            true;

        }


        if(
          key === "escape"
        ){

          breakoutActive =
            false;

          game.running =
            false;

          showMenu();

        }

      }
      else if(
        key === "escape"
      ){

        closeRoot();

      }

    },

    true

  );


  window.addEventListener(

    "keyup",

    event=>{

      if(
        !foodUIOpen ||
        !game
      ){
        return;
      }


      const key =
        event.key.toLowerCase();


      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key === "arrowleft" ||
        key === "a"
      ){

        game.left =
          false;

      }


      if(
        key === "arrowright" ||
        key === "d"
      ){

        game.right =
          false;

      }

    },

    true

  );


  // ======================================================
  // NOODLE SHOP CONNECTION
  // ======================================================

  /*
    game.js の advanceDialogue を後付けで包む。

    面館の老板の最後の台詞を読み終えたら
    通常の報酬処理を壊さず、
    その後に注文画面を開く。
  */

  if(
    typeof advanceDialogue ===
    "function"
  ){

    const originalAdvanceDialogue =
      advanceDialogue;


    advanceDialogue =
    function(){

      let shouldOpenMenu =
        false;


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
          ストーリーモードでは
          勝手にミニゲームを挟まない。
        */

        if(
          typeof STORY ===
          "undefined" ||
          STORY.mode !==
          "story"
        ){

          shouldOpenMenu =
            true;

        }

      }


      originalAdvanceDialogue();


      if(
        shouldOpenMenu
      ){

        waitingForNoodleMenu =
          true;


        waitForDialogueReward();

      }

    };

  }


  // ======================================================
  // WAIT FOR WORD REWARD
  // ======================================================

  function waitForDialogueReward(){

    if(
      !waitingForNoodleMenu
    ){
      return;
    }


    /*
      老板との会話後に
      vocabulary取得画面が出た場合、
      それを閉じるまで待つ。
    */

    const blocked =

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


    if(blocked){

      setTimeout(
        waitForDialogueReward,
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

  window.openFoodBook =
    showFoodBook;


  window.openNoodleMenu =
    showOrderQuestion;


  window.FOOD_DISHES =
    DISHES;


  console.log(
    "杭州探索録 FOOD BREAKOUT Ver.1.0 loaded"
  );

})();
