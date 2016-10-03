var canvas = document.getElementById('ballStage');
var contex = canvas.getContext('2d');

var raf; // request animation frame
var running = false;

var currentScore = 0;
var highestScore = 0;

var mainText = new textObject("Cursor Dodge!",'green',10,30,20);
var instructionText = new textObject("Click to begin!",'black',10,80,35);
var loseText = new textObject("You lost!",'red',250,150,50);
var scoreText = new textObject("Current score: " + currentScore + "  | Best Attempt: " + highestScore ,'black',260,30,20);

var ball1 = new newBall(300,150,5,1,randomHexColour());
var ball2 = new newBall(400,050,-4,1,randomHexColour());
var ball3 = new newBall(450,250,1,-2,randomHexColour());

var ballArray = [ball1,ball2,ball3]; //only lines needed to add more balls

var timedAreaFunction;

mainText.draw();
scoreText.draw();
instructionText.draw();
  
 ballArray.forEach(function(ballItem){
	ballItem.draw();
});

function newBall(startX,startY,startVX,startVY,color){
  this.x = startX;
  this.y = startY;
  this.vx = startVX;
  this.vy = startVY;
  this.radius = 25;
  this.color = color,
  this.draw = function() {
    contex.beginPath();
    contex.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    contex.closePath();
    contex.fillStyle = this.color;
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

var Ticks_in_HalfSeconds = 0; //1 = 500ms
function timedArea()
{
	Ticks_in_HalfSeconds++;
	
	if(running)
	{
		currentScore++;
		scoreText.updateText("Current score: " + currentScore + "  | Best Attempt: " + highestScore );
		
		if(Ticks_in_HalfSeconds == 8)
		{
			addNewBall();
			Ticks_in_HalfSeconds = 0;
		}
	}
	else{
		
		Ticks_in_HalfSeconds = 0;
	}
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

		var colour = randomHexColour();
		var tempBall = new newBall(newX,newY,newVX,newVY,colour);
		
		ballArray.push(tempBall);	
	}
}

function textObject(fillText,colour,x,y,textSize)
{
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

function randomHexColour()
{
	var outcome = "#";
	var possible = "0123456789ABCDEF";
	
	for( var i=0; i < 6; i++ ){	
		outcome += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	
	return outcome;
	
}

function draw() {

  clear();
  
  mainText.draw();

  scoreText.draw();
  
  ballArray.forEach(function(ballItem){
	  ballItem.draw();
	  ballItem.update();
  });
  
  raf = window.requestAnimationFrame(draw);
}

function gameOver()
{
	if(running == false)
	{
		return;
	}
	background();
	running = false;
	instructionText.draw();
	loseText.draw();

	whileNotRunning();
	
	ballArray = [ball1,ball2,ball3];

	if(currentScore > highestScore){highestScore = currentScore;}
	
	currentScore = 0;

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

function collision(x1,y1,x2,y2,tolerance)
{
  if(x1 <= (x2 + tolerance) && x1 >= (x2 - tolerance) && y1 <= (y2 + tolerance) && y1 >= (y2 - tolerance))
  {
	return true;
  }
  else{
  
	return false;
  }
}

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
  var boundry = 20;
  
	var pos = getMousePos(canvas,e);
	
	ballArray.forEach(function(ballItem){

	var tol = 18;
	var halfTol = tol/2;
	
    if(running && collision(ballItem.x + halfTol, ballItem.y + halfTol, pos.x, pos.y, tol) == true)
	{
		gameOver();
	} 
  });
  }
});

canvas.addEventListener("mouseout", function(e) {

		gameOver();
  
});

canvas.addEventListener("click", function(e) {
  if (!running) {
	  
    raf = window.requestAnimationFrame(draw);
    running = true;
	
    whileRunning();
  }
});

function whileRunning()
{
	timedAreaFunction = setInterval(timedArea, 500);
}

function whileNotRunning()
{
	clearInterval(timedAreaFunction);
}

