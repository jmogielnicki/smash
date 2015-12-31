function HowToPlayScreen() {

  this.itemsList = [];
  // this.itemsList.push(new Hero(players[0], 0, 1))
  this.itemsList.push(new FireShield())
  this.itemsList.push(new ProximityBomb())
  this.itemsList.push(new GravityShield(20, 1))
  this.itemsList.push(new SizeChanger(2))
  this.itemsList.push(new SizeChanger(.3))
  this.itemsList.push(new FireSprite())
  this.itemsList.push(new Drone())
  this.itemsList.push(new FreezeBomb())
  this.itemsList.push(new ExtraLife())
  this.numLives = 5;




  this.construct = function() {
    frameRate(60)
    canvas = createCanvas(windowWidth, windowHeight - 5);
    canvas.parent('canvasContainer');
    gameLEdge = width / 2 - gameBoardSize / 2
    gameREdge = width / 2 + gameBoardSize / 2
    gameTEdge = height / 2 - gameBoardSize / 2
    gameBEdge = height / 2 + gameBoardSize / 2
    this.columnOneX = width / 2 - 220
    this.columnTwoX = width / 2 + 40
    this.itemFreqButtonY = height / 2 + 160

    choosePlayersButton = new Button(width / 2, height / 2 + 230, 120, 50, 'Choose Players', 16, gameR2, gameG2, gameB2)
    frequencyButton = new Button(width / 2 - 50, this.itemFreqButtonY, 90, 20, String(itemFrequencyList[itemFrequencyChosen]), 12, gameR2, gameG2, gameB2)
    livesUpButton = new Button(width / 2 + 150, this.itemFreqButtonY, 20, 20, '+', 12, gameR2, gameG2, gameB2)
    livesDownButton = new Button(livesUpButton.location.x - 40, this.itemFreqButtonY, 20, 20, '-', 12, gameR2, gameG2, gameB2)
  }

  this.animate = function() {

    background(0, 0, 0, 50);
    textFont("Georgia")
    textStyle(BOLD)
    strokeWeight(0)
    fill(gameR, gameG, gameB)
    textAlign(CENTER);
    textSize(36);
    text("Objective", width / 2, height / 2 - 220)
    textSize(14);
    fill(180, 180, 180);
    textFont("Georgia")
    text("Knock your opponent out of the ring, or destroy them \nwith an item, and they'll lose a life.  If your opponent \nloses all of their lives, you win!", width / 2, height / 2 - 180)
    imageMode(CENTER)
    textSize(18);
    fill(gameR2, gameG2, gameB2)
    text("Items (click to disable)", width / 2, height / 2 - 90)

    choosePlayersButton.display();
    frequencyButton.display();
    livesUpButton.display();
    livesDownButton.display();
    fill(180, 180, 180);
    text(String(this.numLives), livesUpButton.location.x - 20, livesUpButton.location.y)
    textSize(12);
    textAlign(RIGHT, CENTER)
    fill(180, 180, 180);
    text('Item Frequency:', width/2 - 110, this.itemFreqButtonY)
    textAlign(LEFT, CENTER)
    text('# Lives: ', this.columnTwoX, this.itemFreqButtonY)
    textFont("Georgia")


    for (i in this.itemsList) {
      item = this.itemsList[i]

      if (i <= 4) {
        item.location.x = this.columnOneX
        numInList = i;
      } else {
        item.location.x = this.columnTwoX
        numInList = i - 5
      }

      itemYPos = ((height / 2) - 75) + (numInList * 40) + item.size

      item.location.y = itemYPos
      item.inertTimer = 100000000
      item.display();
      noStroke();
      itemDescription = item.description
      textSize(12);
      textAlign(LEFT, CENTER)
      fill(180, 180, 180);
      rectMode(CORNER);
      textBoxHeight = 30;

      text(itemDescription, item.location.x + 25, itemYPos - textBoxHeight/2, 200, textBoxHeight)

      if (item.enabled == true) {

      } else {
        fill(100,100,100,210)
        stroke(100,100,100,210)
        ellipse(item.location.x, item.location.y, item.size+1, item.size+1)
      }
    }

    game.drawGameBoard();
  }

  this.checkAction = function() {
    for (i in this.itemsList) {
      item = this.itemsList[i]
      if (dist(mouseX, mouseY, item.location.x, item.location.y) < item.size/2) {
        if (item.enabled) {
          beepDeselectSound.play();
          item.enabled = false;
        } else {
          beepSelectSound.play();
          item.enabled = true;
        }
      }
    }

    if (choosePlayersButton.clicked()) {
      screen = 'setupScreen'
      options.construct();
    } 
    if (livesUpButton.clicked() && livesUpButton.active == true) {
      this.numLives++;

    } 
    if (livesDownButton.clicked() && livesDownButton.active == true) {
      this.numLives--;
    } 

    if (this.numLives >= 10) {
      livesUpButton.active = false;
    } else {
      livesUpButton.active = true;
    }

    if (this.numLives <= 1) {
      livesDownButton.active = false;
    } else {
      livesDownButton.active = true;
    }

    if (frequencyButton.clicked()) {
      clickSelectSound.play();
      itemFrequencyChosen++;
      if (itemFrequencyChosen > itemFrequencyList.length-1) {
        itemFrequencyChosen = 0;
      }
      frequencyButton.text = String(itemFrequencyList[itemFrequencyChosen])
    }
  }
}