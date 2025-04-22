(function(){
  var timerInfo = require("Storage").readJSON("timer.json",1)||{};
  WIDGETS.timer = {
    area: "tr",
    width: 24,
    draw: function() {
      if (timerInfo.endTime && timerInfo.endTime > Date.now()) {
        g.reset();
        g.drawImage(atob("GBgBAAAADgAAgP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Af4D/gP+Afw=="), this.x, this.y);
      }
    }
  };
})();
