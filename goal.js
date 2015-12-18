function Goal(player, id) {
  var goalPositions = [
    [width - 30, height/2],
    [30, height/2],
  ]
  var redValues = [0, 237, 235, 106]
  var greenValues = [160, 201, 104, 74]
  var blueValues = [176, 81, 65, 60]
  
  this.x = goalPositions[id][0]
  this.y = goalPositions[id][1]
  this.size = 30;
  this.r = player.r;
  this.g = player.g
  this.b = player.b
  
  this.display = function() {
    noStroke;
    strokeWeight(0);
    fill(this.r, this.g, this.b, 255);
    ellipse(this.x, this.y, 15, 40);
  }
}

Goal.prototype = new CircleObject();
Goal.prototype.constructor = Goal;
  