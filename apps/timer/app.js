(function(){
  global.WIDGETS = global.WIDGETS || {};

  var timerData = {
    endTime: 0,
    interval: null
  };

  function saveState() {
    require("Storage").writeJSON("timer.json", { endTime: timerData.endTime });
  }

  function loadState() {
    let saved = require("Storage").readJSON("timer.json", 1) || {};
    timerData.endTime = saved.endTime || 0;
  }

  function clearState() {
    require("Storage").erase("timer.json");
    timerData.endTime = 0;
  }

  // Widget icon
  WIDGETS.timer = {
    area: "tr",
    width: 24,
    draw: function() {
      if (timerData.endTime > Date.now()) {
        g.reset();
        g.drawImage(atob("GBgBAAAADgAAgP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Afw=="), this.x, this.y);
      }
    }
  };

  function drawUI() {
    g.clear(1);
    Bangle.loadWidgets();
    Bangle.drawWidgets();

    g.setFont("Vector", 30).setFontAlign(0, 0);
    g.drawString("Timer", g.getWidth()/2, 40);

    let remaining = Math.max(0, timerData.endTime - Date.now());
    let minutes = Math.floor(remaining / 60000);
    let seconds = Math.floor((remaining % 60000) / 1000);

    let text = timerData.endTime > Date.now()
      ? `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      : timerData.setMinutes ? `${timerData.setMinutes}:00` : "0:00";

    g.setFont("Vector", 40);
    g.drawString(text, g.getWidth() / 2, 100);

    g.setFont("6x8");
    if (timerData.endTime > Date.now()) {
      g.drawString("Timer läuft...", g.getWidth()/2, 180);
    } else {
      g.drawString("Touch = +1 Minute", g.getWidth()/2, 180);
      g.drawString("BTN = Start", g.getWidth()/2, 200);
      g.drawString("Swipe = Reset", g.getWidth()/2, 220);
    }
  }

  function startTimer() {
    if (!timerData.setMinutes || timerData.setMinutes <= 0) return;
    timerData.endTime = Date.now() + timerData.setMinutes * 60 * 1000;
    saveState();
    update();
  }

  function stopTimer() {
    clearState();
    if (timerData.interval) clearInterval(timerData.interval);
    timerData.interval = null;
    drawUI();
  }

  function update() {
    if (timerData.interval) clearInterval(timerData.interval);
    timerData.interval = setInterval(() => {
      if (timerData.endTime <= Date.now()) {
        Bangle.buzz(1000);
        stopTimer();
        g.clear();
        g.setFont("Vector", 30).setFontAlign(0, 0);
        g.drawString("⏰ Zeit abgelaufen!", g.getWidth()/2, g.getHeight()/2);
        setTimeout(() => Bangle.load(), 10000);
      } else {
        drawUI();
        WIDGETS.timer.draw();
      }
    }, 1000);
  }

  // === UI Interactions ===
  setWatch(() => {
    if (timerData.endTime > Date.now()) return;
    startTimer();
  }, BTN1, { repeat: false, edge: "rising", debounce: 50 });

  Bangle.on("touch", () => {
    if (timerData.endTime > Date.now()) return;
    timerData.setMinutes = (timerData.setMinutes || 0) + 1;
    drawUI();
  });

  Bangle.on("swipe", () => {
    if (timerData.endTime > Date.now()) return;
    timerData.setMinutes = 0;
    drawUI();
  });

  // === Init ===
  loadState();
  drawUI();
  if (timerData.endTime > Date.now()) update();
})();
