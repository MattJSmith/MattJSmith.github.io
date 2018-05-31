var canvas = document.getElementById('ballStage');
var contex = canvas.getContext('2d');
var raf; // request animation frame
var pongCanvas = document.getElementById('SoloPong');
var pongContex = pongCanvas.getContext('2d');
var pongraf; // request animation frame

//***** Canvas Dodge Variables *****
//actual game objects and game logic variables
var running = false;

var currentScore = 0;
var highestScore = 0;

var difficulty = 1;

var mainText = new textObject("Cursor Dodge!",'black',10,30,20);

var startRectX = 180;
var startRectY = 110;
var startRectWidth = 250;
var startRectHeight = 60;

var difRectX = 180;
var difRectY = 200;
var difRectWidth = 250;
var difRectHeight = 60;

var startButtonText = new textObject("Click to begin!",'black',190,150,35);
var difficultyButtonText = new textObject("level: " + difficulty,'black',190,250,35);

var loseText = new textObject("You lost!",'red',200,80,50);
var scoreText = new textObject("Current score: " + currentScore + "  | Best Attempt: " + highestScore ,'black',240,30,20);

var ballSpawnSpeedSeconds;
var ballSpawnRadius;
var scoreDifficultyMultiplier;
var ballSafeTIme;

//underlying logic variables
var gameIntervalSpeed = 100; //in milliseconds

var ticks = 0; //counter based off the gameIntervalSpeed

var timedAreaFunction;

var lastMousePos; //Position of mouse from last movement event

//code starts here
setDifficulty(1);

var ballArray = []; //only lines needed to add more balls

//***** SOLO PONG VARIABLES *****
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

initialiseGame();

PongInitialiseGame();

function  getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect(); // abs. size of element

  return {
    x: (e.clientX - rect.left),   // scale mouse coordinates after they have
    y: (e.clientY - rect.top)     // been adjusted to be relative to element
  }
};

canvas.addEventListener('mousemove', function(e) {
  if (running) 
  {
	lastMousePos = getMousePos(canvas,e);
  }
});

canvas.addEventListener("mouseout", function(e) {

		gameOver();
  
});

canvas.addEventListener("click", function(e) {
	
  if (!running) {
	
	var realMousePos = getMousePos(canvas,e);
	startButton(realMousePos);
	
	difficultyButton(realMousePos);
  }
});
function mouseCollisionCheck()
{
	ballArray.forEach(function(ballItem){
		if(ballItem.spawnPeriodOver == false)
		{
			if(checkMilliSeconds(ballItem.spawnNoDamageMilliSeconds))
			{
						ballItem.spawnPeriodOver = true;
						ballItem.colorA = 0.8;
			}
		}
		else
		{
			var tol = 0; //not used	
			if(running && ballCollision(lastMousePos.x, lastMousePos.y, ballItem.x, ballItem.y, ballItem.radius, tol) == true)
			{
				gameOver();
			} 
		}
  });
}

function setDifficulty(newDifficulty)
{
	difficulty = newDifficulty;
	
	if(difficulty == 1)
	{
		ballSafeTIme = 2000;
		ballSpawnSpeedSeconds = 4;
		ballSpawnRadius = 25;
		scoreDifficultyMultiplier = 1;
		
	}
	if(difficulty == 2)
	{
		ballSafeTIme = 2000;
		ballSpawnRadius = 35;
		ballSpawnSpeedSeconds = 3;
		scoreDifficultyMultiplier = 1;
	}
	
	if(difficulty == 3)
	{
		ballSafeTIme = 1500;
		ballSpawnRadius = 40;
		ballSpawnSpeedSeconds = 2;
		scoreDifficultyMultiplier = 2;
	}
	if(difficulty == 4)
	{
		ballSafeTIme = 1000;
		ballSpawnRadius = 15;
		ballSpawnSpeedSeconds = 1;
		scoreDifficultyMultiplier = 2;
	}
}


function initialiseGame()
{
	 ballArray.forEach(function(ballItem){
		ballItem.draw();
	});

	mainText.draw();
	scoreText.draw();
	
	startButtonDraw();
	difficultyButtonDraw();
}

function newBall(startX,startY,startVX,startVY,startRadius, R,G,B,A, startSpawnSafeTime){
  this.x = startX;
  this.y = startY;
  this.vx = startVX;
  this.vy = startVY;
  this.radius = startRadius;
  this.colorR = R,
  this.colorG = G,
  this.colorB = B,
  this.colorA = A,
  this.spawnNoDamageMilliSeconds = startSpawnSafeTime;
  this.spawnPeriodOver = false;
  
  this.draw = function() {
    contex.beginPath();
    contex.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    contex.closePath();
	
	var color = "rgba(" + this.colorR + ", " + this.colorG + ", " + this.colorB + ", " + this.colorA + ")";
    contex.fillStyle = color;
    contex.fill();
	
	contex.lineWidth = 1;
    contex.strokeStyle = 'rgba(5,5,5,0.1)';
    contex.stroke();
  };
  this.update = function()
  {
    this.x += this.vx;
  this.y += this.vy;

  if (this.y + this.vy > canvas.height || this.y + this.vy < 0) {
    this.vy = -this.vy;
  }
  if (this.x + this.vx > canvas.width || this.x + this.vx < 0) {
    this.vx = -this.vx;
  }
  }
};

function difficultyButtonDraw()
{
	difficultyButtonText.draw();
	contex.rect(startRectX,startRectY,startRectWidth,startRectHeight);
	contex.stroke(); 
}

