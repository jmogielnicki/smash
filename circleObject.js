function CircleObject(){}

CircleObject.prototype.isIntersecting = function(hero) {
  var d = dist(this.location.x, this.location.y, hero.location.x, hero.location.y);
  if(d < ((this.size + hero.size)/2)) {
    return true;
  } else {
    return false;
  }
}

CircleObject.prototype.initializeFromMaster = function() {
  this.inertTimer = 700;
  this.location = createVector(random(gameLEdge + margin, gameREdge - margin), random(gameTEdge + 50,gameBEdge - 50))
  this.size = 25;
}

CircleObject.prototype.displayInertState = function() {
  image(this.icon, this.location.x, this.location.y, this.size*.6, this.size*.6)
  noStroke;
  strokeWeight(1);
  stroke(255,255,255,100)
  fill(this.r, this.g, this.b, 100);
  ellipse(this.location.x, this.location.y, this.size, this.size); 
  fill(this.r, this.g, this.b, 155);
  textSize(18);
  strokeWeight(0);
  noStroke();
  textStyle(NORMAL)
  textAlign(CENTER, CENTER);
  this.inertTimer--;
  if (this.status === 'inert' && this.inertTimer < 0) {
    this.turnOff();
  }
}