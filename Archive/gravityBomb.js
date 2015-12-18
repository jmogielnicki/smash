function GravityShield(x, y) {
  this.location = createVector(x, y)
  this.size = 30;
  this.maxSize = 300;
  this.status = 'inert'
  this.transp = 255;
  this.minTransp = 10;
  this.activeTimer = 0;
  this.inertTimer = 200;
  this.r = 90;
  this.g = 127;
  this.b = 2;
  this.G = 100;
  this.mass = 20;
  this.lifeTimer = 500;
 
  this.display = function() {
    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      strokeWeight(1);
      stroke(255,255,255,255)
      ellipse(this.location.x, this.location.y, this.size, this.size); 
      fill(255,255,255,255);
      textSize(18);
      textStyle(NORMAL);
      textAlign(CENTER, CENTER);
      text('g', this.location.x, this.location.y);
    }
    if (this.status === 'active') {
      this.activeTimer--;
      if (this.activeTimer >= 0) {
        this.size = (this.size + this.maxSize)/2;
        this.transp = (this.transp + this.minTransp)/2;  
      }
      this.lifeTimer--;
      if (this.lifeTimer < 50) {
        this.transp-= 0.5;
      }
      if (this.lifeTimer < 0) {
        this.status = 'expired'
      }
      strokeWeight(3)
      stroke(this.r, this.g, this.b,this.transp+10);
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
    }

  }
  
  
  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.status = 'active'
      this.activeTimer = 40;
      this.target = opponent;
      this.friend = hero;
      this.r = hero.rOrig;
      this.g = hero.gOrig;
      this.b = hero.bOrig;
    }
    if (this.status === 'active') {
      if (this.isIntersecting(this.target)) {
        repulseForce = this.repulse(this.target);
        this.target.applyForce(repulseForce)
      }
    }
  }
  
  
  this.repulse = function(opponent) {
    // Direction of the force
    force = p5.Vector.sub(opponent.location, this.location)
    d = force.mag();
    warpSound.setVolume(map(d, this.size, 0, 0, 1))
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