var img1 = "url('customCursor.png'), auto";
var img2= "url('customCursor2.png'), auto";
var img3 = "url('customCursor3.png'), auto";
var mainContentDiv = document.getElementById('MainContent');

mainContentDiv.style.cursor = img1;
var counter = 0;
setInterval(function(){ 
	if(counter == 0)
        {
        	mainContentDiv.style.cursor = img1;
        	counter = 1;
        }
        else if(counter == 1)
        {
        	mainContentDiv.style.cursor = img2;
        	counter = 2;
        }
        else if(counter == 2)
        {
        	mainContentDiv.style.cursor = img3;
        	counter = 0;
        }
        else
        {
        	counter = 0;
        }
}, 1500);



