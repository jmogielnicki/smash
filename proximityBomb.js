function ProximityBomb() {
  this.initializeFromMaster();
  this.status = 'inert'
  this.transp = 255;
  this.minTransp = 10;
  this.startingUpTimer = 80;
  this.explodeTimer = 30;
  blinkTimer = 170;
  this.r = 192;
  this.g = 144;
  this.b = 240;
  this.rOrig = this.r
  this.gOrig = this.g
  this.bOrig = this.b
  this.rActive = 60;
  this.gActive = 60;
  this.bActive = 60;
  this.mass = 20;
  this.icon = bombIcon
  this.description = 'ProximityBomb: once set, will explode if opponent comes within range'
 
  this.display = function() {
    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      this.displayInertState();
    }

    if (this.status === 'startingUp') {
      fill(60, 255)
      ellipse(this.location.x, this.location.y, 10, 10)
    }

    if (this.status === 'active') {
      fill(this.r, this.g, this.b, this.transp)
      strokeWeight(1);
      stroke(this.r, this.g, this.b, 10)
      ellipse(this.location.x, this.location.y, this.size, this.size)
      fill(this.rActive, this.gActive, this.bActive, 255)
      ellipse(this.location.x, this.location.y, 10, 10)
    }
    if (this.status == 'exploding') {
      noStroke();
      fill(this.rOrig, this.gOrig, this.bOrig, this.transp)
      ellipse(this.location.x, this.location.y, this.size, this.size)
    }
  } 
  
  this.update = function() {
    this.inertTimer--;

    if (this.status === 'inert' && this.inertTimer < 0) {
      this.status = 'expired'
    }
    if (this.status == 'startingUp') {
      this.startingUpTimer--;
      if (this.startingUpTimer == 0) {
        activateSound.play();
        startUpSound.stop();
        this.status = 'active';
      }
    }
    if (this.status === 'active') {
      blinkTimer--;
      if (blinkTimer < 10) {
        this.rActive = this.friend.rOrig
        this.gActive = this.friend.gOrig
        this.bActive = this.friend.bOrig
      } else {
        this.rActive = 60
        this.gActive = 60
        this.bActive = 60
      }
      if (blinkTimer < 0) {
        blinkTimer = 200;
      }
    }
    if (this.status == 'exploding') {
      this.transp -= 5;
      this.explodeTimer--;
    }
    if (this.explodeTimer <= 0) {
      this.turnOff();
    }
  }

  this.turnOff = function() {
    this.status = 'expired'
  }
  
  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.status = 'startingUp'
      this.target = opponent;
      this.friend = hero;
      this.size = 200;
      this.transp = 6;
      this.r = this.friend.r
      this.g = this.friend.g
      this.b = this.friend.b
      clickSound.play();
      startUpSound.play();
    }
    if (this.status === 'active') {
      if (this.isIntersecting(this.target) && this.target.hasFireShield === false) {
        this.target.dying();
        explodeSound.play();
        this.transp = 100;
        this.status = 'exploding'
      }
    }
  }
}

ProximityBomb.prototype = new CircleObject();
ProximityBomb.prototype.constructor = ProximityBomb;