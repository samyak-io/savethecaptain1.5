var cap, capRunImg;
var ground, groundImg;
var backgr, backgroundImg;

//obstacles
var spikes, spikesImg, spikesGroup;
var fireBall, fireBallImg, fireBallGroup;
var coinsCollected = 0;

var hitSound;
var collectSound;
var fireSound;
var jumpsound;
//coins
var silverCoins, silverCoinsImg, silverCoinsGroup, goldCoins, goldCoinsImg, goldCoinsGroup;


//game states
var PLAY = 1;
var END  = 0;
var gameState = PLAY;
var score = 0;

var gameOver, gameOverImg;
var restart, restartImg;
function preload(){
    backgroundImg = loadImage("sprites/bg3.png");

    capIdleImg = loadAnimation("sprites/idle-0.png");
    capRunImg = loadAnimation("sprites/run-0.png","sprites/run-1.png","sprites/run-3.png","sprites/run-4.png","sprites/run-5.png","sprites/run-6.png","sprites/run-7.png");

    fireBallImg = loadAnimation("sprites/fireBall1.png","sprites/fireBall2.png","sprites/fireBall3.png","sprites/fireBall4.png","sprites/fireBall5.png","sprites/fireBall6.png","sprites/fireBall7.png","sprites/fireBall8.png","sprites/fireBall9.png","sprites/fireBall10.png");
    spikesImg = loadImage("sprites/spikes.png");

    goldCoinsImg = loadAnimation("sprites/goldCoin1.png","sprites/goldCoin2.png","sprites/goldCoin3.png","sprites/goldCoin4.png","sprites/goldCoin5.png","sprites/goldCoin6.png","sprites/goldCoin7.png","sprites/goldCoin8.png","sprites/goldCoin9.png","sprites/goldCoin10.png")
    silverCoinsImg = loadAnimation("sprites/silverCoin1.png","sprites/silverCoin2.png","sprites/silverCoin3.png","sprites/silverCoin4.png","sprites/silverCoin5.png","sprites/silverCoin6.png","sprites/silverCoin7.png","sprites/silverCoin8.png","sprites/silverCoin9.png","sprites/silverCoin10.png")
  
    hitSound = loadSound("sounds/hit.mp3");
    collectSound = loadSound("sounds/collectSound.mp3");
    fireSound = loadSound("sounds/fireSound.mp3");
    jumpSound = loadSound("sounds/jump.mp3");

    gameOverImg = loadImage("sprites/gameOver.png");
    restartImg = loadImage("sprites/restart.png");
  }

function setup(){
    var canvas = createCanvas(windowWidth,windowHeight);

    //create background
    backgr = createSprite(windowWidth/2 + 200, windowHeight/2 - 40, windowWidth, windowHeight);
    backgr.addImage(backgroundImg);
    backgr.x = backgr.width/2;
    
    //create ground
    ground = createSprite(0, backgr.y/2 + 550, windowWidth, 10);
    ground.visible = false;
    ground.x = ground.width/2;
    ground.velocityX = -(3 + 2*score/100);

    //create player
    cap = createSprite(windowWidth/8 - 30,ground.y);
    cap.scale = 2.5;
    cap.addAnimation("running",capRunImg);
    cap.addAnimation("idle", capIdleImg);
    
    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.1;
  
    gameOver.visible = false;
    restart.visible = false;

    spikesGroup = new Group();
    fireBallGroup = new Group();

    silverCoinsGroup = new Group();
    goldCoinsGroup = new Group();
}

