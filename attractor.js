function Attractor(x, y, xSpeed, ySpeed, mass) {
  this.location = createVector(x, y);
  this.velocity = createVector(xSpeed, ySpeed);
  this.acceleration = createVector(0, 0);
  this.mass = mass;
  this.size = 10 * this.mass
  this.G = 100;
  this.transp = random(5,20);
  this.transpUp = true;

  this.display = function() {
    noStroke();
    fill(200,0,0, this.transp);      

    for (var i = 1; i < 20; i ++) {
      ellipse(this.location.x, this.location.y, this.size/sqrt(i), this.size/sqrt(i)); 
    }
  }
  
  this.update = function() {

    if (this.transp > 50) {
      this.transpUp = false;
    }
    if (this.transp < 2){
      this.transpUp = true;

    }
    if (this.transpUp === true) {
      this.transp += 1;
    } else {
      this.transp -= 1;
    }
  
  }
  this.attract = function(other) {
    // Direction of the force
    force = p5.Vector.sub(this.location,other.location)
    d = force.mag();
    warpSound.setVolume(map(d, this.size, 0, 0, 1))
    if (d > this.size/1.5) {
      force.mult(0);
      return force;
    } else {
      d = constrain(d, 80, 100)
      force.normalize()
      
      // Magnitude of force
      strength = (this.G * this.mass * other.mass) / (d * d)
      
      // Putting direction and magnitude together
      force.mult(strength)

      return force
    }

  }
}
