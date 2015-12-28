function Drone() {
  this.initializeFromMaster();
  this.status = 'inert'
  this.transp = 10;
  this.minTransp = 10;
  this.activationTimer = 0;
  this.mass = (this.size / 30) 

  // Location is in parent object
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);

  this.r = 100;
  this.g = 100;
  this.b = 100;
  this.activeLifeTimer = 800;
  this.icon = 'd'
  this.description = 'Drone: hones in on target and tries to push out of ring'

  this.display = function() {
    fill(this.r, this.g, this.b, this.transp)
    if (this.status === 'inert') {
      this.displayInertState();
    }
    if (this.status === 'active') {
      stroke(120,120,120);
      strokeWeight(2);
      this.size = 30
      fill(100,100,100, 180)
      image(this.headImage, this.location.x, this.location.y, this.size, this.size)
      ellipse(this.location.x, this.location.y, this.size, this.size)
    }
  }

  this.update = function() {
    this.inertTimer--;
    if (this.status === 'inert' && this.inertTimer < 0) {
      this.status = 'expired'
    }
    if (this.status === 'active') {
      this.rocketPower();
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);

      if (this.activeLifeTimer < 0 || this.target.state === 'dying') {
        this.turnOff();
      }
    }
    // Wiping out acceleration so it can be added in again next frame.
    this.acceleration.mult(0)

    this.activeLifeTimer--;
  }

  this.rocketPower = function() {
    var forceAmount;
    if (this.velocity > 1) {
        forceAmount = 0
      } else {
        forceAmount = this.mass/3;
      }
    rocketForce = p5.Vector.sub(this.target.location, this.location)
    rocketForce.normalize();
    rocketForce.mult(forceAmount);
    this.applyForce(rocketForce);
  }

  this.applyForce = function(force) {
    f = force.copy()
    f.div(this.mass)
    this.acceleration.add(f)
  }

  this.turnOff = function() {
    droneSound.stop();
    this.status = 'expired'
  }

  this.intersectAction = function(hero, opponent) {
    if (this.isIntersecting(hero) && this.status === 'inert') {
      this.status = 'active'
      droneSound.loop();
        // this.activationTimer = 40;
      this.target = opponent;
      this.friend = hero;
      this.headImage = this.friend.headImage;
    }
    if (this.status === 'active') {
      if (this.isIntersecting(this.target)) {
        if (this.target.hasFireShield === false) {
          this.repulseBall(this.target);
        } else if (this.target.hasFireShield === true) {
          fireSound.play();
          this.turnOff();
        }
      }
    }
  }

  this.repulseBall = function(other) {
    if (this.state != 'expired' && other.state != 'dying') {
      // get distances between the balls components
      bVect = p5.Vector.sub(other.location, this.location);

      // calculate magnitude of the vector separating the balls
      bVectMag = bVect.mag();

      if (bVectMag < this.size / 2 + other.size / 2) {

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

        ballHitSound.setVolume(map(velocityDelta, 0, 14, 0.1, 1));
        ballHitSound.play();
      }
    }
  }

}

Drone.prototype = new CircleObject();
Drone.prototype.constructor = Drone;