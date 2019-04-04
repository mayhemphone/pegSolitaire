//Known Issues
	// javascript error in console calling gameOver from back button after low score
	// don't want to track low score unless original board

var tileSize = 100
var gameBoard = document.getElementById('game-board')
var scoreBoard = document.getElementById('scoreBoard')

var rows = 7
var columns = 7
var exceptions = {
	columnsFromLeft:2,
	columnsFromRight:2,
	rowsFromTop:2,
	rowsFromBottom:2
};

// the starting empty tile
var startingPosition = Math.floor(rows/2)+"-"+Math.floor(columns/2)

// playerMove array stores what two pegs they have chosen
var playerMove = []
var score 
var tempPop
var foundMove = 0
var retrievedScores 
//Draw the board
drawBoard();

//Set the reset button listener
document.getElementById('resetButton').addEventListener("click", removeBoard)
document.getElementById('randomButton').addEventListener("click", randomBoard)
document.getElementById('originalButton').addEventListener("click", originalBoard)

//Set the playAgain button listener
function originalBoard (){
	console.log("random")
	tileSize = 100
	playerMove = []
	gameBoard = document.getElementById('game-board')
	rows =  7
	columns = 7
	exceptions = {
		columnsFromLeft: 2,
		columnsFromRight: 2,
		rowsFromTop: 2,
		rowsFromBottom: 2
	}
	// the starting empty tile
	startingPosition = Math.floor(rows/2)+"-"+Math.floor(columns/2)
	console.log(startingPosition)
	drawBoard()
	console.log("random board")
}

function randomBoard (){
	// removeBoard()
	console.log("random")
	tileSize = 100
	playerMove = []
	gameBoard = document.getElementById('game-board')
	rows =  Math.floor(Math.random() * 4) + 4  
	columns = Math.floor(Math.random() * 4) + 4 
	exceptions = {
		columnsFromLeft: Math.ceil(Math.random()*Math.floor(columns/3)),
		columnsFromRight: Math.ceil(Math.random()*Math.floor(columns/3)),
		rowsFromTop: Math.ceil(Math.random()*Math.floor(rows/3)),
		rowsFromBottom: Math.ceil(Math.random()*Math.floor(rows/3))
	}
	// the starting empty tile

	startingPosition = (Math.floor(Math.random()*(rows-exceptions.rowsFromBottom-exceptions.rowsFromTop)) + exceptions.rowsFromTop)+"-"+(Math.floor(Math.random()*(columns-exceptions.columnsFromRight-exceptions.columnsFromLeft)) + exceptions.columnsFromLeft)
	drawBoard()
}

function removeBoard (){

	//reset a bunch of stuff
	gameBoard.innerHTML ="";
	playerMove = []
	score = 32
	document.getElementById('score').innerText = score
	foundMove = 0
	retrievedScores = ""
	scoresObject={}
	keysSorted={}
	//reset the scoreboard so it doesn't double up
	document.getElementById("scoreBoard").innerHTML = ""

	//hide game over screen

	//errors if game over screen isn't present

	var z = document.getElementsByClassName('gameOver')
	console.log(z)
	if (z[0]) {
		z[0].setAttribute("class","gameGoing");
	}
	drawBoard()
}

function drawBoard () {
	// quick reset just in case
	gameBoard.innerHTML ="";
	// Create Game Board based off #of tiles in rows and columns
	gameBoard.style.height = (rows * tileSize)+"px"
	gameBoard.style.width = (columns * tileSize)+"px"

	//loop through the rows, pass the row #through the func
	for (i=0; i < rows; i++){
			drawRow(i)
		}
	//set score
	score = document.getElementsByClassName('tilePeg').length
	document.getElementById('score').innerText = score
}

function drawRow (rowNum){
	// Create Row
	var tileColumn = 0;
	for (var i = 0; i < columns; i++) {
		
		if (rowNum < exceptions.rowsFromTop && i<exceptions.columnsFromLeft || i > columns-exceptions.columnsFromRight-1 && rowNum < exceptions.rowsFromTop ){
			//checking from top, left and right
			tileColumn++
		
		} else if (rowNum >= rows-exceptions.rowsFromBottom && i<exceptions.columnsFromLeft || i > columns-exceptions.columnsFromRight-1 && rowNum >= rows - exceptions.rowsFromBottom ){
			//checking from bottom, left and right
			tileColumn++
		
		} else {
			drawTile(i*tileSize,rowNum*tileSize,tileColumn, rowNum, 1)
			tileColumn++
			//place in an array here? or in drawtile func?  
			//Need to keep in mind what it's location is.  
			//Maybe able to scrape the position to assign values
		}
	}
}

