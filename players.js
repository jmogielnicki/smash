function Player(id, name, headImage, introSound, r, g, b, ouchFace, deathFace) {
  this.id = id;
  this.name = name;
  this.headImage = headImage;
  this.size = 75;
  this.r = r;
  this.g = g;
  this.b = b;
  this.transp = 0;
  this.location = createVector(0,0);
  this.chosen = false;
  this.strokeWeight = 0;
  this.introSound = introSound;
  this.ouchFace = ouchFace;
  this.deathFace = deathFace;
}