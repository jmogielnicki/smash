function Game() {
  var heroes = [];
  var playersForRematch = [];
  var attractors = [];
  var sizeChangers = [];
  var gravityShields = [];
  var fireShields = [];
  var fireSprites = [];
  var extraLives = [];
  var drones = [];
  var obstacles = [];
  var itemLists = [];
  var numObstacles = random(1, 8)
  margin = 200;
  var topSpeed = 2;
  var transp = 50;
  var launching = false;
  var launched = false;
  var circleStrokeW = 500;
  this.won = false;
  var startTimer = 120;
  var gamePaused = true;
  var numLives = 5;
  var itemTimer = 200;
  var itemTimerDecrease = 0;
  // sc = sizeChanger, fs = fireShield, gs = gravityShield, s = fireSprite
  var itemPickList = ['sc', 'sc', 'fs', 'fs', 'gs', 'gs', 's', 's', 'd', 'd', 'e']

  this.setupGame = function(player1, player2) {
    frameRate(gameFrameRate);
    winJingle.stop();
    heroes = [];
    introMusic.stop();
    readyFightSound.play();
    fightMusic.loop();
    canvas = createCanvas(windowWidth, windowHeight - 5);
    canvas.parent('canvasContainer');
    gameLEdge = width / 2 - gameBoardSize / 2
    gameREdge = width / 2 + gameBoardSize / 2
    gameTEdge = height / 2 - gameBoardSize / 2
    gameBEdge = height / 2 + gameBoardSize / 2


    warpSound.loop(0, 1, 0);
    warpSound.setVolume(0);
    heroes[0] = new Hero(player1, 0, numLives);
    heroes[1] = new Hero(player2, 1, numLives);
    playersForRematch[0] = new Hero(player1, 0, numLives);
    playersForRematch[1] = new Hero(player2, 1, numLives);

    // Creating master list so we can easily splice out expired items
    itemLists.push(attractors);
    itemLists.push(sizeChangers);
    itemLists.push(gravityShields);
    itemLists.push(fireShields);
    itemLists.push(fireSprites);
    itemLists.push(obstacles);
    itemLists.push(drones);
    itemLists.push(extraLives);

    for (i = 0; i < int(numObstacles); i++) {
      obstacles[i] = new CircleObstacle(random(gameLEdge + margin, gameREdge - margin), random(gameTEdge + 50, gameBEdge - 50));
    }

    for (i = 0; i < 0; i++) {
      attractors[i] = new Attractor(random(gameLEdge + margin, gameREdge - margin), random(gameTEdge, gameBEdge), 0, 0, 10);
    }

    for (i = 0; i < 0; i++) {
      gravityShields[i] = new GravityShield();
      fireSprites[i] = new FireSprite();
      fireShields[i] = new FireShield();
      drones[i] = new Drone();
      extraLives[i] = new ExtraLife();
    }

    for (i = 0; i < 0; i++) {
      random(0, 1) < 0.9 ? type = 2 : type = .5;
      sizeChangers[i] = new SizeChanger(type);
    }
  }

  this.drawGame = function() {
    startTimer--;
    itemTimer--;
    itemTimerDecrease += 0.01;

    if (itemTimer < 0) {
      this.pickItem();
    }
    background(0, 0, 0, transp)

    if (heroes[0].transp > 0 && heroes[1].transp > 0) {
      heroes[0].repulseBall(heroes[1])
      heroes[1].repulseBall(heroes[0])
    }
    this.drawItems();

    this.drawGameBoard();
    this.drawLives();
    this.cleanupItems()
    if (startTimer > 0) {
      gamePaused = true;
      fill(gameR2, gameG2, gameB2);
      textSize(80);
      textAlign(CENTER, CENTER);
      text('Ready?', width / 2, height / 2)
    } else {
      gamePaused = false;
    }
    if (startTimer < 0 && startTimer > -20) {
      fill(gameR2, gameG2, gameB2);
      textSize(80);
      text('Fight!', width / 2, height / 2)
    }

    // Putting this at the end so that the end screen draws over everything else
    for (var i = heroes.length - 1; i >= 0; i--) {
      hero = heroes[i]
      if (gamePaused) {
        hero.frozen = true;
      }

      if (hero.transp > 0) {
        hero.display();
        hero.keypresses();
        hero.update();

      }
    }

  }

  this.pickItem = function() {
    itemID = itemPickList[int(random(itemPickList.length+1))]
    itemID2 = itemPickList[int(random(itemPickList.length+1))]
    
    if (itemID === 'sc') {
      random(0, 1) < 0.9 ? type = 2 : type = .5;
      sizeChangers.push(new SizeChanger(type));
    } else if (itemID === 'gs') {
      gravityShields.push(new GravityShield())
    } else if (itemID === 'fs') {
      fireShields.push(new FireShield())
    } else if (itemID === 's') {
      fireSprites.push(new FireSprite())
    } else if (itemID === 'd') {
      drones.push(new Drone())
    } else if (itemID === 'e') {
      extraLives.push(new ExtraLife())
    }


    if (random(0,3)>2) {
      if (itemID2 === 'sc') {
        random(0, 1) < 0.9 ? type = 2 : type = .5;
        sizeChangers.push(new SizeChanger(type));
      } else if (itemID2 === 'gs') {
        gravityShields.push(new GravityShield())
      } else if (itemID2 === 'fs') {
        fireShields.push(new FireShield())
      } else if (itemID2 === 's') {
        fireSprites.push(new FireSprite())
      }
    }


    itemTimer = random(300 - itemTimerDecrease, 800 - itemTimerDecrease);
  }

  this.cleanupItems = function() {
    for (i in itemLists) {
      list = itemLists[i]
      for (j in list) {
        item = list[j]
        if (item.status === 'expired') {
          list.splice(j, 1)
        }
      }
    }
  }

  this.drawItems = function() {
   for (var i = attractors.length - 1; i >= 0; i--) {
      attractor = attractors[i]
      attractor.update();
      attractor.display();
      for (var j = heroes.length - 1; j >= 0; j--) {
        if (heroes[j].state != 'died' && attractor.location.dist(heroes[j].location) < attractor.size) {
          attractionForce = attractor.attract(heroes[j])
          heroes[j].applyForce(attractionForce)
            // accelerationForVolume = abs(heroes[j].acceleration.x) + abs(heroes[j].acceleration.y)
        }
      }
    }

    for (var i = obstacles.length - 1; i >= 0; i--) {
      obstacle = obstacles[i]
      obstacle.display();
      obstacle.update();
      for (var j = heroes.length - 1; j >= 0; j--) {

        if (obstacle.isIntersecting(heroes[j])) {
          repulseForce = obstacle.repulse(heroes[j]);
          heroes[j].applyForce(repulseForce)
        }
      }
    }

    for (var i = heroes.length - 1; i >= 0; i--) {
      heroes[i].applyForce(this.calculateDrag(heroes[i], 1))
    }


    for (var i = sizeChangers.length - 1; i >= 0; i--) {
      sizeChangers[i].display();
      sizeChangers[i].update();
      for (var j = heroes.length - 1; j >= 0; j--) {
        sizeChangers[i].intersectAction(heroes[j])
      }
    }

    for (var i = extraLives.length - 1; i >= 0; i--) {
      extraLives[i].display();
      extraLives[i].update();
      for (var j = heroes.length - 1; j >= 0; j--) {
        extraLives[i].intersectAction(heroes[j])
      }
    }

    for (var i = gravityShields.length - 1; i >= 0; i--) {
      gShield = gravityShields[i]
      gShield.update();
      gShield.display();
      for (var j = heroes.length - 1; j >= 0; j--) {
        hero = heroes[j];
        opponent = heroes[abs(j - 1)]
        gShield.intersectAction(hero, opponent);
      }
    }

    for (var i = fireShields.length - 1; i >= 0; i--) {
      fShield = fireShields[i]
      fShield.update();
      fShield.display();
      for (var j = heroes.length - 1; j >= 0; j--) {
        hero = heroes[j];
        opponent = heroes[abs(j - 1)]
        fShield.intersectAction(hero, opponent);
      }
    }
    
    for (var i = fireSprites.length - 1; i >= 0; i--) {
      fSprite = fireSprites[i]
      fSprite.update();
      fSprite.display();
      for (var j = heroes.length - 1; j >= 0; j--) {
        hero = heroes[j];
        opponent = heroes[abs(j - 1)]
        fSprite.intersectAction(hero, opponent);
      }
    }

    for (var i = drones.length - 1; i >= 0; i--) {
      drone = drones[i]
      drone.applyForce(this.calculateDrag(drone, 1));
      drone.update();
      drone.display();

      for (var j = heroes.length - 1; j >= 0; j--) {
        hero = heroes[j];
        opponent = heroes[abs(j - 1)]
        drone.intersectAction(hero, opponent);
      }
    }
  }

  this.drawGameBoard = function() {
    fill(0, 0, 0, 0)
    stroke(gameR, gameG, gameB, 15)
    strokeWeight(circleStrokeW);
    ellipse(width / 2, height / 2, gameBoardSize + circleStrokeW, gameBoardSize + circleStrokeW)
    strokeWeight(5);
    stroke(gameR, gameG, gameB, 255)
    ellipse(width / 2, height / 2, gameBoardSize, gameBoardSize)
  }

  this.drawLives = function() {
    left = heroes[0]
    right = heroes[1]
    strokeWeight(0)
    fill(left.rOrig, left.gOrig, left.bOrig);
    for (var i = 0; i < left.numLives; i++) {
      yPos = (height / 2) - 50 + ((i + 1) * 20)
      ellipse(gameLEdge - 50, yPos, 10, 10)
    }
    fill(right.rOrig, right.gOrig, right.bOrig);
    for (var i = 0; i < right.numLives; i++) {
      yPos = (height / 2) - 50 + ((i + 1) * 20)
      ellipse(gameREdge + 50, yPos, 10, 10)
    }
  }

  // Called on mouseReleased from sketch.js
  this.checkAction = function() {
    if (mouseY > height / 2 + 50 && mouseY < height / 2 + 250) {
      if (mouseX > width / 2 - 150 && mouseX < width / 2) {
        game.won = false;
        spriteSound.stop();
        warpSound.stop();
        droneSound.stop();
        newGame(playersForRematch[0], playersForRematch[1])
        frameRate(gameFrameRate);
      } else if (mouseX > width / 2 && mouseX < width / 2 + 150) {
        // options = new OptionsScreen();
        game = new Game();
        screen = 'setupScreen'
        options.construct();
        frameRate(gameFrameRate);
      }
    } 
  }

  this.decideWinner = function(deadHero) {
    for (i in heroes) {
      hero = heroes[i]
      if (hero != deadHero) {
        winner = hero
      }
    }
    strokeWeight(0)
    rectMode(CORNERS);
    fill(winner.rOrig, winner.gOrig, winner.bOrig, 50)
    rect(0, 0, width, height)
    fill(winner.rOrig, winner.gOrig, winner.bOrig, 255);
    textSize(60);
    textAlign('center')
    text(str(winner.name) + ' Wins!', width / 2, height / 2);
    textSize(24);
    text('Rematch', width / 2 - 100, height / 2 + 150);
    text('New Players', width / 2 + 100, height / 2 + 150);
    frameRate(0);
    fightMusic.stop();
    winSound.play();
    winJingle.play();
    this.won = true;
  }

  this.resetHero = function(resetHero) {
    // Figuring out where opponent is on board
    for (i in heroes) {
      hero = heroes[i]
      if (hero != resetHero) {
        var opponentX = hero.location.x;
        var opponentY = hero.location.y;
      }
    }
    // Put resetHero on other side of board
    if (opponentX > width / 2) {
      resetHero.location.x = gameLEdge + resetHero.size;
    } else {
      resetHero.location.x = gameREdge - 100
    }
    resetHero.location.y = height / 2
    resetHero.r = resetHero.rOrig;
    resetHero.g = resetHero.gOrig;
    resetHero.b = resetHero.bOrig;
    resetHero.velocity.mult(0)
    resetHero.transp = 100;
    resetHero.size = 1;
    resetHero.state = 'initial'
    resetHero.frozen = true;
    resetHero.sizeChange = true;
    resetHero.sizeChangeAmount = resetHero.sizeOrig;
    resetHero.growVelocity = .3;
    resetHero.freezeFrames = 30;
    // growSound.play()
  }

  this.calculateDrag = function(thing, multiplier) {
    drag = thing.velocity.copy()
    speed = drag.mag()
    if (speed < 1) {
      speed = 1
    }
    drag.normalize()
      // Multiplying constant by hero's mass so bigger has more drag and so is steadier
    c = -0.012 * thing.mass * multiplier
    drag.mult(c * speed * speed)
    return drag
  }
}