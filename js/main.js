//Known Issues
// javascript error in console calling gameOver from back button after low score
// don't want to track low score unless original board

import { test } from "./drawBoard";

test();

let tileSize = 100;
let gameBoard = document.getElementById("game-board");
const scoreBoard = document.getElementById("scoreBoard");

// original board characteristics
let rows;
let columns;
let exceptions;

// the starting empty tile
let startingPosition = Math.floor(rows / 2) + "-" + Math.floor(columns / 2);

// playerMove array stores what two pegs they have chosen
let playerMove = [];
let score;
let tempPop;
let foundMove = 0;
let retrievedScores;

// test data pushed until I have a if statement for local storage
pushData();

//Draw the original board to start
originalBoard();

//Set the reset button listener
document.getElementById("resetButton").addEventListener("click", removeBoard);
document.getElementById("randomButton").addEventListener("click", randomBoard);
document
  .getElementById("originalButton")
  .addEventListener("click", originalBoard);

//Sets the original board characteristics
function originalBoard() {
  playerMove = [];
  gameBoard = document.getElementById("game-board");
  rows = 7;
  columns = 7;
  exceptions = {
    columnsFromLeft: 2,
    columnsFromRight: 2,
    rowsFromTop: 2,
    rowsFromBottom: 2,
  };

  // the starting empty tile
  startingPosition = Math.floor(rows / 2) + "-" + Math.floor(columns / 2);

  //draw it
  drawBoard();
}

function randomBoard() {
  playerMove = [];
  gameBoard = document.getElementById("game-board");
  rows = Math.floor(Math.random() * 4) + 4;
  columns = Math.floor(Math.random() * 4) + 4;
  exceptions = {
    columnsFromLeft: Math.ceil(Math.random() * Math.floor(columns / 3)),
    columnsFromRight: Math.ceil(Math.random() * Math.floor(columns / 3)),
    rowsFromTop: Math.ceil(Math.random() * Math.floor(rows / 3)),
    rowsFromBottom: Math.ceil(Math.random() * Math.floor(rows / 3)),
  };
  // the starting empty tile

  startingPosition =
    Math.floor(
      Math.random() *
        (rows - exceptions.rowsFromBottom - exceptions.rowsFromTop)
    ) +
    exceptions.rowsFromTop +
    "-" +
    (Math.floor(
      Math.random() *
        (columns - exceptions.columnsFromRight - exceptions.columnsFromLeft)
    ) +
      exceptions.columnsFromLeft);

  //draw it
  drawBoard();
}

function removeBoard() {
  // reset a bunch of stuff
  gameBoard.innerHTML = "";
  playerMove = [];
  score = 32;
  document.getElementById("score").innerText = score;
  foundMove = 0;
  retrievedScores = "";
  scoresObject = {};
  keysSorted = {};

  //reset the scoreboard so it doesn't double up
  document.getElementById("scoreBoard").innerHTML = "";

  //hide game over screen
  //errors if game over screen isn't present

  let z = document.getElementsByClassName("gameOver");
  console.log(z);
  if (z[0]) {
    z[0].setAttribute("class", "gameGoing");
  }
  drawBoard();
}

function drawBoard() {
  // clears out all of the tile divs from previous game
  gameBoard.innerHTML = "";

  // Create Game Board based off #of tiles in rows and columns + tileSize px
  gameBoard.style.height = rows * tileSize + "px";
  gameBoard.style.width = columns * tileSize + "px";

  //loop through the rows, pass the row # through the func
  for (i = 0; i < rows; i++) {
    drawRow(i);
  }

  //set starting score by counting tilePeg class references
  score = document.getElementsByClassName("tilePeg").length;
  document.getElementById("score").innerText = score;
}

function drawRow(rowNum) {
  // Create Row
  let tileColumn = 0;
  for (let i = 0; i < columns; i++) {
    //checking from top, left and right, skips drawTile if it's in exception zone
    if (
      (rowNum < exceptions.rowsFromTop && i < exceptions.columnsFromLeft) ||
      (i > columns - exceptions.columnsFromRight - 1 &&
        rowNum < exceptions.rowsFromTop)
    ) {
      tileColumn++;
      //checking from top, left and right, skips drawTile if it's in exception zone
    } else if (
      (rowNum >= rows - exceptions.rowsFromBottom &&
        i < exceptions.columnsFromLeft) ||
      (i > columns - exceptions.columnsFromRight - 1 &&
        rowNum >= rows - exceptions.rowsFromBottom)
    ) {
      tileColumn++;
    } else {
      drawTile(i * tileSize, rowNum * tileSize, tileColumn, rowNum, 1);
      tileColumn++;
    }
  }
}

