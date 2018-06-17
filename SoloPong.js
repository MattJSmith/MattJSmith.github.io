var pongCanvas = document.getElementById('SoloPong');
var pongContex = pongCanvas.getContext('2d');
var pongraf; // request animation frame

//actual game objects and game logic variables
var pongrunning = false;

var pongLastMousePosition;

var pongCurrentScore = 0;
var ponghighScore = 0;
var paddleCount = 1;

var pongmainText = new PongTextObjects("Solo Pong!",'black',10,30,20);

var PongStartButtonRectangleX = 150;
var PongStartButtonRectangleY = 80;
var PongStartButtonRectangleWidth = 250;
var PongStartButtonRectangleHeight = 60;
var PongStartButtonText = new PongTextObjects("Begin!",'black',220,120,35);

var PongPaddleCountButtonRectangleX = 150;
var PongPaddleCountButtonRectangleY = 160;
var PongPaddleCountButtonRectangleWidth = 250;
var PongPaddleCountButtonRectangleHeight = 60;
var PongPaddleCountButtonText = new PongTextObjects("Paddles: " + paddleCount,'black',200,200,35);

var pongLoseText = new PongTextObjects("You lost!",'red',200,80,50);
var pongscoreText = new PongTextObjects("Current score: " + pongCurrentScore + "  | Best Attempt: " + ponghighScore ,'black',240,30,20);

var pongBall;

var pongBotPaddle;
var pongTopPaddle;
var pongLeftPaddle;
var pongRightPaddle;

var pongGamePaused = false;
//Have a Choice of how many paddles (one per wall).
//Draw an outline on walls without paddles to show the ball will bounce off of these
//Set ammount of paddles/ saftey walls by a button like other game

var pongBackgroundColour = 'rgba(150, 175, 175, 1)';

//underlying logic variables
var pongGameIntervalSpeed = 1; //in milliseconds

var pongTicks = 0; //counter based off the pongGameIntervalSpeed

var pongLoopReference;

//Start Game - Actual Code that is running

PongInitialiseGame();

//Events that are active at start
pongCanvas.addEventListener('mousemove', function(e) {
  if (pongrunning) 
  {
	pongLastMousePosition = getMousePos(pongCanvas,e);
  }
});

pongCanvas.addEventListener("mouseout", function(e) {
		Pause();
});
pongCanvas.addEventListener("mouseover", function(e) {
		UnPause();
});

pongCanvas.addEventListener("click", function(e) {
	
  if (!pongrunning) {
	pongLastMousePosition = getMousePos(pongCanvas,e);	  
	
	var currentPositionOnClick = getMousePos(pongCanvas,e);
	PongStartButton(currentPositionOnClick);	
	PongSetPaddleCountButton(currentPositionOnClick);
  }
});


//Functions that only run when called
function getMousePos(pongCanvas, e) {
  var rect = pongCanvas.getBoundingClientRect(); // abs. size of element

  return {
    x: (e.clientX - rect.left),   // scale mouse coordinates after they have
    y: (e.clientY - rect.top)     // been adjusted to be relative to element
  }
};

//Functions
function PongInitialiseGame()
{	
	PongClear();

	pongmainText.draw();
	pongscoreText.draw();	
	PongStartButtonDraw();
	PongPaddleButtonDraw();
}

function PongStartButton(e)
{	
	if(e.x > PongStartButtonRectangleX && e.x < (PongStartButtonRectangleX + PongStartButtonRectangleWidth) && e.y > PongStartButtonRectangleY && e.y < (PongStartButtonRectangleY + PongStartButtonRectangleHeight) )
	{	
		pongrunning = true;	
		
		PongStartGame();

		LoopPongGameDraw();	
	}
}

