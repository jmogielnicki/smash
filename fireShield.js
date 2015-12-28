function FireShield() {
  this.initializeFromMaster();
  this.status = 'inert'
  this.transp = 255;
  this.minTransp = 10;
  this.activationTimer = 0;
  this.r = 290;
  this.g = 127;
  this.b = 2;
  this.mass = 20;
  this.activeLifeTimer = 200;
  this.icon = 'f'
  this.description = 'Fire Shield: destroys opponent, protects against Fire Sprites'
 
  this.display = function() {
    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      this.displayInertState();
    }
    if (this.status === 'active') {

        this.size = (this.size + this.maxSize)/2;
        this.transp = (this.transp + this.minTransp)/2;  
        this.b+=0.5
      this.activeLifeTimer--;
      if (this.activeLifeTimer < 50) {
        this.transp-= 0.5;
      }
      if (this.activeLifeTimer < 0) {
        this.turnOff();
      }
      if (this.friend.state === 'dying') {
        this.turnOff();
      }
      strokeWeight(3)
      stroke(this.r, this.g, this.b, 255);
      ellipse(this.location.x, this.location.y, this.size, this.size); 
    }
  } 
  
  this.update = function() {
    this.inertTimer--;
    if (this.status === 'inert' && this.inertTimer < 0) {
      this.status = 'expired'
    }
    if (this.status === 'active') {
      this.location.x = this.friend.location.x
      this.location.y = this.friend.location.y
      this.maxSize = this.friend.size + 20
    }
  }

  this.turnOff = function() {
    this.status = 'expired'
    this.friend.hasFireShield = false;
  }
  
  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.status = 'active'
      this.activationTimer = 40;
      this.target = opponent;
      this.friend = hero;
      this.friend.hasFireShield = true;
      this.maxSize = this.friend.size + 20
      fireSound.play();
    }
    if (this.status === 'active') {
      if (this.isIntersecting(this.target) && this.target.hasFireShield === false) {
        this.target.dying();
        fireDeathSound.play();
        this.turnOff();
      }
    }
  }
}

FireShield.prototype = new CircleObject();
FireShield.prototype.constructor = FireShield;