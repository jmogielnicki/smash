function ExtraLife() {
  this.id = 'e'
  this.status = 'inert'
  this.transp = 255;
  this.minTransp = 10;
  this.r = 255;
  this.g = 221;
  this.b = 0;
  this.icon = heartIcon;
  this.description = 'Extra Life!'
  this.initializeFromMaster();

  this.display = function() {
    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      this.displayInertState();
      // Adding some extra stuff since it's a +1 life
      strokeWeight(1);
      stroke(255,255,0)
      fill(this.r, this.g, this.b, 0);
      ellipse(this.location.x, this.location.y, this.size, this.size); 
    }
  }

  this.update = function() {
    this.inertTimer--;
    if (this.status === 'inert' && this.inertTimer < 0) {
      this.turnOff();
    }
  }

  this.turnOff = function() {
    this.status = 'expired'

  }

  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      extraLifeSound.play();
      extraLifeSound2.play();
      this.friend = hero;
      this.friend.numLives++;
      this.turnOff();
    }
  }
}

ExtraLife.prototype = new CircleObject();
ExtraLife.prototype.constructor = ExtraLife;