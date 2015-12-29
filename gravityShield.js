function GravityShield() {
  this.initializeFromMaster();
  this.status = 'inert'
  this.transp = 255;
  this.minTransp = 10;
  this.activeTimer = 0;
  this.lifeTimer = 300;
  this.r = 90;
  this.g = 127;
  this.b = 2;
  this.G = 100;
  this.mass = 20;
  this.extraSize = 130;
  this.icon = gravityShieldIcon
  this.description = 'Gravity Shield: repels your opponent'

 
  this.display = function() {

    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      this.displayInertState();
    }
    if (this.status === 'active') {
      this.activeTimer--;
      if (this.activeTimer >= 0) {
        this.transp = (this.transp + this.minTransp)/2;  
      }
      this.size = (this.size + this.maxSize)/2;
      this.lifeTimer--;
      if (this.lifeTimer < 50) {
        this.transp-= 0.5;
      }
      if (this.lifeTimer < 0) {
        this.turnOff()
      }
      if (this.friend.state === 'dying') {
        this.turnOff()
      }
      strokeWeight(3)
      stroke(this.r, this.g, this.b,this.transp+10);
      ellipse(this.location.x, this.location.y, this.size, this.size); 
      ellipse(this.location.x, this.location.y, this.size, this.size); 
    }
  } 
  
  this.update = function() {
    if (this.status === 'active') {
      
      this.location.x = this.friend.location.x
      this.location.y = this.friend.location.y
      this.maxSize = this.friend.size + this.extraSize
    }

  }

  this.turnOff = function() {
    warpSound.setVolume(0);
    this.status = 'expired'
  }
  
  
  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.status = 'active'
      this.activeTimer = 40;
      this.target = opponent;
      this.friend = hero;
      this.maxSize = this.friend.size + this.extraSize
      forceFieldSound.play()
      warpSound.setVolume(0);
      warpSound.loop();
    }
    if (this.status === 'active') {
      if (this.isIntersecting(this.target)) {
        repulseForce = this.repulse(this.target);
        d = dist(hero.location.x, hero.location.y, opponent.location.x, opponent.location.y)
        warpSound.setVolume(map(d, this.size, 0, 0, 1));
        this.target.applyForce(repulseForce)
      } else {
        warpSound.setVolume(0)
      }
    }
  }
  
  
  this.repulse = function(opponent) {
    // Direction of the force
    force = p5.Vector.sub(opponent.location, this.location)
    d = force.mag();
    if (d > this.size/1.5) {
      force.mult(0);
      return force;
    } else {
      // d = constrain(d, 80, 100)
      force.normalize()
      
      // Magnitude of force
      strength = (this.G * this.mass * opponent.mass) / (8000)
      
      // Putting direction and magnitude together
      force.mult(strength)

      return force
    }

  }
}

GravityShield.prototype = new CircleObject();
GravityShield.prototype.constructor = GravityShield;