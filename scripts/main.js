var size;

function Board(board_size){
	size = board_size;
	this.cells = [];
	this.mine_locations = [];
	this.generateBoard();
	this.generateMines();
	this.generateNumbers();
}

function Cell (location){
	this.location = location;
	this.counter = 0;
	this.mine = false;
	this.state = 0;
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
	while(counter<size){
		random_number = Math.floor(Math.random() * size * size);
		var cell = this.cells[random_number]
		if(cell.mine == false){
			cell.mine = true;
			cell.state = -1;
			cell.counter = -10;
			this.mine_locations.push(cell.location);
			cell_loc_int = integerLocation([cell.location[0],cell.location[1]]);
			//$(`#c${cell_loc_int}`).css("background-color", "red");
			counter ++;
		}	
	}
}

Board.prototype.generateNumbers = function(){
	for(i=0;i<size;i++){
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

//Board.prototype.displayNumbers = function(){
//	for(i=0;i<this.cells.length;i++){
//		counter = this.cells[i].counter
//		if(this.cells[i].mine == true){
//			$(`#c${i}`).append('X');
//		} else{
//		$(`#c${i}`).append(counter);
//		}
//	}
//}

Board.prototype.uncover = function(location){
	cell = this.cells[location];
	if(cell.state == 0){
		console.log('in here');
		cell.state = 1;
		var x = cell.location[0]; 
		var y = cell.location[1];
		$(`#c${location}`).css('background-color', 'white');
		$(`#c${location}`).append(cell.counter);

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
}




//Helper Functions

integerLocation = function(array_location){
	return array_location[0]*size+array_location[1];
}



$(document).ready(function(){
	board = new Board(9);

	$('.cell').click(function(){
		id = $(this).attr('id');
		loc = id.substring(1,id.length);
		board.uncover(loc);
	});
});