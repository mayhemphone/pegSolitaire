# Initial planning

A little back story, I made this game as a teenager in a visual basics class.  I wish I had my project still, so I could count the lines of code.  My goal remaking this was to come up with a simple algorithm to detect what moves are legit, without a ton of if statements for every single tile- like teenage me.  Spoiler alert: I did it!

# Design

I wanted to keep this game fairly minimalist.  There are no image assets, everything is HTML, CSS, and JavaScript.  I made the tile classes in CSS then used JavaScript to generate the board dynamically.

# Generating the board

I set variables at the start of the program to make the default board.  The interesting challenge was how to make such a funny shaped board, both layout and logic wise. I created 6 variables to achieve this.

    var rows
    var columns
    var exceptions = {
	    columnsFromLeft:
	    columnsFromRight:
    	rowsFromTop:
    	rowsFromBottom:
        }
        
The idea was to have the logic move through every tile on the board, but only drawing the ones needed, and assigning them a “row-column” Id.  I chose this over storing all of them in an array, because of how I wanted to do the move logic later.

First I draw the board, columns * tileSize, by columns * tileSize.

Then I start looping through rows.  When drawing a tile in a row, it loops from 0 to columns (7 to start).  It checks to make sure it isn’t within the exception zone, and it calls the drawTile function if not.  No matter what the current tile is in the row loop, it adds 1 to the tileColumn, then passes that along with left, top, row, peg.

Drawing a tile creates a div, assigns a few properties, including class, an Id and size/location properties, then appends it to the board div. The tiles are positioned absolutely within the game board, which flexes to the center of the window.

# Random boards

Because of the methodology used to draw the first board, random boards just needed random values generated for: Rows, Columns and Exceptions.  There were only a couple of issues I had, including getting a number generated within a tighter range, so it wouldn’t be taking way too big of a chunk out of the board due to the exceptions.  The first random boards generated were incredibly strange and random - but were unplayable.  The second problem I had was placing the starting empty tile, so the player could start playing. That took some extra math, limiting the range of the possible placements for each board.  Again, all done dynamically.

# Logic

My biggest goal of this project was to be able to detect if a move was valid in a simple, dry way.  When I was a teenager, I did this with a bazillion if statements, and I vowed to never do that again.  Adult me, made an algorithm for checking what the tile is next to it, and two away.  This was by far, my favorite part of the project, and what I was the most proud of.

The algorithm takes the Id (ex: “3-3”), grabs the first and last character of the string, then saves those into row and column, respectively.  Then I increment according to the direction I’m checking, and asks for the class of that Id.  If .getElementById(3-2) is null, we end the function, because there is no tile there - this is basically a border detection.  If there is a piece there, and it’s the correct kind, it moves to the next piece to check.  I re-use this methodology for checking remaining moves as well.

To detect when the game is over, I needed to see if any tiles on the board have a move available.  Fortunately, the logic to this was very similar to how I check to make a move.  I loop through every tile in the board, looking for a move to the left, right, up or down- then exit the loop upon finding the first move available.  By exiting the loop upon a find, we cut down processing power by quite a bit.

I was incredibly happy with how this logic turned out, because on the very first random board generated, everything still worked.  I didn’t have to change anything to play on new boards, all of the logic scaled perfectly.

# Low Scores

The Low Scores screen was a stretch goal I started on the final day of our project.  That got a little messy, and it’s the last source of bugs on the game.  When the game detects the player is out of moves it takes the current score, and checks it against the local storage scores.  If it is a low score it skips to the low scores screen, and provides a text box for name input, then prints out the other high scores.

### Future change: 
I want to take that name input, push it up to the localStorage, then pull it all down, sort and print out at the same time.  I’m currently having issues with it not finishing the list, or a score being in the wrong order.

# Known bugs

The score menu throws an error when moving back to the game over screen.  This is likely just calling a function out of order, since it was all an afterthought.  With another few hours, I could probably find and fix.  The error is in the console, nothing on screen shows something has gone wrong.
