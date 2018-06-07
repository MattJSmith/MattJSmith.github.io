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

//underlying logic variables
var pongGameIntervalSpeed = 100; //in milliseconds

var pongTicks = 0; //counter based off the pongGameIntervalSpeed

var pongTimedAreaFunction;

//Start Game

PongInitialiseGame();

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
	
	var realMousePos = getMousePos(pongCanvas,e);
	PongStartButton(realMousePos);
  }
});

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

	  if (this.y + this.vy > pongCanvas.height || this.y + this.vy < 0) {
		this.vy = -this.vy;
	  }
	  if (this.x + this.vx > pongCanvas.width || this.x + this.vx < 0) {
		this.vx = -this.vx;
	  }
  }
};

function PongStartButtonDraw(){
	
	PongStartButtonText.draw();
	pongContex.rect(PongStartButtonRectangleX,PongStartButtonRectangleY,PongStartButtonRectangleWidth,PongStartButtonRectangleHeight);
	pongContex.stroke(); 
}

function PongGameRunning()
{
	if(pongrunning)
	{
		pongTicks++;
		PongMouseCollisionCheck();
		
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
	if(pongrunning && typeof variable !== 'undefined')
	{
		var newX = Math.floor(Math.random() * 400) + 50;
		var newY = Math.floor(Math.random() * 250) + 50;
		var newVX = Math.floor(Math.random() * 7) - 4;
		var newVY = Math.floor(Math.random() * 7) - 4;

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

function PongGameDraw() {

  PongClear();
  
  pongBall.draw();
  pongBall.update();
  
  pongmainText.draw();

  pongscoreText.draw();
  
  pongraf = window.requestAnimationFrame(PongGameDraw);
}

function PongGameOver()
{
	if(pongrunning == false)
	{
		return;
	}
	
	PongBackground();
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
  pongContex.fillStyle = 'rgba(255, 255, 255, 0.3)';
  pongContex.fillRect(0,0,pongCanvas.width,pongCanvas.height);
}

function PongBackground() {
  pongContex.fillStyle = 'rgba(185, 185, 0, 0.3)';
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
	
function PongMouseCollisionCheck()
{
	var tol = 0; //not used	
	if(pongrunning /*&& PongBallCollision(pongLastMousePosition.x, pongLastMousePosition.y, pongBall.x, pongBall.y, pongBall.radius, tol) == true*/)
	{
		PongGameOver();
	} 
		
  };

function PongStartGame()
{
	pongTimedAreaFunction = setInterval(PongGameRunning, pongGameIntervalSpeed);
	PongSpawnBall();
}

function PongEndGame()
{
	clearInterval(pongTimedAreaFunction);
}

function PongStartButton(e)
{	
	if(e.x > PongStartButtonRectangleX && e.x < (PongStartButtonRectangleX + PongStartButtonRectangleWidth) && e.y > PongStartButtonRectangleY && e.y < (PongStartButtonRectangleY + PongStartButtonRectangleHeight) )
	{
		PongGameDraw();
		pongrunning = true;
	
		PongStartGame();
	}
}

