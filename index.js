document.style.cursor = 'none';
document.onmousemove = = function() {handleMouseMove(event)};
var ctx;
var img;

function draw(){
	var ctx = document.getElementById('myCanvas').getContext('2d');
	var img = new Image();
	img.addEventListener("load", function() {
	}, false);
	img.src = 'ScorchedOwl.png';
	img.onload = function(){
		ctx.drawImage(img,0,0, img.width,img.height, 0,0,myCanvas.width, myCanvas.height);
}
}
function handleMouseMove(e){
	ctx.drawImage(img,e.clientX,e.clientY, img.width,img.height, e.clientX,e.clientY,myCanvas.width, myCanvas.height);
}
