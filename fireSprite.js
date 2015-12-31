function FireSprite() {
  this.id = 's'

  this.status = 'inert'
  this.transp = 255;
  this.minTransp = 10;
  this.activationTimer = 0;
  this.perlinXStartTime = random(0, 10000);
  this.perlinYStartTime = random(0, 10000);
  this.spriteXSpeed = random(0.005, 0.02);
  this.spriteYSpeed = random(0.0005, 0.008);

  this.r = 255;
  this.g = 94;
  this.b = 170;
  this.bugRange = 1;
  this.maxBugRange = 200;
  this.activeLifeTimer = 400;
  this.icon = spriteIcon;
  this.description = 'Fire Sprite: flies around & kills opponent if hit'
  this.initializeFromMaster();

  this.display = function() {
    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      this.displayInertState();
    }
    if (this.status === 'active') {
      stroke(255,255,255);
      strokeWeight(1);
      this.size = 12
      fill(this.friend.r, this.friend.g, this.friend.b, 255)
      ellipse(this.location.x, this.location.y, this.size, this.size)
    }
  }

  this.update = function() {
    this.inertTimer--;
    if (this.status === 'inert' && this.inertTimer < 0) {
      this.status = 'expired'
    }
    if (this.status === 'active') {
      this.anchorX = (this.location.x + width / 2) / 2
      this.anchorY = (this.location.y + height / 2) / 2
      this.perlinXValue = noise(this.perlinXStartTime);
      this.perlinYValue = noise(this.perlinYStartTime);
      this.location.x = map(this.perlinXValue, 0, 1, this.anchorX - this.bugRange, this.anchorX + this.bugRange);
      this.location.y = map(this.perlinYValue, 0, 1, this.anchorY - this.bugRange, this.anchorY + this.bugRange);
      this.perlinXStartTime += 0.015
      this.perlinYStartTime += 0.015
      this.activeLifeTimer--;
      if (this.activeLifeTimer < 0) {
        this.turnOff();
      }
      if (this.bugRange < this.maxBugRange) {
        this.bugRange = (this.bugRange) * 1.2
      } else {
        this.bugRange = this.maxBugRange;
      }
    }
  }

  this.adjustAnchor = function() {

  }

  this.turnOff = function() {
    spriteSound.stop();
    this.status = 'expired'

  }

  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.status = 'active'
        // this.activationTimer = 40;
      this.target = opponent;
      this.friend = hero;
      fireSound.play();
      spriteSound.loop();
    }
    if (this.status === 'active') {
      if (this.isIntersecting(this.target)) {
        if (this.target.hasFireShield === false) {
          this.target.dying();
        }
        fireDeathSound.play();
        this.turnOff();
      }
    }
  }
}

FireSprite.prototype = new CircleObject();
FireSprite.prototype.constructor = FireSprite;