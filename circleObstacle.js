function CircleObstacle(x, y) {
  this.location = createVector(x, y)
  this.velocity = createVector(0, 0)
  this.size = random(50, 100);
  this.mass = (this.size/30);
  this.r = 90;
  this.g = 127;
  this.b = 2;
  this.transp = 15
  this.G = 100;
  // this.xSpeed = random(-0.01,0.01)
  // this.ySpeed = random(-0.4,0.4)
  this.xSpeed = 0
  this.ySpeed = 0
  
  this.description = 'Gravity Orb: obstacle that repels players'
  
  this.display = function() {
    stroke(this.r, this.g, this.b, this.transp+10);
    strokeWeight(2);
    fill(this.r, this.g, this.b, this.transp);
    ellipse(this.location.x, this.location.y, this.size, this.size);
  }
  
  this.update = function() {
    this.location.x += this.xSpeed;
    this.location.y += this.ySpeed;
    if (this.location.y > height) {this.location.y = this.size * -1}
    if (this.location.y + this.size < 0) {this.location.y = height}
  }
  
  this.isIntersecting = function(hero) {
    d = dist(hero.location.x, hero.location.y, this.location.x, this.location.y)
    return d < (hero.size/2 + this.size/2);
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
      strength = (this.G * this.mass * opponent.mass) / (d * d)
      
      // Putting direction and magnitude together
      force.mult(strength)

      return force
    }

  }

}