function draw(){
    background("white");

  if(gameState === PLAY){
    if(ground.x < windowWidth/2){
      ground.x = ground.width/2;
    }

     backgr.velocityX = -(5 + 2*score/100);
    if(backgr.x < 450){
      backgr.x = backgr.width/2;
    }

    //score system
    score = Math.round(World.frameCount/4);

    // console.log(windowWidth);
    console.log(cap.y);

      spikeObstacles();
      fireBallObstacle();
      silverCoin();
      goldCoin();
      jump();

    if(silverCoinsGroup.isTouching(cap)){
      coinsCollected = coinsCollected + 2;
      collectSound.play();
      silverCoinsGroup.destroyEach();
      }

    if(goldCoinsGroup.isTouching(cap)){
      coinsCollected = coinsCollected + 5;
      collectSound.play();
      goldCoinsGroup.destroyEach();
     }

    if(spikesGroup.isTouching(cap)){
     gameState = END;
     hitSound.play();
   }
    if(fireBallGroup.isTouching(cap)){
      gameState = END;
    }
  } 

  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    cap.velocityY = 0;
    backgr.velocityX = 0;
    cap.changeAnimation("idle",capIdleImg);

    spikesGroup.setVelocityXEach(0);
    fireBallGroup.setVelocityXEach(0);
    silverCoinsGroup.setVelocityXEach(0);
    goldCoinsGroup.setVelocityXEach(0);

    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = [];
    }
  }
    // collide captain with ground
    cap.collide(ground);

    //console.log(cap.y);
    drawSprites();
    
    stroke(62, 230, 255);
    strokeWeight(1.5);
    fill(18, 207, 236);
    textSize(20);
    textFont("Courier")
    text("Score: " + score, windowWidth - 250, windowHeight/8 - 20);

    //coins collected text
    stroke(255, 252, 78);
    strokeWeight(2);
    fill(255, 213, 2);
    text("Coins Collected: " + coinsCollected, windowWidth - 250, windowHeight/8);
}


//press space to jump
function jump(){
  if((touches.length > 0 || keyDown("SPACE")) && cap.y  >= 680) {
    jumpSound.play( )
    cap.velocityY = -15;
    touches = [];
  }
  
  //add gravity to the captain
  cap.velocityY = cap.velocityY + 0.66;
}

//spawn spikes 
function spikeObstacles(){
    if(frameCount % 100 === 0){
    spikes = createSprite(windowWidth, ground.y, 20, 20);
    spikes.addImage(spikesImg);
    spikes.scale = 0.15;
    spikes.velocityX = -(5.2 + 2*score/100);
    spikes.lifetime = 400;
    spikesGroup.add(spikes);
  }
}

function fireBallObstacle(){
  if(frameCount % 160 === 0 && score > 100){
    fireBall = createSprite(windowWidth, random(ground.y - 20, ground.y - 110), 20, 20);
    fireBall.addAnimation("fire",fireBallImg);
    fireSound.play();
    fireBall.scale = 1.2;
    fireBall.velocityX = -(18 + 2 * score/100);
    fireBall.lifetime = 320;
    fireBallGroup.add(fireBall);
  }
}

function silverCoin(){
  if(frameCount % 120 === 0){
    silverCoins = createSprite(windowWidth, random(ground.y - 15, ground.y - 120), 20, 20);
    silverCoins.addAnimation("sCoin",silverCoinsImg);
    silverCoins.scale = 0.1;
    silverCoins.velocityX = -(6 + 2*score/100);
    silverCoins.lifetime = 320;
    silverCoinsGroup.add(silverCoins);
  }
}

function goldCoin(){
  if(frameCount % 220 === 0 && score > 150){
    goldCoins = createSprite(windowWidth, random(ground.y - 15, ground.y - 120), 20, 20);
    goldCoins.addAnimation("gCoin",goldCoinsImg);
    goldCoins.scale = 0.1;
    goldCoins.velocityX = -(6 + 2*score/100);
    goldCoins.lifetime = 320;
    goldCoinsGroup.add(goldCoins);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  spikesGroup.destroyEach();
  spikesGroup.destroyEach();
  fireBallGroup.destroyEach();
  silverCoinsGroup.destroyEach();
  goldCoinsGroup.destroyEach()
  
  cap.changeAnimation("running",capRunImg);
  
  score = 0;
  
}