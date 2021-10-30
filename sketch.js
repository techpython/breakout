const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var ball, ballImg;
var paddle;
var edges;
var brickG;
var bgSound, hitsound;
var score=0;
var gameState="serve"
function preload(){
ballImg=loadImage("ball.png");
bgSound=loadSound("repitition.mp3");
hitsound=loadSound("destruction_5.mp3");
}

function setup() {
  createCanvas(1920, 1080);
  engine = Engine.create();
  world = engine.world;
  ball=createSprite(960,540,25,25);
  ball.addImage(ballImg);
  ball.scale=0.1;
  paddle=createSprite(960,1000,240,20);
  paddle.shapeColor="gold";
  edges=createEdgeSprites();

  brickG = new Group();
  bgSound.loop();
  createBrickRow(200,"red");
  createBrickRow(254,"orange"); 
  createBrickRow(308,"yellow");
  createBrickRow(362,"green");
  createBrickRow(416,"blue");                                                  
}

function draw() {
  background(0);
  Engine.update(engine);
  paddle.x=mouseX;
  paddle.collide(edges);
  if(paddle.x<paddle.width/2){
    paddle.x=120;
  }
  if(paddle.x>1800){
    paddle.x=1800;
  }

  ball.bounceOff(paddle);
  ball.bounceOff(edges[0]);
  ball.bounceOff(edges[1]);
  ball.bounceOff(edges[2]);
  ball.bounceOff(brickG,brickHit);
  textSize(35);
  text("Score: "+score,500,100);

  if(score===300){
    textSize(200);
    fill("red");
    text("YOU WON",500,540);
    ball.velocityX=0;
    ball.velocityY=0;
  }

  if(ball.y>1080){
    ball.velocityX=0;
    ball.velocityY=0;
    ball.x=960;
    ball.y=540;
    gameState='serve';
  }
  if(brickG.isTouching(edges[3])){
    textSize(200);
    fill("blue");
    text("YOU LOSE",500,540);
    setTimeout(() => {
      brickG.destroyEach();
    }, 2000);
    brickG.setVelocityYEach(0);
    ball.velocityX=0;
    ball.velocityY=0;
    gameState='end';
    
  }
 drawSprites(); 
}


function createBrickRow(y,color){
  for(var c=0;c<12;c++){
    var brick=createSprite(388+104*c,y,100,50);
    brick.shapeColor=color;
    brickG.add(brick);
  }
    
}

function keyPressed(){
  if(keyCode === 32 && gameState==="serve"){
    ball.velocityX=40;
    ball.velocityY=40;
    gameState='play';
    brickG.setVelocityYEach(0.2);
  }
}

function brickHit(ball,brick){
  brick.destroy();
  score=score+5;
  hitsound.play();
}


