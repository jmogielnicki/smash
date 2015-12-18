var screen = 'introScreen';
var gameInProgress = false;
var setupInProgress = false;
var introInProgress = true;
var howToPlayInProgress = false; 
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
 
function preload() {
  loadStuff();
  players.push(new Player(0, 'Riley', rileyHead, introRiley, 0, 160, 176));
  players.push(new Player(1, 'Kale', kaleHead, introKale, 237, 201, 81));
  players.push(new Player(2, 'John', jmHead, introJohn, 235, 104, 65));
  players.push(new Player(3, 'Petry', petryHead, introPetry, 192, 108, 132));
  players.push(new Player(4, 'BopBop', bopbopHead, introBopBop, 255, 190, 64));
  players.push(new Player(5, 'Eli', eliHead, introEli, 236, 240, 129));
  players.push(new Player(6, 'Mimi', mimiHead, introMimi, 246, 114, 128));
  players.push(new Player(7, 'Julie', julieHead, introJulie, 199, 244, 100));
  players.push(new Player(8, 'Rania', raniaHead, introRania, 55, 159, 100));
  players.push(new Player(9, 'Katrina', katrinaHead, introKatrina, 147, 204, 198));
  players.push(new Player(10, 'Oren', orenHead, introOren, 181, 98, 43));
  players.push(new Player(11, 'Davis', davisHead, introDavis, 205, 187, 153));
  
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
    }
  if (screen === 'setupScreen') {
    options.animate();
  }
  if (screen === 'introScreen') {
    intro.animate();
  }
  if (screen === 'howToPlayScreen') {
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
    screen = 'introScreen'
    intro.construct();
  } else if (screen === 'gameScreen' && game.won === true) {
    game.checkAction();
  }
}

// function keyPressed() {
//   if (keyIsDown(SHIFT)) {
//     frameRate(1);
//   } else {
//     frameRate(10);
//   }
// }

function loadStuff() {
  soundFormats('mp3', 'ogg');
  myFont = loadFont('assets/fonts/chunkFive.otf')
  faceSmashIntro = loadSound('assets/sounds/faceSmash.mp3');
  choosePlayersSound = loadSound('assets/sounds/choosePlayers.mp3');
  readyFightSound = loadSound('assets/sounds/readyFight.mp3');
  introMusic = loadSound('assets/sounds/introMusic.mp3');
  fightMusic = loadSound('assets/sounds/fightMusic.mp3');
  ballHitSound = loadSound('assets/sounds/ballHit.mp3');
  itemSound = loadSound('assets/sounds/wallHit.mp3');
  deathSound = loadSound('assets/sounds/death.mp3');
  laughSound = loadSound('assets/sounds/laugh.mp3');
  warpSound = loadSound('assets/sounds/warpOrgan.mp3');
  winSound = loadSound('assets/sounds/cheerShort.mp3');
  winJingle = loadSound('assets/sounds/winJingle.mp3');
  growSound = loadSound('assets/sounds/grow2.mp3');
  shrinkSound = loadSound('assets/sounds/shrink.mp3');
  fireSound = loadSound('assets/sounds/fireShield.mp3');
  fireDeathSound = loadSound('assets/sounds/fireDeath.mp3');
  forceFieldSound = loadSound('assets/sounds/forceField.mp3');
  spriteSound = loadSound('assets/sounds/spriteSound.mp3');
  jmHead = loadImage('assets/images/jmHead.png');
  rileyHead = loadImage('assets/images/rileyHead2.png');
  kaleHead = loadImage('assets/images/kaleHead.png');
  petryHead = loadImage('assets/images/petryHead.png');
  bopbopHead = loadImage('assets/images/bopbopHead.png');
  eliHead = loadImage('assets/images/eliHead.png');
  mimiHead = loadImage('assets/images/mimiHead.png');
  julieHead = loadImage('assets/images/julieHead.png');
  raniaHead = loadImage('assets/images/raniaHead.png');
  katrinaHead = loadImage('assets/images/katrinaHead.png');
  orenHead = loadImage('assets/images/orenHead.png');
  davisHead = loadImage('assets/images/davisHead.png');
  introJohn = loadSound('assets/sounds/introJohn.mp3');
  introRiley = loadSound('assets/sounds/introRiley.mp3');
  introKale = loadSound('assets/sounds/introKale.mp3');
  introMimi = loadSound('assets/sounds/introMimi.mp3');
  introBopBop = loadSound('assets/sounds/introBopBop.mp3');
  introKatrina = loadSound('assets/sounds/introKatrina.mp3');
  introRania = loadSound('assets/sounds/introRania.mp3');
  introJulie = loadSound('assets/sounds/introJulie.mp3');
  introOren = loadSound('assets/sounds/introOren.mp3');
  introEli = loadSound('assets/sounds/introEli.mp3');
  introDavis = loadSound('assets/sounds/introDavis.mp3');
  introPetry = loadSound('assets/sounds/introPetry.mp3');
  
}