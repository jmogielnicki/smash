var screen = 'introScreen';
var gameBoardSize = 600;
var gameLEdge;
var gameREdge;
var gameTEdge;
var gameBEdge;
var margin;
var gameR = 204
var gameG = 51
var gameB = 63
var gameR2 = 83
var gameG2 = 119
var gameB2 = 122
var players = [];
var isOpera, isFirefox, isSafari, isChrome, isIE
var browser;
var gameFrameRate = 50;
var itemFrequencyList = ['Low', 'Medium', 'High']
var itemFrequencyChosen = 1;
var buttons = [];
var helpLink;
var ouchFace;
var deathFace;
var frozenFace;

function preload() {
  loadStuff();
  players.push(new Player(0, 'Winkey Face', winkeyFace, beepSelectSound, 177,241,255, ouchFace, deathFace));
  players.push(new Player(1, 'Angry Face', angryFace, beepSelectSound, 237, 201, 81, ouchFace, deathFace));
  players.push(new Player(2, 'Laughing Face', laughingFace, beepSelectSound, 235, 104, 65, ouchFace, deathFace));
  players.push(new Player(3, 'Wink Face', winkFace, beepSelectSound, 192, 108, 132, ouchFace, deathFace));
  players.push(new Player(4, 'Cool Face', coolFace, beepSelectSound, 255, 190, 64, ouchFace, deathFace));
  players.push(new Player(5, 'Snort Face', snorterFace, beepSelectSound, 236, 240, 129, ouchFace, deathFace));
  players.push(new Player(6, 'Nerd Face', nerdFace, beepSelectSound, 246, 114, 128, ouchFace, deathFace));
  players.push(new Player(7, 'Cheeky Face', roseyFace, beepSelectSound, 199, 244, 100, ouchFace, deathFace));
  players.push(new Player(8, 'Smiley Face', smileyFace, beepSelectSound, 55, 159, 100, ouchFace, deathFace));
  players.push(new Player(9, 'Smirker Face', smirkerFace, beepSelectSound, 254,152,41, ouchFace, deathFace));
  players.push(new Player(10, 'Squinty Face', squintFace, beepSelectSound, 181, 98, 43, ouchFace, deathFace));
  players.push(new Player(11, 'Tongue Face', tongueFace, beepSelectSound, 205, 187, 153, ouchFace, deathFace));

  isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
      // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
  isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
  isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
      // At least Safari 3+: "[object HTMLElementConstructor]"
  isChrome = !!window.chrome && !isOpera;              // Chrome 1+
  isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6
  if(isChrome) {browser = 'Chrome'}
  else if (isFirefox) {browser = 'Firefox'}
  else if (isSafari) {browser = 'Safari'}
  else if (isIE) {browser = 'IE'}
  else if (isOpera) {browser = 'Opera'}
}

function setup() {
  textFont(myFont)
  createButtons();

  options = new OptionsScreen();
  howToPlay = new HowToPlayScreen();
  intro = new IntroScreen();
  game = new Game();
  intro.construct();
  introMusic.setVolume(.6)
  introMusic.loop();
  winSound.play();
  faceSmashIntro.play();
}

function draw() {

  if (screen === 'gameScreen' && game.won === false) {
    game.drawGame()
    } else if (screen === 'setupScreen') {
    options.animate();
  } else if (screen === 'introScreen') {
    intro.animate();
  } else if (screen === 'howToPlayScreen') {
    howToPlay.animate();
  }
}

function newGame(player1, player2) {
  screen = 'gameScreen'
  game = new Game();
  game.setupGame(player1, player2);
}

function makeButtons (text, method) {
  button = createButton(text);
  button.class('btn btn-default')
  button.parent('controls');
  button.mousePressed(method);
}

function createButtons() {
  // makeButtons('New Game', newGame);
}

function mouseReleased() {
  if (screen === 'setupScreen') {
    options.checkSelection()
  } else if (screen === 'introScreen') {
    intro.checkAction();
  } else if (screen === 'howToPlayScreen'){
    howToPlay.checkAction();
  } else if (screen === 'gameScreen' && game.won === true) {
    game.checkAction();
  }
}

