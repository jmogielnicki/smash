function Hero(player, id, numLives) {
  var heroPositions = [
    [gameLEdge + 50, height / 2],
    [gameREdge - 50, height / 2]
  ]

  this.growAmount = 0;
  this.growVelocity = 0;
  this.id = id;
  this.playerId = player.id
  this.name = player.name;
  this.fact = player.fact;
  this.numLives = numLives;
  this.x = heroPositions[this.id][0]
  this.y = heroPositions[this.id][1]
  this.sizeChange = false;
  this.collisionSound = ballHitSound;

  this.headImage = player.headImage;

  // This frozen does not work for freezeBomb, so using a different variable
  this.frozen = false;
  this.freezeFrames = 0;

  this.disabled = false;
  this.location = createVector(this.x, this.y);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.description = 'The hero - player 1 moves with asdw, \nplayer 2 with arrow keys.'

  this.sizeOrig = 50
  this.size = this.sizeOrig;
  this.G = 10000
  this.massMultiplier = 1;
  this.targetSize = this.size;
  constrain(this.size, 5, 100)
    // Hero states (initial, launching, launched, won, dead)
  this.state = 'initial';
  this.rOrig = player.r
  this.gOrig = player.g
  this.bOrig = player.b
  this.r = player.r
  this.g = player.g
  this.b = player.b

  // temp colors for when covered (e.g. by freezebomb)
  this.rTemp = player.r
  this.gTemp = player.g
  this.bTemp = player.b
  this.transpTemp = 0;

  this.transp = 80;
  this.transpOrig = this.transp;
  this.hasFireShield = false;
  this.covered = false;

  this.display = function() {
    noStroke;
    strokeWeight(0);
    fill(this.r, this.g, this.b, this.transp);
    image(this.headImage, this.location.x, this.location.y, this.size, this.size)
    ellipse(this.location.x, this.location.y, this.size, this.size);
    if (this.covered) {
      this.covering();
    }
  }

  this.update = function() {
    this.mass = (this.size / 30) * this.massMultiplier;

    // Only move players if not frozen
    if (this.frozen === false) {
      this.velocity.add(this.acceleration);
      // this.velocity.limit(5)
      this.location.add(this.velocity);
    }

    // Kill player if outside arena
    if (dist(this.location.x, this.location.y, width / 2, height / 2) > gameBoardSize / 2 - (this.size / 2)) {
      this.dying();
    }

    // Make them fade if dying
    if (this.state === 'dying') {
      this.transp = this.transp - 4;
    }

    // Call them dead when faded away
    if (this.transp <= 0) {
      this.dead();
    }

    // Change size if they should
    if (this.sizeChange === true) {
      this.grow(this.targetSize, this.growVelocity)
    }
    // Dealing with frozen players
    if (this.frozen === true) {
      this.freezeFrames--;
    }
    if (this.freezeFrames <= 0) {
      this.frozen = false;
    }

    // Wiping out acceleration so that we can add the forces back in in applyForce function
    this.acceleration.mult(0)
    
    if(this.hasFireShield === true) {
      this.collisionSound = fireSound;
    } else {
      this.collisionSound = ballHitSound;
    }

  }

  // So that items can apply a covering to the hero
  this.covering = function() {
    noStroke;
    strokeWeight(0);
    fill(this.rTemp, this.gTemp, this.bTemp, this.transpTemp);
    ellipse(this.location.x, this.location.y, this.size+1, this.size+1);
  }

  this.grow = function(targetSize, seconds) {
    // Calculate amount to add per frame
    this.size = (this.size+targetSize)/2;
    if ((this.size+targetSize)/2 < 0.01) {
      this.sizeChange = false;
    }

  }

  // Trying alternative way to have balls collide and repulse each other
  this.repulseAlt = function(opponent, friend) {
    // Direction of the force
    force = p5.Vector.sub(opponent.location, friend.location)
    d = force.mag();
    if (d < friend.size / 2 + opponent.size / 2) {
      // d = constrain(d, 80, 100)
      force.normalize()
      
      // Magnitude of force
      strength = (friend.G * friend.mass * opponent.mass) / (d*d)
      
      // Putting direction and magnitude together
      force.mult(strength)

      opponent.applyForce(force)
    }
  }
  
  this.repulseBall = function(other) {
    if (this.state != 'dying' && other.state != 'dying') {
      // get distances between the balls components
      bVect = p5.Vector.sub(other.location, this.location);

      // calculate magnitude of the vector separating the balls
      bVectMag = bVect.mag();

      if (bVectMag < this.size / 2 + other.size / 2) {
        // this.repulseAlt(other, this)
        // this.repulseAlt(this, other)
        // get angle of bVect
        var theta = bVect.heading();
        // precalculate trig values
        var sine = sin(theta);
        var cosine = cos(theta);

        /* bTemp will hold rotated ball positions. You 
         just need to worry about bTemp[1] position*/
        bTemp = [
          new p5.Vector(), new p5.Vector()
        ];

        /* this ball's position is relative to the other
         so you can use the vector between them (bVect) as the 
         reference point in the rotation expressions.
         bTemp[0].position.x and bTemp[0].position.y will initialize
         automatically to 0.0, which is what you want
         since b[1] will rotate around b[0] */
        bTemp[1].x = cosine * bVect.x + sine * bVect.y;
        bTemp[1].y = cosine * bVect.y - sine * bVect.x;

        // rotate Temporary velocities
        vTemp = [
          new p5.Vector(), new p5.Vector()
        ];

        vTemp[0].x = cosine * this.velocity.x + sine * this.velocity.y;
        vTemp[0].y = cosine * this.velocity.y - sine * this.velocity.x;
        vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
        vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

        /* Now that velocities are rotated, you can use 1D
         conservation of momentum equations to calculate 
         the final velocity along the x-axis. */
        vFinal = [
          new p5.Vector(), new p5.Vector()
        ];

        // final rotated velocity for b[0]
        vFinal[0].x = ((this.mass - other.mass) * vTemp[0].x + 2 * other.mass * vTemp[1].x) / (this.mass + other.mass);
        vFinal[0].y = vTemp[0].y;

        // final rotated velocity for b[0]
        vFinal[1].x = ((other.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) / (this.mass + other.mass);
        vFinal[1].y = vTemp[1].y;

        // hack to avoid clumping
        // Jm added "*2" which seems to have fixed clumping issue that was still persisting
        bTemp[0].x += vFinal[0].x*4;
        bTemp[1].x += vFinal[1].x*4;

        /* Rotate ball positions and velocities back
         Reverse signs in trig expressions to rotate 
         in the opposite direction */
        // rotate balls
        bFinal = [
          new p5.Vector(), new p5.Vector()
        ];

        bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
        bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
        bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
        bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

        // update balls to screen position
        other.location.x = this.location.x + bFinal[1].x;
        other.location.y = this.location.y + bFinal[1].y;

        this.location.add(bFinal[0]);

        // update velocities
        // JM adding end part: (*(2/this.mass)

        this.velocity.x = (cosine * vFinal[0].x - sine * vFinal[0].y) * (3.5 / this.mass);
        this.velocity.y = (cosine * vFinal[0].y + sine * vFinal[0].x) * (3.5 / this.mass);
        other.velocity.x = (cosine * vFinal[1].x - sine * vFinal[1].y) * (3.5 / other.mass);
        other.velocity.y = (cosine * vFinal[1].y + sine * vFinal[1].x) * (3.5 / other.mass);
        velocityDelta = (abs(this.velocity.x + this.velocity.y) + abs(other.velocity.x + other.velocity.y))

        this.collisionSound.setVolume(map(velocityDelta, 0, 14, 0.1, 1));
        this.collisionSound.play();
      }
    }
  }

  this.dead = function() {
    this.numLives = this.numLives - 1;
    this.size = this.sizeOrig;
    this.targetSize = this.size;
    this.disabled = false;
    if (this.numLives > 0) {
      game.resetHero(this)
    }
  }


  this.dying = function() {
    if (this.state != 'dying') {
      this.state = 'dying'
      deathSound.play();
    }
    this.disabled = true;
    this.r = 250;
    this.g = 20;
    this.b = 20;

  }

  this.won = function() {
    this.state = 'won'
  }

  // Newton's 2nd law
  this.applyForce = function(force) {
    f = force.copy()
    f.div(this.mass)
    this.acceleration.add(f)
  }

  this.keypresses = function() {
    if (this.disabled === false) {
      if (this.velocity > 5) {
        forceAmount = 0
      } else {
        forceAmount = this.mass / 4;
      }

      leftForce = createVector(forceAmount * -1, 0)
      rightForce = createVector(forceAmount, 0)
      upForce = createVector(0, forceAmount * -1)
      downForce = createVector(0, forceAmount)
      if ((keyIsDown(LEFT_ARROW) && this.id === 1) || (keyIsDown(65) && this.id === 0)) {
        this.applyForce(leftForce)
      }
      if ((keyIsDown(RIGHT_ARROW) && this.id === 1) || (keyIsDown(68) && this.id === 0)) {
        this.applyForce(rightForce)
      }
      if ((keyIsDown(DOWN_ARROW) && this.id === 1) || (keyIsDown(83) && this.id === 0)) {
        this.applyForce(downForce)
      }
      if ((keyIsDown(UP_ARROW) && this.id === 1) || (keyIsDown(87) && this.id === 0)) {
        this.applyForce(upForce)
      }
    }
  }
}