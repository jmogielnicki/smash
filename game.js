function Game() {
  this.heroes = [];
  this.playersForRematch = [];
  this.attractors = [];
  this.sizeChangers = [];
  this.gravityShields = [];
  this.fireShields = [];
  this.proximityBombs = [];
  this.fireSprites = [];
  this.extraLives = [];
  this.drones = [];
  this.freezeBombs = [];
  this.obstacles = [];
  this.itemLists = [];
  this.numObstacles = random(1, 8)
  margin = 200;
  this.transp = 50;
  this.circleStrokeW = 500;
  this.won = false;
  this.startTimer = 120;
  this.gamePaused = true;
  this.numLives = howToPlay.numLives;
  this.itemTimer = 200;
  this.itemTimerDivider = 1;
  this.itemPickList = [];
  this.gameSeconds = 0;




  this.setupGame = function(player1, player2) {


    // Grabbing enabled items from howtoplay screen
    for (var i = 0; i < howToPlay.itemsList.length; i++) {
      item = howToPlay.itemsList[i]
      if (item.enabled == true) {
        this.itemPickList.push(item.id);
      }
    }

    println(this.itemPickList)
    frameRate(gameFrameRate);
    winJingle.stop();
    this.heroes = [];
    introMusic.stop();
    readyFightSound.play();
    fightMusic.loop();
    canvas = createCanvas(windowWidth, windowHeight - 5);
    canvas.parent('canvasContainer');
    gameLEdge = width / 2 - gameBoardSize / 2
    gameREdge = width / 2 + gameBoardSize / 2
    gameTEdge = height / 2 - gameBoardSize / 2
    gameBEdge = height / 2 + gameBoardSize / 2
    switch(itemFrequencyList[itemFrequencyChosen]) {

      case 'Low':
        this.itemTimerMin = 1000;
        this.itemTimerMax = 1300;
        this.itemTimer  = this.itemTimerMin
        break;
      case 'Medium':
        this.itemTimerMin = 600;
        this.itemTimerMax = 900;
        this.itemTimer  = this.itemTimerMin
        break;
      case 'High':
        this.itemTimerMin = 300;
        this.itemTimerMax = 400;
        this.itemTimer  = this.itemTimerMin
        break;
    }



    warpSound.loop(0, 1, 0);
    warpSound.setVolume(0);
    this.heroes[0] = new Hero(player1, 0, this.numLives);
    this.heroes[1] = new Hero(player2, 1, this.numLives);
    this.playersForRematch[0] = new Hero(player1, 0, this.numLives);
    this.playersForRematch[1] = new Hero(player2, 1, this.numLives);

    // Creating master list so we can easily splice out expired items
    this.itemLists.push(this.attractors);
    this.itemLists.push(this.sizeChangers);
    this.itemLists.push(this.gravityShields);
    this.itemLists.push(this.fireShields);
    this.itemLists.push(this.fireSprites);
    this.itemLists.push(this.obstacles);
    this.itemLists.push(this.drones);
    this.itemLists.push(this.extraLives);
    this.itemLists.push(this.freezeBombs);
    this.itemLists.push(this.proximityBombs);

    for (i = 0; i < int(this.numObstacles); i++) {
      this.obstacles[i] = new CircleObstacle(random(gameLEdge + margin, gameREdge - margin), random(gameTEdge + 50, gameBEdge - 50));
    }

    for (i = 0; i < 0; i++) {
      this.attractors[i] = new Attractor(random(gameLEdge + margin, gameREdge - margin), random(gameTEdge, gameBEdge), 0, 0, 10);
    }

    for (i = 0; i < 0; i++) {
      this.gravityShields[i] = new GravityShield();
      this.fireSprites[i] = new FireSprite();
      this.fireShields[i] = new FireShield();
      this.drones[i] = new Drone();
      // this.extraLives[i] = new ExtraLife();
      this.freezeBombs[i] = new FreezeBomb();
      this.proximityBombs[i] = new ProximityBomb();
    }

    for (i = 0; i < 0; i++) {
      random(0, 1) < 0.5 ? type = 2 : type = .5;
      this.sizeChangers[i] = new SizeChanger(type);
    }

  }

  this.drawGame = function() {
    this.gameSeconds += (1/frameRate())
    this.startTimer--;
    this.itemTimer--;

    // After 300 seconds, itemTimerDivider will be 2 and items will come twice as fast
    this.itemTimerDivider = 1 + (this.gameSeconds/300);

    if (this.itemTimer < 0) {
      this.pickItem();
    }
    background(0, 0, 0, this.transp)

    if (this.heroes[0].transp > 0 && this.heroes[1].transp > 0) {
      this.heroes[0].repulseBall(this.heroes[1])
      this.heroes[1].repulseBall(this.heroes[0])
    }


    this.drawGameBoard();
    this.drawLives();
    this.cleanupItems()
    if (this.startTimer > 0) {
      this.gamePaused = true;
      fill(gameR2, gameG2, gameB2);
      textSize(80);
      textAlign(CENTER, CENTER);
      text('Ready?', width / 2, height / 2)
    } else {
      this.gamePaused = false;
    }
    if (this.startTimer < 0 && this.startTimer > -20) {
      fill(gameR2, gameG2, gameB2);
      textSize(80);
      text('Fight!', width / 2, height / 2)
    }
    this.drawItems();

    // Putting this at the end so that the end screen draws over everything else
    for (var i = this.heroes.length - 1; i >= 0; i--) {
      hero = this.heroes[i]
      if (this.gamePaused) {
        hero.frozen = true;
      }

      if (hero.transp > 0) {
        hero.display();
        hero.keypresses();
        hero.update();
      }
    }

    this.checkForWin();
  }

  this.checkForWin = function() {
    for (var i = this.heroes.length - 1; i >= 0; i--) {
      hero = this.heroes[i]
      if (hero.numLives <= 0) {
        this.decideWinner(hero);
      }
    }    
  }

  this.pickItem = function() {
    itemID = this.itemPickList[int(random(this.itemPickList.length))]
    itemID2 = this.itemPickList[int(random(this.itemPickList.length))]
    println(itemID)
    println(itemID2)

    if (itemID === 'scb') {
      this.sizeChangers.push(new SizeChanger(2));
    } else if (itemID === 'scs') {
      this.sizeChangers.push(new SizeChanger(0.5));
    } else if (itemID === 'gs') {
      this.gravityShields.push(new GravityShield())
    } else if (itemID === 'fs') {
      this.fireShields.push(new FireShield())
    } else if (itemID === 's') {
      this.fireSprites.push(new FireSprite())
    } else if (itemID === 'd') {
      this.drones.push(new Drone())
    } else if (itemID === 'e') {
      this.extraLives.push(new ExtraLife())
    } else if (itemID === 'fb') {
      this.freezeBombs.push(new FreezeBomb())
    } else if (itemID === 'pb') {
      this.proximityBombs.push(new ProximityBomb())
    }



    if (random(0,3)>2) {
      if (itemID2 === 'sc') {
        random(0, 1) < 0.9 ? type = 2 : type = .5;
        this.sizeChangers.push(new SizeChanger(type));
      } else if (itemID2 === 'gs') {
        this.gravityShields.push(new GravityShield())
      } else if (itemID2 === 'fs') {
        this.fireShields.push(new FireShield())
      } else if (itemID2 === 's') {
        this.fireSprites.push(new FireSprite())
      }
    }

    this.itemTimer = random(this.itemTimerMin / this.itemTimerDivider, this.itemTimerMax / this.itemTimerDivider);
  }

  this.cleanupItems = function() {
    for (i in this.itemLists) {
      list = this.itemLists[i]
      for (j in list) {
        item = list[j]
        if (item.status === 'expired') {
          list.splice(j, 1)
        }
      }
    }
  }

  this.drawItems = function() {
   for (var i = this.attractors.length - 1; i >= 0; i--) {
      attractor = this.attractors[i]
      attractor.update();
      attractor.display();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        if (this.heroes[j].state != 'died' && attractor.location.dist(this.heroes[j].location) < attractor.size) {
          attractionForce = attractor.attract(this.heroes[j])
          this.heroes[j].applyForce(attractionForce)
            // accelerationForVolume = abs(this.heroes[j].acceleration.x) + abs(this.heroes[j].acceleration.y)
        }
      }
    }

    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      obstacle = this.obstacles[i]
      obstacle.display();
      obstacle.update();
      for (var j = this.heroes.length - 1; j >= 0; j--) {

        if (obstacle.isIntersecting(this.heroes[j])) {
          repulseForce = obstacle.repulse(this.heroes[j]);
          this.heroes[j].applyForce(repulseForce)
        }
      }
    }

    for (var i = this.heroes.length - 1; i >= 0; i--) {
      this.heroes[i].applyForce(this.calculateDrag(this.heroes[i], 1))
    }


    for (var i = this.sizeChangers.length - 1; i >= 0; i--) {
      this.sizeChangers[i].display();
      this.sizeChangers[i].update();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        this.sizeChangers[i].intersectAction(this.heroes[j])
      }
    }

    for (var i = this.extraLives.length - 1; i >= 0; i--) {
      this.extraLives[i].display();
      this.extraLives[i].update();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        this.extraLives[i].intersectAction(this.heroes[j])
      }
    }

    for (var i = this.gravityShields.length - 1; i >= 0; i--) {
      gShield = this.gravityShields[i]
      gShield.update();
      gShield.display();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        hero = this.heroes[j];
        opponent = this.heroes[abs(j - 1)]
        gShield.intersectAction(hero, opponent);
      }
    }


    for (var i = this.fireSprites.length - 1; i >= 0; i--) {
      fSprite = this.fireSprites[i]
      fSprite.update();
      fSprite.display();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        hero = this.heroes[j];
        opponent = this.heroes[abs(j - 1)]
        fSprite.intersectAction(hero, opponent);
      }


    }

    for (var i = this.drones.length - 1; i >= 0; i--) {
      drone = this.drones[i]
      drone.applyForce(this.calculateDrag(drone, 1));
      drone.update();
      drone.display();

      for (var j = this.heroes.length - 1; j >= 0; j--) {
        hero = this.heroes[j];
        opponent = this.heroes[abs(j - 1)]
        drone.intersectAction(hero, opponent);
      }
    }

    for (var i = this.freezeBombs.length - 1; i >= 0; i--) {
      fBomb = this.freezeBombs[i]
      fBomb.update();
      fBomb.display();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        hero = this.heroes[j];
        opponent = this.heroes[abs(j - 1)]
        fBomb.intersectAction(hero, opponent);
      }
    }

    for (var i = this.proximityBombs.length - 1; i >= 0; i--) {
      pBomb = this.proximityBombs[i]
      pBomb.update();
      pBomb.display();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        hero = this.heroes[j];
        opponent = this.heroes[abs(j - 1)]
        pBomb.intersectAction(hero, opponent);
      }

      // this.fireSprites and this.drones explode proximity bombs
      if (pBomb.status == 'active') {
        for (var k = this.fireSprites.length - 1; k>=0; k--) {
          fSprite = this.fireSprites[k];
          if (fSprite.status == 'active' && fSprite.friend !== pBomb.friend && pBomb.isIntersecting(fSprite)) {
            pBomb.status = 'exploding'
            pBomb.transp = 100;
            explodeSound.play();
            fSprite.turnOff();
          } 
        }

        for (var l = this.drones.length - 1; l>=0; l--) {
          drone = this.drones[l];
          if (drone.status == 'active' && drone.friend !== pBomb.friend && pBomb.isIntersecting(drone)) {
            pBomb.status = 'exploding'
            pBomb.transp = 100;
            explodeSound.play();
            drone.turnOff();
          } 
        }
      }


    }
    for (var i = this.fireShields.length - 1; i >= 0; i--) {
      fShield = this.fireShields[i]
      fShield.update();
      fShield.display();
      for (var j = this.heroes.length - 1; j >= 0; j--) {
        hero = this.heroes[j];
        opponent = this.heroes[abs(j - 1)]
        fShield.intersectAction(hero, opponent);
      }
    }
  }

  this.drawGameBoard = function() {
    fill(0, 0, 0, 0)
    stroke(gameR, gameG, gameB, 15)
    strokeWeight(this.circleStrokeW);
    ellipse(width / 2, height / 2, gameBoardSize + this.circleStrokeW, gameBoardSize + this.circleStrokeW)
    strokeWeight(5);
    stroke(gameR, gameG, gameB, 255)
    ellipse(width / 2, height / 2, gameBoardSize, gameBoardSize)
  }

  this.drawLives = function() {
    left = this.heroes[0]
    right = this.heroes[1]
    strokeWeight(0)
    fill(left.rOrig, left.gOrig, left.bOrig);
    for (var i = 0; i < left.numLives; i++) {
      if (i <= 4) {
        xPos = gameLEdge - 40
        columnIndex = i;
      } else {
        xPos = gameLEdge - 60
        columnIndex = i - 5
      }
      yPos = (height / 2) - 50 + ((columnIndex + 1) * 20)
      ellipse(xPos, yPos, 10, 10)
    }
    fill(right.rOrig, right.gOrig, right.bOrig);
    for (var i = 0; i < right.numLives; i++) {
      if (i <= 4) {
        xPos = gameREdge + 40
        columnIndex = i;
      } else {
        xPos = gameREdge + 60
        columnIndex = i - 5
      }
      yPos = (height / 2) - 50 + ((columnIndex + 1) * 20)
      ellipse(xPos, yPos, 10, 10)
    }
  }

  // Called on mouseReleased from sketch.js
  this.checkAction = function() {

    if (rematchButton.clicked()) {
      game.won = false;
      spriteSound.stop();
      warpSound.stop();
      droneSound.stop();
      newGame(this.playersForRematch[0], this.playersForRematch[1])
      frameRate(gameFrameRate); 
    } else if (newPlayersButton.clicked()) {
      game = new Game();
      screen = 'setupScreen'
      options.construct();
      frameRate(gameFrameRate);
    } else if (changeItemsButton.clicked()) {
      game = new Game();
      screen = 'howToPlayScreen'
      howToPlay.construct();
      frameRate(gameFrameRate);
    }
  }

  this.decideWinner = function(deadHero) {
    for (i in this.heroes) {
      hero = this.heroes[i]
      if (hero != deadHero) {
        winner = hero
      }
    }
    this.buttonY = height / 2 + 150
    rematchButton = new Button(width / 2 - 150, this.buttonY, 120, 60, 'Rematch', 18, winner.rOrig, winner.gOrig, winner.bOrig)
    newPlayersButton = new Button(width / 2, this.buttonY, 120, 60, 'New Players', 18, winner.rOrig, winner.gOrig, winner.bOrig)
    changeItemsButton = new Button(width / 2 + 150, this.buttonY, 120, 60, 'Change Items', 18, winner.rOrig, winner.gOrig, winner.bOrig)

    strokeWeight(0)
    rectMode(CORNERS);
    fill(winner.rOrig, winner.gOrig, winner.bOrig, 50)
    rect(0, 0, width, height)
    fill(winner.rOrig, winner.gOrig, winner.bOrig, 255);
    textSize(60);
    textFont(myFont)
    textAlign('center')
    text(str(winner.name) + ' Wins!', width / 2, height / 2);
    rematchButton.display();
    newPlayersButton.display();
    changeItemsButton.display();
    frameRate(0);
    fightMusic.stop();
    winSound.play();
    winJingle.play();
    this.won = true;
  }

  this.resetHero = function(resetHero) {
    // Figuring out where opponent is on board
    for (i in this.heroes) {
      hero = this.heroes[i]
      if (hero != resetHero) {
        var opponentX = hero.location.x;
        var opponentY = hero.location.y;
      }
    }
    // Put resetHero on other side of board
    if (opponentX > width / 2) {
      resetHero.location.x = gameLEdge + 100;
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