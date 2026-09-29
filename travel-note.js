"use strict";

// ============================================================
// 杭州探索録
// TRAVEL NOTE / 旅の手帳 Ver.1.1
//
// Lキーで開閉
//
// 左   ：词语 / 杭州话
// 中央 ：収集一覧
// 右   ：詳細・例文・発見記録
//
// Ver.1.1
// ・未発見語に「旅のヒント」を追加
// ・VOCABULARY / HZ_DIALECT の location を利用
// ・杭州话 No.20 の特殊アンロックにも対応
//
// 既存の収集データ・セーブデータには干渉しない。
// ============================================================

(function(){

  const NOTE={
    open:false,
    mode:"vocab",
    selected:0
  };


  // ============================================================
  // 杭州话 EXAMPLES
  // ============================================================
  //
  // 元の HZ_DIALECT データには
  // example / exampleJa が存在しないため、
  // 表示用例文だけここで補う。
  //
  // HZ_DIALECT 本体やセーブデータは変更しない。
  // ============================================================

  const DIALECT_EXAMPLES={

    xiaoyar:{
      cn:"小伢儿在夜市里跑来跑去。",
      mandarin:"小孩子在夜市里跑来跑去。",
      ja:"子どもが夜市の中を走り回っている。"
    },

    chenguang:{
      cn:"葛个辰光，夜市最热闹。",
      mandarin:"这个时候，夜市最热闹。",
      ja:"この時間は、夜市がいちばん賑やかだ。"
    },

    luoyu:{
      cn:"外头落雨了。",
      mandarin:"外面下雨了。",
      ja:"外は雨が降ってきた。"
    },

    xiaode:{
      cn:"葛个事情我晓得。",
      mandarin:"这个事情我知道。",
      ja:"そのことは知っているよ。"
    },

    yanxiehui:{
      cn:"我先走了，晏歇会见。",
      mandarin:"我先走了，等会儿见。",
      ja:"先に行くね、またあとで。"
    },

    gemao:{
      cn:"葛毛去西湖正好。",
      mandarin:"现在去西湖正好。",
      ja:"今、西湖へ行くのにちょうどいい。"
    },

    toumao:{
      cn:"我头毛还看到伊。",
      mandarin:"我刚才还看到他。",
      ja:"さっきまで彼を見かけたよ。"
    },

    yelitou:{
      cn:"夜里头个西湖蛮漂亮。",
      mandarin:"晚上的西湖很漂亮。",
      ja:"夜の西湖はとてもきれいだ。"
    },

    luoxue:{
      cn:"冬天西湖边有辰光会落雪。",
      mandarin:"冬天西湖边有时候会下雪。",
      ja:"冬には西湖のほとりで雪が降ることもある。"
    },

    nongtang:{
      cn:"葛条弄堂里有一家小店。",
      mandarin:"这条小巷里有一家小店。",
      ja:"この路地には小さな店が一軒ある。"
    },

    chicha:{
      cn:"坐下来吃茶。",
      mandarin:"坐下来喝茶。",
      ja:"座ってお茶を飲もう。"
    },

    kunjiao:{
      cn:"辰光不早了，我要睏觉了。",
      mandarin:"时间不早了，我要睡觉了。",
      ja:"もう遅いから、寝るよ。"
    },

    xieli:{
      cn:"走累了，坐下来歇力。",
      mandarin:"走累了，坐下来休息。",
      ja:"歩き疲れたから、座って休もう。"
    },

    zuosha:{
      cn:"侬在葛里做啥？",
      mandarin:"你在这里做什么？",
      ja:"ここで何をしているの？"
    },

    shadifang:{
      cn:"葛是啥地方？",
      mandarin:"这是什么地方？",
      ja:"ここはどこ？"
    },

    yixixi:{
      cn:"坐一息息再走。",
      mandarin:"坐一会儿再走。",
      ja:"少し座ってから行こう。"
    },

    mulaolao:{
      cn:"夜市里人木佬佬多。",
      mandarin:"夜市里人非常多。",
      ja:"夜市にはものすごく人が多い。"
    },

    faye:{
      cn:"葛个人讲话真发靥。",
      mandarin:"这个人说话真好笑。",
      ja:"この人の話し方は本当に面白い。"
    },

    wentunshui:{
      cn:"给我一杯温吞水。",
      mandarin:"给我一杯温水。",
      ja:"ぬるま湯を一杯ください。"
    },

    shahetaor:{
      cn:"杭州个沙核桃儿蛮有名。",
      mandarin:"杭州的山核桃很有名。",
      ja:"杭州の山胡桃はとても有名だ。"
    }

  };


  // ============================================================
  // TRAVEL HINT
  // ============================================================
  //
  // vocabulary.js / dialect.js の location を読み、
  // 未発見時の探索ヒントを生成する。
  //
  // 単語そのもの・意味・例文は未発見時には表示しない。
  // ============================================================

  function getTravelHint(location){

    const hints={

      "武林夜市":{
        area:"武林夜市",
        text:
          "提灯の灯る夜市をゆっくり歩いてみましょう。店先や、そこにいる人々にも目を向けてみてください。"
      },

      "小吃街":{
        area:"小吃街",
        text:
          "香ばしい匂いが漂う屋台街へ行ってみましょう。食べ物を売る店の周辺に何かありそうです。"
      },

      "杭州面馆":{
        area:"杭州面馆",
        text:
          "杭州らしい麺料理を出す店を訪ねてみましょう。店内の料理や人々を調べてみてください。"
      },

      "夜市食堂":{
        area:"夜市食堂",
        text:
          "夜市の食堂を訪ねてみましょう。料理や店内に、まだ知らない言葉が隠れているかもしれません。"
      },

      "西湖":{
        area:"西湖",
        text:
          "夜の西湖へ足を延ばしてみましょう。湖畔の風景や、そこにいる人々を観察してみてください。"
      },

      "老杭州茶馆":{
        area:"老杭州茶馆",
        text:
          "昔ながらの茶館を訪ねてみましょう。お茶や茶器、店の人の話に手がかりがありそうです。"
      },

      "杭州文化":{
        area:"杭州文化",
        text:
          "杭州の歴史や文化について知ることのできる場所を探してみましょう。"
      },

      "杭州文创":{
        area:"杭州文创",
        text:
          "杭州の文化をテーマにした品物が並ぶ店を覗いてみましょう。展示や商品をよく見てみてください。"
      },

      "武林百货":{
        area:"武林百货",
        text:
          "武林の百貨店を訪ねてみましょう。杭州らしい商品を探すと、何か見つかるかもしれません。"
      },

      "湖滨茶室":{
        area:"湖滨茶室",
        text:
          "西湖のほとりにある茶室を訪ねてみましょう。静かな店内に、文学にまつわる言葉が隠れています。"
      },

      "便利店":{
        area:"便利店",
        text:
          "夜市にある便利店へ入ってみましょう。普段の暮らしで使う言葉が見つかりそうです。"
      },

      "武林":{
        area:"武林",
        text:
          "武林の街を歩いてみましょう。夜市だけでなく、周囲の街並みにも目を向けてみてください。"
      },

      "杭州":{
        area:"杭州",
        text:
          "杭州の街を歩き、人々や街の文化に触れてみましょう。何気ない場所にも発見があります。"
      }

    };


    return (
      hints[location] ||
      {
        area:
          location ||
          "杭州のどこか",

        text:
          "杭州の街を歩き、人々と話したり、気になる場所を調べてみましょう。"
      }
    );

  }


  // ============================================================
  // STYLE
  // ============================================================

  function installStyle(){

    if(
      document.getElementById(
        "travelNoteStyle"
      )
    ){
      return;
    }


    const style=
      document.createElement("style");


    style.id=
      "travelNoteStyle";


    style.textContent=`

      /* ======================================================
         ROOT
      ====================================================== */

      #travelNote{

        position:absolute;

        left:50%;
        top:50%;

        transform:
          translate(-50%,-50%);

        width:min(
          1120px,
          calc(100% - 36px)
        );

        height:min(
          680px,
          calc(100% - 36px)
        );

        box-sizing:border-box;

        z-index:16000;

        overflow:hidden;

        color:#32271d;

        background:
          linear-gradient(
            90deg,
            #d8c7a2 0%,
            #eee0bd 3%,
            #ead9b5 49.6%,
            #cdb88f 50%,
            #ead9b5 50.4%,
            #efe2c2 97%,
            #d1bd94 100%
          );

        border:
          2px solid #6e4c31;

        box-shadow:
          0 0 0 4px #241914,
          0 20px 70px rgba(0,0,0,.85);

        font-family:
          "Noto Serif SC",
          "Noto Serif JP",
          "Yu Mincho",
          serif;

      }


      #travelNote.hidden{
        display:none !important;
      }


      #travelNote::before{

        content:"";

        position:absolute;

        inset:0;

        pointer-events:none;

        opacity:.18;

        background-image:
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 25px,
            rgba(82,57,37,.08) 26px
          );

      }


      /* ======================================================
         HEADER
      ====================================================== */

      .tn-header{

        position:relative;

        height:78px;

        box-sizing:border-box;

        display:flex;

        align-items:center;

        justify-content:space-between;

        padding:
          13px 24px 11px;

        border-bottom:
          1px solid rgba(79,51,31,.28);

      }


      .tn-title-cn{

        font-size:26px;

        font-weight:700;

        letter-spacing:.16em;

        color:#3e2c1e;

      }


      .tn-title-en{

        margin-top:3px;

        color:#876f54;

        font-size:9px;

        letter-spacing:.28em;

      }


      .tn-total{

        text-align:right;

        color:#755e44;

        font-size:11px;

        line-height:1.8;

      }


      .tn-total strong{

        color:#9d352a;

        font-size:15px;

      }


      /* ======================================================
         BODY
      ====================================================== */

      .tn-body{

        position:relative;

        display:grid;

        grid-template-columns:
          190px 320px 1fr;

        height:
          calc(100% - 118px);

      }


      /* ======================================================
         LEFT
      ====================================================== */

      .tn-left{

        box-sizing:border-box;

        padding:22px 14px;

        border-right:
          1px solid rgba(82,56,35,.22);

      }


      .tn-side-label{

        margin:
          0 8px 15px;

        color:#90775a;

        font-size:9px;

        letter-spacing:.28em;

      }


      .tn-mode{

        position:relative;

        margin-bottom:12px;

        padding:
          17px 14px;

        cursor:pointer;

        border:
          1px solid rgba(90,63,42,.22);

        background:
          rgba(255,250,231,.18);

        transition:
          .15s ease;

      }


      .tn-mode:hover{

        background:
          rgba(255,250,231,.36);

      }


      .tn-mode.active{

        border-color:
          #9b4937;

        background:
          rgba(143,58,42,.08);

      }


      .tn-mode.active::before{

        content:"";

        position:absolute;

        left:-1px;
        top:-1px;
        bottom:-1px;

        width:4px;

        background:#a33c31;

      }


      .tn-mode-cn{

        color:#433124;

        font-size:22px;

        font-weight:700;

      }


      .tn-mode-en{

        margin-top:3px;

        color:#947b5d;

        font-size:8px;

        letter-spacing:.16em;

      }


      .tn-mode-count{

        margin-top:10px;

        color:#a33c31;

        font-size:12px;

      }


      .tn-seal{

        width:60px;
        height:60px;

        margin:
          34px auto 0;

        display:flex;

        align-items:center;
        justify-content:center;

        box-sizing:border-box;

        border:
          3px double rgba(153,48,39,.62);

        color:rgba(153,48,39,.72);

        font-size:13px;

        line-height:1.2;

        text-align:center;

        transform:
          rotate(-5deg);

      }


      /* ======================================================
         CENTER
      ====================================================== */

      .tn-center{

        box-sizing:border-box;

        border-right:
          1px solid rgba(82,56,35,.22);

        overflow:hidden;

        display:flex;

        flex-direction:column;

      }


      .tn-list-head{

        flex:0 0 auto;

        padding:
          13px 16px 10px;

        color:#80694e;

        font-size:9px;

        letter-spacing:.2em;

        border-bottom:
          1px solid rgba(82,56,35,.16);

      }


      #travelNoteList{

        flex:1;

        overflow-y:auto;

        padding:
          7px 9px 18px;

        scrollbar-width:thin;

        scrollbar-color:
          #9e8060 transparent;

      }


      .tn-entry{

        position:relative;

        display:grid;

        grid-template-columns:
          34px 1fr 20px;

        gap:8px;

        align-items:center;

        padding:
          10px 8px;

        cursor:pointer;

        border-bottom:
          1px solid rgba(83,58,39,.12);

      }


      .tn-entry:hover{

        background:
          rgba(255,250,229,.34);

      }


      .tn-entry.active{

        background:
          rgba(151,65,46,.09);

        box-shadow:
          inset 3px 0 #a74435;

      }


      .tn-entry.locked{

        opacity:.48;

      }


      .tn-number{

        color:#a58c6e;

        font-size:9px;

      }


      .tn-word{

        color:#3c2c21;

        font-size:17px;

        font-weight:700;

      }


      .tn-sub{

        margin-top:2px;

        color:#8a7257;

        font-size:9px;

      }


      .tn-diamond{

        color:#a23e31;

        font-size:10px;

      }


      /* ======================================================
         RIGHT
      ====================================================== */

      #travelNoteDetail{

        position:relative;

        box-sizing:border-box;

        overflow-y:auto;

        padding:
          24px 30px 34px;

        scrollbar-width:thin;

        scrollbar-color:
          #9e8060 transparent;

      }


      .tn-detail-type{

        color:#9a7d5b;

        font-size:9px;

        letter-spacing:.24em;

      }


      .tn-detail-word{

        margin-top:8px;

        color:#35251b;

        font-size:38px;

        font-weight:700;

        letter-spacing:.05em;

      }


      .tn-detail-pinyin{

        margin-top:3px;

        color:#9b4034;

        font-size:14px;

        letter-spacing:.08em;

      }


      .tn-detail-meaning{

        margin-top:11px;

        color:#5c4937;

        font-size:15px;

        line-height:1.7;

      }


      .tn-rule{

        position:relative;

        margin:
          22px 0 17px;

        height:1px;

        background:
          rgba(87,59,38,.22);

      }


      .tn-rule::after{

        content:"";

        position:absolute;

        left:0;
        top:-2px;

        width:38px;
        height:5px;

        background:
          rgba(153,58,45,.72);

      }


      .tn-section-label{

        margin-bottom:9px;

        color:#927658;

        font-size:9px;

        letter-spacing:.2em;

      }


      .tn-example{

        padding:
          14px 16px;

        background:
          rgba(255,250,229,.30);

        border-left:
          2px solid #a64838;

      }


      .tn-example-cn{

        color:#39291f;

        font-size:17px;

        line-height:1.7;

      }


      .tn-example-pinyin{

        margin-top:5px;

        color:#9a5749;

        font-family:
          Arial,
          sans-serif;

        font-size:11px;

        line-height:1.65;

      }


      .tn-example-ja{

        margin-top:8px;

        color:#75614b;

        font-size:12px;

        line-height:1.7;

      }


      .tn-info-grid{

        display:grid;

        grid-template-columns:
          1fr 1fr;

        gap:10px;

        margin-top:17px;

      }


      .tn-info{

        padding:
          10px 12px;

        border:
          1px solid rgba(84,58,39,.16);

        background:
          rgba(255,250,229,.17);

      }


      .tn-info-label{

        color:#9a8061;

        font-size:8px;

        letter-spacing:.16em;

      }


      .tn-info-value{

        margin-top:5px;

        color:#584332;

        font-size:11px;

        line-height:1.6;

      }


      .tn-note{

        margin-top:16px;

        padding:
          12px 14px;

        color:#6e5842;

        font-size:11px;

        line-height:1.8;

        border-top:
          1px dashed rgba(84,58,39,.26);

        border-bottom:
          1px dashed rgba(84,58,39,.26);

      }


      /* ======================================================
         LOCKED / HINT
      ====================================================== */

      .tn-locked-detail{

        min-height:100%;

        box-sizing:border-box;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        text-align:center;

        color:#806b54;

        line-height:2;

      }


      .tn-lock-mark{

        width:58px;
        height:58px;

        display:flex;

        align-items:center;
        justify-content:center;

        margin-bottom:14px;

        border:
          2px solid rgba(146,61,48,.35);

        color:rgba(146,61,48,.55);

        font-size:28px;

        transform:
          rotate(-4deg);

      }


      .tn-unknown-title{

        font-size:18px;

        color:#4c392a;

        margin-bottom:2px;

      }


      .tn-unknown-en{

        font-size:9px;

        color:#9b876e;

        letter-spacing:.18em;

      }


      .tn-hint-rule{

        width:70%;
        height:1px;

        margin:
          20px 0 18px;

        background:
          rgba(84,58,39,.18);

      }


      .tn-hint-title{

        color:#9b4034;

        font-size:10px;

        letter-spacing:.2em;

        margin-bottom:14px;

      }


      .tn-hint-area-label{

        color:#91765a;

        font-size:8px;

        letter-spacing:.18em;

      }


      .tn-hint-area{

        margin-top:4px;

        color:#4c3425;

        font-size:18px;

        font-weight:700;

      }


      .tn-hint-mark{

        width:28px;
        height:2px;

        margin:
          11px auto;

        background:#a74435;

        opacity:.65;

      }


      .tn-hint-text{

        max-width:350px;

        font-size:12px;

        line-height:2;

        color:#6f5943;

      }


      .tn-uncollected{

        margin-top:20px;

        padding:
          5px 13px;

        border:
          1px solid rgba(145,64,50,.25);

        color:
          rgba(145,64,50,.72);

        font-size:9px;

        letter-spacing:.14em;

      }


      .tn-progress-hint{

        margin-top:20px;

        padding:
          7px 17px;

        border:
          1px solid rgba(154,64,52,.28);

        color:#8d4b3e;

        font-size:11px;

      }


      .tn-new-clue{

        margin-top:20px;

        color:#9b4034;

        font-size:11px;

      }


      /* ======================================================
         FOOTER
      ====================================================== */

      .tn-footer{

        position:relative;

        height:40px;

        box-sizing:border-box;

        display:flex;

        align-items:center;

        justify-content:space-between;

        padding:
          0 22px;

        border-top:
          1px solid rgba(82,56,35,.22);

        color:#806b53;

        font-size:9px;

        letter-spacing:.08em;

      }


      .tn-footer strong{

        color:#9d3d31;

        font-weight:400;

      }


      /* ======================================================
         SMALL SCREEN
      ====================================================== */

      @media(max-width:800px){

        .tn-body{

          grid-template-columns:
            135px 230px 1fr;

        }


        .tn-left{

          padding:
            16px 8px;

        }


        #travelNoteDetail{

          padding:
            18px;

        }


        .tn-detail-word{

          font-size:30px;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  // ============================================================
  // CREATE UI
  // ============================================================

  function createUI(){

    if(
      document.getElementById(
        "travelNote"
      )
    ){
      return;
    }


    const parent=
      typeof canvas!=="undefined" &&
      canvas.parentElement
      ? canvas.parentElement
      : document.body;


    if(
      getComputedStyle(parent)
        .position==="static"
    ){

      parent.style.position=
        "relative";

    }


    const panel=
      document.createElement(
        "div"
      );


    panel.id=
      "travelNote";


    panel.className=
      "hidden";


    panel.innerHTML=`

      <div class="tn-header">

        <div>

          <div class="tn-title-cn">
            旅の手帳
          </div>

          <div class="tn-title-en">
            HANGZHOU TRAVEL NOTE
          </div>

        </div>


        <div
          id="travelNoteTotal"
          class="tn-total">
        </div>

      </div>


      <div class="tn-body">

        <div class="tn-left">

          <div class="tn-side-label">
            COLLECTION
          </div>


          <div
            id="tnModeVocab"
            class="tn-mode active">

            <div class="tn-mode-cn">
              词语
            </div>

            <div class="tn-mode-en">
              MANDARIN WORDS
            </div>

            <div
              id="tnVocabCount"
              class="tn-mode-count">
            </div>

          </div>


          <div
            id="tnModeDialect"
            class="tn-mode">

            <div class="tn-mode-cn">
              杭州话
            </div>

            <div class="tn-mode-en">
              HANGZHOU DIALECT
            </div>

            <div
              id="tnDialectCount"
              class="tn-mode-count">
            </div>

          </div>


          <div class="tn-seal">
            杭州<br>
            游记
          </div>

        </div>


        <div class="tn-center">

          <div
            id="travelNoteListHead"
            class="tn-list-head">
          </div>

          <div id="travelNoteList">
          </div>

        </div>


        <div id="travelNoteDetail">
        </div>

      </div>


      <div class="tn-footer">

        <div>
          ↑↓ 選択　
          ←→ <strong>词语 / 杭州话</strong>
        </div>

        <div>
          L / Esc 閉じる
        </div>

      </div>

    `;


    parent.appendChild(
      panel
    );


    document
      .getElementById(
        "tnModeVocab"
      )
      .addEventListener(
        "click",
        ()=>{

          NOTE.mode="vocab";

          NOTE.selected=0;

          render();

        }
      );


    document
      .getElementById(
        "tnModeDialect"
      )
      .addEventListener(
        "click",
        ()=>{

          NOTE.mode="dialect";

          NOTE.selected=0;

          render();

        }
      );

  }


  // ============================================================
  // DATA
  // ============================================================

  function getVocabEntries(){

    if(
      typeof VOCABULARY===
      "undefined"
    ){
      return [];
    }


    return Object.entries(
      VOCABULARY
    );

  }


  function getDialectEntries(){

    if(
      typeof HZ_DIALECT===
      "undefined"
    ){
      return [];
    }


    return Object.entries(
      HZ_DIALECT
    ).sort(
      (a,b)=>
        a[1].no-
        b[1].no
    );

  }


  function getEntries(){

    if(
      NOTE.mode==="dialect"
    ){

      return getDialectEntries();

    }


    return getVocabEntries();

  }


  function isCollected(id){

    if(
      NOTE.mode==="dialect"
    ){

      return (
        typeof hzHasDialect===
        "function"
        &&
        hzHasDialect(id)
      );

    }


    return (
      typeof hasVocabulary===
      "function"
      &&
      hasVocabulary(id)
    );

  }


  // ============================================================
  // OPEN
  // ============================================================

  function open(){

    if(NOTE.open){
      return;
    }


    try{

      if(
        typeof dialogue!=="undefined" &&
        dialogue.active
      ){
        return;
      }


      if(
        typeof transitionLock!=="undefined" &&
        transitionLock
      ){
        return;
      }


      if(
        typeof wordGetActive!=="undefined" &&
        wordGetActive
      ){
        return;
      }


      if(
        typeof completionActive!=="undefined" &&
        completionActive
      ){
        return;
      }

    }
    catch(error){
      // 他スクリプトの状態取得失敗時は続行
    }


    NOTE.open=true;

    NOTE.selected=0;


    if(
      typeof clearMovementKeys===
      "function"
    ){

      clearMovementKeys();

    }


    render();


    document
      .getElementById(
        "travelNote"
      )
      .classList.remove(
        "hidden"
      );

  }


  // ============================================================
  // CLOSE
  // ============================================================

  function close(){

    NOTE.open=false;


    const panel=
      document.getElementById(
        "travelNote"
      );


    if(panel){

      panel.classList.add(
        "hidden"
      );

    }

  }


  // ============================================================
  // TOGGLE
  // ============================================================

  function toggle(){

    if(NOTE.open){

      close();

    }
    else{

      open();

    }

  }


  // ============================================================
  // RENDER
  // ============================================================

  function render(){

    renderModes();

    renderList();

    renderTotal();

  }


  // ============================================================
  // MODE
  // ============================================================

  function renderModes(){

    const vocab=
      document.getElementById(
        "tnModeVocab"
      );


    const dialect=
      document.getElementById(
        "tnModeDialect"
      );


    vocab.classList.toggle(
      "active",
      NOTE.mode==="vocab"
    );


    dialect.classList.toggle(
      "active",
      NOTE.mode==="dialect"
    );


    const vocabTotal=
      getVocabEntries().length;


    const vocabCollected=
      typeof collectedVocabulary!==
      "undefined"
      ? collectedVocabulary.length
      : 0;


    const dialectTotal=
      getDialectEntries().length;


    const dialectCollected=
      typeof collectedDialect!==
      "undefined"
      ? collectedDialect.length
      : 0;


    document
      .getElementById(
        "tnVocabCount"
      )
      .textContent=
        `${vocabCollected} / ${vocabTotal}`;


    document
      .getElementById(
        "tnDialectCount"
      )
      .textContent=
        `${dialectCollected} / ${dialectTotal}`;

  }


  // ============================================================
  // TOTAL
  // ============================================================

  function renderTotal(){

    const vocabTotal=
      getVocabEntries().length;


    const dialectTotal=
      getDialectEntries().length;


    const vocabCollected=
      typeof collectedVocabulary!==
      "undefined"
      ? collectedVocabulary.length
      : 0;


    const dialectCollected=
      typeof collectedDialect!==
      "undefined"
      ? collectedDialect.length
      : 0;


    const current=
      vocabCollected+
      dialectCollected;


    const total=
      vocabTotal+
      dialectTotal;


    document
      .getElementById(
        "travelNoteTotal"
      )
      .innerHTML=`

        旅の記録<br>

        <strong>
          ${current}
        </strong>

        / ${total}

      `;

  }


  // ============================================================
  // LIST
  // ============================================================

  function renderList(){

    const entries=
      getEntries();


    if(
      NOTE.selected>=
      entries.length
    ){

      NOTE.selected=
        Math.max(
          0,
          entries.length-1
        );

    }


    const list=
      document.getElementById(
        "travelNoteList"
      );


    const head=
      document.getElementById(
        "travelNoteListHead"
      );


    head.textContent=
      NOTE.mode==="vocab"
      ? "词语 COLLECTION"
      : "杭州话 COLLECTION";


    list.innerHTML="";


    entries.forEach(
      ([id,data],index)=>{

        const obtained=
          isCollected(id);


        const item=
          document.createElement(
            "div"
          );


        item.className=
          "tn-entry";


        if(
          index===
          NOTE.selected
        ){

          item.classList.add(
            "active"
          );

        }


        if(!obtained){

          item.classList.add(
            "locked"
          );

        }


        const number=
          NOTE.mode==="dialect"
          ? data.no
          : index+1;


        item.innerHTML=`

          <div class="tn-number">

            ${String(number)
              .padStart(2,"0")}

          </div>


          <div>

            <div class="tn-word">

              ${
                obtained
                ? data.word
                : "？？？"
              }

            </div>


            <div class="tn-sub">

              ${
                obtained
                ? (
                    NOTE.mode==="vocab"
                    ? data.pinyin
                    : data.meaning
                  )
                : "未発見"
              }

            </div>

          </div>


          <div class="tn-diamond">

            ${
              obtained
              ? "◆"
              : "◇"
            }

          </div>

        `;


        item.addEventListener(
          "click",
          ()=>{

            NOTE.selected=
              index;


            renderList();

          }
        );


        list.appendChild(
          item
        );

      }
    );


    const active=
      list.querySelector(
        ".tn-entry.active"
      );


    if(active){

      active.scrollIntoView({
        block:"nearest"
      });

    }


    if(entries.length){

      const [
        id,
        data
      ]=
        entries[
          NOTE.selected
        ];


      renderDetail(
        id,
        data
      );

    }

  }


  // ============================================================
  // LOCKED DETAIL
  // ============================================================

  function renderLockedDetail(
    id,
    data,
    detail
  ){

    // ----------------------------------------------------------
    // 杭州话 No.20
    // 19語集めるまでは場所を伏せる
    // ----------------------------------------------------------

    if(
      NOTE.mode==="dialect" &&
      data.no===20
    ){

      const count=
        typeof collectedDialect!==
        "undefined"
        ? collectedDialect.length
        : 0;


      if(count<19){

        detail.innerHTML=`

          <div class="tn-locked-detail">

            <div class="tn-lock-mark">
              ？
            </div>


            <div class="tn-unknown-title">
              未発見の杭州话
            </div>


            <div class="tn-unknown-en">
              UNKNOWN DIALECT
            </div>


            <div class="tn-hint-rule">
            </div>


            <div class="tn-hint-title">
              旅のヒント
            </div>


            <div class="tn-hint-text">

              この言葉には、
              まだ出会えないようです。

              <br>

              まずは杭州の街を歩き、
              他の杭州话を集めてみましょう。

            </div>


            <div class="tn-progress-hint">

              杭州话　

              ${Math.min(count,19)}

              / 19

            </div>

          </div>

        `;


        return;

      }


      // --------------------------------------------------------
      // 19語揃った後
      // --------------------------------------------------------

      detail.innerHTML=`

        <div class="tn-locked-detail">

          <div class="tn-lock-mark">
            ？
          </div>


          <div class="tn-unknown-title">
            未発見の杭州话
          </div>


          <div class="tn-unknown-en">
            UNKNOWN DIALECT
          </div>


          <div class="tn-hint-rule">
          </div>


          <div class="tn-hint-title">
            旅のヒント
          </div>


          <div class="tn-hint-area-label">
            DISCOVERY AREA
          </div>


          <div class="tn-hint-area">
            西湖の近く
          </div>


          <div class="tn-hint-mark">
          </div>


          <div class="tn-hint-text">

            杭州话を十分に集めたようです。

            <br>

            西湖の近くにある土産物店を
            訪ねてみましょう。

          </div>


          <div class="tn-new-clue">
            ◆ 新しい手がかりを発見
          </div>

        </div>

      `;


      return;

    }


    // ----------------------------------------------------------
    // 通常の未発見語
    // ----------------------------------------------------------

    const hint=
      getTravelHint(
        data.location
      );


    detail.innerHTML=`

      <div class="tn-locked-detail">

        <div class="tn-lock-mark">
          ？
        </div>


        <div class="tn-unknown-title">

          ${
            NOTE.mode==="vocab"
            ? "未発見の词语"
            : "未発見の杭州话"
          }

        </div>


        <div class="tn-unknown-en">

          ${
            NOTE.mode==="vocab"
            ? "UNKNOWN WORD"
            : "UNKNOWN DIALECT"
          }

        </div>


        <div class="tn-hint-rule">
        </div>


        <div class="tn-hint-title">
          旅のヒント
        </div>


        <div class="tn-hint-area-label">
          DISCOVERY AREA
        </div>


        <div class="tn-hint-area">
          ${hint.area}
        </div>


        <div class="tn-hint-mark">
        </div>


        <div class="tn-hint-text">
          ${hint.text}
        </div>


        <div class="tn-uncollected">
          未収集
        </div>

      </div>

    `;

  }


  // ============================================================
  // DETAIL
  // ============================================================

  function renderDetail(
    id,
    data
  ){

    const detail=
      document.getElementById(
        "travelNoteDetail"
      );


    const obtained=
      isCollected(id);


    if(!obtained){

      renderLockedDetail(
        id,
        data,
        detail
      );

      return;

    }


    if(
      NOTE.mode==="dialect"
    ){

      renderDialectDetail(
        id,
        data,
        detail
      );

    }
    else{

      renderVocabDetail(
        id,
        data,
        detail
      );

    }

  }


  // ============================================================
  // VOCAB DETAIL
  // ============================================================

  function renderVocabDetail(
    id,
    data,
    detail
  ){

    detail.innerHTML=`

      <div class="tn-detail-type">
        词语 / MANDARIN
      </div>


      <div class="tn-detail-word">
        ${data.word}
      </div>


      <div class="tn-detail-pinyin">
        ${data.pinyin || ""}
      </div>


      <div class="tn-detail-meaning">
        ${data.meaning || ""}
      </div>


      <div class="tn-rule">
      </div>


      <div class="tn-section-label">
        例句 / EXAMPLE
      </div>


      <div class="tn-example">

        <div class="tn-example-cn">
          ${data.example || "—"}
        </div>


        ${
          data.examplePinyin
          ? `

            <div class="tn-example-pinyin">
              ${data.examplePinyin}
            </div>

          `
          : ""
        }


        <div class="tn-example-ja">
          ${data.exampleJa || ""}
        </div>

      </div>


      <div class="tn-info-grid">

        <div class="tn-info">

          <div class="tn-info-label">
            CATEGORY
          </div>

          <div class="tn-info-value">
            ${data.category || "—"}
          </div>

        </div>


        <div class="tn-info">

          <div class="tn-info-label">
            DISCOVERED IN
          </div>

          <div class="tn-info-value">
            ${data.location || "—"}
          </div>

        </div>

      </div>

    `;

  }


  // ============================================================
  // DIALECT DETAIL
  // ============================================================

  function renderDialectDetail(
    id,
    data,
    detail
  ){

    const example=
      DIALECT_EXAMPLES[id] || {};


    detail.innerHTML=`

      <div class="tn-detail-type">
        杭州话 / HANGZHOU DIALECT
      </div>


      <div class="tn-detail-word">
        ${data.word}
      </div>


      <div class="tn-detail-pinyin">
        普通话：${data.mandarin || "—"}
      </div>


      <div class="tn-detail-meaning">
        ${data.meaning || ""}
      </div>


      <div class="tn-rule">
      </div>


      <div class="tn-section-label">
        例句 / EXAMPLE
      </div>


      <div class="tn-example">

        <div class="tn-example-cn">
          ${example.cn || "—"}
        </div>


        ${
          example.mandarin
          ? `

            <div class="tn-example-pinyin">
              普通话：${example.mandarin}
            </div>

          `
          : ""
        }


        <div class="tn-example-ja">
          ${example.ja || ""}
        </div>

      </div>


      <div class="tn-info-grid">

        <div class="tn-info">

          <div class="tn-info-label">
            CATEGORY
          </div>

          <div class="tn-info-value">
            ${data.category || "—"}
          </div>

        </div>


        <div class="tn-info">

          <div class="tn-info-label">
            DISCOVERED IN
          </div>

          <div class="tn-info-value">
            ${data.location || "—"}
          </div>

        </div>


        <div class="tn-info">

          <div class="tn-info-label">
            SPEAKER
          </div>

          <div class="tn-info-value">
            ${data.speaker || "—"}
          </div>

        </div>


        <div class="tn-info">

          <div class="tn-info-label">
            RARITY
          </div>

          <div class="tn-info-value">

            ${
              typeof hzStars===
              "function"
              ? hzStars(data.rarity)
              : "★".repeat(
                  data.rarity || 1
                )
            }

          </div>

        </div>

      </div>


      ${
        data.note
        ? `

          <div class="tn-note">

            <div
              class="tn-section-label"
              style="margin-bottom:6px;"
            >
              杭州文化メモ
            </div>

            ${data.note}

          </div>

        `
        : ""
      }

    `;

  }


  // ============================================================
  // KEYBOARD
  // ============================================================

  window.addEventListener(
    "keydown",
    event=>{

      const key=
        event.key.toLowerCase();


      // ========================================================
      // CLOSED
      // ========================================================

      if(!NOTE.open){

        if(key==="l"){

          event.preventDefault();

          event.stopImmediatePropagation();

          toggle();

        }


        return;

      }


      // ========================================================
      // OPEN
      // ========================================================

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key==="l" ||
        key==="escape"
      ){

        close();

        return;

      }


      // --------------------------------------------------------
      // CATEGORY
      // --------------------------------------------------------

      if(
        key==="arrowleft" ||
        key==="a"
      ){

        NOTE.mode=
          NOTE.mode==="vocab"
          ? "dialect"
          : "vocab";


        NOTE.selected=0;

        render();

        return;

      }


      if(
        key==="arrowright" ||
        key==="d"
      ){

        NOTE.mode=
          NOTE.mode==="vocab"
          ? "dialect"
          : "vocab";


        NOTE.selected=0;

        render();

        return;

      }


      const entries=
        getEntries();


      // --------------------------------------------------------
      // UP
      // --------------------------------------------------------

      if(
        key==="arrowup" ||
        key==="w"
      ){

        NOTE.selected=
          Math.max(
            0,
            NOTE.selected-1
          );


        renderList();

        return;

      }


      // --------------------------------------------------------
      // DOWN
      // --------------------------------------------------------

      if(
        key==="arrowdown" ||
        key==="s"
      ){

        NOTE.selected=
          Math.min(
            Math.max(
              0,
              entries.length-1
            ),
            NOTE.selected+1
          );


        renderList();

      }

    },

    true
  );


  // ============================================================
  // PUBLIC
  // ============================================================

  window.openTravelNote=
    open;


  window.closeTravelNote=
    close;


  window.toggleTravelNote=
    toggle;


  window.isTravelNoteOpen=
    function(){

      return NOTE.open;

    };


  // ============================================================
  // INIT
  // ============================================================

  function init(){

    installStyle();

    createUI();

    render();

  }


  if(
    document.readyState===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  }
  else{

    init();

  }


  console.log(
    "杭州探索録 TRAVEL NOTE Ver.1.1 / 探索ヒント対応 loaded"
  );

})();