function PongSetPaddleCountButton(e)
{	
	if(e.x > PongPaddleCountButtonRectangleX && e.x < (PongPaddleCountButtonRectangleX + PongPaddleCountButtonRectangleWidth) && e.y > PongPaddleCountButtonRectangleY && e.y < (PongPaddleCountButtonRectangleY + PongPaddleCountButtonRectangleHeight) )
	{	
			if(paddleCount == 1){ paddleCount = 2}
			else if(paddleCount ==2){ paddleCount = 4}			
			else if(paddleCount ==4){ paddleCount = 1}
	}
			
		pongContex.clearRect(PongPaddleCountButtonRectangleX, PongPaddleCountButtonRectangleY, PongPaddleCountButtonRectangleWidth, PongPaddleCountButtonRectangleHeight);
		pongContex.fillStyle = pongBackgroundColour;
		pongContex.fillRect(PongPaddleCountButtonRectangleX, PongPaddleCountButtonRectangleY, PongPaddleCountButtonRectangleWidth, PongPaddleCountButtonRectangleHeight);

		PongPaddleCountButtonText.updateText("Paddles: " + paddleCount);
		PongPaddleCountButtonText.draw();
}

function LoopPongGameDraw() {
  
  PongClear();
	
  pongTopPaddle.draw();
 
  pongBall.draw();
  
  pongmainText.draw();

  pongscoreText.draw();
  
  pongraf = window.requestAnimationFrame(LoopPongGameDraw); //Recursive - This is the drawing loop
}

function PongStartGame()
{
	pongLoopReference = setInterval(LoopPongGameLogic, pongGameIntervalSpeed); //This loops on interval
	
	PongSpawnBall();
	
	pongTopPaddle = new PongCreatePaddle(10,10, "horizontal");	
}

function PongStartButtonDraw(){
	
	PongStartButtonText.draw();
	pongContex.rect(PongStartButtonRectangleX,PongStartButtonRectangleY,PongStartButtonRectangleWidth,PongStartButtonRectangleHeight);
	pongContex.stroke(); 
}

function PongPaddleButtonDraw(){
	
	PongPaddleCountButtonText.draw();
	pongContex.rect(PongPaddleCountButtonRectangleX,PongPaddleCountButtonRectangleY,PongPaddleCountButtonRectangleWidth,PongPaddleCountButtonRectangleHeight);
	pongContex.stroke(); 
}

function LoopPongGameLogic()
{
	if(pongrunning && !pongGamePaused)
	{
		pongTicks++;
		PongCollisionWithPaddle();
		CheckPongBallStillOnScreen();
		if(PongCheckMilliSeconds(200))
		{
			pongCurrentScore += 1;
			
			if(pongCurrentScore > ponghighScore){
				ponghighScore = pongCurrentScore;
				}
			
			pongscoreText.updateText("Current score: " + pongCurrentScore + "  | Best Attempt: " + ponghighScore );
			pongTicks = 0;
		}
		pongBall.update();
		pongTopPaddle.update();		
		
	}
}

function PongCheckMilliSeconds(time) //returns pongTicks based on milliseconds you want
{
	var result = (pongTicks % (time / 100));
	
	if(result == 0){return true;}
	return false;
}

function PongSpawnBall()
{
	if(pongrunning)
	{
		var newX = Math.floor(Math.random() * 300) + 50;
		var newY = Math.floor(Math.random() * 150) + 50;
		var newVX = 1.2;
		var newVY = 0.8;

		if(newVX == 0){ newVX = 1;}
		if(newVY == 0){ newVY = 1;}
		
		var r = 255;
		var g = 255;
		var b = 255;
		var a = 0.8;
		
		pongBall = new PongCreateBall(newX,newY,newVX,newVY,r,g,b,a);
	}
}

function PongTextObjects(fillText,colour,x,y,textSize)
{
	this.x = x;
	this.y = y;
	this.viewingText= fillText;
	
	this.draw = function() {
		pongContex.font= textSize + "px Georgia";
		pongContex.fillStyle = colour;
		pongContex.fillText(this.viewingText,x,y);	
	};
	this.updateText = function(newText)
	{
		this.viewingText = newText;
	}
};

function PongGameOver()
{
	if(pongrunning == false)
	{
		return;
	}
	
	PongClear();
	pongrunning = false;
	
	PongInitialiseGame();
	
	pongLoseText.draw();

	PongEndGame();

	if(pongCurrentScore > ponghighScore){
		ponghighScore = pongCurrentScore;
		}
	
	pongCurrentScore = 0;
	
	pongscoreText.updateText("Current score: " + pongCurrentScore + "  | Best Attempt: " + ponghighScore );
	
	window.cancelAnimationFrame(pongraf);
}

