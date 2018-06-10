var pongCanvas = document.getElementById('SoloPong');
var pongContex = pongCanvas.getContext('2d');
var pongraf; // request animation frame

//actual game objects and game logic variables
var pongrunning = false;

var pongLastMousePosition;

var pongCurrentScore = 0;
var ponghighScore = 0;

var pongmainText = new PongTextObjects("Solo Pong!",'black',10,30,20);

var PongStartButtonRectangleX = 180;
var PongStartButtonRectangleY = 110;
var PongStartButtonRectangleWidth = 250;
var PongStartButtonRectangleHeight = 60;
var PongStartButtonText = new PongTextObjects("Begin!",'black',190,150,35);

var pongLoseText = new PongTextObjects("You lost!",'red',200,80,50);
var pongscoreText = new PongTextObjects("Current score: " + pongCurrentScore + "  | Best Attempt: " + ponghighScore ,'black',240,30,20);

var pongBall;

var paddleCount

var pongBotPaddle;
var pongTopPaddle;
var pongLeftPaddle;
var pongRightPaddle;

//Have a Choice of how many paddles (one per wall).
//Draw an outline on walls without paddles to show the ball will bounce off of these
//Set ammount of paddles/ saftey walls by a button like other game


var backgroundColour = 'rgba(200, 225, 225, 1)';

//underlying logic variables
var pongGameIntervalSpeed = 100; //in milliseconds

var pongTicks = 0; //counter based off the pongGameIntervalSpeed

var pongTimedAreaFunction;

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
		PongGameOver();
});

pongCanvas.addEventListener("click", function(e) {
	
  if (!pongrunning) {
	pongLastMousePosition = getMousePos(pongCanvas,e);	  
	
	var currentPositionOnClick = getMousePos(pongCanvas,e);
	PongStartButton(currentPositionOnClick);
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
	
	if(typeof variable !== 'undefined') {
		pongBall.draw();
	}

	pongmainText.draw();
	pongscoreText.draw();	
	PongStartButtonDraw();
}

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
  
  this.update = function()
	  {
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= 1.0001;
			this.vy *= 1.0001;
		
		//Do this if collision with paddle
	
			
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

function PongStartButton(e)
{	
	if(e.x > PongStartButtonRectangleX && e.x < (PongStartButtonRectangleX + PongStartButtonRectangleWidth) && e.y > PongStartButtonRectangleY && e.y < (PongStartButtonRectangleY + PongStartButtonRectangleHeight) )
	{	
		pongrunning = true;	
		
		PongStartGame();

		PongGameBeginDrawing();
	
	}
}

function PongGameBeginDrawing() {
  
  PongClear();
  
  pongTopPaddle.draw();
  pongTopPaddle.update();
  
  pongBall.draw();
  pongBall.update();
  
  pongmainText.draw();

  pongscoreText.draw();
  
  pongraf = window.requestAnimationFrame(PongGameBeginDrawing); //Recursive - This is the drawing loop
 
}

function PongStartGame()
{
	pongTimedAreaFunction = setInterval(PongGameRunningLoop, pongGameIntervalSpeed); //This loops on interval
	
	PongSpawnBall();
	
	pongTopPaddle = new PongCreatePaddle(10,10, "horizontal");
	
}

function PongStartButtonDraw(){
	
	PongStartButtonText.draw();
	pongContex.rect(PongStartButtonRectangleX,PongStartButtonRectangleY,PongStartButtonRectangleWidth,PongStartButtonRectangleHeight);
	pongContex.stroke(); 
}

function PongGameRunningLoop()
{
	if(pongrunning)
	{
		pongTicks++;
		//PongCollisionWithPaddle();
		CheckPongBallStillOnScreen();
		if(PongCheckMilliSeconds(200))
		{
			pongCurrentScore += 1;
			
			if(pongCurrentScore > ponghighScore){ponghighScore = pongCurrentScore;}
			
			pongscoreText.updateText("Current score: " + pongCurrentScore + "  | Best Attempt: " + ponghighScore );
			pongTicks = 0;
		}		
	}
}

function PongCheckMilliSeconds(time) //returns pongTicks based on milliseconds you want
{
	var result = (pongTicks % (time / pongGameIntervalSpeed));
	
	if(result == 0){return true;}
	return false;
}

function PongSpawnBall()
{
	if(pongrunning )
	{
		var newX = Math.floor(Math.random() * 300) + 50;
		var newY = Math.floor(Math.random() * 150) + 50;
		var newVX = Math.floor(3) ;
		var newVY = Math.floor(2) ;

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
	PongStartButtonDraw();
	
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
  pongContex.fillStyle = backgroundColour;
  pongContex.fillRect(0,0,pongCanvas.width,pongCanvas.height);
}

function PongBallCollision(otherX,otherY,ballX,ballY, ballRadius, tolerance)
{
	var radius = ballRadius + tolerance; //fairer collision
	
  if(otherX <= (ballX + radius) && otherX >= (ballX - radius) && otherY <= (ballY + radius) && otherY >= (ballY - radius))
  {
	return true;
  }
  else{
  
	return false;
  }
}
	
function PongCollisionWithPaddle()
{
	var tol = 0; 
	
	if(pongrunning)
	{
		//if(collide reverse ball velocity)
		
		PongGameOver();
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
		  
	

		//Do this if collision with paddle
/*	  if (this.y + this.vy > pongCanvas.height || this.y + this.vy < 0) {
		this.vy = -this.vy;
	  }
	  if (this.x + this.vx > pongCanvas.width || this.x + this.vx < 0) {
		this.vx = -this.vx;
	  } */
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
	clearInterval(pongTimedAreaFunction);
}


