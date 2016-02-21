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

var wolfFact = "By the 1970s the pure red wolf was thought to be extinct in the wild, but a population has since been reintroduced in North Carolina that is said to now be up to 100 red wolf individuals."
var sealFact = "Monk Seals, long the victim of commercial hunting and persecution by fishermen, also lost much of their former habitat to coastal development and suffered from the effects of both pollution and ocean traffic. Today the population for this species is estimated at fewer than 600 individuals." 
var leopardFact = "The Amur leopard has been reported to leap more than 19 feet horizontally and up to 10 feet vertically.  It is poached largely for its beautiful, spotted fur, and is currently teetering on the brink of extinction."
var pandaFact = "This peaceful creature with a distinctive black and white coat is adored by the world and considered a national treasure in China.  Despite their exalted status and relative lack of natural predators, pandas are endangered. Severe threats from humans have left just over 1,800 pandas in the wild."
var bonoboFact = "Bonobos share 98.7% of their DNA with humans — making them, along with chimpanzees, our closest living relatives.  Bonobo groups tend to be more peaceful and are led by females.  Civil unrest and increasing poverty in the area around the bonobos’ forests have contributed to bonobo poaching and deforestation."
var gorillaFact = "As their name implies, mountain gorillas live in forests high in the mountains, at elevations of 8,000 to 13,000 feet.  What might have been a bleak outlook for the subspecies just a couple of decades ago has brightened in recent years due to conservation efforts."
var owlFact = "Northern spotted owls have a distinct flight pattern, involving a series of rapid wingbeats interspersed with gliding flight. This allows them to glide silently down upon their prey. As a result of declining habitat, there are fewer than 2500 pairs of Northern spotted owls left."
var foxFact = "Although historically common and widely distributed in short - and mixed - grass prairies of the Great Plains, swift foxes have experienced significant population declines and are now estimated to occupy less than half of their historic range in the United States."
var tigerFact = "The last of Indonesia’s tigers — now fewer than 400 — are holding on for survival in the remaining patches of forests on the island of Sumatra. Accelerating deforestation and rampant poaching mean this noble creature could end up like its extinct Javan and Balinese relatives."
var lionFact = "There are three main threats currently facing African Lions: habitat loss, loss of their prey base to the bushmeat trade, and human-lion conflict. The total population is currently estimated at about 34,000 animals, down by at least 50 percent from three decades ago. "
var elephantFact = "Indian elephants may spend up to 19 hours a day feeding and they can produce about 220 pounds of dung per day while wandering over an area that can cover up to 125 square miles.  The main threat facing Indian elephants is loss of habitat, which then results in human-elephant conflict."
var chimpFact = "Like us, chimps are highly social animals, care for their offspring for years and can live to be over 50. In fact, chimpanzees are our closest cousins; we share about 98 percent of our genes. In recent years poaching has become commercialized to satisfy the appetites of wealthy urban residents."

function preload() {
  loadStuff();
  players.push(new Player(0, 'Monk Seal', sealHead, callSeal, sealFact, 177,241,255));
  players.push(new Player(1, 'Amur Leopard', leopardHead, callLeopard, leopardFact, 237, 201, 81));
  players.push(new Player(2, 'Bonobo Monkey', bonoboHead, callBonobo, bonoboFact, 235, 104, 65));
  players.push(new Player(3, 'Giant Panda', pandaHead, callPanda, pandaFact, 192, 108, 132));
  players.push(new Player(4, 'Red Wolf', wolfHead, callWolf, wolfFact, 255, 190, 64));
  players.push(new Player(5, 'Mountain Gorilla', gorillaHead, callGorilla, gorillaFact, 236, 240, 129));
  players.push(new Player(6, 'Spotted Owl', owlHead, callOwl, owlFact, 246, 114, 128));
  players.push(new Player(7, 'Swift Fox', foxHead, callFox, foxFact, 199, 244, 100));
  players.push(new Player(8, 'Sumatran Tiger', tigerHead, callTiger, tigerFact, 55, 159, 100));
  players.push(new Player(9, 'African Lion', lionHead, callLion, lionFact, 254,152,41));
  players.push(new Player(10, 'Indian Elephant', elephantHead, callElephant, elephantFact, 181, 98, 43));
  players.push(new Player(11, 'Chimpanzee', chimpHead, callChimp, chimpFact, 205, 187, 153));
  
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

  // Animal Sounds
  callOwl = loadSound('assets/sounds/animalSounds/barred_owl.mp3');
  callBonobo = loadSound('assets/sounds/animalSounds/bonobo.mp3');
  callChimp = loadSound('assets/sounds/animalSounds/chimp.mp3');
  callElephant = loadSound('assets/sounds/animalSounds/elephant.mp3');
  callFox = loadSound('assets/sounds/animalSounds/fox.mp3');
  callGorilla = loadSound('assets/sounds/animalSounds/gorilla.mp3');
  callLeopard = loadSound('assets/sounds/animalSounds/leopard.mp3');
  callLion = loadSound('assets/sounds/animalSounds/lion.mp3');
  callPanda = loadSound('assets/sounds/animalSounds/panda.mp3');
  callSeal = loadSound('assets/sounds/animalSounds/seal.mp3');
  callTiger = loadSound('assets/sounds/animalSounds/tiger.mp3');
  callWolf = loadSound('assets/sounds/animalSounds/wolf.mp3');

  
  // Head Images
  bonoboHead = loadImage('assets/images/bonobo.png');
  sealHead = loadImage('assets/images/sealHead.png');
  leopardHead = loadImage('assets/images/leopardHead.png');
  pandaHead = loadImage('assets/images/pandaHead.png');
  wolfHead = loadImage('assets/images/wolf.png');
  gorillaHead = loadImage('assets/images/gorilla.png');
  owlHead = loadImage('assets/images/owlHead.png');
  foxHead = loadImage('assets/images/foxHead.png');
  tigerHead = loadImage('assets/images/tigerHead.png');
  lionHead = loadImage('assets/images/lionHead.png');
  elephantHead = loadImage('assets/images/elephantHead.png');
  chimpHead = loadImage('assets/images/chimp.png');

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
