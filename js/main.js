//STRETCH GOALS
	//alert with no more moves
		//has to push and pop out of array, and check each time what moves are avail
		//could also give hints too

	//random board generator
		//works, just needs controls from user / function to randomize each property
	//custom board builder
	//select from boards
	//animate the circle pop
		//works
	//change colors for game?


document.addEventListener('DOMContentLoaded', function(){
	// console.log('Loaded the JS')
})
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
	// console.log("drawing tile", position)
	var aTile = document.createElement("div")
	aTile.setAttribute("Id",row+"-"+column)

	// Sets position based on draw row function
	aTile.setAttribute("style","left:"+left+"px;top:"+top+"px;")
	
	//Check to see if this is the starting empty spot
	if (position == startingPosition){
		// console.log("THIS IS THE EMPTY ONE")
		aTile.setAttribute("class","tileEmpty")	

	}else {
		//style it full
		aTile.setAttribute("class","tilePeg")

	}
	//add event listener
	aTile.addEventListener("click", clicker)
	// Adding it to an array as an object that includes use data

	// Append that shit
	gameBoard.appendChild(aTile)
}

function clicker (){

	if (playerMove.length ===0 && this.getAttribute("class") === "tileEmpty" || 
		playerMove.length === 1 && this.getAttribute("class") === "tilePeg") {
		// console.log("Not an option")

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
	//TEMP turns on glow
	if (a.getAttribute("class")=="tilePeg"){
		//apply glow style
		a.setAttribute("class","tilePeg tileGlow")
		// console.log("clicked a tilepeg, now it is a:", a.getAttribute("class"))

	} else if (a.getAttribute("class")=="tilePeg tileGlow"){
		//remove glow
		a.setAttribute("class","tilePeg")
		// console.log("clicked a tile, now it is a:", a.getAttribute("class"))
		
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
			// console.log("nah son")
			playerMove.pop()
			// console.log(playerMove)
		}

			//if viable move, pop both out of the playerMove array
			
	}
}

function removeTile (first, second, middle){
	//should only run if successfull checkMove
	// console.log("removeTile")
	// console.log(first)
	// console.log(second)
	score--
	document.getElementById('remaining').innerText = score
	// console.log("score is now:",score)

	
	// remove glow from both, and set empty on first and middle
	document.getElementById(first).setAttribute("class","tileEmpty")
	// console.log(first, "is now empty")
	document.getElementById(second).setAttribute("class","tilePeg")
	// console.log(second, "is now filled")
	document.getElementById(middle).setAttribute("class","popped")
	tempPop = middle
	setTimeout(popped, 300)
	
	playerMove = []
	setTimeout(remainingMoves, 300)
	
	// update counter
	// detect for 1 piece left
	// STRETCH GOAL - check for remaining moves
}

function popped (){
	document.getElementById(tempPop).setAttribute("class","tileEmpty")
}


//----- stretch functions

function remainingMoves (){
	//get all the pegs on the board
	var pegsLeft = document.getElementsByClassName('tilePeg')
	console.log(pegsLeft)

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

	//can dry by making its own funciton and pass the direction and directionTwo
		// check left
		if (left==null || leftTwo==null){
			// console.log(pegsLeft[i].id," has a null left")
		} else if (document.getElementById(left.id).getAttribute("class")=="tilePeg" && document.getElementById(leftTwo.id).getAttribute("class")=="tileEmpty"){
			console.log((thisR)+'-'+(thisC)," has a move to the left")
			return;
		}
		// check right
		if (right==null || rightTwo==null){
			// console.log(pegsLeft[i].id," has a null left")
		} else if (document.getElementById(right.id).getAttribute("class")=="tilePeg" && document.getElementById(rightTwo.id).getAttribute("class")=="tileEmpty"){
			console.log((thisR)+'-'+(thisC)," has a move to the right")
			return;
		}
		// check up
		if (up==null || upTwo==null){
			// console.log(pegsLeft[i].id," has a null left")
		} else if (document.getElementById(up.id).getAttribute("class")=="tilePeg" && document.getElementById(upTwo.id).getAttribute("class")=="tileEmpty"){
			console.log((thisR)+'-'+(thisC)," has a move to the up")
			return;
		}
		
		// check down
		if (down==null || downTwo==null){
			// console.log(pegsLeft[i].id," has a null left")
		} else if (document.getElementById(down.id).getAttribute("class")=="tilePeg" && document.getElementById(downTwo.id).getAttribute("class")=="tileEmpty"){
			console.log((thisR)+'-'+(thisC)," has a move to the down")
			return;
		}
	}
	console.log("OUT OF MOVES")
}
