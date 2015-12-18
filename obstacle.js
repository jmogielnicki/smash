function Obstacle(x, y) {
  this.location = createVector(x, y)
  this.w = random(5, 15);
  this.h = random(20, 100);
  this.size = this.h;
  // this.xSpeed = random(-0.01,0.01)
  // this.ySpeed = random(-0.4,0.4)
  this.xSpeed = 0
  this.ySpeed = 0
  this.description = 'Obstacle - will kill you if you hit it'
  
  this.display = function() {
    noStroke;
    strokeWeight(0);
    fill(gameR, gameG, gameB, 150);
    rect(this.location.x, this.location.y, this.w, this.h);
  }
  
  this.update = function() {
    this.location.x += this.xSpeed;
    this.location.y += this.ySpeed;
    if (this.location.y > height) {this.location.y = this.h * -1}
    if (this.location.y + this.h < 0) {this.location.y = height}
  }
  this.isIntersecting = function(hero) {
    
  circleDistanceX = abs(hero.location.x - this.x - this.w/2);
  circleDistanceY = abs(hero.location.y - this.y - this.h/2);
 
  if (circleDistanceX > (this.w/2 + hero.size/2)) { return false; }
  if (circleDistanceY > (this.h/2 + hero.size/2)) { return false; }
  if (circleDistanceX <= this.w/2) { return true; }
  if (circleDistanceY <= this.h/2) { return true; }

  cornerDistance = pow(circleDistanceX - this.w/2, 2) + pow(circleDistanceY - this.h/2, 2);
  return cornerDistance <= pow(hero.size/2, 2);

  }
}