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
  this.enabled = true;
  this.inertTransp = 120;
  this.rOrig = this.r
  this.gOrig = this.g
  this.bOrig = this.b
  this.inertStrokeTransp = 100;

  this.xRandom = random(gameLEdge + margin, gameREdge - margin)
  this.yRandom = random(gameTEdge + 50,gameBEdge - 50)
  if (screen === 'gameScreen') {
     for (var i = game.heroes.length - 1; i >= 0; i--) {
      hero = game.heroes[i]
      while (dist(this.xRandom, this.yRandom, hero.location.x, hero.location.y) < 100) {
        this.xRandom = random(gameLEdge + margin, gameREdge - margin)
        this.yRandom = random(gameTEdge + 50,gameBEdge - 50)
      }
    }   
  }

  this.inertTimer = 700;
  this.location = createVector(this.xRandom, this.yRandom)
  this.size = 25;
}

CircleObject.prototype.displayInertState = function() {
  image(this.icon, this.location.x, this.location.y, this.size*.6, this.size*.6)
  noStroke;
  strokeWeight(1);
  stroke(255,255,255,this.inertStrokeTransp)
  fill(this.r, this.g, this.b, this.inertTransp);
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