var img1 = "url('customCursor.png'), auto";
var img2 = "url('customCursor2.png'), auto";
var img3 = "url('customCursor3.png'), auto";
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



