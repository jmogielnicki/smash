function IntroScreen() {
  var warningText 
  this.construct = function() {
    frameRate(gameFrameRate)
    canvas = createCanvas(windowWidth, windowHeight - 5);
    canvas.parent('canvasContainer');
    gameLEdge = width / 2 - gameBoardSize / 2
    gameREdge = width / 2 + gameBoardSize / 2
    gameTEdge = height / 2 - gameBoardSize / 2
    gameBEdge = height / 2 + gameBoardSize / 2
      // Putting this here because it depends on canvas being already created
    this.startButtonVector = createVector(width / 2, 100)

  }

  this.animate = function() {
    textFont(myFont)
    background(0, 0, 0);
    strokeWeight(0)
    fill(gameR, gameG, gameB)
    textAlign(CENTER);
    textSize(80);
    text("FaceSmash!", width / 2, height / 2 - 10)
    imageMode(CENTER)
    textSize(30);
    fill(gameR2, gameG2, gameB2)
    text("A game for Riley & Kale", width / 2, height / 2 + 40)
    textSize(24);
    fill(200, 200, 200)
    text('How to Play', width / 2 - 100, height / 2 + 150);
    text('Choose Players', width / 2 + 100, height / 2 + 150);
    if (browser != 'Chrome') {
      textSize(14)
      warningText = "Looks like you're using " + browser + ". \nThis game works best with Chrome. \nPlease switch for the best experience."
      text(warningText, width/2, height/2+210)
    }


    
    // Drawing the gameBoard
    fill(0, 0, 0, 0)
    stroke(gameR, gameG, gameB, 15)
    strokeWeight(150);
    ellipse(width / 2, height / 2, gameBoardSize + 150, gameBoardSize + 150)
    strokeWeight(5);
    stroke(gameR, gameG, gameB, 255)
    ellipse(width / 2, height / 2, gameBoardSize, gameBoardSize)

  }


  this.checkAction = function() {
    if (mouseY > height / 2 + 50 && mouseY < height / 2 + 250) {
      if (mouseX > width / 2 - 150 && mouseX < width / 2) {
        screen = 'howToPlayScreen';
        howToPlay.construct();
      } else if (mouseX > width / 2 && mouseX < width / 2 + 150) {
        screen = 'setupScreen'
        options.construct();
      }
    }
  }
}