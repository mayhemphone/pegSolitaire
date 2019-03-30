document.addEventListener('DOMContentLoaded', function(){
	console.log('Loaded the JS')
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

drawBoard();


// Create Game Board based off #of tiles in rows and columns

function drawBoard () {
	gameBoard.style.height = (rows * 100)+"px"
	gameBoard.style.width = (columns * 100)+"px"
	console.log("gameBoard set to",gameBoard.style.width,"x",gameBoard.style.height)

	//loop through the rows, pass the row #through the func
	for (i=0; i < rows; i++){
			console.log("DRAWING ROW #"+i)
			drawRow(i)

		}
}

// if rowNum < exceptions.rowsFromTop
// draw modified row

// if rowNum > rows - exceptions.rowsFromBottom
// draw modified row

// else
// draw full rows 


function drawRow (rowNum){
	// Create Row
	
	for (var i = 0; i < columns; i++) {
		
		if (rowNum < exceptions.rowsFromTop && i<exceptions.columnsFromLeft || i > columns-exceptions.columnsFromRight-1 && rowNum < exceptions.rowsFromTop ){
			//checking from top
			console.log("skipping column")
		
		} else if (rowNum >= rows-exceptions.rowsFromBottom && i<exceptions.columnsFromLeft || i > columns-exceptions.columnsFromRight-1 && rowNum >= rows - exceptions.rowsFromBottom ){
			//checking from bottom
			console.log("skipping column part 2")
		
		} else {
			drawTile(i*100,rowNum*100)
			//place in an array here? or in drawtile func?  
			//Need to keep in mind what it's location is.  
			//Maybe able to scrape the position to assign values

		}
	}
}

function drawTile (left, top){
	// Create Tiles
	console.log("drawing tile")
	var aTile = document.createElement("div")
	aTile.setAttribute("class","tile")
	aTile.setAttribute("style","left:"+left+"px;top:"+top+"px;")
	gameBoard.appendChild(aTile)

	//adding it to an array as an object that includes use data


}