function drawTile(left, top, column, row, peg) {
  let position = row + "-" + column;

  // Create Tiles
  let aTile = document.createElement("div");
  aTile.setAttribute("Id", row + "-" + column);

  // Sets position based on draw row function
  aTile.setAttribute("style", "left:" + left + "px;top:" + top + "px;");

  //Check to see if this is the starting empty spot

  if (position == startingPosition) {
    // style it empty
    aTile.setAttribute("class", "tileEmpty");
  } else {
    // style it full
    aTile.setAttribute("class", "tilePeg");
  }
  // add event listener
  aTile.addEventListener("click", clicker);

  // Append this complete tile
  gameBoard.appendChild(aTile);
}

function clicker() {
  // is this an empty spot on first click,
  // or is it a full spot on the second click?
  if (
    (playerMove.length === 0 && this.getAttribute("class") === "tileEmpty") ||
    (playerMove.length === 1 && this.getAttribute("class") === "tilePeg")
  ) {
    //if so, don't continue the function
    return;
  }

  //are they selecting two different tiles?
  if (this.getAttribute("Id") === playerMove[0]) {
    //same tile, deselect the tile
    this.setAttribute("class", "tilePeg");
    playerMove = [];
  } else {
    // Store the click
    playerMove.push(this.getAttribute("Id"));

    // Make the selection glow
    selectTile(this);

    // Call function to check the second click
    checkMove();
  }
}

function selectTile(a) {
  // if it is the first click, make it glow
  if (a.getAttribute("class") == "tilePeg") {
    //apply glow style
    a.setAttribute("class", "tilePeg tileGlow");

    // if it is the second click, turn off the glow
  } else if (a.getAttribute("class") == "tilePeg tileGlow") {
    //remove glow
    a.setAttribute("class", "tilePeg");
  }
}

function checkMove() {
  // check if it's empty or not
  // if it is empty, have they already selected a tile?

  // is this the first move?
  if (playerMove.length === 1) {
  } else if (playerMove.length === 2) {
    // coppies the array, and sorts the new one only.
    // I need to maintain the order in the original array
    let playerMoveSorted = [...playerMove];
    playerMoveSorted.sort();

    // the core function for checking IDs.
    // grabs the first and lost characters from the ID string, then stores in integer form in two separate varibles to work with.  This now gives us a mathmatical way to move around the tiles.
    let firstC = parseInt(playerMoveSorted[0].charAt(2));
    let firstR = parseInt(playerMoveSorted[0].charAt(0));
    let secondC = parseInt(playerMoveSorted[1].charAt(2));
    let secondR = parseInt(playerMoveSorted[1].charAt(0));

    //make sure the two selected tiles are two columns apart - and in the same row
    if (Math.abs(firstC - secondC) === 2 && firstR == secondR) {
      //checks the tile between the two selected
      let middleTile = secondR + "-" + (firstC + 1);

      if (
        document.getElementById(middleTile).getAttribute("class") == "tileEmpty"
      ) {
        //invalid move, pop out the second click and exit the function
        playerMove.pop();
        return;
      } else {
        //makes sure it is full, then runs removeTile- while passing the ID of each tile involved
        removeTile(playerMove[0], playerMove[1], middleTile);
      }
    } else if (Math.abs(firstR - secondR) === 2 && firstC == secondC) {
      //checks vertical
      let middleTile = firstR + 1 + "-" + secondC;

      if (
        document.getElementById(middleTile).getAttribute("class") == "tileEmpty"
      ) {
        playerMove.pop();
        return;
      } else {
        removeTile(playerMove[0], playerMove[1], middleTile);
      }
    } else {
      playerMove.pop();
    }
  }
}

function removeTile(first, second, middle) {
  //should only run if successfull checkMove

  //update the score
  score--;
  document.getElementById("score").innerText = score;

  // remove glow from both, and set empty on first and middle
  document.getElementById(first).setAttribute("class", "tileEmpty");
  document.getElementById(middle).setAttribute("class", "popped");
  document.getElementById(second).setAttribute("class", "tilePeg");

  // after the pop css class finishes animation, change it to tileEmpty
  // have to pass middle data through a variable, set timeout does not allow
  tempPop = middle;
  setTimeout(popped, 300);

  playerMove = [];
  setTimeout(remainingMoves, 300);
}

function popped() {
  document.getElementById(tempPop).setAttribute("class", "tileEmpty");
}

//----- stretch functions

