var counter = 0;
var id = setInterval(frame, 5);

function draw(){
	var ctx = document.getElementById('myCanvas').getContext('2d');
	var img = new Image();
	img.addEventListener("load", function() {
	}, false);
	img.src = 'ScorchedOwl.png';
	img.onload = function(){
		ctx.drawImage(img,0,0, img.width,img.height, 0,0,myCanvas.width, myCanvas.height);
}

function frame() {
    if (/* test for finished */) {
        clearInterval(id);
    } else {
        if(counter == 1)
        {
        	document.body.style.cursor = "url('customCursor.png'), auto";
        	counter = 0;
        }
        else
        {
        	document.body.style.cursor = "url('customCursor2.png'), auto";
        	counter = 1;
        }
    }
}
