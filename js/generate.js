String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

function ConvertOldRangeToNewRange(oldValue, oldMax, oldMin, newMax, newMin) {
	var oldRange = oldMax - oldMin
	var newRange = newMax - newMin
	var newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin
	return newValue
}

      function clearCanvas() {
         var canvas = document.getElementById("canvas");
         var context = canvas.getContext("2d");
         
         context.clearRect(0, 0, canvas.width, canvas.height);
      }

      function togglePixel(imageData, x, y, isOn) {
          index = (x + y * imageData.width) * 4;
          imageData.data[index+0] = isOn ? 0 : 255;
          imageData.data[index+1] = isOn ? 0 : 255;
          imageData.data[index+2] = isOn ? 0 : 255;
          imageData.data[index+3] = 255;
      }

      function drawCells(cells) {
         clearCanvas();
         var canvas = document.getElementById("canvas");
         var context = canvas.getContext("2d");
         var pixelData = context.createImageData(canvas.width, canvas.height);
         
         for (var i = 0; i < canvas.height; i++) {
            for (var j = 0; j < canvas.width; j++) {
               togglePixel(pixelData, i, j, cells[i][j]);
            }
         }
         context.putImageData(pixelData, 0, 0);
      }

      function makeArray(width, height) {
         var cells = new Array(height);
         for (var i = 0; i < height; i++) {
            cells[i] = new Array(width);
            for (var j = 0; j < width; j++) {
               cells[i][j] = 0;
            }
         }
         return cells;
      }

      function initializeCells(cells, width, height, cellSize) {
         for (var cellI = 0; cellI < height; cellI += cellSize) {
            for (var cellJ = 0; cellJ < width; cellJ += cellSize) {
               var on = Math.random() < 0.50;
               if (cellI == 0 || cellI >= height-cellSize || cellJ == 0 || cellJ >= width-cellSize) {
                  on = true;
               }
               
               for (var i = 0; i < cellSize; i++) {
                  for (var j = 0; j < cellSize; j++) {
                     cells[parseInt(cellI + i)][parseInt(cellJ + j)] = on ? 1 : 0;
                  }
               }
            }
         }
      }

	function applyAutomaton(cells, width, height, bornList, surviveList, numIterations) {
         var newCells = makeArray(width, height); 
         var cellSize = window.cellSize;
         while (numIterations-- > 0) {
            for (var cellRow = 0; cellRow < height; cellRow += cellSize) {
               for (var cellCol = 0; cellCol < width; cellCol += cellSize) {
                  var liveCondition;
                  if (cellRow == 0 || cellRow >= height-cellSize || cellCol == 0 || cellCol >= width-cellSize) {
                     liveCondition = true;
                  } else {
                     var nbhd = 0;
                     nbhd += cells[parseInt(cellRow-cellSize)][parseInt(cellCol-cellSize)];
                     nbhd += cells[parseInt(cellRow-cellSize)][parseInt(cellCol)];
                     nbhd += cells[parseInt(cellRow-cellSize)][parseInt(cellCol+cellSize)];
                     nbhd += cells[parseInt(cellRow)][parseInt(cellCol-cellSize)];
                     nbhd += cells[parseInt(cellRow)][parseInt(cellCol+cellSize)];
                     nbhd += cells[parseInt(cellRow+cellSize)][parseInt(cellCol-cellSize)];
                     nbhd += cells[parseInt(cellRow+cellSize)][parseInt(cellCol)];
                     nbhd += cells[parseInt(cellRow+cellSize)][parseInt(cellCol+cellSize)];
                     // apply B678/S345678
                     var currentState = cells[parseInt(cellRow)][parseInt(cellCol)];
                     var liveCondition = 
                        (currentState == 0 && bornList.indexOf(nbhd) > -1)|| 
                        (currentState == 1 && surviveList.indexOf(nbhd) > -1); 
                  }
                  for (var i = 0; i < cellSize; i++) {
                     for (var j = 0; j < cellSize; j++) {
                        newCells[parseInt(cellRow + i)][parseInt(cellCol + j)] = liveCondition ? 1 : 0;
                     }
                  }
               }
            }
         }
         
         for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
               cells[i][j] = newCells[i][j];
            }
         }
      }