function remainingMoves() {
  //get all the pegs on the board
  let pegsLeft = document.getElementsByClassName("tilePeg");
  // set foundMove to zero at the start of the turn.
  foundMove = 0;
  //loop through each, but exit out if a move is found. No need to check everything.
  for (i = 0; i < pegsLeft.length; i++) {
    // same method as before, break apart the Id into a column and a row integer
    let thisC = parseInt(pegsLeft[i].id.charAt(2));
    let thisR = parseInt(pegsLeft[i].id.charAt(0));

    // grabs a tile one over in each direction
    let left = document.getElementById(thisR + "-" + (thisC - 1));
    let right = document.getElementById(thisR + "-" + (thisC + 1));
    let up = document.getElementById(thisR - 1 + "-" + thisC);
    let down = document.getElementById(thisR + 1 + "-" + thisC);

    // grabs a tile two over in each direction
    let leftTwo = document.getElementById(thisR + "-" + (thisC - 2));
    let rightTwo = document.getElementById(thisR + "-" + (thisC + 2));
    let upTwo = document.getElementById(thisR - 2 + "-" + thisC);
    let downTwo = document.getElementById(thisR + 2 + "-" + thisC);

    // pass the directions and do the checking
    checkDirection(left, leftTwo);
    checkDirection(right, rightTwo);
    checkDirection(up, upTwo);
    checkDirection(down, downTwo);

    if (foundMove >= 1) {
      // the moment we find a move, exit out of this loop, saving processing
      return;
    }
  }
  // end of game function triggers here
  //lets check against lowest scores
  getScores();
}

function checkDirection(direction, directionTwo) {
  if (direction == null || directionTwo == null) {
    //this needs to be detected, so it doesn't try and pass through the else if
  } else if (
    document.getElementById(direction.id).getAttribute("class") == "tilePeg" &&
    document.getElementById(directionTwo.id).getAttribute("class") ==
      "tileEmpty"
  ) {
    console.log(" has a move to the", direction);
    foundMove = foundMove + 1;
  }
}

//----game over stuff, could split into a new file here
// have not refactored below this line.  This was all added the last day of project.

function gameOver() {
  // show the game over div
  let x = document.getElementsByClassName("gameGoing");
  x[0].setAttribute("class", "gameOver");

  document.getElementById("playAgain").addEventListener("click", removeBoard);
  document.getElementById("lowScore").addEventListener("click", lowScores);
}

function getScores() {
  // counts the pegs left on the board and updates it
  score = document.getElementsByClassName("tilePeg").length;

  document.getElementById("score").innerText = score;
  document.getElementById("final").innerText = "Pieces remaining: " + score;

  // Retrieve the object from localStorage
  retrievedScores = localStorage.getItem("scores");

  // parse string into an object
  scoresObject = JSON.parse(retrievedScores);

  //BUG - if this is null, we need to not sort, and start fresh
  // sort by lowest score
  keysSorted = Object.keys(scoresObject).sort(function (a, b) {
    return scoresObject[b] - scoresObject[a];
  });

  let z;
  let foundLowScore = 0;
  let c = 0;
  Object.keys(scoresObject).forEach(function (e) {
    z = scoresObject[e];
    console.log("z = ", z);
    c++;
    console.log("c:", c);
    if (score < z && foundLowScore === 0) {
      console.log("New low score");

      // input name for low score
      foundLowScore++;

      lowScores(1);
      inputScore();
      printScore(e + " " + scoresObject[e]);
      //pushes new high score on inputscore submit
    } else if (c == Object.keys(scoresObject).length) {
      console.log("no low scores found");
      gameOver();
    } else {
      console.log("score is not a lowscore");
      // gameOver()
      // print low scores
      printScore(e + " " + scoresObject[e]);

      console.log(Object.keys(scoresObject).length);
    }
  });
}

function lowScores(e) {
  console.log("lowscore", e);

  if (e != 1) {
    // hide the play again screen
    let x = document.getElementsByClassName("gameOver");
    x[0].setAttribute("class", "gameGoing");
  }

  //show low scores
  let y = document.getElementsByClassName("gameGoing2");
  y[0].setAttribute("class", "lowScoreScreen");

  //assign func to back button
  document.getElementById("back").addEventListener("click", back);
}

function back() {
  let y = document.getElementsByClassName("lowScoreScreen");
  y[0].setAttribute("class", "gameGoing2");
  gameOver();
}

function printScore(score) {
  let aScore = document.createElement("li");
  aScore.innerText = score;
  scoreBoard.appendChild(aScore);
}

function inputScore() {
  let aScore = document.createElement("li");
  aScore.setAttribute("Id", "lowScoreLi");
  aScore.innerHTML =
    "<input type='text' autofocus='true' placeholder='You set a new low score!' Id='lowScoreInput'>";
  scoreBoard.appendChild(aScore);
  document
    .getElementById("lowScoreInput")
    .addEventListener("keypress", function (e) {
      let key = e.which || e.keyCode;
      if (key === 13) {
        scoreBoard.removeChild(lowScoreLi);
        printScore(this.value + " " + score);
        newName = this.value;
        //push new high score.
        scoresObject[newName] = score;
        console.log(scoresObject);
        localStorage.setItem("scores", JSON.stringify(scoresObject));

        // stretch check length of local storage, then push one up, and pop one if over 5
      }
    });
}

function pushData() {
  localStorage.clear();

  let scores = { Justin: 23, Miguel: 10, Samantha: 8, Nathan: 3 };

  // Put the object into storage
  localStorage.setItem("scores", JSON.stringify(scores));
}
