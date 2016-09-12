var counter = 0;
setInterval(function(){ 
	if(counter == 0)
        {
        	document.documentElement.getElementsByName().style.cursor = "url('customCursor.png'), auto";
        	counter = 1;
        }
        if(counter == 1)
        {
        	document.documentElement.getElementsByName().style.cursor = "url('customCursor2.png'), auto";
        	counter = 2;
        }
        if(counter == 2)
        {
        	document.documentElement.getElementsByName().style.cursor = "url('customCursor2.png'), auto";
        	counter = 0;
        }
}, 3000);

/* function draw(){
	var ctx = document.getElementById('myCanvas').getContext('2d');
	var img = new Image();
	img.addEventListener("load", function() {
	}, false);
	img.src = 'ScorchedOwl.png';
	img.onload = function(){
		ctx.drawImage(img,0,0, img.width,img.height, 0,0,myCanvas.width, myCanvas.height);
} */



