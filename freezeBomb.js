function FreezeBomb() {

  this.id = 'fb'
  this.status = 'inert'
  this.minTransp = 10;

  this.r = 0;
  this.g = 160;
  this.b = 176;
  this.transp = 200;
  this.fadeOffTimer = 100;
  this.activeLifeTimer = 80;
  this.icon = snowFlakeIcon;
  this.description = 'Freeze Bomb: disables your opponent'
  this.initializeFromMaster();

  this.display = function() {
    fill(this.r, this.g, this.b, 255)
    if (this.status === 'inert') {
      this.displayInertState();
    } else if (this.status === 'active') {
      // fill(this.r, this.g, this.b, this.transp);
      // noStroke();
      // ellipse(this.target.location.x, this.target.location.y, this.target.size+1, this.target.size+1)
    }
  }

  this.update = function() {
    this.inertTimer--;
    if (this.status === 'inert' && this.inertTimer < 0) {
      this.status = 'expired';
    }
    if (this.status === 'active') {
      this.activeLifeTimer--;
      if (this.activeLifeTimer <= 0) {
        this.fadeOff();
      }
      if (this.target.state === 'dying') {
        this.turnOff();
      }
    }
  }

  this.fadeOff = function() {
    if (this.fadeOffTimer < 0) {
      this.turnOff();
    } else {
      this.target.transpTemp -= 1.5;
      this.target.transp += 1;
      this.fadeOffTimer--;
    }
    if (this.fadeOffTimer < 2) {
      this.target.rTemp = 255;
      this.target.gTemp = 255;
      this.target.bTemp = 255;
      this.target.transpTemp = 255;
    }
  }

  this.turnOff = function() {
    this.target.transp = this.target.transpOrig;
    this.target.disabled = false;
    this.target.covered = false;
    shatterSound.play();
    this.status = 'expired';
  }

  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      freezeSound.play();
      this.friend = hero;
      this.target = opponent;
      this.target.transp = 10;
      this.target.disabled = true;
      this.target.covered = true;
      this.target.rTemp = this.r
      this.target.gTemp = this.g
      this.target.bTemp = this.b
      this.target.transpTemp = this.transp

      fill(0,160,176,200);
      ellipse(this.location.x, this.location.y, 1700, 1700)
      this.status = 'active'
    }
  }
}

FreezeBomb.prototype = new CircleObject();
FreezeBomb.prototype.constructor = FreezeBomb;