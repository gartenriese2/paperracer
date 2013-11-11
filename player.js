function Player(x, y) {

	this.position = new Point();
	this.position.add(x, y);
	this.speed = new Point();
	this.futures = [];

}

Player.prototype.move = function(x, y) {
	
	this.position.add(x, y);
	this.speed.x = x;
	this.speed.y = y;
	this.futures = this.calculateFuturePositions();

}

Player.prototype.getPosition = function() {

	return this.position;

}

Player.prototype.setPosition = function(pnt) {
	
	this.position = pnt;

}

Player.prototype.getPixelPosition = function() {
	
	var pos = new Point(this.position);
	pos.mul(gridSize);
	return pos;

}

Player.prototype.setPixelPosition = function(pnt) {
	
	pnt.snapToGrid();
	this.position = pnt.div(gridSize);

}

Player.prototype.getSpeed = function() {

	return this.speed;
	
}

Player.prototype.getFutures = function() {
	
	return this.futures;

}

Player.prototype.getPixelFutures = function() {
	
	var arr = [];

	for (var i = 0; i < this.getFutures().length; ++i) {

		var f = new Point(this.getFutures()[i]);
		f.mul(gridSize);
		arr.push(f);

	}
	
	return arr;

}

Player.prototype.calculateFuturePositions = function() {
	
	var pts = [];

	// start
	if (this.speed.x == 0 && this.speed.y == 0) {

		var p1 = new Point(this.position.x + 1, this.position.y - 1);
		var p2 = new Point(this.position.x + 1, this.position.y);
		var p3 = new Point(this.position.x + 1, this.position.y + 1);
		pts.push(p1);
		pts.push(p2);
		pts.push(p3);

	} else if (Math.abs(this.speed.x) <= 1 && Math.abs(this.speed.y) <= 1) {

		if (Math.abs(this.speed.x) == 1 && Math.abs(this.speed.y) == 1) {

			var p1 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y);
			var p2 = new Point(this.position.x + 2*this.speed.x, this.position.y + 2*this.speed.y);
			var p3 = new Point(this.position.x + 2*this.speed.x, this.position.y + this.speed.y);
			var p4 = new Point(this.position.x + this.speed.x, this.position.y + 2*this.speed.y);
			var p5 = new Point(this.position.x + 2*this.speed.x, this.position.y);
			var p6 = new Point(this.position.x, this.position.y + 2*this.speed.y);
			var p7 = new Point(this.position.x + this.speed.x, this.position.y);
			var p8 = new Point(this.position.x, this.position.y + this.speed.y);
			pts.push(p1);
			pts.push(p2);
			pts.push(p3);
			pts.push(p4);
			pts.push(p5);
			pts.push(p6);
			pts.push(p7);
			pts.push(p8);

		} else {

			var p1 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y);
			var p2 = new Point(this.position.x + 2*this.speed.x, this.position.y + 2*this.speed.y);
			pts.push(p1);
			pts.push(p2);

			if (this.speed.x == 0) {
				
				var p3 = new Point(this.position.x + 1, this.position.y + this.speed.y);
				var p4 = new Point(this.position.x + 1, this.position.y + 2*this.speed.y);
				var p5 = new Point(this.position.x - 1, this.position.y + this.speed.y);
				var p6 = new Point(this.position.x - 1, this.position.y + 2*this.speed.y);
				
				pts.push(p3);
				pts.push(p4);
				pts.push(p5);
				pts.push(p6);

			} else {

				var p3 = new Point(this.position.x + 2*this.speed.x, this.position.y + 1);
				var p4 = new Point(this.position.x + this.speed.x, this.position.y + 1);
				var p5 = new Point(this.position.x + 2*this.speed.x, this.position.y - 1);
				var p6 = new Point(this.position.x + this.speed.x, this.position.y - 1);
				
				pts.push(p3);
				pts.push(p4);
				pts.push(p5);
				pts.push(p6);

			}

		}	

	} else if (Math.abs(this.speed.x) == 5 || Math.abs(this.speed.y) == 5) {

		if (Math.abs(this.speed.x) == 5 && Math.abs(this.speed.y) == 5) {

			var p1 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y);
			var p2 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y - (this.speed.y / 5));
			var p3 = new Point(this.position.x + this.speed.x - (this.speed.x / 5), this.position.y + this.speed.y);
			var p4 = new Point(this.position.x + this.speed.x - (this.speed.x / 5), this.position.y + this.speed.y - (this.speed.y / 5));
			pts.push(p1);
			pts.push(p2);
			pts.push(p3);
			pts.push(p4);

		} else if (Math.abs(this.speed.x) == 5) {

			var p1 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y);
			var p2 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y + 1);
			var p3 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y - 1);
			var p4 = new Point(this.position.x + this.speed.x - (this.speed.x / 5), this.position.y + this.speed.y);
			var p5 = new Point(this.position.x + this.speed.x - (this.speed.x / 5), this.position.y + this.speed.y + 1);
			var p6 = new Point(this.position.x + this.speed.x - (this.speed.x / 5), this.position.y + this.speed.y - 1);
			pts.push(p1);
			pts.push(p2);
			pts.push(p3);
			pts.push(p4);
			pts.push(p5);
			pts.push(p6);

		} else {

			var p1 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y);
			var p2 = new Point(this.position.x + this.speed.x + 1, this.position.y + this.speed.y);
			var p3 = new Point(this.position.x + this.speed.x - 1, this.position.y + this.speed.y);
			var p4 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y - (this.speed.y / 5));
			var p5 = new Point(this.position.x + this.speed.x + 1, this.position.y + this.speed.y - (this.speed.y / 5));
			var p6 = new Point(this.position.x + this.speed.x - 1, this.position.y + this.speed.y - (this.speed.y / 5));
			pts.push(p1);
			pts.push(p2);
			pts.push(p3);
			pts.push(p4);
			pts.push(p5);
			pts.push(p6);

		}

	} else {

		var p1 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y);
		var p2 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y + 1);
		var p3 = new Point(this.position.x + this.speed.x, this.position.y + this.speed.y - 1);
		var p4 = new Point(this.position.x + this.speed.x + 1, this.position.y + this.speed.y);
		var p5 = new Point(this.position.x + this.speed.x + 1, this.position.y + this.speed.y + 1);
		var p6 = new Point(this.position.x + this.speed.x + 1, this.position.y + this.speed.y - 1);
		var p7 = new Point(this.position.x + this.speed.x - 1, this.position.y + this.speed.y);
		var p8 = new Point(this.position.x + this.speed.x - 1, this.position.y + this.speed.y + 1);
		var p9 = new Point(this.position.x + this.speed.x - 1, this.position.y + this.speed.y - 1);
		pts.push(p1);
		pts.push(p2);
		pts.push(p3);
		pts.push(p4);
		pts.push(p5);
		pts.push(p6);
		pts.push(p7);
		pts.push(p8);
		pts.push(p9);
		
	}

	return pts;

}

Player.prototype.draw = function(ctx, col) {
	
	ctx.fillStyle = col;
	var pixPos = this.getPixelPosition();
	ctx.fillRect(pixPos.x - 6, pixPos.y - 3, 12, 6);

}

Player.prototype.drawFutures = function() {
	
	for (var i = 0; i < this.futures.length; ++i) {

		var pixFut = new Point(this.futures[i]);
		pixFut.mul(gridSize);
		pixFut.draw(context, "#ff0000");

	}

}