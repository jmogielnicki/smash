function OptionsScreen() {
  players = shuffle(players);
  this.complete = false;
  this.startButtonSize = 80;
  
  this.construct = function() {
    winJingle.stop();
    if (introMusic.isPlaying() === false) {
      introMusic.loop();
    }
    this.complete = false;
    canvas = createCanvas(windowWidth, windowHeight-5);
    canvas.parent('canvasContainer');
    this.selectedPlayers = [];
    for (i in players) {
      players[i].chosen = false;
      players[i].strokeWeight = 0;
    }
    gameLEdge = width/2 - gameBoardSize/2
    gameREdge = width/2 + gameBoardSize/2
    gameTEdge = height/2 - gameBoardSize/2
    gameBEdge = height/2 + gameBoardSize/2
    // Putting this here because it depends on canvas being already created
    this.startButtonVector = createVector(width / 2, gameBEdge-100)
    choosePlayersSound.play();

    changeItemsButton = new Button(width / 2 - 70, height / 2 + 190, 120, 50, 'Change Options', 16, gameR2, gameG2, gameB2)
    startGameButton = new Button(width / 2 + 70, height / 2 + 190, 120, 50, 'Start Game', 18, gameR, gameG, gameB)
  }

  this.checkSelection = function() {
    if (changeItemsButton.clicked()) {
      screen = 'howToPlayScreen';
      howToPlay.construct();
    }

    // Start new game
    if (startGameButton.clicked() && this.complete == true) {
      newGame(this.selectedPlayers[0], this.selectedPlayers[1])
    }

    // Figure out if players are chosen
    for (i in players) {
      playeri = players[i];
      playeriIndex = this.selectedPlayers.indexOf(playeri)
      if (dist(mouseX, mouseY, playeri.location.x, playeri.location.y) < playeri.size / 2) {
        if (this.selectedPlayers.length < 2) {
          playeri.chosen = !playeri.chosen;
        }
        if (playeriIndex >= 0) {
          this.selectedPlayers.splice(playeriIndex, 1);
          playeri.chosen = false;
        }
        if (playeri.chosen === true && playeriIndex === -1) {
          this.selectedPlayers.push(playeri);
          playeri.introSound.play();
          playeri.strokeWeight = 3;
        } else {
          playeri.strokeWeight = 0;
        }
        for (j in players) {
          player = players[j]

        }

      }
      if (this.selectedPlayers.length >= 2) {
        this.complete = true;

      } else {
        this.complete = false;
      }
    }
  }

  this.shuffle = function(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  this.animate = function() {

    background(0, 0, 0);
    strokeWeight(0)
    fill(gameR, gameG, gameB)
    textAlign(CENTER);
    textSize(30);
    if (this.selectedPlayers.length < 1) {
      text1 = "Choose Player 1"
      text2 = "(awds keys)"
    } else {
      text1 = "Choose Player 2"
      text2 = "(arrow keys)"
    }
    text(text1, width/2, gameTEdge+100)
    fill(100,100,100)
    textSize(20)
    text(text2, width/2, gameTEdge+130)

    for (i in players) {
      player = players[i];
      if (i <= 3) {
        player.location.y = gameTEdge + gameBoardSize * .35
        playerColumn = int(i);
      } else if (i > 3 && i <=7) {
        player.location.y = gameTEdge + gameBoardSize * .5
        playerColumn = int(i - 4);
      } else {
        player.location.y = gameTEdge + gameBoardSize * .65
        playerColumn = int(i - 8);
      }
      if (player.chosen === true && player.size < 90) {
        player.size += 0.5
      } else if (player.chosen === false && player.size > 75) {
        player.size -= 0.5
      }
      player.location.x = gameLEdge + (playerColumn + 1) * (gameBoardSize*.2);
      fill(player.r, player.g, player.b, player.transp)
      stroke(player.r, player.g, player.b)
      strokeWeight(player.strokeWeight);
      image(player.headImage, player.location.x, player.location.y, player.size, player.size)
      ellipse(player.location.x, player.location.y, player.size, player.size)
    }
    if (this.complete === true) {
      startGameButton.active = true;
    } else {
      startGameButton.active = false;
    }
    startGameButton.display();
    changeItemsButton.display();

      // Drawing the gameBoard
    fill(0, 0, 0, 0)
    stroke(gameR, gameG, gameB, 15)
    strokeWeight(150);
    ellipse(width / 2, height / 2, gameBoardSize +150, gameBoardSize +150)
    strokeWeight(5);
    stroke(gameR, gameG, gameB, 255)
    ellipse(width / 2, height / 2, gameBoardSize, gameBoardSize)


  }
}