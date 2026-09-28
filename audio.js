/* =========================================================
   杭州探索録 - 武林夜市
   AUDIO SYSTEM Ver.1
========================================================= */

const GAME_AUDIO = {
  bgm: null,
  started: false,
  volume: 0.30
};

function startBGM() {

  // すでに再生開始済みなら何もしない
  if (GAME_AUDIO.started) return;

  // 初回だけAudioを作る
  if (!GAME_AUDIO.bgm) {
    GAME_AUDIO.bgm = new Audio(
      "assets/audio/wulin-night.mp3"
    );

    GAME_AUDIO.bgm.loop = true;
    GAME_AUDIO.bgm.volume = GAME_AUDIO.volume;
  }

  GAME_AUDIO.bgm.play()
    .then(() => {
      GAME_AUDIO.started = true;
      console.log("武林夜市 BGM START");
    })
    .catch(error => {
      console.log("BGMをまだ再生できません:", error);
    });
}

function stopBGM() {

  if (!GAME_AUDIO.bgm) return;

  GAME_AUDIO.bgm.pause();
  GAME_AUDIO.bgm.currentTime = 0;

  GAME_AUDIO.started = false;
}

function setBGMVolume(value) {

  GAME_AUDIO.volume =
    Math.max(0, Math.min(1, value));

  if (GAME_AUDIO.bgm) {
    GAME_AUDIO.bgm.volume = GAME_AUDIO.volume;
  }
}