function loadStuff() {
  soundFormats('mp3', 'ogg');
  myFont = loadFont('assets/fonts/chunkFive.otf')

  // Sound effects
  faceSmashIntro = loadSound('assets/sounds/faceSmash.mp3');
  choosePlayersSound = loadSound('assets/sounds/choosePlayers.mp3');
  beepSelectSound = loadSound('assets/sounds/beepSelect.mp3');
  beepDeselectSound = loadSound('assets/sounds/beepDeselect.mp3');
  clickSelectSound = loadSound('assets/sounds/clickSelect.mp3');
  clickBeepSound = loadSound('assets/sounds/clickBeep.mp3');
  readyFightSound = loadSound('assets/sounds/readyFight.mp3');
  introMusic = loadSound('assets/sounds/introMusic.mp3');
  fightMusic = loadSound('assets/sounds/fightMusic.mp3');
  ballHitSound = loadSound('assets/sounds/ballHit.mp3');
  itemSound = loadSound('assets/sounds/wallHit.mp3');
  deathSound = loadSound('assets/sounds/death.mp3');
  laughSound = loadSound('assets/sounds/laugh.mp3');
  warpSound = loadSound('assets/sounds/warpOrgan.mp3');
  droneSound = loadSound('assets/sounds/drone.mp3');
  droneDeathSound = loadSound('assets/sounds/droneDeath.mp3');
  winSound = loadSound('assets/sounds/cheerShort.mp3');
  winJingle = loadSound('assets/sounds/winJingle.mp3');
  extraLifeSound = loadSound('assets/sounds/extraLife.mp3');
  extraLifeSound2 = loadSound('assets/sounds/extraLife2.mp3');
  growSound = loadSound('assets/sounds/grow2.mp3');
  shrinkSound = loadSound('assets/sounds/shrink.mp3');
  fireSound = loadSound('assets/sounds/fireShield.mp3');
  fireDeathSound = loadSound('assets/sounds/fireDeath.mp3');
  forceFieldSound = loadSound('assets/sounds/forceField.mp3');
  spriteSound = loadSound('assets/sounds/spriteSound.mp3');
  freezeSound = loadSound('assets/sounds/freeze.mp3');
  shatterSound = loadSound('assets/sounds/shatter.mp3');
  startUpSound = loadSound('assets/sounds/startUp.mp3');
  activateSound = loadSound('assets/sounds/activate.mp3');
  clickSound = loadSound('assets/sounds/click.mp3');
  explodeSound = loadSound('assets/sounds/explode.mp3');


  // Head Images
  laughingFace = loadImage('assets/images/laughingFace.png');
  winkeyFace = loadImage('assets/images/winkeyFace.png');
  angryFace = loadImage('assets/images/angryFace.png');
  winkFace = loadImage('assets/images/winkFace.png');
  coolFace = loadImage('assets/images/coolFace.png');
  snorterFace = loadImage('assets/images/snorterFace.png');
  nerdFace = loadImage('assets/images/nerdFace.png');
  roseyFace = loadImage('assets/images/roseyFace.png');
  smileyFace = loadImage('assets/images/smileyFace.png');
  smirkerFace = loadImage('assets/images/smirkerFace.png');
  squintFace = loadImage('assets/images/squintFace.png');
  tongueFace = loadImage('assets/images/tongueFace.png');
  ouchFace = loadImage('assets/images/ouchFace.png');
  deathFace = loadImage('assets/images/deathFace.png');
  frozenFace = loadImage('assets/images/frozenFace.png');

  // Item Icons
  flameIcon = loadImage('assets/icons/flame.png');
  gravityShieldIcon = loadImage('assets/icons/gravityShield.png');
  heartIcon = loadImage('assets/icons/heart.png');
  droneIcon = loadImage('assets/icons/drone.png');
  spriteIcon = loadImage('assets/icons/sprite.png');
  increaseIcon = loadImage('assets/icons/increase.png');
  decreaseIcon = loadImage('assets/icons/decrease.png');
  snowFlakeIcon = loadImage('assets/icons/snowFlake.png');
  bombIcon = loadImage('assets/icons/bomb.png');
}