function drawTile (left, top, column, row, peg){
	var position = row+"-"+column;

	// Create Tiles
	var aTile = document.createElement("div")
	aTile.setAttribute("Id",row+"-"+column)

	// Sets position based on draw row function
	aTile.setAttribute("style","left:"+left+"px;top:"+top+"px;")
	
	//Check to see if this is the starting empty spot
		console.log("position:",position)
		console.log("startingPosition:", startingPosition)


	if (position == startingPosition){
		// style it empty
		aTile.setAttribute("class","tileEmpty")	
	}else {
		// style it full
		aTile.setAttribute("class","tilePeg")
	}
	console.log("drawing:", position, "with: ",aTile.getAttribute("class"))
	// add event listener
	aTile.addEventListener("click", clicker)
	
	// Append that shit
	gameBoard.appendChild(aTile)
}

function clicker (){

	// is this an empty spot on first click, 
	// or is it a full spot on the second click?
	if (playerMove.length ===0 && this.getAttribute("class") === "tileEmpty" || 
		playerMove.length === 1 && this.getAttribute("class") === "tilePeg") {

		//if so, don't continue the function
		return;
	}

	//are they selecting two different tiles? 
	if (this.getAttribute('Id') === playerMove[0]){
		//deselect the tile
		this.setAttribute("class","tilePeg")
		playerMove = []
	}  else{
		// Store the click
		playerMove.push(this.getAttribute("Id"))
		
		// Make the selection glow
		selectTile(this)

		// Call function to check the second click
		checkMove()
	}
}

function selectTile (a) {
	// if it is the first click, make it glow
	if (a.getAttribute("class")=="tilePeg"){
		//apply glow style
		a.setAttribute("class","tilePeg tileGlow")
		 
	// if it is the second click, turn off the glow
	} else if (a.getAttribute("class")=="tilePeg tileGlow"){
		//remove glow
		a.setAttribute("class","tilePeg")
	}
}

function checkMove (){
	
	//check if it's empty or not 
	//if it is empty, have they already selected a tile?
	// is this the first move?
	if (playerMove.length === 1){
	
	} else if (playerMove.length === 2) {
		//make this a loop

		
		var playerMoveSorted = [...playerMove]
		playerMoveSorted.sort()

		var firstC = parseInt(playerMoveSorted[0].charAt(2))
		var firstR = parseInt(playerMoveSorted[0].charAt(0))
		var secondC = parseInt(playerMoveSorted[1].charAt(2))
		var secondR = parseInt(playerMoveSorted[1].charAt(0))

		//---

		//see if this is viable

		if (Math.abs((firstC - secondC)) === 2 && firstR == secondR){
		//checks horizontal
		//and do the class changes etc
			var middleTile = (secondR)+"-"+(firstC+1)

			if(document.getElementById(middleTile).getAttribute("class")=="tileEmpty"){
				playerMove.pop()
				return;
			}else {
				removeTile(playerMove[0],playerMove[1],middleTile)
			}

		} else if(Math.abs((firstR - secondR)) === 2 && firstC == secondC){
			//checks vertical
			var middleTile = (firstR+1)+"-"+(secondC)

			if(document.getElementById(middleTile).getAttribute("class")=="tileEmpty"){
				playerMove.pop()
				return;
			}else {
				removeTile(playerMove[0],playerMove[1],middleTile)
			}

		} else {
			playerMove.pop()
		}
	}
}

function removeTile (first, second, middle){
	//should only run if successfull checkMove
	
	//update the score
	score--
	document.getElementById('score').innerText = score
	
	// remove glow from both, and set empty on first and middle
	document.getElementById(first).setAttribute("class","tileEmpty")
	document.getElementById(middle).setAttribute("class","popped")
	document.getElementById(second).setAttribute("class","tilePeg")
	
	// after the pop css class finishes animation, change it to tileEmpty
	// have to pass middle data through a variable, set timeout does not allow
	tempPop = middle
	setTimeout(popped, 300)
	
	playerMove = []
	setTimeout(remainingMoves, 300)
}

function popped (){
	document.getElementById(tempPop).setAttribute("class","tileEmpty")
}

//----- stretch functions

