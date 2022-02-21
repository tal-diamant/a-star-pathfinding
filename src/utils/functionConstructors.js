
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

	this.drawSelf = function (color) {
		ctx.beginPath();
		ctx.rect(this.positionX, this.positionY, this.dimensions, this.dimensions);
		ctx.fillStyle = color;
		if(this.wall) ctx.fillStyle = 'black';
		ctx.fill();
		ctx.stroke();
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
}