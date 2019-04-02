//STRETCH GOALS

	//random board generator
		//works, just needs controls from user / function to randomize each property
	//custom board builder
	//select from boards
	//change colors for game?

var tileHeight = "100px"
var tilewidth ="100px"
var gameBoard = document.getElementById('game-board')
var rows = 7
var columns = 7
var exceptions = {
	columnsFromLeft:2,
	columnsFromRight:2,
	rowsFromTop:2,
	rowsFromBottom:2
};

//the starting empty spot
var startingPosition = Math.floor(rows/2)+"-"+Math.floor(columns/2)

//playerMove array stores what two pegs they have chosen
var playerMove = []
var player1 = []
var player2 = []
var score = 32
var tempPop
var foundMove = 0
drawBoard();



function drawBoard () {
	// Create Game Board based off #of tiles in rows and columns
	gameBoard.style.height = (rows * 100)+"px"
	gameBoard.style.width = (columns * 100)+"px"
	// console.log("gameBoard set to",gameBoard.style.width,"x",gameBoard.style.height)

	//loop through the rows, pass the row #through the func
	for (i=0; i < rows; i++){
			// console.log("DRAWING ROW #"+i)
			drawRow(i)
		}
}

function drawRow (rowNum){
	// Create Row
	var tileColumn = 0;
	for (var i = 0; i < columns; i++) {
		
		if (rowNum < exceptions.rowsFromTop && i<exceptions.columnsFromLeft || i > columns-exceptions.columnsFromRight-1 && rowNum < exceptions.rowsFromTop ){
			//checking from top, left and right
			// console.log("skipping column")
			tileColumn++
		
		} else if (rowNum >= rows-exceptions.rowsFromBottom && i<exceptions.columnsFromLeft || i > columns-exceptions.columnsFromRight-1 && rowNum >= rows - exceptions.rowsFromBottom ){
			//checking from bottom, left and right
			// console.log("skipping column part 2")
			tileColumn++
		
		} else {
			drawTile(i*100,rowNum*100,tileColumn, rowNum, 1)
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
	if (position == startingPosition){
		// style it empty
		aTile.setAttribute("class","tileEmpty")	
	}else {
		// style it full
		aTile.setAttribute("class","tilePeg")
	}
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
		// console.log("same tile, deselect")
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
		console.log(a)
		 
	// if it is the second click, turn off the glow
	} else if (a.getAttribute("class")=="tilePeg tileGlow"){
		//remove glow
		a.setAttribute("class","tilePeg")
		console.log(a)
		
	}
}

function checkMove (){

	// console.log(playerMove)
	//check if it's empty or not 
	//if it is empty, have they already selected a tile?
	// is this the first move?
	if (playerMove.length === 1){
		// console.log("This is the first move in turn")
	
	} else if (playerMove.length === 2) {
		// console.log("This is the SECOND move in turn")
		//make this a loop

		
		var playerMoveSorted = [...playerMove]
		playerMoveSorted.sort()

		var firstC = parseInt(playerMoveSorted[0].charAt(2))
		var firstR = parseInt(playerMoveSorted[0].charAt(0))
		var secondC = parseInt(playerMoveSorted[1].charAt(2))
		var secondR = parseInt(playerMoveSorted[1].charAt(0))

		//---

		//see if this is viable
		// console.log("colums equal:", firstC-secondC)
		// console.log("rows equal:", firstR-secondR)

		if (Math.abs((firstC - secondC)) === 2 && firstR == secondR){
		//checks horizontal
			// console.log("IT WORKED")
		//and do the class changes etc
			var middleTile = (secondR)+"-"+(firstC+1)

			// console.log("middle tile location:", middleTile)
			// console.log(document.getElementById(middleTile).getAttribute)

			if(document.getElementById(middleTile).getAttribute("class")=="tileEmpty"){
				// console.log("middle is empty")
				playerMove.pop()
				// console.log(playerMove)
				return;
			}else {
				removeTile(playerMove[0],playerMove[1],middleTile)
			}

		} else if(Math.abs((firstR - secondR)) === 2 && firstC == secondC){
			//checks vertical
			var middleTile = (firstR+1)+"-"+(secondC)

			// console.log("middle tile location:", middleTile)
			// console.log(document.getElementById(middleTile))

			if(document.getElementById(middleTile).getAttribute("class")=="tileEmpty"){
				// console.log("middle is empty")
				playerMove.pop()
				// console.log(playerMove)
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
	document.getElementById('remaining').innerText = score
	
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
	// console.log(pegsLeft)
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

		if (foundMove === 1){
			// the moment we find a move, exit out of this loop, saving processing
		 	return;
		} 
	}
	// end of game function triggers here
	console.log("OUT OF MOVES")
	
}
function checkDirection(direction, directionTwo) {
	if (direction==null || directionTwo==null){
		//this needs to be detected, so it doesn't try and pass through the else if
		
	} else if (document.getElementById(direction.id).getAttribute("class")=="tilePeg" && document.getElementById(directionTwo.id).getAttribute("class")=="tileEmpty"){
		console.log(" has a move to the", direction)
		foundMove = foundMove + 1
	}
}
