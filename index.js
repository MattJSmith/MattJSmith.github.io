function draw(){
	 var ctx = document.getElementById('myCanvas').getContext('2d');
	var img = new Image();
	img.addEventListener("load", function() {
	}, false);
	img.src = 'ScorchedOwl.png';
	img.onload = function(){
		
		ctx.drawImage(img,0,0, img.width,image.height, 0,0,myCanvas.width, myCanvas.height);
}
}
