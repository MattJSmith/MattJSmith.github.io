var img = new Image();
var img2= new Image();
var img3 = new Image();
img.src = "customCursor.png"
img2.src = "customCursor2.png"
img3.src = "customCursor3.png"
document.documentElement.style.cursor = img1;
var counter = 0;
setInterval(function(){ 
	if(counter == 0)
        {
        	document.documentElement.style.cursor = img1;
        	counter = 1;
        }
        else if(counter == 1)
        {
        	document.documentElement.style.cursor = img2;
        	counter = 2;
        }
        else if(counter == 2)
        {
        	document.documentElement.style.cursor = img3;
        	counter = 0;
        }
        else
        {
        	counter = 0;
        }
}, 300);

/* function draw(){
	var ctx = document.getElementById('myCanvas').getContext('2d');
	var img = new Image();
	img.addEventListener("load", function() {
	}, false);
	img.src = 'ScorchedOwl.png';
	img.onload = function(){
		ctx.drawImage(img,0,0, img.width,img.height, 0,0,myCanvas.width, myCanvas.height);
} */



