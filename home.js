var titleTextColour = "black";

var totalTags = 6;
//All Local storage values used in the program are: 
//uniqueID; lastDateCompleted; lastDateAccessed; tagID1;tagID2;tagID3;tagID4;tagID5;tagID6
checkLastDatePlayed();
checkLastDateCompleted();
checkForUniqueID();
allScanned();
	

for (i = 1; i <= totalTags; i++) { 
	checkTag(i);
}

function setupLocalStorageItem(key,value)
{
	localStorage.setItem(key,value);
}
function getLocalStorageItem(key)
{
	return localStorage.getItem(key);
}

//Working with cookies
function checkForUniqueID()
{
	if(getLocalStorageItem("uniqueID"))
	{
	}
	else
	{
		var now = new Date();
		var uniqueID = "" +now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
		setupLocalStorageItem("uniqueID",uniqueID);
	}
} 
//Check if the user has already completed the game today from a local storage variable containing date they last completed it
function checkLastDateCompleted()
{
	if(getLocalStorageItem("lastDateCompleted"))
	{
		var now = new Date();
		var fullDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
		if(localStorage.getItem("lastDateCompleted") == fullDate)
		{
				window.location.href = "gameover.html";
		}
	}
} 
//Checks the last date the user accessed the website, and if its not todays date, resets the results so they have to start again
function checkLastDatePlayed()
{
	var now = new Date();
	var todaysFullDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
	//checks if there is a value to begin with, as first time users wont have it stored.
	if(getLocalStorageItem("lastDateAccessed"))
	{
		//removes all tagID localstorage variables
		if(localStorage.getItem("lastDateAccessed") != todaysFullDate)
		{
			for (i = 1; i <= totalTags; i++) 
			{ 
				//makes sure value stored before attempting to remove
				if(getLocalStorageItem("tagID" + i))
				{
					localStorage.removeItem("tagID" + i);
				}
			}
		}
	}
	//sets the storage value to todays date after doing the check, to make sure its up to date.
	setupLocalStorageItem("lastDateAccessed",todaysFullDate)
} 

//checks to see if all the tags have localstorage values (to show they are scanned), and shows the game complete button
function allScanned()
{
	var allScannedFlag = "true";
	var i = 1;
	
	for (i = 1; i <= totalTags; i++) { 
		var tagID = "tagID"+i;
		if(!(getLocalStorageItem(tagID)))
		{
			allScannedFlag = "false";
		}
    }
    if(allScannedFlag == "true")
    {
    	document.getElementById("WelcomeMessage").innerHTML = "You found all the tags! Click below";
    	setInterval(function() { flashingText("WelcomeMessage",'yellow','gold') }, 1000);

    	//setting up the button to go to the "completed" page
    	var buttonnode= document.createElement('input');
		buttonnode.setAttribute('type','button');
		buttonnode.setAttribute('id','btn_Finish');
		buttonnode.setAttribute('value','Click Here to Complete');
		document.getElementById('MainContent').appendChild(buttonnode);
		document.getElementById("btn_Finish").onclick = function() 
		{
			setupLocalStorageItem("ls_completed","ls_completed");
        	location.href='http://nfctaghunt.github.io/complete.html';
    	} 
    	document.getElementById("btn_Finish").style.marginLeft = "46%";
    	document.getElementById("btn_Finish").style.marginBottom = "50px";

	    
	}
}

function checkTag(TagNum)
{
	var tagID = "tagID"+TagNum;
	if(getLocalStorageItem(tagID))
	{
		document.getElementById(tagID).innerHTML += "Tag " + TagNum + " was found!";
		document.getElementById(tagID).style.backgroundColor='#00FF55';
		setInterval(function() { flashingText(tagID,'blue','navy') }, 1000);

	}
	else
	{
		document.getElementById(tagID).innerHTML += "Try to find tag " +TagNum+".";
		document.getElementById(tagID).style.backgroundColor='transparent';
		setInterval(function() { flashingText(tagID,'navy','blue') }, 1000);
	}

}

function flashingText(element,colour1,colour2)
{	
	    var text = document.getElementById(element);
	    text.style.color = (text.style.color==colour1) ? colour2:colour1;
}