function startButtonDraw(){
	
	startButtonText.draw();
	contex.rect(difRectX,difRectY,difRectWidth,difRectHeight);
	contex.stroke(); 
}

function gameRunning()
{
	ticks++;
	
	if(running)
	{
		mouseCollisionCheck();
		
		if(checkMilliSeconds(200))
		{
			currentScore += scoreDifficultyMultiplier;
			
			if(currentScore > highestScore){highestScore = currentScore;}
			
			scoreText.updateText("Current score: " + currentScore + "  | Best Attempt: " + highestScore );
		}
		
		if(checkSeconds(ballSpawnSpeedSeconds))
		{
			addNewBall();
			ticks = 0;
		}
	}
	else{
		
		ticks = 0;
	}
}

function checkSeconds(time) //returns time - 1ms = 1 tick
{
	var result = (ticks % (time * (1000 / gameIntervalSpeed)));
	if(result == 0){return true;}
	return false;
}

function checkMilliSeconds(time) //returns ticks based on milliseconds you want
{
	var result = (ticks % (time / gameIntervalSpeed));
	
	if(result == 0){return true;}
	return false;
}

function addNewBall()
{
	if(running)
	{
		var newX = Math.floor(Math.random() * 400) + 50;
		var newY = Math.floor(Math.random() * 250) + 50;
		var newVX = Math.floor(Math.random() * 7) - 4;
		var newVY = Math.floor(Math.random() * 7) - 4;

		if(newVX == 0){ newVX = 1;}
		if(newVY == 0){ newVY = 1;}

		//var colour = randomHexColour();
		
		var r = randon255ForColour();
		var g = randon255ForColour(r);
		var b = randon255ForColour(g);
		var a = 0.1;
		
		var tempBall = new newBall(newX,newY,newVX,newVY,ballSpawnRadius,r,g,b,a,ballSafeTIme);
		
		ballArray.push(tempBall);	
	}
}

function textObject(fillText,colour,x,y,textSize)
{
	this.x = x;
	this.y = y;
	this.viewingText= fillText;
	
	this.draw = function() {
		contex.font= textSize + "px Georgia";
		contex.fillStyle = colour;
		contex.fillText(this.viewingText,x,y);	
	};
	this.updateText = function(newText)
	{
			this.viewingText = newText;
	}
};

function randon255ForColour(prevColour = 0)
{	
	var boundry = prevColour + 5;
	
	var botHalf = Math.floor((Math.random() * 255 - prevColour)) + prevColour;
	var topHalf = Math.floor((Math.random() * 255 + prevColour)) - prevColour;

	var coinFlip = Math.floor(Math.random());
	
	if(coinFlip == 0) {return botHalf;}
	
	return topHalf;
}

function randomHexColour()
{
	var outcome = "#";
	var possible = "0123456789ABCDEF";
	
	for( var i=0; i < 6; i++ ){	
		outcome += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	
	return outcome;
	
}

function canvasDodgeGameDraw() {

  clear();
  
  ballArray.forEach(function(ballItem){
	  ballItem.draw();
	  ballItem.update();
  });
  
  mainText.draw();

  scoreText.draw();
  
  raf = window.requestAnimationFrame(canvasDodgeGameDraw);
}

function gameOver()
{
	if(running == false)
	{
		return;
	}
	
	background();
	running = false;
	startButtonDraw();
	difficultyButtonDraw();
	
	loseText.draw();

	endGame();
	
	ballArray = [];

	if(currentScore > highestScore){highestScore = currentScore;}
	
	currentScore = 0;
	
	scoreText.updateText("Current score: " + currentScore + "  | Best Attempt: " + highestScore );
	
	window.cancelAnimationFrame(raf);
}


function clear() {
  contex.fillStyle = 'rgba(255, 255, 255, 0.3)';
  contex.fillRect(0,0,canvas.width,canvas.height);
}

function background() {
  contex.fillStyle = 'rgba(185, 185, 0, 0.3)';
  contex.fillRect(0,0,canvas.width,canvas.height);
}

function ballCollision(otherX,otherY,ballX,ballY, ballRadius, tolerance)
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


	
function startGame()
{
	timedAreaFunction = setInterval(gameRunning, gameIntervalSpeed);
	addNewBall();
	addNewBall();
}

function endGame()
{
	clearInterval(timedAreaFunction);
}

function difficultyButton(e)
{	
	
	if(e.x > difRectX && e.x < (difRectX + difRectWidth) && e.y > difRectY && e.y < (difRectY + difRectHeight) )
	{
		//do stuff	
		if(difficulty >= 4)
		{
			difficulty = 1;		
		}
		else
		{
			difficulty++;
		}
		
		setDifficulty(difficulty);
		
		canvasDodgeGameDraw();
		contex.clearRect(difRectX, difRectY, difRectWidth, difRectHeight);
		difficultyButtonText.updateText("level: " + difficulty);
		difficultyButtonText.draw();
		window.cancelAnimationFrame(raf);
	}
}

function startButton(e)
{	

	if(e.x > startRectX && e.x < (startRectX + startRectWidth) && e.y > startRectY && e.y < (startRectY + startRectHeight) )
	{
		canvasDodgeGameDraw();
		running = true;
	
		startGame();
	}
}

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

	if(pongCurrentScore > ponghighScore){ponghighScore = pongCurrentScore;}
	
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
	if(pongrunning && PongBallCollision(pongLastMousePosition.x, pongLastMousePosition.y, pongBall.x, pongBall.y, pongBall.radius, tol) == true)
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

