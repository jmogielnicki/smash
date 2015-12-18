function SizeChanger(multiple) {
  this.initializeFromMaster();
  this.multiple = multiple;
  this.status = 'inert'
  this.activeLifeTimer = 400;
  if (this.multiple > 1){
    this.r = gameR2
    this.g = gameG2
    this.b = gameB2
    this.icon = '+'
    this.description = 'Expander: Makes you grow temporarily'
  } else {
    this.r = gameR
    this.g = gameG
    this.b = gameB
    this.icon = '-'
    this.description = 'Reducer: Makes you shrink temporarily'
  }
    
  this.display = function() {
    if (this.status === 'inert') {
      this.displayInertState();
    }
  } 
  
  this.update = function() {
    if (this.status === 'active') {
    this.activeLifeTimer--;
    this.friend.sizeChange = true;
    }
    if (this.activeLifeTimer < 0 && this.status === 'active') {
      // debugger
      this.friend.sizeChange = true;
      this.friend.targetSize = this.friend.size/this.multiple;
      this.friend.massMultiplier = 1;
      if (this.multiple > 1) {
        shrinkSound.play()
      } else {
        growSound.play();

      }
      this.friend.growVelocity = .5;
      this.status = 'expired'
    }
  }
  
  
  this.intersectAction = function(hero) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.friend = hero
      this.friend.sizeChange = true;
      this.friend.massMultiplier = this.multiple;
      this.friend.targetSize = this.friend.size * this.multiple;
      this.friend.growVelocity = .5;
      if (this.multiple > 1) {
        growSound.play();
        laughSound.play();
        
      } else {
        shrinkSound.play()
      }
      this.status = 'active'
    }


  }
}

SizeChanger.prototype = new CircleObject();
SizeChanger.prototype.constructor = SizeChanger;