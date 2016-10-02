var canvas = document.getElementById('ballStage');
var ctx = canvas.getContext('2d');

ctx.cur
var raf;
var running = false;

function newBall(startX,startY,startVX,startVY){ //turn into an object
  this.x = startX;
  this.y = startY;
  this.vx = startVX;
  this.vy = startVY;
  this.radius = 25;
  this.color = 'red',
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
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

var ball1 = new newBall(300,150,5,1);
var ball2 = new newBall(400,050,-4,1);
var ball3 = new newBall(450,250,1,-2);
var ball4 = new newBall(150,300,3,-1);
var ball5 = new newBall(50,200,2,-2);

var ballArray = [ball1,ball2,ball3,ball4,ball5]; //only lines needed to add more balls

var mainText = {
  draw: function() {
    ctx.font="20px Georgia";
	ctx.fillStyle = 'green';
	ctx.fillText("Cursor Dodge!",10,50);
  }
};

var instructionText = {
  draw: function() {
    ctx.font="20px Georgia";
	ctx.fillStyle = 'green';
	ctx.fillText("Click to begin!",10,80);
  }
};

var loseText = {
  draw: function() {
    ctx.font="20px Georgia";
	ctx.fillStyle = 'black';
	ctx.fillText("You lost!",150,50);
  }
};

function clear() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(0,0,canvas.width,canvas.height);


}

function background() {
  ctx.fillStyle = 'rgba(185, 185, 0, 0.3)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
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

	window.cancelAnimationFrame(raf);


	
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
function draw() {

  clear();
  mainText.draw();
  
  ballArray.forEach(function(ballItem){
  ballItem.draw();
  ballItem.update();
  });
  
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(e) {
  if (!running) {
    //clear();
    //ball.x = e.clientX;
    //ball.y = e.clientY;
    //ball.draw();
  }
  else
  {
  var boundry = 20;
  
  
  ballArray.forEach(function(ballItem){
  
    if(running && collision(ballItem.x,ballItem.y,e.clientX,e.clientY,20) == true)
	{
		gameOver();
	} 
  });
  
  

  }
});

canvas.addEventListener("click", function(e) {
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});

canvas.addEventListener("mouseout", function(e) {

		gameOver();
  
});

  instructionText.draw();
  
  ballArray.forEach(function(ballItem){
  
  ballItem.draw();
  
  });