function remainingMoves (){
	//get all the pegs on the board
	var pegsLeft = document.getElementsByClassName('tilePeg')
	// set foundMove to zero at the start of the turn.
	foundMove = 0
	//loop through each, but exit out if a move is found.
	for (i=0;i<pegsLeft.length;i++){

		var thisC = parseInt(pegsLeft[i].id.charAt(2))
		var thisR = parseInt(pegsLeft[i].id.charAt(0))
		
		var left = document.getElementById((thisR)+'-'+(thisC-1))
		var right = document.getElementById((thisR)+'-'+(thisC+1))
		var up = document.getElementById((thisR-1)+'-'+(thisC))
		var down = document.getElementById((thisR+1)+'-'+(thisC))

		var leftTwo = document.getElementById((thisR)+'-'+(thisC-2))
		var rightTwo = document.getElementById((thisR)+'-'+(thisC+2))
		var upTwo = document.getElementById((thisR-2)+'-'+(thisC))
		var downTwo = document.getElementById((thisR+2)+'-'+(thisC))

		checkDirection(left, leftTwo)
		checkDirection(right, rightTwo)
		checkDirection(up, upTwo)
		checkDirection(down, downTwo)

		if (foundMove >= 1){
			// the moment we find a move, exit out of this loop, saving processing
		 	return;
		} 
	}
	// end of game function triggers here
	console.log("OUT OF MOVES")
	//lets check against lowest scores
	getScores()	
}

function checkDirection(direction, directionTwo) {
	if (direction==null || directionTwo==null){
		//this needs to be detected, so it doesn't try and pass through the else if
		
	} else if (document.getElementById(direction.id).getAttribute("class")=="tilePeg" && document.getElementById(directionTwo.id).getAttribute("class")=="tileEmpty"){
		console.log(" has a move to the", direction)
		foundMove = foundMove + 1
	}
}

//----game over stuff

function gameOver (){
	// show the game over div
	var x = document.getElementsByClassName('gameGoing')
	x[0].setAttribute("class","gameOver")
	
	document.getElementById('playAgain').addEventListener("click", removeBoard)	
	document.getElementById('lowScore').addEventListener("click", lowScores)
}
function getScores (){

	score = document.getElementsByClassName('tilePeg').length
	console.log(score)

	document.getElementById('score').innerText = score
	document.getElementById('final').innerText = "Pieces remaining: " + score

	// Retrieve the object from storage
	retrievedScores = localStorage.getItem('scores');
	
	//parse string into an object
	scoresObject = JSON.parse(retrievedScores)

	//sort by lowest score
	keysSorted = Object.keys(scoresObject).sort(function(a,b){return scoresObject[b]-scoresObject[a]})

	console.log('keysSorted: ', keysSorted);

	var z
	var foundLowScore = 0
	var c = 0
	Object.keys(scoresObject).forEach(function(e) {
		z = scoresObject[e]
		console.log("z = ",z)
		c++
		console.log("c:",c)
		if (score < z && foundLowScore === 0){ 
			console.log("New low score")

			// input name for low score
			foundLowScore++

			lowScores(1)
			inputScore()
			printScore(e + " " + scoresObject[e])
			//pushes new high score on inputscore submit


		} else if(c == Object.keys(scoresObject).length){
			console.log("no low scores found")
			gameOver()

		} else {
			console.log('score is not a lowscore')
			// gameOver()
			// print low scores
			printScore(e + " " + scoresObject[e])

			console.log(Object.keys(scoresObject).length)
		} 

	});
}

function lowScores(e){
	console.log("lowscore", e)

	if (e !=1 ) {
		// hide the play again screen
		var x = document.getElementsByClassName('gameOver')
		x[0].setAttribute("class","gameGoing")
	}

	//show low scores
	var y = document.getElementsByClassName('gameGoing2')
	y[0].setAttribute("class","lowScoreScreen")

	//assign func to back button
	document.getElementById('back').addEventListener("click", back )	
}

function back (){
	var y = document.getElementsByClassName('lowScoreScreen')
	y[0].setAttribute("class","gameGoing2")
	gameOver()
}

function printScore (score){
	var aScore = document.createElement("li")
	aScore.innerText = score
	scoreBoard.appendChild(aScore)
}

function inputScore (){
	var aScore = document.createElement("li")
	aScore.setAttribute("Id","lowScoreLi")
	aScore.innerHTML = "<input type='text' autofocus='true' placeholder='You set a new low score!' Id='lowScoreInput'>"
	scoreBoard.appendChild(aScore)
	document.getElementById('lowScoreInput').addEventListener('keypress', function (e) {
	    var key = e.which || e.keyCode;
	    if (key === 13) { 
	    	scoreBoard.removeChild(lowScoreLi)
	    	printScore(this.value + " " + score)
	    	newName = this.value
	    	//push new high score.
	    	scoresObject[newName] = score;
			console.log(scoresObject)
			localStorage.setItem('scores', JSON.stringify(scoresObject))

	    	// stretch check length of local storage, then push one up, and pop one if over 5

	    	
    	}
	});
}

function pushData (){
	localStorage.clear()

	var scores = { 'Justin': 23, 'Samantha': 8, 'Nathan': 3 };

	// Put the object into storage
	localStorage.setItem('scores', JSON.stringify(scores));
}
