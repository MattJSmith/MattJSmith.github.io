	
window.onload = draw;
	
	function draw(){
		
        var canvas = document.getElementById('stage');
		var ctx = canvas.getContext('2d');
		

		for(i = 1; i <= 70; i+=10)
		{
			ctx.fillStyle = "rgba(" + i + ",0,0,0.8)";
			var t = i*2;
			ctx.fillRect (10 + t, 10 + t, 20, 20);
		}

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (0, 0, 180, 180);
		
	}	
