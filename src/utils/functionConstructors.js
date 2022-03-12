
//Grid creation function (x by x)
export function Array2d(dimensions) {
	const arr = new Array(dimensions);
	for(let i = 0; i < arr.length; i++) {
		arr[i] = new Array(dimensions);
	}
	return arr;
}

//Grid cell object
export function Cell(x, y, ctx, canvas, gridDimensions) {
	this.x = x;
	this.y = y;
	this.wayFromStart = 0;
	this.wayToEnd = 0;
	this.wayTotal = 0;
	this.previous = null;
	this.dimensions = 20;
	this.neighbors = [];
	this.wall = false;
    this.ctx = ctx;
    this.gridStartX = canvas.width / 2 - gridDimensions * this.dimensions / 2;
	this.gridStartY = canvas.height / 2 - gridDimensions * this.dimensions / 2;
	this.positionX = this.x * this.dimensions + this.gridStartX;
	this.positionY = this.y * this.dimensions + this.gridStartY;

	if(Math.random() < 0.3) this.wall = true;

	this.drawSelf = function (color, hover) {
		ctx.beginPath();
		ctx.rect(this.positionX, this.positionY, this.dimensions, this.dimensions);
		ctx.fillStyle = color;
		if(this.wall) ctx.fillStyle = 'black';
		ctx.fill();
		ctx.stroke();
		if(hover) {
			ctx.fillStyle = "rgba(255,255,255,0.35)";
			ctx.fill();
			ctx.stroke();
		}
		ctx.closePath();
	}

	this.findNeighbors = function(grid) {
		const x = this.x;
		const y = this.y;
        const gridDimensions = grid.length;

		if(x < gridDimensions - 1)
			this.neighbors.push(grid[y][x + 1]);
		if(x > 0)
			this.neighbors.push(grid[y][x - 1]);
		if(y < gridDimensions - 1)
			this.neighbors.push(grid[y + 1][x]);
		if(y > 0)
			this.neighbors.push(grid[y - 1][x]);
	}

	this.isPointInside = function(x,y) {
		return (
			x > this.positionX &&
			x < this.positionX + this.dimensions &&
			y > this.positionY &&
			y < this.positionY + this.dimensions
		)
	}

	this.setWall = function(wall) {
		this.wall = wall;
	}
}

//free cell (not in a grid)
export function FreeCell(x, y, ctx, canvas, type) {
	this.x = x;
	this.y = y;
	this.dimensions = 20;
    this.ctx = ctx;
	this.type = type;
	
	switch(this.type) {
		case 'empty':
			this.color = "white"
			break;
		case 'start':
			this.color = '#3f3';
			break;
		case 'end':
			this.color = 'red';
			break;
		case 'wall':
			this.color = 'black';
			break;
		default:
			this.color = 'lightgray';
			break;
	}

	this.drawSelf = function (hover) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.dimensions, this.dimensions);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();
		if(hover) {
			ctx.fillStyle = "rgba(255,255,255,0.35)";
			ctx.fill();
			ctx.stroke();
		}
		ctx.closePath();
	}

	this.isPointInside = function(x,y) {
		return (
			x > this.x &&
			x < this.x + this.dimensions &&
			y > this.y &&
			y < this.y + this.dimensions
		)
	}

	this.getType = function() {
		return this.type;
	}

	this.setType = function(type) {
		this.type = type;
		switch(this.type) {
			case 'empty':
				this.color = "white"
				break;
			case 'start':
				this.color = '#3f3';
				break;
			case 'end':
				this.color = 'red';
				break;
			case 'wall':
				this.color = 'black';
				break;
			default:
				this.color = 'lightgray';
				break;
		}
	}
}