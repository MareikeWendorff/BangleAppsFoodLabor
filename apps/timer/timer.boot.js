(function(){
  let timerData = require("Storage").readJSON("timer.json", 1);
  if (!timerData || !timerData.endTime) return;

  if (timerData.endTime <= Date.now()) {
    require("Storage").erase("timer.json");
    Bangle.buzz(1000).then(() => {
      Bangle.buzz(1000);
    });
    setTimeout(() => {
      g.clear();
      g.setFont("Vector", 30).setFontAlign(0, 0);
      g.drawString("⏰ Zeit abgelaufen!", g.getWidth()/2, g.getHeight()/2);
      setTimeout(() => Bangle.load(), 3000);
    }, 1000);
  } else {
    // Recheck every 10 seconds
    setInterval(() => {
      if (Date.now() >= timerData.endTime) {
        require("Storage").erase("timer.json");
        Bangle.buzz(1000).then(() => Bangle.buzz(1000));
        g.clear();
        g.setFont("Vector", 30).setFontAlign(0, 0);
        g.drawString("⏰ Zeit abgelaufen!", g.getWidth()/2, g.getHeight()/2);
        setTimeout(() => Bangle.load(), 3000);
      }
    }, 10000);
  }
})();
