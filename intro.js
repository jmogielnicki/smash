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
    choosePlayersButton = new Button(width / 2 + 100, height / 2 + 150, 150, 50, 'Choose Players', 16, gameR2, gameG2, gameB2)
    howToPlayButton = new Button(width / 2 - 100, height / 2 + 150, 150, 50, 'Objective & Options', 16, gameR2, gameG2, gameB2)
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
    textSize(20);
    fill(gameR2, gameG2, gameB2)
    // This was a biline, but took it out
    text("Animal Edition", width / 2, height / 2 + 50)
    textSize(18);
    fill(200, 200, 200)

    if (browser != 'Chrome') {
      textSize(14)
      warningText = "Looks like you're using " + browser + ". \nThis game works best with Chrome. \nPlease switch for the best experience."
      text(warningText, width/2, height/2+210)
    }

    choosePlayersButton.display();
    howToPlayButton.display();


    
    // Drawing the gameBoard
    fill(0, 0, 0, 0)
    stroke(gameR, gameG, gameB, 15)
    strokeWeight(150);
    ellipse(width / 2, height / 2, gameBoardSize + 150, gameBoardSize + 150)
    strokeWeight(5);
    stroke(gameR, gameG, gameB, 255)
    ellipse(width / 2, height / 2, gameBoardSize, gameBoardSize)

  }

  this.goToSetup = function() {
    screen = 'setupScreen'
    options.construct();
  }


  this.checkAction = function() {
    if (choosePlayersButton.clicked() == true) {
      this.goToSetup();
    } else if (howToPlayButton.clicked()) {
      screen = 'howToPlayScreen';
      howToPlay.construct();
    }
    // if (mouseY > height / 2 + 50 && mouseY < height / 2 + 250) {
    //   if (mouseX > width / 2 - 150 && mouseX < width / 2) {
    //     screen = 'howToPlayScreen';
    //     howToPlay.construct();
    //   } else if (mouseX > width / 2 && mouseX < width / 2 + 150) {
    //     screen = 'setupScreen'
    //     options.construct();
    //   }
    // }
  }
}