$(document).ready(function () {
	// var height = 15
	// var width = 30
	var grid = []
	var runCount = 0
	var numWall = 0
	var numBlank = 0
	var numTotal = height * width
	noise.seed(Math.random())

	var canvas = document.getElementById("canvas");
    var width = canvas.width, height = canvas.height;
    var cells = makeArray(width, height);
    window.cellSize = width / 64;
    initializeCells(cells, width, height, window.cellSize);
    window.cells = cells;

    $("#filter").click(function () {
	    clearCanvas(cells);
	    applyAutomaton(cells, width, height, [6,7,8], [3,4,5,6,7,8], 5)
	    drawCells(cells);
    })

	// grid = initializeCells(grid, width, height, 1)

	// $(".main").append('<div id="init"></div>')
	// for (var x = 0; x < grid.length; x++) {
	// 	$("#init").append('<p>' + grid[x].toString().replaceAll(",", "").replaceAll("1", "#").replaceAll("0", ".") + '</p>')
	// }

	// grid = applyAutomaton(grid, width, height, [6,7,8], [3,4,5,6,7,8], 15)

	// $(".main").append('<hr><div id="after"></div>')
	// for (var x = 0; x < grid.length; x++) {
	// 	$("#after").append('<p>' + grid[x].toString().replaceAll(",", "").replaceAll("1", "#").replaceAll("0", ".") + '</p>')
	// }



	// for (var i = 0; i < height; i++) {
	// 	grid.push([])
	// 	for (var j = 0; j < width; j++) {
	// 		var nx = j/width - 0.5, ny = i/height - 0.5;
	// 		grid[i].push( Math.floor(Math.random() * 2) + 0 )
	// 		// grid[i].push( (0.25 * noise.simplex2(4 * nx, 4 * ny) >= 0) ? 1 : 0 )
	// 		// console.log(  )
	// 		// $("#main").append(grid[i][j])
	// 		if (grid[i][j] == 1) {
	// 			numWall++
	// 		} else if (grid[i][j] == 0) {
	// 			numBlank++
	// 		}
	// 	}
	// }

	// $(".main").append('<p>Run: ' + 0 + ' / ' + runCount)
	// $(".main").append('<p>Number of Walls: ' + numWall + ' or ' + ((numWall/numTotal)*100).toPrecision(4) + '%</p>')
	// $(".main").append('<p>Number of Blank: ' + numBlank + '</p>')
	// $(".main").append('<p>Number Total___: ' + numTotal + '</p>')
	// $(".main").append('<hr>')

	var iter = runCount
	while (iter > 0) {
		var total = 0
		for (var a = 0; a < height; a++) {
			for (var b = 0; b < width; b++) {
				var countAdj = 0

				for (var i = -1; i <= 1; i++) {
					for (var j = -1; j <= 1; j++) {
						if (a+i < height && a+i >= 0 && b+j < width && b+j >= 0 && grid[a+i][b+j] == 1) {
							countAdj++
						}
					}
				}
				// Conway's Game
				// if (countAdj == 3 && grid[a][b] == 0) {
				// 	total += 1
				// 	numWall += 1
				// 	numBlank -= 1
				// 	grid[a][b] = 1
				// } else if (countAdj > 3 && grid[a][b] == 1) {
				// 	total -= 1
				// 	numWall -= 1
				// 	numBlank += 1
				// 	grid[a][b] = 0
				// } else if (countAdj == 3 || countAdj == 2 && grid[a][b] == 1) {
				// 	grid[a][b] = 1
				// } else if (countAdj < 2 && grid[a][b] == 1) {
				// 	total -= 1
				// 	numWall -= 1
				// 	numBlank += 1
				// 	grid[a][b] = 0
				// }

				// B678/S345678
				if (countAdj >= 6 && grid[a][b] == 0) {
					total += 1
					numWall += 1
					numBlank -= 1
					grid[a][b] = 1
				} else if (countAdj >= 3 && grid[a][b] == 1) {

				} else {
					// total -= 1
					// numWall -= 1
					// numBlank += 1
					// grid[a][b] = 0
				}
			}
		}
		console.log(total)
		$(".main").append('<p>Run: ' + (runCount - iter + 1) + ' / ' + runCount)
		$(".main").append('<p>Number of Walls: ' + numWall + ' or ' + ((numWall/numTotal)*100).toPrecision(4) + '%</p>')
		$(".main").append('<p>Number of Blank: ' + numBlank + '</p>')
		$(".main").append('<p>Number Total___: ' + numTotal + '</p>')
		$(".main").append('<hr>')
		iter--
	}

	


})