function PongClear() {
  pongContex.fillStyle = pongBackgroundColour;
  pongContex.fillRect(0,0,pongCanvas.width,pongCanvas.height);
}
	
function CheckBallAndTopPaddleCollision(){
				
	if( (pongBall.x) < pongTopPaddle.x && (pongBall.x) > pongTopPaddle.width && (pongBall.y) < pongTopPaddle.y && (pongBall.y) > pongTopPaddle.height) return false;

	return true;
};
	
function PongCollisionWithPaddle()
{

	if(pongrunning)
	{
		if(CheckBallAndTopPaddleCollision()) {
			pongBall.changeVX();
			pongBall.changeVY();
			}

	} 		
 };
 
 function PongCreateBall(startX,startY,startVX,startVY, R,G,B,A){
	
  this.x = startX;
  this.y = startY;
  this.vx = startVX;
  this.vy = startVY;
  this.radius = 25;
  this.colorR = R,
  this.colorG = G,
  this.colorB = B,
  this.colorA = A,
  
  this.draw = function() {
    pongContex.beginPath();
    pongContex.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    pongContex.closePath();
	
	var color = "rgba(" + this.colorR + ", " + this.colorG + ", " + this.colorB + ", " + this.colorA + ")";
    pongContex.fillStyle = color;
    pongContex.fill();
	
	pongContex.lineWidth = 1;
    pongContex.strokeStyle = 'rgba(5,5,5,0.1)';
    pongContex.stroke();
  };
  
  this.changeVX = function(){	this.vx = -this.vx;}
    this.changeVY = function(){	this.vy = -this.vy;}
  this.update = function()
	  {
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= 1.0001;
		this.vy *= 1.0001;
		
		if (this.y + this.vy > pongCanvas.height && typeof pongBotPaddle == 'undefined') {
			this.vy = -this.vy;
		}
		else if ( this.y + this.vy < 0 && typeof pongTopPaddle == 'undefined') {
			this.vy = -this.vy;
	    }
	  
		if (this.x + this.vx > pongCanvas.width && typeof pongRightPaddle == 'undefined') {
			this.vx = -this.vx;
		}   
		else if ( this.x + this.vx < 0 && typeof pongLeftPaddle == 'undefined') {
			this.vx = -this.vx;
		} 
  }
};
 
function PongCreatePaddle(startX,startY, orientation){
	
  this.x = startX;
  this.y = startY;
  this.orientation = orientation;
  
  if(orientation == "horizontal"){
	this.width = 100;
	this.height = 30;
  }
  if(orientation == "vertical"){
	this.width = 30;
	this.height = 100;
  }

  this.colorR = 0,
  this.colorG = 0,
  this.colorB = 0,
  this.colorA = 1,
  
  this.draw = function() {
	  
    pongContex.rect(this.x, this.y, this.width, this.height);
	
	var color = "rgba(" + this.colorR + ", " + this.colorG + ", " + this.colorB + ", " + this.colorA + ")";
    pongContex.fillStyle = color;
    pongContex.fill();
	
	pongContex.lineWidth = 1;
    pongContex.strokeStyle = 'rgba(5,5,5,0.1)';
    pongContex.stroke();
  };
  
  this.update = function()
	{
		   if(typeof pongLastMousePosition !== 'undefined') {
			   
			   if(orientation == 'horizontal'){
				   this.x = pongLastMousePosition.x;
			   }
			   
			   if(orientation == 'vertical'){
				   this.y = pongLastMousePosition.y;
			   }				
		}
		  
    }
};
 
function CheckPongBallStillOnScreen()
{
	if(pongrunning)
	{
		if(pongBall.y + pongBall.vy > pongCanvas.height){
			PongGameOver();
		}
			
	    if (pongBall.y + pongBall.vy < 0) {
			PongGameOver();
	    }
	  
		if (pongBall.x + pongBall.vx > pongCanvas.width) {
			PongGameOver();
		}
	  
		if (pongBall.x + pongBall.vx < 0) {
			PongGameOver();
		}
	} 		
 };

function PongEndGame()
{
	clearInterval(pongLoopReference);
}

function Pause(){
	pongGamePaused = true;
};
function UnPause(){
	pongGamePaused = false;
};

