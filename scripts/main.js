var size;
var number_of_mines;

function Board(board_size, mines){
	size = board_size;
	number_of_mines = mines;
	this.cells = [];
	this.mine_locations = [];
	this.flag_counter = 0;
	this.generateBoard();
	this.generateMines();
	this.generateNumbers();
}

function Cell (location){
	this.location = location;
	this.counter = 0;
	this.mine = false;
	this.state = 0;
	this.flagged_state = 0;
}

Board.prototype.generateBoard = function(){
	$('#board').css("width",18*size);
	$('#board').css("height",18*size);

	for(i=0;i<size;i++){
		for(j=0;j<size;j++){
			loc = integerLocation([i,j]);
			$("#board").append(`<div class = cell id = c${loc}></div>`);
			var cell = new Cell([i,j]);
			this.cells.push(cell);
		}
	$("#board").append("<br>");
	}
}

Board.prototype.generateMines = function(){
	var random_number;
	var counter = 0;
	while(counter<number_of_mines){
		random_number = Math.floor(Math.random() * size * size);
		var cell = this.cells[random_number]
		if(cell.mine == false){
			cell.mine = true;
			cell.state = -1;
			cell.counter = -1*size;
			this.mine_locations.push(cell.location);
			cell_loc_int = integerLocation([cell.location[0],cell.location[1]]);
			//$(`#c${cell_loc_int}`).css("background-color", "red");
			counter ++;
		}	
	}
}

Board.prototype.generateNumbers = function(){
	for(i=0;i<number_of_mines;i++){
		x = this.mine_locations[i][0];
		y = this.mine_locations[i][1];

		if(x>0 && y>0){
			this.cells[integerLocation([x-1,y-1])].counter++;
		}
		if(x>0){
			this.cells[integerLocation([x-1,y])].counter++;
		}
		if(x>0 && y<size-1){
			this.cells[integerLocation([x-1,y+1])].counter++;
		}
		if(y>0){
			this.cells[integerLocation([x,y-1])].counter++;
		}
		if(y<size-1){
			this.cells[integerLocation([x,y+1])].counter++;
		}
		if(x<size-1 && y>0){
			this.cells[integerLocation([x+1,y-1])].counter++;
		}
		if(x<size-1){
			this.cells[integerLocation([x+1,y])].counter++;
		}
		if(x<size-1 && y<size-1){
			this.cells[integerLocation([x+1,y+1])].counter++;
		}
	}
}

Board.prototype.displayNumbers = function(){
	for(i=0;i<this.cells.length;i++){
		counter = this.cells[i].counter
		if(this.cells[i].mine == true){
			$(`#c${i}`).empty();
			$(`#c${i}`).removeClass('bg-flag');
			$(`#c${i}`).addClass('bg-mine');
		} else if(this.cells[i].state == 0){
			$(`#c${i}`).empty();
			$(`#c${i}`).removeClass('bg-flag');
			$(`#c${i}`).css('background-color','white');
			if(counter!==0){
				$(`#c${i}`).append(counter);
			}
		}
	}
}

Board.prototype.uncover = function(location){
	cell = this.cells[location];
	if(cell.flagged_state == 1){
		return;
	}
	if(cell.mine == true){
		this.gameOver();
	} 
	else if(cell.state == 0){
		cell.state = 1;
		var x = cell.location[0]; 
		var y = cell.location[1];
		$(`#c${location}`).css('background-color', 'white');
		if(cell.counter!==0){
			$(`#c${location}`).append(cell.counter);
		}

		if(cell.counter == 0){
			if(x>0 && y>0){
				this.uncover(integerLocation([x-1,y-1])); 
			} 
			if(x>0){
				this.uncover(integerLocation([x-1,y]));
			}
			if(x>0 && y<size-1){
				this.uncover(integerLocation([x-1,y+1])); 
			}
			if(y>0){
				this.uncover(integerLocation([x,y-1])); 
			}
			if(y<size-1){
				this.uncover(integerLocation([x,y+1]));			
			}
			if(x<size-1 && y>0){
				this.uncover(integerLocation([x+1,y-1]));				
			}
			if(x<size-1){
				this.uncover(integerLocation([x+1,y]));			
			}
			if(x<size-1 && y<size-1){
				this.uncover(integerLocation([x+1,y+1]));
			}
		}
	} 
	if(this.checkWin()==true){
		this.youWon();
	}
}

Board.prototype.gameOver = function(){
	this.displayNumbers();
	$('#selection').css('background-color','red');
	$('#selection').slideDown();
	$('#message').text('Dude...you lost!');
	$('.cell').off('mousedown');
}

Board.prototype.checkWin = function(){
	var uncovered_counter = 0;
	for(i=0;i<this.cells.length;i++){
		if(this.cells[i].state==1){
			uncovered_counter++;
		}
	}
	if(size**2 - uncovered_counter == number_of_mines){
		return true;
	} else{
		return false;
	}
}

Board.prototype.youWon = function(){
	this.displayNumbers();
	$('#selection').css('background-color','green');
	$('#selection').slideDown();
	$('#message').text('Dude! You won!');
	$('.cell').off('mousedown');
}

Board.prototype.placeFlag = function(location){
	cell = this.cells[location];

	if(this.flag_counter<number_of_mines && cell.flagged_state == 0 && cell.state !==1){
		$(`#c${location}`).addClass('bg-flag');
		this.flag_counter++;
		cell.flagged_state = 1;
	}

	else if(cell.flagged_state==1){
		$(`#c${location}`).removeClass('bg-flag');
		this.flag_counter--;
		cell.flagged_state = 0;
	}
}

restartGame = function(){
	$('#board').empty();
}

Board.prototype.playGame = function(){
	$('#selection').slideUp();
	$('.cell').mousedown(function(event){
		id = $(this).attr('id');
		loc = id.substring(1,id.length);
		switch (event.which){
			case 1:
				board.uncover(loc);
				break;
			case 3:
				board.placeFlag(loc);
				break;
		}
	});
}


//Helper Functions

integerLocation = function(array_location){
	return array_location[0]*size+array_location[1];
}


$(document).ready(function(){
	$('#beginner').click(function(){
		restartGame();
		board = new Board(9,10);
		board.playGame();
	});

	$('#intermediate').click(function(){
		restartGame();
		board = new Board(15,40);
		board.playGame();
	});

	$('#expert').click(function(){
		restartGame();
		board = new Board(20,99);
		board.playGame();
	});
	

	$('#directions-button').click(function(){
		$('#directions').toggle('slow');
	});


	$('.cell').on('selectstart', function (event) {
    	event.preventDefault();
	});
});




