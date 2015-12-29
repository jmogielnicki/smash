function FreezeBomb() {
  this.initializeFromMaster();
  this.status = 'inert'
  this.minTransp = 10;

  this.r = 0;
  this.g = 160;
  this.b = 176;
  this.transp = 100;
  this.fadeOffTimer = 100;
  this.activeLifeTimer = 100;
  this.icon = snowFlakeIcon;
  this.description = 'Freeze Bomb: disables your opponent'

  this.display = function() {
    fill(this.r, this.g, this.b, 255)
    if (this.status === 'inert') {
      this.displayInertState();
    } else if (this.status === 'active') {
      fill(this.r, this.g, this.b, this.transp);
      noStroke();
      ellipse(this.target.location.x, this.target.location.y, this.target.size+1, this.target.size+1)
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
      this.transp -= 1;
      this.target.transp += 1;
      this.fadeOffTimer--;
    }
  }

  this.turnOff = function() {
    this.target.transp = this.target.transpOrig;
    this.target.freezeBombed = false;
    this.status = 'expired';
  }

  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      freezeSound.play();
      this.friend = hero;
      this.target = opponent;
      this.target.transp = 10;
      this.target.freezeBombed = true;
      fill(0,160,176,200);
      ellipse(this.location.x, this.location.y, 1700, 1700)
      this.status = 'active'
    }
  }
}

FreezeBomb.prototype = new CircleObject();
FreezeBomb.prototype.constructor = FreezeBomb;